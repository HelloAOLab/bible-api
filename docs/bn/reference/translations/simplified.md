# সরলীকৃত বিন্যাস

অধ্যায়, সম্পূর্ণ অনুবাদ ডাউনলোড এবং শব্দ-স্তরের টীকার জন্য সরলীকৃত বিন্যাস। অনুবাদ এবং বইয়ের তালিকার শেষ প্রান্তের জন্য [‘অনুবাদ, বই ও অধ্যায়’](./README.md) দেখুন, অথবা এই একই বিষয়বস্তুর মূল, কাঠামোগত উপস্থাপনার জন্য [প্রমিত বিন্যাসটি](./standard.md) দেখুন।

## অনুবাদ থেকে একটি সরলীকৃত অধ্যায় পান

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.simple.json`

সরলীকৃত বিন্যাস ব্যবহার করে, প্রদত্ত কোনো বই ও তার অনুবাদের একটিমাত্র অধ্যায়ের বিষয়বস্তু পাওয়া যায়।

সরলীকৃত বিন্যাসে, প্রতিটি পদের বিষয়বস্তু ফরম্যাট করা কন্টেন্টের তালিকার পরিবর্তে একটি একক স্ট্রিং হিসেবে থাকে। এর মানে হলো, আপনাকে নিজে থেকে কোনো পদের পাঠ্য তৈরি করতে হবে না, যা সঠিকভাবে করা বেশ কঠিন হতে পারে – বিশেষ করে স্পেসিংয়ের ক্ষেত্রে। যা কিছু একটি সাধারণ স্ট্রিং দ্বারা প্রকাশ করা যায় না – যেমন পাদটীকা, যিশুর বাণী, কবিতা এবং পদের মাঝখানে থাকা শিরোনাম – সেগুলোকে সেই স্ট্রিংয়ের মধ্যে একটি অফসেট হিসেবে রাখা হয়, ফলে কোনো কিছুই হারিয়ে যায় না।

কোনো অধ্যায়ের লেখা পেতে এই এন্ডপয়েন্টটি ব্যবহার করুন। অধ্যায়টিকে তার আসল ফরম্যাটিং সহ রেন্ডার করতে [সাধারণ চ্যাপ্টার এন্ডপয়েন্টটি](./standard.md#get-a-chapter-from-a-translation) ব্যবহার করুন।

-   `translation` হলো অনুবাদের আইডি (যেমন `BSB` )।
-   `book` হলো বইটির আইডি (যেমন, জেনেসিসের জন্য `GEN` – আপনি [এখানে](https://ubsicap.github.io/usfm/identification/books.html) বইয়ের আইডিগুলোর একটি তালিকা খুঁজে পেতে পারেন)।
-   `chapter` হলো সংখ্যাসূচক অধ্যায় (যেমন, প্রথম অধ্যায়ের জন্য `1` )।

যে অধ্যায়গুলিতে শব্দ-স্তরের টীকা রয়েছে, সেগুলিতে `thisChapterWordsLink` দিয়ে লিঙ্ক করা হয়েছে, যা [সরলীকৃত টীকাগুলির](#get-the-words-of-a-chapter-in-the-simplified-format) দিকে নির্দেশ করে — অর্থাৎ, যেগুলির অফসেট এই ফাইলের পাঠ্যের সাথে মেলে।

যে অধ্যায়গুলিতে পাঠক-প্রতি অডিও টাইমিং থাকে, সেগুলিকে `thisChapterAudioTimings` দিয়ে লিঙ্ক করা হয়, যা [অডিও টাইমিং এন্ডপয়েন্টকে](./standard.md#get-the-audio-timings-for-a-chapter) নির্দেশ করে — এটি সেই একই ফাইল যা সাধারণ অধ্যায় এন্ডপয়েন্টও লিঙ্ক করে, কারণ টাইমিং অধ্যায়ের ফরম্যাটের উপর নির্ভর করে না।

### কোডের উদাহরণ

::: code-tabs#lang

@ট্যাব জাভাস্ক্রিপ্ট

```ts:no-line-numbers title="fetch-simple-chapter.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// BSB অনুবাদ থেকে আদিপুস্তক ১-এর পাঠটি নিন।
fetch(`https://bible.helloao.org/api/${translation}/${book}/${chapter}.simple.json`)
    .then(request => request.json())
    .then(chapter => {
        for (let content of chapter.chapter.content) {
            if (content.type === 'verse') {
                console.log(`${content.number}. ${content.text}`);
            }
        }
    });
