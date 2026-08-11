"""Derive per-verse start times from anchors, and judge whether to trust them."""

from __future__ import annotations

import math
from bisect import bisect_left
from dataclasses import dataclass, field
from typing import Literal

from .align import Anchor, AsrWord, match_rate, words_per_second
from .reference import RefToken, verse_token_starts

TimingSource = Literal["anchor", "interpolated", "clamped"]


@dataclass
class Thresholds:
    """Reject criteria. A chapter failing any of these is not emitted."""

    min_match_rate: float = 0.80
    max_interpolated_fraction: float = 0.15
    max_first_verse_start: float = 90.0
    max_verse_gap: float = 180.0

    # How much of the *matched speech* the verse starts must span, as a fraction
    # of the ideal for the chapter's verse count. Catches timings that collapse
    # into a small window. Scaled by (n-1)/n because the last verse's own length
    # is never included, which matters a lot for a short chapter.
    min_verse_spread: float = 0.70

    # How much of the recording matched the text at all. Catches the case where
    # only a slice of the audio corresponds to the chapter - wrong file, wrong
    # edition, truncated download. A reader's intro and outro are short next to a
    # chapter, so this stays well clear of 1.0.
    min_audio_coverage: float = 0.50


@dataclass
class VerseTiming:
    verse: int
    start: float
    source: TimingSource
    anchor_offset: int = 0
    score: float = 0.0


@dataclass
class ChapterTimings:
    translation_id: str
    book_id: str
    chapter_number: int
    reader: str
    verses: list[VerseTiming]
    match_rate: float
    audio_duration: float
    matched_speech_end: float = math.nan
    warnings: list[str] = field(default_factory=list)
    rejections: list[str] = field(default_factory=list)

    @property
    def ok(self) -> bool:
        return not self.rejections

    @property
    def starts(self) -> list[float]:
        return [verse.start for verse in self.verses]

    @property
    def interpolated_fraction(self) -> float:
        if not self.verses:
            return 1.0
        derived = sum(1 for verse in self.verses if verse.source != "anchor")
        return derived / len(self.verses)

    @property
    def label(self) -> str:
        return (
            f"{self.translation_id}/{self.book_id}/{self.chapter_number}:{self.reader}"
        )

    def summary(self) -> str:
        if not self.verses:
            return f"{self.label} no verses"
        return (
            f"{self.label} verses={len(self.verses)} match={self.match_rate:.1%} "
            f"derived={self.interpolated_fraction:.1%} "
            f"first={self.starts[0]:.2f}s last={self.starts[-1]:.2f}s "
            f"audio={self.audio_duration:.2f}s"
        )


def derive(
    *,
    translation_id: str,
    book_id: str,
    chapter_number: int,
    reader: str,
    asr: list[AsrWord],
    ref: list[RefToken],
    anchors: list[Anchor],
    audio_duration: float,
    thresholds: Thresholds | None = None,
) -> ChapterTimings:
    """Turn anchors into one start time per verse, then apply the reject rules."""
    thresholds = thresholds or Thresholds()
    warnings: list[str] = []

    verse_numbers = sorted({token.verse for token in ref})
    first_token_index = verse_token_starts(ref)
    rate = words_per_second(asr)

    # ref_index -> anchor, keeping the earliest anchor for each reference token.
    by_ref: dict[int, Anchor] = {}
    for item in anchors:
        by_ref.setdefault(item.ref_index, item)
    anchored_ref_indices = sorted(by_ref)

    # A verse's anchor has to lie within that verse's own tokens. An anchor
    # belonging to a later verse says nothing about where this one begins, so
    # such a verse is left for interpolation instead.
    verse_end_index = {
        verse: (
            first_token_index[verse_numbers[position + 1]]
            if position + 1 < len(verse_numbers)
            else len(ref)
        )
        for position, verse in enumerate(verse_numbers)
    }

    timings: list[VerseTiming] = []
    for verse in verse_numbers:
        boundary = first_token_index[verse]
        found = _first_anchor_at_or_after(anchored_ref_indices, boundary)
        if found is None or found >= verse_end_index[verse]:
            timings.append(VerseTiming(verse=verse, start=math.nan, source="interpolated"))
            continue

        item = by_ref[found]
        word = asr[item.asr_index]
        offset = found - boundary
        # The anchor may sit a few words into the verse; back it up at the local
        # speaking rate so the highlight does not lag the reader.
        start = max(0.0, word.start - offset / rate)
        timings.append(
            VerseTiming(
                verse=verse,
                start=start,
                source="anchor",
                anchor_offset=offset,
                score=word.score,
            )
        )

    _interpolate(timings, audio_duration)
    clamped = _enforce_monotonic(timings)
    if clamped:
        warnings.append(f"clamped {clamped} non-monotonic verse start(s)")

    rate_matched = match_rate(anchors, ref)
    matched_speech_end = _matched_speech_end(asr, anchors)
    result = ChapterTimings(
        translation_id=translation_id,
        book_id=book_id,
        chapter_number=chapter_number,
        reader=reader,
        verses=timings,
        match_rate=rate_matched,
        audio_duration=audio_duration,
        matched_speech_end=matched_speech_end,
        warnings=warnings,
    )
    result.rejections = _reject(result, thresholds)
    return result


