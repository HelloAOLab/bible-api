# Simplified Format

The simplified format for chapters, complete-translation downloads, and word-level annotations. See [Translations, Books, & Chapters](./README.md) for the translation and book listing endpoints, or [the standard format](./standard.md) for the original, structured representation of this same content.

## Get a Simplified Chapter from a Translation

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.simple.json`

Gets the content of a single chapter for a given book and translation, using the simplified format.

In the simplified format, the content of each verse is a single string instead of a list of formatted content. This means you don't have to build the text of a verse yourself, which can be non-trivial to get right - especially when it comes to spacing. Anything that can't be represented by a plain string - footnotes, the Words of Jesus, poetry, and headings that occur in the middle of a verse - is kept as an offset into that string, so nothing is lost.

Use this endpoint when you want the text of a chapter. Use [the regular chapter endpoint](./standard.md#get-a-chapter-from-a-translation) when you want to render the chapter with its original formatting.

-   `translation` is the ID of the translation (e.g. `BSB`).
-   `book` is the ID of the book (e.g. `GEN` for Genesis - you can find a list of book IDs [here](https://ubsicap.github.io/usfm/identification/books.html)).
-   `chapter` is the numerical chapter (e.g. `1` for the first chapter).

Chapters that have word-level annotations link to them with `thisChapterWordsLink`, which points at [the simplified annotations](#get-the-words-of-a-chapter-in-the-simplified-format) - the ones whose offsets match the text in this file.

### Code Example

```ts:no-line-numbers title="fetch-simple-chapter.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Get the text of Genesis 1 from the BSB translation
fetch(`https://bible.helloao.org/api/${translation}/${book}/${chapter}.simple.json`)
    .then(request => request.json())
    .then(chapter => {
        for (let content of chapter.chapter.content) {
            if (content.type === 'verse') {
                console.log(`${content.number}. ${content.text}`);
            }
        }
    });
```

### Offsets

All of the offsets in the simplified format - `offset`, `start`, and `end` - are indexes into the `text` of the verse that contains them. They are measured in UTF-16 code units, which is what JavaScript's `String.prototype.length` and `String.prototype.slice()` use.

`start` is inclusive and `end` is exclusive, so `text.slice(start, end)` returns exactly the range of text that was marked. Footnote offsets are the position that the footnote's caller belongs at, so `text.slice(0, offset)` is the text that comes before it.

### Structure

```typescript:no-line-numbers title="simple-chapter.ts"
export interface SimpleTranslationBookChapter {
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
     * The link to the regular (non-simplified) version of this chapter.
     */
    fullChapterApiLink: string;

    /**
     * The links to different audio versions for the chapter.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * The link to the next chapter, in the simplified format.
     * Null if this is the last chapter in the translation.
     */
    nextChapterApiLink: string | null;

    /**
     * The links to different audio versions for the next chapter.
     * Null if this is the last chapter in the translation.
     */
    nextChapterAudioLinks: TranslationBookChapterAudioLinks | null;

    /**
     * The link to the previous chapter, in the simplified format.
     * Null if this is the first chapter in the translation.
     */
    previousChapterApiLink: string | null;

    /**
     * The links to different audio versions for the previous chapter.
     * Null if this is the first chapter in the translation.
     */
    previousChapterAudioLinks: TranslationBookChapterAudioLinks | null;

    /**
     * The number of verses that the chapter contains.
     */
    numberOfVerses: number;

    /**
     * The information for the chapter.
     */
    chapter: SimpleChapterData;
}

interface SimpleChapterData {
    /**
     * The number of the chapter.
     */
    number: number;

    /**
     * The content of the chapter.
     */
    content: SimpleChapterContent[];

    /**
     * The list of footnotes that could not be associated with a verse.
     * Footnotes that belong to a verse are included on the verse itself,
     * so this list is usually empty.
     */
    footnotes: ChapterFootnote[];
}

