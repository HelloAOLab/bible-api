# Datastelle

Eindpunte vir die blaai van aanvullende Bybeldatastelle - soos kruisverwysings en Bybelse entiteite (mense, plekke, gebeure en mensegroepe) - en die ophaal van hul boeke, hoofstukinhoud en entiteite.

## Beskikbare datastelle

`GET https://bible.helloao.org/api/available_datasets.json`

Kry die lys van beskikbare Bybeldatastelle in die API.

### Kode Voorbeeld

::: code-tabs#taal

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

### Struktuur

```typescript:no-line-numbers title="available-datasets.ts"
export interface AvailableDatasets {
    /**
     * Die lys van datastelle.
     */
    datasets: Dataset[];
}

export interface Dataset {
    /**
     * Die ID van die datastel.
     */
    id: string;

    /**
     * Die naam van die datastel.
     */
    name: string;

    /**
     * Die webwerf vir die datastel.
     */
    website: string;

    /**
     * Die URL waar die lisensie vir die datastel gevind kan word.
     */
    licenseUrl: string;

    /**
     * Die Engelse naam vir die datastel.
     */
    englishName: string;

    /**
     * Die ISO 639 3-letter taaletiket waarin die datastel hoofsaaklik is.
     */
    language: string;

    /**
     * Die rigting waarin die taal geskryf is.
     * "ltr" dui aan dat die teks van die linkerkant van die bladsy na regs geskryf is.
     * "rtl" dui aan dat die teks van die regterkant van die bladsy na links geskryf is.
     */
    textDirection: 'ltr' | 'rtl';

    /**
     * Die API-skakel vir die lys van beskikbare boeke vir hierdie datastel.
     */
    listOfBooksApiLink: string;

    /**
     * Die beskikbare lys van formate.
     */
    availableFormats: ('json' | 'usfm')[];

    /**
     * Die aantal boeke wat in hierdie datastel voorkom.
     */
    numberOfBooks: number;

    /**
     * Die totale aantal hoofstukke wat in hierdie datastel voorkom.
     */
    totalNumberOfChapters: number;

    /**
     * Die totale aantal verse wat in hierdie datastel vervat is.
     */
    totalNumberOfVerses: number;

    /**
     * Die totale aantal kruisverwysings wat in hierdie datastel voorkom.
     */
    totalNumberOfReferences: number;

    /**
     * Kry die naam van die taal waarin die datastel is.
     * Nul of ongedefinieerd indien die naam van die taal nie bekend is nie.
     */
    languageName?: string;

    /**
     * Kry die naam van die taal in Engels.
     * Nul of ongedefinieerd as die taal nie 'n Engelse naam het nie.
     */
    languageEnglishName?: string;

    /**
     * Die API-skakels vir die lyste van entiteite in die datastel.
     * Weglaat as die datastel nie die ooreenstemmende entiteite bevat nie.
     */
    listOfPeopleApiLink?: string;
    listOfPlacesApiLink?: string;
    listOfEventsApiLink?: string;
    listOfPeopleGroupsApiLink?: string;

    /**
     * Die totale aantal entiteite wat in die datastel voorkom.
     * Weglaat as die datastel nie die ooreenstemmende entiteite bevat nie.
     */
    totalNumberOfPeople?: number;
    totalNumberOfPlaces?: number;
    totalNumberOfEvents?: number;
    totalNumberOfPeopleGroups?: number;
}
```

### Voorbeeld

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

## Lys boeke in 'n datastel

`GET https://bible.helloao.org/api/d/{dataset}/books.json`

Kry die lys van boeke wat beskikbaar is vir die gegewe datastel.

-   `dataset` die ID van die datastel (bv. `open-cross-ref` ).

### Kode Voorbeeld

::: code-tabs#taal

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-books.js"
const dataset = 'open-cross-ref';

// Kry die lys van boeke vir die oop-kruisverwysingsdatastel
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

### Struktuur

