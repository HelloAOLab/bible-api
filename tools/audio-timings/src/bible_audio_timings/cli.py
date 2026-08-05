"""Command line interface and batch driver."""

from __future__ import annotations

import argparse
import logging
import sys
from dataclasses import dataclass
from pathlib import Path

from . import api as api_module
from .align import anchor
from .api import DEFAULT_API_BASE, ApiError, BibleApi
from .cache import Cache, ChapterKey
from .reference import ReferenceError, reference_tokens, verse_token_starts
from .timings import ChapterTimings, Thresholds, derive
from .transcribe import Transcriber, TranscriptionError, resolve_language
from .writers import merge, read_records, to_durations, to_record, write_records

logger = logging.getLogger("bible_audio_timings")

DEFAULT_OUTPUT = Path("./audio-timings.json")
DEFAULT_CACHE = Path("./.cache/audio-timings")


class UsageError(ValueError):
    pass


@dataclass(frozen=True)
class Target:
    """A parsed ``TRANSLATION[/BOOK[/CHAPTER[-CHAPTER]]][:READER]`` selector."""

    translation_id: str
    book_id: str | None = None
    first_chapter: int | None = None
    last_chapter: int | None = None
    reader: str | None = None


def parse_target(text: str) -> Target:
    body, _, reader = text.partition(":")
    reader = reader or None
    parts = [part for part in body.split("/") if part]
    if not parts:
        raise UsageError(f"empty target: {text!r}")
    if len(parts) > 3:
        raise UsageError(f"too many segments in target {text!r}")

    translation_id = parts[0]
    book_id = parts[1] if len(parts) > 1 else None
    first = last = None
    if len(parts) > 2:
        chapters = parts[2]
        if "-" in chapters:
            low, _, high = chapters.partition("-")
            try:
                first, last = int(low), int(high)
            except ValueError as error:
                raise UsageError(f"bad chapter range in {text!r}") from error
            if first > last:
                raise UsageError(f"chapter range is inverted in {text!r}")
        else:
            try:
                first = last = int(chapters)
            except ValueError as error:
                raise UsageError(f"bad chapter number in {text!r}") from error
        if first < 1:
            raise UsageError(f"chapter numbers start at 1, got {first} in {text!r}")
    return Target(translation_id, book_id, first, last, reader)


def expand(api: BibleApi, target: Target) -> list[tuple[str, str, int]]:
    """Resolve a target into concrete (translation, book, chapter) triples."""
    books = api.books(target.translation_id)
    if target.book_id:
        wanted = target.book_id.upper()
        books = [book for book in books if book.id.upper() == wanted]
        if not books:
            raise UsageError(
                f"{target.translation_id} has no book {target.book_id!r}"
            )

    triples: list[tuple[str, str, int]] = []
    for book in books:
        first = target.first_chapter or 1
        last = target.last_chapter or book.number_of_chapters
        if target.first_chapter and target.first_chapter > book.number_of_chapters:
            raise UsageError(
                f"{target.translation_id}/{book.id} has {book.number_of_chapters} "
                f"chapters; {target.first_chapter} was requested"
            )
        last = min(last, book.number_of_chapters)
        for chapter in range(first, last + 1):
            triples.append((target.translation_id, book.id, chapter))
    return triples


def local_audio(directory: Path, key: ChapterKey) -> Path | None:
    """Find a chapter's audio in a ``fetch-audio``-style directory."""
    candidates = [
        directory / "audio" / key.translation_id / key.book_id,
        directory / key.translation_id / key.book_id,
        directory,
    ]
    for suffix in (".mp3", ".m4a", ".wav", ".ogg", ".flac"):
        for folder in candidates:
            path = folder / f"{key.chapter_number}.{key.reader}{suffix}"
            if path.is_file():
                return path
    return None


