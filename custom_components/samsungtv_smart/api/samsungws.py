"""
SamsungTVWS - Samsung Smart TV WS API wrapper

Copyright (C) 2019 Xchwarze
Copyright (C) 2020 Ollo69

    This library is free software; you can redistribute it and/or
    modify it under the terms of the GNU Lesser General Public
    License as published by the Free Software Foundation; either
    version 2.1 of the License, or (at your option) any later version.

    This library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
    Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public
    License along with this library; if not, write to the Free Software
    Foundation, Inc., 51 Franklin Street, Fifth Floor,
    Boston, MA  02110-1335  USA

"""
import base64
import json
import logging
import re
import requests
import ssl
import subprocess
import sys
import time
import uuid
import websocket
from datetime import datetime
from enum import Enum
from threading import Thread, Lock
from yarl import URL
from . import exceptions
from . import shortcuts


PING_MATCHER = re.compile(
    r"(?P<min>\d+.\d+)\/(?P<avg>\d+.\d+)\/(?P<max>\d+.\d+)\/(?P<mdev>\d+.\d+)"
)

PING_MATCHER_BUSYBOX = re.compile(
    r"(?P<min>\d+.\d+)\/(?P<avg>\d+.\d+)\/(?P<max>\d+.\d+)"
)

WIN32_PING_MATCHER = re.compile(r"(?P<min>\d+)ms.+(?P<max>\d+)ms.+(?P<avg>\d+)ms")

MIN_APP_SCAN_INTERVAL = 10
MAX_WS_PING_INTERVAL = 10
_LOGGING = logging.getLogger(__name__)


def gen_uuid():
    return str(uuid.uuid4())


class App:
    def __init__(self, app_id, app_name, app_type):
        self.app_id = app_id
        self.app_name = app_name
        self.app_type = app_type


class ArtModeStatus(Enum):
    Unsupported = 0
    Unavailable = 1
    Off = 2
    On = 3


class Ping:
    """The Class for handling the data retrieval."""

    def __init__(self, host, count):
        """Initialize the data object."""
        self._ip_address = host
        self._count = count
        self.available = False

        if sys.platform == "win32":
            self._ping_cmd = [
                "ping",
                "-n",
                str(self._count),
                "-w",
                "2000",
                self._ip_address,
            ]
        else:
            self._ping_cmd = [
                "ping",
                "-n",
                "-q",
                "-c",
                str(self._count),
                "-W2",
                self._ip_address,
            ]

    def ping(self):
        """Send ICMP echo request and return details if success."""
        pinger = subprocess.Popen(
            self._ping_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE
        )
        try:
            out = pinger.communicate()
            _LOGGING.debug("Output is %s", str(out))
            if sys.platform == "win32":
                match = WIN32_PING_MATCHER.search(str(out).split("\n")[-1])
                rtt_min, rtt_avg, rtt_max = match.groups()
            elif "max/" not in str(out):
                match = PING_MATCHER_BUSYBOX.search(str(out).split("\n")[-1])
                rtt_min, rtt_avg, rtt_max = match.groups()
            else:
                match = PING_MATCHER.search(str(out).split("\n")[-1])
                rtt_min, rtt_avg, rtt_max, rtt_mdev = match.groups()
            return True
        except (subprocess.CalledProcessError, AttributeError):
            return False


