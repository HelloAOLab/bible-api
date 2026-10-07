# Standard Format

The standard format for chapters, complete-translation downloads, and word-level annotations. See [Translations, Books, & Chapters](./README.md) for the translation and book listing endpoints, or [the simplified format](./simplified.md) for the alternative representation of this same content.

## Get a Chapter from a Translation

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`

Gets the content of a single chapter for a given book and translation.

-   `translation` is the ID of the translation (e.g. `BSB`).
-   `book` is the ID of the book (e.g. `GEN` for Genesis - you can find a list of book IDs [here](https://ubsicap.github.io/usfm/identification/books.html)).
-   `chapter` is the numerical chapter (e.g. `1` for the first chapter).

### Code Example

```ts:no-line-numbers title="fetch-chapter.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Get Genesis 1 from the BSB translation
fetch(`https://bible.helloao.org/api/${translation}/${book}/${chapter}.json`)
    .then(request => request.json())
    .then(chapter => {
        console.log('Genesis 1 (BSB):', chapter);
    });
```

### Structure

```typescript:no-line-numbers title="chapter.ts"
export interface TranslationBookChapter {
    /**
     * The translation information for the book chapter.
     */
    translation: Translation;

    /**
     * The book information for the book chapter.
     */
    book: TranslationBook;

    /**
     * The link to the current chapter.
     */
    thisChapterLink: string;

    /**
     * The links to different audio versions for the chapter.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * The links to the audio timings for different audio versions for the chapter.
     * Each link points at the audio timings file for that reader - see
     * "Get the Audio Timings for a Chapter" below.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsLinks;

    /**
     * The link to the next chapter.
     * Null if this is the last chapter in the translation.
     */
    nextChapterApiLink: string | null;

    /**
     * The links to different audio versions for the next chapter.
     * Null if this is the last chapter in the translation.
     */
    nextChapterAudioLinks: TranslationBookChapterAudioLinks | null;

    /**
     * The links to the audio timings for different audio versions for the next chapter.
     * Null if this is the last chapter in the translation.
     */
    nextChapterAudioTimings: TranslationBookChapterAudioTimingsLinks | null;

    /**
     * The link to the previous chapter.
     * Null if this is the first chapter in the translation.
     */
    previousChapterApiLink: string | null;

    /**
     * The links to different audio versions for the previous chapter.
     * Null if this is the first chapter in the translation.
     */
    previousChapterAudioLinks: TranslationBookChapterAudioLinks | null;

    /**
     * The links to the audio timings for different audio versions for the previous chapter.
     * Null if this is the first chapter in the translation.
     */
    previousChapterAudioTimings: TranslationBookChapterAudioTimingsLinks | null;

    /**
     * The link to the word-level annotations for the chapter.
     * Omitted if the chapter doesn't have any word-level annotations.
     */
    thisChapterWordsLink?: string;

    /**
     * The link to the word-level annotations for the next chapter.
     * Omitted if this is the last chapter in the translation, or if the next chapter
     * doesn't have any word-level annotations.
     */
    nextChapterWordsLink?: string;

    /**
     * The link to the word-level annotations for the previous chapter.
     * Omitted if this is the first chapter in the translation, or if the previous
     * chapter doesn't have any word-level annotations.
     */
    previousChapterWordsLink?: string;

    /**
     * The number of verses that the chapter contains.
     */
    numberOfVerses: number;

    /**
     * The link to the simplified version of this chapter.
     * Omitted if simplified chapters are not available.
     */
    simpleChapterApiLink?: string;

    /**
     * The information for the chapter.
     */
    chapter: ChapterData;
}

interface ChapterData {
    /**
     * The number of the chapter.
     */
    number: number;

    /**
     * The content of the chapter.
     */
    content: ChapterContent[];

    /**
     * The list of footnotes for the chapter.
     */
    footnotes: ChapterFootnote[];
}

/**
 * A union type that represents a single piece of chapter content.
 * A piece of chapter content can be one of the following things:
 * - A heading.
 * - A line break.
 * - A verse.
 * - A Hebrew Subtitle.
 */
