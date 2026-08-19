# Datasets

Endpoints for browsing supplementary Bible datasets - such as cross references - and fetching their books and chapter content.

## Available Datasets

`GET https://bible.helloao.org/api/available_datasets.json`

Gets the list of available Bible datasets in the API.

### Code Example

```ts:no-line-numbers title="fetch-datasets.js"
fetch(`https://bible.helloao.org/api/available_datasets.json`)
    .then(request => request.json())
    .then(availableDatasets => {
        console.log('The API has the following commentaries:', availableDatasets);
    });
```

### Structure

```typescript:no-line-numbers title="available-datasets.ts"
export interface AvailableDatasets {
    /**
     * The list of datasets.
     */
    datasets: Dataset[];
}

export interface Dataset {
    /**
     * The ID of the dataset.
     */
    id: string;

    /**
     * The name of the dataset.
     */
    name: string;

    /**
     * The website for the dataset.
     */
    website: string;

    /**
     * The URL that the license for the dataset can be found.
     */
    licenseUrl: string;

    /**
     * The english name for the dataset.
     */
    englishName: string;

    /**
     * The ISO 639 3-letter language tag that the dataset is primarily in.
     */
    language: string;

    /**
     * The direction that the language is written in.
     * "ltr" indicates that the text is written from the left side of the page to the right.
     * "rtl" indicates that the text is written from the right side of the page to the left.
     */
    textDirection: 'ltr' | 'rtl';

    /**
     * The API link for the list of available books for this dataset.
     */
    listOfBooksApiLink: string;

    /**
     * The available list of formats.
     */
    availableFormats: ('json' | 'usfm')[];

    /**
     * The number of books that are contained in this dataset.
     */
    numberOfBooks: number;

    /**
     * The total number of chapters that are contained in this dataset.
     */
    totalNumberOfChapters: number;

    /**
     * The total number of verses that are contained in this dataset.
     */
    totalNumberOfVerses: number;

    /**
     * The total number of cross references that are contained in this dataset.
     */
    totalNumberOfReferences: number;

    /**
     * Gets the name of the language that the dataset is in.
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

```json:no-line-numbers title="/api/available_datasets.json"
{
    "datasets": [
        {
            "id": "open-cross-ref",
            "name": "Bible Cross References",
            "website": "https://www.openbible.info/labs/cross-references/",
            "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
            "licenseNotes": "Changes were made to the data to fit the Free Use Bible API format.",
            "englishName": "Bible Cross References",
            "language": "eng",
            "textDirection": "ltr",
            "availableFormats": [
                "json"
            ],
            "listOfBooksApiLink": "/api/d/open-cross-ref/books.json",
            "numberOfBooks": 66,
            "totalNumberOfChapters": 1189,
            "totalNumberOfVerses": 29364,
            "totalNumberOfReferences": 344799,
            "languageName": "English",
            "languageEnglishName": "English"
        }
    ]
}
```


## List Books in a Dataset

`GET https://bible.helloao.org/api/d/{dataset}/books.json`

Gets the list of books that are available for the given dataset.

-   `dataset` the ID of the dataset (e.g. `open-cross-ref`).

### Code Example

```ts:no-line-numbers title="fetch-dataset-books.js"
const dataset = 'open-cross-ref';

// Get the list of books for the open-cross-ref dataset
fetch(`https://bible.helloao.org/api/c/${dataset}/books.json`)
    .then(request => request.json())
    .then(books => {
        console.log('The open-cross-ref dataset has the following books:', books);
    });
```

### Structure

```typescript:no-line-numbers title="dataset-books.ts"
export interface DatasetBooks {
    /**
     * The dataset information for the books.
     */
    dataset: Dataset;

    /**
     * The list of books that are available for the dataset.
     */
    books: DatasetBook[];
}

interface DatasetBook {
    /**
     * The ID of the book.
     * Matches the ID of the corresponding book in the Bible (GEN, EXO, etc.).
     */
    id: string;

    /**
     * The order of the book in the Bible.
     */
    order: number;

    /**
     * The number of the first chapter in the book.
     */
    firstChapterNumber: number;

    /**
     * The link to the first chapter of the book.
     */
    firstChapterApiLink: string | null;

    /**
     * The number of the last chapter in the book.
     */
    lastChapterNumber: number | null;

    /**
     * The link to the last chapter of the book.
     */
    lastChapterApiLink: string | null;

    /**
     * The number of chapters that the book contains.
     */
    numberOfChapters: number;

    /**
     * The number of verses that the book contains.
     */
    totalNumberOfVerses: number;

