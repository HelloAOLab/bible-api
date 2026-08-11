from __future__ import annotations

import json

import pytest

from bible_audio_timings.api import BibleApi
from bible_audio_timings.cache import Cache, ChapterKey
from bible_audio_timings.cli import (
    Target,
    UsageError,
    build_parser,
    expand,
    local_audio,
    main,
    parse_target,
)
from bible_audio_timings.transcribe import FAKE_ASR_ENV
from bible_audio_timings.writers import read_records

# -- target parsing -------------------------------------------------------


@pytest.mark.parametrize(
    ("text", "expected"),
    [
        ("BSB", Target("BSB")),
        ("BSB/GEN", Target("BSB", "GEN")),
        ("BSB/GEN/1", Target("BSB", "GEN", 1, 1)),
        ("BSB/GEN/1-5", Target("BSB", "GEN", 1, 5)),
        ("BSB/GEN/1:hays", Target("BSB", "GEN", 1, 1, "hays")),
        ("BSB:hays", Target("BSB", None, None, None, "hays")),
    ],
)
def test_parse_target(text: str, expected: Target) -> None:
    assert parse_target(text) == expected


@pytest.mark.parametrize(
    "text", ["", "BSB/GEN/1/2", "BSB/GEN/x", "BSB/GEN/5-1", "BSB/GEN/0"]
)
def test_parse_target_rejects_nonsense(text: str) -> None:
    with pytest.raises(UsageError):
        parse_target(text)


# -- expansion against fixture API ---------------------------------------


@pytest.fixture
def api(fixtures) -> BibleApi:
    return BibleApi(f"file://{fixtures / 'apiroot'}")


def test_expand_whole_translation(api: BibleApi) -> None:
    assert expand(api, parse_target("TST")) == [("TST", "GEN", 1), ("TST", "GEN", 2)]


def test_expand_single_chapter(api: BibleApi) -> None:
    assert expand(api, parse_target("TST/GEN/1")) == [("TST", "GEN", 1)]


def test_expand_clamps_a_range_to_the_book_length(api: BibleApi) -> None:
    assert expand(api, parse_target("TST/GEN/1-99")) == [
        ("TST", "GEN", 1),
        ("TST", "GEN", 2),
    ]


def test_expand_rejects_an_unknown_book(api: BibleApi) -> None:
    with pytest.raises(UsageError, match="no book"):
        expand(api, parse_target("TST/XYZ"))


def test_expand_rejects_a_chapter_past_the_end(api: BibleApi) -> None:
    with pytest.raises(UsageError, match="2 chapters"):
        expand(api, parse_target("TST/GEN/9"))


# -- local audio discovery ------------------------------------------------


def test_local_audio_finds_fetch_audio_layout(tmp_path) -> None:
    key = ChapterKey("BSB", "GEN", 1, "hays")
    target = tmp_path / "audio" / "BSB" / "GEN" / "1.hays.mp3"
    target.parent.mkdir(parents=True)
    target.write_bytes(b"")
    assert local_audio(tmp_path, key) == target


def test_local_audio_accepts_a_flat_directory(tmp_path) -> None:
    key = ChapterKey("BSB", "GEN", 1, "hays")
    target = tmp_path / "1.hays.wav"
    target.write_bytes(b"")
    assert local_audio(tmp_path, key) == target


def test_local_audio_returns_none_when_absent(tmp_path) -> None:
    assert local_audio(tmp_path, ChapterKey("BSB", "GEN", 1, "hays")) is None


# -- end to end, offline --------------------------------------------------


def test_dry_run_reports_without_transcribing(fixtures, tmp_path, caplog) -> None:
    caplog.set_level("INFO")
    code = main(
        [
            "TST/GEN/1",
            "--api-base",
            f"file://{fixtures / 'apiroot'}",
            "--dry-run",
            "--cache-dir",
            str(tmp_path / "cache"),
            "-o",
            str(tmp_path / "out.json"),
        ]
    )
    assert code == 0
    assert not (tmp_path / "out.json").exists()
    assert "verses=4 words=21" in caplog.text


def test_full_run_with_recorded_asr(fixtures, tmp_path, monkeypatch, caplog) -> None:
    caplog.set_level("INFO")
    monkeypatch.setenv(FAKE_ASR_ENV, str(fixtures / "asr/TST_GEN_1.reader1.json"))
    audio = tmp_path / "1.reader1.mp3"
    audio.write_bytes(b"not really audio - the ASR stream is recorded")
    output = tmp_path / "out.json"

    code = main(
        [
            "TST/GEN/1:reader1",
            "--api-base",
            f"file://{fixtures / 'apiroot'}",
            "--audio",
            str(audio),
            "--cache-dir",
            str(tmp_path / "cache"),
            "-o",
            str(output),
        ]
    )

    assert code == 0
    records = read_records(output)
    assert len(records) == 1
    record = records[0]
    assert record["translationId"] == "TST"
    assert record["bookId"] == "GEN"
    assert record["chapterNumber"] == 1
    assert record["reader"] == "reader1"
    assert len(record["verses"]) == 4
    # The reader's 4-word intro means verse 1 does not start at 0.
    assert record["verses"][0] == pytest.approx(2.5, abs=0.01)
    assert record["verses"] == sorted(record["verses"])
    # ...and the outro means the last verse starts before the recording ends.
    assert record["verses"][-1] < 16.0


