# Datasets

Endpoints for browsing supplementary Bible datasets - such as cross references, biblical entities (people, places, events, and people groups), original-language interlinear words, lexicons, and verse of the day candidates - and fetching their books, chapter content, entities, lexicon entries, and verse categories.

## Available Datasets

`GET https://bible.helloao.org/api/available_datasets.json`

Gets the list of available Bible datasets in the API.

### Code Example

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-datasets.js"
fetch(`https://bible.helloao.org/api/available_datasets.json`)
    .then(request => request.json())
    .then(availableDatasets => {
        console.log('The API has the following datasets:', availableDatasets);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/available_datasets.json
```

:::

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
     * The API-added notes for the license.
     * Null or undefined if there are no notes.
     */
    licenseNotes?: string | null;

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
     * 0 for datasets that don't contain cross references.
     */
    totalNumberOfReferences: number;

    /**
     * The total number of interlinear words that are contained in this dataset.
     * Omitted if the dataset doesn't contain interlinear words.
     */
    totalNumberOfWords?: number;

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

    /**
     * The API links for the lists of entities in the dataset.
     * Omitted if the dataset doesn't contain the corresponding entities.
     */
    listOfPeopleApiLink?: string;
    listOfPlacesApiLink?: string;
    listOfEventsApiLink?: string;
    listOfPeopleGroupsApiLink?: string;

    /**
     * The total number of entities that are contained in the dataset.
     * Omitted if the dataset doesn't contain the corresponding entities.
     */
    totalNumberOfPeople?: number;
    totalNumberOfPlaces?: number;
    totalNumberOfEvents?: number;
    totalNumberOfPeopleGroups?: number;

    /**
     * The API link for the list of lexicon entries in the dataset.
     * Omitted if the dataset doesn't contain lexicon entries.
     */
    listOfLexiconApiLink?: string;

    /**
     * The total number of lexicon entries that are contained in the dataset.
     * Omitted if the dataset doesn't contain lexicon entries.
     */
    totalNumberOfLexicon?: number;

    /**
     * The API link for the list of every verse in the dataset, with its categories.
     * Omitted if the verses of the dataset don't have categories.
     */
    listOfVersesApiLink?: string;

    /**
     * The API link for the list of verse categories in the dataset.
     * Omitted if the dataset doesn't contain verse categories.
     */
    listOfCategoriesApiLink?: string;

    /**
     * The total number of verse categories that are contained in the dataset.
     * Omitted if the dataset doesn't contain verse categories.
     */
    totalNumberOfCategories?: number;
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
        },
        {
            "id": "theographic",
            "name": "Theographic Bible Metadata",
            "website": "https://github.com/robertrouse/theographic-bible-metadata",
            "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
            "licenseNotes": "Changes were made to the data to fit the Free Use Bible API format.",
            "englishName": "Theographic Bible Metadata",
            "language": "eng",
            "textDirection": "ltr",
            "availableFormats": [
                "json"
            ],
            "listOfBooksApiLink": "/api/d/theographic/books.json",
            "numberOfBooks": 66,
            "totalNumberOfChapters": 1182,
            "totalNumberOfVerses": 24547,
            "totalNumberOfReferences": 53120,
            "languageName": "English",
            "languageEnglishName": "English",
            "listOfPeopleApiLink": "/api/d/theographic/people.json",
            "totalNumberOfPeople": 3067,
            "listOfPlacesApiLink": "/api/d/theographic/places.json",
            "totalNumberOfPlaces": 1274,
            "listOfEventsApiLink": "/api/d/theographic/events.json",
            "totalNumberOfEvents": 450,
            "listOfPeopleGroupsApiLink": "/api/d/theographic/groups.json",
            "totalNumberOfPeopleGroups": 23
        },
        {
            "id": "bsb-interlinear",
            "name": "Berean Standard Bible Interlinear",
            "website": "https://bereanbible.com/",
            "licenseUrl": "https://berean.bible/terms.htm",
            "licenseNotes": "The Berean Standard Bible and its interlinear tables are in the public domain. Changes were made to the data to fit the Free Use Bible API format.",
            "englishName": "Berean Standard Bible Interlinear",
            "language": "eng",
            "textDirection": "ltr",
            "availableFormats": [
                "json"
            ],
            "listOfBooksApiLink": "/api/d/bsb-interlinear/books.json",
            "numberOfBooks": 66,
            "totalNumberOfChapters": 1189,
            "totalNumberOfVerses": 31102,
            "totalNumberOfReferences": 0,
            "languageName": "English",
            "languageEnglishName": "English",
            "totalNumberOfWords": 443625
        },
        {
            "id": "stepbible-lexicon",
            "name": "STEPBible Brief Lexicons",
            "website": "https://github.com/STEPBible/STEPBible-Data",
            "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
            "licenseNotes": "The Translators Brief lexicons of Extended Strongs (TBESH and TBESG) are by STEPBible.org / Tyndale House, Cambridge, and are licensed under CC BY 4.0. Changes were made to the data to fit the Free Use Bible API format.",
            "englishName": "STEPBible Brief Lexicons",
            "language": "eng",
            "textDirection": "ltr",
            "availableFormats": [
                "json"
            ],
            "listOfBooksApiLink": "/api/d/stepbible-lexicon/books.json",
            "numberOfBooks": 0,
            "totalNumberOfChapters": 0,
            "totalNumberOfVerses": 0,
            "totalNumberOfReferences": 0,
            "languageName": "English",
            "languageEnglishName": "English",
            "listOfLexiconApiLink": "/api/d/stepbible-lexicon/lexicon.json",
            "totalNumberOfLexicon": 18085
        },
        {
            "id": "history-globe",
            "name": "History Globe",
            "website": "https://historyglobe.app",
            "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
            "licenseNotes": "History Globe by Vadym Arnaut (https://historyglobe.app) is licensed under CC BY 4.0. Its places, verse tags, and coordinates start from the OpenBible.info Bible Geocoding Data (CC BY 4.0), with corrections, and some coordinates are from Wikidata (CC0). Changes were made to the data to fit the Free Use Bible API format.",
            "englishName": "History Globe",
            "language": "eng",
            "textDirection": "ltr",
            "availableFormats": [
                "json"
            ],
            "listOfBooksApiLink": "/api/d/history-globe/books.json",
            "numberOfBooks": 61,
            "totalNumberOfChapters": 849,
            "totalNumberOfVerses": 5546,
            "totalNumberOfReferences": 8617,
            "languageName": "English",
            "languageEnglishName": "English",
            "listOfPlacesApiLink": "/api/d/history-globe/places.json",
            "totalNumberOfPlaces": 1231
        },
        {
            "id": "verse-of-the-day",
            "name": "Verse of the Day",
            "website": "https://github.com/HelloAOLab/bible-api/blob/main/packages/helloao-tools/generation/verse-of-the-day.ts",
            "licenseUrl": "https://github.com/HelloAOLab/bible-api/blob/main/LICENSE",
            "licenseNotes": "A curated list of well-known verses by AO Lab, released under the MIT License.",
            "englishName": "Verse of the Day",
            "language": "eng",
            "textDirection": "ltr",
            "availableFormats": [
                "json"
            ],
            "listOfBooksApiLink": "/api/d/verse-of-the-day/books.json",
            "numberOfBooks": 59,
            "totalNumberOfChapters": 337,
            "totalNumberOfVerses": 594,
            "totalNumberOfReferences": 0,
            "languageName": "English",
            "languageEnglishName": "English",
            "listOfVersesApiLink": "/api/d/verse-of-the-day/verses.json",
            "listOfCategoriesApiLink": "/api/d/verse-of-the-day/categories.json",
            "totalNumberOfCategories": 17
        }
    ]
}
```


## List Books in a Dataset

`GET https://bible.helloao.org/api/d/{dataset}/books.json`

Gets the list of books that are available for the given dataset.

-   `dataset` the ID of the dataset (e.g. `open-cross-ref`).

### Code Example

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-books.js"
const dataset = 'open-cross-ref';

// Get the list of books for the open-cross-ref dataset
fetch(`https://bible.helloao.org/api/d/${dataset}/books.json`)
    .then(request => request.json())
    .then(books => {
        console.log('The open-cross-ref dataset has the following books:', books);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/open-cross-ref/books.json
```

:::

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

For cross reference datasets (such as `open-cross-ref`), the chapter contains the list of cross references for each verse. For interlinear datasets (such as `bsb-interlinear`), the chapter contains the original-language words of each verse - see [Interlinear Datasets](#interlinear-datasets). For entity datasets (such as `theographic`), the chapter contains the people, places, and events that appear in the chapter - see [Get the Entities in a Chapter](#get-the-entities-in-a-chapter). For the `verse-of-the-day` dataset, the chapter contains the verse of the day candidates in the chapter and their categories - see [Verse of the Day](#verse-of-the-day).

-   `dataset` the ID of the dataset (e.g. `open-cross-ref`).
-   `book` is the ID of the book (e.g. `GEN` for Genesis).
-   `chapter` is the numerical chapter number (e.g. `1` for the first chapter).

### Code Example

::: code-tabs#lang

@tab JavaScript

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

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/open-cross-ref/GEN/1.json
```

:::

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

/**
 * A verse carries `references` (cross reference datasets), `words` (interlinear datasets),
 * or `categories` (the verse-of-the-day dataset).
 * Check which one is present with `'words' in verse` or `'categories' in verse`.
 */
type DatasetVerse =
    | DatasetReferencesVerse
    | DatasetWordsVerse
    | DatasetCategoriesVerse;

interface DatasetReferencesVerse {
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

interface DatasetWordsVerse {
    /**
     * The number of the verse.
     */
    verse: number;

    /**
     * The original-language words of the verse, in original-text order.
     * See "Interlinear Datasets" below.
     */
    words: InterlinearWord[];
}

interface DatasetCategoriesVerse {
    /**
     * The number of the verse.
     * If `endVerse` is present, then this is the verse that the passage starts at.
     */
    verse: number;

    /**
     * The verse that the passage ends at.
     * Omitted if the entry is a single verse.
     */
    endVerse?: number;

    /**
     * The IDs of the categories that the verse belongs to, most relevant first.
     * See "Verse of the Day" below.
     */
    categories: string[];
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

// See "Interlinear Datasets" below for the structure of InterlinearWord.
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


## Entities

Some datasets - such as the [Theographic Bible Metadata](https://github.com/robertrouse/theographic-bible-metadata) dataset (`theographic`) - contain entities: people, places, events, and people groups, along with the relationships between them and the Bible verses that mention them.

The [History Globe](https://historyglobe.app) dataset (`history-globe`) contains places only: the places named in the Bible, with their coordinates and the verses that name them. Its place IDs (e.g. `a15257a` for Jerusalem) are History Globe's stable place IDs, the same ones that its own [open data API](https://historyglobe.app/docs/api.html) uses, so they do not change when a name is corrected. Its `featureType` values follow the ones that the Theographic dataset uses (`City`, `Region`, `Water`, and so on), and `featureSubType` carries the more specific kind where there is one (e.g. `River`, `Gate`, `Spring`).

Datasets that contain entities include `listOfPeopleApiLink`, `listOfPlacesApiLink`, `listOfEventsApiLink`, and `listOfPeopleGroupsApiLink` properties in their entry in `/api/available_datasets.json`.

Entity datasets also provide chapter-aligned data: `/api/d/{dataset}/books.json` lists the books whose chapters contain entity data, and `/api/d/{dataset}/{book}/{chapter}.json` returns the people, places, and events that appear in that chapter, along with the verse numbers where each one is mentioned. See [Get the Entities in a Chapter](#get-the-entities-in-a-chapter).

Entities reference Bible passages using the same book IDs, chapter numbers, and verse numbers as the rest of the API, so they can be combined with any translation. They reference each other using entity references:

```typescript:no-line-numbers title="entity-shared.ts"
export interface DatasetEntityRef {
    /**
     * The ID of the entity that is being referenced.
     */
    id: string;

    /**
     * The type of the entity that is being referenced.
     * Matches the collection segment of the entity's API link,
     * so the link can be constructed as `/api/d/{dataset}/{type}/{id}.json`.
     */
    type: 'people' | 'places' | 'events' | 'groups';

    /**
     * The name of the entity that is being referenced.
     */
    name?: string;

    /**
     * The API link for the entity that is being referenced.
     */
    apiLink?: string;
}

export interface VerseRef {
    /**
     * The ID of the book (GEN, EXO, etc.).
     */
    book: string;

    /**
     * The chapter number that the reference starts at.
     */
    chapter: number;

    /**
     * The verse number that the reference starts at.
     */
    verse: number;

    /**
     * The verse that the reference ends at.
     * Consecutive verses in the same chapter are collapsed into a single reference.
     */
    endVerse?: number;
}
```

### History Globe Attribution

The History Globe data is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). If you use it, credit History Globe (https://historyglobe.app) and the OpenBible.info Bible Geocoding Data that it builds on, and note any changes. The `licenseNotes` property of the dataset carries the credit.

## Get the Entities in a Chapter

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

For entity datasets, gets the people, places, and events that appear in a single chapter, along with the verse numbers in the chapter where each one is mentioned.

-   `dataset` the ID of the dataset (e.g. `theographic`).
-   `book` is the ID of the book (e.g. `GEN` for Genesis).
-   `chapter` is the numerical chapter number (e.g. `1` for the first chapter).

The list of books and chapters that have entity data is available from `GET https://bible.helloao.org/api/d/{dataset}/books.json`, which follows the same structure as the [dataset books endpoint](#list-books-in-a-dataset). For entity datasets, `totalNumberOfVerses` is the number of verses that are mentioned by at least one entity and `totalNumberOfReferences` is the total number of entity-verse mentions.

### Code Example

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter-entities.js"
const dataset = 'theographic';
const book = 'GEN';
const chapter = 2;

// Get the people, places, and events that appear in Genesis 2
fetch(`https://bible.helloao.org/api/d/${dataset}/${book}/${chapter}.json`)
    .then(request => request.json())
    .then(chapter => {
        console.log('Genesis 2 (theographic):', chapter);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/theographic/GEN/2.json
```

:::

### Structure

```typescript:no-line-numbers title="dataset-chapter-entities.ts"
export interface DatasetEntityBookChapter {
    /**
     * The dataset information for the book chapter.
     */
    dataset: Dataset;

    /**
     * The book information for the book chapter.
     */
    book: DatasetBook;

    /**
     * The entity data for the chapter.
     */
    chapter: DatasetEntityChapterData;

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
     * The number of people, places, and events that appear in the chapter.
     */
    numberOfPeople: number;
    numberOfPlaces: number;
    numberOfEvents: number;
}

interface DatasetEntityChapterData {
    /**
     * The number of the chapter.
     */
    number: number;

    /**
     * The people that appear in the chapter.
     * Sorted by the first verse that they appear in.
     */
    people: ChapterPerson[];

    /**
     * The places that appear in the chapter.
     * Sorted by the first verse that they appear in.
     */
    places: ChapterPlace[];

    /**
     * The events that appear in the chapter.
     * Sorted by the first verse that they appear in.
     */
    events: ChapterEvent[];
}

interface ChapterPerson {
    /**
     * The ID of the person.
     */
    id: string;

    /**
     * The name of the person.
     */
    name: string;

    /**
     * Whether the name of the person is a proper name.
     */
    isProperName?: boolean;

    /**
     * The gender of the person.
     */
    gender?: string;

    /**
     * The year that the person was born and the year they died.
     * Negative numbers are years BC. Positive numbers are years AD.
     */
    birthYear?: number;
    deathYear?: number;

    /**
     * The API link for the person.
     */
    apiLink: string;

    /**
     * The numbers of the verses in the chapter that mention the person.
     * Sorted in ascending order.
     */
    verses: number[];
}

interface ChapterPlace {
    /**
     * The ID of the place.
     */
    id: string;

    /**
     * The name of the place.
     */
    name: string;

    /**
     * The type of geographical feature that the place is.
     */
    featureType?: string;

    /**
     * The latitude and longitude of the place.
     */
    latitude?: number;
    longitude?: number;

    /**
     * The API link for the place.
     */
    apiLink: string;

    /**
     * The numbers of the verses in the chapter that mention the place.
     * Sorted in ascending order.
     */
    verses: number[];
}

interface ChapterEvent {
    /**
     * The ID of the event.
     */
    id: string;

    /**
     * The name of the event.
     */
    name: string;

    /**
     * The date that the event started at.
     */
    startDate?: string;

    /**
     * The API link for the event.
     */
    apiLink: string;

    /**
     * The numbers of the verses in the chapter that describe the event.
     * Sorted in ascending order.
     */
    verses: number[];
}
```

### Example

```json:no-line-numbers title="/api/d/theographic/GEN/2.json"
{
    "dataset": {
        "id": "theographic",
        "name": "Theographic Bible Metadata",
        "...": "..."
    },
    "book": {
        "id": "GEN",
        "order": 1,
        "firstChapterNumber": 1,
        "firstChapterApiLink": "/api/d/theographic/GEN/1.json",
        "lastChapterNumber": 50,
        "lastChapterApiLink": "/api/d/theographic/GEN/50.json",
        "numberOfChapters": 50,
        "totalNumberOfVerses": 1343,
        "totalNumberOfReferences": 3346
    },
    "chapter": {
        "number": 2,
        "people": [
            {
                "id": "god_1324",
                "name": "God",
                "isProperName": true,
                "gender": "Male",
                "apiLink": "/api/d/theographic/people/god_1324.json",
                "verses": [2, 3, 4, 5, 7, 8, 9, 15, 16, 18, 19, 21, 22]
            },
            {
                "id": "adam_78",
                "name": "Adam",
                "isProperName": true,
                "gender": "Male",
                "birthYear": -4004,
                "deathYear": -3074,
                "apiLink": "/api/d/theographic/people/adam_78.json",
                "verses": [19, 20, 21, 23]
            }
        ],
        "places": [
            {
                "id": "eden_354",
                "name": "Eden",
                "featureType": "Region",
                "apiLink": "/api/d/theographic/places/eden_354.json",
                "verses": [8, 10, 15]
            },
            {
                "id": "havilah_533",
                "name": "Havilah (of Eden)",
                "featureType": "Region",
                "apiLink": "/api/d/theographic/places/havilah_533.json",
                "verses": [11]
            }
        ],
        "events": [
            {
                "id": "creation-of-all-things_1",
                "name": "Creation of all things",
                "startDate": "-4003",
                "apiLink": "/api/d/theographic/events/creation-of-all-things_1.json",
                "verses": [1, 2, 3]
            },
            {
                "id": "creation-of-adam-and-eve_2",
                "name": "Creation of Adam and Eve",
                "startDate": "-4003",
                "apiLink": "/api/d/theographic/events/creation-of-adam-and-eve_2.json",
                "verses": [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]
            }
        ]
    },
    "thisChapterLink": "/api/d/theographic/GEN/2.json",
    "previousChapterApiLink": "/api/d/theographic/GEN/1.json",
    "nextChapterApiLink": "/api/d/theographic/GEN/3.json",
    "numberOfPeople": 2,
    "numberOfPlaces": 8,
    "numberOfEvents": 2
}
```

## List People in a Dataset

`GET https://bible.helloao.org/api/d/{dataset}/people.json`

Gets the list of people that are available for the given dataset.

-   `dataset` the ID of the dataset (e.g. `theographic`).

### Code Example

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-people.js"
const dataset = 'theographic';

// Get the list of people for the theographic dataset
fetch(`https://bible.helloao.org/api/d/${dataset}/people.json`)
    .then(request => request.json())
    .then(people => {
        console.log('The theographic dataset has the following people:', people);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/theographic/people.json
```

:::

### Structure

```typescript:no-line-numbers title="dataset-people.ts"
export interface DatasetPeople {
    /**
     * The dataset information for the people.
     */
    dataset: Dataset;

    /**
     * The list of people that are available for the dataset.
     */
    people: DatasetPersonSummary[];
}

interface DatasetPersonSummary {
    /**
     * The ID of the person.
     */
    id: string;

    /**
     * The name of the person.
     */
    name: string;

    /**
     * Whether the name of the person is a proper name.
     */
    isProperName?: boolean;

    /**
     * The gender of the person.
     */
    gender?: string;

    /**
     * The number of Bible references that mention the person.
     */
    numberOfReferences: number;

    /**
     * The API link for the person.
     */
    thisPersonApiLink: string;
}
```

### Example

```json:no-line-numbers title="/api/d/theographic/people.json"
{
    "dataset": {
        "id": "theographic",
        "name": "Theographic Bible Metadata",
        "...": "..."
    },
    "people": [
        {
            "id": "paul_2479",
            "name": "Paul",
            "gender": "Male",
            "numberOfReferences": 150,
            "thisPersonApiLink": "/api/d/theographic/people/paul_2479.json"
        },
        {
            "id": "peter_2745",
            "name": "Simon Peter",
            "gender": "Male",
            "numberOfReferences": 129,
            "thisPersonApiLink": "/api/d/theographic/people/peter_2745.json"
        }
    ]
}
```

## Get a Person from a Dataset

`GET https://bible.helloao.org/api/d/{dataset}/people/{person}.json`

Gets the information about a single person, including the Bible references that mention them and their relationships to other people, places, events, and people groups.

-   `dataset` the ID of the dataset (e.g. `theographic`).
-   `person` the ID of the person (e.g. `paul_2479`).

### Code Example

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-person.js"
const dataset = 'theographic';
const person = 'paul_2479';

// Get the information about Paul from the theographic dataset
fetch(`https://bible.helloao.org/api/d/${dataset}/people/${person}.json`)
    .then(request => request.json())
    .then(person => {
        console.log('Paul:', person);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/theographic/people/paul_2479.json
```

:::

### Structure

```typescript:no-line-numbers title="dataset-person.ts"
export interface DatasetPersonResponse {
    /**
     * The dataset information for the person.
     */
    dataset: Dataset;

    /**
     * The information about the person.
     */
    person: DatasetPerson;

    /**
     * The API link for this person.
     */
    thisPersonApiLink: string;
}

interface DatasetPerson {
    /**
     * The ID of the person.
     */
    id: string;

    /**
     * The name of the person.
     */
    name: string;

    /**
     * Other names that the person is called by.
     */
    alsoCalled?: string[];

    /**
     * Whether the name of the person is a proper name.
     */
    isProperName?: boolean;

    /**
     * The gender of the person.
     */
    gender?: string;

    /**
     * The description of the person. Each string is a paragraph.
     */
    description?: string[];

    /**
     * The year that the person was born and the year they died.
     * Negative numbers are years BC. Positive numbers are years AD.
     */
    birthYear?: number;
    deathYear?: number;

    /**
     * The earliest and latest years that the person is mentioned in.
     */
    minYear?: number;
    maxYear?: number;

    /**
     * The place that the person was born and died in.
     */
    birthPlace?: DatasetEntityRef;
    deathPlace?: DatasetEntityRef;

    /**
     * The family relationships of the person.
     */
    father?: DatasetEntityRef[];
    mother?: DatasetEntityRef[];
    partners?: DatasetEntityRef[];
    children?: DatasetEntityRef[];
    siblings?: DatasetEntityRef[];
    halfSiblingsSameMother?: DatasetEntityRef[];
    halfSiblingsSameFather?: DatasetEntityRef[];

    /**
     * The people groups that the person is a member of.
     */
    memberOf?: DatasetEntityRef[];

    /**
     * The events that the person participated in.
     */
    events?: DatasetEntityRef[];

    /**
     * The list of Bible references that mention the person.
     * Sorted by book order, chapter, and verse.
     */
    references: VerseRef[];
}
```

### Example

```json:no-line-numbers title="/api/d/theographic/people/ananias_259.json"
{
    "dataset": {
        "id": "theographic",
        "name": "Theographic Bible Metadata",
        "...": "..."
    },
    "person": {
        "id": "ananias_259",
        "name": "Ananias (Disciple at Damascus)",
        "gender": "Male",
        "description": [
            "A Christian at Damascus (Acts 9:10). He became Paul’s instructor; ..."
        ],
        "minYear": 35,
        "maxYear": 60,
        "events": [
            {
                "id": "saul-is-converted_326",
                "type": "events",
                "name": "Saul is converted",
                "apiLink": "/api/d/theographic/events/saul-is-converted_326.json"
            }
        ],
        "references": [
            { "book": "ACT", "chapter": 9, "verse": 10 },
            { "book": "ACT", "chapter": 9, "verse": 12, "endVerse": 13 },
            { "book": "ACT", "chapter": 9, "verse": 17 },
            { "book": "ACT", "chapter": 22, "verse": 12 }
        ]
    },
    "thisPersonApiLink": "/api/d/theographic/people/ananias_259.json"
}
```

## List Places in a Dataset

`GET https://bible.helloao.org/api/d/{dataset}/places.json`

Gets the list of places that are available for the given dataset.

-   `dataset` the ID of the dataset (e.g. `theographic`).

### Structure

```typescript:no-line-numbers title="dataset-places.ts"
export interface DatasetPlaces {
    /**
     * The dataset information for the places.
     */
    dataset: Dataset;

    /**
     * The list of places that are available for the dataset.
     */
    places: DatasetPlaceSummary[];
}

interface DatasetPlaceSummary {
    /**
     * The ID of the place.
     */
    id: string;

    /**
     * The name of the place.
     */
    name: string;

    /**
     * The type of geographical feature that the place is.
     * For example, "City", "Region", "Mountain", "Water", etc.
     */
    featureType?: string;

    /**
     * The latitude and longitude of the place.
     */
    latitude?: number;
    longitude?: number;

    /**
     * The number of Bible references that mention the place.
     */
    numberOfReferences: number;

    /**
     * The API link for the place.
     */
    thisPlaceApiLink: string;
}
```

## Get a Place from a Dataset

`GET https://bible.helloao.org/api/d/{dataset}/places/{place}.json`

Gets the information about a single place, including the Bible references that mention it and its related people and events.

-   `dataset` the ID of the dataset (e.g. `theographic`).
-   `place` the ID of the place (e.g. `jerusalem_636`).

### Structure

```typescript:no-line-numbers title="dataset-place.ts"
export interface DatasetPlaceResponse {
    /**
     * The dataset information for the place.
     */
    dataset: Dataset;

    /**
     * The information about the place.
     */
    place: DatasetPlace;

    /**
     * The API link for this place.
     */
    thisPlaceApiLink: string;
}

interface DatasetPlace {
    /**
     * The ID of the place.
     */
    id: string;

    /**
     * The name of the place.
     */
    name: string;

    /**
     * The name of the place as it appears in the King James Version
     * and the English Standard Version.
     */
    kjvName?: string;
    esvName?: string;

    /**
     * Other names that the place is called by.
     */
    aliases?: string[];

    /**
     * The type of geographical feature that the place is.
     */
    featureType?: string;
    featureSubType?: string;

    /**
     * The latitude and longitude of the place, and how precise they are.
     */
    latitude?: number;
    longitude?: number;
    precision?: string;

    /**
     * The description of the place. Each string is a paragraph.
     */
    description?: string[];

    /**
     * The comment on the place from the dataset authors.
     */
    comment?: string;

    /**
     * The root place for this place.
     * Different names for the same geographical location share the same root place.
     */
    rootPlace?: DatasetEntityRef;

    /**
     * The place that this place is a duplicate of.
     */
    duplicateOf?: DatasetEntityRef;

    /**
     * The people that have been at, were born at, or died at the place.
     */
    people?: DatasetEntityRef[];
    peopleBorn?: DatasetEntityRef[];
    peopleDied?: DatasetEntityRef[];

    /**
     * The events that happened at the place.
     */
    events?: DatasetEntityRef[];

    /**
     * The list of Bible references that mention the place.
     * Sorted by book order, chapter, and verse.
     */
    references: VerseRef[];
}
```

### Example

```json:no-line-numbers title="/api/d/theographic/places/damascus_322.json"
{
    "dataset": {
        "id": "theographic",
        "name": "Theographic Bible Metadata",
        "...": "..."
    },
    "place": {
        "id": "damascus_322",
        "name": "Damascus",
        "kjvName": "Damascus",
        "esvName": "Damascus",
        "featureType": "City",
        "latitude": 33.511612,
        "longitude": 36.309102,
        "description": [
            "Activity, the most ancient of Oriental cities; the capital of Syria; ..."
        ],
        "events": [
            {
                "id": "saul-is-converted_326",
                "type": "events",
                "name": "Saul is converted",
                "apiLink": "/api/d/theographic/events/saul-is-converted_326.json"
            }
        ],
        "references": [
            { "book": "GEN", "chapter": 14, "verse": 15 },
            { "book": "GEN", "chapter": 15, "verse": 2 }
        ]
    },
    "thisPlaceApiLink": "/api/d/theographic/places/damascus_322.json"
}
```

## List Events in a Dataset

`GET https://bible.helloao.org/api/d/{dataset}/events.json`

Gets the list of events that are available for the given dataset.

-   `dataset` the ID of the dataset (e.g. `theographic`).

### Structure

```typescript:no-line-numbers title="dataset-events.ts"
export interface DatasetEvents {
    /**
     * The dataset information for the events.
     */
    dataset: Dataset;

    /**
     * The list of events that are available for the dataset.
     */
    events: DatasetEventSummary[];
}

interface DatasetEventSummary {
    /**
     * The ID of the event.
     */
    id: string;

    /**
     * The name of the event.
     */
    name: string;

    /**
     * The date that the event started at.
     * Negative numbers are years BC. Positive numbers are years AD.
     * More specific dates use the `YYYY-MM-DD` format.
     */
    startDate?: string;

    /**
     * The number of Bible references that describe the event.
     */
    numberOfReferences: number;

    /**
     * The API link for the event.
     */
    thisEventApiLink: string;
}
```

## Get an Event from a Dataset

`GET https://bible.helloao.org/api/d/{dataset}/events/{event}.json`

Gets the information about a single event, including the Bible references that describe it and its related people, places, and people groups.

-   `dataset` the ID of the dataset (e.g. `theographic`).
-   `event` the ID of the event (e.g. `saul-is-converted_326`).

### Structure

```typescript:no-line-numbers title="dataset-event.ts"
export interface DatasetEventResponse {
    /**
     * The dataset information for the event.
     */
    dataset: Dataset;

    /**
     * The information about the event.
     */
    event: DatasetEvent;

    /**
     * The API link for this event.
     */
    thisEventApiLink: string;
}

interface DatasetEvent {
    /**
     * The ID of the event.
     */
    id: string;

    /**
     * The name of the event.
     */
    name: string;

    /**
     * The date that the event started at.
     */
    startDate?: string;

    /**
     * The duration of the event.
     * For example, "1D" is one day and "40Y" is fourty years.
     */
    duration?: string;

    /**
     * The people that participated in the event.
     */
    participants?: DatasetEntityRef[];

    /**
     * The places that the event happened at.
     */
    locations?: DatasetEntityRef[];

    /**
     * The people groups that participated in the event.
     */
    groups?: DatasetEntityRef[];

    /**
     * The event that this event is a part of.
     */
    partOf?: DatasetEntityRef;

    /**
     * The event that happened before this event.
     */
    predecessor?: DatasetEntityRef;

    /**
     * The list of Bible references that describe the event.
     * Sorted by book order, chapter, and verse.
     */
    references: VerseRef[];
}
```

### Example

```json:no-line-numbers title="/api/d/theographic/events/saul-is-converted_326.json"
{
    "dataset": {
        "id": "theographic",
        "name": "Theographic Bible Metadata",
        "...": "..."
    },
    "event": {
        "id": "saul-is-converted_326",
        "name": "Saul is converted",
        "startDate": "0032",
        "duration": "1D",
        "participants": [
            {
                "id": "holy_spirit_7400",
                "type": "people",
                "name": "Holy Spirit",
                "apiLink": "/api/d/theographic/people/holy_spirit_7400.json"
            },
            {
                "id": "ananias_259",
                "type": "people",
                "name": "Ananias (Disciple at Damascus)",
                "apiLink": "/api/d/theographic/people/ananias_259.json"
            },
            {
                "id": "paul_2479",
                "type": "people",
                "name": "Paul",
                "apiLink": "/api/d/theographic/people/paul_2479.json"
            }
        ],
        "locations": [
            {
                "id": "damascus_322",
                "type": "places",
                "name": "Damascus",
                "apiLink": "/api/d/theographic/places/damascus_322.json"
            }
        ],
        "predecessor": {
            "id": "conversion-of-ethiopian-eunuch_325",
            "type": "events",
            "name": "Conversion of Ethiopian Eunuch",
            "apiLink": "/api/d/theographic/events/conversion-of-ethiopian-eunuch_325.json"
        },
        "references": [
            { "book": "ACT", "chapter": 9, "verse": 1, "endVerse": 19 }
        ]
    },
    "thisEventApiLink": "/api/d/theographic/events/saul-is-converted_326.json"
}
```

## List People Groups in a Dataset

`GET https://bible.helloao.org/api/d/{dataset}/groups.json`

Gets the list of people groups that are available for the given dataset.

-   `dataset` the ID of the dataset (e.g. `theographic`).

### Structure

```typescript:no-line-numbers title="dataset-people-groups.ts"
export interface DatasetPeopleGroups {
    /**
     * The dataset information for the people groups.
     */
    dataset: Dataset;

    /**
     * The list of people groups that are available for the dataset.
     */
    groups: DatasetPeopleGroupSummary[];
}

interface DatasetPeopleGroupSummary {
    /**
     * The ID of the people group.
     */
    id: string;

    /**
     * The name of the people group.
     */
    name: string;

    /**
     * The number of people that are members of the people group.
     */
    numberOfMembers: number;

    /**
     * The API link for the people group.
     */
    thisPeopleGroupApiLink: string;
}
```

## Get a People Group from a Dataset

`GET https://bible.helloao.org/api/d/{dataset}/groups/{group}.json`

Gets the information about a single people group, including its members and the events that the group participated in.

-   `dataset` the ID of the dataset (e.g. `theographic`).
-   `group` the ID of the people group (e.g. `tribe-of-benjamin`).

### Structure

```typescript:no-line-numbers title="dataset-people-group.ts"
export interface DatasetPeopleGroupResponse {
    /**
     * The dataset information for the people group.
     */
    dataset: Dataset;

    /**
     * The information about the people group.
     */
    group: DatasetPeopleGroup;

    /**
     * The API link for this people group.
     */
    thisPeopleGroupApiLink: string;
}

interface DatasetPeopleGroup {
    /**
     * The ID of the people group.
     */
    id: string;

    /**
     * The name of the people group.
     */
    name: string;

    /**
     * The people that are members of the people group.
     */
    members?: DatasetEntityRef[];

    /**
     * The events that the people group participated in.
     */
    events?: DatasetEntityRef[];

    /**
     * The list of Bible references that mention the people group.
     * Sorted by book order, chapter, and verse.
     */
    references: VerseRef[];
}
```

### Example

```json:no-line-numbers title="/api/d/theographic/groups/tribe-of-benjamin.json"
{
    "dataset": {
        "id": "theographic",
        "name": "Theographic Bible Metadata",
        "...": "..."
    },
    "group": {
        "id": "tribe-of-benjamin",
        "name": "Tribe of Benjamin",
        "members": [
            {
                "id": "abiah_17",
                "type": "people",
                "name": "Abiah",
                "apiLink": "/api/d/theographic/people/abiah_17.json"
            },
            {
                "id": "abihud_34",
                "type": "people",
                "name": "Abihud",
                "apiLink": "/api/d/theographic/people/abihud_34.json"
            }
        ],
        "references": []
    },
    "thisPeopleGroupApiLink": "/api/d/theographic/groups/tribe-of-benjamin.json"
}
```


## Interlinear Datasets

The Berean interlinear dataset (`bsb-interlinear`) lists the original-language (Hebrew, Aramaic, and Greek) words of every verse of the Bible, in the order they appear in the original text. Each word has its transliteration, grammatical parsing, [Strong's number](https://en.wikipedia.org/wiki/Strong%27s_Concordance), and the English phrase that the [Berean Standard Bible](https://berean.bible) uses for it.

The dataset uses the same endpoints as other datasets:

-   `GET https://bible.helloao.org/api/d/bsb-interlinear/books.json` lists the 66 books.
-   `GET https://bible.helloao.org/api/d/bsb-interlinear/{book}/{chapter}.json` (e.g. `/api/d/bsb-interlinear/GEN/1.json`) returns the chapter, with `{ verse, words }` for every verse. The response is a [dataset chapter](#get-a-chapter-from-a-dataset).

The words data comes from the [Berean Standard Bible interlinear tables](https://bereanbible.com/), which are in the public domain. Strong's numbers for the words are looked up in the [lexicon](#lexicon) (`stepbible-lexicon`).

### Structure

```typescript:no-line-numbers title="interlinear-word.ts"
interface InterlinearWord {
    /**
     * The 1-based rank of the word in the original text's order.
     * Words are listed in this order.
     */
    pos: number;

    /**
     * The 1-based rank of the word in the Berean Standard Bible's English order.
     */
    bsbPos: number;

    /**
     * The language of the word.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * The word in the original script. NFC-normalized.
     */
    text: string;

    /**
     * The transliteration of the word.
     */
    transliteration: string | null;

    /**
     * The short grammatical parsing code of the word. e.g. "N-mp" or "V-Qal-Perf-3ms".
     */
    parsing: string | null;

    /**
     * The spelled-out grammatical parsing of the word.
     */
    parsingFull: string | null;

    /**
     * The zero-padded Strong's number of the word. e.g. "H0430" or "G3056".
     * Zero-padded, which matches the KJV's `.words.json` values.
     * Other translations' values may need zero-padding and suffix stripping before joining.
     * Null when the source gives the word no Strong's number
     * (this is the case for some words that are suffixes, such as pronoun suffixes).
     */
    strongs: string | null;

    /**
     * The Berean Standard Bible's English phrase for the word.
     * Null when the BSB leaves the word untranslated (such as the Hebrew direct object marker).
     */
    gloss: string | null;
}
```

### Example

```json:no-line-numbers title="/api/d/bsb-interlinear/GEN/1.json"
{
    "dataset": {
        "id": "bsb-interlinear",
        "name": "Berean Standard Bible Interlinear",
        "totalNumberOfWords": 443625
        // ...
    },
    "book": {
        "id": "GEN",
        "datasetId": "bsb-interlinear",
        "order": 1,
        "numberOfChapters": 50
        // ...
    },
    "chapter": {
        "number": 1,
        "content": [
            {
                "verse": 1,
                "words": [
                    {
                        "pos": 1,
                        "bsbPos": 1,
                        "language": "hebrew",
                        "text": "בְּרֵאשִׁ֖ית",
                        "transliteration": "bə·rê·šîṯ",
                        "parsing": "Prep-b | N-fs",
                        "parsingFull": "Preposition-b | Noun - feminine singular",
                        "strongs": "H7225",
                        "gloss": "In the beginning"
                    },
                    {
                        "pos": 2,
                        "bsbPos": 4,
                        "language": "hebrew",
                        "text": "בָּרָ֣א",
                        "transliteration": "bā·rā",
                        "parsing": "V-Qal-Perf-3ms",
                        "parsingFull": "Verb - Qal - Perfect - third person masculine singular",
                        "strongs": "H1254",
                        "gloss": "created"
                    }
                    // ...
                ]
            }
            // ...
        ]
    },
    "thisChapterLink": "/api/d/bsb-interlinear/GEN/1.json",
    "nextChapterApiLink": "/api/d/bsb-interlinear/GEN/2.json",
    "previousChapterApiLink": null,
    "numberOfVerses": 31,
    "numberOfReferences": 0
}
```

### Linking Words to Translations

Interlinear `strongs` values are zero-padded (e.g. `H0430`). This matches the `strongs` values in the KJV's word annotations (`/api/eng_kjv/{book}/{chapter}.words.json`). Other translations' values may need zero-padding and suffix stripping (e.g. `H430` or `H1961a` to `H0430` and `H1961`) before they can be joined.

-   **KJV.** For the King James Version (`eng_kjv` and `eng_kja`), join the Strong's numbers in a chapter's `.words.json` file with the `strongs` of the interlinear words of the same verse. For example, every Strong's number annotated in `/api/eng_kjv/GEN/1.words.json` for verse 1 (`H7225`, `H1254`, `H0430`, `H0853`, `H8064`, `H0776`) appears as a `strongs` value among the words of verse 1 in `/api/d/bsb-interlinear/GEN/1.json`.
-   **Berean Standard Bible.** Each word's `gloss` is the BSB phrase for that word. Walk the verse's words in `bsbPos` order and match each `gloss` against the verse text of the BSB translation to find where the word's translation sits.

The numbering of the two sources does not always agree. For example, the KJV tags "was" as `G2258` where the Berean table has `G1510`. A few joins miss because of differences like this.

### Attribution

The Berean interlinear tables are in the public domain. The [lexicon](#lexicon) is licensed under CC BY 4.0 and requires attribution.


## Lexicon

The STEPBible lexicon dataset (`stepbible-lexicon`) contains the Hebrew, Aramaic, and Greek brief lexicons (TBESH and TBESG) from [STEPBible.org](https://www.stepbible.org/) at Tyndale House, Cambridge. It has one entry for every base Strong's number, and every entry has one or more senses with the lemma, transliteration, part of speech, English gloss, and a definition.

Any zero-padded `strongs` value from an [interlinear word](#interlinear-datasets) that has a lexicon entry can be looked up at `/api/d/stepbible-lexicon/lexicon/{strongs}.json` without reformatting. The same holds for the KJV's `.words.json` values; other translations' values may need zero-padding and suffix stripping first. Greek entries that the lexicon adds without a Strong's number are not published.

Datasets that contain lexicon entries include `listOfLexiconApiLink` and `totalNumberOfLexicon` in their entry in `/api/available_datasets.json`.

### Attribution

The lexicon data is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). If you use it, credit STEPBible.org / Tyndale House, Cambridge, and note any changes. The `licenseNotes` property of the dataset carries the credit.


## List Lexicon Entries in a Dataset

`GET https://bible.helloao.org/api/d/{dataset}/lexicon.json`

Gets the list of lexicon entries that are available for a dataset.

-   `dataset` the ID of the dataset (e.g. `stepbible-lexicon`).

### Code Example

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-lexicon.js"
fetch(`https://bible.helloao.org/api/d/stepbible-lexicon/lexicon.json`)
    .then(request => request.json())
    .then(lexicon => {
        console.log('The lexicon has', lexicon.lexicon.length, 'entries');
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/stepbible-lexicon/lexicon.json
```

:::

### Structure

```typescript:no-line-numbers title="dataset-lexicon.ts"
export interface DatasetLexicon {
    /**
     * The dataset information for the lexicon.
     */
    dataset: Dataset;

    /**
     * The list of lexicon entries that are available for the dataset.
     */
    lexicon: DatasetLexiconEntrySummary[];
}

export interface DatasetLexiconEntrySummary {
    /**
     * The zero-padded Strong's number of the lexicon entry. e.g. "H0430".
     */
    id: string;

    /**
     * The language of the lexicon entry.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * The name of the lexicon entry.
     * This is the lemma of the entry's first sense.
     */
    name: string;

    /**
     * The API link for the lexicon entry.
     */
    apiLink: string;
}
```

### Example

```json:no-line-numbers title="/api/d/stepbible-lexicon/lexicon.json"
{
    "dataset": {
        "id": "stepbible-lexicon",
        "name": "STEPBible Brief Lexicons",
        "totalNumberOfLexicon": 18085
        // ...
    },
    "lexicon": [
        {
            "id": "G0001",
            "language": "greek",
            "name": "α, Ἀλφα",
            "apiLink": "/api/d/stepbible-lexicon/lexicon/G0001.json"
        },
        {
            "id": "G0002",
            "language": "greek",
            "name": "Ἀαρών",
            "apiLink": "/api/d/stepbible-lexicon/lexicon/G0002.json"
        }
        // ...
    ]
}
```


## Get a Lexicon Entry from a Dataset

`GET https://bible.helloao.org/api/d/{dataset}/lexicon/{strongs}.json`

Gets the lexicon entry for a single base Strong's number, with all of its senses.

-   `dataset` the ID of the dataset (e.g. `stepbible-lexicon`).
-   `strongs` is the zero-padded Strong's number (e.g. `H0430` for the Hebrew word _elohim_, or `G3056` for the Greek word _logos_).

### Code Example

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-lexicon-entry.js"
const strongs = 'H1254';

fetch(`https://bible.helloao.org/api/d/stepbible-lexicon/lexicon/${strongs}.json`)
    .then(request => request.json())
    .then(({ entry }) => {
        console.log('H1254:', entry.senses.map(sense => sense.gloss));
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/stepbible-lexicon/lexicon/H1254.json
```

:::

### Structure

```typescript:no-line-numbers title="dataset-lexicon-entry.ts"
export interface DatasetLexiconEntry {
    /**
     * The dataset information for the lexicon entry.
     */
    dataset: Dataset;

    /**
     * The lexicon entry.
     */
    entry: DatasetLexiconEntryContent;

    /**
     * The API link for this lexicon entry.
     */
    thisLexiconEntryApiLink: string;
}

export interface DatasetLexiconEntryContent {
    /**
     * The zero-padded Strong's number of the entry. e.g. "H0430".
     */
    id: string;

    /**
     * The language of the entry.
     * This is the language of the entry's first sense.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * The senses of the entry, in ID order.
     */
    senses: DatasetLexiconSense[];
}

export interface DatasetLexiconSense {
    /**
     * The extended ID of the sense. e.g. "H0001G".
     * Equal to the base Strong's number when the number has a single sense.
     */
    id: string;

    /**
     * The language of the sense.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * The lemma of the sense in the original script.
     */
    lemma: string;

    /**
     * The transliteration of the lemma.
     */
    transliteration: string | null;

    /**
     * The part of speech (morphology) code of the sense.
     */
    partOfSpeech: string | null;

    /**
     * The short English gloss of the sense.
     */
    gloss: string | null;

    /**
     * The definition of the sense as plain text.
     * Paragraphs are separated by blank lines. Markup in the source is removed.
     */
    definition: string;
}
```

### Example

```json:no-line-numbers title="/api/d/stepbible-lexicon/lexicon/H1254.json"
{
    "dataset": {
        "id": "stepbible-lexicon",
        "name": "STEPBible Brief Lexicons",
        "totalNumberOfLexicon": 18085
        // ...
    },
    "entry": {
        "id": "H1254",
        "language": "hebrew",
        "senses": [
            {
                "id": "H1254A",
                "language": "hebrew",
                "lemma": "בָּרָא",
                "transliteration": "ba.ra",
                "partOfSpeech": "V",
                "gloss": "to create",
                "definition": "1) to create, shape, form\n\n1a) (Qal) to shape, fashion, create (always with God as subject)\n\n1b) (Niphal) to be created"
            },
            {
                "id": "H1254B",
                "language": "hebrew",
                "lemma": "בָּרָא",
                "transliteration": "ba.ra",
                "partOfSpeech": "V",
                "gloss": "to fatten",
                "definition": "1) to be fat\n\n1a) (Hiphil) to make yourselves fat"
            }
        ]
    },
    "thisLexiconEntryApiLink": "/api/d/stepbible-lexicon/lexicon/H1254.json"
}
```


## Verse of the Day

The verse of the day dataset (`verse-of-the-day`) is a curated list of nearly 600 well-known verses and short passages (at most three verses) that make good candidates for a "verse of the day". That is enough for a different verse every day of the year. Each one makes sense on its own and has one to three categories, most relevant first, from this fixed set:

| ID            | Description                                                 |
| ------------- | ----------------------------------------------------------- |
| `comfort`     | God's nearness and care in grief, trouble, and loneliness.  |
| `courage`     | Standing firm and not being afraid.                         |
| `faith`       | Trusting God and His promises.                              |
| `forgiveness` | God's forgiveness of sin and forgiving others.              |
| `gratitude`   | Giving thanks to God.                                       |
| `guidance`    | God directing our steps, plans, and decisions.              |
| `hope`        | Confidence in the future that God has promised.             |
| `inspiration` | Encouragement to live out the faith and do good.            |
| `joy`         | Rejoicing and gladness in God.                              |
| `love`        | God's love for us and our love for God and others.          |
| `peace`       | Rest, stillness, and freedom from anxiety.                  |
| `praise`      | Worship and declarations of God's greatness.                |
| `prayer`      | Calling on God and His promise to hear.                     |
| `provision`   | God supplying what we need.                                 |
| `salvation`   | Redemption, grace, and new life in Christ.                  |
| `strength`    | God giving strength and endurance.                          |
| `wisdom`      | Godly wisdom and practical instruction for life.            |

The dataset only contains references, not verse text, so it works with every translation. Verse numbers use the standard English numbering (the same as the BSB). The data can be read three ways:

-   [`/api/d/verse-of-the-day/verses.json`](#list-verses-in-a-dataset) lists every verse in the dataset with its categories, in one file.
-   [`/api/d/verse-of-the-day/categories/{category}.json`](#get-a-category-from-a-dataset) lists every verse in a category. This is the easiest way to pick a verse of the day from one category.
-   [`/api/d/verse-of-the-day/{book}/{chapter}.json`](#get-a-chapter-from-a-dataset) lists the candidates in a chapter, with their categories. Only chapters that contain a candidate are available; use the book's chapter links or `/api/d/verse-of-the-day/books.json` to find them.

Datasets that contain verse categories include `listOfVersesApiLink`, `listOfCategoriesApiLink`, and `totalNumberOfCategories` in their entry in `/api/available_datasets.json`.

### Picking a Verse of the Day

The API is made of static files, so it doesn't pick a verse for you. Instead, there is a convention for picking one, so that every app that follows it shows the same verse on the same day. Apps are free to pick differently; the convention just gives them a shared default.

The convention picks from the verses in `/api/d/verse-of-the-day/verses.json`:

1. Each verse gets a sort key: the 32-bit [FNV-1a](https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function) hash of the UTF-8 bytes of `"{seed}|{book} {chapter}:{verse}"`, passed through the [MurmurHash3](https://en.wikipedia.org/wiki/MurmurHash#Algorithm) `fmix32` finalizer. The seed is an empty string by default, so the key for John 3:16 is `"|JHN 3:16"`. Passages use their first verse.
2. The verses are sorted by their key, as an unsigned number. If two keys are equal, they are sorted by the key's string.
3. The verse at position `day mod n` (counting from 0) is the verse of the day, where `day` is the number of days from 1970-01-01 to the date (negative before 1970) and `n` is the number of verses.

This gives a shuffled order that every verse appears in exactly once every `n` days. The dataset has more than 366 verses, so a verse never repeats within a year, and the same date always gives the same verse. Because the order comes from each verse's own reference, it doesn't depend on the order of the list. Adding or removing verses does change which verse falls on which day.

To use your own order, pick a seed of your own (for example, the name of your app): it gives a different shuffle with the same guarantees. You can also pick from a single category's verses, but every category has fewer verses than there are days in a year, so its verses repeat sooner.

The SDKs follow the convention:

```ts:no-line-numbers title="verse-of-the-day.js"
import { FreeUseBibleApi } from 'free-use-bible-api';

const api = new FreeUseBibleApi();

// A date as YYYY-MM-DD, or a Date (its local calendar date is used). Defaults to today.
const ref = await api.getVerseOfTheDay('2026-01-01');

// Get the text of the verse from a translation.
const chapter = await api.getTranslationBookChapter('BSB', ref.book, ref.chapter);
const verses = chapter.chapter.content.filter(
    (c) =>
        c.type === 'verse' &&
        c.number >= ref.verse &&
        c.number <= (ref.endVerse ?? ref.verse)
);
console.log(ref, verses);
```

-   `getVerseOfTheDay(date?, { seed?, category?, dataset? }?)` downloads the verse list and picks from it. `pickVerseOfTheDay(verses, date?, { seed?, category? }?)` picks from a list you already have.
-   The Kotlin SDK has `getVerseOfTheDay(date?, seed?, category?)` and `pickVerseOfTheDay(verses, date?, seed?, category?)`, which take the date as a `YYYY-MM-DD` string.
-   The `@helloao/tools` package has the same list and a `getVerseOfTheDay(date?, { seed?, category? }?)` function in `@helloao/tools/generation/verse-of-the-day.js`.

### License

The list was put together by AO Lab and is released under the [MIT License](https://github.com/HelloAOLab/bible-api/blob/main/LICENSE). The verse text comes from whichever translation you fetch it from.


## List Verses in a Dataset

`GET https://bible.helloao.org/api/d/{dataset}/verses.json`

Gets every verse (or short passage) in a dataset, with the categories that each one belongs to, in canonical order. Only available for datasets whose verses have categories, such as `verse-of-the-day`.

-   `dataset` the ID of the dataset (e.g. `verse-of-the-day`).

### Code Example

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-verses.js"
fetch(`https://bible.helloao.org/api/d/verse-of-the-day/verses.json`)
    .then(request => request.json())
    .then(verses => {
        console.log('The dataset has', verses.verses.length, 'verses');
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/verse-of-the-day/verses.json
```

:::

### Structure

```typescript:no-line-numbers title="dataset-verses.ts"
export interface DatasetVerses {
    /**
     * The dataset information for the verses.
     */
    dataset: Dataset;

    /**
     * Every verse (or short passage) in the dataset, with its categories, in canonical order.
     */
    verses: DatasetCategorizedVerse[];
}

export interface DatasetCategorizedVerse {
    /**
     * The ID of the book. e.g. "PRO".
     */
    book: string;

    /**
     * The chapter number.
     */
    chapter: number;

    /**
     * The verse number.
     * If `endVerse` is present, then this is the verse that the passage starts at.
     */
    verse: number;

    /**
     * The verse that the passage ends at.
     * Omitted if the entry is a single verse.
     */
    endVerse?: number;

    /**
     * The IDs of the categories that the verse belongs to, most relevant first.
     */
    categories: string[];
}
```

### Example

```json:no-line-numbers title="/api/d/verse-of-the-day/verses.json"
{
    "dataset": {
        "id": "verse-of-the-day",
        "name": "Verse of the Day",
        "listOfVersesApiLink": "/api/d/verse-of-the-day/verses.json"
        // ...
    },
    "verses": [
        {
            "book": "GEN",
            "chapter": 1,
            "verse": 1,
            "categories": ["praise"]
        },
        {
            "book": "GEN",
            "chapter": 15,
            "verse": 6,
            "categories": ["faith", "salvation"]
        },
        // ...
        {
            "book": "PRO",
            "chapter": 3,
            "verse": 5,
            "endVerse": 6,
            "categories": ["faith", "guidance", "wisdom"]
        }
        // ...
    ]
}
```


## List Categories in a Dataset

`GET https://bible.helloao.org/api/d/{dataset}/categories.json`

Gets the list of verse categories that are available for a dataset.

-   `dataset` the ID of the dataset (e.g. `verse-of-the-day`).

### Code Example

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-categories.js"
fetch(`https://bible.helloao.org/api/d/verse-of-the-day/categories.json`)
    .then(request => request.json())
    .then(categories => {
        console.log('The dataset has the following categories:', categories.categories);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/verse-of-the-day/categories.json
```

:::

### Structure

```typescript:no-line-numbers title="dataset-categories.ts"
export interface DatasetCategories {
    /**
     * The dataset information for the categories.
     */
    dataset: Dataset;

    /**
     * The list of verse categories that are available for the dataset.
     */
    categories: DatasetCategorySummary[];
}

export interface DatasetCategorySummary {
    /**
     * The ID of the category. e.g. "hope".
     */
    id: string;

    /**
     * The English name of the category. e.g. "Hope".
     */
    name: string;

    /**
     * The description of what the verses in the category are about.
     */
    description: string;

    /**
     * The number of verses (or short passages) that belong to the category.
     */
    numberOfVerses: number;

    /**
     * The API link for the category.
     */
    apiLink: string;
}
```

### Example

```json:no-line-numbers title="/api/d/verse-of-the-day/categories.json"
{
    "dataset": {
        "id": "verse-of-the-day",
        "name": "Verse of the Day",
        "totalNumberOfCategories": 17
        // ...
    },
    "categories": [
        {
            "id": "comfort",
            "name": "Comfort",
            "description": "God's nearness and care in grief, trouble, and loneliness.",
            "numberOfVerses": 61,
            "apiLink": "/api/d/verse-of-the-day/categories/comfort.json"
        },
        {
            "id": "courage",
            "name": "Courage",
            "description": "Standing firm and not being afraid.",
            "numberOfVerses": 40,
            "apiLink": "/api/d/verse-of-the-day/categories/courage.json"
        }
        // ...
    ]
}
```


## Get a Category from a Dataset

`GET https://bible.helloao.org/api/d/{dataset}/categories/{category}.json`

Gets a single verse category, with every verse that belongs to it.

-   `dataset` the ID of the dataset (e.g. `verse-of-the-day`).
-   `category` is the ID of the category (e.g. `hope`).

### Code Example

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-category.js"
fetch(`https://bible.helloao.org/api/d/verse-of-the-day/categories/hope.json`)
    .then(request => request.json())
    .then(category => {
        console.log('Verses about hope:', category.category.verses);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/verse-of-the-day/categories/hope.json
```

:::

### Structure

```typescript:no-line-numbers title="dataset-category.ts"
export interface DatasetCategoryResponse {
    /**
     * The dataset information for the category.
     */
    dataset: Dataset;

    /**
     * The category, with the verses that belong to it.
     */
    category: DatasetCategory;

    /**
     * The API link for this category.
     */
    thisCategoryApiLink: string;
}

export interface DatasetCategory {
    /**
     * The ID of the category. e.g. "hope".
     */
    id: string;

    /**
     * The English name of the category. e.g. "Hope".
     */
    name: string;

    /**
     * The description of what the verses in the category are about.
     */
    description: string;

    /**
     * The verses (or short passages) that belong to the category, in canonical order.
     */
    verses: VerseRef[];
}

export interface VerseRef {
    /**
     * The ID of the book. e.g. "JER".
     */
    book: string;

    /**
     * The chapter number.
     */
    chapter: number;

    /**
     * The verse number.
     * If `endVerse` is present, then this is the verse that the passage starts at.
     */
    verse: number;

    /**
     * The verse that the passage ends at.
     * Omitted if the reference is a single verse.
     */
    endVerse?: number;
}
```

### Example

```json:no-line-numbers title="/api/d/verse-of-the-day/categories/hope.json"
{
    "dataset": {
        "id": "verse-of-the-day",
        "name": "Verse of the Day",
        "totalNumberOfCategories": 17
        // ...
    },
    "category": {
        "id": "hope",
        "name": "Hope",
        "description": "Confidence in the future that God has promised.",
        "verses": [
            {
                "book": "GEN",
                "chapter": 50,
                "verse": 20
            },
            // ...
            {
                "book": "ISA",
                "chapter": 43,
                "verse": 18,
                "endVerse": 19
            },
            {
                "book": "JER",
                "chapter": 29,
                "verse": 11
            }
            // ...
        ]
    },
    "thisCategoryApiLink": "/api/d/verse-of-the-day/categories/hope.json"
}
```
