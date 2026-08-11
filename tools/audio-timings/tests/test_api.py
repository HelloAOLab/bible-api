from __future__ import annotations

import pytest

from bible_audio_timings.api import ApiError, BibleApi, audio_link, language_code, readers


@pytest.fixture
def api(fixtures) -> BibleApi:
    return BibleApi(f"file://{fixtures / 'apiroot'}")


def test_books_reads_the_chapter_counts(api: BibleApi) -> None:
    books = api.books("TST")
    assert [book.id for book in books] == ["GEN"]
    assert books[0].number_of_chapters == 2


def test_chapter_is_fetched_by_path(api: BibleApi) -> None:
    chapter = api.chapter("TST", "GEN", 1)
    assert chapter["chapter"]["number"] == 1


def test_missing_fixture_raises(api: BibleApi) -> None:
    with pytest.raises(ApiError, match="no such fixture"):
        api.chapter("TST", "GEN", 9)


def test_url_for_joins_relative_api_paths() -> None:
    api = BibleApi("https://bible.helloao.org/")
    assert api.url_for("/api/BSB/GEN/1.json") == "https://bible.helloao.org/api/BSB/GEN/1.json"


def test_audio_link_and_readers(api: BibleApi) -> None:
    chapter = api.chapter("TST", "GEN", 1)
    assert readers(chapter) == ["reader1"]
    assert audio_link(chapter, "reader1") == "/media/TST/GEN/1.reader1.mp3"
    assert audio_link(chapter, "nobody") is None


def test_chapter_without_audio_has_no_readers(api: BibleApi) -> None:
    assert readers(api.chapter("TST", "GEN", 2)) == []


def test_language_code_is_the_iso_639_3_tag(api: BibleApi) -> None:
    assert language_code(api.chapter("TST", "GEN", 1)) == "eng"
    assert language_code({}) is None