```

@ট্যাব cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/GEN/1.simple.json
```

:::

### অফসেট

সরলীকৃত বিন্যাসের সমস্ত অফসেট `offset` , `start` , এবং `end` —হলো তাদের ধারণকারী শ্লোকের `text` এর সূচক। এগুলোকে UTF-16 কোড ইউনিটে পরিমাপ করা হয়, যা জাভাস্ক্রিপ্টের `String.prototype.length` এবং `String.prototype.slice()` সংস্করণ ব্যবহার করে।

`start` হলো অন্তর্ভুক্তিমূলক এবং `end` হলো বর্জনমূলক, তাই `text.slice(start, end)` ঠিক চিহ্নিত করা পাঠ্যাংশের পরিসরটিই ফেরত দেয়। পাদটীকার অফসেট হলো সেই অবস্থান যেখানে পাদটীকার আহ্বানকারী থাকে, তাই `text.slice(0, offset)` হলো এর আগের পাঠ্যাংশ।

### কাঠামো

```typescript:no-line-numbers title="simple-chapter.ts"
export interface SimpleTranslationBookChapter {
    /**
     * বইয়ের অধ্যায়টির অনুবাদ সংক্রান্ত তথ্য।
     */
    translation: Translation;

    /**
     * বইয়ের অধ্যায়টির তথ্য।
     */
    book: TranslationBook;

    /**
     * বর্তমান অধ্যায়ের লিঙ্ক।
     */
    thisChapterLink: string;

    /**
     * এই অধ্যায়ের সাধারণ (অসরলীকৃত) সংস্করণের লিঙ্ক।
     */
    fullChapterApiLink: string;

    /**
     * অধ্যায়টির বিভিন্ন অডিও সংস্করণের লিঙ্ক।
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * অধ্যায়টির বিভিন্ন অডিও সংস্করণের অডিও টাইমিংয়ের লিঙ্ক।
     * স্ট্যান্ডার্ড ফরম্যাট ডক্স-এ "একটি অধ্যায়ের অডিও টাইমিং জানুন" অংশটি দেখুন — যে অধ্যায় ফরম্যাটই এর সাথে লিঙ্ক করা হোক না কেন, টাইমিং ফাইলটি একই থাকে।
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsLinks;

    /**
     * পরবর্তী অধ্যায়ের লিঙ্ক, সরলীকৃত বিন্যাসে।
     * অনুবাদে এটি শেষ অধ্যায় হলে শূন্য হবে।
     */
    nextChapterApiLink: string | null;

    /**
     * পরবর্তী অধ্যায়ের বিভিন্ন অডিও সংস্করণের লিঙ্ক।
     * অনুবাদে এটি শেষ অধ্যায় হলে শূন্য হবে।
     */
    nextChapterAudioLinks: TranslationBookChapterAudioLinks | null;

    /**
     * পরবর্তী অধ্যায়ের বিভিন্ন অডিও সংস্করণের অডিও টাইমিংয়ের লিঙ্ক।
     * অনুবাদে এটি শেষ অধ্যায় হলে শূন্য হবে।
     */
    nextChapterAudioTimings: TranslationBookChapterAudioTimingsLinks | null;

    /**
     * পূর্ববর্তী অধ্যায়ের লিঙ্ক, সরলীকৃত বিন্যাসে।
     * অনুবাদটির প্রথম অধ্যায় হলে এটি শূন্য হবে।
     */
    previousChapterApiLink: string | null;

    /**
     * পূর্ববর্তী অধ্যায়ের বিভিন্ন অডিও সংস্করণের লিঙ্ক।
     * অনুবাদটির প্রথম অধ্যায় হলে এটি শূন্য হবে।
     */
    previousChapterAudioLinks: TranslationBookChapterAudioLinks | null;

    /**
     * পূর্ববর্তী অধ্যায়ের বিভিন্ন অডিও সংস্করণের অডিও টাইমিংয়ের লিঙ্ক।
     * অনুবাদটির প্রথম অধ্যায় হলে এটি শূন্য হবে।
     */
    previousChapterAudioTimings: TranslationBookChapterAudioTimingsLinks | null;

    /**
     * অধ্যায়টিতে থাকা শ্লোকের সংখ্যা।
     */
    numberOfVerses: number;

    /**
     * অধ্যায়টির তথ্য।
     */
    chapter: SimpleChapterData;
}

interface SimpleChapterData {
    /**
     * অধ্যায়ের সংখ্যা।
     */
    number: number;

    /**
     * অধ্যায়টির বিষয়বস্তু।
     */
    content: SimpleChapterContent[];

    /**
     * যেসব পাদটীকা কোনো শ্লোকের সাথে যুক্ত করা যায়নি, তার তালিকা।
     * কোনো শ্লোকের সঙ্গে সম্পর্কিত পাদটীকাগুলো মূল শ্লোকটিতেই অন্তর্ভুক্ত থাকে, তাই এই তালিকাটি সাধারণত খালি থাকে।
     */
    footnotes: ChapterFootnote[];
}

/**
 * একটি ইউনিয়ন টাইপ যা একটি সরলীকৃত অধ্যায়ের একটি একক বিষয়বস্তুকে উপস্থাপন করে।
 */
type SimpleChapterContent = SimpleChapterHeading | ChapterLineBreak | SimpleChapterVerse | SimpleChapterHebrewSubtitle;

/**
 * একটি অধ্যায়ের শিরোনাম।
 */
interface SimpleChapterHeading {
    /**
     * এটি নির্দেশ করে যে বিষয়বস্তুটি একটি শিরোনাম।
     */
    type: 'heading';

    /**
     * শিরোনামের লেখা।
     */
    text: string;
}

/**
 * একটি অধ্যায়ে লাইন ব্রেক।
 */
interface ChapterLineBreak {
    /**
     * এটি নির্দেশ করে যে বিষয়বস্তুটি একটি লাইন ব্রেক।
     */
    type: 'line_break';
}

/**
 * একটি অধ্যায়ের একটি শ্লোক।
 */
interface SimpleChapterVerse {
    /**
     * নির্দেশ করে যে বিষয়বস্তুটি একটি শ্লোক।
     */
    type: 'verse';

    /**
     * শ্লোকটির সংখ্যা।
     */
    number: number;

    /**
     * শ্লোকটির পাঠ।
     * কবিতার পঙক্তি ও পঙক্তিচ্ছেদ নিউলাইন (\n) চিহ্ন দ্বারা পৃথক করা হয়।
     */
    text: string;

    /**
     * শ্লোকে উল্লেখিত পাদটীকাগুলো।
     */
    footnotes: SimpleVerseFootnote[];

    /**
     * শ্লোকের মাঝখানে থাকা শিরোনামগুলো।
     * শ্লোকটিতে কোনো ইনলাইন শিরোনাম না থাকলে এটি বাদ দেওয়া হয়।
     */
    headings?: SimpleInlineHeading[];

    /**
     * শ্লোকের সেই অংশগুলো যা যিশুর বাণীকে উপস্থাপন করে।
     * শ্লোকটিতে কিছু না থাকলে বাদ দেওয়া হয়।
     */
    wordsOfJesus?: SimpleTextRange[];

    /**
     * পদ্যের সেই পরিসরগুলো যা কবিতার পঙক্তিগুলোকে প্রকাশ করে।
     * শ্লোকটিতে কিছু না থাকলে বাদ দেওয়া হয়।
     */
    poem?: SimplePoemRange[];
}

/**
 * একটি অধ্যায়ের হিব্রু উপশিরোনাম।
 * এগুলো প্রায়শই মূল পাণ্ডুলিপিতে উপস্থিত তথ্যমূলক বিষয়বস্তু হিসেবে অন্তর্ভুক্ত করা হয়।
 * উদাহরণস্বরূপ, গীতসংহিতা ৪৯-এর হিব্রু উপশিরোনামটি হলো: "গীতবাদ্য পরিচালকের প্রতি। কোরহ-সন্তানদের একটি গীত।"
 */
interface SimpleChapterHebrewSubtitle extends Omit<SimpleChapterVerse, 'type' | 'number'> {
    /**
     * এটি নির্দেশ করে যে বিষয়বস্তুটি একটি হিব্রু সাবটাইটেল।
     */
    type: 'hebrew_subtitle';
}

/**
 * শ্লোকের পাদটীকা।
 */
interface SimpleVerseFootnote {
    /**
     * নোটটির আইডি।
     */
    noteId: number;

    /**
     * শ্লোকের পাঠ্যাংশের সেই সূচক যেখানে পাদটীকা নির্দেশকটি সন্নিবেশিত করা উচিত।
     */
    offset: number;

    /**
     * পাদটীকার পাঠ্য।
     */
    text: string;

    /**
     * পাদটীকার জন্য যে কলারটি ব্যবহার করা উচিত।
     * যদি "+" থাকে, তাহলে কলার স্বয়ংক্রিয়ভাবে তৈরি হওয়া উচিত।
     * যদি null হয়, তাহলে কলারটি খালি থাকা উচিত।
     * যদি স্ট্রিং হয়, তাহলে কলারও সেই স্ট্রিংটিই হওয়া উচিত।
     */
    caller: '+' | string | null;
}

/**
 * একটি শিরোনাম যা কোনো শ্লোকের মধ্যে অন্তর্ভুক্ত থাকে।
 */
interface SimpleInlineHeading {
    /**
     * শ্লোকের পাঠ্যাংশে থাকা সূচী যেখানে শিরোনামটি রয়েছে।
     */
    offset: number;

    /**
     * শিরোনামের লেখা।
     */
    text: string;
}

/**
 * একটি শ্লোকের অভ্যন্তরে থাকা পাঠ্যাংশ।
 */
interface SimpleTextRange {
    /**
     * রেঞ্জের প্রথম অক্ষরের সূচক।
     */
    start: number;

    /**
     * রেঞ্জের শেষ অক্ষরের পরের সূচক।
     */
    end: number;
}

/**
 * শ্লোকের অভ্যন্তরে থাকা এমন একটি পাঠ্যাংশ যা কবিতার একটি পঙক্তিকে প্রকাশ করে।
 */
interface SimplePoemRange extends SimpleTextRange {
    /**
     * কবিতার পঙক্তিটি যে পরিমাণ ইন্ডেন্টে প্রদর্শিত হবে।
     */
    level: number;
}
```

