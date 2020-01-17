# -*- coding: utf-8 -*-

import sys
import os
import requests as rq
import json
import re
from bs4 import BeautifulSoup
from dateutil.parser import *
from dateutil.tz import tzlocal

_url = 'https://www.meteoalarm.eu/en_UK/%d/0/%s.html'
_fmt = '%d.%m.%Y %H:%M %Z'
_map = {
  'today': 0,
  'tomorrow': 1,
}

def get_info(t):
  ret = {}
  info = t.find_all(class_='info')
  if info:
    m = re.findall(r'(\d.*?CET)', info[0].get_text())
    i = re.match(r'(?P<event>.*\w).*Awareness.*:.*?(?P<code>\w+)', info[1].get_text())
    if len(m) == 2 and i:
      ret['event'] = i.group('event')
      ret['code'] = i.group('code')
      ret['start'] = parse(m[0], tzinfos={'CET': +3600}, dayfirst=True).astimezone(tzlocal()).strftime(_fmt)
      ret['end'] =  parse(m[1], tzinfos={'CET': +3600}, dayfirst=True).astimezone(tzlocal()).strftime(_fmt)

      _desc = t.find_all(class_='text')[0].get_text()

      d = {}

      for m in re.finditer(r'^(?P<lang>.*):\s*(?P<desc>.*)', _desc, re.M):
        d.update({m.group('lang'): m.group('desc')})

      if not d:
        ret.update({'txt': _desc.strip()})

      ret.update(d)

  return ret

def find_warn(c):
  return c and 'warnbox' in c

def fetch_data(reg_id):
  ret = {
      'count': 0,
    }

  for s, d in _map.items():
    r = rq.get(_url % (d, reg_id))
    if r.status_code != rq.codes.ok:
      return None
    soup = BeautifulSoup(r.text, 'html.parser')
    evts = []
    for w in soup.find_all(class_=find_warn):
      r = get_info(w)
      if r:
        ret['count'] += 1
        evts.append(r)
    if evts:
      if 'events' not in ret:
        ret['events'] = {'today': [], 'tomorrow': []}
      ret['events'][s].extend(evts)

  return ret

if __name__ == '__main__':
  if len(sys.argv) == 1:
    print ('Usage %s <id_location>' % sys.argv[0])
    sys.exit(1)
  print ('Id: %s' % sys.argv[1])
  d = fetch_data(sys.argv[1])
  print (d)
  sys.exit(0)
else:
  import logging
  import voluptuous as vol
  import homeassistant.helpers.config_validation as cv
  from datetime import timedelta
  from homeassistant.helpers.entity import Entity
  from homeassistant.components.sensor import PLATFORM_SCHEMA
  from homeassistant.const import (
    ATTR_ATTRIBUTION, CONF_NAME
  )

  _LOGGER = logging.getLogger(__name__)

  CONF_ID_LOC = 'id'
  CONF_ATTRIBUTION = 'Data provided by meteoalarm.eu'
  ICON = 'mdi:weather-lightning-rainy'
  SCAN_INTERVAL = timedelta(seconds=3600)
  DEFAULT_NAME = 'meteo_alarm'

  PLATFORM_SCHEMA = PLATFORM_SCHEMA.extend({
    vol.Required(CONF_ID_LOC): cv.string,
    vol.Optional(CONF_NAME, default=DEFAULT_NAME): cv.string,
  })

  def setup_platform(hass, config, add_entities, discovery_info=None):
    """Set up the MeteoAlarm sensor."""
    add_entities([
        MeteoAlarm(config.get(CONF_ID_LOC), config.get(CONF_NAME)),
    ])

  class MeteoAlarm(Entity):
    """Representation of a MeteoAlarm sensor."""

    def __init__(self, _id, name):
      """Initialize the sensor."""
      self._id = _id
      self._fetch = fetch_data
      self._data = self._fetch(self._id)
      self._unit_of_measurement = 'events' 
      self._location = self._id.split('-')[1].lower()
      self._name = name

    @property
    def should_poll(self):
      """No polling needed for a demo sensor."""
      return True

    @property
    def name(self):
      """Return the name of the sensor."""
      return self._name

    @property
    def state(self):
      """Return the state of the sensor."""
      return str(self._data['count'])

    @property
    def unit_of_measurement(self):
      """Return the unit this state is expressed in."""
      return self._unit_of_measurement

    @property
    def icon(self):
      """Return icon."""
      return ICON

    @property
    def device_state_attributes(self):
      """Return the state attributes."""
      attr = {
           ATTR_ATTRIBUTION: CONF_ATTRIBUTION,
           'location': self._location
         }

      if self._data['count']:
        attr.update(self._data['events'])

      return attr

    def update(self):
      """Get the latest data from MeteoAlarm API."""
      try:
        self._data = self._fetch(self._id)
        _LOGGER.debug("Data = %s", self._data)
      except ValueError as err:
        _LOGGER.error("Check MeteoAlarm %s", err.args)
        raise
