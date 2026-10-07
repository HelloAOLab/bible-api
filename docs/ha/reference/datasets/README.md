# Saitunan Bayanai

Maƙallan ƙarshe don bincika ƙarin bayanai na Littafi Mai Tsarki - kamar nassoshi tsakanin addinai da kuma nassoshi na Littafi Mai Tsarki (mutane, wurare, abubuwan da suka faru, da ƙungiyoyin mutane) - da kuma ɗaukar littattafansu, abubuwan da ke cikin babi, da kuma abubuwan da ke cikinsa.

## Saitunan Bayanan da ake da su

`GET https://bible.helloao.org/api/available_datasets.json`

Yana samun jerin bayanai na Littafi Mai Tsarki da ake da su a cikin API.

### Misalin Lambar

::: code-tabs#lang

@shafin JavaScript

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

### Tsarin gini

```typescript:no-line-numbers title="available-datasets.ts"
export interface AvailableDatasets {
    /**
     * Jerin bayanan bayanai.
     */
    datasets: Dataset[];
}

export interface Dataset {
    /**
     * ID na bayanan.
     */
    id: string;

    /**
     * Sunan bayanan.
     */
    name: string;

    /**
     * Shafin yanar gizo don adana bayanai.
     */
    website: string;

    /**
     * Ana iya samun URL ɗin da lasisin bayanan ke bayarwa.
     */
    licenseUrl: string;

    /**
     * Sunan Ingilishi don bayanan.
     */
    englishName: string;

    /**
     * Alamar harshen ISO 639 mai haruffa 3 da aka fi amfani da ita a cikin bayanan.
     */
    language: string;

    /**
     * Alkiblar da aka rubuta harshen a ciki.
     * "ltr" yana nuna cewa an rubuta rubutun daga gefen hagu na shafin zuwa dama.
     * "rtl" yana nuna cewa an rubuta rubutun daga gefen dama na shafin zuwa hagu.
     */
    textDirection: 'ltr' | 'rtl';

    /**
     * Hanyar API don jerin littattafan da ake da su don wannan tarin bayanai.
     */
    listOfBooksApiLink: string;

    /**
     * Jerin tsare-tsare da ake da su.
     */
    availableFormats: ('json' | 'usfm')[];

    /**
     * Adadin littattafan da ke cikin wannan tarin bayanai.
     */
    numberOfBooks: number;

    /**
     * Jimillar surori da ke cikin wannan bayanai.
     */
    totalNumberOfChapters: number;

    /**
     * Jimillar ayoyin da ke cikin wannan bayanai.
     */
    totalNumberOfVerses: number;

    /**
     * Jimillar adadin nassoshi da ke cikin wannan bayanan.
     */
    totalNumberOfReferences: number;

    /**
     * Yana samun sunan harshen da bayanan ke ciki.
     * Ba a san ko an bayyana sunan harshen ba.
     */
    languageName?: string;

    /**
     * Yana samun sunan harshen a cikin Turanci.
     * Ba a fayyace ko ba a fayyace ba idan harshen ba shi da sunan Turanci.
     */
    languageEnglishName?: string;

    /**
     * Haɗin API don jerin abubuwan da ke cikin bayanan.
     * An cire shi idan bayanan ba su ƙunshi abubuwan da suka dace ba.
     */
    listOfPeopleApiLink?: string;
    listOfPlacesApiLink?: string;
    listOfEventsApiLink?: string;
    listOfPeopleGroupsApiLink?: string;

    /**
     * Jimlar adadin abubuwan da ke cikin bayanan.
     * An cire shi idan bayanan ba su ƙunshi abubuwan da suka dace ba.
     */
    totalNumberOfPeople?: number;
    totalNumberOfPlaces?: number;
    totalNumberOfEvents?: number;
    totalNumberOfPeopleGroups?: number;
}
```

### Misali

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

## Jerin Littattafai a cikin Tsarin Bayanai

`GET https://bible.helloao.org/api/d/{dataset}/books.json`

Yana samun jerin littattafan da ake da su don bayanan da aka bayar.

