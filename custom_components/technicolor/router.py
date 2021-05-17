import logging
from datetime import timedelta

from technicolorgateway import TechnicolorGateway

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CONF_HOST, CONF_USERNAME, CONF_PASSWORD
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryNotReady
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.event import async_track_time_interval
from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

SCAN_INTERVAL = timedelta(seconds=30)


class TechnicolorRouter:
    """Representation of a Technicolor router."""

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        """Initialize a Technicolor router."""
        self.hass = hass
        self._entry = entry
        self._host = entry.data[CONF_HOST]
        self._user = entry.data[CONF_USERNAME]
        self._pass = entry.data[CONF_PASSWORD]

        self._api: TechnicolorGateway = None

        self.devices = {}

        self.listeners = []

    async def setup(self) -> None:
        self._api = TechnicolorGateway(
            self._host, "80", self._user, self._pass
        )

        try:
            await self.hass.async_add_executor_job(self._api.srp6authenticate)
        except Exception as e:
            _LOGGER.exception("Failed to connect to Technicolor", e)
            return ConfigEntryNotReady

        await self.update_all(None)

        async_track_time_interval(
            self.hass, self.update_all, SCAN_INTERVAL
        )

    async def update_all(self, now) -> None:
        """Update all Technicolor platforms."""
        _LOGGER.info("update_all")
        await self.update_device_trackers()

    async def update_device_trackers(self) -> None:
        _LOGGER.info("update_device_trackers")
        new_device = None
        devices = await self.hass.async_add_executor_job(self._api.get_device_modal)
        _LOGGER.info(f"update_device_trackers devices ${devices}")

        for device in devices:
            device_mac = device["mac"]
            _LOGGER.info(f"device: {device_mac}")
            if self.devices.get(device_mac) is None:
                new_device = True
                _LOGGER.info("new")

            self.devices[device_mac] = device

        async_dispatcher_send(self.hass, self.signal_device_update)

        if new_device:
            async_dispatcher_send(self.hass, self.signal_device_new)

    @property
    def signal_device_update(self) -> str:
        """Event specific per Technicolor entry to signal updates in devices."""
        return f"{DOMAIN}-device-update"

    @property
    def signal_device_new(self) -> str:
        """Event specific per Technicolor entry to signal new device."""
        return f"{DOMAIN}-device-new"
