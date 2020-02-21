#https://gist.github.com/jeromer/2005586
def calculate_initial_compass_bearing(pointA, pointB):
    """
    Calculates the bearing between two points.
    The formulae used is the following:
        θ = atan2(sin(Δlong).cos(lat2),
                  cos(lat1).sin(lat2) − sin(lat1).cos(lat2).cos(Δlong))
    :Parameters:
      - `pointA: The tuple representing the latitude/longitude for the
        first point. Latitude and longitude must be in decimal degrees
      - `pointB: The tuple representing the latitude/longitude for the
        second point. Latitude and longitude must be in decimal degrees
    :Returns:
      The bearing in degrees
    :Returns Type:
      float
    """
    lat1 = math.radians(pointA[0])
    lat2 = math.radians(pointB[0])
    lon1 = math.radians(pointA[1])
    lon2 = math.radians(pointB[1])

    diffLong = math.radians(pointB[1] - pointA[1])

    x = math.sin(diffLong) * math.cos(lat2)
    y = math.cos(lat1) * math.sin(lat2) - (math.sin(lat1)
            * math.cos(lat2) * math.cos(diffLong))

    initial_bearing = math.atan2(x, y)

    # Now we have the initial bearing but math.atan2 return values
    # from -180° to + 180° which is not what we want for a compass bearing
    # The solution is to normalize the initial bearing as shown below
    initial_bearing = math.degrees(initial_bearing)
    compass_bearing = (initial_bearing + 360) % 360

    bx = math.cos(lat2) * math.cos(lon2 - lon1)
    by = math.cos(lat2) * math.sin(lon2 - lon1)
    lat3 = math.atan2(math.sin(lat1) + math.sin(lat2), \
           math.sqrt((math.cos(lat1) + bx) * (math.cos(lat1) \
           + bx) + by**2))
    lon3 = lon1 + math.atan2(by, math.cos(lat1) + bx)

    return compass_bearing, round(math.degrees(lat3), 6), round(math.degrees(lon3), 6)

def generate_tracker_view(h, calc, name, c, o, d):

      map_pz = [
                  {'d': 0.01, 'z': 17.5, 'p': 5, 'b': 0},
                  {'d': 0.02, 'z': 17.25, 'p': 10, 'b': 0},
                  {'d': 0.03, 'z': 17, 'p': 20, 'b': 0},
                  {'d': 0.04, 'z': 18, 'p': 25},
                  {'d': 0.05, 'z': 18, 'p': 30},
                  {'d': 0.09, 'z': 18, 'p': 35},
                  {'d': 0.15, 'z': 17, 'p': 40},
                  {'d': 0.20, 'z': 17, 'p': 45},
                  {'d': 0.36, 'z': 16, 'p': 50},
                  {'d': 0.80, 'z': 15, 'p': 55},
                  {'d': 1.50, 'z': 14, 'p': 60},
                ]

      zoom = 'auto'
      pitch = 0

      if d > 0.03:
          hide = False
      else:
          hide = True

      curr = (c.get('latitude'), c.get('longitude'))
      other = (o.get('latitude', curr[0]), o.get('longitude', curr[1]))

      bearing, lat_m, lon_m = calc(curr, other)

      for m in map_pz:
          if d < m.get('d'):
              zoom = m.get('z')
              pitch = m.get('p')
              bearing = m.get('b', bearing)
              break

      if d < 3:
          d = round((d * 1000), 1)
          unit = 'm'
      else:
          d = round(d, 1)
          unit = 'km'

      h.states.set(
                          'sensor.view_' + name,
                          d,
                          {
                              'friendly_name': 'diff',
                              'c_latitude': curr[0],
                              'c_longitude': curr[1],
                              'o_latitude': other[0],
                              'o_longitude': other[1],
                              'm_latitude': lat_m,
                              'm_longitude':lon_m,
                              'zoom': zoom,
                              'bearing': bearing,
                              'pitch': pitch,
                              'hidden': hide,
                              'unit_of_measurement': unit,
                          }
                      )

# merge device device_tracker based on last update time
device_name = data.get('device_name')
track_name = 'device_tracker.' + device_name
master_device = data.get('master_device')
slave_device = data.get('slave_device')
trigger = data.get('trigger_id')
time = float(data.get('time', 120))
accuracy = float(data.get('accuracy', 50))
force_update = float(data.get('force_update', 120))

distance = data.get('distance', 'None')
if distance != 'None':
    distance = float(distance)
else:
    distance = 0.05

now = datetime.datetime.utcnow()
master = hass.states.get(master_device)
slave = hass.states.get(slave_device)
batt = master.attributes.get('battery_level', 33)

track_dev = hass.states.get(track_name)
if track_dev:
    last_update = track_dev.attributes.get('last_update', now)
    accu_dev = track_dev.attributes.get('gps_accuracy', 50)
else:
    last_update = now
    accu_dev = 500

diff = (now - last_update).total_seconds()

logger.info("Enter: {}\ntime: {}\nnow:  {}\nlast: {}\n{} -> {}\ndiff: {}".format(device_name, time, now, last_update, trigger, master_device, diff))

if trigger == slave_device and diff > time:
    logger.info("Use: %s" % (slave_device))
    attr = slave.attributes
    attr_other = master.attributes
    state = slave.state
    batt = attr.get('battery_level', 23)
else:
    logger.info("Use: %s" % (master_device))
    attr = master.attributes
    attr_other = slave.attributes
    state = master.state
    if diff > time:
        last_update = now
    batt = attr.get('battery_level', 13)

if not batt:
    batt = attr_other.get('battery_level', 3)

accu_curr = int(attr.get('gps_accuracy', 50))

if (
      trigger == master_device or
      accuracy > accu_curr or
      accu_dev > accu_curr or
      diff > force_update
    ):

    generate_tracker_view(
                            hass,
                            calculate_initial_compass_bearing,
                            device_name,
                            attr,
                            attr_other,
                            distance
                          )

    hass.states.set(track_name, state, {
          'friendly_name': device_name,
          'source_type': attr.get('source_type'),
          'battery_level': batt,
          'charging': attr.get('battery_charging', attr_other.get('battery_charging', 'false')),
          'gps_accuracy': accu_curr,
          'latitude': attr.get('latitude'),
          'longitude': attr.get('longitude'),
          'icon': attr.get('icon'),
          'last_update': last_update,
      })
    logger.info("Update: {}".format(device_name))
else:
    logger.info("Skip update: {} accu: {}".format(device_name, attr.get('gps_accuracy')))

logger.info("Exit: {}".format(device_name))
