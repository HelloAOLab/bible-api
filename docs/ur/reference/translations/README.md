# ترجمہ، کتابیں، اور ابواب

ترجمے کو براؤز کرنے، ان کی کتابوں کی فہرست بنانے، اور باب کے مواد کی بازیافت کے لیے اختتامی نکات۔

باب کا مواد، مکمل ترجمہ ڈاؤن لوڈ، اور لفظی سطح کی تشریحات ہر دو فارمیٹس میں دستیاب ہیں:

-   [**معیاری شکل**](./standard.md) - اصل، ساختی شکل۔ آیت کا مواد ان ٹکڑوں کی فہرست ہے (سادہ متن، فارمیٹ شدہ متن، فوٹ نوٹ حوالہ جات وغیرہ) جسے آپ خود جمع کرتے ہیں۔
-   [**آسان فارمیٹ**](./simplified.md) - ایک چپٹی شکل جہاں ہر آیت کا مواد ایک سٹرنگ ہے، فوٹ نوٹ، شاعری، اور دیگر مارک اپ کے ساتھ اس سٹرنگ میں آفسیٹ کے طور پر ظاہر کیا گیا ہے۔

جو بھی فارمیٹ بہترین فٹ بیٹھتا ہے اسے استعمال کریں جس طرح آپ متن کو پیش کرنے یا اس پر کارروائی کرنے کا ارادہ رکھتے ہیں۔

## دستیاب تراجم

`GET https://bible.helloao.org/api/available_translations.json`

API میں دستیاب تراجم کی فہرست حاصل کرتا ہے۔

