# ترجمات وكتب وفصول

نقاط نهاية لتصفح الترجمات، وعرض الكتب، وجلب محتوى الفصول.

يتوفر محتوى الفصول، وتنزيلات الترجمة الكاملة، والتعليقات على مستوى الكلمات، كل منها بصيغتين:

-   [**التنسيق القياسي**](./standard.md) - التنسيق الأصلي والمنظم. محتوى الآية عبارة عن قائمة من الأجزاء (نص عادي، نص منسق، مراجع الحواشي السفلية، إلخ) التي تقوم بتجميعها بنفسك.
-   [**تنسيق مبسط**](./simplified.md) - تنسيق مسطح حيث يكون محتوى كل بيت عبارة عن سلسلة واحدة، مع الحواشي السفلية والشعر والعلامات الأخرى المعبر عنها كإزاحات في تلك السلسلة.

استخدم أي تنسيق يناسب بشكل أفضل الطريقة التي تخطط بها لعرض النص أو معالجته.

## الترجمات المتاحة

`GET https://bible.helloao.org/api/available_translations.json`

يحصل على قائمة الترجمات المتاحة في واجهة برمجة التطبيقات (API).

### مثال برمجي

::: code-tabsلغة عامية

@tab جافا سكريبت

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

### بناء

```typescript:no-line-numbers title="available-translations.ts"
export interface AvailableTranslations {
    /**
     * قائمة الترجمات.
     */
    translations: Translation[];
}

interface Translation {
    /**
     * معرّف الترجمة.
     */
    id: string;

    /**
     * اسم الترجمة.
     * هذا عادةً ما يكون اسم الترجمة في لغة الترجمة.
     */
    name: string;

    /**
     * الاسم الإنجليزي للترجمة.
     */
    englishName: string;

    /**
     * موقع الترجمة.
     */
    website: string;

    /**
     * الرابط الذي يمكن من خلاله العثور على ترخيص الترجمة.
     */
    licenseUrl: string;

    /**
     * ملاحظات إضافية متعلقة بالترخيص من خلال واجهة برمجة التطبيقات (API).
     * تكون القيمة فارغة أو غير محددة إذا لم تكن هناك ملاحظات.
     */
    licenseNotes?: string | null;

    /**
     * الإشعار الذي يجب عرضه عند عرض المحتوى المترجم.
     * قيمة فارغة أو غير محددة إذا لم تتضمن الترجمة إشعارًا.
     */
    licenseNotice?: string | null;

    /**
     * شروط الترخيص المنظمة التي تم اكتشافها للترجمة.
     * تكون القيمة فارغة أو غير محددة إذا تعذر تحديد المصطلحات.
     * في هذه الحالة، تحقق من الصفحة الموجودة على licenseUrl للاطلاع على الشروط.
     */
    license?: License | null;

    /**
     * الاسم المختصر للترجمة.
     */
    shortName: string;

    /**
     * رمز اللغة المكون من 3 أحرف وفقًا لمعيار ISO 639 والذي تتم الترجمة به بشكل أساسي.
     */
    language: string;

    /**
     * يحصل على اسم اللغة التي تمت بها الترجمة.
     * قيمة فارغة أو غير محددة إذا كان اسم اللغة غير معروف.
     */
    languageName?: string;

    /**
     * يحصل على اسم اللغة باللغة الإنجليزية.
     * قيمة فارغة أو غير محددة إذا لم يكن للغة اسم إنجليزي.
     */
    languageEnglishName?: string;

    /**
     * الاتجاه الذي تُكتب به اللغة.
     * يشير الرمز "ltr" إلى أن النص مكتوب من الجانب الأيسر للصفحة إلى الجانب الأيمن.
     * يشير الرمز "rtl" إلى أن النص مكتوب من الجانب الأيمن للصفحة إلى الجانب الأيسر.
     */
    textDirection: 'ltr' | 'rtl';

    /**
     * قائمة التنسيقات المتاحة.
     */
    availableFormats: ('json' | 'usfm')[];

    /**
     * رابط واجهة برمجة التطبيقات (API) لقائمة الكتب المتاحة لهذه الترجمة.
     */
    listOfBooksApiLink: string;

    /**
     * عدد الكتب التي تتضمنها هذه الترجمة.
     *
     * ينبغي أن تحتوي الترجمات الكاملة على نفس عدد الكتب الموجودة في الكتاب المقدس (66).
     */
    numberOfBooks: number;

    /**
     * إجمالي عدد الفصول التي تتضمنها هذه الترجمة.
     *
     * ينبغي أن تحتوي الترجمات الكاملة على نفس عدد الفصول الموجودة في الكتاب المقدس (1189).
     */
    totalNumberOfChapters: number;

    /**
     * إجمالي عدد الآيات الواردة في هذه الترجمة.
     *
     * ينبغي أن تحتوي الترجمات الكاملة على نفس عدد الآيات الموجودة في الكتاب المقدس (حوالي 31102 - بعض الترجمات تستبعد الآيات بناءً على الاحتمالية الظاهرة لوجودها في النصوص المصدرية الأصلية).
     */
    totalNumberOfVerses: number;

    /**
     * العدد الإجمالي للكتب المنحولة التي تحتويها هذه الترجمة.
     * يتم حذف النص إذا لم تتضمن الترجمة الأبوكريفا.
     */
    numberOfApocryphalBooks?: number;

    /**
     * إجمالي عدد الفصول المنحولة التي تحتويها هذه الترجمة.
     * يتم حذف النص إذا لم تتضمن الترجمة الأبوكريفا.
     */
    totalNumberOfApocryphalChapters?: number;

    /**
     * العدد الإجمالي للآيات المنحولة التي تحتويها هذه الترجمة.
     * يتم حذف النص إذا لم تتضمن الترجمة الأبوكريفا.
     */
    totalNumberOfApocryphalVerses?: number;
}

/**
 * يحدد شروط الترخيص المنظمة التي تم اكتشافها للترجمة.
 */
interface License {
    /**
     * هل يلزم ذكر المصدر الأصلي عند استخدام الترجمة؟
     */
    attribution: 'required' | 'not-required';

    /**
     * ما إذا كان الاستخدام التجاري للترجمة مسموحًا به.
     */
    commercialUse: 'allowed' | 'not-allowed';

    /**
     * هل يُسمح بإنشاء وتوزيع أعمال مشتقة من الترجمة؟
     */
    derivatives: 'allowed' | 'not-allowed';

    /**
     * ما إذا كان يجب توزيع الأعمال المشتقة بموجب نفس الترخيص (أي شرط "المشاركة بالمثل").
     */
    copyleft: boolean;

    /**
     * ما إذا كانت الترجمة قد أُتيحت للملكية العامة.
     */
    publicDomain: boolean;
}
```

