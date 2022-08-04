"""Support for current page numbers."""
import logging
from dataclasses import dataclass

from homeassistant.components.number import NumberEntity, NumberEntityDescription
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.const import CONF_NAME
from homeassistant.helpers.entity import EntityCategory
from homeassistant.helpers.restore_state import RestoreEntity

from .common import HASPEntity
from .const import CONF_HWID, CONF_TOPIC

_LOGGER = logging.getLogger(__name__)


@dataclass
class HASPNumberDescriptionMixin:
    """Mixin to describe a HASP Number entity."""

    command_topic: str
    state_topic: str

@dataclass
class HASPNumberDescription(NumberEntityDescription, HASPNumberDescriptionMixin):
    """Class to describe an HASP Number Entity."""


NUMBERS = [
    HASPNumberDescription(
        key="Page Number",
        name="Page Number",
        entity_category=EntityCategory.CONFIG,
        icon="mdi:numeric-1-box-multiple-outline",
        native_min_value=1,
        native_max_value=12,
        command_topic="/command/page",
        state_topic="/state/page",
    )
]


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities
):
    """Set up Plate Relays as switch based on a config entry."""

    async_add_entities(
        [
            HASPNumber(
                entry.data[CONF_NAME],
                entry.data[CONF_HWID],
                entry.data[CONF_TOPIC],
                desc,
            )
            for desc in NUMBERS
        ]
    )

    return True


class HASPNumber(HASPEntity, NumberEntity, RestoreEntity):
    """Representation of HASP number."""

    def __init__(self, name, hwid, topic, description) -> None:
        """Initialize the number."""
        super().__init__(name, hwid, topic, description.key)
        self.entity_description = description
        self._number = None
        self._attr_name = f"{name} {self.entity_description.name}"

    async def refresh(self):
        """Sync local state back to plate."""
        await self.hass.components.mqtt.async_publish(
            self.hass,
            f"{self._topic}{self.entity_description.command_topic}",
            "" if self._number is None else self._number,
            qos=0,
            retain=False,
        )
        _LOGGER.debug("refresh %s with <%s>", self.entity_id, self._number)
        self.async_write_ha_state()

    async def async_added_to_hass(self):
        """Run when entity about to be added."""
        await super().async_added_to_hass()

        @callback
        async def page_state_message_received(msg):
            """Process State."""

            self._available = True
            _LOGGER.debug("%s current value = %s", self.entity_id, msg.payload)

            self._number = int(msg.payload)
            self.async_write_ha_state()

        self._subscriptions.append(
            await self.hass.components.mqtt.async_subscribe(
                f"{self._topic}{self.entity_description.state_topic}",
                page_state_message_received,
            )
        )

        try:
            state = await self.async_get_last_state()
            if state:
                self._number = int(state.state)
        except Exception:
            _LOGGER.error("Could not restore page number for %s", self.entity_id)

        await self.refresh()

    @property
    def native_value(self) -> int:
        """Return the current number."""
        return self._number

    async def async_set_native_value(self, value: float) -> None:
        """Set the perfume amount."""
        if not value.is_integer():
            raise ValueError(
                f"Can't set the {self.entity_description.name} to {value}. {self.entity_description.name} must be an integer."
            )
        self._number = int(value)
        await self.refresh()