def _refine(
    transcriber: Transcriber,
    audio_path: Path,
    *,
    language: str,
    timings: ChapterTimings,
    ref_tokens,
    max_shift: float,
) -> None:
    """Snap anchored verse starts to the known text with a per-verse pass."""
    verse_text: dict[int, list[str]] = {}
    for token in ref_tokens:
        verse_text.setdefault(token.verse, []).append(token.raw)

    windows: list[dict] = []
    index_of: list[int] = []
    for position, timing in enumerate(timings.verses):
        if timing.source != "anchor":
            continue
        following = (
            timings.verses[position + 1].start
            if position + 1 < len(timings.verses)
            else None
        )
        end = following if following is not None else timings.audio_duration
        start = max(0.0, timing.start - 1.0)
        if end is None or end <= start:
            continue
        windows.append(
            {"start": start, "end": end, "text": " ".join(verse_text[timing.verse])}
        )
        index_of.append(position)

    if not windows:
        return

    try:
        refined = transcriber.refine(audio_path, language=language, segments=windows)
    except Exception as error:  # noqa: BLE001 - refinement is best-effort
        timings.warnings.append(f"refinement failed, keeping coarse timings: {error}")
        return

    # whisperX can return fewer segments than it was given, so pair only what
    # came back rather than asserting equal lengths.
    for position, segment in zip(index_of, refined, strict=False):
        words = segment.get("words") or []
        first = next(
            (
                word
                for word in words
                if isinstance(word.get("start"), (int, float))
            ),
            None,
        )
        if first is None:
            continue
        candidate = float(first["start"])
        timing = timings.verses[position]
        if abs(candidate - timing.start) <= max_shift:
            timing.start = candidate
        else:
            timings.warnings.append(
                f"verse {timing.verse}: refinement moved the start by "
                f"{abs(candidate - timing.start):.2f}s, keeping the coarse value"
            )


