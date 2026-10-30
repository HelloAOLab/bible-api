# ডেটাসেট

সম্পূরক বাইবেল ডেটাসেট—যেমন ক্রস রেফারেন্স, বাইবেলের সত্তা (ব্যক্তি, স্থান, ঘটনা এবং জাতিগোষ্ঠী), মূল ভাষার আন্তঃরেখীয় শব্দ, অভিধান এবং দিনের শ্লোকের সম্ভাব্য প্রার্থী—ব্রাউজ করার এবং সেগুলোর বই, অধ্যায়ের বিষয়বস্তু, সত্তা, অভিধানের ভুক্তি ও শ্লোকের বিভাগসমূহ সংগ্রহ করার এন্ডপয়েন্ট।

## উপলব্ধ ডেটাসেট

`GET https://bible.helloao.org/api/available_datasets.json`

এপিআই-তে উপলব্ধ বাইবেল ডেটাসেটগুলোর তালিকা পাওয়া যায়।

### কোডের উদাহরণ

::: code-tabs#lang

@ট্যাব জাভাস্ক্রিপ্ট

```ts:no-line-numbers title="fetch-datasets.js"
fetch(`https://bible.helloao.org/api/available_datasets.json`)
    .then(request => request.json())
    .then(availableDatasets => {
        console.log('The API has the following datasets:', availableDatasets);
    });
```

@ট্যাব cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/available_datasets.json
```

:::

### কাঠামো

```typescript:no-line-numbers title="available-datasets.ts"
export interface AvailableDatasets {
    /**
     * ডেটাসেটগুলোর তালিকা।
     */
    datasets: Dataset[];
}

export interface Dataset {
    /**
     * ডেটাসেটটির আইডি।
     */
    id: string;

    /**
     * ডেটাসেটটির নাম।
     */
    name: string;

    /**
     * ডেটা সেটের ওয়েবসাইট।
     */
    website: string;

    /**
     * যে ইউআরএল-এ ডেটাসেটের লাইসেন্সটি পাওয়া যাবে।
     */
    licenseUrl: string;

    /**
     * লাইসেন্সের জন্য এপিআই দ্বারা যুক্ত করা নোটসমূহ।
     * কোনো নোট না থাকলে নাল বা অনির্ধারিত।
     */
    licenseNotes?: string | null;

    /**
     * ডেটাসেটটির ইংরেজি নাম।
     */
    englishName: string;

    /**
     * ডেটাসেটটি প্রধানত যে ISO 639 ৩-অক্ষরের ল্যাঙ্গুয়েজ ট্যাগে রয়েছে।
     */
    language: string;

    /**
     * যে দিকে ভাষাটি লেখা হয়।
     * "ltr" দ্বারা বোঝানো হয় যে লেখাটি পৃষ্ঠার বাম দিক থেকে ডান দিকে লেখা হয়েছে।
     * "rtl" নির্দেশ করে যে লেখাটি পৃষ্ঠার ডান দিক থেকে বাম দিকে লেখা হয়।
     */
    textDirection: 'ltr' | 'rtl';

    /**
     * এই ডেটাসেটের জন্য উপলব্ধ বইগুলির তালিকার এপিআই লিঙ্ক।
     */
    listOfBooksApiLink: string;

    /**
     * উপলব্ধ ফরম্যাটগুলোর তালিকা।
     */
    availableFormats: ('json' | 'usfm')[];

    /**
     * এই ডেটাসেটে অন্তর্ভুক্ত বইয়ের সংখ্যা।
     */
    numberOfBooks: number;

    /**
     * এই ডেটাসেটে অন্তর্ভুক্ত অধ্যায়গুলোর মোট সংখ্যা।
     */
    totalNumberOfChapters: number;

    /**
     * এই ডেটাসেটে অন্তর্ভুক্ত মোট শ্লোকের সংখ্যা।
     */
    totalNumberOfVerses: number;

    /**
     * এই ডেটাসেটে অন্তর্ভুক্ত মোট ক্রস রেফারেন্সের সংখ্যা।
     * যেসব ডেটাসেটে ক্রস রেফারেন্স নেই, সেগুলোর জন্য মান ০।
     */
    totalNumberOfReferences: number;

    /**
     * এই ডেটাসেটে অন্তর্ভুক্ত মোট আন্তঃরেখীয় শব্দের সংখ্যা।
     * ডেটাসেটে আন্তঃরেখীয় শব্দ না থাকলে এটি বাদ দেওয়া হয়।
     */
    totalNumberOfWords?: number;

    /**
     * ডেটা সেটটি যে ভাষায় রয়েছে, সেই ভাষার নাম খুঁজে বের করে।
     * ভাষার নাম জানা না থাকলে এর মান নাল বা অনির্ধারিত হবে।
     */
    languageName?: string;

    /**
     * ইংরেজি ভাষায় ভাষাটির নাম পায়।
     * ভাষাটির কোনো ইংরেজি নাম না থাকলে এর মান নাল বা অনির্ধারিত হবে।
     */
    languageEnglishName?: string;

    /**
     * ডেটা সেটে থাকা সত্তাগুলোর তালিকার জন্য এপিআই লিঙ্কগুলো।
     * ডেটাসেটে সংশ্লিষ্ট সত্তাগুলো না থাকলে এটি বাদ দেওয়া হয়।
     */
    listOfPeopleApiLink?: string;
    listOfPlacesApiLink?: string;
    listOfEventsApiLink?: string;
    listOfPeopleGroupsApiLink?: string;

    /**
     * ডেটাসেটটিতে অন্তর্ভুক্ত সত্তাগুলোর মোট সংখ্যা।
     * ডেটাসেটে সংশ্লিষ্ট সত্তাগুলো না থাকলে এটি বাদ দেওয়া হয়।
     */
    totalNumberOfPeople?: number;
    totalNumberOfPlaces?: number;
    totalNumberOfEvents?: number;
    totalNumberOfPeopleGroups?: number;

    /**
     * ডেটাসেটে থাকা লেক্সিকন এন্ট্রিগুলোর তালিকার জন্য এপিআই লিঙ্ক।
     * ডেটাসেটে লেক্সিকন এন্ট্রি না থাকলে এটি বাদ দেওয়া হয়।
     */
    listOfLexiconApiLink?: string;

    /**
     * ডেটাসেটটিতে অন্তর্ভুক্ত লেক্সিকন এন্ট্রির মোট সংখ্যা।
     * ডেটাসেটে লেক্সিকন এন্ট্রি না থাকলে এটি বাদ দেওয়া হয়।
     */
    totalNumberOfLexicon?: number;

    /**
     * ডেটা সেটে থাকা প্রতিটি শ্লোকের তালিকা ও তার বিভাগসমূহের এপিআই লিঙ্ক।
     * ডেটাসেটের শ্লোকগুলোর কোনো বিভাগ না থাকলে এটি বাদ দেওয়া হয়।
     */
    listOfVersesApiLink?: string;

    /**
     * ডেটাসেটে থাকা শ্লোক বিভাগগুলোর তালিকার এপিআই লিঙ্ক।
     * ডেটাসেটে শ্লোক বিভাগ না থাকলে এটি বাদ দেওয়া হয়।
     */
    listOfCategoriesApiLink?: string;

    /**
     * ডেটাসেটটিতে অন্তর্ভুক্ত শ্লোক বিভাগের মোট সংখ্যা।
     * ডেটাসেটে শ্লোক বিভাগ না থাকলে এটি বাদ দেওয়া হয়।
     */
    totalNumberOfCategories?: number;
}
```

### উদাহরণ

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

## একটি ডেটাসেটে বইগুলির তালিকা করুন

`GET https://bible.helloao.org/api/d/{dataset}/books.json`

প্রদত্ত ডেটাসেটের জন্য উপলব্ধ বইগুলির তালিকা পাওয়া যায়।

-   `dataset` ডেটাসেটের আইডি (যেমন `open-cross-ref` )।

### কোডের উদাহরণ

::: code-tabs#lang

@ট্যাব জাভাস্ক্রিপ্ট

```ts:no-line-numbers title="fetch-dataset-books.js"
const dataset = 'open-cross-ref';

// ওপেন-ক্রস-রেফ ডেটাসেটের জন্য বইয়ের তালিকাটি পান।
fetch(`https://bible.helloao.org/api/d/${dataset}/books.json`)
    .then(request => request.json())
    .then(books => {
        console.log('The open-cross-ref dataset has the following books:', books);
    });
```

@ট্যাব cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/open-cross-ref/books.json
```

:::

### কাঠামো

```typescript:no-line-numbers title="dataset-books.ts"
export interface DatasetBooks {
    /**
     * বইগুলোর জন্য ডেটাসেটের তথ্য।
     */
    dataset: Dataset;

    /**
     * ডেটাসেটটির জন্য উপলব্ধ বইগুলোর তালিকা।
     */
    books: DatasetBook[];
}

interface DatasetBook {
    /**
     * বইটির আইডি।
     * বাইবেলের সংশ্লিষ্ট বইয়ের আইডির সাথে মেলে (যেমন আদিপুস্তক, যাত্রাপুস্তক ইত্যাদি)।
     */
    id: string;

    /**
     * বাইবেলে বইগুলোর ক্রম।
     */
    order: number;

    /**
     * বইটির প্রথম অধ্যায়ের সংখ্যা।
     */
    firstChapterNumber: number;

    /**
     * বইটির প্রথম অধ্যায়ের লিঙ্ক।
     */
    firstChapterApiLink: string | null;

    /**
     * বইটির শেষ অধ্যায়ের সংখ্যা।
     */
    lastChapterNumber: number | null;

    /**
     * বইটির শেষ অধ্যায়ের লিঙ্ক।
     */
    lastChapterApiLink: string | null;

    /**
     * বইটিতে থাকা অধ্যায়ের সংখ্যা।
     */
    numberOfChapters: number;

    /**
     * বইটিতে থাকা শ্লোকের সংখ্যা।
     */
    totalNumberOfVerses: number;

    /**
     * এই বইটিতে থাকা মোট ক্রস রেফারেন্সের সংখ্যা।
     */
    totalNumberOfReferences: number;
}
```

### উদাহরণ

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

## একটি ডেটাসেট থেকে একটি অধ্যায় পান

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

প্রদত্ত বই এবং ডেটাসেটের একটি নির্দিষ্ট অধ্যায়ের বিষয়বস্তু খুঁজে বের করে।

