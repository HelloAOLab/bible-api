# معیاری شکل

ابواب، مکمل ترجمہ ڈاؤن لوڈ، اور لفظی سطح کی تشریحات کے لیے معیاری فارمیٹ۔ ترجمہ اور کتاب کی فہرست کے اختتامی نکات کے لیے [ترجمہ، کتابیں اور ابواب](./README.md) دیکھیں، یا اسی مواد کی متبادل نمائندگی کے لیے [آسان فارمیٹ](./simplified.md) دیکھیں۔

## ترجمہ سے ایک باب حاصل کریں۔

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`

دی گئی کتاب اور ترجمہ کے لیے ایک باب کا مواد حاصل کرتا ہے۔

-   `translation` ترجمہ کی ID ہے (مثال کے طور پر `BSB` )۔
-   `book` کتاب کی ID ہے (مثال کے طور پر پیدائش کے لیے `GEN` - آپ [یہاں](https://ubsicap.github.io/usfm/identification/books.html) کتاب کی شناخت کی فہرست تلاش کر سکتے ہیں)۔
-   `chapter` عددی باب ہے (مثلاً `1` پہلے باب کے لیے)۔

### کوڈ کی مثال

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// BSB ترجمہ سے پیدائش 1 حاصل کریں۔
fetch(`https://bible.helloao.org/api/${translation}/${book}/${chapter}.json`)
    .then(request => request.json())
    .then(chapter => {
        console.log('Genesis 1 (BSB):', chapter);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/GEN/1.json
```

:::

### ساخت

```typescript:no-line-numbers title="chapter.ts"
export interface TranslationBookChapter {
    /**
     * کتاب کے باب کے ترجمہ کی معلومات۔
     */
    translation: Translation;

    /**
     * کتاب کے باب کے لیے کتاب کی معلومات۔
     */
    book: TranslationBook;

    /**
     * موجودہ باب کا لنک۔
     */
    thisChapterLink: string;

    /**
     * باب کے لیے مختلف آڈیو ورژن کے لنکس۔
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * باب کے لیے مختلف آڈیو ورژنز کے لیے آڈیو اوقات کے لنکس۔
     * ہر لنک اس قاری کے لیے آڈیو ٹائمنگ فائل کی طرف اشارہ کرتا ہے - نیچے "ایک باب کے لیے آڈیو ٹائمنگ حاصل کریں" دیکھیں۔
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsLinks;

    /**
     * اگلے باب کا لنک۔
     * منسوخ اگر یہ ترجمہ کا آخری باب ہے۔
     */
    nextChapterApiLink: string | null;

    /**
     * اگلے باب کے لیے مختلف آڈیو ورژن کے لنکس۔
     * منسوخ اگر یہ ترجمہ کا آخری باب ہے۔
     */
    nextChapterAudioLinks: TranslationBookChapterAudioLinks | null;

    /**
     * اگلے باب کے لیے مختلف آڈیو ورژنز کے لیے آڈیو اوقات کے لنکس۔
     * منسوخ اگر یہ ترجمہ کا آخری باب ہے۔
     */
    nextChapterAudioTimings: TranslationBookChapterAudioTimingsLinks | null;

    /**
     * پچھلے باب کا لنک۔
     * منسوخ اگر یہ ترجمہ کا پہلا باب ہے۔
     */
    previousChapterApiLink: string | null;

    /**
     * پچھلے باب کے لیے مختلف آڈیو ورژن کے لنکس۔
     * منسوخ اگر یہ ترجمہ کا پہلا باب ہے۔
     */
    previousChapterAudioLinks: TranslationBookChapterAudioLinks | null;

    /**
     * پچھلے باب کے لیے مختلف آڈیو ورژنز کے لیے آڈیو اوقات کے لنکس۔
     * منسوخ اگر یہ ترجمہ کا پہلا باب ہے۔
     */
    previousChapterAudioTimings: TranslationBookChapterAudioTimingsLinks | null;

    /**
     * باب کے لیے لفظی سطح کے تشریحات کا لنک۔
     * اگر باب میں لفظی سطح کی کوئی تشریحات نہیں ہیں تو چھوڑ دیا جائے گا۔
     */
    thisChapterWordsLink?: string;

    /**
     * اگلے باب کے لیے لفظی سطح کی تشریحات کا لنک۔
     * اگر یہ ترجمے کا آخری باب ہے، یا اگر اگلے باب میں لفظی سطح کی تشریحات نہیں ہیں۔
     */
    nextChapterWordsLink?: string;

    /**
     * پچھلے باب کے لیے لفظ کی سطح کی تشریحات کا لنک۔
     * اگر یہ ترجمے کا پہلا باب ہے، یا اگر پچھلے باب میں کوئی لفظی سطح کی تشریحات نہیں ہیں۔
     */
    previousChapterWordsLink?: string;

    /**
     * آیات کی تعداد جو باب میں ہے۔
     */
    numberOfVerses: number;

    /**
     * اس باب کے آسان ورژن کا لنک۔
     * اگر آسان ابواب دستیاب نہیں ہیں تو چھوڑ دیا جائے گا۔
     */
    simpleChapterApiLink?: string;

    /**
     * باب کے لیے معلومات۔
     */
    chapter: ChapterData;
}

interface ChapterData {
    /**
     * باب کا نمبر۔
     */
    number: number;

    /**
     * باب کا مواد۔
     */
    content: ChapterContent[];

    /**
     * باب کے لیے فوٹ نوٹ کی فہرست۔
     */
    footnotes: ChapterFootnote[];
}

/**
 * ایک یونین کی قسم جو باب کے مواد کے ایک ٹکڑے کی نمائندگی کرتی ہے۔
 * باب کے مواد کا ایک ٹکڑا درج ذیل چیزوں میں سے ایک ہو سکتا ہے:
 * - ایک سرخی.
 * - ایک لائن توڑ.
 * - ایک آیت۔
 * - ایک عبرانی ذیلی عنوان۔
 */
type ChapterContent = ChapterHeading | ChapterLineBreak | ChapterVerse | ChapterHebrewSubtitle;

/**
 * ایک باب میں عنوان۔
 */
interface ChapterHeading {
    /**
     * اشارہ کرتا ہے کہ مواد سرخی کی نمائندگی کرتا ہے۔
     */
    type: 'heading';

    /**
     * عنوان کے لیے مواد۔
     * اگر صف میں ایک سے زیادہ سٹرنگز شامل ہیں، تو انہیں اسپیس کے ساتھ جوڑا جانا چاہیے۔
     */
    content: string[];
}

/**
 * ایک باب میں لائن کا وقفہ۔
 */
interface ChapterLineBreak {
    /**
     * اشارہ کرتا ہے کہ مواد لائن بریک کی نمائندگی کرتا ہے۔
     */
    type: 'line_break';
}

/**
 * ایک باب میں ایک عبرانی سب ٹائٹل۔
 * یہ اکثر معلوماتی مواد کے طور پر استعمال ہوتے ہیں جو اصل مخطوطات میں ظاہر ہوتے ہیں۔
 * مثال کے طور پر، زبور 49 میں عبرانی ذیلی عنوان ہے "کوئر ماسٹر کے لیے۔ کورہ کے بیٹوں کا زبور۔"
 */
interface ChapterHebrewSubtitle {
    /**
     * اشارہ کرتا ہے کہ مواد عبرانی سب ٹائٹل کی نمائندگی کرتا ہے۔
     */
    type: 'hebrew_subtitle';

    /**
     * مواد کی فہرست جو ذیلی عنوان میں موجود ہے۔
     * فہرست میں ہر عنصر سٹرنگ، فارمیٹ شدہ متن، یا فوٹ نوٹ حوالہ ہو سکتا ہے۔
     */
    content: (string | FormattedText | VerseFootnoteReference)[];
}

/**
 * ایک باب میں ایک آیت۔
 */
interface ChapterVerse {
    /**
     * اشارہ کرتا ہے کہ مواد ایک آیت ہے۔
     */
    type: 'verse';

    /**
     * آیت کی تعداد۔
     */
    number: number;

    /**
     * آیت کے مواد کی فہرست۔
     * فہرست میں ہر عنصر سٹرنگ، فارمیٹ شدہ متن، یا فوٹ نوٹ حوالہ ہو سکتا ہے۔
     */
    content: (string | FormattedText | InlineHeading | InlineLineBreak | VerseFootnoteReference)[];
}

/**
 * فارمیٹ شدہ متن۔ یعنی متن جو ایک خاص انداز میں تشکیل پاتا ہے۔
 */
interface FormattedText {
    /**
     * وہ متن جو فارمیٹ کیا گیا ہے۔
     */
    text: string;

    /**
     * آیا متن کسی نظم کی نمائندگی کرتا ہے۔
     * نمبر انڈینٹ کی سطح کی نشاندہی کرتا ہے۔
     *
     * زبور میں عام۔
     */
    poem?: number;

    /**
     * آیا متن یسوع کے الفاظ کی نمائندگی کرتا ہے۔
     */
    wordsOfJesus?: boolean;
}

/**
 * ایک انٹرفیس کی وضاحت کرتا ہے جو ایک عنوان کی نمائندگی کرتا ہے جو ایک آیت میں سرایت کرتا ہے۔
 */
interface InlineHeading {
    /**
     * عنوان کا متن۔
     */
    heading: string;
}

/**
 * ایک انٹرفیس کی وضاحت کرتا ہے جو لائن بریک کی نمائندگی کرتا ہے جو ایک آیت میں سرایت کرتا ہے۔
 */
interface InlineLineBreak {
    lineBreak: true;
}


/**
 * کسی آیت یا عبرانی سب ٹائٹل میں فوٹ نوٹ کا حوالہ۔
 */
interface VerseFootnoteReference {
    /**
     * نوٹ کی شناخت۔
     */
    noteId: number;
}

/**
 * فوٹ نوٹ کے بارے میں معلومات۔
 */
interface ChapterFootnote {
    /**
     * اس نوٹ کی ID جس کا حوالہ دیا گیا ہے۔
     */
    noteId: number;

    /**
     * فوٹ نوٹ کا متن۔
     */
    text: string;

    /**
     * حاشیہ کے لیے آیت کا حوالہ۔
     */
    reference?: {
        chapter: number;
        verse: number;
    };

    /**
     * کال کرنے والا جو فوٹ نوٹ کے لیے استعمال کیا جانا چاہیے۔
     * فوٹ نوٹ کے لیے، "کالر" وہ حرف ہے جو متن میں فوٹ نوٹ کے حوالے سے استعمال ہوتا ہے۔
     *
     * مثال کے طور پر، متن میں:
     * ہیلو (a) دنیا
     *
     * ---- (a) یہ ایک فوٹ نوٹ ہے۔
     *
     * "(a)" پکارنے والا ہے۔
     *
     * اگر "+"، تو کالر خود کار طریقے سے تیار کیا جانا چاہئے.
     * اگر کالعدم ہے، تو کالر خالی ہونا چاہیے۔
     * اگر ایک تار ہے، تو کالر وہ تار ہونا چاہیے۔
     */
    caller: '+' | string | null;
}

/**
 * کتاب کے باب کے لیے آڈیو لنکس۔
 */
interface TranslationBookChapterAudioLinks {
    /**
     * باب کا قاری اور آڈیو فائل کا URL لنک۔
     */
    [reader: string]: string;
}

/**
 * کتاب کے باب کے لیے آڈیو ٹائمنگ لنکس۔
 */
interface TranslationBookChapterAudioTimingsLinks {
    /**
     * باب کا ریڈر اور اس ریڈر کے لیے آڈیو ٹائمنگ فائل سے API لنک۔
     */
    [reader: string]: string;
}
```

### مثال

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

## ایک باب کے لیے آڈیو ٹائمنگ حاصل کریں۔

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.{reader}.audioTimings.json`

کسی ایک باب کے لیے، ایک قاری کے بیان کے لیے فی آیت کے آڈیو اوقات حاصل کرتا ہے - یعنی وہ وقت (سیکنڈوں میں، اس قاری کی آڈیو فائل کے آغاز کے نسبت) جس سے ہر آیت شروع ہوتی ہے۔ کلائنٹ اس کا استعمال اس آیت کو نمایاں کرنے کے لیے کر سکتے ہیں جو فی الحال آڈیو پلے کے طور پر پڑھی جا رہی ہے۔

صرف کچھ ترجمے اور قارئین کے پاس آڈیو ٹائمنگ ہے۔ ایک باب جس میں قاری کے لیے ان کا لنک ہے اس فائل سے `thisChapterAudioTimings` میں ایک اندراج کے ساتھ، اس قاری کی ID کے ذریعے کلید؛ جب ایک قاری اس نقشے میں کلید نہیں ہے، تو یہ فائل اس قاری اور باب کے لیے موجود نہیں ہے۔

-   `translation` ترجمہ کی ID ہے (مثلاً `BSB` )۔
-   `book` کتاب کی ID ہے (مثال کے طور پر پیدائش کے لیے `GEN` - آپ [یہاں](https://ubsicap.github.io/usfm/identification/books.html) کتاب کی شناخت کی فہرست تلاش کر سکتے ہیں)۔
-   `chapter` عددی باب ہے (مثلاً `1` پہلے باب کے لیے)۔
-   `reader` قاری کی ID ہے جس کے بیان کے اوقات (مثلاً `hays` ) کے لیے ہیں - ایک باب کے لیے دستیاب قارئین اس کے `thisChapterAudioLinks` کی کلید ہیں۔

ایک آیت کا اختتام اگلی آیت کا آغاز ہوتا ہے (یا، آخری آیت کے لیے، آڈیو فائل کا اختتام)، اس لیے ایک کلائنٹ کو پورے باب کے لیے ہائی لائٹنگ رینجز بنانے کے لیے شروع کے اوقات کی ترتیب دی گئی فہرست سے آگے کسی چیز کی ضرورت نہیں ہوتی ہے۔

یہ فائل یکساں ہے اس سے قطع نظر کہ یہ باقاعدہ باب کے اختتامی نقطہ سے پہنچی ہے یا [آسان فائل](./simplified.md#get-a-simplified-chapter-from-a-translation) - یہاں فی ترجمہ، کتاب، باب، اور قاری کے اوقات کا صرف ایک سیٹ ہے۔

### کوڈ کی مثال

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter-audio-timings.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;
const reader = 'hays';

// جینیسس 1 (بی ایس بی) کے لیے آڈیو ٹائمنگ حاصل کریں، جیسا کہ "ہیز" نے پڑھا ہے۔
fetch(`https://bible.helloao.org/api/${translation}/${book}/${chapter}.${reader}.audioTimings.json`)
    .then(request => request.json())
    .then(timings => {
        console.log('Genesis 1 (BSB, hays) verse start times:', timings.verses);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/GEN/1.hays.audioTimings.json
```

:::

### ساخت

```typescript:no-line-numbers title="chapter-audio-timings.ts"
/**
 * کسی ایک قاری کے لیے کتاب کے باب کے لیے آڈیو اوقات کی وضاحت کرتا ہے۔
 * /api/{translation}/{book}/{chapter} کے نقشے{reader}.audioTimings.json اینڈ پوائنٹ۔
 */
export interface TranslationBookChapterAudioTimings {
    /**
     * ترجمہ کی ID۔
     */
    translationId: string;

    /**
     * کتاب کی شناخت۔
     */
    bookId: string;

    /**
     * باب کا نمبر۔
     */
    chapterNumber: number;

    /**
     * قاری کی ID جس کے لیے یہ اوقات ہیں۔
     */
    reader: string;

    /**
     * آڈیو فائل کا لنک جس کے لیے یہ اوقات ہیں۔
     */
    audioLink: string;

    /**
     * اس باب کے لیے معلومات کا لنک۔
     */
    thisChapterLink: string;

    /**
     * اگلے باب کے لیے معلومات کا لنک۔
     * منسوخ اگر یہ ترجمہ کا آخری باب ہے۔
     */
    nextChapterLink: string | null;

    /**
     * پچھلے باب کے لیے معلومات کا لنک۔
     * منسوخ اگر یہ ترجمہ کا پہلا باب ہے۔
     */
    previousChapterLink: string | null;

    /**
     * اس آڈیو ٹائمنگ فائل کا لنک۔
     */
    thisChapterAudioTimingsLink: string;

    /**
     * اسی قاری کے لیے اگلے باب کے اوقات کا لنک۔
     * منسوخ اگر یہ ترجمہ کا آخری باب ہے۔
     */
    nextChapterAudioTimingsLink: string | null;

    /**
     * پچھلے باب کے اوقات کا لنک، اسی قاری کے لیے۔
     * منسوخ اگر یہ ترجمہ کا پہلا باب ہے۔
     */
    previousChapterAudioTimingsLink: string | null;

    /**
     * سیکنڈوں میں وہ اوقات جن سے ہر آیت شروع ہوتی ہے، ترتیب سے۔
     * پہلا نمبر (اشاریہ 0) ریکارڈنگ میں وہ وقت ہے جس سے پہلی آیت شروع ہوتی ہے۔
     */
    verses: number[];
}
```

### مثال

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

`verses[0]` آیت 1 کا آغاز وقت ہے، `verses[1]` آیت 2 کا آغاز وقت ہے، اور اسی طرح - تو اس مثال میں، پیدائش 1 کی آیت 2 (BSB، جیسا کہ "hays" نے پڑھا ہے) 4.32 سیکنڈ سے `audioLink` میں شروع ہوتا ہے۔

## ایک باب کے الفاظ حاصل کریں۔

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.words.json`

ایک ہی باب کے لیے لفظ کی سطح کی تشریحات (Strong's numbers اور متعلقہ سورس ڈیٹا) حاصل کرتا ہے۔

صرف کچھ تراجم میں لفظی سطح کی تشریحات شامل ہیں۔ ایک باب جس میں ان کا لنک اس فائل سے `thisChapterWordsLink` ; جب وہ پراپرٹی غائب ہوتی ہے، تو یہ فائل باب کے لیے موجود نہیں ہوتی ہے۔

-   `translation` ترجمہ کی ID ہے (مثال کے طور پر `BSB` )۔
-   `book` کتاب کی ID ہے (مثال کے طور پر پیدائش کے لیے `GEN` - آپ [یہاں](https://ubsicap.github.io/usfm/identification/books.html) کتاب کی شناخت کی فہرست تلاش کر سکتے ہیں)۔
-   `chapter` عددی باب ہے (مثلاً `1` پہلے باب کے لیے)۔

ہر تشریح کو آیت کی `content` صف کے ایک آئٹم میں حروف کی ایک رینج میں اینکر کیا جاتا ہے: `contentIndex` آئٹم کا اشاریہ ہے، اور `start` اس آئٹم کے متن میں کریکٹر آفسیٹ ہیں `end` `end` خصوصی ہے، لہذا `text.slice(start, end)` تشریح شدہ لفظ ہے۔

کسی مواد کے آئٹم پر اینکرنگ کا مطلب ہے کہ آیات کے لیے آفسیٹس درست رہیں جن کے مواد کو متعدد آئٹمز میں تقسیم کیا گیا ہے، جیسے کہ نظم کی سطریں، یسوع کے الفاظ، اور فوٹ نوٹ حوالہ جات۔

### کوڈ کی مثال

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter-words.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// BSB ترجمہ سے پیدائش 1 کے الفاظ حاصل کریں۔
fetch(`https://bible.helloao.org/api/${translation}/${book}/${chapter}.words.json`)
    .then(request => request.json())
    .then(words => {
        console.log('Genesis 1 words (BSB):', words);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/GEN/1.words.json
```

:::

### ساخت

```typescript:no-line-numbers title="chapter-words.ts"
export interface TranslationBookChapterWords {
    /**
     * ترجمہ کی ID۔
     */
    translationId: string;

    /**
     * کتاب کی شناخت۔
     */
    bookId: string;

    /**
     * باب کا نمبر۔
     */
    chapterNumber: number;

    /**
     * اس باب کے لیے معلومات کا لنک۔
     */
    thisChapterLink: string;

    /**
     * اگلے باب کے لیے معلومات کا لنک۔
     * منسوخ اگر یہ ترجمہ کا آخری باب ہے۔
     */
    nextChapterLink: string | null;

    /**
     * پچھلے باب کے لیے معلومات کا لنک۔
     * منسوخ اگر یہ ترجمہ کا پہلا باب ہے۔
     */
    previousChapterLink: string | null;

    /**
     * اس الفاظ کی فائل کا لنک۔
     */
    thisChapterWordsLink: string;

    /**
     * اگلے باب کے لیے الفاظ کا لنک۔
     * اگر یہ ترجمے کا آخری باب ہے، یا اگر اگلے باب میں لفظی سطح پر کوئی تشریحات نہیں ہیں۔
     */
    nextChapterWordsLink: string | null;

    /**
     * پچھلے باب کے الفاظ کا لنک۔
     * اگر یہ ترجمے کا پہلا باب ہے، یا اگر پچھلے باب میں کوئی لفظی سطح کی تشریحات نہیں ہیں۔
     */
    previousChapterWordsLink: string | null;

    /**
     * باب میں ہر آیت کے لیے تشریح شدہ الفاظ، آیت نمبر کے مطابق۔
     * ہر فہرست اس ترتیب میں ہے کہ آیت میں الفاظ آتے ہیں۔
     */
    verses: {
        [verseNumber: string]: ChapterWord[];
    };
}

interface ChapterWord {
    /**
     * آیت کے مواد کی صف میں آئٹم کا اشاریہ جس پر تشریح کا اطلاق ہوتا ہے۔
     */
    contentIndex: number;

    /**
     * مواد کے آئٹم کے متن میں تشریح شدہ لفظ کے پہلے حرف کا اشاریہ۔
     */
    start: number;

    /**
     * مواد کے آئٹم کے متن میں تشریح شدہ لفظ کے آخری حرف کے بعد کا اشاریہ۔
     * یعنی text.slice(start, end) تشریح شدہ لفظ ہے۔
     */
    end: number;

    /**
     * لفظ کے لیے مضبوط نمبر (زبانیں)۔
     * اگر ترجمہ صرف لفظ کے لیے دیگر تشریحات فراہم کرتا ہے۔
     */
    strongs?: string[];

    /**
     * لغت (حوالہ) لفظ کی شکل۔
     * اگر ترجمہ فراہم نہیں کرتا ہے تو چھوڑ دیا گیا ہے۔
     */
    lemma?: string;

    /**
     * لفظ کے لیے مورفولوجی پارس کوڈ۔
     * اگر ترجمہ فراہم نہیں کرتا ہے تو چھوڑ دیا گیا ہے۔
     */
    morph?: string;

    /**
     * سورس ٹیکسٹ میں لفظ کی طرف اشارہ کرنے والا، <sourceName> : <location> فارمیٹ میں۔
     * اگر ترجمہ فراہم نہیں کرتا ہے تو چھوڑ دیا گیا ہے۔
     */
    srcloc?: string;

    /**
     * یہ لفظ مصدر کا کون سا واقعہ ہے۔ 1 کی بنیاد پر۔
     * اگر ترجمہ فراہم نہیں کرتا ہے تو چھوڑ دیا گیا ہے۔
     */
    occurrence?: number;

    /**
     * کل تعداد جو ماخذ کا لفظ واقع ہوتا ہے۔
     * اگر ترجمہ فراہم نہیں کرتا ہے تو چھوڑ دیا گیا ہے۔
     */
    occurrences?: number;
}
```

### مثال

ایک باب دیا گیا جس کی پہلی آیت میں ایک ہی مواد ہے:

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

الفاظ کی فائل اس شے کے حروف کی تشریح کرتی ہے:

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

یعنی، `"In the beginning...".slice(0, 2)` ہے `"In"` ، جسے ماخذ نے `G1722` کے ساتھ ٹیگ کیا ہے۔

## مکمل ترجمہ حاصل کریں۔

`GET https://bible.helloao.org/api/{translation}/complete.json`

مکمل ترجمہ کا مواد حاصل کرتا ہے۔

-   `translation` ترجمہ کی ID ہے (مثلاً `BSB` )۔

### کوڈ کی مثال

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-translation-complete.js"
const translation = 'BSB';

// BSB ترجمہ سے پیدائش 1 حاصل کریں۔
fetch(`https://bible.helloao.org/api/${translation}/complete.json`)
    .then(request => request.json())
    .then(chapter => {
        console.log('BSB:', chapter);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/complete.json
```

:::

### ساخت

```typescript:no-line-numbers title="complete.ts"
/**
 * مکمل ترجمہ ڈاؤن لوڈ ڈیٹا کی وضاحت کرتا ہے۔
 * /api/:translationId/complete.json اینڈ پوائنٹ کے نقشے
 */
export interface TranslationComplete {
    /**
     * ترجمہ میٹا ڈیٹا۔
     */
    translation: Translation;

    /**
     * کتابوں کی مکمل فہرست ان کے تمام ابواب کے ساتھ۔
     */
    books: TranslationCompleteBook[];
}

/**
 * مکمل ترجمہ ڈاؤن لوڈ میں ایک کتاب۔
 */
export interface TranslationCompleteBook {
    /**
     * کتاب کی شناخت۔
     */
    id: string;

    /**
     * ترجمہ سے کتاب کا نام۔
     */
    name: string;

    /**
     * کتاب کا عام نام۔
     */
    commonName: string;

    /**
     * کتاب کا عنوان۔
     */
    title: string | null;

    /**
     * کتاب کی ترتیب۔
     */
    order: number;

    /**
     * کتاب میں ابواب کی تعداد۔
     */
    numberOfChapters: number;

    /**
     * کتاب میں آیات کی کل تعداد۔
     */
    totalNumberOfVerses: number;

    /**
     * خواہ کتاب تصنیف ہو۔
     */
    isApocryphal?: boolean;

    /**
     * تمام مواد کے ساتھ ابواب کی مکمل فہرست۔
     */
    chapters: TranslationCompleteChapter[];
}

/**
 * مکمل ترجمہ ڈاؤن لوڈ کا ایک باب۔
 */
export interface TranslationCompleteChapter {
    /**
     * آیات کی تعداد جو باب میں ہے۔
     */
    numberOfVerses: number;

    /**
     * باب کے لیے مختلف آڈیو ورژن کے لنکس۔
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * باب کے مختلف آڈیو ورژنز کے لیے آڈیو اوقات (فی آیت کے آغاز کے اوقات، سیکنڈ میں)۔
     *
     * انفرادی باب کے اختتامی نقطہ پر `thisChapterAudioTimings` کے برعکس (جو ذیل میں "ایک باب کے لیے آڈیو ٹائمنگ حاصل کریں" سے لنک کرتا ہے)، اس میں خود اوقات شامل ہیں - چونکہ مکمل ترجمہ ڈاؤن لوڈ کا نقطہ یہ ہے کہ سب کچھ ایک فائل میں ہو۔
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsMap;

    /**
     * باب کے لیے لفظی سطح کے تشریحات کا لنک۔
     * اگر باب میں لفظی سطح کی کوئی تشریحات نہیں ہیں تو چھوڑ دیا جائے گا۔
     */
    thisChapterWordsLink?: string;

    /**
     * باب کے لیے معلومات۔
     */
    chapter: ChapterData;
}

/**
 * کتابی باب کے لیے آڈیو ٹائمنگز، اس سے منسلک ہونے کے بجائے براہ راست سرایت کیے ہوئے ہیں۔
 * قاری کی شناخت کو ان اوقات کی فہرست میں (سیکنڈوں میں) جو ہر آیت شروع ہوتی ہے، آیت کی ترتیب میں۔
 */
interface TranslationBookChapterAudioTimingsMap {
    [reader: string]: number[];
}
```

### مثال

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
