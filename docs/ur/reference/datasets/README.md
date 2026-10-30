# ڈیٹاسیٹس

ضمنی بائبل ڈیٹاسیٹس کو براؤز کرنے کے اختتامی نکات - جیسے کراس حوالہ جات، بائبل کے اداروں (لوگ، مقامات، واقعات، اور لوگوں کے گروپ)، اصل زبان کے بین خطی الفاظ، لغت، اور دن کے امیدواروں کی آیت - اور ان کی کتابیں، باب کے مواد، اداروں، لغت کے اندراجات، اور آیات کی فہرستیں حاصل کرنا۔

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
     * لائسنس کے لیے API کے شامل کردہ نوٹس۔
     * اگر کوئی نوٹ نہیں ہے تو کالعدم یا غیر متعینہ۔
     */
    licenseNotes?: string | null;

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
     * 0 ڈیٹاسیٹس کے لیے جن میں کراس حوالہ جات نہیں ہوتے ہیں۔
     */
    totalNumberOfReferences: number;

    /**
     * انٹر لائنر الفاظ کی کل تعداد جو اس ڈیٹاسیٹ میں موجود ہیں۔
     * اگر ڈیٹاسیٹ میں انٹر لائنر الفاظ شامل نہیں ہیں تو چھوڑ دیا جائے گا۔
     */
    totalNumberOfWords?: number;

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

    /**
     * ڈیٹاسیٹ میں لغت کے اندراجات کی فہرست کے لیے API لنک۔
     * اگر ڈیٹاسیٹ میں لغت کے اندراجات شامل نہیں ہیں تو چھوڑ دیا جائے گا۔
     */
    listOfLexiconApiLink?: string;

    /**
     * لغت کے اندراجات کی کل تعداد جو ڈیٹاسیٹ میں موجود ہیں۔
     * اگر ڈیٹاسیٹ میں لغت کے اندراجات شامل نہیں ہیں تو چھوڑ دیا جائے گا۔
     */
    totalNumberOfLexicon?: number;

    /**
     * ڈیٹاسیٹ میں ہر آیت کی فہرست کے لیے API لنک، اس کے زمروں کے ساتھ۔
     * اگر ڈیٹاسیٹ کی آیات میں زمرے نہیں ہیں تو حذف کر دیا جائے گا۔
     */
    listOfVersesApiLink?: string;

    /**
     * ڈیٹاسیٹ میں آیت کے زمروں کی فہرست کے لیے API لنک۔
     * اگر ڈیٹاسیٹ میں آیت کے زمرے شامل نہیں ہیں تو اسے چھوڑ دیا جائے گا۔
     */
    listOfCategoriesApiLink?: string;

    /**
     * آیات کے زمروں کی کل تعداد جو ڈیٹاسیٹ میں موجود ہیں۔
     * اگر ڈیٹاسیٹ میں آیت کے زمرے شامل نہیں ہیں تو اسے چھوڑ دیا جائے گا۔
     */
    totalNumberOfCategories?: number;
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