-   `dataset` ID na bayanan (misali `open-cross-ref` ).

### Misalin Lambar

::: code-tabs#lang

@shafin JavaScript

```ts:no-line-numbers title="fetch-dataset-books.js"
const dataset = 'open-cross-ref';

// Nemi jerin littattafai don bayanan da aka buɗe
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

### Tsarin gini

```typescript:no-line-numbers title="dataset-books.ts"
export interface DatasetBooks {
    /**
     * Cikakken bayani game da littafin da aka yi amfani da shi.
     */
    dataset: Dataset;

    /**
     * Jerin littattafan da ake da su don adana bayanai.
     */
    books: DatasetBook[];
}

interface DatasetBook {
    /**
     * ID na littafin.
     * Ya dace da ID na littafin da ya dace a cikin Littafi Mai Tsarki (GEN, EXO, da sauransu).
     */
    id: string;

    /**
     * Tsarin littafin a cikin Littafi Mai Tsarki.
     */
    order: number;

    /**
     * Adadin babi na farko a cikin littafin.
     */
    firstChapterNumber: number;

    /**
     * Hanyar haɗi zuwa babi na farko na littafin.
     */
    firstChapterApiLink: string | null;

    /**
     * Adadin babi na ƙarshe a cikin littafin.
     */
    lastChapterNumber: number | null;

    /**
     * Hanyar haɗi zuwa babi na ƙarshe na littafin.
     */
    lastChapterApiLink: string | null;

    /**
     * Adadin surori da littafin ya ƙunsa.
     */
    numberOfChapters: number;

    /**
     * Adadin ayoyin da littafin ya kunsa.
     */
    totalNumberOfVerses: number;

    /**
     * Jimillar adadin nassoshi da wannan littafin ya ƙunsa.
     */
    totalNumberOfReferences: number;
}
```

### Misali

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

## Sami Babi daga Tsarin Bayanai

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

Yana samun abubuwan da ke cikin babi ɗaya na wani littafi da kuma bayanai.

Don bayanan da aka yi amfani da su wajen fassara (kamar `open-cross-ref` ), babin ya ƙunshi jerin nassoshi na giciye ga kowace baiti. Don bayanan abubuwan da aka yi amfani da su (kamar `theographic` ), babin ya ƙunshi mutane, wurare, da abubuwan da suka faru da suka bayyana a cikin babin - duba [Samun Abubuwan a cikin Babi](#get-the-entities-in-a-chapter) .

-   `dataset` ID na bayanan (misali `open-cross-ref` ).
-   `book` shine ID na littafin (misali `GEN` don Farawa).
-   `chapter` shine lambar babi na lamba (misali `1` don babi na farko).

### Misalin Lambar

::: code-tabs#lang

@shafin JavaScript

```ts:no-line-numbers title="fetch-dataset-chapter.js"
const dataset = 'open-cross-ref';
const book = 'GEN';
const chapter = 1;

// Sami Farawa 1 daga bayanan da aka buɗe na bayanin martaba
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

### Tsarin gini

