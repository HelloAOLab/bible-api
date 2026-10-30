# የውሂብ ስብስቦች

እንደ ማጣቀሻዎች፣ የመጽሐፍ ቅዱስ አካላት (ሰዎች፣ ቦታዎች፣ ክስተቶች እና የሰዎች ቡድኖች)፣ የመጀመሪያ ቋንቋ ኢንተርሊኒየር ቃላት፣ መዝገበ ቃላት እና የዕለቱ እጩዎች ያሉ ተጨማሪ የመጽሐፍ ቅዱስ መረጃዎችን ለማሰስ የመጨረሻ ነጥቦች - እና መጽሐፎቻቸውን፣ የምዕራፍ ይዘታቸውን፣ አካላቶቻቸውን፣ የመዝገበ ቃላት ግቤቶችን እና የግጥም ምድቦችን ለማግኘት።

## የሚገኙ የውሂብ ስብስቦች

`GET https://bible.helloao.org/api/available_datasets.json`

በኤፒአይ ውስጥ የሚገኙትን የመጽሐፍ ቅዱስ የውሂብ ስብስቦች ዝርዝር ያገኛል።

### የኮድ ምሳሌ

::: code-tabs#ቋንቋ

@tab ጃቫስክሪፕት

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

### መዋቅር

```typescript:no-line-numbers title="available-datasets.ts"
export interface AvailableDatasets {
    /**
     * የውሂብ ስብስቦች ዝርዝር።
     */
    datasets: Dataset[];
}

export interface Dataset {
    /**
     * የውሂብ ስብስቡ መታወቂያ።
     */
    id: string;

    /**
     * የውሂብ ስብስቡ ስም።
     */
    name: string;

    /**
     * የውሂብ ስብስብ ድህረ ገጽ።
     */
    website: string;

    /**
     * የውሂብ ስብስቡ ፈቃድ የሚገኝበት ዩአርኤል።
     */
    licenseUrl: string;

    /**
     * የፈቃዱ ኤፒአይ-የተጨመሩ ማስታወሻዎች።
     * ምንም ማስታወሻዎች ከሌሉ ባዶ ወይም ያልተገለጸ።
     */
    licenseNotes?: string | null;

    /**
     * የውሂብ ስብስብ የእንግሊዝኛ ስም።
     */
    englishName: string;

    /**
     * የውሂብ ስብስቡ በዋናነት የሚገኝበት የISO 639 ባለ 3-ፊደል ቋንቋ መለያ።
     */
    language: string;

    /**
     * ቋንቋው የተጻፈበት አቅጣጫ።
     * "ltr" የሚለው ጽሑፍ ከገጹ ግራ በኩል ወደ ቀኝ የተጻፈ መሆኑን ያመለክታል።
     * "rtl" የሚለው ጽሑፍ የተጻፈው ከገጹ ቀኝ በኩል ወደ ግራ መሆኑን ያመለክታል።
     */
    textDirection: 'ltr' | 'rtl';

    /**
     * ለዚህ የውሂብ ስብስብ የሚገኙ መጽሐፍት ዝርዝር የኤፒአይ አገናኝ።
     */
    listOfBooksApiLink: string;

    /**
     * የሚገኙ የቅርጸቶች ዝርዝር።
     */
    availableFormats: ('json' | 'usfm')[];

    /**
     * በዚህ የውሂብ ስብስብ ውስጥ የተካተቱት የመጽሐፍት ብዛት።
     */
    numberOfBooks: number;

    /**
     * በዚህ የውሂብ ስብስብ ውስጥ የተካተቱት ጠቅላላ የምዕራፎች ብዛት።
     */
    totalNumberOfChapters: number;

    /**
     * በዚህ የውሂብ ስብስብ ውስጥ የተካተቱት ጠቅላላ የጥቅሶች ብዛት።
     */
    totalNumberOfVerses: number;

    /**
     * በዚህ የውሂብ ስብስብ ውስጥ የተካተቱት አጠቃላይ የመስቀለኛ ማጣቀሻዎች ብዛት።
     * 0 ማጣቀሻዎችን ለማያካትቱ የውሂብ ስብስቦች።
     */
    totalNumberOfReferences: number;

    /**
     * በዚህ የውሂብ ስብስብ ውስጥ የተካተቱት የኢንተርሊኒየር ቃላት ጠቅላላ ብዛት።
     * የውሂብ ስብስቡ ኢንተርሊኒየር ቃላትን የማይይዝ ከሆነ ተትቷል።
     */
    totalNumberOfWords?: number;

    /**
     * የውሂብ ስብስቡ የሚገኝበትን ቋንቋ ስም ያገኛል።
     * የቋንቋው ስም የማይታወቅ ከሆነ ባዶ ወይም ያልተገለጸ።
     */
    languageName?: string;

    /**
     * የቋንቋውን ስም በእንግሊዝኛ ያገኛል።
     * ቋንቋው የእንግሊዝኛ ስም ከሌለው ባዶ ወይም ያልተገለጸ።
     */
    languageEnglishName?: string;

    /**
     * በውሂብ ስብስቡ ውስጥ ያሉትን የህጋዊ አካላት ዝርዝሮች የሚያገናኝ የኤፒአይ አገናኞች።
     * የውሂብ ስብስቡ ተዛማጅ አካላትን የማይይዝ ከሆነ ተትቷል።
     */
    listOfPeopleApiLink?: string;
    listOfPlacesApiLink?: string;
    listOfEventsApiLink?: string;
    listOfPeopleGroupsApiLink?: string;

    /**
     * በውሂብ ስብስቡ ውስጥ የተካተቱት ጠቅላላ የህዋሳት ብዛት።
     * የውሂብ ስብስቡ ተዛማጅ አካላትን የማይይዝ ከሆነ ተትቷል።
     */
    totalNumberOfPeople?: number;
    totalNumberOfPlaces?: number;
    totalNumberOfEvents?: number;
    totalNumberOfPeopleGroups?: number;

    /**
     * በውሂብ ስብስቡ ውስጥ የመዝገበ-ቃላት ግቤቶችን ዝርዝር የሚያሳይ የኤፒአይ አገናኝ።
     * የውሂብ ስብስቡ የመዝገበ-ቃላት ግቤቶችን የማይይዝ ከሆነ ተትቷል።
     */
    listOfLexiconApiLink?: string;

    /**
     * በውሂብ ስብስቡ ውስጥ የተካተቱት የመዝገበ ቃላት ግቤቶች ጠቅላላ ብዛት።
     * የውሂብ ስብስቡ የመዝገበ-ቃላት ግቤቶችን የማይይዝ ከሆነ ተትቷል።
     */
    totalNumberOfLexicon?: number;

    /**
     * በውሂብ ስብስቡ ውስጥ ያለውን የእያንዳንዱን ጥቅስ ዝርዝር የሚያሳይ የኤፒአይ አገናኝ፣ ከምድቦቹ ጋር።
     * የውሂብ ስብስቡ ጥቅሶች ምድቦች ከሌላቸው ተትቷል።
     */
    listOfVersesApiLink?: string;

    /**
     * በውሂብ ስብስቡ ውስጥ የቁጥር ምድቦች ዝርዝር የኤፒአይ አገናኝ።
     * የውሂብ ስብስቡ የቁጥር ምድቦችን የማያካትት ከሆነ ተትቷል።
     */
    listOfCategoriesApiLink?: string;

    /**
     * በውሂብ ስብስቡ ውስጥ የተካተቱት የጥቅስ ምድቦች ጠቅላላ ብዛት።
     * የውሂብ ስብስቡ የቁጥር ምድቦችን የማያካትት ከሆነ ተትቷል።
     */
    totalNumberOfCategories?: number;
}
```

### ለምሳሌ

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

## መጽሐፍት በውሂብ ስብስብ ውስጥ ይዘርዝሩ

`GET https://bible.helloao.org/api/d/{dataset}/books.json`

ለተሰጠው የውሂብ ስብስብ የሚገኙ የመጽሐፍት ዝርዝር ያገኛል።

-   `dataset` የውሂብ ስብስብ መታወቂያ (ለምሳሌ `open-cross-ref` )።

### የኮድ ምሳሌ

::: code-tabs#ቋንቋ

@tab ጃቫስክሪፕት

```ts:no-line-numbers title="fetch-dataset-books.js"
const dataset = 'open-cross-ref';

// ለክፍት-መስቀል-ማጣቀሻ የውሂብ ስብስብ የመጽሐፍት ዝርዝር ያግኙ
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

### መዋቅር

```typescript:no-line-numbers title="dataset-books.ts"
export interface DatasetBooks {
    /**
     * ለመጻሕፍቱ የውሂብ ስብስብ መረጃ።
     */
    dataset: Dataset;

    /**
     * ለመረጃ ውሂቡ የሚገኙ የመጽሐፍት ዝርዝር።
     */
    books: DatasetBook[];
}

interface DatasetBook {
    /**
     * የመጽሐፉ መታወቂያ።
     * በመጽሐፍ ቅዱስ ውስጥ ካለው ተጓዳኝ መጽሐፍ (GEN፣ EXO፣ ወዘተ) መታወቂያ ጋር ይዛመዳል።
     */
    id: string;

    /**
     * በመጽሐፍ ቅዱስ ውስጥ የመጽሐፉ ቅደም ተከተል።
     */
    order: number;

    /**
     * በመጽሐፉ ውስጥ የመጀመሪያው ምዕራፍ ቁጥር።
     */
    firstChapterNumber: number;

    /**
     * ወደ መጽሐፉ የመጀመሪያ ምዕራፍ የሚወስድ አገናኝ።
     */
    firstChapterApiLink: string | null;

    /**
     * በመጽሐፉ ውስጥ የመጨረሻው ምዕራፍ ቁጥር።
     */
    lastChapterNumber: number | null;

    /**
     * ወደ መጽሐፉ የመጨረሻ ምዕራፍ የሚወስድ አገናኝ።
     */
    lastChapterApiLink: string | null;

    /**
     * መጽሐፉ የያዘው የምዕራፍ ብዛት።
     */
    numberOfChapters: number;

    /**
     * መጽሐፉ የያዘው የቁጥሮች ብዛት።
     */
    totalNumberOfVerses: number;

