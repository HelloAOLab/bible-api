# API

## Available Translations

`GET https://bible.helloao.org/api/available_translations.json`

Gets the list of available translations in the API.

### Code Example

```ts:no-line-numbers title="fetch-translations.js"
fetch(`https://bible.helloao.org/api/available_translations.json`)
    .then(request => request.json())
    .then(availableTranslations => {
        console.log('The API has the following translations:', availableTranslations);
    });
```

### Structure

```typescript:no-line-numbers title="available-translations.ts"
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
    shortName: string;

    /**
     * The ISO 639  3-letter language tag that the translation is primarily in.
     */
    language: string;

    /**
     * Gets the name of the language that the translation is in.
     * Null or undefined if the name of the language is not known.
     */
    languageName?: string;

    /**
     * Gets the name of the language in English.
     * Null or undefined if the language doesn't have an english name.
     */
    languageEnglishName?: string;

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

    /**
     * The number of books that are contained in this translation.
     *
     * Complete translations should have the same number of books as the Bible (66).
     */
    numberOfBooks: number;

    /**
     * The total number of chapters that are contained in this translation.
     *
     * Complete translations should have the same number of chapters as the Bible (1,189).
     */
    totalNumberOfChapters: number;

    /**
     * The total number of verses that are contained in this translation.
     *
     * Complete translations should have the same number of verses as the Bible (around 31,102 - some translations exclude verses based on the aparent likelyhood of existing in the original source texts).
     */
    totalNumberOfVerses: number;
}
```

### Example

```json:no-line-numbers title="/api/available_translations.json"
{
    "translations": [
        {
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
        }
    ]
}
```

## List Books in a Translation

`GET https://bible.helloao.org/api/{translation}/books.json`

Gets the list of books that are available for the given translation.

-   `translation` is the ID of the translation (e.g. `BSB`).

### Code Example

```ts:no-line-numbers title="fetch-books.js"
const translation = 'BSB';

// Get the list of books for the BSB translation
fetch(`https://bible.helloao.org/api/${translation}/books.json`)
    .then(request => request.json())
    .then(books => {
        console.log('The BSB has the following books:', books);
    });
```

### Structure

```typescript:no-line-numbers title="books.ts"
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

    /**
     * The number of verses that the book contains.
     */
    totalNumberOfVerses: number;
}
```

### Example

```json:no-line-numbers title="/api/BSB/books.json"
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
    "books": [
        {
            "id": "GEN",
            "translationId": "BSB",
            "name": "Genesis",
            "commonName": "Genesis",
            "title": "Genesis",
            "order": 1,
            "numberOfChapters": 50,
            "firstChapterApiLink": "/api/BSB/GEN/1.json",
            "lastChapterApiLink": "/api/BSB/GEN/50.json",
            "totalNumberOfVerses": 1533
        },
    ]
}
```

## Get a Chapter from a Translation

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`

Gets the content of a single chapter for a given book and translation.

-   `translation` is the ID of the translation (e.g. `BSB`).
-   `book` is either the ID of the book or the common name of the book (e.g. `GEN` or `Genesis` for the BSB).
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
     * The number of verses that the chapter contains.
     */
    numberOfVerses: number;

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

### Example

```json:no-line-numbers title="/api/BSB/GEN/1.json"
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
        "translationId": "BSB",
        "name": "Genesis",
        "commonName": "Genesis",
        "title": "Genesis",
        "order": 1,
        "numberOfChapters": 50,
        "firstChapterApiLink": "/api/BSB/GEN/1.json",
        "lastChapterApiLink": "/api/BSB/GEN/50.json",
        "totalNumberOfVerses": 1533
    },
    "thisChapterLink": "/api/BSB/GEN/1.json",
    "thisChapterAudioLinks": {
        "gilbert": "https://openbible.com/audio/gilbert/BSB_01_Gen_001_G.mp3",
        "hays": "https://openbible.com/audio/hays/BSB_01_Gen_001_H.mp3",
        "souer": "https://openbible.com/audio/souer/BSB_01_Gen_001.mp3"
    },
    "nextChapterApiLink": "/api/BSB/GEN/2.json",
    "nextChapterAudioLinks": {
        "gilbert": "https://openbible.com/audio/gilbert/BSB_01_Gen_002_G.mp3",
        "hays": "https://openbible.com/audio/hays/BSB_01_Gen_002_H.mp3",
        "souer": "https://openbible.com/audio/souer/BSB_01_Gen_002.mp3"
    },
    "previousChapterApiLink": null,
    "previousChapterAudioLinks": null,
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

## Available Commentaries

`GET https://bible.helloao.org/api/available_commentaries.json`

Gets the list of available Bible commentaries in the API.

### Code Example

```ts:no-line-numbers title="fetch-commentaries.js"
fetch(`https://bible.helloao.org/api/available_commentaries.json`)
    .then(request => request.json())
    .then(availableCommentaries => {
        console.log('The API has the following commentaries:', availableCommentaries);
    });
```

### Structure

```typescript:no-line-numbers title="available-commentaries.ts"
export interface AvailableCommentaries {
    /**
     * The list of commentaries.
     */
    commentaries: Commentary[];
}

export interface Commentary {
    /**
     * The ID of the commentary.
     */
    id: string;

    /**
     * The name of the commentary.
     */
    name: string;

    /**
     * The website for the commentary.
     */
    website: string;

    /**
     * The URL that the license for the commentary can be found.
     */
    licenseUrl: string;

    /**
     * The english name for the commentary.
     */
    englishName: string;

    /**
     * The ISO 639 3-letter language tag that the translation is primarily in.
     */
    language: string;

    /**
     * The direction that the language is written in.
     * "ltr" indicates that the text is written from the left side of the page to the right.
     * "rtl" indicates that the text is written from the right side of the page to the left.
     */
    textDirection: 'ltr' | 'rtl';

