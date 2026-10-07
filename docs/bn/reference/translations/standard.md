# স্ট্যান্ডার্ড ফরম্যাট

অধ্যায়, সম্পূর্ণ অনুবাদ ডাউনলোড এবং শব্দ-স্তরের টীকার জন্য আদর্শ বিন্যাস। অনুবাদ এবং বইয়ের তালিকার শেষ প্রান্তের জন্য [‘অনুবাদ, বই ও অধ্যায়’](./README.md) দেখুন, অথবা এই একই বিষয়বস্তুর বিকল্প উপস্থাপনার জন্য [সরলীকৃত বিন্যাসটি](./simplified.md) দেখুন।

## অনুবাদ থেকে একটি অধ্যায় নিন

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`

প্রদত্ত কোনো বই ও তার অনুবাদের একটিমাত্র অধ্যায়ের বিষয়বস্তু পাওয়া যায়।

-   `translation` হলো অনুবাদের আইডি (যেমন `BSB` )।
-   `book` হলো বইটির আইডি (যেমন, জেনেসিসের জন্য `GEN` – আপনি [এখানে](https://ubsicap.github.io/usfm/identification/books.html) বইয়ের আইডিগুলোর একটি তালিকা খুঁজে পেতে পারেন)।
-   `chapter` হলো সংখ্যাসূচক অধ্যায় (যেমন, প্রথম অধ্যায়ের জন্য `1` )।

### কোডের উদাহরণ

::: code-tabs#lang

@ট্যাব জাভাস্ক্রিপ্ট

```ts:no-line-numbers title="fetch-chapter.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// BSB অনুবাদ থেকে আদিপুস্তক ১ সংগ্রহ করুন।
fetch(`https://bible.helloao.org/api/${translation}/${book}/${chapter}.json`)
    .then(request => request.json())
    .then(chapter => {
        console.log('Genesis 1 (BSB):', chapter);
    });
```

@ট্যাব cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/GEN/1.json
```

:::

### কাঠামো

