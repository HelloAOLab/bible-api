# ڈیٹاسیٹس

ضمنی بائبل ڈیٹاسیٹس کو براؤز کرنے کے لیے اختتامی نقطے - جیسے کراس حوالہ جات اور بائبلی اداروں (لوگ، مقامات، واقعات، اور لوگوں کے گروپ) - اور ان کی کتابیں، باب کے مواد اور اداروں کو بازیافت کرنا۔

## دستیاب ڈیٹاسیٹس

`GET https://bible.helloao.org/api/available_datasets.json`

API میں دستیاب بائبل ڈیٹاسیٹس کی فہرست حاصل کرتا ہے۔

### کوڈ کی مثال

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

### ساخت

```typescript:no-line-numbers title="available-datasets.ts"
export interface AvailableDatasets {
    /**
     * ڈیٹا سیٹس کی فہرست۔
     */
    datasets: Dataset[];
}

export interface Dataset {
    /**
     * ڈیٹا سیٹ کی ID۔
     */
    id: string;

    /**
     * ڈیٹا سیٹ کا نام۔
     */
    name: string;

    /**
     * ڈیٹا سیٹ کے لیے ویب سائٹ۔
     */
    website: string;

    /**
     * وہ URL جو ڈیٹاسیٹ کا لائسنس پایا جا سکتا ہے۔
     */
    licenseUrl: string;

    /**
     * ڈیٹاسیٹ کا انگریزی نام۔
     */
    englishName: string;

    /**
     * ISO 639 3 حرفی زبان کا ٹیگ جس میں ڈیٹاسیٹ بنیادی طور پر ہے۔
     */
    language: string;

    /**
     * زبان جس سمت میں لکھی جاتی ہے۔
     * "ltr" اشارہ کرتا ہے کہ متن صفحہ کے بائیں جانب سے دائیں طرف لکھا گیا ہے۔
     * "rtl" اشارہ کرتا ہے کہ متن صفحہ کے دائیں جانب سے بائیں طرف لکھا گیا ہے۔
     */
    textDirection: 'ltr' | 'rtl';

    /**
     * اس ڈیٹاسیٹ کے لیے دستیاب کتابوں کی فہرست کا API لنک۔
     */
    listOfBooksApiLink: string;

    /**
     * فارمیٹس کی دستیاب فہرست۔
     */
    availableFormats: ('json' | 'usfm')[];

    /**
     * اس ڈیٹاسیٹ میں موجود کتابوں کی تعداد۔
     */
    numberOfBooks: number;

    /**
     * اس ڈیٹاسیٹ میں موجود ابواب کی کل تعداد۔
     */
    totalNumberOfChapters: number;

    /**
     * اس ڈیٹاسیٹ میں موجود آیات کی کل تعداد۔
     */
    totalNumberOfVerses: number;

    /**
     * کراس حوالہ جات کی کل تعداد جو اس ڈیٹاسیٹ میں موجود ہیں۔
     */
    totalNumberOfReferences: number;

    /**
     * اس زبان کا نام حاصل کرتا ہے جس میں ڈیٹاسیٹ ہے۔
     * اگر زبان کا نام معلوم نہ ہو تو کالعدم یا غیر متعینہ۔
     */
    languageName?: string;

    /**
     * انگریزی میں زبان کا نام حاصل کرتا ہے۔
     * اگر زبان کا انگریزی نام نہ ہو تو کالعدم یا غیر متعینہ۔
     */
    languageEnglishName?: string;

    /**
     * ڈیٹاسیٹ میں موجود اداروں کی فہرستوں کے لیے API لنکس۔
     * اگر ڈیٹا سیٹ میں متعلقہ ہستیوں پر مشتمل نہیں ہے تو چھوڑ دیا جائے گا۔
     */
    listOfPeopleApiLink?: string;
    listOfPlacesApiLink?: string;
    listOfEventsApiLink?: string;
    listOfPeopleGroupsApiLink?: string;

    /**
     * ڈیٹا سیٹ میں موجود اداروں کی کل تعداد۔
     * اگر ڈیٹا سیٹ میں متعلقہ ہستیوں پر مشتمل نہیں ہے تو چھوڑ دیا جائے گا۔
     */
    totalNumberOfPeople?: number;
    totalNumberOfPlaces?: number;
    totalNumberOfEvents?: number;
    totalNumberOfPeopleGroups?: number;
}
```

### مثال

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

## ڈیٹا سیٹ میں کتابوں کی فہرست بنائیں

`GET https://bible.helloao.org/api/d/{dataset}/books.json`

دیے گئے ڈیٹاسیٹ کے لیے دستیاب کتابوں کی فہرست حاصل کرتا ہے۔

