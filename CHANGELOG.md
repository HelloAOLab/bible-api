# Changelog

This is the log of changes for the Free Use Bible API.

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
