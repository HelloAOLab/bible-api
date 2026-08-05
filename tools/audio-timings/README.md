# bible-audio-timings

Generates verse-by-verse audio timings for [Free Use Bible API](https://bible.helloao.org)
chapters using [whisperX](https://github.com/m-bain/whisperX), so a client can highlight
each verse as the reader speaks it.

This is the producer side of
[issue #10, "Audio Version Cue Markers"](https://github.com/HelloAOLab/bible-api/issues/10).
The consumer side already exists in this repo: the output of this tool is exactly the JSON
that `helloao import-audio-timings` reads, which lands in the `ChapterAudioTiming` table
and is served from
`/api/{translation}/{book}/{chapter}.{reader}.audioTimings.json`.

## How it works

The chapter text is already known, so this is not a plain transcription job — it is a
matching job, and that is what makes the output checkable.

1. **Reference text** — fetch `/api/{translation}/{book}/{chapter}.json` and flatten the
   verses into an ordered word stream, one tag per word saying which verse it belongs to.
   Editorial content that nobody reads aloud (chapter headings, inline headings, footnotes)
   is skipped.
2. **ASR** — run whisperX over the recording, then `whisperx.align()` for word-level
   timestamps.
3. **Match** — align the recognized word stream against the reference word stream with
   `difflib`. Agreement runs become *anchors*: points where a recognized word with a known
   timestamp is pinned to a known reference position.
4. **Verse starts** — each verse takes the timestamp of its first anchor, walked back at
   the local speaking rate if the anchor sits a few words in. Verses with no anchor are
   interpolated between their neighbours.
5. **Judge** — compute a match rate and several sanity checks, and refuse to emit a chapter
   that fails them.

Step 3 is what a pure forced-alignment approach would skip, and it is the part worth
keeping. The match rate *measures* whether the recording and the text actually correspond —
which matters here, because the BSB recordings were reportedly pulled for no longer matching
the current edition of the text (see
[issue #46](https://github.com/HelloAOLab/bible-api/issues/46)). Aligning known text
directly would happily produce confident, wrong timings in that situation. It also has
nowhere to put a reader's spoken intro: "Genesis, chapter one" would be absorbed into verse
1 and drag its start time to zero.

## Install

Requires Python 3.10+, [uv](https://docs.astral.sh/uv/), and `ffmpeg` on `PATH`.

```bash
cd tools/audio-timings

# Everything except the transcription itself — enough to run the tests.
uv sync --group dev

# Add whisperX (pulls in torch; large, and wants CUDA for realistic speed).
uv sync --extra asr
```

## Use

```bash
# One chapter, downloading the audio from the API.
uv run bible-audio-timings BSB/GEN/1

# One chapter, one reader, from a local file.
uv run bible-audio-timings BSB/GEN/1:hays --audio ./1.hays.mp3

# A whole translation against audio already fetched by `helloao fetch-audio`,
# resumable across runs.
uv run bible-audio-timings BSB --audio ./sources/audio --resume -o ./timings.json

# See what would run — no model load, no transcription.
uv run bible-audio-timings BSB/GEN/1-5 --dry-run
```

Targets are `TRANSLATION[/BOOK[/CHAPTER[-CHAPTER]]][:READER]`:

| Target | Meaning |
| --- | --- |
| `BSB` | every book and chapter of a translation |
| `BSB/GEN` | every chapter of a book |
| `BSB/GEN/1` | a single chapter |
| `BSB/GEN/1-5` | a chapter range |
| `BSB/GEN/1:hays` | a single chapter for one reader |

With no reader given, every reader in the chapter's `thisChapterAudioLinks` is processed.

Then import:

```bash
cd ../..
pnpm --filter @helloao/cli exec helloao import-audio-timings ./tools/audio-timings/timings.json
```

### Audio sources

`--audio` takes either a single file (for one chapter) or a directory. Directories are
searched in the layout `helloao fetch-audio` writes, so its output directory works as-is:

```
<dir>/audio/<translationId>/<bookId>/<chapter>.<reader>.mp3
```

Without `--audio`, audio is downloaded from the chapter's `thisChapterAudioLinks` and cached
under `--cache-dir` (default `./.cache/audio-timings`, already gitignored).

### Batch runs

Long runs are resumable. Every finished chapter is recorded in the cache manifest and the
output file is rewritten immediately, so an interrupted whole-Bible run picks up where it
stopped with `--resume`. The whisper and alignment models load once per process and are
reused across chapters, which is most of the reason to process a range in one invocation
rather than looping the command.

## Output

A JSON array of `AudioTimingRecord` (`packages/helloao-cli/actions.ts`):

```json
[
    {
        "translationId": "BSB",
        "bookId": "GEN",
        "chapterNumber": 1,
        "reader": "hays",
        "verses": [3.0, 14.4, 24.8]
    }
]
```

`verses[i]` is the time in seconds at which verse `i + 1` **starts**, and the array is
non-decreasing.

> One wrinkle worth knowing: the example array in issue #10 is not monotonic, because it
> holds per-verse *durations* copied from biblehub's `hays.js`. The merged schema in this
> repo specifies start times (`api.ts`, `schema.prisma`), which is what this tool emits.
> `--durations` converts to the older convention for interoperability; it is not the import
> format, so it requires an explicit `--output`.

## Quality gates

A wrong timing is worse than a missing one — it desynchronizes the highlight for a whole
chapter — so chapters are rejected rather than emitted on doubt. A rejected chapter is
listed in the run summary with the metric that failed, and the command exits non-zero.

| Check | Default | Flag |
| --- | --- | --- |
| Reference words that found an anchor | ≥ 80% | `--min-match-rate` |
| Verses that were interpolated or clamped | ≤ 15% | `--max-interpolated-fraction` |
| Verse 1 start | ≤ 90s, ≥ 0 | `--max-first-verse-start` |
| Widest gap between consecutive verse starts | ≤ 180s | `--max-verse-gap` |
| Verse span as a fraction of the recording after verse 1 | ≥ 70% | `--min-coverage` |
| Last verse start | within the recording | — |

A low match rate usually means one of three things: the recording is a different edition
than the text, the wrong reader or chapter was paired with the audio, or the language was
misdetected. Check with `--dry-run` and `-v` before reaching for `--force`, which emits
anyway.

### `--refine`

An optional second pass re-aligns each verse's *known* text within its own time window,
snapping boundaries to the real words instead of to the ASR's guess at them. Windows stay
verse-sized so memory stays bounded, and a refined start that moves more than
`--refine-max-shift` (default 2s) is discarded in favour of the coarse value. Slower;
worth it for a final published run.

## Options

Run `uv run bible-audio-timings --help` for the full list. The ones that matter most:

| Flag | Default | Notes |
| --- | --- | --- |
| `--model` | `large-v2` | any whisper model name |
| `--device` | auto | `cuda` if available, else `cpu` |
| `--compute-type` | `float16` on CUDA, else `int8` | lower for less VRAM |
| `--batch-size` | `8` | lower for less VRAM |
| `--language` | from the API | override if the API's tag is wrong |
| `--align-model` | whisperX default | override the wav2vec2 model |
| `--include-hebrew-subtitles` | off | for readers who voice Psalm superscriptions |
| `--api-base` | `https://bible.helloao.org` | a `file://` path also works, for fixtures |

The API reports languages as ISO 639-3 (`eng`) while whisperX keys its alignment models by
ISO 639-1 (`en`); the mapping is built in. A language whisperX cannot align is a hard error
naming the supported codes — never a silent fall back to the English model, which would
produce plausible-looking nonsense.

## Development

```bash
uv run pytest          # no torch, no GPU, no network needed
uv run ruff check src tests
```

whisperX is only touched by `transcribe.py`, and the ASR boundary is a list of
`AsrWord`, so the tests drive the whole pipeline from recorded word streams. That keeps the
matching logic — where the real complexity is — fast to test and independent of a GPU.
`tests/test_import_contract.py` parses `AudioTimingRecord` out of
`packages/helloao-cli/actions.ts` so a change to that interface fails here loudly instead
of causing a silent bad import.

## Licensing

whisperX is BSD-2-Clause. Whisper model weights and the wav2vec2 alignment models carry
their own licenses; check them before publishing generated timings.