    /**
     * The API link for the list of available books for this translation.
     */
    listOfBooksApiLink: string;

    /**
     * The available list of formats.
     */
    availableFormats: ('json' | 'usfm')[];

    /**
     * The number of books that are contained in this commentary.
     *
     * Complete commentaries should have the same number of books as the Bible (66).
     */
    numberOfBooks: number;

    /**
     * The total number of chapters that are contained in this translation.
     *
     * Complete commentaries should have the same number of chapters as the Bible (1,189).
     */
    totalNumberOfChapters: number;

    /**
     * The total number of verses that are contained in this commentary.
     *
     * Complete commentaries should have the same number of verses as the Bible (around 31,102 - some commentaries exclude verses based on the aparent likelyhood of existing in the original source texts).
     */
    totalNumberOfVerses: number;

    /**
     * Gets the name of the language that the commentary is in.
     * Null or undefined if the name of the language is not known.
     */
    languageName?: string;

    /**
     * Gets the name of the language in English.
     * Null or undefined if the language doesn't have an english name.
     */
    languageEnglishName?: string;
}
```

### Example

```json:no-line-numbers title="/api/available_commentaries.json"
{
    "commentaries": [
        {
            "id": "adam-clarke",
            "name": "Adam Clarke Bible Commentary",
            "website": "https://en.wikipedia.org/wiki/Adam_Clarke",
            "licenseUrl": "https://creativecommons.org/publicdomain/mark/1.0/",
            "englishName": "Adam Clarke Bible Commentary",
            "language": "eng",
            "textDirection": "rtl",
            "availableFormats": [
                "json"
            ],
            "listOfBooksApiLink": "/api/c/adam-clarke/books.json",
            "numberOfBooks": 57,
            "totalNumberOfChapters": 854,
            "totalNumberOfVerses": 13318,
            "languageName": "English",
            "languageEnglishName": "English"
        }
    ]
}
```

## List Books in a Commentary

`GET https://bible.helloao.org/api/c/{commentary}/books.json`

Gets the list of books that are available for the given commentary.

-   `commentary` the ID of the commentary (e.g. `adam-clarke`).

### Code Example

```ts:no-line-numbers title="fetch-commentary-books.js"
const commentary = 'adam-clarke';

// Get the list of books for the adam-clarke commentary
fetch(`https://bible.helloao.org/api/c/${commentary}/books.json`)
    .then(request => request.json())
    .then(books => {
        console.log('The adam-clarke commentary has the following books:', books);
    });
```

### Structure

```typescript:no-line-numbers title="commentary-books.ts"
export interface CommentaryBooks {
    /**
     * The commentary information for the books.
     */
    commentary: Commentary;

    /**
     * The list of books that are available for the commentary.
     */
    books: CommentaryBook[];
}

interface CommentaryBook {
    /**
     * The ID of the book.
     * Matches the ID of the corresponding book in the Bible (GEN, EXO, etc.).
     */
    id: string;

    /**
     * The name that the commentary provided for the book.
     */
    name: string;

    /**
     * The common name for the book.
     */
    commonName: string;

    /**
     * The commentary's introduction for the book.
     * Omitted if the commentary doesn't have an introduction for the book.
     */
    introduction?: string;

    /**
     * The order of the book in the Bible.
     */
    order: number;

    /**
     * The link to the first chapter of the book.
     */
    firstChapterApiLink: string;

    /**
     * The link to the last chapter of the book.
     */
    lastChapterApiLink: string;

    /**
     * The number of chapters that the book contains.
     */
    numberOfChapters: number;

