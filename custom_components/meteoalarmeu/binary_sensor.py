"""Binary Sensor for MeteoAlarmEU."""
import logging
from datetime import timedelta

from homeassistant.components.binary_sensor import (
    DEVICE_CLASS_SAFETY,
    BinarySensorEntity,
)
from homeassistant.const import ATTR_ATTRIBUTION, CONF_NAME
from homeassistant.helpers.entity import Entity
from homeassistant.helpers.template import forgiving_as_timestamp as as_timestamp
from homeassistant.helpers.template import timestamp_local
from homeassistant.util import slugify
from meteoalarm_rssapi import (
    MeteoAlarm,
    MeteoAlarmException,
    MeteoAlarmUnavailableLanguageError,
    MeteoAlarmUnrecognizedRegionError,
    awareness_types,
)

from .const import (
    ATTRIBUTION,
    CONF_AWARENESS_TYPES,
    CONF_COUNTRY,
    CONF_LANGUAGE,
    CONF_REGION,
    DEFAULT_NAME,
    DOMAIN,
    SCAN_INTERVAL_MINUTES,
)

DEFAULT_AWARENESS_TYPES = list(awareness_types)

SCAN_INTERVAL = timedelta(minutes=SCAN_INTERVAL_MINUTES)

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(hass, config_entry, async_add_entities):
    """Add a meteoalarmeu entity from a config_entry."""

    country = config_entry.data.get(CONF_COUNTRY)
    region = config_entry.data.get(CONF_REGION)
    language = config_entry.data.get(CONF_LANGUAGE)
    name = config_entry.data.get(CONF_NAME)
    atypes = config_entry.data.get(CONF_AWARENESS_TYPES, DEFAULT_AWARENESS_TYPES)

    try:
        api = MeteoAlarm(country, region, language)
    except MeteoAlarmUnrecognizedRegionError:
        _LOGGER.error("Wrong region name (check 'meteoalarm.eu' for the EXACT name)")
    except MeteoAlarmUnavailableLanguageError:
        _LOGGER.error(
            "'%s' language is unavailable for country '%s'", language, country
        )
    except (KeyError, MeteoAlarmException):
        _LOGGER.error("Wrong country code or region name")
        return

    entities = [MeteoAlarmBinarySensor(api, name, atypes)]

    if entities:
        async_add_entities(entities)
    pass


class MeteoAlarmBinarySensor(BinarySensorEntity):
    """Representation of a MeteoAlarmEU binary sensor."""

    def __init__(self, api, name, awareness_types):
        """Initialize the MeteoAlarmEU binary sensor."""
        self._name = name
        self._attributes = {"alerts": 0}
        #self._attributes = {}
        self._awareness_types = awareness_types
        self._state = None
        self._api = api
        self._available = True
        self._id = name

    @property
    def unique_id(self):
        """Return ID for sensor."""
        return self._id

    @property
    def name(self):
        """Return the name of the binary sensor."""
        return self._name

    @property
    def is_on(self):
        """Return the status of the binary sensor."""
        return self._state

    @property
    def device_state_attributes(self):
        """Return the state attributes."""
        self._attributes[ATTR_ATTRIBUTION] = ATTRIBUTION
        return self._attributes

    @property
    def device_class(self):
        """Return the device class of this binary sensor."""
        return DEVICE_CLASS_SAFETY

    @property
    def available(self):
        """Return true if the device is available."""
        return self._available

    # @property
    # def meteoalarmbinarysensor_id(self):
    #     return self._name.lower()

    def update(self):
        """Update device state."""
        try:
            msgs = self._api.alerts()
            alerts = [m for m in msgs if m["awareness_type"] in self._awareness_types]
        except (KeyError, MeteoAlarmException):
            _LOGGER.error("Bad response from meteoalarm.eu")
            self._available = False
            self._state = False
            return
        if not self._available:
            _LOGGER.info("meteoalarm.eu server is now OK")
        self._available = True
        alarms = {}
        alarms["alerts"] = 0
        if alerts:
            for alert in alerts:
                try:
                    # change to local date/time (drop the seconds)
                    alert["from"] = timestamp_local(as_timestamp(alert["from"]))[:-3]
                    alert["until"] = timestamp_local(as_timestamp(alert["until"]))[:-3]
                    alert["published"] = timestamp_local(
                        as_timestamp(alert["published"])
                    )[:-3]
                except ValueError:
                    _LOGGER.error("Not possible to convert to local time")
            nalerts = len(alerts)
            alarms = alerts[0]
            if nalerts > 1:
                more = {
                    k + "_" + str(i + 1): v
                    for i, alert in enumerate(alerts[1:])
                    for k, v in alert.items()
                }
                alarms.update(more)
            alarms["alerts"] = nalerts
            self._attributes = alarms
            self._state = True
        else:
            self._attributes = alarms
            self._state = False