```typescript:no-line-numbers title="dataset-books.ts"
export interface DatasetBooks {
    /**
     * Die datastelinligting vir die boeke.
     */
    dataset: Dataset;

    /**
     * Die lys van boeke wat beskikbaar is vir die datastel.
     */
    books: DatasetBook[];
}

interface DatasetBook {
    /**
     * Die ID van die boek.
     * Stem ooreen met die ID van die ooreenstemmende boek in die Bybel (GEN, EXO, ens.).
     */
    id: string;

    /**
     * Die volgorde van die boek in die Bybel.
     */
    order: number;

    /**
     * Die nommer van die eerste hoofstuk in die boek.
     */
    firstChapterNumber: number;

    /**
     * Die skakel na die eerste hoofstuk van die boek.
     */
    firstChapterApiLink: string | null;

    /**
     * Die nommer van die laaste hoofstuk in die boek.
     */
    lastChapterNumber: number | null;

    /**
     * Die skakel na die laaste hoofstuk van die boek.
     */
    lastChapterApiLink: string | null;

    /**
     * Die aantal hoofstukke wat die boek bevat.
     */
    numberOfChapters: number;

    /**
     * Die aantal verse wat die boek bevat.
     */
    totalNumberOfVerses: number;

    /**
     * Die totale aantal kruisverwysings wat hierdie boek bevat.
     */
    totalNumberOfReferences: number;
}
```

### Voorbeeld

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

## Kry 'n hoofstuk uit 'n datastel

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

Kry die inhoud van 'n enkele hoofstuk vir 'n gegewe boek en datastel.