    /**
     * The number of verses that the book contains.
     */
    totalNumberOfVerses: number;
}
```

### Example

```json:no-line-numbers title="/api/c/adam-clarke/books.json"
{
    "commentary": {
        "id": "adam-clarke",
        "name": "Adam Clarke Bible Commentary",
        "website": "https://en.wikipedia.org/wiki/Adam_Clarke",
        "licenseUrl": "https://creativecommons.org/publicdomain/mark/1.0/",
        "englishName": "Adam Clarke Bible Commentary",
        "language": "eng",
        "textDirection": "rtl",
        "availableFormats": [
            "json"
        ],
        "listOfBooksApiLink": "/api/c/adam-clarke/books.json",
        "numberOfBooks": 57,
        "totalNumberOfChapters": 854,
        "totalNumberOfVerses": 13318,
        "languageName": "English",
        "languageEnglishName": "English"
    },
    "books": [
        {
            "id": "GEN",
            "commentaryId": "adam-clarke",
            "name": "Genesis",
            "commonName": "Genesis",
            "introduction": "Preface to the Book of Genesis, Every believer in Divine revelation finds himself amply justified in taking for granted that the Pentateuch is the work of Moses. For more than 3000 years this has been the invariable opinion of those who were best qualified to form a correct judgment on this subject. The Jewish Church, from its most remote antiquity, has ascribed the work to no other hand; and the Christian Church, from its foundation, has attributed it to the Jewish lawgiver alone. The most respectable heathens have concurred in this testimony, and Jesus Christ and his apostles have completed the evidence, and have put the question beyond the possibility of being doubted by those who profess to believe the Divine authenticity of the New Testament. As to those who, in opposition to all these proofs, obstinately persist in their unbelief, they are worthy of little regard, as argument is lost on their unprincipled prejudices, and demonstration on their minds, because ever willfully closed against the light. When they have proved that Moses is not the author of this work, the advocates of Divine revelation will reconsider the grounds of their faith. That there are a few things in the Pentateuch which seem to have been added by a later hand there can be little doubt; among these some have reckoned, perhaps without reason, the following passage, Gen 12:6 : \"And the Canaanite was then in the land\"; but see the note on Gen 12:6. Num 21:14, \"In the book of the wars of the Lord,\" was probably a marginal note, which in process of time got into the text; see the note on Num 21:14. To these may be added DeuteronomyDeu 1:1-5; Deu 2:12; and the eight concluding verses of the last chapter, in which we have an account of the death of Moses. These last words could not have been added by Moses himself, but are very probably the work of Ezra, by whom, according to uninterrupted tradition among the Jews, the various books which constitute the canon of the Old Testament were collected and arranged, and such expository notes added as were essential to connect the different parts; but as he acted under Divine inspiration, the additions may be considered of equal authority with the text. A few other places might be added, but they are of little importance, and are mentioned in the notes. The book of Genesis, Γενεσις, has its name from the title it bears in the Septuagint, βιβλος Γενεσεως, (Gen 2:4), which signifies the book of the Generation; but it is called in Hebrew בראשית Bereshith, \"In the beginning,\" from its initial word. It is the most ancient history in the world; and, from the great variety of its singular details and most interesting accounts, is as far superior in its value and importance to all others, as it is in its antiquity. This book contains an account of the creation of the world, and its first inhabitants; the original innocence and fall of man; the rise of religion; the invention of arts; the general corruption and degeneracy of mankind; the universal deluge; the repeopling and division of the earth; the origin of nations and kingdoms; and a particular history of the patriarchs from Adam down to the death of Joseph; including a space, at the lowest computation, of 2369 years. It may be asked how a detail so circumstantial and minute could have been preserved when there was no writing of any kind, and when the earth, whose history is here given, had already existed more than 2000 years. To this inquiry a very satisfactory answer may be given. There are only three ways in which these important records could have been preserved and brought down to the time of Moses: viz., writing, tradition, and Divine revelation. In the antediluvian world, when the life of man was so protracted, there was comparatively little need for writing of any kind, and perhaps no alphabetical writing then existed. Tradition answered every purpose to which writing in any kind of characters could be subservient; and the necessity of erecting monuments to perpetuate public events could scarcely have suggested itself, as during those times there could be little danger apprehended of any important fact becoming obsolete, as its history had to pass through very few hands, and all these friends and relatives in the most proper sense of the terms; for they lived in an insulated state under a patriarchal government. Thus it was easy for Moses to be satisfied of the truth of all he relates in the book of Genesis, as the accounts came to him through the medium of very few persons. From Adam to Noah there was but one man necessary to the correct transmission of the history of this period of 1656 years. Now this history was, without doubt, perfectly known to Methuselah, who lived to see them both. In like manner Shem connected Noah and Abraham, having lived to converse with both; as Isaac did with Abraham and Joseph, from whom these things might be easily conveyed to Moses by Amram, who was contemporary with Joseph. Supposing, then, all the curious facts recorded in the book of Genesis had no other authority than the tradition already referred to, they would stand upon a foundation of credibility superior to any that the most reputable of the ancient Greek and Latin historians can boast. Yet to preclude all possibility of mistake, the unerring Spirit of God directed Moses in the selection of his facts and the ascertaining of his dates. Indeed, the narrative is so simple, so much like truth, so consistent everywhere with itself, so correct in its dates, so impartial in its biography, so accurate in its philosophical details, so pure in its morality, and so benevolent in its design, as amply to demonstrate that it never could have had an earthly origin. In this case, also, Moses constructed every thing according to the pattern which God showed him in the mount.",
            "order": 1,
            "numberOfChapters": 50,
            "firstChapterApiLink": "/api/c/adam-clarke/GEN/1.json",
            "lastChapterApiLink": "/api/c/adam-clarke/GEN/50.json",
            "totalNumberOfVerses": 877
        }
    ]
}
```

## Get a Chapter from a Commentary

`GET https://bible.helloao.org/api/c/{commentary}/{book}/{chapter}.json`

Gets the content of a single chapter for a given book and commentary.

-   `commentary` the ID of the commentary (e.g. `adam-clarke`).
-   `book` is the ID of the book (e.g. `GEN` for Genesis).
-   `chapter` is the numerical chapter number (e.g. `1` for the first chapter).

### Code Example

```ts:no-line-numbers title="fetch-commentary-chapter.js"
const commentary = 'adam-clarke';
const book = 'GEN';
const chapter = 1;

// Get Genesis 1 from the adam-clarke commentary
fetch(`https://bible.helloao.org/api/c/${commentary}/${book}/${chapter}.json`)
    .then(request => request.json())
    .then(chapter => {
        console.log('Genesis 1 (adam-clarke):', chapter);
    });
```

### Structure

```typescript:no-line-numbers title="commentary-chapter.ts"
export interface CommentaryBookChapter {
    /**
     * The commentary information for the book chapter.
     */
    commentary: Commentary;

    /**
     * The book information for the book chapter.
     */
    book: CommentaryBook;

    /**
     * The link to this chapter.
     */
    thisChapterLink: string;

    /**
     * The link to the next chapter.
     * Null if this is the last chapter in the commentary.
     */
    nextChapterApiLink: string | null;

    /**
     * The link to the previous chapter.
     * Null if this is the first chapter in the commentary.
     */
    previousChapterApiLink: string | null;

    /**
     * The number of verses that the chapter contains.
     */
    numberOfVerses: number;

    /**
     * The information for the chapter.
     */
    chapter: CommentaryChapterData;
}

interface CommentaryChapterData {
    /**
     * The number of the chapter.
     */
    number: number;

    /**
     * The introduction that the commentary provided to the chapter.
     * Not all commentaries provide an introduction to a chapter.
     */
    introduction?: string;