type ChapterContent = ChapterHeading | ChapterLineBreak | ChapterVerse | ChapterHebrewSubtitle;

/**
 * A heading in a chapter.
 */
interface ChapterHeading {
    /**
     * Indicates that the content represents a heading.
     */
    type: 'heading';

    /**
     * The content for the heading.
     * If multiple strings are included in the array, they should be concatenated with a space.
     */
    content: string[];
}

/**
 * A line break in a chapter.
 */
interface ChapterLineBreak {
    /**
     * Indicates that the content represents a line break.
     */
    type: 'line_break';
}

/**
 * A Hebrew Subtitle in a chapter.
 * These are often used included as informational content that appeared in the original manuscripts.
 * For example, Psalms 49 has the Hebrew Subtitle "To the choirmaster. A Psalm of the Sons of Korah."
 */
interface ChapterHebrewSubtitle {
    /**
     * Indicates that the content represents a Hebrew Subtitle.
     */
    type: 'hebrew_subtitle';

    /**
     * The list of content that is contained in the subtitle.
     * Each element in the list could be a string, formatted text, or a footnote reference.
     */
    content: (string | FormattedText | VerseFootnoteReference)[];
}

/**
 * A verse in a chapter.
 */
interface ChapterVerse {
    /**
     * Indicates that the content is a verse.
     */
    type: 'verse';

    /**
     * The number of the verse.
     */
    number: number;

    /**
     * The list of content for the verse.
     * Each element in the list could be a string, formatted text, or a footnote reference.
     */
    content: (string | FormattedText | InlineHeading | InlineLineBreak | VerseFootnoteReference)[];
}

/**
 * Formatted text. That is, text that is formated in a particular manner.
 */
interface FormattedText {
    /**
     * The text that is formatted.
     */
    text: string;

    /**
     * Whether the text represents a poem.
     * The number indicates the level of indent.
     *
     * Common in Psalms.
     */
    poem?: number;

    /**
     * Whether the text represents the Words of Jesus.
     */
    wordsOfJesus?: boolean;
}

/**
 * Defines an interface that represents a heading that is embedded in a verse.
 */
interface InlineHeading {
    /**
     * The text of the heading.
     */
    heading: string;
}

/**
 * Defines an interface that represents a line break that is embedded in a verse.
 */
interface InlineLineBreak {
    lineBreak: true;
}


/**
 * A footnote reference in a verse or a Hebrew Subtitle.
 */
interface VerseFootnoteReference {
    /**
     * The ID of the note.
     */
    noteId: number;
}

/**
 * Information about a footnote.
 */
interface ChapterFootnote {
    /**
     * The ID of the note that is referenced.
     */
    noteId: number;

    /**
     * The text of the footnote.
     */
    text: string;

    /**
     * The verse reference for the footnote.
     */
    reference?: {
        chapter: number;
        verse: number;
    };

    /**
     * The caller that should be used for the footnote.
     * For footnotes, a "caller" is the character that is used in the text to reference to footnote.
     *
     * For example, in the text:
     * Hello (a) World
     *
     * ----
     * (a) This is a footnote.
     *
     * The "(a)" is the caller.
     *
     * If "+", then the caller should be autogenerated.
     * If null, then the caller should be empty.
     * If a string, then the caller should be that string.
     */
    caller: '+' | string | null;
}

/**
 * The audio links for a book chapter.
 */
interface TranslationBookChapterAudioLinks {
    /**
     * The reader for the chapter and the URL link to the audio file.
     */
    [reader: string]: string;
}

/**
 * The audio timings links for a book chapter.
 */