### کوڈ کی مثال

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-translations.js"
fetch(`https://bible.helloao.org/api/available_translations.json`)
    .then(request => request.json())
    .then(availableTranslations => {
        console.log('The API has the following translations:', availableTranslations);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/available_translations.json
```

:::

### ساخت

```typescript:no-line-numbers title="available-translations.ts"
export interface AvailableTranslations {
    /**
     * تراجم کی فہرست۔
     */
    translations: Translation[];
}

interface Translation {
    /**
     * ترجمہ کی ID۔
     */
    id: string;

    /**
     * ترجمہ کا نام۔
     * یہ عام طور پر ترجمہ کی زبان میں ترجمہ کا نام ہے۔
     */
    name: string;

    /**
     * ترجمہ کا انگریزی نام۔
     */
    englishName: string;

    /**
     * ترجمہ کے لیے ویب سائٹ۔
     */
    website: string;

    /**
     * یو آر ایل جو ترجمہ کا لائسنس مل سکتا ہے۔
     */
    licenseUrl: string;

    /**
     * ترجمہ کا مختصر نام۔
     */
    shortName: string;

    /**
     * ISO 639 3 حرفی زبان کا ٹیگ جس میں ترجمہ بنیادی طور پر ہوتا ہے۔
     */
    language: string;

    /**
     * اس زبان کا نام حاصل کرتا ہے جس میں ترجمہ ہے۔
     * اگر زبان کا نام معلوم نہ ہو تو کالعدم یا غیر متعینہ۔
     */
    languageName?: string;

    /**
     * انگریزی میں زبان کا نام حاصل کرتا ہے۔
     * اگر زبان کا انگریزی نام نہ ہو تو کالعدم یا غیر متعینہ۔
     */
    languageEnglishName?: string;

    /**
     * زبان جس سمت میں لکھی جاتی ہے۔
     * "ltr" اشارہ کرتا ہے کہ متن صفحہ کے بائیں جانب سے دائیں طرف لکھا گیا ہے۔
     * "rtl" اشارہ کرتا ہے کہ متن صفحہ کے دائیں جانب سے بائیں طرف لکھا گیا ہے۔
     */
    textDirection: 'ltr' | 'rtl';

    /**
     * فارمیٹس کی دستیاب فہرست۔
     */
    availableFormats: ('json' | 'usfm')[];

    /**
     * اس ترجمے کے لیے دستیاب کتابوں کی فہرست کا API لنک۔
     */
    listOfBooksApiLink: string;

    /**
     * اس ترجمے میں جتنی کتابیں موجود ہیں۔
     *
     * مکمل تراجم میں کتابوں کی اتنی ہی تعداد ہونی چاہیے جتنی بائبل (66)۔
     */
    numberOfBooks: number;

    /**
     * اس ترجمے میں موجود ابواب کی کل تعداد۔
     *
     * مکمل تراجم میں ابواب کی اتنی ہی تعداد ہونی چاہیے جتنی بائبل (1,189)۔
     */
    totalNumberOfChapters: number;

    /**
     * اس ترجمے میں موجود آیات کی کل تعداد۔
     *
     * مکمل تراجم میں آیات کی اتنی ہی تعداد ہونی چاہیے جتنی بائبل کی ہے (تقریباً 31,102 - کچھ ترجمے اصل ماخذ کے متن میں موجود ہونے کے واضح امکان کی بنیاد پر آیات کو خارج کر دیتے ہیں)۔
     */
    totalNumberOfVerses: number;

    /**
     * اس ترجمے میں موجود apocryphal کتابوں کی کل تعداد۔
     * اگر ترجمے میں apocrypha شامل نہ ہو تو چھوڑ دیا جاتا ہے۔
     */
    numberOfApocryphalBooks?: number;

    /**
     * apocryphal ابواب کی کل تعداد جو اس ترجمے میں موجود ہیں۔
     * اگر ترجمے میں apocrypha شامل نہ ہو تو چھوڑ دیا جاتا ہے۔
     */
    totalNumberOfApocryphalChapters?: number;

    /**
     * apocryphal آیات کی کل تعداد جو اس ترجمہ میں موجود ہیں۔
     * اگر ترجمے میں apocrypha شامل نہ ہو تو چھوڑ دیا جاتا ہے۔
     */
    totalNumberOfApocryphalVerses?: number;
}
```

### مثال

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

## ترجمہ میں کتابوں کی فہرست بنائیں

`GET https://bible.helloao.org/api/{translation}/books.json`

دیے گئے ترجمے کے لیے دستیاب کتابوں کی فہرست حاصل کرتا ہے۔

-   `translation` ترجمہ کی ID ہے (مثال کے طور پر `BSB` )۔

### کوڈ کی مثال

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-books.js"
const translation = 'BSB';

// بی ایس بی ترجمہ کے لیے کتابوں کی فہرست حاصل کریں۔
fetch(`https://bible.helloao.org/api/${translation}/books.json`)
    .then(request => request.json())
    .then(books => {
        console.log('The BSB has the following books:', books);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/books.json
```

:::

### ساخت

```typescript:no-line-numbers title="books.ts"
export interface TranslationBooks {
    /**
     * کتابوں کے ترجمہ کی معلومات۔
     */
    translation: Translation;

    /**
     * ان کتابوں کی فہرست جو ترجمہ کے لیے دستیاب ہیں۔
     */
    books: TranslationBook[];
}

interface TranslationBook {
    /**
     * کتاب کی شناخت۔
     */
    id: string;

    /**
     * وہ نام جو ترجمہ نے کتاب کے لیے فراہم کیا ہے۔
     */
    name: string;

    /**
     * کتاب کا عام نام۔
     */
    commonName: string;

    /**
     * کتاب کا عنوان۔
     * یہ عام طور پر کتاب کے نام کا زیادہ وضاحتی ورژن ہوتا ہے۔
     * اگر دستیاب نہیں ہے، تو ترجمہ کے ذریعہ فراہم نہیں کیا گیا تھا۔
     */
    title: string | null;

    /**
     * ترجمہ میں کتاب کی عددی ترتیب۔
     */
    order: number;

    /**
     * کتاب میں ابواب کی تعداد۔
     */
    numberOfChapters: number;

    /**
     * کتاب کے پہلے باب کا نمبر۔
     */
    firstChapterNumber: number;

    /**
     * کتاب کے پہلے باب کا لنک۔
     */
    firstChapterApiLink: string;

    /**
     * کتاب کے آخری باب کا نمبر۔
     */
    lastChapterNumber: number;

    /**
     * کتاب کے آخری باب کا لنک۔
     */
    lastChapterApiLink: string;

    /**
     * کتاب میں آیات کی تعداد۔
     */
    totalNumberOfVerses: number;

    /**
     * خواہ کتاب ایک عبقری کتاب ہو۔
     * اگر ترجمہ کینونیکل ہے تو چھوڑ دیا جائے گا۔
     */
    isApocryphal?: boolean;
}
```

### مثال

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
