from .const import DOMAIN


def update_domain_data(hass, key, content):
    if hass.data.get(DOMAIN) and hass.data[DOMAIN].get(key):
        hass.data[DOMAIN][key].update(content)
    else:
        hass.data.setdefault(DOMAIN, {})
        hass.data[DOMAIN][key] = content


def nested_get(dictionary, keys):
    for key in keys:
        dictionary = dictionary.get(key, {})
    return dictionary


def should_compute_identifier(hass, identifier):
    return nested_get(
        hass.data,
        [
            DOMAIN,
            "configuration",
            "sensors",
            "upcoming",
            identifier,
        ],
    )