    /**
     * ይህ መጽሐፍ የያዘው አጠቃላይ የመስቀለኛ ማጣቀሻዎች ብዛት።
     */
    totalNumberOfReferences: number;
}
```

### ለምሳሌ

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

## ከውሂብ ስብስብ አንድ ምዕራፍ ያግኙ

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

ለአንድ የተወሰነ መጽሐፍ እና የውሂብ ስብስብ የአንድ ምዕራፍ ይዘት ያገኛል።

ለተሻጋሪ ማጣቀሻ የውሂብ ስብስቦች (እንደ `open-cross-ref` ያሉ)፣ ምዕራፉ ለእያንዳንዱ ጥቅስ የመስቀል ማጣቀሻዎችን ዝርዝር ይዟል። ለኢንተርሊኒየር የውሂብ ስብስቦች (እንደ `bsb-interlinear` ያሉ)፣ ምዕራፉ የእያንዳንዱን ጥቅስ የመጀመሪያ ቋንቋ ቃላት ይዟል - [ኢንተርሊኒየር የውሂብ ስብስቦችን](#interlinear-datasets) ይመልከቱ። ለተሻጋሪ አካላት የውሂብ ስብስቦች (እንደ `theographic` ያሉ)፣ ምዕራፉ በምዕራፉ ውስጥ የሚታዩትን ሰዎች፣ ቦታዎች እና ክስተቶችን ይይዛል - [አካላትን በምዕራፍ ያግኙን](#get-the-entities-in-a-chapter) ይመልከቱ። ለ `verse-of-the-day` የውሂብ ስብስቦች፣ ምዕራፉ በምዕራፉ ውስጥ የዕለቱን እጩዎች እና ምድቦቻቸውን ይይዛል - [የዕለቱን ጥቅስ](#verse-of-the-day) ይመልከቱ።

-   `dataset` የውሂብ ስብስብ መታወቂያ (ለምሳሌ `open-cross-ref` )።
-   `book` የመጽሐፉ መለያ ነው (ለምሳሌ `GEN` ለዘፍጥረት)።
-   `chapter` የቁጥር ምዕራፍ ቁጥር ነው (ለምሳሌ ለመጀመሪያው ምዕራፍ `1` )።

### የኮድ ምሳሌ

::: code-tabs#ቋንቋ

@tab ጃቫስክሪፕት

```ts:no-line-numbers title="fetch-dataset-chapter.js"
const dataset = 'open-cross-ref';
const book = 'GEN';
const chapter = 1;

// ዘፍጥረት 1ን ከክፍት-መስቀል-ማጣቀሻ የውሂብ ስብስብ ያግኙ
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

### መዋቅር

```typescript:no-line-numbers title="dataset-chapter.ts"
export interface DatasetBookChapter {
    /**
     * ለመጽሐፉ ምዕራፍ የውሂብ ስብስብ መረጃ።
     */
    dataset: Dataset;

    /**
     * ለመጽሐፉ ምዕራፍ የመጽሐፉ መረጃ።
     */
    book: DatasetBook;

    /**
     * ወደዚህ ምዕራፍ የሚወስድ አገናኝ።
     */
    thisChapterLink: string;

    /**
     * ወደሚቀጥለው ምዕራፍ የሚወስድ አገናኝ።
     * በውሂብ ስብስቡ ውስጥ የመጨረሻው ምዕራፍ ከሆነ ባዶ ነው።
     */
    nextChapterApiLink: string | null;

    /**
     * ወደ ቀዳሚው ምዕራፍ የሚወስድ አገናኝ።
     * በውሂብ ስብስቡ ውስጥ የመጀመሪያው ምዕራፍ ከሆነ ባዶ ነው።
     */
    previousChapterApiLink: string | null;

    /**
     * ምዕራፉ የያዘው የቁጥሮች ብዛት።
     */
    numberOfVerses: number;

    /**
     * ለምዕራፉ የተሰጠው መረጃ።
     */
    chapter: DatasetChapterData;
}

interface DatasetChapterData {
    /**
     * የምዕራፉ ቁጥር።
     */
    number: number;

    /**
     * የምዕራፉ ይዘት።
     */
    content: DatasetVerse[];
}

/**
 * አንድ ጥቅስ `references` (የማጣቀሻ የውሂብ ስብስቦች)፣ `words` (ኢንተርሊኒየር የውሂብ ስብስቦች) ወይም `categories` (የቀኑ የጥቅስ የውሂብ ስብስቦች) ይይዛል።
 * የትኛው በ `'words' in verse` ወይም `'categories' in verse` እንዳለ ያረጋግጡ።
 */
type DatasetVerse =
    | DatasetReferencesVerse
    | DatasetWordsVerse
    | DatasetCategoriesVerse;

interface DatasetReferencesVerse {
    /**
     * የጥቅሱ ቁጥር።
     */
    verse: number;

    /**
     * የጥቅሱን የመስቀል ማጣቀሻዎች።
     *
     * በውጤት፣ ወደ ታች በመውረድ የተደረደረ።
     */
    references: DatasetReference[];
}

interface DatasetWordsVerse {
    /**
     * የጥቅሱ ቁጥር።
     */
    verse: number;

    /**
     * የጥቅሱ የመጀመሪያ ቋንቋ ቃላት፣ በመጀመሪያው ጽሑፍ ቅደም ተከተል።
     * ከታች "ኢንተርላይነር የውሂብ ስብስቦች"ን ይመልከቱ።
     */
    words: InterlinearWord[];
}

interface DatasetCategoriesVerse {
    /**
     * የጥቅሱ ቁጥር።
     * `endVerse` ካለ፣ ይህ ምንባብ የሚጀምረው ጥቅስ ነው።
     */
    verse: number;

    /**
     * አንቀጹ የሚያበቃበት ጥቅስ።
     * ግቤቱ አንድ ጥቅስ ከሆነ ተትቷል።
     */
    endVerse?: number;

    /**
     * ጥቅሱ የሚመለከታቸው የምድቦች መታወቂያዎች፣ በመጀመሪያ በጣም ተገቢ ናቸው።
     * "የቀኑ ጥቅስ" የሚለውን ከታች ይመልከቱ።
     */
    categories: string[];

    /**
     * ጥቅሱ የተጠቀሰው የመጀመሪያው ዓመት የዕለቱ ጥቅስ ሊሆን ይችላል።
     * ጥቅሱ ሁልጊዜ በዝርዝሩ ውስጥ ካለ ተትቷል።
     */
    addedIn?: number;

    /**
     * ጥቅሱ የተፈጸመበት የመጀመሪያው ዓመት የዕለቱ ጥቅስ ሊሆን አይችልም።
     * የተወገዱ ጥቅሶች በውሂብ ስብስቡ ውስጥ ይቀራሉ፣ ስለዚህ የቀደሙት ዓመታት ጥቅሶች አሁንም ሊመረጡ ይችላሉ።
     * ጥቅሱ ከዝርዝሩ ውስጥ ካልተወገደ ተትቷል።
     */
    removedIn?: number;
}

interface DatasetReference {
    /**
     * እየተጠቀሰው ያለው የመጽሐፉ መታወቂያ።
     */
    book: string;

    /**
     * የምዕራፉ ቁጥር።
     */
    chapter: number;

    /**
     * የጥቅሱ ቁጥር።
     * `endVerse` ካለ፣ ይህ ማጣቀሻ የሚጀምረው ጥቅስ ነው።
     */
    verse: number;

    /**
     * ማጣቀሻው የሚያበቃበት ጥቅስ።
     */
    endVerse?: number;

    /**
     * ለማጣቀሻው የተዛማጅነት ነጥብ።
     */
    score?: number;
}

// የኢንተርሊኒየርዎርድን አወቃቀር ለማየት "ኢንተርሊኒየር የውሂብ ስብስቦች" የሚለውን ከታች ይመልከቱ።
```

### ለምሳሌ

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

## አካላት

