"""Config flow to configure OpenHASP component."""
import json
import logging
import os

from homeassistant import config_entries, data_entry_flow, exceptions
from homeassistant.components.mqtt import valid_subscribe_topic
from homeassistant.const import CONF_NAME
from homeassistant.core import callback
import homeassistant.helpers.config_validation as cv
import voluptuous as vol

from .const import (
    CONF_DIMLIGHTS,
    CONF_HWID,
    CONF_IDLE_BRIGHTNESS,
    CONF_INPUT,
    CONF_LIGHTS,
    CONF_NODE,
    CONF_PAGES,
    CONF_PAGES_PATH,
    CONF_RELAYS,
    CONF_TOPIC,
    DEFAULT_IDLE_BRIGHNESS,
    DISCOVERED_DIM,
    DISCOVERED_HWID,
    DISCOVERED_INPUT,
    DISCOVERED_LIGHT,
    DISCOVERED_MANUFACTURER,
    DISCOVERED_MODEL,
    DISCOVERED_NODE,
    DISCOVERED_PAGES,
    DISCOVERED_POWER,
    DISCOVERED_URL,
    DISCOVERED_VERSION,
    DOMAIN,
    MAJOR,
    MINOR,
)

_LOGGER = logging.getLogger(__name__)


def validate_jsonl(path):
    """Validate that the value is an existing file."""
    if path is None:
        raise InvalidJSONL()
    file_in = os.path.expanduser(str(path))

    if not os.path.isfile(file_in):
        raise InvalidJSONL("not a file")
    if not os.access(file_in, os.R_OK):
        raise InvalidJSONL("file not readable")
    return file_in


