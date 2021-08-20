"""Platform for sensor integration."""
import logging

from homeassistant.helpers.entity import Entity

from .const import DOMAIN
from .model.kind import TraktKind
from .utils import should_compute_identifier


async def async_setup_entry(hass, config_entry, async_add_entities):
    """Set up the sensor platform."""
    coordinator = hass.data[DOMAIN]["instances"]["coordinator"]

    for trakt_kind in TraktKind:
        if should_compute_identifier(hass, trakt_kind.value.identifier):
            async_add_entities(
                [TraktUpcomingSensor(hass, config_entry, coordinator, trakt_kind)],
                True,
            )


class TraktUpcomingSensor(Entity):
    """Representation of a Sensor."""

    def __init__(self, hass, config_entry, coordinator, trakt_kind):
        """Initialize the sensor."""
        self.hass = hass
        self.config_entry = config_entry
        self.coordinator = coordinator
        self.trakt_kind = trakt_kind

    @property
    def name(self):
        """Return the name of the sensor."""
        return f"Trakt Upcoming {self.trakt_kind.value.name}"

    @property
    def medias(self):
        if self.coordinator.data:
            return self.coordinator.data.get(self.trakt_kind, None)
        return None

    @property
    def configuration(self):
        identifier = self.trakt_kind.value.identifier
        data = self.hass.data[DOMAIN]
        return data["configuration"]["sensors"]["upcoming"][identifier]

    @property
    def data(self):
        if self.medias:
            max_medias = self.configuration["max_medias"]
            return self.medias.to_upcoming()[0 : max_medias + 1]
        return []

    @property
    def state(self):
        """Return the state of the sensor."""
        return max([len(self.data) - 1, 0])

    @property
    def icon(self):
        """Return the unit of measurement."""
        return "mdi:calendar"

    @property
    def unit_of_measurement(self):
        """Return the unit of measurement."""
        return "items"

    @property
    def device_state_attributes(self):
        """Return the state attributes of the sensor."""
        return {"data": self.data}

    async def async_update(self):
        """Request coordinator to update data."""
        await self.coordinator.async_request_refresh()