```typescript:no-line-numbers title="chapter.ts"
export interface TranslationBookChapter {
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
     * অধ্যায়টির বিভিন্ন অডিও সংস্করণের লিঙ্ক।
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * অধ্যায়টির বিভিন্ন অডিও সংস্করণের অডিও টাইমিংয়ের লিঙ্ক।
     * প্রতিটি লিঙ্ক সেই রিডারের জন্য অডিও টাইমিং ফাইলটি নির্দেশ করে — নিচে "একটি অধ্যায়ের অডিও টাইমিং জানুন" অংশটি দেখুন।
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsLinks;

    /**
     * পরবর্তী অধ্যায়ের লিঙ্ক।
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
     * পূর্ববর্তী অধ্যায়ের লিঙ্ক।
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
     * অধ্যায়টির শব্দ-স্তরের টীকাগুলোর লিঙ্ক।
     * অধ্যায়টিতে কোনো শব্দ-স্তরের টীকা না থাকলে এটি বাদ দেওয়া হয়।
     */
    thisChapterWordsLink?: string;

    /**
     * পরবর্তী অধ্যায়ের শব্দ-স্তরের টীকাগুলোর লিঙ্ক।
     * অনুবাদটির এটি শেষ অধ্যায় হলে, অথবা পরবর্তী অধ্যায়ে কোনো শব্দ-স্তরের টীকা না থাকলে এটি বাদ দেওয়া হয়েছে।
     */
    nextChapterWordsLink?: string;

    /**
     * পূর্ববর্তী অধ্যায়ের শব্দ-স্তরের টীকাগুলোর লিঙ্ক।
     * অনুবাদটির এটি প্রথম অধ্যায় হলে, অথবা পূর্ববর্তী অধ্যায়ে কোনো শব্দ-স্তরের টীকা না থাকলে এটি বাদ দেওয়া হয়েছে।
     */
    previousChapterWordsLink?: string;

    /**
     * অধ্যায়টিতে থাকা শ্লোকের সংখ্যা।
     */
    numberOfVerses: number;

    /**
     * এই অধ্যায়ের সরলীকৃত সংস্করণের লিঙ্ক।
     * সরলীকৃত অধ্যায় উপলব্ধ না থাকলে বাদ দেওয়া হয়েছে।
     */
    simpleChapterApiLink?: string;

    /**
     * অধ্যায়টির তথ্য।
     */
    chapter: ChapterData;
}

interface ChapterData {
    /**
     * অধ্যায়ের সংখ্যা।
     */
    number: number;

    /**
     * অধ্যায়টির বিষয়বস্তু।
     */
    content: ChapterContent[];

    /**
     * অধ্যায়টির পাদটীকাসমূহের তালিকা।
     */
    footnotes: ChapterFootnote[];
}

/**
 * একটি ইউনিয়ন টাইপ যা অধ্যায়ের একটি একক বিষয়বস্তুকে উপস্থাপন করে।
 * অধ্যায়ের বিষয়বস্তু নিম্নলিখিত বিষয়গুলোর মধ্যে যেকোনো একটি হতে পারে:
 * একটি শিরোনাম।
 * লাইন ব্রেক।
 * একটি শ্লোক।
 * একটি হিব্রু সাবটাইটেল।
 */
type ChapterContent = ChapterHeading | ChapterLineBreak | ChapterVerse | ChapterHebrewSubtitle;

/**
 * একটি অধ্যায়ের শিরোনাম।
 */
interface ChapterHeading {
    /**
     * এটি নির্দেশ করে যে বিষয়বস্তুটি একটি শিরোনাম।
     */
    type: 'heading';

    /**
     * শিরোনামের বিষয়বস্তু।
     * অ্যারেতে একাধিক স্ট্রিং থাকলে, সেগুলোকে একটি স্পেস দিয়ে যুক্ত করতে হবে।
     */
    content: string[];
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
 * একটি অধ্যায়ের হিব্রু উপশিরোনাম।
 * এগুলো প্রায়শই মূল পাণ্ডুলিপিতে অন্তর্ভুক্ত তথ্যমূলক বিষয়বস্তু হিসেবে ব্যবহৃত হয়।
 * উদাহরণস্বরূপ, গীতসংহিতা ৪৯-এর হিব্রু উপশিরোনামটি হলো: "গীতবাদ্য পরিচালকের প্রতি। কোরহ-সন্তানদের একটি গীত।"
 */
interface ChapterHebrewSubtitle {
    /**
     * এটি নির্দেশ করে যে বিষয়বস্তুটি একটি হিব্রু সাবটাইটেল।
     */
    type: 'hebrew_subtitle';

    /**
     * উপশিরোনামে অন্তর্ভুক্ত বিষয়বস্তুর তালিকা।
     * তালিকার প্রতিটি উপাদান একটি স্ট্রিং, ফরম্যাট করা টেক্সট বা পাদটীকা রেফারেন্স হতে পারে।
     */
    content: (string | FormattedText | VerseFootnoteReference)[];
}

/**
 * একটি অধ্যায়ের একটি শ্লোক।
 */
interface ChapterVerse {
    /**
     * নির্দেশ করে যে বিষয়বস্তুটি একটি শ্লোক।
     */
    type: 'verse';

    /**
     * শ্লোকটির সংখ্যা।
     */
    number: number;

    /**
     * শ্লোকটির বিষয়বস্তুর তালিকা।
     * তালিকার প্রতিটি উপাদান একটি স্ট্রিং, ফরম্যাট করা টেক্সট বা পাদটীকা রেফারেন্স হতে পারে।
     */
    content: (string | FormattedText | InlineHeading | InlineLineBreak | VerseFootnoteReference)[];
}

/**
 * ফরম্যাট করা টেক্সট। অর্থাৎ, যে টেক্সট একটি নির্দিষ্ট পদ্ধতিতে ফরম্যাট করা হয়।
 */
interface FormattedText {
    /**
     * যে লেখাটি ফরম্যাট করা হয়েছে।
     */
    text: string;

    /**
     * পাঠ্যটি একটি কবিতা কিনা।
     * সংখ্যাটি ইন্ডেন্টের মাত্রা নির্দেশ করে।
     *
     * গীতসংহিতায় সাধারণ।
     */
    poem?: number;

    /**
     * পাঠ্যটি যিশুর বাণীর প্রতিনিধিত্ব করে কিনা।
     */
    wordsOfJesus?: boolean;
}

/**
 * এমন একটি ইন্টারফেস সংজ্ঞায়িত করে যা কোনো শ্লোকের মধ্যে অন্তর্ভুক্ত একটি শিরোনামকে উপস্থাপন করে।
 */
interface InlineHeading {
    /**
     * শিরোনামের লেখা।
     */
    heading: string;
}

/**
 * এমন একটি ইন্টারফেস সংজ্ঞায়িত করে যা কোনো পঙক্তির মধ্যে অন্তর্ভুক্ত একটি পঙক্তিচ্ছেদকে উপস্থাপন করে।
 */
interface InlineLineBreak {
    lineBreak: true;
}


/**
 * কোনো শ্লোকের পাদটীকায় উল্লেখ অথবা একটি হিব্রু উপশিরোনাম।
 */
interface VerseFootnoteReference {
    /**
     * নোটটির আইডি।
     */
    noteId: number;
}

/**
 * পাদটীকা সম্পর্কিত তথ্য।
 */
interface ChapterFootnote {
    /**
     * যে নোটটির উল্লেখ করা হয়েছে, তার আইডি।
     */
    noteId: number;

    /**
     * পাদটীকার পাঠ্য।
     */
    text: string;

    /**
     * পাদটীকাটির জন্য শ্লোক নির্দেশক।
     */
    reference?: {
        chapter: number;
        verse: number;
    };

    /**
     * পাদটীকার জন্য যে কলারটি ব্যবহার করা উচিত।
     * পাদটীকার ক্ষেত্রে, 'কলার' হলো সেই অক্ষর যা মূল লেখায় কোনো পাদটীকাকে নির্দেশ করতে ব্যবহৃত হয়।
     *
     * উদাহরণস্বরূপ, পাঠ্যটিতে:
     * হ্যালো (a) বিশ্ব
     *
     * ---- (ক) এটি একটি পাদটীকা।
     *
     * "(a)" হলো কলার।
     *
     * যদি "+" থাকে, তাহলে কলার স্বয়ংক্রিয়ভাবে তৈরি হওয়া উচিত।
     * যদি null হয়, তাহলে কলারটি খালি থাকা উচিত।
     * যদি স্ট্রিং হয়, তাহলে কলারও সেই স্ট্রিংটিই হওয়া উচিত।
     */
    caller: '+' | string | null;
}

/**
 * বইয়ের একটি অধ্যায়ের অডিও লিঙ্কগুলো।
 */
interface TranslationBookChapterAudioLinks {
    /**
     * অধ্যায়টির পাঠক এবং অডিও ফাইলটির ইউআরএল লিঙ্ক।
     */
    [reader: string]: string;
}

/**
 * বইয়ের একটি অধ্যায়ের অডিও টাইমিংয়ের লিঙ্ক।
 */
interface TranslationBookChapterAudioTimingsLinks {
    /**
     * অধ্যায়টির রিডার এবং সেই রিডারের অডিও টাইমিং ফাইলের এপিআই লিঙ্ক।
     */
    [reader: string]: string;
}
```

