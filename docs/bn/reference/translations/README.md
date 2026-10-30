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
     * লাইসেন্সের জন্য এপিআই দ্বারা যুক্ত করা নোটসমূহ।
     * কোনো নোট না থাকলে নাল বা অনির্ধারিত।
     */
    licenseNotes?: string | null;

    /**
     * অনুবাদ থেকে বিষয়বস্তু প্রদর্শন করার সময় যে বিজ্ঞপ্তিটি দেখানো উচিত।
     * অনুবাদটিতে কোনো বিজ্ঞপ্তি না থাকলে এর মান নাল বা অনির্ধারিত হবে।
     */
    licenseNotice?: string | null;

    /**
     * অনুবাদটির জন্য যে কাঠামোগত লাইসেন্সের শর্তাবলী শনাক্ত করা হয়েছে।
     * শর্তগুলো নির্ধারণ করা না গেলে তা শূন্য বা অনির্ধারিত হবে।
     * সেক্ষেত্রে, শর্তাবলীর জন্য licenseUrl-এ থাকা পৃষ্ঠাটি দেখুন।
     */
    license?: License | null;

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

/**
 * একটি অনুবাদের জন্য শনাক্তকৃত কাঠামোগত লাইসেন্সের শর্তাবলী সংজ্ঞায়িত করে।
 */
interface License {
    /**
     * অনুবাদটি ব্যবহারের ক্ষেত্রে মূল উৎসের উল্লেখ করা আবশ্যক কিনা।
     */
    attribution: 'required' | 'not-required';

    /**
     * অনুবাদটির বাণিজ্যিক ব্যবহার অনুমোদিত কিনা।
     */
    commercialUse: 'allowed' | 'not-allowed';

    /**
     * অনুবাদটির থেকে উদ্ভূত কর্ম তৈরি ও বিতরণ করা অনুমোদিত কিনা।
     */
    derivatives: 'allowed' | 'not-allowed';

    /**
     * উদ্ভূত কাজগুলো একই লাইসেন্সের অধীনে বিতরণ করতে হবে কিনা (অর্থাৎ, ‘শেয়ার-অ্যালাইক’ শর্ত)।
     */
    copyleft: boolean;

    /**
     * অনুবাদটি পাবলিক ডোমেইনে উৎসর্গ করা হয়েছে কিনা।
     */
    publicDomain: boolean;
}
```

### লাইসেন্স

প্রতিটি অনুবাদ নিজস্ব লাইসেন্সের অধীনে প্রকাশিত হয়, তাই কোনো অনুবাদ ব্যবহার করার আগে তার শর্তাবলী যাচাই করে নিন।

-   `licenseUrl` সর্বদা সম্পূর্ণ লাইসেন্সের শর্তাবলীর সাথে লিঙ্ক করে।
-   `licenseNotice` , যখন উপস্থিত থাকে, তখন এটি হলো অনুবাদের বিষয়বস্তুর পাশে প্রদর্শনের জন্য কপিরাইট বা কৃতিত্ব জ্ঞাপন বিজ্ঞপ্তি।
-   `licenseNotes` এপিআই দ্বারা যোগ করা নোট রয়েছে, যেমন মূল টেক্সটে করা পরিবর্তনসমূহ।
-   `license` , উপস্থিত থাকলে, শর্তাবলীকে এমন একটি আকারে সংক্ষিপ্ত করে যা আপনার কোড যাচাই করতে পারে। উদাহরণস্বরূপ, আপনি তালিকাটিকে সেইসব অনুবাদে ফিল্টার করতে পারেন যেগুলো বাণিজ্যিক ব্যবহারের অনুমতি দেয়:

```ts:no-line-numbers title="commercial-translations.js"
fetch(`https://bible.helloao.org/api/available_translations.json`)
    .then(request => request.json())
    .then(({ translations }) => {
        const commercial = translations.filter(
            t => t.license?.commercialUse === 'allowed'
        );
        console.log('Translations that allow commercial use:', commercial);
    });
```

`license` শুধুমাত্র তখনই সেট করা হয় যখন শর্তগুলো স্বয়ংক্রিয়ভাবে শনাক্ত করা যায়। এটি ছাড়া অনুবাদগুলোও আপনার ব্যবহারের অনুমতি দিতে পারে, তাই সেগুলোর জন্য `licenseUrl` পৃষ্ঠাটি পড়ুন।

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
     * অনুবাদে বইটির জন্য প্রদত্ত সংক্ষিপ্ত নাম (সংক্ষেপণ)।
     * যদি উপলব্ধ না থাকে, তাহলে অনুবাদের মাধ্যমে তা প্রদান করা হয়নি।
     */
    shortName?: string;

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
            "shortName": "Gen",
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
