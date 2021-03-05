"""The meteoalarmeu integration."""
import asyncio

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .client import Client
from .const import (
    CONF_AWARENESS_TYPES,
    CONF_COUNTRY,
    CONF_LANGUAGE,
    CONF_REGION,
    DOMAIN,
)

__version__ = "2021.5.2"

PLATFORMS = ["binary_sensor"]


async def async_setup(hass: HomeAssistant, config: dict):
    """Set up the meteoalarmeu component."""
    hass.data.setdefault(DOMAIN, {})
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry):
    """Set up meteoalarmeu from a config entry."""
    hass.data[DOMAIN][entry.entry_id] = Client(
        entry.data[CONF_COUNTRY],
        entry.data[CONF_REGION],
        entry.data[CONF_LANGUAGE],
        entry.data[CONF_AWARENESS_TYPES],
    )

    for component in PLATFORMS:
        hass.async_create_task(
            hass.config_entries.async_forward_entry_setup(entry, component)
        )

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry):
    """Unload a config entry."""
    unload_ok = all(
        await asyncio.gather(
            *[
                hass.config_entries.async_forward_entry_unload(entry, component)
                for component in PLATFORMS
            ],
        )
    )
    if unload_ok:
        hass.data[DOMAIN].pop(entry.entry_id)

    return unload_ok
