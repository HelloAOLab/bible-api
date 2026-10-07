from __future__ import annotations

import json

import pytest

from bible_audio_timings.timings import ChapterTimings, VerseTiming
from bible_audio_timings.writers import (
    RECORD_FIELDS,
    durations_to_starts,
    merge,
    read_records,
    to_durations,
    to_record,
    write_records,
)


def timings(starts: list[float], *, duration: float = 30.0) -> ChapterTimings:
    return ChapterTimings(
        translation_id="BSB",
        book_id="GEN",
        chapter_number=1,
        reader="hays",
        verses=[
            VerseTiming(verse=index + 1, start=start, source="anchor")
            for index, start in enumerate(starts)
        ],
        match_rate=1.0,
        audio_duration=duration,
    )


def test_record_matches_the_audio_timing_record_shape() -> None:
    record = to_record(timings([3.0, 14.4, 24.8]))
    assert tuple(record) == RECORD_FIELDS
    assert record == {
        "translationId": "BSB",
        "bookId": "GEN",
        "chapterNumber": 1,
        "reader": "hays",
        "verses": [3.0, 14.4, 24.8],
    }
    assert all(isinstance(value, float) for value in record["verses"])


def test_starts_are_rounded_to_the_requested_precision() -> None:
    record = to_record(timings([1.23456, 2.98765]), precision=2)
    assert record["verses"] == [1.23, 2.99]


def test_start_times_are_non_decreasing() -> None:
    record = to_record(timings([0.0, 5.0, 5.0, 11.25]))
    assert record["verses"] == sorted(record["verses"])


def test_durations_round_trip_back_to_starts() -> None:
    starts = [3.0, 14.4, 24.8]
    record = to_record(timings(starts, duration=31.5))
    durations = to_durations(record, audio_duration=31.5)

    # The last verse runs to the end of the recording.
    assert durations["verses"] == [11.4, 10.4, 6.7]
    # Durations do not record the lead-in before verse 1, so it has to be
    # supplied to get back to absolute start times.
    assert durations_to_starts(durations["verses"], start_offset=starts[0]) == starts
    assert durations_to_starts(durations["verses"]) == [0.0, 11.4, 21.8]
    # Every other field is untouched.
    assert {k: v for k, v in durations.items() if k != "verses"} == {
        k: v for k, v in record.items() if k != "verses"
    }


def test_durations_are_never_negative() -> None:
    record = {"translationId": "T", "bookId": "GEN", "chapterNumber": 1,
              "reader": "r", "verses": [10.0, 5.0]}
    assert to_durations(record, audio_duration=0.0)["verses"] == [0.0, 0.0]


def test_write_and_read_round_trip(tmp_path) -> None:
    path = tmp_path / "out.json"
    records = [to_record(timings([1.0, 2.0]))]
    write_records(path, records)

    assert read_records(path) == records
    # It is a JSON array, which is what `helloao import-audio-timings` parses.
    assert isinstance(json.loads(path.read_text()), list)
    assert not list(tmp_path.glob("*.part"))


def test_read_records_tolerates_a_missing_or_empty_file(tmp_path) -> None:
    assert read_records(tmp_path / "nope.json") == []
    empty = tmp_path / "empty.json"
    empty.write_text("")
    assert read_records(empty) == []


def test_read_records_rejects_a_non_array(tmp_path) -> None:
    path = tmp_path / "object.json"
    path.write_text('{"translationId": "BSB"}')
    with pytest.raises(ValueError, match="JSON array"):
        read_records(path)


def test_records_are_written_in_a_stable_order(tmp_path) -> None:
    path = tmp_path / "out.json"
    write_records(
        path,
        [
            {"translationId": "BSB", "bookId": "GEN", "chapterNumber": 2,
             "reader": "hays", "verses": [0.0]},
            {"translationId": "BSB", "bookId": "GEN", "chapterNumber": 1,
             "reader": "hays", "verses": [0.0]},
        ],
    )
    assert [r["chapterNumber"] for r in read_records(path)] == [1, 2]


def test_merge_upserts_by_chapter_and_reader() -> None:
    original = to_record(timings([1.0]))
    updated = {**original, "verses": [9.0]}
    other_reader = {**original, "reader": "souer"}

    merged = merge([original], [updated, other_reader])
    assert len(merged) == 2
    by_reader = {record["reader"]: record for record in merged}
    assert by_reader["hays"]["verses"] == [9.0]
    assert by_reader["souer"]["verses"] == [1.0]
