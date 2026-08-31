# Datasets

Endpoints for browsing supplementary Bible datasets - such as cross references and biblical entities (people, places, events, and people groups) - and fetching their books, chapter content, and entities.

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

For cross reference datasets (such as `open-cross-ref`), the chapter contains the list of cross references for each verse. For entity datasets (such as `theographic`), the chapter contains the people, places, and events that appear in the chapter - see [Get the Entities in a Chapter](#get-the-entities-in-a-chapter).

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


## Entities

Some datasets - such as the [Theographic Bible Metadata](https://github.com/robertrouse/theographic-bible-metadata) dataset (`theographic`) - contain entities: people, places, events, and people groups, along with the relationships between them and the Bible verses that mention them.

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

## Get the Entities in a Chapter

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

For entity datasets, gets the people, places, and events that appear in a single chapter, along with the verse numbers in the chapter where each one is mentioned.

-   `dataset` the ID of the dataset (e.g. `theographic`).
-   `book` is the ID of the book (e.g. `GEN` for Genesis).
-   `chapter` is the numerical chapter number (e.g. `1` for the first chapter).

The list of books and chapters that have entity data is available from `GET https://bible.helloao.org/api/d/{dataset}/books.json`, which follows the same structure as the [dataset books endpoint](#list-books-in-a-dataset). For entity datasets, `totalNumberOfVerses` is the number of verses that are mentioned by at least one entity and `totalNumberOfReferences` is the total number of entity-verse mentions.

### Code Example

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

```ts:no-line-numbers title="fetch-dataset-people.js"
const dataset = 'theographic';

// Get the list of people for the theographic dataset
fetch(`https://bible.helloao.org/api/d/${dataset}/people.json`)
    .then(request => request.json())
    .then(people => {
        console.log('The theographic dataset has the following people:', people);
    });
```

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
