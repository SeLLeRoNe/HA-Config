import asyncio
import logging

from .bridge import (
    set_offset,
    get_current_offset,
    get_offset_steps,
    set_temperature,
    set_valve,
    set_hvac_mode as bridge_set_hvac_mode,
)
from ..events.trv import convert_outbound_states
from datetime import datetime, timedelta
from homeassistant.components.climate.const import HVAC_MODE_HEAT, HVAC_MODE_OFF
from homeassistant.const import ATTR_TEMPERATURE

from .helpers import convert_to_float, calibration_round
from .weather import check_weather

_LOGGER = logging.getLogger(__name__)


async def control_queue(self):
    """The accutal control loop.
            Parameters
    ----------
    self :
            instance of better_thermostat

    Returns
    -------
    None
    """
    while True:
        if self.ignore_states:
            await asyncio.sleep(1)
            continue
        else:
            controls_to_process = await self.control_queue_task.get()
            if controls_to_process is not None:
                await control_trv(controls_to_process)
                self.control_queue_task.task_done()


async def control_trv(self, force_mode_change: bool = False):
    """This is the main controller for the real TRV

    Parameters
    ----------
    self :
            instance of better_thermostat
    force_mode_change : bool
            forces a mode change regardless which mode the TRV is in.

    Returns
    -------
    None
    """
    if self.startup_running:
        return
    async with self._temp_lock:
        self.ignore_states = True

        # our own state is in self._bt_hvac_mode
        # the current target TRV state is in self._trvs_hvac_mode
        _trv = self.hass.states.get(self.heater_entity_id)
        _current_TRV_mode = _trv.state
        _current_set_temperature = convert_to_float(
            str(_trv.attributes.get("temperature")), self.name, "controlling()"
        )
        hvac_mode_send = self._bt_hvac_mode
        perfom_change = False
        perform_calibration = False

        if self._bt_hvac_mode == HVAC_MODE_OFF:
            if _current_TRV_mode != HVAC_MODE_OFF:
                hvac_mode_send = HVAC_MODE_OFF
                _LOGGER.debug(
                    f"better_thermostat {self.name}: control_trv: own mode is off, setting TRV mode to off"
                )

        else:
            check_weather(self)

            if (
                self.call_for_heat is False
                and self._last_states.get("last_call_for_heat", False) is True
            ):
                _LOGGER.debug(
                    f"better_thermostat {self.name}: control_trv: weather is hot, setting BT to summer mode"
                )
                hvac_mode_send = HVAC_MODE_OFF
                self._last_states["last_call_for_heat"] = False
                _LOGGER.debug(
                    f"better_thermostat {self.name}: TO TRV set_hvac_mode: off"
                )

            elif (
                self.call_for_heat is True
                and self._last_states.get("last_call_for_heat", False) is False
            ):
                _LOGGER.debug(
                    f"better_thermostat {self.name}: control_trv: weather is cold, setting BT to winter mode"
                )
                hvac_mode_send = self._bt_hvac_mode
                self._last_states["last_call_for_heat"] = True

        if self.call_for_heat is True:

            if (
                self.window_open is True
                and self._last_states.get("last_window_open", False) is False
            ):
                _LOGGER.debug(
                    f"better_thermostat {self.name}: control_trv: window is open or status of window is unknown, setting window open"
                )
                # if the window is open or the sensor is not available, we're done
                self._last_main_hvac_mode = self._bt_hvac_mode
                hvac_mode_send = HVAC_MODE_OFF
                self._last_states["last_window_open"] = True
            elif (
                self.window_open is False
                and self._last_states.get("last_window_open", False) is True
            ):
                _LOGGER.debug(
                    f"better_thermostat {self.name}: control_trv: window is closed, setting window closed restoring mode: {self._last_main_hvac_mode}"
                )
                hvac_mode_send = self._last_main_hvac_mode
                self._last_states["last_window_open"] = False

            # Make sure TRV is not heat when window is open
            if self.window_open is True:
                hvac_mode_send = HVAC_MODE_OFF
                self._last_states["last_window_open"] = True

            remapped_states = convert_outbound_states(self, hvac_mode_send)
            if not isinstance(remapped_states, dict):
                self.ignore_states = False
                return None
            converted_hvac_mode = remapped_states.get("system_mode") or None
            temperature = remapped_states.get("temperature") or None
            calibration = remapped_states.get("local_temperature_calibration") or None

            if converted_hvac_mode is not None:
                if (_current_TRV_mode != converted_hvac_mode) or self.window_open:
                    old = self._last_states.get("last_hvac_mode", "?")
                    if perform_calibration is False:
                        _LOGGER.debug(
                            f"better_thermostat {self.name}: TO TRV set_hvac_mode: from: {old} to: {converted_hvac_mode}"
                        )
                    await set_trv_values(self, "hvac_mode", converted_hvac_mode)
                    self._last_states["last_hvac_mode"] = converted_hvac_mode
                    perfom_change = True
                    await asyncio.sleep(3)

            if (
                temperature is not None
                and self._bt_hvac_mode != HVAC_MODE_OFF
                and converted_hvac_mode != HVAC_MODE_OFF
            ):
                if (
                    _current_set_temperature != temperature
                    and temperature != self._last_states.get("last_target_temp", 0)
                ):
                    old = self._last_states.get("last_target_temp", "?")
                    _LOGGER.debug(
                        f"better_thermostat {self.name}: TO TRV set_temperature: from: {old} to: {temperature}"
                    )
                    await set_trv_values(
                        self, "temperature", temperature, hvac_mode=converted_hvac_mode
                    )
                    self._last_states["last_target_temp"] = temperature
                    perfom_change = True
            if (
                calibration is not None
                and self._bt_hvac_mode != HVAC_MODE_OFF
                and converted_hvac_mode != HVAC_MODE_OFF
            ):
                old_calibration = await get_current_offset(self)
                step_calibration = await get_offset_steps(self)
                current_calibration = convert_to_float(
                    str(old_calibration), self.name, "controlling()"
                )
                if step_calibration.is_integer():
                    calibration = calibration_round(
                        float(str(format(float(calibration), ".1f")))
                    )
                else:
                    calibration = float(str(format(float(calibration), ".1f")))

                old = self._last_states.get("last_calibration", current_calibration)
                if old != calibration:
                    await set_trv_values(
                        self, "local_temperature_calibration", calibration
                    )
                    self._last_states["last_calibration"] = calibration
                    perfom_change = True
                    perform_calibration = True

        if perfom_change is True:
            self.async_write_ha_state()
            self.last_change = datetime.now()

        self.ignore_states = False
        self._init = False


