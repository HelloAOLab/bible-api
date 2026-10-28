# ``FreeUseBibleAPI``

Read Bible translations, commentaries, and datasets from the Free Use Bible API.

## Overview

The [Free Use Bible API](https://bible.helloao.org/docs/) provides more than 1000 Bible translations in more than 700 languages, along with commentaries and datasets such as cross references, an interlinear, a lexicon, and the people, places, and events of the Bible. Everything is free to use, and no API key is needed.

This package is a Swift client for the API. It supports iOS, macOS, tvOS, watchOS, visionOS, and Linux, and has no dependencies.

```swift
import FreeUseBibleAPI

let api = FreeUseBibleAPI()

let chapter = try await api.getTranslationBookChapter(translation: "BSB", book: .JHN, chapter: 1)
print(api.getChapterVerseText(chapter))

// John 1
// [1] In the beginning was the Word, and the Word was with God, and the Word was God. ...
```

Every request method on ``FreeUseBibleAPI/FreeUseBibleAPI`` is `async throws` and returns one of the response types below. The response types are generated from the API's [OpenAPI document](https://bible.helloao.org/openapi.json), and have the same names as the schemas in it. They are all `Codable`, `Hashable`, and `Sendable`.

### Chapter content

A chapter's content is a list of ``ChapterContent`` items: headings, line breaks, verses, and Hebrew subtitles. The content of each verse is a list of ``VerseContent`` items, which are plain text, ``FormattedText`` (poetry and the words of Jesus), inline headings, line breaks, and footnote references.

```swift
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

The simplified format (``ApiSimpleTranslationBookChapter``) has the same chapters with each verse's text as a single string, and its footnotes, headings, poetry, and words of Jesus as offset ranges into that string.

### Values from newer versions of the API

New kinds of content and new values don't make responses fail to decode. Enums like ``ChapterContent`` have an `unknown` case that keeps the raw ``JSONValue``, and values with a fixed set of options, like ``BookId`` and ``TextDirection``, keep values that the SDK doesn't know in their `rawValue`.

## Topics

### Essentials

- ``FreeUseBibleAPI/FreeUseBibleAPI``
- ``FreeUseBibleAPIError``
- ``BookId``

### Making Requests

- ``FreeUseBibleAPITransport``
- ``URLSessionTransport``

### Text and Word Helpers

- ``GetChapterTextOptions``
- ``VerseReference``
- ``AnnotatedWord``
- ``SimpleAnnotatedWord``
- ``ApiChapterResponse``

### Translations

- ``ApiAvailableTranslations``
- ``ApiTranslation``
- ``License``
- ``LicenseRequirement``
- ``LicensePermission``
- ``TextDirection``
- ``ApiFormat``
- ``ApiTranslationBooks``
- ``ApiTranslationBook``
- ``TranslationChapterReference``

### Translation Chapters

- ``ApiTranslationBookChapter``
- ``ChapterContent``
- ``ChapterHeading``
- ``ChapterLineBreak``
- ``ChapterVerse``
- ``VerseContent``
- ``FormattedText``
- ``InlineHeading``
- ``InlineLineBreak``
- ``VerseFootnoteReference``
- ``ChapterHebrewSubtitle``
- ``HebrewSubtitleContent``
- ``ChapterFootnote``
- ``TranslationBookChapterAudioLinks``

### Simplified Chapters

- ``ApiSimpleTranslationBookChapter``
- ``SimpleChapterData``
- ``SimpleChapterContent``
- ``SimpleChapterHeading``
- ``SimpleChapterVerse``
- ``SimpleChapterHebrewSubtitle``
- ``SimpleVerseFootnote``
- ``SimpleInlineHeading``
- ``SimpleTextRange``
- ``SimplePoemRange``
- ``SimpleVerseParagraph``

### Word Annotations and Audio Timings

- ``ApiTranslationBookChapterWords``
- ``ChapterWord``
- ``ApiSimpleTranslationBookChapterWords``
- ``SimpleChapterWord``
- ``ApiTranslationBookChapterAudioTimings``
- ``TranslationBookChapterAudioTimings``

### Complete Translations

- ``ApiTranslationComplete``
- ``ApiTranslationCompleteBook``
- ``TranslationCompleteChapter``
- ``ApiSimpleTranslationComplete``
- ``ApiSimpleTranslationCompleteBook``
- ``SimpleTranslationCompleteChapter``

### Commentaries

- ``ApiAvailableCommentaries``
- ``ApiCommentary``
- ``ApiCommentaryBooks``
- ``ApiCommentaryBook``
- ``CommentaryChapterReference``
- ``ApiCommentaryBookChapter``
- ``ApiSimpleCommentaryBookChapter``
- ``SimpleCommentaryChapterData``

### Datasets

- ``ApiAvailableDatasets``
- ``ApiDataset``
- ``ApiDatasetBooks``
- ``ApiDatasetBook``
- ``DatasetChapterReference``
- ``ApiDatasetBookChapterResponse``

### Cross Reference and Interlinear Chapters

- ``ApiDatasetBookChapter``
- ``DatasetChapterData``
- ``DatasetChapterVerseContent``
- ``DatasetChapterVerseReferences``
- ``ScoredVerseRef``
- ``DatasetChapterVerseWords``
- ``DatasetInterlinearWord``
- ``OriginalLanguage``

### People, Places, and Events

- ``ApiDatasetEntityBookChapter``
- ``ApiDatasetEntityChapterData``
- ``ApiDatasetChapterPerson``
- ``ApiDatasetChapterPlace``
- ``ApiDatasetChapterEvent``
- ``ApiDatasetPeople``
- ``ApiDatasetPersonSummary``
- ``ApiDatasetPerson``
- ``DatasetPerson``
- ``ApiDatasetPlaces``
- ``ApiDatasetPlaceSummary``
- ``ApiDatasetPlace``
- ``DatasetPlace``
- ``ApiDatasetEvents``
- ``ApiDatasetEventSummary``
- ``ApiDatasetEvent``
- ``DatasetEvent``
- ``ApiDatasetPeopleGroups``
- ``ApiDatasetPeopleGroupSummary``
- ``ApiDatasetPeopleGroup``
- ``DatasetPeopleGroup``
- ``DatasetEntityRef``
- ``DatasetEntityType``
- ``VerseRef``

### Lexicons

- ``ApiDatasetLexicon``
- ``ApiDatasetLexiconEntrySummary``
- ``ApiDatasetLexiconEntry``
- ``DatasetLexiconEntry``
- ``DatasetLexiconSense``

### Raw JSON

- ``JSONValue``