    /**
     * The content of the chapter.
     * This is the same type from the "Get a Chapter from a Translation" endpoint.
     */
    content: ChapterVerse[];
}
```

### Example

```json:no-line-numbers title="/api/c/adam-clarke/GEN/1.json"
{
    "commentary": {
        "id": "adam-clarke",
        "name": "Adam Clarke Bible Commentary",
        "website": "https://en.wikipedia.org/wiki/Adam_Clarke",
        "licenseUrl": "https://creativecommons.org/publicdomain/mark/1.0/",
        "englishName": "Adam Clarke Bible Commentary",
        "language": "eng",
        "textDirection": "rtl",
        "availableFormats": [
            "json"
        ],
        "listOfBooksApiLink": "/api/c/adam-clarke/books.json",
        "numberOfBooks": 57,
        "totalNumberOfChapters": 854,
        "totalNumberOfVerses": 13318,
        "languageName": "English",
        "languageEnglishName": "English"
    },
    "book": {
        "id": "GEN",
        "commentaryId": "adam-clarke",
        "name": "Genesis",
        "commonName": "Genesis",
        "introduction": "Preface to the Book of Genesis, Every believer in Divine revelation finds himself amply justified in taking for granted that the Pentateuch is the work of Moses. For more than 3000 years this has been the invariable opinion of those who were best qualified to form a correct judgment on this subject. The Jewish Church, from its most remote antiquity, has ascribed the work to no other hand; and the Christian Church, from its foundation, has attributed it to the Jewish lawgiver alone. The most respectable heathens have concurred in this testimony, and Jesus Christ and his apostles have completed the evidence, and have put the question beyond the possibility of being doubted by those who profess to believe the Divine authenticity of the New Testament. As to those who, in opposition to all these proofs, obstinately persist in their unbelief, they are worthy of little regard, as argument is lost on their unprincipled prejudices, and demonstration on their minds, because ever willfully closed against the light. When they have proved that Moses is not the author of this work, the advocates of Divine revelation will reconsider the grounds of their faith. That there are a few things in the Pentateuch which seem to have been added by a later hand there can be little doubt; among these some have reckoned, perhaps without reason, the following passage, Gen 12:6 : \"And the Canaanite was then in the land\"; but see the note on Gen 12:6. Num 21:14, \"In the book of the wars of the Lord,\" was probably a marginal note, which in process of time got into the text; see the note on Num 21:14. To these may be added DeuteronomyDeu 1:1-5; Deu 2:12; and the eight concluding verses of the last chapter, in which we have an account of the death of Moses. These last words could not have been added by Moses himself, but are very probably the work of Ezra, by whom, according to uninterrupted tradition among the Jews, the various books which constitute the canon of the Old Testament were collected and arranged, and such expository notes added as were essential to connect the different parts; but as he acted under Divine inspiration, the additions may be considered of equal authority with the text. A few other places might be added, but they are of little importance, and are mentioned in the notes. The book of Genesis, Γενεσις, has its name from the title it bears in the Septuagint, βιβλος Γενεσεως, (Gen 2:4), which signifies the book of the Generation; but it is called in Hebrew בראשית Bereshith, \"In the beginning,\" from its initial word. It is the most ancient history in the world; and, from the great variety of its singular details and most interesting accounts, is as far superior in its value and importance to all others, as it is in its antiquity. This book contains an account of the creation of the world, and its first inhabitants; the original innocence and fall of man; the rise of religion; the invention of arts; the general corruption and degeneracy of mankind; the universal deluge; the repeopling and division of the earth; the origin of nations and kingdoms; and a particular history of the patriarchs from Adam down to the death of Joseph; including a space, at the lowest computation, of 2369 years. It may be asked how a detail so circumstantial and minute could have been preserved when there was no writing of any kind, and when the earth, whose history is here given, had already existed more than 2000 years. To this inquiry a very satisfactory answer may be given. There are only three ways in which these important records could have been preserved and brought down to the time of Moses: viz., writing, tradition, and Divine revelation. In the antediluvian world, when the life of man was so protracted, there was comparatively little need for writing of any kind, and perhaps no alphabetical writing then existed. Tradition answered every purpose to which writing in any kind of characters could be subservient; and the necessity of erecting monuments to perpetuate public events could scarcely have suggested itself, as during those times there could be little danger apprehended of any important fact becoming obsolete, as its history had to pass through very few hands, and all these friends and relatives in the most proper sense of the terms; for they lived in an insulated state under a patriarchal government. Thus it was easy for Moses to be satisfied of the truth of all he relates in the book of Genesis, as the accounts came to him through the medium of very few persons. From Adam to Noah there was but one man necessary to the correct transmission of the history of this period of 1656 years. Now this history was, without doubt, perfectly known to Methuselah, who lived to see them both. In like manner Shem connected Noah and Abraham, having lived to converse with both; as Isaac did with Abraham and Joseph, from whom these things might be easily conveyed to Moses by Amram, who was contemporary with Joseph. Supposing, then, all the curious facts recorded in the book of Genesis had no other authority than the tradition already referred to, they would stand upon a foundation of credibility superior to any that the most reputable of the ancient Greek and Latin historians can boast. Yet to preclude all possibility of mistake, the unerring Spirit of God directed Moses in the selection of his facts and the ascertaining of his dates. Indeed, the narrative is so simple, so much like truth, so consistent everywhere with itself, so correct in its dates, so impartial in its biography, so accurate in its philosophical details, so pure in its morality, and so benevolent in its design, as amply to demonstrate that it never could have had an earthly origin. In this case, also, Moses constructed every thing according to the pattern which God showed him in the mount.",
        "order": 1,
        "numberOfChapters": 50,
        "firstChapterApiLink": "/api/c/adam-clarke/GEN/1.json",
        "lastChapterApiLink": "/api/c/adam-clarke/GEN/50.json",
        "totalNumberOfVerses": 877
    },
    "chapter": {
        "number": 1,
        "content": [
            {
                "type": "verse",
                "number": 1,
                "content": [
                    "God in the beginning created the heavens and the earth - בראשית ברא אלהים את השמים ואת הארץ Bereshith bara Elohim eth hashshamayim veeth haarets; God in the beginning created the heavens and the earth.\nMany attempts have been made to define the term God: as to the word itself, it is pure Anglo-Saxon, and among our ancestors signified, not only the Divine Being, now commonly designated by the word, but also good; as in their apprehensions it appeared that God and good were correlative terms; and when they thought or spoke of him, they were doubtless led from the word itself to consider him as The Good Being, a fountain of infinite benevolence and beneficence towards his creatures.\nA general definition of this great First Cause, as far as human words dare attempt one, may be thus given: The eternal, independent, and self-existent Being: the Being whose purposes and actions spring from himself, without foreign motive or influence: he who is absolute in dominion; the most pure, the most simple, and most spiritual of all essences; infinitely benevolent, beneficent, true, and holy: the cause of all being, the upholder of all things; infinitely happy, because infinitely perfect; and eternally self-sufficient, needing nothing that he has made: illimitable in his immensity, inconceivable in his mode of existence, and indescribable in his essence; known fully only to himself, because an infinite mind can be fully apprehended only by itself. In a word, a Being who, from his infinite wisdom, cannot err or be deceived; and who, from his infinite goodness, can do nothing but what is eternally just, right, and kind. Reader, such is the God of the Bible; but how widely different from the God of most human creeds and apprehensions!\nThe original word אלהים Elohim, God, is certainly the plural form of אל El, or אלה Eloah, and has long been supposed, by the most eminently learned and pious men, to imply a plurality of Persons in the Divine nature. As this plurality appears in so many parts of the sacred writings to be confined to three Persons, hence the doctrine of the Trinity, which has formed a part of the creed of all those who have been deemed sound in the faith, from the earliest ages of Christianity. Nor are the Christians singular in receiving this doctrine, and in deriving it from the first words of Divine revelation. An eminent Jewish rabbi, Simeon ben Joachi, in his comment on the sixth section of Leviticus, has these remarkable words: \"Come and see the mystery of the word Elohim; there are three degrees, and each degree by itself alone, and yet notwithstanding they are all one, and joined together in one, and are not divided from each other.\" See Ainsworth. He must be strangely prejudiced indeed who cannot see that the doctrine of a Trinity, and of a Trinity in unity, is expressed in the above words. The verb ברא bara, he created, being joined in the singular number with this plural noun, has been considered as pointing out, and not obscurely, the unity of the Divine Persons in this work of creation. In the ever-blessed Trinity, from the infinite and indivisible unity of the persons, there can be but one will, one purpose, and one infinite and uncontrollable energy.\n\"Let those who have any doubt whether אלהים Elohim, when meaning the true God, Jehovah, be plural or not, consult the following passages, where they will find it joined with adjectives, verbs, and pronouns plural.\n\"Gen 1:26 Gen 3:22 Gen 11:7 Gen 20:13 Gen 31:7, Gen 31:53 Gen 35:7. \"Deu 4:7 Deu 5:23; Jos 24:19 Sa1 4:8; Sa2 7:23; \"Psa 58:6; Isa 6:8; Jer 10:10, Jer 23:36. \"See also Pro 9:10, Pro 30:3; Psa 149:2; Ecc 5:7, Ecc 12:1; Job 5:1; Isa 6:3, Isa 54:5, Isa 62:5; Hos 11:12, or Hos 12:1; Mal 1:6; Dan 5:18, Dan 5:20, and Dan 7:18, Dan 7:22.\" - Parkhurst.\nAs the word Elohim is the term by which the Divine Being is most generally expressed in the Old Testament, it may be necessary to consider it here more at large. It is a maxim that admits of no controversy, that every noun in the Hebrew language is derived from a verb, which is usually termed the radix or root, from which, not only the noun, but all the different flections of the verb, spring. This radix is the third person singular of the preterite or past tense. The ideal meaning of this root expresses some essential property of the thing which it designates, or of which it is an appellative. The root in Hebrew, and in its sister language, the Arabic, generally consists of three letters, and every word must be traced to its root in order to ascertain its genuine meaning, for there alone is this meaning to be found. In Hebrew and Arabic this is essentially necessary, and no man can safely criticise on any word in either of these languages who does not carefully attend to this point.\nI mention the Arabic with the Hebrew for two reasons.\n1. Because the two languages evidently spring from the same source, and have very nearly the same mode of construction.\n2. Because the deficient roots in the Hebrew Bible are to be sought for in the Arabic language. The reason of this must be obvious, when it is considered that the whole of the Hebrew language is lost except what is in the Bible, and even a part of this book is written in Chaldee.\nNow, as the English Bible does not contain the whole of the English language, so the Hebrew Bible does not contain the whole of the Hebrew. If a man meet with an English word which he cannot find in an ample concordance or dictionary to the Bible, he must of course seek for that word in a general English dictionary. In like manner, if a particular form of a Hebrew word occur that cannot be traced to a root in the Hebrew Bible, because the word does not occur in the third person singular of the past tense in the Bible, it is expedient, it is perfectly lawful, and often indispensably necessary, to seek the deficient root in the Arabic. For as the Arabic is still a living language, and perhaps the most copious in the universe, it may well be expected to furnish those terms which are deficient in the Hebrew Bible. And the reasonableness of this is founded on another maxim, viz., that either the Arabic was derived from the Hebrew, or the Hebrew from the Arabic. I shall not enter into this controversy; there are great names on both sides, and the decision of the question in either way will have the same effect on my argument. For if the Arabic were derived from the Hebrew, it must have been when the Hebrew was a living and complete language, because such is the Arabic now; and therefore all its essential roots we may reasonably expect to find there: but if, as Sir William Jones supposed, the Hebrew were derived from the Arabic, the same expectation is justified, the deficient roots in Hebrew may be sought for in the mother tongue. If, for example, we meet with a term in our ancient English language the meaning of which we find difficult to ascertain, common sense teaches us that we should seek for it in the Anglo-Saxon, from which our language springs; and, if necessary, go up to the Teutonic, from which the Anglo-Saxon was derived. No person disputes the legitimacy of this measure, and we find it in constant practice. I make these observations at the very threshold of my work, because the necessity of acting on this principle (seeking deficient Hebrew roots in the Arabic) may often occur, and I wish to speak once for all on the subject.\nThe first sentence in the Scripture shows the propriety of having recourse to this principle. We have seen that the word אלהים Elohim is plural; we have traced our term God to its source, and have seen its signification; and also a general definition of the thing or being included under this term, has been tremblingly attempted. We should now trace the original to its root, but this root does not appear in the Hebrew Bible. Were the Hebrew a complete language, a pious reason might be given for this omission, viz., \"As God is without beginning and without cause, as his being is infinite and underived, the Hebrew language consults strict propriety in giving no root whence his name can be deduced.\" Mr. Parkhurst, to whose pious and learned labors in Hebrew literature most Biblical students are indebted, thinks he has found the root in אלה alah, he swore, bound himself by oath; and hence he calls the ever-blessed Trinity אלהים Elohim, as being bound by a conditional oath to redeem man, etc., etc. Most pious minds will revolt from such a definition, and will be glad with me to find both the noun and the root preserved in Arabic. Allah is the common name for God in the Arabic tongue, and often the emphatic is used. Now both these words are derived from the root alaha, he worshipped, adored, was struck with astonishment, fear, or terror; and hence, he adored with sacred horror and veneration, cum sacro horrore ac veneratione coluit, adoravit - Wilmet. Hence ilahon, fear, veneration, and also the object of religious fear, the Deity, the supreme God, the tremendous Being. This is not a new idea; God was considered in the same light among the ancient Hebrews; and hence Jacob swears by the fear of his father Isaac, Gen 31:53. To complete the definition, Golius renders alaha, juvit, liberavit, et tutatus fuit, \"he succoured, liberated, kept in safety, or defended.\" Thus from the ideal meaning of this most expressive root, we acquire the most correct notion of the Divine nature; for we learn that God is the sole object of adoration; that the perfections of his nature are such as must astonish all those who piously contemplate them, and fill with horror all who would dare to give his glory to another, or break his commandments; that consequently he should be worshipped with reverence and religious fear; and that every sincere worshipper may expect from him help in all his weaknesses, trials, difficulties, temptations, etc.,; freedom from the power, guilt, nature, and consequences of sin; and to be supported, defended, and saved to the uttermost, and to the end.\nHere then is one proof, among multitudes which shall be adduced in the course of this work, of the importance, utility, and necessity of tracing up these sacred words to their sources; and a proof also, that subjects which are supposed to be out of the reach of the common people may, with a little difficulty, be brought on a level with the most ordinary capacity.\nIn the beginning - Before the creative acts mentioned in this chapter all was Eternity. Time signifies duration measured by the revolutions of the heavenly bodies: but prior to the creation of these bodies there could be no measurement of duration, and consequently no time; therefore in the beginning must necessarily mean the commencement of time which followed, or rather was produced by, God's creative acts, as an effect follows or is produced by a cause.\nCreated - Caused existence where previously to this moment there was no being. The rabbins, who are legitimate judges in a case of verbal criticism on their own language, are unanimous in asserting that the word ברא bara expresses the commencement of the existence of a thing, or egression from nonentity to entity. It does not in its primary meaning denote the preserving or new forming things that had previously existed, as some imagine, but creation in the proper sense of the term, though it has some other acceptations in other places. The supposition that God formed all things out of a pre-existing, eternal nature, is certainly absurd, for if there had been an eternal nature besides an eternal God, there must have been two self-existing, independent, and eternal beings, which is a most palpable contradiction.\nאת השמים eth hashshamayim. The word את eth, which is generally considered as a particle, simply denoting that the word following is in the accusative or oblique case, is often understood by the rabbins in a much more extensive sense. \"The particle את,\" says Aben Ezra, \"signifies the substance of the thing.\" The like definition is given by Kimchi in his Book of Roots. \"This particle,\" says Mr. Ainsworth, \"having the first and last letters of the Hebrew alphabet in it, is supposed to comprise the sum and substance of all things.\" \"The particle את eth (says Buxtorf, Talmudic Lexicon, sub voce) with the cabalists is often mystically put for the beginning and the end, as α alpha and ω omega are in the Apocalypse.\" On this ground these words should be translated, \"God in the beginning created the substance of the heavens and the substance of the earth,\" i.e. the prima materia, or first elements, out of which the heavens and the earth were successively formed. The Syriac translator understood the word in this sense, and to express this meaning has used the word yoth, which has this signification, and is very properly translated in Walton's Polyglot, Esse, caeli et Esse terrae, \"the being or substance of the heaven, and the being or substance of the earth.\" St. Ephraim Syrus, in his comment on this place, uses the same Syriac word, and appears to understand it precisely in the same way. Though the Hebrew words are certainly no more than the notation of a case in most places, yet understood here in the sense above, they argue a wonderful philosophic accuracy in the statement of Moses, which brings before us, not a finished heaven and earth, as every other translation appears to do, though afterwards the process of their formation is given in detail, but merely the materials out of which God built the whole system in the six following days.\nThe heaven and the earth - As the word שמים shamayim is plural, we may rest assured that it means more than the atmosphere, to express which some have endeavored to restrict its meaning. Nor does it appear that the atmosphere is particularly intended here, as this is spoken of, Gen 1:6, under the term firmament. The word heavens must therefore comprehend the whole solar system, as it is very likely the whole of this was created in these six days; for unless the earth had been the center of a system, the reverse of which is sufficiently demonstrated, it would be unphilosophic to suppose it was created independently of the other parts of the system, as on this supposition we must have recourse to the almighty power of God to suspend the influence of the earth's gravitating power till the fourth day, when the sun was placed in the center, round which the earth began then to revolve. But as the design of the inspired penman was to relate what especially belonged to our world and its inhabitants, therefore he passes by the rest of the planetary system, leaving it simply included in the plural word heavens. In the word earth every thing relative to the terraqueaerial globe is included, that is, all that belongs to the solid and fluid parts of our world with its surrounding atmosphere. As therefore I suppose the whole solar system was created at this time, I think it perfectly in place to give here a general view of all the planets, with every thing curious and important hitherto known relative to their revolutions and principal affections.\nObservations On The Preceding Tables\n(Editor's Note: These tables were omitted due to outdated information)\nIn Table I. the quantity or the periodic and sidereal revolutions of the planets is expressed in common years, each containing 365 days; as, e.g., the tropical revolution of Jupiter is, by the table, 11 years, 315 days, 14 hours, 39 minutes, 2 seconds; i.e., the exact number of days is equal to 11 years multiplied by 365, and the extra 315 days added to the product, which make In all 4330 days. The sidereal and periodic times are also set down to the nearest second of time, from numbers used in the construction of the tables in the third edition of M. de la Lande's Astronomy. The columns containing the mean distance of the planets from the sun in English miles, and their greatest and least distance from the earth, are such as result from the best observations of the two last transits of Venus, which gave the solar parallax to be equal to 8 three-fifth seconds of a degree; and consequently the earth's diameter, as seen from the sun, must be the double of 8 three-fifth seconds, or 17 one-fifth seconds. From this last quantity, compared with the apparent diameters of the planets, as seen at a distance equal to that of the earth at her main distance from the sun, the diameters of the planets in English miles, as contained in the seventh column, have been carefully computed. In the column entitled \"Proportion of bulk, the earth being 1,\" the whole numbers express the number of times the other planet contains more cubic miles, etc., than the earth; and if the number of cubic miles in the earth be given, the number of cubic miles in any planet may be readily found by multiplying the cubic miles contained in the earth by the number in the column, and the product will be the quantity required.\nThis is a small but accurate sketch of the vast solar system; to describe it fully, even in all its known revolutions and connections, in all its astonishing energy and influence, in its wonderful plan, structure, operations, and results, would require more volumes than can be devoted to the commentary itself.\nAs so little can be said here on a subject so vast, it may appear to some improper to introduce it at all; but to any observation of this kind I must be permitted to reply, that I should deem it unpardonable not to give a general view of the solar system in the very place where its creation is first introduced. If these works be stupendous and magnificent, what must He be who formed, guides, and supports them all by the word of his power! Reader, stand in awe of this God, and sin not. Make him thy friend through the Son of his love; and, when these heavens and this earth are no more, thy soul shall exist in consummate and unutterable felicity.\nSee the remarks on the sun, moon, and stars, after Gen 1:16. See Clarke's note on Gen 1:16."
                ]
            }
        ]
    }
}
```

## List Profiles in a Commentary

`GET https://bible.helloao.org/api/c/{commentary}/profiles.json`