async def set_target_temperature(self, **kwargs):
    """Update the target temperature of the thermostat

    Parameters
    ----------
    self :
            self instance of better_thermostat
    kwargs :
            Piped attributes from HA.

    Returns
    -------
    None
    """
    _new_setpoint = convert_to_float(
        str(kwargs.get(ATTR_TEMPERATURE)),
        self.name,
        "controlling.set_target_temperature()",
    )
    if _new_setpoint is None:
        _LOGGER.debug(
            f"better_thermostat {self.name}: received a new setpoint from HA, but temperature attribute was not set, ignoring"
        )
        return
    self._target_temp = _new_setpoint
    self.async_write_ha_state()
    if (
        self.homaticip
        and (self.last_change + timedelta(seconds=10)).timestamp()
        > datetime.now().timestamp()
    ):
        _LOGGER.debug(
            f"better_thermostat {self.name}: skip controlling.set_target_temperature because of homaticip throttling"
        )
        return
    await self.control_queue_task.put(self)


async def set_hvac_mode(self, hvac_mode):
    """Set the HVAC mode for the thermostat

    Parameters
    ----------
    self :
            self instance of better_thermostat
    hvac_mode :
            The new HVAC mode

    Returns
    -------
    None
    """
    if hvac_mode in (HVAC_MODE_HEAT, HVAC_MODE_OFF):
        self._bt_hvac_mode = hvac_mode
    else:
        _LOGGER.error(
            "better_thermostat %s: Unsupported hvac_mode %s", self.name, hvac_mode
        )
    self.async_write_ha_state()
    await self.control_queue_task.put(self)