def process_chapter(
    *,
    api: BibleApi,
    cache: Cache,
    key: ChapterKey,
    chapter_json: dict,
    audio_path: Path,
    transcriber: Transcriber,
    language_override: str | None,
    thresholds: Thresholds,
    include_hebrew_subtitles: bool,
    refine: bool,
    refine_max_shift: float,
) -> ChapterTimings:
    ref_tokens = reference_tokens(
        chapter_json, include_hebrew_subtitles=include_hebrew_subtitles
    )
    language = resolve_language(api_module.language_code(chapter_json), language_override)

    asr_words, duration = transcriber.transcribe_and_align(audio_path, language=language)
    anchors = anchor(asr_words, ref_tokens)

    timings = derive(
        translation_id=key.translation_id,
        book_id=key.book_id,
        chapter_number=key.chapter_number,
        reader=key.reader,
        asr=asr_words,
        ref=ref_tokens,
        anchors=anchors,
        audio_duration=duration,
        thresholds=thresholds,
    )

    if refine and timings.ok:
        _refine(
            transcriber,
            audio_path,
            language=language,
            timings=timings,
            ref_tokens=ref_tokens,
            max_shift=refine_max_shift,
        )

    return timings


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="bible-audio-timings",
        description=(
            "Generate verse-by-verse audio timings for Free Use Bible API chapters "
            "with whisperX, in the JSON format that "
            "`helloao import-audio-timings` consumes."
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "targets:\n"
            "  BSB              every book and chapter of a translation\n"
            "  BSB/GEN          every chapter of a book\n"
            "  BSB/GEN/1        a single chapter\n"
            "  BSB/GEN/1-5      a chapter range\n"
            "  BSB/GEN/1:hays   a single chapter for one reader\n"
        ),
    )
    parser.add_argument("targets", nargs="+", metavar="TARGET")
    parser.add_argument(
        "--reader",
        action="append",
        dest="readers",
        help="reader to process; repeatable. Defaults to every reader with audio.",
    )
    parser.add_argument(
        "--audio",
        type=Path,
        help=(
            "local audio file (single chapter) or a directory laid out like "
            "`helloao fetch-audio`: <dir>/audio/<translation>/<book>/<chapter>.<reader>.mp3"
        ),
    )
    parser.add_argument("-o", "--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--cache-dir", type=Path, default=DEFAULT_CACHE)
    parser.add_argument("--api-base", default=DEFAULT_API_BASE)
    parser.add_argument(
        "--resume",
        action="store_true",
        help="skip chapters already recorded as done in the cache manifest",
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="reprocess chapters even if the manifest says they are done",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="resolve text and audio and report what would run, without ASR",
    )
    parser.add_argument(
        "--durations",
        action="store_true",
        help=(
            "emit per-verse durations instead of start times (the older "
            "biblehub convention). NOT the import format; requires --output."
        ),
    )
    parser.add_argument("--precision", type=int, default=3)
    parser.add_argument(
        "--include-hebrew-subtitles",
        action="store_true",
        help="treat a Hebrew subtitle (e.g. a Psalm superscription) as read aloud",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="emit chapters even when they fail the quality thresholds",
    )

    asr = parser.add_argument_group("whisperX")
    asr.add_argument("--model", default="large-v2")
    asr.add_argument("--device", default=None, help="cuda or cpu; auto-detected")
    asr.add_argument("--compute-type", default=None, help="float16, int8, ...")
    asr.add_argument("--batch-size", type=int, default=8)
    asr.add_argument("--align-model", default=None, help="override the wav2vec2 model")
    asr.add_argument("--language", default=None, help="override the detected language")
    asr.add_argument("--refine", action="store_true", help="per-verse forced-alignment pass")
    asr.add_argument("--refine-max-shift", type=float, default=2.0)

    quality = parser.add_argument_group("quality thresholds")
    quality.add_argument("--min-match-rate", type=float, default=0.80)
    quality.add_argument("--max-interpolated-fraction", type=float, default=0.15)
    quality.add_argument("--max-first-verse-start", type=float, default=90.0)
    quality.add_argument("--max-verse-gap", type=float, default=180.0)
    quality.add_argument(
        "--min-verse-spread",
        type=float,
        default=0.70,
        help="how much of the matched speech the verse starts must span",
    )
    quality.add_argument(
        "--min-audio-coverage",
        type=float,
        default=0.50,
        help="how much of the recording must match the chapter text",
    )

    parser.add_argument("-v", "--verbose", action="count", default=0)
    parser.add_argument("-q", "--quiet", action="store_true")
    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    level = logging.WARNING if args.quiet else (logging.DEBUG if args.verbose else logging.INFO)
    logging.basicConfig(level=level, format="%(levelname)s %(message)s", stream=sys.stderr)

    if args.durations and args.output == DEFAULT_OUTPUT:
        parser.error(
            "--durations does not produce the import format; pass an explicit --output"
        )

    thresholds = Thresholds(
        min_match_rate=args.min_match_rate,
        max_interpolated_fraction=args.max_interpolated_fraction,
        max_first_verse_start=args.max_first_verse_start,
        max_verse_gap=args.max_verse_gap,
        min_verse_spread=args.min_verse_spread,
        min_audio_coverage=args.min_audio_coverage,
    )

    try:
        targets = [parse_target(text) for text in args.targets]
    except UsageError as error:
        parser.error(str(error))

    cache = Cache(args.cache_dir)
    transcriber = Transcriber(
        model=args.model,
        device=args.device,
        compute_type=args.compute_type,
        batch_size=args.batch_size,
        align_model=args.align_model,
    )

    produced: list[dict] = []
    rejected: list[tuple[str, list[str]]] = []
    failed: list[tuple[str, str]] = []
    planned = 0

    with BibleApi(args.api_base) as api:
        try:
            work: list[tuple[str, str, int, str | None]] = []
            for target in targets:
                for translation_id, book_id, chapter in expand(api, target):
                    work.append((translation_id, book_id, chapter, target.reader))
        except (UsageError, ApiError) as error:
            logger.error("%s", error)
            return 2

        for translation_id, book_id, chapter, target_reader in work:
            try:
                chapter_json = api.chapter(translation_id, book_id, chapter)
            except ApiError as error:
                failed.append((f"{translation_id}/{book_id}/{chapter}", str(error)))
                logger.error("%s", error)
                continue

            wanted = _readers_for(chapter_json, target_reader, args.readers)
            if not wanted:
                logger.warning(
                    "%s/%s/%s has no audio for the requested reader(s)",
                    translation_id,
                    book_id,
                    chapter,
                )
                continue

            for reader in wanted:
                key = ChapterKey(translation_id, book_id, chapter, reader)
                if args.resume and not args.overwrite and cache.is_done(key):
                    logger.info("%s already done, skipping", key.as_string())
                    continue

                audio_path = _resolve_audio(api, cache, key, chapter_json, args)
                if audio_path is None:
                    failed.append((key.as_string(), "no audio available"))
                    continue

                planned += 1
                if args.dry_run:
                    _report_dry_run(key, chapter_json, audio_path, args)
                    continue

                try:
                    timings = process_chapter(
                        api=api,
                        cache=cache,
                        key=key,
                        chapter_json=chapter_json,
                        audio_path=audio_path,
                        transcriber=transcriber,
                        language_override=args.language,
                        thresholds=thresholds,
                        include_hebrew_subtitles=args.include_hebrew_subtitles,
                        refine=args.refine,
                        refine_max_shift=args.refine_max_shift,
                    )
                except (ReferenceError, TranscriptionError) as error:
                    failed.append((key.as_string(), str(error)))
                    logger.error("%s: %s", key.as_string(), error)
                    cache.record(key, ok=False, detail={"error": str(error)})
                    continue

                logger.info("%s", timings.summary())
                for warning in timings.warnings:
                    logger.warning("%s: %s", key.as_string(), warning)

                if not timings.ok and not args.force:
                    rejected.append((key.as_string(), timings.rejections))
                    for reason in timings.rejections:
                        logger.error("%s rejected: %s", key.as_string(), reason)
                    cache.record(key, ok=False, detail={"rejections": timings.rejections})
                    continue

                record = to_record(timings, precision=args.precision)
                if args.durations:
                    record = to_durations(
                        record,
                        audio_duration=timings.audio_duration,
                        precision=args.precision,
                    )
                produced.append(record)
                _flush_output(args.output, produced)
                cache.record(
                    key,
                    ok=True,
                    detail={
                        "match_rate": round(timings.match_rate, 4),
                        "verses": len(timings.verses),
                        "forced": args.force and not timings.ok,
                    },
                )

    return _finish(args, planned, produced, rejected, failed)


