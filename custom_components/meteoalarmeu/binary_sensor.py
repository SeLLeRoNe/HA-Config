"""Binary Sensor for MeteoAlarmEU."""
import logging
from datetime import timedelta

from homeassistant.components.binary_sensor import (
    DEVICE_CLASS_SAFETY,
    BinarySensorEntity,
)
from homeassistant.const import ATTR_ATTRIBUTION, CONF_NAME

from .client import (
    Client,
    MeteoAlarmException,
    MeteoAlarmUnavailableLanguageError,
    MeteoAlarmUnrecognizedRegionError,
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

SCAN_INTERVAL = timedelta(minutes=SCAN_INTERVAL_MINUTES)

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(hass, config_entry, async_add_entities):
    """Add a meteoalarmeu entity from a config_entry."""

    country = config_entry.data.get(CONF_COUNTRY)
    region = config_entry.data.get(CONF_REGION)
    language = config_entry.data.get(CONF_LANGUAGE)
    name = config_entry.data.get(CONF_NAME)
    awareness_types = config_entry.data.get(CONF_AWARENESS_TYPES)

    try:
        api = Client(country, region, language, awareness_types)
    except MeteoAlarmUnrecognizedRegionError:
        _LOGGER.error("Wrong region name (check 'meteoalarm.eu' for the EXACT name)")
    except MeteoAlarmUnavailableLanguageError:
        _LOGGER.error(
            "'%s' language is unavailable for country '%s'", language, country
        )
    except (KeyError, MeteoAlarmException):
        _LOGGER.error("Wrong country code or region name")
        return

    entities = [MeteoAlarmBinarySensor(api, name)]

    if entities:
        async_add_entities(entities)


class MeteoAlarmBinarySensor(BinarySensorEntity):
    """Representation of a MeteoAlarmEU binary sensor."""

    def __init__(self, api, name):
        """Initialize the MeteoAlarmEU binary sensor."""
        self._name = name
        self._attributes = {"alerts": 0}
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

    def update(self):
        """Update device state."""
        try:
            alerts = self._api.alerts()
        except (KeyError, MeteoAlarmException):
            _LOGGER.error("Bad response from meteoalarm.eu")
            self._available = False
            self._state = False
            return
        if not self._available:
            _LOGGER.info("Server meteoalarm.eu is now OK")
        self._available = True
        alarms = {}
        alarms["alerts"] = 0
        if alerts:
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
