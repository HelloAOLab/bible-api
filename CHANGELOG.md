# Changelog

This is the log of changes for the Free Use Bible API.

## V1.16.0

### :rocket: Features

-   Added the verse of the day dataset (`verse-of-the-day`), a curated list of more than 650 well-known verses and short passages (at most three verses) that make good "verse of the day" candidates, enough for a different verse every day of the year. Each one has one to three categories from a fixed set: `comfort`, `courage`, `faith`, `forgiveness`, `gratitude`, `guidance`, `hope`, `inspiration`, `joy`, `love`, `peace`, `praise`, `prayer`, `provision`, `salvation`, `strength`, and `wisdom`.
    -   `GET /api/d/verse-of-the-day/verses.json` lists every verse in the dataset as `{ book, chapter, verse, endVerse?, categories }`, in canonical order.
    -   `GET /api/d/verse-of-the-day/categories.json` lists the categories with their descriptions and number of verses.
    -   `GET /api/d/verse-of-the-day/categories/{category}.json` (e.g. `/api/d/verse-of-the-day/categories/hope.json`) returns `{ dataset, category, thisCategoryApiLink }`, where `category.verses` lists the verses in the category in canonical order.
    -   `GET /api/d/verse-of-the-day/{book}/{chapter}.json` (e.g. `/api/d/verse-of-the-day/PRO/3.json`) returns `{ verse, endVerse?, categories }` for every candidate in the chapter. Dataset chapter verses can now carry `categories` in addition to `references` and `words`.
    -   Entries in `/api/available_datasets.json` can now include `listOfVersesApiLink`, `listOfCategoriesApiLink`, and `totalNumberOfCategories`.
    -   The `free-use-bible-api` client and the Kotlin SDK have new `getDatasetVerses()`, `getDatasetCategories()`, and `getDatasetCategory()` methods.
    -   The `free-use-bible-api` client and the Kotlin SDK have a new `getVerseOfTheDay(date)` method and `pickVerseOfTheDay(verses, date)` function, which pick the verse of the day for a date by a fixed convention: every year, the verses are shuffled by a hash of their reference, the year, and an optional seed, and the verse of the day is the one at the date's day of the year in that order. The same date always gives the same verse, a verse doesn't repeat within a calendar year, every year has a different order, and a different seed gives a different order. Verses have optional `addedIn` and `removedIn` years, so verses can be added to or removed from the list from a future year on without changing the verses of earlier years. The [Verse of the Day Convention](https://bible.helloao.org/docs/reference/datasets/verse-of-the-day-convention.html) page specifies the algorithm, with pseudocode and test values, for implementing it in other languages. See [Picking a Verse of the Day](https://bible.helloao.org/docs/reference/datasets/#picking-a-verse-of-the-day).
    -   The MCP server (`packages/seed-bible-mcp`) has a new `getVerseOfTheDay` tool, which returns the verse of the day for a date (today by default) with its text in any translation (BSB by default), its categories, and a Seed Bible link, following the same convention.
    -   Added the `import-verse-of-the-day` CLI command (and the `import:bible:verse-of-the-day` script). The list is built into `@helloao/tools` (`generation/verse-of-the-day.ts`, also exported as `verseOfTheDay`), along with `getVerseOfTheDay(date?, options?)`, which follows the same convention.
    -   Added the `review-verse-of-the-day [dir]` CLI command (and the `review:verse-of-the-day` script), which prints every verse in the list with its categories and its text from the given translation directory (`./bible/bsb` by default) as a table, Markdown, or CSV (`--format`), optionally for one `--category`. Verses that the translation doesn't contain are listed at the end.
-   Added the Berean interlinear dataset (`bsb-interlinear`), which lists the original-language (Hebrew, Aramaic, and Greek) words of every verse in original-text order, with their transliteration, parsing, Strong's number, and the Berean Standard Bible's English phrase. It is based on the public domain [Berean Standard Bible interlinear tables](https://bereanbible.com/).
    -   `GET /api/d/bsb-interlinear/books.json`
    -   `GET /api/d/bsb-interlinear/{book}/{chapter}.json` (e.g. `/api/d/bsb-interlinear/GEN/1.json`) returns `{ verse, words }` for every verse in the chapter.
    -   Words use zero-padded Strong's numbers (e.g. `H0430`), which match the KJV's `.words.json` values. Other translations may need zero-padding and suffix stripping before joining. The BSB can be linked using each word's `gloss` and `bsbPos`.
-   Added the STEPBible lexicon dataset (`stepbible-lexicon`), which contains one entry for each Hebrew, Aramaic, and Greek base Strong's number, with its senses (lemma, transliteration, part of speech, gloss, and definition). It is based on the [STEPBible](https://github.com/STEPBible/STEPBible-Data) TBESH and TBESG lexicons by STEPBible.org / Tyndale House, Cambridge, and is licensed under CC BY 4.0.
    -   `GET /api/d/stepbible-lexicon/lexicon.json`
    -   `GET /api/d/stepbible-lexicon/lexicon/{strongs}.json` (e.g. `/api/d/stepbible-lexicon/lexicon/H0430.json`) returns `{ dataset, entry, thisLexiconEntryApiLink }`, where `entry` has the `id`, `language`, and `senses`.
-   Entries in `/api/available_datasets.json` can now include `totalNumberOfWords`, `listOfLexiconApiLink`, and `totalNumberOfLexicon`.
-   Added the `fetch-interlinear <dir>` and `import-interlinear <dir>` CLI commands (and the `fetch:bible:interlinear` and `import:bible:interlinear` scripts) for downloading and importing the interlinear sources.
-   The `@helloao/free-use-bible-api` client has new `getDatasetLexicon()` and `getDatasetLexiconEntry()` methods.
-   Added the [History Globe](https://historyglobe.app) places dataset (`history-globe`), which contains more than 1,200 places named in the Bible, with their coordinates, feature types, and the verses that name them. It is licensed under CC BY 4.0 and builds on the OpenBible.info Bible Geocoding Data (CC BY 4.0).
    -   `GET /api/d/history-globe/places.json`
    -   `GET /api/d/history-globe/places/{id}.json` (e.g. `/api/d/history-globe/places/a15257a.json`)
    -   `GET /api/d/history-globe/{book}/{chapter}.json` (e.g. `/api/d/history-globe/ACT/27.json`) returns the places that appear in the chapter, with the verse numbers where each one is named.
-   Added the `fetch-history-globe <dir>` and `import-history-globe <dir>` CLI commands (and the `fetch:bible:history-globe` and `import:bible:history-globe` scripts) for downloading and importing the History Globe data.
-   Every `free-use-bible-api` client request method now takes an optional last argument, `{ signal }`, for cancelling the request with an `AbortSignal`. Because callers asking for the same URL share one download, aborting stops only that call from waiting; the download is cancelled once every caller waiting on it has aborted.
-   Added the `free-use-bible-api-react` package, which brings Seed Bible's Bible reader to any React app.
    -   `BibleReader` shows a chapter with its headings, poetry, footnotes, and words of Jesus in red, plus previous/next chapter buttons and loading, error, and "book not found" states.
    -   `createBibleReadingState()` (or the `useBibleReadingState()` hook) tracks where the reader is and moves them between translations, books, and chapters. It also handles verse selection and verse decorations.
    -   `createBibleDataManager()` (or the `useBibleDataManager()` hook) loads and caches translations, book lists, and chapters, from the public API or a self-hosted endpoint.
    -   `BibleReader` and `ChapterContent` draw verse highlights as rounded ribbons behind the text, like Seed Bible. Neighbouring verses with the same color share one ribbon, and the ribbons follow ragged line ends, poetry indentation, and right-to-left text. There are 12 preset colors with light and dark mode values, and custom colors are supported.
    -   The reader follows the device's light or dark mode, or can be forced to one with the `theme` prop (`'system'`, `'light'`, or `'dark'`). Colors and fonts are CSS variables that can be overridden on the reader or any element around it.
-   Added the `sync` CLI command (and the `sync` script), which keeps a database and API up to date from a JSON config that lists the sources and destinations. It imports only the new and changed sources, removes deleted or excluded ones from the database and every destination, reprocesses sources when the code that processes them changes, and uploads only the items whose content changed. Only the items from the configured sources are uploaded, so private translations can be kept out of a public API. See the [CLI README](./packages/helloao-cli/README.md#keeping-an-api-up-to-date-with-sync).
-   Added a Kotlin SDK (`packages/free-use-bible-api-kotlin`) for the JVM and Android. It has the same methods as the JavaScript/TypeScript client, as `suspend` functions, and its kotlinx.serialization models are generated from the OpenAPI document with the new `generate-kotlin-models` CLI command (`pnpm generate:kotlin`).
-   Added `jpn_kou` (口語訳, Japanese Kougo-yaku 1954/1955), a complete 66-book public domain Japanese Bible with furigana removed. It is downloaded from a pinned [open-bibles](https://github.com/seven1m/open-bibles) commit with `pnpm fetch:bible:osis` and imported with `pnpm import:bible:osis`.
-   Added the `fetch-osis-translations <dir>` CLI command, which downloads the pinned OSIS translations, checks their SHA-256 hashes, and converts them into importable USFM translation directories.
-   Added the `convert-osis-to-usfm <file> <dir> [--overwrite]` CLI command for converting OSIS Bible sources into per-book USFM files.
    -   Every sealed interface has an `Unknown*` variant (for example `UnknownChapterContent`) that keeps the raw JSON of content types the SDK doesn't know yet, so new item types don't break decoding. Exhaustive `when` expressions need a branch for it.
-   Line breaks that start a source paragraph now carry the paragraph marker: `{ "type": "line_break", "paragraph": "p" }` in chapter content and `{ "lineBreak": true, "paragraph": "p" }` inside a verse. Clients that only understand line breaks can ignore `paragraph`.
    -   The USX parser now turns paragraph styles (`p`, `m`, `pi1`, `mi`, …) into line breaks. Before, many eBible translations (such as `fra_lsg`) had no paragraph breaks at all. The USFM parser now handles every paragraph marker, not just `\p`, and Lockman `<PM>` markers produce `paragraph: "p"`.
    -   A blank line directly followed by a paragraph (`\b` + `\m`) becomes a single line break, while `\b\b` stays two. `\nb` produces no line break.
    -   Simplified verses (`.simple.json`) list paragraphs that start in the middle of the verse in `paragraphs: [{ offset, style }]`.
-   Added the `source-all-translations <dir>` CLI command (and the `fetch:translations` and `import:bible:translations` scripts), which downloads translations from both eBible and [fetch.bible](https://fetch.bible) into one directory, ready for `import-translations`.
    -   The translation lists are reconciled so that each translation comes from one source. Translations that eBible has are downloaded from eBible. Translations that only fetch.bible has, or that eBible lists without a USFM download, are downloaded from the [fetch.bible collection](https://github.com/gracious-tech/fetch_collection) in USX or USFM.
    -   Only new and changed translations are downloaded. fetch.bible downloads are tracked in a new `FetchBibleSource` database table, which records the collection commit and the git tree SHA of each translation's directory. A translation is re-downloaded when its tree SHA changes, and its files are downloaded from that exact commit.
    -   USFM files are converted to USX3, and each translation gets a `metadata.json` with its license and attribution.
    -   fetch.bible translations can be kept in their own directory with `--fetch-bible-dir`. A translation that later becomes available from eBible is removed from the fetch.bible directory, so that it isn't imported twice.
-   `import-translations` now accepts more than one directory (e.g. `import-translations ./sources/ebible ./sources/fetch-bible`).
-   Added the `source-fetch-bible-translations <dir>` and `list-fetch-bible-translations` CLI commands for downloading and listing fetch.bible translations on their own. Translations that were already downloaded from eBible are skipped.

### :bug: Bug Fixes

-   `source-translations` now replaces a translation's existing directory when it is re-downloaded, instead of leaving the old files next to the new ones.
-   `source-translations` no longer records an eBible translation as downloaded when its USFM download fails (without `--convert-to-usx3`).
-   `source-translations` re-downloads translations that are tracked in the database but missing from the output directory.
-   `ignorelist.txt` entries can now also be translation IDs (e.g. `abt_map`), not just eBible IDs.

### :warning: Changes

-   The content of a verse in a dataset chapter (`DatasetChapterVerseContent`) is now either `{ verse, references }` (cross reference datasets) or `{ verse, words }` (interlinear datasets). JSON responses for the existing `open-cross-ref` and `theographic` datasets are unchanged. TypeScript clients that read `verse.references` need to narrow the type first (e.g. `'references' in verse`).
-   `DatasetEntityType` now includes `lexicon`.
-   Translations are re-parsed with the new paragraph handling. Verses that contain a paragraph marker are split at it, and prose after a paragraph marker is no longer marked as `poem`. Verse text is otherwise unchanged.
-   The `sha256` hashes that are stored for translations, commentaries, and datasets now cover everything that the API is generated from, including license fields, apocryphal flags, audio links and timings, chapter words, and commentary profiles. Numbers were previously left out of the hashes. `import-audio-timings` now updates the hashes of the translations that it changes.
-   The CLI's `Uploader` interface has a new optional `delete()` method, which `S3Uploader` and `FilesUploader` implement.

## V1.15.0

### :rocket: Features

-   We have an updated documentation website!
-   We now also support multiple languages for the documentation via Google Translate.
-   Added verse timings for audio for the AAB and BSB translations.
    -   The chapter endpoints (e.g. `/api/AAB/GEN/1.json`, `/api/AAB/GEN/1.simple.json`) now contain a `thisChapterAudioTimings` object that references the timings file for each supported reader.

## V1.14.0

### :rocket: Features

-   Added the [Theographic Bible Metadata](https://github.com/robertrouse/theographic-bible-metadata) dataset (`theographic`), which contains biblical people, places, events, and people groups, along with the relationships between them and the Bible verses that mention them.
    -   Datasets can now contain entities. Datasets that do include `listOfPeopleApiLink`, `listOfPlacesApiLink`, `listOfEventsApiLink`, and `listOfPeopleGroupsApiLink` (and the corresponding `totalNumberOf*` counts) in their entry in `/api/available_datasets.json`.
    -   New endpoints:
        -   `GET /api/d/{dataset}/people.json`
        -   `GET /api/d/{dataset}/people/{person}.json`
        -   `GET /api/d/{dataset}/places.json`
        -   `GET /api/d/{dataset}/places/{place}.json`
        -   `GET /api/d/{dataset}/events.json`
        -   `GET /api/d/{dataset}/events/{event}.json`
        -   `GET /api/d/{dataset}/groups.json`
        -   `GET /api/d/{dataset}/groups/{group}.json`
    -   Entities reference Bible passages using the same book IDs, chapter numbers, and verse numbers as the rest of the API, so they can be combined with any translation. Consecutive verses are collapsed into a single reference using `endVerse`.
    -   Entities reference each other (e.g. a person's `father`, `birthPlace`, and `events`; a place's `events`; an event's `participants` and `locations`; a group's `members`) using `{ id, type, name, apiLink }` references that link to the related entity's endpoint. `type` matches the collection segment of the entity API paths (`people`, `places`, `events`, or `groups`), so the link can also be constructed as `/api/d/{dataset}/{type}/{id}.json`.
    -   Entity datasets also provide chapter-aligned data:
        -   `GET /api/d/{dataset}/books.json` lists the books whose chapters contain entity data, following the same structure as the other dataset books endpoints.
        -   `GET /api/d/{dataset}/{book}/{chapter}.json` (e.g. `/api/d/theographic/GEN/1.json`) returns the people, places, and events that appear in that chapter, each with its basic info, an `apiLink` to its detail endpoint, and the list of verse numbers in the chapter where it's mentioned.
    -   People include the `isProperName` field, which indicates whether the person's name is a proper name.

### :bug: Bug Fixes

-   `/api/{translation}/complete.json` and `/api/{translation}/complete.simple.json` no longer inline word-level annotations as `thisChapterWords` on each chapter.
    -   Each chapter now has an optional `thisChapterWordsLink` property instead, pointing at the same per-chapter words file (`{chapter}.words.json`/`{chapter}.words.simple.json`) that the regular chapter endpoints link to. It's omitted for chapters that have no annotations, same as `thisChapterWordsLink` on those endpoints.
    -   This keeps the complete translation files focused on chapter/verse content, footnotes, and audio, matching how word annotations are already handled everywhere else in the API.
    -   `/api/{translation}/{book}/{chapter}.words.simple.json` is now generated whenever `complete.simple.json` is, even if simplified per-chapter files aren't otherwise being generated, so the link is always valid.

This is the end of the changelog. For older entries, see the [API Changelog](https://github.com/HelloAOLab/bible-api/blob/2ea0612f33db11b01fbd903cb69cdadd8a4bd127/API-CHANGELOG.md) or [Generator Changelog](https://github.com/HelloAOLab/bible-api/blob/2ea0612f33db11b01fbd903cb69cdadd8a4bd127/GENERATOR-CHANGELOG.md).
