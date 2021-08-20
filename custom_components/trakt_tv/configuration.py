import logging

import voluptuous as vol
from homeassistant.helpers import config_validation as cv

from .const import DOMAIN, LANGUAGE_CODES
from .model.kind import TraktKind


def build_config_schema():
    return vol.Schema(
        {DOMAIN: build_config_domain_schema()},
        extra=vol.ALLOW_EXTRA,
    )


def build_config_domain_schema():
    return vol.Schema(
        {
            "sensors": vol.Schema(
                {
                    vol.Required("upcoming"): build_config_upcoming_schema(),
                }
            ),
            vol.Required("language"): vol.In(LANGUAGE_CODES),
            vol.Required("update_interval", default=30): cv.positive_int,
        }
    )


def build_config_upcoming_schema():
    subschemas = {}
    for trakt_kind in TraktKind:
        subschemas[trakt_kind.value.identifier] = vol.Schema(
            {
                vol.Required("days_to_fetch", default=90): cv.positive_int,
                vol.Required("max_medias", default=3): cv.positive_int,
            }
        )
    return vol.Schema(subschemas)