ক্রস রেফারেন্স ডেটাসেটের (যেমন `open-cross-ref` ) ক্ষেত্রে, অধ্যায়টিতে প্রতিটি আয়াতের জন্য ক্রস রেফারেন্সের তালিকা থাকে। ইন্টারলিনিয়ার ডেটাসেটের (যেমন `bsb-interlinear` ) ক্ষেত্রে, অধ্যায়টিতে প্রতিটি আয়াতের মূল ভাষার শব্দগুলো থাকে — দেখুন [ইন্টারলিনিয়ার ডেটাসেট](#interlinear-datasets) । এনটিটি ডেটাসেটের (যেমন `theographic` ) ক্ষেত্রে, অধ্যায়টিতে সেই অধ্যায়ে উল্লেখিত ব্যক্তি, স্থান এবং ঘটনাগুলোর তালিকা থাকে — দেখুন [একটি অধ্যায়ের এনটিটিগুলো কীভাবে পাবেন](#get-the-entities-in-a-chapter) । `verse-of-the-day` ডেটাসেটের জন্য, অধ্যায়টিতে সেই অধ্যায়ের 'দিনের আয়াত' হিসেবে মনোনীত আয়াতগুলো এবং তাদের বিভাগগুলো থাকে — দেখুন [দিনের আয়াত](#verse-of-the-day) ।

-   `dataset` ডেটাসেটের আইডি (যেমন `open-cross-ref` )।
-   `book` হলো বইটির আইডি (যেমন, জেনেসিসের জন্য `GEN` )।
-   `chapter` হলো অধ্যায়ের সংখ্যাসূচক সংখ্যা (যেমন, প্রথম অধ্যায়ের জন্য `1` )।

### কোডের উদাহরণ

::: code-tabs#lang

@ট্যাব জাভাস্ক্রিপ্ট

```ts:no-line-numbers title="fetch-dataset-chapter.js"
const dataset = 'open-cross-ref';
const book = 'GEN';
const chapter = 1;

// ওপেন-ক্রস-রেফ ডেটাসেট থেকে জেনেসিস ১ পান।
fetch(`https://bible.helloao.org/api/d/${dataset}/${book}/${chapter}.json`)
    .then(request => request.json())
    .then(chapter => {
        console.log('Genesis 1 (open-cross-ref):', chapter);
    });
```

@ট্যাব cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/open-cross-ref/GEN/1.json
```

:::

### কাঠামো

```typescript:no-line-numbers title="dataset-chapter.ts"
export interface DatasetBookChapter {
    /**
     * বইয়ের অধ্যায়টির ডেটাসেট তথ্য।
     */
    dataset: Dataset;

    /**
     * বইয়ের অধ্যায়টির তথ্য।
     */
    book: DatasetBook;

    /**
     * এই অধ্যায়ের লিঙ্ক।
     */
    thisChapterLink: string;

    /**
     * পরবর্তী অধ্যায়ের লিঙ্ক।
     * ডেটাসেটের এটি শেষ অধ্যায় হলে মানটি নাল হবে।
     */
    nextChapterApiLink: string | null;

    /**
     * পূর্ববর্তী অধ্যায়ের লিঙ্ক।
     * ডেটাসেটের এটি প্রথম অধ্যায় হলে মানটি নাল হবে।
     */
    previousChapterApiLink: string | null;

    /**
     * অধ্যায়টিতে থাকা শ্লোকের সংখ্যা।
     */
    numberOfVerses: number;

    /**
     * অধ্যায়টির তথ্য।
     */
    chapter: DatasetChapterData;
}

interface DatasetChapterData {
    /**
     * অধ্যায়ের সংখ্যা।
     */
    number: number;

    /**
     * অধ্যায়টির বিষয়বস্তু।
     */
    content: DatasetVerse[];
}

/**
 * একটি আয়াতের মান `references` (ক্রস রেফারেন্স ডেটাসেট), `words` (ইন্টারলিনিয়ার ডেটাসেট), অথবা `categories` (দিনের আয়াত ডেটাসেট) হয়ে থাকে।
 * `'words' in verse` বা `'categories' in verse` দিয়ে কোনটি উপস্থিত আছে তা যাচাই করুন।
 */
type DatasetVerse =
    | DatasetReferencesVerse
    | DatasetWordsVerse
    | DatasetCategoriesVerse;

interface DatasetReferencesVerse {
    /**
     * শ্লোকটির সংখ্যা।
     */
    verse: number;

    /**
     * শ্লোকটির প্রাসঙ্গিক তথ্যসূত্রসমূহ।
     *
     * স্কোর অনুসারে অবরোহী ক্রমে সাজানো।
     */
    references: DatasetReference[];
}

interface DatasetWordsVerse {
    /**
     * শ্লোকটির সংখ্যা।
     */
    verse: number;

    /**
     * শ্লোকটির মূল ভাষার শব্দগুলো, মূল পাঠের ক্রমানুসারে।
     * নিচে 'আন্তঃরৈখিক ডেটাসেট' দেখুন।
     */
    words: InterlinearWord[];
}

interface DatasetCategoriesVerse {
    /**
     * শ্লোকটির সংখ্যা।
     * যদি `endVerse` থাকে, তাহলে এটিই সেই পদ যেখান থেকে অনুচ্ছেদটি শুরু হয়।
     */
    verse: number;

    /**
     * যে আয়াতে অনুচ্ছেদটি শেষ হয়।
     * ভুক্তিটি একটিমাত্র শ্লোক হলে বাদ দেওয়া হয়।
     */
    endVerse?: number;

    /**
     * আয়াতটি যে যে বিভাগের অন্তর্গত, সেগুলোর আইডি; সবচেয়ে প্রাসঙ্গিকটি প্রথমে।
     * নিচে 'দিনের শ্লোক' দেখুন।
     */
    categories: string[];

    /**
     * এই প্রথম বছর শ্লোকটি দিনের শ্লোক হতে পারবে।
     * যদি আয়াতটি সবসময় তালিকায় থাকে, তবে তা বাদ দেওয়া হয়।
     */
    addedIn?: number;

    /**
     * এই প্রথম বছর থেকে শ্লোকটি আর দিনের শ্লোক হতে পারবে না।
     * বাদ দেওয়া আয়াতগুলো ডেটাসেটে থেকে যায়, যাতে আগের বছরগুলোর আয়াতগুলোও বাছাই করা যায়।
     * তালিকা থেকে শ্লোকটি সরানো না হলে তা বাদ দেওয়া হয়।
     */
    removedIn?: number;
}

interface DatasetReference {
    /**
     * যে বইটির উল্লেখ করা হচ্ছে তার আইডি।
     */
    book: string;

    /**
     * অধ্যায় সংখ্যা।
     */
    chapter: number;

    /**
     * শ্লোক সংখ্যা।
     * যদি `endVerse` থাকে, তাহলে এটিই সেই শ্লোক যেখান থেকে উল্লেখটি শুরু হয়।
     */
    verse: number;

    /**
     * যে আয়াতে উল্লেখটি শেষ হয়।
     */
    endVerse?: number;

    /**
     * রেফারেন্সটির প্রাসঙ্গিকতা স্কোর।
     */
    score?: number;
}

// InterlinearWord-এর গঠন সম্পর্কে জানতে নিচে 'Interlinear Datasets' অংশটি দেখুন।
```

### উদাহরণ

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

## সত্তা

কিছু ডেটাসেট - যেমন [থিওগ্রাফিক বাইবেল মেটাডেটা](https://github.com/robertrouse/theographic-bible-metadata) ডেটাসেট ( `theographic` ) - এ ব্যক্তি, স্থান, ঘটনা এবং জাতিগোষ্ঠীর মতো সত্তা রয়েছে, সেইসাথে তাদের এবং বাইবেলের যে শ্লোকগুলিতে তাদের উল্লেখ করা হয়েছে তাদের মধ্যে সম্পর্কও রয়েছে।

[হিস্ট্রি গ্লোব](https://historyglobe.app) ডেটাসেট ( `history-globe` )-এ শুধুমাত্র স্থানের নাম রয়েছে: বাইবেলে উল্লেখিত স্থান, তাদের স্থানাঙ্ক এবং যে শ্লোকগুলিতে তাদের নাম উল্লেখ করা হয়েছে। এর স্থান আইডিগুলি (যেমন জেরুজালেমের জন্য `a15257a` ) হিস্ট্রি গ্লোবের স্থিতিশীল স্থান আইডি, যা এর নিজস্ব [ওপেন ডেটা এপিআই](https://historyglobe.app/docs/api.html) ব্যবহার করে, তাই কোনো নাম সংশোধন করা হলেও সেগুলি পরিবর্তিত হয় না। এর `featureType` মানগুলি থিওগ্রাফিক ডেটাসেট দ্বারা ব্যবহৃত মানগুলিকে অনুসরণ করে ( `City` , `Region` , `Water` , ইত্যাদি), এবং `featureSubType` আরও নির্দিষ্ট ধরণের তথ্য বহন করে যেখানে তা রয়েছে (যেমন `River` , `Gate` , `Spring` )।

যেসব ডেটাসেটে এনটিটি রয়েছে, সেগুলোর `/api/available_datasets.json` এন্ট্রিতে `listOfPeopleApiLink` , `listOfPlacesApiLink` , `listOfEventsApiLink` এবং `listOfPeopleGroupsApiLink` প্রপার্টি অন্তর্ভুক্ত থাকে।

এনটিটি ডেটাসেটগুলো অধ্যায়-ভিত্তিক ডেটাও প্রদান করে: `/api/d/{dataset}/books.json` সেই বইগুলোর তালিকা দেয় যাদের অধ্যায়গুলোতে এনটিটি ডেটা রয়েছে, এবং `/api/d/{dataset}/{book}/{chapter}.json` সেই অধ্যায়ে উপস্থিত ব্যক্তি, স্থান ও ঘটনাগুলো ফেরত দেয়, সাথে প্রতিটির উল্লেখের শ্লোক নম্বরও থাকে। [একটি অধ্যায়ের এনটিটিগুলো কীভাবে পাবেন তা](#get-the-entities-in-a-chapter) দেখুন।

এনটিটিগুলো এপিআই-এর বাকি অংশের মতোই একই বই আইডি, অধ্যায় নম্বর এবং শ্লোক নম্বর ব্যবহার করে বাইবেলের অনুচ্ছেদগুলোকে নির্দেশ করে, ফলে এগুলোকে যেকোনো অনুবাদের সাথে একত্রিত করা যায়। এরা এনটিটি রেফারেন্স ব্যবহার করে একে অপরকে নির্দেশ করে:

```typescript:no-line-numbers title="entity-shared.ts"
export interface DatasetEntityRef {
    /**
     * যে সত্তাটিকে উল্লেখ করা হচ্ছে তার আইডি।
     */
    id: string;

    /**
     * যে সত্তাটিকে উল্লেখ করা হচ্ছে তার ধরণ।
     * এনটিটির এপিআই লিঙ্কের কালেকশন সেগমেন্টের সাথে মেলে, তাই লিঙ্কটি `/api/d/{dataset}/{type}/{id}.json` হিসাবে তৈরি করা যেতে পারে।
     */
    type: 'people' | 'places' | 'events' | 'groups';

    /**
     * যে সত্তাটিকে উল্লেখ করা হচ্ছে তার নাম।
     */
    name?: string;

    /**
     * যে সত্তাটিকে উল্লেখ করা হচ্ছে তার এপিআই লিঙ্ক।
     */
    apiLink?: string;
}

export interface VerseRef {
    /**
     * বইটির আইডি (GEN, EXO, ইত্যাদি)।
     */
    book: string;

    /**
     * যে অধ্যায় নম্বর থেকে তথ্যসূত্রটি শুরু হয়।
     */
    chapter: number;

    /**
     * যে শ্লোক সংখ্যা থেকে উল্লেখটি শুরু হয়।
     */
    verse: number;

    /**
     * যে আয়াতে উল্লেখটি শেষ হয়।
     * একই অধ্যায়ের পরপর আয়াতগুলোকে একটিমাত্র সূত্রে অন্তর্ভুক্ত করা হয়েছে।
     */
    endVerse?: number;
}
```

### হিস্ট্রি গ্লোব অ্যাট্রিবিউশন

হিস্ট্রি গ্লোব ডেটা [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) লাইসেন্সের অধীনে রয়েছে। আপনি যদি এটি ব্যবহার করেন, তাহলে হিস্ট্রি গ্লোব ( https://historyglobe.app ) এবং ওপেনবাইবেল.ইনফো বাইবেল জিওকোডিং ডেটা, যার উপর এটি তৈরি, তাদের কৃতিত্ব দিন এবং যেকোনো পরিবর্তন উল্লেখ করুন। ডেটাসেটের `licenseNotes` প্রপার্টিতে এই কৃতিত্ব উল্লেখ করা আছে।

## একটি অধ্যায়ে সত্তাগুলো পান

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

এনটিটি ডেটাসেটের ক্ষেত্রে, এটি একটি নির্দিষ্ট অধ্যায়ে উল্লেখিত ব্যক্তি, স্থান এবং ঘটনাগুলো খুঁজে বের করে, এবং সেই সাথে অধ্যায়ে প্রতিটির উল্লেখের শ্লোক নম্বরও প্রদান করে।

-   `dataset` ডেটাসেটের আইডি (যেমন `theographic` )।
-   `book` হলো বইটির আইডি (যেমন, জেনেসিসের জন্য `GEN` )।
-   `chapter` হলো অধ্যায়ের সংখ্যাসূচক সংখ্যা (যেমন, প্রথম অধ্যায়ের জন্য `1` )।

যেসব বই এবং অধ্যায়ে এনটিটি ডেটা রয়েছে তার তালিকা `GET https://bible.helloao.org/api/d/{dataset}/books.json` থেকে পাওয়া যায়, যা [ডেটাসেট 'বুকস' এন্ডপয়েন্টের](#list-books-in-a-dataset) মতোই কাঠামো অনুসরণ করে। এনটিটি ডেটাসেটগুলোর ক্ষেত্রে, `totalNumberOfVerses` হলো সেইসব শ্লোকের সংখ্যা যা অন্তত একটি এনটিটি দ্বারা উল্লিখিত হয়েছে এবং `totalNumberOfReferences` হলো এনটিটি-শ্লোক উল্লেখের মোট সংখ্যা।

### কোডের উদাহরণ

::: code-tabs#lang

@ট্যাব জাভাস্ক্রিপ্ট

```ts:no-line-numbers title="fetch-chapter-entities.js"
const dataset = 'theographic';
const book = 'GEN';
const chapter = 2;

// আদিপুস্তক ২-এ উল্লেখিত ব্যক্তি, স্থান ও ঘটনাগুলো খুঁজে বের করুন।
fetch(`https://bible.helloao.org/api/d/${dataset}/${book}/${chapter}.json`)
    .then(request => request.json())
    .then(chapter => {
        console.log('Genesis 2 (theographic):', chapter);
    });
```

@ট্যাব cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/theographic/GEN/2.json
```

:::

### কাঠামো

```typescript:no-line-numbers title="dataset-chapter-entities.ts"
export interface DatasetEntityBookChapter {
    /**
     * বইয়ের অধ্যায়টির ডেটাসেট তথ্য।
     */
    dataset: Dataset;

    /**
     * বইয়ের অধ্যায়টির তথ্য।
     */
    book: DatasetBook;

    /**
     * অধ্যায়টির সত্তা ডেটা।
     */
    chapter: DatasetEntityChapterData;

    /**
     * এই অধ্যায়ের লিঙ্ক।
     */
    thisChapterLink: string;

    /**
     * পরবর্তী অধ্যায়ের লিঙ্ক।
     * ডেটাসেটের এটি শেষ অধ্যায় হলে মানটি নাল হবে।
     */
    nextChapterApiLink: string | null;

    /**
     * পূর্ববর্তী অধ্যায়ের লিঙ্ক।
     * ডেটাসেটের এটি প্রথম অধ্যায় হলে মানটি নাল হবে।
     */
    previousChapterApiLink: string | null;

    /**
     * অধ্যায়টিতে উল্লেখিত ব্যক্তি, স্থান ও ঘটনার সংখ্যা।
     */
    numberOfPeople: number;
    numberOfPlaces: number;
    numberOfEvents: number;
}

interface DatasetEntityChapterData {
    /**
     * অধ্যায়ের সংখ্যা।
     */
    number: number;

    /**
     * অধ্যায়ে যে ব্যক্তিদের উল্লেখ করা হয়েছে।
     * যে শ্লোকে প্রথম উপস্থিত হয়েছে, সেই অনুসারে সাজানো।
     */
    people: ChapterPerson[];

    /**
     * অধ্যায়ে উল্লেখিত স্থানগুলো।
     * যে শ্লোকে প্রথম উপস্থিত হয়েছে, সেই অনুসারে সাজানো।
     */
    places: ChapterPlace[];

    /**
     * অধ্যায়ে উল্লেখিত ঘটনাগুলো।
     * যে শ্লোকে প্রথম উপস্থিত হয়েছে, সেই অনুসারে সাজানো।
     */
    events: ChapterEvent[];
}

interface ChapterPerson {
    /**
     * ব্যক্তিটির পরিচয়পত্র।
     */
    id: string;

    /**
     * ব্যক্তিটির নাম।
     */
    name: string;

    /**
     * ব্যক্তিটির নাম বিশেষ্য পদ কিনা।
     */
    isProperName?: boolean;

    /**
     * ব্যক্তিটির লিঙ্গ।
     */
    gender?: string;

    /**
     * ব্যক্তিটির জন্মসাল এবং মৃত্যুসাল।
     * ঋণাত্মক সংখ্যাগুলো হলো খ্রিস্টপূর্বাব্দ (BC) বছর। ধনাত্মক সংখ্যাগুলো হলো খ্রিস্টাব্দ (AD) বছর।
     */
    birthYear?: number;
    deathYear?: number;

    /**
     * ব্যক্তিটির জন্য এপিআই লিঙ্ক।
     */
    apiLink: string;

    /**
     * অধ্যায়ের যে শ্লোকগুলিতে ব্যক্তিটির উল্লেখ আছে, সেগুলির সংখ্যা।
     * আরোহী ক্রমে সাজানো।
     */
    verses: number[];
}

interface ChapterPlace {
    /**
     * স্থানটির পরিচয়।
     */
    id: string;

    /**
     * স্থানটির নাম।
     */
    name: string;

    /**
     * স্থানটি যে ধরনের ভৌগোলিক বৈশিষ্ট্য।
     */
    featureType?: string;

    /**
     * স্থানটির অক্ষাংশ ও দ্রাঘিমাংশ।
     */
    latitude?: number;
    longitude?: number;

    /**
     * স্থানটির এপিআই লিঙ্ক।
     */
    apiLink: string;

    /**
     * অধ্যায়ের যে শ্লোকগুলিতে স্থানটির উল্লেখ আছে, সেগুলির সংখ্যা।
     * আরোহী ক্রমে সাজানো।
     */
    verses: number[];
}

interface ChapterEvent {
    /**
     * ইভেন্টটির আইডি।
     */
    id: string;

    /**
     * অনুষ্ঠানটির নাম।
     */
    name: string;

    /**
     * যে তারিখে অনুষ্ঠানটি শুরু হয়েছিল।
     */
    startDate?: string;

    /**
     * ইভেন্টটির এপিআই লিঙ্ক।
     */
    apiLink: string;

    /**
     * অধ্যায়ের যে শ্লোকগুলোতে ঘটনাটি বর্ণনা করা হয়েছে, সেগুলোর সংখ্যা।
     * আরোহী ক্রমে সাজানো।
     */
    verses: number[];
}
```

### উদাহরণ

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

## একটি ডেটাসেটে থাকা ব্যক্তিদের তালিকা করুন

`GET https://bible.helloao.org/api/d/{dataset}/people.json`

প্রদত্ত ডেটাসেটের জন্য উপলব্ধ ব্যক্তিদের তালিকা পাওয়া যায়।

-   `dataset` ডেটাসেটের আইডি (যেমন `theographic` )।

### কোডের উদাহরণ

::: code-tabs#lang

@ট্যাব জাভাস্ক্রিপ্ট

```ts:no-line-numbers title="fetch-dataset-people.js"
const dataset = 'theographic';

// ভূ-গ্রাফিক ডেটাসেটের জন্য ব্যক্তিদের তালিকাটি নিন।
fetch(`https://bible.helloao.org/api/d/${dataset}/people.json`)
    .then(request => request.json())
    .then(people => {
        console.log('The theographic dataset has the following people:', people);
    });
```

@ট্যাব cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/theographic/people.json
```

:::

### কাঠামো

```typescript:no-line-numbers title="dataset-people.ts"
export interface DatasetPeople {
    /**
     * জনগণের জন্য ডেটাসেটের তথ্য।
     */
    dataset: Dataset;

    /**
     * ডেটাসেটের জন্য উপলব্ধ ব্যক্তিদের তালিকা।
     */
    people: DatasetPersonSummary[];
}

interface DatasetPersonSummary {
    /**
     * ব্যক্তিটির পরিচয়পত্র।
     */
    id: string;

    /**
     * ব্যক্তিটির নাম।
     */
    name: string;

    /**
     * ব্যক্তিটির নাম বিশেষ্য পদ কিনা।
     */
    isProperName?: boolean;

    /**
     * ব্যক্তিটির লিঙ্গ।
     */
    gender?: string;

    /**
     * বাইবেলে উল্লেখিত উদ্ধৃতির সংখ্যা।
     */
    numberOfReferences: number;

    /**
     * ব্যক্তিটির জন্য এপিআই লিঙ্ক।
     */
    thisPersonApiLink: string;
}
```

### উদাহরণ

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

## একটি ডেটাসেট থেকে একজন ব্যক্তিকে খুঁজুন

`GET https://bible.helloao.org/api/d/{dataset}/people/{person}.json`

কোনো একজন ব্যক্তি সম্পর্কে তথ্য পাওয়া যায়, যার মধ্যে বাইবেলের সেইসব উদ্ধৃতি অন্তর্ভুক্ত থাকে যেখানে তার উল্লেখ আছে এবং অন্যান্য ব্যক্তি, স্থান, ঘটনা ও জাতিগোষ্ঠীর সাথে তার সম্পর্কও জানা যায়।

-   `dataset` ডেটাসেটের আইডি (যেমন `theographic` )।
-   `person` ব্যক্তির আইডি (যেমন `paul_2479` )।

### কোডের উদাহরণ

::: code-tabs#lang

@ট্যাব জাভাস্ক্রিপ্ট

```ts:no-line-numbers title="fetch-dataset-person.js"
const dataset = 'theographic';
const person = 'paul_2479';

// ধর্মতাত্ত্বিক ডেটাসেট থেকে পল সম্পর্কে তথ্য সংগ্রহ করুন।
fetch(`https://bible.helloao.org/api/d/${dataset}/people/${person}.json`)
    .then(request => request.json())
    .then(person => {
        console.log('Paul:', person);
    });
```

@ট্যাব cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/theographic/people/paul_2479.json
```

:::

### কাঠামো

```typescript:no-line-numbers title="dataset-person.ts"
export interface DatasetPersonResponse {
    /**
     * ব্যক্তিটির ডেটাসেট তথ্য।
     */
    dataset: Dataset;

    /**
     * ব্যক্তিটি সম্পর্কে তথ্য।
     */
    person: DatasetPerson;

    /**
     * এই ব্যক্তির জন্য এপিআই লিঙ্ক।
     */
    thisPersonApiLink: string;
}

interface DatasetPerson {
    /**
     * ব্যক্তিটির পরিচয়পত্র।
     */
    id: string;

    /**
     * ব্যক্তিটির নাম।
     */
    name: string;

    /**
     * ব্যক্তিটিকে ডাকার অন্যান্য নাম।
     */
    alsoCalled?: string[];

    /**
     * ব্যক্তিটির নাম বিশেষ্য পদ কিনা।
     */
    isProperName?: boolean;

    /**
     * ব্যক্তিটির লিঙ্গ।
     */
    gender?: string;

    /**
     * ব্যক্তিটির বর্ণনা। প্রতিটি স্ট্রিং একটি অনুচ্ছেদ।
     */
    description?: string[];

    /**
     * ব্যক্তিটির জন্মসাল এবং মৃত্যুসাল।
     * ঋণাত্মক সংখ্যাগুলো হলো খ্রিস্টপূর্বাব্দ। ধনাত্মক সংখ্যাগুলো হলো খ্রিস্টাব্দ।
     */
    birthYear?: number;
    deathYear?: number;

    /**
     * ব্যক্তিটির উল্লেখ পাওয়া যায় এমন প্রথম ও সর্বশেষ বছরগুলো।
     */
    minYear?: number;
    maxYear?: number;

    /**
     * যে স্থানে ব্যক্তিটি জন্মগ্রহণ করেছিলেন এবং মৃত্যুবরণ করেছিলেন।
     */
    birthPlace?: DatasetEntityRef;
    deathPlace?: DatasetEntityRef;

    /**
     * ব্যক্তিটির পারিবারিক সম্পর্কসমূহ।
     */
    father?: DatasetEntityRef[];
    mother?: DatasetEntityRef[];
    partners?: DatasetEntityRef[];
    children?: DatasetEntityRef[];
    siblings?: DatasetEntityRef[];
    halfSiblingsSameMother?: DatasetEntityRef[];
    halfSiblingsSameFather?: DatasetEntityRef[];

    /**
     * ব্যক্তিটি যেসব জাতিগোষ্ঠীর সদস্য।
     */
    memberOf?: DatasetEntityRef[];

    /**
     * যেসব অনুষ্ঠানে ব্যক্তিটি অংশগ্রহণ করেছিলেন।
     */
    events?: DatasetEntityRef[];

    /**
     * বাইবেলের সেইসব উদ্ধৃতির তালিকা যেখানে ব্যক্তিটির উল্লেখ আছে।
     * বইয়ের ক্রম, অধ্যায় ও শ্লোক অনুসারে সাজানো।
     */
    references: VerseRef[];
}
```

### উদাহরণ

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

## একটি ডেটাসেটে স্থানগুলির তালিকা

`GET https://bible.helloao.org/api/d/{dataset}/places.json`

প্রদত্ত ডেটাসেটের জন্য উপলব্ধ স্থানগুলির তালিকা পাওয়া যায়।

-   `dataset` ডেটাসেটের আইডি (যেমন `theographic` )।

### কাঠামো

```typescript:no-line-numbers title="dataset-places.ts"
export interface DatasetPlaces {
    /**
     * স্থানগুলোর জন্য ডেটাসেটের তথ্য।
     */
    dataset: Dataset;

    /**
     * ডেটাসেটের জন্য উপলব্ধ স্থানগুলির তালিকা।
     */
    places: DatasetPlaceSummary[];
}

interface DatasetPlaceSummary {
    /**
     * স্থানটির পরিচয়।
     */
    id: string;

    /**
     * স্থানটির নাম।
     */
    name: string;

    /**
     * স্থানটি যে ধরনের ভৌগোলিক বৈশিষ্ট্য।
     * উদাহরণস্বরূপ, 'শহর', 'অঞ্চল', 'পাহাড়', 'জলাশয়', ইত্যাদি।
     */
    featureType?: string;

    /**
     * স্থানটির অক্ষাংশ ও দ্রাঘিমাংশ।
     */
    latitude?: number;
    longitude?: number;

    /**
     * বাইবেলে স্থানটির উল্লেখ আছে এমন উদ্ধৃতির সংখ্যা।
     */
    numberOfReferences: number;

    /**
     * স্থানটির এপিআই লিঙ্ক।
     */
    thisPlaceApiLink: string;
}
```

## একটি ডেটাসেট থেকে একটি স্থান পান

`GET https://bible.helloao.org/api/d/{dataset}/places/{place}.json`

কোনো একটি নির্দিষ্ট স্থান সম্পর্কে তথ্য পাওয়া যায়, যার মধ্যে বাইবেলের সেইসব উদ্ধৃতিও অন্তর্ভুক্ত থাকে যেখানে সেই স্থান এবং তার সাথে সম্পর্কিত ব্যক্তি ও ঘটনাগুলোর উল্লেখ আছে।

-   `dataset` ডেটাসেটের আইডি (যেমন `theographic` )।
-   `place` স্থানটির আইডি (যেমন `jerusalem_636` )।

### কাঠামো

```typescript:no-line-numbers title="dataset-place.ts"
export interface DatasetPlaceResponse {
    /**
     * স্থানটির ডেটাসেট তথ্য।
     */
    dataset: Dataset;

    /**
     * স্থানটি সম্পর্কে তথ্য।
     */
    place: DatasetPlace;

    /**
     * এই জায়গার এপিআই লিঙ্ক।
     */
    thisPlaceApiLink: string;
}

interface DatasetPlace {
    /**
     * স্থানটির পরিচয়।
     */
    id: string;

    /**
     * স্থানটির নাম।
     */
    name: string;

    /**
     * কিং জেমস ভার্সন এবং ইংলিশ স্ট্যান্ডার্ড ভার্সনে স্থানটির নাম যেভাবে আছে।
     */
    kjvName?: string;
    esvName?: string;

    /**
     * স্থানটি আরও যেসব নামে পরিচিত।
     */
    aliases?: string[];

    /**
     * স্থানটি যে ধরনের ভৌগোলিক বৈশিষ্ট্য।
     */
    featureType?: string;
    featureSubType?: string;

    /**
     * স্থানটির অক্ষাংশ ও দ্রাঘিমাংশ এবং সেগুলো কতটা নির্ভুল।
     */
    latitude?: number;
    longitude?: number;
    precision?: string;

    /**
     * স্থানটির বর্ণনা। প্রতিটি বাক্য একটি অনুচ্ছেদ।
     */
    description?: string[];

    /**
     * ডেটা সেট লেখকদের পক্ষ থেকে স্থানটি সম্পর্কে মন্তব্য।
     */
    comment?: string;

    /**
     * এই জায়গার মূল স্থান।
     * একই ভৌগোলিক স্থানের বিভিন্ন নামের উৎস একই।
     */
    rootPlace?: DatasetEntityRef;

    /**
     * যে জায়গাটির এই জায়গাটি একটি প্রতিরূপ।
     */
    duplicateOf?: DatasetEntityRef;

    /**
     * যে ব্যক্তিরা সেই স্থানে ছিলেন, জন্মগ্রহণ করেছেন বা মৃত্যুবরণ করেছেন।
     */
    people?: DatasetEntityRef[];
    peopleBorn?: DatasetEntityRef[];
    peopleDied?: DatasetEntityRef[];

    /**
     * ওই জায়গায় যে ঘটনাগুলো ঘটেছিল।
     */
    events?: DatasetEntityRef[];

    /**
     * বাইবেলের সেইসব উদ্ধৃতির তালিকা যেখানে স্থানটির উল্লেখ আছে।
     * বইয়ের ক্রম, অধ্যায় ও শ্লোক অনুসারে সাজানো।
     */
    references: VerseRef[];
}
```

### উদাহরণ

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

## একটি ডেটাসেটে ইভেন্টগুলির তালিকা

`GET https://bible.helloao.org/api/d/{dataset}/events.json`

প্রদত্ত ডেটাসেটের জন্য উপলব্ধ ইভেন্টগুলির তালিকা পাওয়া যায়।

-   `dataset` ডেটাসেটের আইডি (যেমন `theographic` )।

### কাঠামো

```typescript:no-line-numbers title="dataset-events.ts"
export interface DatasetEvents {
    /**
     * ইভেন্টগুলোর ডেটাসেট তথ্য।
     */
    dataset: Dataset;

    /**
     * ডেটাসেটটির জন্য উপলব্ধ ইভেন্টগুলোর তালিকা।
     */
    events: DatasetEventSummary[];
}

interface DatasetEventSummary {
    /**
     * ইভেন্টটির আইডি।
     */
    id: string;

    /**
     * অনুষ্ঠানটির নাম।
     */
    name: string;

    /**
     * যে তারিখে অনুষ্ঠানটি শুরু হয়েছিল।
     * ঋণাত্মক সংখ্যাগুলো হলো খ্রিস্টপূর্বাব্দ। ধনাত্মক সংখ্যাগুলো হলো খ্রিস্টাব্দ।
     * আরও সুনির্দিষ্ট তারিখের জন্য `YYYY-MM-DD` ফরম্যাটটি ব্যবহার করুন।
     */
    startDate?: string;

    /**
     * ঘটনাটি বর্ণনা করে এমন বাইবেলের উদ্ধৃতির সংখ্যা।
     */
    numberOfReferences: number;

    /**
     * ইভেন্টটির এপিআই লিঙ্ক।
     */
    thisEventApiLink: string;
}
```

## একটি ডেটাসেট থেকে একটি ইভেন্ট পান

`GET https://bible.helloao.org/api/d/{dataset}/events/{event}.json`

কোনো একটি নির্দিষ্ট ঘটনা সম্পর্কে তথ্য পাওয়া যায়, যার মধ্যে সেই ঘটনা এবং এর সাথে সম্পর্কিত ব্যক্তি, স্থান ও জনগোষ্ঠী সম্পর্কে বাইবেলের উদ্ধৃতিও অন্তর্ভুক্ত থাকে।

-   `dataset` ডেটাসেটের আইডি (যেমন `theographic` )।
-   `event` ইভেন্টের আইডি (যেমন `saul-is-converted_326` )।

### কাঠামো

```typescript:no-line-numbers title="dataset-event.ts"
export interface DatasetEventResponse {
    /**
     * ইভেন্টটির ডেটাসেট তথ্য।
     */
    dataset: Dataset;

    /**
     * অনুষ্ঠানটি সম্পর্কিত তথ্য।
     */
    event: DatasetEvent;

    /**
     * এই ইভেন্টের এপিআই লিঙ্ক।
     */
    thisEventApiLink: string;
}

interface DatasetEvent {
    /**
     * ইভেন্টটির আইডি।
     */
    id: string;

    /**
     * অনুষ্ঠানটির নাম।
     */
    name: string;

    /**
     * যে তারিখে অনুষ্ঠানটি শুরু হয়েছিল।
     */
    startDate?: string;

    /**
     * অনুষ্ঠানটির সময়কাল।
     * উদাহরণস্বরূপ, "1D" মানে একদিন এবং "40Y" মানে চল্লিশ বছর।
     */
    duration?: string;

    /**
     * অনুষ্ঠানে অংশগ্রহণকারী ব্যক্তিরা।
     */
    participants?: DatasetEntityRef[];

    /**
     * যে স্থানগুলোতে ঘটনাটি ঘটেছিল।
     */
    locations?: DatasetEntityRef[];

    /**
     * যে জনগোষ্ঠীগুলো অনুষ্ঠানে অংশগ্রহণ করেছিল।
     */
    groups?: DatasetEntityRef[];

    /**
     * যে অনুষ্ঠানটির এই অনুষ্ঠানটি একটি অংশ।
     */
    partOf?: DatasetEntityRef;

    /**
     * এই ঘটনার আগে যে ঘটনাটি ঘটেছিল।
     */
    predecessor?: DatasetEntityRef;

    /**
     * ঘটনাটির বর্ণনা দেয় এমন বাইবেলের উদ্ধৃতিগুলোর তালিকা।
     * বইয়ের ক্রম, অধ্যায় ও শ্লোক অনুসারে সাজানো।
     */
    references: VerseRef[];
}
```

### উদাহরণ

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

## একটি ডেটাসেটে জনগোষ্ঠী তালিকাভুক্ত করুন

`GET https://bible.helloao.org/api/d/{dataset}/groups.json`

প্রদত্ত ডেটাসেটের জন্য উপলব্ধ জাতিগোষ্ঠীগুলোর তালিকা পাওয়া যায়।

-   `dataset` ডেটাসেটের আইডি (যেমন `theographic` )।

### কাঠামো

```typescript:no-line-numbers title="dataset-people-groups.ts"
export interface DatasetPeopleGroups {
    /**
     * জনগোষ্ঠীগুলোর জন্য ডেটাসেটের তথ্য।
     */
    dataset: Dataset;

    /**
     * ডেটাসেটের জন্য উপলব্ধ জনগোষ্ঠীগুলোর তালিকা।
     */
    groups: DatasetPeopleGroupSummary[];
}

interface DatasetPeopleGroupSummary {
    /**
     * জনগোষ্ঠীটির পরিচয়।
     */
    id: string;

    /**
     * জনগোষ্ঠীটির নাম।
     */
    name: string;

    /**
     * জনগোষ্ঠীটির সদস্য সংখ্যা।
     */
    numberOfMembers: number;

    /**
     * জনগোষ্ঠীটির জন্য এপিআই লিঙ্ক।
     */
    thisPeopleGroupApiLink: string;
}
```

## একটি ডেটাসেট থেকে একটি জনগোষ্ঠী খুঁজুন

`GET https://bible.helloao.org/api/d/{dataset}/groups/{group}.json`

কোনো একটি নির্দিষ্ট জনগোষ্ঠী সম্পর্কে তথ্য পাওয়া যায়, যার মধ্যে এর সদস্য এবং গোষ্ঠীটির অংশগ্রহণ করা বিভিন্ন ঘটনা অন্তর্ভুক্ত থাকে।

-   `dataset` ডেটাসেটের আইডি (যেমন `theographic` )।
-   `group` জনগোষ্ঠীটির আইডি (যেমন `tribe-of-benjamin` )।

### কাঠামো

```typescript:no-line-numbers title="dataset-people-group.ts"
export interface DatasetPeopleGroupResponse {
    /**
     * জনগোষ্ঠী সম্পর্কিত ডেটাসেটের তথ্য।
     */
    dataset: Dataset;

    /**
     * জনগোষ্ঠী সম্পর্কিত তথ্য।
     */
    group: DatasetPeopleGroup;

    /**
     * এই জনগোষ্ঠীর জন্য এপিআই লিঙ্ক।
     */
    thisPeopleGroupApiLink: string;
}

interface DatasetPeopleGroup {
    /**
     * জনগোষ্ঠীটির পরিচয়।
     */
    id: string;

    /**
     * জনগোষ্ঠীটির নাম।
     */
    name: string;

    /**
     * যারা জনগোষ্ঠীটির সদস্য।
     */
    members?: DatasetEntityRef[];

    /**
     * যে ঘটনাগুলোতে জনগোষ্ঠীটি অংশগ্রহণ করেছিল।
     */
    events?: DatasetEntityRef[];

    /**
     * বাইবেলের সেইসব উদ্ধৃতির তালিকা যেখানে এই জনগোষ্ঠীটির উল্লেখ আছে।
     * বইয়ের ক্রম, অধ্যায় ও শ্লোক অনুসারে সাজানো।
     */
    references: VerseRef[];
}
```

### উদাহরণ

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

## আন্তঃরৈখিক ডেটাসেট

বেরিয়ান ইন্টারলিনিয়ার ডেটাসেট ( `bsb-interlinear` ) বাইবেলের প্রতিটি পদের মূল ভাষার (হিব্রু, আরামাইক এবং গ্রীক) শব্দগুলিকে মূল পাঠে যে ক্রমে উপস্থিত হয় সেই ক্রমে তালিকাভুক্ত করে। প্রতিটি শব্দের প্রতিবর্ণীকরণ, ব্যাকরণগত বিশ্লেষণ, [স্ট্রং-এর নম্বর](https://en.wikipedia.org/wiki/Strong%27s_Concordance) এবং [বেরিয়ান স্ট্যান্ডার্ড বাইবেল](https://berean.bible) দ্বারা ব্যবহৃত ইংরেজি বাক্যাংশ রয়েছে।

এই ডেটাসেটটি অন্যান্য ডেটাসেটের মতোই একই এন্ডপয়েন্ট ব্যবহার করে:

-   `GET https://bible.helloao.org/api/d/bsb-interlinear/books.json` ৬৬টি বইয়ের তালিকা দেওয়া আছে।
-   `GET https://bible.helloao.org/api/d/bsb-interlinear/{book}/{chapter}.json` (যেমন `/api/d/bsb-interlinear/GEN/1.json` ) অধ্যায়টি ফেরত দেয়, এবং `{ verse, words }` প্রতিটি শ্লোকের জন্য। প্রাপ্ত ফলাফলটি হলো একটি ['অধ্যায়' ডেটাসেট](#get-a-chapter-from-a-dataset) ।

শব্দ তথ্য [বেরিয়ান স্ট্যান্ডার্ড বাইবেলের আন্তঃরৈখিক সারণী](https://bereanbible.com/) থেকে নেওয়া হয়েছে, যা পাবলিক ডোমেইনে রয়েছে। শব্দগুলোর জন্য স্ট্রং-এর নম্বর [অভিধান](#lexicon) ( `stepbible-lexicon` ) থেকে খুঁজে নেওয়া হয়েছে।

### কাঠামো

```typescript:no-line-numbers title="interlinear-word.ts"
interface InterlinearWord {
    /**
     * মূল পাঠ্যের ক্রম অনুসারে শব্দটির ১-ভিত্তিক ক্রম।
     * শব্দগুলো এই ক্রমে তালিকাভুক্ত করা হয়েছে।
     */
    pos: number;

    /**
     * বেরিয়ান স্ট্যান্ডার্ড বাইবেলের ইংরেজি ক্রম অনুসারে শব্দটির ১-ভিত্তিক ক্রম।
     */
    bsbPos: number;

    /**
     * শব্দের ভাষা।
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * মূল লিপিতে থাকা শব্দটি। এনএফসি-নরম্যালাইজড।
     */
    text: string;

    /**
     * শব্দটির প্রতিবর্ণীকরণ।
     */
    transliteration: string | null;

    /**
     * শব্দটির সংক্ষিপ্ত ব্যাকরণগত বিশ্লেষণ কোড। যেমন "N-mp" বা "V-Qal-Perf-3ms"।
     */
    parsing: string | null;

    /**
     * শব্দটির সুস্পষ্ট ব্যাকরণগত বিশ্লেষণ।
     */
    parsingFull: string | null;

    /**
     * শব্দটির শূন্য বসানো স্ট্রং নম্বর। যেমন 'H0430' বা 'G3056'।
     * শূন্য দিয়ে পূরণ করা, যা KJV-এর `.words.json` মানগুলোর সাথে মিলে যায়।
     * অন্যান্য অনুবাদের মানগুলিকে যুক্ত করার আগে শূন্য-প্যাডিং এবং সাফিক্স অপসারণের প্রয়োজন হতে পারে।
     * উৎস যখন শব্দটির কোনো স্ট্রং নম্বর দেয় না, তখন এটি নাল (কিছু প্রত্যয়যুক্ত শব্দের ক্ষেত্রে এটি প্রযোজ্য, যেমন সর্বনামের প্রত্যয়)।
     */
    strongs: string | null;

    /**
     * বেরিয়ান স্ট্যান্ডার্ড বাইবেলে শব্দটির জন্য ব্যবহৃত ইংরেজি বাক্যাংশ।
     * যখন BSB কোনো শব্দকে অনুবাদ না করে রেখে দেয় (যেমন হিব্রু প্রত্যক্ষ কর্ম নির্দেশক), তখন তা বাতিল বলে গণ্য হয়।
     */
    gloss: string | null;
}
```

### উদাহরণ

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

### অনুবাদের সাথে শব্দ সংযোগ করা

দুটি লাইনের মাঝের `strongs` মানগুলোকে শূন্য দিয়ে পূরণ করা হয় (যেমন `H0430` )। এটি KJV-এর শব্দ টীকায় থাকা `strongs` মানের সাথে মেলে ( `/api/eng_kjv/{book}/{chapter}.words.json` )। অন্যান্য অনুবাদের মানগুলোকে যুক্ত করার আগে শূন্য দিয়ে পূরণ এবং প্রত্যয় বাদ দেওয়ার প্রয়োজন হতে পারে (যেমন `H430` বা `H1961a` থেকে `H0430` এবং `H1961` )।

-   **KJV।** কিং জেমস ভার্সনের ( `eng_kjv` এবং `eng_kja` ) ক্ষেত্রে, একটি অধ্যায়ের `.words.json` নম্বর ফাইলে থাকা স্ট্রং'স নম্বরগুলোকে একই পদের দুই লাইনের মধ্যবর্তী শব্দগুলোর `strongs` নম্বরের সাথে যুক্ত করুন। উদাহরণস্বরূপ, ১ নম্বর পদের জন্য `/api/eng_kjv/GEN/1.words.json` নম্বরে চিহ্নিত প্রতিটি স্ট্রং'স নম্বর ( `H7225` , `H1254` , `H0430` , `H0853` , `H8064` , `H0776` ) `/api/d/bsb-interlinear/GEN/1.json` নম্বরে ১ নম্বর পদের শব্দগুলোর মধ্যে একটি `strongs` মান হিসেবে দেখা যায়।
-   **বেরিয়ান স্ট্যান্ডার্ড বাইবেল।** প্রতিটি শব্দের `gloss` হলো সেই শব্দের জন্য BSB বাক্যাংশ। পদের শব্দগুলো `bsbPos` দেখুন এবং শব্দটির অনুবাদ কোথায় বসে তা খুঁজে বের করতে BSB অনুবাদের পদের পাঠ্যের সাথে প্রতিটি `gloss` মেলান।

দুটি উৎসের সংখ্যায়ন সবসময় মেলে না। উদাহরণস্বরূপ, KJV-তে 'was'-কে `G2258` হিসেবে ট্যাগ করা হয়েছে, যেখানে বেরিয়ান টেবিলে এটি `G1510` এই ধরনের পার্থক্যের কারণে কয়েকটি জয়েন ব্যর্থ হয়।

### অ্যাট্রিবিউশন

বেরিয়ান ইন্টারলিনিয়ার টেবিলগুলো পাবলিক ডোমেইনের অন্তর্গত। [লেক্সিকনটি](#lexicon) CC BY 4.0 লাইসেন্সের অধীনে রয়েছে এবং এর জন্য অ্যাট্রিবিউশন প্রয়োজন।

## অভিধান

STEPBible লেক্সিকন ডেটাসেট ( `stepbible-lexicon` )-এ কেমব্রিজের টিনডেল হাউসে অবস্থিত [STEPBible.org](https://www.stepbible.org/) থেকে হিব্রু, আরামাইক এবং গ্রীক সংক্ষিপ্ত লেক্সিকন (TBESH এবং TBESG) রয়েছে। এতে প্রতিটি বেস স্ট্রং নম্বরের জন্য একটি করে এন্ট্রি রয়েছে এবং প্রতিটি এন্ট্রিতে লেমা, প্রতিবর্ণীকরণ, পদ, ইংরেজি গ্লস এবং একটি সংজ্ঞাসহ এক বা একাধিক অর্থ রয়েছে।

অভিধানে অন্তর্ভুক্ত কোনো [শব্দের মধ্যবর্তী](#interlinear-datasets) ধ্বনি থেকে শূন্য যোগ করে প্রাপ্ত `strongs` মানটিকে কোনো রকম পুনঃবিন্যাস ছাড়াই `/api/d/stepbible-lexicon/lexicon/{strongs}.json` নম্বরে খুঁজে দেখা যায়। KJV-এর `.words.json` মানের ক্ষেত্রেও একই কথা প্রযোজ্য; অন্যান্য অনুবাদের মানগুলোর ক্ষেত্রে প্রথমে শূন্য যোগ এবং প্রত্যয় বাদ দেওয়ার প্রয়োজন হতে পারে। অভিধানে স্ট্রং নম্বর ছাড়া যোগ করা গ্রিক ধ্বনিগুলো প্রকাশিত হয় না।

যেসব ডেটাসেটে লেক্সিকন এন্ট্রি থাকে, সেগুলোর `/api/available_datasets.json` নং এন্ট্রিতে `listOfLexiconApiLink` এবং `totalNumberOfLexicon` অন্তর্ভুক্ত থাকে।

### অ্যাট্রিবিউশন

শব্দকোষের ডেটা [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) লাইসেন্সের অধীনে রয়েছে। আপনি যদি এটি ব্যবহার করেন, তবে STEPBible.org / Tyndale House, Cambridge-কে কৃতিত্ব দিন এবং যেকোনো পরিবর্তন উল্লেখ করুন। ডেটাসেটের `licenseNotes` প্রপার্টিতে এই কৃতিত্বের উল্লেখ রয়েছে।

## একটি ডেটাসেটে লেক্সিকন এন্ট্রিগুলির তালিকা

`GET https://bible.helloao.org/api/d/{dataset}/lexicon.json`

একটি ডেটাসেটের জন্য উপলব্ধ লেক্সিকন এন্ট্রিগুলির তালিকা পাওয়া যায়।

-   `dataset` ডেটাসেটের আইডি (যেমন `stepbible-lexicon` )।

### কোডের উদাহরণ

::: code-tabs#lang

@ট্যাব জাভাস্ক্রিপ্ট

```ts:no-line-numbers title="fetch-lexicon.js"
fetch(`https://bible.helloao.org/api/d/stepbible-lexicon/lexicon.json`)
    .then(request => request.json())
    .then(lexicon => {
        console.log('The lexicon has', lexicon.lexicon.length, 'entries');
    });
```

@ট্যাব cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/stepbible-lexicon/lexicon.json
```

:::

### কাঠামো

```typescript:no-line-numbers title="dataset-lexicon.ts"
export interface DatasetLexicon {
    /**
     * শব্দকোষটির ডেটাসেট তথ্য।
     */
    dataset: Dataset;

    /**
     * ডেটাসেটটির জন্য উপলব্ধ লেক্সিকন এন্ট্রিগুলির তালিকা।
     */
    lexicon: DatasetLexiconEntrySummary[];
}

export interface DatasetLexiconEntrySummary {
    /**
     * লেক্সিকন এন্ট্রির শূন্য-যুক্ত স্ট্রং নম্বর। যেমন 'H0430'।
     */
    id: string;

    /**
     * অভিধান ভুক্তিটির ভাষা।
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * অভিধান ভুক্তিটির নাম।
     * এটি ভুক্তিটির প্রথম অর্থের উপপাদ্য।
     */
    name: string;

    /**
     * অভিধান ভুক্তির জন্য এপিআই লিঙ্ক।
     */
    apiLink: string;
}
```

### উদাহরণ

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

## একটি ডেটাসেট থেকে একটি লেক্সিকন এন্ট্রি পান

`GET https://bible.helloao.org/api/d/{dataset}/lexicon/{strongs}.json`

একটি একক-ভিত্তিক স্ট্রং সংখ্যার অভিধান ভুক্তিটি তার সমস্ত অর্থসহ পাওয়া যায়।

-   `dataset` ডেটাসেটের আইডি (যেমন `stepbible-lexicon` )।
-   `strongs` হলো স্ট্রং-এর সংখ্যার সাথে শূন্য যোগ করে প্রাপ্ত মান (যেমন হিব্রু শব্দ _এলোহিম_-এর জন্য `H0430` , বা গ্রিক শব্দ _লোগোস_-এর জন্য `G3056` )।

### কোডের উদাহরণ

::: code-tabs#lang

@ট্যাব জাভাস্ক্রিপ্ট

```ts:no-line-numbers title="fetch-lexicon-entry.js"
const strongs = 'H1254';

fetch(`https://bible.helloao.org/api/d/stepbible-lexicon/lexicon/${strongs}.json`)
    .then(request => request.json())
    .then(({ entry }) => {
        console.log('H1254:', entry.senses.map(sense => sense.gloss));
    });
```

@ট্যাব cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/stepbible-lexicon/lexicon/H1254.json
```

:::

### কাঠামো

```typescript:no-line-numbers title="dataset-lexicon-entry.ts"
export interface DatasetLexiconEntry {
    /**
     * লেক্সিকন এন্ট্রিটির জন্য ডেটাসেট তথ্য।
     */
    dataset: Dataset;

    /**
     * অভিধান ভুক্তিটি।
     */
    entry: DatasetLexiconEntryContent;

    /**
     * এই শব্দকোষ ভুক্তির এপিআই লিঙ্ক।
     */
    thisLexiconEntryApiLink: string;
}

export interface DatasetLexiconEntryContent {
    /**
     * এন্ট্রিটির শূন্য-যুক্ত স্ট্রং নম্বর। যেমন 'H0430'।
     */
    id: string;

    /**
     * এন্ট্রিটির ভাষা।
     * এটি ভুক্তিটির প্রথম অর্থের ভাষা।
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * প্রবেশের অর্থসমূহ, শনাক্তকরণের ক্রমানুসারে।
     */
    senses: DatasetLexiconSense[];
}

export interface DatasetLexiconSense {
    /**
     * অর্থের বর্ধিত আইডি। যেমন "H0001G"।
     * যখন সংখ্যাটির একটিমাত্র অর্থ থাকে, তখন এটি মূল স্ট্রং সংখ্যার সমান হয়।
     */
    id: string;

    /**
     * অর্থের ভাষা।
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * মূল লিপিতে অর্থের উপপাদ্য।
     */
    lemma: string;

    /**
     * লেমাটির প্রতিবর্ণীকরণ।
     */
    transliteration: string | null;

    /**
     * অর্থের পদ (রূপতাত্ত্বিক) সংকেত।
     */
    partOfSpeech: string | null;

    /**
     * ভাবার্থের সংক্ষিপ্ত ইংরেজি ব্যাখ্যা।
     */
    gloss: string | null;

    /**
     * অর্থের সংজ্ঞাটি সাধারণ পাঠ্য হিসেবে।
     * অনুচ্ছেদগুলো ফাঁকা লাইন দ্বারা পৃথক করা হয়। সোর্স থেকে মার্কআপ মুছে ফেলা হয়।
     */
    definition: string;
}
```

### উদাহরণ

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

## দিনের শ্লোক

দিনের শ্লোক ডেটাসেট ( `verse-of-the-day` ) হল সুপরিচিত শ্লোক এবং সংক্ষিপ্ত অনুচ্ছেদের (সর্বাধিক তিনটি শ্লোক) একটি সংকলিত তালিকা যা "দিনের শ্লোক" এর জন্য উপযুক্ত: বছরের প্রতিটি দিনের জন্য 640 টিরও বেশি এবং খ্রিস্টীয় ছুটির দিনগুলির জন্য 100 টিরও বেশি। প্রতিটিই নিজস্বভাবে অর্থবহ।

প্রতিদিনের প্রতিটি শ্লোকের এই নির্দিষ্ট সেট থেকে এক থেকে তিনটি বিভাগ থাকে, যার মধ্যে সবচেয়ে প্রাসঙ্গিকটি প্রথমে থাকে:

| আইডি          | বর্ণনা                                                                   |
| ------------- | ------------------------------------------------------------------------ |
| `comfort`     | দুঃখ, কষ্ট ও একাকীত্বে ঈশ্বরের সান্নিধ্য ও যত্ন।                         |
| `courage`     | দৃঢ় থাকা এবং নির্ভয় থাকা।                                              |
| `faith`       | ঈশ্বর ও তাঁর প্রতিশ্রুতির ওপর আস্থা রাখা।                                |
| `forgiveness` | ঈশ্বরের পাপ ক্ষমা এবং অন্যদের ক্ষমা করা।                                 |
| `gratitude`   | ঈশ্বরকে ধন্যবাদ জ্ঞাপন।                                                  |
| `guidance`    | ঈশ্বর আমাদের পদক্ষেপ, পরিকল্পনা এবং সিদ্ধান্ত পরিচালনা করেন।             |
| `hope`        | ঈশ্বরের প্রতিশ্রুত ভবিষ্যতের প্রতি আস্থা।                                |
| `inspiration` | বিশ্বাস অনুযায়ী জীবনযাপন করতে এবং ভালো কাজ করতে উৎসাহ।                  |
| `joy`         | ঈশ্বরে আনন্দ ও উল্লাস।                                                   |
| `love`        | আমাদের প্রতি ঈশ্বরের ভালোবাসা এবং ঈশ্বর ও অন্যদের প্রতি আমাদের ভালোবাসা। |
| `peace`       | বিশ্রাম, স্থিরতা এবং উদ্বেগ থেকে মুক্তি।                                 |
| `praise`      | ঈশ্বরের মহিমার উপাসনা ও ঘোষণা।                                           |
| `prayer`      | ঈশ্বরকে আহ্বান এবং তাঁর শোনার প্রতিশ্রুতির ওপর ভরসা।                     |
| `provision`   | ঈশ্বর আমাদের প্রয়োজনীয় সবকিছু সরবরাহ করেন।                             |
| `salvation`   | খ্রীষ্টে মুক্তি, অনুগ্রহ এবং নতুন জীবন।                                  |
| `strength`    | ঈশ্বর প্রদত্ত শক্তি ও সহনশীলতা।                                          |
| `wisdom`      | ঐশ্বরিক প্রজ্ঞা এবং জীবনের জন্য বাস্তব নির্দেশনা।                        |

ছুটির দিনগুলোর নিজস্ব বিভাগ রয়েছে। ছুটির দিনে, সেই দিনের শ্লোকটি হয় ছুটির দিনটিরই একটি শ্লোক, এবং সেই শ্লোকগুলো অন্য দিনে ব্যবহার করা হয় না। একটি ছুটি সাধারণত একদিন স্থায়ী হয়; ‘আফটার রেজারেকশন সানডে’ (পুনরুত্থান রবিবারের পরের ছুটি) পুনরুত্থান রবিবারের পরের তিন দিন স্থায়ী হয়, তাই এতে তিনটি তারিখই তালিকাভুক্ত করা হয়। প্রতিটি ছুটির বিভাগের তারিখের সাথে একটি `holiday` থাকে: যে ছুটিগুলো প্রতি বছর একই তারিখে পড়ে সেগুলোর জন্য `month` এবং `day` থাকে, এবং যে ছুটিগুলোর তারিখ প্রতি বছর পরিবর্তিত হয় (কারণ সেগুলো পুনরুত্থান রবিবার বা অ্যাডভেন্টের উপর নির্ভরশীল), সেগুলোর `dates` গ্রেগরিয়ান ক্যালেন্ডার অনুযায়ী তালিকাভুক্ত করা হয়, যা ২০২৬ থেকে ২১২৫ সালের জন্য পূর্ব-গণনাকৃত।

| আইডি                       | ছুটি                    | তারিখ                                |
| -------------------------- | ----------------------- | ------------------------------------ |
| `epiphany`                 | এপিফ্যানি               | ৬ই জানুয়ারী                         |
| `ash-wednesday`            | ছাই বুধবার              | পুনরুত্থান রবিবারের ৪৬ দিন আগে       |
| `palm-sunday`              | পাম রবিবার              | পুনরুত্থান রবিবারের আগের রবিবার      |
| `maundy-thursday`          | মন্ডি বৃহস্পতিবার       | পুনরুত্থান রবিবারের আগের বৃহস্পতিবার |
| `good-friday`              | শুভ শুক্রবার            | পুনরুত্থান রবিবারের আগের শুক্রবার    |
| `resurrection-sunday`      | পুনরুত্থান রবিবার       | ইস্টার রবিবার                        |
| `post-resurrection-sunday` | পুনরুত্থান রবিবারের পরে | পুনরুত্থান রবিবারের পরের তিন দিন     |
| `ascension-day`            | আরোহণ দিবস              | পুনরুত্থান রবিবারের ৩৯ দিন পর        |
| `pentecost`                | পেন্টেকস্ট              | পুনরুত্থান রবিবারের ৪৯ দিন পর        |
| `all-hallows-eve`          | অল হ্যালোজ ইভ           | ৩১শে অক্টোবর                         |
| `all-saints-day`           | সর্ব সাধু দিবস          | ১লা নভেম্বর                          |
| `advent-sunday`            | আগমনকালের প্রথম রবিবার  | ক্রিসমাসের আগের চতুর্থ রবিবার        |
| `christmas-eve`            | ক্রিসমাস ইভ             | ২৪শে ডিসেম্বর                        |
| `christmas`                | ক্রিসমাস                | ২৫শে ডিসেম্বর                        |

ডেটাসেটটিতে শ্লোকের মূল পাঠ নয়, কেবল তথ্যসূত্র রয়েছে, তাই এটি সব ধরনের অনুবাদের সাথেই কাজ করে। শ্লোক সংখ্যাগুলোতে প্রমিত ইংরেজি সংখ্যা পদ্ধতি (বিএসবি-এর মতোই) ব্যবহার করা হয়েছে। ডেটাটি তিনভাবে পড়া যায়:

-   [`/api/d/verse-of-the-day/verses.json`](#list-verses-in-a-dataset) নং ফাইলে ডেটাসেটের প্রতিটি শ্লোক তার শ্রেণীবিভাগসহ এবং ছুটির দিনগুলো তাদের তারিখসহ তালিকাভুক্ত করা হয়েছে।
-   [`/api/d/verse-of-the-day/categories/{category}.json`](#get-a-category-from-a-dataset) এ একটি বিভাগের প্রতিটি পদ তালিকাভুক্ত করা হয়। একটি বিভাগ থেকে দিনের পদ বেছে নেওয়ার এটিই সবচেয়ে সহজ উপায়।
-   [`/api/d/verse-of-the-day/{book}/{chapter}.json`](#get-a-chapter-from-a-dataset) একটি অধ্যায়ের প্রার্থীদের তাদের বিভাগসহ তালিকাভুক্ত করে। শুধুমাত্র সেই অধ্যায়গুলোই পাওয়া যাবে যেগুলোতে কোনো প্রার্থী রয়েছে; তাদের খুঁজে পেতে বইয়ের অধ্যায় লিঙ্ক বা `/api/d/verse-of-the-day/books.json` ব্যবহার করুন।

যেসব ডেটাসেটে শ্লোক বিভাগ রয়েছে, সেগুলোর `/api/available_datasets.json` এন্ট্রিতে `listOfVersesApiLink` , `listOfCategoriesApiLink` এবং `totalNumberOfCategories` অন্তর্ভুক্ত থাকে।

### দিনের শ্লোক বাছাই

এপিআইটি স্ট্যাটিক ফাইল দিয়ে তৈরি, তাই এটি আপনার জন্য কোনো আয়াত বেছে নেয় না। এর পরিবর্তে, একটি আয়াত বেছে নেওয়ার জন্য একটি প্রথা রয়েছে, যাতে এটি অনুসরণকারী প্রতিটি অ্যাপ একই দিনে একই আয়াত প্রদর্শন করে। অ্যাপগুলো ভিন্নভাবে বেছে নিতে পারে; এই প্রথাটি শুধু তাদের একটি সাধারণ ডিফল্ট মান প্রদান করে।

এই পদ্ধতিটি `/api/d/verse-of-the-day/verses.json` তে থাকা শ্লোক এবং ছুটির দিনগুলো থেকে নির্বাচন করে। কোনো ছুটির দিনে, এটি সেই ছুটির দিনের একটি শ্লোক বেছে নেয় এবং প্রতি বছর একটি করে শ্লোক ধরে এগোতে থাকে, ফলে যতক্ষণ না পর্যন্ত একটি ছুটির দিনের সমস্ত শ্লোক ব্যবহৃত হয়ে যায়, ততক্ষণ পর্যন্ত প্রতি বছর সেই ছুটির দিনের জন্য একটি ভিন্ন শ্লোক থাকে। অন্যান্য দিনগুলিতে, প্রতি বছর ব্যবহৃত শ্লোকগুলোর নিজস্ব একটি শাফলিং করা হয় (প্রতিটি শ্লোকের রেফারেন্সের হ্যাশ, বছর এবং একটি ঐচ্ছিক সিড অনুসারে সাজানো), এবং সেই শাফলিং-এ নির্দিষ্ট তারিখের দিনের শ্লোকটিই দিনের শ্লোক হিসেবে নির্বাচিত হয়। ডেটাসেটটিতে প্রতি বছর ব্যবহৃত প্রতিটি দিনের জন্য ৩৬৬টিরও বেশি শ্লোক রয়েছে, ফলে একটি পঞ্জিকা বছরের মধ্যে কোনো শ্লোক কখনও পুনরাবৃত্তি হয় না, প্রতি বছর ক্রম পরিবর্তিত হয় এবং একই তারিখে সর্বদা একই শ্লোক পাওয়া যায়। নতুন শ্লোক যোগ করা হয় ( `addedIn` দিয়ে) এবং পুরানো শ্লোক সরানো হয় ( `removedIn` দিয়ে) শুধুমাত্র সেই বছর থেকে যা এখনও শুরু হয়নি, ফলে অতীতের কোনো তারিখের জন্য দিনের শ্লোক কখনও পরিবর্তিত হয় না।

' [Verse of the Day Convention'](./verse-of-the-day-convention.md) পৃষ্ঠাটিতে সিউডোকোড এবং টেস্ট ভ্যালু সহ অ্যালগরিদমটি ধাপে ধাপে নির্দিষ্ট করা আছে, যাতে আপনি যেকোনো ভাষায় এটি প্রয়োগ করতে পারেন।

আপনার নিজের ক্রম ব্যবহার করতে, আপনার নিজের একটি সিড বেছে নিন (উদাহরণস্বরূপ, আপনার অ্যাপের নাম): এটি একই নিশ্চয়তা সহ একটি ভিন্ন শাফেল প্রদান করে। আপনি একটি নির্দিষ্ট ক্যাটাগরির শ্লোকগুলো থেকেও বেছে নিতে পারেন, কিন্তু প্রতিটি ক্যাটাগরিতে বছরের দিনের সংখ্যার চেয়ে কম শ্লোক থাকে, তাই এর শ্লোকগুলো দ্রুত পুনরাবৃত্তি হয়।

এসডিকে-গুলো এই নিয়ম অনুসরণ করে:

```ts:no-line-numbers title="verse-of-the-day.js"
import { FreeUseBibleApi } from 'free-use-bible-api';

const api = new FreeUseBibleApi();

// তারিখটি YYYY-MM-DD ফরম্যাটে হতে পারে, অথবা একটি নির্দিষ্ট তারিখ (এক্ষেত্রে স্থানীয় ক্যালেন্ডারের তারিখ ব্যবহৃত হয়)। ডিফল্ট হিসেবে আজকের তারিখটিই ব্যবহৃত হয়।
const ref = await api.getVerseOfTheDay('2026-01-01');

// কোনো অনুবাদ থেকে শ্লোকটির মূল পাঠ সংগ্রহ করুন।
const chapter = await api.getTranslationBookChapter('BSB', ref.book, ref.chapter);
const verses = chapter.chapter.content.filter(
    (c) =>
        c.type === 'verse' &&
        c.number >= ref.verse &&
        c.number <= (ref.endVerse ?? ref.verse)
);
console.log(ref, verses);
```

-   `getVerseOfTheDay(date?, { seed?, category?, dataset? }?)` শ্লোকের তালিকাটি ডাউনলোড করে সেখান থেকে বেছে নেয়। `pickVerseOfTheDay(verses, date?, { seed?, category? }?)` আপনার কাছে আগে থেকে থাকা একটি তালিকা থেকে বেছে নেয়।
-   Kotlin SDK-তে `getVerseOfTheDay(date?, seed?, category?)` এবং `pickVerseOfTheDay(verses, date?, seed?, category?)` রয়েছে, যেগুলো তারিখকে একটি `YYYY-MM-DD` স্ট্রিং হিসেবে গ্রহণ করে।
-   সুইফট এসডিকে-তে `getVerseOfTheDay(date:seed:category:)` এবং `pickVerseOfTheDay(_:date:seed:category:holidays:)` রয়েছে, যা তারিখটিকে একটি `YYYY-MM-DD` স্ট্রিং বা একটি `Date` হিসাবে গ্রহণ করে (বর্তমান টাইম জোনের ক্যালেন্ডার তারিখটি ব্যবহৃত হয়)।
-   [এমসিপি সার্ভারে](https://github.com/HelloAOLab/bible-api/tree/main/packages/seed-bible-mcp) `getVerseOfTheDay` টুল আছে যা দিনের শ্লোকটি তার মূল পাঠসহ ফেরত দেয়।
-   `@helloao/tools` প্যাকেজে একই তালিকা এবং `@helloao/tools/generation/verse-of-the-day.js` তে একটি `getVerseOfTheDay(date?, { seed?, category? }?)` ফাংশন রয়েছে।

### লাইসেন্স

তালিকাটি এও ল্যাব (AO Lab) দ্বারা সংকলিত এবং [এমআইটি লাইসেন্সের (MIT License)](https://github.com/HelloAOLab/bible-api/blob/main/LICENSE) অধীনে প্রকাশিত। শ্লোকের পাঠ্যটি আপনি যে অনুবাদ থেকেই সংগ্রহ করুন না কেন, সেখান থেকেই নেওয়া হয়েছে।

## একটি ডেটাসেটে শ্লোকগুলির তালিকা

`GET https://bible.helloao.org/api/d/{dataset}/verses.json`

একটি ডেটাসেটের প্রতিটি শ্লোক (বা সংক্ষিপ্ত অনুচ্ছেদ) প্রামাণিক ক্রম অনুসারে, সেগুলোর অন্তর্ভুক্ত বিভাগসহ খুঁজে বের করে। এটি শুধুমাত্র সেইসব ডেটাসেটের জন্য উপলব্ধ, যাদের শ্লোকগুলোর বিভাগ রয়েছে, যেমন `verse-of-the-day` ।

-   `dataset` ডেটাসেটের আইডি (যেমন `verse-of-the-day` )।

### কোডের উদাহরণ

::: code-tabs#lang

@ট্যাব জাভাস্ক্রিপ্ট

```ts:no-line-numbers title="fetch-verses.js"
fetch(`https://bible.helloao.org/api/d/verse-of-the-day/verses.json`)
    .then(request => request.json())
    .then(verses => {
        console.log('The dataset has', verses.verses.length, 'verses');
    });
```

@ট্যাব cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/verse-of-the-day/verses.json
```

:::

### কাঠামো

```typescript:no-line-numbers title="dataset-verses.ts"
export interface DatasetVerses {
    /**
     * শ্লোকগুলোর ডেটাসেট তথ্য।
     */
    dataset: Dataset;

    /**
     * ডেটাসেটের প্রতিটি শ্লোক (বা সংক্ষিপ্ত অনুচ্ছেদ), তার বিভাগসমূহ সহ, প্রামাণ্য ক্রম অনুসারে।
     */
    verses: DatasetCategorizedVerse[];

    /**
     * যেসব ছুটির দিনের নিজস্ব শ্লোক ও তারিখ রয়েছে।
     * ডেটাসেটে কোনো ছুটির দিন না থাকলে এটি বাদ দেওয়া হয়।
     */
    holidays?: DatasetVersesHoliday[];
}

export interface DatasetVersesHoliday extends DatasetCategoryHoliday {
    /**
     * ছুটির বিভাগের আইডি। যেমন 'ক্রিসমাস'।
     */
    id: string;

    /**
     * ছুটির দিনটির ইংরেজি নাম। যেমন 'Christmas'।
     */
    name: string;
}

export interface DatasetCategoryHoliday {
    /**
     * এমন একটি ছুটির মাস (জানুয়ারির জন্য ১) এবং দিন, যা প্রতি বছর একই তারিখে পড়ে।
     * যেসব ছুটির তারিখ প্রতি বছর পরিবর্তিত হয়, সেগুলো বাদ দেওয়া হয়েছে।
     */
    month?: number;
    day?: number;

    /**
     * এমন একটি ছুটির দিনের তারিখগুলো (গ্রেগরিয়ান ক্যালেন্ডার অনুযায়ী YYYY-MM-DD) ক্রমানুসারে, যার তারিখ প্রতি বছর পরিবর্তিত হয়।
     * এগুলো একটি নির্দিষ্ট সময়সীমার (বর্তমানে ২০২৬ থেকে ২১২৫) জন্য আগে থেকেই গণনা করা থাকে এবং শুধুমাত্র তালিকাভুক্ত তারিখগুলিতেই এই ছুটি পালন করা হয়।
     * যেসব ছুটি প্রতি বছর একই তারিখে পড়ে, সেগুলোর ক্ষেত্রে এটি বাদ দেওয়া হয়।
     */
    dates?: string[];
}

export interface DatasetCategorizedVerse {
    /**
     * বইটির আইডি। যেমন "PRO"।
     */
    book: string;

    /**
     * অধ্যায় সংখ্যা।
     */
    chapter: number;

    /**
     * শ্লোক সংখ্যা।
     * যদি `endVerse` থাকে, তাহলে এটিই সেই পদ যেখান থেকে অনুচ্ছেদটি শুরু হয়।
     */
    verse: number;

    /**
     * যে আয়াতে অনুচ্ছেদটি শেষ হয়।
     * ভুক্তিটি একটিমাত্র শ্লোক হলে বাদ দেওয়া হয়।
     */
    endVerse?: number;

    /**
     * আয়াতটি যে যে বিভাগের অন্তর্গত, সেগুলোর আইডি; সবচেয়ে প্রাসঙ্গিকটি প্রথমে।
     */
    categories: string[];

    /**
     * এই প্রথম বছর শ্লোকটি দিনের শ্লোক হতে পারবে।
     * যদি আয়াতটি সবসময় তালিকায় থাকে, তবে তা বাদ দেওয়া হয়।
     */
    addedIn?: number;

    /**
     * এই প্রথম বছর থেকে শ্লোকটি আর দিনের শ্লোক হতে পারবে না।
     * বাদ দেওয়া আয়াতগুলো ডেটাসেটে থেকে যায়, যাতে আগের বছরগুলোর আয়াতগুলোও বাছাই করা যায়।
     * তালিকা থেকে শ্লোকটি সরানো না হলে তা বাদ দেওয়া হয়।
     */
    removedIn?: number;
}
```

### উদাহরণ

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

## একটি ডেটাসেটে বিভাগগুলি তালিকাভুক্ত করুন

`GET https://bible.helloao.org/api/d/{dataset}/categories.json`

একটি ডেটাসেটের জন্য উপলব্ধ শ্লোক বিভাগগুলির তালিকা পাওয়া যায়।

-   `dataset` ডেটাসেটের আইডি (যেমন `verse-of-the-day` )।

### কোডের উদাহরণ

::: code-tabs#lang

@ট্যাব জাভাস্ক্রিপ্ট

```ts:no-line-numbers title="fetch-categories.js"
fetch(`https://bible.helloao.org/api/d/verse-of-the-day/categories.json`)
    .then(request => request.json())
    .then(categories => {
        console.log('The dataset has the following categories:', categories.categories);
    });
```

@ট্যাব cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/verse-of-the-day/categories.json
```

:::

### কাঠামো

```typescript:no-line-numbers title="dataset-categories.ts"
export interface DatasetCategories {
    /**
     * বিভাগগুলোর জন্য ডেটাসেটের তথ্য।
     */
    dataset: Dataset;

    /**
     * ডেটাসেটটির জন্য উপলব্ধ শ্লোক বিভাগগুলির তালিকা।
     */
    categories: DatasetCategorySummary[];
}

export interface DatasetCategorySummary {
    /**
     * ক্যাটাগরির আইডি। যেমন 'আশা'।
     */
    id: string;

    /**
     * বিভাগটির ইংরেজি নাম। যেমন 'Hope'।
     */
    name: string;

    /**
     * এই বিভাগের শ্লোকগুলো কী বিষয়ে তার বর্ণনা।
     */
    description: string;

    /**
     * এই বিভাগের অন্তর্ভুক্ত শ্লোকগুলোর (বা সংক্ষিপ্ত অনুচ্ছেদগুলোর) সংখ্যা।
     */
    numberOfVerses: number;

    /**
     * যে ছুটির তারিখগুলোর জন্য ক্যাটাগরিটি তৈরি করা হয়েছে (উপরে DatasetCategoryHoliday দেখুন)।
     * যেসব বিভাগ ছুটির দিনের জন্য নয়, সেগুলোর ক্ষেত্রে বাদ দেওয়া হয়েছে।
     */
    holiday?: DatasetCategoryHoliday;

    /**
     * ক্যাটাগরিটির এপিআই লিঙ্ক।
     */
    apiLink: string;
}
```

### উদাহরণ

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

## একটি ডেটাসেট থেকে একটি বিভাগ পান

`GET https://bible.helloao.org/api/d/{dataset}/categories/{category}.json`

একটিমাত্র শ্লোক বিভাগ পায়, এবং এর অন্তর্ভুক্ত প্রতিটি শ্লোকও তাতে থাকে।

-   `dataset` ডেটাসেটের আইডি (যেমন `verse-of-the-day` )।
-   `category` হলো ক্যাটাগরির আইডি (যেমন `hope` )।

### কোডের উদাহরণ

::: code-tabs#lang

@ট্যাব জাভাস্ক্রিপ্ট

```ts:no-line-numbers title="fetch-category.js"
fetch(`https://bible.helloao.org/api/d/verse-of-the-day/categories/hope.json`)
    .then(request => request.json())
    .then(category => {
        console.log('Verses about hope:', category.category.verses);
    });
```

@ট্যাব cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/verse-of-the-day/categories/hope.json
```

:::

### কাঠামো

```typescript:no-line-numbers title="dataset-category.ts"
export interface DatasetCategoryResponse {
    /**
     * বিভাগটির জন্য ডেটাসেটের তথ্য।
     */
    dataset: Dataset;

    /**
     * শ্রেণীটি, এবং এর অন্তর্ভুক্ত আয়াতসমূহ।
     */
    category: DatasetCategory;

    /**
     * এই বিভাগের জন্য এপিআই লিঙ্ক।
     */
    thisCategoryApiLink: string;
}

export interface DatasetCategory {
    /**
     * ক্যাটাগরির আইডি। যেমন 'আশা'।
     */
    id: string;

    /**
     * বিভাগটির ইংরেজি নাম। যেমন 'Hope'।
     */
    name: string;

    /**
     * এই বিভাগের শ্লোকগুলো কী বিষয়ে তার বর্ণনা।
     */
    description: string;

    /**
     * যে ছুটির দিনটির জন্য বিভাগটি নির্ধারিত, তার তারিখসমূহ (দেখুন "List Verses in a Dataset" অংশের "DatasetCategoryHoliday")।
     * ঐ তারিখগুলিতে দিনের শ্লোকটি সেই বিভাগেরই কোনো একটি শ্লোক হয় এবং সেগুলি অন্য দিনে ব্যবহার করা হয় না।
     * যেসব বিভাগ ছুটির দিনের জন্য নয়, সেগুলোর ক্ষেত্রে বাদ দেওয়া হয়েছে।
     */
    holiday?: DatasetCategoryHoliday;

    /**
     * প্রামাণ্য ক্রম অনুসারে, এই শ্রেণীর অন্তর্ভুক্ত শ্লোকগুলো (বা সংক্ষিপ্ত অনুচ্ছেদগুলো)।
     * তালিকা থেকে বাদ দেওয়া আয়াতগুলোও অন্তর্ভুক্ত (দেখুন `removedIn` )।
     */
    verses: DatasetCategoryVerse[];
}

export interface DatasetCategoryVerse {
    /**
     * বইটির আইডি। যেমন "JER"।
     */
    book: string;

    /**
     * অধ্যায় সংখ্যা।
     */
    chapter: number;

    /**
     * শ্লোক সংখ্যা।
     * যদি `endVerse` থাকে, তাহলে এটিই সেই পদ যেখান থেকে অনুচ্ছেদটি শুরু হয়।
     */
    verse: number;

    /**
     * যে আয়াতে অনুচ্ছেদটি শেষ হয়।
     * যদি উল্লেখটি একটিমাত্র শ্লোক হয়, তবে এটি বাদ দেওয়া হয়।
     */
    endVerse?: number;

    /**
     * এই প্রথম বছর শ্লোকটি দিনের শ্লোক হতে পারবে।
     * যদি আয়াতটি সবসময় তালিকায় থাকে, তবে তা বাদ দেওয়া হয়।
     */
    addedIn?: number;

    /**
     * এই প্রথম বছর থেকে শ্লোকটি আর দিনের শ্লোক হতে পারবে না।
     * বাদ দেওয়া আয়াতগুলো ডেটাসেটে থেকে যায়, যাতে আগের বছরগুলোর আয়াতগুলোও বাছাই করা যায়।
     * তালিকা থেকে শ্লোকটি সরানো না হলে তা বাদ দেওয়া হয়।
     */
    removedIn?: number;
}
```

### উদাহরণ

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
