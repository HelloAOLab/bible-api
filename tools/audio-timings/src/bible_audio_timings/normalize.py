"""Token normalization shared by the reference text and the ASR output.

Both sides of the alignment go through :func:`tokenize`, so a token only has to
match its counterpart *after* normalization. The goal is to erase differences
that are orthographic (punctuation, small-caps LORD, curly quotes) or
transcription-conventional (digits vs. spelled-out numbers) while keeping every
audible word distinct.
"""

from __future__ import annotations

import re
import unicodedata

# Characters that always act as word separators. `--` is common in the API text
# where a typographic em dash would be used, and neither it nor a hyphenated
# compound may glue two spoken words into one token.
_SEPARATORS = re.compile(r"(?:-|[‐-―−/\\|~]|\s)+")

# Quote-like characters folded to a plain apostrophe before punctuation removal,
# so "LORD's" and "LORD’s" tokenize identically.
_APOSTROPHES = dict.fromkeys(map(ord, "‘’ʼʻ‛`´"), "'")

# Everything that is not a letter, a digit or an apostrophe is dropped.
_STRIP = re.compile(r"[^0-9a-z']+")

_ONES = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
]
_ORDINALS = {
    "first": 1,
    "second": 2,
    "third": 3,
    "fourth": 4,
    "fifth": 5,
    "sixth": 6,
    "seventh": 7,
    "eighth": 8,
    "ninth": 9,
    "tenth": 10,
    "eleventh": 11,
    "twelfth": 12,
    "thirteenth": 13,
    "fourteenth": 14,
    "fifteenth": 15,
    "sixteenth": 16,
    "seventeenth": 17,
    "eighteenth": 18,
    "nineteenth": 19,
    "twentieth": 20,
    "thirtieth": 30,
    "fortieth": 40,
    "fiftieth": 50,
    "sixtieth": 60,
    "seventieth": 70,
    "eightieth": 80,
    "ninetieth": 90,
    "hundredth": 100,
    "thousandth": 1000,
}
_TENS = {
    "twenty": 20,
    "thirty": 30,
    "forty": 40,
    "fourty": 40,  # frequent ASR/typo spelling
    "fifty": 50,
    "sixty": 60,
    "seventy": 70,
    "eighty": 80,
    "ninety": 90,
}
_SCALES = {"hundred": 100, "thousand": 1000, "million": 1_000_000}

# word form -> canonical digit form. Numbers are canonicalized *to digits* so
# that a reader saying "chapter one" agrees with a reference reading "1".
_NUMBER_WORDS: dict[str, str] = {}
for _i, _w in enumerate(_ONES):
    _NUMBER_WORDS[_w] = str(_i)
for _w, _v in _TENS.items():
    _NUMBER_WORDS[_w] = str(_v)
for _w, _v in _SCALES.items():
    _NUMBER_WORDS[_w] = str(_v)
for _w, _v in _ORDINALS.items():
    _NUMBER_WORDS[_w] = str(_v)


def _strip_accents(text: str) -> str:
    decomposed = unicodedata.normalize("NFKD", text)
    return "".join(ch for ch in decomposed if not unicodedata.combining(ch))


def normalize_token(word: str) -> str:
    """Normalize a single word.

    Returns the empty string when the token carries no audible content (bare
    punctuation, a verse marker, a stray symbol), in which case callers drop it
    from the stream entirely.
    """
    token = _strip_accents(word.translate(_APOSTROPHES)).casefold()
    token = _STRIP.sub("", token)
    token = token.strip("'")
    if not token:
        return ""

    # Possessives: "lord's" -> "lord", "kings'" -> "kings". Done before the
    # apostrophe is dropped so contractions ("don't") keep their own identity.
    if token.endswith("'s"):
        token = token[:-2]
    elif token.endswith("s'"):
        token = token[:-1]
    token = token.replace("'", "")
    if not token:
        return ""

    # Ordinal digits: "1st" -> "1", "22nd" -> "22".
    ordinal = re.fullmatch(r"(\d+)(?:st|nd|rd|th)", token)
    if ordinal:
        token = ordinal.group(1)

    if token in _NUMBER_WORDS:
        return _NUMBER_WORDS[token]

    # Roman numerals are left alone: they are ambiguous with real words ("i",
    # "mix") and do not appear in the API's verse text.
    return token


def tokenize(text: str) -> list[str]:
    """Split free text into normalized tokens, dropping empties."""
    tokens: list[str] = []
    for chunk in _SEPARATORS.split(text):
        if not chunk:
            continue
        token = normalize_token(chunk)
        if token:
            tokens.append(token)
    return tokens


def raw_tokenize(text: str) -> list[str]:
    """Split text into raw (un-normalized) words on the same boundaries.

    Used to keep a human-readable form alongside each normalized token; the
    result is the same length as :func:`tokenize` for the same input.
    """
    words: list[str] = []
    for chunk in _SEPARATORS.split(text):
        if not chunk:
            continue
        if normalize_token(chunk):
            words.append(chunk)
    return words
