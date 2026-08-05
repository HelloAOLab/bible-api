"""Match the ASR word stream against the known reference word stream.

The narration and the reference text are the *same* words, so agreement runs
between the two normalized streams are long and unambiguous. ``difflib`` finds
exactly those runs, which is all a verse boundary needs: one reliable anchor
near the boundary.
"""

from __future__ import annotations

import math
from dataclasses import dataclass
from difflib import SequenceMatcher

from .reference import RefToken


@dataclass(frozen=True)
class AsrWord:
    """One recognized word with its timing, as produced by ``whisperx.align``."""

    norm: str
    start: float
    end: float
    score: float = 0.0
    raw: str = ""

    @property
    def usable(self) -> bool:
        """Whether the timings can be trusted.

        whisperX leaves ``start``/``end`` missing or NaN for tokens it could not
        align (characters outside the wav2vec2 dictionary), and those words must
        not be used as anchors.
        """
        return (
            self.start is not None
            and self.end is not None
            and not math.isnan(self.start)
            and not math.isnan(self.end)
            and self.end >= self.start
        )


@dataclass(frozen=True)
class Anchor:
    """A word the two streams agree on."""

    asr_index: int
    ref_index: int


def anchor(asr: list[AsrWord], ref: list[RefToken]) -> list[Anchor]:
    """Return the agreeing (asr_index, ref_index) pairs, in order.

    ``autojunk=False`` matters a great deal here: with autojunk on,
    ``SequenceMatcher`` treats any token appearing in more than 1% of a sequence
    longer than 200 elements as junk and refuses to match it. In this text that
    silently discards "the", "and", "of", "lord" - the most reliable anchors
    available.
    """
    asr_norms = [word.norm for word in asr]
    ref_norms = [token.norm for token in ref]
    matcher = SequenceMatcher(a=asr_norms, b=ref_norms, autojunk=False)

    anchors: list[Anchor] = []
    for asr_start, ref_start, size in matcher.get_matching_blocks():
        for offset in range(size):
            asr_index = asr_start + offset
            if not asr[asr_index].usable:
                continue
            anchors.append(Anchor(asr_index=asr_index, ref_index=ref_start + offset))
    return anchors


def match_rate(anchors: list[Anchor], ref: list[RefToken]) -> float:
    """Fraction of reference tokens that found an anchor."""
    if not ref:
        return 0.0
    return len(anchors) / len(ref)


def words_per_second(asr: list[AsrWord]) -> float:
    """Median speaking rate over the usable ASR words.

    Used to walk a verse start backwards from its anchor. Falls back to a
    conservative 2.5 words/second when there is not enough signal.
    """
    usable = [word for word in asr if word.usable]
    if len(usable) < 2:
        return 2.5
    span = usable[-1].end - usable[0].start
    if span <= 0:
        return 2.5
    return max(0.5, len(usable) / span)
