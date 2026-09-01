# API Changelog

This is the log of changes for the Free Use Bible API.
For information on the API Generator, see [GENERATOR-CHANGELOG.md](./GENERATOR-CHANGELOG.md).

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

## V1.13.0

### Date: 2026-08-19

### :rocket: Features

-   Added support for a simplified chapter format.
    -   Getting the text of a chapter previously required fetching the chapter and building the text from the formatted JSON yourself, which is non-trivial to get right - especially when it comes to spacing.
    -   Chapters are now also available in a simplified format, where the content of each verse is a single string and the footnotes are available on the verse that they occur in, along with the offset that they occur at.
    -   New endpoints:
        -   `GET /api/{translation}/{book}/{chapter}.simple.json`
        -   `GET /api/c/{commentary}/{book}/{chapter}.simple.json`
    -   Anything that can't be represented by a plain string is kept as an offset into the verse text, so nothing is lost:
        -   `footnotes` include the `offset` that the footnote caller belongs at.
        -   `wordsOfJesus` and `poem` are lists of `{ start, end }` ranges (`poem` ranges also include the indent `level`).
        -   `headings` contains the headings that occur in the middle of a verse, with the `offset` that they occur at.
        -   Lines of poetry and line breaks are separated by newline (`\n`) characters in the text.
    -   All offsets are measured in UTF-16 code units, so `text.slice(start, end)` returns exactly the range that was marked.
    -   Example:
        -   Before (`/api/BSB/GEN/1.json`):
            ```json
            {
                "type": "verse",
                "number": 6,
                "content": [
                    "And God said, “Let there be an expanse",
                    { "noteId": 2 },
                    "between the waters, to separate the waters from the waters.”"
                ]
            }
            ```
        -   After (`/api/BSB/GEN/1.simple.json`):
            ```json
            {
                "type": "verse",
                "number": 6,
                "text": "And God said, “Let there be an expanse between the waters, to separate the waters from the waters.”",
                "footnotes": [
                    {
                        "noteId": 2,
                        "offset": 38,
                        "text": "Or a firmament",
                        "caller": "+"
                    }
                ]
            }
            ```
-   Added the `simpleChapterApiLink` property to the translation and commentary chapter endpoints.
    -   It contains the link to the simplified version of the chapter.
    -   The simplified chapters contain the matching `fullChapterApiLink` property, and their `nextChapterApiLink`/`previousChapterApiLink` properties point at the simplified chapters so that navigation stays inside the format.
-   Added support for downloading an entire translation in the simplified format.
    -   New endpoint: `GET /api/{translation}/complete.simple.json`
    -   It contains the same data as `/api/{translation}/complete.json`, except that each chapter uses the simplified format. Everything else - the book list, the per-chapter `numberOfVerses`, `thisChapterAudioLinks`, and `thisChapterAudioTimings` - is unchanged.
    -   The file is generated alongside `complete.json`, so a translation either has both or neither.
-   Added the `simpleCompleteTranslationApiLink` property to the translation metadata.
    -   It contains the link to the simplified complete translation file, next to the existing `completeTranslationApiLink`.
    -   Because the translation metadata is included in the available translations, books, and chapter endpoints, the simplified complete file is discoverable from all of them.