@config_entries.HANDLERS.register(DOMAIN)
class OpenHASPFlowHandler(config_entries.ConfigFlow):
    """Config flow for OpenHASP component."""

    VERSION = 1
    CONNECTION_CLASS = config_entries.CONN_CLASS_LOCAL_PUSH

    def __init__(self):
        """Init OpenHASPFlowHandler."""
        self._errors = {}
        self.config_data = {
            DISCOVERED_MANUFACTURER: "openHASP",
            DISCOVERED_MODEL: None,
            CONF_RELAYS: [],
        }

    async def async_step_user(self, user_input=None):
        """Handle a flow initialized by User."""
        _LOGGER.error("Discovery Only")

        await self.hass.components.mqtt.async_publish(
            self.hass,
            "hasp/broadcast/command/discovery",
            "discovery",
            qos=0,
            retain=False,
        )

        return self.async_abort(reason="discovery_only")

    async def async_step_mqtt(self, discovery_info=None):
        """Handle a flow initialized by MQTT discovery."""
        _discovered = json.loads(discovery_info.payload)
        _LOGGER.debug("Discovered: %s", _discovered)

        await self.async_set_unique_id(_discovered[DISCOVERED_HWID], raise_on_progress=False)
        self._abort_if_unique_id_configured()

        version = _discovered.get(DISCOVERED_VERSION)
        if version.split(".")[0:2] != [MAJOR, MINOR]:
            _LOGGER.error(
                "Version mismatch! Your plate: %s - openHASP Component: %s",
                version,
                f"{MAJOR}.{MINOR}.x",
            )
            raise data_entry_flow.AbortFlow("mismatch_version")

        self.config_data[DISCOVERED_VERSION] = version

        self.config_data[CONF_HWID] = _discovered[DISCOVERED_HWID] 
        self.config_data[CONF_NODE] = self.config_data[CONF_NAME] = _discovered[
            DISCOVERED_NODE
        ]
        self.config_data[
            CONF_TOPIC
        ] = f"{discovery_info.topic.split('/')[0]}/{self.config_data[CONF_NODE]}"

        self.config_data[DISCOVERED_URL] = _discovered.get(DISCOVERED_URL)
        self.config_data[DISCOVERED_MANUFACTURER] = _discovered.get(
            DISCOVERED_MANUFACTURER
        )
        self.config_data[DISCOVERED_MODEL] = _discovered.get(DISCOVERED_MODEL)
        self.config_data[CONF_PAGES] = _discovered.get(DISCOVERED_PAGES)
        self.config_data[CONF_RELAYS] = _discovered.get(DISCOVERED_POWER)
        self.config_data[CONF_LIGHTS] = _discovered.get(DISCOVERED_LIGHT)
        self.config_data[CONF_DIMLIGHTS] = _discovered.get(DISCOVERED_DIM)
        self.config_data[CONF_INPUT] = _discovered.get(DISCOVERED_INPUT)

        return await self.async_step_personalize()

    async def async_step_personalize(self, user_input=None):
        """Handle a flow initialized by the user."""
        self._errors = {}

        if user_input is not None:
            self.config_data = {**self.config_data, **user_input}

            if self.config_data[
                CONF_NAME
            ] not in self.hass.config_entries.async_entries(DOMAIN):
                # Remove / from base topic
                if user_input[CONF_TOPIC].endswith("/"):
                    user_input[CONF_TOPIC] = user_input[CONF_TOPIC][:-1]

                try:
                    valid_subscribe_topic(self.config_data[CONF_TOPIC])

                    if CONF_PAGES_PATH in user_input:
                        self.config_data[CONF_PAGES_PATH] = validate_jsonl(
                            user_input[CONF_PAGES_PATH]
                        )

                    await self.async_set_unique_id(self.config_data[CONF_HWID])

                    return self.async_create_entry(
                        title=user_input[CONF_NAME], data=self.config_data
                    )

                except vol.Invalid:
                    return self.async_abort(reason="invalid_discovery_info")

                except InvalidJSONL:
                    self._errors[CONF_PAGES_PATH] = "invalid_jsonl_path"
            else:
                self._errors[CONF_NAME] = "name_exists"

        return self.async_show_form(
            step_id="personalize",
            data_schema=vol.Schema(
                {
                    vol.Required(
                        CONF_TOPIC, default=self.config_data.get(CONF_TOPIC, "hasp")
                    ): str,
                    vol.Required(
                        CONF_NAME, default=self.config_data.get(CONF_NAME)
                    ): str,
                    vol.Optional(
                        CONF_IDLE_BRIGHTNESS, default=DEFAULT_IDLE_BRIGHNESS
                    ): vol.All(int, vol.Range(min=0, max=255)),
                    vol.Optional(CONF_PAGES_PATH): str,
                }
            ),
            errors=self._errors,
        )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry):
        """Set the OptionsFlowHandler."""
        return OpenHASPOptionsFlowHandler(config_entry)


class OpenHASPOptionsFlowHandler(config_entries.OptionsFlow):
    """ConfigOptions flow for openHASP."""

    def __init__(self, config_entry):
        """Initialize openHASP options flow."""
        self.config_entry = config_entry

    async def async_step_init(self, user_input=None):
        """Manage the options."""
        if user_input is not None:
            # Actually check path is a file

            try:
                if len(user_input[CONF_PAGES_PATH]):
                    user_input[CONF_PAGES_PATH] = validate_jsonl(
                        user_input[CONF_PAGES_PATH]
                    )
            except InvalidJSONL:
                return self.async_abort(reason="invalid_jsonl_path")

            return self.async_create_entry(title="", data=user_input)

        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema(
                {
                    vol.Optional(
                        CONF_IDLE_BRIGHTNESS,
                        default=self.config_entry.options.get(
                            CONF_IDLE_BRIGHTNESS,
                            self.config_entry.data[CONF_IDLE_BRIGHTNESS],
                        ),
                    ): vol.All(int, vol.Range(min=0, max=255)),
                    vol.Optional(
                        CONF_PAGES_PATH,
                        default=self.config_entry.options.get(
                            CONF_PAGES_PATH,
                            self.config_entry.data.get(CONF_PAGES_PATH, ""),
                        ),
                    ): cv.string,
                }
            ),
        )


class InvalidJSONL(exceptions.HomeAssistantError):
    """Error to indicate we cannot load JSONL."""