አንዳንድ የውሂብ ስብስቦች - እንደ [ቲኦግራፊክ የመጽሐፍ ቅዱስ ሜታዳታ](https://github.com/robertrouse/theographic-bible-metadata) የውሂብ ስብስብ ( `theographic` ) ያሉ - አካላትን ይይዛሉ፤ እነሱም ሰዎች፣ ቦታዎች፣ ክስተቶች እና የሰዎች ቡድኖች ናቸው፣ እንዲሁም በእነሱ እና በመጽሐፍ ቅዱስ ጥቅሶች መካከል ያለውን ግንኙነት ይዘዋል።

[የሂስትሪ ግሎብ](https://historyglobe.app) የውሂብ ስብስብ ( `history-globe` ) ቦታዎችን ብቻ ይይዛል፡ በመጽሐፍ ቅዱስ ውስጥ የተጠቀሱትን ቦታዎች፣ መጋጠሚያዎቻቸውን እና የሚጠሯቸውን ጥቅሶች። የቦታ መታወቂያዎቹ (ለምሳሌ ለኢየሩሳሌም `a15257a` ) የሂስትሪ ግሎብ የተረጋጋ የቦታ መታወቂያዎች ናቸው፣ የራሱ [ክፍት የውሂብ ኤፒአይ](https://historyglobe.app/docs/api.html) የሚጠቀማቸው ተመሳሳይ ናቸው፣ ስለዚህ ስም ሲስተካከል አይለወጡም። `featureType` እሴቶቹ የቲኦግራፊክ የውሂብ ስብስብ የሚጠቀማቸውን ይከተላሉ ( `City` ፣ `Region` ፣ `Water` ፣ ወዘተ)፣ እና `featureSubType` አንድ ካለ የበለጠ ልዩ የሆነውን ዓይነት ይይዛል (ለምሳሌ `River` ፣ `Gate` ፣ `Spring` )።

አካላትን የያዙ የውሂብ ስብስቦች በ `/api/available_datasets.json` ውስጥ ባለው ግቤት ውስጥ `listOfPeopleApiLink` ፣ `listOfPlacesApiLink` ፣ `listOfEventsApiLink` እና `listOfPeopleGroupsApiLink` ባህሪያትን ያካትታሉ።

የድርጅት የውሂብ ስብስቦች በምዕራፍ የተጣጣመ መረጃን ይሰጣሉ `/api/d/{dataset}/books.json` ምዕራፎቻቸው የድርጅት መረጃ የያዙ መጻሕፍትን ይዘረዝራል፣ እና `/api/d/{dataset}/{book}/{chapter}.json` በዚያ ምዕራፍ ውስጥ የሚታዩትን ሰዎች፣ ቦታዎች እና ክስተቶች እንዲሁም እያንዳንዳቸው የተጠቀሱባቸውን የቁጥር ቁጥሮች ይመልሳል። [አካላትን በምዕራፍ ውስጥ ያግኙ የሚለውን](#get-the-entities-in-a-chapter) ይመልከቱ።

አካላት የመጽሐፍ ቅዱስ ክፍሎችን እንደ ሌሎቹ የኤፒአይ ክፍሎች ተመሳሳይ የመጽሐፍ መታወቂያዎችን፣ የምዕራፍ ቁጥሮችን እና የቁጥር ቁጥሮችን በመጠቀም ይጠቅሳሉ፣ ስለዚህ ከማንኛውም ትርጉም ጋር ሊጣመሩ ይችላሉ። እርስ በእርሳቸው የሚጣቀሱት የሕጋዊ አካል ማጣቀሻዎችን በመጠቀም ነው፡

```typescript:no-line-numbers title="entity-shared.ts"
export interface DatasetEntityRef {
    /**
     * እየተጠቀሰው ያለው አካል መታወቂያ።
     */
    id: string;

    /**
     * እየተጠቀሰ ያለው አካል አይነት።
     * የአካሉ የኤፒአይ አገናኝ የስብስብ ክፍልን ያዛምዳል፣ ስለዚህ አገናኙ እንደ `/api/d/{dataset}/{type}/{id}.json` ሊገነባ ይችላል።
     */
    type: 'people' | 'places' | 'events' | 'groups';

    /**
     * እየተጠቀሰው ያለው አካል ስም።
     */
    name?: string;

    /**
     * እየተጣቀሰ ላለው አካል የኤፒአይ አገናኝ።
     */
    apiLink?: string;
}

export interface VerseRef {
    /**
     * የመጽሐፉ መለያ (GEN፣ EXO፣ ወዘተ)።
     */
    book: string;

    /**
     * ማጣቀሻው የሚጀምረው የምዕራፍ ቁጥር።
     */
    chapter: number;

    /**
     * ማጣቀሻው የሚጀምረው የጥቅስ ቁጥር።
     */
    verse: number;

    /**
     * ማጣቀሻው የሚያበቃበት ጥቅስ።
     * በተመሳሳይ ምዕራፍ ውስጥ ያሉ ተከታታይ ጥቅሶች ወደ አንድ ማጣቀሻ ተሰባስበው ተደርገዋል።
     */
    endVerse?: number;
}
```

### የታሪክ ግሎብ ባለቤትነት

የሂስትሪ ግሎብ መረጃ በ [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) መሠረት ፈቃድ ተሰጥቶታል። ከተጠቀሙበት፣ የሂስትሪ ግሎብ ( https://historyglobe.app ) እና የOpenBible.info የመጽሐፍ ቅዱስ ጂኦኮዲንግ ዳታ ክሬዲት ይስጡ እና ማንኛውንም ለውጥ ልብ ይበሉ። የውሂብ ስብስቡ `licenseNotes` ባህሪ ክሬዲቱን ይይዛል።

## አካላትን በአንድ ምዕራፍ ውስጥ ያግኙ

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

ለተቋማት የውሂብ ስብስቦች፣ በአንድ ምዕራፍ ውስጥ የሚታዩትን ሰዎች፣ ቦታዎች እና ክስተቶች፣ እያንዳንዳቸው በተጠቀሱበት ምዕራፍ ውስጥ ካሉት የጥቅስ ቁጥሮች ጋር ያገኛል።

-   `dataset` የውሂብ ስብስብ መታወቂያ (ለምሳሌ `theographic` )።
-   `book` የመጽሐፉ መለያ ነው (ለምሳሌ `GEN` ለዘፍጥረት)።
-   `chapter` የቁጥር ምዕራፍ ቁጥር ነው (ለምሳሌ ለመጀመሪያው ምዕራፍ `1` )።

የድርጅት መረጃ ያላቸው የመጽሐፍት እና የምዕራፎች ዝርዝር ከ `GET https://bible.helloao.org/api/d/{dataset}/books.json` ይገኛል፣ ይህም [ከውሂብ ስብስብ መጽሐፍት የመጨረሻ ነጥብ](#list-books-in-a-dataset) ጋር ተመሳሳይ መዋቅርን ይከተላል። ለድርጅት የውሂብ ስብስቦች፣ `totalNumberOfVerses` ቢያንስ በአንድ አካል የተጠቀሱ የቁጥሮች ብዛት ሲሆን `totalNumberOfReferences` ደግሞ የድርጅት-ቁጥር አጠቃላይ የተጠቀሱ የቁጥሮች ብዛት ነው።

### የኮድ ምሳሌ

::: code-tabs#ቋንቋ

@tab ጃቫስክሪፕት

```ts:no-line-numbers title="fetch-chapter-entities.js"
const dataset = 'theographic';
const book = 'GEN';
const chapter = 2;

// በዘፍጥረት 2 ውስጥ የሚታዩትን ሰዎች፣ ቦታዎች እና ክስተቶች ያግኙ
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

### መዋቅር

```typescript:no-line-numbers title="dataset-chapter-entities.ts"
export interface DatasetEntityBookChapter {
    /**
     * ለመጽሐፉ ምዕራፍ የውሂብ ስብስብ መረጃ።
     */
    dataset: Dataset;

    /**
     * ለመጽሐፉ ምዕራፍ የመጽሐፉ መረጃ።
     */
    book: DatasetBook;

    /**
     * የምዕራፉ የህጋዊ አካል ውሂብ።
     */
    chapter: DatasetEntityChapterData;

    /**
     * ወደዚህ ምዕራፍ የሚወስድ አገናኝ።
     */
    thisChapterLink: string;

    /**
     * ወደሚቀጥለው ምዕራፍ የሚወስድ አገናኝ።
     * በውሂብ ስብስቡ ውስጥ የመጨረሻው ምዕራፍ ከሆነ ባዶ ነው።
     */
    nextChapterApiLink: string | null;

    /**
     * ወደ ቀዳሚው ምዕራፍ የሚወስድ አገናኝ።
     * በውሂብ ስብስቡ ውስጥ የመጀመሪያው ምዕራፍ ከሆነ ባዶ ነው።
     */
    previousChapterApiLink: string | null;

    /**
     * በምዕራፉ ውስጥ የሚታዩ የሰዎች፣ የቦታዎች እና የክስተቶች ብዛት።
     */
    numberOfPeople: number;
    numberOfPlaces: number;
    numberOfEvents: number;
}

interface DatasetEntityChapterData {
    /**
     * የምዕራፉ ቁጥር።
     */
    number: number;

    /**
     * በምዕራፉ ውስጥ የሚታዩት ሰዎች።
     * እነሱ በሚታዩበት የመጀመሪያ ጥቅስ ተደርድረዋል።
     */
    people: ChapterPerson[];

    /**
     * በምዕራፉ ውስጥ የሚታዩት ቦታዎች።
     * እነሱ በሚታዩበት የመጀመሪያ ጥቅስ ተደርድረዋል።
     */
    places: ChapterPlace[];

    /**
     * በምዕራፉ ውስጥ የሚታዩት ክስተቶች።
     * እነሱ በሚታዩበት የመጀመሪያ ጥቅስ ተደርድረዋል።
     */
    events: ChapterEvent[];
}

interface ChapterPerson {
    /**
     * የግለሰቡ መታወቂያ።
     */
    id: string;

    /**
     * የግለሰቡ ስም።
     */
    name: string;

    /**
     * የሰውየው ስም ትክክለኛ ስም ይሁን አይሁን።
     */
    isProperName?: boolean;

    /**
     * የግለሰቡ ጾታ።
     */
    gender?: string;

    /**
     * ሰውየው የተወለደበት ዓመት እና የሞተበት ዓመት።
     * አሉታዊ ቁጥሮች ዓ.ዓ. ዓ.ም. ናቸው። አዎንታዊ ቁጥሮች ዓ.ዓ. ዓ.ም. ናቸው።
     */
    birthYear?: number;
    deathYear?: number;

    /**
     * የግለሰቡ የኤፒአይ አገናኝ።
     */
    apiLink: string;

    /**
     * በምዕራፉ ውስጥ ሰውየውን የሚጠቅሱ የጥቅሶች ቁጥሮች።
     * በከፍታ ቅደም ተከተል ተደርድሯል።
     */
    verses: number[];
}

interface ChapterPlace {
    /**
     * የቦታው መታወቂያ።
     */
    id: string;

    /**
     * የቦታው ስም።
     */
    name: string;

    /**
     * ቦታው የሚገኝበት የጂኦግራፊያዊ ገጽታ አይነት።
     */
    featureType?: string;

    /**
     * የቦታው ኬክሮስ እና ኬንትሮስ።
     */
    latitude?: number;
    longitude?: number;

    /**
     * የቦታው የኤፒአይ አገናኝ።
     */
    apiLink: string;

    /**
     * በምዕራፉ ውስጥ ቦታውን የሚጠቅሱ የጥቅሶች ቁጥሮች።
     * በከፍታ ቅደም ተከተል ተደርድሯል።
     */
    verses: number[];
}

interface ChapterEvent {
    /**
     * የክስተቱ መታወቂያ።
     */
    id: string;

    /**
     * የዝግጅቱ ስም።
     */
    name: string;

    /**
     * ዝግጅቱ የተጀመረበት ቀን።
     */
    startDate?: string;

    /**
     * የዝግጅቱ የኤፒአይ አገናኝ።
     */
    apiLink: string;

    /**
     * በምዕራፉ ውስጥ ክስተቱን የሚገልጹ የጥቅሶች ቁጥሮች።
     * በከፍታ ቅደም ተከተል ተደርድሯል።
     */
    verses: number[];
}
```

### ለምሳሌ

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

## ሰዎችን በውሂብ ስብስብ ውስጥ ይዘርዝሩ

`GET https://bible.helloao.org/api/d/{dataset}/people.json`

ለተሰጠው የውሂብ ስብስብ የሚገኙ የሰዎችን ዝርዝር ያገኛል።

-   `dataset` የውሂብ ስብስብ መታወቂያ (ለምሳሌ `theographic` )።

### የኮድ ምሳሌ

::: code-tabs#ቋንቋ

@tab ጃቫስክሪፕት

```ts:no-line-numbers title="fetch-dataset-people.js"
const dataset = 'theographic';

// ለሥነ-መለኮታዊ የውሂብ ስብስብ የሰዎችን ዝርዝር ያግኙ
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

### መዋቅር

```typescript:no-line-numbers title="dataset-people.ts"
export interface DatasetPeople {
    /**
     * ለሰዎች የውሂብ ስብስብ መረጃ።
     */
    dataset: Dataset;

    /**
     * ለመረጃ ውሂቡ የሚገኙ የሰዎች ዝርዝር።
     */
    people: DatasetPersonSummary[];
}

interface DatasetPersonSummary {
    /**
     * የግለሰቡ መታወቂያ።
     */
    id: string;

    /**
     * የግለሰቡ ስም።
     */
    name: string;

    /**
     * የሰውየው ስም ትክክለኛ ስም ይሁን አይሁን።
     */
    isProperName?: boolean;

    /**
     * የግለሰቡ ጾታ።
     */
    gender?: string;

    /**
     * ሰውየውን የሚጠቅሱ የመጽሐፍ ቅዱስ ጥቅሶች ብዛት።
     */
    numberOfReferences: number;

    /**
     * የግለሰቡ የኤፒአይ አገናኝ።
     */
    thisPersonApiLink: string;
}
```

### ለምሳሌ

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

## አንድን ሰው ከውሂብ ስብስብ ያግኙ

`GET https://bible.helloao.org/api/d/{dataset}/people/{person}.json`

ስለ አንድ ሰው መረጃ ያገኛል፣ ይህም ስለ እሱ የሚጠቅሱ የመጽሐፍ ቅዱስ ማጣቀሻዎችን እና ከሌሎች ሰዎች፣ ቦታዎች፣ ክስተቶች እና የሰዎች ቡድኖች ጋር ያላቸውን ግንኙነት ጨምሮ።

-   `dataset` የውሂብ ስብስብ መታወቂያ (ለምሳሌ `theographic` )።
-   `person` የሰውየው መታወቂያ (ለምሳሌ `paul_2479` )።

### የኮድ ምሳሌ

::: code-tabs#ቋንቋ

@tab ጃቫስክሪፕት

```ts:no-line-numbers title="fetch-dataset-person.js"
const dataset = 'theographic';
const person = 'paul_2479';

// ስለ ጳውሎስ ያለውን መረጃ ከሥነ-መለኮታዊ መረጃ ያግኙ
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

### መዋቅር

```typescript:no-line-numbers title="dataset-person.ts"
export interface DatasetPersonResponse {
    /**
     * ለግለሰቡ የውሂብ ስብስብ መረጃ።
     */
    dataset: Dataset;

    /**
     * ስለ ግለሰቡ መረጃ።
     */
    person: DatasetPerson;

    /**
     * የዚህ ሰው የኤፒአይ አገናኝ።
     */
    thisPersonApiLink: string;
}

interface DatasetPerson {
    /**
     * የግለሰቡ መታወቂያ።
     */
    id: string;

    /**
     * የግለሰቡ ስም።
     */
    name: string;

    /**
     * ግለሰቡ የሚጠራባቸው ሌሎች ስሞች።
     */
    alsoCalled?: string[];

    /**
     * የሰውየው ስም ትክክለኛ ስም ይሁን አይሁን።
     */
    isProperName?: boolean;

    /**
     * የግለሰቡ ጾታ።
     */
    gender?: string;

    /**
     * የሰውየው መግለጫ። እያንዳንዱ ሕብረቁምፊ አንቀጽ ነው።
     */
    description?: string[];

    /**
     * ሰውየው የተወለደበት ዓመት እና የሞተበት ዓመት።
     * አሉታዊ ቁጥሮች ዓ.ዓ. ዓ.ም. ናቸው። አዎንታዊ ቁጥሮች ዓ.ዓ. ዓ.ም. ናቸው።
     */
    birthYear?: number;
    deathYear?: number;

    /**
     * ግለሰቡ የተጠቀሰው የመጀመሪያዎቹ እና የቅርብ ጊዜዎቹ ዓመታት።
     */
    minYear?: number;
    maxYear?: number;

    /**
     * ሰውየው የተወለደበትና የሞተበት ቦታ።
     */
    birthPlace?: DatasetEntityRef;
    deathPlace?: DatasetEntityRef;

    /**
     * የግለሰቡ የቤተሰብ ግንኙነት።
     */
    father?: DatasetEntityRef[];
    mother?: DatasetEntityRef[];
    partners?: DatasetEntityRef[];
    children?: DatasetEntityRef[];
    siblings?: DatasetEntityRef[];
    halfSiblingsSameMother?: DatasetEntityRef[];
    halfSiblingsSameFather?: DatasetEntityRef[];

    /**
     * ግለሰቡ አባል የሆነባቸው የሰዎች ቡድኖች።
     */
    memberOf?: DatasetEntityRef[];

    /**
     * ግለሰቡ የተሳተፈባቸው ዝግጅቶች።
     */
    events?: DatasetEntityRef[];

    /**
     * ሰውየውን የሚጠቅሱ የመጽሐፍ ቅዱስ ጥቅሶች ዝርዝር።
     * በመጽሐፍ ቅደም ተከተል፣ ምዕራፍ እና ቁጥር ተደርድሯል።
     */
    references: VerseRef[];
}
```

### ለምሳሌ

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

## በውሂብ ስብስብ ውስጥ ቦታዎችን ዘርዝር

`GET https://bible.helloao.org/api/d/{dataset}/places.json`

ለተሰጠው የውሂብ ስብስብ የሚገኙ የቦታዎች ዝርዝር ያገኛል።

-   `dataset` የውሂብ ስብስብ መታወቂያ (ለምሳሌ `theographic` )።

### መዋቅር

```typescript:no-line-numbers title="dataset-places.ts"
export interface DatasetPlaces {
    /**
     * የቦታዎቹ የውሂብ ስብስብ መረጃ።
     */
    dataset: Dataset;

    /**
     * ለመረጃ ውሂቡ የሚገኙ የቦታዎች ዝርዝር።
     */
    places: DatasetPlaceSummary[];
}

interface DatasetPlaceSummary {
    /**
     * የቦታው መታወቂያ።
     */
    id: string;

    /**
     * የቦታው ስም።
     */
    name: string;

    /**
     * ቦታው የሚገኝበት የጂኦግራፊያዊ ገጽታ አይነት።
     * ለምሳሌ፣ "ከተማ"፣ "ክልል"፣ "ተራራ"፣ "ውሃ"፣ ወዘተ.
     */
    featureType?: string;

    /**
     * የቦታው ኬክሮስ እና ኬንትሮስ።
     */
    latitude?: number;
    longitude?: number;

    /**
     * ቦታውን የሚጠቅሱ የመጽሐፍ ቅዱስ ማጣቀሻዎች ብዛት።
     */
    numberOfReferences: number;

    /**
     * የቦታው የኤፒአይ አገናኝ።
     */
    thisPlaceApiLink: string;
}
```

## ከውሂብ ስብስብ ቦታ ያግኙ

`GET https://bible.helloao.org/api/d/{dataset}/places/{place}.json`

ስለ አንድ ቦታ፣ ስለ እሱ እና ስለ ተዛማጅ ሰዎች እና ክስተቶች የሚጠቅሱ የመጽሐፍ ቅዱስ ማጣቀሻዎችን ጨምሮ፣ ስለ አንድ ቦታ መረጃ ያገኛል።

-   `dataset` የውሂብ ስብስብ መታወቂያ (ለምሳሌ `theographic` )።
-   `place` የቦታው መታወቂያ (ለምሳሌ `jerusalem_636` )።

### መዋቅር

```typescript:no-line-numbers title="dataset-place.ts"
export interface DatasetPlaceResponse {
    /**
     * የቦታው የውሂብ ስብስብ መረጃ።
     */
    dataset: Dataset;

    /**
     * ስለ ቦታው መረጃ።
     */
    place: DatasetPlace;

    /**
     * የዚህ ቦታ የኤፒአይ አገናኝ።
     */
    thisPlaceApiLink: string;
}

interface DatasetPlace {
    /**
     * የቦታው መታወቂያ።
     */
    id: string;

    /**
     * የቦታው ስም።
     */
    name: string;

    /**
     * የቦታው ስም በኪንግ ጄምስ ቨርዥን እና በእንግሊዝኛ መደበኛ ቨርዥን ላይ እንደሚታየው።
     */
    kjvName?: string;
    esvName?: string;

    /**
     * ቦታው የሚጠራባቸው ሌሎች ስሞች።
     */
    aliases?: string[];

    /**
     * ቦታው የሚገኝበት የጂኦግራፊያዊ ገጽታ አይነት።
     */
    featureType?: string;
    featureSubType?: string;

    /**
     * የቦታው ኬክሮስና ኬንትሮስ፣ እና ምን ያህል ትክክለኛ እንደሆኑ።
     */
    latitude?: number;
    longitude?: number;
    precision?: string;

    /**
     * የቦታው መግለጫ። እያንዳንዱ ሕብረቁምፊ አንቀጽ ነው።
     */
    description?: string[];

    /**
     * የውሂብ ስብስብ ደራሲዎች ስለ ቦታው የሰጡት አስተያየት።
     */
    comment?: string;

    /**
     * የዚህ ቦታ መነሻ ቦታ።
     * ለተመሳሳይ ጂኦግራፊያዊ አቀማመጥ የተለያዩ ስሞች ተመሳሳይ የስር ቦታ አላቸው።
     */
    rootPlace?: DatasetEntityRef;

    /**
     * ይህ ቦታ የተባዛ ቦታ ነው።
     */
    duplicateOf?: DatasetEntityRef;

    /**
     * በቦታው የነበሩ፣ የተወለዱ ወይም የሞቱ ሰዎች በቦታው ነበሩ።
     */
    people?: DatasetEntityRef[];
    peopleBorn?: DatasetEntityRef[];
    peopleDied?: DatasetEntityRef[];

    /**
     * በቦታው የተከሰቱ ክስተቶች።
     */
    events?: DatasetEntityRef[];

    /**
     * ቦታውን የሚጠቅሱ የመጽሐፍ ቅዱስ ማጣቀሻዎች ዝርዝር።
     * በመጽሐፍ ቅደም ተከተል፣ ምዕራፍ እና ቁጥር ተደርድሯል።
     */
    references: VerseRef[];
}
```

### ለምሳሌ

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

## በውሂብ ስብስብ ውስጥ ያሉ ክስተቶችን ዘርዝር

`GET https://bible.helloao.org/api/d/{dataset}/events.json`

ለተሰጠው የውሂብ ስብስብ የሚገኙ የክስተቶች ዝርዝር ያገኛል።

-   `dataset` የውሂብ ስብስብ መታወቂያ (ለምሳሌ `theographic` )።

### መዋቅር

```typescript:no-line-numbers title="dataset-events.ts"
export interface DatasetEvents {
    /**
     * ለክስተቶቹ የውሂብ ስብስብ መረጃ።
     */
    dataset: Dataset;

    /**
     * በውሂብ ስብስቡ ውስጥ የሚገኙ የክስተቶች ዝርዝር።
     */
    events: DatasetEventSummary[];
}

interface DatasetEventSummary {
    /**
     * የክስተቱ መታወቂያ።
     */
    id: string;

    /**
     * የዝግጅቱ ስም።
     */
    name: string;

    /**
     * ዝግጅቱ የተጀመረበት ቀን።
     * አሉታዊ ቁጥሮች ዓ.ዓ. ዓ.ም. ናቸው። አዎንታዊ ቁጥሮች ዓ.ዓ. ዓ.ም. ናቸው።
     * ይበልጥ የተወሰኑ ቀናት የ `YYYY-MM-DD` ቅርጸትን ይጠቀማሉ።
     */
    startDate?: string;

    /**
     * ክስተቱን የሚገልጹ የመጽሐፍ ቅዱስ ማጣቀሻዎች ብዛት።
     */
    numberOfReferences: number;

    /**
     * የዝግጅቱ የኤፒአይ አገናኝ።
     */
    thisEventApiLink: string;
}
```

## ከውሂብ ስብስብ አንድ ክስተት ያግኙ

`GET https://bible.helloao.org/api/d/{dataset}/events/{event}.json`

ስለ አንድ ክስተት መረጃ ያገኛል፣ ይህም ስለ እሱ እና ስለ ተዛማጅ ሰዎች፣ ቦታዎች እና የሰዎች ቡድኖች የሚገልጹ የመጽሐፍ ቅዱስ ማጣቀሻዎችን ጨምሮ።

-   `dataset` የውሂብ ስብስብ መታወቂያ (ለምሳሌ `theographic` )።
-   `event` የክስተቱ መታወቂያ (ለምሳሌ `saul-is-converted_326` )።

### መዋቅር

```typescript:no-line-numbers title="dataset-event.ts"
export interface DatasetEventResponse {
    /**
     * ለክስተቱ የውሂብ ስብስብ መረጃ።
     */
    dataset: Dataset;

    /**
     * ስለ ዝግጅቱ መረጃ።
     */
    event: DatasetEvent;

    /**
     * የዚህ ክስተት የኤፒአይ አገናኝ።
     */
    thisEventApiLink: string;
}

interface DatasetEvent {
    /**
     * የክስተቱ መታወቂያ።
     */
    id: string;

    /**
     * የዝግጅቱ ስም።
     */
    name: string;

    /**
     * ዝግጅቱ የተጀመረበት ቀን።
     */
    startDate?: string;

    /**
     * የዝግጅቱ ቆይታ።
     * ለምሳሌ፣ "1D" አንድ ቀን ሲሆን "40Y" ደግሞ አርባ ዓመት ነው።
     */
    duration?: string;

    /**
     * በዝግጅቱ ላይ የተሳተፉ ሰዎች።
     */
    participants?: DatasetEntityRef[];

    /**
     * ዝግጅቱ የተከናወነባቸው ቦታዎች።
     */
    locations?: DatasetEntityRef[];

    /**
     * በዝግጅቱ ላይ የተሳተፉት የሰዎች ቡድኖች።
     */
    groups?: DatasetEntityRef[];

    /**
     * ይህ ክስተት አካል የሆነበት ክስተት።
     */
    partOf?: DatasetEntityRef;

    /**
     * ከዚህ ክስተት በፊት የተከሰተው ክስተት።
     */
    predecessor?: DatasetEntityRef;

    /**
     * ክስተቱን የሚገልጹ የመጽሐፍ ቅዱስ ማጣቀሻዎች ዝርዝር።
     * በመጽሐፍ ቅደም ተከተል፣ ምዕራፍ እና ቁጥር ተደርድሯል።
     */
    references: VerseRef[];
}
```

### ለምሳሌ

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

## የሰዎች ቡድኖችን በውሂብ ስብስብ ውስጥ ይዘርዝሩ

`GET https://bible.helloao.org/api/d/{dataset}/groups.json`

ለተሰጠው የውሂብ ስብስብ የሚገኙ የሰዎች ቡድኖችን ዝርዝር ያገኛል።

-   `dataset` የውሂብ ስብስብ መታወቂያ (ለምሳሌ `theographic` )።

### መዋቅር

```typescript:no-line-numbers title="dataset-people-groups.ts"
export interface DatasetPeopleGroups {
    /**
     * ለሕዝብ ቡድኖች የውሂብ ስብስብ መረጃ።
     */
    dataset: Dataset;

    /**
     * ለመረጃ ውሂቡ የሚገኙ የሰዎች ቡድኖች ዝርዝር።
     */
    groups: DatasetPeopleGroupSummary[];
}

interface DatasetPeopleGroupSummary {
    /**
     * የሰዎች ቡድን መታወቂያ።
     */
    id: string;

    /**
     * የሰዎች ቡድን ስም።
     */
    name: string;

    /**
     * የሰዎች ቡድን አባላት የሆኑ ሰዎች ብዛት።
     */
    numberOfMembers: number;

    /**
     * የሰዎች ቡድን የኤፒአይ አገናኝ።
     */
    thisPeopleGroupApiLink: string;
}
```

## የሰዎች ቡድንን ከውሂብ ስብስብ ያግኙ

`GET https://bible.helloao.org/api/d/{dataset}/groups/{group}.json`

ስለ አንድ ነጠላ የሰዎች ቡድን መረጃ ያገኛል፣ ይህም አባላቱን እና ቡድኑ የተሳተፈባቸውን ዝግጅቶችን ያካትታል።

-   `dataset` የውሂብ ስብስብ መታወቂያ (ለምሳሌ `theographic` )።
-   `group` የሰዎች ቡድን መታወቂያ (ለምሳሌ `tribe-of-benjamin` )።

### መዋቅር

```typescript:no-line-numbers title="dataset-people-group.ts"
export interface DatasetPeopleGroupResponse {
    /**
     * ለሕዝብ ቡድን የውሂብ ስብስብ መረጃ።
     */
    dataset: Dataset;

    /**
     * ስለ ሰዎች ቡድን መረጃ።
     */
    group: DatasetPeopleGroup;

    /**
     * የዚህ የሰዎች ቡድን የኤፒአይ አገናኝ።
     */
    thisPeopleGroupApiLink: string;
}

interface DatasetPeopleGroup {
    /**
     * የሰዎች ቡድን መታወቂያ።
     */
    id: string;

    /**
     * የሰዎች ቡድን ስም።
     */
    name: string;

    /**
     * የሰዎች ቡድን አባላት የሆኑ ሰዎች።
     */
    members?: DatasetEntityRef[];

    /**
     * የሰዎች ቡድን የተሳተፈባቸው ዝግጅቶች።
     */
    events?: DatasetEntityRef[];

    /**
     * የሰዎችን ቡድን የሚጠቅሱ የመጽሐፍ ቅዱስ ማጣቀሻዎች ዝርዝር።
     * በመጽሐፍ ቅደም ተከተል፣ ምዕራፍ እና ቁጥር ተደርድሯል።
     */
    references: VerseRef[];
}
```

### ለምሳሌ

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

## ኢንተርሊኒየር የውሂብ ስብስቦች

የቤሪያን ኢንተርሊኒየር የውሂብ ስብስብ ( `bsb-interlinear` ) በመጽሐፍ ቅዱስ ውስጥ በእያንዳንዱ ጥቅስ ውስጥ የሚገኙትን የመጀመሪያ ቋንቋ (ዕብራይስጥ፣ አራማይክ እና ግሪክ) ቃላትን በመጀመሪያው ጽሑፍ ውስጥ በተቀመጡበት ቅደም ተከተል ይዘረዝራል። እያንዳንዱ ቃል የራሱ የሆነ የቋንቋ ፊደል አጻጻፍ፣ ሰዋሰዋዊ ትንተና፣ [የስትሮንግ ቁጥር](https://en.wikipedia.org/wiki/Strong%27s_Concordance) እና [የቤሪያን መደበኛ መጽሐፍ ቅዱስ](https://berean.bible) የሚጠቀምበት የእንግሊዝኛ ሐረግ አለው።

የውሂብ ስብስቡ ከሌሎች የውሂብ ስብስቦች ጋር ተመሳሳይ የመጨረሻ ነጥቦችን ይጠቀማል፦

-   `GET https://bible.helloao.org/api/d/bsb-interlinear/books.json` 66ቱን መጻሕፍት ይዘረዝራል።
-   `GET https://bible.helloao.org/api/d/bsb-interlinear/{book}/{chapter}.json` (ለምሳሌ `/api/d/bsb-interlinear/GEN/1.json` ) ምዕራፉን ይመልሳል፣ ለእያንዳንዱ ጥቅስ `{ verse, words }` አለው። ምላሹ [የውሂብ ስብስብ ምዕራፍ](#get-a-chapter-from-a-dataset) ነው።

የቃላት መረጃው የመጣው [ከቤሪያን መደበኛ የመጽሐፍ ቅዱስ ኢንተርሊኒየር ሰንጠረዦች](https://bereanbible.com/) ሲሆን እነዚህም በሕዝብ ጎራ ውስጥ ይገኛሉ። የስትሮንግ የቃላት ቁጥሮች [በመዝገበ](#lexicon) ቃላት ውስጥ ተፈልገዋል ( `stepbible-lexicon` )።

### መዋቅር

```typescript:no-line-numbers title="interlinear-word.ts"
interface InterlinearWord {
    /**
     * በመጀመሪያው ጽሑፍ ቅደም ተከተል ውስጥ የቃሉ 1-ተኮር ደረጃ።
     * ቃላት በዚህ ቅደም ተከተል ተዘርዝረዋል።
     */
    pos: number;

    /**
     * በቤሪያን መደበኛ መጽሐፍ ቅዱስ የእንግሊዝኛ ቅደም ተከተል ውስጥ የቃሉ 1-ተኮር ደረጃ።
     */
    bsbPos: number;

    /**
     * የቃሉ ቋንቋ።
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * በመጀመሪያው ስክሪፕት ውስጥ ያለው ቃል። NFC-መደበኛ።
     */
    text: string;

    /**
     * የቃሉ በቋንቋ ፊደል መጻፍ።
     */
    transliteration: string | null;

    /**
     * የቃሉ አጭር ሰዋሰዋዊ የመተንተን ኮድ። ለምሳሌ "N-mp" ወይም "V-Qal-Perf-3ms"።
     */
    parsing: string | null;

    /**
     * የቃሉ የተፃፈ ሰዋሰዋዊ አተረጓጎም።
     */
    parsingFull: string | null;

    /**
     * የዜሮ-ፓድድ ያለው የስትሮንግ የቃሉ ቁጥር። ለምሳሌ "H0430" ወይም "G3056"።
     * ዜሮ-ፓድድድድ፣ ይህም ከKJV `.words.json` እሴቶች ጋር የሚዛመድ።
     * የሌሎች ትርጉሞች እሴቶች ከመቀላቀልዎ በፊት ዜሮ-ፓዲንግ እና ቅጥያ ማስወገድ ሊያስፈልጋቸው ይችላል።
     * ምንጩ የኖ ስትሮንግ ቁጥር የሚለውን ቃል ሲሰጥ ባዶ ነው (ይህ እንደ ተውላጠ ስም ቅጥያዎች ያሉ ቅጥያዎች ለሆኑ አንዳንድ ቃላት ሁኔታ ነው)።
     */
    strongs: string | null;

    /**
     * የቤሪያን መደበኛ መጽሐፍ ቅዱስ ለቃሉ የእንግሊዝኛ ሐረግ።
     * ቢኤስቢ (BSB) የሚለው ቃል ሳይተረጎም ሲተው ባዶ ነው (እንደ የዕብራይስጥ ቀጥተኛ ነገር ማርከር)።
     */
    gloss: string | null;
}
```

### ለምሳሌ

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

### ቃላትን ከትርጉሞች ጋር ማገናኘት

`H0430` `strongs` `strongs` `H430` `/api/eng_kjv/{book}/{chapter}.words.json` `H1961a` `H0430` `H1961`

-   **ኪጄቪ።** ለኪንግ ጀምስ ስሪት ( `eng_kjv` እና `eng_kja` )፣ የስትሮንግን ቁጥሮች በምዕራፍ `.words.json` ፋይል ውስጥ ከተመሳሳይ ቁጥር `strongs` የኢንተርላይነር ቃላት ጋር ያዋህዱ። ለምሳሌ፣ በቁጥር 1 ( `H7225` ፣ `H1254` ፣ `H0430` ፣ `H0853` ፣ `H8064` ፣ `H0776` ) በ `/api/eng_kjv/GEN/1.words.json` ውስጥ የተገለጹት የእያንዳንዱ የስትሮንግ ቁጥር በ `/api/d/bsb-interlinear/GEN/1.json` ቁጥር 1 ቃላት መካከል `strongs` እሴት ሆኖ ይታያል።
-   **የቤሪያን መደበኛ መጽሐፍ ቅዱስ።** የእያንዳንዱ ቃል `gloss` የዚያ ቃል የቢኤስቢ ሐረግ ነው። የጥቅሱን ቃላት `bsbPos` ቅደም ተከተል ተከተሉ እና እያንዳንዱን `gloss` ከቢኤስቢ ትርጉም የጥቅስ ጽሑፍ ጋር በማዛመድ የቃሉ ትርጉም የት እንደሚገኝ ያግኙ።

የሁለቱ ምንጮች ቁጥር ሁልጊዜ አይስማማም። ለምሳሌ፣ የKJV መለያዎች "ነበር" `G2258` ሲሆኑ የቤሪያን ሰንጠረዥ `G1510` አለው። እንደዚህ ባሉ ልዩነቶች ምክንያት ጥቂቶች ይቀላቀላሉ።

### ባለቤትነት

የቤሪያን ኢንተርሊኒየር ሰንጠረዦች በሕዝብ ጎራ ውስጥ ናቸው። [መዝገበ ቃላቱ](#lexicon) በCC BY 4.0 መሠረት ፈቃድ የተሰጠው ሲሆን እውቅና መስጠትን ይጠይቃል።

## መዝገበ ቃላት

የSTEPBible መዝገበ ቃላት ስብስብ ( `stepbible-lexicon` ) ከ [STEPBible.org](https://www.stepbible.org/) በቲንዴል ሃውስ፣ ካምብሪጅ ከተገኘ የዕብራይስጥ፣ የአራማይክ እና የግሪክ አጫጭር መዝገበ ቃላት (TBESH እና TBESG) ይዟል። ለእያንዳንዱ የስትሮንግ መሰረታዊ ቁጥር አንድ ግቤት አለው፣ እና እያንዳንዱ ግቤት ሌማ፣ በቋንቋ ፊደል መጻፍ፣ የንግግር ክፍል፣ የእንግሊዝኛ ግሎስ እና ፍቺ ያለው አንድ ወይም ከዚያ በላይ ስሜቶች አሉት።

የመዝገበ-ቃላት ግቤት ካለው [ኢንተርሊኒየር ቃል](#interlinear-datasets) የሚገኝ ማንኛውም ዜሮ-ፓድድድድ `strongs` እሴት ያለ ማሻሻያ ወደ `/api/d/stepbible-lexicon/lexicon/{strongs}.json` ሊፈለግ ይችላል። ለKJV `.words.json` እሴቶችም ተመሳሳይ ነው፤ የሌሎች ትርጉሞች እሴቶች መጀመሪያ ዜሮ-ፓድዲንግ እና ቅጥያ ማስወገድ ሊያስፈልጋቸው ይችላል። መዝገበ-ቃላቱ ያለ Strong ቁጥር የሚያክላቸው የግሪክ ግቤቶች አይታተሙም።

የመዝገበ-ቃላት ግቤቶችን የያዙ የውሂብ ስብስቦች በ `/api/available_datasets.json` ውስጥ ባለው ግባቸው ውስጥ `listOfLexiconApiLink` እና `totalNumberOfLexicon` ያካትታሉ።

### ባለቤትነት

የመዝገበ-ቃላት መረጃው በ [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) መሠረት ፈቃድ ተሰጥቶታል። ከተጠቀሙበት፣ STEBIble.org/Tyndale House፣ Cambridgeን በክሬዲት ያግኙ እና ማንኛውንም ለውጥ ልብ ይበሉ። የውሂብ ስብስቡ `licenseNotes` ባህሪ ክሬዲቱን ይይዛል።

## በውሂብ ስብስብ ውስጥ የመዝገበ-ቃላት ግቤቶችን ዘርዝር

`GET https://bible.helloao.org/api/d/{dataset}/lexicon.json`

ለመረጃ ስብስብ የሚገኙ የመዝገበ-ቃላት ግቤቶችን ዝርዝር ያገኛል።

-   `dataset` የውሂብ ስብስብ መታወቂያ (ለምሳሌ `stepbible-lexicon` )።

### የኮድ ምሳሌ

::: code-tabs#ቋንቋ

@tab ጃቫስክሪፕት

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

### መዋቅር

```typescript:no-line-numbers title="dataset-lexicon.ts"
export interface DatasetLexicon {
    /**
     * የመዝገበ-ቃላቱ የውሂብ ስብስብ መረጃ።
     */
    dataset: Dataset;

    /**
     * ለመረጃ ውሂቡ የሚገኙ የመዝገበ ቃላት ግቤቶች ዝርዝር።
     */
    lexicon: DatasetLexiconEntrySummary[];
}

export interface DatasetLexiconEntrySummary {
    /**
     * የመዝገበ-ቃላት ግቤት ዜሮ-ፓድድ የሆነው የስትሮንግ ቁጥር። ለምሳሌ "H0430"።
     */
    id: string;

    /**
     * የመዝገበ-ቃላት ግቤት ቋንቋ።
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * የመዝገበ-ቃላት ግቤት ስም።
     * ይህ የመግቢያው የመጀመሪያ ስሜት መግለጫ ነው።
     */
    name: string;

    /**
     * የመዝገበ-ቃላት ግቤት የኤፒአይ አገናኝ።
     */
    apiLink: string;
}
```

### ለምሳሌ

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

## ከውሂብ ስብስብ የመዝገበ-ቃላት ግቤት ያግኙ

`GET https://bible.helloao.org/api/d/{dataset}/lexicon/{strongs}.json`

የአንድ ነጠላ ቤዝ የስትሮንግ ቁጥር የመዝገበ-ቃላት ግቤትን ከሁሉም የስሜት ህዋሳቱ ጋር ያገኛል።

-   `dataset` የውሂብ ስብስብ መታወቂያ (ለምሳሌ `stepbible-lexicon` )።
-   `strongs` የስትሮንግ ዜሮ-ሽፋን ያለው ቁጥር ነው (ለምሳሌ _elohim_ ለሚለው የዕብራይስጥ ቃል `H0430` ፣ ወይም _logos_ ለሚለው የግሪክ ቃል `G3056` )።

### የኮድ ምሳሌ

::: code-tabs#ቋንቋ

@tab ጃቫስክሪፕት

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

### መዋቅር

```typescript:no-line-numbers title="dataset-lexicon-entry.ts"
export interface DatasetLexiconEntry {
    /**
     * የመዝገበ-ቃላት ግቤት የውሂብ ስብስብ መረጃ።
     */
    dataset: Dataset;

    /**
     * የመዝገበ-ቃላት ግቤት።
     */
    entry: DatasetLexiconEntryContent;

    /**
     * የዚህ መዝገበ-ቃላት ግቤት የኤፒአይ አገናኝ።
     */
    thisLexiconEntryApiLink: string;
}

export interface DatasetLexiconEntryContent {
    /**
     * የዜሮ-ፓድድ የሆነው የስትሮንግ የመግቢያ ቁጥር። ለምሳሌ "H0430"።
     */
    id: string;

    /**
     * የመግቢያው ቋንቋ።
     * ይህ የመግቢያው የመጀመሪያ ስሜት ቋንቋ ነው።
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * የመግቢያው ስሜቶች፣ በመታወቂያ ቅደም ተከተል።
     */
    senses: DatasetLexiconSense[];
}

export interface DatasetLexiconSense {
    /**
     * የስሜቱ የተራዘመ መታወቂያ። ለምሳሌ "H0001G"።
     * ቁጥሩ አንድ ነጠላ ስሜት ሲኖረው ከመሠረታዊው የስትሮንግ ቁጥር ጋር እኩል ነው።
     */
    id: string;

    /**
     * የስሜቱ ቋንቋ።
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * በመጀመሪያው ጽሑፍ ውስጥ ያለው የስሜት ህዋሳት ሌማ።
     */
    lemma: string;

    /**
     * የሊማው በቋንቋ ፊደል መጻፍ።
     */
    transliteration: string | null;

    /**
     * የንግግር (ሞርፎሎጂ) የስሜት ህዋሱ ኮድ ክፍል።
     */
    partOfSpeech: string | null;

    /**
     * የእንግሊዝኛው የስሜት ህዋሳት አጭር አንጸባራቂ።
     */
    gloss: string | null;

    /**
     * የስሜቱ ፍቺ እንደ ተራ ጽሑፍ።
     * አንቀጾች በባዶ መስመሮች ይለያያሉ። በምንጩ ላይ ያለው ምልክት ተወግዷል።
     */
    definition: string;
}
```

### ለምሳሌ

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

## የዕለቱ ጥቅስ

የዕለቱ የውሂብ ስብስብ ( `verse-of-the-day` ) ለ"የዕለቱ ጥቅስ" ጥሩ እጩ የሚሆኑ የታወቁ ጥቅሶችን እና አጫጭር ምንባቦችን (ቢበዛ ሶስት) የያዘ ዝርዝር ነው፡- በዓመቱ ውስጥ ለእያንዳንዱ ቀን ከ640 በላይ እና ለክርስቲያናዊ በዓላት ከ100 በላይ። እያንዳንዱ በራሱ ትርጉም ይሰጣል።

ለእያንዳንዱ ቀን የሚሆን እያንዳንዱ ጥቅስ ከአንድ እስከ ሶስት ምድቦች አሉት፣ ከእነዚህ ቋሚ ስብስቦች ውስጥ በጣም አስፈላጊው በመጀመሪያ ደረጃ፡

| መታወቂያ         | መግለጫ                                               |
| ------------- | -------------------------------------------------- |
| `comfort`     | የእግዚአብሔር ቅርብነት እና እንክብካቤ በሀዘን፣ በችግር እና በብቸኝነት ውስጥ። |
| `courage`     | ጸንቶ መቆም እና መፍራት የለበትም።                             |
| `faith`       | በእግዚአብሔርና በገባው ቃል ኪዳን መታመን።                        |
| `forgiveness` | የእግዚአብሔር የኃጢአት ይቅርታ እና ሌሎችን ይቅር ማለት።               |
| `gratitude`   | ለእግዚአብሔር ምስጋና ማቅረብ።                                |
| `guidance`    | እግዚአብሔር እርምጃዎቻችንን፣ ዕቅዶቻችንን እና ውሳኔዎቻችንን ይመራል።       |
| `hope`        | እግዚአብሔር ቃል የገባልን የወደፊት ተስፋ ላይ እምነት።                |
| `inspiration` | እምነትን በመጠበቅና መልካም በማድረግ ላይ መበረታታት።                 |
| `joy`         | በእግዚአብሔር መደሰትና ሐሴት ማድረግ።                           |
| `love`        | እግዚአብሔር ለእኛ ያለው ፍቅር እና ለእግዚአብሔር እና ለሌሎች ያለን ፍቅር።   |
| `peace`       | እረፍት፣ ጸጥታ እና ከጭንቀት ነፃ መሆን።                         |
| `praise`      | የእግዚአብሔር ታላቅነት አምልኮና መግለጫዎች።                       |
| `prayer`      | እግዚአብሔርንና ቃሉን ለመስማት መጥራት።                          |
| `provision`   | እግዚአብሔር የሚያስፈልገንን ያሟላልን።                           |
| `salvation`   | በክርስቶስ የሚገኝ ቤዛነት፣ ጸጋ እና አዲስ ሕይወት።                  |
| `strength`    | እግዚአብሔር ብርታትንና ትዕግስትን ይሰጣል።                        |
| `wisdom`      | መለኮታዊ ጥበብ እና ለሕይወት ተግባራዊ መመሪያ።                     |

በዓላት የራሳቸው ምድቦች አሏቸው። በበዓል ቀን፣ የዕለቱ ጥቅስ ከበዓላቱ ጥቅሶች አንዱ ሲሆን እነዚያ ጥቅሶች በሌሎች ቀናት ጥቅም ላይ አይውሉም። አንድ በዓል አብዛኛውን ጊዜ የሚቆየው አንድ ቀን ነው፤ ከትንሣኤ በኋላ እሑድ ከትንሣኤ በኋላ ባሉት ሦስት ቀናት ውስጥ ስለሚቆይ፣ ሦስቱንም ቀናት ይዘረዝራል። እያንዳንዱ የበዓል ምድብ `holiday` ከቀናቱ ጋር አለው፡ በየዓመቱ በተመሳሳይ ቀን ላይ የሚከበሩ በዓላት `month` እና `day` አላቸው፣ እና ቀናታቸው በየዓመቱ የሚለዋወጥባቸው በዓላት (ምክንያቱም በትንሣኤ እሑድ ወይም በአድቬንቸር ላይ ስለሚመሰረቱ) `dates` በጎርጎሪያን የቀን መቁጠሪያ ውስጥ ይዘረዝራሉ፣ ይህም ከ2026 እስከ 2125 አስቀድሞ ይሰላል።

| መታወቂያ                      | የበዓል ቀን           | ቀን                        |
| -------------------------- | ----------------- | ------------------------- |
| `epiphany`                 | ጥምቀት              | ጥር 6                      |
| `ash-wednesday`            | የአመድ ረቡዕ          | ከትንሣኤ እሑድ 46 ቀናት በፊት      |
| `palm-sunday`              | የፓልም እሁድ          | ከትንሣኤ በፊት እሑድ             |
| `maundy-thursday`          | ማውንዲ ሐሙስ          | ከትንሣኤ በፊት ያለው ሐሙስ እሑድ     |
| `good-friday`              | ስቅለት              | ከትንሣኤ በፊት ያለው አርብ እሁድ     |
| `resurrection-sunday`      | የትንሣኤ እሑድ         | የፋሲካ እሁድ                  |
| `post-resurrection-sunday` | ከትንሣኤ በኋላ እሁድ     | ከትንሣኤ በኋላ ባሉት ሦስት ቀናት እሁድ |
| `ascension-day`            | የዕርገት ቀን          | ከትንሣኤው እሁድ 39 ቀናት በኋላ     |
| `pentecost`                | ጴንጤቆስጤ            | ከትንሣኤ እሑድ በኋላ 49 ቀናት      |
| `all-hallows-eve`          | የሁሉም በዓላት ዋዜማ     | ጥቅምት 31                   |
| `all-saints-day`           | የሁሉም ቅዱሳን ቀን      | ህዳር 1ኛ                    |
| `advent-sunday`            | የአድቬንት የመጀመሪያ እሁድ | ከገና በፊት ያለው አራተኛው እሑድ     |
| `christmas-eve`            | የገና ዋዜማ           | ታህሳስ 24                   |
| `christmas`                | የገና በአል           | ታህሳስ 25                   |

የውሂብ ስብስቡ የሚያካትተው ማጣቀሻዎችን ብቻ ነው፣ የጥቅስ ጽሑፍን አይደለም፣ ስለዚህ ከእያንዳንዱ ትርጉም ጋር ይሰራል። የቁጥር ቁጥሮች መደበኛውን የእንግሊዝኛ ቁጥር አሰጣጥ ይጠቀማሉ (ከቢኤስቢ ጋር ተመሳሳይ)። መረጃው በሦስት መንገዶች ሊነበብ ይችላል፡

-   [`/api/d/verse-of-the-day/verses.json`](#list-verses-in-a-dataset) በውሂብ ስብስቡ ውስጥ ያለውን እያንዳንዱን ጥቅስ ከምድቦቹ ጋር፣ እና በዓላትን ከቀናቶቻቸው ጋር በአንድ ፋይል ውስጥ ይዘረዝራል።
-   በአንድ ምድብ ውስጥ ያለውን እያንዳንዱን ጥቅስ [`/api/d/verse-of-the-day/categories/{category}.json`](#get-a-category-from-a-dataset) ይዘረዝራል። ይህ ከአንድ ምድብ ውስጥ የዕለቱን ጥቅስ ለመምረጥ ቀላሉ መንገድ ነው።
-   [`/api/d/verse-of-the-day/{book}/{chapter}.json`](#get-a-chapter-from-a-dataset) እጩዎቹን በአንድ ምዕራፍ ውስጥ ከምድቦቻቸው ጋር ይዘረዝራል። እጩ የያዙ ምዕራፎች ብቻ ይገኛሉ፤ የመጽሐፉን የምዕራፍ አገናኞች ወይም `/api/d/verse-of-the-day/books.json` በመጠቀም እነሱን ለማግኘት ይጠቀሙ።

የቁጥር ምድቦችን የያዙ የውሂብ ስብስቦች በ `/api/available_datasets.json` ውስጥ ባለው ግባቸው ውስጥ `listOfVersesApiLink` ፣ `listOfCategoriesApiLink` እና `totalNumberOfCategories` ን ያካትታሉ።

### የዕለቱን ጥቅስ መምረጥ

ኤፒአይው ከስታቲስቲክ ፋይሎች የተሰራ ስለሆነ ለእርስዎ አንድም ጥቅስ አይመርጥም። በምትኩ፣ አንዱን ለመምረጥ የሚያስችል ኮንቬንሽን አለ፣ ስለዚህ የሚከተለው እያንዳንዱ መተግበሪያ በተመሳሳይ ቀን ተመሳሳይ ጥቅስ ያሳያል። መተግበሪያዎች በተለየ መንገድ ለመምረጥ ነፃ ናቸው፤ ኮንቬንሽኑ የተጋራ ነባሪ ይሰጣቸዋል።

ኮንቬንሽኑ ከቁጥሮችና ከበዓላት በ `/api/d/verse-of-the-day/verses.json` ውስጥ ካሉት ጥቅሶች ይመርጣል። በበዓል ቀን፣ ከበዓላቱ አንዱን ይመርጣል፣ አንድ ዓመት በአንድ ጊዜ ያልፋል፣ ስለዚህ አንድ በዓል በየዓመቱ ሁሉም ጥቅሶቹ እስኪጠቀሙ ድረስ የተለየ ጥቅስ ይኖረዋል። በሌሎች ቀናት፣ እያንዳንዱ ዓመት በዚያ ዓመት ጥቅም ላይ የሚውሉትን ጥቅሶች የራሱ የሆነ ውዥንብር ያገኛል (በእያንዳንዱ ጥቅስ ማጣቀሻ፣ በዓመቱ እና በአማራጭ ዘር የተደረደረ)፣ እና የቀኑ ጥቅስ በዚያ ውዥንብር ውስጥ በዓመቱ የቀን ቀን ላይ ያለው ነው። የውሂብ ስብስቡ በየዓመቱ ጥቅም ላይ ለሚውሉ ለእያንዳንዱ ቀን ከ366 በላይ ጥቅሶች አሉት፣ ስለዚህ አንድ ጥቅስ በቀን መቁጠሪያ ዓመት ውስጥ ፈጽሞ አይደገምም፣ ቅደም ተከተሉ በየዓመቱ ይለወጣል፣ እና ተመሳሳይ ቀን ሁልጊዜ ተመሳሳይ ጥቅስ ይሰጣል። አዳዲስ ጥቅሶች (ከ `addedIn` ጋር) እና አሮጌዎቹ (ከ `removedIn` ጋር) የሚጨመሩት ገና ካልተጀመረ ዓመት ብቻ ነው፣ ስለዚህ የቀኑን ጥቅስ ያለፈ ቀን ፈጽሞ አይለውጥም።

[የዕለቱ የስምምነት ጥቅስ](./verse-of-the-day-convention.md) ገጽ ስልተ ቀመሩን ደረጃ በደረጃ፣ በሐሰት ኮድ እና በሙከራ እሴቶች ይገልፃል፣ ስለዚህ በማንኛውም ቋንቋ ተግባራዊ ማድረግ ይችላሉ።

የራስዎን ትዕዛዝ ለመጠቀም የራስዎን ዘር ይምረጡ (ለምሳሌ የመተግበሪያዎን ስም)፡ ተመሳሳይ ዋስትናዎችን በመጠቀም የተለየ ውዝዋዜ ይሰጣል። እንዲሁም ከአንድ ምድብ ጥቅሶች መምረጥ ይችላሉ፣ ነገር ግን እያንዳንዱ ምድብ በዓመት ውስጥ ካሉት ቀናት ያነሰ ጥቅሶች አሉት፣ ስለዚህ ጥቅሶቹ ቀደም ብለው ይደገማሉ።

ኤስዲኬዎች (SDKs) የሚከተሉትን ደንቦች ይከተላሉ፦

```ts:no-line-numbers title="verse-of-the-day.js"
import { FreeUseBibleApi } from 'free-use-bible-api';

const api = new FreeUseBibleApi();

// ዓዓዓዓ-ወወ-ቀቀ ወይም ቀን (የአካባቢው የቀን መቁጠሪያ ቀን ጥቅም ላይ ይውላል)። ነባሪው ወደ ዛሬ ነው።
const ref = await api.getVerseOfTheDay('2026-01-01');

// የጥቅሱን ጽሑፍ ከትርጉም ያግኙ።
const chapter = await api.getTranslationBookChapter('BSB', ref.book, ref.chapter);
const verses = chapter.chapter.content.filter(
    (c) =>
        c.type === 'verse' &&
        c.number >= ref.verse &&
        c.number <= (ref.endVerse ?? ref.verse)
);
console.log(ref, verses);
```

-   `getVerseOfTheDay(date?, { seed?, category?, dataset? }?)` የጥቅሱን ዝርዝር እና ከእሱ የተመረጡትን ያወርዳል። አስቀድመው ካሎት ዝርዝር ውስጥ `pickVerseOfTheDay(verses, date?, { seed?, category? }?)` ምርጫዎች።
-   የኮትሊን ኤስዲኬ `getVerseOfTheDay(date?, seed?, category?)` እና `pickVerseOfTheDay(verses, date?, seed?, category?)` አለው፣ ይህም ቀኑን እንደ `YYYY-MM-DD` ሕብረቁምፊ ይቆጥረዋል።
-   የስዊፍት ኤስዲኬ `getVerseOfTheDay(date:seed:category:)` እና `pickVerseOfTheDay(_:date:seed:category:holidays:)` ያሉት ሲሆን ቀኑን እንደ `YYYY-MM-DD` ሕብረቁምፊ ወይም `Date` ይቆጥረዋል (በአሁኑ የጊዜ ሰቅ ውስጥ ያለው የቀን መቁጠሪያ ቀን ጥቅም ላይ ይውላል)።
-   [የኤምሲፒ አገልጋይ](https://github.com/HelloAOLab/bible-api/tree/main/packages/seed-bible-mcp) የዕለቱን ጥቅስ ከጽሑፉ ጋር የሚመልስ `getVerseOfTheDay` መሳሪያ አለው።
-   የ `@helloao/tools` ጥቅል ተመሳሳይ ዝርዝር እና በ `@helloao/tools/generation/verse-of-the-day.js` ውስጥ `getVerseOfTheDay(date?, { seed?, category? }?)` ተግባር አለው።

### ፈቃድ

ዝርዝሩ በAO Lab የተዋቀረ ሲሆን በ [MIT ፈቃድ](https://github.com/HelloAOLab/bible-api/blob/main/LICENSE) ስር ተለቋል። የጥቅሱ ጽሑፍ የመጣው ከየትኛውም ትርጉም ነው የመጣው።

## በውሂብ ስብስብ ውስጥ ጥቅሶችን ዘርዝር

`GET https://bible.helloao.org/api/d/{dataset}/verses.json`

እያንዳንዱን ጥቅስ (ወይም አጭር ምንባብ) በውሂብ ስብስብ ውስጥ፣ እያንዳንዱ አባል የሆኑባቸውን ምድቦች፣ በቀኖናዊ ቅደም ተከተል ያገኛል። እንደ `verse-of-the-day` ያሉ ምድቦች ላሏቸው የውሂብ ስብስቦች ብቻ ይገኛል።

-   `dataset` የውሂብ ስብስብ መታወቂያ (ለምሳሌ `verse-of-the-day` )።

### የኮድ ምሳሌ

::: code-tabs#ቋንቋ

@tab ጃቫስክሪፕት

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

### መዋቅር

```typescript:no-line-numbers title="dataset-verses.ts"
export interface DatasetVerses {
    /**
     * ለቁጥኖቹ የውሂብ ስብስብ መረጃ።
     */
    dataset: Dataset;

    /**
     * በውሂብ ስብስቡ ውስጥ ያለው እያንዳንዱ ጥቅስ (ወይም አጭር ምንባብ)፣ ከምድቦቹ ጋር፣ በቀኖናዊ ቅደም ተከተል።
     */
    verses: DatasetCategorizedVerse[];

    /**
     * የራሳቸው ጥቅሶች ያሏቸው በዓላት፣ ከቀናቶቻቸው ጋር።
     * የውሂብ ስብስቡ ምንም በዓላት ከሌለው ተትቷል።
     */
    holidays?: DatasetVersesHoliday[];
}

export interface DatasetVersesHoliday extends DatasetCategoryHoliday {
    /**
     * የበዓሉ ምድብ መለያ። ለምሳሌ "ክሪስማስ"።
     */
    id: string;

    /**
     * የበዓሉ የእንግሊዝኛ ስም። ለምሳሌ "ክሪስማስ"።
     */
    name: string;
}

export interface DatasetCategoryHoliday {
    /**
     * በየዓመቱ በተመሳሳይ ቀን የሚውል ወር (ለጥር 1) እና የበዓል ቀን።
     * በየዓመቱ የሚቀያየሩ በዓላት ላይ በዓላትን ችላ ተብሏል።
     */
    month?: number;
    day?: number;

    /**
     * የበዓል ቀናት (ዓዓዓዓ-ወወ-ቀቀ፣ የግሪጎሪያን የቀን መቁጠሪያ) በየዓመቱ የሚለዋወጡበት ቀን በቅደም ተከተል።
     * እነሱ ለተወሰነ ዓመታት (በአሁኑ ጊዜ ከ2026 እስከ 2125) አስቀድመው የተቆጠሩ ሲሆን፣ በዓሉ የሚከበረው በተዘረዘሩት ቀናት ብቻ ነው።
     * በየዓመቱ በተመሳሳይ ቀን ለሚከበሩ በዓላት ተትቷል።
     */
    dates?: string[];
}

export interface DatasetCategorizedVerse {
    /**
     * የመጽሐፉ መታወቂያ። ለምሳሌ "PRO"።
     */
    book: string;

    /**
     * የምዕራፉ ቁጥር።
     */
    chapter: number;

    /**
     * የጥቅሱ ቁጥር።
     * `endVerse` ካለ፣ ይህ ምንባብ የሚጀምረው ጥቅስ ነው።
     */
    verse: number;

    /**
     * አንቀጹ የሚያበቃበት ጥቅስ።
     * ግቤቱ አንድ ጥቅስ ከሆነ ተትቷል።
     */
    endVerse?: number;

    /**
     * ጥቅሱ የሚመለከታቸው የምድቦች መታወቂያዎች፣ በመጀመሪያ በጣም ተገቢ ናቸው።
     */
    categories: string[];

    /**
     * ጥቅሱ የተጠቀሰው የመጀመሪያው ዓመት የዕለቱ ጥቅስ ሊሆን ይችላል።
     * ጥቅሱ ሁልጊዜ በዝርዝሩ ውስጥ ካለ ተትቷል።
     */
    addedIn?: number;

    /**
     * ጥቅሱ የተፈጸመበት የመጀመሪያው ዓመት የዕለቱ ጥቅስ ሊሆን አይችልም።
     * የተወገዱ ጥቅሶች በውሂብ ስብስቡ ውስጥ ይቀራሉ፣ ስለዚህ የቀደሙት ዓመታት ጥቅሶች አሁንም ሊመረጡ ይችላሉ።
     * ጥቅሱ ከዝርዝሩ ውስጥ ካልተወገደ ተትቷል።
     */
    removedIn?: number;
}
```

### ለምሳሌ

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

## በውሂብ ስብስብ ውስጥ ምድቦችን ዘርዝር

`GET https://bible.helloao.org/api/d/{dataset}/categories.json`

ለመረጃ ስብስብ የሚገኙ የጥቅስ ምድቦችን ዝርዝር ያገኛል።

-   `dataset` የውሂብ ስብስብ መታወቂያ (ለምሳሌ `verse-of-the-day` )።

### የኮድ ምሳሌ

::: code-tabs#ቋንቋ

@tab ጃቫስክሪፕት

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

### መዋቅር

```typescript:no-line-numbers title="dataset-categories.ts"
export interface DatasetCategories {
    /**
     * ለምድቦቹ የውሂብ ስብስብ መረጃ።
     */
    dataset: Dataset;

    /**
     * ለመረጃ ውሂቡ የሚገኙ የጥቅስ ምድቦች ዝርዝር።
     */
    categories: DatasetCategorySummary[];
}

export interface DatasetCategorySummary {
    /**
     * የምድብ መለያ። ለምሳሌ "ተስፋ"።
     */
    id: string;

    /**
     * የምድብ የእንግሊዝኛ ስም። ለምሳሌ "ተስፋ"።
     */
    name: string;

    /**
     * በምድብ ውስጥ ያሉት ጥቅሶች ስለምን እንደሆኑ የሚገልጽ መግለጫ።
     */
    description: string;

    /**
     * በምድቡ ውስጥ የሚገኙ የጥቅሶች (ወይም አጫጭር አንቀጾች) ብዛት።
     */
    numberOfVerses: number;

    /**
     * ምድቡ የሚውልበት የበዓል ቀናት (ከላይ ያለውን የውሂብ ስብስብ ምድብ ይመልከቱ)።
     * ለበዓል የማይሆኑ ምድቦችን ችላ ተብሏል።
     */
    holiday?: DatasetCategoryHoliday;

    /**
     * ለምድቡ የኤፒአይ አገናኝ።
     */
    apiLink: string;
}
```

### ለምሳሌ

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

## ከውሂብ ስብስብ ምድብ ያግኙ

`GET https://bible.helloao.org/api/d/{dataset}/categories/{category}.json`

አንድ የጥቅስ ምድብ ያገኛል፣ እያንዳንዱ የጥቅስ ክፍል ደግሞ የራሱ የሆነ ነው።

-   `dataset` የውሂብ ስብስብ መታወቂያ (ለምሳሌ `verse-of-the-day` )።
-   `category` የምድብ መለያ ነው (ለምሳሌ `hope` )።

### የኮድ ምሳሌ

::: code-tabs#ቋንቋ

@tab ጃቫስክሪፕት

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

### መዋቅር

```typescript:no-line-numbers title="dataset-category.ts"
export interface DatasetCategoryResponse {
    /**
     * ለምድቡ የውሂብ ስብስብ መረጃ።
     */
    dataset: Dataset;

    /**
     * ምድቡ፣ ከሱ ጋር የተያያዙ ጥቅሶች ያሉት።
     */
    category: DatasetCategory;

    /**
     * የዚህ ምድብ የኤፒአይ አገናኝ።
     */
    thisCategoryApiLink: string;
}

export interface DatasetCategory {
    /**
     * የምድብ መለያ። ለምሳሌ "ተስፋ"።
     */
    id: string;

    /**
     * የምድብ የእንግሊዝኛ ስም። ለምሳሌ "ተስፋ"።
     */
    name: string;

    /**
     * በምድብ ውስጥ ያሉት ጥቅሶች ስለምን እንደሆኑ የሚገልጽ መግለጫ።
     */
    description: string;

    /**
     * ምድቡ የሚውልበት የበዓል ቀናት (በ"በውሂብ ስብስብ ውስጥ ያሉ ጥቅሶችን ዝርዝር" ውስጥ የውሂብ ስብስብ ምድብ ሆሊዴይን ይመልከቱ)።
     * በእነዚያ ቀናት፣ የዕለቱ ጥቅስ ከምድብ ጥቅሶች አንዱ ሲሆን በሌሎች ቀናትም ጥቅም ላይ አይውሉም።
     * ለበዓል የማይሆኑ ምድቦችን ችላ ተብሏል።
     */
    holiday?: DatasetCategoryHoliday;

    /**
     * በቀኖናዊ ቅደም ተከተል የምድቡ አባል የሆኑ ጥቅሶች (ወይም አጫጭር ምንባቦች)።
     * ከዝርዝሩ ውስጥ የተወገዱ ጥቅሶችን ያካትታል ( `removedIn` ይመልከቱ)።
     */
    verses: DatasetCategoryVerse[];
}

export interface DatasetCategoryVerse {
    /**
     * የመጽሐፉ መታወቂያ። ለምሳሌ "JER"።
     */
    book: string;

    /**
     * የምዕራፉ ቁጥር።
     */
    chapter: number;

    /**
     * የጥቅሱ ቁጥር።
     * `endVerse` ካለ፣ ይህ ምንባብ የሚጀምረው ጥቅስ ነው።
     */
    verse: number;

    /**
     * አንቀጹ የሚያበቃበት ጥቅስ።
     * ማጣቀሻው አንድ ጥቅስ ከሆነ ተትቷል።
     */
    endVerse?: number;

    /**
     * ጥቅሱ የተጠቀሰው የመጀመሪያው ዓመት የዕለቱ ጥቅስ ሊሆን ይችላል።
     * ጥቅሱ ሁልጊዜ በዝርዝሩ ውስጥ ካለ ተትቷል።
     */
    addedIn?: number;

    /**
     * ጥቅሱ የተፈጸመበት የመጀመሪያው ዓመት የዕለቱ ጥቅስ ሊሆን አይችልም።
     * የተወገዱ ጥቅሶች በውሂብ ስብስቡ ውስጥ ይቀራሉ፣ ስለዚህ የቀደሙት ዓመታት ጥቅሶች አሁንም ሊመረጡ ይችላሉ።
     * ጥቅሱ ከዝርዝሩ ውስጥ ካልተወገደ ተትቷል።
     */
    removedIn?: number;
}
```

### ለምሳሌ

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
