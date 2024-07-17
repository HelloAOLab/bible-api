# API

## Available Translations

`GET https://bible.helloao.org/api/available_translations.json`

Gets the list of available translations in the API.

### Code Example

```javascript
fetch(`https://bible.helloao.org/api/available_translations.json`)
    .then(request => request.json())
    .then(availableTranslations => {
        console.log('The API has the following translations:', availableTranslations);
    });
```

#### Structure

```typescript
export interface AvailableTranslations {
    /**
     * The list of translations.
     */
    translations: Translation[];
}

interface Translation {
    /**
     * The ID of the translation.
     */
    id: string;

    /**
     * The name of the translation.
     * This is usually the name of the translation in the translation's language.
     */
    name: string;

    /**
     * The English name of the translation.
     */
    englishName: string;

    /**
     * The website for the translation.
     */
    website: string;

    /**
     * The URL that the license for the translation can be found.
     */
    licenseUrl: string;

    /**
     * The short name for the translation.
     */
    shortName?: string;

    /**
     * The RFC 5646 letter language tag that the translation is primarily in.
     */
    language: string;

    /**
     * The direction that the language is written in.
     * "ltr" indicates that the text is written from the left side of the page to the right.
     * "rtl" indicates that the text is written from the right side of the page to the left.
     */
    textDirection: 'ltr' | 'rtl';

    /**
     * The available list of formats.
     */
    availableFormats: ('json' | 'usfm')[];

    /**
     * The API link for the list of available books for this translation.
     */
    listOfBooksApiLink: string;
}
```

#### Example

```json
{
    "translations": [
        {
            "id": "BSB",
            "name": "Berean Standard Bible",
            "englishName": "Berean Standard Bible",
            "shortName": "BSB",
            "language": "en-US",
            "licenseUrl": "https://berean.bible/terms.htm",
            "website": "https://berean.bible",
            "availableFormats": [
                "json"
            ],
            "listOfBooksApiLink": "/api/BSB/books.json",
            "textDirection": "ltr"
        },
    ]
}
```

## List Books in a Translation

`GET https://bible.helloao.org/api/{translation}/books.json`

Gets the list of books that are available for the given translation.

- `translation` is the ID of the translation (e.g. `BSB`).

### Code Example

```javascript
const translation = 'BSB';

// Get the list of books for the BSB translation
fetch(`https://bible.helloao.org/api/${translation}/books.json`)
    .then(request => request.json())
    .then(books => {
        console.log('The BSB has the following books:', books);
    });
```

#### Structure

```typescript
export interface TranslationBooks {
    /**
     * The translation information for the books.
     */
    translation: Translation;

    /**
     * The list of books that are available for the translation.
     */
    books: TranslationBook[];
}

interface TranslationBook {
    /**
     * The ID of the book.
     */
    id: string;

    /**
     * The name that the translation provided for the book.
     */
    name: string;

    /**
     * The common name for the book.
     */
    commonName: string;

    /**
     * The number of chapters that the book contains.
     */
    numberOfChapters: number;

    /**
     * The link to the first chapter of the book.
     */
    firstChapterApiLink: string;

    /**
     * The link to the last chapter of the book.
     */
    lastChapterApiLink: string;
}
```

#### Example

```json
{
    "translation": {
        "id": "BSB",
        "name": "Berean Standard Bible",
        "englishName": "Berean Standard Bible",
        "shortName": "BSB",
        "language": "en-US",
        "licenseUrl": "https://berean.bible/terms.htm",
        "website": "https://berean.bible",
        "availableFormats": [
            "json"
        ],
        "listOfBooksApiLink": "/api/BSB/books.json",
        "textDirection": "ltr"
    },
    "books": [
        {
            "id": "GEN",
            "name": "Genesis",
            "commonName": "Genesis",
            "title": "Genesis",
            "firstChapterApiLink": "/api/BSB/GEN/1.json",
            "lastChapterApiLink": "/api/BSB/GEN/50.json",
            "numberOfChapters": 50
        },
    ]
}
```

## Get a Chapter from a Translation

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`

Gets the content of a single chapter for a given book and translation.

- `translation` is the ID of the translation (e.g. `BSB`).
- `book` is either the ID of the book or the common name of the book (e.g. `GEN` or `Genesis` for the BSB).
- `chapter` is the numerical chapter (e.g. `1` for the first chapter).

### Code Example

```javascript
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

#### Structure

```typescript
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
    thisChapterApiLink: string;

    /**
     * The links to different audio versions for the chapter.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * The link to the next chapter.
     * Null if this is the last chapter in the translation.
     */
    nextChapterApiLink: string | null;

    /**
     * The links to different audio versions for the next chapter.
     * Null if this is the last chapter in the translation.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * The link to the previous chapter.
     * Null if this is the first chapter in the translation.
     */
    previousChapterApiLink: string | null;

    /**
     * The links to different audio versions for the previous chapter.
     * Null if this is the last chapter in the translation.
     */
    previousChapterAudioLinks: TranslationBookChapterAudioLinks;

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
```

#### Example

```json
{
    "translation": {
        "id": "BSB",
        "name": "Berean Standard Bible",
        "englishName": "Berean Standard Bible",
        "shortName": "BSB",
        "language": "en-US",
        "licenseUrl": "https://berean.bible/terms.htm",
        "website": "https://berean.bible",
        "availableFormats": [
            "json"
        ],
        "listOfBooksApiLink": "/api/BSB/books.json",
        "textDirection": "ltr"
    },
    "book": {
        "id": "GEN",
        "name": "Genesis",
        "commonName": "Genesis",
        "title": "Genesis",
        "firstChapterApiLink": "/api/BSB/GEN/1.json",
        "lastChapterApiLink": "/api/BSB/GEN/50.json",
        "numberOfChapters": 50
    },
    "nextChapterApiLink": "/api/BSB/GEN/2.json",
    "previousChapterApiLink": null,
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