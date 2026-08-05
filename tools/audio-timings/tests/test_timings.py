from __future__ import annotations

from bible_audio_timings.align import Anchor, AsrWord, anchor
from bible_audio_timings.reference import RefToken
from bible_audio_timings.timings import Thresholds, derive

from .test_align import asr, ref


def run(
    *,
    asr_words: list[AsrWord],
    ref_tokens: list[RefToken],
    anchors: list[Anchor] | None = None,
    duration: float = 10.0,
    thresholds: Thresholds | None = None,
):
    return derive(
        translation_id="TST",
        book_id="GEN",
        chapter_number=1,
        reader="reader1",
        asr=asr_words,
        ref=ref_tokens,
        anchors=anchors if anchors is not None else anchor(asr_words, ref_tokens),
        audio_duration=duration,
        thresholds=thresholds,
    )


WORDS = ["alpha", "bravo", "charlie", "delta", "echo", "foxtrot"]


def test_verse_starts_come_from_their_first_anchor() -> None:
    stream = asr(WORDS, start=1.0, step=0.5)
    result = run(asr_words=stream, ref_tokens=ref(WORDS), duration=4.2)

    assert [timing.verse for timing in result.verses] == [1, 2, 3]
    assert all(timing.source == "anchor" for timing in result.verses)
    # Verses of 2 words each, so the boundaries land on words 0, 2 and 4.
    assert result.starts == [1.0, 2.0, 3.0]
    assert result.match_rate == 1.0
    assert result.ok


def test_reader_intro_does_not_pull_verse_one_to_zero() -> None:
    spoken = ["test", "book", "chapter", "1", *WORDS]
    result = run(asr_words=asr(spoken, step=0.5), ref_tokens=ref(WORDS), duration=5.2)
    # Verse 1 starts where the text starts, not where the recording starts.
    assert result.starts[0] == 2.0
    assert result.ok


def test_anchor_offset_is_walked_back_at_the_local_rate() -> None:
    """When a verse's first word is misrecognized, back up from the next anchor."""
    # "charlie" is verse 2's first word, and it is the one that got misheard.
    spoken = ["alpha", "bravo", "WRONG", "delta", "echo", "foxtrot"]
    tokens = ref(WORDS)
    stream = asr(spoken, step=0.5)
    result = run(asr_words=stream, ref_tokens=tokens, duration=3.6)

    verse2 = result.verses[1]
    assert verse2.source == "anchor"
    assert verse2.anchor_offset == 1  # anchored on "delta", one word in
    # "delta" starts at 1.5; one word back at ~2.1 words/s lands near 1.0s,
    # rather than reporting verse 2 as starting half a second late.
    assert 0.9 < verse2.start < 1.5


def test_unanchored_verse_is_interpolated() -> None:
    tokens = ref(WORDS)
    stream = asr(WORDS, step=0.5)
    # Drop every anchor belonging to verse 2 (reference indices 2 and 3).
    anchors = [a for a in anchor(stream, tokens) if a.ref_index not in (2, 3)]
    result = run(asr_words=stream, ref_tokens=tokens, anchors=anchors, duration=3.6)

    assert result.verses[1].source == "interpolated"
    assert result.starts[0] < result.starts[1] < result.starts[2]


def test_trailing_unanchored_verses_extend_toward_the_audio_end() -> None:
    tokens = ref(WORDS)
    stream = asr(WORDS, step=0.5)
    anchors = [a for a in anchor(stream, tokens) if a.ref_index < 2]
    result = run(asr_words=stream, ref_tokens=tokens, anchors=anchors, duration=12.0)

    assert result.verses[0].source == "anchor"
    assert [t.source for t in result.verses[1:]] == ["interpolated", "interpolated"]
    assert result.starts == sorted(result.starts)
    assert result.starts[-1] <= 12.0


def test_no_anchors_at_all_spreads_verses_and_rejects() -> None:
    tokens = ref(WORDS)
    result = run(asr_words=asr(WORDS), ref_tokens=tokens, anchors=[], duration=9.0)
    assert result.starts == sorted(result.starts)
    assert not result.ok
    assert any("match rate" in reason for reason in result.rejections)


def test_non_monotonic_starts_are_clamped_and_warned() -> None:
    tokens = ref(WORDS)
    stream = asr(WORDS, step=0.5)
    # Force verse 3's anchor to point at an earlier word than verse 2's.
    anchors = [
        Anchor(asr_index=0, ref_index=0),
        Anchor(asr_index=4, ref_index=2),
        Anchor(asr_index=1, ref_index=4),
    ]
    result = run(asr_words=stream, ref_tokens=tokens, anchors=anchors, duration=3.6)

    assert result.starts == sorted(result.starts)
    assert result.verses[2].source == "clamped"
    assert any("clamped" in warning for warning in result.warnings)


# -- reject rules ---------------------------------------------------------