async def set_trv_values(self, key, value, hvac_mode=None):
    """Do necessary actions to set the TRV values.

    Parameters
    ----------
    self :
            self instance of better_thermostat
    key :
            sort of service call for HA to update the TRV
    value :
            the value to parse to the service call

    Returns
    -------
    None
    """
    if key == "temperature":
        await set_temperature(self, value)
        self._last_send_target_temp = value
    elif key == "hvac_mode":
        await bridge_set_hvac_mode(self, value)
    elif key == "local_temperature_calibration":
        await set_offset(self, value)
    elif key == "valve_position":
        await set_valve(self, value)
    else:
        _LOGGER.error(
            "better_thermostat %s: set_trv_values() called with unsupported key %s",
            self.name,
            key,
        )
    self.last_change = datetime.now()


async def trv_valve_maintenance(self):
    """Maintenance of the TRV valve.

    Returns
    -------
    None
    """

    _LOGGER.debug("better_thermostat %s: maintenance started", self.name)

    self.ignore_states = True

    if self.model == "TS0601_thermostat":
        _LOGGER.debug(
            "better_thermostat %s: maintenance will run TS0601_thermostat variant of cycle",
            self.name,
        )

        # get current HVAC mode from HA
        try:
            _last_hvac_mode = self.hass.states.get(self.heater_entity_id).state
        except AttributeError:
            _LOGGER.error(
                "better_thermostat %s: Could not load current HVAC mode", self.name
            )
            self.ignore_states = False
            return

        _i = 0
        _retry_limit_reached = False

        while True:
            # close valve
            _set_HVAC_mode_retry = 0
            while not self._last_reported_valve_position == 0:
                # send close valve command and wait for the valve to close
                await set_trv_values(self, "hvac_mode", "off")
                # wait for an update by the TRV on the valve position
                await self._last_reported_valve_position_update_wait_lock.acquire()
                if (
                    not self._last_reported_valve_position == 0
                    and _set_HVAC_mode_retry < 3
                ):
                    _set_HVAC_mode_retry += 1
                    continue
                elif _set_HVAC_mode_retry == 3:
                    _LOGGER.error(
                        "better_thermostat %s: maintenance could not close valve after 3 retries",
                        self.name,
                    )
                    _retry_limit_reached = True
                    break
                # wait 60 seconds to not overheat the motor
                await asyncio.sleep(60)

            if _retry_limit_reached:
                _LOGGER.error(
                    "better_thermostat %s: maintenance was aborted prematurely due to errors",
                    self.name,
                )
                break

            # end loop after 3 opening cycles
            elif _i > 3:
                _LOGGER.debug("better_thermostat %s: maintenance completed", self.name)
                break

            # open valve
            _set_HVAC_mode_retry = 0
            while not self._last_reported_valve_position == 100:
                # send open valve command and wait for the valve to open
                await bridge_set_hvac_mode(self, "heat")
                await self._last_reported_valve_position_update_wait_lock.acquire()
                if (
                    not self._last_reported_valve_position == 0
                    and _set_HVAC_mode_retry < 3
                ):
                    _set_HVAC_mode_retry += 1
                    continue
                elif _set_HVAC_mode_retry == 3:
                    _LOGGER.error(
                        "better_thermostat %s: maintenance could not open valve after 3 retries",
                        self.name,
                    )
                    _retry_limit_reached = True
                    break
                # wait 60 seconds to not overheat the motor
                await asyncio.sleep(60)

            if _retry_limit_reached:
                _LOGGER.error(
                    "better_thermostat %s: maintenance was aborted prematurely due to errors",
                    self.name,
                )
                break

            _i += 1

        # returning the TRV to the previous HVAC mode
        await bridge_set_hvac_mode(self, _last_hvac_mode)
        # give the TRV time to process the mode change and report back to HA
        await asyncio.sleep(120)

    else:

        valve_position_available = False
        # check if there's a valve_position field
        try:
            self.hass.states.get(self.heater_entity_id).attributes.get("valve_position")
            valve_position_available = True
        except AttributeError:
            pass

        if valve_position_available:
            for position in (255, 0, 255, 0):
                await set_trv_values(self, "valve_position", position)
                await asyncio.sleep(60)
        else:
            for temperature in (30, 5, 30, 5):
                await set_trv_values(self, "temperature", temperature)
                await asyncio.sleep(60)

    self.ignore_states = False

    # restarting normal heating control immediately
    await self.control_queue_task.put(self)
