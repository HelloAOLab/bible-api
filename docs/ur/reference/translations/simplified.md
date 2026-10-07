# آسان فارمیٹ

ابواب، مکمل ترجمہ ڈاؤن لوڈ، اور لفظی سطح کی تشریحات کے لیے آسان فارمیٹ۔ ترجمہ اور کتاب کی فہرست کے اختتامی نکات کے لیے [ترجمہ، کتابیں اور ابواب](./README.md) دیکھیں، یا اسی مواد کی اصل، ساختی نمائندگی کے لیے [معیاری شکل](./standard.md) دیکھیں۔

## ترجمہ سے ایک آسان باب حاصل کریں۔

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.simple.json`

آسان فارمیٹ کا استعمال کرتے ہوئے، دی گئی کتاب اور ترجمہ کے لیے ایک باب کا مواد حاصل کرتا ہے۔

آسان فارمیٹ میں، ہر آیت کا مواد فارمیٹ شدہ مواد کی فہرست کے بجائے ایک سٹرنگ ہے۔ اس کا مطلب ہے کہ آپ کو کسی آیت کا متن خود بنانے کی ضرورت نہیں ہے، جو درست ہونے کے لیے غیر معمولی ہوسکتی ہے - خاص طور پر جب بات وقفہ کی ہو۔ کوئی بھی چیز جس کی نمائندگی ایک سادہ تار سے نہیں کی جا سکتی ہے - فوٹ نوٹ، یسوع کے الفاظ، شاعری، اور عنوانات جو کسی آیت کے بیچ میں ہوتے ہیں - کو اس سٹرنگ میں ایک آفسیٹ کے طور پر رکھا جاتا ہے، لہذا کچھ بھی ضائع نہیں ہوتا ہے۔

جب آپ کسی باب کا متن چاہتے ہو تو اس اختتامی نقطہ کا استعمال کریں۔ جب آپ باب کو اس کی اصل فارمیٹنگ کے ساتھ رینڈر کرنا چاہتے ہیں تو [باقاعدہ باب کا اختتامی نقطہ](./standard.md#get-a-chapter-from-a-translation) استعمال کریں۔

-   `translation` ترجمہ کی ID ہے (مثلاً `BSB` )۔
-   `book` کتاب کی ID ہے (مثال کے طور پر پیدائش کے لیے `GEN` - آپ [یہاں](https://ubsicap.github.io/usfm/identification/books.html) کتاب کی شناخت کی فہرست تلاش کر سکتے ہیں)۔
-   `chapter` عددی باب ہے (مثلاً `1` پہلے باب کے لیے)۔

وہ ابواب جن میں لفظی سطح کی تشریحات ہوتی ہیں وہ `thisChapterWordsLink` سے منسلک ہوتے ہیں، جو [آسان تشریحات](#get-the-words-of-a-chapter-in-the-simplified-format) کی طرف اشارہ کرتے ہیں - وہ جن کے آفسیٹ اس فائل میں موجود متن سے ملتے ہیں۔

جن ابواب میں فی قاری آڈیو ٹائمنگ ہوتا ہے وہ `thisChapterAudioTimings` کے ساتھ لنک کرتا ہے، جو [آڈیو ٹائمنگ اینڈ پوائنٹ کی طرف](./standard.md#get-the-audio-timings-for-a-chapter) اشارہ کرتا ہے - وہی فائل جس سے باقاعدہ باب اینڈ پوائنٹ لنک کرتا ہے، کیونکہ اوقات باب فارمیٹ پر منحصر نہیں ہوتے ہیں۔

### کوڈ کی مثال

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-simple-chapter.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// BSB ترجمہ سے پیدائش 1 کا متن حاصل کریں۔
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

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/GEN/1.simple.json
```

:::

### آفسیٹس

آسان فارمیٹ میں تمام آفسیٹس - `offset` ، `start` ، اور `end` - آیت کے `text` میں اشاریہ جات ہیں جو ان پر مشتمل ہے۔ ان کی پیمائش UTF-16 کوڈ اکائیوں میں کی جاتی ہے، جو JavaScript کے `String.prototype.length` اور `String.prototype.slice()` استعمال کرتے ہیں۔