### উদাহরণ

```json:no-line-numbers title="/api/BSB/GEN/1.json"
{
    "translation": {
        "id": "BSB",
        "name": "Berean Standard Bible",
        "website": "https://berean.bible/",
        "licenseUrl": "https://berean.bible/",
        "licenseNotes": null,
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
    "thisChapterLink": "/api/BSB/GEN/1.json",
    "thisChapterAudioLinks": {
        "gilbert": "https://openbible.com/audio/gilbert/BSB_01_Gen_001_G.mp3",
        "hays": "https://openbible.com/audio/hays/BSB_01_Gen_001_H.mp3",
        "souer": "https://openbible.com/audio/souer/BSB_01_Gen_001.mp3"
    },
    "thisChapterAudioTimings": {
        "gilbert": "/api/BSB/GEN/1.gilbert.audioTimings.json",
        "hays": "/api/BSB/GEN/1.hays.audioTimings.json",
        "souer": "/api/BSB/GEN/1.souer.audioTimings.json"
    },
    "nextChapterApiLink": "/api/BSB/GEN/2.json",
    "nextChapterAudioLinks": {
        "gilbert": "https://openbible.com/audio/gilbert/BSB_01_Gen_002_G.mp3",
        "hays": "https://openbible.com/audio/hays/BSB_01_Gen_002_H.mp3",
        "souer": "https://openbible.com/audio/souer/BSB_01_Gen_002.mp3"
    },
    "nextChapterAudioTimings": {
        "gilbert": "/api/BSB/GEN/2.gilbert.audioTimings.json",
        "hays": "/api/BSB/GEN/2.hays.audioTimings.json",
        "souer": "/api/BSB/GEN/2.souer.audioTimings.json"
    },
    "previousChapterApiLink": null,
    "previousChapterAudioLinks": null,
    "previousChapterAudioTimings": null,
    "numberOfVerses": 31,
    "chapter": {
        "number": 1,
        "content": [
            {
                "type": "heading",
                "content": [
                    "The Creation"
                ]
            },
            {
                "type": "line_break"
            },
            {
                "type": "verse",
                "number": 1,
                "content": [
                    "In the beginning God created the heavens and the earth."
                ]
            },
            {
                "type": "line_break"
            },
            {
                "type": "verse",
                "number": 2,
                "content": [
                    "Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters."
                ]
            },
            {
                "type": "heading",
                "content": [
                    "The First Day"
                ]
            },
            {
                "type": "line_break"
            },
            {
                "type": "verse",
                "number": 3,
                "content": [
                    "And God said, “Let there be light,”",
                    {
                        "noteId": 0
                    },
                    "and there was light."
                ]
            },
            {
                "type": "verse",
                "number": 4,
                "content": [
                    "And God saw that the light was good, and He separated the light from the darkness."
                ]
            },
            {
                "type": "verse",
                "number": 5,
                "content": [
                    "God called the light “day,” and the darkness He called “night.”",
                    {
                        "lineBreak": true
                    },
                    "And there was evening, and there was morning—the first day.",
                    {
                        "noteId": 1
                    }
                ]
            }
        ],
        "footnotes": [
            {
                "noteId": 0,
                "text": "Cited in 2 Corinthians 4:6",
                "caller": "+",
                "reference": {
                    "chapter": 1,
                    "verse": 3
                }
            },
            {
                "noteId": 1,
                "text": "Literally day one",
                "caller": "+",
                "reference": {
                    "chapter": 1,
                    "verse": 5
                }
            },
            {
                "noteId": 2,
                "text": "Or a canopy or a firmament or a vault; also in verses 7, 8, 14, 15, 17, and 20",
                "caller": "+",
                "reference": {
                    "chapter": 1,
                    "verse": 6
                }
            },
            {
                "noteId": 3,
                "text": "MT; Syriac and over all the beasts of the earth",
                "caller": "+",
                "reference": {
                    "chapter": 1,
                    "verse": 26
                }
            },
            {
                "noteId": 4,
                "text": "Cited in Matthew 19:4 and Mark 10:6",
                "caller": "+",
                "reference": {
                    "chapter": 1,
                    "verse": 27
                }
            }
        ]
    }
}
```

