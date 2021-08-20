import json
from abc import ABC, abstractmethod, abstractstaticmethod
from asyncio import gather
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import List, Optional

import aiohttp

from ..const import TMDB_TOKEN, UPCOMING_DATA_FORMAT


@dataclass
class Identifiers:
    trakt: Optional[int]
    slug: Optional[str]
    tvdb: Optional[int]
    imdb: Optional[str]
    tmdb: Optional[int]

    @staticmethod
    def from_trakt(data) -> "Identifiers":
        """
        Create identifiers from trakt api by providing the base root of the ids.
        """
        ids = data["ids"]

        return Identifiers(
            trakt=int(ids["trakt"]) if ids.get("trakt") else None,
            slug=ids.get("slug"),
            tvdb=int(ids["tvdb"]) if ids.get("tvdb") else None,
            imdb=ids.get("imdb"),
            tmdb=int(ids["tmdb"]) if ids.get("tmdb") else None,
        )


@dataclass
class Media(ABC):
    name: str
    released: datetime
    ids: Identifiers

    @abstractstaticmethod
    def from_trakt(data) -> "Media":
        """
        Create a model from trakt api.
        """

    @abstractmethod
    def to_upcoming(self):
        """
        Convert the Media to upcoming data.
        """

    async def get_more_information(self, language):
        """
        Get information from other API calls to complete the trakt movie.

        :param language: The favorite language of the user
        """


@dataclass
class Movie(Media):
    """
    A movie
    """

    poster: Optional[str] = None
    fanart: Optional[str] = None
    genres: List[str] = field(default_factory=list)
    rating: Optional[int] = None
    runtime: Optional[int] = None

    @staticmethod
    def from_trakt(data) -> "Movie":
        """
        Create a Movie from trakt api.
        """
        movie = data["movie"]

        return Movie(
            name=movie["title"],
            released=datetime.fromisoformat(data["released"]),
            ids=Identifiers.from_trakt(movie),
        )

    async def get_more_information(self, language):
        """
        Get information from other API calls to complete the trakt movie.

        :param language: The favorite language of the user
        """
        host = "http://api.tmdb.org"
        url = f"{host}/3/movie/{self.ids.tmdb}?api_key={TMDB_TOKEN}&language={language}"
        async with aiohttp.request("GET", url) as response:
            json = await response.json()
            if title := json.get("title"):
                self.name = title
            if poster := json.get("poster_path"):
                self.poster = f"https://image.tmdb.org/t/p/w500{poster}"
            if fanart := json.get("backdrop_path"):
                self.fanart = f"https://image.tmdb.org/t/p/w500{fanart}"
            if genres := json.get("genres"):
                self.genres = [genre["name"] for genre in genres]
            if vote_average := json.get("vote_average"):
                if vote_average != 0:
                    self.rating = vote_average
            if runtime := json.get("runtime"):
                self.runtime = runtime

    def to_upcoming(self):
        """
        Convert the Movie to upcoming data.
        """
        default = {
            "title": self.name,
            "release": "$day, $date $time",
            "airdate": self.released.isoformat() + "Z",
            "poster": self.poster,
            "fanart": self.fanart,
            "genres": self.genres,
            "rating": self.rating,
            "runtime": self.runtime,
        }

        return {k: v for k, v in default.items() if v is not None}


@dataclass
class Episode:
    number: int
    season: int
    title: str
    ids: Identifiers

    @staticmethod
    def from_trakt(data) -> "Episode":
        """
        Create an Episode from trakt api.
        """
        episode = data["episode"]

        return Episode(
            number=episode["number"],
            season=episode["season"],
            title=episode["title"],
            ids=Identifiers.from_trakt(episode),
        )


@dataclass
class Show(Media):
    episode: Episode
    poster: Optional[str] = None

    @staticmethod
    def from_trakt(data) -> "Show":
        """
        Create a Show from trakt api.
        """
        show = data["show"]

        return Show(
            name=show["title"],
            released=datetime.strptime(data["first_aired"], UPCOMING_DATA_FORMAT),
            ids=Identifiers.from_trakt(show),
            episode=Episode.from_trakt(data),
        )

    async def get_more_information(self, language):
        """
        Get information from other API calls to complete the trakt movie.

        :param language: The favorite language of the user
        """
        host = "http://api.tmdb.org"
        url = f"{host}/3/tv/{self.ids.tmdb}?api_key={TMDB_TOKEN}&language={language}"
        async with aiohttp.request("GET", url) as response:
            json = await response.json()
            if title := json.get("title"):
                self.name = title
            season = [
                season
                for season in json.get("seasons", [])
                if season["season_number"] == self.episode.season
            ]
            if season:
                poster = season[0]["poster_path"]
                self.poster = f"https://image.tmdb.org/t/p/w500{poster}"
            if fanart := json.get("backdrop_path"):
                self.fanart = f"https://image.tmdb.org/t/p/w500{fanart}"
            if genres := json.get("genres"):
                self.genres = [genre["name"] for genre in genres]
            if vote_average := json.get("vote_average"):
                if vote_average != 0:
                    self.rating = vote_average

    def to_upcoming(self):
        """
        Convert the Show to upcoming data
        """
        default = {
            "title": self.name,
            "release": "$day, $date $time",
            "airdate": self.released.isoformat() + "Z",
            "poster": self.poster,
            "fanart": self.fanart,
            "genres": self.genres,
            "rating": self.rating,
        }

        return {k: v for k, v in default.items() if v is not None}


@dataclass
class Medias:
    items: List[Media]

    @staticmethod
    def first_item():
        return {
            "title_default": "$title",
            "line1_default": "$episode",
            "line2_default": "$release",
            "line3_default": "$rating - $runtime",
            "line4_default": "$number - $studio",
            "icon": "mdi:arrow-down-bold",
        }

    def to_upcoming(self):
        """
        Convert the List of Media to upcoming data
        """
        medias = sorted(self.items, key=lambda media: media.released)
        medias = [media.to_upcoming() for media in medias]
        return [Medias.first_item()] + medias