Gets the list of profiles that are available for the given commentary.

Profiles are overviews of people or people groups.

Currently, only `tyndale` has any profiles.

-   `commentary` the ID of the commentary (e.g. `tyndale`).

### Code Example

```ts:no-line-numbers title="fetch-commentary-profiles.js"
const commentary = 'tyndale';

// Get the list of profiles for the tyndale commentary
fetch(`https://bible.helloao.org/api/c/${commentary}/profiles.json`)
    .then(request => request.json())
    .then(profiles => {
        console.log('The tyndale commentary has the following profiles:', profiles);
    });
```

### Structure

```typescript:no-line-numbers title="commentary-profiles.ts"
export interface CommentaryProfiles {
    /**
     * The commentary information for the books.
     */
    commentary: Commentary;

    /**
     * The list of profiles that are available for the commentary.
     */
    profiles: CommentaryProfile[];
}

interface VerseRef {
    /**
     * The ID of the book that is being referenced.
     */
    book: string;

    /**
     * The chapter being referenced.
     */
    chapter: number;

    /**
     * The verse being referenced.
     */
    verse: number;

    /**
     * The chapter that the reference ends at.
     * If omitted, then reference does not span multiple chapters.
     */
    endChapter?: number;

    /**
     * The verse that the reference ends at.
     * If omitted, then the reference does not span multiple verses.
     */
    endVerse?: number;
}

