# FreeUseBibleAPI for Swift

<!-- #region docs -->

Swift client for the public Free Use Bible API:

-   `https://bible.helloao.org`

It supports iOS 13+, macOS 10.15+, tvOS 13+, watchOS 6+, visionOS, and Linux, and has no dependencies.

## Installation

Add the package to your `Package.swift`:

```swift
dependencies: [
    .package(url: "https://github.com/HelloAOLab/bible-api-swift.git", from: "v1.16.0"),
],
targets: [
    .target(
        name: "MyApp",
        dependencies: [
            .product(name: "FreeUseBibleAPI", package: "bible-api-swift"),
        ]
    ),
]
```

Or in Xcode, choose **File > Add Package Dependencies…** and enter `https://github.com/HelloAOLab/bible-api-swift.git`.

The versions match the [releases of the Free Use Bible API](https://github.com/HelloAOLab/bible-api/releases).

## Quick Start

```swift
import FreeUseBibleAPI

let api = FreeUseBibleAPI()

let available = try await api.getAvailableTranslations()
print("Total translations:", available.translations.count)

let books = try await api.getTranslationBooks(translation: "BSB")
print("Books in BSB:", books.books.count)

let chapter = try await api.getTranslationBookChapter(translation: "BSB", book: .GEN, chapter: 1)
print("Verses in Genesis 1:", chapter.numberOfVerses)
```

## Client Options

```swift
let api = FreeUseBibleAPI(
    endpoint: URL(string: "https://bible.helloao.org/")!,
    useCache: true,
    transport: URLSessionTransport(session: .shared)
)
```

-   `endpoint`: Base API endpoint.
-   `useCache`: Enables in-memory response caching (default: `true`). Concurrent requests for the same URL share a single request.
-   `transport`: Performs the HTTP requests (default: `URLSessionTransport` with `URLSession.shared`). Implement the `FreeUseBibleAPITransport` protocol to use a different HTTP client, add logging, or return canned responses in tests.

Every request method also takes an optional `endpoint:` argument to use a different endpoint for a single request.

## API Methods

All of the request methods are `async throws`.

### Translations

-   `getAvailableTranslations()`
-   `getTranslationBooks(translation:)`
-   `getTranslationBookChapter(translation:book:chapter:)`
-   `getTranslationBookChapterAudioTimings(translation:book:chapter:reader:)`
-   `getTranslationBookChapterWords(translation:book:chapter:)`
-   `getCompleteTranslation(translation:)`
-   `getSimpleTranslationBookChapter(translation:book:chapter:)`
-   `getSimpleTranslationBookChapterWords(translation:book:chapter:)`
-   `getSimpleCompleteTranslation(translation:)`

`getCompleteTranslation()` and `getSimpleCompleteTranslation()` are never cached because their responses are very large.

Only some chapters have audio timings. The keys of a chapter's `thisChapterAudioTimings` property identify the readers available to pass to `getTranslationBookChapterAudioTimings()`.

### Commentaries

-   `getAvailableCommentaries()`
-   `getCommentaryBooks(commentary:)`
-   `getCommentaryBookChapter(commentary:book:chapter:)`
-   `getSimpleCommentaryBookChapter(commentary:book:chapter:)`

### Datasets

-   `getAvailableDatasets()`
-   `getDatasetBooks(dataset:)`
-   `getDatasetBookChapter(dataset:book:chapter:)` - returns an `ApiDatasetBookChapterResponse`, which is either `.datasetBookChapter` (cross references for cross reference datasets, or the original-language words of each verse for interlinear datasets such as `bsb-interlinear`) or `.datasetEntityBookChapter` (the people, places, and events that appear in the chapter for entity datasets such as `theographic`)
-   `getDatasetPeople(dataset:)`
-   `getDatasetPerson(dataset:person:)`
-   `getDatasetPlaces(dataset:)`
-   `getDatasetPlace(dataset:place:)`
-   `getDatasetEvents(dataset:)`
-   `getDatasetEvent(dataset:event:)`
-   `getDatasetPeopleGroups(dataset:)`
-   `getDatasetPeopleGroup(dataset:group:)`
-   `getDatasetLexicon(dataset:)`
-   `getDatasetLexiconEntry(dataset:strongs:)`
-   `getDatasetVerses(dataset:)`
-   `getVerseOfTheDay(date:seed:category:dataset:)` - see [Verse of the Day](#verse-of-the-day)
-   `getDatasetCategories(dataset:)`
-   `getDatasetCategory(dataset:category:)`

### Chapter Navigation Helpers

-   `getNextChapter(_:)` / `getPreviousChapter(_:)` - work with any chapter response, and return the same type of chapter (or `nil` at the start or end of the translation).
-   `getFirstChapter(_:)` / `getLastChapter(_:)` - get the first or last chapter of a translation, commentary, or dataset book.
-   `getSimpleChapter(_:)` - follows a chapter's `simpleChapterApiLink`, or returns `nil` if simplified chapters aren't available for it.

### Chapter & Verse Helpers

-   `getVerseText(_:)`
-   `getChapterVerseText(_:options:)`
-   `getSimpleChapterVerseText(_:options:)`
-   `formatReference(_:_:)`

### Verse of the Day

-   `getVerseOfTheDay(date:seed:category:dataset:)` - gets the verse of the day for a date (today by default) from the `verse-of-the-day` dataset. The date is a `YYYY-MM-DD` string or a `Date` (its calendar date in the current time zone is used).
-   `pickVerseOfTheDay(_:date:seed:category:holidays:)` - picks the verse of the day from a list of verses you already have, such as the `verses` and `holidays` from `getDatasetVerses(dataset:)`.

The verse is picked by the [Verse of the Day Convention](https://bible.helloao.org/docs/reference/datasets/verse-of-the-day-convention.html), so every SDK picks the same verse on the same day. The same date always gives the same verse, a verse doesn't repeat within a calendar year, and holidays (such as Christmas and Resurrection Sunday) get verses of their own. Pass a `seed` (such as the name of your app) to get a different order with the same guarantees.

### Word Annotations

Some translations include word-level annotations (Strong's numbers and related source data) for their chapters.

-   `getChapterWords(_:)` / `getSimpleChapterWords(_:)` - get the annotations for a chapter you already loaded, or `nil` if it doesn't have any.
-   `getWordText(_:_:)` / `getSimpleWordText(_:_:)` - get the text that a single annotation applies to.
-   `getVerseWords(_:_:)` / `getSimpleVerseWords(_:_:)` - get the annotations for a verse, each paired with the text it applies to.

The offsets in annotations (and in simplified chapters) count UTF-16 code units, like JavaScript string indexes. The helpers take care of this for you.

## Types

The response types are generated from the API's [OpenAPI document](https://bible.helloao.org/openapi.json) and use the same names as the schemas in it (`ApiTranslationBookChapter`, `ChapterVerse`, and so on). They are all `Codable`, `Hashable`, and `Sendable`.

-   Content that can be one of several kinds is an enum. For example, `ChapterContent` is `.heading`, `.lineBreak`, `.verse`, or `.hebrewSubtitle`, and the items in a verse's `content` are `.text`, `.formattedText`, `.inlineHeading`, `.inlineLineBreak`, or `.verseFootnoteReference`.
-   Values with a fixed set of options, like `BookId` and `TextDirection`, are structs with a static property for each known value (`BookId.GEN`, `BookId._1SA`), and can also be created from string literals (`"GEN"`).
-   Values that are newer than the SDK are kept instead of failing to decode: enums have an `.unknown(JSONValue)` case, and option values keep their `rawValue`.

## Examples

### Print the text of a chapter

```swift
let chapter = try await api.getTranslationBookChapter(translation: "BSB", book: .JHN, chapter: 1)
print(api.getChapterVerseText(chapter))

// John 1
// [1] In the beginning was the Word, and the Word was with God, and the Word was God. ...
```

### Read the verses of a chapter

```swift
let chapter = try await api.getTranslationBookChapter(translation: "BSB", book: .GEN, chapter: 1)

for content in chapter.chapter.content {
    switch content {
    case .heading(let heading):
        print("##", heading.content.joined(separator: " "))
    case .verse(let verse):
        print(verse.number, api.getVerseText(verse))
    default:
        break
    }
}
```

### Navigate to the next/previous chapter

```swift
let current = try await api.getTranslationBookChapter(translation: "BSB", book: .GEN, chapter: 1)

let next = try await api.getNextChapter(current)
let previous = try await api.getPreviousChapter(current)

print(next?.chapter.number as Any)      // Optional(2)
print(previous?.chapter.number as Any)  // nil
```

### Read the Strong's numbers for a chapter

```swift
let chapter = try await api.getTranslationBookChapter(translation: "engwebp", book: .JHN, chapter: 1)

if let words = try await api.getChapterWords(chapter) {
    for case .verse(let verse) in chapter.chapter.content {
        for annotated in api.getVerseWords(verse, words) {
            print(annotated.text, annotated.word.strongs ?? [])
        }
    }
}

// In ["G1722"]
// the ["G1722"]
// beginning ["G0746"]
// ...
```

### Read a dataset chapter

```swift
let chapter = try await api.getDatasetBookChapter(dataset: "open-cross-ref", book: .JHN, chapter: 3)

if case .datasetBookChapter(let crossReferences) = chapter {
    for case .references(let verse) in crossReferences.chapter.content {
        print(verse.verse, verse.references.count)
    }
}
```

### Get the verse of the day

```swift
if let verse = try await api.getVerseOfTheDay(date: "2026-12-25") {
    let chapter = try await api.getTranslationBookChapter(translation: "BSB", book: verse.book, chapter: verse.chapter)
    for case .verse(let content) in chapter.chapter.content where (verse.verse...(verse.endVerse ?? verse.verse)).contains(content.number) {
        print(content.number, api.getVerseText(content))
    }
}
```

## Error Handling

Request methods throw `FreeUseBibleAPIError`:

-   `.requestFailed(url:statusCode:)` for non-2xx responses. A 404 usually means that one of the path values is invalid, for example the translation, commentary, dataset, book, or chapter.
-   `.decodingFailed(url:underlyingError:)` if the response can't be decoded.
-   `.invalidURL(_:)` if a request URL can't be built.

Errors from the transport (such as `URLError` for network failures) are thrown as they are.

<!-- #endregion docs -->

## Development

This package is developed in [`packages/free-use-bible-api-swift`](https://github.com/HelloAOLab/bible-api/tree/main/packages/free-use-bible-api-swift) of the [`bible-api`](https://github.com/HelloAOLab/bible-api) repository, which is also where issues and pull requests go. Changes there are copied to [`bible-api-swift`](https://github.com/HelloAOLab/bible-api-swift) automatically, and each release of the API is tagged there.

`Sources/FreeUseBibleAPI/Types.gen.swift` and `Sources/FreeUseBibleAPI/Operations.gen.swift` are generated from the OpenAPI document by `packages/helloao-cli/swift.ts`. Don't edit them by hand. To regenerate them after changing the API schemas, run this from the root of the `bible-api` repository:

```bash
npm run generate:swift
```

A test in `packages/helloao-cli/swift.spec.ts` fails if the generated files are out of date.

To build and test the package, run this from `packages/free-use-bible-api-swift`:

```bash
swift build
swift test
```

The test fixtures in `Tests/FreeUseBibleAPITests/Fixtures` are API responses. The translation responses were produced by the API generator from the USFM files in `bible/`, and the expected chapter text in `Fixtures/expected` was produced by the TypeScript SDK from the same responses, so that both SDKs format text the same way.
