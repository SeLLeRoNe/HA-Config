"""Interface for 'library API' (meteoalarm-rssapi)."""
import logging

from homeassistant.helpers.template import forgiving_as_timestamp as as_timestamp
from homeassistant.helpers.template import timestamp_local
from meteoalarm_rssapi import MeteoAlarmException  # pylint:disable=unused-import
from meteoalarm_rssapi import get_languages  # pylint:disable=unused-import
from meteoalarm_rssapi import get_regions  # pylint:disable=unused-import
from meteoalarm_rssapi import (
    MeteoAlarm,
    MeteoAlarmUnavailableLanguageError,
    MeteoAlarmUnrecognizedCountryError,
    MeteoAlarmUnrecognizedRegionError,
)
from meteoalarm_rssapi import awareness_types as _awareness_types
from meteoalarm_rssapi import countries_list as _countries_list
from meteoalarm_rssapi import languages_list as _languages_list

AWARENESS_LEVELS = ("Red", "Orange", "Yellow")  # only these are relevant!
AWARENESS_TYPES = _awareness_types
COUNTRIES = _countries_list
LANGUAGES = _languages_list

_LOGGER = logging.getLogger(__name__)

TIMEOUT = 9


# pylint: disable=too-many-arguments
class Client:
    """Interface for 'library API' (meteoalarm-rssapi)."""

    def __init__(
        self,
        country,
        region,
        language=None,
        awareness_types=AWARENESS_TYPES,
        awareness_levels=AWARENESS_LEVELS,
    ):
        self._country = country
        self._region = region
        self._language = language
        self._awareness_types = awareness_types or AWARENESS_TYPES
        self._awareness_levels = awareness_levels or AWARENESS_LEVELS
        self._api = self._get_api()

    def update(
        self,
        country=None,
        region=None,
        language=None,
        awareness_types=None,
        awareness_levels=None,
    ):
        """Update client with new parameters."""
        if not any(country, region, language, awareness_types):
            return
        self._country = country or self._country
        self._region = region or self._region
        self._language = language or self._language
        self._awareness_types = awareness_types or self._awareness_types
        self._awareness_levels = awareness_levels or self._awareness_levels
        self._api = self._get_api()

    def _get_api(self):
        try:
            return MeteoAlarm(
                self._country, self._region, self._language, timeout=TIMEOUT
            )
        except MeteoAlarmUnrecognizedCountryError:
            _LOGGER.debug("Unrecognized country (%s)", self._country)
            raise MeteoAlarmUnrecognizedCountryError()
        except MeteoAlarmUnrecognizedRegionError:
            _LOGGER.debug(
                "Unrecognized region (%s) for this country (%s)",
                self._region,
                self._country,
            )
            raise MeteoAlarmUnrecognizedRegionError()
        except MeteoAlarmUnavailableLanguageError:
            _LOGGER.debug(
                "Unrecognized language (%s) for this country (%s)",
                self._language,
                self._country,
            )
            raise MeteoAlarmUnavailableLanguageError()

    @staticmethod
    def languages():
        """Return the list of available languages."""
        return _languages_list

    @staticmethod
    def countries():
        """Return the list of participating countries."""
        return _countries_list

    def languages_for_country(self):
        """Return languages for country."""
        return self._api.country_languages()

    def _filter(self, alarms):
        """Filter messages by event and severity user choices."""
        return [
            m
            for m in alarms
            if m["awareness_type"] in self._awareness_types
            and m["awareness_level"] in self._awareness_levels
        ]

    @staticmethod
    def _local_ts(iso_ts):
        """Change to local date/time and drop the seconds."""
        return timestamp_local(as_timestamp(iso_ts))[:-3]

    @staticmethod
    def _localize(alarm):
        success = False
        try:
            ts_from = Client._local_ts(alarm["from"])
            ts_until = Client._local_ts(alarm["until"])
            ts_published = Client._local_ts(alarm["published"])
            success = True
        except ValueError:
            _LOGGER.error("Not possible to convert to local time")
        if success:
            alarm["from"] = ts_from
            alarm["until"] = ts_until
            alarm["published"] = ts_published
        return alarm

    def alerts(self):
        """Get localized and filtered alerts."""
        alarms = self._api.alerts()
        if alarms:
            alarms = self._filter(alarms)
            alarms = [Client._localize(alarm) for alarm in alarms]
        return alarms
