# مجموعات البيانات

نقاط نهاية لتصفح مجموعات بيانات الكتاب المقدس التكميلية - مثل المراجع المتقاطعة، والكيانات الكتابية (الأشخاص، والأماكن، والأحداث، والجماعات البشرية)، والكلمات الأصلية المكتوبة بين السطور، والمعاجم، ومرشحي آية اليوم - وجلب كتبهم، ومحتوى الفصول، والكيانات، وإدخالات المعجم، وفئات الآيات.

## مجموعات البيانات المتاحة

`GET https://bible.helloao.org/api/available_datasets.json`

يحصل على قائمة مجموعات بيانات الكتاب المقدس المتاحة في واجهة برمجة التطبيقات (API).

### مثال برمجي

::: code-tabsلغة عامية

@tab جافا سكريبت

```ts:no-line-numbers title="fetch-datasets.js"
fetch(`https://bible.helloao.org/api/available_datasets.json`)
    .then(request => request.json())
    .then(availableDatasets => {
        console.log('The API has the following datasets:', availableDatasets);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/available_datasets.json
```

:::

### بناء

```typescript:no-line-numbers title="available-datasets.ts"
export interface AvailableDatasets {
    /**
     * قائمة مجموعات البيانات.
     */
    datasets: Dataset[];
}

export interface Dataset {
    /**
     * معرف مجموعة البيانات.
     */
    id: string;

    /**
     * اسم مجموعة البيانات.
     */
    name: string;

    /**
     * موقع الويب الخاص بمجموعة البيانات.
     */
    website: string;

    /**
     * عنوان URL الذي يمكن من خلاله العثور على ترخيص مجموعة البيانات.
     */
    licenseUrl: string;

    /**
     * ملاحظات إضافية متعلقة بالترخيص من خلال واجهة برمجة التطبيقات (API).
     * تكون القيمة فارغة أو غير محددة إذا لم تكن هناك ملاحظات.
     */
    licenseNotes?: string | null;

    /**
     * الاسم الإنجليزي لمجموعة البيانات.
     */
    englishName: string;

    /**
     * رمز اللغة المكون من 3 أحرف وفقًا لمعيار ISO 639 والذي توجد به مجموعة البيانات بشكل أساسي.
     */
    language: string;

    /**
     * الاتجاه الذي تُكتب به اللغة.
     * يشير الرمز "ltr" إلى أن النص مكتوب من الجانب الأيسر للصفحة إلى الجانب الأيمن.
     * يشير الرمز "rtl" إلى أن النص مكتوب من الجانب الأيمن للصفحة إلى الجانب الأيسر.
     */
    textDirection: 'ltr' | 'rtl';

    /**
     * رابط واجهة برمجة التطبيقات (API) لقائمة الكتب المتاحة لهذه المجموعة من البيانات.
     */
    listOfBooksApiLink: string;

    /**
     * قائمة التنسيقات المتاحة.
     */
    availableFormats: ('json' | 'usfm')[];

    /**
     * عدد الكتب الموجودة في هذه المجموعة من البيانات.
     */
    numberOfBooks: number;

    /**
     * إجمالي عدد الفصول الموجودة في مجموعة البيانات هذه.
     */
    totalNumberOfChapters: number;

    /**
     * إجمالي عدد الآيات الموجودة في هذه المجموعة من البيانات.
     */
    totalNumberOfVerses: number;

    /**
     * إجمالي عدد المراجع المتقاطعة الموجودة في مجموعة البيانات هذه.
     * 0 لمجموعات البيانات التي لا تحتوي على مراجع متبادلة.
     */
    totalNumberOfReferences: number;

    /**
     * إجمالي عدد الكلمات المتداخلة الموجودة في مجموعة البيانات هذه.
     * يتم حذفها إذا لم تحتوي مجموعة البيانات على كلمات بين السطور.
     */
    totalNumberOfWords?: number;

    /**
     * يحصل على اسم اللغة التي توجد بها مجموعة البيانات.
     * قيمة فارغة أو غير محددة إذا كان اسم اللغة غير معروف.
     */
    languageName?: string;

    /**
     * يحصل على اسم اللغة باللغة الإنجليزية.
     * قيمة فارغة أو غير محددة إذا لم يكن للغة اسم إنجليزي.
     */
    languageEnglishName?: string;

    /**
     * روابط واجهة برمجة التطبيقات (API) لقوائم الكيانات في مجموعة البيانات.
     * يتم حذفها إذا لم تحتوي مجموعة البيانات على الكيانات المقابلة.
     */
    listOfPeopleApiLink?: string;
    listOfPlacesApiLink?: string;
    listOfEventsApiLink?: string;
    listOfPeopleGroupsApiLink?: string;

    /**
     * إجمالي عدد الكيانات الموجودة في مجموعة البيانات.
     * يتم حذفها إذا لم تحتوي مجموعة البيانات على الكيانات المقابلة.
     */
    totalNumberOfPeople?: number;
    totalNumberOfPlaces?: number;
    totalNumberOfEvents?: number;
    totalNumberOfPeopleGroups?: number;

    /**
     * رابط واجهة برمجة التطبيقات (API) لقائمة مدخلات المعجم في مجموعة البيانات.
     * يتم حذفها إذا لم تحتوي مجموعة البيانات على مدخلات معجمية.
     */
    listOfLexiconApiLink?: string;

    /**
     * إجمالي عدد مداخل المعجم الموجودة في مجموعة البيانات.
     * يتم حذفها إذا لم تحتوي مجموعة البيانات على مدخلات معجمية.
     */
    totalNumberOfLexicon?: number;

    /**
     * رابط واجهة برمجة التطبيقات (API) لقائمة كل آية في مجموعة البيانات، مع فئاتها.
     * يتم حذفها إذا لم تكن لآيات مجموعة البيانات فئات.
     */
    listOfVersesApiLink?: string;

    /**
     * رابط واجهة برمجة التطبيقات (API) لقائمة فئات الآيات في مجموعة البيانات.
     * يتم حذفها إذا لم تحتوي مجموعة البيانات على فئات الآيات.
     */
    listOfCategoriesApiLink?: string;

    /**
     * إجمالي عدد فئات الآيات الموجودة في مجموعة البيانات.
     * يتم حذفها إذا لم تحتوي مجموعة البيانات على فئات الآيات.
     */
    totalNumberOfCategories?: number;
}
```

### مثال

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

## قائمة الكتب في مجموعة البيانات

`GET https://bible.helloao.org/api/d/{dataset}/books.json`

يحصل على قائمة الكتب المتاحة لمجموعة البيانات المحددة.

-   `dataset` معرف مجموعة البيانات (على سبيل المثال `open-cross-ref` ).

### مثال برمجي

::: code-tabsلغة عامية

@tab جافا سكريبت

```ts:no-line-numbers title="fetch-dataset-books.js"
const dataset = 'open-cross-ref';

// احصل على قائمة الكتب لمجموعة بيانات المراجع المفتوحة
fetch(`https://bible.helloao.org/api/d/${dataset}/books.json`)
    .then(request => request.json())
    .then(books => {
        console.log('The open-cross-ref dataset has the following books:', books);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/open-cross-ref/books.json
```

:::

### بناء

```typescript:no-line-numbers title="dataset-books.ts"
export interface DatasetBooks {
    /**
     * معلومات مجموعة البيانات الخاصة بالكتب.
     */
    dataset: Dataset;

    /**
     * قائمة الكتب المتاحة لمجموعة البيانات.
     */
    books: DatasetBook[];
}

interface DatasetBook {
    /**
     * رقم تعريف الكتاب.
     * يطابق معرف الكتاب المقابل في الكتاب المقدس (سفر التكوين، سفر الخروج، إلخ).
     */
    id: string;

    /**
     * ترتيب الكتاب في الكتاب المقدس.
     */
    order: number;

    /**
     * رقم الفصل الأول في الكتاب.
     */
    firstChapterNumber: number;

    /**
     * رابط الفصل الأول من الكتاب.
     */
    firstChapterApiLink: string | null;

    /**
     * رقم الفصل الأخير في الكتاب.
     */
    lastChapterNumber: number | null;

    /**
     * رابط الفصل الأخير من الكتاب.
     */
    lastChapterApiLink: string | null;

    /**
     * عدد الفصول التي يحتويها الكتاب.
     */
    numberOfChapters: number;

    /**
     * عدد الآيات التي يحتويها الكتاب.
     */
    totalNumberOfVerses: number;

    /**
     * إجمالي عدد الإحالات المرجعية التي يحتويها هذا الكتاب.
     */
    totalNumberOfReferences: number;
}
```

### مثال

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

## استخراج فصل من مجموعة بيانات

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

يحصل على محتوى فصل واحد من كتاب ومجموعة بيانات معينة.

بالنسبة لمجموعات البيانات المرجعية (مثل `open-cross-ref` )، يحتوي الفصل على قائمة المراجع لكل آية. أما بالنسبة لمجموعات البيانات المترجمة بين السطور (مثل `bsb-interlinear` )، فيحتوي الفصل على كلمات اللغة الأصلية لكل آية - انظر [مجموعات البيانات المترجمة بين السطور](#interlinear-datasets) . وبالنسبة لمجموعات بيانات الكيانات (مثل `theographic` )، يحتوي الفصل على الأشخاص والأماكن والأحداث التي تظهر في الفصل - انظر [الحصول على الكيانات في الفصل](#get-the-entities-in-a-chapter) . أما بالنسبة لمجموعة البيانات `verse-of-the-day` ، فيحتوي الفصل على الآيات المرشحة لآية اليوم في الفصل وفئاتها - انظر [آية اليوم](#verse-of-the-day) .

-   `dataset` معرف مجموعة البيانات (على سبيل المثال `open-cross-ref` ).
-   `book` هو معرف الكتاب (على سبيل المثال `GEN` لسفر التكوين).
-   `chapter` هو رقم الفصل (على سبيل المثال `1` للفصل الأول).

### مثال برمجي

::: code-tabsلغة عامية

@tab جافا سكريبت

```ts:no-line-numbers title="fetch-dataset-chapter.js"
const dataset = 'open-cross-ref';
const book = 'GEN';
const chapter = 1;

// احصل على سفر التكوين 1 من مجموعة بيانات المراجع المفتوحة المتقاطعة
fetch(`https://bible.helloao.org/api/d/${dataset}/${book}/${chapter}.json`)
    .then(request => request.json())
    .then(chapter => {
        console.log('Genesis 1 (open-cross-ref):', chapter);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/open-cross-ref/GEN/1.json
```

:::

### بناء

```typescript:no-line-numbers title="dataset-chapter.ts"
export interface DatasetBookChapter {
    /**
     * معلومات مجموعة البيانات الخاصة بفصل الكتاب.
     */
    dataset: Dataset;

    /**
     * معلومات الكتاب الخاصة بفصل الكتاب.
     */
    book: DatasetBook;

    /**
     * رابط هذا الفصل.
     */
    thisChapterLink: string;

    /**
     * رابط الفصل التالي.
     * قيمة فارغة إذا كان هذا هو الفصل الأخير في مجموعة البيانات.
     */
    nextChapterApiLink: string | null;

    /**
     * رابط الفصل السابق.
     * قيمة فارغة إذا كان هذا هو الفصل الأول في مجموعة البيانات.
     */
    previousChapterApiLink: string | null;

    /**
     * عدد الآيات التي يحتويها الفصل.
     */
    numberOfVerses: number;

    /**
     * المعلومات الخاصة بهذا الفصل.
     */
    chapter: DatasetChapterData;
}

interface DatasetChapterData {
    /**
     * رقم الفصل.
     */
    number: number;

    /**
     * محتوى الفصل.
     */
    content: DatasetVerse[];
}

/**
 * تحمل الآية `references` (مجموعات بيانات المراجع المتقاطعة)، أو `words` (مجموعات البيانات بين السطور)، أو `categories` (مجموعة بيانات آية اليوم).
 * حدد العنصر الموجود باستخدام `'words' in verse` أو `'categories' in verse` .
 */
type DatasetVerse =
    | DatasetReferencesVerse
    | DatasetWordsVerse
    | DatasetCategoriesVerse;

interface DatasetReferencesVerse {
    /**
     * رقم الآية.
     */
    verse: number;

    /**
     * المراجع المتقاطعة للآية.
     *
     * مرتبة حسب النتيجة، تنازلياً.
     */
    references: DatasetReference[];
}

interface DatasetWordsVerse {
    /**
     * رقم الآية.
     */
    verse: number;

    /**
     * كلمات الآية باللغة الأصلية، مرتبة حسب ترتيب النص الأصلي.
     * انظر "مجموعات البيانات الخطية" أدناه.
     */
    words: InterlinearWord[];
}

interface DatasetCategoriesVerse {
    /**
     * رقم الآية.
     * إذا كان `endVerse` موجودًا، فهذه هي الآية التي يبدأ منها المقطع.
     */
    verse: number;

    /**
     * الآية التي ينتهي عندها المقطع.
     * يتم حذفها إذا كان المدخل عبارة عن بيت شعري واحد.
     */
    endVerse?: number;

    /**
     * معرفات الفئات التي ينتمي إليها النص، مع ترتيب الفئات الأكثر صلة أولاً.
     * انظر "آية اليوم" أدناه.
     */
    categories: string[];

    /**
     * السنة الأولى التي يمكن فيها أن تكون الآية هي آية اليوم.
     * يتم حذف الآية إذا كانت موجودة دائمًا في القائمة.
     */
    addedIn?: number;

    /**
     * السنة الأولى التي لم يعد فيها من الممكن أن تكون الآية هي آية اليوم.
     * تبقى الآيات المحذوفة في مجموعة البيانات حتى يمكن اختيار آيات السنوات السابقة.
     * يتم حذف الآية إذا لم تتم إزالتها من القائمة.
     */
    removedIn?: number;
}

interface DatasetReference {
    /**
     * رقم تعريف الكتاب الذي تتم الإشارة إليه.
     */
    book: string;

    /**
     * رقم الفصل.
     */
    chapter: number;

    /**
     * رقم الآية.
     * إذا كان `endVerse` موجودًا، فهذه هي الآية التي يبدأ منها المرجع.
     */
    verse: number;

    /**
     * الآية التي ينتهي عندها المرجع.
     */
    endVerse?: number;

    /**
     * درجة الصلة بالمرجع.
     */
    score?: number;
}

// انظر "مجموعات البيانات بين السطور" أدناه لمعرفة بنية InterlinearWord.
```

### مثال

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

## الكيانات

تحتوي بعض مجموعات البيانات - مثل مجموعة بيانات [Theographic Bible Metadata](https://github.com/robertrouse/theographic-bible-metadata) ( `theographic` ) - على كيانات: أشخاص، أماكن، أحداث، وجماعات بشرية، إلى جانب العلاقات بينها وبين آيات الكتاب المقدس التي تذكرها.

تحتوي مجموعة بيانات [History Globe](https://historyglobe.app) ( `history-globe` ) على أماكن فقط: الأماكن المذكورة في الكتاب المقدس، مع إحداثياتها والآيات التي تذكرها. معرّفات هذه الأماكن (مثل `a15257a` للقدس) هي معرّفات ثابتة خاصة بـ History Globe، وهي نفسها التي تستخدمها [واجهة برمجة التطبيقات](https://historyglobe.app/docs/api.html) الخاصة بها، لذا فهي لا تتغير عند تصحيح أي اسم. أما القيم `featureType` فهي تتبع القيم المستخدمة في مجموعة بيانات Theographic ( `City` ، `Region` ، `Water` ، وهكذا)، بينما تحمل `featureSubType` النوع الأكثر تحديدًا إن وُجد (مثل `River` ، `Gate` ، `Spring` ).

تتضمن مجموعات البيانات التي تحتوي على كيانات الخصائص `listOfPeopleApiLink` و `listOfPlacesApiLink` و `listOfEventsApiLink` و `listOfPeopleGroupsApiLink` في مدخلها في `/api/available_datasets.json` .

توفر مجموعات بيانات الكيانات أيضًا بيانات مُرتبطة بالفصول: `/api/d/{dataset}/books.json` تُدرج الكتب التي تحتوي فصولها على بيانات كيانات، `/api/d/{dataset}/{book}/{chapter}.json` تُعيد الأشخاص والأماكن والأحداث التي تظهر في ذلك الفصل، بالإضافة إلى أرقام الآيات التي ذُكر فيها كل منها. انظر: [الحصول على الكيانات في فصل](#get-the-entities-in-a-chapter) .

تستخدم الكيانات نفس معرّفات الكتب وأرقام الفصول والآيات المستخدمة في باقي واجهة برمجة التطبيقات للإشارة إلى مقاطع الكتاب المقدس، مما يسمح بدمجها مع أي ترجمة. كما تشير هذه الكيانات إلى بعضها البعض باستخدام مراجع الكيانات.

```typescript:no-line-numbers title="entity-shared.ts"
export interface DatasetEntityRef {
    /**
     * معرّف الكيان الذي تتم الإشارة إليه.
     */
    id: string;

    /**
     * نوع الكيان الذي تتم الإشارة إليه.
     * يتطابق مع جزء المجموعة من رابط واجهة برمجة التطبيقات للكيان، لذلك يمكن إنشاء الرابط على أنه `/api/d/{dataset}/{type}/{id}.json` .
     */
    type: 'people' | 'places' | 'events' | 'groups';

    /**
     * اسم الكيان الذي تتم الإشارة إليه.
     */
    name?: string;

    /**
     * رابط واجهة برمجة التطبيقات (API) للكيان الذي تتم الإشارة إليه.
     */
    apiLink?: string;
}

export interface VerseRef {
    /**
     * معرف الكتاب (GEN، EXO، إلخ).
     */
    book: string;

    /**
     * رقم الفصل الذي يبدأ منه المرجع.
     */
    chapter: number;

    /**
     * رقم الآية التي يبدأ منها المرجع.
     */
    verse: number;

    /**
     * الآية التي ينتهي عندها المرجع.
     * يتم دمج الآيات المتتالية في نفس الفصل في مرجع واحد.
     */
    endVerse?: number;
}
```

### تاريخ جلوب - إسناد

بيانات History Globe مرخصة بموجب [رخصة CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) . في حال استخدامها، يُرجى ذكر History Globe ( https://historyglobe.app ) وبيانات OpenBible.info لتحديد المواقع الجغرافية للكتاب المقدس التي تستند إليها، مع الإشارة إلى أي تغييرات. يُشار إلى هذه البيانات في الخاصية `licenseNotes` من مجموعة البيانات.

## الحصول على الكيانات في فصل واحد

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

بالنسبة لمجموعات بيانات الكيانات، يتم الحصول على الأشخاص والأماكن والأحداث التي تظهر في فصل واحد، بالإضافة إلى أرقام الآيات في الفصل الذي تم ذكر كل منها فيه.

-   `dataset` معرف مجموعة البيانات (على سبيل المثال `theographic` ).
-   `book` هو معرف الكتاب (على سبيل المثال `GEN` لسفر التكوين).
-   `chapter` هو رقم الفصل (على سبيل المثال `1` للفصل الأول).

تتوفر قائمة الكتب والفصول التي تحتوي على بيانات الكيانات من خلال `GET https://bible.helloao.org/api/d/{dataset}/books.json` ، والتي تتبع نفس بنية [نقطة نهاية مجموعة بيانات الكتب](#list-books-in-a-dataset) . بالنسبة لمجموعات بيانات الكيانات، يمثل `totalNumberOfVerses` عدد الآيات التي ذكرها كيان واحد على الأقل، بينما يمثل `totalNumberOfReferences` إجمالي عدد مرات ذكر الكيان للآيات.

### مثال برمجي

::: code-tabsلغة عامية

@tab جافا سكريبت

```ts:no-line-numbers title="fetch-chapter-entities.js"
const dataset = 'theographic';
const book = 'GEN';
const chapter = 2;

// تعرف على الأشخاص والأماكن والأحداث التي تظهر في سفر التكوين 2
fetch(`https://bible.helloao.org/api/d/${dataset}/${book}/${chapter}.json`)
    .then(request => request.json())
    .then(chapter => {
        console.log('Genesis 2 (theographic):', chapter);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/theographic/GEN/2.json
```

:::

### بناء

```typescript:no-line-numbers title="dataset-chapter-entities.ts"
export interface DatasetEntityBookChapter {
    /**
     * معلومات مجموعة البيانات الخاصة بفصل الكتاب.
     */
    dataset: Dataset;

    /**
     * معلومات الكتاب الخاصة بفصل الكتاب.
     */
    book: DatasetBook;

    /**
     * بيانات الكيان الخاصة بالفصل.
     */
    chapter: DatasetEntityChapterData;

    /**
     * رابط هذا الفصل.
     */
    thisChapterLink: string;

    /**
     * رابط الفصل التالي.
     * قيمة فارغة إذا كان هذا هو الفصل الأخير في مجموعة البيانات.
     */
    nextChapterApiLink: string | null;

    /**
     * رابط الفصل السابق.
     * قيمة فارغة إذا كان هذا هو الفصل الأول في مجموعة البيانات.
     */
    previousChapterApiLink: string | null;

    /**
     * عدد الأشخاص والأماكن والأحداث التي تظهر في الفصل.
     */
    numberOfPeople: number;
    numberOfPlaces: number;
    numberOfEvents: number;
}

interface DatasetEntityChapterData {
    /**
     * رقم الفصل.
     */
    number: number;

    /**
     * الأشخاص الذين يظهرون في الفصل.
     * مرتبة حسب أول بيت شعري تظهر فيه.
     */
    people: ChapterPerson[];

    /**
     * الأماكن التي تظهر في الفصل.
     * مرتبة حسب أول بيت شعري تظهر فيه.
     */
    places: ChapterPlace[];

    /**
     * الأحداث التي تظهر في الفصل.
     * مرتبة حسب أول بيت شعري تظهر فيه.
     */
    events: ChapterEvent[];
}

interface ChapterPerson {
    /**
     * هوية الشخص.
     */
    id: string;

    /**
     * اسم الشخص.
     */
    name: string;

    /**
     * ما إذا كان اسم الشخص اسماً صحيحاً.
     */
    isProperName?: boolean;

    /**
     * جنس الشخص.
     */
    gender?: string;

    /**
     * السنة التي ولد فيها الشخص والسنة التي توفي فيها.
     * الأرقام السالبة تمثل سنوات قبل الميلاد. الأرقام الموجبة تمثل سنوات بعد الميلاد.
     */
    birthYear?: number;
    deathYear?: number;

    /**
     * رابط واجهة برمجة التطبيقات (API) الخاص بالشخص.
     */
    apiLink: string;

    /**
     * أرقام الآيات في الفصل التي تذكر الشخص.
     * مرتبة تصاعدياً.
     */
    verses: number[];
}

interface ChapterPlace {
    /**
     * هوية المكان.
     */
    id: string;

    /**
     * اسم المكان.
     */
    name: string;

    /**
     * نوع السمة الجغرافية التي يمثلها المكان.
     */
    featureType?: string;

    /**
     * خط العرض وخط الطول للمكان.
     */
    latitude?: number;
    longitude?: number;

    /**
     * رابط واجهة برمجة التطبيقات (API) الخاص بالمكان.
     */
    apiLink: string;

    /**
     * أرقام الآيات في الفصل التي تذكر المكان.
     * مرتبة تصاعدياً.
     */
    verses: number[];
}

interface ChapterEvent {
    /**
     * معرف الحدث.
     */
    id: string;

    /**
     * اسم الحدث.
     */
    name: string;

    /**
     * تاريخ بدء الحدث.
     */
    startDate?: string;

    /**
     * رابط واجهة برمجة التطبيقات (API) الخاص بالحدث.
     */
    apiLink: string;

    /**
     * أرقام الآيات في الفصل التي تصف الحدث.
     * مرتبة تصاعدياً.
     */
    verses: number[];
}
```

### مثال

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

## قائمة الأشخاص في مجموعة البيانات

`GET https://bible.helloao.org/api/d/{dataset}/people.json`

يحصل على قائمة الأشخاص المتاحين لمجموعة البيانات المحددة.

-   `dataset` معرف مجموعة البيانات (على سبيل المثال `theographic` ).

### مثال برمجي

::: code-tabsلغة عامية

@tab جافا سكريبت

```ts:no-line-numbers title="fetch-dataset-people.js"
const dataset = 'theographic';

// احصل على قائمة الأشخاص لمجموعة البيانات الجغرافية
fetch(`https://bible.helloao.org/api/d/${dataset}/people.json`)
    .then(request => request.json())
    .then(people => {
        console.log('The theographic dataset has the following people:', people);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/theographic/people.json
```

:::

### بناء

```typescript:no-line-numbers title="dataset-people.ts"
export interface DatasetPeople {
    /**
     * معلومات مجموعة البيانات للأشخاص.
     */
    dataset: Dataset;

    /**
     * قائمة الأشخاص المتاحين لمجموعة البيانات.
     */
    people: DatasetPersonSummary[];
}

interface DatasetPersonSummary {
    /**
     * هوية الشخص.
     */
    id: string;

    /**
     * اسم الشخص.
     */
    name: string;

    /**
     * ما إذا كان اسم الشخص اسماً صحيحاً.
     */
    isProperName?: boolean;

    /**
     * جنس الشخص.
     */
    gender?: string;

    /**
     * عدد المراجع الكتابية التي تذكر الشخص.
     */
    numberOfReferences: number;

    /**
     * رابط واجهة برمجة التطبيقات (API) الخاص بالشخص.
     */
    thisPersonApiLink: string;
}
```

### مثال

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

## استخراج بيانات شخص من مجموعة بيانات

`GET https://bible.helloao.org/api/d/{dataset}/people/{person}.json`

يحصل على معلومات عن شخص واحد، بما في ذلك المراجع الكتابية التي تذكره وعلاقاته بالأشخاص الآخرين والأماكن والأحداث والجماعات البشرية.

-   `dataset` معرف مجموعة البيانات (على سبيل المثال `theographic` ).
-   `person` معرف الشخص (على سبيل المثال `paul_2479` ).

### مثال برمجي

::: code-tabsلغة عامية

@tab جافا سكريبت

```ts:no-line-numbers title="fetch-dataset-person.js"
const dataset = 'theographic';
const person = 'paul_2479';

// احصل على معلومات عن بول من مجموعة البيانات الجغرافية
fetch(`https://bible.helloao.org/api/d/${dataset}/people/${person}.json`)
    .then(request => request.json())
    .then(person => {
        console.log('Paul:', person);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/theographic/people/paul_2479.json
```

:::

### بناء

```typescript:no-line-numbers title="dataset-person.ts"
export interface DatasetPersonResponse {
    /**
     * معلومات مجموعة البيانات الخاصة بالشخص.
     */
    dataset: Dataset;

    /**
     * المعلومات المتعلقة بالشخص.
     */
    person: DatasetPerson;

    /**
     * رابط واجهة برمجة التطبيقات (API) الخاص بهذا الشخص.
     */
    thisPersonApiLink: string;
}

interface DatasetPerson {
    /**
     * هوية الشخص.
     */
    id: string;

    /**
     * اسم الشخص.
     */
    name: string;

    /**
     * أسماء أخرى يُنادى بها الشخص.
     */
    alsoCalled?: string[];

    /**
     * ما إذا كان اسم الشخص اسماً صحيحاً.
     */
    isProperName?: boolean;

    /**
     * جنس الشخص.
     */
    gender?: string;

    /**
     * وصف الشخص. كل سطر يمثل فقرة.
     */
    description?: string[];

    /**
     * السنة التي ولد فيها الشخص والسنة التي توفي فيها.
     * الأرقام السالبة تمثل سنوات قبل الميلاد. الأرقام الموجبة تمثل سنوات بعد الميلاد.
     */
    birthYear?: number;
    deathYear?: number;

    /**
     * أقدم وأحدث السنوات التي ذُكر فيها الشخص.
     */
    minYear?: number;
    maxYear?: number;

    /**
     * المكان الذي ولد فيه الشخص ومات فيه.
     */
    birthPlace?: DatasetEntityRef;
    deathPlace?: DatasetEntityRef;

    /**
     * العلاقات الأسرية للشخص.
     */
    father?: DatasetEntityRef[];
    mother?: DatasetEntityRef[];
    partners?: DatasetEntityRef[];
    children?: DatasetEntityRef[];
    siblings?: DatasetEntityRef[];
    halfSiblingsSameMother?: DatasetEntityRef[];
    halfSiblingsSameFather?: DatasetEntityRef[];

    /**
     * المجموعات السكانية التي ينتمي إليها الشخص.
     */
    memberOf?: DatasetEntityRef[];

    /**
     * الأحداث التي شارك فيها الشخص.
     */
    events?: DatasetEntityRef[];

    /**
     * قائمة المراجع الكتابية التي تذكر الشخص.
     * مرتبة حسب ترتيب الكتاب والفصل والآية.
     */
    references: VerseRef[];
}
```

### مثال

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

## قائمة الأماكن في مجموعة البيانات

`GET https://bible.helloao.org/api/d/{dataset}/places.json`

يحصل على قائمة الأماكن المتاحة لمجموعة البيانات المحددة.

-   `dataset` معرف مجموعة البيانات (على سبيل المثال `theographic` ).

### بناء

```typescript:no-line-numbers title="dataset-places.ts"
export interface DatasetPlaces {
    /**
     * معلومات مجموعة البيانات الخاصة بالأماكن.
     */
    dataset: Dataset;

    /**
     * قائمة الأماكن المتاحة لمجموعة البيانات.
     */
    places: DatasetPlaceSummary[];
}

interface DatasetPlaceSummary {
    /**
     * هوية المكان.
     */
    id: string;

    /**
     * اسم المكان.
     */
    name: string;

    /**
     * نوع السمة الجغرافية التي يمثلها المكان.
     * على سبيل المثال، "مدينة"، "منطقة"، "جبل"، "ماء"، إلخ.
     */
    featureType?: string;

    /**
     * خط العرض وخط الطول للمكان.
     */
    latitude?: number;
    longitude?: number;

    /**
     * عدد المراجع الكتابية التي تذكر المكان.
     */
    numberOfReferences: number;

    /**
     * رابط واجهة برمجة التطبيقات (API) الخاص بالمكان.
     */
    thisPlaceApiLink: string;
}
```

## الحصول على مكان من مجموعة بيانات

`GET https://bible.helloao.org/api/d/{dataset}/places/{place}.json`

يحصل على معلومات حول مكان واحد، بما في ذلك المراجع الكتابية التي تذكره والأشخاص والأحداث المرتبطة به.

-   `dataset` معرف مجموعة البيانات (على سبيل المثال `theographic` ).
-   `place` معرف المكان (على سبيل المثال `jerusalem_636` ).

### بناء

```typescript:no-line-numbers title="dataset-place.ts"
export interface DatasetPlaceResponse {
    /**
     * معلومات مجموعة البيانات الخاصة بالمكان.
     */
    dataset: Dataset;

    /**
     * المعلومات المتعلقة بالمكان.
     */
    place: DatasetPlace;

    /**
     * رابط واجهة برمجة التطبيقات (API) لهذا الموقع.
     */
    thisPlaceApiLink: string;
}

interface DatasetPlace {
    /**
     * هوية المكان.
     */
    id: string;

    /**
     * اسم المكان.
     */
    name: string;

    /**
     * اسم المكان كما يظهر في نسخة الملك جيمس والنسخة الإنجليزية القياسية.
     */
    kjvName?: string;
    esvName?: string;

    /**
     * أسماء أخرى يُطلق عليها هذا المكان.
     */
    aliases?: string[];

    /**
     * نوع السمة الجغرافية التي يمثلها المكان.
     */
    featureType?: string;
    featureSubType?: string;

    /**
     * خط العرض وخط الطول للمكان، ومدى دقتهما.
     */
    latitude?: number;
    longitude?: number;
    precision?: string;

    /**
     * وصف المكان. كل سطر يمثل فقرة.
     */
    description?: string[];

    /**
     * تعليق مؤلفي مجموعة البيانات على المكان.
     */
    comment?: string;

    /**
     * المكان الأصلي لهذا المكان.
     * تشترك الأسماء المختلفة لنفس الموقع الجغرافي في نفس الأصل المكاني.
     */
    rootPlace?: DatasetEntityRef;

    /**
     * المكان الذي يُعد هذا المكان نسخة طبق الأصل منه.
     */
    duplicateOf?: DatasetEntityRef;

    /**
     * الأشخاص الذين كانوا في هذا المكان، أو ولدوا فيه، أو ماتوا فيه.
     */
    people?: DatasetEntityRef[];
    peopleBorn?: DatasetEntityRef[];
    peopleDied?: DatasetEntityRef[];

    /**
     * الأحداث التي وقعت في ذلك المكان.
     */
    events?: DatasetEntityRef[];

    /**
     * قائمة المراجع الكتابية التي تذكر المكان.
     * مرتبة حسب ترتيب الكتاب والفصل والآية.
     */
    references: VerseRef[];
}
```

### مثال

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

## عرض الأحداث في مجموعة بيانات

`GET https://bible.helloao.org/api/d/{dataset}/events.json`

يحصل على قائمة الأحداث المتاحة لمجموعة البيانات المحددة.

-   `dataset` معرف مجموعة البيانات (على سبيل المثال `theographic` ).

### بناء

```typescript:no-line-numbers title="dataset-events.ts"
export interface DatasetEvents {
    /**
     * معلومات مجموعة البيانات الخاصة بالأحداث.
     */
    dataset: Dataset;

    /**
     * قائمة الأحداث المتاحة لمجموعة البيانات.
     */
    events: DatasetEventSummary[];
}

interface DatasetEventSummary {
    /**
     * معرف الحدث.
     */
    id: string;

    /**
     * اسم الحدث.
     */
    name: string;

    /**
     * تاريخ بدء الحدث.
     * الأرقام السالبة تمثل سنوات قبل الميلاد. الأرقام الموجبة تمثل سنوات بعد الميلاد.
     * تستخدم التواريخ الأكثر تحديدًا تنسيق `YYYY-MM-DD` .
     */
    startDate?: string;

    /**
     * عدد الإشارات الكتابية التي تصف الحدث.
     */
    numberOfReferences: number;

    /**
     * رابط واجهة برمجة التطبيقات (API) الخاص بالحدث.
     */
    thisEventApiLink: string;
}
```

## الحصول على حدث من مجموعة بيانات

`GET https://bible.helloao.org/api/d/{dataset}/events/{event}.json`

يحصل على المعلومات حول حدث واحد، بما في ذلك المراجع الكتابية التي تصفه والأشخاص والأماكن والجماعات البشرية المرتبطة به.

-   `dataset` معرف مجموعة البيانات (على سبيل المثال `theographic` ).
-   `event` معرف الحدث (على سبيل المثال `saul-is-converted_326` ).

### بناء

```typescript:no-line-numbers title="dataset-event.ts"
export interface DatasetEventResponse {
    /**
     * معلومات مجموعة البيانات الخاصة بالحدث.
     */
    dataset: Dataset;

    /**
     * معلومات عن الحدث.
     */
    event: DatasetEvent;

    /**
     * رابط واجهة برمجة التطبيقات (API) لهذا الحدث.
     */
    thisEventApiLink: string;
}

interface DatasetEvent {
    /**
     * معرف الحدث.
     */
    id: string;

    /**
     * اسم الحدث.
     */
    name: string;

    /**
     * تاريخ بدء الحدث.
     */
    startDate?: string;

    /**
     * مدة الحدث.
     * على سبيل المثال، "1D" تعني يومًا واحدًا و"40Y" تعني أربعين عامًا.
     */
    duration?: string;

    /**
     * الأشخاص الذين شاركوا في الحدث.
     */
    participants?: DatasetEntityRef[];

    /**
     * الأماكن التي وقع فيها الحدث.
     */
    locations?: DatasetEntityRef[];

    /**
     * المجموعات السكانية التي شاركت في الحدث.
     */
    groups?: DatasetEntityRef[];

    /**
     * الحدث الذي يُعد هذا الحدث جزءًا منه.
     */
    partOf?: DatasetEntityRef;

    /**
     * الحدث الذي وقع قبل هذا الحدث.
     */
    predecessor?: DatasetEntityRef;

    /**
     * قائمة المراجع الكتابية التي تصف الحدث.
     * مرتبة حسب ترتيب الكتاب والفصل والآية.
     */
    references: VerseRef[];
}
```

### مثال

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

## قائمة مجموعات الأشخاص في مجموعة البيانات

`GET https://bible.helloao.org/api/d/{dataset}/groups.json`

يحصل على قائمة مجموعات الأشخاص المتاحة لمجموعة البيانات المحددة.

-   `dataset` معرف مجموعة البيانات (على سبيل المثال `theographic` ).

### بناء

```typescript:no-line-numbers title="dataset-people-groups.ts"
export interface DatasetPeopleGroups {
    /**
     * معلومات مجموعة البيانات الخاصة بالمجموعات السكانية.
     */
    dataset: Dataset;

    /**
     * قائمة مجموعات الأشخاص المتاحة لمجموعة البيانات.
     */
    groups: DatasetPeopleGroupSummary[];
}

interface DatasetPeopleGroupSummary {
    /**
     * هوية المجموعة السكانية.
     */
    id: string;

    /**
     * اسم المجموعة الشعبية.
     */
    name: string;

    /**
     * عدد الأشخاص الذين ينتمون إلى المجموعة السكانية.
     */
    numberOfMembers: number;

    /**
     * رابط واجهة برمجة التطبيقات (API) لمجموعة الأشخاص.
     */
    thisPeopleGroupApiLink: string;
}
```

## استخراج مجموعة من الأشخاص من مجموعة بيانات

`GET https://bible.helloao.org/api/d/{dataset}/groups/{group}.json`

يحصل على معلومات حول مجموعة بشرية واحدة، بما في ذلك أعضائها والأحداث التي شاركت فيها المجموعة.

-   `dataset` معرف مجموعة البيانات (على سبيل المثال `theographic` ).
-   `group` معرف مجموعة الأشخاص (على سبيل المثال `tribe-of-benjamin` ).

### بناء

```typescript:no-line-numbers title="dataset-people-group.ts"
export interface DatasetPeopleGroupResponse {
    /**
     * معلومات مجموعة البيانات الخاصة بمجموعة الأشخاص.
     */
    dataset: Dataset;

    /**
     * المعلومات المتعلقة بالجماعة السكانية.
     */
    group: DatasetPeopleGroup;

    /**
     * رابط واجهة برمجة التطبيقات (API) لهذه المجموعة من الأشخاص.
     */
    thisPeopleGroupApiLink: string;
}

interface DatasetPeopleGroup {
    /**
     * هوية المجموعة السكانية.
     */
    id: string;

    /**
     * اسم المجموعة الشعبية.
     */
    name: string;

    /**
     * الأشخاص الذين ينتمون إلى مجموعة الناس.
     */
    members?: DatasetEntityRef[];

    /**
     * الأحداث التي شاركت فيها المجموعة الشعبية.
     */
    events?: DatasetEntityRef[];

    /**
     * قائمة المراجع الكتابية التي تذكر هذه المجموعة من الناس.
     * مرتبة حسب ترتيب الكتاب والفصل والآية.
     */
    references: VerseRef[];
}
```

### مثال

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

## مجموعات البيانات الخطية

تُدرج مجموعة بيانات بيريان للترجمة بين السطور ( `bsb-interlinear` ) كلمات كل آية من آيات الكتاب المقدس بلغتها الأصلية (العبرية والآرامية واليونانية)، بالترتيب الذي تظهر به في النص الأصلي. ولكل كلمة ترجمتها الصوتية، وتحليلها النحوي، [ورقم سترونغ الخاص بها](https://en.wikipedia.org/wiki/Strong%27s_Concordance) ، والعبارة الإنجليزية التي يستخدمها [الكتاب المقدس القياسي البيرياني](https://berean.bible) للدلالة عليها.

تستخدم مجموعة البيانات نفس نقاط النهاية التي تستخدمها مجموعات البيانات الأخرى:

-   `GET https://bible.helloao.org/api/d/bsb-interlinear/books.json` يسرد الكتب الـ 66.
-   يُعيد `GET https://bible.helloao.org/api/d/bsb-interlinear/{book}/{chapter}.json` (مثلاً `/api/d/bsb-interlinear/GEN/1.json` ) رقم الفصل، بينما يُعيد `{ verse, words }` رقم الآية. وتكون الاستجابة عبارة عن [مجموعة بيانات تحتوي على رقم الفصل](#get-a-chapter-from-a-dataset) .

تأتي بيانات الكلمات من [جداول الترجمة بين السطور في النسخة القياسية البيرية للكتاب المقدس](https://bereanbible.com/) ، وهي متاحة للعموم. أما أرقام سترونغ للكلمات فقد تم البحث عنها في [المعجم](#lexicon) ( `stepbible-lexicon` ).

### بناء

```typescript:no-line-numbers title="interlinear-word.ts"
interface InterlinearWord {
    /**
     * ترتيب الكلمة في النص الأصلي، بدءًا من الرقم 1.
     * الكلمات مدرجة بهذا الترتيب.
     */
    pos: number;

    /**
     * الترتيب الذي يبدأ من 1 للكلمة في الترتيب الإنجليزي للكتاب المقدس القياسي البيرياني.
     */
    bsbPos: number;

    /**
     * لغة الكلمة.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * الكلمة في النص الأصلي. مُعَدَّلة بتقنية NFC.
     */
    text: string;

    /**
     * الترجمة الصوتية للكلمة.
     */
    transliteration: string | null;

    /**
     * رمز التحليل النحوي المختصر للكلمة. على سبيل المثال "N-mp" أو "V-Qal-Perf-3ms".
     */
    parsing: string | null;

    /**
     * التحليل النحوي المفصل للكلمة.
     */
    parsingFull: string | null;

    /**
     * رقم سترونغ للكلمة بعد إضافة أصفار في البداية. على سبيل المثال "H0430" أو "G3056".
     * تمت إضافة أصفار، وهو ما يتطابق مع قيم `.words.json` في نسخة الملك جيمس.
     * قد تحتاج قيم الترجمات الأخرى إلى إضافة أصفار وإزالة اللواحق قبل دمجها.
     * تكون القيمة فارغة عندما لا يعطي المصدر رقم سترونج للكلمة (هذا هو الحال بالنسبة لبعض الكلمات التي هي لواحق، مثل لواحق الضمائر).
     */
    strongs: string | null;

    /**
     * العبارة الإنجليزية للكلمة في النسخة القياسية البيرية للكتاب المقدس.
     * تكون القيمة فارغة عندما يترك BSB الكلمة دون ترجمة (مثل علامة المفعول به المباشر في اللغة العبرية).
     */
    gloss: string | null;
}
```

### مثال

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

### ربط الكلمات بالترجمات

تُضاف `strongs` إلى القيم الموجودة بين السطور (مثلاً `H0430` ). وهذا يطابق القيمتين `strongs` في شروح الكلمات في نسخة الملك جيمس ( `/api/eng_kjv/{book}/{chapter}.words.json` ). قد تحتاج قيم الترجمات الأخرى إلى إضافة أصفار وإزالة اللواحق (مثلاً `H430` أو `H1961a` إلى `H0430` و `H1961` ) قبل دمجها.

-   بالنسبة لنسخة الملك جيمس ( **KJV** )، يتم ربط أرقام سترونغ في الملف `eng_kja` `.words.json` الفصل مع الرقم `strongs` للكلمات المترجمة بين السطور في نفس الآية. على سبيل المثال، كل رقم سترونغ مُشار إليه في `/api/eng_kjv/GEN/1.words.json` للآية 1 `H7225` `eng_kjv` `H1254` ، `H0430` ، `H0853` ، `H8064` ، `H0776` ) يظهر كقيمة `strongs` بين كلمات الآية 1 في `/api/d/bsb-interlinear/GEN/1.json` .
-   **الكتاب المقدس القياسي البيرياني.** يُمثل الرقم `gloss` لكل كلمة عبارةً من عبارات الكتاب المقدس القياسي البيرياني لتلك الكلمة. تَتبَّع كلمات الآية بالترتيب `bsbPos` ، وقارن كل `gloss` بنص الآية في ترجمة الكتاب المقدس القياسي البيرياني لتحديد موضع ترجمة الكلمة.

لا يتطابق ترقيم المصدرين دائمًا. على سبيل المثال، يُرقّم قاموس الملك جيمس كلمة "كان" بالرقم `G2258` بينما يُرقّمها جدول بيريان `G1510` وتفشل بعض عمليات الربط بسبب اختلافات كهذه.

### الإسناد

جداول بيريان بين السطور متاحة للعموم. أما [المعجم](#lexicon) فهو مرخص بموجب رخصة CC BY 4.0 ويتطلب الإشارة إلى المصدر.

## معجم

تحتوي مجموعة بيانات معجم STEPBible ( `stepbible-lexicon` ) على معاجم مختصرة للغات العبرية والآرامية واليونانية (TBESH وTBESG) من [موقع STEPBible.org](https://www.stepbible.org/) في دار تينديل، كامبريدج. وتحتوي على مدخل واحد لكل رقم سترونغ أساسي، ولكل مدخل معنى واحد أو أكثر مع الجذر اللغوي، والترجمة الصوتية، ونوع الكلمة، والشرح الإنجليزي، والتعريف.

يمكن البحث عن أي قيمة تبدأ برقم `strongs` من [كلمة بينية](#interlinear-datasets) لها مدخل في المعجم، بعد إضافة أصفار في بدايتها، عند `/api/d/stepbible-lexicon/lexicon/{strongs}.json` دون الحاجة إلى إعادة تنسيقها. وينطبق الأمر نفسه على القيم التي تبدأ برقم `.words.json` في ترجمة الملك جيمس؛ أما قيم الترجمات الأخرى فقد تحتاج إلى إضافة أصفار في بدايتها وإزالة اللواحق أولًا. لا تُنشر المدخلات اليونانية التي يضيفها المعجم دون رقم سترونغ.

تتضمن مجموعات البيانات التي تحتوي على مدخلات المعجم `listOfLexiconApiLink` و `totalNumberOfLexicon` في مدخلها في `/api/available_datasets.json` .

### الإسناد

بيانات المعجم مرخصة بموجب رخصة [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) . في حال استخدامها، يُرجى ذكر المصدر STEPBible.org / Tyndale House, Cambridge، مع الإشارة إلى أي تغييرات. يُنسب الفضل إلى الخاصية `licenseNotes` من مجموعة البيانات.

## قائمة مدخلات المعجم في مجموعة البيانات

`GET https://bible.helloao.org/api/d/{dataset}/lexicon.json`

يحصل على قائمة إدخالات المعجم المتاحة لمجموعة البيانات.

-   `dataset` معرف مجموعة البيانات (على سبيل المثال `stepbible-lexicon` ).

### مثال برمجي

::: code-tabsلغة عامية

@tab جافا سكريبت

```ts:no-line-numbers title="fetch-lexicon.js"
fetch(`https://bible.helloao.org/api/d/stepbible-lexicon/lexicon.json`)
    .then(request => request.json())
    .then(lexicon => {
        console.log('The lexicon has', lexicon.lexicon.length, 'entries');
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/stepbible-lexicon/lexicon.json
```

:::

### بناء

```typescript:no-line-numbers title="dataset-lexicon.ts"
export interface DatasetLexicon {
    /**
     * معلومات مجموعة البيانات الخاصة بالمعجم.
     */
    dataset: Dataset;

    /**
     * قائمة مداخل المعجم المتاحة لمجموعة البيانات.
     */
    lexicon: DatasetLexiconEntrySummary[];
}

export interface DatasetLexiconEntrySummary {
    /**
     * رقم سترونغ المضاف إليه أصفار في مدخل المعجم. على سبيل المثال "H0430".
     */
    id: string;

    /**
     * لغة مدخل المعجم.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * اسم مدخل المعجم.
     * هذه هي خلاصة المعنى الأول للمدخل.
     */
    name: string;

    /**
     * رابط واجهة برمجة التطبيقات (API) الخاص بمدخل المعجم.
     */
    apiLink: string;
}
```

### مثال

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

## استخراج مدخل معجمي من مجموعة بيانات

`GET https://bible.helloao.org/api/d/{dataset}/lexicon/{strongs}.json`

يحصل على مدخل المعجم لرقم سترونغ الأساسي الواحد، بكل معانيه.

-   `dataset` معرف مجموعة البيانات (على سبيل المثال `stepbible-lexicon` ).
-   `strongs` هو رقم سترونغ المضاف إليه أصفار (على سبيل المثال `H0430` للكلمة العبرية _elohim_، أو `G3056` للكلمة اليونانية _logos_).

### مثال برمجي

::: code-tabsلغة عامية

@tab جافا سكريبت

```ts:no-line-numbers title="fetch-lexicon-entry.js"
const strongs = 'H1254';

fetch(`https://bible.helloao.org/api/d/stepbible-lexicon/lexicon/${strongs}.json`)
    .then(request => request.json())
    .then(({ entry }) => {
        console.log('H1254:', entry.senses.map(sense => sense.gloss));
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/stepbible-lexicon/lexicon/H1254.json
```

:::

### بناء

```typescript:no-line-numbers title="dataset-lexicon-entry.ts"
export interface DatasetLexiconEntry {
    /**
     * معلومات مجموعة البيانات الخاصة بمدخل المعجم.
     */
    dataset: Dataset;

    /**
     * مدخل المعجم.
     */
    entry: DatasetLexiconEntryContent;

    /**
     * رابط واجهة برمجة التطبيقات (API) لهذا المدخل المعجمي.
     */
    thisLexiconEntryApiLink: string;
}

export interface DatasetLexiconEntryContent {
    /**
     * رقم سترونغ المضاف إليه أصفار للمدخل. على سبيل المثال "H0430".
     */
    id: string;

    /**
     * لغة المدخل.
     * هذه هي لغة المعنى الأول للمدخل.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * معاني المدخل، حسب ترتيب التعريف.
     */
    senses: DatasetLexiconSense[];
}

export interface DatasetLexiconSense {
    /**
     * المعرف الموسع للمعنى. على سبيل المثال "H0001G".
     * يساوي العدد الأساسي لـ Strong's عندما يكون للعدد معنى واحد.
     */
    id: string;

    /**
     * لغة الحواس.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * جوهر المعنى في النص الأصلي.
     */
    lemma: string;

    /**
     * الترجمة الصوتية للكلمة الأساسية.
     */
    transliteration: string | null;

    /**
     * رمز جزء الكلام (الصرف) للمعنى.
     */
    partOfSpeech: string | null;

    /**
     * الشرح الإنجليزي المختصر للمعنى.
     */
    gloss: string | null;

    /**
     * تعريف المعنى كنص عادي.
     * تُفصل الفقرات بأسطر فارغة. تمت إزالة علامات التنسيق من المصدر.
     */
    definition: string;
}
```

### مثال

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

## آية اليوم

مجموعة بيانات "آية اليوم" ( `verse-of-the-day` ) هي قائمة منتقاة من الآيات والمقاطع القصيرة المعروفة (بحد أقصى ثلاث آيات) التي تُعدّ مرشحة جيدة لتكون "آية اليوم": أكثر من 640 آية لكل يوم من أيام السنة، وأكثر من 100 آية للأعياد المسيحية. كل آية منها تحمل معنىً خاصًا بها.

تحتوي كل آية لكل يوم على فئة واحدة إلى ثلاث فئات، تبدأ بالأكثر أهمية، من هذه المجموعة الثابتة:

| بطاقة تعريف   | وصف                                         |
| ------------- | ------------------------------------------- |
| `comfort`     | قرب الله وعنايته في الحزن والمتاعب والوحدة. |
| `courage`     | الثبات وعدم الخوف.                          |
| `faith`       | الثقة بالله ووعوده.                         |
| `forgiveness` | غفران الله للذنوب وغفرانه للآخرين.          |
| `gratitude`   | الحمد لله.                                  |
| `guidance`    | الله يوجه خطواتنا وخططنا وقراراتنا.         |
| `hope`        | الثقة في المستقبل الذي وعد به الله.         |
| `inspiration` | التشجيع على تطبيق الإيمان وفعل الخير.       |
| `joy`         | الفرح والسرور بالله.                        |
| `love`        | محبة الله لنا ومحبتنا لله وللآخرين.         |
| `peace`       | الراحة والهدوء والتحرر من القلق.            |
| `praise`      | العبادة وإعلان عظمة الله.                   |
| `prayer`      | أدعو الله وأستشيره بوعده.                   |
| `provision`   | الله يرزقنا ما نحتاج إليه.                  |
| `salvation`   | الفداء والنعمة والحياة الجديدة في المسيح.   |
| `strength`    | الله يمنح القوة والصبر.                     |
| `wisdom`      | الحكمة الإلهية والإرشادات العملية للحياة.   |

للأعياد تصنيفات خاصة بها. في يوم العيد، تكون آية اليوم إحدى آيات العيد، ولا تُستخدم هذه الآيات في الأيام الأخرى. عادةً ما يستمر العيد يومًا واحدًا؛ أما عيد ما بعد أحد القيامة فيستمر ثلاثة أيام بعد أحد القيامة، لذا فهو يشمل التواريخ الثلاثة جميعها. لكل تصنيف من تصنيفات الأعياد رقم `holiday` مع تاريخه: الأعياد التي تُصادف في نفس التاريخ كل عام تحمل الرقمين `month` و `day` ، والأعياد التي يتغير تاريخها سنويًا (لأنها تعتمد على أحد القيامة أو زمن المجيء) تحمل الرقم `dates` في التقويم الميلادي، المحسوب مسبقًا للفترة من 2026 إلى 2125.

| بطاقة تعريف                | عطلة                         | تاريخ                               |
| -------------------------- | ---------------------------- | ----------------------------------- |
| `epiphany`                 | عيد الغطاس                   | 6 يناير                             |
| `ash-wednesday`            | أربعاء الرماد                | قبل 46 يومًا من أحد القيامة         |
| `palm-sunday`              | أحد الشعانين                 | الأحد الذي يسبق أحد القيامة         |
| `maundy-thursday`          | خميس العهد                   | يوم الخميس الذي يسبق أحد القيامة    |
| `good-friday`              | يوم الجمعة العظيمة           | يوم الجمعة الذي يسبق أحد القيامة    |
| `resurrection-sunday`      | أحد القيامة                  | أحد الفصح                           |
| `post-resurrection-sunday` | بعد أحد القيامة              | الأيام الثلاثة التي تلي أحد القيامة |
| `ascension-day`            | يوم الصعود                   | بعد 39 يومًا من أحد القيامة         |
| `pentecost`                | عيد العنصرة                  | بعد 49 يومًا من أحد القيامة         |
| `all-hallows-eve`          | عيد جميع القديسين            | 31 أكتوبر                           |
| `all-saints-day`           | عيد جميع القديسين            | الأول من نوفمبر                     |
| `advent-sunday`            | الأحد الأول من زمن المجيء    | الأحد الرابع قبل عيد الميلاد        |
| `christmas-eve`            | اليوم الذي يسبق ليلة الميلاد | 24 ديسمبر                           |
| `christmas`                | عيد الميلاد                  | 25 ديسمبر                           |

تحتوي مجموعة البيانات على مراجع فقط، وليس نص الآيات، لذا فهي متوافقة مع جميع الترجمات. تستخدم أرقام الآيات الترقيم الإنجليزي القياسي (المستخدم في ترجمة الكتاب المقدس البريطانية). يمكن قراءة البيانات بثلاث طرق:

-   [`/api/d/verse-of-the-day/verses.json`](#list-verses-in-a-dataset) يسرد كل آية في مجموعة البيانات مع فئاتها، والأعياد مع تواريخها، في ملف واحد.
-   يُدرج القسم [`/api/d/verse-of-the-day/categories/{category}.json`](#get-a-category-from-a-dataset) جميع الآيات في فئة معينة. هذه هي أسهل طريقة لاختيار آية اليوم من فئة واحدة.
-   يعرض [`/api/d/verse-of-the-day/{book}/{chapter}.json`](#get-a-chapter-from-a-dataset) قائمة المرشحين في كل فصل، مع تصنيفاتهم. لا تتوفر إلا الفصول التي تحتوي على مرشح؛ استخدم روابط فصول الكتاب أو `/api/d/verse-of-the-day/books.json` للعثور عليها.

تتضمن مجموعات البيانات التي تحتوي على فئات الآيات `listOfVersesApiLink` و `listOfCategoriesApiLink` و `totalNumberOfCategories` في مدخلها في `/api/available_datasets.json` .

### اختيار آية اليوم

تتكون واجهة برمجة التطبيقات من ملفات ثابتة، لذا فهي لا تختار الآية تلقائيًا. بدلاً من ذلك، هناك اتفاقية لاختيار الآية، بحيث تعرض جميع التطبيقات التي تتبعها نفس الآية في نفس اليوم. للتطبيقات حرية اختيار آيات مختلفة؛ فالاتفاقية توفر لها آية افتراضية مشتركة.

يختار النظام الآيات والأعياد من المجموعة `/api/d/verse-of-the-day/verses.json` في أيام الأعياد، يختار إحدى آياتها، ويستعرضها عامًا بعد عام، بحيث يكون لكل عيد آية مختلفة كل عام حتى تُستخدم جميع آياته. في الأيام الأخرى، يحصل كل عام على مجموعة عشوائية من الآيات المستخدمة فيه (مرتبة حسب تجزئة مرجع كل آية، والسنة، وقيمة أولية اختيارية)، وتكون آية اليوم هي تلك الموجودة في ذلك اليوم من السنة في تلك المجموعة العشوائية. تحتوي مجموعة البيانات على أكثر من 366 آية لكل يوم مستخدمة كل عام، لذا لا تتكرر الآية أبدًا خلال السنة التقويمية، ويتغير الترتيب كل عام، ويعطي التاريخ نفسه دائمًا الآية نفسها. تُضاف الآيات الجديدة (مع `addedIn` ) وتُحذف القديمة (مع `removedIn` ) فقط من سنة لم تبدأ بعد، لذا لا تتغير آية اليوم لتاريخ سابق.

تحدد صفحة [اتفاقية آية اليوم](./verse-of-the-day-convention.md) الخوارزمية خطوة بخطوة، مع الشفرة الزائفة وقيم الاختبار، بحيث يمكنك تنفيذها بأي لغة.

لاستخدام ترتيبك الخاص، اختر بذرة من اختيارك (على سبيل المثال، اسم تطبيقك): سيمنحك ذلك ترتيبًا عشوائيًا مختلفًا مع نفس الضمانات. يمكنك أيضًا الاختيار من بين أبيات فئة واحدة، ولكن كل فئة تحتوي على أبيات أقل من عدد أيام السنة، لذا تتكرر أبياتها بشكل أسرع.

تتبع مجموعات تطوير البرامج (SDKs) الاصطلاح التالي:

```ts:no-line-numbers title="verse-of-the-day.js"
import { FreeUseBibleApi } from 'free-use-bible-api';

const api = new FreeUseBibleApi();

// التاريخ بصيغة YYYY-MM-DD، أو التاريخ (يتم استخدام تاريخ التقويم المحلي). القيمة الافتراضية هي تاريخ اليوم.
const ref = await api.getVerseOfTheDay('2026-01-01');

// احصل على نص الآية من ترجمة.
const chapter = await api.getTranslationBookChapter('BSB', ref.book, ref.chapter);
const verses = chapter.chapter.content.filter(
    (c) =>
        c.type === 'verse' &&
        c.number >= ref.verse &&
        c.number <= (ref.endVerse ?? ref.verse)
);
console.log(ref, verses);
```

-   `getVerseOfTheDay(date?, { seed?, category?, dataset? }?)` يقوم بتنزيل قائمة الآيات ويختار منها. `pickVerseOfTheDay(verses, date?, { seed?, category? }?)` يختار من قائمة لديك بالفعل.
-   يحتوي Kotlin SDK على `getVerseOfTheDay(date?, seed?, category?)` و `pickVerseOfTheDay(verses, date?, seed?, category?)` ، واللذان يأخذان التاريخ كسلسلة مكونة من `YYYY-MM-DD` .
-   يحتوي Swift SDK على `getVerseOfTheDay(date:seed:category:)` و `pickVerseOfTheDay(_:date:seed:category:holidays:)` ، والتي تأخذ التاريخ كسلسلة `YYYY-MM-DD` أو `Date` (يتم استخدام تاريخ التقويم في المنطقة الزمنية الحالية).
-   يحتوي [خادم MCP](https://github.com/HelloAOLab/bible-api/tree/main/packages/seed-bible-mcp) على أداة `getVerseOfTheDay` تُعيد آية اليوم مع نصها.
-   تحتوي الحزمة `@helloao/tools` على نفس القائمة ووظيفة `getVerseOfTheDay(date?, { seed?, category? }?)` في `@helloao/tools/generation/verse-of-the-day.js` .

### رخصة

تم تجميع هذه القائمة بواسطة مختبر AO وهي متاحة بموجب [ترخيص MIT](https://github.com/HelloAOLab/bible-api/blob/main/LICENSE) . نص الآية مأخوذ من أي ترجمة تستخدمها.

## قائمة الآيات في مجموعة البيانات

`GET https://bible.helloao.org/api/d/{dataset}/verses.json`

يستخرج هذا الأمر كل بيت شعري (أو مقطع قصير) في مجموعة البيانات، مع تصنيفات كل منها، بالترتيب المتعارف عليه. وهو متاح فقط لمجموعات البيانات التي تحتوي أبياتها الشعرية على تصنيفات، مثل `verse-of-the-day` .

-   `dataset` معرف مجموعة البيانات (على سبيل المثال `verse-of-the-day` ).

### مثال برمجي

::: code-tabsلغة عامية

@tab جافا سكريبت

```ts:no-line-numbers title="fetch-verses.js"
fetch(`https://bible.helloao.org/api/d/verse-of-the-day/verses.json`)
    .then(request => request.json())
    .then(verses => {
        console.log('The dataset has', verses.verses.length, 'verses');
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/verse-of-the-day/verses.json
```

:::

### بناء

```typescript:no-line-numbers title="dataset-verses.ts"
export interface DatasetVerses {
    /**
     * معلومات مجموعة البيانات الخاصة بالآيات.
     */
    dataset: Dataset;

    /**
     * كل بيت شعري (أو مقطع قصير) في مجموعة البيانات، مع فئاته، بالترتيب المتعارف عليه.
     */
    verses: DatasetCategorizedVerse[];

    /**
     * الأعياد التي لها أبياتها الخاصة، مع تواريخها.
     * يتم حذفها إذا لم تتضمن مجموعة البيانات أي عطلات.
     */
    holidays?: DatasetVersesHoliday[];
}

export interface DatasetVersesHoliday extends DatasetCategoryHoliday {
    /**
     * معرّف فئة العطلة. على سبيل المثال "عيد الميلاد".
     */
    id: string;

    /**
     * الاسم الإنجليزي للعيد. على سبيل المثال "Christmas".
     */
    name: string;
}

export interface DatasetCategoryHoliday {
    /**
     * الشهر (1 لشهر يناير) واليوم من العطلة التي تقع في نفس التاريخ كل عام.
     * تم استبعادها بالنسبة للعطلات التي يتغير تاريخها كل عام.
     */
    month?: number;
    day?: number;

    /**
     * تواريخ (YYYY-MM-DD، التقويم الميلادي) عطلة يتغير تاريخها كل عام، بالترتيب.
     * يتم حسابها مسبقًا لمجموعة من السنوات (حاليًا من 2026 إلى 2125)، ويتم الاحتفال بالعطلة فقط في التواريخ المدرجة.
     * يتم استبعادها في الأعياد التي تصادف نفس التاريخ كل عام.
     */
    dates?: string[];
}

export interface DatasetCategorizedVerse {
    /**
     * رقم تعريف الكتاب. على سبيل المثال "PRO".
     */
    book: string;

    /**
     * رقم الفصل.
     */
    chapter: number;

    /**
     * رقم الآية.
     * إذا كان `endVerse` موجودًا، فهذه هي الآية التي يبدأ منها المقطع.
     */
    verse: number;

    /**
     * الآية التي ينتهي عندها المقطع.
     * يتم حذفها إذا كان المدخل عبارة عن بيت شعري واحد.
     */
    endVerse?: number;

    /**
     * معرفات الفئات التي ينتمي إليها النص، مع ترتيب الفئات الأكثر صلة أولاً.
     */
    categories: string[];

    /**
     * السنة الأولى التي يمكن فيها أن تكون الآية هي آية اليوم.
     * يتم حذف الآية إذا كانت موجودة دائمًا في القائمة.
     */
    addedIn?: number;

    /**
     * السنة الأولى التي لم يعد فيها من الممكن أن تكون الآية هي آية اليوم.
     * تبقى الآيات المحذوفة في مجموعة البيانات حتى يمكن اختيار آيات السنوات السابقة.
     * يتم حذف الآية إذا لم تتم إزالتها من القائمة.
     */
    removedIn?: number;
}
```

### مثال

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

## قائمة الفئات في مجموعة البيانات

`GET https://bible.helloao.org/api/d/{dataset}/categories.json`

يحصل على قائمة فئات الآيات المتاحة لمجموعة البيانات.

-   `dataset` معرف مجموعة البيانات (على سبيل المثال `verse-of-the-day` ).

### مثال برمجي

::: code-tabsلغة عامية

@tab جافا سكريبت

```ts:no-line-numbers title="fetch-categories.js"
fetch(`https://bible.helloao.org/api/d/verse-of-the-day/categories.json`)
    .then(request => request.json())
    .then(categories => {
        console.log('The dataset has the following categories:', categories.categories);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/verse-of-the-day/categories.json
```

:::

### بناء

```typescript:no-line-numbers title="dataset-categories.ts"
export interface DatasetCategories {
    /**
     * معلومات مجموعة البيانات الخاصة بالفئات.
     */
    dataset: Dataset;

    /**
     * قائمة فئات الآيات المتاحة لمجموعة البيانات.
     */
    categories: DatasetCategorySummary[];
}

export interface DatasetCategorySummary {
    /**
     * معرّف الفئة. على سبيل المثال "الأمل".
     */
    id: string;

    /**
     * الاسم الإنجليزي للفئة. على سبيل المثال "الأمل".
     */
    name: string;

    /**
     * وصف لما تتحدث عنه الآيات في هذه الفئة.
     */
    description: string;

    /**
     * عدد الآيات (أو المقاطع القصيرة) التي تنتمي إلى هذه الفئة.
     */
    numberOfVerses: number;

    /**
     * تواريخ العطلة التي تنتمي إليها الفئة (انظر DatasetCategoryHoliday أعلاه).
     * تم حذف الفئات التي لا تتعلق بعطلة.
     */
    holiday?: DatasetCategoryHoliday;

    /**
     * رابط واجهة برمجة التطبيقات (API) الخاص بالفئة.
     */
    apiLink: string;
}
```

### مثال

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

## استخراج فئة من مجموعة بيانات

`GET https://bible.helloao.org/api/d/{dataset}/categories/{category}.json`

يحصل على فئة واحدة من الآيات، مع كل الآيات التي تنتمي إليها.

-   `dataset` معرف مجموعة البيانات (على سبيل المثال `verse-of-the-day` ).
-   `category` هو معرف الفئة (على سبيل المثال `hope` ).

### مثال برمجي

::: code-tabsلغة عامية

@tab جافا سكريبت

```ts:no-line-numbers title="fetch-category.js"
fetch(`https://bible.helloao.org/api/d/verse-of-the-day/categories/hope.json`)
    .then(request => request.json())
    .then(category => {
        console.log('Verses about hope:', category.category.verses);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/verse-of-the-day/categories/hope.json
```

:::

### بناء

```typescript:no-line-numbers title="dataset-category.ts"
export interface DatasetCategoryResponse {
    /**
     * معلومات مجموعة البيانات الخاصة بالفئة.
     */
    dataset: Dataset;

    /**
     * الفئة، مع الآيات التي تنتمي إليها.
     */
    category: DatasetCategory;

    /**
     * رابط واجهة برمجة التطبيقات (API) لهذه الفئة.
     */
    thisCategoryApiLink: string;
}

export interface DatasetCategory {
    /**
     * معرّف الفئة. على سبيل المثال "الأمل".
     */
    id: string;

    /**
     * الاسم الإنجليزي للفئة. على سبيل المثال "الأمل".
     */
    name: string;

    /**
     * وصف لما تتحدث عنه الآيات في هذه الفئة.
     */
    description: string;

    /**
     * تواريخ العطلة التي تنتمي إليها الفئة (انظر DatasetCategoryHoliday في "قائمة الآيات في مجموعة البيانات").
     * في تلك التواريخ، تكون آية اليوم واحدة من آيات الفئة، ولا يتم استخدامها في أيام أخرى.
     * تم حذف الفئات التي لا تتعلق بعطلة.
     */
    holiday?: DatasetCategoryHoliday;

    /**
     * الآيات (أو المقاطع القصيرة) التي تنتمي إلى هذه الفئة، بالترتيب القانوني.
     * يتضمن الآيات التي تمت إزالتها من القائمة (انظر `removedIn` ).
     */
    verses: DatasetCategoryVerse[];
}

export interface DatasetCategoryVerse {
    /**
     * رقم تعريف الكتاب. على سبيل المثال "JER".
     */
    book: string;

    /**
     * رقم الفصل.
     */
    chapter: number;

    /**
     * رقم الآية.
     * إذا كان `endVerse` موجودًا، فهذه هي الآية التي يبدأ منها المقطع.
     */
    verse: number;

    /**
     * الآية التي ينتهي عندها المقطع.
     * يتم حذفها إذا كانت الإشارة إلى آية واحدة.
     */
    endVerse?: number;

    /**
     * السنة الأولى التي يمكن فيها أن تكون الآية هي آية اليوم.
     * يتم حذف الآية إذا كانت موجودة دائمًا في القائمة.
     */
    addedIn?: number;

    /**
     * السنة الأولى التي لم يعد فيها من الممكن أن تكون الآية هي آية اليوم.
     * تبقى الآيات المحذوفة في مجموعة البيانات حتى يمكن اختيار آيات السنوات السابقة.
     * يتم حذف الآية إذا لم تتم إزالتها من القائمة.
     */
    removedIn?: number;
}
```

### مثال

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
