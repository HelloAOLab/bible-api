# Saitunan Bayanai

Maƙallan ƙarshe don bincika ƙarin bayanai na Littafi Mai Tsarki - kamar nassoshi masu alaƙa, abubuwan da ke cikin Littafi Mai Tsarki (mutane, wurare, abubuwan da suka faru, da ƙungiyoyin mutane), kalmomin da suka shafi harshe na asali, ƙamus, da kuma 'yan takarar ayar yau - da kuma ɗauko littattafansu, abubuwan da ke cikin babi, abubuwan da ke cikin ƙamus, da kuma nau'ikan baitoci.

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
     * Bayanan da aka ƙara ta API don lasisin.
     * Ba a fayyace ko ba a fayyace ba idan babu bayanin kula.
     */
    licenseNotes?: string | null;

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
     * 0 don bayanan da ba su ƙunshi nassoshi masu alaƙa ba.
     */
    totalNumberOfReferences: number;

    /**
     * Jimillar kalmomin interlinear da ke cikin wannan tarin bayanai.
     * An cire shi idan bayanan ba su ƙunshi kalmomi na tsakiya ba.
     */
    totalNumberOfWords?: number;

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

    /**
     * Haɗin API don jerin shigarwar ƙamus a cikin bayanan.
     * An yi watsi da shi idan bayanan ba su ƙunshi shigarwar ƙamus ba.
     */
    listOfLexiconApiLink?: string;

    /**
     * Jimillar adadin shigarwar ƙamus da ke cikin bayanan.
     * An yi watsi da shi idan bayanan ba su ƙunshi shigarwar ƙamus ba.
     */
    totalNumberOfLexicon?: number;

    /**
     * Hanyar API don jerin kowace baiti a cikin bayanan, tare da rukunanta.
     * An yi watsi da shi idan ayoyin bayanan ba su da rukunoni.
     */
    listOfVersesApiLink?: string;

    /**
     * Hanyar API don jerin nau'ikan baituka a cikin bayanan.
     * An yi watsi da shi idan bayanan ba su ƙunshi rukunan baiti ba.
     */
    listOfCategoriesApiLink?: string;

    /**
     * Jimillar nau'ikan baituka da ke cikin bayanan.
     * An yi watsi da shi idan bayanan ba su ƙunshi rukunan baiti ba.
     */
    totalNumberOfCategories?: number;
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