/**
 * A union type that represents a single piece of content in a simplified chapter.
 */
type SimpleChapterContent = SimpleChapterHeading | ChapterLineBreak | SimpleChapterVerse | SimpleChapterHebrewSubtitle;

/**
 * A heading in a chapter.
 */
interface SimpleChapterHeading {
    /**
     * Indicates that the content represents a heading.
     */
    type: 'heading';

    /**
     * The text of the heading.
     */
    text: string;
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
 * A verse in a chapter.
 */
interface SimpleChapterVerse {
    /**
     * Indicates that the content is a verse.
     */
    type: 'verse';

    /**
     * The number of the verse.
     */
    number: number;

    /**
     * The text of the verse.
     * Lines of poetry and line breaks are separated by newline (\n) characters.
     */
    text: string;

    /**
     * The footnotes that occur in the verse.
     */
    footnotes: SimpleVerseFootnote[];

    /**
     * The headings that occur in the middle of the verse.
     * Omitted if the verse contains no inline headings.
     */
    headings?: SimpleInlineHeading[];

    /**
     * The ranges of the verse text that represent the Words of Jesus.
     * Omitted if the verse contains none.
     */
    wordsOfJesus?: SimpleTextRange[];

    /**
     * The ranges of the verse text that represent lines of poetry.
     * Omitted if the verse contains none.
     */
    poem?: SimplePoemRange[];
}

/**
 * A Hebrew Subtitle in a chapter.
 * These are often included as informational content that appeared in the original manuscripts.
 * For example, Psalms 49 has the Hebrew Subtitle "To the choirmaster. A Psalm of the Sons of Korah."
 */
interface SimpleChapterHebrewSubtitle extends Omit<SimpleChapterVerse, 'type' | 'number'> {
    /**
     * Indicates that the content represents a Hebrew Subtitle.
     */
    type: 'hebrew_subtitle';
}

/**
 * A footnote in a verse.
 */
interface SimpleVerseFootnote {
    /**
     * The ID of the note.
     */
    noteId: number;

    /**
     * The index in the verse text that the footnote caller should be inserted at.
     */
    offset: number;

    /**
     * The text of the footnote.
     */
    text: string;

    /**
     * The caller that should be used for the footnote.
     * If "+", then the caller should be autogenerated.
     * If null, then the caller should be empty.
     * If a string, then the caller should be that string.
     */
    caller: '+' | string | null;
}

/**
 * A heading that is embedded in a verse.
 */
interface SimpleInlineHeading {
    /**
     * The index in the verse text that the heading occurs at.
     */
    offset: number;

    /**
     * The text of the heading.
     */
    text: string;
}

/**
 * A range of text inside a verse.
 */
interface SimpleTextRange {
    /**
     * The index of the first character of the range.
     */
    start: number;

