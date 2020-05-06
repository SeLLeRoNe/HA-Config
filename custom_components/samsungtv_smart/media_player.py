"""Support for interface with an Samsung TV."""
import asyncio
import logging
import json
import os
from datetime import timedelta, datetime
from wakeonlan import send_magic_packet
from websocket import WebSocketTimeoutException

import voluptuous as vol

from aiohttp import ClientConnectionError, ClientSession, ClientResponseError
from async_timeout import timeout

from .api.samsungws import SamsungTVWS
from .api.smartthings import SmartThingsTV
from .api.upnp import upnp

import homeassistant.helpers.config_validation as cv
from homeassistant.util import Throttle
from homeassistant.util import dt as dt_util
from homeassistant.helpers.device_registry import CONNECTION_NETWORK_MAC

from homeassistant.components.media_player import (
    MediaPlayerDevice,
    DEVICE_CLASS_TV,
)

from homeassistant.components.media_player.const import (
    SUPPORT_PAUSE,
    SUPPORT_PLAY,
    SUPPORT_PLAY_MEDIA,
    SUPPORT_STOP,
    SUPPORT_VOLUME_MUTE,
    SUPPORT_VOLUME_STEP,
    SUPPORT_VOLUME_SET,
    SUPPORT_PREVIOUS_TRACK,
    SUPPORT_NEXT_TRACK,
    SUPPORT_SELECT_SOURCE,
    SUPPORT_TURN_ON,
    SUPPORT_TURN_OFF,
    MEDIA_TYPE_VIDEO,
    MEDIA_TYPE_CHANNEL,
    MEDIA_TYPE_APP,
    MEDIA_TYPE_URL,
)

from homeassistant.const import (
    CONF_BROADCAST_ADDRESS,
    CONF_HOST,
    CONF_ID,
    CONF_MAC,
    CONF_NAME,
    CONF_PORT,
    CONF_DEVICE_ID,
    CONF_TIMEOUT,
    CONF_API_KEY,
    STATE_OFF,
    STATE_ON,
)

from .const import (
    DOMAIN,
    DEFAULT_TIMEOUT,
    DEFAULT_SOURCE_LIST,
    DEFAULT_APP,
    CONF_APP_LIST,
    CONF_DEVICE_NAME,
    CONF_DEVICE_MODEL,
    CONF_DEVICE_OS,
    CONF_LOAD_ALL_APPS,
    CONF_SHOW_CHANNEL_NR,
    CONF_SOURCE_LIST,
    CONF_UPDATE_METHOD,
    CONF_UPDATE_CUSTOM_PING_URL,
    CONF_SCAN_APP_HTTP,
    STD_APP_LIST,
    WS_PREFIX,
)

HTTP_APPCHECK_TIMEOUT = 1
KEYPRESS_DEFAULT_DELAY = 0.5
KEYPRESS_MAX_DELAY = 2.0
KEYPRESS_MIN_DELAY = 0.2
MAX_ST_ERROR_COUNT = 4
MEDIA_TYPE_KEY = "send_key"
MEDIA_TYPE_BROWSER = "browser"
POWER_OFF_DELAY = 20
POWER_ON_DELAY = 3
PING_UPDATE_TIMEOUT = 1.5
ST_APP_SEPARATOR = "/"
ST_UPDATE_TIMEOUT = 5
WS_CONN_TIMEOUT = 10

MIN_TIME_BETWEEN_SCANS = timedelta(seconds=10)
MIN_TIME_BETWEEN_FORCED_SCANS = timedelta(seconds=1)
MIN_TIME_BETWEEN_PING = timedelta(seconds=5)
MIN_TIME_BETWEEN_APP_SCANS = timedelta(seconds=60)

SUPPORT_SAMSUNGTV_SMART = (
    SUPPORT_PAUSE
    | SUPPORT_PLAY
    | SUPPORT_PLAY_MEDIA
    | SUPPORT_STOP
    | SUPPORT_VOLUME_STEP
    | SUPPORT_VOLUME_MUTE
    | SUPPORT_VOLUME_SET
    | SUPPORT_PREVIOUS_TRACK
    | SUPPORT_NEXT_TRACK
    | SUPPORT_SELECT_SOURCE
    | SUPPORT_TURN_ON
    | SUPPORT_TURN_OFF
)

