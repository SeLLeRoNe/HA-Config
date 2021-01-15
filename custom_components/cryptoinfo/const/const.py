import logging

CONF_ID = "id"
CONF_CRYPTOCURRENCY_NAME = "cryptocurrency_name"
CONF_CURRENCY_NAME = "currency_name"
CONF_MULTIPLIER = "multiplier"
CONF_UPDATE_FREQUENCY = "update_frequency"

SENSOR_PREFIX = "Cryptoinfo "
ATTR_LAST_UPDATE = "last_update"
ATTR_VOLUME = "volume"
ATTR_CHANGE = "change"
ATTR_MARKET_CAP = "market_cap"

API_ENDPOINT = "https://api.coingecko.com/api/v3/"

_LOGGER = logging.getLogger(__name__)
