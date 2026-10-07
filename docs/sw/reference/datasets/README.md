# Seti za data

Sehemu za mwisho za kuvinjari seti za ziada za data za Biblia - kama vile marejeleo mtambuka na viumbe vya kibiblia (watu, mahali, matukio, na vikundi vya watu) - na kuchukua vitabu vyao, maudhui ya sura, na viumbe.

## Seti za Data Zinazopatikana

`GET https://bible.helloao.org/api/available_datasets.json`

Hupata orodha ya seti za data za Biblia zinazopatikana katika API.

### Mfano wa Msimbo

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

### Muundo

```typescript:no-line-numbers title="available-datasets.ts"
export interface AvailableDatasets {
    /**
     * Orodha ya seti za data.
     */
    datasets: Dataset[];
}

export interface Dataset {
    /**
     * Kitambulisho cha seti ya data.
     */
    id: string;

    /**
     * Jina la seti ya data.
     */
    name: string;

    /**
     * Tovuti ya seti ya data.
     */
    website: string;

    /**
     * URL ambayo leseni ya seti ya data inaweza kupatikana.
     */
    licenseUrl: string;

    /**
     * Jina la Kiingereza la seti ya data.
     */
    englishName: string;

    /**
     * Lebo ya lugha ya ISO 639 yenye herufi 3 ambayo seti ya data iko kimsingi.
     */
    language: string;

    /**
     * Mwelekeo ambao lugha imeandikwa.
     * "ltr" inaonyesha kwamba maandishi yameandikwa kutoka upande wa kushoto wa ukurasa kwenda kulia.
     * "rtl" inaonyesha kwamba maandishi yameandikwa kutoka upande wa kulia wa ukurasa kwenda kushoto.
     */
    textDirection: 'ltr' | 'rtl';

    /**
     * Kiungo cha API cha orodha ya vitabu vinavyopatikana kwa seti hii ya data.
     */
    listOfBooksApiLink: string;

    /**
     * Orodha inayopatikana ya miundo.
     */
    availableFormats: ('json' | 'usfm')[];

    /**
     * Idadi ya vitabu vilivyomo katika seti hii ya data.
     */
    numberOfBooks: number;

    /**
     * Jumla ya idadi ya sura zilizomo katika seti hii ya data.
     */
    totalNumberOfChapters: number;

    /**
     * Jumla ya idadi ya mistari iliyomo katika seti hii ya data.
     */
    totalNumberOfVerses: number;

    /**
     * Jumla ya idadi ya marejeleo mtambuka yaliyomo katika seti hii ya data.
     */
    totalNumberOfReferences: number;

    /**
     * Hupata jina la lugha ambayo seti ya data iko.
     * Haifafanuliwa au haijafafanuliwa ikiwa jina la lugha halijulikani.
     */
    languageName?: string;

    /**
     * Anapata jina la lugha hiyo kwa Kiingereza.
     * Haijafafanuliwa au haijafafanuliwa ikiwa lugha haina jina la Kiingereza.
     */
    languageEnglishName?: string;

    /**
     * Viungo vya API vya orodha ya vitu vilivyo kwenye seti ya data.
     * Imeachwa ikiwa seti ya data haina vitu vinavyolingana.
     */
    listOfPeopleApiLink?: string;
    listOfPlacesApiLink?: string;
    listOfEventsApiLink?: string;
    listOfPeopleGroupsApiLink?: string;

    /**
     * Jumla ya idadi ya vitu vilivyomo kwenye seti ya data.
     * Imeachwa ikiwa seti ya data haina vitu vinavyolingana.
     */
    totalNumberOfPeople?: number;
    totalNumberOfPlaces?: number;
    totalNumberOfEvents?: number;
    totalNumberOfPeopleGroups?: number;
}
```

### Mfano

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

## Orodhesha Vitabu katika Seti ya Data

`GET https://bible.helloao.org/api/d/{dataset}/books.json`

Hupata orodha ya vitabu vinavyopatikana kwa seti ya data iliyotolewa.

