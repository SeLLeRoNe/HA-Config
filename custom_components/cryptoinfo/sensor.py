#!/usr/bin/env python3
"""
Sensor component for Cryptoinfo
Author: Johnny Visser

ToDo:
- Add documentation and reference to coingecko
- Add to hacs repo
https://api.coingecko.com/api/v3/simple/price?ids=neo&vs_currencies=usd
https://api.coingecko.com/api/v3/simple/price?ids=neo&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true
"""

import requests
import voluptuous as vol
from datetime import datetime, date, timedelta
import urllib.error

from .const.const import (
    _LOGGER,
    CONF_CRYPTOCURRENCY_NAME,
    CONF_CURRENCY_NAME,
    CONF_MULTIPLIER,
    CONF_UPDATE_FREQUENCY,
    SENSOR_PREFIX,
    ATTR_LAST_UPDATE,
    ATTR_VOLUME,
    ATTR_CHANGE,
    ATTR_MARKET_CAP,
    API_ENDPOINT,
    CONF_ID,
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
        vol.Required(CONF_MULTIPLIER, default=1): cv.string,
        vol.Required(CONF_UPDATE_FREQUENCY, default=60): cv.string,
        vol.Optional(CONF_ID, default = ""): cv.string,
    }
)


def setup_platform(hass, config, add_entities, discovery_info=None):
    _LOGGER.debug("Setup Cryptoinfo sensor")

    id_name = config.get(CONF_ID)
    cryptocurrency_name = config.get(CONF_CRYPTOCURRENCY_NAME).lower().strip()
    currency_name = config.get(CONF_CURRENCY_NAME).strip()
    multiplier = config.get(CONF_MULTIPLIER).strip()
    update_frequency = timedelta(minutes=(int(config.get(CONF_UPDATE_FREQUENCY))))

    entities = []

    try:
        entities.append(
            CryptoinfoSensor(
                cryptocurrency_name, currency_name, multiplier, update_frequency, id_name
            )
        )
    except urllib.error.HTTPError as error:
        _LOGGER.error(error.reason)
        return False

    add_entities(entities)

class CryptoinfoSensor(Entity):
    def __init__(
        self, cryptocurrency_name, currency_name, multiplier, update_frequency, id_name
    ):
        self.data = None
        self.cryptocurrency_name = cryptocurrency_name
        self.currency_name = currency_name
        self.multiplier = multiplier
        self.update = Throttle(update_frequency)(self._update)
        self._name = SENSOR_PREFIX + (id_name + " " if len(id_name) > 0  else "") + cryptocurrency_name + " " + currency_name
        self._icon = "mdi:bitcoin"
        self._state = None
        self._last_update = None
        self._volume = None
        self._change = None
        self._market_cap = None
        self._unit_of_measurement = "\u200b"

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
        return {ATTR_LAST_UPDATE: self._last_update, ATTR_VOLUME: self._volume, ATTR_CHANGE: self._change, ATTR_MARKET_CAP: self._market_cap }

    def _update(self):
        url = (
            API_ENDPOINT
            + "simple/price?ids="
            + self.cryptocurrency_name
            + "&vs_currencies="
            + self.currency_name
            + "&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true"
        )
        # sending get request
        r = requests.get(url=url)
        # extracting response json
        self.data = r.json()[self.cryptocurrency_name][self.currency_name]
        #multiply the price
        price_data = self.data * float(self.multiplier)

        try:
            if price_data:
                # Set the values of the sensor
                self._last_update = datetime.today().strftime("%d-%m-%Y %H:%M")
                self._state = float(price_data)
                # set the attributes of the sensor
                self._volume = r.json()[self.cryptocurrency_name][self.currency_name + "_24h_vol"]
                self._change = r.json()[self.cryptocurrency_name][self.currency_name + "_24h_change"]
                self._market_cap = r.json()[self.cryptocurrency_name][self.currency_name + "_market_cap"]
            else:
                raise ValueError()
        except ValueError:
            self._state = None
            self._last_update = datetime.today().strftime("%d-%m-%Y %H:%M")
            self._volume = None
            self._change = None
            self._market_cap = None
