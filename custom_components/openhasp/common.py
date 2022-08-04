"""HASP-LVGL Commonalities."""
import logging

from homeassistant.core import callback
from homeassistant.helpers.entity import Entity, ToggleEntity
import voluptuous as vol

from .const import (
    CONF_PLATE,
    DOMAIN,
    EVENT_HASP_PLATE_OFFLINE,
    EVENT_HASP_PLATE_ONLINE,
    HASP_IDLE_STATES,
)

_LOGGER = logging.getLogger(__name__)


HASP_IDLE_SCHEMA = vol.Schema(vol.Any(*HASP_IDLE_STATES))


class HASPEntity(Entity):
    """Generic HASP entity (base class)."""

    def __init__(self, name, hwid: str, topic: str, part=None) -> None:
        """Initialize the HASP entity."""
        super().__init__()
        self._name = name
        self._hwid = hwid
        self._topic = topic
        self._state = None
        self._available = False
        self._subscriptions = []
        self._attr_unique_id = f"{self._hwid}.{part}"
        self._attr_device_info = {
            "identifiers": {(DOMAIN, self._hwid)},
        }

    @property
    def available(self):
        """Return if entity is available."""
        return self._available

    async def refresh(self):
        """Sync local state back to plate."""
        raise NotImplementedError()

    async def async_added_to_hass(self):
        """Run when entity about to be added."""
        await super().async_added_to_hass()

        @callback
        async def online(event):
            if event.data[CONF_PLATE] == self._hwid:
                self._available = True
                if self._state:
                    await self.refresh()
                else:
                    self.async_write_ha_state() # Just to update availability
                _LOGGER.debug("%s is available, %s", self.entity_id, "refresh" if self._state else "stale")

        self._subscriptions.append(
            self.hass.bus.async_listen(EVENT_HASP_PLATE_ONLINE, online)
        )

        @callback
        async def offline(event):
            if event.data[CONF_PLATE] == self._hwid:
                self._available = False
                self.async_write_ha_state()

        self._subscriptions.append(
            self.hass.bus.async_listen(EVENT_HASP_PLATE_OFFLINE, offline)
        )

    async def async_will_remove_from_hass(self):
        """Run when entity about to be removed."""
        await super().async_will_remove_from_hass()

        for subscription in self._subscriptions:
            subscription()


class HASPToggleEntity(HASPEntity, ToggleEntity):
    """Representation of HASP ToggleEntity."""
    
    def __init__(self, name, hwid, topic, gpio):
        """Initialize the relay."""
        super().__init__(name, hwid, topic, gpio)
        self._gpio = gpio

    @property
    def is_on(self):
        """Return true if device is on."""
        return self._state

    async def async_turn_on(self, **kwargs):
        """Turn on."""
        self._state = True
        await self.refresh()

    async def async_turn_off(self, **kwargs):
        """Turn off."""
        self._state = False
        await self.refresh()
