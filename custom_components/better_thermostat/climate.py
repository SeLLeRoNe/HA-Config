"""Better Thermostat"""

import asyncio
import logging
from abc import ABC
from datetime import datetime, timedelta
from random import randint

from .utils.weather import check_ambient_air_temperature
from .utils.bridge import init, load_adapter
from .utils.helpers import convert_to_float, get_trv_intigration, mode_remap
from homeassistant.helpers import entity_platform
from homeassistant.core import Context

from homeassistant.components.climate import ClimateEntity
from homeassistant.components.climate.const import (
    CURRENT_HVAC_HEAT,
    CURRENT_HVAC_IDLE,
    CURRENT_HVAC_OFF,
    HVAC_MODE_HEAT,
    HVAC_MODE_OFF,
)
from homeassistant.const import (
    CONF_NAME,
    EVENT_HOMEASSISTANT_START,
    ATTR_TEMPERATURE,
    STATE_UNAVAILABLE,
    STATE_UNKNOWN,
)
from homeassistant.core import callback, CoreState
from homeassistant.helpers.event import (
    async_track_state_change_event,
    async_track_time_change,
)
from homeassistant.helpers.restore_state import RestoreEntity

from . import DOMAIN
from .const import (
    ATTR_STATE_CALL_FOR_HEAT,
    ATTR_STATE_HUMIDIY,
    ATTR_STATE_LAST_CHANGE,
    ATTR_STATE_MAIN_MODE,
    ATTR_STATE_WINDOW_OPEN,
    ATTR_STATE_SAVED_TEMPERATURE,
    CONF_CALIBRATIION_ROUND,
    CONF_CALIBRATION,
    CONF_CHILD_LOCK,
    CONF_HEAT_AUTO_SWAPPED,
    CONF_HEATER,
    CONF_HOMATICIP,
    CONF_HUMIDITY,
    CONF_INTEGRATION,
    CONF_MODEL,
    CONF_OFF_TEMPERATURE,
    CONF_OUTDOOR_SENSOR,
    CONF_SENSOR,
    CONF_SENSOR_WINDOW,
    CONF_VALVE_MAINTENANCE,
    CONF_WEATHER,
    CONF_WINDOW_TIMEOUT,
    SERVICE_RESTORE_SAVED_TARGET_TEMPERATURE,
    SUPPORT_FLAGS,
    VERSION,
    SERVICE_SET_TEMP_TARGET_TEMPERATURE,
    BETTERTHERMOSTAT_SET_TEMPERATURE_SCHEMA,
    BetterThermostatEntityFeature,
)

from .utils.controlling import control_queue, set_hvac_mode, set_target_temperature
from .events.temperature import trigger_temperature_change
from .events.trv import trigger_trv_change
from .events.window import trigger_window_change, window_queue

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(hass, entry, async_add_devices):
    """Setup sensor platform."""

    async def async_service_handler(self, data):
        _LOGGER.debug(f"Service call: {self} » {data.service}")
        if data.service == SERVICE_RESTORE_SAVED_TARGET_TEMPERATURE:
            await self.restore_temp_temperature()
        elif data.service == SERVICE_SET_TEMP_TARGET_TEMPERATURE:
            await self.set_temp_temperature(data.data[ATTR_TEMPERATURE])

    platform = entity_platform.async_get_current_platform()
    platform.async_register_entity_service(
        SERVICE_SET_TEMP_TARGET_TEMPERATURE,
        BETTERTHERMOSTAT_SET_TEMPERATURE_SCHEMA,
        async_service_handler,
        [
            BetterThermostatEntityFeature.TARGET_TEMPERATURE,
            BetterThermostatEntityFeature.TARGET_TEMPERATURE_RANGE,
        ],
    )
    platform.async_register_entity_service(
        SERVICE_RESTORE_SAVED_TARGET_TEMPERATURE, {}, async_service_handler
    )

    async_add_devices(
        [
            BetterThermostat(
                entry.data.get(CONF_NAME),
                entry.data.get(CONF_HEATER),
                entry.data.get(CONF_SENSOR),
                entry.data.get(CONF_HUMIDITY, None),
                entry.data.get(CONF_SENSOR_WINDOW, None),
                entry.data.get(CONF_WINDOW_TIMEOUT, None),
                entry.data.get(CONF_WEATHER, None),
                entry.data.get(CONF_OUTDOOR_SENSOR, None),
                entry.data.get(CONF_OFF_TEMPERATURE, None),
                entry.data.get(CONF_VALVE_MAINTENANCE, None),
                entry.data.get(CONF_CALIBRATION, None),
                entry.data.get(CONF_MODEL, None),
                entry.data.get(CONF_INTEGRATION, None),
                entry.data.get(CONF_CALIBRATIION_ROUND, None),
                entry.data.get(CONF_HEAT_AUTO_SWAPPED, None),
                entry.data.get(CONF_CHILD_LOCK, None),
                entry.data.get(CONF_HOMATICIP, False),
                hass.config.units.temperature_unit,
                entry.entry_id,
                device_class="better_thermostat",
                state_class="better_thermostat_state",
            )
        ]
    )


