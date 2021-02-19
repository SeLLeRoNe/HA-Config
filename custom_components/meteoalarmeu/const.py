"""Constants for the meteoalarmeu integration."""
from homeassistant.components.binary_sensor import DOMAIN

DOMAIN = "meteoalarmeu"

ATTRIBUTION = "Information provided by meteoalarm.eu"

CONF_COUNTRY = "country"
CONF_REGION = "region"
CONF_LANGUAGE = "language"
CONF_AWARENESS_TYPES = "awareness_types"

DEFAULT_LANGUAGE = ""
DEFAULT_NAME = "meteoalarmeu"

SCAN_INTERVAL_MINUTES = 30
