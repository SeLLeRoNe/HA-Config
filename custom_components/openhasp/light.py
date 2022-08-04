"""Support for HASP LVGL moodlights."""
import json
import logging
from typing import Callable

from homeassistant.components.light import (
    ATTR_BRIGHTNESS,
    ATTR_HS_COLOR,
    SUPPORT_BRIGHTNESS,
    SUPPORT_COLOR,
    LightEntity,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CONF_NAME
from homeassistant.core import HomeAssistant, callback
import homeassistant.helpers.config_validation as cv
from homeassistant.helpers.restore_state import RestoreEntity
import homeassistant.util.color as color_util
import voluptuous as vol

from .common import HASP_IDLE_SCHEMA, HASPToggleEntity
from .const import (
    ATTR_AWAKE_BRIGHTNESS,
    ATTR_IDLE_BRIGHTNESS,
    CONF_DIMLIGHTS,
    CONF_HWID,
    CONF_IDLE_BRIGHTNESS,
    CONF_LIGHTS,
    CONF_TOPIC,
    HASP_IDLE_LONG,
    HASP_IDLE_OFF,
    HASP_IDLE_SHORT,
)

_LOGGER = logging.getLogger(__name__)

HASP_MOODLIGHT_SCHEMA = vol.Schema(
    {
        vol.Required("state"): cv.boolean,
        vol.Required("r"): vol.All(int, vol.Range(min=0, max=255)),
        vol.Required("g"): vol.All(int, vol.Range(min=0, max=255)),
        vol.Required("b"): vol.All(int, vol.Range(min=0, max=255)),
        vol.Required("brightness"): vol.All(int, vol.Range(min=0, max=255)),
        vol.Optional("color"): str,
    },
)

HASP_BACKLIGHT_SCHEMA = vol.Schema(
    {
        vol.Required("state"): cv.boolean,
        vol.Required("brightness"): vol.All(int, vol.Range(min=0, max=255)),
    }
)

HASP_LIGHT_SCHEMA = vol.Schema(
    {
        vol.Required("state"): cv.boolean,
        vol.Optional("brightness"): vol.All(int, vol.Range(min=0, max=255)),
    }
)


# pylint: disable=R0801, W0613
async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: Callable
):
    """Set up Plate Light sensors based on a config entry."""

    async_add_entities(
        [
            HASPBackLight(
                entry.data[CONF_NAME],
                entry.data[CONF_HWID],
                entry.data[CONF_TOPIC],
                entry.options.get(
                    CONF_IDLE_BRIGHTNESS, entry.data[CONF_IDLE_BRIGHTNESS]
                ),
            ),
            HASPMoodLight(
                entry.data[CONF_NAME], entry.data[CONF_HWID], entry.data[CONF_TOPIC]
            ),
        ]
        + [
            HASPLight(
                entry.data[CONF_NAME],
                entry.data[CONF_HWID],
                entry.data[CONF_TOPIC],
                gpio,
            )
            for gpio in entry.data[CONF_LIGHTS]
        ]
        + [
            HASPDimmableLight(
                entry.data[CONF_NAME],
                entry.data[CONF_HWID],
                entry.data[CONF_TOPIC],
                gpio,
            )
            for gpio in entry.data[CONF_DIMLIGHTS]
        ]
    )

    return True


class HASPLight(HASPToggleEntity, LightEntity):
    """Representation of openHASP Light."""

    def __init__(self, name, hwid, topic, gpio):
        """Initialize the light."""
        super().__init__(name, hwid, topic, gpio)
        self._attr_name = f"{name} light {gpio}"

    async def refresh(self):
        """Sync local state back to plate."""
        await self.hass.components.mqtt.async_publish(
            self.hass,
            f"{self._topic}/command/output{self._gpio}",
            json.dumps(HASP_LIGHT_SCHEMA({"state": int(self._state)})),
            qos=0,
            retain=False,
        )
        self.async_write_ha_state()

    async def async_added_to_hass(self):
        """Run when entity about to be added."""
        await super().async_added_to_hass()

        @callback
        async def light_state_message_received(msg):
            """Process State."""

            try:
                self._available = True
                message = HASP_LIGHT_SCHEMA(json.loads(msg.payload))
                _LOGGER.debug("received light %s:  %s", self.name, message)

                self._state = message["state"]
                self.async_write_ha_state()

            except vol.error.Invalid as err:
                _LOGGER.error(err)

        self._subscriptions.append(
            await self.hass.components.mqtt.async_subscribe(
                f"{self._topic}/state/output{self._gpio}", light_state_message_received
            )
        )

        # Force immediatable state update from plate
        await self.hass.components.mqtt.async_publish(
            self.hass,
            f"{self._topic}/command/output{self._gpio}",
            "",
            qos=0,
            retain=False,
        )