_LOGGER = logging.getLogger(__name__)
SCAN_INTERVAL = timedelta(seconds=15)


async def async_setup_platform(
    hass, config, add_entities, discovery_info=None
):  # pragma: no cover
    """Set up the Samsung TV platform."""
    pass


async def async_setup_entry(hass, config_entry, async_add_entities):
    """Set up the Samsung TV from a config entry."""

    # session used by aiohttp
    session = hass.helpers.aiohttp_client.async_get_clientsession()

    host = config_entry.data[CONF_HOST]
    config = config_entry.data.copy()
    add_conf = hass.data[DOMAIN][host]
    for attr, value in add_conf.items():
        if value:
            config[attr] = value
    _LOGGER.debug(config)

    async_add_entities([SamsungTVDevice(config, session)])
    _LOGGER.info(
        "Samsung TV %s:%d added as '%s'",
        host,
        config.get(CONF_PORT),
        config.get(CONF_NAME),
    )


class SamsungTVDevice(MediaPlayerDevice):
    """Representation of a Samsung TV."""

    def __init__(self, config, session: ClientSession):
        """Initialize the Samsung device."""

        # Save a reference to the imported classes
        self._session = session
        self._host = config.get(CONF_HOST)
        self._name = config.get(CONF_NAME)
        self._uuid = config.get(CONF_ID)
        self._mac = config.get(CONF_MAC)
        self._device_name = config.get(CONF_DEVICE_NAME)
        self._device_model = config.get(CONF_DEVICE_MODEL)
        self._device_os = config.get(CONF_DEVICE_OS)
        self._show_channel_number = config.get(CONF_SHOW_CHANNEL_NR, False)
        self._update_method = config.get(CONF_UPDATE_METHOD)
        self._broadcast = config.get(CONF_BROADCAST_ADDRESS)
        self._load_all_apps = config.get(CONF_LOAD_ALL_APPS, True)
        self._timeout = config.get(CONF_TIMEOUT, DEFAULT_TIMEOUT)

        # obsolete
        self._update_custom_ping_url = config.get(CONF_UPDATE_CUSTOM_PING_URL)
        self._scan_app_http = config.get(CONF_SCAN_APP_HTTP, True)

        port = config.get(CONF_PORT)
        api_key = config.get(CONF_API_KEY, None)
        device_id = config.get(CONF_DEVICE_ID, None)

        self._default_source_used = False
        source_list = SamsungTVDevice._load_param_list(
            config.get(CONF_SOURCE_LIST, {})
        )
        if not source_list:
            source_list = DEFAULT_SOURCE_LIST
            self._default_source_used = True
        self._source_list = source_list

        app_list = SamsungTVDevice._load_param_list(
            config.get(CONF_APP_LIST)
        )
        if app_list is not None:
            double_list = SamsungTVDevice._split_app_list(app_list, "/")
            self._app_list = double_list["app"]
            self._app_list_ST = double_list["appST"]
        else:
            self._app_list = None
            self._app_list_ST = None

        self._source = None
        self._running_app = None
        self._is_ws_connection = True if port in (8001, 8002) else False
        # Assume that the TV is not muted and volume is 0
        self._muted = False
        self._volume = 0
        # Assume that the TV is in Play mode
        self._playing = True
        self._state = None
        # Mark the end of a shutdown command (need to wait 15 seconds before
        # sending the next command to avoid turning the TV back ON).
        self._end_of_power_off = None
        self._token_file = None

        self._last_command_time = datetime.now()

        # Generate token file only for WS + SSL + Token connection
        if port == 8002:
            self._gen_token_file()

        self._ws = SamsungTVWS(
            name=WS_PREFIX
            + " "
            + self._name,  # this is the name shown in the TV list of external device.
            host=self._host,
            port=port,
            timeout=self._timeout,
            key_press_delay=KEYPRESS_DEFAULT_DELAY,
            token_file=self._token_file,
            app_list=self._app_list,
        )

        self._upnp = upnp(host=self._host, session=session)

        self._st = None
        if api_key and device_id:
            self._st = SmartThingsTV(
                api_key=api_key,
                device_id=device_id,
                refresh_status=True,  # may became a config option to limit write on the cloud???
                session=session,
            )

        self._st_error_count = 0
        self._setvolumebyst = False

    @staticmethod
    def _load_param_list(src_list):

        if src_list is None:
            return None
        if isinstance(src_list, dict):
            return src_list

        result = {}
        try:
            result = json.loads(src_list)
        except TypeError:
            _LOGGER.error("Invalid format parameter: %s", str(src_list))
        return result

    @staticmethod
    def _split_app_list(app_list, sep=ST_APP_SEPARATOR):
        retval = {"app": {}, "appST": {}}

        for attr, value in app_list.items():
            value_split = value.split(sep, 1)
            app_id = value_split[0]
            if len(value_split) == 1:
                st_app_id = STD_APP_LIST.get(app_id, "")
                st_app_id = st_app_id if st_app_id != "" else app_id
            else:
                st_app_id = value_split[1]
            retval["app"].update({attr: app_id})
            retval["appST"].update({attr: st_app_id})

        return retval

    def _gen_token_file(self):
        self._token_file = (
            os.path.dirname(os.path.realpath(__file__))
            + "/token-"
            + self._host
            + ".txt"
        )

        if os.path.isfile(self._token_file) is False:
            # For correct auth
            self._timeout = 45

            # Create token file for catch possible errors
            try:
                handle = open(self._token_file, "w+")
                handle.close()
            except:
                _LOGGER.error(
                    "Samsung TV - Error creating token file: %s", self._token_file
                )

    def _delete_token_file(self):

        if not self._token_file:
            return

        if os.path.isfile(self._token_file) is True:

            # delete token file for catch possible errors
            try:
                os.remove(self._token_file)
            except:
                _LOGGER.error(
                    "Samsung TV - Error deleting token file: %s", self._token_file
                )

    def _power_off_in_progress(self):
        return (
            self._end_of_power_off is not None
            and self._end_of_power_off > dt_util.utcnow()
        )

    async def _update_volume_info(self):
        if self._state != STATE_OFF:

            # if self._st and self._setvolumebyst:
            # self._volume = self._st.volume
            # self._muted = self._st.muted
            # return

            self._volume = int(await self._upnp.async_get_volume()) / 100
            self._muted = await self._upnp.async_get_mute()

    @Throttle(MIN_TIME_BETWEEN_PING)
    async def _async_ping_device(self, force_ping=False, **kwargs):

        # HTTP ping
        if self._is_ws_connection:

            result = await self.hass.async_add_job(self._ws.ping_device)
            if result and self._st:
                if (
                    self._st.state == STATE_OFF and self._state == STATE_ON
                    and self._update_method == "smartthings"
                ):
                    result = False

            if result:
                await self.hass.async_add_job(self._ws.start_client)
                await self.hass.async_add_job(self._ws.get_running_app)
            else:
                await self.hass.async_add_job(self._ws.stop_client)

            self._state = STATE_ON if result else STATE_OFF

        # SmartThings ping
        # elif self._st and self._update_method == "smartthings":
        #     self._state = st_state

        # WS ping
        else:
            await self.async_send_command("KEY", "send_key", 1, 0)

        await self._update_volume_info()

    async def _get_running_app(self):

        if self._app_list is not None:

            for app, app_id in self._app_list.items():
                if self._ws.running_app:
                    if app_id == self._ws.running_app:
                        self._running_app = app
                        return
                if self._st and self._st.channel_name != "":
                    st_app_id = self._app_list_ST.get(app, "")
                    if st_app_id == self._st.channel_name:
                        self._running_app = app
                        return

        self._running_app = DEFAULT_APP

    def _get_st_sources(self):
        if self._state == STATE_OFF or not self._st:
            _LOGGER.debug(
                "Samsung TV is OFF or SmartThings not configured, _get_st_sources not executed"
            )
            return

        st_source_list = {}
        source_list = self._st.source_list
        if source_list:
            for i in range(len(source_list)):
                try:
                    # SmartThings source list is an array that may contain the input or the assigned name,
                    # if we found a name that is not an input we use it as input name
                    input_name = source_list[i]
                    is_tv = input_name in ["digitalTv", "TV"]
                    is_hdmi = input_name.startswith("HDMI")
                    if is_tv or is_hdmi:
                        input_type = "ST_TV" if is_tv else "ST_" + input_name
                        if input_type in st_source_list.values():
                            continue

                        index = i + 1
                        if index < len(source_list):
                            next_input = source_list[index]
                            if not (
                                next_input in ["digitalTv", "TV"]
                                or next_input.startswith("HDMI")
                            ):
                                input_name = next_input
                        st_source_list[input_name] = input_type
                except Exception:
                    pass

        if len(st_source_list) > 0:
            _LOGGER.info(
                "Samsung TV: loaded sources list from SmartThings: "
                + str(st_source_list)
            )
            self._source_list = st_source_list
            self._default_source_used = False

    @Throttle(MIN_TIME_BETWEEN_APP_SCANS)
    def _gen_installed_app_list(self, **kwargs):
        if self._state == STATE_OFF:
            _LOGGER.debug("Samsung TV is OFF, _gen_installed_app_list not executed")
            return

        app_list = self._ws.installed_app
        if not app_list:
            return

        # app_list is a list of dict
        clean_app_list = {}
        clean_app_list_ST = {}
        dump_app_list = {}
        for app in app_list.values():
            try:
                app_name = app.app_name
                app_id = app.app_id
                full_app_id = app_id
                st_app_id = STD_APP_LIST.get(app_id, "###")
                # app_list is automatically created only with apps in hard coded short list (STD_APP_LIST)
                # other available apps are dumped in a file that can be used to create a custom list
                # this is to avoid unuseful long list that can impact performance
                if st_app_id != "###" or self._load_all_apps:
                    clean_app_list[app_name] = app_id
                    clean_app_list_ST[app_name] = (
                        st_app_id if st_app_id != "" else app_id
                    )
                    full_app_id = (
                        app_id + ST_APP_SEPARATOR + st_app_id
                        if st_app_id != "" and st_app_id != "###"
                        else app_id
                    )

                dump_app_list[app_name] = full_app_id

            except Exception:
                pass

        self._app_list = clean_app_list
        self._app_list_ST = clean_app_list_ST
        try:
            dump_file_name = (
                os.path.dirname(os.path.realpath(__file__))
                + "/applist-"
                + self._host
                + ".txt"
            )
            with open(dump_file_name, "w") as dump_file:
                dump_file.write('app_list: "' + str(dump_app_list) + '"')
        except OSError:
            _LOGGER.error("Failed to write dump apps file")
            pass

        _LOGGER.debug("Dump of available apps:%s", dump_app_list)

    def _get_source(self):
        """Return the current input source."""
        if self._state != STATE_OFF:

            if self._st:
                if self._st.state == STATE_OFF:
                    self._source = None
                else:
                    if self._running_app == DEFAULT_APP:

                        if self._st.source in ["digitalTv", "TV"]:
                            cloud_key = "ST_TV"
                        else:
                            cloud_key = "ST_" + self._st.source

                        found_source = ""

                        for attr, value in self._source_list.items():
                            if value == cloud_key:
                                found_source = attr

                        if found_source != "":
                            self._source = found_source
                        else:
                            self._source = self._running_app
                    else:
                        self._source = self._running_app
            else:
                self._source = self._running_app
        else:
            self._source = None

        return self._source

    async def _smartthings_keys(self, source_key):
        if self._st:
            if source_key.startswith("ST_HDMI"):
                await self._st.async_send_command(
                    "selectsource", source_key.replace("ST_", "")
                )
            elif source_key == "ST_TV":
                await self._st.async_send_command("selectsource", "digitalTv")
            elif source_key == "ST_CHUP":
                await self._st.async_send_command("stepchannel", "up")
            elif source_key == "ST_CHDOWN":
                await self._st.async_send_command("stepchannel", "down")
            elif source_key.startswith("ST_CH"):
                ch_num = source_key.replace("ST_CH", "")
                if ch_num.isdigit():
                    await self._st.async_send_command("selectchannel", ch_num)
            elif source_key == "ST_MUTE":
                await self._st.async_send_command(
                    "audiomute", "off" if self._muted else "on"
                )
            elif source_key == "ST_VOLUP":
                await self._st.async_send_command("stepvolume", "up")
            elif source_key == "ST_VOLDOWN":
                await self._st.async_send_command("stepvolume", "down")
            elif source_key.startswith("ST_VOL"):
                vol_lev = source_key.replace("ST_VOL", "")
                if vol_lev.isdigit():
                    await self._st.async_send_command("setvolume", vol_lev)

    @Throttle(MIN_TIME_BETWEEN_SCANS, MIN_TIME_BETWEEN_FORCED_SCANS)
    async def async_update(self, **kwargs):
        """Update state of device."""

        """Required to get source and media title"""
        if self._st:
            try:
                with timeout(ST_UPDATE_TIMEOUT):
                    await self._st.async_device_update()
                self._st_error_count = 0
            except (
                asyncio.TimeoutError,
                ClientConnectionError,
                ClientResponseError,
            ) as ex:
                self._st_error_count += 1
                _LOGGER.debug("SamsungTV Smart - Error: [%s]", ex)

        if self._st_error_count >= MAX_ST_ERROR_COUNT:
            _LOGGER.error("SamsungTV Smart - Error refreshing from SmartThings")
            self._st_error_count = 0

        await self._async_ping_device()

        if self._state == STATE_ON and not self._power_off_in_progress():
            await self._get_running_app()

        if self._state == STATE_OFF:
            self._end_of_power_off = None

    def send_command(
        self, payload, command_type="send_key", retry_count=1, key_press_delay=0
    ):
        """Send a key to the tv and handles exceptions."""
        if key_press_delay < 0:
            key_press_delay = None  # means "default" provided with constructor

        call_time = datetime.now()
        difference = (call_time - self._last_command_time).total_seconds()
        if (
            difference > WS_CONN_TIMEOUT
        ):  # always close connection after WS_CONN_TIMEOUT (10 seconds)
            self._ws.close()

        self._last_command_time = call_time

        try:
            # recreate connection if connection was dead
            for _ in range(retry_count + 1):
                try:
                    if command_type == "run_app":
                        # run_app(self, app_id, app_type='DEEP_LINK', meta_tag='')
                        self._ws.run_app(payload)
                    else:
                        self._ws.send_key(payload, key_press_delay)

                    break
                except (ConnectionResetError, AttributeError, BrokenPipeError):
                    self._ws.close()
                    _LOGGER.debug(
                        "Error in send_command() -> ConnectionResetError/AttributeError/BrokenPipeError"
                    )

        except WebSocketTimeoutException:
            # We got a response so it's on.
            self._ws.close()
            _LOGGER.debug(
                "Failed sending payload %s command_type %s",
                payload,
                command_type,
                exc_info=True,
            )

        except OSError:
            self._ws.close()
            _LOGGER.debug("Error in send_command() -> OSError")

        return True

    async def async_send_command(
        self, payload, command_type="send_key", retry_count=1, key_press_delay=0
    ):
        return await self.hass.async_add_job(
            self.send_command, payload, command_type, retry_count, key_press_delay
        )

    @property
    def unique_id(self) -> str:
        """Return the unique ID of the device."""
        return self._uuid

    @property
    def name(self):
        """Return the name of the device."""
        return self._name

    @property
    def icon(self):
        return "mdi:television"

    @property
    def media_title(self):
        """Title of current playing media."""
        if self._state == STATE_OFF:
            return None

        if self._st:

            if self._st.state == STATE_OFF:
                return None
            elif self._running_app == DEFAULT_APP:
                if self._st.source in ["digitalTv", "TV"]:
                    if self._st.channel_name != "":
                        if self._show_channel_number and self._st.channel != "":
                            return self._st.channel_name + " (" + self._st.channel + ")"
                        return self._st.channel_name
                    elif self._st.channel != "":
                        return self._st.channel
                elif self._st.channel_name != "":
                    # the channel name holds the running app ID
                    # regardless of the self._cloud_source value
                    return self._st.channel_name

        return self._get_source()

    @property
    def media_channel(self):
        """Channel currently playing."""
        if self._state == STATE_ON:
            if self._st:
                if self._st.source in ["digitalTv", "TV"] and self._st.channel != "":
                    return self._st.channel
        return None

    @property
    def media_content_type(self):
        """Return the content type of current playing media."""
        if self._state == STATE_ON:
            if self._running_app == DEFAULT_APP:
                if self.media_channel:
                    return MEDIA_TYPE_CHANNEL
                else:
                    return MEDIA_TYPE_VIDEO
            else:
                return MEDIA_TYPE_APP
        return STATE_OFF

    @property
    def app_id(self):
        """ID of the current running app."""
        if self._state == STATE_ON:
            app = None
            if self._app_list_ST and self._running_app != DEFAULT_APP:
                app = self._app_list_ST.get(self._running_app, None)
            if app:
                return app
            elif self._st:
                if not self._st.channel and self._st.channel_name:
                    return self._st.channel_name
            return DEFAULT_APP
        return None

    @property
    def state(self):
        """Return the state of the device."""

        # Warning: we assume that after a sending a power off command, the command is successful
        # so for 20 seconds (defined in POWER_OFF_DELAY) the state will be off regardless of the actual state.
        # This is to have better feedback to the command in the UI, but the logic might cause other issues in the future
        if self._power_off_in_progress():
            return STATE_OFF

        return self._state

    @property
    def source_list(self):
        """List of available input sources."""
        # try to get source list from SmartThings if a custom source list is not defined
        if self._st and self._default_source_used:
            self._get_st_sources()

        if self._app_list is None:
            if self._is_ws_connection:
                if self._ws.installed_app:
                    self._gen_installed_app_list()

        if self._power_off_in_progress() or self._state == STATE_OFF:
            return None

        source_list = []
        source_list.extend(list(self._source_list))
        if self._app_list:
            source_list.extend(list(self._app_list))

        return source_list

    @property
    def source(self):
        """Return the current input source."""
        return self._get_source()

    @property
    def supported_features(self):
        """Flag media player features that are supported."""
        return SUPPORT_SAMSUNGTV_SMART

    @property
    def device_class(self):
        """Set the device class to TV."""
        return DEVICE_CLASS_TV

    def _turn_on(self):
        """Turn the media player on."""
        if self._power_off_in_progress():
            self._end_of_power_off = None
            if self._is_ws_connection:
                self.send_command("KEY_POWER")
            else:
                self.send_command("KEY_POWEROFF")

        elif self._state == STATE_OFF:
            if self._mac:
                if self._broadcast:
                    send_magic_packet(self._mac, ip_address=self._broadcast)
                else:
                    send_magic_packet(self._mac)
            else:
                self.send_command("KEY_POWERON")

    async def async_turn_on(self):
        await self.hass.async_add_job(self._turn_on)
        if self._state == STATE_OFF and self._mac:
            await asyncio.sleep(POWER_ON_DELAY)
            await self._async_ping_device(force_ping=True, no_throttle=True)

    async def async_turn_off(self):
        """Turn off media player."""
        if (not self._power_off_in_progress()) and self._state != STATE_OFF:

            self._end_of_power_off = dt_util.utcnow() + timedelta(
                seconds=POWER_OFF_DELAY
            )

            if self._is_ws_connection:
                await self.async_send_command("KEY_POWER")
            else:
                await self.async_send_command("KEY_POWEROFF")

            # Force closing of remote session to provide instant UI feedback
            # try:
            #     self._ws.close()
            # except OSError:
            #     _LOGGER.debug("Could not establish connection.")

    @property
    def volume_level(self):
        """Volume level of the media player (0..1)."""
        # self._volume = int(self._upnp.get_volume()) / 100
        if self.support_volume_set:
            return self._volume
        else:
            return None

    @property
    def is_volume_muted(self):
        """Boolean if volume is currently muted."""
        # self._muted = self._upnp.get_mute()
        return self._muted

    def volume_up(self):
        """Volume up the media player."""
        self.send_command("KEY_VOLUP")
        if self.support_volume_set:
            self._volume = min(1, self._volume + 0.01)

    def volume_down(self):
        """Volume down media player."""
        self.send_command("KEY_VOLDOWN")
        if self.support_volume_set:
            self._volume = max(0, self._volume - 0.01)

    def mute_volume(self, mute):
        """Send mute command."""
        self.send_command("KEY_MUTE")
        if self.support_volume_set:
            self._muted = False if self._muted else True

    async def async_set_volume_level(self, volume):
        if self._st and self._setvolumebyst:
            await self._st.async_send_command("setvolume", int(volume * 100))
        else:
            await self._upnp.async_set_volume(int(volume * 100))
        self._volume = volume

    def media_play_pause(self):
        """Simulate play pause media player."""
        if self._playing:
            self.media_pause()
        else:
            self.media_play()

    def media_play(self):
        """Send play command."""
        self._playing = True
        self.send_command("KEY_PLAY")

    def media_pause(self):
        """Send media pause command to media player."""
        self._playing = False
        self.send_command("KEY_PAUSE")

    def media_stop(self):
        """Send media pause command to media player."""
        self._playing = False
        self.send_command("KEY_STOP")

    def media_next_track(self):
        """Send next track command."""
        if self.media_channel:
            self.send_command("KEY_CHUP")
        else:
            self.send_command("KEY_FF")

    def media_previous_track(self):
        """Send the previous track command."""
        if self.media_channel:
            self.send_command("KEY_CHDOWN")
        else:
            self.send_command("KEY_REWIND")

    async def _async_send_keys(self, source_key):
        """Send key / chained keys."""
        prev_wait = True

        if "+" in source_key:
            all_source_keys = source_key.split("+")
            for this_key in all_source_keys:
                if this_key.isdigit():
                    prev_wait = True
                    await asyncio.sleep(
                        min(
                            max((int(this_key) / 1000), KEYPRESS_MIN_DELAY),
                            KEYPRESS_MAX_DELAY,
                        )
                    )
                else:
                    # put a default delay between key if set explicit
                    if not prev_wait:
                        await asyncio.sleep(KEYPRESS_DEFAULT_DELAY)
                    prev_wait = False
                    if this_key.startswith("ST_"):
                        await self._smartthings_keys(this_key)
                    else:
                        await self.async_send_command(this_key)
        elif source_key.startswith("ST_"):
            if self._st:
                await self._smartthings_keys(source_key)
            else:
                _LOGGER.error("Unsupported _ST source. You must configure SmartThings")
                return False
        else:
            await self.async_send_command(source_key)

        return True

    async def async_play_media(self, media_type, media_id, **kwargs):
        """Support changing a channel."""

        # Type channel
        if media_type == MEDIA_TYPE_CHANNEL:
            try:
                cv.positive_int(media_id)
            except vol.Invalid:
                _LOGGER.error("Media ID must be positive integer")
                return

            for digit in media_id:
                await self.async_send_command("KEY_" + digit)
                await asyncio.sleep(KEYPRESS_DEFAULT_DELAY)

            await self.async_send_command("KEY_ENTER")

        # Launch an app
        elif media_type == MEDIA_TYPE_APP:
            await self.async_send_command(media_id, "run_app")

        # Send custom key
        elif media_type == MEDIA_TYPE_KEY:
            try:
                cv.string(media_id)
            except vol.Invalid:
                _LOGGER.error('Media ID must be a string (ex: "KEY_HOME"')
                return

            source_key = media_id
            await self._async_send_keys(source_key)

        # Play media
        elif media_type == MEDIA_TYPE_URL:
            try:
                cv.url(media_id)
            except vol.Invalid:
                _LOGGER.error('Media ID must be an url (ex: "http://"')
                return

            await self._upnp.async_set_current_media(media_id)
            self._playing = True

        # Trying to make stream component work on TV
        elif media_type == "application/vnd.apple.mpegurl":
            await self._upnp.async_set_current_media(media_id)
            self._playing = True

        elif media_type == MEDIA_TYPE_BROWSER:
            self._ws.open_browser(media_id)

        else:
            _LOGGER.error("Unsupported media type")
            return

    async def async_select_source(self, source):
        """Select input source."""
        running_app = DEFAULT_APP

        if source in self._source_list:
            source_key = self._source_list[source]
            result = await self._async_send_keys(source_key)
            if not result:
                return
        elif source in self._app_list:
            source_key = self._app_list[source]
            running_app = source
            await self.async_send_command(source_key, "run_app")
            if self._st:
                self._st.set_application(self._app_list_ST[source])
        else:
            _LOGGER.error("Unsupported source")
            return

        self._running_app = running_app
        self._source = source

    @property
    def device_info(self):
        """Return a device description for device registry."""
        _device_info = {
            "identifiers": {(DOMAIN, f"{self._uuid}")},
            "manufacturer": "Samsung Electronics",
            "name": self.name,
            "connections": {(CONNECTION_NETWORK_MAC, self._mac)},
        }
        model = self._device_model if self._device_model else "Samsung TV"
        if self._device_name:
            model = "%s (%s)" % (model, self._device_name)
        _device_info["model"] = model
        if self._device_os:
            _device_info["sw_version"] = self._device_os

        return _device_info

    async def async_will_remove_from_hass(self):
        if self._is_ws_connection:
            await self.hass.async_add_job(self._ws.stop_client)
            await self.hass.async_add_job(self._delete_token_file)