class BetterThermostat(ClimateEntity, RestoreEntity, ABC):
    """Representation of a Better Thermostat device."""

    async def set_temp_temperature(self, temperature):
        if self._saved_temperature is None:
            self._saved_temperature = self._target_temp
            self._target_temp = convert_to_float(
                temperature, self.name, "service.set_target_temperature()"
            )
            self.async_write_ha_state()
            await self.control_queue_task.put(self)
        else:
            self._target_temp = convert_to_float(
                temperature, self.name, "service.set_target_temperature()"
            )
            self.async_write_ha_state()
            await self.control_queue_task.put(self)

    async def save_target_temperature(self):
        self._saved_temperature = self._target_temp
        self.async_write_ha_state()

    async def restore_temp_temperature(self):
        if self._saved_temperature is not None:
            self._target_temp = convert_to_float(
                self._saved_temperature, self.name, "service.restore_temp_temperature()"
            )
            self._saved_temperature = None
            self.async_write_ha_state()
            await self.control_queue_task.put(self)

    @property
    def device_info(self):
        return {
            "identifiers": {(DOMAIN, self.unique_id)},
            "name": self.name,
            "manufacturer": "Better Thermostat",
            "model": self.model,
            "sw_version": VERSION,
            "via_device": ("climate", self.heater_entity_id),
        }

    def __init__(
        self,
        name,
        heater_entity_id,
        sensor_entity_id,
        humidity_sensor_entity_id,
        window_id,
        window_delay,
        weather_entity,
        outdoor_sensor,
        off_temperature,
        valve_maintenance,
        calibration,
        model,
        integration,
        calibration_round,
        heat_auto_swapped,
        child_lock,
        homaticip,
        unit,
        unique_id,
        device_class,
        state_class,
    ):
        """Initialize the thermostat.

        Parameters
        ----------
        TODO
        """
        self._name = name
        self.heater_entity_id = heater_entity_id  # [0]
        self.all_trvs = heater_entity_id
        self.sensor_entity_id = sensor_entity_id
        self.humidity_entity_id = humidity_sensor_entity_id
        self.window_id = window_id or None
        self.window_delay = window_delay or 0
        self.weather_entity = weather_entity or None
        self.outdoor_sensor = outdoor_sensor or None
        self.off_temperature = float(off_temperature) or None
        self.valve_maintenance = valve_maintenance or None
        self.model = model
        self.integration = integration
        self._unique_id = unique_id
        self._unit = unit
        self._calibration = calibration
        self.local_temperature_calibration_entity = None
        self._device_class = device_class
        self._state_class = state_class
        self.calibration_round = calibration_round
        self.heat_auto_swapped = heat_auto_swapped
        self.child_lock = child_lock
        self.homaticip = homaticip
        self._hvac_list = [HVAC_MODE_HEAT, HVAC_MODE_OFF]
        self.next_valve_maintenance = datetime.now() + timedelta(
            hours=randint(1, 24 * 5)
        )
        self._config = None
        self._cur_temp = None
        self._cur_humidity = 0
        self.window_open = None
        self._target_temp_step = 1
        self._TRV_target_temp_step = 0.5
        self.calibration_type = 1
        self._min_temp = 0
        self._max_temp = 30
        self._TRV_min_temp = 0
        self._TRV_max_temp = 30
        self._TRV_current_temp = None
        self._TRV_SUPPORTED_HVAC_MODES = None
        self._target_temp = 5
        self._support_flags = SUPPORT_FLAGS
        self._bt_hvac_mode = None
        self._trv_hvac_mode = None
        self.closed_window_triggered = False
        self.call_for_heat = True
        self.ignore_states = False
        self.last_calibration = None
        self.last_dampening_timestamp = None
        self.valve_position_entity = None
        self.version = VERSION
        self.last_change = datetime.now() - timedelta(hours=2)
        self._last_calibration = datetime.now()
        self._last_window_state = None
        self._temp_lock = asyncio.Lock()
        self._last_reported_valve_position = None
        self.startup_running = True
        self._init = True
        self._saved_temperature = None
        self._last_reported_valve_position_update_wait_lock = asyncio.Lock()
        self._last_send_target_temp = None
        self._last_avg_outdoor_temp = None
        self._last_main_hvac_mode = None
        self._available = False
        self._context = None
        self._last_states = {
            "last_target_temp": None,
            "last_valve_position": None,
            "last_hvac_mode": None,
            "last_window_state": None,
            "last_avg_outdoor_temp": None,
            "last_current_temp": None,
            "last_calibration": None,
            "last_call_for_heat": None,
        }
        self.control_queue_task = asyncio.Queue(maxsize=1)
        if self.window_id is not None:
            self.window_queue_task = asyncio.Queue(maxsize=1)
        asyncio.create_task(control_queue(self))
        if self.window_id is not None:
            asyncio.create_task(window_queue(self))

    async def async_added_to_hass(self):
        """Run when entity about to be added.

        Returns
        -------
        None
        """
        await super().async_added_to_hass()

        _LOGGER.info(
            "better_thermostat %s: Waiting for entity to be ready...", self.name
        )

        self._context = Context(id="better_thermostat", parent_id=None, user_id=None)
        self.async_set_context(self._context)

        if self._calibration == "local_calibration_based":
            self.calibration_type = 0

        if self.integration is None:
            self.integration = await get_trv_intigration(self)

        @callback
        def _async_startup(*_):
            """Init on startup.

            Parameters
            ----------
            _ :
                    All parameters are piped.
            """
            load_adapter(self)
            loop = asyncio.get_event_loop()
            loop.create_task(self.startup())

        if self.hass.state == CoreState.running:
            _async_startup()
        else:
            self.hass.bus.async_listen_once(EVENT_HOMEASSISTANT_START, _async_startup)

    async def _trigger_time(self, event=None):
        _LOGGER.debug("better_thermostat %s: get last avg outdoor temps...", self.name)
        await check_ambient_air_temperature(self)
        if event is not None:
            self.async_write_ha_state()
            await self.control_queue_task.put(self)

    async def _trigger_temperature_change(self, event):
        await trigger_temperature_change(self, event)

    async def _trigger_humidity_change(self, event):
        self._cur_humidity = convert_to_float(
            str(self.hass.states.get(self.humidity_entity_id).state),
            self.name,
            "humidity_update",
        )
        self.async_write_ha_state()

    async def _trigger_trv_change(self, event):
        await trigger_trv_change(self, event)

    async def _trigger_window_change(self, event):
        await trigger_window_change(self, event)

    async def startup(self):
        """Run when entity about to be added.

        Returns
        -------
        None
        """
        self._config = {
            "calibration_type": self.calibration_type,
            "calibration_round": self.calibration_round,
            "has_system_mode": False,
            "system_mode": HVAC_MODE_OFF,
            "heat_auto_swapped": self.heat_auto_swapped,
        }
        while self.startup_running:
            _LOGGER.info(
                "better_thermostat %s: Starting version %s. Waiting for entity to be ready...",
                self.name,
                self.version,
            )
            trv_state = self.hass.states.get(self.heater_entity_id)
            sensor_state = self.hass.states.get(self.sensor_entity_id)
            if sensor_state.state in (STATE_UNAVAILABLE, STATE_UNKNOWN, None):
                _LOGGER.info(
                    "better_thermostat %s: waiting for sensor entity with id '%s' to become fully available...",
                    self.name,
                    self.sensor_entity_id,
                )
                await asyncio.sleep(10)
                continue
            if trv_state.state in (STATE_UNAVAILABLE, STATE_UNKNOWN, None):
                _LOGGER.info(
                    "better_thermostat %s: waiting for TRV/climate entity with id '%s' to become fully available...",
                    self.name,
                    self.heater_entity_id,
                )
                await asyncio.sleep(10)
                continue
            if self.window_id is not None:
                if self.hass.states.get(self.window_id).state in (
                    STATE_UNAVAILABLE,
                    STATE_UNKNOWN,
                    None,
                ):
                    _LOGGER.info(
                        "better_thermostat %s: waiting for window sensor entity with id '%s' to become fully available...",
                        self.name,
                        self.window_id,
                    )
                    await asyncio.sleep(10)
                    continue

            if self.humidity_entity_id is not None:
                if self.hass.states.get(self.humidity_entity_id).state in (
                    STATE_UNAVAILABLE,
                    STATE_UNKNOWN,
                    None,
                ):
                    _LOGGER.info(
                        "better_thermostat %s: waiting for humidity sensor entity with id '%s' to become fully available...",
                        self.name,
                        self.humidity_entity_id,
                    )
                    await asyncio.sleep(10)
                    continue

            if self.outdoor_sensor is not None:
                if self.hass.states.get(self.outdoor_sensor).state in (
                    STATE_UNAVAILABLE,
                    STATE_UNKNOWN,
                    None,
                ):
                    _LOGGER.info(
                        "better_thermostat %s: waiting for outdoor sensor entity with id '%s' to become fully available...",
                        self.name,
                        self.outdoor_sensor,
                    )
                    await asyncio.sleep(10)
                    continue

            if self.weather_entity is not None:
                if self.hass.states.get(self.weather_entity).state in (
                    STATE_UNAVAILABLE,
                    STATE_UNKNOWN,
                    None,
                ):
                    _LOGGER.info(
                        "better_thermostat %s: waiting for weather entity with id '%s' to become fully available...",
                        self.name,
                        self.weather_entity,
                    )
                    await asyncio.sleep(10)
                    continue

            self._trv_hvac_mode = trv_state.state
            self._last_reported_valve_position = (
                trv_state.attributes.get("valve_position", None) or None
            )
            self._max_temp = convert_to_float(
                str(trv_state.attributes.get("max_temp", 30)), self.name, "startup()"
            )
            self._min_temp = convert_to_float(
                str(trv_state.attributes.get("min_temp", 5)), self.name, "startup()"
            )
            self._TRV_max_temp = convert_to_float(
                str(trv_state.attributes.get("max_temp", 30)), self.name, "startup()"
            )
            self._TRV_min_temp = convert_to_float(
                str(trv_state.attributes.get("min_temp", 5)), self.name, "startup()"
            )
            self._TRV_SUPPORTED_HVAC_MODES = trv_state.attributes.get(
                "hvac_modes", None
            )
            self._TRV_target_temp_step = convert_to_float(
                str(trv_state.attributes.get("target_temp_step", 1)),
                self.name,
                "startup()",
            )
            self._target_temp_step = self._TRV_target_temp_step

            self._TRV_current_temp = convert_to_float(
                str(trv_state.attributes.get("current_temperature")),
                self.name,
                "startup()",
            )

            self._cur_temp = convert_to_float(
                str(sensor_state.state), self.name, "startup()"
            )
            if self.humidity_entity_id is not None:
                self._cur_humidity = convert_to_float(
                    str(self.hass.states.get(self.humidity_entity_id).state),
                    self.name,
                    "startuo()",
                )
            if self.window_id is not None:
                window = self.hass.states.get(self.window_id)

                check = window.state
                if check in ("on", "open", "true"):
                    self.window_open = True
                else:
                    self.window_open = False
                _LOGGER.debug(
                    "better_thermostat %s: detected window state at startup: %s",
                    self.name,
                    "Open" if self.window_open else "Closed",
                )
            else:
                self.window_open = False

            has_system_mode = True
            if trv_state.attributes.get("hvac_modes") is None:
                has_system_mode = False

            self._config["has_system_mode"] = has_system_mode
            # Check If we have an old state
            old_state = await self.async_get_last_state()
            if old_state is not None:
                # If we have no initial temperature, restore
                # If we have a previously saved temperature
                if old_state.attributes.get(ATTR_TEMPERATURE) is None:
                    self._target_temp = (
                        trv_state.attributes.get("temperature")
                        or trv_state.attributes.get("temperature")
                        or 5
                    )
                    _LOGGER.debug(
                        "better_thermostat %s: Undefined target temperature, falling back to %s",
                        self.name,
                        self._target_temp,
                    )
                else:
                    _old_target_temperature = float(
                        old_state.attributes.get(ATTR_TEMPERATURE)
                    )
                    # if the saved temperature is lower than the _min_temp, set it to _min_temp
                    if _old_target_temperature < self._min_temp:
                        _LOGGER.warning(
                            "better_thermostat %s: Saved target temperature %s is lower than _min_temp %s, setting to _min_temp",
                            self.name,
                            _old_target_temperature,
                            self._min_temp,
                        )
                        _old_target_temperature = self._min_temp
                    # if the saved temperature is higher than the _max_temp, set it to _max_temp
                    elif _old_target_temperature > self._max_temp:
                        _LOGGER.warning(
                            "better_thermostat %s: Saved target temperature %s is higher than _max_temp %s, setting to _max_temp",
                            self.name,
                            _old_target_temperature,
                            self._min_temp,
                        )
                        _old_target_temperature = self._max_temp
                    self._target_temp = convert_to_float(
                        str(_old_target_temperature), self.name, "startup()"
                    )
                if not self._bt_hvac_mode and old_state.state:
                    self._bt_hvac_mode = old_state.state
                if old_state.attributes.get(ATTR_STATE_CALL_FOR_HEAT, None) is not None:
                    self.call_for_heat = old_state.attributes.get(
                        ATTR_STATE_CALL_FOR_HEAT
                    )
                if (
                    old_state.attributes.get(ATTR_STATE_SAVED_TEMPERATURE, None)
                    is not None
                ):
                    self._saved_temperature = convert_to_float(
                        str(
                            old_state.attributes.get(ATTR_STATE_SAVED_TEMPERATURE, None)
                        ),
                        self.name,
                        "startuo()",
                    )
                if old_state.attributes.get(ATTR_STATE_HUMIDIY, None) is not None:
                    self._cur_humidity = old_state.attributes.get(ATTR_STATE_HUMIDIY)
                if old_state.attributes.get(ATTR_STATE_MAIN_MODE, None) is not None:
                    self._last_main_hvac_mode = old_state.attributes.get(
                        ATTR_STATE_MAIN_MODE
                    )

            else:
                # No previous state, try and restore defaults
                if self._target_temp is None or type(self._target_temp) != float:
                    _LOGGER.info(
                        "better_thermostat %s: No previously saved temperature found on startup, get it from the TRV",
                        self.name,
                    )
                    self._target_temp = convert_to_float(
                        str(trv_state.attributes.get("temperature")),
                        self.name,
                        "startup()",
                    )

            # if hvac mode could not be restored, turn heat off
            if self._trv_hvac_mode is None:
                self._trv_hvac_mode = HVAC_MODE_OFF
            if self._bt_hvac_mode in (STATE_UNAVAILABLE, STATE_UNKNOWN, None):
                _LOGGER.warning(
                    "better_thermostat %s: No previously hvac mode found on startup, turn heat off",
                    self.name,
                )
                self._bt_hvac_mode = mode_remap(self, self._trv_hvac_mode, True)

            _LOGGER.debug(
                "better_thermostat %s: Startup config, TRV hvac mode is %s, BT hvac mode is %s, Target temp %s",
                self.name,
                self._trv_hvac_mode,
                self._bt_hvac_mode,
                self._target_temp,
            )

            if self._last_main_hvac_mode is None:
                self._last_main_hvac_mode = self._bt_hvac_mode

            if self.humidity_entity_id is not None:
                self._cur_humidity = convert_to_float(
                    str(self.hass.states.get(self.humidity_entity_id).state),
                    self.name,
                    "startuo()",
                )
            else:
                self._cur_humidity = 0

            self._config["system_mode"] = self._bt_hvac_mode
            self._last_window_state = self.window_open
            self._available = True
            self.startup_running = False
            if self._bt_hvac_mode not in (HVAC_MODE_OFF, HVAC_MODE_HEAT):
                self._bt_hvac_mode = HVAC_MODE_HEAT
            self.async_write_ha_state()
            await init(self)
            await self._trigger_time(None)
            self._last_states = {
                "last_hvac_mode": self._bt_hvac_mode,
                "last_target_temp": self._target_temp,
                "last_call_for_heat": self.call_for_heat,
                "last_current_temp": self._cur_temp,
                "last_window_state": self.window_open,
            }

            await self.control_queue_task.put(self)
            # Add listener
            if self.outdoor_sensor is not None:
                async_track_time_change(self.hass, self._trigger_time, 5, 0, 0)

            async_track_state_change_event(
                self.hass, [self.sensor_entity_id], self._trigger_temperature_change
            )
            if self.humidity_entity_id is not None:
                async_track_state_change_event(
                    self.hass, [self.humidity_entity_id], self._trigger_humidity_change
                )
            async_track_state_change_event(
                self.hass, [self.heater_entity_id], self._trigger_trv_change
            )
            if self.window_id is not None:
                async_track_state_change_event(
                    self.hass, [self.window_id], self._trigger_window_change
                )
            _LOGGER.info("better_thermostat %s: startup completed.", self.name)
            break

    @property
    def extra_state_attributes(self):
        """Return the device specific state attributes.

        Returns
        -------
        dict
                Attribute dictionary for the extra device specific state attributes.
        """
        dev_specific = {
            ATTR_STATE_WINDOW_OPEN: self.window_open,
            ATTR_STATE_CALL_FOR_HEAT: self.call_for_heat,
            ATTR_STATE_LAST_CHANGE: self.last_change,
            ATTR_STATE_SAVED_TEMPERATURE: self._saved_temperature,
            CONF_CHILD_LOCK: self.child_lock,
            ATTR_STATE_HUMIDIY: self._cur_humidity,
            ATTR_STATE_MAIN_MODE: self._last_main_hvac_mode,
        }

        return dev_specific

    @property
    def available(self):
        """Return if thermostat is available.

        Returns
        -------
        bool
                True if the thermostat is available.
        """
        return self._available

    @property
    def should_poll(self):
        """Return the polling state.

        Returns
        -------
        bool
                True if the thermostat uses polling.
        """
        return False

    @property
    def name(self):
        """Return the name of the thermostat.

        Returns
        -------
        string
                The name of the thermostat.
        """
        return self._name

    @property
    def unique_id(self):
        """Return the unique id of this thermostat.

        Returns
        -------
        string
                The unique id of this thermostat.
        """
        return self._unique_id

    @property
    def precision(self):
        """Return the precision of the system.

        Returns
        -------
        float
                Precision of the thermostat.
        """
        return super().precision

    @property
    def target_temperature_step(self):
        """Return the supported step of target temperature.

        Returns
        -------
        float
                Steps of target temperature.
        """
        if self._target_temp_step is not None:
            return self._target_temp_step

        return super().precision

    @property
    def temperature_unit(self):
        """Return the unit of measurement.

        Returns
        -------
        string
                The unit of measurement.
        """
        return self._unit

    @property
    def current_temperature(self):
        """Return the sensor temperature.

        Returns
        -------
        float
                The measured temperature.
        """
        return self._cur_temp

    @property
    def hvac_mode(self):
        """Return current operation.

        Returns
        -------
        string
                HVAC mode only from homeassistant.components.climate.const is valid
        """
        return self._bt_hvac_mode

    @property
    def hvac_action(self):
        """Return the current HVAC action"""
        _real_trv_havc_action = self.hass.states.get(
            self.heater_entity_id
        ).attributes.get("hvac_action", None)
        if _real_trv_havc_action is not None:
            return _real_trv_havc_action
        if self._bt_hvac_mode == HVAC_MODE_OFF:
            return CURRENT_HVAC_OFF
        if self._bt_hvac_mode == HVAC_MODE_HEAT:
            if self.window_open:
                return CURRENT_HVAC_OFF

            if self.call_for_heat is False:
                return CURRENT_HVAC_IDLE
            return CURRENT_HVAC_HEAT

    @property
    def target_temperature(self):
        """Return the temperature we try to reach.

        Returns
        -------
        float
                Target temperature.
        """
        if None in (self._max_temp, self._min_temp, self._target_temp):
            return self._target_temp
        # if target temp is below minimum, return minimum
        if self._target_temp < self._min_temp:
            return self._min_temp
        # if target temp is above maximum, return maximum
        if self._target_temp > self._max_temp:
            return self._max_temp
        return self._target_temp

    @property
    def hvac_modes(self):
        """List of available operation modes.

        Returns
        -------
        array
                A list of HVAC modes only from homeassistant.components.climate.const is valid
        """
        return self._hvac_list

    async def async_set_hvac_mode(self, hvac_mode: str) -> None:
        """Set hvac mode.

        Returns
        -------
        None
        """
        await set_hvac_mode(self, hvac_mode)

    async def async_set_temperature(self, **kwargs) -> None:
        """Set new target temperature.

        Parameters
        ----------
        kwargs :
                Arguments piped from HA.

        Returns
        -------
        None
        """
        await set_target_temperature(self, **kwargs)

    @property
    def min_temp(self):
        """Return the minimum temperature.

        Returns
        -------
        float
                the minimum temperature.
        """
        if self._min_temp is not None:
            return self._min_temp

        # get default temp from super class
        return super().min_temp

    @property
    def max_temp(self):
        """Return the maximum temperature.

        Returns
        -------
        float
                the maximum temperature.
        """
        if self._max_temp is not None:
            return self._max_temp

        # Get default temp from super class
        return super().max_temp

    @property
    def _is_device_active(self):
        """Get the current state of the device for HA.

        Returns
        -------
        string
                State of the device.
        """
        state_off = self.hass.states.is_state(self.heater_entity_id, "off")
        state_heat = self.hass.states.is_state(self.heater_entity_id, "heat")
        state_auto = self.hass.states.is_state(self.heater_entity_id, "auto")

        if not self.hass.states.get(self.heater_entity_id):
            return None
        if state_off:
            return False
        elif state_heat:
            return state_heat
        elif state_auto:
            return state_auto

    @property
    def supported_features(self):
        """Return the list of supported features.

        Returns
        -------
        array
                Supported features.
        """
        return self._support_flags