## একটি অধ্যায়ের অডিও সময়সূচী জেনে নিন।

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.{reader}.audioTimings.json`

এটি একজন পাঠকের পাঠ করা একটি অধ্যায়ের প্রতিটি পদের অডিও সময় দেখায় — অর্থাৎ, সেই পাঠকের অডিও ফাইল শুরু হওয়ার সাপেক্ষে প্রতিটি পদ ঠিক কখন (সেকেন্ডে) শুরু হয়। অডিও চলার সময় গ্রাহকরা বর্তমানে পঠিত পদটি হাইলাইট করতে এটি ব্যবহার করতে পারেন।

শুধুমাত্র কিছু অনুবাদ এবং রিডারের অডিও টাইমিং থাকে। যে অধ্যায়ে কোনো রিডারের জন্য টাইমিং থাকে, সেটি `thisChapterAudioTimings` ম্যাপে একটি এন্ট্রির মাধ্যমে এই ফাইলের সাথে লিঙ্ক করা থাকে, যা সেই রিডারের আইডি দ্বারা কী (key) করা হয়; যখন কোনো রিডার সেই ম্যাপের কী (key) হিসেবে থাকে না, তখন সেই রিডার এবং অধ্যায়ের জন্য এই ফাইলটির কোনো অস্তিত্ব থাকে না।

-   `translation` হলো অনুবাদের আইডি (যেমন `BSB` )।
-   `book` হলো বইটির আইডি (যেমন, জেনেসিসের জন্য `GEN` – আপনি [এখানে](https://ubsicap.github.io/usfm/identification/books.html) বইয়ের আইডিগুলোর একটি তালিকা খুঁজে পেতে পারেন)।
-   `chapter` হলো সংখ্যাসূচক অধ্যায় (যেমন, প্রথম অধ্যায়ের জন্য `1` )।
-   `reader` হলো সেই পাঠকের আইডি যার বর্ণনার জন্য সময়গুলো দেওয়া আছে (যেমন `hays` ) - একটি অধ্যায়ের জন্য উপলব্ধ পাঠকগণ হলো তার `thisChapterAudioLinks` নম্বর কী।

একটি পদের শেষ হলো পরবর্তী পদের শুরু (অথবা, শেষ পদের ক্ষেত্রে, অডিও ফাইলের শেষ), তাই পুরো অধ্যায়ের জন্য হাইলাইটিং রেঞ্জ তৈরি করতে ক্লায়েন্টের শুরুর সময়ের ক্রমিক তালিকাটি ছাড়া আর কিছুর প্রয়োজন হয় না।

এই ফাইলটি সাধারণ অধ্যায়ের শেষবিন্দু থেকে অ্যাক্সেস করা হোক বা [সরলীকৃত শেষবিন্দু](./simplified.md#get-a-simplified-chapter-from-a-translation) থেকে, একই থাকে — প্রতিটি অনুবাদ, বই, অধ্যায় এবং পাঠকের জন্য সময়ের একটিই সেট রয়েছে।

### কোডের উদাহরণ

::: code-tabs#lang

@ট্যাব জাভাস্ক্রিপ্ট

```ts:no-line-numbers title="fetch-chapter-audio-timings.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;
const reader = 'hays';

// 'hays'-এর পাঠ অনুযায়ী জেনেসিস ১ (BSB)-এর অডিওর সময়সূচী জেনে নিন।
fetch(`https://bible.helloao.org/api/${translation}/${book}/${chapter}.${reader}.audioTimings.json`)
    .then(request => request.json())
    .then(timings => {
        console.log('Genesis 1 (BSB, hays) verse start times:', timings.verses);
    });