### উদাহরণ

```json:no-line-numbers title="/api/BSB/GEN/1.simple.json"
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
    "book": {
        "id": "GEN",
        "name": "Genesis",
        "commonName": "Genesis",
        "title": "Genesis",
        "order": 1,
        "numberOfChapters": 50,
        "firstChapterApiLink": "/api/BSB/GEN/1.json",
        "lastChapterApiLink": "/api/BSB/GEN/50.json",
        "totalNumberOfVerses": 1533
    },
    "thisChapterLink": "/api/BSB/GEN/1.simple.json",
    "fullChapterApiLink": "/api/BSB/GEN/1.json",
    "thisChapterReference": {
        "translationId": "BSB",
        "book": "GEN",
        "chapter": 1
    },
    "thisChapterAudioLinks": {
        "hays": "https://audio.bible.helloao.org/api/BSB/GEN/1/audio/hays.mp3",
        "souer": "https://audio.bible.helloao.org/api/BSB/GEN/1/audio/souer.mp3",
        "david": "https://audio.bible.helloao.org/api/BSB/GEN/1/audio/david.mp3"
    },
    "thisChapterAudioTimings": {
        "hays": "/api/BSB/GEN/1.hays.audioTimings.json",
        "souer": "/api/BSB/GEN/1.souer.audioTimings.json",
        "david": "/api/BSB/GEN/1.david.audioTimings.json"
    },
    "nextChapterApiLink": "/api/BSB/GEN/2.simple.json",
    "nextChapterReference": {
        "translationId": "BSB",
        "book": "GEN",
        "chapter": 2
    },
    "nextChapterAudioTimings": {
        "hays": "/api/BSB/GEN/2.hays.audioTimings.json",
        "souer": "/api/BSB/GEN/2.souer.audioTimings.json",
        "david": "/api/BSB/GEN/2.david.audioTimings.json"
    },
    "previousChapterApiLink": null,
    "previousChapterReference": null,
    "previousChapterAudioTimings": null,
    "numberOfVerses": 31,
    "chapter": {
        "number": 1,
        "content": [
            {
                "type": "heading",
                "text": "The Creation"
            },
            {
                "type": "line_break"
            },
            {
                "type": "verse",
                "number": 1,
                "text": "In the beginning God created the heavens and the earth.",
                "footnotes": []
            },
            {
                "type": "line_break"
            },
            {
                "type": "verse",
                "number": 2,
                "text": "Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters.",
                "footnotes": []
            },
            {
                "type": "heading",
                "text": "The First Day"
            },
            {
                "type": "line_break"
            },
            {
                "type": "verse",
                "number": 3,
                "text": "And God said, “Let there be light,” and there was light.",
                "footnotes": [
                    {
                        "noteId": 0,
                        "offset": 35,
                        "text": "Cited in 2 Corinthians 4:6",
                        "caller": "+"
                    }
                ]
            }
        ],
        "footnotes": []
    }
}
```