`start` شامل ہے اور `end` خصوصی ہے، لہذا `text.slice(start, end)` متن کی بالکل وہی رینج لوٹاتا ہے جس پر نشان لگایا گیا تھا۔ فوٹ نوٹ آفسیٹس وہ پوزیشن ہے جس سے فوٹ نوٹ کا کالر تعلق رکھتا ہے، لہذا `text.slice(0, offset)` وہ متن ہے جو اس سے پہلے آتا ہے۔

### ساخت

```typescript:no-line-numbers title="simple-chapter.ts"
export interface SimpleTranslationBookChapter {
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
     * اس باب کے باقاعدہ (غیر آسان) ورژن کا لنک۔
     */
    fullChapterApiLink: string;

    /**
     * باب کے لیے مختلف آڈیو ورژن کے لنکس۔
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * باب کے لیے مختلف آڈیو ورژنز کے لیے آڈیو اوقات کے لنکس۔
     * معیاری فارمیٹ کے دستاویزات میں "ایک باب کے لیے آڈیو ٹائمنگ حاصل کریں" دیکھیں - ٹائمنگز فائل ایک جیسی ہوتی ہے قطع نظر اس سے کہ جس باب کی شکل اس سے منسلک ہے۔
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsLinks;

    /**
     * اگلے باب کا لنک، آسان شکل میں۔
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
     * پچھلے باب کا لنک، آسان شکل میں۔
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
     * آیات کی تعداد جو باب میں ہے۔
     */
    numberOfVerses: number;

    /**
     * باب کے لیے معلومات۔
     */
    chapter: SimpleChapterData;
}

interface SimpleChapterData {
    /**
     * باب کا نمبر۔
     */
    number: number;

    /**
     * باب کا مواد۔
     */
    content: SimpleChapterContent[];

    /**
     * فوٹ نوٹ کی فہرست جو کسی آیت کے ساتھ منسلک نہیں ہوسکتی ہے۔
     * فوٹ نوٹ جو کسی آیت سے تعلق رکھتے ہیں وہ آیت میں ہی شامل ہیں، اس لیے یہ فہرست عموماً خالی ہوتی ہے۔
     */
    footnotes: ChapterFootnote[];
}

/**
 * ایک یونین کی قسم جو ایک آسان باب میں مواد کے ایک ٹکڑے کی نمائندگی کرتی ہے۔
 */
type SimpleChapterContent = SimpleChapterHeading | ChapterLineBreak | SimpleChapterVerse | SimpleChapterHebrewSubtitle;

/**
 * ایک باب میں عنوان۔
 */
interface SimpleChapterHeading {
    /**
     * اشارہ کرتا ہے کہ مواد سرخی کی نمائندگی کرتا ہے۔
     */
    type: 'heading';

    /**
     * عنوان کا متن۔
     */
    text: string;
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
 * ایک باب میں ایک آیت۔
 */
interface SimpleChapterVerse {
    /**
     * اشارہ کرتا ہے کہ مواد ایک آیت ہے۔
     */
    type: 'verse';

    /**
     * آیت کی تعداد۔
     */
    number: number;

    /**
     * آیت کا متن۔
     * شاعری کی سطریں اور لائن بریک کو نئی لائن (\n) حروف سے الگ کیا جاتا ہے۔
     */
    text: string;

    /**
     * وہ حاشیہ جو آیت میں پائے جاتے ہیں۔
     */
    footnotes: SimpleVerseFootnote[];

    /**
     * وہ عنوانات جو آیت کے بیچ میں آتے ہیں۔
     * اگر آیت میں کوئی ان لائن سرخی نہیں ہے تو چھوڑ دیا جائے گا۔
     */
    headings?: SimpleInlineHeading[];

    /**
     * آیت کے متن کی حدود جو یسوع کے الفاظ کی نمائندگی کرتی ہیں۔
     * اگر آیت میں کوئی نہ ہو۔
     */
    wordsOfJesus?: SimpleTextRange[];

    /**
     * آیت کے متن کی حدود جو شاعری کی لکیروں کی نمائندگی کرتی ہیں۔
     * اگر آیت میں کوئی نہ ہو۔
     */
    poem?: SimplePoemRange[];
}

/**
 * ایک باب میں ایک عبرانی سب ٹائٹل۔
 * یہ اکثر معلوماتی مواد کے طور پر شامل کیے جاتے ہیں جو اصل مخطوطات میں ظاہر ہوتے ہیں۔
 * مثال کے طور پر، زبور 49 میں عبرانی ذیلی عنوان ہے "کوئر ماسٹر کے لیے۔ کورہ کے بیٹوں کا زبور۔"
 */
interface SimpleChapterHebrewSubtitle extends Omit<SimpleChapterVerse, 'type' | 'number'> {
    /**
     * اشارہ کرتا ہے کہ مواد عبرانی سب ٹائٹل کی نمائندگی کرتا ہے۔
     */
    type: 'hebrew_subtitle';
}

/**
 * ایک آیت میں ایک حاشیہ۔
 */
interface SimpleVerseFootnote {
    /**
     * نوٹ کی شناخت۔
     */
    noteId: number;

    /**
     * آیت کے متن میں وہ اشاریہ جس پر حاشیہ کال کرنے والے کو داخل کیا جائے۔
     */
    offset: number;

    /**
     * فوٹ نوٹ کا متن۔
     */
    text: string;

    /**
     * کال کرنے والا جو فوٹ نوٹ کے لیے استعمال کیا جانا چاہیے۔
     * اگر "+"، تو کالر خود کار طریقے سے تیار کیا جانا چاہئے.
     * اگر کالعدم ہے، تو کالر خالی ہونا چاہیے۔
     * اگر ایک تار ہے، تو کالر وہ تار ہونا چاہیے۔
     */
    caller: '+' | string | null;
}

/**
 * ایک سرخی جو کسی آیت میں سرایت کر گئی ہو۔
 */
interface SimpleInlineHeading {
    /**
     * آیت کے متن میں وہ اشاریہ جس پر سرخی آتی ہے۔
     */
    offset: number;

    /**
     * عنوان کا متن۔
     */
    text: string;
}

/**
 * ایک آیت کے اندر متن کی ایک حد۔
 */
interface SimpleTextRange {
    /**
     * رینج کے پہلے کریکٹر کا اشاریہ۔
     */
    start: number;

    /**
     * رینج کے آخری حرف کے بعد کا اشاریہ۔
     */
    end: number;
}

/**
 * ایک آیت کے اندر متن کی ایک حد جو شاعری کی ایک سطر کی نمائندگی کرتی ہے۔
 */
interface SimplePoemRange extends SimpleTextRange {
    /**
     * اشارے کی سطح جس کے ساتھ شاعری کی سطر ظاہر کی جانی چاہیے۔
     */
    level: number;
}
```