```typescript:no-line-numbers title="dataset-chapter.ts"
export interface DatasetBookChapter {
    /**
     * Cikakken bayani game da littafin da aka yi amfani da shi don adana bayanai.
     */
    dataset: Dataset;

    /**
     * Bayanin littafin don babin littafin.
     */
    book: DatasetBook;

    /**
     * Hanyar haɗi zuwa wannan babi.
     */
    thisChapterLink: string;

    /**
     * Hanyar haɗi zuwa babi na gaba.
     * Babu komai idan wannan shine babi na ƙarshe a cikin bayanan.
     */
    nextChapterApiLink: string | null;

    /**
     * Hanyar haɗi zuwa babi na baya.
     * Babu komai idan wannan shine babi na farko a cikin bayanan.
     */
    previousChapterApiLink: string | null;

    /**
     * Adadin ayoyin da surar ta kunsa.
     */
    numberOfVerses: number;

    /**
     * Bayanin da aka bayar don babi.
     */
    chapter: DatasetChapterData;
}

interface DatasetChapterData {
    /**
     * Adadin babin.
     */
    number: number;

    /**
     * Abubuwan da ke cikin babin.
     */
    content: DatasetVerse[];
}

interface DatasetVerse {
    /**
     * Adadin ayar.
     */
    verse: number;

    /**
     * Nassoshi game da ayar.
     *
     * An tsara ta hanyar maki, ƙasa.
     */
    references: DatasetReference[];
}

interface DatasetReference {
    /**
     * ID na littafin da ake nuni da shi.
     */
    book: string;

    /**
     * Lambar babi.
     */
    chapter: number;

    /**
     * Lambar ayar.
     * Idan `endVerse` ya kasance, to wannan ita ce ayar da aka fara amfani da ita a nan.
     */
    verse: number;

    /**
     * Ayar da aka ambata ta ƙare a kai.
     */
    endVerse?: number;

    /**
     * Makin da ya dace don nassoshi.
     */
    score?: number;
}
```

### Misali

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

## Ƙungiyoyi

