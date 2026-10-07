"""Turn a chapter JSON response into an ordered stream of reference tokens.

The shape handled here is the ``ChapterContent`` discriminated union documented in
``packages/helloao-tools/generation/common-types.ts`` (``ChapterContentSchema``,
line 876). Only content that a narrator actually reads aloud is kept: editorial
headings and footnotes are skipped.
"""

from __future__ import annotations

from collections import Counter
from dataclasses import dataclass

from .normalize import raw_tokenize, tokenize


class ReferenceError(ValueError):
    """Raised when a chapter's verse text cannot be trusted for alignment."""


@dataclass(frozen=True)
class RefToken:
    """One reference word, tagged with the verse it belongs to."""

    verse: int
    index: int
    raw: str
    norm: str


def _text_of(content: list, *, include_inline_headings: bool) -> str:
    """Flatten a verse/subtitle ``content`` array into plain text."""
    parts: list[str] = []
    for item in content:
        if isinstance(item, str):
            parts.append(item)
        elif isinstance(item, dict):
            if "text" in item:
                # FormattedText: {text, poem?, wordsOfJesus?}
                parts.append(str(item["text"]))
            elif "heading" in item:
                # InlineHeading - editorial, not read aloud.
                if include_inline_headings:
                    parts.append(str(item["heading"]))
            elif item.get("lineBreak") is True:
                parts.append(" ")
            elif "noteId" in item:
                # VerseFootnoteReference - never spoken.
                continue
    return " ".join(part for part in parts if part)


def chapter_data(chapter_json: dict) -> dict:
    """Pull the ``ChapterData`` object out of a chapter response.

    Accepts either the full ``/api/{translation}/{book}/{chapter}.json`` payload
    or a bare ``ChapterData`` object.
    """
    if "chapter" in chapter_json and isinstance(chapter_json["chapter"], dict):
        return chapter_json["chapter"]
    if "content" in chapter_json:
        return chapter_json
    raise ReferenceError("response has neither a 'chapter' object nor a 'content' array")


def verse_texts(
    chapter_json: dict,
    *,
    include_hebrew_subtitles: bool = False,
    include_inline_headings: bool = False,
) -> list[tuple[int, str]]:
    """Return ``(verse_number, text)`` pairs in document order."""
    data = chapter_data(chapter_json)
    content = data.get("content")
    if not isinstance(content, list):
        raise ReferenceError("chapter content is missing or not a list")

    verses: list[tuple[int, str]] = []
    pending_subtitle = ""

    for item in content:
        if not isinstance(item, dict):
            continue
        kind = item.get("type")
        if kind == "verse":
            number = item.get("number")
            if not isinstance(number, int):
                raise ReferenceError(f"verse has a non-integer number: {number!r}")
            text = _text_of(
                item.get("content") or [],
                include_inline_headings=include_inline_headings,
            )
            if pending_subtitle:
                text = f"{pending_subtitle} {text}".strip()
                pending_subtitle = ""
            verses.append((number, text))
        elif kind == "hebrew_subtitle" and include_hebrew_subtitles:
            # Psalm superscriptions precede verse 1; some readers voice them, in
            # which case they belong to the front of the first verse.
            pending_subtitle = _text_of(
                item.get("content") or [],
                include_inline_headings=include_inline_headings,
            )
        # "heading" and "line_break" contribute nothing.

    if not verses:
        raise ReferenceError("chapter contains no verses")

    _check_verse_numbering(verses)
    return verses


def _check_verse_numbering(verses: list[tuple[int, str]]) -> None:
    """Require verse numbers that are unique, positive and ascending.

    Gaps are allowed: many translations omit verses that later manuscripts added
    (Matthew 17:21, for example), so the chapter simply has no such verse. The
    output holds one start time per verse *present*, in document order, which is
    what ``numberOfVerses`` counts too.
    """
    numbers = [number for number, _ in verses]
    counts = Counter(numbers)
    duplicates = sorted(number for number, count in counts.items() if count > 1)
    if duplicates:
        raise ReferenceError(f"duplicate verse numbers: {duplicates}")
    if numbers[0] < 1:
        raise ReferenceError(f"verse numbers must start at 1 or above: got {numbers[0]}")
    out_of_order = [
        (previous, current)
        for previous, current in zip(numbers, numbers[1:], strict=False)
        if current < previous
    ]
    if out_of_order:
        previous, current = out_of_order[0]
        raise ReferenceError(
            f"verse numbers are not in ascending order: {current} follows {previous}"
        )


def reference_tokens(
    chapter_json: dict,
    *,
    include_hebrew_subtitles: bool = False,
    include_inline_headings: bool = False,
) -> list[RefToken]:
    """Build the chapter-wide reference token stream."""
    tokens: list[RefToken] = []
    pairs = verse_texts(
        chapter_json,
        include_hebrew_subtitles=include_hebrew_subtitles,
        include_inline_headings=include_inline_headings,
    )
    for number, text in pairs:
        norms = tokenize(text)
        raws = raw_tokenize(text)
        for norm, raw in zip(norms, raws, strict=True):
            tokens.append(RefToken(verse=number, index=len(tokens), raw=raw, norm=norm))

    empty = [number for number, text in pairs if not tokenize(text)]
    if empty:
        raise ReferenceError(f"verses have no readable text: {empty}")

    return tokens


def verse_count(chapter_json: dict) -> int:
    """Number of verses extracted, cross-checked against ``numberOfVerses``."""
    pairs = verse_texts(chapter_json)
    declared = chapter_json.get("numberOfVerses")
    if isinstance(declared, int) and declared != len(pairs):
        raise ReferenceError(
            f"extracted {len(pairs)} verses but the response declares "
            f"numberOfVerses={declared}"
        )
    return len(pairs)


def verse_token_starts(tokens: list[RefToken]) -> dict[int, int]:
    """Map each verse number to the index of its first reference token."""
    starts: dict[int, int] = {}
    for token in tokens:
        starts.setdefault(token.verse, token.index)
    return starts
