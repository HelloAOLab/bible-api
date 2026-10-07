# የውሂብ ስብስቦች

እንደ ተሻጋሪ ማጣቀሻዎች እና የመጽሐፍ ቅዱስ አካላት (ሰዎች፣ ቦታዎች፣ ክስተቶች እና የሰዎች ቡድኖች) ያሉ ተጨማሪ የመጽሐፍ ቅዱስ መረጃዎችን ለማሰስ እና መጽሐፎቻቸውን፣ የምዕራፍ ይዘቶቻቸውን እና አካላትን ለማግኘት የመጨረሻ ነጥቦች።

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
     * የውሂብ ስብስብ የእንግሊዝኛ ስም።
     */
    englishName: string;

    /**
     * የውሂብ ስብስቡ በዋናነት የሚገኝበት የISO 639 ባለ 3-ፊደል ቋንቋ መለያ።
     */
    language: string;

    /**
     * ቋንቋው የተጻፈበት አቅጣጫ።
     * "ltr" የሚለው ጽሑፍ የተጻፈው ከገጹ ግራ በኩል ወደ ቀኝ መሆኑን ያመለክታል።
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
     */
    totalNumberOfReferences: number;

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
     * በውሂብ ስብስቡ ውስጥ ያሉትን የድርጅት ዝርዝሮች ለማግኘት የኤፒአይ አገናኞች።
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

ለተሻጋሪ ማጣቀሻ የውሂብ ስብስቦች (እንደ `open-cross-ref` )፣ ምዕራፉ ለእያንዳንዱ ጥቅስ የመስቀል ማጣቀሻዎችን ዝርዝር ይዟል። ለተሻጋሪ የውሂብ ስብስቦች (እንደ `theographic` )፣ ምዕራፉ በምዕራፉ ውስጥ የሚታዩትን ሰዎች፣ ቦታዎች እና ክስተቶችን ይይዛል - [አካላትን በምዕራፍ ያግኙ የሚለውን ይመልከቱ](#get-the-entities-in-a-chapter) ።

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

interface DatasetVerse {
    /**
     * የጥቅሱ ቁጥር።
     */
    verse: number;

    /**
     * የጥቅሱን የመስቀለኛ መንገድ ማጣቀሻዎች።
     *
     * በውጤት፣ ወደ ታች በመውረድ የተደረደረ።
     */
    references: DatasetReference[];
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

## አካላትን በአንድ ምዕራፍ ውስጥ ያግኙ

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

ለተቋማት የውሂብ ስብስቦች፣ በአንድ ምዕራፍ ውስጥ የሚታዩትን ሰዎች፣ ቦታዎች እና ክስተቶች፣ እያንዳንዳቸው በተጠቀሱበት ምዕራፍ ውስጥ ካሉት የጥቅስ ቁጥሮች ጋር ያገኛል።

-   `dataset` የውሂብ ስብስብ መታወቂያ (ለምሳሌ `theographic` )።
-   `book` የመጽሐፉ መለያ ነው (ለምሳሌ `GEN` ለዘፍጥረት)።
-   `chapter` የቁጥር ምዕራፍ ቁጥር ነው (ለምሳሌ ለመጀመሪያው ምዕራፍ `1` )።

የድርጅት መረጃ ያላቸው የመጽሐፍት እና የምዕራፍ ዝርዝር ከ `GET https://bible.helloao.org/api/d/{dataset}/books.json` ይገኛል፣ ይህም [ከውሂብ ስብስብ መጽሐፍት የመጨረሻ ነጥብ](#list-books-in-a-dataset) ጋር ተመሳሳይ መዋቅርን ይከተላል። ለድርጅት የውሂብ ስብስቦች፣ `totalNumberOfVerses` ቢያንስ በአንድ አካል የተጠቀሱ የጥቅሶች ብዛት ሲሆን `totalNumberOfReferences` ደግሞ የድርጅት-ቁጥር አጠቃላይ የተጠቀሱ የጥቅሶች ብዛት ነው።

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
