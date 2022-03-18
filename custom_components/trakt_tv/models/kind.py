from dataclasses import dataclass
from enum import Enum

from .media import Media, Movie, Show, UpcomingMovie, UpcomingShow


@dataclass
class CalendarInformation:
    identifier: str
    name: str
    path: str
    model: Media
    upcoming_model: Media


class TraktKind(Enum):
    SHOW = CalendarInformation("show", "Shows", "shows", Show, UpcomingShow)
    NEW_SHOW = CalendarInformation(
        "new_show", "New Shows", "shows/new", Show, UpcomingShow
    )
    PREMIERE = CalendarInformation(
        "premiere", "Premieres", "shows/premieres", Show, UpcomingShow
    )
    MOVIE = CalendarInformation("movie", "Movies", "movies", Movie, UpcomingMovie)
    DVD = CalendarInformation("dvd", "DVD", "dvd", Movie, UpcomingMovie)


BASIC_KINDS = [TraktKind.SHOW, TraktKind.MOVIE]
