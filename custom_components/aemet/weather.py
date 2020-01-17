"""
Weather support for AEMET (Agencia Estatal de Metereología) data service.
"""

DOMAIN='aemet'

from logging import getLogger
import voluptuous as vol

_LOGGER = getLogger(__name__)

from homeassistant.components.weather import (
    ATTR_WEATHER_HUMIDITY, 
    ATTR_WEATHER_PRESSURE, 
    ATTR_WEATHER_TEMPERATURE,
    ATTR_WEATHER_VISIBILITY,
    PLATFORM_SCHEMA,
    WeatherEntity,
)
from homeassistant.const import (
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
    ATTR_WEATHER_WIND_BEARING,
    CONF_ATTRIBUTION, 
    CONF_STATION_ID
)

DEFAULT_NAME = 'AEMET'

PLATFORM_SCHEMA = PLATFORM_SCHEMA.extend({
    vol.Optional(CONF_NAME, default=DEFAULT_NAME): cv.string,
    vol.Required(CONF_API_KEY): cv.string,
    vol.Required(CONF_STATION_ID): cv.string,
})

def setup_platform(hass, config, add_entities, discovery_info=None):
    """Set up the weather platform."""
    name = config.get(CONF_NAME)
    api_key = config.get(CONF_API_KEY)
    station_id = config.get(CONF_STATION_ID)

    aemetApi = AemetApi(api_key=api_key, station_id=station_id)
    try:
        aemetApi.update()
    except (ValueError, TypeError) as err:
        _LOGGER.error("Received error from AEMET: %s", err)
        return False

    add_entities([AemetWeather(aemetApi, name)], True)


class AemetWeather(WeatherEntity):
    """Representation of a weather condition."""

    def __init__(self, aemetApi, name):
        """Initialize"""
        self._aemetApi = aemetApi
        self._client_name = name

    @property
    def available(self):
        """Return if weather data is available from Aemet."""
        return True #self._ds_data is not None

    @property
    def attribution(self):
        """Return the attribution."""
        return CONF_ATTRIBUTION

    @property
    def name(self):
        """Return the name."""
        return self._client_name

    @property
    def temperature(self):
        """Return the temperature."""
        return self._aemetApi.get_data(ATTR_WEATHER_TEMPERATURE)

    @property
    def temperature_unit(self):
        """Return the unit of measurement."""
        return TEMP_CELSIUS

    @property
    def humidity(self):
        """Return the humidity."""
        return self._aemetApi.get_data(ATTR_WEATHER_HUMIDITY)

    @property
    def wind_speed(self):
        """Return the wind speed."""
        return self._aemetApi.get_data(ATTR_WEATHER_WIND_SPEED)

    @property
    def wind_bearing(self):
        """Return the wind bearing."""
        return self._aemetApi.get_data(ATTR_WEATHER_WIND_BEARING)

    @property
    def ozone(self):
        """Return the ozone level."""
        return None

    @property
    def pressure(self):
        """Return the pressure."""
        return self._aemetApi.get_data(ATTR_WEATHER_PRESSURE)

    @property
    def visibility(self):
        """Return the visibility."""
        return self._aemetApi.get_data(ATTR_WEATHER_VISIBILITY)

    @property
    def condition(self):
        """Return the weather condition."""
        return None

    @property
    def forecast(self):
        """Return the forecast array."""
        return None

    def update(self):
        """Get the latest data from Aemet."""
        self._aemetApi.update()