    /**
     * The index after the last character of the range.
     */
    end: number;
}

/**
 * A range of text inside a verse that represents a line of poetry.
 */
interface SimplePoemRange extends SimpleTextRange {
    /**
     * The level of indent that the line of poetry should be displayed with.
     */
    level: number;
}
```

### Example

```json:no-line-numbers title="/api/BSB/GEN/1.simple.json"
{
    "translation": {
        "id": "BSB",
        "name": "Berean Standard Bible",
        "website": "https://berean.bible/",
        "licenseUrl": "https://berean.bible/",
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
        "name": "Genesis",
        "commonName": "Genesis",
        "title": "Genesis",
        "order": 1,
        "numberOfChapters": 50,
        "firstChapterApiLink": "/api/BSB/GEN/1.json",
        "lastChapterApiLink": "/api/BSB/GEN/50.json",
        "totalNumberOfVerses": 1533
    },
    "thisChapterLink": "/api/BSB/GEN/1.simple.json",
    "fullChapterApiLink": "/api/BSB/GEN/1.json",
    "thisChapterReference": {
        "translationId": "BSB",
        "book": "GEN",
        "chapter": 1
    },
    "thisChapterAudioLinks": {
        "hays": "https://audio.bible.helloao.org/api/BSB/GEN/1/audio/hays.mp3",
        "souer": "https://audio.bible.helloao.org/api/BSB/GEN/1/audio/souer.mp3",
        "david": "https://audio.bible.helloao.org/api/BSB/GEN/1/audio/david.mp3"
    },
    "nextChapterApiLink": "/api/BSB/GEN/2.simple.json",
    "nextChapterReference": {
        "translationId": "BSB",
        "book": "GEN",
        "chapter": 2
    },
    "previousChapterApiLink": null,
    "previousChapterReference": null,
    "numberOfVerses": 31,
    "chapter": {
        "number": 1,
        "content": [
            {
                "type": "heading",
                "text": "The Creation"
            },
            {
                "type": "line_break"
            },
            {
                "type": "verse",
                "number": 1,
                "text": "In the beginning God created the heavens and the earth.",
                "footnotes": []
            },
            {
                "type": "line_break"
            },
            {
                "type": "verse",
                "number": 2,
                "text": "Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters.",
                "footnotes": []
            },
            {
                "type": "heading",
                "text": "The First Day"
            },
            {
                "type": "line_break"
            },
            {
                "type": "verse",
                "number": 3,
                "text": "And God said, “Let there be light,” and there was light.",
                "footnotes": [
                    {
                        "noteId": 0,
                        "offset": 35,
                        "text": "Cited in 2 Corinthians 4:6",
                        "caller": "+"
                    }
                ]
            }
        ],
        "footnotes": []
    }
}
```

Poetry and the Words of Jesus are kept as ranges over the verse text. For example, `Matthew 5:3` in the `engwebp` translation looks like this:

```json:no-line-numbers title="/api/engwebp/MAT/5.simple.json"
{
    "type": "verse",
    "number": 3,
    "text": "“Blessed are the poor in spirit,\nfor theirs is the Kingdom of Heaven.",
    "footnotes": [],
    "wordsOfJesus": [
        {
            "start": 0,
            "end": 69
        }
    ],
    "poem": [
        {
            "start": 0,
            "end": 32,
            "level": 1
        },
        {
            "start": 33,
            "end": 69,
            "level": 2
        }
    ]
}
```


## Get the Words of a Chapter in the Simplified Format

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.words.simple.json`

Gets the word-level annotations for a single chapter, with their offsets remapped onto the text of each [simplified verse](#get-a-simplified-chapter-from-a-translation).

The offsets in [the regular annotations](./standard.md#get-the-words-of-a-chapter) are anchored to items of a verse's `content` array, which the simplified format replaces with a single string - so they can't be used with it. Use this file instead when you are working with the simplified chapters.

-   `translation` is the ID of the translation (e.g. `BSB`).
-   `book` is the ID of the book (e.g. `GEN` for Genesis - you can find a list of book IDs [here](https://ubsicap.github.io/usfm/identification/books.html)).
-   `chapter` is the numerical chapter (e.g. `1` for the first chapter).

These entries have no `contentIndex`. `start` and `end` are offsets into the `text` of the verse, exactly like the footnote, poem, and Words of Jesus offsets in the simplified chapters, so `text.slice(start, end)` is the annotated word.

As with the regular annotations, only some translations have them. A simplified chapter that has them links to this file with `thisChapterWordsLink`; when that property is missing, this file does not exist for the chapter.

### Code Example

```ts:no-line-numbers title="fetch-simple-chapter-words.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Get the text of Genesis 1 and the words that are annotated in it
Promise.all([
    fetch(`https://bible.helloao.org/api/${translation}/${book}/${chapter}.simple.json`).then(r => r.json()),
    fetch(`https://bible.helloao.org/api/${translation}/${book}/${chapter}.words.simple.json`).then(r => r.json()),
]).then(([chapter, words]) => {
    for (let content of chapter.chapter.content) {
        if (content.type !== 'verse') {
            continue;
        }
        for (let word of words.verses[content.number] ?? []) {
            console.log(content.text.slice(word.start, word.end), word.strongs);
        }
    }
});
```

### Structure

The structure matches [the regular annotations](./standard.md#get-the-words-of-a-chapter), except that the links point at the simplified files and the entries have no `contentIndex`.

```typescript:no-line-numbers title="simple-words.ts"
export interface SimpleTranslationBookChapterWords {
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
     * The link to the simplified chapter that these annotations are for.
     */
    thisChapterLink: string;

    /**
     * The link to the next simplified chapter.
     * Null if this is the last chapter in the translation.
     */
    nextChapterLink: string | null;

    /**
     * The link to the previous simplified chapter.
     * Null if this is the first chapter in the translation.
     */
    previousChapterLink: string | null;

    /**
     * The link to these annotations.
     */
    thisChapterWordsLink: string;

    /**
     * The link to the annotations for the next chapter.
     * Null if this is the last chapter in the translation, or if the next chapter
     * doesn't have any word-level annotations.
     */
    nextChapterWordsLink: string | null;

    /**
     * The link to the annotations for the previous chapter.
     * Null if this is the first chapter in the translation, or if the previous
     * chapter doesn't have any word-level annotations.
     */
    previousChapterWordsLink: string | null;

    /**
     * The annotated words for each verse in the chapter, keyed by verse number.
     * Each list is in the order that the words occur in the verse.
     */
    verses: {
        [verseNumber: string]: SimpleChapterWord[];
    };
}

/**
 * A word-level annotation in a simplified chapter.
 */
export interface SimpleChapterWord {
    /**
     * The index of the first character of the annotated word in the verse text.
     */
    start: number;

    /**
     * The index after the last character of the annotated word in the verse text.
     */
    end: number;

    /**
     * The Strong's numbers for the word.
     */
    strongs?: string[];

    /**
     * The lemma (dictionary form) of the word in the source language.
     */
    lemma?: string;

    /**
     * The morphology of the word in the source language.
     */
    morph?: string;

    /**
     * The location of the word in the source text.
     */
    srcloc?: string;

    /**
     * Which occurrence of the word in the verse this is.
     */
    occurrence?: number;

    /**
     * The number of times that the word occurs in the verse.
     */
    occurrences?: number;
}
```

### Example

```json:no-line-numbers title="/api/engwebp/JHN/1.words.simple.json"
{
    "translationId": "engwebp",
    "bookId": "JHN",
    "chapterNumber": 1,
    "thisChapterLink": "/api/engwebp/JHN/1.simple.json",
    "nextChapterLink": "/api/engwebp/JHN/2.simple.json",
    "previousChapterLink": "/api/engwebp/MAT/28.simple.json",
    "thisChapterWordsLink": "/api/engwebp/JHN/1.words.simple.json",
    "nextChapterWordsLink": "/api/engwebp/JHN/2.words.simple.json",
    "previousChapterWordsLink": "/api/engwebp/MAT/28.words.simple.json",
    "verses": {
        "1": [
            {
                "start": 0,
                "end": 2,
                "strongs": ["G1722"]
            },
            {
                "start": 3,
                "end": 6,
                "strongs": ["G1722"]
            },
            {
                "start": 7,
                "end": 16,
                "strongs": ["G0746"]
            }
        ]
    }
}
```

Verse 1 of that chapter has the text `"In the beginning was the Word, and the Word was with God, and the Word was God."`, so `text.slice(7, 16)` is `"beginning"`.


## Get an entire Translation in the Simplified Format

`GET https://bible.helloao.org/api/{translation}/complete.simple.json`

Gets the content of an entire translation, using the simplified format. This is the
[simplified chapter format](#get-a-simplified-chapter-from-a-translation) applied to
[the complete translation download](./standard.md#get-an-entire-translation): one file containing the whole
translation, where the content of each verse is a single string.

Use this when you want the text of an entire translation without making a request per chapter and
without having to build the text yourself.

-   `translation` is the ID of the translation (e.g. `BSB`).

This file is generated alongside `complete.json`, so a translation either has both or neither. The
`translation` object in both files contains a `completeTranslationApiLink` and a
`simpleCompleteTranslationApiLink`, so you can move between the two formats.

### Code Example

```ts:no-line-numbers title="fetch-translation-complete-simple.js"
const translation = 'BSB';

// Get the text of the entire BSB translation
fetch(`https://bible.helloao.org/api/${translation}/complete.simple.json`)
    .then(request => request.json())
    .then(complete => {
        for (let book of complete.books) {
            for (let { chapter } of book.chapters) {
                for (let content of chapter.content) {
                    if (content.type === 'verse') {
                        console.log(`${book.commonName} ${chapter.number}:${content.number} ${content.text}`);
                    }
                }
            }
        }
    });
```

### Structure

The structure matches [the regular complete translation download](./standard.md#get-an-entire-translation),
except that each chapter uses the simplified format.

```typescript:no-line-numbers title="complete-simple.ts"
/**
 * Defines the complete translation download data, using the simplified chapter format.
 * Maps to the /api/:translationId/complete.simple.json endpoint.
 */
export interface SimpleTranslationComplete {
    /**
     * The translation metadata.
     */
    translation: Translation;

    /**
     * The complete list of books with all their chapters.
     */
    books: SimpleTranslationCompleteBook[];
}

/**
 * A book in the complete translation download, using the simplified chapter format.
 */
export interface SimpleTranslationCompleteBook extends Omit<TranslationCompleteBook, 'chapters'> {
    /**
     * The complete list of chapters with all content.
     */
    chapters: SimpleTranslationCompleteChapter[];
}

/**
 * A chapter in the complete translation download, using the simplified chapter format.
 */
export interface SimpleTranslationCompleteChapter {
    /**
     * The number of verses that the chapter contains.
     */
    numberOfVerses: number;

    /**
     * The links to different audio versions for the chapter.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * The audio timings (per-verse start times, in seconds) for the chapter.
     *
     * Note that the complete translation files contain the timings themselves,
     * unlike the individual chapter endpoints, which contain links to them.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimings;

    /**
     * The link to the word-level annotations for the chapter, using the
     * simplified format. Omitted if the chapter doesn't have any
     * word-level annotations.
     */
    thisChapterWordsLink?: string;

    /**
     * The simplified information for the chapter.
     */
    chapter: SimpleChapterData;
}
```

### Example

```json:no-line-numbers title="/api/BSB/complete.simple.json"
{
    "translation": {
        "id": "BSB",
        "name": "Berean Standard Bible",
        "englishName": "Berean Standard Bible",
        "language": "eng",
        "licenseUrl": "https://berean.bible/",
        "shortName": "BSB",
        "website": "https://berean.bible/",
        "textDirection": "ltr",
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
                        "hays": "https://audio.bible.helloao.org/api/BSB/GEN/1/audio/hays.mp3",
                        "souer": "https://audio.bible.helloao.org/api/BSB/GEN/1/audio/souer.mp3",
                        "david": "https://audio.bible.helloao.org/api/BSB/GEN/1/audio/david.mp3"
                    },
                    "thisChapterAudioTimings": {},
                    "chapter": {
                        "number": 1,
                        "content": [
                            {
                                "type": "heading",
                                "text": "The Creation"
                            },
                            {
                                "type": "line_break"
                            },
                            {
                                "type": "verse",
                                "number": 1,
                                "text": "In the beginning God created the heavens and the earth.",
                                "footnotes": []
                            }
                        ],
                        "footnotes": []
                    }
                }
            ]
        }
    ]
}
```

