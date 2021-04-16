"""Config flow for meteoalarmeu integration."""
import logging

import homeassistant.helpers.config_validation as cv
import voluptuous as vol
from homeassistant import config_entries, exceptions
from homeassistant.const import CONF_NAME
from homeassistant.core import callback

from .client import AWARENESS_LEVELS as AWARENESS_LEVELS_API
from .client import AWARENESS_TYPES as AWARENESS_TYPES_API
from .client import get_languages, get_regions
from .const import DOMAIN  # pylint: disable=unused-import
from .const import (
    CONF_AWARENESS_LEVELS,
    CONF_AWARENESS_TYPES,
    CONF_COUNTRY,
    CONF_LANGUAGE,
    CONF_REGION,
    DEFAULT_LANGUAGE,
    DEFAULT_NAME,
)
from .resources import cmap, lmap, ui_countries_list, ui_languages_list

COUNTRIES = ui_countries_list
LANGUAGES = [DEFAULT_LANGUAGE]
LANGUAGES.extend(ui_languages_list)
DEFAULT_AWARENESS_TYPES = sorted(AWARENESS_TYPES_API)
DEFAULT_AWARENESS_LEVELS = AWARENESS_LEVELS_API

_LOGGER = logging.getLogger(__name__)


class ConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for meteoalarmeu."""

    VERSION = 1
    CONNECTION_CLASS = config_entries.CONN_CLASS_CLOUD_POLL

    def __init__(self):
        self._languages = LANGUAGES
        self._regions = [""]
        self._data = {}
        self._data[CONF_LANGUAGE] = DEFAULT_LANGUAGE
        self._data[CONF_NAME] = DEFAULT_NAME

    async def async_already_configured(self):
        for entry in self._async_current_entries():
            if entry.unique_id == DEFAULT_NAME:
                return True
        return False

    # pylint: disable=broad-except
    async def async_step_user(self, user_input=None):
        """Handle the initial step."""
        if await self.async_already_configured():
            return self.async_abort(reason="already_configured")

        errors = {}

        if user_input is not None:
            try:
                # Get 'country'
                self._data[CONF_COUNTRY] = user_input[CONF_COUNTRY]

                # Sync 'regions' and 'languages'
                self.async_get_regions()
                self.async_get_languages()

                # Next step
                return await self.async_step_other()

            except Exception:
                _LOGGER.exception("Unexpected exception")
                errors["base"] = "unknown"

        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_COUNTRY): vol.In(COUNTRIES),
                }
            ),
            errors=errors,
        )

    # pylint: disable=broad-except
    async def async_step_other(self, user_input=None):
        """Handle the final step."""
        errors = {}

        if user_input is not None:
            try:
                # Get the data from the form
                self._data.update(user_input)
            except Exception:
                _LOGGER.exception("Unexpected exception")
                errors["base"] = "unknown"
            if not errors:
                # Create entry
                return await self.async_handle_create_entry()

        return self.async_show_form(
            step_id="other",
            data_schema=vol.Schema(
                {
                    vol.Required(
                        CONF_REGION,
                    ): vol.In(self._regions),
                    vol.Optional(
                        CONF_LANGUAGE,
                    ): vol.In(self._languages),
                    vol.Optional(
                        CONF_AWARENESS_TYPES,
                        default=DEFAULT_AWARENESS_TYPES,
                    ): cv.multi_select(DEFAULT_AWARENESS_TYPES),
                    vol.Optional(
                        CONF_AWARENESS_LEVELS,
                        default=DEFAULT_AWARENESS_LEVELS,
                    ): cv.multi_select(DEFAULT_AWARENESS_LEVELS),
                }
            ),
            errors=errors,
        )

    async def async_handle_create_entry(self):
        try:
            # Set 'unique_id' and abort flow if already configured
            await self.async_set_unique_id(DEFAULT_NAME)
            self._abort_if_unique_id_configured()
        except exceptions.HomeAssistantError:
            return self.async_abort(reason="already_configured")

        # Convert 'country' and 'language' to ISO
        self._data[CONF_COUNTRY] = cmap(self._data[CONF_COUNTRY])
        self._data[CONF_LANGUAGE] = lmap(self._data[CONF_LANGUAGE])

        # Create new entry in 'core.config_entries'
        return self.async_create_entry(title=self._data[CONF_NAME], data=self._data)

    @callback
    def async_get_languages(self):
        """Get available languages for country if possible."""
        if self._data[CONF_COUNTRY]:
            self._languages = [DEFAULT_LANGUAGE]
            self._languages.extend(
                (lmap(l) for l in get_languages(cmap(self._data[CONF_COUNTRY])))
            )
        else:
            self._languages = LANGUAGES

    @callback
    def async_get_regions(self):
        """Get the regions of the country if possible."""
        if self._data[CONF_COUNTRY]:
            self._regions = get_regions(cmap(self._data[CONF_COUNTRY]))
        else:
            self._regions = [""]
