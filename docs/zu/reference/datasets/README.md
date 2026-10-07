# Amasethi edatha

Ama-Endpoints okuphequlula amasethi edatha engeziwe eBhayibheli - njengezinkomba ezihambisanayo kanye nezinhlangano eziseBhayibhelini (abantu, izindawo, imicimbi, namaqembu abantu) - nokulanda izincwadi zabo, okuqukethwe yizahluko, kanye nezinhlangano.

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
     */
    totalNumberOfReferences: number;

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

## Thola Isahluko ku-Dataset

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

Ithola okuqukethwe kwesahluko esisodwa sencwadi ethile kanye nesethi yedatha.

Kumasethi edatha abhekisela ku-cross reference (njenge- `open-cross-ref` ), isahluko siqukethe uhlu lwezinkomba ezibhekisela ku-cross verse ngayinye. Kumasethi edatha enhlangano (njenge- `theographic` ), isahluko siqukethe abantu, izindawo, kanye nemicimbi evela esahlukweni - bheka [i-Thola Izinhlangano Esahlukweni](#get-the-entities-in-a-chapter) .

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

interface DatasetVerse {
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
