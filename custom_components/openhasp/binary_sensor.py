"""Allows to configure a binary sensor using GPIO."""
import json
import logging
from typing import Callable

from homeassistant.components.binary_sensor import BinarySensorEntity

# pylint: disable=R0801
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CONF_NAME
from homeassistant.core import HomeAssistant, callback
import homeassistant.helpers.config_validation as cv
import voluptuous as vol

from .common import HASPEntity
from .const import CONF_HWID, CONF_INPUT, CONF_TOPIC

_LOGGER = logging.getLogger(__name__)


HASP_BINARY_INPUT_SCHEMA = vol.Schema(
    {
        vol.Required("state"): cv.boolean,
    }
)


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: Callable
):
    """Set up Plate Relays as switch based on a config entry."""

    async_add_entities(
        [
            HASPBinarySensor(
                entry.data[CONF_NAME],
                entry.data[CONF_HWID],
                entry.data[CONF_TOPIC],
                gpio,
                device_class,
            )
            for device_class in entry.data[CONF_INPUT]
            for gpio in entry.data[CONF_INPUT][device_class]
        ]
    )

    return True


class HASPBinarySensor(HASPEntity, BinarySensorEntity):
    """Representation of an openHASP relay."""

    # pylint: disable=R0913
    def __init__(self, name, hwid, topic, gpio, dev_class):
        """Initialize the relay."""
        super().__init__(name, hwid, topic, gpio)
        self._device_class = dev_class
        self._attr_name = f"{name} binary_sensor {self._gpio}"

    @property
    def is_on(self):
        """Return true if device is on."""
        return self._state

    @property
    def device_class(self):
        """Return the device class."""
        return self._device_class

    async def refresh(self):
        """Force sync of plate state back to binary sensor."""
        await self.hass.components.mqtt.async_publish(
            self.hass,
            f"{self._topic}/command/input{self._gpio}",
            "",
            qos=0,
            retain=False,
        )

    async def async_added_to_hass(self):
        """Run when entity about to be added."""
        await super().async_added_to_hass()

        @callback
        async def state_message_received(msg):
            """Process State."""

            try:
                self._available = True
                message = HASP_BINARY_INPUT_SCHEMA(json.loads(msg.payload))
                _LOGGER.debug("%s state = %s", self.name, message)

                self._state = message["state"]
                self.async_write_ha_state()

            except vol.error.Invalid as err:
                _LOGGER.error(err)

        self._subscriptions.append(
            await self.hass.components.mqtt.async_subscribe(
                f"{self._topic}/state/input{self._gpio}", state_message_received
            )
        )

        await self.hass.components.mqtt.async_publish(
            self.hass,
            f"{self._topic}/command/input{self._gpio}",
            "",
            qos=0,
            retain=False,
        )
