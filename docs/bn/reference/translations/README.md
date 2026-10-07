# অনুবাদ, বই এবং অধ্যায়

অনুবাদ ব্রাউজ করা, সেগুলোর বই তালিকাভুক্ত করা এবং অধ্যায়ের বিষয়বস্তু আনার জন্য এন্ডপয়েন্ট।

অধ্যায়ের বিষয়বস্তু, সম্পূর্ণ অনুবাদ ডাউনলোড এবং শব্দ-স্তরের টীকা প্রতিটি দুটি ফরম্যাটে পাওয়া যায়:

-   [**প্রমিত বিন্যাস**](./standard.md) - মূল, কাঠামোগত বিন্যাস। শ্লোকের বিষয়বস্তু হলো বিভিন্ন অংশের (সাধারণ লেখা, বিন্যাসিত লেখা, পাদটীকায় তথ্যসূত্র, ইত্যাদি) একটি তালিকা যা আপনি নিজেই একত্রিত করেন।
-   [**সরলীকৃত বিন্যাস**](./simplified.md) - একটি সরলীকৃত বিন্যাস যেখানে প্রতিটি শ্লোকের বিষয়বস্তু একটি একক স্ট্রিং হিসেবে থাকে এবং পাদটীকা, কবিতা ও অন্যান্য মার্কআপ সেই স্ট্রিংয়ের মধ্যে অফসেট হিসেবে প্রকাশ করা হয়।

আপনি যেভাবে টেক্সটটি রেন্ডার বা প্রসেস করার পরিকল্পনা করছেন, সেই অনুযায়ী সবচেয়ে উপযুক্ত ফরম্যাটটি ব্যবহার করুন।

## উপলব্ধ অনুবাদ

`GET https://bible.helloao.org/api/available_translations.json`

এপিআই-তে উপলব্ধ অনুবাদগুলির তালিকা পাওয়া যায়।

### কোডের উদাহরণ

::: code-tabs#lang

@ট্যাব জাভাস্ক্রিপ্ট

```ts:no-line-numbers title="fetch-translations.js"
fetch(`https://bible.helloao.org/api/available_translations.json`)
    .then(request => request.json())
    .then(availableTranslations => {
        console.log('The API has the following translations:', availableTranslations);
    });
```

@ট্যাব cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/available_translations.json
```

:::

### কাঠামো