### التراخيص

يتم نشر كل ترجمة بموجب ترخيصها الخاص، لذا تحقق من شروط الترجمة قبل استخدامها.

-   `licenseUrl` يشير دائمًا إلى شروط الترخيص الكاملة.
-   `licenseNotice` ، عند وجوده، هو إشعار حقوق النشر أو الإسناد الذي يتم عرضه بجانب محتوى الترجمة.
-   يحتوي `licenseNotes` على ملاحظات تمت إضافتها بواسطة واجهة برمجة التطبيقات، مثل التغييرات التي تم إجراؤها على النص الأصلي.
-   يُلخص `license` ، عند وجوده، المصطلحات بصيغة يمكن لبرنامجك التحقق منها. على سبيل المثال، يمكنك تصفية القائمة لعرض الترجمات التي تسمح بالاستخدام التجاري.

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

يتم تعيين `license` فقط عندما يكون من الممكن اكتشاف المصطلحات تلقائيًا. قد تسمح لك الترجمات التي لا تحتوي على هذه القيمة بالاستخدام، لذا اقرأ الصفحة رقم `licenseUrl` للاطلاع على التفاصيل.

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

## قائمة الكتب المترجمة

`GET https://bible.helloao.org/api/{translation}/books.json`

يحصل على قائمة الكتب المتاحة للترجمة المطلوبة.

-   `translation` هو معرف الترجمة (على سبيل المثال `BSB` ).

### مثال برمجي

::: code-tabsلغة عامية

@tab جافا سكريبت

```ts:no-line-numbers title="fetch-books.js"
const translation = 'BSB';

// احصل على قائمة الكتب لترجمة BSB
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

### بناء

```typescript:no-line-numbers title="books.ts"
export interface TranslationBooks {
    /**
     * معلومات الترجمة الخاصة بالكتب.
     */
    translation: Translation;

    /**
     * قائمة الكتب المتاحة للترجمة.
     */
    books: TranslationBook[];
}

interface TranslationBook {
    /**
     * رقم تعريف الكتاب.
     */
    id: string;

    /**
     * الاسم الذي قدمته الترجمة للكتاب.
     */
    name: string;

    /**
     * الاسم الشائع للكتاب.
     */
    commonName: string;

    /**
     * الاسم المختصر (الاختصار) الذي قدمته الترجمة للكتاب.
     * إذا لم يكن متوفراً، فهذا يعني أن الترجمة لم تقدمه.
     */
    shortName?: string;

    /**
     * عنوان الكتاب.
     * عادةً ما تكون هذه نسخة أكثر وصفية لاسم الكتاب.
     * إذا لم يكن متوفراً، فهذا يعني أن الترجمة لم تقدمه.
     */
    title: string | null;

    /**
     * الترتيب العددي للكتاب في الترجمة.
     */
    order: number;

    /**
     * عدد الفصول التي يحتويها الكتاب.
     */
    numberOfChapters: number;

    /**
     * رقم الفصل الأول في الكتاب.
     */
    firstChapterNumber: number;

    /**
     * رابط الفصل الأول من الكتاب.
     */
    firstChapterApiLink: string;

    /**
     * رقم الفصل الأخير في الكتاب.
     */
    lastChapterNumber: number;

    /**
     * رابط الفصل الأخير من الكتاب.
     */
    lastChapterApiLink: string;

    /**
     * عدد الآيات التي يحتويها الكتاب.
     */
    totalNumberOfVerses: number;

    /**
     * ما إذا كان الكتاب كتاباً منحولاً.
     * يتم حذفها إذا كانت الترجمة رسمية.
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
