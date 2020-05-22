"""Config flow for Samsung TV."""
import socket
# from urllib.parse import urlparse
from typing import Any, Dict
import logging

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.core import callback
from homeassistant.config_entries import SOURCE_IMPORT

# from homeassistant.components.ssdp import (
#     ATTR_SSDP_LOCATION,
#     ATTR_UPNP_MANUFACTURER,
#     ATTR_UPNP_MODEL_NAME,
#     ATTR_UPNP_UDN,
# )

from homeassistant.const import (
    CONF_API_KEY,
    CONF_DEVICE_ID,
    CONF_HOST,
    CONF_ID,
    CONF_MAC,
    CONF_NAME,
    CONF_PORT,
)

# pylint:disable=unused-import
from . import SamsungTVInfo
from .const import (
    DOMAIN,
    CONF_DEVICE_NAME,
    CONF_DEVICE_MODEL,
    CONF_UPDATE_METHOD,
    CONF_DEVICE_OS,
    CONF_USE_ST_CHANNEL_INFO,
    UPDATE_METHODS,
    RESULT_NOT_SUCCESSFUL,
    RESULT_ST_DEVICE_NOT_FOUND,
    RESULT_ST_DEVICE_USED,
    RESULT_ST_MULTI_DEVICES,
    RESULT_SUCCESS,
    RESULT_WRONG_APIKEY,
)

CONFIG_RESULTS = {
    RESULT_NOT_SUCCESSFUL: "Local connection to TV failed.",
    RESULT_ST_DEVICE_NOT_FOUND: "SmartThings TV deviceID not found.",
    RESULT_ST_DEVICE_USED: "SmartThings TV deviceID already used.",
    RESULT_ST_MULTI_DEVICES: "Multiple TVs found, unable to identify the SmartThings device to pair.",
    RESULT_WRONG_APIKEY: "Wrong SmartThings token.",
}

CONF_ST_DEVICE = "st_devices"
DATA_SCHEMA = vol.Schema(
    {
        vol.Required(CONF_HOST): str,
        vol.Required(CONF_NAME): str,
        vol.Optional(CONF_API_KEY): str,
    }
)
_LOGGER = logging.getLogger(__name__)


def _get_ip(host):
    if host is None:
        return None
    return socket.gethostbyname(host)


class SamsungTVConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a Samsung TV config flow."""

    VERSION = 1
    CONNECTION_CLASS = config_entries.CONN_CLASS_LOCAL_POLL

    # pylint: disable=no-member # https://github.com/PyCQA/pylint/issues/3167

    def __init__(self):
        """Initialize flow."""
        self._tvinfo = None
        self._host = None
        self._api_key = None
        self._device_id = None
        self._name = None
        self._mac = None
        self._update_method = None

        self._st_devices_schema = None

    def _get_entry(self):
        """Generate new entry."""
        data = {
            CONF_HOST: self._host,
            CONF_NAME: self._tvinfo._name,
            CONF_ID: self._tvinfo._uuid,
            CONF_MAC: self._mac
            if not self._tvinfo._macaddress
            else self._tvinfo._macaddress,
            CONF_DEVICE_NAME: self._tvinfo._device_name,
            CONF_DEVICE_MODEL: self._tvinfo._device_model,
            CONF_PORT: self._tvinfo._port,
            CONF_UPDATE_METHOD: self._update_method,
        }

        title = self._tvinfo._name
        if self._api_key and self._device_id:
            data[CONF_API_KEY] = self._api_key
            data[CONF_DEVICE_ID] = self._device_id
            title += " (SmartThings)"
            self.CONNECTION_CLASS = config_entries.CONN_CLASS_CLOUD_POLL
        else:
            self.CONNECTION_CLASS = config_entries.CONN_CLASS_LOCAL_POLL

        if self._tvinfo._device_os:
            data[CONF_DEVICE_OS] = self._tvinfo._device_os

        _LOGGER.info("Configured new entity %s with host %s", title, self._host)
        return self.async_create_entry(title=title, data=data,)

    def _stdev_already_used(self, devices_id):
        """Check if a device_id is in HA config."""
        for entry in self._async_current_entries():
            if entry.data.get(CONF_DEVICE_ID, "") == devices_id:
                return True
        return False

    def _remove_stdev_used(self, devices_list: Dict[str, Any]) -> Dict[str, Any]:
        """Remove entry already used"""
        res_dev_list = devices_list.copy()

        for dev_id in devices_list.keys():
            if self._stdev_already_used(dev_id):
                res_dev_list.pop(dev_id)
        return res_dev_list

    def _extract_dev_name(self, device):
        """Extract device neme from SmartThings Info"""
        name = device["name"]
        label = device.get("label", "")
        if label:
            name += f" ({label})"
        return name

    def _prepare_dev_schema(self, devices_list):
        """Prepare the schema for select correct ST device"""
        validate = {}
        for dev_id, infos in devices_list.items():
            device_name = self._extract_dev_name(infos)
            validate[dev_id] = device_name
        return vol.Schema({vol.Required(CONF_ST_DEVICE): vol.In(validate)})

    async def _get_st_deviceid(self, st_device_label=""):
        """Try to detect SmartThings device id."""
        session = self.hass.helpers.aiohttp_client.async_get_clientsession()
        devices_list = await SamsungTVInfo.get_st_devices(
            self._api_key, session, st_device_label
        )
        if devices_list is None:
            return RESULT_WRONG_APIKEY

        devices_list = self._remove_stdev_used(devices_list)
        if devices_list:
            if len(devices_list) > 1:
                self._st_devices_schema = self._prepare_dev_schema(devices_list)
            else:
                self._device_id = list(devices_list.keys())[0]

        return RESULT_SUCCESS

    async def _try_connect(self):
        """Try to connect and check auth."""
        self._tvinfo = SamsungTVInfo(self.hass, self._host, self._name)

        session = self.hass.helpers.aiohttp_client.async_get_clientsession()
        result = await self._tvinfo.get_device_info(
            session, self._api_key, self._device_id
        )

        return result

    async def async_step_import(self, user_input=None):
        """Handle configuration by yaml file."""
        return await self.async_step_user(user_input)

    async def async_step_user(self, user_input=None):
        """Handle a flow initialized by the user."""
        if user_input is not None:
            ip_address = await self.hass.async_add_executor_job(
                _get_ip, user_input[CONF_HOST]
            )

            await self.async_set_unique_id(ip_address)
            self._abort_if_unique_id_configured()

            self._host = ip_address
            self._api_key = user_input.get(CONF_API_KEY)
            self._name = user_input.get(CONF_NAME)
            self._device_id = user_input.get(CONF_DEVICE_ID) if self._api_key else None
            self._mac = user_input.get(CONF_MAC, "")
            update_method = user_input.get(CONF_UPDATE_METHOD, "")
            if update_method:
                self._update_method = update_method
            elif self._api_key:
                self._update_method = UPDATE_METHODS["SmartThings"]
            else:
                self._update_method = UPDATE_METHODS["Ping"]
            st_device_label = user_input.get(CONF_DEVICE_NAME, "")
            is_import = user_input.get(SOURCE_IMPORT, False)

            result = RESULT_SUCCESS
            if self._api_key and not self._device_id:
                result = await self._get_st_deviceid(st_device_label)

                if result == RESULT_SUCCESS and not self._device_id:
                    if self._st_devices_schema:
                        if not is_import:
                            return self._show_form(errors=None, step_id="stdevice")
                        result = RESULT_ST_MULTI_DEVICES
                    else:
                        if not is_import:
                            return self._show_form(errors=None, step_id="stdeviceid")
                        result = RESULT_ST_DEVICE_NOT_FOUND
            elif self._device_id and self._stdev_already_used(self._device_id):
                result = RESULT_ST_DEVICE_USED

            return await self._async_save_entry(result, is_import)

        return self._show_form()

    async def async_step_stdevice(self, user_input=None):
        """Handle a flow to select ST device."""
        self._device_id = user_input.get(CONF_ST_DEVICE)
        return await self._async_save_entry()

    async def async_step_stdeviceid(self, user_input=None):
        """Handle a flow to manual input a ST device."""
        device_id = user_input.get(CONF_DEVICE_ID)
        if self._stdev_already_used(device_id):
            return self._show_form(
                {"base": RESULT_ST_DEVICE_USED}, step_id="stdeviceid"
            )

        self._device_id = device_id
        return await self._async_save_entry()

    async def _async_save_entry(self, result=RESULT_SUCCESS, is_import=False):
        """Save the new config entry."""

        if result == RESULT_SUCCESS:
            result = await self._try_connect()

        if result != RESULT_SUCCESS:
            if is_import:
                _LOGGER.error(
                    "Error during setup of host %s using configuration.yaml info. Reason: %s",
                    self._host,
                    CONFIG_RESULTS[result],
                )
                return self.async_abort(reason=result)
            else:
                step_id = (
                    "stdeviceid" if result == RESULT_ST_DEVICE_NOT_FOUND else "user"
                )
                return self._show_form({"base": result}, step_id)

        return self._get_entry()

    @callback
    def _show_form(self, errors=None, step_id="user"):
        """Show the form to the user."""
        data_schema = DATA_SCHEMA
        if step_id == "stdevice":
            data_schema = self._st_devices_schema
        elif step_id == "stdeviceid":
            data_schema = vol.Schema({vol.Required(CONF_DEVICE_ID): str})

        return self.async_show_form(
            step_id=step_id, data_schema=data_schema, errors=errors if errors else {},
        )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry):
        """Get the options flow for this handler."""
        return OptionsFlowHandler(config_entry)

    # async def async_step_ssdp(self, user_input=None):
    # """Handle a flow initialized by discovery."""
    # host = urlparse(user_input[ATTR_SSDP_LOCATION]).hostname
    # ip_address = await self.hass.async_add_executor_job(_get_ip, host)

    # self._host = host
    # self._ip = self.context[CONF_IP_ADDRESS] = ip_address
    # self._manufacturer = user_input.get(ATTR_UPNP_MANUFACTURER)
    # self._model = user_input.get(ATTR_UPNP_MODEL_NAME)
    # self._name = f"Samsung {self._model}"
    # self._id = user_input.get(ATTR_UPNP_UDN)
    # self._title = self._model

    # # probably access denied
    # if self._id is None:
    # return self.async_abort(reason=RESULT_AUTH_MISSING)
    # if self._id.startswith("uuid:"):
    # self._id = self._id[5:]

    # await self.async_set_unique_id(ip_address)
    # self._abort_if_unique_id_configured(
    # {
    # CONF_ID: self._id,
    # CONF_MANUFACTURER: self._manufacturer,
    # CONF_MODEL: self._model,
    # }
    # )

    # self.context["title_placeholders"] = {"model": self._model}
    # return await self.async_step_confirm()

    # async def async_step_confirm(self, user_input=None):
    # """Handle user-confirmation of discovered node."""
    # if user_input is not None:
    # result = await self.hass.async_add_executor_job(self._try_connect)

    # if result != RESULT_SUCCESS:
    # return self.async_abort(reason=result)
    # return self._get_entry()

    # return self.async_show_form(
    # step_id="confirm", description_placeholders={"model": self._model}
    # )

    # async def async_step_reauth(self, user_input=None):
    # """Handle configuration by re-auth."""
    # self._host = user_input[CONF_HOST]
    # self._id = user_input.get(CONF_ID)
    # self._ip = user_input[CONF_IP_ADDRESS]
    # self._manufacturer = user_input.get(CONF_MANUFACTURER)
    # self._model = user_input.get(CONF_MODEL)
    # self._name = user_input.get(CONF_NAME)
    # self._title = self._model or self._name

    # await self.async_set_unique_id(self._ip)
    # self.context["title_placeholders"] = {"model": self._title}

    # return await self.async_step_confirm()


class OptionsFlowHandler(config_entries.OptionsFlow):
    """Handle a option flow for Samsung TV Smart."""

    def __init__(self, config_entry: config_entries.ConfigEntry):
        """Initialize options flow."""
        self.config_entry = config_entry

    async def async_step_init(self, user_input=None):
        """Handle options flow."""
        if user_input is not None:
            return self.async_create_entry(title="", data=user_input)

        data_schema = vol.Schema(
            {
                vol.Optional(
                    CONF_USE_ST_CHANNEL_INFO,
                    default=self.config_entry.options.get(
                        CONF_USE_ST_CHANNEL_INFO, False
                    ),
                ): bool
            }
        )
        return self.async_show_form(step_id="init", data_schema=data_schema)