```

@ট্যাব cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/GEN/1.hays.audioTimings.json
```

:::

### কাঠামো

```typescript:no-line-numbers title="chapter-audio-timings.ts"
/**
 * একজন পাঠকের জন্য বইয়ের একটি অধ্যায়ের অডিওর সময়সীমা নির্ধারণ করে।
 * এটি /api/{translation}/{book}/{chapter}.{reader}.audioTimings.json এন্ডপয়েন্টকে নির্দেশ করে।
 */
export interface TranslationBookChapterAudioTimings {
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
     * যে রিডারের জন্য এই সময়সূচকগুলো প্রযোজ্য, তার আইডি।
     */
    reader: string;

    /**
     * এই সময়গুলো যে অডিও ফাইলের জন্য, তার লিঙ্ক।
     */
    audioLink: string;

    /**
     * এই অধ্যায়ের তথ্যের লিঙ্ক।
     */
    thisChapterLink: string;

    /**
     * পরবর্তী অধ্যায়ের তথ্যের লিঙ্ক।
     * অনুবাদে এটি শেষ অধ্যায় হলে শূন্য হবে।
     */
    nextChapterLink: string | null;

    /**
     * পূর্ববর্তী অধ্যায়ের তথ্যের লিঙ্ক।
     * অনুবাদটির প্রথম অধ্যায় হলে এটি শূন্য হবে।
     */
    previousChapterLink: string | null;

    /**
     * এই অডিও টাইমিং ফাইলের লিঙ্ক।
     */
    thisChapterAudioTimingsLink: string;

    /**
     * একই পাঠকের জন্য পরবর্তী অধ্যায়ের সময়সূচীর লিঙ্ক।
     * অনুবাদে এটি শেষ অধ্যায় হলে শূন্য।
     */
    nextChapterAudioTimingsLink: string | null;

    /**
     * একই পাঠকের জন্য পূর্ববর্তী অধ্যায়ের সময়সূচীর লিঙ্ক।
     * অনুবাদটির প্রথম অধ্যায় হলে এটি শূন্য হবে।
     */
    previousChapterAudioTimingsLink: string | null;

    /**
     * ক্রমানুসারে প্রতিটি শ্লোক শুরু হওয়ার সময় (সেকেন্ডে)।
     * প্রথম সংখ্যাটি (সূচক ০) হলো রেকর্ডিংয়ের সেই সময়, যখন প্রথম স্তবকটি শুরু হয়।
     */
    verses: number[];
}
```

### উদাহরণ

```json:no-line-numbers title="/api/BSB/GEN/1.hays.audioTimings.json"
{
    "translationId": "BSB",
    "bookId": "GEN",
    "chapterNumber": 1,
    "reader": "hays",
    "audioLink": "https://openbible.com/audio/hays/BSB_01_Gen_001_H.mp3",
    "thisChapterLink": "/api/BSB/GEN/1.json",
    "nextChapterLink": "/api/BSB/GEN/2.json",
    "previousChapterLink": null,
    "thisChapterAudioTimingsLink": "/api/BSB/GEN/1.hays.audioTimings.json",
    "nextChapterAudioTimingsLink": "/api/BSB/GEN/2.hays.audioTimings.json",
    "previousChapterAudioTimingsLink": null,
    "verses": [
        0,
        4.32,
        10.28,
        19.06,
        27.84
    ]
}
```

`verses[0]` হলো প্রথম পদের শুরুর সময়, `verses[1]` হলো দ্বিতীয় পদের শুরুর সময়, এবং এভাবেই চলতে থাকে - তাই এই উদাহরণে, আদিপুস্তক ১-এর দ্বিতীয় পদ (বিএসবি, যেমনটি 'হেস' পাঠ করেছেন) `audioLink` নং পদের ৪.৩২ সেকেন্ড পরে শুরু হয়।