class HASPDimmableLight(HASPToggleEntity, LightEntity):
    """Representation of openHASP Light."""

    def __init__(self, name, hwid, topic, gpio):
        """Initialize the dimmable light."""
        super().__init__(name, hwid, topic, gpio)
        self._brightness = None
        self._attr_supported_features = SUPPORT_BRIGHTNESS
        self._gpio = gpio
        self._attr_name = f"{name} dimmable light {self._gpio}"

    @property
    def brightness(self):
        """Return the brightness of this light between 0..255."""
        return self._brightness

    async def refresh(self):
        """Sync local state back to plate."""
        _LOGGER.debug(
            "refresh dim %s state = %s, brightness = %s",
            self.name,
            self._state,
            self._brightness,
        )

        await self.hass.components.mqtt.async_publish(
            self.hass,
            f"{self._topic}/command/output{self._gpio}",
            json.dumps(
                HASP_LIGHT_SCHEMA(
                    {"state": self._state, "brightness": self._brightness}
                )
            ),
            qos=0,
            retain=False,
        )
        self.async_write_ha_state()

    async def async_added_to_hass(self):
        """Run when entity about to be added."""
        await super().async_added_to_hass()

        @callback
        async def dimmable_light_message_received(msg):
            """Process State."""

            try:
                self._available = True
                message = HASP_LIGHT_SCHEMA(json.loads(msg.payload))
                _LOGGER.debug("received dimmable light %s:  %s", self.name, message)

                self._state = message["state"]
                self._brightness = message["brightness"]
                self.async_write_ha_state()

            except vol.error.Invalid as err:
                _LOGGER.error(err)

        self._subscriptions.append(
            await self.hass.components.mqtt.async_subscribe(
                f"{self._topic}/state/output{self._gpio}",
                dimmable_light_message_received,
            )
        )

        # Force immediatable state update from plate
        await self.hass.components.mqtt.async_publish(
            self.hass,
            f"{self._topic}/command/output{self._gpio}",
            "",
            qos=0,
            retain=False,
        )

    async def async_turn_on(self, **kwargs):
        """Turn on the dimmable light."""
        if ATTR_BRIGHTNESS in kwargs:
            self._brightness = kwargs[ATTR_BRIGHTNESS]
        self._state = True
        await self.refresh()


class HASPBackLight(HASPToggleEntity, LightEntity, RestoreEntity):
    """Representation of HASP LVGL Backlight."""

    def __init__(self, name, hwid, topic, brightness):
        """Initialize the light."""
        super().__init__(name, hwid, topic, "backlight")
        self._awake_brightness = 255
        self._brightness = None
        self._idle_brightness = brightness
        self._attr_supported_features = SUPPORT_BRIGHTNESS
        self._attr_name = f"{name} backlight"

    @property
    def extra_state_attributes(self):
        """Return the state attributes."""
        attributes = {
            ATTR_AWAKE_BRIGHTNESS: self._awake_brightness,
            ATTR_IDLE_BRIGHTNESS: self._idle_brightness,
        }

        return attributes

    @property
    def brightness(self):
        """Return the brightness of this light between 0..255."""
        return self._brightness

    async def async_added_to_hass(self):
        """Run when entity about to be added."""
        await super().async_added_to_hass()

        state = await self.async_get_last_state()
        if state:
            self._state = state.state
            self._brightness = state.attributes.get(ATTR_BRIGHTNESS)
            self._awake_brightness = state.attributes.get(ATTR_AWAKE_BRIGHTNESS, 255)
            _LOGGER.debug(
                "Restoring %s self.brigthness = %s; awake_brightness = %s",
                self.name,
                self._brightness,
                self._awake_brightness,
            )
            if not self._brightness:
                self._brightness = self._awake_brightness

        await self.async_listen_idleness()

        cmd_topic = f"{self._topic}/command"
        state_topic = f"{self._topic}/state/backlight"

        @callback
        async def backlight_message_received(msg):
            """Process Backlight State."""

            try:
                self._available = True
                message = HASP_BACKLIGHT_SCHEMA(json.loads(msg.payload))
                _LOGGER.debug("received backlight %s: %s", self.name, message)

                self._state = message["state"]
                self._brightness = message["brightness"]

                self.async_write_ha_state()

            except vol.error.Invalid as err:
                _LOGGER.error(
                    "While proccessing backlight: %s, original message was: %s",
                    err,
                    msg,
                )

        self._subscriptions.append(
            await self.hass.components.mqtt.async_subscribe(
                state_topic, backlight_message_received
            )
        )

        await self.hass.components.mqtt.async_publish(
            self.hass, cmd_topic, "backlight", qos=0, retain=False
        )

    async def async_listen_idleness(self):
        """Listen to messages on MQTT for HASP idleness."""

        @callback
        async def idle_message_received(msg):
            """Process MQTT message from plate."""
            message = HASP_IDLE_SCHEMA(msg.payload)

            if message == HASP_IDLE_OFF:
                brightness = self._awake_brightness
                backlight = 1
            elif message == HASP_IDLE_SHORT:
                brightness = self._idle_brightness
                backlight = 1
            elif message == HASP_IDLE_LONG:
                brightness = self._awake_brightness
                backlight = 0
            else:
                return

            _LOGGER.debug(
                "Idle state for %s is %s - Dimming to %s; Backlight to %s",
                self.name,
                message,
                brightness,
                backlight,
            )

            new_state = {"state": backlight, "brightness": brightness}

            await self.hass.components.mqtt.async_publish(
                self.hass,
                f"{self._topic}/command",
                f"backlight {json.dumps(new_state)}",
                qos=0,
                retain=False,
            )
            self.async_write_ha_state()

        self._subscriptions.append(
            await self.hass.components.mqtt.async_subscribe(
                f"{self._topic}/state/idle", idle_message_received
            )
        )

    async def refresh(self):
        """Sync local state back to plate."""
        cmd_topic = f"{self._topic}/command"

        new_state = {"state": self._state, "brightness": self._brightness}

        _LOGGER.debug("refresh(%s) backlight - %s", self.name, new_state)

        await self.hass.components.mqtt.async_publish(
            self.hass,
            cmd_topic,
            f"backlight {json.dumps(new_state)}",
            qos=0,
            retain=False,
        )
        self.async_write_ha_state()

    async def async_turn_on(self, **kwargs):
        """Turn on the backlight."""
        if ATTR_BRIGHTNESS in kwargs:
            self._brightness = kwargs[ATTR_BRIGHTNESS]
            self._awake_brightness = (
                self._brightness
            )  # save this value for later recall
        self._state = True
        await self.refresh()