কবিতা এবং যিশুর বাণীকে শ্লোকের পাঠ্যাংশের উপর পরিসর হিসেবে রাখা হয়। উদাহরণস্বরূপ, `engwebp` অনুবাদে `Matthew 5:3` দেখতে এইরকম:

```json:no-line-numbers title="/api/engwebp/MAT/5.simple.json"
{
    "type": "verse",
    "number": 3,
    "text": "“Blessed are the poor in spirit,\nfor theirs is the Kingdom of Heaven.",
    "footnotes": [],
    "wordsOfJesus": [
        {
            "start": 0,
            "end": 69
        }
    ],
    "poem": [
        {
            "start": 0,
            "end": 32,
            "level": 1
        },
        {
            "start": 33,
            "end": 69,
            "level": 2
        }
    ]
}
```

## একটি অধ্যায়ের শব্দগুলো সরলীকৃত বিন্যাসে পান

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.words.simple.json`

একটি অধ্যায়ের শব্দ-স্তরের টীকাগুলো পাওয়া যায়, যেখানে প্রতিটি [সরলীকৃত শ্লোকের](#get-a-simplified-chapter-from-a-translation) মূল পাঠের উপর সেগুলোর অফসেট পুনরায় ম্যাপ করা থাকে।

[সাধারণ টীকাগুলির](./standard.md#get-the-words-of-a-chapter) অফসেটগুলি একটি শ্লোকের `content` অ্যারের আইটেমগুলির সাথে সংযুক্ত থাকে, যা সরলীকৃত বিন্যাসটি একটি একক স্ট্রিং দিয়ে প্রতিস্থাপন করে — তাই সেগুলি এর সাথে ব্যবহার করা যাবে না। সরলীকৃত অধ্যায়গুলি নিয়ে কাজ করার সময় এর পরিবর্তে এই ফাইলটি ব্যবহার করুন।

-   `translation` হলো অনুবাদের আইডি (যেমন `BSB` )।
-   `book` হলো বইটির আইডি (যেমন, জেনেসিসের জন্য `GEN` – আপনি [এখানে](https://ubsicap.github.io/usfm/identification/books.html) বইয়ের আইডিগুলোর একটি তালিকা খুঁজে পেতে পারেন)।
-   `chapter` হলো সংখ্যাসূচক অধ্যায় (যেমন, প্রথম অধ্যায়ের জন্য `1` )।

এই এন্ট্রিগুলোতে কোনো `contentIndex` নেই। `start` এবং `end` হলো শ্লোকের `text` এর মধ্যে অফসেট, ঠিক যেমন সরলীকৃত অধ্যায়গুলোর পাদটীকা, কবিতা এবং যিশুর বাণীর অফসেটগুলো, তাই `text.slice(start, end)` হলো টীকাযুক্ত শব্দটি।

সাধারণ টীকাগুলোর মতোই, শুধুমাত্র কিছু অনুবাদেই এগুলো থাকে। যে সরলীকৃত অধ্যায়ে এগুলো থাকে, সেটি `thisChapterWordsLink` দিয়ে এই ফাইলের সাথে লিঙ্ক করা থাকে; যখন এই প্রপার্টিটি অনুপস্থিত থাকে, তখন সেই অধ্যায়ের জন্য এই ফাইলটির অস্তিত্ব থাকে না।

### কোডের উদাহরণ

::: code-tabs#lang

@ট্যাব জাভাস্ক্রিপ্ট

```ts:no-line-numbers title="fetch-simple-chapter-words.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// আদিপুস্তক ১-এর মূল পাঠ এবং এতে টীকাযুক্ত শব্দগুলো সংগ্রহ করুন।
Promise.all([
    fetch(`https://bible.helloao.org/api/${translation}/${book}/${chapter}.simple.json`).then(r => r.json()),
    fetch(`https://bible.helloao.org/api/${translation}/${book}/${chapter}.words.simple.json`).then(r => r.json()),
]).then(([chapter, words]) => {
    for (let content of chapter.chapter.content) {
        if (content.type !== 'verse') {
            continue;
        }
        for (let word of words.verses[content.number] ?? []) {
            console.log(content.text.slice(word.start, word.end), word.strongs);
        }
    }
});
```

@ট্যাব cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/GEN/1.simple.json
curl https://bible.helloao.org/api/BSB/GEN/1.words.simple.json
```

