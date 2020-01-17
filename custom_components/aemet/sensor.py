"""
Sensor support for AEMET (Agencia Estatal de Metereología) data service.
"""

DOMAIN='aemet'

from logging import getLogger
import voluptuous as vol

_LOGGER = getLogger(__name__)

from homeassistant.components.sensor import PLATFORM_SCHEMA
from homeassistant.components.weather import (
    ATTR_WEATHER_HUMIDITY, 
    ATTR_WEATHER_PRESSURE, 
    ATTR_WEATHER_TEMPERATURE,
    ATTR_WEATHER_VISIBILITY,
)
from homeassistant.const import (
    ATTR_ATTRIBUTION, 
    ATTR_LATITUDE, 
    ATTR_LONGITUDE, 
    CONF_API_KEY,
    CONF_MONITORED_CONDITIONS, 
    CONF_NAME, 
    LENGTH_CENTIMETERS,
    LENGTH_KILOMETERS, 
    TEMP_CELSIUS
)
import homeassistant.helpers.config_validation as cv
from homeassistant.helpers.entity import Entity

from .AemetApi import (
    AemetApi,
    ATTR_ELEVATION, 
    ATTR_LAST_UPDATE, 
    ATTR_STATION_NAME, 
    ATTR_WEATHER_PRECIPITATION, 
    ATTR_WEATHER_SNOW, 
    ATTR_WEATHER_WIND_SPEED, 
    ATTR_WEATHER_WIND_MAX_SPEED, 
    ATTR_WEATHER_WIND_BEARING,
    CONF_ATTRIBUTION, 
    CONF_STATION_ID,
)

DEFAULT_NAME = 'AEMET'

SENSOR_TYPES = {
    ATTR_WEATHER_TEMPERATURE: ['Temperature', TEMP_CELSIUS, 'mdi:thermometer'],
    ATTR_WEATHER_HUMIDITY: ['Humidity', '%', 'mdi:water-percent'],
    ATTR_WEATHER_PRESSURE: ['Pressure', 'hPa', 'mdi:gauge'],
    ATTR_WEATHER_PRECIPITATION: ['Precipitation', 'mm', 'mdi:weather-pouring'],
    ATTR_WEATHER_SNOW: ['Snow', LENGTH_CENTIMETERS, 'mdi:snowflake'],
    ATTR_WEATHER_VISIBILITY: ['Visibility', LENGTH_KILOMETERS, 'mdi:eye'],
    ATTR_WEATHER_WIND_SPEED: ['Wind speed', 'km/h', 'mdi:weather-windy'],
    ATTR_WEATHER_WIND_MAX_SPEED: ['Wind max speed', 'km/h', 'mdi:weather-windy'],
    ATTR_WEATHER_WIND_BEARING: ['Wind bearing', 'degrees', 'mdi:compass'],
}

PLATFORM_SCHEMA = PLATFORM_SCHEMA.extend({
    vol.Optional(CONF_NAME, default=DEFAULT_NAME): cv.string,
    vol.Required(CONF_API_KEY): cv.string,
    vol.Required(CONF_STATION_ID): cv.string,
    vol.Optional(CONF_MONITORED_CONDITIONS, default=list(SENSOR_TYPES)):
    vol.All(cv.ensure_list, vol.Length(min=1), [vol.In(SENSOR_TYPES)]),
})

def setup_platform(hass, config, add_entities, discovery_info=None):
    """Set up the sensor platform."""
    name = config.get(CONF_NAME)
    api_key = config.get(CONF_API_KEY)
    station_id = config.get(CONF_STATION_ID)

    aemetApi = AemetApi(api_key=api_key, station_id=station_id)
    try:
        aemetApi.update()
    except (ValueError, TypeError) as err:
        _LOGGER.error("Received error from AEMET: %s", err)
        return False

    add_entities([AemetSensor(aemetApi, variable, name)
                  for variable in config[CONF_MONITORED_CONDITIONS]], True)


class AemetSensor(Entity):
    """Representation of a sensor in the AEMET service."""

    def __init__(self, aemetApi, variable, name):
        """Initialize the sensor."""
        self._aemetApi = aemetApi
        self._variable = variable
        self._client_name = name

    @property
    def name(self):
        """Return the name of the sensor."""
        return '{} {}'.format(self._client_name, self._variable)

    @property
    def state(self):
        """Return the state of the sensor."""
        return self._aemetApi.get_data(self._variable)

    @property
    def unit_of_measurement(self):
        """Return the unit of measurement of this entity, if any."""
        return SENSOR_TYPES[self._variable][1]

    @property
    def icon(self):
        """Return sensor specific icon."""
        return SENSOR_TYPES[self._variable][2]

    @property
    def device_state_attributes(self):
        """Return the device state attributes."""
        return {
            ATTR_ATTRIBUTION: CONF_ATTRIBUTION,
            ATTR_STATION_NAME: self._aemetApi.get_data(ATTR_STATION_NAME),
            ATTR_LATITUDE: self._aemetApi.get_data(ATTR_LATITUDE),
            ATTR_LONGITUDE: self._aemetApi.get_data(ATTR_LONGITUDE),
            ATTR_ELEVATION: self._aemetApi.get_data(ATTR_ELEVATION),
            ATTR_LAST_UPDATE: self._aemetApi.get_data(ATTR_LAST_UPDATE),
        }

    def update(self):
        """Delegate update to data class."""
        self._aemetApi.update()