-   Added support for word-level annotations (Strong's numbers and related source data).
    -   Annotations are published in a new file per chapter: `/api/{translation}/{book}/{chapter}.words.json`
        -   See the [reference documentation](https://bible.helloao.org/docs/reference/translations/standard.html#get-the-words-of-a-chapter) for the full structure.
    -   Chapters that have annotations gain three new optional properties that link to the new files:
        -   `thisChapterWordsLink`
        -   `nextChapterWordsLink`
        -   `previousChapterWordsLink`
        -   These properties are omitted entirely for chapters that have no annotations, so the output for translations without word-level data is unchanged.
    -   Each annotation is anchored to a range of characters in a single item of a verse's `content` array. `contentIndex` is the index of the item, and `start`/`end` are character offsets into that item's text (`end` is exclusive).
        -   Anchoring per content item keeps the offsets correct for verses that are split into multiple items, such as poem lines and words of Jesus.
        -   Example - given the following verse:
            ```json
            {
                "type": "verse",
                "number": 1,
                "content": [
                    "In the beginning was the Word, and the Word was with God, and the Word was God."
                ]
            }
            ```
        -   The entry `{ "contentIndex": 0, "start": 7, "end": 16, "strongs": ["G0746"] }` annotates `"beginning"`, since `content[0].slice(7, 16)` is `"beginning"`.
    -   Along with `strongs`, an annotation can carry `lemma`, `morph`, `srcloc`, `occurrence`, and `occurrences`. Each property is omitted when the translation did not provide it.
        -   No translation that is currently published provides anything other than `strongs`.
    -   `/api/{translation}/complete.json` includes the annotations inline as `thisChapterWords` on each chapter.
-   Added word-level annotations for the simplified format.
    -   The offsets in `/api/{translation}/{book}/{chapter}.words.json` are anchored to items of a verse's `content` array, which the simplified format replaces with a single string. So the annotations are also published with their offsets remapped onto the simplified text: `GET /api/{translation}/{book}/{chapter}.words.simple.json`
    -   These entries have no `contentIndex` - `start` and `end` are offsets into the `text` of the verse, just like the footnote, poem, and Words of Jesus offsets in the simplified chapters.
        -   For the example above, the simplified entry is `{ "start": 7, "end": 16, "strongs": ["G0746"] }`, since `text.slice(7, 16)` is `"beginning"`.
    -   Simplified chapters that have annotations link to them with the same `thisChapterWordsLink`/`nextChapterWordsLink`/`previousChapterWordsLink` properties, pointing at the simplified files.
    -   `/api/{translation}/complete.simple.json` includes the remapped annotations inline as `thisChapterWords` on each chapter.

## V1.11.2

#### Date: 2026-05-11

### :bug: Bug Fixes

-   Updated the `fra_lsg` with fixes for typos.

## V1.11.1

#### Date: 2026-04-24

### :bug: Bug Fixes

-   Fixed an issue where consecutive poem lines on different verses would prepend inline line breaks to the second verse instead of appending them to the first verse. This could cause some renderers to display verse number markers before the line break, causing a weird visual bug.
    -   The fix moves inline `lineBreak` objects from the start of the second verse to the end of the first verse.
    -   Example
        -   `ENGWEBP PSA 46:2-3` is a good example of the issue:
        -   Before:
            ```json
            {
                "translation": {...},
                "book": {...},
                "chapter": {
                    "number": 46,
                    "content": [
                        ...
                        {
                            "type": "verse",
                            "number": 2,
                            "content": [
                                {
                                    "text": "Therefore we won’t be afraid, though the earth changes,",
                                    "poem": 1
                                },
                                {
                                    "text": "though the mountains are shaken into the heart of the seas;",
                                    "poem": 2
                                }
                            ]
                        },
                        {
                            "type": "verse",
                            "number": 3,
                            "content": [
                                {
                                    "lineBreak": true
                                },
                                {
                                    "text": "though its waters roar and are troubled,",
                                    "poem": 2
                                },
                                {
                                    "lineBreak": true
                                },
                                {
                                    "text": "though the mountains tremble with their swelling. Selah.",
                                    "poem": 2
                                }
                            ]
                        },
                        ...
                    ]
                }
            }
            ```
        -   After:
            ```json
            {
                "translation": {...},
                "book": {...},
                "chapter": {
                    "number": 46,
                    "content": [
                        ...
                        {
                            "type": "verse",
                            "number": 2,
                            "content": [
                                {
                                    "text": "Therefore we won’t be afraid, though the earth changes,",
                                    "poem": 1
                                },
                                {
                                    "text": "though the mountains are shaken into the heart of the seas;",
                                    "poem": 2
                                },
                                {
                                    "lineBreak": true
                                }
                            ]
                        },
                        {
                            "type": "verse",
                            "number": 3,
                            "content": [
                                {
                                    "text": "though its waters roar and are troubled,",
                                    "poem": 2
                                },
                                {
                                    "lineBreak": true
                                },
                                {
                                    "text": "though the mountains tremble with their swelling. Selah.",
                                    "poem": 2
                                }
                            ]
                        },
                        ...
                    ]
                }
            }
            ```

## V1.11.0

#### Date: 2026-03-24

### :rocket: Features

-   Changed the common name of Song of Solomon in English from "Song of Songs" to "Song of Solomon".

## V1.10.0

#### Date: 2026-02-20

### :rocket: Features

-   Updated the `BSB` translation to 2025-12-23 (Third Printing)
-   Added Garth's Hyper-literal Translation (`GHT`) and Greek sources (`GHTG`).

## V1.9.1

#### Date: 2026-02-18

### :boom: Breaking Changes

-   Changed the following translation IDs to match their language codes:
    -   `cug_wbt` -> `cnq_wbt`
    -   `plj_tsc` -> `zlu_tsc`

### :bug: Bug Fixes

-   Updated language codes for the `cnq_wbt` (formerly `cug_wbt`) and `zlu_tsc` (formerly `plj_tsc`) translations.
    -   `cug` (Chungmboko langauge group) -> `cnq` (Chung language) ([Change Request](https://iso639-3.sil.org/request/2021-012))
    -   `plj` (Polci langauge group) -> `zlu` (Zul language) ([Change Request](https://iso639-3.sil.org/request/2022-023))

## V1.9.0

#### Date: 2026-01-12

### :rocket: Features

-   Added endpoints for getting an entire translation. ([#37](https://github.com/HelloAOLab/bible-api/pull/37))

## V1.7.0

#### Date: 2025-10-28

### :rocket: Features

-   Added the [Open BIble Cross Reference](https://www.openbible.info/labs/cross-references/) dataset.

## V1.6.0

#### Date: 2025-09-16

### :rocket: Features

-   Added the `firstChapterNumber` and `lastChapterNumber` fields for `TranslationBook`.

### :bug: Bug Fixes

-   Fixed chapter links to start at the correct number for the book. ([#24](https://github.com/HelloAOLab/bible-api/issues/24))

## V1.5.0

#### Date: 2025-07-02

### :rocket: Features

-   Switched primary source for Bible translations to [ebible.org](https://ebible.org/).
    -   This switch adds a bunch of new translations in various different languages.
-   Added apocrypha for translations which decide to include them.
    -   Apocryphal books have their `isApocryphal` property set to `true` in their book information and are always ordered after Revelation.
    -   An example is the King James Version + Apocrypha (`eng_kja`) translation.

### :bug: Bug Fixes

-   Fixed missing verses in PSA 119 in the `npi_ulb` translation. ([#18](https://github.com/HelloAOLab/bible-api/issues/18))
-   Fixed missing books in the `fra_lsg` translation. ([#17](https://github.com/HelloAOLab/bible-api/issues/17))
-   Fixed missing books in the `hbo_wlc` translation. ([#14](https://github.com/HelloAOLab/bible-api/issues/14))
-   Changed the ID of `eng_drv` to `eng_dra`. ([#21](https://github.com/HelloAOLab/bible-api/issues/21))
-   Fixed audio links for Titus in the BSB translation. ([#15](https://github.com/HelloAOLab/bible-api/issues/15))

## V1.4.0

#### Date: 2024-12-18

### :rocket: Features

-   Added the [Tyndale](https://tyndaleopenresources.com/) Bible commentary.

### :bug: Bug Fixes

-   Fixed cases where consecutive poem lines that have the same indentation now have an explicit line break to indicate that they are actually on separate lines.

## V1.3.0

#### Date: 2024-11-15

### :rocket: Features

-   Added support for Bible commentaries.
    -   See the the [API Reference](https://bible.helloao.org/docs/reference/commentaries/#available-commentaries) for more info.

## V1.2.0

#### Date: 2024-07-25

### :rocket: Features

-   Added the total number of books, chapters, and verses that each translation, book, and chapter contains.
-   Added `languageName` and `languageEnglishName` for translations so that it is easy to display a name for the language that the translation is in.

### :bug: Bug Fixes

-   Fixed an issue where parts of some verses were missing.
-   Fixed the documentation to note that the language of a translation is in ISO 639 format.

## V1.1.0

#### Date: 2024-07-11

### :rocket: Features

-   Added links for audio versions to the chapter data.
    -   Currently, this is only available for the BSB translation.
    -   Thanks to [https://openbible.com/](https://openbible.com/) for making this possible!

## V1.0.0

#### Date: 2024-07-11

### :bug: Bug Fixes

-   Fixed an issue where where some chapters would be missing the first verse of the chapter.
    -   This was fixed by moving to using USX versions of translations.