def _readers_for(
    chapter_json: dict, target_reader: str | None, requested: list[str] | None
) -> list[str]:
    available = api_module.readers(chapter_json)
    if target_reader:
        return [target_reader] if target_reader in available or not available else []
    if requested:
        return [reader for reader in requested if reader in available or not available]
    return available


def _resolve_audio(
    api: BibleApi, cache: Cache, key: ChapterKey, chapter_json: dict, args
) -> Path | None:
    if args.audio is not None:
        if args.audio.is_file():
            return args.audio
        if args.audio.is_dir():
            found = local_audio(args.audio, key)
            if found:
                return found
            logger.warning("no local audio for %s under %s", key.as_string(), args.audio)
            return None
        logger.error("--audio path does not exist: %s", args.audio)
        return None

    cached = cache.audio_path(key)
    if cached.is_file():
        return cached

    url = api_module.audio_link(chapter_json, key.reader)
    if not url:
        logger.warning("%s has no audio link for reader %r", key.as_string(), key.reader)
        return None
    if args.dry_run:
        logger.info("%s would download %s", key.as_string(), url)
        return cached

    try:
        return api.download(url, cached)
    except ApiError as error:
        logger.error("%s: %s", key.as_string(), error)
        return None


def _report_dry_run(key: ChapterKey, chapter_json: dict, audio_path: Path, args) -> None:
    try:
        tokens = reference_tokens(
            chapter_json, include_hebrew_subtitles=args.include_hebrew_subtitles
        )
    except ReferenceError as error:
        logger.error("%s: %s", key.as_string(), error)
        return
    verses = verse_token_starts(tokens)
    language = api_module.language_code(chapter_json)
    logger.info(
        "%s verses=%d words=%d language=%s audio=%s",
        key.as_string(),
        len(verses),
        len(tokens),
        language,
        audio_path,
    )


def _flush_output(path: Path, produced: list[dict]) -> None:
    """Rewrite the output file after every chapter so a run can be interrupted."""
    existing = read_records(path)
    write_records(path, merge(existing, produced))


def _finish(args, planned: int, produced, rejected, failed) -> int:
    if args.dry_run:
        logger.info("dry run: %d chapter(s) would be processed", planned)
        return 1 if failed else 0

    logger.info(
        "wrote %d record(s) to %s (%d rejected, %d failed)",
        len(produced),
        args.output,
        len(rejected),
        len(failed),
    )
    if rejected:
        logger.warning("rejected chapters:")
        for label, reasons in rejected:
            logger.warning("  %s - %s", label, "; ".join(reasons))
    if failed:
        logger.warning("failed chapters:")
        for label, reason in failed:
            logger.warning("  %s - %s", label, reason)
    if produced:
        logger.info(
            "import with: helloao import-audio-timings %s", args.output
        )
    return 1 if (rejected or failed) else 0


if __name__ == "__main__":  # pragma: no cover
    raise SystemExit(main())