-   `dataset` kitambulisho cha seti ya data (km `open-cross-ref` ).

### Mfano wa Msimbo

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-books.js"
const dataset = 'open-cross-ref';

// Pata orodha ya vitabu kwa seti ya data ya marejeleo-wazi
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

### Muundo

```typescript:no-line-numbers title="dataset-books.ts"
export interface DatasetBooks {
    /**
     * Taarifa za seti ya data kwa ajili ya vitabu.
     */
    dataset: Dataset;

    /**
     * Orodha ya vitabu vinavyopatikana kwa ajili ya seti ya data.
     */
    books: DatasetBook[];
}

interface DatasetBook {
    /**
     * Kitambulisho cha kitabu.
     * Inalingana na kitambulisho cha kitabu kinacholingana katika Biblia (GEN, EXO, n.k.).
     */
    id: string;

    /**
     * Mpangilio wa kitabu katika Biblia.
     */
    order: number;

    /**
     * Nambari ya sura ya kwanza katika kitabu.
     */
    firstChapterNumber: number;

    /**
     * Kiungo cha sura ya kwanza ya kitabu.
     */
    firstChapterApiLink: string | null;

    /**
     * Nambari ya sura ya mwisho katika kitabu.
     */
    lastChapterNumber: number | null;

    /**
     * Kiungo cha sura ya mwisho ya kitabu.
     */
    lastChapterApiLink: string | null;

    /**
     * Idadi ya sura ambazo kitabu kina.
     */
    numberOfChapters: number;

    /**
     * Idadi ya mistari iliyomo katika kitabu hicho.
     */
    totalNumberOfVerses: number;

    /**
     * Jumla ya marejeleo mtambuka ambayo kitabu hiki kina.
     */
    totalNumberOfReferences: number;
}
```

### Mfano

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

## Pata Sura kutoka kwa Seti ya Data

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

Hupata maudhui ya sura moja kwa kitabu na seti ya data fulani.

