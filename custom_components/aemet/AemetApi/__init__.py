import requests
import urllib3
from datetime import timedelta
from logging import getLogger
from homeassistant.util import Throttle

_LOGGER = getLogger(__name__)

requests.packages.urllib3.disable_warnings()
requests.packages.urllib3.util.ssl_.DEFAULT_CIPHERS += ":HIGH:!DH:!aNULL"
try:
    requests.packages.urllib3.contrib.pyopenssl.util.ssl_.DEFAULT_CIPHERS += (
        ":HIGH:!DH:!aNULL"
    )
except AttributeError:
    # no pyopenssl support used / needed / available
    pass

from homeassistant.components.weather import (
    ATTR_WEATHER_HUMIDITY, 
    ATTR_WEATHER_PRESSURE, 
    ATTR_WEATHER_TEMPERATURE,
    ATTR_WEATHER_VISIBILITY
)
from homeassistant.const import (
    ATTR_LATITUDE, 
    ATTR_LONGITUDE, 
    HTTP_OK
)

ATTR_ELEVATION = 'elevation'
ATTR_LAST_UPDATE = 'last_update'
ATTR_STATION_NAME = 'station_name'
ATTR_WEATHER_PRECIPITATION = 'precipitation'
ATTR_WEATHER_SNOW = 'snow'
ATTR_WEATHER_WIND_SPEED = 'wind_speed'
ATTR_WEATHER_WIND_MAX_SPEED = 'wind_max_speed'
ATTR_WEATHER_WIND_BEARING = 'wind_bearing'

ATTR_MAPPINGS = {
    ATTR_LONGITUDE: 'lon',
    ATTR_LATITUDE: 'lat',
    ATTR_ELEVATION: 'alt',
    ATTR_STATION_NAME: 'ubi',
    ATTR_WEATHER_PRECIPITATION: 'prec',
    ATTR_WEATHER_PRESSURE: 'pres',
    ATTR_WEATHER_TEMPERATURE: 'ta',
    ATTR_WEATHER_HUMIDITY: 'hr',
    ATTR_LAST_UPDATE: 'fint',
    ATTR_WEATHER_VISIBILITY: 'vis',
    ATTR_WEATHER_SNOW: 'nieve',
    ATTR_WEATHER_WIND_SPEED: 'vv',
    ATTR_WEATHER_WIND_MAX_SPEED: 'vmax',
    ATTR_WEATHER_WIND_BEARING: 'dv'
}

MS_TO_KMH_ATTRS = [ATTR_WEATHER_WIND_SPEED, ATTR_WEATHER_WIND_MAX_SPEED]

CONF_ATTRIBUTION = 'Data provided by AEMET'
CONF_STATION_ID = 'station_id'

MIN_TIME_BETWEEN_UPDATES = timedelta(seconds=60)

class AemetApi:
    """Get the lastest data and updates the states."""
    API_URL_BASE = 'https://opendata.aemet.es/opendata/api'
    API_STATION_ENDPOINT = '/observacion/convencional/datos/estacion/{}'

    def __init__(self, api_key, station_id):
        """Initialize the data object."""
        self._station_id = station_id
        self._api_key = api_key
        self.data = {}

    @Throttle(MIN_TIME_BETWEEN_UPDATES)
    def update(self):
        """Fetch new state data for the sensor."""
        _LOGGER.debug("------- Updating AEMET sensor")

        endpoint_url = "{}{}".format(
                            self.API_URL_BASE,
                            self.API_STATION_ENDPOINT.format(self._station_id)
                        )
        params = {'api_key': self._api_key}
        main_rsp = requests.get(endpoint_url, params=params, verify=False)
        if main_rsp.status_code != HTTP_OK:
            _LOGGER.error("Invalid response: %s", main_rsp.status_code)
            return

        main_result = main_rsp.json()
        if main_result['estado'] == HTTP_OK:
            hashed_endpoint = main_result["datos"]
            data_rsp = requests.get(hashed_endpoint, verify=False)
            if data_rsp.status_code != HTTP_OK:
                _LOGGER.error("Invalid response: %s", data_rsp.status_code)
            data_result = data_rsp.json()
            last_update = data_result[-1]
            self.set_data(last_update)
            _LOGGER.debug(last_update)
        else:
            _LOGGER.error("Invalid response: %s", main_rsp.status_code)

    def set_data(self, record):
        """Set data using the last record from API."""
        state = {}
        for attr_name, attr_value in ATTR_MAPPINGS.items():
            if attr_value in record:
                state[attr_name] = record[attr_value]
        for attr in MS_TO_KMH_ATTRS:
            if attr in state:
                state[attr] = round(state[attr] * 3.6, 1) # m/s to km/h
        self.data = state

    def get_data(self, variable):
        """Get the data."""
        return self.data.get(variable)
