"""whisperX wrapper.

This is the only module that touches whisperX, torch, or a GPU. It imports
whisperX lazily inside :meth:`Transcriber.load`, so every other module - and the
whole test suite - imports fine without torch installed.

The ASR model and the alignment model are loaded once per process and reused
across chapters, because model loading dominates the per-chapter cost.
"""

from __future__ import annotations

import json
import logging
import math
import os
from contextlib import contextmanager
from pathlib import Path
from time import perf_counter

from .align import AsrWord
from .normalize import normalize_token

logger = logging.getLogger(__name__)


@contextmanager
def _timed(label: str):
    """Log how long a block took, at INFO, so slow stages are visible."""
    start = perf_counter()
    try:
        yield
    finally:
        logger.info("%s: %.2fs", label, perf_counter() - start)

SAMPLE_RATE = 16000

# whisperX keys its alignment models by ISO 639-1, but the API reports ISO 639-3
# (`common-types.ts:176`). Only languages whisperX can actually align are listed;
# anything missing is a hard error rather than a silent fall back to English.
ISO_639_3_TO_1 = {
    "eng": "en",
    "fra": "fr",
    "fre": "fr",
    "deu": "de",
    "ger": "de",
    "spa": "es",
    "ita": "it",
    "jpn": "ja",
    "zho": "zh",
    "cmn": "zh",
    "nld": "nl",
    "dut": "nl",
    "ukr": "uk",
    "por": "pt",
    "ara": "ar",
    "ces": "cs",
    "cze": "cs",
    "rus": "ru",
    "pol": "pl",
    "hun": "hu",
    "fin": "fi",
    "fas": "fa",
    "per": "fa",
    "ell": "el",
    "gre": "el",
    "tur": "tr",
    "dan": "da",
    "heb": "he",
    "vie": "vi",
    "kor": "ko",
    "urd": "ur",
    "tel": "te",
    "hin": "hi",
    "cat": "ca",
    "mal": "ml",
    "nor": "no",
    "nob": "no",
    "nno": "nn",
    "slk": "sk",
    "slo": "sk",
    "slv": "sl",
    "hrv": "hr",
    "ron": "ro",
    "rum": "ro",
    "eus": "eu",
    "baq": "eu",
    "glg": "gl",
    "kat": "ka",
    "geo": "ka",
    "lav": "lv",
    "tgl": "tl",
    "swe": "sv",
    "ind": "id",
}

SUPPORTED_ALIGN_LANGUAGES = sorted(set(ISO_639_3_TO_1.values()))

# Set to a JSON file of recorded ASR words to exercise the pipeline without
# whisperX. Used by the offline end-to-end check; never set in normal use.
FAKE_ASR_ENV = "BIBLE_AUDIO_TIMINGS_FAKE_ASR"


class TranscriptionError(RuntimeError):
    pass


def resolve_language(code: str | None, override: str | None = None) -> str:
    """Map an API language tag to a whisperX language code."""
    if override:
        candidate = override.strip().lower()
    elif code:
        candidate = code.strip().lower()
    else:
        raise TranscriptionError(
            "no language could be determined; pass --language "
            f"(supported: {', '.join(SUPPORTED_ALIGN_LANGUAGES)})"
        )

    if candidate in SUPPORTED_ALIGN_LANGUAGES:
        return candidate
    mapped = ISO_639_3_TO_1.get(candidate)
    if mapped:
        return mapped
    raise TranscriptionError(
        f"whisperX has no alignment model for language {candidate!r}. "
        f"Supported: {', '.join(SUPPORTED_ALIGN_LANGUAGES)}. "
        "Override with --language if the API's tag is wrong."
    )


def default_device() -> str:
    try:
        import torch
    except ImportError:
        return "cpu"
    return "cuda" if torch.cuda.is_available() else "cpu"


def default_compute_type(device: str) -> str:
    return "float16" if device == "cuda" else "int8"


