# Datastelle

Eindpunte vir die blaai van aanvullende Bybeldatastelle - soos kruisverwysings, Bybelse entiteite (mense, plekke, gebeure en mensegroepe), interlineêre woorde in die oorspronklike taal, leksikons en vers-van-die-dag-kandidate - en die ophaal van hul boeke, hoofstukinhoud, entiteite, leksikoninskrywings en verskategorieë.

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
     * Die API-bygevoegde notas vir die lisensie.
     * Nul of ongedefinieerd indien daar geen notas is nie.
     */
    licenseNotes?: string | null;

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
     * 0 vir datastelle wat nie kruisverwysings bevat nie.
     */
    totalNumberOfReferences: number;

    /**
     * Die totale aantal interlineêre woorde wat in hierdie datastel voorkom.
     * Weglaat as die datastel nie interlineêre woorde bevat nie.
     */
    totalNumberOfWords?: number;

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

    /**
     * Die API-skakel vir die lys van leksikoninskrywings in die datastel.
     * Weglaat as die datastel nie leksikoninskrywings bevat nie.
     */
    listOfLexiconApiLink?: string;

    /**
     * Die totale aantal leksikoninskrywings wat in die datastel voorkom.
     * Weglaat as die datastel nie leksikoninskrywings bevat nie.
     */
    totalNumberOfLexicon?: number;

    /**
     * Die API-skakel vir die lys van elke vers in die datastel, met sy kategorieë.
     * Weglaat as die verse van die datastel nie kategorieë het nie.
     */
    listOfVersesApiLink?: string;

    /**
     * Die API-skakel vir die lys van verskategorieë in die datastel.
     * Weglaat as die datastel nie verskategorieë bevat nie.
     */
    listOfCategoriesApiLink?: string;

    /**
     * Die totale aantal verskategorieë wat in die datastel vervat is.
     * Weglaat as die datastel nie verskategorieë bevat nie.
     */
    totalNumberOfCategories?: number;
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
            "numberOfBooks": 65,
            "totalNumberOfChapters": 381,
            "totalNumberOfVerses": 750,
            "totalNumberOfReferences": 0,
            "languageName": "English",
            "languageEnglishName": "English",
            "listOfVersesApiLink": "/api/d/verse-of-the-day/verses.json",
            "listOfCategoriesApiLink": "/api/d/verse-of-the-day/categories.json",
            "totalNumberOfCategories": 31
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