## একটি অধ্যায়ের শব্দগুলো জানুন

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.words.json`

একটি নির্দিষ্ট অধ্যায়ের জন্য শব্দ-স্তরের টীকা (স্ট্রং নম্বর এবং সম্পর্কিত উৎস ডেটা) পাওয়া যায়।

শুধুমাত্র কিছু অনুবাদে শব্দ-স্তরের টীকা অন্তর্ভুক্ত থাকে। যে অধ্যায়ে সেগুলি থাকে, সেটি `thisChapterWordsLink` দিয়ে এই ফাইলের সাথে লিঙ্ক করে; যখন এই বৈশিষ্ট্যটি অনুপস্থিত থাকে, তখন সেই অধ্যায়ের জন্য এই ফাইলটি বিদ্যমান থাকে না।

-   `translation` হলো অনুবাদের আইডি (যেমন `BSB` )।
-   `book` হলো বইটির আইডি (যেমন, জেনেসিসের জন্য `GEN` – আপনি [এখানে](https://ubsicap.github.io/usfm/identification/books.html) বইয়ের আইডিগুলোর একটি তালিকা খুঁজে পেতে পারেন)।
-   `chapter` হলো সংখ্যাসূচক অধ্যায় (যেমন, প্রথম অধ্যায়ের জন্য `1` )।

প্রতিটি টীকা একটি শ্লোকের `content` অ্যারের কোনো একটি আইটেমের অক্ষর পরিসরের সাথে যুক্ত থাকে: `contentIndex` হলো আইটেমটির সূচক, এবং `start` / `end` হলো সেই আইটেমের পাঠ্যের মধ্যে অক্ষর অফসেট। `end` হলো বর্জনীয়, তাই `text.slice(start, end)` হলো টীকাকৃত শব্দটি।

(পুরো শ্লোকের পরিবর্তে) কোনো একটি নির্দিষ্ট বিষয়বস্তুর সাথে অ্যাঙ্করিং করার অর্থ হলো, যেসব শ্লোকের বিষয়বস্তু একাধিক অংশে বিভক্ত থাকে, যেমন কবিতার পঙক্তি, যিশুর বাণী এবং পাদটীকায় উল্লেখ, সেগুলোর ক্ষেত্রেও অফসেটগুলো সঠিক থাকে।

### কোডের উদাহরণ

::: code-tabs#lang

@ট্যাব জাভাস্ক্রিপ্ট

```ts:no-line-numbers title="fetch-chapter-words.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// BSB অনুবাদ থেকে আদিপুস্তক ১-এর শব্দগুলো নিন।
fetch(`https://bible.helloao.org/api/${translation}/${book}/${chapter}.words.json`)
    .then(request => request.json())
    .then(words => {
        console.log('Genesis 1 words (BSB):', words);
    });
```

@ট্যাব cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/GEN/1.words.json
```

:::

### কাঠামো

```typescript:no-line-numbers title="chapter-words.ts"
export interface TranslationBookChapterWords {
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
     * এই অধ্যায়ের তথ্যের লিঙ্ক।
     */
    thisChapterLink: string;

    /**
     * পরবর্তী অধ্যায়ের তথ্যের লিঙ্ক।
     * অনুবাদে এটি শেষ অধ্যায় হলে শূন্য হবে।
     */
    nextChapterLink: string | null;

    /**
     * পূর্ববর্তী অধ্যায়ের তথ্যের লিঙ্ক।
     * অনুবাদটির প্রথম অধ্যায় হলে এটি শূন্য হবে।
     */
    previousChapterLink: string | null;

    /**
     * এই ওয়ার্ডস ফাইলের লিঙ্ক।
     */
    thisChapterWordsLink: string;

    /**
     * পরবর্তী অধ্যায়ের শব্দগুলোর লিঙ্ক।
     * যদি এটি অনুবাদের শেষ অধ্যায় হয়, অথবা পরবর্তী অধ্যায়ে কোনো শব্দ-স্তরের টীকা না থাকে, তাহলে এটি শূন্য হবে।
     */
    nextChapterWordsLink: string | null;

    /**
     * পূর্ববর্তী অধ্যায়ের শব্দগুলোর লিঙ্ক।
     * যদি এটি অনুবাদের প্রথম অধ্যায় হয়, অথবা পূর্ববর্তী অধ্যায়ে কোনো শব্দ-স্তরের টীকা না থাকে, তাহলে এটি শূন্য হবে।
     */
    previousChapterWordsLink: string | null;

    /**
     * অধ্যায়ের প্রতিটি পদের টীকাযুক্ত শব্দাবলী, পদসংখ্যা অনুসারে চিহ্নিত।
     * প্রতিটি তালিকা শ্লোকে শব্দগুলো যে ক্রমে রয়েছে, সেই ক্রমেই সাজানো হয়েছে।
     */
    verses: {
        [verseNumber: string]: ChapterWord[];
    };
}

interface ChapterWord {
    /**
     * শ্লোকের বিষয়বস্তু অ্যারেতে থাকা আইটেমটির সূচক, যার উপর টীকাটি প্রযোজ্য।
     */
    contentIndex: number;

    /**
     * কন্টেন্ট আইটেমের টেক্সটে চিহ্নিত শব্দটির প্রথম অক্ষরের সূচক।
     */
    start: number;

    /**
     * কন্টেন্ট আইটেমের টেক্সটে টীকাযুক্ত শব্দটির শেষ অক্ষরের পরের সূচক।
     * অর্থাৎ, text.slice(start, end) হলো টীকাযুক্ত শব্দটি।
     */
    end: number;

    /**
     * শব্দটির জন্য স্ট্রং-এর নম্বর(গুলি)।
     * অনুবাদে শব্দটির জন্য শুধু অন্যান্য টীকা দেওয়া থাকলে তা বাদ দেওয়া হয়েছে।
     */
    strongs?: string[];

    /**
     * শব্দটির অভিধানিক (উদ্ধৃতি) রূপ।
     * অনুবাদে কোনো তথ্য না থাকলে তা বাদ দেওয়া হয়েছে।
     */
    lemma?: string;

    /**
     * শব্দটির রূপতত্ত্ব পার্স কোড।
     * অনুবাদে কোনো তথ্য না থাকলে তা বাদ দেওয়া হয়েছে।
     */
    morph?: string;

    /**
     * উৎস পাঠ্যে থাকা শব্দটির পয়েন্টার, যা <sourceName> : <location> ফরম্যাটে থাকে।
     * অনুবাদে কোনো তথ্য না থাকলে তা বাদ দেওয়া হয়েছে।
     */
    srcloc?: string;

    /**
     * এই শব্দটি উৎস শব্দটির কোন পুনরাবৃত্তি। ১-ভিত্তিক।
     * অনুবাদে কোনো তথ্য না থাকলে তা বাদ দেওয়া হয়েছে।
     */
    occurrence?: number;

    /**
     * উৎস শব্দটি মোট যতবার আসে।
     * অনুবাদে কোনো তথ্য না থাকলে তা বাদ দেওয়া হয়েছে।
     */
    occurrences?: number;
}
```

