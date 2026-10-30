# Amasethi edatha

Ama-Endpoints okuphequlula amasethi edatha eBhayibheli engeziwe - njengezinkomba ezihambisanayo, izinhlangano eziseBhayibhelini (abantu, izindawo, imicimbi, namaqembu abantu), amagama aphakathi kwemigqa yolimi lokuqala, izichazamazwi, namavesi abantu abazongenela ukhetho losuku - nokulanda izincwadi zabo, okuqukethwe kwezahluko, izinhlangano, okufakiwe kwesichazamazwi, kanye nezigaba zamavesi.

## Amasethi edatha atholakalayo

`GET https://bible.helloao.org/api/available_datasets.json`

Ithola uhlu lwamasethi edatha eBhayibheli atholakalayo ku-API.

### Isibonelo Sekhodi

::: code-tabs#lang

@tab I-JavaScript

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

### Isakhiwo

```typescript:no-line-numbers title="available-datasets.ts"
export interface AvailableDatasets {
    /**
     * Uhlu lwamasethi edatha.
     */
    datasets: Dataset[];
}

export interface Dataset {
    /**
     * I-ID yesethi yedatha.
     */
    id: string;

    /**
     * Igama lesethi yedatha.
     */
    name: string;

    /**
     * Iwebhusayithi yesethi yedatha.
     */
    website: string;

    /**
     * I-URL lapho ilayisensi yesethi yedatha ingatholakala khona.
     */
    licenseUrl: string;

    /**
     * Amanothi angeziwe nge-API yelayisensi.
     * Akunamsebenzi noma akuchaziwe uma kungekho amanothi.
     */
    licenseNotes?: string | null;

    /**
     * Igama lesiNgisi lesethi yedatha.
     */
    englishName: string;

    /**
     * Ithegi yolimi lwezinhlamvu ezintathu ye-ISO 639 lapho isethi yedatha itholakala khona ngokuyinhloko.
     */
    language: string;

    /**
     * Isiqondiso ulimi olubhalwe ngaso.
     * "ltr" ikhombisa ukuthi umbhalo ubhalwe kusukela ohlangothini lwesobunxele lwekhasi kuya kwesokudla.
     * "rtl" ikhombisa ukuthi umbhalo ubhalwe kusukela kwesokudla sekhasi kuya kwesobunxele.
     */
    textDirection: 'ltr' | 'rtl';

    /**
     * Isixhumanisi se-API sohlu lwezincwadi ezitholakalayo zale sethi yedatha.
     */
    listOfBooksApiLink: string;

    /**
     * Uhlu olutholakalayo lwamafomethi.
     */
    availableFormats: ('json' | 'usfm')[];

    /**
     * Inani lezincwadi eziqukethwe kule datha.
     */
    numberOfBooks: number;

    /**
     * Inani eliphelele lezahluko eziqukethwe kule sethi yedatha.
     */
    totalNumberOfChapters: number;

    /**
     * Inani eliphelele lamavesi aqukethwe kule sethi yedatha.
     */
    totalNumberOfVerses: number;

    /**
     * Inani eliphelele lezinkomba ezihlanganisiwe eziqukethwe kule sethi yedatha.
     * 0 kumasethi edatha angenazo izinkomba ezivundlile.
     */
    totalNumberOfReferences: number;

    /**
     * Inani eliphelele lamagama aphakathi kwemigqa aqukethwe kule sethi yedatha.
     * Kushiywe uma isethi yedatha ingenawo amagama aphakathi kwemigqa.
     */
    totalNumberOfWords?: number;

    /**
     * Ithola igama lolimi okukulo isethi yedatha.
     * Akunamsebenzi noma akuchaziwe uma igama lolimi lingaziwa.
     */
    languageName?: string;

    /**
     * Uthola igama lolimi ngesiNgisi.
     * Akunamsebenzi noma akuchaziwe uma ulimi lungenalo igama lesiNgisi.
     */
    languageEnglishName?: string;

    /**
     * Izixhumanisi ze-API zohlu lwezinhlangano kusethi yedatha.
     * Kushiywe uma isethi yedatha ingenazo izinto ezihambisanayo.
     */
    listOfPeopleApiLink?: string;
    listOfPlacesApiLink?: string;
    listOfEventsApiLink?: string;
    listOfPeopleGroupsApiLink?: string;

    /**
     * Inani eliphelele lezinhlangano eziqukethwe kusethi yedatha.
     * Kushiywe uma isethi yedatha ingenazo izinto ezihambisanayo.
     */
    totalNumberOfPeople?: number;
    totalNumberOfPlaces?: number;
    totalNumberOfEvents?: number;
    totalNumberOfPeopleGroups?: number;

    /**
     * Isixhumanisi se-API sohlu lokufakwa kwesichazamazwi kusethi yedatha.
     * Kushiywe uma isethi yedatha ingenazo izingeniso zesichazamazwi.
     */
    listOfLexiconApiLink?: string;

    /**
     * Inani eliphelele lokufakwa kwesichazamazwi okuqukethwe kusethi yedatha.
     * Kushiywe uma isethi yedatha ingenazo izingeniso zesichazamazwi.
     */
    totalNumberOfLexicon?: number;

    /**
     * Isixhumanisi se-API sohlu lwawo wonke amavesi kusethi yedatha, kanye nezigaba zawo.
     * Kushiywe uma amavesi esethi yedatha engenazo izigaba.
     */
    listOfVersesApiLink?: string;

    /**
     * Isixhumanisi se-API sohlu lwezigaba zamavesi kusethi yedatha.
     * Kushiywe uma isethi yedatha ingenazo izigaba zamavesi.
     */
    listOfCategoriesApiLink?: string;

    /**
     * Inani eliphelele lezigaba zamavesi eziqukethwe kusethi yedatha.
     * Kushiywe uma isethi yedatha ingenazo izigaba zamavesi.
     */
    totalNumberOfCategories?: number;
}
```

### Isibonelo

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

## Bhala Izincwadi Kusethi Yedatha

`GET https://bible.helloao.org/api/d/{dataset}/books.json`

Ithola uhlu lwezincwadi ezitholakalayo zedatha enikeziwe.

-   `dataset` i-ID yesethi yedatha (isib. `open-cross-ref` ).

### Isibonelo Sekhodi

::: code-tabs#lang

@tab I-JavaScript

```ts:no-line-numbers title="fetch-dataset-books.js"
const dataset = 'open-cross-ref';

// Thola uhlu lwezincwadi zedatha ye-open-cross-ref
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

### Isakhiwo

```typescript:no-line-numbers title="dataset-books.ts"
export interface DatasetBooks {
    /**
     * Ulwazi lweqoqo ledatha lezincwadi.
     */
    dataset: Dataset;

    /**
     * Uhlu lwezincwadi ezitholakalayo zedatha.
     */
    books: DatasetBook[];
}

interface DatasetBook {
    /**
     * I-ID yencwadi.
     * Ihambisana nobunikazi bencwadi ehambisanayo eBhayibhelini (GEN, EXO, njll.).
     */
    id: string;

    /**
     * Ukuhleleka kwencwadi eBhayibhelini.
     */
    order: number;

    /**
     * Inombolo yesahluko sokuqala encwadini.
     */
    firstChapterNumber: number;

    /**
     * Isixhumanisi sesahluko sokuqala sencwadi.
     */
    firstChapterApiLink: string | null;

    /**
     * Inombolo yesahluko sokugcina encwadini.
     */
    lastChapterNumber: number | null;

    /**
     * Isixhumanisi sesahluko sokugcina sencwadi.
     */
    lastChapterApiLink: string | null;

    /**
     * Inani lezahluko eziqukethwe yile ncwadi.
     */
    numberOfChapters: number;

    /**
     * Inani lamavesi aqukethwe yile ncwadi.
     */
    totalNumberOfVerses: number;

    /**
     * Inani eliphelele lezikhombo ezihambisanayo eziqukethwe yile ncwadi.
     */
    totalNumberOfReferences: number;
}
```

### Isibonelo

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

## Thola Isahluko Kusethi Yedatha

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

Ithola okuqukethwe kwesahluko esisodwa sencwadi ethile kanye nesethi yedatha.

Kumasethi edatha abhekisela ku-cross reference (njenge- `open-cross-ref` ), isahluko siqukethe uhlu lwezikhombo ezibhekisela ku-cross verse ngayinye. Kumasethi edatha ahambisanayo (njenge- `bsb-interlinear` ), isahluko siqukethe amagama olimi lokuqala evesini ngalinye - bheka [Amasethi Edatha Ahambisanayo](#interlinear-datasets) . Kumasethi edatha enhlangano (njenge- `theographic` ), isahluko siqukethe abantu, izindawo, kanye nemicimbi evela esahlukweni - bheka [Thola Izinhlangano Esahlukweni](#get-the-entities-in-a-chapter) . Kumasethi edatha `verse-of-the-day` , isahluko siqukethe ivesi labazongenela ukhetho losuku esahlukweni kanye nezigaba zabo - bheka [Ivesi Losuku](#verse-of-the-day) .

-   `dataset` i-ID yesethi yedatha (isib. `open-cross-ref` ).
-   `book` ungumazisi wencwadi (isib. `GEN` kuGenesise).
-   U- `chapter` uyinombolo yesahluko esinezinombolo (isib. `1` yesahluko sokuqala).

### Isibonelo Sekhodi

::: code-tabs#lang

@tab I-JavaScript

```ts:no-line-numbers title="fetch-dataset-chapter.js"
const dataset = 'open-cross-ref';
const book = 'GEN';
const chapter = 1;

