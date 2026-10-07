from __future__ import annotations

import math

from bible_audio_timings.align import AsrWord, anchor, match_rate, words_per_second
from bible_audio_timings.reference import RefToken


def ref(words: list[str], *, per_verse: int = 2) -> list[RefToken]:
    tokens: list[RefToken] = []
    for index, word in enumerate(words):
        tokens.append(
            RefToken(verse=index // per_verse + 1, index=index, raw=word, norm=word)
        )
    return tokens


def asr(words: list[str], *, start: float = 0.0, step: float = 0.5) -> list[AsrWord]:
    stream: list[AsrWord] = []
    time = start
    for word in words:
        stream.append(
            AsrWord(norm=word, start=time, end=time + step * 0.8, score=0.9, raw=word)
        )
        time += step
    return stream


WORDS = ["alpha", "bravo", "charlie", "delta", "echo", "foxtrot"]


def test_perfect_match_anchors_every_token() -> None:
    tokens = ref(WORDS)
    anchors = anchor(asr(WORDS), tokens)
    assert [(a.asr_index, a.ref_index) for a in anchors] == [(i, i) for i in range(6)]
    assert match_rate(anchors, tokens) == 1.0


def test_reader_intro_and_outro_do_not_shift_verse_one() -> None:
    tokens = ref(WORDS)
    spoken = ["test", "book", "chapter", "1", *WORDS, "end", "of", "reading"]
    anchors = anchor(asr(spoken), tokens)
    # Every reference token still finds its anchor, offset by the 4 intro words.
    assert [(a.asr_index, a.ref_index) for a in anchors] == [
        (i + 4, i) for i in range(6)
    ]
    assert match_rate(anchors, tokens) == 1.0


def test_spoken_verse_numbers_are_left_unmatched() -> None:
    tokens = ref(WORDS)
    spoken = ["1", "alpha", "bravo", "2", "charlie", "delta", "3", "echo", "foxtrot"]
    anchors = anchor(asr(spoken), tokens)
    assert match_rate(anchors, tokens) == 1.0
    # The numbers themselves anchored to nothing.
    assert {a.ref_index for a in anchors} == set(range(6))


def test_substituted_words_reduce_the_match_rate() -> None:
    tokens = ref(WORDS)
    spoken = ["alpha", "WRONG", "charlie", "delta", "echo", "foxtrot"]
    anchors = anchor(asr(spoken), tokens)
    assert 1 not in {a.ref_index for a in anchors}
    assert match_rate(anchors, tokens) == 5 / 6


def test_dropped_reference_span_is_simply_unanchored() -> None:
    tokens = ref(WORDS)
    spoken = ["alpha", "bravo", "echo", "foxtrot"]
    anchors = anchor(asr(spoken), tokens)
    assert {a.ref_index for a in anchors} == {0, 1, 4, 5}


def test_unusable_timings_never_become_anchors() -> None:
    tokens = ref(WORDS)
    stream = asr(WORDS)
    stream[2] = AsrWord(norm="charlie", start=math.nan, end=math.nan, score=0.0)
    anchors = anchor(stream, tokens)
    assert 2 not in {a.ref_index for a in anchors}
    assert {a.ref_index for a in anchors} == {0, 1, 3, 4, 5}


def test_stopwords_still_anchor_in_long_streams() -> None:
    """`autojunk=False` is load-bearing.

    With autojunk on, SequenceMatcher discards any token appearing in more than
    1% of a sequence longer than 200 elements - which in this text means "the",
    "and", "of" are never matched.
    """
    words = []
    for index in range(150):
        words += ["the", "word", f"w{index}"]
    tokens = ref(words, per_verse=15)
    anchors = anchor(asr(words, step=0.1), tokens)
    assert len(words) > 200
    assert match_rate(anchors, tokens) == 1.0
    the_indices = {index for index, word in enumerate(words) if word == "the"}
    assert the_indices <= {a.ref_index for a in anchors}


def test_words_per_second_uses_the_usable_words() -> None:
    stream = asr(WORDS, step=0.5)
    assert words_per_second(stream) == 6 / (stream[-1].end - stream[0].start)


def test_words_per_second_falls_back_when_there_is_no_signal() -> None:
    assert words_per_second([]) == 2.5
    assert words_per_second(asr(["alpha"])) == 2.5


def test_empty_reference_has_zero_match_rate() -> None:
    assert match_rate([], []) == 0.0
