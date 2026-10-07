from __future__ import annotations

import pytest

from bible_audio_timings.normalize import normalize_token, raw_tokenize, tokenize


@pytest.mark.parametrize(
    ("word", "expected"),
    [
        ("Alpha", "alpha"),
        ("ALPHA", "alpha"),
        # Small-caps LORD is orthographic, not audible, so it folds to "lord".
        ("LORD", "lord"),
        ("Lord", "lord"),
        ("LORD's", "lord"),
        ("LORD’s", "lord"),
        ("kings'", "kings"),
        ("don't", "dont"),
        ("Bethel,", "bethel"),
        ('"quoted"', "quoted"),
        ("élan", "elan"),
        # Number words canonicalize to digits so a spoken "one" matches a written "1".
        ("one", "1"),
        ("One", "1"),
        ("three", "3"),
        ("twelve", "12"),
        ("forty", "40"),
        ("fourty", "40"),
        ("hundred", "100"),
        ("third", "3"),
        ("1st", "1"),
        ("22nd", "22"),
        ("3", "3"),
        # Pure punctuation carries no audible content.
        ("--", ""),
        (",", ""),
        ("—", ""),
        ("'", ""),
    ],
)
def test_normalize_token(word: str, expected: str) -> None:
    assert normalize_token(word) == expected


@pytest.mark.parametrize(
    ("text", "expected"),
    [
        ("alpha bravo", ["alpha", "bravo"]),
        # `--` in the API text must split words, not glue them.
        ("alpha--bravo", ["alpha", "bravo"]),
        ("alpha—bravo", ["alpha", "bravo"]),
        ("alpha-bravo", ["alpha", "bravo"]),
        ("alpha,  bravo.  charlie!", ["alpha", "bravo", "charlie"]),
        ("  spaced   out  ", ["spaced", "out"]),
        ("verse 1: alpha", ["verse", "1", "alpha"]),
        ("-- , --", []),
    ],
)
def test_tokenize(text: str, expected: list[str]) -> None:
    assert tokenize(text) == expected


def test_raw_tokenize_is_parallel_to_tokenize() -> None:
    text = "Alpha, bravo--CHARLIE's delta -- three"
    assert len(raw_tokenize(text)) == len(tokenize(text))
    assert raw_tokenize(text) == ["Alpha,", "bravo", "CHARLIE's", "delta", "three"]
    assert tokenize(text) == ["alpha", "bravo", "charlie", "delta", "3"]
