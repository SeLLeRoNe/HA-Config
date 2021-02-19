"""Provide info to system health about server meteoalarm.eu."""
from homeassistant.components import system_health
from homeassistant.core import HomeAssistant, callback

METEOALARMEU_SERVER_URL = "https://www.meteoalarm.eu/"


@callback
def async_register(
    hass: HomeAssistant, register: system_health.SystemHealthRegistration
) -> None:
    """Register system health callbacks."""
    register.async_register_info(system_health_info)


async def system_health_info(hass):
    """Get info for the info page."""
    return {
        "Reach API endpoint": system_health.async_check_can_reach_url(
            hass, METEOALARMEU_SERVER_URL
        )
    }