-   `dataset` ڈیٹاسیٹ کی ID (مثلاً `open-cross-ref` )۔

### کوڈ کی مثال

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-books.js"
const dataset = 'open-cross-ref';

// اوپن کراس ریف ڈیٹاسیٹ کے لیے کتابوں کی فہرست حاصل کریں۔
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

### ساخت

```typescript:no-line-numbers title="dataset-books.ts"
export interface DatasetBooks {
    /**
     * کتابوں کے لیے ڈیٹا سیٹ کی معلومات۔
     */
    dataset: Dataset;

    /**
     * ان کتابوں کی فہرست جو ڈیٹاسیٹ کے لیے دستیاب ہیں۔
     */
    books: DatasetBook[];
}

interface DatasetBook {
    /**
     * کتاب کی شناخت۔
     * بائبل میں متعلقہ کتاب کی ID سے میل کھاتا ہے (GEN، EXO، وغیرہ)۔
     */
    id: string;

    /**
     * بائبل میں کتاب کی ترتیب۔
     */
    order: number;

    /**
     * کتاب کے پہلے باب کا نمبر۔
     */
    firstChapterNumber: number;

    /**
     * کتاب کے پہلے باب کا لنک۔
     */
    firstChapterApiLink: string | null;

    /**
     * کتاب کے آخری باب کا نمبر۔
     */
    lastChapterNumber: number | null;

    /**
     * کتاب کے آخری باب کا لنک۔
     */
    lastChapterApiLink: string | null;

    /**
     * کتاب میں ابواب کی تعداد۔
     */
    numberOfChapters: number;

    /**
     * کتاب میں آیات کی تعداد۔
     */
    totalNumberOfVerses: number;

    /**
     * کراس حوالہ جات کی کل تعداد جو اس کتاب پر مشتمل ہے۔
     */
    totalNumberOfReferences: number;
}
```

### مثال

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

## ڈیٹا سیٹ سے ایک باب حاصل کریں۔

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

دی گئی کتاب اور ڈیٹاسیٹ کے لیے ایک باب کا مواد حاصل کرتا ہے۔