Vir kruisverwysingsdatastelle (soos `open-cross-ref` ), bevat die hoofstuk die lys van kruisverwysings vir elke vers. Vir entiteitdatastelle (soos `theographic` ), bevat die hoofstuk die mense, plekke en gebeure wat in die hoofstuk verskyn - sien [Kry die Entiteite in 'n Hoofstuk](#get-the-entities-in-a-chapter) .

-   `dataset` die ID van die datastel (bv. `open-cross-ref` ).
-   `book` is die ID van die boek (bv. `GEN` vir Genesis).
-   `chapter` is die numeriese hoofstuknommer (bv. `1` vir die eerste hoofstuk).

### Kode Voorbeeld

::: code-tabs#taal

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-chapter.js"
const dataset = 'open-cross-ref';
const book = 'GEN';
const chapter = 1;

// Kry Genesis 1 van die oop-kruisverwysingsdatastel
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

### Struktuur

```typescript:no-line-numbers title="dataset-chapter.ts"
export interface DatasetBookChapter {
    /**
     * Die datastelinligting vir die boekhoofstuk.
     */
    dataset: Dataset;

    /**
     * Die boekinligting vir die boekhoofstuk.
     */
    book: DatasetBook;

    /**
     * Die skakel na hierdie hoofstuk.
     */
    thisChapterLink: string;

    /**
     * Die skakel na die volgende hoofstuk.
     * Nul as dit die laaste hoofstuk in die datastel is.
     */
    nextChapterApiLink: string | null;

    /**
     * Die skakel na die vorige hoofstuk.
     * Nul as dit die eerste hoofstuk in die datastel is.
     */
    previousChapterApiLink: string | null;

    /**
     * Die aantal verse wat die hoofstuk bevat.
     */
    numberOfVerses: number;

    /**
     * Die inligting vir die hoofstuk.
     */
    chapter: DatasetChapterData;
}

interface DatasetChapterData {
    /**
     * Die nommer van die hoofstuk.
     */
    number: number;

    /**
     * Die inhoud van die hoofstuk.
     */
    content: DatasetVerse[];
}

interface DatasetVerse {
    /**
     * Die nommer van die vers.
     */
    verse: number;

    /**
     * Die kruisverwysings vir die vers.
     *
     * Gesorteer volgens telling, aflopend.
     */
    references: DatasetReference[];
}

interface DatasetReference {
    /**
     * Die ID van die boek waarna verwys word.
     */
    book: string;

    /**
     * Die hoofstuknommer.
     */
    chapter: number;

    /**
     * Die versnommer.
     * As `endVerse` teenwoordig is, dan is dit die vers waar die verwysing begin.
     */
    verse: number;

    /**
     * Die vers waar die verwysing eindig.
     */
    endVerse?: number;

    /**
     * Die relevansietelling vir die verwysing.
     */
    score?: number;
}
```

### Voorbeeld

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

## Entiteite

Sommige datastelle – soos die [Theographic Bible Metadata-](https://github.com/robertrouse/theographic-bible-metadata) datastel ( `theographic` ) – bevat entiteite: mense, plekke, gebeure en mensegroepe, tesame met die verwantskappe tussen hulle en die Bybelverse wat hulle noem.

Datastelle wat entiteite bevat, sluit `listOfPeopleApiLink` , `listOfPlacesApiLink` , `listOfEventsApiLink` en `listOfPeopleGroupsApiLink` eienskappe in hul inskrywing in `/api/available_datasets.json` .

Entiteitsdatastelle verskaf ook hoofstuk-gerigte data: `/api/d/{dataset}/books.json` lys die boeke waarvan die hoofstukke entiteitsdata bevat, en `/api/d/{dataset}/{book}/{chapter}.json` gee die mense, plekke en gebeure terug wat in daardie hoofstuk verskyn, saam met die versnommers waar elkeen genoem word. Sien [Kry die Entiteite in 'n Hoofstuk](#get-the-entities-in-a-chapter) .

Entiteite verwys na Bybelgedeeltes deur dieselfde boek-ID's, hoofstuknommers en versnommers as die res van die API te gebruik, sodat hulle met enige vertaling gekombineer kan word. Hulle verwys na mekaar deur entiteitverwysings te gebruik:

```typescript:no-line-numbers title="entity-shared.ts"
export interface DatasetEntityRef {
    /**
     * Die ID van die entiteit waarna verwys word.
     */
    id: string;

    /**
     * Die tipe entiteit waarna verwys word.
     * Stem ooreen met die versamelingsegment van die entiteit se API-skakel, sodat die skakel as `/api/d/{dataset}/{type}/{id}.json` gekonstrueer kan word.
     */
    type: 'people' | 'places' | 'events' | 'groups';

    /**
     * Die naam van die entiteit waarna verwys word.
     */
    name?: string;

    /**
     * Die API-skakel vir die entiteit waarna verwys word.
     */
    apiLink?: string;
}

export interface VerseRef {
    /**
     * Die ID van die boek (GEN, EXO, ens.).
     */
    book: string;

    /**
     * Die hoofstuknommer waarmee die verwysing begin.
     */
    chapter: number;

    /**
     * Die versnommer waarmee die verwysing begin.
     */
    verse: number;

    /**
     * Die vers waar die verwysing eindig.
     * Opeenvolgende verse in dieselfde hoofstuk word in 'n enkele verwysing saamgevoeg.
     */
    endVerse?: number;
}
```

## Kry die entiteite in 'n hoofstuk

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

Vir entiteitsdatastelle, kry die mense, plekke en gebeure wat in 'n enkele hoofstuk verskyn, saam met die versnommers in die hoofstuk waar elkeen genoem word.

-   `dataset` die ID van die datastel (bv. `theographic` ).
-   `book` is die ID van die boek (bv. `GEN` vir Genesis).
-   `chapter` is die numeriese hoofstuknommer (bv. `1` vir die eerste hoofstuk).

Die lys van boeke en hoofstukke wat entiteitsdata het, is beskikbaar vanaf `GET https://bible.helloao.org/api/d/{dataset}/books.json` , wat dieselfde struktuur as [die eindpunt van die datastelboek](#list-books-in-a-dataset) volg. Vir entiteitsdatastelle is `totalNumberOfVerses` die aantal verse wat deur ten minste een entiteit genoem word en `totalNumberOfReferences` is die totale aantal entiteitsversvermeldings.

### Kode Voorbeeld

::: code-tabs#taal

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter-entities.js"
const dataset = 'theographic';
const book = 'GEN';
const chapter = 2;

// Kry die mense, plekke en gebeure wat in Genesis 2 verskyn
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

### Struktuur

```typescript:no-line-numbers title="dataset-chapter-entities.ts"
export interface DatasetEntityBookChapter {
    /**
     * Die datastelinligting vir die boekhoofstuk.
     */
    dataset: Dataset;

    /**
     * Die boekinligting vir die boekhoofstuk.
     */
    book: DatasetBook;

    /**
     * Die entiteitsdata vir die hoofstuk.
     */
    chapter: DatasetEntityChapterData;

    /**
     * Die skakel na hierdie hoofstuk.
     */
    thisChapterLink: string;

    /**
     * Die skakel na die volgende hoofstuk.
     * Nul as dit die laaste hoofstuk in die datastel is.
     */
    nextChapterApiLink: string | null;

    /**
     * Die skakel na die vorige hoofstuk.
     * Nul as dit die eerste hoofstuk in die datastel is.
     */
    previousChapterApiLink: string | null;

    /**
     * Die aantal mense, plekke en gebeurtenisse wat in die hoofstuk verskyn.
     */
    numberOfPeople: number;
    numberOfPlaces: number;
    numberOfEvents: number;
}

interface DatasetEntityChapterData {
    /**
     * Die nommer van die hoofstuk.
     */
    number: number;

    /**
     * Die mense wat in die hoofstuk verskyn.
     * Gesorteer volgens die eerste vers waarin hulle verskyn.
     */
    people: ChapterPerson[];

    /**
     * Die plekke wat in die hoofstuk verskyn.
     * Gesorteer volgens die eerste vers waarin hulle verskyn.
     */
    places: ChapterPlace[];

    /**
     * Die gebeure wat in die hoofstuk voorkom.
     * Gesorteer volgens die eerste vers waarin hulle verskyn.
     */
    events: ChapterEvent[];
}

interface ChapterPerson {
    /**
     * Die persoon se ID.
     */
    id: string;

    /**
     * Die naam van die persoon.
     */
    name: string;

    /**
     * Of die persoon se naam 'n eienaam is.
     */
    isProperName?: boolean;

    /**
     * Die geslag van die persoon.
     */
    gender?: string;

    /**
     * Die jaar waarin die persoon gebore is en die jaar waarin hulle gesterf het.
     * Negatiewe getalle is jare v.C. Positiewe getalle is jare n.C.
     */
    birthYear?: number;
    deathYear?: number;

    /**
     * Die API-skakel vir die persoon.
     */
    apiLink: string;

    /**
     * Die nommers van die verse in die hoofstuk wat die persoon noem.
     * Gesorteer in stygende volgorde.
     */
    verses: number[];
}

interface ChapterPlace {
    /**
     * Die ID van die plek.
     */
    id: string;

    /**
     * Die naam van die plek.
     */
    name: string;

    /**
     * Die tipe geografiese kenmerk wat die plek is.
     */
    featureType?: string;

    /**
     * Die breedtegraad en lengtegraad van die plek.
     */
    latitude?: number;
    longitude?: number;

    /**
     * Die API-skakel vir die plek.
     */
    apiLink: string;

    /**
     * Die nommers van die verse in die hoofstuk wat die plek noem.
     * Gesorteer in stygende volgorde.
     */
    verses: number[];
}

interface ChapterEvent {
    /**
     * Die ID van die gebeurtenis.
     */
    id: string;

    /**
     * Die naam van die geleentheid.
     */
    name: string;

    /**
     * Die datum waarop die geleentheid begin het.
     */
    startDate?: string;

    /**
     * Die API-skakel vir die geleentheid.
     */
    apiLink: string;

    /**
     * Die nommers van die verse in die hoofstuk wat die gebeurtenis beskryf.
     * Gesorteer in stygende volgorde.
     */
    verses: number[];
}
```

### Voorbeeld

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

## Lys mense in 'n datastel

`GET https://bible.helloao.org/api/d/{dataset}/people.json`

Kry die lys van mense wat beskikbaar is vir die gegewe datastel.

-   `dataset` die ID van die datastel (bv. `theographic` ).

### Kode Voorbeeld

::: code-tabs#taal

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-people.js"
const dataset = 'theographic';

// Kry die lys van mense vir die teografiese datastel
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

### Struktuur

```typescript:no-line-numbers title="dataset-people.ts"
export interface DatasetPeople {
    /**
     * Die datastelinligting vir die mense.
     */
    dataset: Dataset;

    /**
     * Die lys van mense wat beskikbaar is vir die datastel.
     */
    people: DatasetPersonSummary[];
}

interface DatasetPersonSummary {
    /**
     * Die persoon se ID.
     */
    id: string;

    /**
     * Die naam van die persoon.
     */
    name: string;

    /**
     * Of die persoon se naam 'n eienaam is.
     */
    isProperName?: boolean;

    /**
     * Die geslag van die persoon.
     */
    gender?: string;

    /**
     * Die aantal Bybelverwysings wat die persoon noem.
     */
    numberOfReferences: number;

    /**
     * Die API-skakel vir die persoon.
     */
    thisPersonApiLink: string;
}
```

### Voorbeeld

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

## Kry 'n Persoon uit 'n Datastel

`GET https://bible.helloao.org/api/d/{dataset}/people/{person}.json`

Kry die inligting oor 'n enkele persoon, insluitend die Bybelverwysings wat hulle noem en hul verhoudings met ander mense, plekke, gebeure en mensegroepe.

-   `dataset` die ID van die datastel (bv. `theographic` ).
-   `person` die ID van die persoon (bv. `paul_2479` ).

### Kode Voorbeeld

::: code-tabs#taal

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-person.js"
const dataset = 'theographic';
const person = 'paul_2479';

// Kry die inligting oor Paulus uit die teografiese datastel
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

### Struktuur

```typescript:no-line-numbers title="dataset-person.ts"
export interface DatasetPersonResponse {
    /**
     * Die datastelinligting vir die persoon.
     */
    dataset: Dataset;

    /**
     * Die inligting oor die persoon.
     */
    person: DatasetPerson;

    /**
     * Die API-skakel vir hierdie persoon.
     */
    thisPersonApiLink: string;
}

interface DatasetPerson {
    /**
     * Die persoon se ID.
     */
    id: string;

    /**
     * Die naam van die persoon.
     */
    name: string;

    /**
     * Ander name waarmee die persoon genoem word.
     */
    alsoCalled?: string[];

    /**
     * Of die persoon se naam 'n eienaam is.
     */
    isProperName?: boolean;

    /**
     * Die geslag van die persoon.
     */
    gender?: string;

    /**
     * Die beskrywing van die persoon. Elke string is 'n paragraaf.
     */
    description?: string[];

    /**
     * Die jaar waarin die persoon gebore is en die jaar waarin hulle gesterf het.
     * Negatiewe getalle is jare v.C. Positiewe getalle is jare n.C.
     */
    birthYear?: number;
    deathYear?: number;

    /**
     * Die vroegste en jongste jare waarin die persoon genoem word.
     */
    minYear?: number;
    maxYear?: number;

    /**
     * Die plek waar die persoon gebore is en gesterf het.
     */
    birthPlace?: DatasetEntityRef;
    deathPlace?: DatasetEntityRef;

    /**
     * Die persoon se familieverhoudings.
     */
    father?: DatasetEntityRef[];
    mother?: DatasetEntityRef[];
    partners?: DatasetEntityRef[];
    children?: DatasetEntityRef[];
    siblings?: DatasetEntityRef[];
    halfSiblingsSameMother?: DatasetEntityRef[];
    halfSiblingsSameFather?: DatasetEntityRef[];

    /**
     * Die mensegroepe waarvan die persoon 'n lid is.
     */
    memberOf?: DatasetEntityRef[];

    /**
     * Die gebeure waaraan die persoon deelgeneem het.
     */
    events?: DatasetEntityRef[];

    /**
     * Die lys van Bybelverwysings wat die persoon noem.
     * Gesorteer volgens boekvolgorde, hoofstuk en vers.
     */
    references: VerseRef[];
}
```

### Voorbeeld

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

## Lys plekke in 'n datastel

`GET https://bible.helloao.org/api/d/{dataset}/places.json`

Kry die lys van plekke wat beskikbaar is vir die gegewe datastel.

-   `dataset` die ID van die datastel (bv. `theographic` ).

### Struktuur

```typescript:no-line-numbers title="dataset-places.ts"
export interface DatasetPlaces {
    /**
     * Die datastelinligting vir die plekke.
     */
    dataset: Dataset;

    /**
     * Die lys van plekke wat beskikbaar is vir die datastel.
     */
    places: DatasetPlaceSummary[];
}

interface DatasetPlaceSummary {
    /**
     * Die ID van die plek.
     */
    id: string;

    /**
     * Die naam van die plek.
     */
    name: string;

    /**
     * Die tipe geografiese kenmerk wat die plek is.
     * Byvoorbeeld, "Stad", "Streek", "Berg", "Water", ens.
     */
    featureType?: string;

    /**
     * Die breedtegraad en lengtegraad van die plek.
     */
    latitude?: number;
    longitude?: number;

    /**
     * Die aantal Bybelverwysings wat die plek noem.
     */
    numberOfReferences: number;

    /**
     * Die API-skakel vir die plek.
     */
    thisPlaceApiLink: string;
}
```

## Kry 'n plek uit 'n datastel

`GET https://bible.helloao.org/api/d/{dataset}/places/{place}.json`

Kry die inligting oor 'n enkele plek, insluitend die Bybelverwysings wat dit en verwante mense en gebeure noem.

-   `dataset` die ID van die datastel (bv. `theographic` ).
-   `place` die ID van die plek (bv. `jerusalem_636` ).

### Struktuur

```typescript:no-line-numbers title="dataset-place.ts"
export interface DatasetPlaceResponse {
    /**
     * Die datastelinligting vir die plek.
     */
    dataset: Dataset;

    /**
     * Die inligting oor die plek.
     */
    place: DatasetPlace;

    /**
     * Die API-skakel vir hierdie plek.
     */
    thisPlaceApiLink: string;
}

interface DatasetPlace {
    /**
     * Die ID van die plek.
     */
    id: string;

    /**
     * Die naam van die plek.
     */
    name: string;

    /**
     * Die naam van die plek soos dit in die King James-weergawe en die English Standard Version verskyn.
     */
    kjvName?: string;
    esvName?: string;

    /**
     * Ander name waarmee die plek genoem word.
     */
    aliases?: string[];

    /**
     * Die tipe geografiese kenmerk wat die plek is.
     */
    featureType?: string;
    featureSubType?: string;

    /**
     * Die breedtegraad en lengtegraad van die plek, en hoe presies hulle is.
     */
    latitude?: number;
    longitude?: number;
    precision?: string;

    /**
     * Die beskrywing van die plek. Elke string is 'n paragraaf.
     */
    description?: string[];

    /**
     * Die kommentaar oor die plek van die outeurs van die datastel.
     */
    comment?: string;

    /**
     * Die wortelplek vir hierdie plek.
     * Verskillende name vir dieselfde geografiese ligging deel dieselfde stamplek.
     */
    rootPlace?: DatasetEntityRef;

    /**
     * Die plek waarvan hierdie plek 'n duplikaat is.
     */
    duplicateOf?: DatasetEntityRef;

    /**
     * Die mense wat op die plek was, daar gebore is, of daar gesterf het.
     */
    people?: DatasetEntityRef[];
    peopleBorn?: DatasetEntityRef[];
    peopleDied?: DatasetEntityRef[];

    /**
     * Die gebeure wat op die plek plaasgevind het.
     */
    events?: DatasetEntityRef[];

    /**
     * Die lys van Bybelverwysings wat die plek noem.
     * Gesorteer volgens boekvolgorde, hoofstuk en vers.
     */
    references: VerseRef[];
}
```

### Voorbeeld

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

## Lys gebeurtenisse in 'n datastel

`GET https://bible.helloao.org/api/d/{dataset}/events.json`

Kry die lys van gebeurtenisse wat beskikbaar is vir die gegewe datastel.

-   `dataset` die ID van die datastel (bv. `theographic` ).

### Struktuur

```typescript:no-line-numbers title="dataset-events.ts"
export interface DatasetEvents {
    /**
     * Die datastelinligting vir die gebeurtenisse.
     */
    dataset: Dataset;

    /**
     * Die lys van gebeurtenisse wat beskikbaar is vir die datastel.
     */
    events: DatasetEventSummary[];
}

interface DatasetEventSummary {
    /**
     * Die ID van die gebeurtenis.
     */
    id: string;

    /**
     * Die naam van die geleentheid.
     */
    name: string;

    /**
     * Die datum waarop die geleentheid begin het.
     * Negatiewe getalle is jare v.C. Positiewe getalle is jare n.C.
     * Meer spesifieke datums gebruik die `YYYY-MM-DD` formaat.
     */
    startDate?: string;

    /**
     * Die aantal Bybelverwysings wat die gebeurtenis beskryf.
     */
    numberOfReferences: number;

    /**
     * Die API-skakel vir die geleentheid.
     */
    thisEventApiLink: string;
}
```

## Kry 'n gebeurtenis vanaf 'n datastel

`GET https://bible.helloao.org/api/d/{dataset}/events/{event}.json`

Kry die inligting oor 'n enkele gebeurtenis, insluitend die Bybelverwysings wat dit en die verwante mense, plekke en mensegroepe beskryf.

-   `dataset` die ID van die datastel (bv. `theographic` ).
-   `event` die ID van die gebeurtenis (bv. `saul-is-converted_326` ).

### Struktuur

```typescript:no-line-numbers title="dataset-event.ts"
export interface DatasetEventResponse {
    /**
     * Die datastelinligting vir die gebeurtenis.
     */
    dataset: Dataset;

    /**
     * Die inligting oor die geleentheid.
     */
    event: DatasetEvent;

    /**
     * Die API-skakel vir hierdie gebeurtenis.
     */
    thisEventApiLink: string;
}

interface DatasetEvent {
    /**
     * Die ID van die gebeurtenis.
     */
    id: string;

    /**
     * Die naam van die geleentheid.
     */
    name: string;

    /**
     * Die datum waarop die geleentheid begin het.
     */
    startDate?: string;

    /**
     * Die duur van die gebeurtenis.
     * Byvoorbeeld, "1D" is een dag en "40Y" is veertig jaar.
     */
    duration?: string;

    /**
     * Die mense wat aan die geleentheid deelgeneem het.
     */
    participants?: DatasetEntityRef[];

    /**
     * Die plekke waar die gebeurtenis plaasgevind het.
     */
    locations?: DatasetEntityRef[];

    /**
     * Die mensegroepe wat aan die geleentheid deelgeneem het.
     */
    groups?: DatasetEntityRef[];

    /**
     * Die gebeurtenis waarvan hierdie gebeurtenis deel is.
     */
    partOf?: DatasetEntityRef;

    /**
     * Die gebeurtenis wat voor hierdie gebeurtenis plaasgevind het.
     */
    predecessor?: DatasetEntityRef;

    /**
     * Die lys van Bybelverwysings wat die gebeurtenis beskryf.
     * Gesorteer volgens boekvolgorde, hoofstuk en vers.
     */
    references: VerseRef[];
}
```

### Voorbeeld

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

## Lys mensegroepe in 'n datastel

`GET https://bible.helloao.org/api/d/{dataset}/groups.json`

Kry die lys van mensegroepe wat beskikbaar is vir die gegewe datastel.

-   `dataset` die ID van die datastel (bv. `theographic` ).

### Struktuur

```typescript:no-line-numbers title="dataset-people-groups.ts"
export interface DatasetPeopleGroups {
    /**
     * Die datastelinligting vir die mensegroepe.
     */
    dataset: Dataset;

    /**
     * Die lys van mensegroepe wat beskikbaar is vir die datastel.
     */
    groups: DatasetPeopleGroupSummary[];
}

interface DatasetPeopleGroupSummary {
    /**
     * Die ID van die mensegroep.
     */
    id: string;

    /**
     * Die naam van die mensegroep.
     */
    name: string;

    /**
     * Die aantal mense wat lede van die mensegroep is.
     */
    numberOfMembers: number;

    /**
     * Die API-skakel vir die mensegroep.
     */
    thisPeopleGroupApiLink: string;
}
```

## Kry 'n mensegroep vanaf 'n datastel

`GET https://bible.helloao.org/api/d/{dataset}/groups/{group}.json`

Kry die inligting oor 'n enkele mensegroep, insluitend die lede daarvan en die geleenthede waaraan die groep deelgeneem het.

-   `dataset` die ID van die datastel (bv. `theographic` ).
-   `group` die ID van die mensegroep (bv. `tribe-of-benjamin` ).

### Struktuur

```typescript:no-line-numbers title="dataset-people-group.ts"
export interface DatasetPeopleGroupResponse {
    /**
     * Die datastelinligting vir die mensegroep.
     */
    dataset: Dataset;

    /**
     * Die inligting oor die mensegroep.
     */
    group: DatasetPeopleGroup;

    /**
     * Die API-skakel vir hierdie mensegroep.
     */
    thisPeopleGroupApiLink: string;
}

interface DatasetPeopleGroup {
    /**
     * Die ID van die mensegroep.
     */
    id: string;

    /**
     * Die naam van die mensegroep.
     */
    name: string;

    /**
     * Die mense wat lede van die mensegroep is.
     */
    members?: DatasetEntityRef[];

    /**
     * Die gebeure waaraan die mensegroep deelgeneem het.
     */
    events?: DatasetEntityRef[];

    /**
     * Die lys van Bybelverwysings wat die mensegroep noem.
     * Gesorteer volgens boekvolgorde, hoofstuk en vers.
     */
    references: VerseRef[];
}
```

### Voorbeeld

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
