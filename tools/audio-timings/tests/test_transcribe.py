from __future__ import annotations

import json
import math

import pytest

from bible_audio_timings.transcribe import (
    SUPPORTED_ALIGN_LANGUAGES,
    TranscriptionError,
    _load_fake_asr,
    _to_asr_words,
    default_compute_type,
    resolve_language,
)


def test_iso_639_3_is_mapped_to_whisperx_codes() -> None:
    assert resolve_language("eng") == "en"
    assert resolve_language("spa") == "es"
    assert resolve_language("zho") == "zh"
    # Bibliographic variants of the same language.
    assert resolve_language("ger") == "de"
    assert resolve_language("deu") == "de"


def test_iso_639_1_passes_through() -> None:
    assert resolve_language("en") == "en"
    assert resolve_language("pt") == "pt"


def test_override_wins() -> None:
    assert resolve_language("eng", "fr") == "fr"


def test_unsupported_language_is_a_hard_error_not_a_fallback() -> None:
    with pytest.raises(TranscriptionError, match="no alignment model"):
        resolve_language("xyz")
    with pytest.raises(TranscriptionError, match="pass --language"):
        resolve_language(None)


def test_english_is_not_silently_substituted() -> None:
    """A missing model must never be aligned against the English one."""
    with pytest.raises(TranscriptionError) as error:
        resolve_language("swa")  # Swahili: whisperX has no alignment model
    assert "en" in str(error.value)  # listed as *supported*, not as the answer
    assert "swa" in str(error.value)


def test_supported_languages_are_iso_639_1() -> None:
    assert "en" in SUPPORTED_ALIGN_LANGUAGES
    assert all(len(code) == 2 for code in SUPPORTED_ALIGN_LANGUAGES)


def test_compute_type_defaults_by_device() -> None:
    assert default_compute_type("cuda") == "float16"
    assert default_compute_type("cpu") == "int8"


def test_word_conversion_drops_empty_tokens() -> None:
    words = _to_asr_words(
        [
            {"word": "Alpha,", "start": 0.0, "end": 0.4, "score": 0.9},
            {"word": "--", "start": 0.5, "end": 0.6, "score": 0.1},
            {"word": "three", "start": 0.7, "end": 1.0, "score": 0.8},
        ]
    )
    assert [word.norm for word in words] == ["alpha", "3"]
    assert words[0].raw == "Alpha,"


def test_words_without_timings_are_kept_but_unusable() -> None:
    """whisperX leaves start/end off tokens it could not align."""
    words = _to_asr_words(
        [
            {"word": "alpha", "start": 0.0, "end": 0.4, "score": 0.9},
            {"word": "bravo", "score": 0.0},
            {"word": "charlie", "start": None, "end": None},
        ]
    )
    assert len(words) == 3
    assert words[0].usable
    assert not words[1].usable
    assert not words[2].usable
    assert math.isnan(words[1].start)


def test_reversed_timings_are_unusable() -> None:
    (word,) = _to_asr_words([{"word": "alpha", "start": 5.0, "end": 1.0}])
    assert not word.usable


def test_recorded_asr_stream_is_loaded(tmp_path) -> None:
    path = tmp_path / "asr.json"
    path.write_text(
        json.dumps(
            {
                "duration": 12.5,
                "word_segments": [{"word": "alpha", "start": 1.0, "end": 1.4, "score": 1.0}],
            }
        )
    )
    words, duration = _load_fake_asr(path)
    assert duration == 12.5
    assert [word.norm for word in words] == ["alpha"]


def test_recorded_stream_infers_duration_when_absent(tmp_path) -> None:
    path = tmp_path / "asr.json"
    path.write_text(
        json.dumps(
            {"word_segments": [{"word": "alpha", "start": 1.0, "end": 4.25, "score": 1.0}]}
        )
    )
    _, duration = _load_fake_asr(path)
    assert duration == 4.25