def test_low_match_rate_is_rejected() -> None:
    tokens = ref(WORDS)
    spoken = ["alpha", "x", "y", "z", "q", "r"]
    result = run(
        asr_words=asr(spoken),
        ref_tokens=tokens,
        duration=5.0,
        thresholds=Thresholds(min_match_rate=0.8, min_audio_coverage=0.0, min_verse_spread=0.0),
    )
    assert not result.ok
    assert any("match rate" in reason for reason in result.rejections)


def test_too_many_interpolated_verses_is_rejected() -> None:
    tokens = ref(WORDS)
    stream = asr(WORDS, step=0.5)
    anchors = [a for a in anchor(stream, tokens) if a.ref_index < 2]
    result = run(
        asr_words=stream,
        ref_tokens=tokens,
        anchors=anchors,
        duration=5.0,
        thresholds=Thresholds(
            min_match_rate=0.0,
            max_interpolated_fraction=0.15,
            min_verse_spread=0.0,
            min_audio_coverage=0.0,
        ),
    )
    assert not result.ok
    assert any("interpolated" in reason for reason in result.rejections)


def test_late_first_verse_is_rejected() -> None:
    tokens = ref(WORDS)
    stream = asr(WORDS, start=200.0, step=0.5)
    result = run(
        asr_words=stream,
        ref_tokens=tokens,
        duration=210.0,
        thresholds=Thresholds(
            max_first_verse_start=90.0,
            min_verse_spread=0.0,
            min_audio_coverage=0.0,
        ),
    )
    assert not result.ok
    assert any("verse 1 starts at" in reason for reason in result.rejections)


def test_wide_verse_gap_is_rejected() -> None:
    tokens = ref(WORDS)
    stream = list(asr(WORDS[:2], start=0.0, step=0.5)) + list(
        asr(WORDS[2:], start=500.0, step=0.5)
    )
    result = run(
        asr_words=stream,
        ref_tokens=tokens,
        duration=520.0,
        thresholds=Thresholds(max_verse_gap=180.0, min_audio_coverage=0.0, min_verse_spread=0.0),
    )
    assert not result.ok
    assert any("gap between verses" in reason for reason in result.rejections)


def test_last_verse_past_the_recording_is_rejected() -> None:
    tokens = ref(WORDS)
    stream = asr(WORDS, start=1.0, step=0.5)
    result = run(
        asr_words=stream,
        ref_tokens=tokens,
        duration=2.0,
        thresholds=Thresholds(min_verse_spread=0.0, min_audio_coverage=0.0),
    )
    assert not result.ok
    assert any("past the" in reason for reason in result.rejections)


def test_only_a_slice_of_the_recording_matching_is_rejected() -> None:
    """Wrong file, wrong edition, or a truncated download."""
    tokens = ref(WORDS)
    stream = asr(WORDS, start=1.0, step=0.2)
    result = run(
        asr_words=stream,
        ref_tokens=tokens,
        # 2 seconds of matched speech in a 10-minute recording.
        duration=600.0,
        thresholds=Thresholds(min_verse_spread=0.0, max_verse_gap=1e9),
    )
    assert not result.ok
    assert any("of the 600s recording matched" in reason for reason in result.rejections)


def test_verse_starts_collapsed_into_a_small_window_are_rejected() -> None:
    tokens = ref(WORDS)
    stream = asr(WORDS, start=0.0, step=1.0)
    # Every verse anchored at the very start, but speech runs to ~6s.
    anchors = [
        Anchor(asr_index=0, ref_index=0),
        Anchor(asr_index=0, ref_index=2),
        Anchor(asr_index=0, ref_index=4),
        Anchor(asr_index=5, ref_index=5),
    ]
    result = run(
        asr_words=stream,
        ref_tokens=tokens,
        anchors=anchors,
        duration=6.0,
        thresholds=Thresholds(min_match_rate=0.0, min_audio_coverage=0.0),
    )
    assert not result.ok
    assert any("span only" in reason for reason in result.rejections)


def test_the_spread_rule_scales_with_verse_count() -> None:
    """A 3-verse chapter can never span more than ~2/3 of its own speech."""
    tokens = ref(WORDS)
    stream = asr(WORDS, start=0.0, step=1.0)
    result = run(
        asr_words=stream,
        ref_tokens=tokens,
        duration=6.5,
        thresholds=Thresholds(min_verse_spread=0.70, min_audio_coverage=0.0),
    )
    # starts 0, 2, 4 against matched speech ending at 5.8 -> 69%, which clears
    # the 0.70 * (2/3) floor rather than being judged against a flat 70%.
    assert result.ok


def test_summary_and_label_are_readable() -> None:
    result = run(asr_words=asr(WORDS, start=1.0), ref_tokens=ref(WORDS), duration=4.2)
    assert result.label == "TST/GEN/1:reader1"
    assert "match=100.0%" in result.summary()
