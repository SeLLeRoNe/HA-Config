"""The technicolor integration."""
from datetime import timedelta

from .const import DOMAIN
from homeassistant.config_entries import SOURCE_IMPORT, ConfigEntry
from homeassistant.core import HomeAssistant
from .router import TechnicolorRouter

PLATFORMS = ["device_tracker"]
SCAN_INTERVAL = timedelta(seconds=30)


async def async_setup(hass, config):
    """Set up the technicolor integration."""
    conf = config.get(DOMAIN)
    if conf is None:
        return True

    # save the options from config yaml
    options = {}
    hass.data[DOMAIN] = {"yaml_options": options}

    # check if already configured
    domains_list = hass.config_entries.async_domains()
    if DOMAIN in domains_list:
        return True

    hass.async_create_task(
        hass.config_entries.flow.async_init(
            DOMAIN, context={"source": SOURCE_IMPORT}, data=conf
        )
    )

    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry):
    """Set up Technicolor platform."""

    # import options from yaml if empty
    yaml_options = hass.data.get(DOMAIN, {}).pop("yaml_options", {})
    if not entry.options and yaml_options:
        hass.config_entries.async_update_entry(entry, options=yaml_options)

    technicolor_router = TechnicolorRouter(hass, entry)
    await technicolor_router.setup()

    hass.async_create_task(hass.config_entries.async_forward_entry_setup(entry, "device_tracker"))

    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = {
        DOMAIN: technicolor_router,
    }

    return True
