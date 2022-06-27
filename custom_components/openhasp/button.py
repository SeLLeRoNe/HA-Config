"""Support for current page numbers."""
import logging

from homeassistant.components.button import (
    ButtonDeviceClass,
    ButtonEntity,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.const import CONF_NAME
from homeassistant.helpers.entity import EntityCategory


from .common import HASPEntity
from .const import CONF_HWID, CONF_TOPIC

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities
):
    """Set up Plate Relays as switch based on a config entry."""

    async_add_entities(
        [
            HASPRestartButton(
                entry.data[CONF_NAME],
                entry.data[CONF_HWID],
                entry.data[CONF_TOPIC],
            )
        ]
    )

    return True


class HASPRestartButton(HASPEntity, ButtonEntity):
    """Representation of page number."""

    _attr_entity_category = EntityCategory.CONFIG
    _attr_device_class = ButtonDeviceClass.RESTART

    def __init__(self, name, hwid, topic) -> None:
        """Initialize the Restart Button."""
        super().__init__(name, hwid, topic, "restart")
        self._attr_name = f"{name} restart"
        self._available = True

    async def async_press(self) -> None:
        """Handle the button press."""
        await self.hass.components.mqtt.async_publish(
            self.hass,
            f"{self._topic}/command/restart",
            "",
            qos=0,
            retain=False,
        )

    async def refresh(self):
        """Sync local state back to plate."""
        self.async_write_ha_state()