def _matched_speech_end(asr: list[AsrWord], anchors: list[Anchor]) -> float:
    """End time of the last anchored word, i.e. where matched speech stops."""
    ends = [
        asr[item.asr_index].end for item in anchors if asr[item.asr_index].usable
    ]
    return max(ends) if ends else math.nan


def _first_anchor_at_or_after(sorted_ref_indices: list[int], boundary: int) -> int | None:
    position = bisect_left(sorted_ref_indices, boundary)
    if position >= len(sorted_ref_indices):
        return None
    return sorted_ref_indices[position]


def _interpolate(timings: list[VerseTiming], audio_duration: float) -> None:
    """Fill unanchored verses by linear interpolation between anchored ones."""
    known = [i for i, timing in enumerate(timings) if not math.isnan(timing.start)]
    if not known:
        # No anchors at all: spread verses evenly so the shape is at least sane.
        # The reject rules will throw this chapter out regardless.
        span = audio_duration if audio_duration > 0 else float(len(timings))
        for i, timing in enumerate(timings):
            timing.start = span * i / max(1, len(timings))
            timing.source = "interpolated"
        return

    first, last = known[0], known[-1]
    for i in range(first):
        # Leading unanchored verses: pull back from the first known start.
        timings[i].start = timings[first].start * (i + 1) / (first + 1)
        timings[i].source = "interpolated"
    for i in range(last + 1, len(timings)):
        end = audio_duration if audio_duration > timings[last].start else timings[last].start
        step = (end - timings[last].start) / (len(timings) - last)
        timings[i].start = timings[last].start + step * (i - last)
        timings[i].source = "interpolated"

    for left, right in zip(known, known[1:], strict=False):
        gap = right - left
        if gap <= 1:
            continue
        span = timings[right].start - timings[left].start
        for offset in range(1, gap):
            timings[left + offset].start = timings[left].start + span * offset / gap
            timings[left + offset].source = "interpolated"


def _enforce_monotonic(timings: list[VerseTiming]) -> int:
    """Force non-decreasing starts. Returns how many values were corrected."""
    corrected = 0
    for previous, current in zip(timings, timings[1:], strict=False):
        if current.start < previous.start:
            current.start = previous.start
            current.source = "clamped"
            corrected += 1
    return corrected


def _reject(result: ChapterTimings, thresholds: Thresholds) -> list[str]:
    reasons: list[str] = []
    if not result.verses:
        return ["no verses"]

    if result.match_rate < thresholds.min_match_rate:
        reasons.append(
            f"match rate {result.match_rate:.1%} below minimum "
            f"{thresholds.min_match_rate:.1%}"
        )

    derived = result.interpolated_fraction
    if derived > thresholds.max_interpolated_fraction:
        reasons.append(
            f"{derived:.1%} of verses were interpolated or clamped, above "
            f"{thresholds.max_interpolated_fraction:.1%}"
        )

    starts = result.starts
    if starts[0] < 0:
        reasons.append(f"verse 1 starts at a negative time ({starts[0]:.2f}s)")
    elif starts[0] > thresholds.max_first_verse_start:
        reasons.append(
            f"verse 1 starts at {starts[0]:.2f}s, later than "
            f"{thresholds.max_first_verse_start:.0f}s"
        )

    gaps = [b - a for a, b in zip(starts, starts[1:], strict=False)]
    if gaps:
        widest = max(gaps)
        if widest > thresholds.max_verse_gap:
            index = gaps.index(widest)
            reasons.append(
                f"{widest:.1f}s gap between verses {result.verses[index].verse} and "
                f"{result.verses[index + 1].verse}, above {thresholds.max_verse_gap:.0f}s"
            )

    if result.audio_duration > 0 and starts[-1] > result.audio_duration:
        reasons.append(
            f"last verse starts at {starts[-1]:.2f}s, past the "
            f"{result.audio_duration:.2f}s recording"
        )

    speech_end = result.matched_speech_end
    if not math.isnan(speech_end):
        span = speech_end - starts[0]
        if span > 0:
            spread = (starts[-1] - starts[0]) / span
            # The last verse's own length is never part of the span, so an
            # n-verse chapter can at best reach (n-1)/n.
            ideal = (len(starts) - 1) / len(starts)
            floor = thresholds.min_verse_spread * ideal
            if spread < floor:
                reasons.append(
                    f"verse starts span only {spread:.1%} of the matched speech, "
                    f"below the {floor:.1%} expected for {len(starts)} verses"
                )

        if result.audio_duration > 0:
            matched = (speech_end - _matched_speech_start(result)) / result.audio_duration
            if matched < thresholds.min_audio_coverage:
                reasons.append(
                    f"only {matched:.1%} of the {result.audio_duration:.0f}s recording "
                    f"matched the text, below {thresholds.min_audio_coverage:.1%}"
                )

    return reasons


def _matched_speech_start(result: ChapterTimings) -> float:
    return result.starts[0] if result.verses else 0.0