کراس ریفرینس ڈیٹاسیٹس کے لیے (جیسے `open-cross-ref` )، باب ہر آیت کے لیے کراس حوالہ جات کی فہرست پر مشتمل ہے۔ ہستی کے ڈیٹاسیٹس کے لیے (جیسے `theographic` )، باب میں وہ لوگ، مقامات اور واقعات شامل ہیں جو باب میں نظر آتے ہیں - دیکھیں [ایک باب میں ہستی حاصل کریں](#get-the-entities-in-a-chapter) ۔

-   `dataset` ڈیٹاسیٹ کی ID (مثلاً `open-cross-ref` )۔
-   `book` کتاب کی شناخت ہے (مثال کے طور پر پیدائش کے لیے `GEN` )۔
-   `chapter` عددی باب نمبر ہے (مثلاً `1` پہلے باب کے لیے)۔

### کوڈ کی مثال

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-chapter.js"
const dataset = 'open-cross-ref';
const book = 'GEN';
const chapter = 1;

// اوپن کراس ریف ڈیٹاسیٹ سے جینیسس 1 حاصل کریں۔
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

### ساخت

```typescript:no-line-numbers title="dataset-chapter.ts"
export interface DatasetBookChapter {
    /**
     * کتاب کے باب کے لیے ڈیٹا سیٹ کی معلومات۔
     */
    dataset: Dataset;

    /**
     * کتاب کے باب کے لیے کتاب کی معلومات۔
     */
    book: DatasetBook;

    /**
     * اس باب کا لنک۔
     */
    thisChapterLink: string;

    /**
     * اگلے باب کا لنک۔
     * اگر یہ ڈیٹاسیٹ کا آخری باب ہے تو کالعدم۔
     */
    nextChapterApiLink: string | null;

    /**
     * پچھلے باب کا لنک۔
     * اگر یہ ڈیٹا سیٹ کا پہلا باب ہے تو کالعدم۔
     */
    previousChapterApiLink: string | null;

    /**
     * آیات کی تعداد جو باب میں ہے۔
     */
    numberOfVerses: number;

    /**
     * باب کے لیے معلومات۔
     */
    chapter: DatasetChapterData;
}

interface DatasetChapterData {
    /**
     * باب کا نمبر۔
     */
    number: number;

    /**
     * باب کا مواد۔
     */
    content: DatasetVerse[];
}

interface DatasetVerse {
    /**
     * آیت کی تعداد۔
     */
    verse: number;

    /**
     * آیت کے لیے کراس حوالہ جات۔
     *
     * اسکور کے لحاظ سے ترتیب دیا گیا، نزولی۔
     */
    references: DatasetReference[];
}

interface DatasetReference {
    /**
     * جس کتاب کا حوالہ دیا جا رہا ہے اس کی ID۔
     */
    book: string;

    /**
     * باب نمبر۔
     */
    chapter: number;

    /**
     * آیت نمبر۔
     * اگر `endVerse` موجود ہے تو یہ وہ آیت ہے جس سے حوالہ شروع ہوتا ہے۔
     */
    verse: number;

    /**
     * وہ آیت جس پر حوالہ ختم ہوتا ہے۔
     */
    endVerse?: number;

    /**
     * حوالہ کے لیے متعلقہ سکور۔
     */
    score?: number;
}
```

### مثال

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

## اداروں

کچھ ڈیٹا سیٹس - جیسے [تھیوگرافک بائبل میٹا ڈیٹا](https://github.com/robertrouse/theographic-bible-metadata) ڈیٹاسیٹ ( `theographic` ) - ہستیوں پر مشتمل ہے: لوگ، مقامات، واقعات، اور لوگوں کے گروپ، ان کے اور بائبل کی آیات کے درمیان تعلقات کے ساتھ جو ان کا ذکر کرتی ہیں۔

ڈیٹا سیٹس جو ہستیوں پر مشتمل ہیں ان میں `listOfPeopleApiLink` , `listOfPlacesApiLink` , `listOfEventsApiLink` , اور `listOfPeopleGroupsApiLink` خصوصیات شامل ہیں `/api/available_datasets.json` میں ان کے اندراج میں۔

ہستی کے ڈیٹاسیٹس باب سے منسلک ڈیٹا بھی فراہم کرتے ہیں: `/api/d/{dataset}/books.json` ان کتابوں کی فہرست دیتا ہے جن کے ابواب میں ہستی کا ڈیٹا ہوتا ہے، اور `/api/d/{dataset}/{book}/{chapter}.json` اس باب میں ظاہر ہونے والے لوگوں، مقامات اور واقعات کو، آیت نمبروں کے ساتھ جہاں ہر ایک کا تذکرہ ہوتا ہے۔ [ایک باب میں اداروں کو حاصل کریں](#get-the-entities-in-a-chapter) دیکھیں۔

ہستیاں بقیہ API کی طرح ایک ہی کتاب کے IDs، باب نمبرز، اور آیت نمبروں کا استعمال کرتے ہوئے بائبل کے اقتباسات کا حوالہ دیتی ہیں، تاکہ انہیں کسی بھی ترجمہ کے ساتھ ملایا جا سکے۔ وہ ہستی کے حوالہ جات کا استعمال کرتے ہوئے ایک دوسرے کا حوالہ دیتے ہیں:

```typescript:no-line-numbers title="entity-shared.ts"
export interface DatasetEntityRef {
    /**
     * اس ہستی کی ID جس کا حوالہ دیا جا رہا ہے۔
     */
    id: string;

    /**
     * ہستی کی قسم جس کا حوالہ دیا جا رہا ہے۔
     * ہستی کے API لنک کے مجموعہ کے حصے سے میل کھاتا ہے، اس لیے لنک کو `/api/d/{dataset}/{type}/{id}.json` کے طور پر بنایا جا سکتا ہے۔
     */
    type: 'people' | 'places' | 'events' | 'groups';

    /**
     * اس ہستی کا نام جس کا حوالہ دیا جا رہا ہے۔
     */
    name?: string;

    /**
     * اس ہستی کا API لنک جس کا حوالہ دیا جا رہا ہے۔
     */
    apiLink?: string;
}

export interface VerseRef {
    /**
     * کتاب کی شناخت (GEN، EXO، وغیرہ)۔
     */
    book: string;

    /**
     * باب نمبر جس سے حوالہ شروع ہوتا ہے۔
     */
    chapter: number;

    /**
     * آیت نمبر جس سے حوالہ شروع ہوتا ہے۔
     */
    verse: number;

    /**
     * وہ آیت جس پر حوالہ ختم ہوتا ہے۔
     * ایک ہی باب میں متواتر آیات کو ایک ہی حوالہ میں سمو دیا گیا ہے۔
     */
    endVerse?: number;
}
```

## ایک باب میں اداروں کو حاصل کریں۔

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

ہستی ڈیٹاسیٹس کے لیے، وہ لوگ، مقامات اور واقعات حاصل کرتے ہیں جو ایک باب میں ظاہر ہوتے ہیں، اس باب میں آیت نمبر کے ساتھ جہاں ہر ایک کا ذکر کیا گیا ہے۔

-   `dataset` ڈیٹاسیٹ کی ID (مثلاً `theographic` )۔
-   `book` کتاب کی شناخت ہے (مثال کے طور پر پیدائش کے لیے `GEN` )۔
-   `chapter` عددی باب نمبر ہے (مثلاً `1` پہلے باب کے لیے)۔

کتابوں اور ابواب کی فہرست جن میں ہستی کا ڈیٹا موجود ہے `GET https://bible.helloao.org/api/d/{dataset}/books.json` سے دستیاب ہے، جو [ڈیٹاسیٹ کی کتابوں کے اختتامی نقطہ](#list-books-in-a-dataset) کی طرح کی ساخت کی پیروی کرتا ہے۔ ہستی ڈیٹاسیٹس کے لیے، `totalNumberOfVerses` آیات کی تعداد ہے جن کا ذکر کم از کم ایک ہستی کے ذریعے کیا گیا ہے اور `totalNumberOfReferences` ہستی-آیت کے تذکروں کی کل تعداد ہے۔

### کوڈ کی مثال

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter-entities.js"
const dataset = 'theographic';
const book = 'GEN';
const chapter = 2;

// پیدائش 2 میں ظاہر ہونے والے لوگوں، مقامات اور واقعات کو حاصل کریں۔
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

### ساخت

```typescript:no-line-numbers title="dataset-chapter-entities.ts"
export interface DatasetEntityBookChapter {
    /**
     * کتاب کے باب کے لیے ڈیٹا سیٹ کی معلومات۔
     */
    dataset: Dataset;

    /**
     * کتاب کے باب کے لیے کتاب کی معلومات۔
     */
    book: DatasetBook;

    /**
     * باب کے لیے ہستی کا ڈیٹا۔
     */
    chapter: DatasetEntityChapterData;

    /**
     * اس باب کا لنک۔
     */
    thisChapterLink: string;

    /**
     * اگلے باب کا لنک۔
     * اگر یہ ڈیٹاسیٹ کا آخری باب ہے تو کالعدم۔
     */
    nextChapterApiLink: string | null;

    /**
     * پچھلے باب کا لنک۔
     * اگر یہ ڈیٹا سیٹ کا پہلا باب ہے تو کالعدم۔
     */
    previousChapterApiLink: string | null;

    /**
     * باب میں ظاہر ہونے والے لوگوں، مقامات اور واقعات کی تعداد۔
     */
    numberOfPeople: number;
    numberOfPlaces: number;
    numberOfEvents: number;
}

interface DatasetEntityChapterData {
    /**
     * باب کا نمبر۔
     */
    number: number;

    /**
     * وہ لوگ جو باب میں نظر آتے ہیں۔
     * پہلی آیت کے مطابق ترتیب دیا گیا ہے جس میں وہ نظر آتے ہیں۔
     */
    people: ChapterPerson[];

    /**
     * وہ مقامات جو باب میں نظر آتے ہیں۔
     * پہلی آیت کے مطابق ترتیب دیا گیا ہے جس میں وہ نظر آتے ہیں۔
     */
    places: ChapterPlace[];

    /**
     * وہ واقعات جو باب میں نظر آتے ہیں۔
     * پہلی آیت کے مطابق ترتیب دیا گیا ہے جس میں وہ نظر آتے ہیں۔
     */
    events: ChapterEvent[];
}

interface ChapterPerson {
    /**
     * اس شخص کی شناخت۔
     */
    id: string;

    /**
     * شخص کا نام۔
     */
    name: string;

    /**
     * آیا اس شخص کا نام مناسب نام ہے۔
     */
    isProperName?: boolean;

    /**
     * شخص کی جنس۔
     */
    gender?: string;

    /**
     * جس سال وہ شخص پیدا ہوا اور جس سال وہ فوت ہوا۔
     * منفی نمبر سال BC ہیں۔ مثبت اعداد سال AD ہیں۔
     */
    birthYear?: number;
    deathYear?: number;

    /**
     * اس شخص کے لیے API لنک۔
     */
    apiLink: string;

    /**
     * باب میں آیات کی تعداد جو اس شخص کا ذکر کرتی ہیں۔
     * صعودی ترتیب میں ترتیب دیا گیا۔
     */
    verses: number[];
}

interface ChapterPlace {
    /**
     * اس جگہ کی شناخت۔
     */
    id: string;

    /**
     * جگہ کا نام۔
     */
    name: string;

    /**
     * جغرافیائی خصوصیت کی قسم جو جگہ ہے۔
     */
    featureType?: string;

    /**
     * اس جگہ کا عرض البلد اور عرض البلد۔
     */
    latitude?: number;
    longitude?: number;

    /**
     * اس جگہ کا API لنک۔
     */
    apiLink: string;

    /**
     * باب میں آیات کی تعداد جو اس جگہ کا ذکر کرتی ہیں۔
     * صعودی ترتیب میں ترتیب دیا گیا۔
     */
    verses: number[];
}

interface ChapterEvent {
    /**
     * تقریب کی شناخت۔
     */
    id: string;

    /**
     * تقریب کا نام۔
     */
    name: string;

    /**
     * جس تاریخ کو ایونٹ شروع ہوا۔
     */
    startDate?: string;

    /**
     * ایونٹ کا API لنک۔
     */
    apiLink: string;

    /**
     * باب میں آیات کی تعداد جو واقعہ کو بیان کرتی ہے۔
     * صعودی ترتیب میں ترتیب دیا گیا۔
     */
    verses: number[];
}
```

### مثال

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

## ڈیٹا سیٹ میں لوگوں کی فہرست بنائیں

`GET https://bible.helloao.org/api/d/{dataset}/people.json`

ان لوگوں کی فہرست حاصل کرتا ہے جو دیے گئے ڈیٹاسیٹ کے لیے دستیاب ہیں۔

-   `dataset` ڈیٹاسیٹ کی ID (مثلاً `theographic` )۔

### کوڈ کی مثال

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-people.js"
const dataset = 'theographic';

// تھیوگرافک ڈیٹاسیٹ کے لیے لوگوں کی فہرست حاصل کریں۔
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

### ساخت

```typescript:no-line-numbers title="dataset-people.ts"
export interface DatasetPeople {
    /**
     * لوگوں کے لیے ڈیٹا سیٹ کی معلومات۔
     */
    dataset: Dataset;

    /**
     * ان لوگوں کی فہرست جو ڈیٹا سیٹ کے لیے دستیاب ہیں۔
     */
    people: DatasetPersonSummary[];
}

interface DatasetPersonSummary {
    /**
     * اس شخص کی شناخت۔
     */
    id: string;

    /**
     * شخص کا نام۔
     */
    name: string;

    /**
     * آیا اس شخص کا نام مناسب نام ہے۔
     */
    isProperName?: boolean;

    /**
     * شخص کی جنس۔
     */
    gender?: string;

    /**
     * بائبل کے حوالہ جات کی تعداد جو اس شخص کا ذکر کرتی ہے۔
     */
    numberOfReferences: number;

    /**
     * اس شخص کے لیے API لنک۔
     */
    thisPersonApiLink: string;
}
```

### مثال

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

## ڈیٹا سیٹ سے ایک شخص حاصل کریں۔

`GET https://bible.helloao.org/api/d/{dataset}/people/{person}.json`

کسی ایک فرد کے بارے میں معلومات حاصل کرتا ہے، بشمول بائبل کے حوالہ جات جن میں ان کا اور دوسرے لوگوں، مقامات، واقعات اور لوگوں کے گروپوں سے ان کے تعلقات کا ذکر ہوتا ہے۔

-   `dataset` ڈیٹاسیٹ کی ID (مثلاً `theographic` )۔
-   `person` شخص کی شناخت (مثلاً `paul_2479` )۔

### کوڈ کی مثال

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-person.js"
const dataset = 'theographic';
const person = 'paul_2479';

// تھیوگرافک ڈیٹاسیٹ سے پال کے بارے میں معلومات حاصل کریں۔
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

### ساخت

```typescript:no-line-numbers title="dataset-person.ts"
export interface DatasetPersonResponse {
    /**
     * شخص کے لیے ڈیٹا سیٹ کی معلومات۔
     */
    dataset: Dataset;

    /**
     * شخص کے بارے میں معلومات۔
     */
    person: DatasetPerson;

    /**
     * اس شخص کے لیے API لنک۔
     */
    thisPersonApiLink: string;
}

interface DatasetPerson {
    /**
     * اس شخص کی شناخت۔
     */
    id: string;

    /**
     * شخص کا نام۔
     */
    name: string;

    /**
     * دوسرے نام جن سے اس شخص کو پکارا جاتا ہے۔
     */
    alsoCalled?: string[];

    /**
     * آیا اس شخص کا نام مناسب نام ہے۔
     */
    isProperName?: boolean;

    /**
     * شخص کی جنس۔
     */
    gender?: string;

    /**
     * شخص کی تفصیل۔ ہر تار ایک پیراگراف ہے۔
     */
    description?: string[];

    /**
     * جس سال وہ شخص پیدا ہوا اور جس سال وہ فوت ہوا۔
     * منفی نمبر سال BC ہیں۔ مثبت اعداد سال AD ہیں۔
     */
    birthYear?: number;
    deathYear?: number;

    /**
     * ابتدائی اور تازہ ترین سال جن میں اس شخص کا ذکر ہے۔
     */
    minYear?: number;
    maxYear?: number;

    /**
     * وہ جگہ جہاں وہ شخص پیدا ہوا اور فوت ہوا۔
     */
    birthPlace?: DatasetEntityRef;
    deathPlace?: DatasetEntityRef;

    /**
     * فرد کے خاندانی تعلقات۔
     */
    father?: DatasetEntityRef[];
    mother?: DatasetEntityRef[];
    partners?: DatasetEntityRef[];
    children?: DatasetEntityRef[];
    siblings?: DatasetEntityRef[];
    halfSiblingsSameMother?: DatasetEntityRef[];
    halfSiblingsSameFather?: DatasetEntityRef[];

    /**
     * لوگوں کے گروپ جن کا وہ فرد ممبر ہے۔
     */
    memberOf?: DatasetEntityRef[];

    /**
     * وہ واقعات جن میں اس شخص نے حصہ لیا۔
     */
    events?: DatasetEntityRef[];

    /**
     * بائبل کے حوالہ جات کی فہرست جس میں اس شخص کا ذکر ہے۔
     * کتابی ترتیب، باب اور آیت کے لحاظ سے ترتیب دیا گیا ہے۔
     */
    references: VerseRef[];
}
```

### مثال

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

## ڈیٹا سیٹ میں مقامات کی فہرست بنائیں

`GET https://bible.helloao.org/api/d/{dataset}/places.json`

دیئے گئے ڈیٹاسیٹ کے لیے دستیاب جگہوں کی فہرست حاصل کرتا ہے۔

-   `dataset` ڈیٹاسیٹ کی ID (مثلاً `theographic` )۔

### ساخت

```typescript:no-line-numbers title="dataset-places.ts"
export interface DatasetPlaces {
    /**
     * مقامات کے لیے ڈیٹا سیٹ کی معلومات۔
     */
    dataset: Dataset;

    /**
     * ان مقامات کی فہرست جو ڈیٹاسیٹ کے لیے دستیاب ہیں۔
     */
    places: DatasetPlaceSummary[];
}

interface DatasetPlaceSummary {
    /**
     * اس جگہ کی شناخت۔
     */
    id: string;

    /**
     * جگہ کا نام۔
     */
    name: string;

    /**
     * جغرافیائی خصوصیت کی قسم جو جگہ ہے۔
     * مثال کے طور پر، "شہر"، "علاقہ"، "پہاڑی"، "پانی" وغیرہ۔
     */
    featureType?: string;

    /**
     * اس جگہ کا عرض البلد اور عرض البلد۔
     */
    latitude?: number;
    longitude?: number;

    /**
     * بائبل کے حوالہ جات کی تعداد جو اس جگہ کا ذکر کرتے ہیں۔
     */
    numberOfReferences: number;

    /**
     * اس جگہ کا API لنک۔
     */
    thisPlaceApiLink: string;
}
```

## ڈیٹا سیٹ سے جگہ حاصل کریں۔

`GET https://bible.helloao.org/api/d/{dataset}/places/{place}.json`

کسی ایک جگہ کے بارے میں معلومات حاصل کرتا ہے، بشمول بائبل کے حوالہ جات جن میں اس کا ذکر ہے اور اس سے متعلقہ افراد اور واقعات۔

-   `dataset` ڈیٹاسیٹ کی ID (مثلاً `theographic` )۔
-   `place` جگہ کی شناخت (مثلاً `jerusalem_636` )۔

### ساخت

```typescript:no-line-numbers title="dataset-place.ts"
export interface DatasetPlaceResponse {
    /**
     * اس جگہ کے لیے ڈیٹا سیٹ کی معلومات۔
     */
    dataset: Dataset;

    /**
     * جگہ کے بارے میں معلومات۔
     */
    place: DatasetPlace;

    /**
     * اس جگہ کا API لنک۔
     */
    thisPlaceApiLink: string;
}

interface DatasetPlace {
    /**
     * اس جگہ کی شناخت۔
     */
    id: string;

    /**
     * جگہ کا نام۔
     */
    name: string;

    /**
     * اس جگہ کا نام جیسا کہ یہ کنگ جیمز ورژن اور انگریزی معیاری ورژن میں ظاہر ہوتا ہے۔
     */
    kjvName?: string;
    esvName?: string;

    /**
     * دوسرے نام جن سے اس جگہ کو پکارا جاتا ہے۔
     */
    aliases?: string[];

    /**
     * جغرافیائی خصوصیت کی قسم جو جگہ ہے۔
     */
    featureType?: string;
    featureSubType?: string;

    /**
     * جگہ کا عرض البلد اور طول البلد، اور وہ کتنے درست ہیں۔
     */
    latitude?: number;
    longitude?: number;
    precision?: string;

    /**
     * جگہ کی تفصیل۔ ہر تار ایک پیراگراف ہے۔
     */
    description?: string[];

    /**
     * ڈیٹا سیٹ کے مصنفین کی طرف سے جگہ پر تبصرہ۔
     */
    comment?: string;

    /**
     * اس جگہ کی جڑ کی جگہ۔
     * ایک ہی جغرافیائی محل وقوع کے لیے مختلف نام ایک ہی جڑ کی جگہ کا اشتراک کرتے ہیں۔
     */
    rootPlace?: DatasetEntityRef;

    /**
     * وہ جگہ جس کی یہ جگہ نقل ہے۔
     */
    duplicateOf?: DatasetEntityRef;

    /**
     * وہ لوگ جو اس جگہ پر رہے ہیں، اس جگہ پر پیدا ہوئے، یا اس جگہ پر فوت ہوئے۔
     */
    people?: DatasetEntityRef[];
    peopleBorn?: DatasetEntityRef[];
    peopleDied?: DatasetEntityRef[];

    /**
     * وہ واقعات جو اس مقام پر پیش آئے۔
     */
    events?: DatasetEntityRef[];

    /**
     * بائبل کے حوالہ جات کی فہرست جو اس جگہ کا ذکر کرتی ہے۔
     * کتابی ترتیب، باب اور آیت کے لحاظ سے ترتیب دیا گیا ہے۔
     */
    references: VerseRef[];
}
```

### مثال

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

## ڈیٹا سیٹ میں واقعات کی فہرست بنائیں

`GET https://bible.helloao.org/api/d/{dataset}/events.json`

دیئے گئے ڈیٹاسیٹ کے لیے دستیاب واقعات کی فہرست حاصل کرتا ہے۔

-   `dataset` ڈیٹاسیٹ کی ID (مثلاً `theographic` )۔

### ساخت

```typescript:no-line-numbers title="dataset-events.ts"
export interface DatasetEvents {
    /**
     * واقعات کے لیے ڈیٹا سیٹ کی معلومات۔
     */
    dataset: Dataset;

    /**
     * واقعات کی فہرست جو ڈیٹاسیٹ کے لیے دستیاب ہیں۔
     */
    events: DatasetEventSummary[];
}

interface DatasetEventSummary {
    /**
     * تقریب کی شناخت۔
     */
    id: string;

    /**
     * تقریب کا نام۔
     */
    name: string;

    /**
     * جس تاریخ کو ایونٹ شروع ہوا۔
     * منفی نمبر سال BC ہیں۔ مثبت اعداد سال AD ہیں۔
     * مزید مخصوص تاریخیں `YYYY-MM-DD` فارمیٹ استعمال کرتی ہیں۔
     */
    startDate?: string;

    /**
     * بائبل کے حوالہ جات کی تعداد جو واقعہ کو بیان کرتی ہے۔
     */
    numberOfReferences: number;

    /**
     * ایونٹ کا API لنک۔
     */
    thisEventApiLink: string;
}
```

## ڈیٹا سیٹ سے ایونٹ حاصل کریں۔

`GET https://bible.helloao.org/api/d/{dataset}/events/{event}.json`

کسی ایک واقعہ کے بارے میں معلومات حاصل کرتا ہے، بشمول بائبل کے حوالہ جات جو اسے اور اس سے متعلقہ لوگوں، مقامات اور لوگوں کے گروپوں کو بیان کرتے ہیں۔

-   `dataset` ڈیٹاسیٹ کی ID (مثلاً `theographic` )۔
-   `event` ایونٹ کی ID (مثال کے طور پر `saul-is-converted_326` )۔

### ساخت

```typescript:no-line-numbers title="dataset-event.ts"
export interface DatasetEventResponse {
    /**
     * ایونٹ کے لیے ڈیٹا سیٹ کی معلومات۔
     */
    dataset: Dataset;

    /**
     * تقریب کے بارے میں معلومات۔
     */
    event: DatasetEvent;

    /**
     * اس ایونٹ کا API لنک۔
     */
    thisEventApiLink: string;
}

interface DatasetEvent {
    /**
     * تقریب کی شناخت۔
     */
    id: string;

    /**
     * تقریب کا نام۔
     */
    name: string;

    /**
     * جس تاریخ کو ایونٹ شروع ہوا۔
     */
    startDate?: string;

    /**
     * تقریب کا دورانیہ۔
     * مثال کے طور پر، "1D" ایک دن ہے اور "40Y" چالیس سال ہے۔
     */
    duration?: string;

    /**
     * جن لوگوں نے تقریب میں شرکت کی۔
     */
    participants?: DatasetEntityRef[];

    /**
     * جن مقامات پر یہ واقعہ پیش آیا۔
     */
    locations?: DatasetEntityRef[];

    /**
     * جن لوگوں نے اس تقریب میں شرکت کی۔
     */
    groups?: DatasetEntityRef[];

    /**
     * یہ واقعہ جس کا ایک حصہ ہے۔
     */
    partOf?: DatasetEntityRef;

    /**
     * اس واقعہ سے پہلے جو واقعہ ہوا۔
     */
    predecessor?: DatasetEntityRef;

    /**
     * بائبل کے حوالہ جات کی فہرست جو واقعہ کو بیان کرتی ہے۔
     * کتابی ترتیب، باب اور آیت کے لحاظ سے ترتیب دیا گیا ہے۔
     */
    references: VerseRef[];
}
```

### مثال

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

## ڈیٹا سیٹ میں لوگوں کے گروپس کی فہرست بنائیں

`GET https://bible.helloao.org/api/d/{dataset}/groups.json`

لوگوں کے گروپوں کی فہرست حاصل کرتا ہے جو دیے گئے ڈیٹاسیٹ کے لیے دستیاب ہیں۔

-   `dataset` ڈیٹاسیٹ کی ID (مثلاً `theographic` )۔

### ساخت

```typescript:no-line-numbers title="dataset-people-groups.ts"
export interface DatasetPeopleGroups {
    /**
     * لوگوں کے گروپوں کے لیے ڈیٹا سیٹ کی معلومات۔
     */
    dataset: Dataset;

    /**
     * لوگوں کے گروپوں کی فہرست جو ڈیٹا سیٹ کے لیے دستیاب ہیں۔
     */
    groups: DatasetPeopleGroupSummary[];
}

interface DatasetPeopleGroupSummary {
    /**
     * لوگوں کے گروپ کی شناخت۔
     */
    id: string;

    /**
     * لوگوں کے گروپ کا نام۔
     */
    name: string;

    /**
     * لوگوں کی تعداد جو لوگ گروپ کے ممبر ہیں۔
     */
    numberOfMembers: number;

    /**
     * لوگوں کے گروپ کے لیے API لنک۔
     */
    thisPeopleGroupApiLink: string;
}
```

## ڈیٹا سیٹ سے لوگوں کا گروپ حاصل کریں۔

`GET https://bible.helloao.org/api/d/{dataset}/groups/{group}.json`

ایک واحد افراد کے گروپ کے بارے میں معلومات حاصل کرتا ہے، بشمول اس کے اراکین اور ان ایونٹس جن میں گروپ نے حصہ لیا۔

-   `dataset` ڈیٹاسیٹ کی ID (مثلاً `theographic` )۔
-   `group` لوگوں کے گروپ کی شناخت (مثال کے طور پر `tribe-of-benjamin` )۔

### ساخت

```typescript:no-line-numbers title="dataset-people-group.ts"
export interface DatasetPeopleGroupResponse {
    /**
     * لوگوں کے گروپ کے لیے ڈیٹا سیٹ کی معلومات۔
     */
    dataset: Dataset;

    /**
     * لوگوں کے گروپ کے بارے میں معلومات۔
     */
    group: DatasetPeopleGroup;

    /**
     * اس لوگوں کے گروپ کا API لنک۔
     */
    thisPeopleGroupApiLink: string;
}

interface DatasetPeopleGroup {
    /**
     * لوگوں کے گروپ کی شناخت۔
     */
    id: string;

    /**
     * لوگوں کے گروپ کا نام۔
     */
    name: string;

    /**
     * وہ لوگ جو لوگوں کے گروپ کے ممبر ہیں۔
     */
    members?: DatasetEntityRef[];

    /**
     * جن تقاریب میں لوگوں نے شرکت کی۔
     */
    events?: DatasetEntityRef[];

    /**
     * بائبل کے حوالہ جات کی فہرست جس میں لوگوں کے گروپ کا ذکر ہے۔
     * کتابی ترتیب، باب اور آیت کے لحاظ سے ترتیب دیا گیا ہے۔
     */
    references: VerseRef[];
}
```

### مثال

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
