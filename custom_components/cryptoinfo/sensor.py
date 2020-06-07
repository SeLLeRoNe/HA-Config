#!/usr/bin/env python3
"""
Sensor component for Cryptoinfo
Author: Johnny Visser

ToDo:
- Add documentation and reference to coingecko
- Add to hacs repo
https://api.coingecko.com/api/v3/simple/price?ids=neo&vs_currencies=usd
"""

import requests
import voluptuous as vol
from datetime import datetime, date, timedelta
import urllib.error

from .const.const import (
    _LOGGER,
    CONF_CRYPTOCURRENCY_NAME,
    CONF_CURRENCY_NAME,
    CONF_UPDATE_FREQUENCY,
    SENSOR_PREFIX,
    ATTR_LAST_UPDATE,
    API_ENDPOINT,
)

from homeassistant.components.sensor import PLATFORM_SCHEMA
import homeassistant.helpers.config_validation as cv
from homeassistant.const import CONF_RESOURCES
from homeassistant.util import Throttle
from homeassistant.helpers.entity import Entity

PLATFORM_SCHEMA = PLATFORM_SCHEMA.extend(
    {
        vol.Required(CONF_CRYPTOCURRENCY_NAME, default="bitcoin"): cv.string,
        vol.Required(CONF_CURRENCY_NAME, default="usd"): cv.string,
        vol.Required(CONF_UPDATE_FREQUENCY, default=60): cv.string,
    }
)


def setup_platform(hass, config, add_entities, discovery_info=None):
    _LOGGER.debug("Setup Cryptoinfo sensor")

    cryptocurrency_name = config.get(CONF_CRYPTOCURRENCY_NAME).lower().strip()
    currency_name = config.get(CONF_CURRENCY_NAME).strip()
    update_frequency = timedelta(minutes=(int(config.get(CONF_UPDATE_FREQUENCY))))

    entities = []

    try:
        data = CryptoinfoData(cryptocurrency_name, currency_name, update_frequency)
        entities.append(
            CryptoinfoSensor(data, cryptocurrency_name, currency_name, update_frequency)
        )
    except urllib.error.HTTPError as error:
        _LOGGER.error(error.reason)
        return False

    add_entities(entities)


class CryptoinfoData(object):
    def __init__(self, cryptocurrency_name, currency_name, update_frequency):
        self.data = None
        self.cryptocurrency_name = cryptocurrency_name
        self.currency_name = currency_name
        self.update = Throttle(update_frequency)(self._update)

    def _update(self):
        _LOGGER.debug("Updating Coingecko data")
        url = (
            API_ENDPOINT
            + "simple/price?ids="
            + self.cryptocurrency_name
            + "&vs_currencies="
            + self.currency_name
        )
        # sending get request
        r = requests.get(url=url)
        # extracting response json
        value = r.json()[self.cryptocurrency_name][self.currency_name]
        _LOGGER.debug(value)

        self.data = value


class CryptoinfoSensor(Entity):
    def __init__(self, data, cryptocurrency_name, currency_name, update_frequency):
        self.data = data
        self.cryptocurrency_name = cryptocurrency_name
        self.currency_name = currency_name
        self.update = Throttle(update_frequency)(self._update)
        self._name = SENSOR_PREFIX + cryptocurrency_name + " " + currency_name
        self._icon = "mdi:bitcoin"
        self._state = None
        self._last_update = None
        self._unit_of_measurement = ""

    @property
    def name(self):
        return self._name

    @property
    def icon(self):
        return self._icon

    @property
    def state(self):
        return self._state

    @property
    def unit_of_measurement(self):
        return self._unit_of_measurement

    @property
    def device_state_attributes(self):
        return {ATTR_LAST_UPDATE: self._last_update}

    def _update(self):
        self.data.update()
        price_data = self.data.data

        try:
            if price_data:
                # Set the values of the sensor
                self._last_update = datetime.today().strftime("%d-%m-%Y %H:%M")
                self._state = price_data
            else:
                raise ValueError()
        except ValueError:
            self._state = None
            self._last_update = datetime.today().strftime("%d-%m-%Y %H:%M")
