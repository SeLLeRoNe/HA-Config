"""API for TraktTV bound to Home Assistant OAuth."""
import json
import logging
import math
from asyncio import gather, run_coroutine_threadsafe
from datetime import datetime, timedelta

from aiohttp import ClientResponse, ClientSession
from async_timeout import timeout
from homeassistant import core
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CONF_CLIENT_ID
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_entry_oauth2_flow
from homeassistant.helpers.config_entry_oauth2_flow import OAuth2Session
from homeassistant.helpers.update_coordinator import UpdateFailed

from .const import API_HOST, DOMAIN
from .model.kind import TraktKind
from .model.media import Medias
from .utils import nested_get, should_compute_identifier

LOGGER = logging.getLogger(__name__)


class TraktApi:
    """Provide TraktTV authentication tied to an OAuth2 based config entry."""

    def __init__(
        self,
        websession: ClientSession,
        oauth_session: OAuth2Session,
        entry: ConfigEntry,
        hass: HomeAssistant,
    ):
        """Initialize TraktTV auth."""
        self.web_session = websession
        self.host = API_HOST
        self.oauth_session = oauth_session
        self.hass = hass

    async def async_get_access_token(self) -> str:
        """Return a valid access token."""
        if not self.oauth_session.valid_token:
            await self.oauth_session.async_ensure_token_valid()

        return self.oauth_session.token["access_token"]

    async def request(self, method, url, **kwargs) -> ClientResponse:
        """Make a request."""
        access_token = await self.async_get_access_token()
        client_id = self.hass.data[DOMAIN]["configuration"]["client_id"]
        headers = {
            **kwargs.get("headers", {}),
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}",
            "trakt-api-version": "2",
            "trakt-api-key": client_id,
        }

        return await self.web_session.request(
            method,
            f"{self.host}/{url}",
            **kwargs,
            headers=headers,
        )

    async def get_calendar(self, path, from_date, nb_days):
        return await self.request("get", f"calendars/{path}/{from_date}/{nb_days}")

    async def fetch_calendar(self, trakt_kind: TraktKind):
        """
        Fetch the calendar of the user trakt account based on the trak_type containing
        the calendar type.

        Since the maximum number of days to fetch using trakt API is 33 days, we have to
        make multiple API calls if we want to retrieve a larger amount of time.

        :param trak_type: The TraktKind describing which calendar we should request
        """
        if not should_compute_identifier(self.hass, trakt_kind.value.identifier):
            return None

        days = (
            nested_get(
                self.hass.data,
                [
                    DOMAIN,
                    "configuration",
                    "sensors",
                    "upcoming",
                    trakt_kind.value.identifier,
                    "days_to_fetch",
                ],
            )
            or 30
        )

        language = (
            nested_get(
                self.hass.data,
                [DOMAIN, "configuration", "language"],
            )
            or "en"
        )

        max_fetch_days = 33
        total_partition = math.ceil(days / max_fetch_days)
        partition_results = []
        for partition in range(0, total_partition):
            from_date = datetime.now() + timedelta(partition * max_fetch_days)
            days = (
                max_fetch_days
                if partition != total_partition - 1
                else days % max_fetch_days
            )
            partition_results.append((from_date.strftime("%Y-%m-%d"), days))

        responses = await gather(
            *[
                self.get_calendar(trakt_kind.value.path, result[0], result[1])
                for result in partition_results
            ]
        )
        texts = await gather(*[response.text() for response in responses])
        data = [media for medias in texts for media in json.loads(medias)]
        medias = [trakt_kind.value.model.from_trakt(movie) for movie in data]
        await gather(*[media.get_more_information(language) for media in medias])
        return trakt_kind, Medias(medias)

    async def retrieve_data(self):
        async with timeout(60):
            calendars = await gather(
                *[self.fetch_calendar(trakt_kind) for trakt_kind in TraktKind]
            )
            data = [calendar for calendar in calendars if calendar]
            data = {trakt_kind: medias for trakt_kind, medias in data}
            return data