### উদাহরণ

এমন একটি অধ্যায় দেওয়া হলো যার প্রথম পদে একটিমাত্র বিষয়বস্তু রয়েছে:

```json:no-line-numbers title="/api/engwebp/JHN/1.json"
{
    "thisChapterWordsLink": "/api/engwebp/JHN/1.words.json",
    "chapter": {
        "number": 1,
        "content": [
            {
                "type": "verse",
                "number": 1,
                "content": [
                    "In the beginning was the Word, and the Word was with God, and the Word was God."
                ]
            }
        ]
    }
}
```

শব্দ ফাইলটি সেই আইটেমের অক্ষরগুলোকে টীকাযুক্ত করে:

```json:no-line-numbers title="/api/engwebp/JHN/1.words.json"
{
    "translationId": "engwebp",
    "bookId": "JHN",
    "chapterNumber": 1,
    "thisChapterLink": "/api/engwebp/JHN/1.json",
    "nextChapterLink": "/api/engwebp/JHN/2.json",
    "previousChapterLink": "/api/engwebp/MAT/28.json",
    "thisChapterWordsLink": "/api/engwebp/JHN/1.words.json",
    "nextChapterWordsLink": "/api/engwebp/JHN/2.words.json",
    "previousChapterWordsLink": "/api/engwebp/MAT/28.words.json",
    "verses": {
        "1": [
            {
                "contentIndex": 0,
                "start": 0,
                "end": 2,
                "strongs": ["G1722"]
            },
            {
                "contentIndex": 0,
                "start": 3,
                "end": 6,
                "strongs": ["G1722"]
            },
            {
                "contentIndex": 0,
                "start": 7,
                "end": 16,
                "strongs": ["G0746"]
            }
        ]
    }
}
```

অর্থাৎ, `"In the beginning...".slice(0, 2)` হলো `"In"` , যাকে উৎসটি `G1722` হিসেবে চিহ্নিত করেছে।

## সম্পূর্ণ অনুবাদটি নিন

`GET https://bible.helloao.org/api/{translation}/complete.json`

সম্পূর্ণ অনুবাদের বিষয়বস্তু পাওয়া যায়।

-   `translation` হলো অনুবাদের আইডি (যেমন `BSB` )।

### কোডের উদাহরণ

::: code-tabs#lang

@ট্যাব জাভাস্ক্রিপ্ট

```ts:no-line-numbers title="fetch-translation-complete.js"
const translation = 'BSB';

// BSB অনুবাদ থেকে আদিপুস্তক ১ সংগ্রহ করুন।
fetch(`https://bible.helloao.org/api/${translation}/complete.json`)
    .then(request => request.json())
    .then(chapter => {
        console.log('BSB:', chapter);
    });
```

@ট্যাব cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/complete.json
```

:::

### কাঠামো