```typescript:no-line-numbers title="available-translations.ts"
export interface AvailableTranslations {
    /**
     * অনুবাদগুলোর তালিকা।
     */
    translations: Translation[];
}

interface Translation {
    /**
     * অনুবাদটির আইডি।
     */
    id: string;

    /**
     * অনুবাদটির নাম।
     * এটি সাধারণত অনুবাদের ভাষায় অনুবাদটির নাম।
     */
    name: string;

    /**
     * অনুবাদটির ইংরেজি নাম।
     */
    englishName: string;

    /**
     * অনুবাদের জন্য ওয়েবসাইট।
     */
    website: string;

    /**
     * যে ইউআরএল-এ অনুবাদের লাইসেন্সটি পাওয়া যাবে।
     */
    licenseUrl: string;

    /**
     * অনুবাদের সংক্ষিপ্ত নাম।
     */
    shortName: string;

    /**
     * আইএসও ৬৩৯-এর ৩-অক্ষরের ভাষা ট্যাগ, যেটিতে অনুবাদটি প্রধানত করা হয়েছে।
     */
    language: string;

    /**
     * অনুবাদটি যে ভাষায় করা হয়েছে, সেই ভাষার নাম খুঁজে বের করে।
     * ভাষার নাম জানা না থাকলে এর মান নাল বা অনির্ধারিত হবে।
     */
    languageName?: string;

    /**
     * ইংরেজি ভাষায় ভাষাটির নাম পায়।
     * ভাষাটির কোনো ইংরেজি নাম না থাকলে এর মান নাল বা অনির্ধারিত হবে।
     */
    languageEnglishName?: string;

    /**
     * যে দিকে ভাষাটি লেখা হয়।
     * "ltr" দ্বারা বোঝানো হয় যে লেখাটি পৃষ্ঠার বাম দিক থেকে ডান দিকে লেখা হয়েছে।
     * "rtl" নির্দেশ করে যে লেখাটি পৃষ্ঠার ডান দিক থেকে বাম দিকে লেখা হয়েছে।
     */
    textDirection: 'ltr' | 'rtl';

    /**
     * উপলব্ধ ফরম্যাটগুলোর তালিকা।
     */
    availableFormats: ('json' | 'usfm')[];

    /**
     * এই অনুবাদের জন্য উপলব্ধ বইগুলির তালিকার এপিআই লিঙ্ক।
     */
    listOfBooksApiLink: string;

    /**
     * এই অনুবাদে অন্তর্ভুক্ত বইয়ের সংখ্যা।
     *
     * সম্পূর্ণ অনুবাদে বাইবেলের (66) সমান সংখ্যক বই থাকা উচিত।
     */
    numberOfBooks: number;

    /**
     * এই অনুবাদটিতে মোট যতগুলো অধ্যায় রয়েছে।
     *
     * সম্পূর্ণ অনুবাদে বাইবেলের (১,১৮৯) সমান সংখ্যক অধ্যায় থাকা উচিত।
     */
    totalNumberOfChapters: number;

    /**
     * এই অনুবাদে অন্তর্ভুক্ত মোট শ্লোকের সংখ্যা।
     *
     * সম্পূর্ণ অনুবাদে বাইবেলের সমান সংখ্যক শ্লোক থাকা উচিত (প্রায় ৩১,১০২টি – কিছু অনুবাদে মূল উৎস গ্রন্থে শ্লোক থাকার আপাত সম্ভাবনার ভিত্তিতে কিছু শ্লোক বাদ দেওয়া হয়)।
     */
    totalNumberOfVerses: number;

    /**
     * এই অনুবাদে অন্তর্ভুক্ত অপ্রামাণিক গ্রন্থসমূহের মোট সংখ্যা।
     * অনুবাদে অপ্রামাণিক রচনা অন্তর্ভুক্ত না থাকলে এটি বাদ দেওয়া হয়।
     */
    numberOfApocryphalBooks?: number;

    /**
     * এই অনুবাদে অন্তর্ভুক্ত অপ্রামাণিক অধ্যায়গুলোর মোট সংখ্যা।
     * অনুবাদে অপ্রামাণিক রচনা অন্তর্ভুক্ত না থাকলে এটি বাদ দেওয়া হয়।
     */
    totalNumberOfApocryphalChapters?: number;

    /**
     * এই অনুবাদে অন্তর্ভুক্ত অপ্রামাণিক শ্লোকগুলোর মোট সংখ্যা।
     * অনুবাদে অপ্রামাণিক রচনা অন্তর্ভুক্ত না থাকলে এটি বাদ দেওয়া হয়।
     */
    totalNumberOfApocryphalVerses?: number;
}
```

### উদাহরণ

```json:no-line-numbers title="/api/available_translations.json"
{
    "translations": [
        {
            "id": "BSB",
            "name": "Berean Standard Bible",
            "website": "https://berean.bible/",
            "licenseUrl": "https://berean.bible/",
            "shortName": "BSB",
            "englishName": "Berean Standard Bible",
            "language": "eng",
            "textDirection": "ltr",
            "availableFormats": [
                "json"
            ],
            "listOfBooksApiLink": "/api/BSB/books.json",
            "numberOfBooks": 66,
            "totalNumberOfChapters": 1189,
            "totalNumberOfVerses": 31086,
            "languageName": "English",
            "languageEnglishName": "English"
        }
    ]
}
```

## অনুবাদে বইয়ের তালিকা

`GET https://bible.helloao.org/api/{translation}/books.json`

