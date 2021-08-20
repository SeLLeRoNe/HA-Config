from dataclasses import dataclass
from enum import Enum

from .media import Media, Movie, Show


@dataclass
class CalendarInformation:
    identifier: str
    name: str
    path: str
    model: Media


class TraktKind(Enum):
    SHOW = CalendarInformation("show", "Shows", "my/shows", Show)
    NEW_SHOW = CalendarInformation("new_show", "New Shows", "my/shows/new", Show)
    PREMIERE = CalendarInformation("premiere", "Premieres", "my/shows/premieres", Show)
    MOVIE = CalendarInformation("movie", "Movies", "my/movies", Movie)
    DVD = CalendarInformation("dvd", "DVD", "my/dvd", Movie)
