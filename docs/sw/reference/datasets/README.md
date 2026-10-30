# Seti za data

Sehemu za mwisho za kuvinjari seti za ziada za data za Biblia - kama vile marejeleo mtambuka, viumbe vya kibiblia (watu, mahali, matukio, na vikundi vya watu), maneno ya lugha ya asili kati ya mistari, kamusi, na mistari ya wagombea wa siku - na kuchukua vitabu vyao, maudhui ya sura, viumbe, maingizo ya kamusi, na kategoria za mistari.

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
     * Maelezo yaliyoongezwa na API kwa ajili ya leseni.
     * Haijabainishwa au haijabainishwa ikiwa hakuna maelezo.
     */
    licenseNotes?: string | null;

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
     * 0 kwa seti za data ambazo hazina marejeleo mtambuka.
     */
    totalNumberOfReferences: number;

    /**
     * Jumla ya idadi ya maneno ya mstari kati ya mistari yaliyo kwenye seti hii ya data.
     * Imeachwa ikiwa seti ya data haina maneno ya mstari kati ya mistari.
     */
    totalNumberOfWords?: number;

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

    /**
     * Kiungo cha API cha orodha ya maingizo ya msamiati katika seti ya data.
     * Imeachwa ikiwa seti ya data haina maingizo ya msamiati.
     */
    listOfLexiconApiLink?: string;

    /**
     * Jumla ya idadi ya maingizo ya msamiati yaliyo kwenye seti ya data.
     * Imeachwa ikiwa seti ya data haina maingizo ya msamiati.
     */
    totalNumberOfLexicon?: number;

    /**
     * Kiungo cha API cha orodha ya kila mstari kwenye seti ya data, pamoja na kategoria zake.
     * Imeachwa ikiwa mistari ya seti ya data haina kategoria.
     */
    listOfVersesApiLink?: string;

    /**
     * Kiungo cha API cha orodha ya kategoria za mistari katika seti ya data.
     * Imeachwa ikiwa seti ya data haina kategoria za mistari.
     */
    listOfCategoriesApiLink?: string;

    /**
     * Jumla ya idadi ya kategoria za mistari zilizomo kwenye seti ya data.
     * Imeachwa ikiwa seti ya data haina kategoria za mistari.
     */
    totalNumberOfCategories?: number;
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