// Thola uGenesise 1 kusethi yedatha ye-open-cross-ref
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

### Isakhiwo

```typescript:no-line-numbers title="dataset-chapter.ts"
export interface DatasetBookChapter {
    /**
     * Ulwazi lweqoqo ledatha lesahluko sencwadi.
     */
    dataset: Dataset;

    /**
     * Ulwazi lwencwadi lwesahluko sencwadi.
     */
    book: DatasetBook;

    /**
     * Isixhumanisi salesi sahluko.
     */
    thisChapterLink: string;

    /**
     * Isixhumanisi sesahluko esilandelayo.
     * Akunamsebenzi uma lesi kuyisahluko sokugcina kusethi yedatha.
     */
    nextChapterApiLink: string | null;

    /**
     * Isixhumanisi sesahluko esedlule.
     * Akunamsebenzi uma lesi kuyisahluko sokuqala kusethi yedatha.
     */
    previousChapterApiLink: string | null;

    /**
     * Inani lamavesi aqukethwe yisahluko.
     */
    numberOfVerses: number;

    /**
     * Ulwazi lwesahluko.
     */
    chapter: DatasetChapterData;
}

interface DatasetChapterData {
    /**
     * Inombolo yesahluko.
     */
    number: number;

    /**
     * Okuqukethwe kwesahluko.
     */
    content: DatasetVerse[];
}

/**
 * Ivesi liphethe `references` (amasethi edatha ahlobene), `words` (amasethi edatha aphakathi kwemigqa), noma `categories` (isethi yedatha yevesi losuku).
 * Hlola ukuthi iyiphi ekhona nge `'words' in verse` noma `'categories' in verse` .
 */
type DatasetVerse =
    | DatasetReferencesVerse
    | DatasetWordsVerse
    | DatasetCategoriesVerse;

interface DatasetReferencesVerse {
    /**
     * Inombolo yevesi.
     */
    verse: number;

    /**
     * Izinkomba zevesi.
     *
     * Kuhlungwe ngesilinganiso, kwehle.
     */
    references: DatasetReference[];
}

interface DatasetWordsVerse {
    /**
     * Inombolo yevesi.
     */
    verse: number;

    /**
     * Amagama olimi lokuqala aleli vesi, ngokulandelana kombhalo wokuqala.
     * Bheka "Amasethi Edatha E-Interlinear" ngezansi.
     */
    words: InterlinearWord[];
}

interface DatasetCategoriesVerse {
    /**
     * Inombolo yevesi.
     * Uma `endVerse` ekhona, khona-ke leli yivesi lapho indima iqala khona.
     */
    verse: number;

    /**
     * Ivesi eliphela ngalo indima.
     * Akufakiwe uma okufakiwe kuyivesi elilodwa.
     */
    endVerse?: number;

    /**
     * Ama-ID ezigaba okukhulunywa ngazo leli vesi, abaluleke kakhulu kuqala.
     * Bheka "Ivesi Losuku" ngezansi.
     */
    categories: string[];

    /**
     * Unyaka wokuqala lapho ivesi lingaba yivesi losuku.
     * Akuvunyelwe uma ivesi belilokhu likhona ohlwini.
     */
    addedIn?: number;

    /**
     * Unyaka wokuqala lapho ivesi lingasakwazi ukuba yivesi losuku.
     * Amavesi asusiwe ahlala kusethi yedatha ukuze amavesi eminyaka edlule asakwazi ukukhethwa.
     * Kushiywe uma ivesi lingasuswanga ohlwini.
     */
    removedIn?: number;
}

interface DatasetReference {
    /**
     * I-ID yencwadi okubhekiselwa kuyo.
     */
    book: string;

    /**
     * Inombolo yesahluko.
     */
    chapter: number;

    /**
     * Inombolo yevesi.
     * Uma `endVerse` ekhona, khona-ke leli yivesi lapho inkomba iqala khona.
     */
    verse: number;

    /**
     * Ivesi okukhulunywa ngalo liphetha ngalo.
     */
    endVerse?: number;

    /**
     * Isilinganiso sokufaneleka sereferensi.
     */
    score?: number;
}

// Bheka "Amasethi Edatha E-Interlinear" ngezansi ukuze uthole isakhiwo se-InterlinearWord.
```

### Isibonelo

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

## Izinhlangano