প্রদত্ত অনুবাদের জন্য উপলব্ধ বইগুলির তালিকা পাওয়া যায়।

-   `translation` হলো অনুবাদের আইডি (যেমন `BSB` )।

### কোডের উদাহরণ

::: code-tabs#lang

@ট্যাব জাভাস্ক্রিপ্ট

```ts:no-line-numbers title="fetch-books.js"
const translation = 'BSB';

// BSB অনুবাদের বইগুলোর তালিকা নিন।
fetch(`https://bible.helloao.org/api/${translation}/books.json`)
    .then(request => request.json())
    .then(books => {
        console.log('The BSB has the following books:', books);
    });
```

@ট্যাব cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/books.json
```

:::

### কাঠামো

```typescript:no-line-numbers title="books.ts"
export interface TranslationBooks {
    /**
     * বইগুলোর অনুবাদ সংক্রান্ত তথ্য।
     */
    translation: Translation;

    /**
     * অনুবাদের জন্য উপলব্ধ বইগুলোর তালিকা।
     */
    books: TranslationBook[];
}

interface TranslationBook {
    /**
     * বইটির আইডি।
     */
    id: string;

    /**
     * অনুবাদে বইটির জন্য যে নামটি দেওয়া হয়েছিল।
     */
    name: string;

    /**
     * বইটির প্রচলিত নাম।
     */
    commonName: string;

    /**
     * বইটির শিরোনাম।
     * এটি সাধারণত বইয়ের নামের একটি আরও বর্ণনামূলক সংস্করণ।
     * যদি উপলব্ধ না থাকে, তাহলে অনুবাদের মাধ্যমে তা প্রদান করা হয়নি।
     */
    title: string | null;

    /**
     * অনুবাদে বইটির সংখ্যাগত ক্রম।
     */
    order: number;

    /**
     * বইটিতে থাকা অধ্যায়ের সংখ্যা।
     */
    numberOfChapters: number;

    /**
     * বইটির প্রথম অধ্যায়ের সংখ্যা।
     */
    firstChapterNumber: number;

    /**
     * বইটির প্রথম অধ্যায়ের লিঙ্ক।
     */
    firstChapterApiLink: string;

    /**
     * বইটির শেষ অধ্যায়ের সংখ্যা।
     */
    lastChapterNumber: number;

    /**
     * বইটির শেষ অধ্যায়ের লিঙ্ক।
     */
    lastChapterApiLink: string;

    /**
     * বইটিতে থাকা শ্লোকের সংখ্যা।
     */
    totalNumberOfVerses: number;

    /**
     * বইটি একটি অপ্রামাণিক গ্রন্থ কিনা।
     * অনুবাদটি প্রামাণ্য হলে বাদ দেওয়া হয়।
     */
    isApocryphal?: boolean;
}
```

### উদাহরণ

```json:no-line-numbers title="/api/BSB/books.json"
{
    "translation": {
        "id": "BSB",
        "name": "Berean Standard Bible",
        "website": "https://berean.bible/",
        "licenseUrl": "https://berean.bible/",
        "shortName": "BSB",
        "englishName": "Berean Standard Bible",
        "language": "eng",
        "textDirection": "ltr",
        "availableFormats": [
            "json"
        ],
        "listOfBooksApiLink": "/api/BSB/books.json",
        "numberOfBooks": 66,
        "totalNumberOfChapters": 1189,
        "totalNumberOfVerses": 31086,
        "languageName": "English",
        "languageEnglishName": "English"
    },
    "books": [
        {
            "id": "GEN",
            "translationId": "BSB",
            "name": "Genesis",
            "commonName": "Genesis",
            "title": "Genesis",
            "order": 1,
            "numberOfChapters": 50,
            "firstChapterNumber": 1,
            "firstChapterApiLink": "/api/BSB/GEN/1.json",
            "lastChapterNumber": 50,
            "lastChapterApiLink": "/api/BSB/GEN/50.json",
            "totalNumberOfVerses": 1533
        },
    ]
}
```
