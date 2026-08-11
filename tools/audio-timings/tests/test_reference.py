from __future__ import annotations

import copy

import pytest

from bible_audio_timings.reference import (
    ReferenceError,
    reference_tokens,
    verse_count,
    verse_texts,
    verse_token_starts,
)


def test_verse_texts_skips_editorial_content(simple_chapter: dict) -> None:
    pairs = verse_texts(simple_chapter)
    assert [number for number, _ in pairs] == [1, 2, 3, 4]

    texts = dict(pairs)
    # Footnote references contribute nothing.
    assert "footnote" not in texts[1].lower()
    # Poetry lines and inline line breaks flatten into plain text.
    assert "echo foxtrot golf" in texts[2]
    assert "hotel india juliet" in texts[2]
    # Inline headings are editorial and not read aloud by default.
    assert "Inline Heading" not in texts[3]
    assert "kilo lima mike november" in texts[3]
    assert "oscar papa" in texts[3]


def test_inline_headings_can_be_opted_in(simple_chapter: dict) -> None:
    texts = dict(verse_texts(simple_chapter, include_inline_headings=True))
    assert "Inline Heading" in texts[3]


def test_chapter_heading_is_never_included(simple_chapter: dict) -> None:
    joined = " ".join(text for _, text in verse_texts(simple_chapter))
    assert "Editorial Heading" not in joined


def test_hebrew_subtitle_is_opt_in(fixtures) -> None:
    import json

    chapter = json.loads(
        (fixtures / "apiroot/api/TST/GEN/2.json").read_text(encoding="utf-8")
    )
    without = dict(verse_texts(chapter))
    assert "subtitle" not in without[1].lower()

    with_subtitle = dict(verse_texts(chapter, include_hebrew_subtitles=True))
    assert with_subtitle[1].startswith("A subtitle for the second chapter")
    assert "victor whiskey xray" in with_subtitle[1]


def test_reference_tokens_are_indexed_and_tagged(simple_chapter: dict) -> None:
    tokens = reference_tokens(simple_chapter)
    assert [token.index for token in tokens] == list(range(len(tokens)))
    assert tokens[0].verse == 1
    assert tokens[0].norm == "alpha"
    assert tokens[-1].verse == 4
    assert tokens[-1].norm == "uniform"

    starts = verse_token_starts(tokens)
    assert starts == {1: 0, 2: 4, 3: 10, 4: 16}


def test_verse_count_cross_checks_number_of_verses(simple_chapter: dict) -> None:
    assert verse_count(simple_chapter) == 4

    lying = copy.deepcopy(simple_chapter)
    lying["numberOfVerses"] = 7
    with pytest.raises(ReferenceError, match="numberOfVerses=7"):
        verse_count(lying)


def test_non_contiguous_verses_are_rejected(simple_chapter: dict) -> None:
    broken = copy.deepcopy(simple_chapter)
    broken["chapter"]["content"] = [
        item
        for item in broken["chapter"]["content"]
        if not (item.get("type") == "verse" and item.get("number") == 2)
    ]
    with pytest.raises(ReferenceError, match="not contiguous"):
        verse_texts(broken)


def test_duplicate_verses_are_rejected(simple_chapter: dict) -> None:
    broken = copy.deepcopy(simple_chapter)
    verses = [item for item in broken["chapter"]["content"] if item.get("type") == "verse"]
    broken["chapter"]["content"].append(copy.deepcopy(verses[0]))
    with pytest.raises(ReferenceError, match="duplicate verse numbers"):
        verse_texts(broken)


def test_empty_verse_text_is_rejected(simple_chapter: dict) -> None:
    broken = copy.deepcopy(simple_chapter)
    for item in broken["chapter"]["content"]:
        if item.get("type") == "verse" and item["number"] == 3:
            item["content"] = [{"noteId": 0}]
    with pytest.raises(ReferenceError, match=r"no readable text: \[3\]"):
        reference_tokens(broken)


def test_bare_chapter_data_is_accepted(simple_chapter: dict) -> None:
    tokens = reference_tokens(simple_chapter["chapter"])
    assert tokens[0].norm == "alpha"


def test_missing_content_is_rejected() -> None:
    with pytest.raises(ReferenceError):
        verse_texts({"chapter": {"number": 1}})