Vir kruisverwysingsdatastelle (soos `open-cross-ref` ), bevat die hoofstuk die lys van kruisverwysings vir elke vers. Vir interlineêre datastelle (soos `bsb-interlinear` ), bevat die hoofstuk die woorde van elke vers in die oorspronklike taal - sien [Interlineêre datastelle](#interlinear-datasets) . Vir entiteitsdatastelle (soos `theographic` ), bevat die hoofstuk die mense, plekke en gebeure wat in die hoofstuk verskyn - sien [Kry die Entiteite in 'n Hoofstuk](#get-the-entities-in-a-chapter) . Vir die `verse-of-the-day` datastel bevat die hoofstuk die vers van die dag-kandidate in die hoofstuk en hul kategorieë - sien [Vers van die Dag](#verse-of-the-day) .

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

/**
 * 'n Vers dra `references` (kruisverwysingsdatastelle), `words` (interlineêre datastelle) of `categories` (die vers-van-die-dag-datastel).
 * Kontroleer watter een teenwoordig is met `'words' in verse` of `'categories' in verse` .
 */
type DatasetVerse =
    | DatasetReferencesVerse
    | DatasetWordsVerse
    | DatasetCategoriesVerse;

interface DatasetReferencesVerse {
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

interface DatasetWordsVerse {
    /**
     * Die nommer van die vers.
     */
    verse: number;

    /**
     * Die woorde van die vers in die oorspronklike taal, in volgorde van die oorspronklike teks.
     * Sien "Interlineêre datastelle" hieronder.
     */
    words: InterlinearWord[];
}

interface DatasetCategoriesVerse {
    /**
     * Die nommer van die vers.
     * As `endVerse` teenwoordig is, dan is dit die vers waar die gedeelte begin.
     */
    verse: number;

    /**
     * Die vers waarmee die gedeelte eindig.
     * Weglaat indien die inskrywing 'n enkele vers is.
     */
    endVerse?: number;

    /**
     * Die ID's van die kategorieë waaraan die vers behoort, mees relevante eerste.
     * Sien "Vers van die Dag" hieronder.
     */
    categories: string[];

    /**
     * Die eerste jaar wat die vers die vers van die dag kan wees.
     * Weglaat as die vers nog altyd in die lys was.
     */
    addedIn?: number;

    /**
     * Die eerste jaar wat die vers nie meer die vers van die dag kan wees nie.
     * Verwyderde verse bly in die datastel sodat die verse van vorige jare steeds gekies kan word.
     * Weglaat indien die vers nie van die lys verwyder is nie.
     */
    removedIn?: number;
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

// Sien "Interlineêre Datastelle" hieronder vir die struktuur van InterlinearWord.
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

Die [History Globe-](https://historyglobe.app) datastel ( `history-globe` ) bevat slegs plekke: die plekke wat in die Bybel genoem word, met hul koördinate en die verse wat hulle benoem. Die plek-ID's (bv. `a15257a` vir Jerusalem) is History Globe se stabiele plek-ID's, dieselfde wat sy eie [oop data-API](https://historyglobe.app/docs/api.html) gebruik, so hulle verander nie wanneer 'n naam reggestel word nie. Die `featureType` waardes volg die waardes wat die Theographic-datastel gebruik ( `City` , `Region` , `Water` , ensovoorts), en `featureSubType` dra die meer spesifieke soort waar daar een is (bv. `River` , `Gate` , `Spring` ).

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

### Geskiedenis Globe Toeskrywing

Die History Globe-data word gelisensieer onder [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) . Indien u dit gebruik, gee erkenning aan History Globe ( https://historyglobe.app ) en die OpenBible.info Bybel-geokoderingsdata waarop dit voortbou, en let op enige veranderinge. Die `licenseNotes` eienskap van die datastel dra die erkenning.

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

## Interlineêre datastelle

Die Bereaanse interlineêre datastel ( `bsb-interlinear` ) lys die woorde in die oorspronklike taal (Hebreeus, Aramees en Grieks) van elke vers van die Bybel, in die volgorde waarin hulle in die oorspronklike teks verskyn. Elke woord het sy transliterasie, grammatikale ontleding, [Strong se nommer](https://en.wikipedia.org/wiki/Strong%27s_Concordance) en die Engelse frase wat die [Bereaanse Standaard Bybel](https://berean.bible) daarvoor gebruik.

Die datastel gebruik dieselfde eindpunte as ander datastelle:

-   `GET https://bible.helloao.org/api/d/bsb-interlinear/books.json` lys die 66 boeke.
-   `GET https://bible.helloao.org/api/d/bsb-interlinear/{book}/{chapter}.json` (bv. `/api/d/bsb-interlinear/GEN/1.json` ) gee die hoofstuk terug, met `{ verse, words }` vir elke vers. Die antwoord is 'n [datastel hoofstuk](#get-a-chapter-from-a-dataset) .

Die woorddata kom van die [Berean Standard Bible interlineêre tabelle](https://bereanbible.com/) , wat in die publieke domein is. Strong se nommers vir die woorde word in die [leksikon](#lexicon) opgesoek ( `stepbible-lexicon` ).

### Struktuur

```typescript:no-line-numbers title="interlinear-word.ts"
interface InterlinearWord {
    /**
     * Die 1-gebaseerde rang van die woord in die oorspronklike teks se volgorde.
     * Woorde word in hierdie volgorde gelys.
     */
    pos: number;

    /**
     * Die 1-gebaseerde rang van die woord in die Berean Standard Bible se Engelse volgorde.
     */
    bsbPos: number;

    /**
     * Die taal van die woord.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * Die woord in die oorspronklike skrif. NFC-genormaliseer.
     */
    text: string;

    /**
     * Die transliterasie van die woord.
     */
    transliteration: string | null;

    /**
     * Die kort grammatikale ontledingskode van die woord, bv. "N-mp" of "V-Qal-Perf-3ms".
     */
    parsing: string | null;

    /**
     * Die uitgespelde grammatikale ontleding van die woord.
     */
    parsingFull: string | null;

    /**
     * Die nul-gevulde Strong-nommer van die woord, bv. "H0430" of "G3056".
     * Nul-gevuld, wat ooreenstem met die KJV se `.words.json` waardes.
     * Ander vertalings se waardes benodig dalk nul-opvulling en agtervoegsel-strooping voor samevoeging.
     * Nul wanneer die bron die woord geen Strong se nommer gee nie (dit is die geval vir sommige woorde wat agtervoegsels is, soos voornaamwoord-agtervoegsels).
     */
    strongs: string | null;

    /**
     * Die Berean Standard Bible se Engelse frase vir die woord.
     * Null wanneer die BSB die woord onvertaal laat (soos die Hebreeuse direkte voorwerpmerker).
     */
    gloss: string | null;
}
```

### Voorbeeld

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

### Woorde aan vertalings koppel

Interlineêre `strongs` waardes word met nul opgevul (bv. `H0430` ). Dit stem ooreen met die `strongs` waardes in die KJV se woordaantekeninge ( `/api/eng_kjv/{book}/{chapter}.words.json` ). Ander vertalings se waardes benodig moontlik nul-opvulling en agtervoegselstroop (bv. `H430` of `H1961a` tot `H0430` en `H1961` ) voordat hulle saamgevoeg kan word.

-   **KJV.** Vir die King James-weergawe ( `eng_kjv` en `eng_kja` ), verbind die Strong-nommers in 'n hoofstuk se `.words.json` lêer met die `strongs` van die interliniêre woorde van dieselfde vers. Byvoorbeeld, elke Strong-nommer wat in `/api/eng_kjv/GEN/1.words.json` vir vers 1 ( `H7225` , `H1254` , `H0430` , `H0853` , `H8064` , `H0776` ) geannoteer is, verskyn as 'n `strongs` waarde tussen die woorde van vers 1 in `/api/d/bsb-interlinear/GEN/1.json` .
-   **Berean Standard Bible.** Elke woord se `gloss` is die BSB-frase vir daardie woord. Loop die vers se woorde in `bsbPos` volgorde en pas elke `gloss` by die vers-teks van die BSB-vertaling om te vind waar die woord se vertaling staan.

Die nommering van die twee bronne stem nie altyd ooreen nie. Byvoorbeeld, die KJV-etikette "was" as `G2258` waar die Bereaanse tabel `G1510` het. 'n Paar koppelings mis as gevolg van verskille soos hierdie.

### Toeskrywing

Die Bereaanse interlineêre tabelle is in die publieke domein. Die [leksikon](#lexicon) is gelisensieer onder CC BY 4.0 en vereis erkenning.

## Leksikon

Die STEPBible-leksikondatastel ( `stepbible-lexicon` ) bevat die Hebreeuse, Aramese en Griekse kortleksikons (TBESH en TBESG) van [STEPBible.org](https://www.stepbible.org/) by Tyndale House, Cambridge. Dit het een inskrywing vir elke basis Strong se getal, en elke inskrywing het een of meer betekenisse met die lemma, transliterasie, woordsoort, Engelse glans en 'n definisie.

Enige nul-opgevulde `strongs` waarde van 'n [interlineêre woord](#interlinear-datasets) wat 'n leksikoninskrywing het, kan by `/api/d/stepbible-lexicon/lexicon/{strongs}.json` opgesoek word sonder om te herformateer. Dieselfde geld vir die KJV se `.words.json` waardes; ander vertalings se waardes benodig dalk eers nul-opvulling en agtervoegselstroop. Griekse inskrywings wat die leksikon sonder 'n Strong-nommer byvoeg, word nie gepubliseer nie.

Datastelle wat leksikoninskrywings bevat, sluit `listOfLexiconApiLink` en `totalNumberOfLexicon` in hul inskrywing in `/api/available_datasets.json` .

### Toeskrywing

Die leksikondata word gelisensieer onder [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) . Indien u dit gebruik, gee erkenning aan STEPBible.org / Tyndale House, Cambridge, en let op enige veranderinge. Die `licenseNotes` eienskap van die datastel dra die erkenning.

## Lys Leksikoninskrywings in 'n Datastel

`GET https://bible.helloao.org/api/d/{dataset}/lexicon.json`

Kry die lys van leksikoninskrywings wat beskikbaar is vir 'n datastel.

-   `dataset` die ID van die datastel (bv. `stepbible-lexicon` ).

### Kode Voorbeeld

::: code-tabs#taal

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

### Struktuur

```typescript:no-line-numbers title="dataset-lexicon.ts"
export interface DatasetLexicon {
    /**
     * Die datastelinligting vir die leksikon.
     */
    dataset: Dataset;

    /**
     * Die lys van leksikoninskrywings wat vir die datastel beskikbaar is.
     */
    lexicon: DatasetLexiconEntrySummary[];
}

export interface DatasetLexiconEntrySummary {
    /**
     * Die nul-gevulde Strong-nommer van die leksikoninskrywing. bv. "H0430".
     */
    id: string;

    /**
     * Die taal van die leksikoninskrywing.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * Die naam van die leksikoninskrywing.
     * Dit is die lemma van die inskrywing se eerste betekenis.
     */
    name: string;

    /**
     * Die API-skakel vir die leksikoninskrywing.
     */
    apiLink: string;
}
```

### Voorbeeld

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

## Kry 'n leksikoninskrywing vanaf 'n datastel

`GET https://bible.helloao.org/api/d/{dataset}/lexicon/{strongs}.json`

Kry die leksikoninskrywing vir 'n enkele basis Strong se getal, met al sy sintuie.

-   `dataset` die ID van die datastel (bv. `stepbible-lexicon` ).
-   `strongs` is die nul-gevulde Strong-getal (bv. `H0430` vir die Hebreeuse woord _elohim_, of `G3056` vir die Griekse woord _logos_).

### Kode Voorbeeld

::: code-tabs#taal

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

### Struktuur

```typescript:no-line-numbers title="dataset-lexicon-entry.ts"
export interface DatasetLexiconEntry {
    /**
     * Die datastelinligting vir die leksikoninskrywing.
     */
    dataset: Dataset;

    /**
     * Die leksikon-inskrywing.
     */
    entry: DatasetLexiconEntryContent;

    /**
     * Die API-skakel vir hierdie leksikoninskrywing.
     */
    thisLexiconEntryApiLink: string;
}

export interface DatasetLexiconEntryContent {
    /**
     * Die nul-gevulde Strong-nommer van die inskrywing. bv. "H0430".
     */
    id: string;

    /**
     * Die taal van die inskrywing.
     * Dit is die taal van die inskrywing se eerste sin.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * Die sintuie van die inskrywing, in ID-volgorde.
     */
    senses: DatasetLexiconSense[];
}

export interface DatasetLexiconSense {
    /**
     * Die uitgebreide ID van die sintuig. bv. "H0001G".
     * Gelyk aan die basis van Strong se getal wanneer die getal 'n enkele betekenis het.
     */
    id: string;

    /**
     * Die taal van die sintuie.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * Die lemma van die sin in die oorspronklike skrif.
     */
    lemma: string;

    /**
     * Die transliterasie van die lemma.
     */
    transliteration: string | null;

    /**
     * Die woordsoort (morfologie) kode van die sin.
     */
    partOfSpeech: string | null;

    /**
     * Die kort Engelse glans van die sin.
     */
    gloss: string | null;

    /**
     * Die definisie van die sin as gewone teks.
     * Paragrawe word deur leë lyne geskei. Opmaak in die bronkode word verwyder.
     */
    definition: string;
}
```

### Voorbeeld

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

## Vers van die Dag

Die vers van die dag-datastel ( `verse-of-the-day` ) is 'n saamgestelde lys van bekende verse en kort gedeeltes (hoogstens drie verse) wat goeie kandidate maak vir 'n "vers van die dag": meer as 640 vir elke dag van die jaar, en meer as 100 vir Christelike vakansiedae. Elkeen maak op sy eie sin.

Elke vers vir elke dag het een tot drie kategorieë, die mees relevante eerste, uit hierdie vaste stel:

| ID            | Beskrywing                                                       |
| ------------- | ---------------------------------------------------------------- |
| `comfort`     | God se nabyheid en sorg in hartseer, moeilikheid en eensaamheid. |
| `courage`     | Standvastig staan ​​en nie bang wees nie.                        |
| `faith`       | Vertrou op God en Sy beloftes.                                   |
| `forgiveness` | God se vergifnis van sonde en die vergifnis van ander.           |
| `gratitude`   | Dank aan God.                                                    |
| `guidance`    | God wat ons stappe, planne en besluite lei.                      |
| `hope`        | Vertroue in die toekoms wat God belowe het.                      |
| `inspiration` | Aanmoediging om die geloof uit te leef en goed te doen.          |
| `joy`         | Blydskap en vreugde in God.                                      |
| `love`        | God se liefde vir ons en ons liefde vir God en ander.            |
| `peace`       | Rus, stilte en vryheid van angs.                                 |
| `praise`      | Aanbidding en verklarings van God se grootheid.                  |
| `prayer`      | Om God aan te roep en Sy belofte om te hoor.                     |
| `provision`   | God wat voorsien wat ons nodig het.                              |
| `salvation`   | Verlossing, genade en nuwe lewe in Christus.                     |
| `strength`    | God wat krag en uithouvermoë gee.                                |
| `wisdom`      | Goddelike wysheid en praktiese onderrig vir die lewe.            |

Vakansiedae het hul eie kategorieë. Op 'n vakansiedag is die vers van die dag een van die vakansiedag se verse, en daardie verse word nie op ander dae gebruik nie. 'n Vakansiedag duur gewoonlik een dag; Na Opstandingsondag duur die drie dae na Opstandingsondag, dus lys dit al drie datums. Elke vakansiekategorie het 'n `holiday` met sy datums: vakansiedae op dieselfde datum elke jaar het 'n `month` en `day` , en vakansiedae waarvan die datum elke jaar verander (omdat hulle afhang van Opstandingsondag of Advent) lys hul `dates` in die Gregoriaanse kalender, vooraf bereken vir 2026 tot 2125.

| ID                         | Vakansie                 | Datum                                   |
| -------------------------- | ------------------------ | --------------------------------------- |
| `epiphany`                 | Epifanie                 | 6 Januarie                              |
| `ash-wednesday`            | Aswoensdag               | 46 dae voor die Opstandingsondag        |
| `palm-sunday`              | Palmsondag               | Die Sondag voor die Opstandingsondag    |
| `maundy-thursday`          | Witte Donderdag          | Die Donderdag voor die Opstandingsondag |
| `good-friday`              | Goeie Vrydag             | Die Vrydag voor die Opstandingsondag    |
| `resurrection-sunday`      | Opstandingsondag         | Paassondag                              |
| `post-resurrection-sunday` | Na die Opstanding Sondag | Die drie dae na die Opstandingsondag    |
| `ascension-day`            | Hemelvaartdag            | 39 dae na die Opstandingsondag          |
| `pentecost`                | Pinkster                 | 49 dae na die Opstandingsondag          |
| `all-hallows-eve`          | Allerheiligeaand         | 31 Oktober                              |
| `all-saints-day`           | Allerheiligedag          | 1 November                              |
| `advent-sunday`            | Eerste Sondag van Advent | Die vierde Sondag voor Kersfees         |
| `christmas-eve`            | Kersaand                 | 24 Desember                             |
| `christmas`                | Kersfees                 | 25 Desember                             |

Die datastel bevat slegs verwysings, nie vers teks nie, so dit werk met elke vertaling. Versnommers gebruik die standaard Engelse nommering (dieselfde as die BSB). Die data kan op drie maniere gelees word:

-   [`/api/d/verse-of-the-day/verses.json`](#list-verses-in-a-dataset) lys elke vers in die datastel met sy kategorieë, en die vakansiedae met hul datums, in een lêer.
-   [`/api/d/verse-of-the-day/categories/{category}.json`](#get-a-category-from-a-dataset) lys elke vers in 'n kategorie. Dit is die maklikste manier om 'n vers van die dag uit een kategorie te kies.
-   [`/api/d/verse-of-the-day/{book}/{chapter}.json`](#get-a-chapter-from-a-dataset) lys die kandidate in 'n hoofstuk, met hul kategorieë. Slegs hoofstukke wat 'n kandidaat bevat, is beskikbaar; gebruik die boek se hoofstukskakels of `/api/d/verse-of-the-day/books.json` om hulle te vind.

Datastelle wat verskategorieë bevat, sluit `listOfVersesApiLink` , `listOfCategoriesApiLink` en `totalNumberOfCategories` in hul inskrywing in `/api/available_datasets.json` .

### Die keuse van 'n vers van die dag

Die API is gemaak van statiese lêers, so dit kies nie 'n vers vir jou nie. In plaas daarvan is daar 'n konvensie vir die keuse van een, sodat elke toepassing wat dit volg dieselfde vers op dieselfde dag wys. Toepassings is vry om anders te kies; die konvensie gee hulle net 'n gedeelde verstekwaarde.

Die konvensie kies uit die verse en vakansiedae in `/api/d/verse-of-the-day/verses.json` Op 'n vakansiedag kies dit een van die vakansiedag se verse en gaan jaar op jaar deur hulle, so 'n vakansiedag het elke jaar 'n ander vers totdat al sy verse gebruik is. Op ander dae kry elke jaar sy eie skommeling van die verse wat daardie jaar in gebruik is (georden volgens 'n huts van elke vers se verwysing, die jaar en 'n opsionele saad), en die vers van die dag is die een op die datum se dag van die jaar in daardie skommeling. Die datastel het meer as 366 verse vir elke dag wat elke jaar in gebruik is, so 'n vers herhaal nooit binne 'n kalenderjaar nie, die volgorde verander elke jaar, en dieselfde datum gee altyd dieselfde vers. Nuwe verse word bygevoeg (met `addedIn` ) en oues verwyder (met `removedIn` ) slegs van 'n jaar wat nog nie begin het nie, so die vers van die dag vir 'n vorige datum verander nooit.

Die [Vers van die Dag Konvensie](./verse-of-the-day-convention.md) bladsy spesifiseer die algoritme stap vir stap, met pseudokode en toetswaardes, sodat jy dit in enige taal kan implementeer.

Om jou eie volgorde te gebruik, kies jou eie saad (byvoorbeeld die naam van jou toepassing): dit gee 'n ander mengsel met dieselfde waarborge. Jy kan ook uit 'n enkele kategorie se verse kies, maar elke kategorie het minder verse as wat daar dae in 'n jaar is, so die verse word gouer herhaal.

Die SDK's volg die konvensie:

```ts:no-line-numbers title="verse-of-the-day.js"
import { FreeUseBibleApi } from 'free-use-bible-api';

const api = new FreeUseBibleApi();

// 'n Datum as JJJJ-MM-DD, of 'n Datum (die plaaslike kalenderdatum word gebruik). Standaard is vandag.
const ref = await api.getVerseOfTheDay('2026-01-01');

// Kry die teks van die vers uit 'n vertaling.
const chapter = await api.getTranslationBookChapter('BSB', ref.book, ref.chapter);
const verses = chapter.chapter.content.filter(
    (c) =>
        c.type === 'verse' &&
        c.number >= ref.verse &&
        c.number <= (ref.endVerse ?? ref.verse)
);
console.log(ref, verses);
```

-   `getVerseOfTheDay(date?, { seed?, category?, dataset? }?)` laai die verslys af en kies daaruit. `pickVerseOfTheDay(verses, date?, { seed?, category? }?)` kies uit 'n lys wat jy reeds het.
-   Die Kotlin SDK het `getVerseOfTheDay(date?, seed?, category?)` en `pickVerseOfTheDay(verses, date?, seed?, category?)` , wat die datum as 'n `YYYY-MM-DD` string neem.
-   Die Swift SDK het `getVerseOfTheDay(date:seed:category:)` en `pickVerseOfTheDay(_:date:seed:category:holidays:)` , wat die datum as 'n `YYYY-MM-DD` string of 'n `Date` neem (die kalenderdatum in die huidige tydsone word gebruik).
-   Die [MCP-bediener](https://github.com/HelloAOLab/bible-api/tree/main/packages/seed-bible-mcp) het 'n `getVerseOfTheDay` instrument wat die vers van die dag met sy teks teruggee.
-   Die `@helloao/tools` pakket het dieselfde lys en 'n `getVerseOfTheDay(date?, { seed?, category? }?)` funksie in `@helloao/tools/generation/verse-of-the-day.js` .

### Lisensie

Die lys is saamgestel deur AO Lab en word vrygestel onder die [MIT-lisensie](https://github.com/HelloAOLab/bible-api/blob/main/LICENSE) . Die vers teks kom van watter vertaling jy dit ook al kry.

## Lys Verse in 'n Datastel

`GET https://bible.helloao.org/api/d/{dataset}/verses.json`

Kry elke vers (of kort gedeelte) in 'n datastel, met die kategorieë waaraan elkeen behoort, in kanonieke volgorde. Slegs beskikbaar vir datastelle waarvan die verse kategorieë het, soos `verse-of-the-day` .

-   `dataset` die ID van die datastel (bv. `verse-of-the-day` ).

### Kode Voorbeeld

::: code-tabs#taal

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

### Struktuur

```typescript:no-line-numbers title="dataset-verses.ts"
export interface DatasetVerses {
    /**
     * Die datastelinligting vir die verse.
     */
    dataset: Dataset;

    /**
     * Elke vers (of kort gedeelte) in die datastel, met sy kategorieë, in kanonieke volgorde.
     */
    verses: DatasetCategorizedVerse[];

    /**
     * Die vakansiedae wat hul eie verse het, met hul datums.
     * Weglaat as die datastel geen vakansiedae het nie.
     */
    holidays?: DatasetVersesHoliday[];
}

export interface DatasetVersesHoliday extends DatasetCategoryHoliday {
    /**
     * Die ID van die vakansiedag se kategorie. bv. "Kersfees".
     */
    id: string;

    /**
     * Die Engelse naam van die vakansiedag. bv. "Kersfees".
     */
    name: string;
}

export interface DatasetCategoryHoliday {
    /**
     * Die maand (1 vir Januarie) en dag van 'n vakansiedag wat elke jaar op dieselfde datum val.
     * Weggelaat vir vakansiedae waarvan die datum elke jaar verander.
     */
    month?: number;
    day?: number;

    /**
     * Die datums (JJJJ-MM-DD, Gregoriaanse kalender) van 'n vakansiedag waarvan die datum elke jaar verander, in volgorde.
     * Hulle word vooraf bereken vir 'n reeks jare (tans 2026 tot 2125), en die vakansiedag word slegs gevier op die datums wat gelys word.
     * Weggelaat vir vakansiedae wat elke jaar op dieselfde datum val.
     */
    dates?: string[];
}

export interface DatasetCategorizedVerse {
    /**
     * Die ID van die boek. bv. "PRO".
     */
    book: string;

    /**
     * Die hoofstuknommer.
     */
    chapter: number;

    /**
     * Die versnommer.
     * As `endVerse` teenwoordig is, dan is dit die vers waar die gedeelte begin.
     */
    verse: number;

    /**
     * Die vers waarmee die gedeelte eindig.
     * Weglaat indien die inskrywing 'n enkele vers is.
     */
    endVerse?: number;

    /**
     * Die ID's van die kategorieë waaraan die vers behoort, mees relevante eerste.
     */
    categories: string[];

    /**
     * Die eerste jaar wat die vers die vers van die dag kan wees.
     * Weglaat as die vers nog altyd in die lys was.
     */
    addedIn?: number;

    /**
     * Die eerste jaar wat die vers nie meer die vers van die dag kan wees nie.
     * Verwyderde verse bly in die datastel sodat die verse van vorige jare steeds gekies kan word.
     * Weglaat indien die vers nie van die lys verwyder is nie.
     */
    removedIn?: number;
}
```

### Voorbeeld

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
        },
        // ...
        {
            "book": "LUK",
            "chapter": 2,
            "verse": 7,
            "categories": ["christmas"]
        }
        // ...
    ],
    "holidays": [
        {
            "id": "christmas",
            "name": "Christmas",
            "month": 12,
            "day": 25
        },
        {
            "id": "good-friday",
            "name": "Good Friday",
            "dates": ["2026-04-03", "2027-03-26", "2028-04-14" /* ... */]
        }
        // ...
    ]
}
```

## Lys kategorieë in 'n datastel

`GET https://bible.helloao.org/api/d/{dataset}/categories.json`

Kry die lys van verskategorieë wat beskikbaar is vir 'n datastel.

-   `dataset` die ID van die datastel (bv. `verse-of-the-day` ).

### Kode Voorbeeld

::: code-tabs#taal

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

### Struktuur

```typescript:no-line-numbers title="dataset-categories.ts"
export interface DatasetCategories {
    /**
     * Die datastelinligting vir die kategorieë.
     */
    dataset: Dataset;

    /**
     * Die lys van verskategorieë wat beskikbaar is vir die datastel.
     */
    categories: DatasetCategorySummary[];
}

export interface DatasetCategorySummary {
    /**
     * Die ID van die kategorie. bv. "hoop".
     */
    id: string;

    /**
     * Die Engelse naam van die kategorie. bv. "Hoop".
     */
    name: string;

    /**
     * Die beskrywing van waaroor die verse in die kategorie handel.
     */
    description: string;

    /**
     * Die aantal verse (of kort gedeeltes) wat tot die kategorie behoort.
     */
    numberOfVerses: number;

    /**
     * Die datums van die vakansie waarvoor die kategorie is (sien DatastelKategorieVakansie hierbo).
     * Weggelaat vir kategorieë wat nie vir 'n vakansiedag is nie.
     */
    holiday?: DatasetCategoryHoliday;

    /**
     * Die API-skakel vir die kategorie.
     */
    apiLink: string;
}
```

### Voorbeeld

```json:no-line-numbers title="/api/d/verse-of-the-day/categories.json"
{
    "dataset": {
        "id": "verse-of-the-day",
        "name": "Verse of the Day",
        "totalNumberOfCategories": 31
        // ...
    },
    "categories": [
        {
            "id": "comfort",
            "name": "Comfort",
            "description": "God's nearness and care in grief, trouble, and loneliness.",
            "numberOfVerses": 65,
            "apiLink": "/api/d/verse-of-the-day/categories/comfort.json"
        },
        {
            "id": "courage",
            "name": "Courage",
            "description": "Standing firm and not being afraid.",
            "numberOfVerses": 49,
            "apiLink": "/api/d/verse-of-the-day/categories/courage.json"
        }
        // ...
    ]
}
```

## Kry 'n kategorie uit 'n datastel

`GET https://bible.helloao.org/api/d/{dataset}/categories/{category}.json`

Kry 'n enkele verskategorie, met elke vers wat daaraan behoort.

-   `dataset` die ID van die datastel (bv. `verse-of-the-day` ).
-   `category` is die ID van die kategorie (bv. `hope` ).

### Kode Voorbeeld

::: code-tabs#taal

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

### Struktuur

```typescript:no-line-numbers title="dataset-category.ts"
export interface DatasetCategoryResponse {
    /**
     * Die datastelinligting vir die kategorie.
     */
    dataset: Dataset;

    /**
     * Die kategorie, met die verse wat daarby hoort.
     */
    category: DatasetCategory;

    /**
     * Die API-skakel vir hierdie kategorie.
     */
    thisCategoryApiLink: string;
}

export interface DatasetCategory {
    /**
     * Die ID van die kategorie. bv. "hoop".
     */
    id: string;

    /**
     * Die Engelse naam van die kategorie. bv. "Hoop".
     */
    name: string;

    /**
     * Die beskrywing van waaroor die verse in die kategorie handel.
     */
    description: string;

    /**
     * Die datums van die vakansie waarvoor die kategorie is (sien DatastelKategorieVakansie in "Lys Verse in 'n Datastel").
     * Op daardie datums is die vers van die dag een van die kategorie se verse, en hulle word nie op ander dae gebruik nie.
     * Weggelaat vir kategorieë wat nie vir 'n vakansiedag is nie.
     */
    holiday?: DatasetCategoryHoliday;

    /**
     * Die verse (of kort gedeeltes) wat tot die kategorie behoort, in kanonieke volgorde.
     * Sluit verse in wat van die lys verwyder is (sien `removedIn` ).
     */
    verses: DatasetCategoryVerse[];
}

export interface DatasetCategoryVerse {
    /**
     * Die ID van die boek. bv. "JER".
     */
    book: string;

    /**
     * Die hoofstuknommer.
     */
    chapter: number;

    /**
     * Die versnommer.
     * As `endVerse` teenwoordig is, dan is dit die vers waar die gedeelte begin.
     */
    verse: number;

    /**
     * Die vers waarmee die gedeelte eindig.
     * Weglaat indien die verwysing 'n enkele vers is.
     */
    endVerse?: number;

    /**
     * Die eerste jaar wat die vers die vers van die dag kan wees.
     * Weglaat as die vers nog altyd in die lys was.
     */
    addedIn?: number;

    /**
     * Die eerste jaar wat die vers nie meer die vers van die dag kan wees nie.
     * Verwyderde verse bly in die datastel sodat die verse van vorige jare steeds gekies kan word.
     * Weglaat indien die vers nie van die lys verwyder is nie.
     */
    removedIn?: number;
}
```

### Voorbeeld

```json:no-line-numbers title="/api/d/verse-of-the-day/categories/hope.json"
{
    "dataset": {
        "id": "verse-of-the-day",
        "name": "Verse of the Day",
        "totalNumberOfCategories": 31
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