interface TranslationBookChapterAudioTimingsLinks {
    /**
     * The reader for the chapter and the API link to the audio timings file for that reader.
     */
    [reader: string]: string;
}
```

### Example

```json:no-line-numbers title="/api/BSB/GEN/1.json"
{
    "translation": {
        "id": "BSB",
        "name": "Berean Standard Bible",
        "website": "https://berean.bible/",
        "licenseUrl": "https://berean.bible/",
        "licenseNotes": null,
        "shortName": "BSB",
        "englishName": "Berean Standard Bible",
        "language": "eng",
        "textDirection": "ltr",
        "availableFormats": [
            "json"
        ],
        "listOfBooksApiLink": "/api/BSB/books.json",
        "numberOfBooks": 66,
        "totalNumberOfChapters": 1189,
        "totalNumberOfVerses": 31086,
        "languageName": "English",
        "languageEnglishName": "English"
    },
    "book": {
        "id": "GEN",
        "translationId": "BSB",
        "name": "Genesis",
        "commonName": "Genesis",
        "title": "Genesis",
        "order": 1,
        "numberOfChapters": 50,
        "firstChapterNumber": 1,
        "firstChapterApiLink": "/api/BSB/GEN/1.json",
        "lastChapterNumber": 50,
        "lastChapterApiLink": "/api/BSB/GEN/50.json",
        "totalNumberOfVerses": 1533
    },
    "thisChapterLink": "/api/BSB/GEN/1.json",
    "thisChapterAudioLinks": {
        "gilbert": "https://openbible.com/audio/gilbert/BSB_01_Gen_001_G.mp3",
        "hays": "https://openbible.com/audio/hays/BSB_01_Gen_001_H.mp3",
        "souer": "https://openbible.com/audio/souer/BSB_01_Gen_001.mp3"
    },
    "thisChapterAudioTimings": {
        "gilbert": "/api/BSB/GEN/1.gilbert.audioTimings.json",
        "hays": "/api/BSB/GEN/1.hays.audioTimings.json",
        "souer": "/api/BSB/GEN/1.souer.audioTimings.json"
    },
    "nextChapterApiLink": "/api/BSB/GEN/2.json",
    "nextChapterAudioLinks": {
        "gilbert": "https://openbible.com/audio/gilbert/BSB_01_Gen_002_G.mp3",
        "hays": "https://openbible.com/audio/hays/BSB_01_Gen_002_H.mp3",
        "souer": "https://openbible.com/audio/souer/BSB_01_Gen_002.mp3"
    },
    "nextChapterAudioTimings": {
        "gilbert": "/api/BSB/GEN/2.gilbert.audioTimings.json",
        "hays": "/api/BSB/GEN/2.hays.audioTimings.json",
        "souer": "/api/BSB/GEN/2.souer.audioTimings.json"
    },
    "previousChapterApiLink": null,
    "previousChapterAudioLinks": null,
    "previousChapterAudioTimings": null,
    "numberOfVerses": 31,
    "chapter": {
        "number": 1,
        "content": [
            {
                "type": "heading",
                "content": [
                    "The Creation"
                ]
            },
            {
                "type": "line_break"
            },
            {
                "type": "verse",
                "number": 1,
                "content": [
                    "In the beginning God created the heavens and the earth."
                ]
            },
            {
                "type": "line_break"
            },
            {
                "type": "verse",
                "number": 2,
                "content": [
                    "Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters."
                ]
            },
            {
                "type": "heading",
                "content": [
                    "The First Day"
                ]
            },
            {
                "type": "line_break"
            },
            {
                "type": "verse",
                "number": 3,
                "content": [
                    "And God said, “Let there be light,”",
                    {
                        "noteId": 0
                    },
                    "and there was light."
                ]
            },
            {
                "type": "verse",
                "number": 4,
                "content": [
                    "And God saw that the light was good, and He separated the light from the darkness."
                ]
            },
            {
                "type": "verse",
                "number": 5,
                "content": [
                    "God called the light “day,” and the darkness He called “night.”",
                    {
                        "lineBreak": true
                    },
                    "And there was evening, and there was morning—the first day.",
                    {
                        "noteId": 1
                    }
                ]
            }
        ],
        "footnotes": [
            {
                "noteId": 0,
                "text": "Cited in 2 Corinthians 4:6",
                "caller": "+",
                "reference": {
                    "chapter": 1,
                    "verse": 3
                }
            },
            {
                "noteId": 1,
                "text": "Literally day one",
                "caller": "+",
                "reference": {
                    "chapter": 1,
                    "verse": 5
                }
            },
            {
                "noteId": 2,
                "text": "Or a canopy or a firmament or a vault; also in verses 7, 8, 14, 15, 17, and 20",
                "caller": "+",
                "reference": {
                    "chapter": 1,
                    "verse": 6
                }
            },
            {
                "noteId": 3,
                "text": "MT; Syriac and over all the beasts of the earth",
                "caller": "+",
                "reference": {
                    "chapter": 1,
                    "verse": 26
                }
            },
            {
                "noteId": 4,
                "text": "Cited in Matthew 19:4 and Mark 10:6",
                "caller": "+",
                "reference": {
                    "chapter": 1,
                    "verse": 27
                }
            }
        ]
    }
}
```


## Get the Audio Timings for a Chapter

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.{reader}.audioTimings.json`