### مثال

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

اشعار اور یسوع کے الفاظ کو آیت کے متن پر رینج کے طور پر رکھا گیا ہے۔ مثال کے طور پر، `engwebp` ترجمہ میں `Matthew 5:3` اس طرح لگتا ہے:

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

## ایک باب کے الفاظ کو آسان شکل میں حاصل کریں۔

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.words.simple.json`

کسی ایک باب کے لیے لفظی سطح کی تشریحات حاصل کرتا ہے، ان کے آفسیٹس کو ہر [آسان آیت](#get-a-simplified-chapter-from-a-translation) کے متن پر دوبارہ ترتیب دیا جاتا ہے۔

[باقاعدہ تشریحات](./standard.md#get-the-words-of-a-chapter) میں آفسیٹس کو آیت کی `content` صف کے آئٹمز پر لنگر انداز کیا جاتا ہے، جسے آسان فارمیٹ ایک سٹرنگ سے بدل دیتا ہے - لہذا وہ اس کے ساتھ استعمال نہیں ہو سکتے۔ اس کے بجائے اس فائل کو استعمال کریں جب آپ آسان ابواب کے ساتھ کام کر رہے ہوں۔

-   `translation` ترجمہ کی ID ہے (مثلاً `BSB` )۔
-   `book` کتاب کی ID ہے (مثال کے طور پر پیدائش کے لیے `GEN` - آپ [یہاں](https://ubsicap.github.io/usfm/identification/books.html) کتاب کی شناخت کی فہرست تلاش کر سکتے ہیں)۔
-   `chapter` عددی باب ہے (مثلاً `1` پہلے باب کے لیے)۔

ان اندراجات میں کوئی `contentIndex` نہیں ہے۔ `start` اور `end` آیت کے `text` میں آفسیٹ ہیں، بالکل اسی طرح جیسے فٹ نوٹ، نظم، اور یسوع کے الفاظ آسان ابواب میں آفسیٹ ہوتے ہیں، لہذا `text.slice(start, end)` تشریح شدہ لفظ ہے۔

جیسا کہ باقاعدہ تشریحات کے ساتھ، صرف کچھ ترجمے میں وہ ہیں۔ ایک آسان باب جس میں ان کا لنک اس فائل سے `thisChapterWordsLink` ; جب وہ پراپرٹی غائب ہوتی ہے، تو یہ فائل باب کے لیے موجود نہیں ہوتی ہے۔

### کوڈ کی مثال

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-simple-chapter-words.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// پیدائش 1 کا متن اور اس میں بیان کردہ الفاظ حاصل کریں۔
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

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/GEN/1.simple.json
curl https://bible.helloao.org/api/BSB/GEN/1.words.simple.json
```

