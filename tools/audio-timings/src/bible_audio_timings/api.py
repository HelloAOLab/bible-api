"""Minimal client for the Free Use Bible API.

The public API is static JSON on a CDN with no auth and no rate limits, so this
is a thin wrapper over httpx with an on-disk cache. A ``file://`` base is also
accepted, which lets the whole pipeline run against fixtures offline.
"""

from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import urlparse

import httpx

DEFAULT_API_BASE = "https://bible.helloao.org"


class ApiError(RuntimeError):
    pass


@dataclass(frozen=True)
class BookRef:
    id: str
    name: str
    number_of_chapters: int


class BibleApi:
    def __init__(
        self,
        base: str = DEFAULT_API_BASE,
        *,
        client: httpx.Client | None = None,
        timeout: float = 60.0,
    ) -> None:
        self.base = base.rstrip("/")
        self._local_root: Path | None = None
        parsed = urlparse(self.base)
        if parsed.scheme == "file":
            self._local_root = Path(parsed.path)
        elif not parsed.scheme:
            self._local_root = Path(self.base).resolve()
        self._client = client
        self._timeout = timeout

    # -- plumbing ---------------------------------------------------------

    @property
    def client(self) -> httpx.Client:
        if self._client is None:
            self._client = httpx.Client(timeout=self._timeout, follow_redirects=True)
        return self._client

    def close(self) -> None:
        if self._client is not None:
            self._client.close()
            self._client = None

    def __enter__(self) -> BibleApi:
        return self

    def __exit__(self, *_exc: object) -> None:
        self.close()

    def url_for(self, path: str) -> str:
        """Resolve an API-relative path (``/api/...``) against the base."""
        return f"{self.base}/{path.lstrip('/')}"

    def get_json(self, path: str) -> dict:
        if self._local_root is not None:
            file = self._local_root / path.lstrip("/")
            if not file.is_file():
                raise ApiError(f"no such fixture: {file}")
            return json.loads(file.read_text(encoding="utf-8"))

        url = self.url_for(path)
        try:
            response = self.client.get(url)
        except httpx.HTTPError as error:
            raise ApiError(f"GET {url} failed: {error}") from error
        if response.status_code != 200:
            raise ApiError(f"GET {url} returned {response.status_code}")
        try:
            return response.json()
        except ValueError as error:
            raise ApiError(f"GET {url} did not return JSON: {error}") from error

    # -- endpoints --------------------------------------------------------

    def available_translations(self) -> list[dict]:
        payload = self.get_json("/api/available_translations.json")
        return list(payload.get("translations") or [])

    def books(self, translation_id: str) -> list[BookRef]:
        payload = self.get_json(f"/api/{translation_id}/books.json")
        books = payload.get("books")
        if not isinstance(books, list):
            raise ApiError(f"{translation_id}/books.json has no 'books' array")
        refs: list[BookRef] = []
        for book in books:
            refs.append(
                BookRef(
                    id=str(book.get("id")),
                    name=str(book.get("name") or book.get("commonName") or book.get("id")),
                    number_of_chapters=int(book.get("numberOfChapters") or 0),
                )
            )
        return refs

    def chapter(self, translation_id: str, book_id: str, chapter: int) -> dict:
        return self.get_json(f"/api/{translation_id}/{book_id}/{chapter}.json")

    def download(self, url: str, destination: Path) -> Path:
        """Download a media file, writing atomically."""
        if self._local_root is not None and not urlparse(url).scheme:
            source = self._local_root / url.lstrip("/")
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_bytes(source.read_bytes())
            return destination

        destination.parent.mkdir(parents=True, exist_ok=True)
        partial = destination.with_suffix(destination.suffix + ".part")
        try:
            with self.client.stream("GET", url) as response:
                if response.status_code != 200:
                    raise ApiError(f"GET {url} returned {response.status_code}")
                with partial.open("wb") as handle:
                    for block in response.iter_bytes(chunk_size=1 << 16):
                        handle.write(block)
        except httpx.HTTPError as error:
            partial.unlink(missing_ok=True)
            raise ApiError(f"downloading {url} failed: {error}") from error
        partial.replace(destination)
        return destination


def audio_link(chapter_json: dict, reader: str) -> str | None:
    """The audio URL for a reader, from ``thisChapterAudioLinks``."""
    links = chapter_json.get("thisChapterAudioLinks") or {}
    url = links.get(reader)
    return str(url) if url else None


def readers(chapter_json: dict) -> list[str]:
    """Readers with audio for this chapter, in a stable order."""
    links = chapter_json.get("thisChapterAudioLinks") or {}
    return sorted(str(reader) for reader in links)


def language_code(chapter_json: dict) -> str | None:
    """The translation's ISO 639-3 language tag, if present."""
    translation = chapter_json.get("translation") or {}
    code = translation.get("language")
    return str(code) if code else None
