""""""
import json
from enum import IntEnum
import logging
import voluptuous as vol
import homeassistant.helpers.config_validation as cv
from homeassistant.helpers.config_validation import (  # noqa: F401
    make_entity_service_schema,
)
from homeassistant.components.climate.const import SUPPORT_TARGET_TEMPERATURE
from homeassistant.const import ATTR_TEMPERATURE

_LOGGER = logging.getLogger(__name__)


DEFAULT_NAME = "Better Thermostat"
VERSION = "master"
try:
    with open("custom_components/better_thermostat/manifest.json") as manifest_file:
        manifest = json.load(manifest_file)
        VERSION = manifest["version"]
except (FileNotFoundError, KeyError, json.JSONDecodeError) as e:
    _LOGGER.error("better_thermostat %s: could not read version from manifest file.", e)


CONF_HEATER = "thermostat"
CONF_SENSOR = "temperature_sensor"
CONF_HUMIDITY = "humidity_sensor"
CONF_SENSOR_WINDOW = "window_sensors"
CONF_TARGET_TEMP = "target_temp"
CONF_WEATHER = "weather"
CONF_OFF_TEMPERATURE = "off_temperature"
CONF_WINDOW_TIMEOUT = "window_off_delay"
CONF_OUTDOOR_SENSOR = "outdoor_sensor"
CONF_VALVE_MAINTENANCE = "valve_maintenance"
CONF_MIN_TEMP = "min_temp"
CONF_MAX_TEMP = "max_temp"
CONF_PRECISION = "precision"
CONF_CALIBRATION = "calibration"
CONF_CHILD_LOCK = "child_lock"
CONF_CALIBRATIION_ROUND = "calibration_round"
CONF_HEAT_AUTO_SWAPPED = "heat_auto_swapped"
CONF_MODEL = "model"
CONF_HOMATICIP = "homaticip"
CONF_INTEGRATION = "integration"
SUPPORT_FLAGS = SUPPORT_TARGET_TEMPERATURE

ATTR_STATE_WINDOW_OPEN = "window_open"
ATTR_STATE_CALL_FOR_HEAT = "call_for_heat"
ATTR_STATE_LAST_CHANGE = "last_change"
ATTR_STATE_SAVED_TEMPERATURE = "saved_temperature"
ATTR_VALVE_POSITION = "valve_position"
ATTR_STATE_HUMIDIY = "humidity"
ATTR_STATE_MAIN_MODE = "main_mode"

SERVICE_RESTORE_SAVED_TARGET_TEMPERATURE = "restore_saved_target_temperature"
SERVICE_SET_TEMP_TARGET_TEMPERATURE = "set_temp_target_temperature"

BETTERTHERMOSTAT_SET_TEMPERATURE_SCHEMA = vol.All(
    cv.has_at_least_one_key(ATTR_TEMPERATURE),
    make_entity_service_schema(
        {vol.Exclusive(ATTR_TEMPERATURE, "temperature"): vol.Coerce(float)}
    ),
)


class BetterThermostatEntityFeature(IntEnum):
    """Supported features of the climate entity."""

    TARGET_TEMPERATURE = 1
    TARGET_TEMPERATURE_RANGE = 2
