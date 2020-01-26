from .custom_component_server import setup_view
from .parser import Parser

MODULE = "custom_icons"
DATA_EXTRA_MODULE_URL = 'frontend_extra_module_url'

async def async_setup(hass, config):
    setup_view(hass, MODULE)
    parser = Parser()
    if parser.checkIfNeeded():
    	parser.do()
    parser.cleanUnusedCacheFiles()

    if DATA_EXTRA_MODULE_URL not in hass.data:
        hass.data[DATA_EXTRA_MODULE_URL] = set()
    for cacheFilePath in parser.listCacheFiles():
        hass.data[DATA_EXTRA_MODULE_URL].add(cacheFilePath)

    return True