Gets the per-verse audio timings for a single chapter, for a single reader's narration of it -
that is, the time (in seconds, relative to the start of that reader's audio file) at which
each verse begins. Clients can use this to highlight the verse that is currently being read as
the audio plays.

Only some translations and readers have audio timings. A chapter that has them for a reader
links to this file with an entry in `thisChapterAudioTimings`, keyed by that reader's ID; when a
reader isn't a key in that map, this file doesn't exist for that reader and chapter.

-   `translation` is the ID of the translation (e.g. `BSB`).
-   `book` is the ID of the book (e.g. `GEN` for Genesis - you can find a list of book IDs [here](https://ubsicap.github.io/usfm/identification/books.html)).
-   `chapter` is the numerical chapter (e.g. `1` for the first chapter).
-   `reader` is the ID of the reader whose narration the timings are for (e.g. `hays`) - the
    available readers for a chapter are the keys of its `thisChapterAudioLinks`.

A verse's end is the start of the next verse (or, for the last verse, the end of the audio
file), so a client doesn't need anything beyond the ordered list of start times to build
highlighting ranges for the whole chapter.

This file is the same regardless of whether it's reached from the regular chapter endpoint or
[the simplified one](./simplified.md#get-a-simplified-chapter-from-a-translation) - there's
only one set of timings per translation, book, chapter, and reader.

### Code Example

```ts:no-line-numbers title="fetch-chapter-audio-timings.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;
const reader = 'hays';

// Get the audio timings for Genesis 1 (BSB), as read by "hays"
fetch(`https://bible.helloao.org/api/${translation}/${book}/${chapter}.${reader}.audioTimings.json`)
    .then(request => request.json())
    .then(timings => {
        console.log('Genesis 1 (BSB, hays) verse start times:', timings.verses);
    });
```

### Structure

```typescript:no-line-numbers title="chapter-audio-timings.ts"
/**
 * Defines the audio timings for a book chapter, for a single reader.
 * Maps to the /api/{translation}/{book}/{chapter}.{reader}.audioTimings.json endpoint.
 */
export interface TranslationBookChapterAudioTimings {
    /**
     * The ID of the translation.
     */
    translationId: string;

    /**
     * The ID of the book.
     */
    bookId: string;

    /**
     * The number of the chapter.
     */
    chapterNumber: number;

    /**
     * The ID of the reader that these timings are for.
     */
    reader: string;

    /**
     * The link to the audio file that these timings are for.
     */
    audioLink: string;

    /**
     * The link to the information for this chapter.
     */
    thisChapterLink: string;

    /**
     * The link to the information for the next chapter.
     * Null if this is the last chapter in the translation.
     */
    nextChapterLink: string | null;

    /**
     * The link to the information for the previous chapter.
     * Null if this is the first chapter in the translation.
     */
    previousChapterLink: string | null;

    /**
     * The link to this audio timings file.
     */
    thisChapterAudioTimingsLink: string;

    /**
     * The link to the timings for the next chapter, for the same reader.
     * Null if this is the last chapter in the translation.
     */
    nextChapterAudioTimingsLink: string | null;

    /**
     * The link to the timings for the previous chapter, for the same reader.
     * Null if this is the first chapter in the translation.
     */
    previousChapterAudioTimingsLink: string | null;

    /**
     * The times in seconds at which each verse starts, in order.
     * The first number (index 0) is the time in the recording at which the first verse starts.
     */
    verses: number[];
}
```

### Example

```json:no-line-numbers title="/api/BSB/GEN/1.hays.audioTimings.json"
{
    "translationId": "BSB",
    "bookId": "GEN",
    "chapterNumber": 1,
    "reader": "hays",
    "audioLink": "https://openbible.com/audio/hays/BSB_01_Gen_001_H.mp3",
    "thisChapterLink": "/api/BSB/GEN/1.json",
    "nextChapterLink": "/api/BSB/GEN/2.json",
    "previousChapterLink": null,
    "thisChapterAudioTimingsLink": "/api/BSB/GEN/1.hays.audioTimings.json",
    "nextChapterAudioTimingsLink": "/api/BSB/GEN/2.hays.audioTimings.json",
    "previousChapterAudioTimingsLink": null,
    "verses": [
        0,
        4.32,
        10.28,
        19.06,
        27.84
    ]
}
```

`verses[0]` is the start time of verse 1, `verses[1]` is the start time of verse 2, and so on -
so in this example, verse 2 of Genesis 1 (BSB, as read by "hays") starts 4.32 seconds into
`audioLink`.


## Get the Words of a Chapter

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.words.json`

Gets the word-level annotations (Strong's numbers and related source data) for a single chapter.

Only some translations include word-level annotations. A chapter that has them links to this
file with `thisChapterWordsLink`; when that property is missing, this file does not exist for
the chapter.

- `translation` is the ID of the translation (e.g. `BSB`).
- `book` is the ID of the book (e.g. `GEN` for Genesis - you can find a list of book IDs [here](https://ubsicap.github.io/usfm/identification/books.html)).
- `chapter` is the numerical chapter (e.g. `1` for the first chapter).

Each annotation is anchored to a range of characters in a single item of a verse's `content`
array: `contentIndex` is the index of the item, and `start`/`end` are character offsets into
that item's text. `end` is exclusive, so `text.slice(start, end)` is the annotated word.

Anchoring to a content item (instead of to the verse as a whole) means the offsets stay
correct for verses whose content is split into multiple items, such as poem lines, words of
Jesus, and footnote references.

### Code Example

```ts:no-line-numbers title="fetch-chapter-words.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Get the words for Genesis 1 from the BSB translation
fetch(`https://bible.helloao.org/api/${translation}/${book}/${chapter}.words.json`)
    .then(request => request.json())
    .then(words => {
        console.log('Genesis 1 words (BSB):', words);
    });
```

### Structure

```typescript:no-line-numbers title="chapter-words.ts"
export interface TranslationBookChapterWords {
    /**
     * The ID of the translation.
     */
    translationId: string;

    /**
     * The ID of the book.
     */
    bookId: string;

    /**
     * The number of the chapter.
     */
    chapterNumber: number;

    /**
     * The link to the information for this chapter.
     */
    thisChapterLink: string;

    /**
     * The link to the information for the next chapter.
     * Null if this is the last chapter in the translation.
     */
    nextChapterLink: string | null;

    /**
     * The link to the information for the previous chapter.
     * Null if this is the first chapter in the translation.
     */
    previousChapterLink: string | null;

    /**
     * The link to this words file.
     */
    thisChapterWordsLink: string;

    /**
     * The link to the words for the next chapter.
     * Null if this is the last chapter in the translation, or if the next chapter
     * doesn't have any word-level annotations.
     */
    nextChapterWordsLink: string | null;

    /**
     * The link to the words for the previous chapter.
     * Null if this is the first chapter in the translation, or if the previous chapter
     * doesn't have any word-level annotations.
     */
    previousChapterWordsLink: string | null;

    /**
     * The annotated words for each verse in the chapter, keyed by verse number.
     * Each list is in the order that the words occur in the verse.
     */
    verses: {
        [verseNumber: string]: ChapterWord[];
    };
}

interface ChapterWord {
    /**
     * The index of the item in the verse's content array that the annotation applies to.
     */
    contentIndex: number;

    /**
     * The index of the first character of the annotated word in the content item's text.
     */
    start: number;

    /**
     * The index after the last character of the annotated word in the content item's text.
     * That is, text.slice(start, end) is the annotated word.
     */
    end: number;

    /**
     * The Strong's number(s) for the word.
     * Omitted if the translation only provided other annotations for the word.
     */
    strongs?: string[];

    /**
     * The dictionary (citation) form of the word.
     * Omitted if the translation did not provide one.
     */
    lemma?: string;

    /**
     * The morphology parse code for the word.
     * Omitted if the translation did not provide one.
     */
    morph?: string;

    /**
     * The pointer to the word in the source text, in the <sourceName>:<location> format.
     * Omitted if the translation did not provide one.
     */
    srcloc?: string;

    /**
     * Which occurrence of the source word this word is. 1-based.
     * Omitted if the translation did not provide one.
     */
    occurrence?: number;

    /**
     * The total number of times that the source word occurs.
     * Omitted if the translation did not provide one.
     */
    occurrences?: number;
}
```

### Example

Given a chapter whose first verse has a single content item:

```json:no-line-numbers title="/api/engwebp/JHN/1.json"
{
    "thisChapterWordsLink": "/api/engwebp/JHN/1.words.json",
    "chapter": {
        "number": 1,
        "content": [
            {
                "type": "verse",
                "number": 1,
                "content": [
                    "In the beginning was the Word, and the Word was with God, and the Word was God."
                ]
            }
        ]
    }
}
```

The words file annotates the characters of that item:

```json:no-line-numbers title="/api/engwebp/JHN/1.words.json"
{
    "translationId": "engwebp",
    "bookId": "JHN",
    "chapterNumber": 1,
    "thisChapterLink": "/api/engwebp/JHN/1.json",
    "nextChapterLink": "/api/engwebp/JHN/2.json",
    "previousChapterLink": "/api/engwebp/MAT/28.json",
    "thisChapterWordsLink": "/api/engwebp/JHN/1.words.json",
    "nextChapterWordsLink": "/api/engwebp/JHN/2.words.json",
    "previousChapterWordsLink": "/api/engwebp/MAT/28.words.json",
    "verses": {
        "1": [
            {
                "contentIndex": 0,
                "start": 0,
                "end": 2,
                "strongs": ["G1722"]
            },
            {
                "contentIndex": 0,
                "start": 3,
                "end": 6,
                "strongs": ["G1722"]
            },
            {
                "contentIndex": 0,
                "start": 7,
                "end": 16,
                "strongs": ["G0746"]
            }
        ]
    }
}
```

That is, `"In the beginning...".slice(0, 2)` is `"In"`, which the source tagged with `G1722`.


## Get an entire Translation

`GET https://bible.helloao.org/api/{translation}/complete.json`

Gets the content of an entire translation.

-   `translation` is the ID of the translation (e.g. `BSB`).

### Code Example

```ts:no-line-numbers title="fetch-translation-complete.js"
const translation = 'BSB';

// Get Genesis 1 from the BSB translation
fetch(`https://bible.helloao.org/api/${translation}/complete.json`)
    .then(request => request.json())
    .then(chapter => {
        console.log('BSB:', chapter);
    });
```

### Structure

```typescript:no-line-numbers title="complete.ts"
/**
 * Defines the complete translation download data.
 * Maps to the /api/:translationId/complete.json endpoint.
 */
export interface TranslationComplete {
    /**
     * The translation metadata.
     */
    translation: Translation;

    /**
     * The complete list of books with all their chapters.
     */
    books: TranslationCompleteBook[];
}

/**
 * A book in the complete translation download.
 */
export interface TranslationCompleteBook {
    /**
     * The ID of the book.
     */
    id: string;

    /**
     * The name of the book from the translation.
     */
    name: string;

    /**
     * The common name for the book.
     */
    commonName: string;

    /**
     * The title of the book.
     */
    title: string | null;

    /**
     * The order of the book.
     */
    order: number;

    /**
     * The number of chapters in the book.
     */
    numberOfChapters: number;

    /**
     * The total number of verses in the book.
     */
    totalNumberOfVerses: number;

    /**
     * Whether the book is apocryphal.
     */
    isApocryphal?: boolean;

    /**
     * The complete list of chapters with all content.
     */
    chapters: TranslationCompleteChapter[];
}

/**
 * A chapter in the complete translation download.
 */
export interface TranslationCompleteChapter {
    /**
     * The number of verses that the chapter contains.
     */
    numberOfVerses: number;

    /**
     * The links to different audio versions for the chapter.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * The audio timings (per-verse start times, in seconds) for different audio versions for
     * the chapter.
     *
     * Unlike `thisChapterAudioTimings` on the individual chapter endpoint (which links to
     * "Get the Audio Timings for a Chapter" below), this contains the timings themselves -
     * since the point of the complete translation download is to have everything in one file.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsMap;

    /**
     * The link to the word-level annotations for the chapter.
     * Omitted if the chapter doesn't have any word-level annotations.
     */
    thisChapterWordsLink?: string;

    /**
     * The information for the chapter.
     */
    chapter: ChapterData;
}

/**
 * The audio timings for a book chapter, embedded directly rather than linked to.
 * Maps a reader ID to the list of times (in seconds) that each verse starts, in verse order.
 */
interface TranslationBookChapterAudioTimingsMap {
    [reader: string]: number[];
}
```

### Example

```json:no-line-numbers title="/api/BSB/complete.json"
{
  "translation": {
    "id": "BSB",
    "name": "Berean Standard Bible",
    "website": "https://berean.bible/",
    "licenseUrl": "https://berean.bible/",
    "licenseNotes": null,
    "shortName": "BSB",
    "englishName": "Berean Standard Bible",
    "language": "eng",
    "textDirection": "ltr",
    "sha256": "b2898c49cadb50fd8763feb9e2f74a90a3817e33408a24b6cbf09e7a950dde97",
    "availableFormats": [
      "json"
    ],
    "listOfBooksApiLink": "/api/BSB/books.json",
    "completeTranslationApiLink": "/api/BSB/complete.json",
    "simpleCompleteTranslationApiLink": "/api/BSB/complete.simple.json",
    "numberOfBooks": 66,
    "totalNumberOfChapters": 1189,
    "totalNumberOfVerses": 31086,
    "languageName": "English",
    "languageEnglishName": "English"
  },
  "books": [
    {
      "id": "GEN",
      "name": "Genesis",
      "commonName": "Genesis",
      "title": "Genesis",
      "order": 1,
      "numberOfChapters": 50,
      "totalNumberOfVerses": 1533,
      "chapters": [
        {
          "numberOfVerses": 31,
          "thisChapterAudioLinks": {
            "gilbert": "https://openbible.com/audio/gilbert/BSB_01_Gen_001_G.mp3",
            "hays": "https://openbible.com/audio/hays/BSB_01_Gen_001_H.mp3",
            "souer": "https://openbible.com/audio/souer/BSB_01_Gen_001.mp3"
          },
          "thisChapterAudioTimings": {
            "gilbert": [0, 4.4, 10.36],
            "hays": [0, 4.32, 10.28],
            "souer": [0, 4.28, 10.19]
          },
          "chapter": {
            "number": 1,
            "content": [
              {
                "type": "heading",
                "content": [
                  "The Creation"
                ]
              },
              {
                "type": "verse",
                "number": 1,
                "content": [
                  "In the beginning God created the heavens and the earth."
                ]
              },
              {
                "type": "line_break"
              },
              {
                "type": "verse",
                "number": 2,
                "content": [
                  "Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters."
                ]
              },
            ]
          }
        }
      ]
    }
  ]
}
```

