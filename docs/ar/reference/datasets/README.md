# مجموعات البيانات

نقاط نهاية لتصفح مجموعات بيانات الكتاب المقدس التكميلية - مثل المراجع المتقاطعة والكيانات الكتابية (الأشخاص والأماكن والأحداث والجماعات البشرية) - وجلب كتبها ومحتوى فصولها وكياناتها.

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
     */
    totalNumberOfReferences: number;

    /**
     * يحصل على اسم اللغة التي توجد بها مجموعة البيانات.
     * تكون القيمة فارغة أو غير محددة إذا كان اسم اللغة غير معروف.
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

بالنسبة لمجموعات بيانات المراجع المتبادلة (مثل `open-cross-ref` )، يحتوي الفصل على قائمة المراجع المتبادلة لكل آية. أما بالنسبة لمجموعات بيانات الكيانات (مثل `theographic` )، فيحتوي الفصل على الأشخاص والأماكن والأحداث التي تظهر فيه - انظر قسم ["الحصول على الكيانات في الفصل"](#get-the-entities-in-a-chapter) .

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

interface DatasetVerse {
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