interface CommentaryProfile {
    /**
     * The ID of the profile.
     */
    id: string;

    /**
     * The subject of the profile.
     */
    subject: string;

    /**
     * The Bible reference that the profile is associated with.
     */
    reference: VerseRef | null;

    /**
     * The link to this profile.
     */
    thisProfileLink: string;

    /**
     * The link to the chapter that this profile references in the commentary.
     */
    referenceChapterLink: string | null;
}
```

### Example

```json:no-line-numbers title="/api/c/tyndale/profiles.json"
{
    "commentary": {
        "id": "tyndale",
        "name": "Tyndale Open Study Notes",
        "website": "https://tyndaleopenresources.com/",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "licenseNotes": "Changes were made to the content to change the format to JSON to make it compatible with the Free Use Bible API. No changes were made to the content contained in the XML formatting.",
        "englishName": "Tyndale Open Study Notes",
        "language": "eng",
        "textDirection": "rtl",
        "sha256": "62fa003ca326f8ab22a04accb2a49d2b5865ce2cecd74284228e1be08edd5e10",
        "availableFormats": [
            "json"
        ],
        "listOfBooksApiLink": "/api/c/tyndale/books.json",
        "listOfProfilesApiLink": "/api/c/tyndale/profiles.json",
        "numberOfBooks": 69,
        "totalNumberOfChapters": 1243,
        "totalNumberOfVerses": 15757,
        "totalNumberOfProfiles": 125,
        "languageName": "English",
        "languageEnglishName": "English"
    },
    "profiles": [
        {
            "id": "aaron",
            "reference": {
                "book": "EXO",
                "chapter": 4,
                "verse": 14,
                "endVerse": 16
            },
            "subject": "Aaron",
            "thisProfileLink": "/api/c/tyndale/profiles/aaron.json",
            "referenceChapterLink": "/api/c/tyndale/EXO/4.json"
        },
        {
            "id": "abiathar",
            "reference": {
                "book": "1SA",
                "chapter": 22,
                "verse": 20,
                "endVerse": 23
            },
            "subject": "Abiathar",
            "thisProfileLink": "/api/c/tyndale/profiles/abiathar.json",
            "referenceChapterLink": "/api/c/tyndale/1SA/22.json"
        },
    ]
}
```

## Get a Profile in a Commentary

`GET https://bible.helloao.org/api/c/{commentary}/profiles/{profile}.json`

