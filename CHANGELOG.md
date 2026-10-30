# Changelog

This is the log of changes for the Free Use Bible API.

## V1.16.0

### :globe_with_meridians: API Changes

-   Added the verse of the day dataset (`verse-of-the-day`): more than 650 curated verses and short passages, each tagged with one to three categories (`comfort`, `hope`, `wisdom`, etc.).
    -   Includes verses for 14 Christian holidays (Christmas, Good Friday, Pentecost, etc.), which are used only on their holiday. Holidays with moving dates list their dates for 2026 to 2125.
    -   `GET /api/d/verse-of-the-day/verses.json` lists every verse and the holidays.
    -   `GET /api/d/verse-of-the-day/categories.json` lists the categories.
    -   `GET /api/d/verse-of-the-day/categories/{category}.json` lists the verses in a category.
    -   `GET /api/d/verse-of-the-day/{book}/{chapter}.json` lists the verses in a chapter with their categories.
    -   The [Verse of the Day Convention](https://bible.helloao.org/docs/reference/datasets/verse-of-the-day-convention.html) specifies how to pick the verse for a date, so it can be implemented in any language.
-   Added the Berean interlinear dataset (`bsb-interlinear`): the Hebrew, Aramaic, and Greek words of every verse, with transliteration, parsing, Strong's number, and BSB English phrase.
    -   `GET /api/d/bsb-interlinear/books.json`
    -   `GET /api/d/bsb-interlinear/{book}/{chapter}.json`
-   Added the STEPBible lexicon dataset (`stepbible-lexicon`): one entry per Hebrew, Aramaic, and Greek Strong's number, with its senses (CC BY 4.0).
    -   `GET /api/d/stepbible-lexicon/lexicon.json`
    -   `GET /api/d/stepbible-lexicon/lexicon/{strongs}.json`
-   Added the [History Globe](https://historyglobe.app) places dataset (`history-globe`): more than 1,200 places named in the Bible, with coordinates and the verses that name them (CC BY 4.0).
    -   `GET /api/d/history-globe/places.json`
    -   `GET /api/d/history-globe/places/{id}.json`
    -   `GET /api/d/history-globe/{book}/{chapter}.json`
-   `/api/available_datasets.json` entries have new fields for the new datasets (word, verse, category, and lexicon counts and links).
-   Added two public domain Japanese Bibles: `jpn_kou` (口語訳, Kougo-yaku) and `jpn_bun` (文語訳, Bungo-yaku).
-   Line breaks that start a paragraph now include the paragraph marker (e.g. `"paragraph": "p"`), and `.simple.json` verses list mid-verse paragraphs in `paragraphs`. More translations now have paragraph breaks.

#### :warning: Changes

-   Dataset chapter verses (`DatasetChapterVerseContent`) are now either `{ verse, references }` or `{ verse, words }`. TypeScript code that reads `verse.references` must narrow the type first.
-   `DatasetEntityType` now includes `lexicon`.
-   Translations are re-parsed with the new paragraph handling: verses are split at paragraph markers, and prose after a paragraph is no longer marked as `poem`. Verse text is unchanged.

### :package: SDK Changes

-   Added a Kotlin SDK (`packages/free-use-bible-api-kotlin`) for the JVM and Android, with the same methods as the JavaScript/TypeScript client. Its models are generated with the new `generate-kotlin-models` CLI command.
    -   Unknown content types are decoded as `Unknown*` variants instead of failing.
-   Added a Swift SDK (`FreeUseBibleAPI`), available with Swift Package Manager from [`HelloAOLab/bible-api-swift`](https://github.com/HelloAOLab/bible-api-swift), with the same methods as the JavaScript/TypeScript client. It is generated with the new `generate-swift-client` CLI command.
-   Added the `free-use-bible-api-react` package, which brings Seed Bible's Bible reader to React apps.
    -   `BibleReader` displays chapters with headings, poetry, footnotes, words of Jesus in red, and chapter navigation.
    -   `useBibleReadingState()` and `useBibleDataManager()` handle navigation, verse selection, and loading and caching data.
    -   Verse highlights with 12 preset colors or custom colors.
    -   Light and dark mode, with customizable colors and fonts.
-   The `free-use-bible-api` client has new methods for the new datasets: `getDatasetVerses()`, `getDatasetCategories()`, `getDatasetCategory()`, `getDatasetLexicon()`, and `getDatasetLexiconEntry()`.
-   The `free-use-bible-api` client has new `getVerseOfTheDay(date)` and `pickVerseOfTheDay(verses, date)` functions. The same date always gives the same verse, and verses don't repeat within a year. See [Picking a Verse of the Day](https://bible.helloao.org/docs/reference/datasets/#picking-a-verse-of-the-day).
-   `free-use-bible-api` client requests can be cancelled with an `AbortSignal` (`{ signal }`).
-   The MCP server (`packages/seed-bible-mcp`) has a new `getVerseOfTheDay` tool.

### :hammer_and_wrench: Tool Changes

-   Added the `sync` command, which keeps a database and API up to date from a JSON config, importing and uploading only what changed. See the [CLI README](./packages/helloao-cli/README.md#keeping-an-api-up-to-date-with-sync).
    -   Supports `api`, `history-globe`, and `verse-of-the-day` sources.
    -   Warns about items in the database that no source provides.
-   Added `import-verse-of-the-day` and `review-verse-of-the-day` commands. The verse list and `getVerseOfTheDay()` are also exported from `@helloao/tools`.
-   Added `fetch-interlinear` and `import-interlinear` commands.
-   Added `fetch-history-globe` and `import-history-globe` commands.
-   Added the `source-all-translations` command, which downloads translations from eBible, [fetch.bible](https://fetch.bible), and pinned OSIS sources into one directory, downloading only new and changed translations.
    -   Each translation is downloaded from only one source, preferring eBible.
    -   `--conversion-concurrency <n>` limits concurrent USFM-to-USX3 conversions to reduce memory usage.
-   Added `source-fetch-bible-translations` and `list-fetch-bible-translations` commands.
-   `import-translations` now accepts multiple directories.
-   Added `fetch-osis-translations` and `convert-osis-to-usfm` commands for OSIS sources.

#### :bug: Bug Fixes

-   `source-translations` replaces a re-downloaded translation's directory instead of leaving old files behind.
-   `source-translations` no longer marks failed eBible USFM downloads as downloaded.
-   `source-translations` re-downloads translations missing from the output directory.
-   `ignorelist.txt` now accepts translation IDs.

#### :warning: Changes

-   Stored `sha256` hashes now cover everything the API is generated from, including license fields, audio, and numbers.
-   The `Uploader` interface has a new optional `delete()` method.

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