class Transcriber:
    """Holds the loaded whisperX models for the lifetime of a run."""

    def __init__(
        self,
        *,
        model: str = "large-v2",
        device: str | None = None,
        compute_type: str | None = None,
        batch_size: int = 8,
        align_model: str | None = None,
    ) -> None:
        self.model_name = model
        self.device = device or default_device()
        self.compute_type = compute_type or default_compute_type(self.device)
        self.batch_size = batch_size
        self.align_model_name = align_model
        self._whisperx = None
        self._asr = None
        self._aligners: dict[str, tuple[object, dict]] = {}

    # -- lazy loading -----------------------------------------------------

    @property
    def whisperx(self):
        if self._whisperx is None:
            try:
                import whisperx
            except ImportError as error:  # pragma: no cover - needs the extra
                raise TranscriptionError(
                    "whisperX is not installed. Install the ASR extra:\n"
                    "  uv sync --extra asr"
                ) from error
            self._whisperx = whisperx
        return self._whisperx

    def _asr_model(self):
        if self._asr is None:
            logger.info(
                "loading whisper model %s on %s (%s)",
                self.model_name,
                self.device,
                self.compute_type,
            )
            with _timed("load whisper model"):
                self._asr = self.whisperx.load_model(
                    self.model_name, self.device, compute_type=self.compute_type
                )
        return self._asr

    def _aligner(self, language: str) -> tuple[object, dict]:
        if language not in self._aligners:
            logger.info("loading alignment model for %s", language)
            with _timed(f"load alignment model ({language})"):
                self._aligners[language] = self.whisperx.load_align_model(
                    language_code=language,
                    device=self.device,
                    model_name=self.align_model_name,
                )
        return self._aligners[language]

    # -- the work ---------------------------------------------------------

    def load_audio(self, path: Path):
        return self.whisperx.load_audio(str(path))

    def transcribe_and_align(
        self, audio_path: Path, *, language: str
    ) -> tuple[list[AsrWord], float]:
        """Run ASR then word-level alignment. Returns words and audio duration."""
        fake = os.environ.get(FAKE_ASR_ENV)
        if fake:
            return _load_fake_asr(Path(fake))

        with _timed(f"load audio file {audio_path.name}"):
            audio = self.load_audio(audio_path)
        duration = len(audio) / SAMPLE_RATE

        # `language=language` matters beyond speed: without it whisperX runs its
        # own language auto-detection on every "first" call, and - because it
        # caches the tokenizer on the pipeline object - silently keeps using
        # whichever language it detected first for every later chapter too,
        # even chapters in a different language. We already know the language
        # from the API, so pass it explicitly and skip detection entirely.
        with _timed("transcribe"):
            result = self._asr_model().transcribe(
                audio, batch_size=self.batch_size, language=language
            )
        segments = result.get("segments") or []
        if not segments:
            raise TranscriptionError(f"whisper produced no segments for {audio_path}")

        model, metadata = self._aligner(language)
        with _timed("align"):
            aligned = self.whisperx.align(
                segments,
                model,
                metadata,
                audio,
                self.device,
                return_char_alignments=False,
            )
        return _to_asr_words(aligned.get("word_segments") or []), duration

    def refine(
        self,
        audio_path: Path,
        *,
        language: str,
        segments: list[dict],
    ) -> list[dict]:
        """Force-align known reference text within per-verse windows.

        Each segment must carry ``start``, ``end`` and ``text``. Segments stay
        verse-sized (~10s), so the wav2vec2 activations stay small - unlike
        aligning a whole chapter as one segment, which OOMs on modest GPUs.
        """
        with _timed(f"load audio file {audio_path.name} (refine)"):
            audio = self.load_audio(audio_path)
        model, metadata = self._aligner(language)
        with _timed("refine align"):
            aligned = self.whisperx.align(
                segments,
                model,
                metadata,
                audio,
                self.device,
                return_char_alignments=False,
            )
        return list(aligned.get("segments") or [])


def _to_asr_words(word_segments: list[dict]) -> list[AsrWord]:
    """Convert whisperX word dicts into :class:`AsrWord`, dropping empties.

    Words whose timings are missing or NaN - whisperX cannot align tokens with
    characters outside the wav2vec2 dictionary - are kept in the stream but
    marked unusable, so they still consume a position without being trusted as
    anchors.
    """
    words: list[AsrWord] = []
    for entry in word_segments:
        raw = str(entry.get("word") or "")
        norm = normalize_token(raw)
        if not norm:
            continue
        words.append(
            AsrWord(
                norm=norm,
                start=_number(entry.get("start")),
                end=_number(entry.get("end")),
                score=_number(entry.get("score"), default=0.0),
                raw=raw,
            )
        )
    return words


def _number(value: object, default: float = math.nan) -> float:
    if value is None:
        return default
    try:
        return float(value)  # type: ignore[arg-type]
    except (TypeError, ValueError):
        return default


def _load_fake_asr(path: Path) -> tuple[list[AsrWord], float]:
    """Read a recorded ASR stream so the CLI can run without whisperX."""
    payload = json.loads(path.read_text(encoding="utf-8"))
    words = _to_asr_words(payload.get("word_segments") or [])
    duration = float(payload.get("duration") or 0.0)
    if not duration and words:
        duration = max((word.end for word in words if word.usable), default=0.0)
    logger.warning("using recorded ASR words from %s (%s is set)", path, FAKE_ASR_ENV)
    return words, duration