class HASPMoodLight(HASPToggleEntity, LightEntity, RestoreEntity):
    """Representation of HASP LVGL Moodlight."""

    def __init__(self, name, hwid, topic):
        """Initialize the light."""
        super().__init__(name, hwid, topic, "moodlight")
        self._hs = None
        self._brightness = None
        self._attr_supported_features = SUPPORT_COLOR | SUPPORT_BRIGHTNESS
        self._attr_name = f"{name} moodlight"

    @property
    def hs_color(self):
        """Return the color property."""
        return self._hs

    @property
    def brightness(self):
        """Return the brightness of this light between 0..255."""
        return self._brightness

    async def async_added_to_hass(self):
        """Run when entity about to be added."""
        await super().async_added_to_hass()

        state = await self.async_get_last_state()
        if state:
            self._state = state.state
            self._brightness = state.attributes.get(ATTR_BRIGHTNESS)
            self._hs = state.attributes.get(ATTR_HS_COLOR)
            _LOGGER.debug(
                "Restoring %s self.brigthness = %s; hs_color = %s",
                self.name,
                self._brightness,
                self._hs,
            )

        @callback
        async def moodlight_message_received(msg):
            """Process Moodlight State."""

            try:
                self._available = True
                message = HASP_MOODLIGHT_SCHEMA(json.loads(msg.payload))
                _LOGGER.debug("received moodlight %s: %s", self.name, message)

                self._state = message["state"]
                self._hs = color_util.color_RGB_to_hs(
                    message["r"], message["g"], message["b"]
                )
                self._brightness = message["brightness"]
                self.async_write_ha_state()

            except vol.error.Invalid as err:
                _LOGGER.error("While proccessing moodlight: %s", err)

        self._subscriptions.append(
            await self.hass.components.mqtt.async_subscribe(
                f"{self._topic}/state/moodlight", moodlight_message_received
            )
        )

        await self.hass.components.mqtt.async_publish(
            self.hass, f"{self._topic}/command", "moodlight", qos=0, retain=False
        )

    async def refresh(self):
        """Sync local state back to plate."""
        cmd_topic = f"{self._topic}/command"

        new_state = {"state": self._state}
        if self._hs:
            rgb = color_util.color_hs_to_RGB(*self._hs)
            new_state = {**new_state, **dict(zip("rgb", rgb))}
        if self._brightness:
            new_state["brightness"] = self._brightness

        _LOGGER.debug("refresh(%s) moodlight - %s", self.name, new_state)
        await self.hass.components.mqtt.async_publish(
            self.hass,
            cmd_topic,
            f"moodlight {json.dumps(new_state)}",
            qos=0,
            retain=False,
        )

    async def async_turn_on(self, **kwargs):
        """Turn on the moodlight."""
        if ATTR_HS_COLOR in kwargs:
            self._hs = kwargs[ATTR_HS_COLOR]
        if ATTR_BRIGHTNESS in kwargs:
            self._brightness = kwargs[ATTR_BRIGHTNESS]

        self._state = True
        _LOGGER.debug(
            "Turn on %s - %s - %s",
            self._topic,
            color_util.color_hs_to_RGB(*self._hs) if self._hs else None,
            self._brightness,
        )
        await self.refresh()