Gets a profile from a commentary.

-   `commentary` the ID of the commentary (e.g. `tyndale`).
-   `profile` the ID of the profile (e.g. `aaron`).

### Code Example

```ts:no-line-numbers title="fetch-commentary-profile.js"
const commentary = 'tyndale';
const profile = 'aaron';

// Get the aaron profile from the tyndale commentary
fetch(`https://bible.helloao.org/api/c/${commentary}/profiles/${profile}.json`)
    .then(request => request.json())
    .then(profile => {
        console.log('The Aaron tyndale commentary profile:', profile);
    });
```

### Structure

```typescript:no-line-numbers title="commentary-profile-content.ts"
export interface CommentaryProfileContent {
    /**
     * The commentary information for the profile.
     */
    commentary: Commentary;

    /**
     * The information about the profile.
     */
    profile: CommentaryProfile;

    /**
     * The content of the profile.
     */
    content: string[];
}
```

### Example

```json:no-line-numbers title="/api/c/tyndale/profiles/aaron.json"
{
    "commentary": {
        "id": "tyndale",
        "name": "Tyndale Open Study Notes",
        "website": "https://tyndaleopenresources.com/",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "licenseNotes": "Changes were made to the content to change the format to JSON to make it compatible with the Free Use Bible API. No changes were made to the content contained in the XML formatting.",
        "englishName": "Tyndale Open Study Notes",
        "language": "eng",
        "textDirection": "rtl",
        "sha256": "62fa003ca326f8ab22a04accb2a49d2b5865ce2cecd74284228e1be08edd5e10",
        "availableFormats": [
            "json"
        ],
        "listOfBooksApiLink": "/api/c/tyndale/books.json",
        "listOfProfilesApiLink": "/api/c/tyndale/profiles.json",
        "numberOfBooks": 69,
        "totalNumberOfChapters": 1243,
        "totalNumberOfVerses": 15757,
        "totalNumberOfProfiles": 125,
        "languageName": "English",
        "languageEnglishName": "English"
    },
    "profile": {
        "id": "aaron",
        "reference": {
            "book": "EXO",
            "chapter": 4,
            "verse": 14,
            "endVerse": 16
        },
        "subject": "Aaron",
        "thisProfileLink": "/api/c/tyndale/profiles/aaron.json",
        "referenceChapterLink": "/api/c/tyndale/EXO/4.json"
    },
    "content": [
        "Aaron\n\nMoses’ older brother, Aaron (see Exod 6:20; 7:7), played a crucial role in founding Israel and its institutions, particularly the priesthood. He first appears after Moses’ calling at the burning bush (Exod 3:1–4:17). Moses was reluctant to accept his divine commission, claiming that he was unfit to lead the Israelites out of Egypt because his words tended to “get tangled” (Exod 4:10). Despite God’s assurances, Moses continued to object until God appointed Aaron to be Moses’ mouthpiece. Thereafter, Aaron was often at Moses’ side, speaking to the Israelite leaders and demanding that Pharaoh let the Israelites leave Egypt (Exod 5:1-5).\n\nDuring the Israelites’ wilderness wanderings, God appointed Aaron and his sons to be set apart and dedicated as priests (Exod 28:1-5; 29:1-46; Lev 8:1-36). Thus, Aaron became Israel’s first high priest. Aaron’s role as high priest was especially prominent on the annual Day of Atonement, the only day when the high priest entered the Most Holy Place to purify it from the effects of Israel’s sins (Lev 16). Before the high priest could do so, however, he had to offer a sacrifice to atone for his own sins.\n\nAaron was an imperfect leader. While Moses was on Mount Sinai receiving the law from God, Aaron helped the people make an idol (Exod 32). When Moses returned, Aaron gave poor excuses and blamed the people. This event resulted in the death of three thousand Israelites, as well as a plague.\n\nAaron and his sister, Miriam, once wrongly challenged Moses’ authority, resulting in a temporary state of leprosy for Miriam (Num 12). Later, when other Levites challenged Aaron’s authority, God affirmed Aaron’s role by making his staff bud with almond blossoms (Num 17). However, because Moses and Aaron challenged God’s authority (Num 20:1-13), they both died in the wilderness without entering the Promised Land (Num 20:22-29).\n\nJesus has become the Great High Priest, far surpassing Aaron’s priestly authority and effectiveness (see Heb 7–10).\n\nPassages for Further Study\n\nExod 4:14-17, 27-31; 6:20-27; 7:1-2; 28:1-5; 32:1-25; Num 12:1-12; 20:1-13, 22-29; Acts 7:39-41"
    ]
}
```