class SamsungTVWS:

    _WS_ENDPOINT_REMOTE_CONTROL = "/api/v2/channels/samsung.remote.control"
    _WS_ENDPOINT_APP_CONTROL = "/api/v2"
    _WS_ENDPOINT_ART = "/api/v2/channels/com.samsung.art-app"

    _REST_URL_FORMAT = "http://{host}:8001/api/v2/{append}"

    def __init__(
        self,
        host,
        token=None,
        token_file=None,
        port=8001,
        timeout=None,
        key_press_delay=1,
        name="SamsungTvRemote",
        app_list=None,
    ):
        self.host = host
        self.token = token
        self.token_file = token_file
        self.port = port
        self.timeout = None if timeout == 0 else timeout
        self.key_press_delay = key_press_delay
        self.name = name
        self.connection = None
        self._app_list = app_list
        self._artmode_status = ArtModeStatus.Unsupported
        self._power_on_requested = False
        self._power_on_requested_time = datetime.min

        self._installed_app = {}
        self._running_app = None
        self._sync_lock = Lock()
        self._last_app_scan = datetime.min
        self._last_ping = datetime.min
        self._is_connected = False

        self._ws_remote = None
        self._client_remote = None

        self._ws_control = None
        self._client_control = None

        self._ws_art = None
        self._client_art = None
        self._client_art_supported = 2

        self._ping = Ping(self.host, 1)

    def __enter__(self):
        return self

    def __exit__(self, type, value, traceback):
        self.close()

    def _serialize_string(self, string):
        if isinstance(string, str):
            string = str.encode(string)

        return base64.b64encode(string).decode("utf-8")

    def _is_ssl_connection(self):
        return self.port == 8002

    def _format_websocket_url(self, path, is_ssl=False, use_token=True):
        scheme = "wss" if is_ssl else "ws"
        if is_ssl and use_token:
            token = self._get_token()
        else:
            token = ""

        new_uri = URL.build(
            scheme=scheme,
            host=self.host,
            port=self.port,
            path=path,
            query={"name": self._serialize_string(self.name)}
        )

        if token:
            return str(new_uri.update_query({"token": token}))
        return str(new_uri)

    def _format_rest_url(self, append=""):
        params = {
            "host": self.host,
            "append": append,
        }

        return self._REST_URL_FORMAT.format(**params)

    def _get_token(self):
        if self.token_file is not None:
            try:
                with open(self.token_file, "r") as token_file:
                    return token_file.readline()
            except:
                return ""
        else:
            return self.token

    def _set_token(self, token):
        _LOGGING.info("New token %s", token)
        if self.token_file is not None:
            _LOGGING.debug("Save token to file", token)
            with open(self.token_file, "w") as token_file:
                token_file.write(token)
        else:
            self.token = token

    def _ws_send(self, command, key_press_delay=None, *, use_control=False, ws_socket=None):
        using_remote = False
        if not use_control:
            if self._ws_remote:
                connection = self._ws_remote
                using_remote = True
            else:
                connection = self.open()
        elif ws_socket:
            connection = ws_socket
        else:
            return

        payload = json.dumps(command)
        connection.send(payload)
        if using_remote:
            # we consider a message sent valid as a ping
            self._last_ping = datetime.now()

        if key_press_delay is None:
            time.sleep(self.key_press_delay)
        elif key_press_delay > 0:
            time.sleep(key_press_delay)

    def _rest_request(self, target, method="GET"):
        url = self._format_rest_url(target)
        try:
            if method == "POST":
                return requests.post(url, timeout=self.timeout)
            elif method == "PUT":
                return requests.put(url, timeout=self.timeout)
            elif method == "DELETE":
                return requests.delete(url, timeout=self.timeout)
            else:
                return requests.get(url, timeout=self.timeout)
        except requests.ConnectionError:
            raise exceptions.HttpApiError(
                "TV unreachable or feature not supported on this model."
            )

    def _process_api_response(self, response):
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            _LOGGING.debug(
                "Failed to parse response from TV. response text: %s", response
            )
            raise exceptions.ResponseError(
                "Failed to parse response from TV. Maybe feature not supported on this model"
            )

    def _client_remote_thread(self):
        if self._ws_remote:
            return

        is_ssl = self._is_ssl_connection()
        url = self._format_websocket_url(
            self._WS_ENDPOINT_REMOTE_CONTROL,
            is_ssl=is_ssl
        )
        sslopt = {"cert_reqs": ssl.CERT_NONE} if is_ssl else {}

        self._ws_remote = websocket.WebSocketApp(
            url,
            on_message=self._on_message_remote,
            on_ping=self._on_ping_remote,
        )
        _LOGGING.debug("Thread SamsungRemote started")
        # we set ping interval (1 hour) only to enable multi-threading mode
        # on socket. TV do not answer to ping but send ping to client
        self._ws_remote.run_forever(
            sslopt=sslopt, ping_interval=3600, ping_timeout=2
        )
        self._is_connected = False
        if self._ws_art:
            self._ws_art.close()
        if self._ws_control:
            self._ws_control.close()
        self._ws_remote.close()
        self._ws_remote = None
        _LOGGING.debug("Thread SamsungRemote terminated")

    def _on_ping_remote(self, payload):
        _LOGGING.debug("Received ping %s, sending pong", payload)
        self._last_ping = datetime.now()
        if self._ws_remote.sock:
            try:
                self._ws_remote.sock.pong(payload)
            except Exception as ex:
                _LOGGING.warning("send_pong failed: {}".format(ex))

    def _on_message_remote(self, message):
        response = self._process_api_response(message)
        _LOGGING.debug(response)
        event = response.get("event")
        if not event:
            return

        # we consider a message valid as a ping
        self._last_ping = datetime.now()

        if event == "ms.channel.connect":
            _LOGGING.debug("Message remote: received connect")
            if response.get("data") and response.get("data").get("token"):
                token = response.get("data").get("token")
                _LOGGING.debug("Got token %s", token)
                self._set_token(token)
            self._is_connected = True
            self._request_apps_list()
        elif event == "ed.installedApp.get":
            _LOGGING.debug("Message remote: received installedApp")
            self._handle_installed_app(response)
            self.start_client(start_all=True)
        elif event == "ed.edenTV.update":
            _LOGGING.debug("Message remote: received edenTV")
            self.get_running_app(force_scan=True)

    def _request_apps_list(self):
        _LOGGING.debug("Request app list")
        self._ws_send(
            {
                "method": "ms.channel.emit",
                "params": {"event": "ed.installedApp.get", "to": "host"},
            },
            key_press_delay=0,
        )

    def _handle_installed_app(self, response):
        list_app = response.get("data", {}).get("data")
        installed_app = {}
        for app_info in list_app:
            app_id = app_info["appId"]
            _LOGGING.debug("Found app: %s", app_id)
            app = App(app_id, app_info["name"], app_info["app_type"])
            installed_app[app_id] = app
        self._installed_app = installed_app

    def _client_control_thread(self):
        if self._ws_control:
            return

        is_ssl = self._is_ssl_connection()
        url = self._format_websocket_url(
            self._WS_ENDPOINT_APP_CONTROL,
            is_ssl=is_ssl,
            use_token=False
        )
        sslopt = {"cert_reqs": ssl.CERT_NONE} if is_ssl else {}

        self._ws_control = websocket.WebSocketApp(
            url,
            on_message=self._on_message_control,
        )
        _LOGGING.debug("Thread SamsungControl started")
        self._ws_control.run_forever(sslopt=sslopt)
        self._ws_control.close()
        self._ws_control = None
        _LOGGING.debug("Thread SamsungControl terminated")

    def _on_message_control(self, message):
        response = self._process_api_response(message)
        _LOGGING.debug(response)
        result = response.get("result")
        if result:
            self._set_running_app(response)
            return
        event = response.get("event")
        if not event:
            return
        if event == "ms.channel.connect":
            _LOGGING.debug("Message control: received connect")
            self.get_running_app()

    def _set_running_app(self, response):
        app_id = response.get("id")
        if not app_id:
            return
        result = response.get("result")
        if result is None:
            return
        elif isinstance(result, bool):
            is_running = result
        else:
            is_running = result.get("visible")
        if is_running is None:
            return

        if self._running_app:
            if is_running and app_id != self._running_app:
                _LOGGING.debug("app running: %s", app_id)
                self._running_app = app_id
            elif not is_running and app_id == self._running_app:
                _LOGGING.debug("app stopped: %s", app_id)
                self._running_app = None
        elif is_running:
            _LOGGING.debug("app running: %s", app_id)
            self._running_app = app_id

    def _get_app_status(self, app_id, app_type):
        _LOGGING.debug("Get app status")
        if app_type == 4:
            method = "ms.webapplication.get"
        else:
            method = "ms.application.get"
        self._ws_send(
            {
                "id": app_id,
                "method": method,
                "params": {"id": app_id},
            },
            key_press_delay=0,
            use_control=True,
            ws_socket=self._ws_control,
        )

    def _client_art_thread(self):
        if self._ws_art:
            return

        is_ssl = self._is_ssl_connection()
        url = self._format_websocket_url(
            self._WS_ENDPOINT_ART,
            is_ssl=is_ssl,
            use_token=False
        )
        sslopt = {"cert_reqs": ssl.CERT_NONE} if is_ssl else {}

        self._ws_art = websocket.WebSocketApp(
            url,
            on_message=self._on_message_art,
        )
        _LOGGING.debug("Thread SamsungArt started")
        self._ws_art.run_forever(sslopt=sslopt)
        self._ws_art.close()
        self._ws_art = None
        _LOGGING.debug("Thread SamsungArt terminated")

    def _on_message_art(self, message):
        response = self._process_api_response(message)
        _LOGGING.debug(response)
        event = response.get("event")
        if not event:
            return
        if event == "ms.channel.connect":
            _LOGGING.debug("Message art: received connect")
            self._client_art_supported = 1
        elif event == "ms.channel.ready":
            _LOGGING.debug("Message art: channel ready")
            self._get_artmode_status()
        elif event == "d2d_service_message":
            _LOGGING.debug("Message art: d2d message")
            self._handle_artmode_status(response)

    def _get_artmode_status(self):
        _LOGGING.debug("Sending get_art_status")
        msg_data = {
            "request": "get_artmode_status",
            "id": gen_uuid(),
        }
        self._ws_send(
            {
                "method": "ms.channel.emit",
                "params": {
                    "data": json.dumps(msg_data),
                    "to": "host",
                    "event": "art_app_request",
                },
            },
            key_press_delay=0,
            use_control=True,
            ws_socket=self._ws_art,
        )

    def _handle_artmode_status(self, response):
        data_str = response.get("data")
        if not data_str:
            return
        data = self._process_api_response(data_str)
        event = data.get("event", "")
        if event == "art_mode_changed":
            status = data.get("status", "")
            if status == "on":
                artmode_status = ArtModeStatus.On
            else:
                artmode_status = ArtModeStatus.Off
        elif event == "artmode_status":
            value = data.get("value", "")
            if value == "on":
                artmode_status = ArtModeStatus.On
            else:
                artmode_status = ArtModeStatus.Off
        elif event == "go_to_standby":
            artmode_status = ArtModeStatus.Unavailable
        elif event == "wakeup":
            self._get_artmode_status()
            return
        else:
            # Unknown message
            return

        if self._power_on_requested and artmode_status != ArtModeStatus.Unavailable:
            if artmode_status == ArtModeStatus.On:
                self.send_key("KEY_POWER", key_press_delay=0)
            self._power_on_requested = False

        self._artmode_status = artmode_status

    @property
    def is_connected(self):
        return self._is_connected

    @property
    def artmode_status(self):
        return self._artmode_status

    @property
    def installed_app(self):
        return self._installed_app

    @property
    def running_app(self):
        return self._running_app

    def ping_device(self):
        result = self._ping.ping()
        # check ws ping/pong
        call_time = datetime.now()
        if result and self._ws_remote:
            difference = (call_time - self._last_ping).total_seconds()
            result = difference < MAX_WS_PING_INTERVAL

        if not result:
            self.stop_client()
            if self._artmode_status != ArtModeStatus.Unsupported:
                self._artmode_status = ArtModeStatus.Unavailable

        if self._power_on_requested:
            difference = (call_time - self._power_on_requested_time).total_seconds()
            if difference > 20:
                self._power_on_requested = False

        return result

    def set_power_on_request(self):
        self._power_on_requested = True
        self._power_on_requested_time = datetime.now()

    def get_running_app(self, *, force_scan=False):

        if not self._ws_control:
            return

        with self._sync_lock:
            call_time = datetime.now()
            difference = (call_time - self._last_app_scan).total_seconds()
            if (difference < MIN_APP_SCAN_INTERVAL and not force_scan) or difference < 1:
                return
            self._last_app_scan = call_time

        if self._app_list is not None:
            app_to_check = {}
            for app_id in self._app_list.values():
                app = self._installed_app.get(app_id)
                if app:
                    app_to_check[app_id] = app
        else:
            app_to_check = self._installed_app

        for app in app_to_check.values():
            self._get_app_status(app.app_id, app.app_type)

    def start_client(self, *, start_all=False):
        """Start all thread that connect to the TV websocket"""

        if self._client_remote is None or not self._client_remote.is_alive():
            self._client_remote = Thread(target=self._client_remote_thread)
            self._client_remote.name = "SamsungRemote"
            self._client_remote.setDaemon(True)
            self._client_remote.start()

        if start_all:
            if self._client_control is None or not self._client_control.is_alive():
                self._client_control = Thread(target=self._client_control_thread)
                self._client_control.name = "SamsungControl"
                self._client_control.setDaemon(True)
                self._client_control.start()

            if (
                    self._client_art_supported > 0 and
                    (self._client_art is None or not self._client_art.is_alive())
               ):
                if self._client_art_supported > 1:
                    self._client_art_supported = 0
                self._client_art = Thread(target=self._client_art_thread)
                self._client_art.name = "SamsungArt"
                self._client_art.setDaemon(True)
                self._client_art.start()

    def stop_client(self):
        if self._ws_remote:
            self._ws_remote.close()

    def open(self):
        if self.connection is not None:
            return self.connection

        is_ssl = self._is_ssl_connection()
        url = self._format_websocket_url(
            self._WS_ENDPOINT_REMOTE_CONTROL,
            is_ssl=is_ssl
        )
        sslopt = {"cert_reqs": ssl.CERT_NONE} if is_ssl else {}

        _LOGGING.debug("WS url %s", url)
        connection = websocket.create_connection(url, self.timeout, sslopt=sslopt)

        response = self._process_api_response(connection.recv())
        if response["event"] == "ms.channel.connect":
            if response.get("data") and response.get("data").get("token"):
                token = response.get("data").get("token")
                _LOGGING.debug("Got token %s", token)
                self._set_token(token)
        else:
            self.close()
            raise exceptions.ConnectionFailure(response)

        self.connection = connection
        return connection

    def close(self):
        if self.connection:
            self.connection.close()
        self.connection = None

        _LOGGING.debug("Connection closed.")

    def send_key(self, key, key_press_delay=None, cmd="Click"):
        _LOGGING.debug("Sending key %s", key)
        self._ws_send(
            {
                "method": "ms.remote.control",
                "params": {
                    "Cmd": cmd,
                    "DataOfCmd": key,
                    "Option": "false",
                    "TypeOfRemote": "SendRemoteKey",
                },
            },
            key_press_delay,
        )

    def hold_key(self, key, seconds):
        self.send_key(key, key_press_delay=0, cmd="Press")
        time.sleep(seconds)
        self.send_key(key, key_press_delay=0, cmd="Release")

    def move_cursor(self, x, y, duration=0):
        self._ws_send(
            {
                "method": "ms.remote.control",
                "params": {
                    "Cmd": "Move",
                    "Position": {"x": x, "y": y, "Time": str(duration)},
                    "TypeOfRemote": "ProcessMouseDevice",
                },
            },
            key_press_delay=0,
        )

    def run_app(self, app_id, action_type="", meta_tag=""):

        if not action_type:
            app = self._installed_app.get(app_id)
            if app:
                action_type = "DEEP_LINK" if app.app_type == 2 else "NATIVE_LAUNCH"
            else:
                action_type = "NATIVE_LAUNCH"

        _LOGGING.debug(
            "Sending run app app_id: %s app_type: %s meta_tag: %s",
            app_id,
            action_type,
            meta_tag,
        )

        if self._ws_control and action_type == "DEEP_LINK":
            self._ws_send(
                {
                    "id": app_id,
                    "method": "ms.application.start",
                    "params": {"id": app_id},
                },
                key_press_delay=0,
                use_control=True,
                ws_socket=self._ws_control,
            )
            return

        self._ws_send(
            {
                "method": "ms.channel.emit",
                "params": {
                    "event": "ed.apps.launch",
                    "to": "host",
                    "data": {
                        # action_type: NATIVE_LAUNCH / DEEP_LINK
                        # app_type == 2 ? 'DEEP_LINK' : 'NATIVE_LAUNCH',
                        "action_type": action_type,
                        "appId": app_id,
                        "metaTag": meta_tag,
                    },
                },
            },
            key_press_delay=0,
        )

    def open_browser(self, url):
        _LOGGING.debug("Opening url in browser %s", url)
        self.run_app("org.tizen.browser", "NATIVE_LAUNCH", url)

    def rest_device_info(self):
        _LOGGING.debug("Get device info via rest api")
        response = self._rest_request("")
        return self._process_api_response(response.text)

    def rest_app_status(self, app_id):
        _LOGGING.debug("Get app %s status via rest api", app_id)
        response = self._rest_request("applications/" + app_id)
        return self._process_api_response(response.text)

    def rest_app_run(self, app_id):
        _LOGGING.debug("Run app %s via rest api", app_id)
        response = self._rest_request("applications/" + app_id, "POST")
        return self._process_api_response(response.text)

    def rest_app_close(self, app_id):
        _LOGGING.debug("Close app %s via rest api", app_id)
        response = self._rest_request("applications/" + app_id, "DELETE")
        return self._process_api_response(response.text)

    def rest_app_install(self, app_id):
        _LOGGING.debug("Install app %s via rest api", app_id)
        response = self._rest_request("applications/" + app_id, "PUT")
        return self._process_api_response(response.text)

    def shortcuts(self):
        return shortcuts.SamsungTVShortcuts(self)