Don bayanan da aka yi amfani da su wajen fassara (kamar `open-cross-ref` ), babin ya ƙunshi jerin nassoshi na giciye ga kowace baiti. Don bayanan da aka yi amfani da su tsakanin layi (kamar `bsb-interlinear` ), babin ya ƙunshi kalmomin harshe na asali na kowace baiti - duba [Saitunan Bayanai na Interlinear](#interlinear-datasets) . Don bayanan abubuwan da aka yi amfani da su (kamar `theographic` ), babin ya ƙunshi mutane, wurare, da abubuwan da suka faru da suka bayyana a cikin babin - duba [Samun Abubuwan da ke cikin Babi](#get-the-entities-in-a-chapter) . Don bayanan `verse-of-the-day` , babin ya ƙunshi 'yan takarar ayar rana a cikin babin da rukunansu - duba [Aya ta Ranar](#verse-of-the-day) .

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

/**
 * Aya tana ɗauke da `references` (bayanan bayanai na giciye), `words` (bayanan bayanai na interlinear), ko `categories` (bayanan bayanai na ayar-rana).
 * Duba wanne ne yake da `'words' in verse` ko `'categories' in verse` .
 */
type DatasetVerse =
    | DatasetReferencesVerse
    | DatasetWordsVerse
    | DatasetCategoriesVerse;

interface DatasetReferencesVerse {
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

interface DatasetWordsVerse {
    /**
     * Adadin ayar.
     */
    verse: number;

    /**
     * Kalmomin ayar da aka yi amfani da su a harshen asali, a cikin tsari na asali.
     * Duba "Saitunan Bayanai na Interlinear" a ƙasa.
     */
    words: InterlinearWord[];
}

interface DatasetCategoriesVerse {
    /**
     * Adadin ayar.
     * Idan `endVerse` yana nan, to wannan ita ce ayar da nassi ya fara a kai.
     */
    verse: number;

    /**
     * Ayar da nassi ya ƙare a kai.
     * An yi watsi da shi idan shigarwar aya ɗaya ce.
     */
    endVerse?: number;

    /**
     * ID na rukunan da ayar ta kunsa, sun fi dacewa da farko.
     * Duba "Ayar Ranar" a ƙasa.
     */
    categories: string[];

    /**
     * Shekara ta farko da ayar za ta iya zama ayar ranar.
     * An yi watsi da shi idan ayar ta kasance a cikin jerin koyaushe.
     */
    addedIn?: number;

    /**
     * Shekara ta farko da ayar ba za ta iya zama ayar yau ba.
     * Ayoyin da aka cire suna nan a cikin bayanan domin a iya zaɓar ayoyin shekarun baya.
     * An cire ayar idan ba a cire ta daga jerin ba.
     */
    removedIn?: number;
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

// Duba "Interlinear Datasets" a ƙasa don tsarin InterlinearWord.
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

Wasu bayanai - kamar [Theographic Bible Metadata](https://github.com/robertrouse/theographic-bible-metadata) database ( `theographic` ) - sun ƙunshi abubuwa: mutane, wurare, abubuwan da suka faru, da ƙungiyoyin mutane, tare da alaƙar da ke tsakaninsu da ayoyin Littafi Mai Tsarki da suka ambace su.

Bayanan [Tarihi na Duniyar Tarihi](https://historyglobe.app) ( `history-globe` ) ya ƙunshi wurare kawai: wuraren da aka ambata a cikin Littafi Mai Tsarki, tare da daidaitawarsu da ayoyin da suka sanya musu suna. ID ɗin wurinsa (misali `a15257a` don Urushalima) sune ID ɗin wurin da Tarihin Duniyar Tarihi yake da shi, iri ɗaya ne da [API ɗin bayanansa na buɗe](https://historyglobe.app/docs/api.html) yake amfani da shi, don haka ba sa canzawa lokacin da aka gyara suna. Ƙimar sa `featureType` tana bin waɗanda Theographic dataset ke amfani da su ( `City` , `Region` , `Water` , da sauransu), kuma `featureSubType` yana ɗauke da takamaiman nau'in inda akwai ɗaya (misali `River` , `Gate` , `Spring` ).

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

### Bayar da Tarihin Duniya

An ba da lasisin bayanan Tarihin Duniya a ƙarƙashin [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) . Idan kun yi amfani da shi, ku ba da lamuni ga Tarihin Duniya ( https://historyglobe.app ) da Bayanan Geocoding na Littafi Mai Tsarki na OpenBible.info da ya gina a kai, kuma ku lura da duk wani canji. Kaya na `licenseNotes` na bayanan yana ɗauke da ƙimar.

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

## Saitunan Bayanan Interlinear

Bayanan da aka tattara daga Berean ( `bsb-interlinear` ) sun lissafa kalmomin asali na harshe (Ibrananci, Aramaic, da Girkanci) na kowace aya ta Littafi Mai Tsarki, bisa ga yadda suka bayyana a cikin rubutun asali. Kowace kalma tana da rubutunta, fassarar nahawu, [lambar Strong](https://en.wikipedia.org/wiki/Strong%27s_Concordance) , da kuma kalmar Turanci da Littafi [Mai Tsarki na Berean Standard Bible](https://berean.bible) ya yi amfani da ita a kai.

Tsarin tattara bayanai yana amfani da maƙallan ƙarshe iri ɗaya kamar sauran bayanan bayanai:

-   `GET https://bible.helloao.org/api/d/bsb-interlinear/books.json` ya lissafa littattafai 66.
-   `GET https://bible.helloao.org/api/d/bsb-interlinear/{book}/{chapter}.json` (misali `/api/d/bsb-interlinear/GEN/1.json` ) ya dawo da babin, tare da `{ verse, words }` ga kowace aya. Amsar [babi ne na bayanai](#get-a-chapter-from-a-dataset) .

Bayanan kalmomin sun fito ne daga [teburin Bible na Berean Standard Bible interlinear](https://bereanbible.com/) , waɗanda ke cikin yankin jama'a. Ana duba lambobin Strong don kalmomin a cikin [ƙamus](#lexicon) ( `stepbible-lexicon` ).

### Tsarin gini

```typescript:no-line-numbers title="interlinear-word.ts"
interface InterlinearWord {
    /**
     * Matsayin kalmar mai tushe 1 a cikin tsarin rubutun asali.
     * An jera kalmomi a cikin wannan tsari.
     */
    pos: number;

    /**
     * Matsayin kalmar da aka dogara da shi a cikin tsarin Turanci na Berean Standard Bible.
     */
    bsbPos: number;

    /**
     * Harshen kalmar.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * Kalmar da ke cikin rubutun asali. An daidaita NFC.
     */
    text: string;

    /**
     * Fassarar kalmar.
     */
    transliteration: string | null;

    /**
     * Gajeren lambar nazarin nahawu na kalmar. misali "N-mp" ko "V-Qal-Perf-3ms".
     */
    parsing: string | null;

    /**
     * Fassarar kalmar a cikin nahawu.
     */
    parsingFull: string | null;

    /**
     * Lambar kalmar Strong mai sifili. misali "H0430" ko "G3056".
     * Sifili mai kauri, wanda ya dace da ƙimar `.words.json` ta KJV.
     * Ƙimar wasu fassarorin na iya buƙatar sifili-padding da cire ƙarin bayani kafin shiga.
     * Babu komai idan tushen ya ba da lambar kalmar no Strong (wannan haka yake ga wasu kalmomi waɗanda suke ƙarin bayani, kamar ƙarin bayani game da suna).
     */
    strongs: string | null;

    /**
     * Kalmomin Turanci na Bibul na Berean Standard don kalmar.
     * Babu komai idan BSB ya bar kalmar da ba a fassara ba (kamar alamar abu kai tsaye ta Ibrananci).
     */
    gloss: string | null;
}
```

### Misali

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

### Haɗa Kalmomi da Fassara

Ƙimar Interlinear `strongs` ba ta da madauri (misali `H0430` ). Wannan ya yi daidai da ƙimomin `strongs` a cikin bayanin kalmomin KJV ( `/api/eng_kjv/{book}/{chapter}.words.json` ). Ƙimar wasu fassarorin na iya buƙatar madauri sifili da cire ƙarin bayani (misali `H430` ko `H1961a` zuwa `H0430` da `H1961` ) kafin a haɗa su.

-   **KJV.** Don sigar King James ( `eng_kjv` da `eng_kja` ), haɗa lambobin Strong a cikin fayil ɗin babi na `.words.json` tare da kalmomin interlinear `strongs` na ayar iri ɗaya. Misali, lambar kowace Strong da aka yi wa alama a cikin `/api/eng_kjv/GEN/1.words.json` don aya ta 1 ( `H7225` , `H1254` , `H0430` , `H0853` , `H8064` , `H0776` ) ta bayyana a matsayin ƙimar `strongs` tsakanin kalmomin aya ta 1 cikin `/api/d/bsb-interlinear/GEN/1.json` .
-   **Littafi Mai Tsarki na Berean Standard.** Kowace kalma `gloss` ita ce kalmar BSB da ke wakiltar wannan kalmar. Yi tafiya da kalmomin ayar a tsari `bsbPos` sannan ka daidaita kowace `gloss` da rubutun ayar da ke cikin fassarar BSB don gano inda fassarar kalmar take.

Lambobin tushe biyu ba koyaushe suke jituwa ba. Misali, alamun KJV "sun kasance" a matsayin `G2258` inda teburin Berean yana da `G1510` Wasu sun shiga sun rasa saboda bambance-bambance kamar wannan.

### Ba da izini

Teburan haɗin kan Berean suna cikin hannun jama'a. An ba da lasisin [ƙamus ɗin](#lexicon) a ƙarƙashin CC BY 4.0 kuma yana buƙatar a ba da izini.

## Kamus

Tsarin bayanai na ƙamus na STEBible ( `stepbible-lexicon` ) ya ƙunshi ƙamus na Ibrananci, Aramaic, da Girkanci (TBESH da TBESG) daga [STEBible.org](https://www.stepbible.org/) a Tyndale House, Cambridge. Yana da shigarwa ɗaya ga kowane tushe lambar Strong, kuma kowane shigarwa yana da ma'ana ɗaya ko fiye tare da lemma, fassara, ɓangaren magana, ƙamus na Turanci, da ma'ana.

Duk wata ƙima mai siffar sifili `strongs` daga [kalmar interlinear](#interlinear-datasets) wacce ke da shigarwar ƙamus za a iya duba ta zuwa `/api/d/stepbible-lexicon/lexicon/{strongs}.json` ba tare da sake fasalin ta ba. Haka yake ga ƙima `.words.json` na KJV; ƙima na wasu fassarori na iya buƙatar sifili-padding da cire ƙarin bayani da farko. Ba a buga shigarwar Girkanci da ƙamus ɗin ya ƙara ba tare da lambar Strong ba.

Saitunan bayanai da ke ɗauke da shigarwar ƙamus sun haɗa da `listOfLexiconApiLink` da `totalNumberOfLexicon` a cikin shigarwarsu a cikin `/api/available_datasets.json` .

### Ba da izini

Bayanan ƙamus ɗin an ba su lasisi a ƙarƙashin [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) . Idan kun yi amfani da shi, ku ba da lamuni ga STEBPible.org / Tyndale House, Cambridge, kuma ku lura da duk wani canji. Kadarar `licenseNotes` ta bayanan tana ɗauke da lamuni.

## Jerin Shigarwar Lexicon a cikin Saitin Bayanai

`GET https://bible.helloao.org/api/d/{dataset}/lexicon.json`

Yana samun jerin shigarwar ƙamus da ake da su don tarin bayanai.

-   `dataset` ID na bayanan (misali `stepbible-lexicon` ).

### Misalin Lambar

::: code-tabs#lang

@shafin JavaScript

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

### Tsarin gini

```typescript:no-line-numbers title="dataset-lexicon.ts"
export interface DatasetLexicon {
    /**
     * Bayanin bayanai don ƙamus ɗin.
     */
    dataset: Dataset;

    /**
     * Jerin shigarwar ƙamus da ake da su don bayanan.
     */
    lexicon: DatasetLexiconEntrySummary[];
}

export interface DatasetLexiconEntrySummary {
    /**
     * Lambar Strong mai sifili na shigar da ƙamus. misali "H0430".
     */
    id: string;

    /**
     * Harshen shigar da ƙamus.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * Sunan shigar da ƙamus.
     * Wannan shine bayanin farko na ma'anar shiga.
     */
    name: string;

    /**
     * Haɗin API don shigar da ƙamus.
     */
    apiLink: string;
}
```

### Misali

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

## Samu Shigarwar Lexicon daga Tsarin Bayanai

`GET https://bible.helloao.org/api/d/{dataset}/lexicon/{strongs}.json`

Yana samun shigar da ƙamus na lambar Strong mai tushe ɗaya, tare da dukkan hankalinsa.

-   `dataset` ID na bayanan (misali `stepbible-lexicon` ).
-   `strongs` shine lambar Strong mai sifili (misali `H0430` don kalmar Ibrananci _elohim_, ko `G3056` don kalmar Girkanci _logos_).

### Misalin Lambar

::: code-tabs#lang

@shafin JavaScript

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

### Tsarin gini

```typescript:no-line-numbers title="dataset-lexicon-entry.ts"
export interface DatasetLexiconEntry {
    /**
     * Bayanin bayanai don shigar da ƙamus.
     */
    dataset: Dataset;

    /**
     * Shigar da ƙamus.
     */
    entry: DatasetLexiconEntryContent;

    /**
     * Haɗin API don wannan shigarwar ƙamus.
     */
    thisLexiconEntryApiLink: string;
}

export interface DatasetLexiconEntryContent {
    /**
     * Lambar shigarwar Strong mai sifili. misali "H0430".
     */
    id: string;

    /**
     * Harshen shigar.
     * Wannan ita ce harshen da aka fi amfani da shi a farkon fahimtar shigar.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * Hankali na shigarwa, a cikin tsari na ID.
     */
    senses: DatasetLexiconSense[];
}

export interface DatasetLexiconSense {
    /**
     * Faɗaɗɗen ID na ma'anar. misali "H0001G".
     * Daidai yake da lambar Strong ta tushe idan lambar tana da ma'ana ɗaya.
     */
    id: string;

    /**
     * Harshen ma'ana.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * Limamin ma'anar a cikin rubutun asali.
     */
    lemma: string;

    /**
     * Fassarar lemma.
     */
    transliteration: string | null;

    /**
     * Sashen kalmar magana (morphology) ta ma'ana.
     */
    partOfSpeech: string | null;

    /**
     * Gajeren ɗanɗanon Ingilishi na ma'anar.
     */
    gloss: string | null;

    /**
     * Ma'anar ma'anar a matsayin rubutu mara tsari.
     * An raba sakin layi ta layuka marasa komai. An cire alamar da ke cikin tushen.
     */
    definition: string;
}
```

### Misali

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

## Aya ta Rana

Bayanan ayar rana ( `verse-of-the-day` ) jerin ayoyi ne da aka tsara na sanannun ayoyi da gajerun sassa (aƙalla ayoyi uku) waɗanda suka zama 'yan takara nagari ga "aya ta rana": fiye da 640 ga kowace rana ta shekara, da kuma fiye da 100 ga bukukuwan Kirista. Kowannensu yana da ma'ana da kansa.

Kowace aya ta kowace rana tana da rukuni ɗaya zuwa uku, waɗanda suka fi dacewa da farko, daga wannan saitin da aka ƙayyade:

| ID            | Bayani                                                               |
| ------------- | -------------------------------------------------------------------- |
| `comfort`     | Kusantar Allah da kulawarsa a cikin baƙin ciki, matsala, da kaɗaici. |
| `courage`     | Tsayuwa da ƙarfi ba tare da tsoro ba.                                |
| `faith`       | Dogara ga Allah da alkawuransa.                                      |
| `forgiveness` | Allah ya gafarta zunubi da kuma yafe wa wasu.                        |
| `gratitude`   | Godiya ga Allah.                                                     |
| `guidance`    | Allah ya shiryar da mu matakai, tsare-tsare, da shawarwarinmu.       |
| `hope`        | Amincewa da makomar da Allah ya yi alkawari.                         |
| `inspiration` | Ƙarfafawa don rayuwa bisa ga imani da kuma yin nagarta.              |
| `joy`         | Murna da farin ciki cikin Allah.                                     |
| `love`        | Ƙaunar Allah a gare mu da kuma ƙaunarmu ga Allah da sauran mutane.   |
| `peace`       | Hutu, nutsuwa, da kuma 'yanci daga damuwa.                           |
| `praise`      | Bauta da kuma bayyana girman Allah.                                  |
| `prayer`      | Kira ga Allah da alkawarinsa don jin sa.                             |
| `provision`   | Allah ya bamu abin da muke buƙata.                                   |
| `salvation`   | Fansa, alheri, da sabuwar rayuwa cikin Almasihu.                     |
| `strength`    | Allah ya ba da ƙarfi da juriya.                                      |
| `wisdom`      | Hikimar Allah da kuma koyarwa mai amfani don rayuwa.                 |

Hutu yana da nau'ikan nasu. A lokacin hutu, ayar ranar tana ɗaya daga cikin ayoyin hutun, kuma ba a amfani da waɗannan ayoyin a wasu kwanaki. Hutu yawanci yana ɗaukar kwana ɗaya; Bayan tashin matattu Lahadi yana ɗaukar kwanaki uku bayan tashin matattu Lahadi, don haka yana lissafa duk ranakun uku. Kowace rukuni na hutu yana da `holiday` tare da kwanakinsa: hutu a rana ɗaya kowace shekara yana da `month` da `day` , kuma ranakun hutu waɗanda ranarsu ke canzawa kowace shekara (saboda sun dogara da ranar tashin matattu ko isowa) suna lissafa `dates` a kalandar Gregorian, waɗanda aka riga aka ƙididdige su don 2026 zuwa 2125.

| ID                         | Hutu                         | Kwanan wata                             |
| -------------------------- | ---------------------------- | --------------------------------------- |
| `epiphany`                 | Epiphany                     | 6 ga Janairu                            |
| `ash-wednesday`            | Larabar Ash                  | Kwanaki 46 kafin Lahadin Tashin Kiyama  |
| `palm-sunday`              | Ranar Lahadi ta Kwana        | Lahadi kafin tashin matattu Lahadi      |
| `maundy-thursday`          | Alhamis Mai Tsarki           | Alhamis kafin Lahadin Tashin Kiyama     |
| `good-friday`              | Barka da Juma'a              | Lahadi kafin tashin Alƙiyama            |
| `resurrection-sunday`      | Lahadin Tashin Matattu       | Lahadin Ista                            |
| `post-resurrection-sunday` | Lahadi Bayan Tashin Alƙiyama | Kwanaki uku bayan Lahadin Tashin Kiyama |
| `ascension-day`            | Ranar Hawan Sama             | Kwanaki 39 bayan Lahadin Tashin Kiyama  |
| `pentecost`                | Fentikos                     | Kwanaki 49 bayan Lahadin Tashin Kiyama  |
| `all-hallows-eve`          | Duk Hallows' Eve             | 31 ga Oktoba                            |
| `all-saints-day`           | Ranar Duk Waliyyai           | 1 ga Nuwamba                            |
| `advent-sunday`            | Lahadi ta Farko ta Advent    | Lahadi ta huɗu kafin Kirsimeti          |
| `christmas-eve`            | Hauwa'ar Kirsimeti           | 24 ga Disamba                           |
| `christmas`                | Kirsimeti                    | 25 ga Disamba                           |

Bayanan bayanai sun ƙunshi nassoshi ne kawai, ba rubutun baiti ba, don haka yana aiki da kowace fassara. Lambobin baiti suna amfani da daidaitattun lambobi na Turanci (daidai da BSB). Ana iya karanta bayanan ta hanyoyi uku:

-   [`/api/d/verse-of-the-day/verses.json`](#list-verses-in-a-dataset) ya lissafa kowace aya a cikin bayanan tare da rukunanta, da kuma ranakun hutu tare da kwanakinsu, a cikin fayil ɗaya.
-   [`/api/d/verse-of-the-day/categories/{category}.json`](#get-a-category-from-a-dataset) ya lissafa kowace aya a cikin rukuni. Wannan ita ce hanya mafi sauƙi don zaɓar aya ta yini daga rukuni ɗaya.
-   [`/api/d/verse-of-the-day/{book}/{chapter}.json`](#get-a-chapter-from-a-dataset) ya lissafa 'yan takarar a cikin babi, tare da rukunansu. Babi-babi ne kawai da ke ɗauke da ɗan takara; yi amfani da hanyoyin haɗin babi na littafin ko `/api/d/verse-of-the-day/books.json` don nemo su.

Saitunan bayanai da ke ɗauke da nau'ikan baiti sun haɗa da `listOfVersesApiLink` , `listOfCategoriesApiLink` , da `totalNumberOfCategories` a cikin shigarsu a cikin `/api/available_datasets.json` .

### Zaɓar Aya ta Rana

An yi API ɗin ne da fayiloli marasa tsari, don haka ba ya zaɓar muku aya. Madadin haka, akwai al'ada don zaɓar ɗaya, ta yadda kowace manhaja da ta biyo baya za ta nuna aya ɗaya a rana ɗaya. Manhajoji suna da 'yancin zaɓar ta daban; al'adar kawai tana ba su tsoho ɗaya da aka raba.

Taron ya zaɓi daga ayoyi da bukukuwa a cikin `/api/d/verse-of-the-day/verses.json` A lokacin hutu, yana zaɓar ɗaya daga cikin ayoyin hutun, yana bi ta cikinsu shekara ɗaya bayan ɗaya, don haka hutu yana da ayoyi daban-daban kowace shekara har sai an yi amfani da duk ayoyinsa. A wasu ranakun, kowace shekara tana samun nata ayoyin da ake amfani da su a wannan shekarar (an tsara su da hash na nuni ga kowace aya, shekara, da iri na zaɓi), kuma ayar rana ita ce wadda take a ranar shekara a cikin wannan sauye-sauyen. Bayanan suna da ayoyi sama da 366 ga kowace rana da ake amfani da ita kowace shekara, don haka aya ba ta maimaitawa a cikin shekarar kalanda, tsari yana canzawa kowace shekara, kuma rana ɗaya koyaushe tana ba da aya iri ɗaya. Ana ƙara sabbin ayoyi (tare da `addedIn` ) kuma ana cire tsoffin (tare da `removedIn` ) kawai daga shekarar da ba ta fara ba tukuna, don haka ayar rana don ranar da ta gabata ba ta taɓa canzawa ba.

Shafin [Yarjejeniyar Ayar Rana](./verse-of-the-day-convention.md) yana ƙayyade tsarin aiki mataki-mataki, tare da lambar karya da ƙimar gwaji, don haka zaku iya aiwatar da shi a kowace harshe.

Domin amfani da odar ku, zaɓi iri na kanku (misali, sunan app ɗinku): yana ba da bambanci daban-daban tare da garanti iri ɗaya. Hakanan zaka iya zaɓar daga ayoyin rukuni ɗaya, amma kowane rukuni yana da ayoyi ƙasa da na kwanaki a shekara, don haka ayoyinsa suna maimaitawa da wuri.

SDKs suna bin ƙa'idar:

```ts:no-line-numbers title="verse-of-the-day.js"
import { FreeUseBibleApi } from 'free-use-bible-api';

const api = new FreeUseBibleApi();

// Kwanan wata kamar YYYY-MM-DD, ko Kwanan wata (ana amfani da ranar kalandar gida). An riga an rubuta shi zuwa yau.
const ref = await api.getVerseOfTheDay('2026-01-01');

// Sami rubutun ayar daga fassarar.
const chapter = await api.getTranslationBookChapter('BSB', ref.book, ref.chapter);
const verses = chapter.chapter.content.filter(
    (c) =>
        c.type === 'verse' &&
        c.number >= ref.verse &&
        c.number <= (ref.endVerse ?? ref.verse)
);
console.log(ref, verses);
```

-   `getVerseOfTheDay(date?, { seed?, category?, dataset? }?)` ya sauke jerin baituka da zaɓɓuka daga ciki. Zaɓɓuka `pickVerseOfTheDay(verses, date?, { seed?, category? }?)` daga jerin da ka riga ka mallaka.
-   Kotlin SDK yana da `getVerseOfTheDay(date?, seed?, category?)` da `pickVerseOfTheDay(verses, date?, seed?, category?)` , waɗanda ke ɗaukar kwanan wata a matsayin igiya `YYYY-MM-DD` .
-   Swift SDK yana da `getVerseOfTheDay(date:seed:category:)` da `pickVerseOfTheDay(_:date:seed:category:holidays:)` , waɗanda ke ɗaukar ranar a matsayin igiya `YYYY-MM-DD` ko `Date` (ana amfani da ranar kalanda a yankin lokaci na yanzu).
-   [Sabar MCP](https://github.com/HelloAOLab/bible-api/tree/main/packages/seed-bible-mcp) tana da kayan aiki `getVerseOfTheDay` wanda ke mayar da ayar rana tare da rubutunta.
-   Kunshin `@helloao/tools` yana da jerin iri ɗaya da kuma aiki `getVerseOfTheDay(date?, { seed?, category? }?)` a cikin `@helloao/tools/generation/verse-of-the-day.js` .

### Lasisi

AO Lab ne ya tattara jerin kuma an fitar da shi ƙarƙashin [lasisin MIT](https://github.com/HelloAOLab/bible-api/blob/main/LICENSE) . Rubutun baitin ya fito ne daga kowace fassara da kuka samo daga gare ta.

## Jera Ayoyi a cikin Tsarin Bayanai

`GET https://bible.helloao.org/api/d/{dataset}/verses.json`

Yana samun kowace aya (ko ɗan gajeren bayani) a cikin tarin bayanai, tare da rukunonin da kowannensu ya mallaka, a cikin tsari na canonical. Yana samuwa ne kawai ga tarin bayanai waɗanda ayoyinsu ke da rukuni, kamar `verse-of-the-day` .

-   `dataset` ID na bayanan (misali `verse-of-the-day` ).

### Misalin Lambar

::: code-tabs#lang

@shafin JavaScript

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

### Tsarin gini

```typescript:no-line-numbers title="dataset-verses.ts"
export interface DatasetVerses {
    /**
     * Bayanin bayanai don ayoyin.
     */
    dataset: Dataset;

    /**
     * Kowace aya (ko ɗan gajeren bayani) a cikin bayanan, tare da rukunoninta, a cikin tsari na canonical.
     */
    verses: DatasetCategorizedVerse[];

    /**
     * Hutun da ke da nasu baitoci, tare da kwanakinsu.
     * An cire shi idan bayanan ba su da hutu.
     */
    holidays?: DatasetVersesHoliday[];
}

export interface DatasetVersesHoliday extends DatasetCategoryHoliday {
    /**
     * Shaidar nau'in bikin. misali "kirsimeti".
     */
    id: string;

    /**
     * Sunan hutun Ingilishi. misali "Kirsimeti".
     */
    name: string;
}

export interface DatasetCategoryHoliday {
    /**
     * Watan (1 ga Janairu) da ranar hutu da ke faɗuwa a rana ɗaya kowace shekara.
     * An cire shi don bukukuwan da ranarsu ke canzawa kowace shekara.
     */
    month?: number;
    day?: number;

    /**
     * Kwanakin (YYYY-MM-DD, kalandar Gregorian) na hutu wanda ranarsa ke canzawa kowace shekara, bisa ga tsari.
     * Ana ƙididdige su na tsawon shekaru daban-daban (a halin yanzu daga 2026 zuwa 2125), kuma ana yin bikin ne kawai a ranakun da aka lissafa.
     * An yi watsi da bukukuwan da suka faɗi a rana ɗaya kowace shekara.
     */
    dates?: string[];
}

export interface DatasetCategorizedVerse {
    /**
     * Lambar shaidar littafin. misali "PRO".
     */
    book: string;

    /**
     * Lambar babi.
     */
    chapter: number;

    /**
     * Lambar ayar.
     * Idan `endVerse` yana nan, to wannan ita ce ayar da nassi ya fara a kai.
     */
    verse: number;

    /**
     * Ayar da nassi ya ƙare a kai.
     * An yi watsi da shi idan shigarwar aya ɗaya ce.
     */
    endVerse?: number;

    /**
     * ID na rukunan da ayar ta kunsa, sun fi dacewa da farko.
     */
    categories: string[];

    /**
     * Shekara ta farko da ayar za ta iya zama ayar ranar.
     * An yi watsi da shi idan ayar ta kasance a cikin jerin koyaushe.
     */
    addedIn?: number;

    /**
     * Shekara ta farko da ayar ba za ta iya zama ayar yau ba.
     * Ayoyin da aka cire suna nan a cikin bayanan domin a iya zaɓar ayoyin shekarun baya.
     * An cire ayar idan ba a cire ta daga jerin ba.
     */
    removedIn?: number;
}
```

### Misali

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

## Jera Rukuni a cikin Saitin Bayanai

`GET https://bible.helloao.org/api/d/{dataset}/categories.json`

Yana samun jerin nau'ikan baituka da ake da su don tarin bayanai.

-   `dataset` ID na bayanan (misali `verse-of-the-day` ).

### Misalin Lambar

::: code-tabs#lang

@shafin JavaScript

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

### Tsarin gini

```typescript:no-line-numbers title="dataset-categories.ts"
export interface DatasetCategories {
    /**
     * Bayanin bayanai don rukuni.
     */
    dataset: Dataset;

    /**
     * Jerin nau'ikan baituka da ake da su don tattara bayanai.
     */
    categories: DatasetCategorySummary[];
}

export interface DatasetCategorySummary {
    /**
     * ID na rukunin. misali "bege".
     */
    id: string;

    /**
     * Sunan Ingilishi na rukunin. misali "Hope".
     */
    name: string;

    /**
     * Bayanin abin da ayoyin da ke cikin wannan rukuni suka kunsa.
     */
    description: string;

    /**
     * Adadin ayoyi (ko gajerun sassa) da ke cikin rukunin.
     */
    numberOfVerses: number;

    /**
     * Kwanakin hutun da rukunin ya kasance don (duba DatasetCategoryHoliday a sama).
     * An yi watsi da nau'ikan da ba na hutu ba.
     */
    holiday?: DatasetCategoryHoliday;

    /**
     * Hanyar API don rukunin.
     */
    apiLink: string;
}
```

### Misali

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

## Sami Nau'i daga Tsarin Bayanai

`GET https://bible.helloao.org/api/d/{dataset}/categories/{category}.json`

Yana samun nau'in aya ɗaya, tare da kowace aya da ta ke da ita.

-   `dataset` ID na bayanan (misali `verse-of-the-day` ).
-   `category` shine ID na rukunin (misali `hope` ).

### Misalin Lambar

::: code-tabs#lang

@shafin JavaScript

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

### Tsarin gini

```typescript:no-line-numbers title="dataset-category.ts"
export interface DatasetCategoryResponse {
    /**
     * Bayanin bayanai na rukuni.
     */
    dataset: Dataset;

    /**
     * Nau'in, tare da ayoyin da suka dace da shi.
     */
    category: DatasetCategory;

    /**
     * Haɗin API na wannan rukuni.
     */
    thisCategoryApiLink: string;
}

export interface DatasetCategory {
    /**
     * ID na rukunin. misali "bege".
     */
    id: string;

    /**
     * Sunan Ingilishi na rukunin. misali "Hope".
     */
    name: string;

    /**
     * Bayanin abin da ayoyin da ke cikin wannan rukuni suka kunsa.
     */
    description: string;

    /**
     * Kwanakin hutun da rukunin yake (duba DatasetCategoryHoliday a cikin "Jerin Ayoyi a cikin Dataset").
     * A waɗannan ranakun, ayar ranar tana ɗaya daga cikin ayoyin rukuni, kuma ba a amfani da su a wasu ranakun.
     * An yi watsi da nau'ikan da ba na hutu ba.
     */
    holiday?: DatasetCategoryHoliday;

    /**
     * Ayoyin (ko gajerun sassa) da ke cikin rukunin, a cikin tsari na canonical.
     * Ya haɗa da ayoyi da aka cire daga jerin (duba `removedIn` ).
     */
    verses: DatasetCategoryVerse[];
}

export interface DatasetCategoryVerse {
    /**
     * ID na littafin. misali "JER".
     */
    book: string;

    /**
     * Lambar babi.
     */
    chapter: number;

    /**
     * Lambar ayar.
     * Idan `endVerse` yana nan, to wannan ita ce ayar da nassi ya fara a kai.
     */
    verse: number;

    /**
     * Ayar da nassi ya ƙare a kai.
     * An yi watsi da shi idan ambaton aya ɗaya ce.
     */
    endVerse?: number;

    /**
     * Shekara ta farko da ayar za ta iya zama ayar ranar.
     * An yi watsi da shi idan ayar ta kasance a cikin jerin koyaushe.
     */
    addedIn?: number;

    /**
     * Shekara ta farko da ayar ba za ta iya zama ayar yau ba.
     * Ayoyin da aka cire suna nan a cikin bayanan domin a iya zaɓar ayoyin shekarun baya.
     * An cire ayar idan ba a cire ta daga jerin ba.
     */
    removedIn?: number;
}
```

### Misali

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
