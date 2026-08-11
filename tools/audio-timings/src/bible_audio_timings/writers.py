"""Output writer for the ``helloao import-audio-timings`` format.

The record shape is ``AudioTimingRecord`` in
``packages/helloao-cli/actions.ts:572``:

    { translationId, bookId, chapterNumber, reader, verses: number[] }

where ``verses`` holds the time in seconds at which each verse *starts*, in verse
order (``schema.prisma:262``, ``api.ts:1386``). Note that the example array in
issue #10 is per-verse *durations* copied from biblehub's ``hays.js`` - it is not
monotonic - so ``--durations`` exists only for interoperating with data in that
older convention.
"""

from __future__ import annotations

import json
from pathlib import Path

from .timings import ChapterTimings

RECORD_FIELDS = ("translationId", "bookId", "chapterNumber", "reader", "verses")


def to_record(timings: ChapterTimings, *, precision: int = 3) -> dict:
    """Build one ``AudioTimingRecord``."""
    return {
        "translationId": timings.translation_id,
        "bookId": timings.book_id,
        "chapterNumber": timings.chapter_number,
        "reader": timings.reader,
        "verses": [round(start, precision) for start in timings.starts],
    }


def to_durations(record: dict, *, audio_duration: float, precision: int = 3) -> dict:
    """Convert a start-time record to the per-verse duration convention."""
    starts = record["verses"]
    durations: list[float] = []
    for index, start in enumerate(starts):
        end = starts[index + 1] if index + 1 < len(starts) else audio_duration
        durations.append(round(max(0.0, end - start), precision))
    return {**record, "verses": durations}


def durations_to_starts(
    durations: list[float], *, start_offset: float = 0.0, precision: int = 3
) -> list[float]:
    """Inverse of :func:`to_durations` - the cumulative sum of durations.

    ``start_offset`` is the time before verse 1 begins. Durations do not record
    it (a reader's intro is not part of any verse), so converting start times to
    durations and back is only lossless if it is supplied.
    """
    starts: list[float] = []
    running = start_offset
    for duration in durations:
        starts.append(round(running, precision))
        running += duration
    return starts


def record_key(record: dict) -> tuple[str, str, int, str]:
    return (
        record["translationId"],
        record["bookId"],
        int(record["chapterNumber"]),
        record["reader"],
    )


def read_records(path: Path) -> list[dict]:
    """Read an existing output file, tolerating a missing or empty one."""
    if not path.is_file() or path.stat().st_size == 0:
        return []
    payload = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(payload, list):
        raise ValueError(f"{path} does not contain a JSON array of records")
    return payload


def write_records(path: Path, records: list[dict]) -> None:
    """Write the record array, sorted and atomically.

    Sorting keeps the file stable across resumed runs so diffs stay readable.
    """
    ordered = sorted(records, key=record_key)
    path.parent.mkdir(parents=True, exist_ok=True)
    partial = path.with_suffix(path.suffix + ".part")
    partial.write_text(json.dumps(ordered, indent=4) + "\n", encoding="utf-8")
    partial.replace(path)


def merge(existing: list[dict], incoming: list[dict]) -> list[dict]:
    """Upsert ``incoming`` into ``existing`` by record key."""
    by_key = {record_key(record): record for record in existing}
    for record in incoming:
        by_key[record_key(record)] = record
    return list(by_key.values())