:::

### ساخت

ڈھانچہ [باقاعدہ تشریحات سے](./standard.md#get-the-words-of-a-chapter) میل کھاتا ہے، سوائے اس کے کہ لنکس آسان فائلوں کی طرف اشارہ کریں اور اندراجات میں کوئی `contentIndex` نہیں ہے۔

```typescript:no-line-numbers title="simple-words.ts"
export interface SimpleTranslationBookChapterWords {
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
     * آسان باب کا لنک جس کے لیے یہ تشریحات ہیں۔
     */
    thisChapterLink: string;

    /**
     * اگلے آسان باب کا لنک۔
     * منسوخ اگر یہ ترجمہ کا آخری باب ہے۔
     */
    nextChapterLink: string | null;

    /**
     * پچھلے آسان باب کا لنک۔
     * منسوخ اگر یہ ترجمہ کا پہلا باب ہے۔
     */
    previousChapterLink: string | null;

    /**
     * ان تشریحات کا لنک۔
     */
    thisChapterWordsLink: string;

    /**
     * اگلے باب کے لیے تشریحات کا لنک۔
     * اگر یہ ترجمے کا آخری باب ہے، یا اگر اگلے باب میں لفظی سطح پر کوئی تشریحات نہیں ہیں۔
     */
    nextChapterWordsLink: string | null;

    /**
     * پچھلے باب کے لیے تشریحات کا لنک۔
     * اگر یہ ترجمے کا پہلا باب ہے، یا اگر پچھلے باب میں کوئی لفظی سطح کی تشریحات نہیں ہیں۔
     */
    previousChapterWordsLink: string | null;

    /**
     * باب میں ہر آیت کے لیے تشریح شدہ الفاظ، آیت نمبر کے مطابق۔
     * ہر فہرست اس ترتیب میں ہے کہ آیت میں الفاظ آتے ہیں۔
     */
    verses: {
        [verseNumber: string]: SimpleChapterWord[];
    };
}

/**
 * ایک آسان باب میں لفظ کی سطح کی تشریح۔
 */
export interface SimpleChapterWord {
    /**
     * آیت کے متن میں تشریح شدہ لفظ کے پہلے حرف کا اشاریہ۔
     */
    start: number;

    /**
     * آیت کے متن میں تشریح شدہ لفظ کے آخری حرف کے بعد کا اشاریہ۔
     */
    end: number;

    /**
     * لفظ کے لیے مضبوط نمبر۔
     */
    strongs?: string[];

    /**
     * ماخذ کی زبان میں لفظ کی لیمما (لغت کی شکل)۔
     */
    lemma?: string;

    /**
     * ماخذ کی زبان میں لفظ کی شکلیات۔
     */
    morph?: string;

    /**
     * ماخذ متن میں لفظ کا مقام۔
     */
    srcloc?: string;

    /**
     * یہ آیت میں لفظ کا کون سا واقعہ ہے؟
     */
    occurrence?: number;

    /**
     * آیت میں یہ لفظ جتنی بار آیا ہے۔
     */
    occurrences?: number;
}
```

### مثال

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

اس باب کی آیت 1 میں متن `"In the beginning was the Word, and the Word was with God, and the Word was God."` ہے، تو `text.slice(7, 16)` `"beginning"` ہے۔

## ایک مکمل ترجمہ آسان شکل میں حاصل کریں۔

`GET https://bible.helloao.org/api/{translation}/complete.simple.json`

آسان فارمیٹ کا استعمال کرتے ہوئے پورے ترجمے کا مواد حاصل کرتا ہے۔ یہ [مکمل ترجمہ ڈاؤن لوڈ](./standard.md#get-an-entire-translation) پر لاگو کردہ [آسان باب کی شکل](#get-a-simplified-chapter-from-a-translation) ہے: ایک فائل جس میں پورے ترجمہ پر مشتمل ہے، جہاں ہر آیت کا مواد ایک تار ہے۔

اس کا استعمال اس وقت کریں جب آپ فی باب درخواست کیے بغیر اور متن کو خود بنائے بغیر پورے ترجمہ کا متن چاہتے ہو۔

-   `translation` ترجمہ کی ID ہے (مثال کے طور پر `BSB` )۔

یہ فائل `complete.json` کے ساتھ تیار ہوتی ہے، اس لیے ترجمہ میں یا تو دونوں ہوتے ہیں یا نہ ہوتے ہیں۔ دونوں فائلوں میں موجود `translation` آبجیکٹ میں `completeTranslationApiLink` اور a `simpleCompleteTranslationApiLink` ہوتا ہے، لہذا آپ دونوں فارمیٹس کے درمیان منتقل ہو سکتے ہیں۔

### کوڈ کی مثال

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-translation-complete-simple.js"
const translation = 'BSB';

// پورے BSB ترجمہ کا متن حاصل کریں۔
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

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/complete.simple.json
```

:::

### ساخت

ڈھانچہ [باقاعدہ مکمل ترجمہ ڈاؤن لوڈ سے](./standard.md#get-an-entire-translation) میل کھاتا ہے، سوائے اس کے کہ ہر باب آسان فارمیٹ استعمال کرتا ہے۔

```typescript:no-line-numbers title="complete-simple.ts"
/**
 * آسان باب فارمیٹ کا استعمال کرتے ہوئے مکمل ترجمہ ڈاؤن لوڈ ڈیٹا کی وضاحت کرتا ہے۔
 * /api/:translationId/complete.simple.json اختتامی نقطہ کے نقشے
 */
export interface SimpleTranslationComplete {
    /**
     * ترجمہ میٹا ڈیٹا۔
     */
    translation: Translation;

    /**
     * کتابوں کی مکمل فہرست ان کے تمام ابواب کے ساتھ۔
     */
    books: SimpleTranslationCompleteBook[];
}

/**
 * مکمل ترجمہ ڈاؤن لوڈ میں ایک کتاب، آسان باب کی شکل کا استعمال کرتے ہوئے.
 */
export interface SimpleTranslationCompleteBook extends Omit<TranslationCompleteBook, 'chapters'> {
    /**
     * تمام مواد کے ساتھ ابواب کی مکمل فہرست۔
     */
    chapters: SimpleTranslationCompleteChapter[];
}

/**
 * مکمل ترجمہ ڈاؤن لوڈ کا ایک باب، آسان باب کی شکل کا استعمال کرتے ہوئے۔
 */
export interface SimpleTranslationCompleteChapter {
    /**
     * آیات کی تعداد جو باب میں ہے۔
     */
    numberOfVerses: number;

    /**
     * باب کے لیے مختلف آڈیو ورژن کے لنکس۔
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * باب کے لیے آڈیو اوقات (فی آیت کے آغاز کے اوقات، سیکنڈ میں)۔
     *
     * نوٹ کریں کہ مکمل ترجمے کی فائلوں میں اوقات خود ہوتے ہیں (معیاری فارمیٹ دستاویزات میں TranslationBookChapterAudioTimingsMap دیکھیں)، انفرادی باب کے اختتامی نکات کے برعکس، جس میں ان کے لنکس ہوتے ہیں۔
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsMap;

    /**
     * باب کے لیے لفظی سطح کی تشریحات کا لنک، آسان فارمیٹ کا استعمال کرتے ہوئے۔ اگر باب میں لفظی سطح کی کوئی تشریحات نہیں ہیں تو چھوڑ دیا جائے گا۔
     */
    thisChapterWordsLink?: string;

    /**
     * باب کے لیے آسان معلومات۔
     */
    chapter: SimpleChapterData;
}
```

### مثال

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