```typescript:no-line-numbers title="complete.ts"
/**
 * সম্পূর্ণ অনুবাদ ডাউনলোডের তথ্য নির্ধারণ করে।
 * এটি /api/:translationId/complete.json এন্ডপয়েন্টকে নির্দেশ করে।
 */
export interface TranslationComplete {
    /**
     * অনুবাদ মেটাডেটা।
     */
    translation: Translation;

    /**
     * বইগুলোর সকল অধ্যায়সহ পূর্ণাঙ্গ তালিকা।
     */
    books: TranslationCompleteBook[];
}

/**
 * সম্পূর্ণ অনুবাদে একটি বই ডাউনলোড করুন।
 */
export interface TranslationCompleteBook {
    /**
     * বইটির আইডি।
     */
    id: string;

    /**
     * অনুবাদ থেকে বইটির নাম।
     */
    name: string;

    /**
     * বইটির প্রচলিত নাম।
     */
    commonName: string;

    /**
     * বইটির শিরোনাম।
     */
    title: string | null;

    /**
     * বইটির ক্রম।
     */
    order: number;

    /**
     * বইটিতে অধ্যায়ের সংখ্যা।
     */
    numberOfChapters: number;

    /**
     * বইটিতে থাকা মোট শ্লোকের সংখ্যা।
     */
    totalNumberOfVerses: number;

    /**
     * বইটি অপ্রামাণিক কিনা।
     */
    isApocryphal?: boolean;

    /**
     * সমস্ত বিষয়বস্তুসহ অধ্যায়গুলোর পূর্ণাঙ্গ তালিকা।
     */
    chapters: TranslationCompleteChapter[];
}

/**
 * সম্পূর্ণ অনুবাদে একটি অধ্যায় ডাউনলোড করুন।
 */
export interface TranslationCompleteChapter {
    /**
     * অধ্যায়টিতে থাকা শ্লোকের সংখ্যা।
     */
    numberOfVerses: number;

    /**
     * অধ্যায়টির বিভিন্ন অডিও সংস্করণের লিঙ্ক।
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * অধ্যায়টির বিভিন্ন অডিও সংস্করণের জন্য অডিওর সময়কাল (প্রতিটি শ্লোকের শুরুর সময়, সেকেন্ডে)।
     *
     * প্রতিটি অধ্যায়ের এন্ডপয়েন্টে থাকা `thisChapterAudioTimings` এর (যা নিচে "একটি অধ্যায়ের অডিও টাইমিং পান" লিঙ্কে নিয়ে যায়) বিপরীতে, এতে সরাসরি টাইমিংগুলোই থাকে — কারণ সম্পূর্ণ অনুবাদ ডাউনলোডের উদ্দেশ্যই হলো সবকিছু একটি ফাইলে পাওয়া।
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsMap;

    /**
     * অধ্যায়টির শব্দ-স্তরের টীকাগুলোর লিঙ্ক।
     * অধ্যায়টিতে কোনো শব্দ-স্তরের টীকা না থাকলে এটি বাদ দেওয়া হয়।
     */
    thisChapterWordsLink?: string;

    /**
     * অধ্যায়টির তথ্য।
     */
    chapter: ChapterData;
}

/**
 * বইয়ের একটি অধ্যায়ের অডিওর সময়কাল, যা লিঙ্কের পরিবর্তে সরাসরি এমবেড করা হয়েছে।
 * একটি রিডার আইডিকে, শ্লোক অনুসারে প্রতিটি শ্লোক শুরুর সময়ের (সেকেন্ডে) তালিকার সাথে সংযুক্ত করে।
 */
interface TranslationBookChapterAudioTimingsMap {
    [reader: string]: number[];
}
```

### উদাহরণ

```json:no-line-numbers title="/api/BSB/complete.json"
{
  "translation": {
    "id": "BSB",
    "name": "Berean Standard Bible",
    "website": "https://berean.bible/",
    "licenseUrl": "https://berean.bible/",
    "licenseNotes": null,
    "shortName": "BSB",
    "englishName": "Berean Standard Bible",
    "language": "eng",
    "textDirection": "ltr",
    "sha256": "b2898c49cadb50fd8763feb9e2f74a90a3817e33408a24b6cbf09e7a950dde97",
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
            "gilbert": "https://openbible.com/audio/gilbert/BSB_01_Gen_001_G.mp3",
            "hays": "https://openbible.com/audio/hays/BSB_01_Gen_001_H.mp3",
            "souer": "https://openbible.com/audio/souer/BSB_01_Gen_001.mp3"
          },
          "thisChapterAudioTimings": {
            "gilbert": [0, 4.4, 10.36],
            "hays": [0, 4.32, 10.28],
            "souer": [0, 4.28, 10.19]
          },
          "chapter": {
            "number": 1,
            "content": [
              {
                "type": "heading",
                "content": [
                  "The Creation"
                ]
              },
              {
                "type": "verse",
                "number": 1,
                "content": [
                  "In the beginning God created the heavens and the earth."
                ]
              },
              {
                "type": "line_break"
              },
              {
                "type": "verse",
                "number": 2,
                "content": [
                  "Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters."
                ]
              },
            ]
          }
        }
      ]
    }
  ]
}
```
