# ডেটাসেট

সম্পূরক বাইবেল ডেটাসেট—যেমন ক্রস রেফারেন্স এবং বাইবেলের সত্তাসমূহ (ব্যক্তি, স্থান, ঘটনা ও জাতিগোষ্ঠী)—ব্রাউজ করার এবং সেগুলোর বই, অধ্যায়ের বিষয়বস্তু ও সত্তাসমূহ সংগ্রহ করার এন্ডপয়েন্ট।

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
     * "rtl" নির্দেশ করে যে লেখাটি পৃষ্ঠার ডান দিক থেকে বাম দিকে লেখা হয়েছে।
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
     */
    totalNumberOfReferences: number;

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

ক্রস রেফারেন্স ডেটাসেটের (যেমন `open-cross-ref` ) ক্ষেত্রে, অধ্যায়টিতে প্রতিটি শ্লোকের জন্য ক্রস রেফারেন্সের তালিকা থাকে। এনটিটি ডেটাসেটের (যেমন `theographic` ) ক্ষেত্রে, অধ্যায়টিতে সেইসব ব্যক্তি, স্থান এবং ঘটনার তালিকা থাকে যা অধ্যায়টিতে উল্লেখিত আছে — [একটি অধ্যায়ের এনটিটিগুলো কীভাবে পাবেন তা দেখুন](#get-the-entities-in-a-chapter) ।

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

interface DatasetVerse {
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
     * ঋণাত্মক সংখ্যাগুলো হলো খ্রিস্টপূর্বাব্দ। ধনাত্মক সংখ্যাগুলো হলো খ্রিস্টাব্দ।
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