Amanye amasethi edatha - njengesethi yedatha ye [-Theographic Bible Metadata](https://github.com/robertrouse/theographic-bible-metadata) ( `theographic` ) - aqukethe izinto: abantu, izindawo, imicimbi, namaqembu abantu, kanye nobudlelwano phakathi kwabo namavesi eBhayibheli abakhuluma ngawo.

Isethi yedatha [ye-History Globe](https://historyglobe.app) ( `history-globe` ) iqukethe izindawo kuphela: izindawo eziqanjwe eBhayibhelini, kanye nama-coordinates azo kanye namavesi aziqambayo. Ama-ID ayo endawo (isib. `a15257a` eJerusalema) angama-ID endawo azinzile e-History Globe, lawo afanayo asetshenziswa [yi-API yayo yedatha evulekile](https://historyglobe.app/docs/api.html) , ngakho awashintshi lapho igama lilungiswa. Amanani ayo `featureType` alandela lawo asetshenziswa yi-Theographic dataset ( `City` , `Region` , `Water` , njalo njalo), kanti `featureSubType` uphethe uhlobo oluqondile lapho kukhona khona olulodwa (isib. `River` , `Gate` , `Spring` ).

Amasethi edatha aqukethe izinto afaka phakathi izakhiwo ezingu `listOfPeopleApiLink` , `listOfPlacesApiLink` , `listOfEventsApiLink` , kanye `listOfPeopleGroupsApiLink` ekufakweni kwawo ku `/api/available_datasets.json` .

Amasethi edatha ebhizinisi ahlinzeka ngedatha ehambisana nezahluko: `/api/d/{dataset}/books.json` ibala izincwadi ezinezahluko eziqukethe idatha yebhizinisi, kanti `/api/d/{dataset}/{book}/{chapter}.json` ibuyisela abantu, izindawo, kanye nemicimbi evela kuleso sahluko, kanye nezinombolo zamavesi lapho kukhulunywa khona ngayinye. Bheka [ethi Thola Izinhlangano Esahlukweni](#get-the-entities-in-a-chapter) .

Izinhlangano zibhekisela ezindimeni zeBhayibheli zisebenzisa ama-ID ezincwadi afanayo, izinombolo zezahluko, nezinombolo zamavesi njengayo yonke i-API, ukuze zihlanganiswe nanoma yikuphi ukuhumusha. Zibhekisela komunye nomunye zisebenzisa izinkomba zezinhlangano:

```typescript:no-line-numbers title="entity-shared.ts"
export interface DatasetEntityRef {
    /**
     * I-ID yebhizinisi okubhekiselwa kulo.
     */
    id: string;

    /**
     * Uhlobo lwenhlangano okubhekiselwa kuyo.
     * Ifanisa ingxenye yeqoqo lesixhumanisi se-API senhlangano, ngakho-ke isixhumanisi singakhiwa njenge- `/api/d/{dataset}/{type}/{id}.json` .
     */
    type: 'people' | 'places' | 'events' | 'groups';

    /**
     * Igama lenhlangano okubhekiselwa kuyo.
     */
    name?: string;

    /**
     * Isixhumanisi se-API senhlangano okubhekiselwa kuyo.
     */
    apiLink?: string;
}

export interface VerseRef {
    /**
     * I-ID yencwadi (i-GEN, i-EXO, njll.).
     */
    book: string;

    /**
     * Inombolo yesahluko lapho ireferensi iqala khona.
     */
    chapter: number;

    /**
     * Inombolo yevesi lapho ireferensi iqala khona.
     */
    verse: number;

    /**
     * Ivesi okukhulunywa ngalo liphetha ngalo.
     * Amavesi alandelanayo esahlukweni esifanayo aqoqwe abe yinkomba eyodwa.
     */
    endVerse?: number;
}
```

### Umlando Wembulunga Yezwe

Idatha ye-History Globe inelayisensi ngaphansi kwe [-CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) . Uma uyisebenzisa, nikeza i-History Globe ( https://historyglobe.app ) kanye ne-OpenBible.info Bible Geocoding Data eyakhelwe phezu kwayo, futhi uqaphele noma yiziphi izinguquko. Impahla ye `licenseNotes` yesethi yedatha ine-credit.

## Thola Izinhlangano Esahlukweni

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

Kumasethi edatha enhlangano, uthola abantu, izindawo, kanye nemicimbi evela esahlukweni esisodwa, kanye nezinombolo zamavesi esahlukweni lapho kukhulunywa khona ngalinye.

-   `dataset` i-ID yesethi yedatha (isib. `theographic` ).
-   `book` ungumazisi wencwadi (isib. `GEN` kuGenesise).
-   U- `chapter` uyinombolo yesahluko esinezinombolo (isib. `1` yesahluko sokuqala).

Uhlu lwezincwadi nezahluko ezinedatha yenhlangano luyatholakala kusukela `GET https://bible.helloao.org/api/d/{dataset}/books.json` , okulandela isakhiwo esifanayo ne- [dataset books endpoint](#list-books-in-a-dataset) . Kuma-dataset enhlangano, `totalNumberOfVerses` yinani lamavesi ashiwo okungenani yinhlangano eyodwa kanti `totalNumberOfReferences` yinani eliphelele lokukhulunywa ngawo yi-entity-verse.

### Isibonelo Sekhodi

::: code-tabs#lang

@tab I-JavaScript

```ts:no-line-numbers title="fetch-chapter-entities.js"
const dataset = 'theographic';
const book = 'GEN';
const chapter = 2;

// Thola abantu, izindawo, kanye nemicimbi evela kuGenesise 2
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

### Isakhiwo

```typescript:no-line-numbers title="dataset-chapter-entities.ts"
export interface DatasetEntityBookChapter {
    /**
     * Ulwazi lweqoqo ledatha lesahluko sencwadi.
     */
    dataset: Dataset;

    /**
     * Ulwazi lwencwadi lwesahluko sencwadi.
     */
    book: DatasetBook;

    /**
     * Idatha yenhlangano yesahluko.
     */
    chapter: DatasetEntityChapterData;

    /**
     * Isixhumanisi salesi sahluko.
     */
    thisChapterLink: string;

    /**
     * Isixhumanisi sesahluko esilandelayo.
     * Akunamsebenzi uma lesi kuyisahluko sokugcina kusethi yedatha.
     */
    nextChapterApiLink: string | null;

    /**
     * Isixhumanisi sesahluko esedlule.
     * Akunamsebenzi uma lesi kuyisahluko sokuqala kusethi yedatha.
     */
    previousChapterApiLink: string | null;

    /**
     * Inani labantu, izindawo, kanye nemicimbi evela esahlukweni.
     */
    numberOfPeople: number;
    numberOfPlaces: number;
    numberOfEvents: number;
}

interface DatasetEntityChapterData {
    /**
     * Inombolo yesahluko.
     */
    number: number;

    /**
     * Abantu abavela esahlukweni.
     * Kuhlelwe ngokwevesi lokuqala ezivela kulo.
     */
    people: ChapterPerson[];

    /**
     * Izindawo ezivela esahlukweni.
     * Kuhlelwe ngokwevesi lokuqala ezivela kulo.
     */
    places: ChapterPlace[];

    /**
     * Izehlakalo ezivela esahlukweni.
     * Kuhlelwe ngokwevesi lokuqala ezivela kulo.
     */
    events: ChapterEvent[];
}

interface ChapterPerson {
    /**
     * I-ID yomuntu.
     */
    id: string;

    /**
     * Igama lomuntu.
     */
    name: string;

    /**
     * Ukuthi igama lomuntu liyigama elifanele yini.
     */
    isProperName?: boolean;

    /**
     * Ubulili bomuntu.
     */
    gender?: string;

    /**
     * Unyaka umuntu azalwa ngawo kanye nonyaka ashona ngawo.
     * Izinombolo ezingezinhle ziyiminyaka BC. Izinombolo ezingezinhle ziyiminyaka AD.
     */
    birthYear?: number;
    deathYear?: number;

    /**
     * Isixhumanisi se-API somuntu.
     */
    apiLink: string;

    /**
     * Izinombolo zamavesi esahlukweni akhuluma ngomuntu.
     * Kuhlelwe ngokulandelana okukhuphukayo.
     */
    verses: number[];
}

interface ChapterPlace {
    /**
     * I-ID yendawo.
     */
    id: string;

    /**
     * Igama lendawo.
     */
    name: string;

    /**
     * Uhlobo lwesici sendawo indawo eyiyo.
     */
    featureType?: string;

    /**
     * I-latitude kanye ne-longitude yendawo.
     */
    latitude?: number;
    longitude?: number;

    /**
     * Isixhumanisi se-API sendawo.
     */
    apiLink: string;

    /**
     * Izinombolo zamavesi esahlukweni akhuluma ngendawo.
     * Kuhlelwe ngokulandelana okukhuphukayo.
     */
    verses: number[];
}

interface ChapterEvent {
    /**
     * I-ID yomcimbi.
     */
    id: string;

    /**
     * Igama lomcimbi.
     */
    name: string;

    /**
     * Usuku umcimbi oqale ngalo.
     */
    startDate?: string;

    /**
     * Isixhumanisi se-API somcimbi.
     */
    apiLink: string;

    /**
     * Izinombolo zamavesi esahlukweni achaza lesi senzakalo.
     * Kuhlelwe ngokulandelana okukhuphukayo.
     */
    verses: number[];
}
```

### Isibonelo

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

## Bhala Abantu Kusethi Yedatha

`GET https://bible.helloao.org/api/d/{dataset}/people.json`

Ithola uhlu lwabantu abatholakalayo kusethi yedatha enikeziwe.

-   `dataset` i-ID yesethi yedatha (isib. `theographic` ).

### Isibonelo Sekhodi

::: code-tabs#lang

@tab I-JavaScript

```ts:no-line-numbers title="fetch-dataset-people.js"
const dataset = 'theographic';

// Thola uhlu lwabantu besethi yedatha ye-theographic
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

### Isakhiwo

```typescript:no-line-numbers title="dataset-people.ts"
export interface DatasetPeople {
    /**
     * Ulwazi lwedatha lwabantu.
     */
    dataset: Dataset;

    /**
     * Uhlu lwabantu abatholakalayo kusethi yedatha.
     */
    people: DatasetPersonSummary[];
}

interface DatasetPersonSummary {
    /**
     * I-ID yomuntu.
     */
    id: string;

    /**
     * Igama lomuntu.
     */
    name: string;

    /**
     * Ukuthi igama lomuntu liyigama elifanele yini.
     */
    isProperName?: boolean;

    /**
     * Ubulili bomuntu.
     */
    gender?: string;

    /**
     * Inani lezinkomba zeBhayibheli ezikhuluma ngomuntu.
     */
    numberOfReferences: number;

    /**
     * Isixhumanisi se-API somuntu.
     */
    thisPersonApiLink: string;
}
```

### Isibonelo

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

## Thola Umuntu Kusethi Yedatha

`GET https://bible.helloao.org/api/d/{dataset}/people/{person}.json`

Uthola ulwazi ngomuntu oyedwa, okuhlanganisa nezinkomba zeBhayibheli ezikhuluma ngaye kanye nobudlelwano bakhe nabanye abantu, izindawo, izenzakalo, kanye namaqembu abantu.

-   `dataset` i-ID yesethi yedatha (isib. `theographic` ).
-   `person` i-ID yomuntu (isib. `paul_2479` ).

### Isibonelo Sekhodi

::: code-tabs#lang

@tab I-JavaScript

```ts:no-line-numbers title="fetch-dataset-person.js"
const dataset = 'theographic';
const person = 'paul_2479';

// Thola ulwazi mayelana noPawulu kusethi yedatha ye-theographic
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

### Isakhiwo

```typescript:no-line-numbers title="dataset-person.ts"
export interface DatasetPersonResponse {
    /**
     * Ulwazi lwesethi yedatha lomuntu.
     */
    dataset: Dataset;

    /**
     * Ulwazi mayelana nomuntu.
     */
    person: DatasetPerson;

    /**
     * Isixhumanisi se-API salo muntu.
     */
    thisPersonApiLink: string;
}

interface DatasetPerson {
    /**
     * I-ID yomuntu.
     */
    id: string;

    /**
     * Igama lomuntu.
     */
    name: string;

    /**
     * Amanye amagama umuntu abizwa ngawo.
     */
    alsoCalled?: string[];

    /**
     * Ukuthi igama lomuntu liyigama elifanele yini.
     */
    isProperName?: boolean;

    /**
     * Ubulili bomuntu.
     */
    gender?: string;

    /**
     * Incazelo yomuntu. Intambo ngayinye iyisigaba.
     */
    description?: string[];

    /**
     * Unyaka umuntu azalwa ngawo kanye nonyaka ashona ngawo.
     * Izinombolo ezingezinhle ziyiminyaka BC. Izinombolo ezingezinhle ziyiminyaka AD.
     */
    birthYear?: number;
    deathYear?: number;

    /**
     * Iminyaka yokuqala neyamuva lapho umuntu okukhulunywa ngaye.
     */
    minYear?: number;
    maxYear?: number;

    /**
     * Indawo lapho umuntu azalelwa khona futhi wafela khona.
     */
    birthPlace?: DatasetEntityRef;
    deathPlace?: DatasetEntityRef;

    /**
     * Ubudlelwano bomndeni womuntu.
     */
    father?: DatasetEntityRef[];
    mother?: DatasetEntityRef[];
    partners?: DatasetEntityRef[];
    children?: DatasetEntityRef[];
    siblings?: DatasetEntityRef[];
    halfSiblingsSameMother?: DatasetEntityRef[];
    halfSiblingsSameFather?: DatasetEntityRef[];

    /**
     * Amaqembu abantu umuntu ayilungu lawo.
     */
    memberOf?: DatasetEntityRef[];

    /**
     * Imicimbi umuntu ahlanganyele kuyo.
     */
    events?: DatasetEntityRef[];

    /**
     * Uhlu lwezikhombo zeBhayibheli ezikhuluma ngalowo muntu.
     * Kuhlelwe ngokulandelana kwezincwadi, isahluko, namavesi.
     */
    references: VerseRef[];
}
```

### Isibonelo

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

## Bhala Izindawo Kusethi Yedatha

`GET https://bible.helloao.org/api/d/{dataset}/places.json`

Ithola uhlu lwezindawo ezitholakalayo zedatha enikeziwe.

-   `dataset` i-ID yesethi yedatha (isib. `theographic` ).

### Isakhiwo

```typescript:no-line-numbers title="dataset-places.ts"
export interface DatasetPlaces {
    /**
     * Ulwazi lwedatha lwezindawo.
     */
    dataset: Dataset;

    /**
     * Uhlu lwezindawo ezitholakalayo kusethi yedatha.
     */
    places: DatasetPlaceSummary[];
}

interface DatasetPlaceSummary {
    /**
     * I-ID yendawo.
     */
    id: string;

    /**
     * Igama lendawo.
     */
    name: string;

    /**
     * Uhlobo lwesici sendawo indawo eyiyo.
     * Isibonelo, "Idolobha", "Isifunda", "Intaba", "Amanzi", njll.
     */
    featureType?: string;

    /**
     * I-latitude kanye ne-longitude yendawo.
     */
    latitude?: number;
    longitude?: number;

    /**
     * Inani lezinkomba zeBhayibheli ezikhuluma ngale ndawo.
     */
    numberOfReferences: number;

    /**
     * Isixhumanisi se-API sendawo.
     */
    thisPlaceApiLink: string;
}
```

## Thola Indawo Kusethi Yedatha

`GET https://bible.helloao.org/api/d/{dataset}/places/{place}.json`

Uthola ulwazi mayelana nendawo eyodwa, okuhlanganisa nezinkomba zeBhayibheli ezikhuluma ngayo kanye nabantu nezenzakalo ezihlobene nayo.

-   `dataset` i-ID yesethi yedatha (isib. `theographic` ).
-   `place` i-ID yendawo (isib. `jerusalem_636` ).

### Isakhiwo

```typescript:no-line-numbers title="dataset-place.ts"
export interface DatasetPlaceResponse {
    /**
     * Ulwazi lwesethi yedatha yendawo.
     */
    dataset: Dataset;

    /**
     * Ulwazi mayelana nendawo.
     */
    place: DatasetPlace;

    /**
     * Isixhumanisi se-API sale ndawo.
     */
    thisPlaceApiLink: string;
}

interface DatasetPlace {
    /**
     * I-ID yendawo.
     */
    id: string;

    /**
     * Igama lendawo.
     */
    name: string;

    /**
     * Igama lendawo njengoba livela ku-King James Version kanye ne-English Standard Version.
     */
    kjvName?: string;
    esvName?: string;

    /**
     * Amanye amagama abizwa ngawo le ndawo.
     */
    aliases?: string[];

    /**
     * Uhlobo lwesici sendawo indawo eyiyo.
     */
    featureType?: string;
    featureSubType?: string;

    /**
     * I-latitude kanye ne-longitude yendawo, nokuthi zinembile kangakanani.
     */
    latitude?: number;
    longitude?: number;
    precision?: string;

    /**
     * Incazelo yendawo. Intambo ngayinye iyisigaba.
     */
    description?: string[];

    /**
     * Amazwana ngendawo avela kubabhali besethi yedatha.
     */
    comment?: string;

    /**
     * Indawo eyinhloko yale ndawo.
     * Amagama ahlukene endawo efanayo anendawo efanayo.
     */
    rootPlace?: DatasetEntityRef;

    /**
     * Indawo lapho le ndawo iyimpinda yayo.
     */
    duplicateOf?: DatasetEntityRef;

    /**
     * Abantu abake baba khona, bazalelwa khona, noma bashona khona.
     */
    people?: DatasetEntityRef[];
    peopleBorn?: DatasetEntityRef[];
    peopleDied?: DatasetEntityRef[];

    /**
     * Izehlakalo ezenzeka endaweni.
     */
    events?: DatasetEntityRef[];

    /**
     * Uhlu lwezikhombo zeBhayibheli ezikhuluma ngale ndawo.
     * Kuhlelwe ngokulandelana kwezincwadi, isahluko, namavesi.
     */
    references: VerseRef[];
}
```

### Isibonelo

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

## Bhala Imicimbi Kusethi Yedatha

`GET https://bible.helloao.org/api/d/{dataset}/events.json`

Ithola uhlu lwemicimbi etholakalayo yesethi yedatha enikeziwe.

-   `dataset` i-ID yesethi yedatha (isib. `theographic` ).

### Isakhiwo

```typescript:no-line-numbers title="dataset-events.ts"
export interface DatasetEvents {
    /**
     * Ulwazi lwesethi yedatha yemicimbi.
     */
    dataset: Dataset;

    /**
     * Uhlu lwemicimbi etholakalayo kusethi yedatha.
     */
    events: DatasetEventSummary[];
}

interface DatasetEventSummary {
    /**
     * I-ID yomcimbi.
     */
    id: string;

    /**
     * Igama lomcimbi.
     */
    name: string;

    /**
     * Usuku umcimbi oqale ngalo.
     * Izinombolo ezingezinhle ziyiminyaka BC. Izinombolo ezingezinhle ziyiminyaka AD.
     * Izinsuku ezithile zisebenzisa ifomethi ethi `YYYY-MM-DD` .
     */
    startDate?: string;

    /**
     * Inani lezinkomba zeBhayibheli ezichaza lesi senzakalo.
     */
    numberOfReferences: number;

    /**
     * Isixhumanisi se-API somcimbi.
     */
    thisEventApiLink: string;
}
```

## Thola Umcimbi Kusethi Yedatha

`GET https://bible.helloao.org/api/d/{dataset}/events/{event}.json`

Uthola ulwazi mayelana nesenzakalo esisodwa, okuhlanganisa nezinkomba zeBhayibheli ezisichazayo kanye nabantu abahlobene naso, izindawo, kanye namaqembu abantu.

-   `dataset` i-ID yesethi yedatha (isib. `theographic` ).
-   `event` i-ID yomcimbi (isib. `saul-is-converted_326` ).

### Isakhiwo

```typescript:no-line-numbers title="dataset-event.ts"
export interface DatasetEventResponse {
    /**
     * Ulwazi lwesethi yedatha lomcimbi.
     */
    dataset: Dataset;

    /**
     * Ulwazi mayelana nomcimbi.
     */
    event: DatasetEvent;

    /**
     * Isixhumanisi se-API salo mcimbi.
     */
    thisEventApiLink: string;
}

interface DatasetEvent {
    /**
     * I-ID yomcimbi.
     */
    id: string;

    /**
     * Igama lomcimbi.
     */
    name: string;

    /**
     * Usuku umcimbi oqale ngalo.
     */
    startDate?: string;

    /**
     * Ubude bomcimbi.
     * Isibonelo, "1D" usuku olulodwa kanti "40Y" iminyaka engamashumi amane.
     */
    duration?: string;

    /**
     * Abantu abahlanganyele kulo mcimbi.
     */
    participants?: DatasetEntityRef[];

    /**
     * Izindawo lapho umcimbi wenzeke khona.
     */
    locations?: DatasetEntityRef[];

    /**
     * Amaqembu abantu abahlanganyele kulo mcimbi.
     */
    groups?: DatasetEntityRef[];

    /**
     * Umcimbi lo mcimbi oyingxenye yawo.
     */
    partOf?: DatasetEntityRef;

    /**
     * Isenzakalo esenzeka ngaphambi kwalesi senzakalo.
     */
    predecessor?: DatasetEntityRef;

    /**
     * Uhlu lwezikhombo zeBhayibheli ezichaza lesi senzakalo.
     * Kuhlelwe ngokulandelana kwezincwadi, isahluko, namavesi.
     */
    references: VerseRef[];
}
```

### Isibonelo

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

## Faka Amaqembu Abantu Kusethi Yedatha

`GET https://bible.helloao.org/api/d/{dataset}/groups.json`

Ithola uhlu lwamaqembu abantu atholakalayo kusethi yedatha enikeziwe.

-   `dataset` i-ID yesethi yedatha (isib. `theographic` ).

### Isakhiwo

```typescript:no-line-numbers title="dataset-people-groups.ts"
export interface DatasetPeopleGroups {
    /**
     * Ulwazi lweqoqo ledatha lamaqembu abantu.
     */
    dataset: Dataset;

    /**
     * Uhlu lwamaqembu abantu atholakalayo kusethi yedatha.
     */
    groups: DatasetPeopleGroupSummary[];
}

interface DatasetPeopleGroupSummary {
    /**
     * I-ID yeqembu labantu.
     */
    id: string;

    /**
     * Igama leqembu labantu.
     */
    name: string;

    /**
     * Inani labantu abangamalungu eqembu labantu.
     */
    numberOfMembers: number;

    /**
     * Isixhumanisi se-API seqembu labantu.
     */
    thisPeopleGroupApiLink: string;
}
```

## Thola Iqembu Labantu Kusethi Yedatha

`GET https://bible.helloao.org/api/d/{dataset}/groups/{group}.json`

Uthola ulwazi mayelana neqembu labantu abangabodwa, okuhlanganisa amalungu alo kanye nemicimbi iqembu elihlanganyele kuyo.

-   `dataset` i-ID yesethi yedatha (isib. `theographic` ).
-   `group` i-ID yeqembu labantu (isib. `tribe-of-benjamin` ).

### Isakhiwo

```typescript:no-line-numbers title="dataset-people-group.ts"
export interface DatasetPeopleGroupResponse {
    /**
     * Ulwazi lwesethi yedatha yeqembu labantu.
     */
    dataset: Dataset;

    /**
     * Ulwazi mayelana neqembu labantu.
     */
    group: DatasetPeopleGroup;

    /**
     * Isixhumanisi se-API saleli qembu labantu.
     */
    thisPeopleGroupApiLink: string;
}

interface DatasetPeopleGroup {
    /**
     * I-ID yeqembu labantu.
     */
    id: string;

    /**
     * Igama leqembu labantu.
     */
    name: string;

    /**
     * Abantu abangamalungu eqembu labantu.
     */
    members?: DatasetEntityRef[];

    /**
     * Imicimbi iqembu labantu elalihlanganyela kuyo.
     */
    events?: DatasetEntityRef[];

    /**
     * Uhlu lwezikhombo zeBhayibheli ezikhuluma ngeqembu labantu.
     * Kuhlelwe ngokulandelana kwezincwadi, isahluko, namavesi.
     */
    references: VerseRef[];
}
```

### Isibonelo

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

## Amasethi edatha e-Interlinear

Isethi yedatha ye-Berean interlinear ( `bsb-interlinear` ) ibala amagama olimi lokuqala (isiHebheru, isi-Aramu, nesiGreki) awo wonke amavesi eBhayibheli, ngokulandelana kwawo embhalweni wokuqala. Igama ngalinye linokuguqulwa kwalo, ukuhlaziywa kohlelo lolimi, [inombolo kaStrong](https://en.wikipedia.org/wiki/Strong%27s_Concordance) , kanye nomusho wesiNgisi osetshenziswa yiBerean [Standard Bible](https://berean.bible) kulo.

Isethi yedatha isebenzisa ama-endpoint afanayo namanye amasethi edatha:

-   `GET https://bible.helloao.org/api/d/bsb-interlinear/books.json` ubala izincwadi ezingu-66.
-   `GET https://bible.helloao.org/api/d/bsb-interlinear/{book}/{chapter}.json` (isib. `/api/d/bsb-interlinear/GEN/1.json` ) ibuyisela isahluko, kanye no `{ verse, words }` ngevesi ngalinye. Impendulo [iyisahluko sedatha](#get-a-chapter-from-a-dataset) .

Idatha yamagama ivela [kumathebula e-interlinear e-Berean Standard Bible](https://bereanbible.com/) , asesidlangalaleni. Izinombolo zikaStrong zamagama zibhekwa phezulu [kusichazamazwi](#lexicon) ( `stepbible-lexicon` ).

### Isakhiwo

```typescript:no-line-numbers title="interlinear-word.ts"
interface InterlinearWord {
    /**
     * Izinga elisekelwe ku-1 legama ngokulandelana kombhalo wokuqala.
     * Amagama ahlelwe ngale ndlela.
     */
    pos: number;

    /**
     * Izinga elisekelwe ku-1 laleli gama odabeni lwesiNgisi lwe-Berean Standard Bible.
     */
    bsbPos: number;

    /**
     * Ulimi lwegama.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * Igama elikuskripthi sokuqala. I-NFC ijwayelekile.
     */
    text: string;

    /**
     * Ukuguqulwa kwegama.
     */
    transliteration: string | null;

    /**
     * Ikhodi emfushane yokuhlaziya uhlelo lolimi lwegama. isib. "N-mp" noma "V-Qal-Perf-3ms".
     */
    parsing: string | null;

    /**
     * Ukuhlaziywa kohlelo lolimi olupelwe ngokuphelele kwegama.
     */
    parsingFull: string | null;

    /**
     * Inombolo kaStrong enephedi engu-zero. isib. "H0430" noma "G3056".
     * I-Zero-padded, efanela amanani angu `.words.json` e-KJV.
     * Amanani ezinye izinguqulo angadinga ukukhishwa kwe-zero-padding kanye ne-suffix stripping ngaphambi kokujoyina.
     * I-Null uma umthombo unikeza igama elithi cha inombolo kaStrong (lokhu kunjalo kwamanye amagama ayizijobelelo, njengezijobelelo zesabizwana).
     */
    strongs: string | null;

    /**
     * Inkulumo yesiNgisi ye-Berean Standard Bible yaleli gama.
     * Akusebenzi uma i-BSB ishiya igama elingahunyushwanga (njengophawu lwento eqondile lwesiHebheru).
     */
    gloss: string | null;
}
```

### Isibonelo

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

### Ukuxhumanisa Amagama Nokuhumusha

Amanani e-interlinear `strongs` afakwe ku-zero-pad (isib. `H0430` ). Lokhu kufana namanani `strongs` ku-KJV's word annotations ( `/api/eng_kjv/{book}/{chapter}.words.json` ). Amanani ezinye izinguqulo angadinga i-zero-padding kanye ne-suffix stripping (isib. `H430` noma `H1961a` kuya ku `H0430` kanye no `H1961` ) ngaphambi kokuba ahlanganiswe.

-   **I-KJV.** Kwi-King James Version ( `eng_kjv` kanye no `eng_kja` ), hlanganisa izinombolo ze-Strong efayeleni lesahluko sesi `.words.json` namagama `strongs` aphakathi kwemigqa yevesi elifanayo. Isibonelo, inombolo ngayinye ye-Strong ebhalwe ku `/api/eng_kjv/GEN/1.words.json` yevesi 1 ( `H7225` , `H1254` , `H0430` , `H0853` , `H8064` , `H0776` ) ivela njengenani le `strongs` phakathi kwamagama evesi 1 ku `/api/d/bsb-interlinear/GEN/1.json` .
-   **IBhayibheli Elijwayelekile LaseBerean.** Igama ngalinye elingu `gloss` liyibinzana le-BSB lalelo gama. Hambisa amagama evesi ngokulandelana `bsbPos` bese uqondanisa amagama `gloss` nombhalo wevesi wokuhumusha kwe-BSB ukuze uthole ukuthi ukuhunyushwa kwegama kukuphi.

Ukufakwa kwezinombolo kwemithombo emibili akuvumelani ngaso sonke isikhathi. Isibonelo, amathegi e-KJV athi "was" njengo `G2258` lapho ithebula laseBereya lino `G1510` . Ukujoyina okumbalwa kuyaphuthelwa ngenxa yokungafani okunje.

### Ukunikezwa

Amathebula e-Berean interlinear asemphakathini. [Isichazamazwi](#lexicon) sinelayisensi ngaphansi kwe-CC BY 4.0 futhi sidinga ukuchazwa.

## Isichazamazwi

Isethi yedatha yesichazamazwi se-STEPBible ( `stepbible-lexicon` ) iqukethe izichazamazwi ezimfushane zesiHebheru, isi-Aramu, nesiGreki (TBESH kanye ne-TBESG) ezivela [ku-STEPBible.org](https://www.stepbible.org/) eTyndale House, eCambridge. Inenombolo eyodwa yenombolo ngayinye kaStrong, futhi yonke inombolo inezinzwa eyodwa noma ngaphezulu ezine-lemma, ukuhumusha, ingxenye yenkulumo, isicwebezelisi sesiNgisi, kanye nencazelo.

Noma yiliphi inani elingu- `strongs` eline-zero-pad elivela [egameni eliphakathi kwemigqa](#interlinear-datasets) elinokufakwa kwesichazamazwi lingabhekwa ku `/api/d/stepbible-lexicon/lexicon/{strongs}.json` ngaphandle kokufometha kabusha. Kuyafana nangamanani angu `.words.json` e-KJV; amanani abanye abahumushi angadinga i-zero-pad kanye ne-suffix stripping kuqala. Okufakiwe kwesiGreki okungeziwe yi-lexicon ngaphandle kwenombolo ka-Strong akushicilelwe.

Amasethi edatha aqukethe okufakiwe kwesichazamazwi afaka `listOfLexiconApiLink` no- `totalNumberOfLexicon` ekufakweni kwawo ku `/api/available_datasets.json` .

### Ukunikezwa

Idatha yesichazamazwi inelayisensi ngaphansi kwe [-CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) . Uma uyisebenzisa, bhala i-STEPBible.org / Tyndale House, eCambridge, bese ubhala noma yiziphi izinguquko. Impahla `licenseNotes` yesethi yedatha ine-credit.

## Faka ohlwini okufakiwe kwe-Lexicon kusethi yedatha

`GET https://bible.helloao.org/api/d/{dataset}/lexicon.json`

Ithola uhlu lwezincazelo zesichazamazwi ezitholakalayo kusethi yedatha.

-   `dataset` i-ID yesethi yedatha (isib. `stepbible-lexicon` ).

### Isibonelo Sekhodi

::: code-tabs#lang

@tab I-JavaScript

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

### Isakhiwo

```typescript:no-line-numbers title="dataset-lexicon.ts"
export interface DatasetLexicon {
    /**
     * Ulwazi lwesethi yedatha yesichazamazwi.
     */
    dataset: Dataset;

    /**
     * Uhlu lwezingeniso zesichazamazwi ezitholakalayo kusethi yedatha.
     */
    lexicon: DatasetLexiconEntrySummary[];
}

export interface DatasetLexiconEntrySummary {
    /**
     * Inombolo kaStrong enephedi elingenalutho lokufakwa kwesichazamazwi. isib. "H0430".
     */
    id: string;

    /**
     * Ulimi lokufakwa kwesichazamazwi.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * Igama lokufakwa kwesichazamazwi.
     * Lona umqondo wokuqala wokungena.
     */
    name: string;

    /**
     * Isixhumanisi se-API sokufakwa kwesichazamazwi.
     */
    apiLink: string;
}
```

### Isibonelo

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

## Thola Ukufakwa Kwe-Lexicon Kusethi Yedatha

`GET https://bible.helloao.org/api/d/{dataset}/lexicon/{strongs}.json`

Uthola isichazamazwi senombolo eyodwa kaStrong, nazo zonke izinzwa zayo.

-   `dataset` i-ID yesethi yedatha (isib. `stepbible-lexicon` ).
-   `strongs` uyinombolo kaStrong ene-zero-paded (isib. `H0430` wegama lesiHebheru elithi _elohim_, noma `G3056` wegama lesiGreki elithi _logos_).

### Isibonelo Sekhodi

::: code-tabs#lang

@tab I-JavaScript

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

### Isakhiwo

```typescript:no-line-numbers title="dataset-lexicon-entry.ts"
export interface DatasetLexiconEntry {
    /**
     * Ulwazi lwesethi yedatha lokufakwa kwesichazamazwi.
     */
    dataset: Dataset;

    /**
     * Ukufakwa kwesichazamazwi.
     */
    entry: DatasetLexiconEntryContent;

    /**
     * Isixhumanisi se-API salokhu kufakwa kwesichazamazwi.
     */
    thisLexiconEntryApiLink: string;
}

export interface DatasetLexiconEntryContent {
    /**
     * Inombolo kaStrong engenamaphedi ayi-zero yokungena. isib. "H0430".
     */
    id: string;

    /**
     * Ulimi lokungena.
     * Lolu ulimi lomqondo wokuqala wokungena.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * Imizwa yokungena, ngokulandelana kwe-ID.
     */
    senses: DatasetLexiconSense[];
}

export interface DatasetLexiconSense {
    /**
     * I-ID enwetshiwe yomqondo. isib. "H0001G".
     * Ilingana nenombolo eyisisekelo kaStrong lapho inombolo inomqondo owodwa.
     */
    id: string;

    /**
     * Ulimi lomqondo.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * I-lemma yomqondo kuskripthi sokuqala.
     */
    lemma: string;

    /**
     * Ukuguqulwa kwamaletha.
     */
    transliteration: string | null;

    /**
     * Ikhodi yomqondo yengxenye yenkulumo (i-morphology).
     */
    partOfSpeech: string | null;

    /**
     * Umqondo omfushane wesiNgisi.
     */
    gloss: string | null;

    /**
     * Incazelo yomqondo njengombhalo ocacile.
     * Izigaba zihlukaniswe yimigqa engenalutho. I-markup emthonjeni iyasuswa.
     */
    definition: string;
}
```

### Isibonelo

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

## Ivesi Losuku

Isethi yedatha yevesi losuku ( `verse-of-the-day` ) iluhlu olukhethiwe lwamavesi aziwayo kanye nezigaba ezimfushane (okungenani amavesi amathathu) ezenza abantu abafanelekela "ivesi losuku": ezingaphezu kuka-640 ngosuku ngalunye lonyaka, kanye nezingaphezu kwe-100 zamaholide obuKristu. Ngayinye inengqondo yayo.

Ivesi ngalinye losuku ngalunye linezigaba ezintathu, ezifanele kakhulu kuqala, kusukela kule seti ehleliwe:

| I-ID          | Incazelo                                                                         |
| ------------- | -------------------------------------------------------------------------------- |
| `comfort`     | Ukusondela kukaNkulunkulu nokunakekela kwakhe osizini, ezinkingeni, nasesizungu. |
| `courage`     | Ukuma uqine futhi ungesabi.                                                      |
| `faith`       | Ukuthembela kuNkulunkulu nezithembiso zakhe.                                     |
| `forgiveness` | Ukuthethelelwa izono kukaNkulunkulu nokuthethelela abanye.                       |
| `gratitude`   | Ukubonga uNkulunkulu.                                                            |
| `guidance`    | UNkulunkulu uqondisa izinyathelo zethu, amacebo ethu, kanye nezinqumo zethu.     |
| `hope`        | Ukuqiniseka ngekusasa uNkulunkulu alithembisile.                                 |
| `inspiration` | Isikhuthazo sokuphila ngokholo nokwenza okuhle.                                  |
| `joy`         | Ukujabula nokuthokoza kuNkulunkulu.                                              |
| `love`        | Uthando lukaNkulunkulu ngathi kanye nothando lwethu ngoNkulunkulu nakwabanye.    |
| `peace`       | Ukuphumula, ukuthula, kanye nokukhululeka ekukhathazekeni.                       |
| `praise`      | Ukukhulekela nokumemezela ubukhulu bukaNkulunkulu.                               |
| `prayer`      | Ukubiza uNkulunkulu nesithembiso Sakhe sokuzwa.                                  |
| `provision`   | UNkulunkulu usinika lokho esikudingayo.                                          |
| `salvation`   | Ukuhlengwa, umusa, kanye nempilo entsha kuKristu.                                |
| `strength`    | UNkulunkulu unikeza amandla nokukhuthazela.                                      |
| `wisdom`      | Ukuhlakanipha kukaNkulunkulu kanye nesiqondiso esiwusizo sokuphila.              |

Amaholide anezigaba zawo. Ngeholide, ivesi losuku lingenye yamavesi eholide, futhi lawo mavesi awasetshenziswa kwezinye izinsuku. Iholide livame ukuhlala usuku olulodwa; ISonto Langemva Kokuvuka lihlala izinsuku ezintathu ngemva kweSonto Lokuvuka, ngakho-ke libala zonke izinsuku ezintathu. Isigaba ngasinye samaholide sino- `holiday` onezinsuku zaso: amaholide ngosuku olufanayo minyaka yonke ano- `month` no `day` , kanye namaholide anosuku olushintsha njalo ngonyaka (ngoba ancike ngeSonto Lokuvuka noma i-Advent) abhala `dates` wawo ekhalendeni likaGregory, elibalwe kusengaphambili kusukela ngo-2026 kuya ku-2125.

| I-ID                       | Iholide                              | Usuku                                                   |
| -------------------------- | ------------------------------------ | ------------------------------------------------------- |
| `epiphany`                 | I-Epiphany                           | 6 Januwari                                              |
| `ash-wednesday`            | NgoLwesithathu Lomlotha              | Izinsuku ezingu-46 ngaphambi kweSonto Lokuvuka          |
| `palm-sunday`              | ISonto Lesundu                       | ISonto Langaphambi Kovuko                               |
| `maundy-thursday`          | ULwesine Oluhle                      | ULwesine Ngaphambi KweSonto Lokuvuka Kwabafileyo        |
| `good-friday`              | ULwesihlanu Oluhle                   | ULwesihlanu ngaphambi kweSonto Lokuvuka                 |
| `resurrection-sunday`      | ISonto Lokuvuka Kwabafileyo          | ISonto lePhasika                                        |
| `post-resurrection-sunday` | Ngemva Kokuvuka Kwabafileyo ngeSonto | Izinsuku ezintathu ngemva kweSonto Lokuvuka Kwabafileyo |
| `ascension-day`            | Usuku Lokwenyuka                     | Izinsuku ezingu-39 ngemva kweSonto Lokuvuka Kwabafileyo |
| `pentecost`                | IPhentekoste                         | Izinsuku ezingu-49 ngemva kweSonto Lokuvuka Kwabafileyo |
| `all-hallows-eve`          | Ubusuku Bama-Hallows Bonke           | Mhla zingama-31 kuMfumfu                                |
| `all-saints-day`           | Usuku Lwabangcwele Bonke             | Mhla lu-1 kuNovemba                                     |
| `advent-sunday`            | ISonto Lokuqala Le-Advent            | ISonto lesine ngaphambi kukaKhisimusi                   |
| `christmas-eve`            | usuku ngaphambi kukakhisimusi        | 24 Disemba                                              |
| `christmas`                | UKhisimusi                           | 25 Disemba                                              |

Isethi yedatha iqukethe izinkomba kuphela, hhayi umbhalo wevesi, ngakho-ke isebenza nakho konke ukuhumusha. Izinombolo zevesi zisebenzisa izinombolo zesiNgisi ezijwayelekile (ezifana ne-BSB). Idatha ingafundwa ngezindlela ezintathu:

-   [`/api/d/verse-of-the-day/verses.json`](#list-verses-in-a-dataset) ibala wonke amavesi kusethi yedatha ngezigaba zawo, kanye namaholide nezinsuku zawo, kufayela elilodwa.
-   [`/api/d/verse-of-the-day/categories/{category}.json`](#get-a-category-from-a-dataset) ibala wonke amavesi esigabeni. Lena yindlela elula yokukhetha ivesi losuku esigabeni esisodwa.
-   [`/api/d/verse-of-the-day/{book}/{chapter}.json`](#get-a-chapter-from-a-dataset) ubala abantu abazongenela ukhetho esahlukweni, ngezigaba zabo. Izahluko eziqukethe umuntu ozongenela ukhetho kuphela ezitholakalayo; sebenzisa izixhumanisi zezahluko zencwadi noma `/api/d/verse-of-the-day/books.json` ukuze ubathole.

Amasethi edatha aqukethe izigaba zamavesi afaka `listOfVersesApiLink` , `listOfCategoriesApiLink` , no `totalNumberOfCategories` ekufakweni kwawo ku `/api/available_datasets.json` .

### Ukukhetha Ivesi Losuku

I-API yenziwe ngamafayela angaguquki, ngakho ayikukhetheli ivesi. Esikhundleni salokho, kunesimiso sokukhetha elilodwa, ukuze lonke uhlelo lokusebenza olulilandelayo lubonise ivesi elifanayo ngosuku olufanayo. Izinhlelo zokusebenza zikhululekile ukuzikhetha ngendlela ehlukile; isimiso sizinika okuzenzakalelayo okwabiwe.

Umhlangano ukhetha amavesi namaholide ku `/api/d/verse-of-the-day/verses.json` . Ngeholide, ukhetha elinye lamavesi eholide, uwadlula unyaka ngamunye, ngakho iholide linevesi elihlukile njalo ngonyaka kuze kube yilapho wonke amavesi alo esesetshenzisiwe. Ngezinye izinsuku, unyaka ngamunye uthola ukushintshwa kwawo kwamavesi asetshenziswa ngalowo nyaka (kuhlelwe nge-hash yereferensi yevesi ngalinye, unyaka, kanye nembewu ongayikhetha), futhi ivesi losuku yilelo eliselusukwini losuku lonyaka kulolo shintshwa. Isethi yedatha inamavesi angaphezu kuka-366 ngosuku ngalunye olusetshenziswa minyaka yonke, ngakho ivesi aliphindi phakathi nonyaka wekhalenda, ukuhleleka kuyashintsha minyaka yonke, futhi usuku olufanayo luhlala lunikeza ivesi elifanayo. Amavesi amasha ayengezwa (no- `addedIn` ) futhi amadala asusiwe (no- `removedIn` ) kuphela onyakeni ongakaqali okwamanje, ngakho ivesi losuku losuku oludlule alishintshi.

Ikhasi le [-Verse of the Day Convention](./verse-of-the-day-convention.md) lichaza i-algorithm isinyathelo ngesinyathelo, nge-pseudocode kanye namanani okuhlola, ukuze ukwazi ukuyisebenzisa nganoma yiluphi ulimi.

Ukuze usebenzise i-oda lakho, khetha imbewu yakho (isibonelo, igama lohlelo lwakho lokusebenza): inikeza ukuxubha okuhlukile ngeziqinisekiso ezifanayo. Ungakhetha futhi emavesini esigaba esisodwa, kodwa isigaba ngasinye sinamavesi ambalwa kunezinsuku ezikhona ngonyaka, ngakho amavesi aso aphinda ngokushesha.

Ama-SDK alandela umhlangano:

```ts:no-line-numbers title="verse-of-the-day.js"
import { FreeUseBibleApi } from 'free-use-bible-api';

const api = new FreeUseBibleApi();

// Usuku olufana no-YYYY-MM-DD, noma Usuku (kusetshenziswa usuku lwekhalenda lendawo). Okuzenzakalelayo kuya namuhla.
const ref = await api.getVerseOfTheDay('2026-01-01');

// Thola umbhalo wevesi enguqulweni.
const chapter = await api.getTranslationBookChapter('BSB', ref.book, ref.chapter);
const verses = chapter.chapter.content.filter(
    (c) =>
        c.type === 'verse' &&
        c.number >= ref.verse &&
        c.number <= (ref.endVerse ?? ref.verse)
);
console.log(ref, verses);
```

-   `getVerseOfTheDay(date?, { seed?, category?, dataset? }?)` ulanda uhlu lwamavesi bese ekhetha kuwo. `pickVerseOfTheDay(verses, date?, { seed?, category? }?)` ukhetha ohlwini osuvele unalo.
-   I-Kotlin SDK ine `getVerseOfTheDay(date?, seed?, category?)` kanye ne `pickVerseOfTheDay(verses, date?, seed?, category?)` , ezithatha usuku njengentambo `YYYY-MM-DD` .
-   I-Swift SDK ine `getVerseOfTheDay(date:seed:category:)` kanye ne `pickVerseOfTheDay(_:date:seed:category:holidays:)` , ezithatha usuku njengentambo `YYYY-MM-DD` noma i- `Date` (kusetshenziswa usuku lwayo lwekhalenda endaweni yesikhathi samanje).
-   [Iseva ye-MCP](https://github.com/HelloAOLab/bible-api/tree/main/packages/seed-bible-mcp) inethuluzi eli `getVerseOfTheDay` elibuyisela ivesi losuku nombhalo walo.
-   Iphakheji `@helloao/tools` inohlu olufanayo kanye nomsebenzi `getVerseOfTheDay(date?, { seed?, category? }?)` ku- `@helloao/tools/generation/verse-of-the-day.js` .

### Ilayisensi

Uhlu luhlanganiswe yi-AO Lab futhi lukhishwe ngaphansi [kwelayisensi ye-MIT](https://github.com/HelloAOLab/bible-api/blob/main/LICENSE) . Umbhalo wevesi uvela kunoma iyiphi inguqulo oyithatha kuyo.

## Bhala Amavesi Kusethi Yedatha

`GET https://bible.helloao.org/api/d/{dataset}/verses.json`

Uthola yonke ivesi (noma indima emfushane) kusethi yedatha, enezigaba ezikuyo ngayinye, ngokulandelana kwezincwadi. Itholakala kuphela kumasethi edatha anamavesi anezigaba, njenge `verse-of-the-day` .

-   `dataset` i-ID yesethi yedatha (isib. `verse-of-the-day` ).

### Isibonelo Sekhodi

::: code-tabs#lang

@tab I-JavaScript

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

### Isakhiwo

```typescript:no-line-numbers title="dataset-verses.ts"
export interface DatasetVerses {
    /**
     * Ulwazi lweqoqo ledatha lamavesi.
     */
    dataset: Dataset;

    /**
     * Ivesi ngalinye (noma indima emfushane) kusethi yedatha, kanye nezigaba zalo, ngokulandelana kwezincwadi zeBhayibheli.
     */
    verses: DatasetCategorizedVerse[];

    /**
     * Amaholide anamavesi awo, nezinsuku zawo.
     * Kushiywe uma isethi yedatha ingenawo amaholide.
     */
    holidays?: DatasetVersesHoliday[];
}

export interface DatasetVersesHoliday extends DatasetCategoryHoliday {
    /**
     * I-ID yesigaba seholide. isib. "uKhisimusi".
     */
    id: string;

    /**
     * Igama lesiNgisi leholide. isib. "uKhisimusi".
     */
    name: string;
}

export interface DatasetCategoryHoliday {
    /**
     * Inyanga (1 kaJanuwari) kanye nosuku lweholide oluwela ngosuku olufanayo minyaka yonke.
     * Kushiywe ngaphandle kwamaholide lapho usuku lwawo lushintsha njalo ngonyaka.
     */
    month?: number;
    day?: number;

    /**
     * Izinsuku (YYYY-MM-DD, ikhalenda likaGregory) zeholide elinosuku olushintsha njalo ngonyaka, ngokulandelana.
     * Zibalwe kusengaphambili iminyaka ehlukahlukene (njengamanje kusukela ngo-2026 kuya ku-2125), futhi leli holide ligcinwa kuphela ezinsukwini ezibalwe.
     * Akuvunyelwe ngamaholide awela ngosuku olufanayo minyaka yonke.
     */
    dates?: string[];
}

export interface DatasetCategorizedVerse {
    /**
     * I-ID yencwadi. isib. "PRO".
     */
    book: string;

    /**
     * Inombolo yesahluko.
     */
    chapter: number;

    /**
     * Inombolo yevesi.
     * Uma `endVerse` ekhona, khona-ke leli yivesi lapho indima iqala khona.
     */
    verse: number;

    /**
     * Ivesi eliphela ngalo indima.
     * Akufakiwe uma okufakiwe kuyivesi elilodwa.
     */
    endVerse?: number;

    /**
     * Ama-ID ezigaba okukhulunywa ngazo leli vesi, abaluleke kakhulu kuqala.
     */
    categories: string[];

    /**
     * Unyaka wokuqala lapho ivesi lingaba yivesi losuku.
     * Akuvunyelwe uma ivesi belilokhu likhona ohlwini.
     */
    addedIn?: number;

    /**
     * Unyaka wokuqala lapho ivesi lingasakwazi ukuba yivesi losuku.
     * Amavesi asusiwe ahlala kusethi yedatha ukuze amavesi eminyaka edlule asakwazi ukukhethwa.
     * Kushiywe uma ivesi lingasuswanga ohlwini.
     */
    removedIn?: number;
}
```

### Isibonelo

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

## Faka Izigaba Kusethi Yedatha

`GET https://bible.helloao.org/api/d/{dataset}/categories.json`

Ithola uhlu lwezigaba zamavesi ezitholakalayo kusethi yedatha.

-   `dataset` i-ID yesethi yedatha (isib. `verse-of-the-day` ).

### Isibonelo Sekhodi

::: code-tabs#lang

@tab I-JavaScript

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

### Isakhiwo

```typescript:no-line-numbers title="dataset-categories.ts"
export interface DatasetCategories {
    /**
     * Ulwazi lwesethi yedatha yezigaba.
     */
    dataset: Dataset;

    /**
     * Uhlu lwezigaba zamavesi ezitholakalayo kusethi yedatha.
     */
    categories: DatasetCategorySummary[];
}

export interface DatasetCategorySummary {
    /**
     * I-ID yesigaba. isib. "ithemba".
     */
    id: string;

    /**
     * Igama lesiNgisi lesigaba. isib. "Ithemba".
     */
    name: string;

    /**
     * Incazelo yalokho okushiwo amavesi esigabeni.
     */
    description: string;

    /**
     * Inani lamavesi (noma izindinyana ezimfushane) ezingaphansi kwesigaba.
     */
    numberOfVerses: number;

    /**
     * Izinsuku zeholide ezikulesi sigaba (bheka i-DatasetCategoryHoliday ngenhla).
     * Kushiywe ngaphandle kwezigaba ezingezona ezeholide.
     */
    holiday?: DatasetCategoryHoliday;

    /**
     * Isixhumanisi se-API sesigaba.
     */
    apiLink: string;
}
```

### Isibonelo

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

## Thola Isigaba Kusethi Yedatha

`GET https://bible.helloao.org/api/d/{dataset}/categories/{category}.json`

Ithola isigaba sevesi elilodwa, kanye nevesi ngalinye elingelayo.

-   `dataset` i-ID yesethi yedatha (isib. `verse-of-the-day` ).
-   `category` uyi-ID yesigaba (isib. `hope` ).

### Isibonelo Sekhodi

::: code-tabs#lang

@tab I-JavaScript

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

### Isakhiwo

```typescript:no-line-numbers title="dataset-category.ts"
export interface DatasetCategoryResponse {
    /**
     * Ulwazi lwesethi yedatha yesigaba.
     */
    dataset: Dataset;

    /**
     * Isigaba, namavesi aso.
     */
    category: DatasetCategory;

    /**
     * Isixhumanisi se-API salesi sigaba.
     */
    thisCategoryApiLink: string;
}

export interface DatasetCategory {
    /**
     * I-ID yesigaba. isib. "ithemba".
     */
    id: string;

    /**
     * Igama lesiNgisi lesigaba. isib. "Ithemba".
     */
    name: string;

    /**
     * Incazelo yalokho okushiwo amavesi esigabeni.
     */
    description: string;

    /**
     * Izinsuku zeholide ezikulesi sigaba (bheka i-DatasetCategoryHoliday ku-"List Verses in a Dataset").
     * Kulezo zinsuku, ivesi losuku lingenye yamavesi esigaba, futhi awasetshenziswa kwezinye izinsuku.
     * Kushiywe ngaphandle kwezigaba ezingezona ezeholide.
     */
    holiday?: DatasetCategoryHoliday;

    /**
     * Amavesi (noma izindinyana ezimfushane) angaphansi kwesigaba, ngokulandelana kwezincwadi zeBhayibheli.
     * Kufaka phakathi amavesi asusiwe ohlwini (bheka `removedIn` ).
     */
    verses: DatasetCategoryVerse[];
}

export interface DatasetCategoryVerse {
    /**
     * I-ID yencwadi. isib. "JER".
     */
    book: string;

    /**
     * Inombolo yesahluko.
     */
    chapter: number;

    /**
     * Inombolo yevesi.
     * Uma `endVerse` ekhona, khona-ke leli yivesi lapho indima iqala khona.
     */
    verse: number;

    /**
     * Ivesi eliphela ngalo indima.
     * Akukhulunywa uma ireferensi iyivesi elilodwa.
     */
    endVerse?: number;

    /**
     * Unyaka wokuqala lapho ivesi lingaba yivesi losuku.
     * Akuvunyelwe uma ivesi belilokhu likhona ohlwini.
     */
    addedIn?: number;

    /**
     * Unyaka wokuqala lapho ivesi lingasakwazi ukuba yivesi losuku.
     * Amavesi asusiwe ahlala kusethi yedatha ukuze amavesi eminyaka edlule asakwazi ukukhethwa.
     * Kushiywe uma ivesi lingasuswanga ohlwini.
     */
    removedIn?: number;
}
```

### Isibonelo

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