Wasu bayanai - kamar bayanan [Theographic Bible Metadata](https://github.com/robertrouse/theographic-bible-metadata) ( `theographic` ) - sun ƙunshi abubuwa: mutane, wurare, abubuwan da suka faru, da ƙungiyoyin mutane, tare da alaƙar da ke tsakaninsu da ayoyin Littafi Mai Tsarki da suka ambace su.

Saitunan bayanai da suka ƙunshi abubuwa sun haɗa da kaddarorin `listOfPeopleApiLink` , `listOfPlacesApiLink` , `listOfEventsApiLink` , da `listOfPeopleGroupsApiLink` a cikin shigarwarsu a cikin `/api/available_datasets.json` .

Bayanan bayanai na ƙungiyoyi kuma suna ba da bayanai masu daidaitawa a babi: `/api/d/{dataset}/books.json` ya lissafa littattafan da babinsu ya ƙunshi bayanan ƙungiyoyi, kuma `/api/d/{dataset}/{book}/{chapter}.json` ya dawo da mutane, wurare, da abubuwan da suka faru da suka bayyana a cikin wannan babi, tare da lambobin ayoyi inda aka ambaci kowannensu. Duba [Samun Ƙungiyoyi a Babi](#get-the-entities-in-a-chapter) .

Ƙungiyoyi suna amfani da nassoshi na Littafi Mai Tsarki iri ɗaya ta amfani da ID na littafi, lambobin babi, da lambobin aya kamar sauran API ɗin, don haka ana iya haɗa su da kowace fassara. Suna amfani da nassoshi na mahalli:

```typescript:no-line-numbers title="entity-shared.ts"
export interface DatasetEntityRef {
    /**
     * ID na kamfanin da ake nuni da shi.
     */
    id: string;

    /**
     * Nau'in abin da ake magana a kai.
     * Yana daidaita ɓangaren tattarawa na hanyar haɗin API na ƙungiyar, don haka za a iya gina hanyar haɗin kamar `/api/d/{dataset}/{type}/{id}.json` .
     */
    type: 'people' | 'places' | 'events' | 'groups';

    /**
     * Sunan mahaɗan da ake ambatonsa.
     */
    name?: string;

    /**
     * Hanyar API don abin da ake magana a kai.
     */
    apiLink?: string;
}

export interface VerseRef {
    /**
     * ID na littafin (GEN, EXO, da sauransu).
     */
    book: string;

    /**
     * Lambar babi da aka fara amfani da ita a kai.
     */
    chapter: number;

    /**
     * Lambar ayar da aka fara amfani da ita a kai.
     */
    verse: number;

    /**
     * Ayar da aka ambata ta ƙare a kai.
     * An tattara ayoyi masu jere a cikin sura ɗaya zuwa nassoshi guda ɗaya.
     */
    endVerse?: number;
}
```

## Samu Ƙungiyoyi a cikin Babi

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

Don tattara bayanai game da abubuwan da ke cikin babi, yana samun mutane, wurare, da abubuwan da suka faru waɗanda suka bayyana a cikin babi ɗaya, tare da lambobin ayoyi a cikin babin da aka ambaci kowannensu.

-   `dataset` ID na bayanan (misali `theographic` ).
-   `book` shine ID na littafin (misali `GEN` don Farawa).
-   `chapter` shine lambar babi na lamba (misali `1` don babi na farko).

Jerin littattafai da surori waɗanda ke da bayanan mahalli yana samuwa daga `GET https://bible.helloao.org/api/d/{dataset}/books.json` , wanda ke bin tsari iri ɗaya da [ƙarshen littattafan bayanai](#list-books-in-a-dataset) . Ga bayanan mahalli, `totalNumberOfVerses` shine adadin ayoyi da aƙalla mahalli ɗaya ya ambata kuma `totalNumberOfReferences` shine jimlar adadin ambaton mahalli-aya.

### Misalin Lambar

::: code-tabs#lang

@shafin JavaScript

```ts:no-line-numbers title="fetch-chapter-entities.js"
const dataset = 'theographic';
const book = 'GEN';
const chapter = 2;

// Nemo mutane, wurare, da abubuwan da suka faru da suka bayyana a cikin Farawa 2
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

### Tsarin gini

```typescript:no-line-numbers title="dataset-chapter-entities.ts"
export interface DatasetEntityBookChapter {
    /**
     * Cikakken bayani game da littafin da aka yi amfani da shi don adana bayanai.
     */
    dataset: Dataset;

    /**
     * Bayanin littafin don babin littafin.
     */
    book: DatasetBook;

    /**
     * Bayanan mahalli na babi.
     */
    chapter: DatasetEntityChapterData;

    /**
     * Hanyar haɗi zuwa wannan babi.
     */
    thisChapterLink: string;

    /**
     * Hanyar haɗi zuwa babi na gaba.
     * Babu komai idan wannan shine babi na ƙarshe a cikin bayanan.
     */
    nextChapterApiLink: string | null;

    /**
     * Hanyar haɗi zuwa babi na baya.
     * Babu komai idan wannan shine babi na farko a cikin bayanan.
     */
    previousChapterApiLink: string | null;

    /**
     * Adadin mutane, wurare, da abubuwan da suka faru da suka bayyana a cikin babin.
     */
    numberOfPeople: number;
    numberOfPlaces: number;
    numberOfEvents: number;
}

interface DatasetEntityChapterData {
    /**
     * Adadin babin.
     */
    number: number;

    /**
     * Mutanen da suka bayyana a cikin babi.
     * An tsara ta da ayar farko da suka bayyana a ciki.
     */
    people: ChapterPerson[];

    /**
     * Wuraren da suka bayyana a cikin babin.
     * An tsara ta da ayar farko da suka bayyana a ciki.
     */
    places: ChapterPlace[];

    /**
     * Abubuwan da suka bayyana a cikin babin.
     * An tsara ta da ayar farko da suka bayyana a ciki.
     */
    events: ChapterEvent[];
}

interface ChapterPerson {
    /**
     * ID na mutumin.
     */
    id: string;

    /**
     * Sunan mutumin.
     */
    name: string;

    /**
     * Ko sunan mutumin sunan da aka saba amfani da shi ne.
     */
    isProperName?: boolean;

    /**
     * Jinsin mutum.
     */
    gender?: string;

    /**
     * Shekarar da aka haifi mutumin da kuma shekarar da ya mutu.
     * Lambobin da ba su da kyau sune shekaru BC. Lambobin da ba su da kyau sune shekaru AD.
     */
    birthYear?: number;
    deathYear?: number;

    /**
     * Hanyar API ga mutumin.
     */
    apiLink: string;

    /**
     * Lambobin ayoyin da ke cikin babin da suka ambaci mutumin.
     * An tsara shi a cikin tsari mai hawa.
     */
    verses: number[];
}

interface ChapterPlace {
    /**
     * ID na wurin.
     */
    id: string;

    /**
     * Sunan wurin.
     */
    name: string;

    /**
     * Nau'in yanayin ƙasa da wurin yake.
     */
    featureType?: string;

    /**
     * Latitude da tsawon wurin.
     */
    latitude?: number;
    longitude?: number;

    /**
     * Hanyar API don wurin.
     */
    apiLink: string;

    /**
     * Lambobin ayoyin da ke cikin babin da suka ambaci wurin.
     * An tsara shi a cikin tsari mai hawa.
     */
    verses: number[];
}

interface ChapterEvent {
    /**
     * ID na taron.
     */
    id: string;

    /**
     * Sunan taron.
     */
    name: string;

    /**
     * Ranar da taron ya fara a.
     */
    startDate?: string;

    /**
     * Haɗin API don taron.
     */
    apiLink: string;

    /**
     * Lambobin ayoyin da ke cikin babin da ke bayanin abin da ya faru.
     * An tsara shi a cikin tsari mai hawa.
     */
    verses: number[];
}
```

### Misali

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

## Jerin Mutane a cikin Tsarin Bayanai

`GET https://bible.helloao.org/api/d/{dataset}/people.json`

Yana samun jerin mutanen da ke cikin jerin sunayen da aka bayar.

-   `dataset` ID na bayanan (misali `theographic` ).

### Misalin Lambar

::: code-tabs#lang

@shafin JavaScript

```ts:no-line-numbers title="fetch-dataset-people.js"
const dataset = 'theographic';

// Nemi jerin mutanen da za su yi amfani da bayanan zane-zane
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

### Tsarin gini

```typescript:no-line-numbers title="dataset-people.ts"
export interface DatasetPeople {
    /**
     * Tsarin bayanai don mutane.
     */
    dataset: Dataset;

    /**
     * Jerin mutanen da ake da su don samun bayanai.
     */
    people: DatasetPersonSummary[];
}

interface DatasetPersonSummary {
    /**
     * ID na mutumin.
     */
    id: string;

    /**
     * Sunan mutumin.
     */
    name: string;

    /**
     * Ko sunan mutumin sunan da aka saba amfani da shi ne.
     */
    isProperName?: boolean;

    /**
     * Jinsin mutum.
     */
    gender?: string;

    /**
     * Adadin nassoshin Littafi Mai Tsarki da suka ambaci mutumin.
     */
    numberOfReferences: number;

    /**
     * Hanyar API ga mutumin.
     */
    thisPersonApiLink: string;
}
```

### Misali

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

## Nemo mutum daga saitin bayanai

`GET https://bible.helloao.org/api/d/{dataset}/people/{person}.json`

Yana samun bayanai game da mutum ɗaya, gami da nassoshin Littafi Mai Tsarki da suka ambace su da kuma dangantakarsu da wasu mutane, wurare, abubuwan da suka faru, da ƙungiyoyin mutane.

-   `dataset` ID na bayanan (misali `theographic` ).
-   `person` ID na mutumin (misali `paul_2479` ).

### Misalin Lambar

::: code-tabs#lang

@shafin JavaScript

```ts:no-line-numbers title="fetch-dataset-person.js"
const dataset = 'theographic';
const person = 'paul_2479';

// Nemo bayanai game da Bulus daga bayanan zane-zane
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

### Tsarin gini

```typescript:no-line-numbers title="dataset-person.ts"
export interface DatasetPersonResponse {
    /**
     * Bayanin bayanai na mutum.
     */
    dataset: Dataset;

    /**
     * Bayanin mutum.
     */
    person: DatasetPerson;

    /**
     * Hanyar API ta wannan mutumin.
     */
    thisPersonApiLink: string;
}

interface DatasetPerson {
    /**
     * ID na mutumin.
     */
    id: string;

    /**
     * Sunan mutumin.
     */
    name: string;

    /**
     * Wasu sunaye da ake kiran mutumin da su.
     */
    alsoCalled?: string[];

    /**
     * Ko sunan mutumin sunan da aka saba amfani da shi ne.
     */
    isProperName?: boolean;

    /**
     * Jinsin mutum.
     */
    gender?: string;

    /**
     * Bayanin mutumin. Kowace layi sakin layi ne.
     */
    description?: string[];

    /**
     * Shekarar da aka haifi mutumin da kuma shekarar da ya mutu.
     * Lambobin da ba su da kyau sune shekaru BC. Lambobin da ba su da kyau sune shekaru AD.
     */
    birthYear?: number;
    deathYear?: number;

    /**
     * Shekarun farko da na baya-bayan nan da aka ambaci mutumin a ciki.
     */
    minYear?: number;
    maxYear?: number;

    /**
     * Wurin da aka haifi mutumin kuma ya mutu a ciki.
     */
    birthPlace?: DatasetEntityRef;
    deathPlace?: DatasetEntityRef;

    /**
     * Dangantakar iyali ta mutum.
     */
    father?: DatasetEntityRef[];
    mother?: DatasetEntityRef[];
    partners?: DatasetEntityRef[];
    children?: DatasetEntityRef[];
    siblings?: DatasetEntityRef[];
    halfSiblingsSameMother?: DatasetEntityRef[];
    halfSiblingsSameFather?: DatasetEntityRef[];

    /**
     * Ƙungiyoyin mutane da mutumin yake memba a cikinsu.
     */
    memberOf?: DatasetEntityRef[];

    /**
     * Abubuwan da mutumin ya shiga ciki.
     */
    events?: DatasetEntityRef[];

    /**
     * Jerin nassoshin Littafi Mai Tsarki da suka ambaci mutumin.
     * An tsara shi ta hanyar tsari na littafi, babi, da aya.
     */
    references: VerseRef[];
}
```

### Misali

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

## Jerin Wurare a cikin Tsarin Bayanai

`GET https://bible.helloao.org/api/d/{dataset}/places.json`

Yana samun jerin wurare da ake da su don bayanan da aka bayar.

-   `dataset` ID na bayanan (misali `theographic` ).

### Tsarin gini

```typescript:no-line-numbers title="dataset-places.ts"
export interface DatasetPlaces {
    /**
     * Bayanin bayanai na wurare.
     */
    dataset: Dataset;

    /**
     * Jerin wuraren da ake da su don tattara bayanai.
     */
    places: DatasetPlaceSummary[];
}

interface DatasetPlaceSummary {
    /**
     * ID na wurin.
     */
    id: string;

    /**
     * Sunan wurin.
     */
    name: string;

    /**
     * Nau'in yanayin ƙasa da wurin yake.
     * Misali, "Birni", "Yanki", "Dutse", "Ruwa", da sauransu.
     */
    featureType?: string;

    /**
     * Latitude da tsawon wurin.
     */
    latitude?: number;
    longitude?: number;

    /**
     * Adadin nassoshin Littafi Mai Tsarki da suka ambaci wurin.
     */
    numberOfReferences: number;

    /**
     * Hanyar API don wurin.
     */
    thisPlaceApiLink: string;
}
```

## Nemo Wuri daga Tsarin Bayanai

`GET https://bible.helloao.org/api/d/{dataset}/places/{place}.json`

Yana samun bayanai game da wuri ɗaya, gami da nassoshin Littafi Mai Tsarki da suka ambaci shi da mutanen da suka shafi shi da abubuwan da suka faru.

-   `dataset` ID na bayanan (misali `theographic` ).
-   `place` ID na wurin (misali `jerusalem_636` ).

### Tsarin gini

```typescript:no-line-numbers title="dataset-place.ts"
export interface DatasetPlaceResponse {
    /**
     * Bayanin bayanai na wurin.
     */
    dataset: Dataset;

    /**
     * Bayanin wurin.
     */
    place: DatasetPlace;

    /**
     * Hanyar API ta wannan wuri.
     */
    thisPlaceApiLink: string;
}

interface DatasetPlace {
    /**
     * ID na wurin.
     */
    id: string;

    /**
     * Sunan wurin.
     */
    name: string;

    /**
     * Sunan wurin kamar yadda ya bayyana a cikin King James Version da kuma Turanci Standard Version.
     */
    kjvName?: string;
    esvName?: string;

    /**
     * Wasu sunaye da ake kiran wurin da su.
     */
    aliases?: string[];

    /**
     * Nau'in yanayin ƙasa da wurin yake.
     */
    featureType?: string;
    featureSubType?: string;

    /**
     * Tsarin latitude da tsawon wurin, da kuma yadda suke daidai.
     */
    latitude?: number;
    longitude?: number;
    precision?: string;

    /**
     * Bayanin wurin. Kowace layi sakin layi ne.
     */
    description?: string[];

    /**
     * Sharhin da aka yi kan wurin daga marubutan bayanai.
     */
    comment?: string;

    /**
     * Asalin wurin wannan wuri.
     * Sunaye daban-daban na wurin ƙasa ɗaya suna da tushe iri ɗaya.
     */
    rootPlace?: DatasetEntityRef;

    /**
     * Wurin da wannan wuri ya kasance iri ɗaya ne.
     */
    duplicateOf?: DatasetEntityRef;

    /**
     * Mutanen da suka kasance a wurin, an haife su a wurin, ko kuma sun mutu a wurin.
     */
    people?: DatasetEntityRef[];
    peopleBorn?: DatasetEntityRef[];
    peopleDied?: DatasetEntityRef[];

    /**
     * Abubuwan da suka faru a wurin.
     */
    events?: DatasetEntityRef[];

    /**
     * Jerin nassoshin Littafi Mai Tsarki da suka ambaci wurin.
     * An tsara shi ta hanyar tsari na littafi, babi, da aya.
     */
    references: VerseRef[];
}
```

### Misali

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

## Jerin Abubuwan da Suka Faru a cikin Tsarin Bayanai

`GET https://bible.helloao.org/api/d/{dataset}/events.json`

Yana samun jerin abubuwan da suka faru da ke akwai don bayanan da aka bayar.

-   `dataset` ID na bayanan (misali `theographic` ).

### Tsarin gini

```typescript:no-line-numbers title="dataset-events.ts"
export interface DatasetEvents {
    /**
     * Bayanin bayanai don abubuwan da suka faru.
     */
    dataset: Dataset;

    /**
     * Jerin abubuwan da suka faru da ake da su don tattara bayanai.
     */
    events: DatasetEventSummary[];
}

interface DatasetEventSummary {
    /**
     * ID na taron.
     */
    id: string;

    /**
     * Sunan taron.
     */
    name: string;

    /**
     * Ranar da taron ya fara a.
     * Lambobin da ba su da kyau sune shekaru BC. Lambobin da ba su da kyau sune shekaru AD.
     * Wasu takamaiman ranaku suna amfani da tsarin `YYYY-MM-DD` .
     */
    startDate?: string;

    /**
     * Adadin nassoshi na Littafi Mai Tsarki da suka bayyana abin da ya faru.
     */
    numberOfReferences: number;

    /**
     * Haɗin API don taron.
     */
    thisEventApiLink: string;
}
```

## Sami Taro daga Tsarin Bayanai

`GET https://bible.helloao.org/api/d/{dataset}/events/{event}.json`

Yana samun bayanai game da wani abu guda ɗaya, gami da nassoshin Littafi Mai Tsarki waɗanda suka bayyana shi da kuma mutanen da ke da alaƙa da shi, wurare, da ƙungiyoyin mutane.

-   `dataset` ID na bayanan (misali `theographic` ).
-   `event` ID na taron (misali `saul-is-converted_326` ).

### Tsarin gini

```typescript:no-line-numbers title="dataset-event.ts"
export interface DatasetEventResponse {
    /**
     * Bayanin bayanai don taron.
     */
    dataset: Dataset;

    /**
     * Bayanin da ya shafi taron.
     */
    event: DatasetEvent;

    /**
     * Haɗin API na wannan taron.
     */
    thisEventApiLink: string;
}

interface DatasetEvent {
    /**
     * ID na taron.
     */
    id: string;

    /**
     * Sunan taron.
     */
    name: string;

    /**
     * Ranar da taron ya fara a.
     */
    startDate?: string;

    /**
     * Tsawon lokacin taron.
     * Misali, "1D" rana ɗaya ce, kuma "40Y" shekara arba'in ce.
     */
    duration?: string;

    /**
     * Mutanen da suka halarci taron.
     */
    participants?: DatasetEntityRef[];

    /**
     * Wuraren da abin ya faru a wurin.
     */
    locations?: DatasetEntityRef[];

    /**
     * Ƙungiyoyin jama'a da suka halarci taron.
     */
    groups?: DatasetEntityRef[];

    /**
     * Taron da wannan taron ya kasance wani ɓangare nasa.
     */
    partOf?: DatasetEntityRef;

    /**
     * Abin da ya faru kafin wannan lamari.
     */
    predecessor?: DatasetEntityRef;

    /**
     * Jerin nassoshin Littafi Mai Tsarki da suka bayyana abin da ya faru.
     * An tsara shi ta hanyar tsari na littafi, babi, da aya.
     */
    references: VerseRef[];
}
```

### Misali

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

## Jerin Ƙungiyoyin Mutane a cikin Tsarin Bayanai

`GET https://bible.helloao.org/api/d/{dataset}/groups.json`

Yana samun jerin ƙungiyoyin mutane da ke akwai don bayanan da aka bayar.

-   `dataset` ID na bayanan (misali `theographic` ).

### Tsarin gini

```typescript:no-line-numbers title="dataset-people-groups.ts"
export interface DatasetPeopleGroups {
    /**
     * Bayanin bayanai na ƙungiyoyin mutane.
     */
    dataset: Dataset;

    /**
     * Jerin ƙungiyoyin mutane da ake da su don tattara bayanai.
     */
    groups: DatasetPeopleGroupSummary[];
}

interface DatasetPeopleGroupSummary {
    /**
     * ID na ƙungiyar mutane.
     */
    id: string;

    /**
     * Sunan ƙungiyar mutane.
     */
    name: string;

    /**
     * Adadin mutanen da ke cikin ƙungiyar mutane.
     */
    numberOfMembers: number;

    /**
     * Haɗin API don rukunin mutane.
     */
    thisPeopleGroupApiLink: string;
}
```

## Nemo Ƙungiyar Mutane daga Tsarin Bayanai

`GET https://bible.helloao.org/api/d/{dataset}/groups/{group}.json`

Yana samun bayanai game da ƙungiyar mutane ɗaya, gami da membobinta da kuma abubuwan da ƙungiyar ta halarta.

-   `dataset` ID na bayanan (misali `theographic` ).
-   `group` ID na ƙungiyar mutane (misali `tribe-of-benjamin` ).

### Tsarin gini

```typescript:no-line-numbers title="dataset-people-group.ts"
export interface DatasetPeopleGroupResponse {
    /**
     * Bayanin bayanai na ƙungiyar mutane.
     */
    dataset: Dataset;

    /**
     * Cikakken bayani game da rukunin mutane.
     */
    group: DatasetPeopleGroup;

    /**
     * Haɗin API na wannan rukunin mutane.
     */
    thisPeopleGroupApiLink: string;
}

interface DatasetPeopleGroup {
    /**
     * ID na ƙungiyar mutane.
     */
    id: string;

    /**
     * Sunan ƙungiyar mutane.
     */
    name: string;

    /**
     * Mutane da ke cikin ƙungiyar mutane.
     */
    members?: DatasetEntityRef[];

    /**
     * Abubuwan da ƙungiyar mutane ta shiga ciki.
     */
    events?: DatasetEntityRef[];

    /**
     * Jerin nassoshin Littafi Mai Tsarki da suka ambaci ƙungiyar mutane.
     * An tsara shi ta hanyar tsari na littafi, babi, da aya.
     */
    references: VerseRef[];
}
```

### Misali

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