:::

### কাঠামো

কাঠামোটি [সাধারণ টীকাগুলোর](./standard.md#get-the-words-of-a-chapter) সাথে মিলে যায়, তবে পার্থক্য হলো লিঙ্কগুলো সরলীকৃত ফাইলগুলোর দিকে নির্দেশ করে এবং এন্ট্রিগুলোতে কোনো `contentIndex` থাকে না।

```typescript:no-line-numbers title="simple-words.ts"
export interface SimpleTranslationBookChapterWords {
    /**
     * অনুবাদটির আইডি।
     */
    translationId: string;

    /**
     * বইটির আইডি।
     */
    bookId: string;

    /**
     * অধ্যায়ের সংখ্যা।
     */
    chapterNumber: number;

    /**
     * এই টীকাগুলো যে সরলীকৃত অধ্যায়ের জন্য, তার লিঙ্ক।
     */
    thisChapterLink: string;

    /**
     * পরবর্তী সরলীকৃত অধ্যায়ের লিঙ্ক।
     * অনুবাদে এটি শেষ অধ্যায় হলে শূন্য হবে।
     */
    nextChapterLink: string | null;

    /**
     * পূর্ববর্তী সরলীকৃত অধ্যায়ের লিঙ্ক।
     * অনুবাদটির প্রথম অধ্যায় হলে এটি শূন্য হবে।
     */
    previousChapterLink: string | null;

    /**
     * এই টীকাগুলোর লিঙ্ক।
     */
    thisChapterWordsLink: string;

    /**
     * পরবর্তী অধ্যায়ের টীকাগুলোর লিঙ্ক।
     * যদি এটি অনুবাদের শেষ অধ্যায় হয়, অথবা পরবর্তী অধ্যায়ে কোনো শব্দ-স্তরের টীকা না থাকে, তাহলে এটি শূন্য হবে।
     */
    nextChapterWordsLink: string | null;

    /**
     * পূর্ববর্তী অধ্যায়ের টীকাগুলোর লিঙ্ক।
     * যদি এটি অনুবাদের প্রথম অধ্যায় হয়, অথবা পূর্ববর্তী অধ্যায়ে কোনো শব্দ-স্তরের টীকা না থাকে, তাহলে এটি শূন্য হবে।
     */
    previousChapterWordsLink: string | null;

    /**
     * অধ্যায়ের প্রতিটি পদের টীকাযুক্ত শব্দাবলী, পদসংখ্যা অনুসারে চিহ্নিত।
     * প্রতিটি তালিকা শ্লোকে শব্দগুলো যে ক্রমে রয়েছে, সেই ক্রমেই সাজানো হয়েছে।
     */
    verses: {
        [verseNumber: string]: SimpleChapterWord[];
    };
}

/**
 * একটি সরলীকৃত অধ্যায়ে শব্দ-স্তরের টীকা।
 */
export interface SimpleChapterWord {
    /**
     * শ্লোকের পাঠে টীকাকৃত শব্দটির প্রথম অক্ষরের সূচক।
     */
    start: number;

    /**
     * শ্লোকের পাঠে টীকাকৃত শব্দের শেষ অক্ষরের পরের সূচক।
     */
    end: number;

    /**
     * শব্দটির জন্য স্ট্রং-এর সংখ্যাসমূহ।
     */
    strongs?: string[];

    /**
     * উৎস ভাষায় শব্দটির লেমা (অভিধানিক রূপ)।
     */
    lemma?: string;

    /**
     * উৎস ভাষায় শব্দটির রূপতত্ত্ব।
     */
    morph?: string;

    /**
     * মূল পাঠে শব্দটির অবস্থান।
     */
    srcloc?: string;

    /**
     * আয়াতে শব্দটির কোন উল্লেখ এটি?
     */
    occurrence?: number;

    /**
     * আয়াতে শব্দটি যতবার এসেছে।
     */
    occurrences?: number;
}
```

### উদাহরণ

```json:no-line-numbers title="/api/engwebp/JHN/1.words.simple.json"
{
    "translationId": "engwebp",
    "bookId": "JHN",
    "chapterNumber": 1,
    "thisChapterLink": "/api/engwebp/JHN/1.simple.json",
    "nextChapterLink": "/api/engwebp/JHN/2.simple.json",
    "previousChapterLink": "/api/engwebp/MAT/28.simple.json",
    "thisChapterWordsLink": "/api/engwebp/JHN/1.words.simple.json",
    "nextChapterWordsLink": "/api/engwebp/JHN/2.words.simple.json",
    "previousChapterWordsLink": "/api/engwebp/MAT/28.words.simple.json",
    "verses": {
        "1": [
            {
                "start": 0,
                "end": 2,
                "strongs": ["G1722"]
            },
            {
                "start": 3,
                "end": 6,
                "strongs": ["G1722"]
            },
            {
                "start": 7,
                "end": 16,
                "strongs": ["G0746"]
            }
        ]
    }
}
```

সেই অধ্যায়ের ১ নং আয়াতে `"In the beginning was the Word, and the Word was with God, and the Word was God."` লেখা আছে, সুতরাং `text.slice(7, 16)` হলো `"beginning"` ।

## সরলীকৃত বিন্যাসে সম্পূর্ণ অনুবাদটি পান

`GET https://bible.helloao.org/api/{translation}/complete.simple.json`

সরলীকৃত বিন্যাস ব্যবহার করে একটি সম্পূর্ণ অনুবাদের বিষয়বস্তু পাওয়া যায়। এটি [সম্পূর্ণ অনুবাদ ডাউনলোডের](./standard.md#get-an-entire-translation) ক্ষেত্রে প্রয়োগ করা [সরলীকৃত অধ্যায় বিন্যাস](#get-a-simplified-chapter-from-a-translation) : একটি ফাইলে সম্পূর্ণ অনুবাদটি থাকে, যেখানে প্রতিটি শ্লোকের বিষয়বস্তু একটি একক স্ট্রিং।

যখন আপনি অধ্যায় অনুযায়ী অনুরোধ না করে এবং নিজে থেকে লেখাটি তৈরি না করেই সম্পূর্ণ অনুবাদের মূল লেখাটি পেতে চান, তখন এটি ব্যবহার করুন।

-   `translation` হলো অনুবাদের আইডি (যেমন `BSB` )।

এই ফাইলটি `complete.json` পাশাপাশি তৈরি হয়, তাই একটি অনুবাদে হয় উভয়ই থাকে অথবা কোনোটিই থাকে না। উভয় ফাইলের `translation` অবজেক্টটিতে একটি `completeTranslationApiLink` এবং একটি `simpleCompleteTranslationApiLink` রয়েছে, তাই আপনি দুটি ফরম্যাটের মধ্যে চলাচল করতে পারেন।

### কোডের উদাহরণ

::: code-tabs#lang

@ট্যাব জাভাস্ক্রিপ্ট

```ts:no-line-numbers title="fetch-translation-complete-simple.js"
const translation = 'BSB';

// সম্পূর্ণ BSB অনুবাদের পাঠ্যটি পান
fetch(`https://bible.helloao.org/api/${translation}/complete.simple.json`)
    .then(request => request.json())
    .then(complete => {
        for (let book of complete.books) {
            for (let { chapter } of book.chapters) {
                for (let content of chapter.content) {
                    if (content.type === 'verse') {
                        console.log(`${book.commonName} ${chapter.number}:${content.number} ${content.text}`);
                    }
                }
            }
        }
    });
```

@ট্যাব cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/complete.simple.json
```

:::

### কাঠামো

এর কাঠামোটি [সাধারণ সম্পূর্ণ অনুবাদ ডাউনলোডের](./standard.md#get-an-entire-translation) মতোই, তবে প্রতিটি অধ্যায়ে সরলীকৃত বিন্যাস ব্যবহার করা হয়েছে।

```typescript:no-line-numbers title="complete-simple.ts"
/**
 * সরলীকৃত অধ্যায় বিন্যাস ব্যবহার করে সম্পূর্ণ অনুবাদ ডাউনলোডের তথ্য নির্ধারণ করে।
 * এটি /api/:translationId/complete.simple.json এন্ডপয়েন্টকে নির্দেশ করে।
 */
export interface SimpleTranslationComplete {
    /**
     * অনুবাদ মেটাডেটা।
     */
    translation: Translation;

    /**
     * বইগুলোর সকল অধ্যায়সহ পূর্ণাঙ্গ তালিকা।
     */
    books: SimpleTranslationCompleteBook[];
}

/**
 * সরলীকৃত অধ্যায় বিন্যাস ব্যবহার করে সম্পূর্ণ অনুবাদে বইটি ডাউনলোড করুন।
 */
export interface SimpleTranslationCompleteBook extends Omit<TranslationCompleteBook, 'chapters'> {
    /**
     * সমস্ত বিষয়বস্তুসহ অধ্যায়গুলোর পূর্ণাঙ্গ তালিকা।
     */
    chapters: SimpleTranslationCompleteChapter[];
}

/**
 * সরলীকৃত অধ্যায় বিন্যাস ব্যবহার করে সম্পূর্ণ অনুবাদের একটি অধ্যায় ডাউনলোড করুন।
 */
export interface SimpleTranslationCompleteChapter {
    /**
     * অধ্যায়টিতে থাকা শ্লোকের সংখ্যা।
     */
    numberOfVerses: number;

    /**
     * অধ্যায়টির বিভিন্ন অডিও সংস্করণের লিঙ্ক।
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * অধ্যায়টির অডিওর সময়কাল (প্রতিটি শ্লোকের শুরুর সময়, সেকেন্ডে)।
     *
     * উল্লেখ্য যে, স্বতন্ত্র অধ্যায়ের এন্ডপয়েন্টগুলোর মতো নয়, যেগুলোতে টাইমিং-এর লিঙ্ক থাকে, সম্পূর্ণ অনুবাদ ফাইলগুলোতে সরাসরি টাইমিং দেওয়া থাকে (স্ট্যান্ডার্ড ফরম্যাট ডক্স-এ TranslationBookChapterAudioTimingsMap দেখুন)।
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsMap;

    /**
     * সরলীকৃত বিন্যাস ব্যবহার করে অধ্যায়টির শব্দ-স্তরের টীকাগুলোর লিঙ্ক। যদি অধ্যায়টিতে কোনো শব্দ-স্তরের টীকা না থাকে, তবে এটি বাদ দেওয়া হয়েছে।
     */
    thisChapterWordsLink?: string;

    /**
     * অধ্যায়টির জন্য সরলীকৃত তথ্য।
     */
    chapter: SimpleChapterData;
}
```

### উদাহরণ

```json:no-line-numbers title="/api/BSB/complete.simple.json"
{
    "translation": {
        "id": "BSB",
        "name": "Berean Standard Bible",
        "englishName": "Berean Standard Bible",
        "language": "eng",
        "licenseUrl": "https://berean.bible/",
        "shortName": "BSB",
        "website": "https://berean.bible/",
        "textDirection": "ltr",
        "availableFormats": [
            "json"
        ],
        "listOfBooksApiLink": "/api/BSB/books.json",
        "completeTranslationApiLink": "/api/BSB/complete.json",
        "simpleCompleteTranslationApiLink": "/api/BSB/complete.simple.json",
        "numberOfBooks": 66,
        "totalNumberOfChapters": 1189,
        "totalNumberOfVerses": 31086,
        "languageName": "English",
        "languageEnglishName": "English"
    },
    "books": [
        {
            "id": "GEN",
            "name": "Genesis",
            "commonName": "Genesis",
            "title": "Genesis",
            "order": 1,
            "numberOfChapters": 50,
            "totalNumberOfVerses": 1533,
            "chapters": [
                {
                    "numberOfVerses": 31,
                    "thisChapterAudioLinks": {
                        "hays": "https://audio.bible.helloao.org/api/BSB/GEN/1/audio/hays.mp3",
                        "souer": "https://audio.bible.helloao.org/api/BSB/GEN/1/audio/souer.mp3",
                        "david": "https://audio.bible.helloao.org/api/BSB/GEN/1/audio/david.mp3"
                    },
                    "thisChapterAudioTimings": {
                        "hays": [0, 4.32, 10.28],
                        "souer": [0, 4.28, 10.19],
                        "david": [0, 4.51, 10.62]
                    },
                    "chapter": {
                        "number": 1,
                        "content": [
                            {
                                "type": "heading",
                                "text": "The Creation"
                            },
                            {
                                "type": "line_break"
                            },
                            {
                                "type": "verse",
                                "number": 1,
                                "text": "In the beginning God created the heavens and the earth.",
                                "footnotes": []
                            }
                        ],
                        "footnotes": []
                    }
                }
            ]
        }
    ]
}
```