Kwa seti za data za marejeleo mtambuka (kama vile `open-cross-ref` ), sura ina orodha ya marejeleo mtambuka kwa kila mstari. Kwa seti za data za huluki (kama vile `theographic` ), sura ina watu, mahali, na matukio yanayoonekana katika sura - tazama [Pata Viungo katika Sura](#get-the-entities-in-a-chapter) .

-   `dataset` kitambulisho cha seti ya data (km `open-cross-ref` ).
-   `book` ni kitambulisho cha kitabu (km `GEN` kwa Mwanzo).
-   `chapter` ni nambari ya sura ya nambari (km `1` kwa sura ya kwanza).

### Mfano wa Msimbo

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-chapter.js"
const dataset = 'open-cross-ref';
const book = 'GEN';
const chapter = 1;

// Pata Mwanzo 1 kutoka kwa seti ya data ya marejeleo wazi
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

### Muundo

```typescript:no-line-numbers title="dataset-chapter.ts"
export interface DatasetBookChapter {
    /**
     * Taarifa za seti ya data kwa sura ya kitabu.
     */
    dataset: Dataset;

    /**
     * Taarifa za kitabu kwa ajili ya sura ya kitabu.
     */
    book: DatasetBook;

    /**
     * Kiungo cha sura hii.
     */
    thisChapterLink: string;

    /**
     * Kiungo cha sura inayofuata.
     * Batilisha ikiwa hii ndiyo sura ya mwisho katika seti ya data.
     */
    nextChapterApiLink: string | null;

    /**
     * Kiungo cha sura iliyotangulia.
     * Batilisha ikiwa hii ni sura ya kwanza katika seti ya data.
     */
    previousChapterApiLink: string | null;

    /**
     * Idadi ya mistari ambayo sura hiyo ina.
     */
    numberOfVerses: number;

    /**
     * Taarifa kwa ajili ya sura.
     */
    chapter: DatasetChapterData;
}

interface DatasetChapterData {
    /**
     * Idadi ya sura.
     */
    number: number;

    /**
     * Maudhui ya sura hiyo.
     */
    content: DatasetVerse[];
}

interface DatasetVerse {
    /**
     * Nambari ya mstari.
     */
    verse: number;

    /**
     * Marejeleo mtambuka ya mstari huo.
     *
     * Imepangwa kwa alama, ikishuka.
     */
    references: DatasetReference[];
}

interface DatasetReference {
    /**
     * Kitambulisho cha kitabu kinachorejelewa.
     */
    book: string;

    /**
     * Nambari ya sura.
     */
    chapter: number;

    /**
     * Nambari ya mstari.
     * Ikiwa `endVerse` ipo, basi huu ndio mstari ambao marejeleo yanaanza.
     */
    verse: number;

    /**
     * Mstari ambao marejeleo huishia.
     */
    endVerse?: number;

    /**
     * Alama muhimu kwa marejeleo.
     */
    score?: number;
}
```

### Mfano

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

## Vyombo

Baadhi ya seti za data - kama vile seti ya data [ya Theographic Bible Metadata](https://github.com/robertrouse/theographic-bible-metadata) ( `theographic` ) - zina vyenye vitu: watu, mahali, matukio, na vikundi vya watu, pamoja na uhusiano kati yao na mistari ya Biblia inayowataja.

Seti za data zenye vipengele ni pamoja na sifa `listOfPeopleApiLink` , `listOfPlacesApiLink` , `listOfEventsApiLink` , na `listOfPeopleGroupsApiLink` katika ingizo lao katika `/api/available_datasets.json` .

Seti za data za vitu pia hutoa data inayolingana na sura: `/api/d/{dataset}/books.json` huorodhesha vitabu ambavyo sura zake zina data ya vitu, na `/api/d/{dataset}/{book}/{chapter}.json` hurejesha watu, mahali, na matukio yanayoonekana katika sura hiyo, pamoja na nambari za mistari ambapo kila moja imetajwa. Tazama [Pata Vitu Katika Sura](#get-the-entities-in-a-chapter) .

Mashirika hurejelea vifungu vya Biblia kwa kutumia vitambulisho sawa vya kitabu, nambari za sura, na nambari za mistari kama API nyingine, ili viweze kuunganishwa na tafsiri yoyote. Hurejelea kila kimoja kwa kutumia marejeleo ya huluki:

```typescript:no-line-numbers title="entity-shared.ts"
export interface DatasetEntityRef {
    /**
     * Kitambulisho cha huluki inayorejelewa.
     */
    id: string;

    /**
     * Aina ya huluki inayorejelewa.
     * Inalingana na sehemu ya mkusanyiko wa kiungo cha API cha huluki, kwa hivyo kiungo kinaweza kujengwa kama `/api/d/{dataset}/{type}/{id}.json` .
     */
    type: 'people' | 'places' | 'events' | 'groups';

    /**
     * Jina la huluki inayorejelewa.
     */
    name?: string;

    /**
     * Kiungo cha API cha huluki inayorejelewa.
     */
    apiLink?: string;
}

export interface VerseRef {
    /**
     * Kitambulisho cha kitabu (GEN, EXO, n.k.).
     */
    book: string;

    /**
     * Nambari ya sura ambayo marejeleo yanaanza.
     */
    chapter: number;

    /**
     * Nambari ya mstari ambayo marejeleo yanaanza.
     */
    verse: number;

    /**
     * Mstari ambao marejeleo huishia.
     * Mistari mfululizo katika sura hiyo hiyo imekunjwa na kuwa marejeleo moja.
     */
    endVerse?: number;
}
```

## Pata Vyombo Katika Sura

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

Kwa seti za data za huluki, hupata watu, mahali, na matukio yanayoonekana katika sura moja, pamoja na nambari za mistari katika sura ambapo kila moja imetajwa.

-   `dataset` kitambulisho cha seti ya data (km `theographic` ).
-   `book` ni kitambulisho cha kitabu (km `GEN` kwa Mwanzo).
-   `chapter` ni nambari ya sura ya nambari (km `1` kwa sura ya kwanza).

Orodha ya vitabu na sura zenye data ya huluki inapatikana kutoka `GET https://bible.helloao.org/api/d/{dataset}/books.json` , ambayo inafuata muundo sawa na [mwisho wa seti ya vitabu vya data](#list-books-in-a-dataset) . Kwa seti za data za huluki, `totalNumberOfVerses` ni idadi ya mistari iliyotajwa na angalau huluki moja na `totalNumberOfReferences` ni jumla ya idadi ya kutajwa kwa huluki-aya.

### Mfano wa Msimbo

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter-entities.js"
const dataset = 'theographic';
const book = 'GEN';
const chapter = 2;

// Pata watu, mahali, na matukio yanayoonekana katika Mwanzo 2
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

### Muundo

```typescript:no-line-numbers title="dataset-chapter-entities.ts"
export interface DatasetEntityBookChapter {
    /**
     * Taarifa za seti ya data kwa sura ya kitabu.
     */
    dataset: Dataset;

    /**
     * Taarifa za kitabu kwa ajili ya sura ya kitabu.
     */
    book: DatasetBook;

    /**
     * Data ya chombo kwa ajili ya sura hiyo.
     */
    chapter: DatasetEntityChapterData;

    /**
     * Kiungo cha sura hii.
     */
    thisChapterLink: string;

    /**
     * Kiungo cha sura inayofuata.
     * Batilisha ikiwa hii ndiyo sura ya mwisho katika seti ya data.
     */
    nextChapterApiLink: string | null;

    /**
     * Kiungo cha sura iliyotangulia.
     * Batilisha ikiwa hii ni sura ya kwanza katika seti ya data.
     */
    previousChapterApiLink: string | null;

    /**
     * Idadi ya watu, maeneo, na matukio yanayoonekana katika sura hiyo.
     */
    numberOfPeople: number;
    numberOfPlaces: number;
    numberOfEvents: number;
}

interface DatasetEntityChapterData {
    /**
     * Idadi ya sura.
     */
    number: number;

    /**
     * Watu wanaoonekana katika sura hiyo.
     * Imepangwa kulingana na mstari wa kwanza ambao zinaonekana.
     */
    people: ChapterPerson[];

    /**
     * Sehemu zinazoonekana katika sura.
     * Imepangwa kulingana na mstari wa kwanza ambao zinaonekana.
     */
    places: ChapterPlace[];

    /**
     * Matukio yanayoonekana katika sura hiyo.
     * Imepangwa kulingana na mstari wa kwanza ambao zinaonekana.
     */
    events: ChapterEvent[];
}

interface ChapterPerson {
    /**
     * Kitambulisho cha mtu huyo.
     */
    id: string;

    /**
     * Jina la mtu huyo.
     */
    name: string;

    /**
     * Kama jina la mtu huyo ni jina sahihi.
     */
    isProperName?: boolean;

    /**
     * Jinsia ya mtu huyo.
     */
    gender?: string;

    /**
     * Mwaka ambao mtu huyo alizaliwa na mwaka ambao alikufa.
     * Nambari hasi ni miaka BC. Nambari chanya ni miaka AD.
     */
    birthYear?: number;
    deathYear?: number;

    /**
     * Kiungo cha API cha mtu huyo.
     */
    apiLink: string;

    /**
     * Idadi ya mistari katika sura inayomtaja mtu huyo.
     * Imepangwa kwa mpangilio wa kupanda.
     */
    verses: number[];
}

interface ChapterPlace {
    /**
     * Kitambulisho cha mahali hapo.
     */
    id: string;

    /**
     * Jina la mahali hapo.
     */
    name: string;

    /**
     * Aina ya sifa ya kijiografia ambayo mahali hapo ni.
     */
    featureType?: string;

    /**
     * Latitudo na longitudo ya mahali hapo.
     */
    latitude?: number;
    longitude?: number;

    /**
     * Kiungo cha API cha mahali hapo.
     */
    apiLink: string;

    /**
     * Idadi ya mistari katika sura inayotaja mahali hapo.
     * Imepangwa kwa mpangilio wa kupanda.
     */
    verses: number[];
}

interface ChapterEvent {
    /**
     * Kitambulisho cha tukio hilo.
     */
    id: string;

    /**
     * Jina la tukio.
     */
    name: string;

    /**
     * Tarehe ambayo tukio lilianza.
     */
    startDate?: string;

    /**
     * Kiungo cha API cha tukio hilo.
     */
    apiLink: string;

    /**
     * Idadi ya mistari katika sura inayoelezea tukio hilo.
     * Imepangwa kwa mpangilio wa kupanda.
     */
    verses: number[];
}
```

### Mfano

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

## Orodhesha Watu katika Seti ya Data

`GET https://bible.helloao.org/api/d/{dataset}/people.json`

Hupata orodha ya watu wanaopatikana kwa seti ya data iliyotolewa.

-   `dataset` kitambulisho cha seti ya data (km `theographic` ).

### Mfano wa Msimbo

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-people.js"
const dataset = 'theographic';

// Pata orodha ya watu kwa seti ya data ya kijiografia
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

### Muundo

```typescript:no-line-numbers title="dataset-people.ts"
export interface DatasetPeople {
    /**
     * Taarifa za seti ya data kwa ajili ya watu.
     */
    dataset: Dataset;

    /**
     * Orodha ya watu wanaopatikana kwa ajili ya seti ya data.
     */
    people: DatasetPersonSummary[];
}

interface DatasetPersonSummary {
    /**
     * Kitambulisho cha mtu huyo.
     */
    id: string;

    /**
     * Jina la mtu huyo.
     */
    name: string;

    /**
     * Kama jina la mtu huyo ni jina sahihi.
     */
    isProperName?: boolean;

    /**
     * Jinsia ya mtu huyo.
     */
    gender?: string;

    /**
     * Idadi ya marejeleo ya Biblia yanayomtaja mtu huyo.
     */
    numberOfReferences: number;

    /**
     * Kiungo cha API cha mtu huyo.
     */
    thisPersonApiLink: string;
}
```

### Mfano

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

## Pata Mtu kutoka kwa Seti ya Data

`GET https://bible.helloao.org/api/d/{dataset}/people/{person}.json`

Hupata taarifa kuhusu mtu mmoja, ikiwa ni pamoja na marejeleo ya Biblia yanayomtaja na uhusiano wake na watu wengine, mahali, matukio, na makundi ya watu.

-   `dataset` kitambulisho cha seti ya data (km `theographic` ).
-   `person` kitambulisho cha mtu huyo (km `paul_2479` ).

### Mfano wa Msimbo

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-person.js"
const dataset = 'theographic';
const person = 'paul_2479';

// Pata taarifa kuhusu Paulo kutoka kwa seti ya data ya kijiografia
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

### Muundo

```typescript:no-line-numbers title="dataset-person.ts"
export interface DatasetPersonResponse {
    /**
     * Taarifa ya seti ya data kwa mtu huyo.
     */
    dataset: Dataset;

    /**
     * Taarifa kuhusu mtu huyo.
     */
    person: DatasetPerson;

    /**
     * Kiungo cha API cha mtu huyu.
     */
    thisPersonApiLink: string;
}

interface DatasetPerson {
    /**
     * Kitambulisho cha mtu huyo.
     */
    id: string;

    /**
     * Jina la mtu huyo.
     */
    name: string;

    /**
     * Majina mengine ambayo mtu huyo anaitwa.
     */
    alsoCalled?: string[];

    /**
     * Kama jina la mtu huyo ni jina sahihi.
     */
    isProperName?: boolean;

    /**
     * Jinsia ya mtu huyo.
     */
    gender?: string;

    /**
     * Maelezo ya mtu. Kila mfuatano ni aya.
     */
    description?: string[];

    /**
     * Mwaka ambao mtu huyo alizaliwa na mwaka ambao alikufa.
     * Nambari hasi ni miaka BC. Nambari chanya ni miaka AD.
     */
    birthYear?: number;
    deathYear?: number;

    /**
     * Miaka ya mwanzo na ya mwisho ambayo mtu huyo anatajwa.
     */
    minYear?: number;
    maxYear?: number;

    /**
     * Mahali ambapo mtu huyo alizaliwa na kufia.
     */
    birthPlace?: DatasetEntityRef;
    deathPlace?: DatasetEntityRef;

    /**
     * Mahusiano ya kifamilia ya mtu huyo.
     */
    father?: DatasetEntityRef[];
    mother?: DatasetEntityRef[];
    partners?: DatasetEntityRef[];
    children?: DatasetEntityRef[];
    siblings?: DatasetEntityRef[];
    halfSiblingsSameMother?: DatasetEntityRef[];
    halfSiblingsSameFather?: DatasetEntityRef[];

    /**
     * Makundi ya watu ambayo mtu huyo ni mwanachama wake.
     */
    memberOf?: DatasetEntityRef[];

    /**
     * Matukio ambayo mtu huyo alishiriki.
     */
    events?: DatasetEntityRef[];

    /**
     * Orodha ya marejeleo ya Biblia yanayomtaja mtu huyo.
     * Imepangwa kwa mpangilio wa kitabu, sura, na mstari.
     */
    references: VerseRef[];
}
```

### Mfano

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

## Orodhesha Maeneo katika Seti ya Data

`GET https://bible.helloao.org/api/d/{dataset}/places.json`

Hupata orodha ya maeneo yanayopatikana kwa seti ya data iliyotolewa.

-   `dataset` kitambulisho cha seti ya data (km `theographic` ).

### Muundo

```typescript:no-line-numbers title="dataset-places.ts"
export interface DatasetPlaces {
    /**
     * Taarifa ya seti ya data kwa maeneo hayo.
     */
    dataset: Dataset;

    /**
     * Orodha ya maeneo yanayopatikana kwa seti ya data.
     */
    places: DatasetPlaceSummary[];
}

interface DatasetPlaceSummary {
    /**
     * Kitambulisho cha mahali hapo.
     */
    id: string;

    /**
     * Jina la mahali hapo.
     */
    name: string;

    /**
     * Aina ya sifa ya kijiografia ambayo mahali hapo ni.
     * Kwa mfano, "Mji", "Mkoa", "Mlima", "Maji", n.k.
     */
    featureType?: string;

    /**
     * Latitudo na longitudo ya mahali hapo.
     */
    latitude?: number;
    longitude?: number;

    /**
     * Idadi ya marejeleo ya Biblia yanayotaja mahali hapo.
     */
    numberOfReferences: number;

    /**
     * Kiungo cha API cha mahali hapo.
     */
    thisPlaceApiLink: string;
}
```

## Pata Mahali kutoka kwa Seti ya Data

`GET https://bible.helloao.org/api/d/{dataset}/places/{place}.json`

Hupata taarifa kuhusu mahali pamoja, ikiwa ni pamoja na marejeleo ya Biblia yanayolitaja na watu na matukio yanayohusiana nalo.

-   `dataset` kitambulisho cha seti ya data (km `theographic` ).
-   `place` kitambulisho cha mahali (km `jerusalem_636` ).

### Muundo

```typescript:no-line-numbers title="dataset-place.ts"
export interface DatasetPlaceResponse {
    /**
     * Taarifa ya seti ya data ya mahali hapo.
     */
    dataset: Dataset;

    /**
     * Taarifa kuhusu mahali hapo.
     */
    place: DatasetPlace;

    /**
     * Kiungo cha API cha mahali hapa.
     */
    thisPlaceApiLink: string;
}

interface DatasetPlace {
    /**
     * Kitambulisho cha mahali hapo.
     */
    id: string;

    /**
     * Jina la mahali hapo.
     */
    name: string;

    /**
     * Jina la mahali hapo kama linavyoonekana katika Toleo la King James na Toleo la Kiingereza la Standard.
     */
    kjvName?: string;
    esvName?: string;

    /**
     * Majina mengine ambayo mahali hapo panaitwa.
     */
    aliases?: string[];

    /**
     * Aina ya sifa ya kijiografia ambayo mahali hapo ni.
     */
    featureType?: string;
    featureSubType?: string;

    /**
     * Latitudo na longitudo za mahali hapo, na jinsi zilivyo sahihi.
     */
    latitude?: number;
    longitude?: number;
    precision?: string;

    /**
     * Maelezo ya mahali. Kila mfuatano ni aya.
     */
    description?: string[];

    /**
     * Maoni kuhusu eneo hilo kutoka kwa waandishi wa seti ya data.
     */
    comment?: string;

    /**
     * Mahali pa msingi pa mahali hapa.
     * Majina tofauti ya eneo moja la kijiografia yana sehemu moja ya mzizi.
     */
    rootPlace?: DatasetEntityRef;

    /**
     * Mahali ambapo mahali hapa ni nakala yake.
     */
    duplicateOf?: DatasetEntityRef;

    /**
     * Watu waliokuwepo, waliozaliwa, au waliokufa mahali hapo.
     */
    people?: DatasetEntityRef[];
    peopleBorn?: DatasetEntityRef[];
    peopleDied?: DatasetEntityRef[];

    /**
     * Matukio yaliyotokea mahali hapo.
     */
    events?: DatasetEntityRef[];

    /**
     * Orodha ya marejeleo ya Biblia yanayotaja mahali hapo.
     * Imepangwa kwa mpangilio wa kitabu, sura, na mstari.
     */
    references: VerseRef[];
}
```

### Mfano

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

## Orodhesha Matukio katika Seti ya Data

`GET https://bible.helloao.org/api/d/{dataset}/events.json`

Hupata orodha ya matukio yanayopatikana kwa seti ya data iliyotolewa.

-   `dataset` kitambulisho cha seti ya data (km `theographic` ).

### Muundo

```typescript:no-line-numbers title="dataset-events.ts"
export interface DatasetEvents {
    /**
     * Taarifa za seti ya data kwa ajili ya matukio.
     */
    dataset: Dataset;

    /**
     * Orodha ya matukio yanayopatikana kwa ajili ya seti ya data.
     */
    events: DatasetEventSummary[];
}

interface DatasetEventSummary {
    /**
     * Kitambulisho cha tukio hilo.
     */
    id: string;

    /**
     * Jina la tukio.
     */
    name: string;

    /**
     * Tarehe ambayo tukio lilianza.
     * Nambari hasi ni miaka BC. Nambari chanya ni miaka AD.
     * Tarehe maalum zaidi hutumia umbizo `YYYY-MM-DD` .
     */
    startDate?: string;

    /**
     * Idadi ya marejeleo ya Biblia yanayoelezea tukio hilo.
     */
    numberOfReferences: number;

    /**
     * Kiungo cha API cha tukio hilo.
     */
    thisEventApiLink: string;
}
```

## Pata Tukio kutoka kwa Seti ya Data

`GET https://bible.helloao.org/api/d/{dataset}/events/{event}.json`

Hupata taarifa kuhusu tukio moja, ikiwa ni pamoja na marejeleo ya Biblia yanayoelezea tukio hilo na watu, maeneo, na makundi yanayohusiana nalo.

-   `dataset` kitambulisho cha seti ya data (km `theographic` ).
-   `event` kitambulisho cha tukio (km `saul-is-converted_326` ).

### Muundo

```typescript:no-line-numbers title="dataset-event.ts"
export interface DatasetEventResponse {
    /**
     * Taarifa za seti ya data kwa ajili ya tukio hilo.
     */
    dataset: Dataset;

    /**
     * Taarifa kuhusu tukio hilo.
     */
    event: DatasetEvent;

    /**
     * Kiungo cha API cha tukio hili.
     */
    thisEventApiLink: string;
}

interface DatasetEvent {
    /**
     * Kitambulisho cha tukio hilo.
     */
    id: string;

    /**
     * Jina la tukio.
     */
    name: string;

    /**
     * Tarehe ambayo tukio lilianza.
     */
    startDate?: string;

    /**
     * Muda wa tukio.
     * Kwa mfano, "1D" ni siku moja na "40Y" ni miaka arobaini.
     */
    duration?: string;

    /**
     * Watu walioshiriki katika tukio hilo.
     */
    participants?: DatasetEntityRef[];

    /**
     * Maeneo ambayo tukio hilo lilitokea.
     */
    locations?: DatasetEntityRef[];

    /**
     * Makundi ya watu walioshiriki katika tukio hilo.
     */
    groups?: DatasetEntityRef[];

    /**
     * Tukio ambalo tukio hili ni sehemu yake.
     */
    partOf?: DatasetEntityRef;

    /**
     * Tukio lililotokea kabla ya tukio hili.
     */
    predecessor?: DatasetEntityRef;

    /**
     * Orodha ya marejeleo ya Biblia yanayoelezea tukio hilo.
     * Imepangwa kwa mpangilio wa kitabu, sura, na mstari.
     */
    references: VerseRef[];
}
```

### Mfano

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

## Orodhesha Vikundi vya Watu katika Seti ya Data

`GET https://bible.helloao.org/api/d/{dataset}/groups.json`

Hupata orodha ya makundi ya watu yanayopatikana kwa seti ya data iliyotolewa.

-   `dataset` kitambulisho cha seti ya data (km `theographic` ).

### Muundo

```typescript:no-line-numbers title="dataset-people-groups.ts"
export interface DatasetPeopleGroups {
    /**
     * Taarifa za seti ya data kwa makundi ya watu.
     */
    dataset: Dataset;

    /**
     * Orodha ya makundi ya watu yanayopatikana kwa ajili ya seti ya data.
     */
    groups: DatasetPeopleGroupSummary[];
}

interface DatasetPeopleGroupSummary {
    /**
     * Kitambulisho cha kundi la watu.
     */
    id: string;

    /**
     * Jina la kundi la watu.
     */
    name: string;

    /**
     * Idadi ya watu ambao ni wanachama wa kundi la watu.
     */
    numberOfMembers: number;

    /**
     * Kiungo cha API cha kundi la watu.
     */
    thisPeopleGroupApiLink: string;
}
```

## Pata Kikundi cha Watu kutoka kwa Seti ya Data

`GET https://bible.helloao.org/api/d/{dataset}/groups/{group}.json`

Hupata taarifa kuhusu kundi la watu mmoja, ikiwa ni pamoja na wanachama wake na matukio ambayo kundi hilo lilishiriki.

-   `dataset` kitambulisho cha seti ya data (km `theographic` ).
-   `group` kitambulisho cha kundi la watu (km `tribe-of-benjamin` ).

### Muundo

```typescript:no-line-numbers title="dataset-people-group.ts"
export interface DatasetPeopleGroupResponse {
    /**
     * Taarifa ya seti ya data kwa ajili ya kundi la watu.
     */
    dataset: Dataset;

    /**
     * Taarifa kuhusu kundi la watu.
     */
    group: DatasetPeopleGroup;

    /**
     * Kiungo cha API cha kundi hili la watu.
     */
    thisPeopleGroupApiLink: string;
}

interface DatasetPeopleGroup {
    /**
     * Kitambulisho cha kundi la watu.
     */
    id: string;

    /**
     * Jina la kundi la watu.
     */
    name: string;

    /**
     * Watu ambao ni wanachama wa kundi la watu.
     */
    members?: DatasetEntityRef[];

    /**
     * Matukio ambayo kundi la watu lilishiriki.
     */
    events?: DatasetEntityRef[];

    /**
     * Orodha ya marejeleo ya Biblia yanayotaja kundi la watu.
     * Imepangwa kwa mpangilio wa kitabu, sura, na mstari.
     */
    references: VerseRef[];
}
```

### Mfano

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