def test_resume_skips_completed_chapters(fixtures, tmp_path, monkeypatch, caplog) -> None:
    monkeypatch.setenv(FAKE_ASR_ENV, str(fixtures / "asr/TST_GEN_1.reader1.json"))
    audio = tmp_path / "1.reader1.mp3"
    audio.write_bytes(b"x")
    cache_dir = tmp_path / "cache"
    argv = [
        "TST/GEN/1:reader1",
        "--api-base",
        f"file://{fixtures / 'apiroot'}",
        "--audio",
        str(audio),
        "--cache-dir",
        str(cache_dir),
        "-o",
        str(tmp_path / "out.json"),
    ]
    assert main(argv) == 0
    assert Cache(cache_dir).is_done(ChapterKey("TST", "GEN", 1, "reader1"))

    caplog.clear()
    caplog.set_level("INFO")
    assert main([*argv, "--resume"]) == 0
    assert "already done, skipping" in caplog.text


def test_thresholds_reject_and_set_a_failing_exit_code(
    fixtures, tmp_path, monkeypatch
) -> None:
    monkeypatch.setenv(FAKE_ASR_ENV, str(fixtures / "asr/TST_GEN_1.reader1.json"))
    audio = tmp_path / "1.reader1.mp3"
    audio.write_bytes(b"x")
    output = tmp_path / "out.json"

    code = main(
        [
            "TST/GEN/1:reader1",
            "--api-base",
            f"file://{fixtures / 'apiroot'}",
            "--audio",
            str(audio),
            "--cache-dir",
            str(tmp_path / "cache"),
            "-o",
            str(output),
            # An impossible bar, so a perfectly good chapter is still rejected.
            "--min-match-rate",
            "1.01",
        ]
    )
    assert code == 1
    assert read_records(output) == []


def test_force_emits_a_rejected_chapter(fixtures, tmp_path, monkeypatch) -> None:
    monkeypatch.setenv(FAKE_ASR_ENV, str(fixtures / "asr/TST_GEN_1.reader1.json"))
    audio = tmp_path / "1.reader1.mp3"
    audio.write_bytes(b"x")
    output = tmp_path / "out.json"

    code = main(
        [
            "TST/GEN/1:reader1",
            "--api-base",
            f"file://{fixtures / 'apiroot'}",
            "--audio",
            str(audio),
            "--cache-dir",
            str(tmp_path / "cache"),
            "-o",
            str(output),
            "--min-match-rate",
            "1.01",
            "--force",
        ]
    )
    assert code == 0
    assert len(read_records(output)) == 1


def test_durations_requires_an_explicit_output(capsys) -> None:
    with pytest.raises(SystemExit):
        main(["TST/GEN/1", "--durations"])
    assert "does not produce the import format" in capsys.readouterr().err


def test_chapter_with_no_audio_is_skipped(fixtures, tmp_path, caplog) -> None:
    caplog.set_level("INFO")
    code = main(
        [
            "TST/GEN/2",
            "--api-base",
            f"file://{fixtures / 'apiroot'}",
            "--cache-dir",
            str(tmp_path / "cache"),
            "-o",
            str(tmp_path / "out.json"),
        ]
    )
    assert code == 0
    assert "no audio for the requested reader" in caplog.text


def test_parser_help_lists_the_target_forms() -> None:
    help_text = build_parser().format_help()
    for form in ("BSB/GEN/1", "BSB/GEN/1-5", "BSB/GEN/1:hays"):
        assert form in help_text


def test_output_is_a_json_array_of_records(fixtures, tmp_path, monkeypatch) -> None:
    monkeypatch.setenv(FAKE_ASR_ENV, str(fixtures / "asr/TST_GEN_1.reader1.json"))
    audio = tmp_path / "1.reader1.mp3"
    audio.write_bytes(b"x")
    output = tmp_path / "out.json"
    main(
        [
            "TST/GEN/1:reader1",
            "--api-base",
            f"file://{fixtures / 'apiroot'}",
            "--audio",
            str(audio),
            "--cache-dir",
            str(tmp_path / "cache"),
            "-o",
            str(output),
        ]
    )
    payload = json.loads(output.read_text())
    assert isinstance(payload, list)
    assert isinstance(payload[0], dict)
