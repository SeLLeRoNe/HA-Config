"""Config flow for meteoalarmeu integration."""
import logging

import homeassistant.helpers.config_validation as cv
import voluptuous as vol
from homeassistant import config_entries, core, exceptions
from homeassistant.const import CONF_NAME

from .client import AWARENESS_TYPES as AWARENESS_TYPES_API
from .client import COUNTRIES as COUNTRIES_API
from .client import LANGUAGES as LANGUAGES_API
from .client import (
    MeteoAlarmUnavailableLanguageError,
    MeteoAlarmUnrecognizedCountryError,
    MeteoAlarmUnrecognizedRegionError,
    get_languages,
    get_regions,
)
from .const import DOMAIN  # pylint:disable=unused-import
from .const import (
    CONF_AWARENESS_TYPES,
    CONF_COUNTRY,
    CONF_LANGUAGE,
    CONF_REGION,
    DEFAULT_LANGUAGE,
    DEFAULT_NAME,
)

COUNTRIES = COUNTRIES_API
LANGUAGES = [DEFAULT_LANGUAGE]
LANGUAGES.extend(LANGUAGES_API)
DEFAULT_AWARENESS_TYPES = sorted(list(AWARENESS_TYPES_API))

_LOGGER = logging.getLogger(__name__)


class ConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for meteoalarmeu."""

    VERSION = 1
    CONNECTION_CLASS = config_entries.CONN_CLASS_CLOUD_POLL

    def __init__(self):
        self._name = DEFAULT_NAME

    async def async_step_user(self, user_input=None):
        """Handle the initial step."""
        errors = {}

        if user_input is not None:
            try:
                info = await self.validate_input(self.hass, user_input)

                # Set 'unique_id' and abort flow if already configured
                await self.async_set_unique_id(self._name)
                self._abort_if_unique_id_configured()

                return self.async_create_entry(title=info[CONF_NAME], data=info)
            except MeteoAlarmUnrecognizedCountryError:
                errors["country"] = "unrecognized_country"
            except MeteoAlarmUnrecognizedRegionError:
                errors["region"] = "unrecognized_region"
            except MeteoAlarmUnavailableLanguageError:
                errors["language"] = "not_available_language"
            except InvalidAwarenessType:
                errors["awareness_type"] = "invalid_awareness_type"
            except exceptions.HomeAssistantError:
                return self.async_abort(reason="already_configured")
            except Exception:  # pylint: disable=broad-except
                _LOGGER.exception("Unexpected exception")
                errors["base"] = "unknown"

        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_COUNTRY): vol.In(COUNTRIES),
                    vol.Required(CONF_REGION): str,
                    vol.Optional(CONF_LANGUAGE, default=DEFAULT_LANGUAGE): vol.In(
                        LANGUAGES
                    ),
                    vol.Optional(
                        CONF_AWARENESS_TYPES, default=DEFAULT_AWARENESS_TYPES
                    ): cv.multi_select(DEFAULT_AWARENESS_TYPES),
                }
            ),
            errors=errors,
        )

    async def validate_input(self, hass: core.HomeAssistant, data):
        """Validate country, region, language and list of awareness_types."""
        if data[CONF_COUNTRY] not in COUNTRIES:
            raise MeteoAlarmUnrecognizedCountryError

        data[CONF_REGION] = data[CONF_REGION].strip("'\"")
        regions = await hass.async_add_executor_job(get_regions, data[CONF_COUNTRY])
        if data[CONF_REGION] not in regions:
            raise MeteoAlarmUnrecognizedRegionError

        languages = await hass.async_add_executor_job(get_languages, data[CONF_COUNTRY])
        if data[CONF_LANGUAGE] and data[CONF_LANGUAGE] not in languages:
            raise MeteoAlarmUnavailableLanguageError

        for awt in data[CONF_AWARENESS_TYPES]:
            if awt not in DEFAULT_AWARENESS_TYPES:
                raise InvalidAwarenessType

        # Add 'name'
        data[CONF_NAME] = self._name

        # Return info that you want to store in the config entry.
        return {
            CONF_COUNTRY: data[CONF_COUNTRY],
            CONF_REGION: data[CONF_REGION],
            CONF_LANGUAGE: data[CONF_LANGUAGE],
            CONF_NAME: data[CONF_NAME],
            CONF_AWARENESS_TYPES: data[CONF_AWARENESS_TYPES],
        }


# pylint:disable=too-few-public-methods
class InvalidAwarenessType(exceptions.HomeAssistantError):
    """Error to indicate there is invalid awareness type."""