Kwa seti za data za marejeleo mtambuka (kama vile `open-cross-ref` ), sura ina orodha ya marejeleo mtambuka kwa kila mstari. Kwa seti za data za kati ya mstari (kama vile `bsb-interlinear` ), sura ina maneno ya lugha asilia ya kila mstari - tazama [Seti za Data za Kati ya](#interlinear-datasets) mstari. Kwa seti za data za huluki (kama vile `theographic` ), sura ina watu, mahali, na matukio yanayoonekana katika sura - tazama [Pata Vitu katika Sura](#get-the-entities-in-a-chapter) . Kwa seti ya data `verse-of-the-day` , sura ina mstari wa wagombea wa siku katika sura na kategoria zao - tazama [Mstari wa Siku](#verse-of-the-day) .

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

/**
 * Mstari una `references` (seti za data za marejeleo mtambuka), `words` (seti za data za kati ya mstari), au `categories` (seti ya data ya mstari wa siku).
 * Angalia ni ipi iliyopo na `'words' in verse` au `'categories' in verse` .
 */
type DatasetVerse =
    | DatasetReferencesVerse
    | DatasetWordsVerse
    | DatasetCategoriesVerse;

interface DatasetReferencesVerse {
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

interface DatasetWordsVerse {
    /**
     * Nambari ya mstari.
     */
    verse: number;

    /**
     * Maneno ya lugha ya asili ya mstari huo, kwa mpangilio wa maandishi ya asili.
     * Tazama "Seti za Data za Interlinear" hapa chini.
     */
    words: InterlinearWord[];
}

interface DatasetCategoriesVerse {
    /**
     * Nambari ya mstari.
     * Ikiwa `endVerse` ipo, basi huu ndio mstari ambao kifungu kinaanzia.
     */
    verse: number;

    /**
     * Mstari ambao kifungu hicho kinaishia.
     * Imeachwa ikiwa ingizo ni mstari mmoja.
     */
    endVerse?: number;

    /**
     * Vitambulisho vya kategoria ambazo mstari huo unahusika, muhimu zaidi kwanza.
     * Tazama "Mstari wa Siku" hapa chini.
     */
    categories: string[];

    /**
     * Mwaka wa kwanza ambao mstari unaweza kuwa mstari wa siku.
     * Imeachwa ikiwa mstari huo umekuwa kwenye orodha kila wakati.
     */
    addedIn?: number;

    /**
     * Mwaka wa kwanza ambapo mstari hauwezi tena kuwa mstari wa siku.
     * Mistari iliyoondolewa hubaki kwenye seti ya data ili mistari ya miaka ya awali iweze kuchaguliwa.
     * Imeachwa ikiwa mstari haujaondolewa kwenye orodha.
     */
    removedIn?: number;
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

// Tazama "Seti za Data za Interlinear" hapa chini kwa muundo wa InterlinearWord.
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

Seti ya data [ya Historia Globe](https://historyglobe.app) ( `history-globe` ) ina maeneo pekee: maeneo yaliyotajwa katika Biblia, pamoja na viwianishi vyake na mistari inayoyataja. Vitambulisho vyake vya mahali (km `a15257a` kwa Yerusalemu) ni vitambulisho vya mahali vilivyo imara vya Historia Globe, vile vile ambavyo [API yake ya data huria](https://historyglobe.app/docs/api.html) hutumia, kwa hivyo havibadiliki jina linaporekebishwa. Thamani zake `featureType` zinafuata zile ambazo seti ya data ya Theographic hutumia ( `City` , `Region` , `Water` , na kadhalika), na `featureSubType` ina aina maalum zaidi ambapo kuna moja (km `River` , `Gate` , `Spring` ).

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

### Sifa ya Ulimwengu wa Historia

Data ya History Globe ina leseni chini ya [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) . Ukiitumia, toa sifa kwa History Globe ( https://historyglobe.app ) na OpenBible.info Bible Geocoding Data ambayo inajenga juu yake, na uangalie mabadiliko yoyote. Sifa `licenseNotes` ya seti ya data ina sifa hiyo.

## Pata Vyombo Katika Sura

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

Kwa seti za data za huluki, hupata watu, mahali, na matukio yanayoonekana katika sura moja, pamoja na nambari za mistari katika sura ambapo kila moja imetajwa.

-   `dataset` kitambulisho cha seti ya data (km `theographic` ).
-   `book` ni kitambulisho cha kitabu (km `GEN` kwa Mwanzo).
-   `chapter` ni nambari ya sura ya nambari (km `1` kwa sura ya kwanza).

Orodha ya vitabu na sura zenye data ya huluki inapatikana kutoka `GET https://bible.helloao.org/api/d/{dataset}/books.json` , ambayo inafuata muundo sawa na [mwisho wa seti ya data ya vitabu](#list-books-in-a-dataset) . Kwa seti za data za huluki, `totalNumberOfVerses` ni idadi ya mistari iliyotajwa na angalau huluki moja na `totalNumberOfReferences` ni jumla ya idadi ya kutajwa kwa huluki-aya.

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

## Seti za Data za Interlinear

Seti ya data ya Beroya kati ya mistari ( `bsb-interlinear` ) inaorodhesha maneno ya lugha ya asili (Kiebrania, Kiaramu, na Kigiriki) ya kila mstari wa Biblia, kwa mpangilio unaoonekana katika maandishi ya asili. Kila neno lina unukuzi wake, uchanganuzi wa kisarufi, [nambari ya Strong](https://en.wikipedia.org/wiki/Strong%27s_Concordance) , na kifungu cha maneno cha Kiingereza ambacho [Biblia ya Beroya Standard](https://berean.bible) inatumia kwa ajili yake.

Seti ya data hutumia sehemu za mwisho sawa na seti zingine za data:

-   `GET https://bible.helloao.org/api/d/bsb-interlinear/books.json` inaorodhesha vitabu 66.
-   `GET https://bible.helloao.org/api/d/bsb-interlinear/{book}/{chapter}.json` (km `/api/d/bsb-interlinear/GEN/1.json` ) hurejesha sura, ikiwa na `{ verse, words }` kwa kila mstari. Jibu ni [sura ya seti ya data](#get-a-chapter-from-a-dataset) .

Data ya maneno inatoka kwenye [jedwali la kati la Biblia ya Berean Standard Bible](https://bereanbible.com/) , ambalo liko hadharani. Nambari za Strong za maneno hayo zinatafutwa katika [msamiati](#lexicon) ( `stepbible-lexicon` ).

### Muundo

```typescript:no-line-numbers title="interlinear-word.ts"
interface InterlinearWord {
    /**
     * Cheo cha neno kulingana na 1 katika mpangilio wa maandishi asilia.
     * Maneno yameorodheshwa kwa mpangilio huu.
     */
    pos: number;

    /**
     * Cheo cha neno hilo katika mpangilio wa Kiingereza wa Biblia ya Berean Standard.
     */
    bsbPos: number;

    /**
     * Lugha ya neno.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * Neno katika hati asili. NFC imerekebishwa.
     */
    text: string;

    /**
     * Tafsiri ya neno.
     */
    transliteration: string | null;

    /**
     * Msimbo mfupi wa uchanganuzi wa kisarufi wa neno. k.m. "N-mp" au "V-Qal-Perf-3ms".
     */
    parsing: string | null;

    /**
     * Uchanganuzi wa kisarufi wa neno ulioandikwa.
     */
    parsingFull: string | null;

    /**
     * Nambari ya neno la Strong lenye pedi sifuri. km "H0430" au "G3056".
     * Zero-paded, ambayo inalingana na thamani za `.words.json` za KJV.
     * Thamani za tafsiri zingine zinaweza kuhitaji kuwekewa viambatisho na kukatwa kwa viambishi tamati kabla ya kujiunga.
     * Hufanya kazi bila maana wakati chanzo kinatoa neno nambari ya no Strong (hii ndiyo hali kwa baadhi ya maneno ambayo ni viambishi tamati, kama vile viambishi tamati vya kiwakilishi).
     */
    strongs: string | null;

    /**
     * Kifungu cha Kiingereza cha Biblia ya Berean Standard kwa neno hilo.
     * Hufanya kazi bila maana wakati BSB inaacha neno lisilotafsiriwa (kama vile alama ya kitu cha moja kwa moja cha Kiebrania).
     */
    gloss: string | null;
}
```

### Mfano

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

### Kuunganisha Maneno na Tafsiri

Thamani za `strongs` kati ya mstari zimeunganishwa kwa sifuri (km `H0430` ). Hii inalingana na thamani `strongs` katika maelezo ya maneno ya KJV ( `/api/eng_kjv/{book}/{chapter}.words.json` ). Thamani za tafsiri zingine zinaweza kuhitaji kuunganishwa kwa sifuri na kukatwa kwa viambishi tamati (km `H430` au `H1961a` hadi `H0430` na `H1961` ) kabla hazijaunganishwa.

-   **KJV.** Kwa Toleo la King James ( `eng_kjv` na `eng_kja` ), unganisha nambari za Strong katika faili la sura ya `.words.json` na maneno `strongs` kati ya mstari wa mstari wa mstari huo huo. Kwa mfano, kila nambari ya Strong iliyoorodheshwa katika `/api/eng_kjv/GEN/1.words.json` kwa mstari wa 1 ( `H7225` , `H1254` , `H0430` , `H0853` , `H8064` , `H0776` ) inaonekana kama thamani ya `strongs` miongoni mwa maneno ya mstari wa 1 katika `/api/d/bsb-interlinear/GEN/1.json` .
-   **Biblia ya Kiberoya.** Kila neno `gloss` ni kifungu cha BSB cha neno hilo. Tembea maneno ya mstari kwa mpangilio `bsbPos` na ulinganishe kila `gloss` na maandishi ya mstari wa tafsiri ya BSB ili kupata mahali ambapo tafsiri ya neno hilo iko.

Uhesabuji wa nambari za vyanzo hivyo viwili haukubaliani kila wakati. Kwa mfano, KJV inatambulisha "ilikuwa" kama `G2258` ambapo jedwali la Beroya lina `G1510` Viungo vichache hukosa kwa sababu ya tofauti kama hii.

### Sifa

Majedwali ya katikati ya mstari ya Bereya yako katika uwanja wa umma. [Kamusi](#lexicon) hii ina leseni chini ya CC BY 4.0 na inahitaji uwakilishi.

## Kamusi

Seti ya data ya msamiati wa STEPBible ( `stepbible-lexicon` ) ina msamiati mfupi wa Kiebrania, Kiaramu, na Kigiriki (TBESH na TBESG) kutoka [STEPBible.org](https://www.stepbible.org/) katika Tyndale House, Cambridge. Ina ingizo moja kwa kila nambari ya msingi ya Strong, na kila ingizo lina hisia moja au zaidi zenye lemma, unukuzi, sehemu ya usemi, msamiati wa Kiingereza, na ufafanuzi.

Thamani yoyote ya `strongs` yenye pedi sifuri kutoka kwa [neno kati ya mstari](#interlinear-datasets) ambalo lina ingizo la msamiati inaweza kutazamwa hadi `/api/d/stepbible-lexicon/lexicon/{strongs}.json` bila kubadilishwa. Vivyo hivyo kwa thamani `.words.json` za KJV; thamani za tafsiri zingine zinaweza kuhitaji pedi sifuri na kuondolewa kwa kiambishi tamati kwanza. Ingizo za Kigiriki ambazo msamiati huongeza bila nambari ya Strong hazijachapishwa.

Seti za data zilizo na maingizo ya msamiati zinajumuisha `listOfLexiconApiLink` na `totalNumberOfLexicon` katika maingizo yao katika `/api/available_datasets.json` .

### Sifa

Data ya msamiati ina leseni chini ya [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) . Ukiitumia, andika STEPBible.org / Tyndale House, Cambridge, na uandike mabadiliko yoyote. Sifa `licenseNotes` ya seti ya data ina sifa hiyo.

## Orodhesha Maingizo ya Leksikoni katika Seti ya Data

`GET https://bible.helloao.org/api/d/{dataset}/lexicon.json`

Hupata orodha ya maingizo ya msamiati yanayopatikana kwa seti ya data.

-   `dataset` kitambulisho cha seti ya data (km `stepbible-lexicon` ).

### Mfano wa Msimbo

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

### Muundo

```typescript:no-line-numbers title="dataset-lexicon.ts"
export interface DatasetLexicon {
    /**
     * Taarifa ya seti ya data kwa ajili ya msamiati.
     */
    dataset: Dataset;

    /**
     * Orodha ya maingizo ya msamiati yanayopatikana kwa seti ya data.
     */
    lexicon: DatasetLexiconEntrySummary[];
}

export interface DatasetLexiconEntrySummary {
    /**
     * Nambari ya Strong yenye pedi sifuri ya ingizo la msamiati. k.m. "H0430".
     */
    id: string;

    /**
     * Lugha ya ingizo la msamiati.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * Jina la ingizo la msamiati.
     * Hii ndiyo maana ya kwanza ya ingizo.
     */
    name: string;

    /**
     * Kiungo cha API cha ingizo la msamiati.
     */
    apiLink: string;
}
```

### Mfano

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

## Pata Kiingilio cha Leksikoni kutoka kwa Seti ya Data

`GET https://bible.helloao.org/api/d/{dataset}/lexicon/{strongs}.json`

Hupata ingizo la msamiati kwa nambari moja ya msingi ya Strong, pamoja na hisia zake zote.

-   `dataset` kitambulisho cha seti ya data (km `stepbible-lexicon` ).
-   `strongs` ni nambari ya Strong yenye pedi sifuri (km `H0430` kwa neno la Kiebrania _elohim_, au `G3056` kwa neno la Kigiriki _logos_).

### Mfano wa Msimbo

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

### Muundo

```typescript:no-line-numbers title="dataset-lexicon-entry.ts"
export interface DatasetLexiconEntry {
    /**
     * Taarifa ya seti ya data kwa ajili ya ingizo la msamiati.
     */
    dataset: Dataset;

    /**
     * Ingizo la kamusi.
     */
    entry: DatasetLexiconEntryContent;

    /**
     * Kiungo cha API cha ingizo hili la msamiati.
     */
    thisLexiconEntryApiLink: string;
}

export interface DatasetLexiconEntryContent {
    /**
     * Nambari ya Strong yenye pedi sifuri ya ingizo. k.m. "H0430".
     */
    id: string;

    /**
     * Lugha ya ingizo.
     * Hii ndiyo lugha ya maana ya kwanza ya ingizo.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * Hisia za kuingia, kwa mpangilio wa kitambulisho.
     */
    senses: DatasetLexiconSense[];
}

export interface DatasetLexiconSense {
    /**
     * Kitambulisho kilichopanuliwa cha hisia. k.m. "H0001G".
     * Sawa na nambari ya msingi ya Strong wakati nambari ina maana moja.
     */
    id: string;

    /**
     * Lugha ya maana.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * Lemma ya maana katika hati asilia.
     */
    lemma: string;

    /**
     * Unukuzi wa lemma.
     */
    transliteration: string | null;

    /**
     * Msimbo wa maana wa sehemu ya usemi (mofolojia).
     */
    partOfSpeech: string | null;

    /**
     * Mng'ao mfupi wa Kiingereza wa maana.
     */
    gloss: string | null;

    /**
     * Ufafanuzi wa maana kama maandishi wazi.
     * Aya zimetenganishwa na mistari tupu. Alama katika chanzo huondolewa.
     */
    definition: string;
}
```

### Mfano

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

## Mstari wa Siku

Seti ya data ya mstari wa siku ( `verse-of-the-day` ) ni orodha iliyopangwa ya mistari inayojulikana na vifungu vifupi (bila kuzidi mistari mitatu) ambavyo hufanya wagombea wazuri wa "mstari wa siku": zaidi ya 640 kwa kila siku ya mwaka, na zaidi ya 100 kwa sikukuu za Kikristo. Kila moja inaeleweka yenyewe.

Kila mstari kwa kila siku una kategoria moja hadi tatu, muhimu zaidi kwanza, kutoka kwa seti hii isiyobadilika:

| Kitambulisho  | Maelezo                                                       |
| ------------- | ------------------------------------------------------------- |
| `comfort`     | Ukaribu na utunzaji wa Mungu katika huzuni, shida, na upweke. |
| `courage`     | Kusimama imara na bila hofu.                                  |
| `faith`       | Kumwamini Mungu na ahadi zake.                                |
| `forgiveness` | Msamaha wa Mungu wa dhambi na kuwasamehe wengine.             |
| `gratitude`   | Kumshukuru Mungu.                                             |
| `guidance`    | Mungu anaongoza hatua zetu, mipango, na maamuzi yetu.         |
| `hope`        | Kujiamini katika wakati ujao ambao Mungu ameahidi.            |
| `inspiration` | Kutiwa moyo kuishi kwa imani na kutenda mema.                 |
| `joy`         | Kufurahi na kushangilia katika Mungu.                         |
| `love`        | Upendo wa Mungu kwetu na upendo wetu kwa Mungu na wengine.    |
| `peace`       | Pumziko, utulivu, na uhuru kutokana na wasiwasi.              |
| `praise`      | Ibada na matamko ya ukuu wa Mungu.                            |
| `prayer`      | Kumwita Mungu na ahadi yake ya kusikia.                       |
| `provision`   | Mungu anatupa kile tunachohitaji.                             |
| `salvation`   | Ukombozi, neema, na maisha mapya katika Kristo.               |
| `strength`    | Mungu awape nguvu na uvumilivu.                               |
| `wisdom`      | Hekima ya Mungu na mafundisho ya vitendo kwa ajili ya maisha. |

Sikukuu zina kategoria zake. Katika sikukuu, mstari wa siku ni mojawapo ya mistari ya sikukuu, na mistari hiyo haitumiki katika siku zingine. Sikukuu kwa kawaida hudumu siku moja; Baada ya Ufufuo Jumapili hudumu siku tatu baada ya Ufufuo Jumapili, kwa hivyo inaorodhesha tarehe zote tatu. Kila kategoria ya sikukuu ina `holiday` na tarehe zake: sikukuu katika tarehe hiyo hiyo kila mwaka zina `month` na `day` , na sikukuu ambazo tarehe yake hubadilika kila mwaka (kwa sababu hutegemea Jumapili ya Ufufuo au Majilio) huorodhesha `dates` zao katika kalenda ya Gregory, iliyohesabiwa mapema kwa 2026 hadi 2125.

| Kitambulisho               | Likizo                        | Tarehe                                |
| -------------------------- | ----------------------------- | ------------------------------------- |
| `epiphany`                 | Epifania                      | Januari 6                             |
| `ash-wednesday`            | Jumatano ya Majivu            | Siku 46 kabla ya Jumapili ya Ufufuo   |
| `palm-sunday`              | Jumapili ya Matawi            | Jumapili kabla ya Jumapili ya Ufufuo  |
| `maundy-thursday`          | Alhamisi Kuu                  | Alhamisi kabla ya Jumapili ya Ufufuo  |
| `good-friday`              | Ijumaa Kuu                    | Ijumaa kabla ya Jumapili ya Ufufuo    |
| `resurrection-sunday`      | Jumapili ya Ufufuo            | Jumapili ya Pasaka                    |
| `post-resurrection-sunday` | Baada ya Ufufuo Jumapili      | Siku tatu baada ya Jumapili ya Ufufuo |
| `ascension-day`            | Siku ya Kupaa                 | Siku 39 baada ya Jumapili ya Ufufuo   |
| `pentecost`                | Pentekoste                    | Siku 49 baada ya Jumapili ya Ufufuo   |
| `all-hallows-eve`          | Hawa ya Watakatifu Wote       | Oktoba 31                             |
| `all-saints-day`           | Siku ya Watakatifu Wote       | Novemba 1                             |
| `advent-sunday`            | Jumapili ya Kwanza ya Majilio | Jumapili ya nne kabla ya Krismasi     |
| `christmas-eve`            | Mkesha wa Krismasi            | Desemba 24                            |
| `christmas`                | Krismasi                      | Desemba 25                            |

Seti ya data ina marejeleo tu, si maandishi ya mistari, kwa hivyo inafanya kazi na kila tafsiri. Nambari za mistari hutumia nambari za kawaida za Kiingereza (sawa na BSB). Data inaweza kusomwa kwa njia tatu:

-   [`/api/d/verse-of-the-day/verses.json`](#list-verses-in-a-dataset) inaorodhesha kila mstari katika seti ya data pamoja na kategoria zake, na sikukuu pamoja na tarehe zake, katika faili moja.
-   [`/api/d/verse-of-the-day/categories/{category}.json`](#get-a-category-from-a-dataset) inaorodhesha kila mstari katika kategoria. Hii ndiyo njia rahisi zaidi ya kuchagua mstari wa siku kutoka kategoria moja.
-   [`/api/d/verse-of-the-day/{book}/{chapter}.json`](#get-a-chapter-from-a-dataset) inaorodhesha wagombea katika sura, pamoja na kategoria zao. Sura zenye wagombea pekee ndizo zinazopatikana; tumia viungo vya sura vya kitabu au `/api/d/verse-of-the-day/books.json` ili kuwapata.

Seti za data zenye kategoria za mistari ni pamoja na `listOfVersesApiLink` , `listOfCategoriesApiLink` , na `totalNumberOfCategories` katika ingizo lao katika `/api/available_datasets.json` .

### Kuchagua Mstari wa Siku

API imetengenezwa kwa faili tuli, kwa hivyo haikuchagulii mstari. Badala yake, kuna utaratibu wa kuchagua mstari mmoja, ili kila programu inayoifuata ionyeshe mstari huo huo siku hiyo hiyo. Programu ni huru kuchagua tofauti; utaratibu huo unazipa tu chaguo-msingi lililoshirikiwa.

Kongamano huchagua kutoka kwa mistari na sikukuu katika `/api/d/verse-of-the-day/verses.json` Katika likizo, huchagua moja ya mistari ya likizo, ikipitia mwaka mmoja baada ya mwingine, kwa hivyo likizo huwa na mstari tofauti kila mwaka hadi mistari yake yote itumike. Katika siku zingine, kila mwaka hupata mchanganyiko wake wa mistari inayotumika mwaka huo (iliyopangwa kwa mpangilio wa marejeleo ya kila mstari, mwaka, na mbegu ya hiari), na mstari wa siku ni ule ulio kwenye siku ya tarehe ya mwaka katika mchanganyiko huo. Seti ya data ina zaidi ya mistari 366 kwa kila siku inayotumika kila mwaka, kwa hivyo mstari haurudii ndani ya mwaka wa kalenda, mpangilio hubadilika kila mwaka, na tarehe hiyo hiyo hutoa mstari ule ule kila wakati. Mistari mipya huongezwa (na `addedIn` ) na ya zamani huondolewa (na `removedIn` ) tu kutoka mwaka ambao haujaanza bado, kwa hivyo mstari wa siku wa tarehe iliyopita haubadiliki kamwe.

Ukurasa [wa Mkataba wa Mstari wa Siku](./verse-of-the-day-convention.md) unabainisha algoriti hatua kwa hatua, pamoja na msimbo bandia na thamani za majaribio, ili uweze kuitekeleza katika lugha yoyote.

Ili kutumia agizo lako mwenyewe, chagua mbegu yako mwenyewe (kwa mfano, jina la programu yako): inatoa mchanganyiko tofauti wenye dhamana sawa. Unaweza pia kuchagua kutoka kwa mistari ya kategoria moja, lakini kila kategoria ina mistari michache kuliko siku zilizopo katika mwaka, kwa hivyo mistari yake hurudiwa mapema zaidi.

SDK hufuata utaratibu:

```ts:no-line-numbers title="verse-of-the-day.js"
import { FreeUseBibleApi } from 'free-use-bible-api';

const api = new FreeUseBibleApi();

// Tarehe kama YYYY-MM-DD, au Tarehe (tarehe yake ya kalenda ya ndani inatumika). Chaguo-msingi ni leo.
const ref = await api.getVerseOfTheDay('2026-01-01');

// Pata maandishi ya mstari kutoka kwa tafsiri.
const chapter = await api.getTranslationBookChapter('BSB', ref.book, ref.chapter);
const verses = chapter.chapter.content.filter(
    (c) =>
        c.type === 'verse' &&
        c.number >= ref.verse &&
        c.number <= (ref.endVerse ?? ref.verse)
);
console.log(ref, verses);
```

-   `getVerseOfTheDay(date?, { seed?, category?, dataset? }?)` hupakua orodha ya mistari na kuchagua kutoka kwayo. Chaguo `pickVerseOfTheDay(verses, date?, { seed?, category? }?)` kutoka kwenye orodha ambayo tayari unayo.
-   SDK ya Kotlin ina `getVerseOfTheDay(date?, seed?, category?)` na `pickVerseOfTheDay(verses, date?, seed?, category?)` , ambazo huchukua tarehe kama kamba `YYYY-MM-DD` .
-   Swift SDK ina `getVerseOfTheDay(date:seed:category:)` na `pickVerseOfTheDay(_:date:seed:category:holidays:)` , ambazo huchukua tarehe kama kamba `YYYY-MM-DD` au `Date` (tarehe yake ya kalenda katika eneo la sasa la saa inatumika).
-   [Seva ya MCP](https://github.com/HelloAOLab/bible-api/tree/main/packages/seed-bible-mcp) ina kifaa `getVerseOfTheDay` kinachorudisha mstari wa siku pamoja na maandishi yake.
-   Kifurushi cha `@helloao/tools` kina orodha sawa na kitendakazi `getVerseOfTheDay(date?, { seed?, category? }?)` katika `@helloao/tools/generation/verse-of-the-day.js` .

### Leseni

Orodha hiyo iliandaliwa na AO Lab na imetolewa chini ya [Leseni ya MIT](https://github.com/HelloAOLab/bible-api/blob/main/LICENSE) . Maandishi ya mstari yanatokana na tafsiri yoyote unayoipata.

## Orodhesha Mistari katika Seti ya Data

`GET https://bible.helloao.org/api/d/{dataset}/verses.json`

Hupata kila mstari (au kifungu kifupi) katika seti ya data, pamoja na kategoria ambazo kila moja ni yake, kwa mpangilio wa kisheria. Inapatikana tu kwa seti za data ambazo mistari yake ina kategoria, kama vile `verse-of-the-day` .

-   `dataset` kitambulisho cha seti ya data (km `verse-of-the-day` ).

### Mfano wa Msimbo

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

### Muundo

```typescript:no-line-numbers title="dataset-verses.ts"
export interface DatasetVerses {
    /**
     * Taarifa za seti ya data kwa ajili ya mistari.
     */
    dataset: Dataset;

    /**
     * Kila mstari (au kifungu kifupi) katika seti ya data, pamoja na kategoria zake, kwa mpangilio wa kisheria.
     */
    verses: DatasetCategorizedVerse[];

    /**
     * Sikukuu zenye mistari yao wenyewe, pamoja na tarehe zao.
     * Imeachwa ikiwa seti ya data haina sikukuu.
     */
    holidays?: DatasetVersesHoliday[];
}

export interface DatasetVersesHoliday extends DatasetCategoryHoliday {
    /**
     * Kitambulisho cha kategoria ya likizo. k.m. "Krismasi".
     */
    id: string;

    /**
     * Jina la likizo kwa Kiingereza. km "Krismasi".
     */
    name: string;
}

export interface DatasetCategoryHoliday {
    /**
     * Mwezi (1 kwa Januari) na siku ya likizo inayoangukia tarehe hiyo hiyo kila mwaka.
     * Imeachwa kwa likizo ambazo tarehe yake hubadilika kila mwaka.
     */
    month?: number;
    day?: number;

    /**
     * Tarehe (YYYY-MM-DD, kalenda ya Gregory) za likizo ambayo tarehe yake hubadilika kila mwaka, kwa mpangilio.
     * Zimehesabiwa mapema kwa miaka kadhaa (kwa sasa ni kuanzia 2026 hadi 2125), na sikukuu hiyo huadhimishwa tu kwenye tarehe zilizoorodheshwa.
     * Huachwa kwa likizo zinazoangukia tarehe hiyo hiyo kila mwaka.
     */
    dates?: string[];
}

export interface DatasetCategorizedVerse {
    /**
     * Kitambulisho cha kitabu. k.m. "PRO".
     */
    book: string;

    /**
     * Nambari ya sura.
     */
    chapter: number;

    /**
     * Nambari ya mstari.
     * Ikiwa `endVerse` ipo, basi huu ndio mstari ambao kifungu kinaanzia.
     */
    verse: number;

    /**
     * Mstari ambao kifungu hicho kinaishia.
     * Imeachwa ikiwa ingizo ni mstari mmoja.
     */
    endVerse?: number;

    /**
     * Vitambulisho vya kategoria ambazo mstari huo unahusika, muhimu zaidi kwanza.
     */
    categories: string[];

    /**
     * Mwaka wa kwanza ambao mstari unaweza kuwa mstari wa siku.
     * Imeachwa ikiwa mstari huo umekuwa kwenye orodha kila wakati.
     */
    addedIn?: number;

    /**
     * Mwaka wa kwanza ambapo mstari hauwezi tena kuwa mstari wa siku.
     * Mistari iliyoondolewa hubaki kwenye seti ya data ili mistari ya miaka ya awali iweze kuchaguliwa.
     * Imeachwa ikiwa mstari haujaondolewa kwenye orodha.
     */
    removedIn?: number;
}
```

### Mfano

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

## Orodhesha Kategoria katika Seti ya Data

`GET https://bible.helloao.org/api/d/{dataset}/categories.json`

Hupata orodha ya kategoria za mistari zinazopatikana kwa ajili ya seti ya data.

-   `dataset` kitambulisho cha seti ya data (km `verse-of-the-day` ).

### Mfano wa Msimbo

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

### Muundo

```typescript:no-line-numbers title="dataset-categories.ts"
export interface DatasetCategories {
    /**
     * Taarifa ya seti ya data kwa kategoria.
     */
    dataset: Dataset;

    /**
     * Orodha ya kategoria za mistari zinazopatikana kwa ajili ya seti ya data.
     */
    categories: DatasetCategorySummary[];
}

export interface DatasetCategorySummary {
    /**
     * Kitambulisho cha kategoria. k.m. "tumaini".
     */
    id: string;

    /**
     * Jina la Kiingereza la kategoria hiyo. k.m. "Tumaini".
     */
    name: string;

    /**
     * Maelezo ya mistari katika kategoria hiyo yanahusu nini.
     */
    description: string;

    /**
     * Idadi ya mistari (au vifungu vifupi) vinavyohusika na kategoria hiyo.
     */
    numberOfVerses: number;

    /**
     * Tarehe za likizo ambazo kategoria hii ni ya (tazama Seti ya DataCategoryLikizo hapo juu).
     * Imeachwa kwa kategoria ambazo si za likizo.
     */
    holiday?: DatasetCategoryHoliday;

    /**
     * Kiungo cha API cha kategoria.
     */
    apiLink: string;
}
```

### Mfano

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

## Pata Kategoria kutoka kwa Seti ya Data

`GET https://bible.helloao.org/api/d/{dataset}/categories/{category}.json`

Hupata kategoria moja ya mstari, pamoja na kila mstari unaohusika.

-   `dataset` kitambulisho cha seti ya data (km `verse-of-the-day` ).
-   `category` ni kitambulisho cha kategoria (km `hope` ).

### Mfano wa Msimbo

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

### Muundo

```typescript:no-line-numbers title="dataset-category.ts"
export interface DatasetCategoryResponse {
    /**
     * Taarifa ya seti ya data kwa kategoria.
     */
    dataset: Dataset;

    /**
     * Kategoria, pamoja na mistari inayohusika nayo.
     */
    category: DatasetCategory;

    /**
     * Kiungo cha API cha kategoria hii.
     */
    thisCategoryApiLink: string;
}

export interface DatasetCategory {
    /**
     * Kitambulisho cha kategoria. k.m. "tumaini".
     */
    id: string;

    /**
     * Jina la Kiingereza la kategoria hiyo. k.m. "Tumaini".
     */
    name: string;

    /**
     * Maelezo ya mistari katika kategoria hiyo yanahusu nini.
     */
    description: string;

    /**
     * Tarehe za likizo ambazo kategoria hii ni ya (tazama Seti ya DataJamiiLikizo katika "Orodhesha Mistari katika Seti ya Data").
     * Katika tarehe hizo, mstari wa siku ni mojawapo ya mistari ya kategoria hiyo, na haitumiki katika siku zingine.
     * Imeachwa kwa kategoria ambazo si za likizo.
     */
    holiday?: DatasetCategoryHoliday;

    /**
     * Mistari (au vifungu vifupi) vinavyohusika na kategoria hiyo, kwa mpangilio wa kisheria.
     * Inajumuisha mistari ambayo imeondolewa kwenye orodha (tazama `removedIn` ).
     */
    verses: DatasetCategoryVerse[];
}

export interface DatasetCategoryVerse {
    /**
     * Kitambulisho cha kitabu. km "JER".
     */
    book: string;

    /**
     * Nambari ya sura.
     */
    chapter: number;

    /**
     * Nambari ya mstari.
     * Ikiwa `endVerse` ipo, basi huu ndio mstari ambao kifungu kinaanzia.
     */
    verse: number;

    /**
     * Mstari ambao kifungu hicho kinaishia.
     * Imeachwa ikiwa marejeleo ni mstari mmoja.
     */
    endVerse?: number;

    /**
     * Mwaka wa kwanza ambao mstari unaweza kuwa mstari wa siku.
     * Imeachwa ikiwa mstari huo umekuwa kwenye orodha kila wakati.
     */
    addedIn?: number;

    /**
     * Mwaka wa kwanza ambapo mstari hauwezi tena kuwa mstari wa siku.
     * Mistari iliyoondolewa hubaki kwenye seti ya data ili mistari ya miaka ya awali iweze kuchaguliwa.
     * Imeachwa ikiwa mstari haujaondolewa kwenye orodha.
     */
    removedIn?: number;
}
```

### Mfano

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