کراس ریفرینس ڈیٹاسیٹس کے لیے (جیسے `open-cross-ref` )، باب میں ہر آیت کے لیے کراس حوالہ جات کی فہرست شامل ہے۔ انٹر لائنر ڈیٹاسیٹس کے لیے (جیسے `bsb-interlinear` )، باب میں ہر آیت کے اصل زبان کے الفاظ ہیں - [انٹر لائنر ڈیٹاسیٹس](#interlinear-datasets) دیکھیں۔ ہستی ڈیٹاسیٹس کے لیے (جیسے `theographic` )، باب میں وہ لوگ، مقامات اور واقعات شامل ہیں جو باب میں نظر آتے ہیں - دیکھیں [ایک باب میں ہستی حاصل کریں](#get-the-entities-in-a-chapter) ۔ `verse-of-the-day` ڈیٹاسیٹ کے لیے، باب میں باب میں امیدواروں اور ان کے زمرے میں دن کی آیت شامل ہے - [دن کی آیت](#verse-of-the-day) دیکھیں۔

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

/**
 * ایک آیت میں `references` (کراس ریفرنس ڈیٹاسیٹ)، `words` (انٹر لائنر ڈیٹاسیٹ) یا `categories` (آیت کا دن کا ڈیٹاسیٹ) ہوتا ہے۔
 * چیک کریں کہ کون سا `'words' in verse` یا `'categories' in verse` کے ساتھ موجود ہے۔
 */
type DatasetVerse =
    | DatasetReferencesVerse
    | DatasetWordsVerse
    | DatasetCategoriesVerse;

interface DatasetReferencesVerse {
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

interface DatasetWordsVerse {
    /**
     * آیت کی تعداد۔
     */
    verse: number;

    /**
     * آیت کے اصل زبان کے الفاظ، اصل متن کی ترتیب میں۔
     * ذیل میں "انٹر لائنر ڈیٹاسیٹس" دیکھیں۔
     */
    words: InterlinearWord[];
}

interface DatasetCategoriesVerse {
    /**
     * آیت کی تعداد۔
     * اگر `endVerse` موجود ہے تو یہ وہ آیت ہے جس سے عبارت شروع ہوتی ہے۔
     */
    verse: number;

    /**
     * وہ آیت جس پر یہ عبارت ختم ہوتی ہے۔
     * اگر اندراج ایک آیت ہے تو چھوڑ دیا جائے گا۔
     */
    endVerse?: number;

    /**
     * ان زمروں کی IDs جن سے آیت کا تعلق ہے، سب سے پہلے۔
     * ذیل میں "آیت آف دی ڈے" دیکھیں۔
     */
    categories: string[];

    /**
     * پہلا سال کہ آیت دن کی آیت ہو سکتی ہے۔
     * اگر آیت ہمیشہ فہرست میں رہی ہو۔
     */
    addedIn?: number;

    /**
     * پہلا سال کہ آیت اب دن کی آیت نہیں رہ سکتی۔
     * ہٹائی گئی آیات ڈیٹاسیٹ میں رہتی ہیں تاکہ پچھلے سالوں کی آیات کو اب بھی اٹھایا جا سکے۔
     * اگر آیت کو فہرست سے نہیں ہٹایا گیا ہے تو خارج کر دیا گیا ہے۔
     */
    removedIn?: number;
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

// InterlinearWord کی ساخت کے لیے نیچے "Interlinear Datasets" دیکھیں۔
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

[ہسٹری گلوب](https://historyglobe.app) ڈیٹاسیٹ ( `history-globe` ) صرف مقامات پر مشتمل ہے: بائبل میں جن مقامات کا نام دیا گیا ہے، ان کے نقاط کے ساتھ اور آیات جو ان کے نام رکھتی ہیں۔ اس کی جگہ کی IDs (مثلاً یروشلم کے لیے `a15257a` ) ہسٹری گلوب کی مستحکم جگہ کی IDs ہیں، وہی جو اس کا اپنا [اوپن ڈیٹا API](https://historyglobe.app/docs/api.html) استعمال کرتا ہے، اس لیے جب کسی نام کو درست کیا جاتا ہے تو وہ تبدیل نہیں ہوتے ہیں۔ اس کی `featureType` اقدار ان کی پیروی کرتی ہیں جو تھیوگرافک ڈیٹاسیٹ استعمال کرتا ہے ( `City` , `Region` , `Water` , اور اسی طرح ) اور `featureSubType` زیادہ مخصوص قسم کا حامل ہوتا ہے جہاں ایک ہوتا ہے ( مثلاً `River` , `Gate` , `Spring` )۔

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
     * ایک ہی باب میں متواتر آیات کو ایک ہی حوالہ میں سمٹ دیا گیا ہے۔
     */
    endVerse?: number;
}
```

### تاریخ گلوب انتساب

ہسٹری گلوب ڈیٹا [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) کے تحت لائسنس یافتہ ہے۔ اگر آپ اسے استعمال کرتے ہیں تو، ہسٹری گلوب ( https://historyglobe.app ) اور OpenBible.info بائبل جیو کوڈنگ ڈیٹا کو کریڈٹ کریں جس پر یہ بناتا ہے، اور کسی بھی تبدیلی کو نوٹ کریں۔ ڈیٹاسیٹ کی `licenseNotes` پراپرٹی کریڈٹ رکھتی ہے۔

## ایک باب میں اداروں کو حاصل کریں۔

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

ہستی ڈیٹاسیٹس کے لیے، وہ لوگ، مقامات اور واقعات حاصل کرتے ہیں جو ایک باب میں ظاہر ہوتے ہیں، اس باب میں آیت نمبروں کے ساتھ جہاں ہر ایک کا ذکر کیا گیا ہے۔

-   `dataset` ڈیٹاسیٹ کی ID (مثلاً `theographic` )۔
-   `book` کتاب کی شناخت ہے (مثال کے طور پر پیدائش کے لیے `GEN` )۔
-   `chapter` عددی باب نمبر ہے (مثلاً `1` پہلے باب کے لیے)۔

ان کتابوں اور ابواب کی فہرست جن میں ہستی کا ڈیٹا موجود ہے `GET https://bible.helloao.org/api/d/{dataset}/books.json` سے دستیاب ہے، جو [ڈیٹا سیٹ کی کتابوں کے اختتامی نقطہ کی](#list-books-in-a-dataset) طرح کی ساخت کی پیروی کرتا ہے۔ ہستی ڈیٹاسیٹس کے لیے، `totalNumberOfVerses` آیات کی تعداد ہے جن کا ذکر کم از کم ایک ہستی کے ذریعے کیا گیا ہے اور `totalNumberOfReferences` ہستی-آیت کے تذکروں کی کل تعداد ہے۔

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
     * دوسرے نام جن سے وہ شخص پکارا جاتا ہے۔
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

دیے گئے ڈیٹاسیٹ کے لیے دستیاب جگہوں کی فہرست حاصل کرتا ہے۔

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

-   `dataset` ڈیٹاسیٹ کی ID (مثال کے طور پر `theographic` )۔

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

## انٹر لائنر ڈیٹاسیٹس

بیرین انٹر لائنر ڈیٹاسیٹ ( `bsb-interlinear` ) بائبل کی ہر آیت کے اصل زبان (عبرانی، آرامی اور یونانی) الفاظ کی فہرست دیتا ہے، جس ترتیب سے وہ اصل متن میں ظاہر ہوتے ہیں۔ ہر لفظ کا اس کی نقل حرفی، گرائمیکل تجزیہ، [مضبوط نمبر](https://en.wikipedia.org/wiki/Strong%27s_Concordance) ، اور انگریزی جملہ ہے جو [بیرین اسٹینڈرڈ بائبل](https://berean.bible) اس کے لیے استعمال کرتی ہے۔

ڈیٹاسیٹ دوسرے ڈیٹاسیٹس کی طرح ہی اینڈ پوائنٹس کا استعمال کرتا ہے:

-   `GET https://bible.helloao.org/api/d/bsb-interlinear/books.json` 66 کتابوں کی فہرست دیتا ہے۔
-   `GET https://bible.helloao.org/api/d/bsb-interlinear/{book}/{chapter}.json` (مثال کے طور پر `/api/d/bsb-interlinear/GEN/1.json` ) ہر آیت کے لیے `{ verse, words }` کے ساتھ باب لوٹاتا ہے۔ جواب ایک [ڈیٹاسیٹ باب](#get-a-chapter-from-a-dataset) ہے۔

الفاظ کا ڈیٹا [بیرین اسٹینڈرڈ بائبل انٹر لائنر ٹیبلز](https://bereanbible.com/) سے آتا ہے، جو پبلک ڈومین میں ہیں۔ الفاظ کے لیے مضبوط اعداد کو [لغت](#lexicon) ( `stepbible-lexicon` ) میں دیکھا گیا ہے۔

### ساخت

```typescript:no-line-numbers title="interlinear-word.ts"
interface InterlinearWord {
    /**
     * اصل متن کی ترتیب میں لفظ کا 1 پر مبنی درجہ۔
     * الفاظ اس ترتیب میں درج ہیں۔
     */
    pos: number;

    /**
     * بیرین اسٹینڈرڈ بائبل کے انگریزی ترتیب میں لفظ کا 1 پر مبنی درجہ۔
     */
    bsbPos: number;

    /**
     * لفظ کی زبان۔
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * اصل رسم الخط میں لفظ۔ NFC- معمول کے مطابق۔
     */
    text: string;

    /**
     * لفظ کی نقل حرفی۔
     */
    transliteration: string | null;

    /**
     * لفظ کا مختصر گراماتی تجزیہ کوڈ۔ مثال کے طور پر "N-mp" یا "V-Qal-Perf-3ms"۔
     */
    parsing: string | null;

    /**
     * لفظ کی ہجے شدہ گرائمیکل تجزیہ۔
     */
    parsingFull: string | null;

    /**
     * لفظ کا صفر پیڈڈ Strong کا نمبر۔ مثال کے طور پر "H0430" یا "G3056"۔
     * زیرو پیڈڈ، جو KJV کی `.words.json` اقدار سے میل کھاتا ہے۔
     * دیگر تراجم کی قدروں میں شامل ہونے سے پہلے زیرو پیڈنگ اور لاحقہ اتارنے کی ضرورت ہو سکتی ہے۔
     * null جب ماخذ لفظ کو no Strong کا نمبر دیتا ہے (یہ معاملہ کچھ الفاظ کے لیے ہے جو لاحقہ ہیں، جیسے ضمیر کے لاحقے)۔
     */
    strongs: string | null;

    /**
     * اس لفظ کے لیے دی بیرین اسٹینڈرڈ بائبل کا انگریزی جملہ۔
     * کالعدم جب بی ایس بی لفظ کو بغیر ترجمہ کے چھوڑ دیتا ہے (جیسے عبرانی براہ راست آبجیکٹ مارکر)۔
     */
    gloss: string | null;
}
```

### مثال

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

### الفاظ کو ترجمے سے جوڑنا

انٹر لائنر `strongs` قدریں زیرو پیڈڈ ہیں (جیسے `H0430` )۔ یہ KJV کے لفظ تشریحات ( `/api/eng_kjv/{book}/{chapter}.words.json` ) میں `strongs` اقدار سے میل کھاتا ہے۔ دیگر تراجم کی اقدار کو جوڑنے سے پہلے زیرو پیڈنگ اور لاحقہ اتارنے کی ضرورت ہو سکتی ہے (مثلاً `H430` یا `H1961a` سے `H0430` اور `H1961` )۔

-   **کے جے وی۔** کنگ جیمز ورژن ( `eng_kjv` اور `eng_kja` ) کے لیے، ایک باب کی `.words.json` فائل میں ایک ہی آیت کے بین لائنر الفاظ میں سے `strongs` کے ساتھ Strong کے نمبرز شامل کریں۔ مثال کے طور پر، آیت 1 ( `H7225` ، `H1254` ، `H0430` ، `H0853` ، `H8064` ، `H0776` ) کے لیے `/api/eng_kjv/GEN/1.words.json` میں بیان کردہ ہر مضبوط نمبر `/api/d/bsb-interlinear/GEN/1.json` میں آیت 1 کے الفاظ میں `strongs` کی قدر کے طور پر ظاہر ہوتا ہے۔
-   **بیرین معیاری بائبل۔** ہر لفظ کا `gloss` اس لفظ کا BSB جملہ ہے۔ آیت کے الفاظ کو `bsbPos` ترتیب میں چلائیں اور ہر `gloss` BSB ترجمے کے آیت کے متن سے ملا کر یہ معلوم کریں کہ لفظ کا ترجمہ کہاں بیٹھا ہے۔

دونوں ذرائع کی تعداد ہمیشہ متفق نہیں ہوتی ہے۔ مثال کے طور پر، KJV ٹیگز "was" بطور `G2258` جہاں بیرین ٹیبل میں `G1510` ہے۔ اس طرح کے اختلافات کی وجہ سے چند جوائن مس ہو جاتے ہیں۔

### انتساب

بیرین انٹر لائنر ٹیبلز پبلک ڈومین میں ہیں۔ [لغت](#lexicon) CC BY 4.0 کے تحت لائسنس یافتہ ہے اور اسے انتساب کی ضرورت ہے۔

## لغت

STEPBible لغت کا ڈیٹاسیٹ ( `stepbible-lexicon` ) Tyndale House، کیمبرج میں [STEPBible.org](https://www.stepbible.org/) سے عبرانی، آرامی، اور یونانی مختصر لغت (TBESH اور TBESG) پر مشتمل ہے۔ اس میں ہر بیس اسٹرانگ کے نمبر کے لیے ایک اندراج ہے، اور ہر اندراج میں لیما، نقل حرفی، تقریر کا حصہ، انگریزی چمک، اور تعریف کے ساتھ ایک یا زیادہ حواس ہوتے ہیں۔

[انٹر لائنر لفظ](#interlinear-datasets) سے کوئی بھی صفر پیڈڈ `strongs` ویلیو جس میں لغت کا اندراج ہو اسے بغیر فارمیٹنگ کے `/api/d/stepbible-lexicon/lexicon/{strongs}.json` پر دیکھا جا سکتا ہے۔ KJV کی `.words.json` اقدار کے لیے بھی ایسا ہی ہے۔ دیگر تراجم کی اقدار کو پہلے زیرو پیڈنگ اور لاحقہ اتارنے کی ضرورت ہو سکتی ہے۔ یونانی اندراجات جو لغت میں بغیر کسی مضبوط نمبر کے شامل کیے جاتے ہیں شائع نہیں ہوتے ہیں۔

ڈیٹاسیٹس جو لغت کے اندراجات پر مشتمل ہیں ان کے اندراج میں `/api/available_datasets.json` میں `listOfLexiconApiLink` اور `totalNumberOfLexicon` شامل ہیں۔

### انتساب

لغت کا ڈیٹا [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) کے تحت لائسنس یافتہ ہے۔ اگر آپ اسے استعمال کرتے ہیں تو، STEPBible.org/Tyndale House, Cambridge کو کریڈٹ کریں، اور کسی بھی تبدیلی کو نوٹ کریں۔ ڈیٹا سیٹ کی `licenseNotes` پراپرٹی کریڈٹ رکھتی ہے۔

## ایک ڈیٹاسیٹ میں لغت کے اندراجات کی فہرست بنائیں

`GET https://bible.helloao.org/api/d/{dataset}/lexicon.json`

لغت کے اندراجات کی فہرست حاصل کرتا ہے جو ڈیٹاسیٹ کے لیے دستیاب ہیں۔

-   `dataset` ڈیٹاسیٹ کی ID (مثلاً `stepbible-lexicon` )۔

### کوڈ کی مثال

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

### ساخت

```typescript:no-line-numbers title="dataset-lexicon.ts"
export interface DatasetLexicon {
    /**
     * لغت کے لیے ڈیٹا سیٹ کی معلومات۔
     */
    dataset: Dataset;

    /**
     * لغت کے اندراجات کی فہرست جو ڈیٹاسیٹ کے لیے دستیاب ہیں۔
     */
    lexicon: DatasetLexiconEntrySummary[];
}

export interface DatasetLexiconEntrySummary {
    /**
     * لغت کے اندراج کے زیرو پیڈڈ Strong کا نمبر۔ مثال کے طور پر "H0430"۔
     */
    id: string;

    /**
     * لغت کے اندراج کی زبان۔
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * لغت کے اندراج کا نام۔
     * یہ اندراج کے پہلے احساس کا لیما ہے۔
     */
    name: string;

    /**
     * لغت کے اندراج کے لیے API کا لنک۔
     */
    apiLink: string;
}
```

### مثال

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

## ڈیٹا سیٹ سے لیکسیکن اندراج حاصل کریں۔

`GET https://bible.helloao.org/api/d/{dataset}/lexicon/{strongs}.json`

اس کے تمام حواس کے ساتھ، واحد بیس Strong کے نمبر کے لیے لغت کا اندراج حاصل کرتا ہے۔

-   `dataset` ڈیٹاسیٹ کی ID (مثلاً `stepbible-lexicon` )۔
-   `strongs` صفر پیڈڈ Strong کا نمبر ہے (مثال کے طور پر عبرانی لفظ _elohim_ کے لیے `H0430` ، یا یونانی لفظ _logos_ کے لیے `G3056` )۔

### کوڈ کی مثال

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

### ساخت

```typescript:no-line-numbers title="dataset-lexicon-entry.ts"
export interface DatasetLexiconEntry {
    /**
     * لغت کے اندراج کے لیے ڈیٹا سیٹ کی معلومات۔
     */
    dataset: Dataset;

    /**
     * لغت کا اندراج۔
     */
    entry: DatasetLexiconEntryContent;

    /**
     * اس لغت کے اندراج کا API لنک۔
     */
    thisLexiconEntryApiLink: string;
}

export interface DatasetLexiconEntryContent {
    /**
     * اندراج کا زیرو پیڈڈ Strong کا نمبر۔ مثال کے طور پر "H0430"۔
     */
    id: string;

    /**
     * اندراج کی زبان۔
     * یہ اندراج کے پہلے احساس کی زبان ہے۔
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * اندراج کے حواس، شناختی ترتیب میں۔
     */
    senses: DatasetLexiconSense[];
}

export interface DatasetLexiconSense {
    /**
     * احساس کی توسیع شدہ ID۔ مثال کے طور پر "H0001G"۔
     * بیس Strong کے نمبر کے برابر جب نمبر کا واحد احساس ہو۔
     */
    id: string;

    /**
     * احساس کی زبان۔
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * اصل رسم الخط میں احساس کا لیما۔
     */
    lemma: string;

    /**
     * لیما کی نقل حرفی۔
     */
    transliteration: string | null;

    /**
     * تقریر کا حصہ (مورفولوجی) احساس کا ضابطہ۔
     */
    partOfSpeech: string | null;

    /**
     * احساس کی مختصر انگریزی چمک۔
     */
    gloss: string | null;

    /**
     * سادہ متن کے طور پر احساس کی تعریف۔
     * پیراگراف کو خالی لائنوں سے الگ کیا گیا ہے۔ ماخذ میں مارک اپ ہٹا دیا گیا ہے۔
     */
    definition: string;
}
```

### مثال

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

## دن کی آیت

آیت آف دی ڈے ڈیٹاسیٹ ( `verse-of-the-day` ) معروف آیات اور مختصر اقتباسات (زیادہ سے زیادہ تین آیات) کی ایک ترتیب شدہ فہرست ہے جو "دن کی آیت" کے لیے اچھے امیدوار بناتے ہیں: سال کے ہر دن کے لیے 640 سے زیادہ، اور مسیحی تعطیلات کے لیے 100 سے زیادہ۔ ہر ایک اپنے طور پر سمجھتا ہے۔

ہر دن کے لیے ہر آیت میں ایک سے تین زمرے ہوتے ہیں، سب سے پہلے سب سے زیادہ متعلقہ، اس مقررہ مجموعہ سے:

| ID            | تفصیل                                                       |
| ------------- | ----------------------------------------------------------- |
| `comfort`     | غم، مصیبت، اور تنہائی میں خدا کی قربت اور دیکھ بھال۔        |
| `courage`     | ثابت قدم رہنا اور ڈرنا نہیں۔                                |
| `faith`       | خدا اور اس کے وعدوں پر بھروسہ۔                              |
| `forgiveness` | خدا کا گناہ معاف کرنا اور دوسروں کو معاف کرنا۔              |
| `gratitude`   | خدا کا شکر ادا کرنا۔                                        |
| `guidance`    | خدا ہمارے قدموں، منصوبوں اور فیصلوں کو ہدایت کرتا ہے۔       |
| `hope`        | مستقبل پر اعتماد جس کا خدا نے وعدہ کیا ہے۔                  |
| `inspiration` | ایمان کے مطابق زندگی گزارنے اور نیک کام کرنے کی ترغیب۔      |
| `joy`         | خُدا میں خوشی اور مسرت۔                                     |
| `love`        | ہمارے لئے خدا کی محبت اور خدا اور دوسروں کے لئے ہماری محبت۔ |
| `peace`       | آرام، سکون اور بے چینی سے آزادی۔                            |
| `praise`      | عبادت اور خدا کی عظمت کا اعلان۔                             |
| `prayer`      | خدا کو پکارنا اور اس کا وعدہ سننا۔                          |
| `provision`   | خدا فراہم کرتا ہے جس کی ہمیں ضرورت ہے۔                      |
| `salvation`   | نجات، فضل، اور مسیح میں نئی ​​زندگی۔                        |
| `strength`    | خدا طاقت اور استقامت دیتا ہے۔                               |
| `wisdom`      | خدا کی حکمت اور زندگی کے لیے عملی ہدایت۔                    |

تعطیلات کے اپنے زمرے ہوتے ہیں۔ چھٹی کے دن، دن کی آیت چھٹی کی آیات میں سے ایک ہے، اور وہ آیات دوسرے دنوں میں استعمال نہیں ہوتی ہیں۔ چھٹی عام طور پر ایک دن رہتی ہے۔ قیامت کے بعد اتوار قیامت کے اتوار کے بعد تین دن تک رہتا ہے، اس لیے یہ تینوں تاریخوں کو درج کرتا ہے۔ ہر چھٹی کے زمرے میں اس کی تاریخوں کے ساتھ `holiday` ہوتا ہے: ہر سال ایک ہی تاریخ پر ہونے والی تعطیلات میں `month` اور `day` ہوتا ہے، اور وہ تعطیلات جن کی تاریخ ہر سال تبدیل ہوتی ہے (کیونکہ وہ قیامت کے اتوار یا آمد پر منحصر ہوتی ہیں) ان کے `dates` گریگورین کیلنڈر میں درج کرتے ہیں، جو 2026 سے 2125 کے لیے پہلے سے مرتب کیے گئے ہیں۔

| ID                         | چھٹی               | تاریخ                        |
| -------------------------- | ------------------ | ---------------------------- |
| `epiphany`                 | ایپی فینی          | 6 جنوری                      |
| `ash-wednesday`            | راکھ بدھ           | اتوار کو قیامت سے 46 دن پہلے |
| `palm-sunday`              | پام سنڈے           | قیامت سے پہلے کا اتوار       |
| `maundy-thursday`          | منڈی جمعرات        | قیامت سے پہلے جمعرات اتوار   |
| `good-friday`              | جمعہ مبارک         | قیامت سے پہلے جمعہ اتوار     |
| `resurrection-sunday`      | قیامت بروز اتوار   | ایسٹر اتوار                  |
| `post-resurrection-sunday` | قیامت کے بعد اتوار | قیامت کے تین دن بعد اتوار    |
| `ascension-day`            | معراج کا دن        | قیامت کے 39 دن بعد اتوار     |
| `pentecost`                | پینٹی کوسٹ         | قیامت کے 49 دن بعد اتوار     |
| `all-hallows-eve`          | آل ہیلوز کی شام    | 31 اکتوبر                    |
| `all-saints-day`           | تمام سنتوں کا دن   | یکم نومبر                    |
| `advent-sunday`            | آمد کا پہلا اتوار  | کرسمس سے پہلے چوتھا اتوار    |
| `christmas-eve`            | کرسمس کی شام       | 24 دسمبر                     |
| `christmas`                | کرسمس              | 25 دسمبر                     |

ڈیٹاسیٹ میں صرف حوالہ جات ہوتے ہیں، آیت کا متن نہیں، لہذا یہ ہر ترجمہ کے ساتھ کام کرتا ہے۔ آیات کے نمبر معیاری انگریزی نمبر استعمال کرتے ہیں (بی ایس بی کی طرح)۔ ڈیٹا کو تین طریقوں سے پڑھا جا سکتا ہے:

-   [`/api/d/verse-of-the-day/verses.json`](#list-verses-in-a-dataset) ڈیٹاسیٹ میں ہر آیت کو اس کے زمروں کے ساتھ، اور چھٹیوں کو ان کی تاریخوں کے ساتھ، ایک فائل میں درج کرتا ہے۔
-   [`/api/d/verse-of-the-day/categories/{category}.json`](#get-a-category-from-a-dataset) ہر آیت کو زمرے میں درج کرتا ہے۔ یہ ایک زمرہ سے دن کی ایک آیت منتخب کرنے کا سب سے آسان طریقہ ہے۔
-   [`/api/d/verse-of-the-day/{book}/{chapter}.json`](#get-a-chapter-from-a-dataset) ایک باب میں امیدواروں کو ان کے زمروں کے ساتھ لسٹ کرتا ہے۔ امیدوار پر مشتمل صرف ابواب دستیاب ہیں۔ انہیں تلاش کرنے کے لیے کتاب کے باب کے لنکس یا `/api/d/verse-of-the-day/books.json` استعمال کریں۔

ڈیٹاسیٹس جو آیت کے زمرے پر مشتمل ہیں ان کے اندراج میں `/api/available_datasets.json` میں `listOfVersesApiLink` ، `listOfCategoriesApiLink` اور `totalNumberOfCategories` شامل ہیں۔

### دن کی ایک آیت کا انتخاب

API جامد فائلوں سے بنا ہے، لہذا یہ آپ کے لیے کوئی آیت منتخب نہیں کرتا ہے۔ اس کے بجائے، ایک کو چننے کے لیے ایک کنونشن ہے، تاکہ اس کی پیروی کرنے والی ہر ایپ اسی دن ایک ہی آیت دکھائے۔ ایپس مختلف طریقے سے منتخب کرنے کے لیے آزاد ہیں۔ کنونشن انہیں صرف ایک مشترکہ ڈیفالٹ دیتا ہے۔

کنونشن `/api/d/verse-of-the-day/verses.json` میں آیات اور تعطیلات سے چنتا ہے۔ چھٹی کے دن، یہ تعطیل کی آیات میں سے ایک کو چنتا ہے، ایک وقت میں ایک سال ان کے ذریعے گزرتا ہے، اس لیے چھٹی کی ہر سال ایک مختلف آیت ہوتی ہے جب تک کہ اس کی تمام آیات استعمال نہ ہو جائیں۔ دوسرے دنوں میں، ہر سال ان آیات کا اپنا شفل کرتا ہے جو اس سال استعمال میں ہیں (ہر آیت کے حوالہ کے ایک ہیش کے ذریعہ ترتیب دیا گیا ہے، سال، اور ایک اختیاری بیج) اور دن کی آیت اس شفل میں سال کی تاریخ کے دن والی ہے۔ ڈیٹا سیٹ میں ہر سال استعمال ہونے والے ہر دن کے لیے 366 ​​سے زیادہ آیات ہیں، اس لیے ایک آیت کیلنڈر سال میں کبھی نہیں دہرائی جاتی، ترتیب ہر سال بدلتی ہے، اور ایک ہی تاریخ ہمیشہ ایک ہی آیت دیتی ہے۔ نئی آیات کو شامل کیا جاتا ہے ( `addedIn` کے ساتھ) اور پرانی آیات کو ہٹا دیا جاتا ہے ( `removedIn` کے ساتھ) صرف ایک سال سے جو ابھی شروع نہیں ہوا ہے، اس لیے گزشتہ تاریخ کے لیے دن کی آیت کبھی نہیں بدلتی ہے۔

[دن کے کنونشن کی آیت کا](./verse-of-the-day-convention.md) صفحہ الگورتھم کو مرحلہ وار، سیڈوکوڈ اور ٹیسٹ ویلیوز کے ساتھ بتاتا ہے، تاکہ آپ اسے کسی بھی زبان میں نافذ کر سکیں۔

اپنا آرڈر استعمال کرنے کے لیے، اپنا ایک بیج چنیں (مثال کے طور پر، آپ کی ایپ کا نام): یہ ایک ہی گارنٹی کے ساتھ ایک مختلف شفل دیتا ہے۔ آپ کسی ایک زمرے کی آیات میں سے بھی چن سکتے ہیں، لیکن ہر زمرے میں سال کے دنوں سے کم آیات ہیں، اس لیے اس کی آیات جلد دہرائی جاتی ہیں۔

SDKs کنونشن کی پیروی کرتے ہیں:

```ts:no-line-numbers title="verse-of-the-day.js"
import { FreeUseBibleApi } from 'free-use-bible-api';

const api = new FreeUseBibleApi();

// ایک تاریخ بطور YYYY-MM-DD، یا ایک تاریخ (اس کی مقامی کیلنڈر کی تاریخ استعمال کی جاتی ہے)۔ آج تک ڈیفالٹ۔
const ref = await api.getVerseOfTheDay('2026-01-01');

// ترجمہ سے آیت کا متن حاصل کریں۔
const chapter = await api.getTranslationBookChapter('BSB', ref.book, ref.chapter);
const verses = chapter.chapter.content.filter(
    (c) =>
        c.type === 'verse' &&
        c.number >= ref.verse &&
        c.number <= (ref.endVerse ?? ref.verse)
);
console.log(ref, verses);
```

-   `getVerseOfTheDay(date?, { seed?, category?, dataset? }?)` آیت کی فہرست کو ڈاؤن لوڈ کرتا ہے اور اس سے چنتا ہے۔ آپ کے پاس پہلے سے موجود فہرست میں سے `pickVerseOfTheDay(verses, date?, { seed?, category? }?)` انتخاب۔
-   کوٹلن SDK میں `getVerseOfTheDay(date?, seed?, category?)` اور `pickVerseOfTheDay(verses, date?, seed?, category?)` ہیں، جو تاریخ کو `YYYY-MM-DD` تار کے طور پر لیتے ہیں۔
-   Swift SDK میں `getVerseOfTheDay(date:seed:category:)` اور `pickVerseOfTheDay(_:date:seed:category:holidays:)` ہے، جو تاریخ کو `YYYY-MM-DD` سٹرنگ یا `Date` کے طور پر لیتے ہیں (موجودہ ٹائم زون میں اس کی کیلنڈر کی تاریخ استعمال کی جاتی ہے)۔
-   [MCP سرور](https://github.com/HelloAOLab/bible-api/tree/main/packages/seed-bible-mcp) کے پاس `getVerseOfTheDay` ٹول ہے جو دن کی آیت کو اس کے متن کے ساتھ لوٹاتا ہے۔
-   `@helloao/tools` پیکیج میں ایک ہی فہرست ہے اور `@helloao/tools/generation/verse-of-the-day.js` میں `getVerseOfTheDay(date?, { seed?, category? }?)` فنکشن ہے۔

### لائسنس

یہ فہرست AO Lab کے ذریعہ جمع کی گئی تھی اور [MIT لائسنس](https://github.com/HelloAOLab/bible-api/blob/main/LICENSE) کے تحت جاری کی گئی ہے۔ آیت کا متن اس ترجمہ سے آتا ہے جس سے آپ اسے لاتے ہیں۔

## ڈیٹا سیٹ میں آیات کی فہرست بنائیں

`GET https://bible.helloao.org/api/d/{dataset}/verses.json`

ڈیٹاسیٹ میں ہر آیت (یا مختصر اقتباس) حاصل کرتا ہے، ان زمروں کے ساتھ جن سے ہر ایک کا تعلق ہے، کینونیکل ترتیب میں۔ صرف ان ڈیٹاسیٹس کے لیے دستیاب ہے جن کی آیات کے زمرے ہیں، جیسے `verse-of-the-day` ۔

-   `dataset` ڈیٹاسیٹ کی ID (مثلاً `verse-of-the-day` )۔

### کوڈ کی مثال

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

### ساخت

```typescript:no-line-numbers title="dataset-verses.ts"
export interface DatasetVerses {
    /**
     * آیات کے لیے ڈیٹا سیٹ کی معلومات۔
     */
    dataset: Dataset;

    /**
     * ڈیٹاسیٹ میں ہر آیت (یا مختصر حوالہ)، اس کے زمروں کے ساتھ، کینونیکل ترتیب میں۔
     */
    verses: DatasetCategorizedVerse[];

    /**
     * وہ چھٹیاں جن کی اپنی آیات ہیں، اپنی تاریخوں کے ساتھ۔
     * اگر ڈیٹاسیٹ میں چھٹیاں نہیں ہیں تو چھوڑ دیا جائے گا۔
     */
    holidays?: DatasetVersesHoliday[];
}

export interface DatasetVersesHoliday extends DatasetCategoryHoliday {
    /**
     * چھٹی کے زمرے کی ID۔ مثال کے طور پر "کرسمس"۔
     */
    id: string;

    /**
     * چھٹی کا انگریزی نام۔ مثال کے طور پر "کرسمس"۔
     */
    name: string;
}

export interface DatasetCategoryHoliday {
    /**
     * مہینہ (1 جنوری کے لیے) اور چھٹی کا دن جو ہر سال ایک ہی تاریخ کو آتا ہے۔
     * چھٹیوں کے لیے چھوڑ دیا گیا جن کی تاریخ ہر سال بدلتی ہے۔
     */
    month?: number;
    day?: number;

    /**
     * چھٹیوں کی تاریخیں (YYYY-MM-DD، گریگورین کیلنڈر) جس کی تاریخ ترتیب کے مطابق ہر سال تبدیل ہوتی ہے۔
     * ان کی پہلے سے گنتی کئی سالوں کے لیے کی جاتی ہے (فی الحال 2026 سے 2125)، اور چھٹی صرف ان تاریخوں پر منائی جاتی ہے جو درج ہیں۔
     * ہر سال ایک ہی تاریخ کو آنے والی تعطیلات کے لیے چھوڑ دیا جاتا ہے۔
     */
    dates?: string[];
}

export interface DatasetCategorizedVerse {
    /**
     * کتاب کی شناخت۔ مثال کے طور پر "PRO"۔
     */
    book: string;

    /**
     * باب نمبر۔
     */
    chapter: number;

    /**
     * آیت نمبر۔
     * اگر `endVerse` موجود ہے تو یہ وہ آیت ہے جس سے عبارت شروع ہوتی ہے۔
     */
    verse: number;

    /**
     * وہ آیت جس پر یہ عبارت ختم ہوتی ہے۔
     * اگر اندراج ایک آیت ہے تو چھوڑ دیا جائے گا۔
     */
    endVerse?: number;

    /**
     * ان زمروں کی IDs جن سے آیت کا تعلق ہے، سب سے پہلے۔
     */
    categories: string[];

    /**
     * پہلا سال کہ آیت دن کی آیت ہو سکتی ہے۔
     * اگر آیت ہمیشہ فہرست میں رہی ہو۔
     */
    addedIn?: number;

    /**
     * پہلا سال کہ آیت اب دن کی آیت نہیں رہ سکتی۔
     * ہٹائی گئی آیات ڈیٹاسیٹ میں رہتی ہیں تاکہ پچھلے سالوں کی آیات کو اب بھی اٹھایا جا سکے۔
     * اگر آیت کو فہرست سے نہیں ہٹایا گیا ہے تو خارج کر دیا گیا ہے۔
     */
    removedIn?: number;
}
```

### مثال

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

## ڈیٹا سیٹ میں زمرہ جات کی فہرست بنائیں

`GET https://bible.helloao.org/api/d/{dataset}/categories.json`

آیات کے زمرے کی فہرست حاصل کرتا ہے جو ڈیٹاسیٹ کے لیے دستیاب ہیں۔

-   `dataset` ڈیٹاسیٹ کی ID (مثال کے طور پر `verse-of-the-day` )۔

### کوڈ کی مثال

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

### ساخت

```typescript:no-line-numbers title="dataset-categories.ts"
export interface DatasetCategories {
    /**
     * زمرہ جات کے لیے ڈیٹا سیٹ کی معلومات۔
     */
    dataset: Dataset;

    /**
     * آیات کے زمروں کی فہرست جو ڈیٹاسیٹ کے لیے دستیاب ہیں۔
     */
    categories: DatasetCategorySummary[];
}

export interface DatasetCategorySummary {
    /**
     * زمرہ کی شناخت۔ مثال کے طور پر "امید"۔
     */
    id: string;

    /**
     * زمرے کا انگریزی نام۔ مثال کے طور پر "امید"۔
     */
    name: string;

    /**
     * زمرہ میں آیات کس کے بارے میں ہیں اس کی تفصیل۔
     */
    description: string;

    /**
     * آیات کی تعداد (یا مختصر اقتباسات) جو زمرہ سے تعلق رکھتی ہیں۔
     */
    numberOfVerses: number;

    /**
     * چھٹی کی وہ تاریخیں جن کے لیے زمرہ ہے (اوپر DatasetCategoryHoliday دیکھیں)۔
     * ان زمروں کے لیے چھوڑ دیا گیا جو چھٹی کے لیے نہیں ہیں۔
     */
    holiday?: DatasetCategoryHoliday;

    /**
     * زمرہ کے لیے API لنک۔
     */
    apiLink: string;
}
```

### مثال

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

## ڈیٹا سیٹ سے ایک زمرہ حاصل کریں۔

`GET https://bible.helloao.org/api/d/{dataset}/categories/{category}.json`

ایک آیت کا زمرہ ملتا ہے، ہر اس آیت کے ساتھ جو اس سے تعلق رکھتی ہے۔

-   `dataset` ڈیٹاسیٹ کی ID (مثلاً `verse-of-the-day` )۔
-   `category` زمرہ کی شناخت ہے (مثلاً `hope` )۔

### کوڈ کی مثال

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

### ساخت

```typescript:no-line-numbers title="dataset-category.ts"
export interface DatasetCategoryResponse {
    /**
     * زمرہ کے لیے ڈیٹا سیٹ کی معلومات۔
     */
    dataset: Dataset;

    /**
     * زمرہ، ان آیات کے ساتھ جو اس سے تعلق رکھتی ہیں۔
     */
    category: DatasetCategory;

    /**
     * اس زمرے کے لیے API لنک۔
     */
    thisCategoryApiLink: string;
}

export interface DatasetCategory {
    /**
     * زمرہ کی شناخت۔ مثال کے طور پر "امید"۔
     */
    id: string;

    /**
     * زمرے کا انگریزی نام۔ مثال کے طور پر "امید"۔
     */
    name: string;

    /**
     * زمرہ میں آیات کس کے بارے میں ہیں اس کی تفصیل۔
     */
    description: string;

    /**
     * چھٹی کی وہ تاریخیں جن کے لیے زمرہ ہے ("ڈیٹا سیٹ میں آیات کی فہرست" میں DatasetCategoryHoliday دیکھیں)۔
     * ان تاریخوں پر، دن کی آیت زمرہ کی آیات میں سے ایک ہے، اور وہ دوسرے دنوں میں استعمال نہیں ہوتی ہیں۔
     * ان زمروں کے لیے چھوڑ دیا گیا جو چھٹی کے لیے نہیں ہیں۔
     */
    holiday?: DatasetCategoryHoliday;

    /**
     * وہ آیات (یا مختصر اقتباسات) جو کیننیکل ترتیب میں زمرہ سے تعلق رکھتی ہیں۔
     * اس میں وہ آیات شامل ہیں جو فہرست سے ہٹا دی گئی ہیں ( `removedIn` دیکھیں)۔
     */
    verses: DatasetCategoryVerse[];
}

export interface DatasetCategoryVerse {
    /**
     * کتاب کی شناخت۔ مثال کے طور پر "JER"۔
     */
    book: string;

    /**
     * باب نمبر۔
     */
    chapter: number;

    /**
     * آیت نمبر۔
     * اگر `endVerse` موجود ہے تو یہ وہ آیت ہے جس سے عبارت شروع ہوتی ہے۔
     */
    verse: number;

    /**
     * وہ آیت جس پر یہ عبارت ختم ہوتی ہے۔
     * اگر حوالہ ایک آیت ہے تو چھوڑ دیا جائے گا۔
     */
    endVerse?: number;

    /**
     * پہلا سال کہ آیت دن کی آیت ہو سکتی ہے۔
     * اگر آیت ہمیشہ فہرست میں رہی ہو۔
     */
    addedIn?: number;

    /**
     * پہلا سال کہ آیت اب دن کی آیت نہیں رہ سکتی۔
     * ہٹائی گئی آیات ڈیٹاسیٹ میں رہتی ہیں تاکہ پچھلے سالوں کی آیات کو اب بھی اٹھایا جا سکے۔
     * اگر آیت کو فہرست سے نہیں ہٹایا گیا ہے تو خارج کر دیا گیا ہے۔
     */
    removedIn?: number;
}
```

### مثال

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