    /**
     * The total number of cross references that this book contains.
     */
    totalNumberOfReferences: number;
}
```

### Example

```json:no-line-numbers title="/api/d/open-cross-ref/books.json"
{
    "dataset": {
        "id": "open-cross-ref",
        "name": "Bible Cross References",
        "website": "https://www.openbible.info/labs/cross-references/",
        "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
        "licenseNotes": "Changes were made to the data to fit the Free Use Bible API format.",
        "englishName": "Bible Cross References",
        "language": "eng",
        "textDirection": "ltr",
        "availableFormats": [
            "json"
        ],
        "listOfBooksApiLink": "/api/d/open-cross-ref/books.json",
        "numberOfBooks": 66,
        "totalNumberOfChapters": 1189,
        "totalNumberOfVerses": 29364,
        "totalNumberOfReferences": 344799,
        "languageName": "English",
        "languageEnglishName": "English"
    },
    "books": [
        {
            "id": "GEN",
            "datasetId": "open-cross-ref",
            "order": 1,
            "numberOfChapters": 50,
            "firstChapterNumber": 1,
            "firstChapterApiLink": "/api/d/open-cross-ref/GEN/1.json",
            "lastChapterNumber": 50,
            "lastChapterApiLink": "/api/d/open-cross-ref/GEN/50.json",
            "totalNumberOfVerses": 1382,
            "totalNumberOfReferences": 13327
        },
        {
            "id": "EXO",
            "datasetId": "open-cross-ref",
            "order": 2,
            "numberOfChapters": 40,
            "firstChapterNumber": 1,
            "firstChapterApiLink": "/api/d/open-cross-ref/EXO/1.json",
            "lastChapterNumber": 40,
            "lastChapterApiLink": "/api/d/open-cross-ref/EXO/40.json",
            "totalNumberOfVerses": 1084,
            "totalNumberOfReferences": 9974
        },
    ]
}
```


## Get a Chapter from a Dataset

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

Gets the content of a single chapter for a given book and dataset.

-   `dataset` the ID of the dataset (e.g. `open-cross-ref`).
-   `book` is the ID of the book (e.g. `GEN` for Genesis).
-   `chapter` is the numerical chapter number (e.g. `1` for the first chapter).

### Code Example

```ts:no-line-numbers title="fetch-dataset-chapter.js"
const dataset = 'open-cross-ref';
const book = 'GEN';
const chapter = 1;

// Get Genesis 1 from the open-cross-ref dataset
fetch(`https://bible.helloao.org/api/d/${dataset}/${book}/${chapter}.json`)
    .then(request => request.json())
    .then(chapter => {
        console.log('Genesis 1 (open-cross-ref):', chapter);
    });
```

### Structure

```typescript:no-line-numbers title="dataset-chapter.ts"
export interface DatasetBookChapter {
    /**
     * The dataset information for the book chapter.
     */
    dataset: Dataset;

    /**
     * The book information for the book chapter.
     */
    book: DatasetBook;

    /**
     * The link to this chapter.
     */
    thisChapterLink: string;

    /**
     * The link to the next chapter.
     * Null if this is the last chapter in the dataset.
     */
    nextChapterApiLink: string | null;

    /**
     * The link to the previous chapter.
     * Null if this is the first chapter in the dataset.
     */
    previousChapterApiLink: string | null;

    /**
     * The number of verses that the chapter contains.
     */
    numberOfVerses: number;

    /**
     * The information for the chapter.
     */
    chapter: DatasetChapterData;
}

interface DatasetChapterData {
    /**
     * The number of the chapter.
     */
    number: number;

    /**
     * The content of the chapter.
     */
    content: DatasetVerse[];
}

interface DatasetVerse {
    /**
     * The number of the verse.
     */
    verse: number;

    /**
     * The cross-references for the verse.
     *
     * Sorted by score, descending.
     */
    references: DatasetReference[];
}

interface DatasetReference {
    /**
     * The ID of the book that is being referenced.
     */
    book: string;

    /**
     * The chapter number.
     */
    chapter: number;

    /**
     * The verse number.
     * If `endVerse` is present, then this is the verse that the reference starts at.
     */
    verse: number;

    /**
     * The verse that the reference ends at.
     */
    endVerse?: number;

    /**
     * The relevence score for the reference.
     */
    score?: number;
}
```

### Example

```json:no-line-numbers title="/api/d/open-cross-ref/REV/22.json"
{
    "dataset": {
        "id": "open-cross-ref",
        "name": "Bible Cross References",
        "website": "https://www.openbible.info/labs/cross-references/",
        "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
        "licenseNotes": "Changes were made to the data to fit the Free Use Bible API format.",
        "englishName": "Bible Cross References",
        "language": "eng",
        "textDirection": "ltr",
        "availableFormats": [
            "json"
        ],
        "listOfBooksApiLink": "/api/d/open-cross-ref/books.json",
        "numberOfBooks": 66,
        "totalNumberOfChapters": 1189,
        "totalNumberOfVerses": 29364,
        "totalNumberOfReferences": 344799,
        "languageName": "English",
        "languageEnglishName": "English"
    },
    "book": {
        "id": "REV",
        "datasetId": "open-cross-ref",
        "order": 66,
        "numberOfChapters": 22,
        "firstChapterNumber": 1,
        "firstChapterApiLink": "/api/d/open-cross-ref/REV/1.json",
        "lastChapterNumber": 22,
        "lastChapterApiLink": "/api/d/open-cross-ref/REV/22.json",
        "totalNumberOfVerses": 402,
        "totalNumberOfReferences": 6495
    },
    "chapter": {
        "number": 22,
        "content": [
            {
                "verse": 1,
                "references": [
                    {
                        "book": "REV",
                        "chapter": 7,
                        "verse": 17,
                        "score": 74
                    },
                    {
                        "book": "JHN",
                        "chapter": 4,
                        "verse": 14,
                        "score": 62
                    },
                    {
                        "book": "PSA",
                        "chapter": 36,
                        "verse": 8,
                        "endVerse": 9,
                        "score": 59
                    },
                    {
                        "book": "JHN",
                        "chapter": 7,
                        "verse": 38,
                        "endVerse": 39,
                        "score": 59
                    },
                    {
                        "book": "JHN",
                        "chapter": 4,
                        "verse": 10,
                        "endVerse": 11,
                        "score": 55
                    },
                ]
            }
        ]
    },
    "thisChapterLink": "/api/d/open-cross-ref/REV/22.json",
    "nextChapterApiLink": null,
    "previousChapterApiLink": "/api/d/open-cross-ref/REV/21.json",
    "numberOfVerses": 21,
    "numberOfReferences": 360
}
```
