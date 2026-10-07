# Translations, Books, & Chapters

Endpoints for browsing translations, listing their books, and fetching chapter content.

Chapter content, complete-translation downloads, and word-level annotations are each available in two formats:

-   [**Standard format**](./standard.md) - the original, structured format. Verse content is a list of pieces (plain text, formatted text, footnote references, etc.) that you assemble yourself.
-   [**Simplified format**](./simplified.md) - a flattened format where the content of each verse is a single string, with footnotes, poetry, and other markup expressed as offsets into that string.

Use whichever format best fits how you plan to render or process the text.

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

    /**
     * The total number of apocryphal books that are contained in this translation.
     * Omitted if the translation does not include apocrypha.
     */
    numberOfApocryphalBooks?: number;

    /**
     * The total number of apocryphal chapters that are contained in this translation.
     * Omitted if the translation does not include apocrypha.
     */
    totalNumberOfApocryphalChapters?: number;

    /**
     * the total number of apocryphal verses that are contained in this translation.
     * Omitted if the translation does not include apocrypha.
     */
    totalNumberOfApocryphalVerses?: number;
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
     * The title of the book.
     * This is usually a more descriptive version of the book name.
     * If not available, then one was not provided by the translation.
     */
    title: string | null;

    /**
     * The numerical order of the book in the translation.
     */
    order: number;

    /**
     * The number of chapters that the book contains.
     */
    numberOfChapters: number;

    /**
     * The number of the first chapter in the book.
     */
    firstChapterNumber: number;

    /**
     * The link to the first chapter of the book.
     */
    firstChapterApiLink: string;

    /**
     * The number of the last chapter in the book.
     */
    lastChapterNumber: number;

    /**
     * The link to the last chapter of the book.
     */
    lastChapterApiLink: string;

    /**
     * The number of verses that the book contains.
     */
    totalNumberOfVerses: number;

    /**
     * Whether the book is an apocryphal book.
     * Omitted if the translation is canonical.
     */
    isApocryphal?: boolean;
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
            "firstChapterNumber": 1,
            "firstChapterApiLink": "/api/BSB/GEN/1.json",
            "lastChapterNumber": 50,
            "lastChapterApiLink": "/api/BSB/GEN/50.json",
            "totalNumberOfVerses": 1533
        },
    ]
}
```

