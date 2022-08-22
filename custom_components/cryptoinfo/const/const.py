import logging

CONF_ID = "id"
CONF_CRYPTOCURRENCY_NAME = "cryptocurrency_name"
CONF_CURRENCY_NAME = "currency_name"
CONF_MULTIPLIER = "multiplier"
CONF_UPDATE_FREQUENCY = "update_frequency"

SENSOR_PREFIX = "Cryptoinfo "
ATTR_LAST_UPDATE = "last_update"
ATTR_BASE_PRICE = "baseprice"
ATTR_24H_VOLUME = "24h_volume"
ATTR_1H_CHANGE = "1h_change"
ATTR_24H_CHANGE = "24h_change"
ATTR_7D_CHANGE = "7d_change"
ATTR_30D_CHANGE = "30d_change"
ATTR_MARKET_CAP = "market_cap"
ATTR_CIRCULATING_SUPPLY = "circulating_supply"
ATTR_TOTAL_SUPPLY = "total_supply"

API_ENDPOINT = "https://api.coingecko.com/api/v3/"

_LOGGER = logging.getLogger(__name__)
