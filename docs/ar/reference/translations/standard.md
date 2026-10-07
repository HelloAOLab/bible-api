# التنسيق القياسي

التنسيق القياسي للفصول، وتنزيلات الترجمة الكاملة، والتعليقات على مستوى الكلمات. راجع [قسم "الترجمات والكتب والفصول"](./README.md) للاطلاع على نقاط نهاية قائمة الترجمة والكتب، أو [التنسيق المبسط](./simplified.md) للتمثيل البديل لهذا المحتوى نفسه.

## احصل على فصل من ترجمة

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`

يحصل على محتوى فصل واحد من كتاب معين وترجمته.

-   `translation` هو معرف الترجمة (على سبيل المثال `BSB` ).
-   `book` هو معرف الكتاب (على سبيل المثال `GEN` لسفر التكوين - يمكنك العثور على قائمة بمعرفات الكتب [هنا](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` هو رقم الفصل (على سبيل المثال `1` للفصل الأول).

### مثال برمجي

::: code-tabsلغة عامية

@tab جافا سكريبت

```ts:no-line-numbers title="fetch-chapter.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// احصل على سفر التكوين 1 من ترجمة BSB
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

### بناء

```typescript:no-line-numbers title="chapter.ts"
export interface TranslationBookChapter {
    /**
     * معلومات الترجمة الخاصة بفصل الكتاب.
     */
    translation: Translation;

    /**
     * معلومات الكتاب الخاصة بفصل الكتاب.
     */
    book: TranslationBook;

    /**
     * رابط الفصل الحالي.
     */
    thisChapterLink: string;

    /**
     * روابط لإصدارات صوتية مختلفة للفصل.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * روابط التوقيتات الصوتية للإصدارات الصوتية المختلفة للفصل.
     * يشير كل رابط إلى ملف التوقيتات الصوتية لهذا القارئ - انظر "الحصول على التوقيتات الصوتية لفصل ما" أدناه.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsLinks;

    /**
     * رابط الفصل التالي.
     * لا شيء إذا كان هذا هو الفصل الأخير في الترجمة.
     */
    nextChapterApiLink: string | null;

    /**
     * روابط لإصدارات صوتية مختلفة للفصل التالي.
     * لا شيء إذا كان هذا هو الفصل الأخير في الترجمة.
     */
    nextChapterAudioLinks: TranslationBookChapterAudioLinks | null;

    /**
     * روابط التوقيتات الصوتية للإصدارات الصوتية المختلفة للفصل التالي.
     * لا شيء إذا كان هذا هو الفصل الأخير في الترجمة.
     */
    nextChapterAudioTimings: TranslationBookChapterAudioTimingsLinks | null;

    /**
     * رابط الفصل السابق.
     * لا شيء إذا كان هذا هو الفصل الأول في الترجمة.
     */
    previousChapterApiLink: string | null;

    /**
     * روابط لإصدارات صوتية مختلفة للفصل السابق.
     * لا شيء إذا كان هذا هو الفصل الأول في الترجمة.
     */
    previousChapterAudioLinks: TranslationBookChapterAudioLinks | null;

    /**
     * روابط التوقيتات الصوتية للإصدارات الصوتية المختلفة للفصل السابق.
     * لا شيء إذا كان هذا هو الفصل الأول في الترجمة.
     */
    previousChapterAudioTimings: TranslationBookChapterAudioTimingsLinks | null;

    /**
     * رابط التعليقات التوضيحية على مستوى الكلمات للفصل.
     * يتم حذفها إذا لم يكن للفصل أي تعليقات توضيحية على مستوى الكلمات.
     */
    thisChapterWordsLink?: string;

    /**
     * رابط التعليقات التوضيحية على مستوى الكلمات للفصل التالي.
     * يتم حذف هذا الجزء إذا كان هذا هو الفصل الأخير في الترجمة، أو إذا لم يكن للفصل التالي أي تعليقات على مستوى الكلمات.
     */
    nextChapterWordsLink?: string;

    /**
     * رابط التعليقات التوضيحية على مستوى الكلمات للفصل السابق.
     * يتم حذف هذا الجزء إذا كان هذا هو الفصل الأول في الترجمة، أو إذا لم يكن للفصل السابق أي تعليقات على مستوى الكلمات.
     */
    previousChapterWordsLink?: string;

    /**
     * عدد الآيات التي يحتويها الفصل.
     */
    numberOfVerses: number;

    /**
     * رابط النسخة المبسطة من هذا الفصل.
     * يتم حذفها إذا لم تكن الفصول المبسطة متوفرة.
     */
    simpleChapterApiLink?: string;

    /**
     * المعلومات الخاصة بهذا الفصل.
     */
    chapter: ChapterData;
}

interface ChapterData {
    /**
     * رقم الفصل.
     */
    number: number;

    /**
     * محتوى الفصل.
     */
    content: ChapterContent[];

    /**
     * قائمة الحواشي السفلية للفصل.
     */
    footnotes: ChapterFootnote[];
}

/**
 * نوع اتحاد يمثل جزءًا واحدًا من محتوى الفصل.
 * يمكن أن يكون جزء من محتوى الفصل أحد الأشياء التالية:
 * - عنوان.
 * - فاصل أسطر.
 * - بيت شعري.
 * - ترجمة عبرية.
 */
type ChapterContent = ChapterHeading | ChapterLineBreak | ChapterVerse | ChapterHebrewSubtitle;

/**
 * عنوان في فصل.
 */
interface ChapterHeading {
    /**
     * يشير إلى أن المحتوى يمثل عنوانًا.
     */
    type: 'heading';

    /**
     * محتوى العنوان.
     * إذا تم تضمين عدة سلاسل نصية في المصفوفة، فيجب دمجها بمسافة.
     */
    content: string[];
}

/**
 * فاصل أسطر في الفصل.
 */
interface ChapterLineBreak {
    /**
     * يشير إلى أن المحتوى يمثل فاصل أسطر.
     */
    type: 'line_break';
}

/**
 * يوجد عنوان فرعي باللغة العبرية في أحد الفصول.
 * غالباً ما تُستخدم هذه المعلومات كجزء من المحتوى المعلوماتي الذي ظهر في المخطوطات الأصلية.
 * فعلى سبيل المثال، يحتوي المزمور 49 على العنوان الفرعي العبري "إلى قائد الجوقة. مزمور لبني قورح".
 */
interface ChapterHebrewSubtitle {
    /**
     * يشير هذا إلى أن المحتوى يمثل ترجمة عبرية.
     */
    type: 'hebrew_subtitle';

    /**
     * قائمة المحتويات الموجودة في العنوان الفرعي.
     * يمكن أن يكون كل عنصر في القائمة عبارة عن سلسلة نصية، أو نص منسق، أو مرجع حاشية سفلية.
     */
    content: (string | FormattedText | VerseFootnoteReference)[];
}

/**
 * آية في فصل.
 */
interface ChapterVerse {
    /**
     * يشير ذلك إلى أن المحتوى عبارة عن آية.
     */
    type: 'verse';

    /**
     * رقم الآية.
     */
    number: number;

    /**
     * قائمة محتويات الآية.
     * يمكن أن يكون كل عنصر في القائمة عبارة عن سلسلة نصية، أو نص منسق، أو مرجع حاشية سفلية.
     */
    content: (string | FormattedText | InlineHeading | InlineLineBreak | VerseFootnoteReference)[];
}

/**
 * النص المنسق. أي النص الذي تم تنسيقه بطريقة معينة.
 */
interface FormattedText {
    /**
     * النص المنسق.
     */
    text: string;

    /**
     * ما إذا كان النص يمثل قصيدة.
     * يشير الرقم إلى مستوى المسافة البادئة.
     *
     * شائع في المزامير.
     */
    poem?: number;

    /**
     * ما إذا كان النص يمثل كلمات يسوع.
     */
    wordsOfJesus?: boolean;
}

/**
 * يُعرّف واجهة تمثل عنوانًا مضمنًا في بيت شعري.
 */
interface InlineHeading {
    /**
     * نص العنوان.
     */
    heading: string;
}

/**
 * يُعرّف واجهة تمثل فاصل سطر مضمن في بيت شعري.
 */
interface InlineLineBreak {
    lineBreak: true;
}


/**
 * إشارة إلى حاشية في آية أو عنوان فرعي عبري.
 */
interface VerseFootnoteReference {
    /**
     * رقم تعريف المذكرة.
     */
    noteId: number;
}

/**
 * معلومات حول حاشية سفلية.
 */
interface ChapterFootnote {
    /**
     * رقم تعريف الملاحظة المشار إليها.
     */
    noteId: number;

    /**
     * نص الحاشية.
     */
    text: string;

    /**
     * مرجع الآية للحاشية.
     */
    reference?: {
        chapter: number;
        verse: number;
    };

    /**
     * المتصل الذي ينبغي استخدامه للحاشية السفلية.
     * بالنسبة للحواشي السفلية، فإن "المتصل" هو الحرف المستخدم في النص للإشارة إلى الحاشية السفلية.
     *
     * على سبيل المثال، في النص:
     * مرحباً بالعالم
     *
     * ---- (أ) هذه حاشية.
     *
     * "(أ)" هو المتصل.
     *
     * إذا كانت القيمة "+"، فيجب إنشاء المتصل تلقائيًا.
     * إذا كانت القيمة فارغة، فيجب أن يكون المتصل فارغًا.
     * إذا كانت سلسلة نصية، فيجب أن يكون المتصل هو تلك السلسلة النصية.
     */
    caller: '+' | string | null;
}

/**
 * روابط الصوت لفصل من كتاب.
 */
interface TranslationBookChapterAudioLinks {
    /**
     * قارئ الفصل ورابط URL لملف الصوت.
     */
    [reader: string]: string;
}

/**
 * روابط التوقيت الصوتي لفصل من كتاب.
 */
interface TranslationBookChapterAudioTimingsLinks {
    /**
     * قارئ الفصل ورابط واجهة برمجة التطبيقات (API) لملف التوقيتات الصوتية الخاص بهذا القارئ.
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

## احصل على توقيتات الصوت للفصل

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.{reader}.audioTimings.json`

يُتيح هذا البرنامج الحصول على التوقيت الصوتي لكل آية من فصل واحد، وذلك لسرد قارئ واحد لها - أي الوقت (بالثواني، نسبةً إلى بداية ملف الصوت الخاص بذلك القارئ) الذي تبدأ عنده كل آية. ويمكن للمستخدمين استخدام هذه الميزة لتمييز الآية التي تُقرأ حاليًا أثناء تشغيل الصوت.

بعض الترجمات والقراء فقط لديهم توقيتات صوتية. الفصل الذي يحتوي على هذه التوقيتات لأحد القراء يرتبط بهذا الملف من خلال مدخل في الجدول `thisChapterAudioTimings` ، مفهرسًا بمعرف ذلك القارئ؛ عندما لا يكون القارئ مفتاحًا في تلك الخريطة، فإن هذا الملف غير موجود لذلك القارئ والفصل.

-   `translation` هو معرف الترجمة (على سبيل المثال `BSB` ).
-   `book` هو معرف الكتاب (على سبيل المثال `GEN` لسفر التكوين - يمكنك العثور على قائمة بمعرفات الكتب [هنا](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` هو رقم الفصل (على سبيل المثال `1` للفصل الأول).
-   `reader` هو معرف القارئ الذي تم تحديد التوقيتات لسرده (على سبيل المثال `hays` ) - القراء المتاحون لفصل ما هم مفاتيح `thisChapterAudioLinks` .

نهاية الآية هي بداية الآية التالية (أو، بالنسبة للآية الأخيرة، نهاية الملف الصوتي)، لذلك لا يحتاج العميل إلى أي شيء يتجاوز القائمة المرتبة لأوقات البدء لإنشاء نطاقات التمييز للفصل بأكمله.

هذا الملف هو نفسه بغض النظر عما إذا تم الوصول إليه من نقطة نهاية الفصل العادية أو [المبسطة](./simplified.md#get-a-simplified-chapter-from-a-translation) - فهناك مجموعة واحدة فقط من التوقيتات لكل ترجمة وكتاب وفصل وقارئ.

### مثال برمجي

::: code-tabsلغة عامية

@tab جافا سكريبت

```ts:no-line-numbers title="fetch-chapter-audio-timings.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;
const reader = 'hays';

// احصل على التوقيتات الصوتية لسفر التكوين 1 (BSB)، كما قرأها "hays"
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

### بناء

```typescript:no-line-numbers title="chapter-audio-timings.ts"
/**
 * يحدد التوقيتات الصوتية لفصل من كتاب، لقارئ واحد.
 * يتم ربطها بنقطة النهاية /api/{translation}/{book}/{chapter}.{reader}.audioTimings.json.
 */
export interface TranslationBookChapterAudioTimings {
    /**
     * معرّف الترجمة.
     */
    translationId: string;

    /**
     * رقم تعريف الكتاب.
     */
    bookId: string;

    /**
     * رقم الفصل.
     */
    chapterNumber: number;

    /**
     * معرف القارئ الذي تُخصص له هذه التوقيتات.
     */
    reader: string;

    /**
     * رابط ملف الصوت الذي تشير إليه هذه التوقيتات.
     */
    audioLink: string;

    /**
     * رابط المعلومات الخاصة بهذا الفصل.
     */
    thisChapterLink: string;

    /**
     * رابط معلومات الفصل التالي.
     * لا شيء إذا كان هذا هو الفصل الأخير في الترجمة.
     */
    nextChapterLink: string | null;

    /**
     * رابط معلومات الفصل السابق.
     * لا شيء إذا كان هذا هو الفصل الأول في الترجمة.
     */
    previousChapterLink: string | null;

    /**
     * رابط ملف التوقيت الصوتي هذا.
     */
    thisChapterAudioTimingsLink: string;

    /**
     * رابط لمواعيد الفصل التالي، لنفس القارئ.
     * لا شيء إذا كان هذا هو الفصل الأخير في الترجمة.
     */
    nextChapterAudioTimingsLink: string | null;

    /**
     * رابط لتوقيتات الفصل السابق، لنفس القارئ.
     * لا شيء إذا كان هذا هو الفصل الأول في الترجمة.
     */
    previousChapterAudioTimingsLink: string | null;

    /**
     * الأوقات بالثواني التي يبدأ عندها كل بيت شعري، بالترتيب.
     * الرقم الأول (الفهرس 0) هو الوقت في التسجيل الذي تبدأ فيه الآية الأولى.
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

`verses[0]` هو وقت بدء الآية 1، `verses[1]` هو وقت بدء الآية 2، وهكذا - لذلك في هذا المثال، تبدأ الآية 2 من سفر التكوين 1 (BSB، كما قرأها "hays") بعد 4.32 ثانية من `audioLink` .

## احصل على كلمات الفصل

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.words.json`

يحصل على التعليقات التوضيحية على مستوى الكلمات (أرقام سترونغ وبيانات المصدر ذات الصلة) لفصل واحد.

تتضمن بعض الترجمات فقط شروحًا على مستوى الكلمات. يرتبط الفصل الذي يحتوي على هذه الشروح بهذا الملف بالقيمة `thisChapterWordsLink` ؛ أما إذا كانت هذه الخاصية مفقودة، فهذا يعني أن هذا الملف غير موجود لهذا الفصل.

-   `translation` هو معرف الترجمة (على سبيل المثال `BSB` ).
-   `book` هو معرف الكتاب (على سبيل المثال `GEN` لسفر التكوين - يمكنك العثور على قائمة بمعرفات الكتب [هنا](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` هو رقم الفصل (على سبيل المثال `1` للفصل الأول).

ترتبط كل ملاحظة بنطاق من الأحرف في عنصر واحد من مصفوفة `content` للآية: `contentIndex` هو فهرس العنصر، و `start` و `end` هما إزاحة الأحرف داخل نص ذلك العنصر. `end` غير مشمول، لذا فإن `text.slice(start, end)` هو الكلمة المُعلَّقة.

إن الربط بعنصر محتوى (بدلاً من الآية ككل) يعني أن الإزاحات تظل صحيحة للآيات التي ينقسم محتواها إلى عناصر متعددة، مثل سطور القصيدة وكلمات يسوع ومراجع الحواشي.

### مثال برمجي

::: code-tabsلغة عامية

@tab جافا سكريبت

```ts:no-line-numbers title="fetch-chapter-words.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// استخرج كلمات سفر التكوين 1 من ترجمة BSB
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

### بناء

```typescript:no-line-numbers title="chapter-words.ts"
export interface TranslationBookChapterWords {
    /**
     * معرّف الترجمة.
     */
    translationId: string;

    /**
     * رقم تعريف الكتاب.
     */
    bookId: string;

    /**
     * رقم الفصل.
     */
    chapterNumber: number;

    /**
     * رابط المعلومات الخاصة بهذا الفصل.
     */
    thisChapterLink: string;

    /**
     * رابط معلومات الفصل التالي.
     * لا شيء إذا كان هذا هو الفصل الأخير في الترجمة.
     */
    nextChapterLink: string | null;

    /**
     * رابط معلومات الفصل السابق.
     * لا شيء إذا كان هذا هو الفصل الأول في الترجمة.
     */
    previousChapterLink: string | null;

    /**
     * رابط ملف الكلمات هذا.
     */
    thisChapterWordsLink: string;

    /**
     * رابط كلمات الفصل التالي.
     * قيمة فارغة إذا كان هذا هو الفصل الأخير في الترجمة، أو إذا لم يكن للفصل التالي أي تعليقات على مستوى الكلمات.
     */
    nextChapterWordsLink: string | null;

    /**
     * رابط كلمات الفصل السابق.
     * قيمة فارغة إذا كان هذا هو الفصل الأول في الترجمة، أو إذا لم يكن للفصل السابق أي تعليقات على مستوى الكلمات.
     */
    previousChapterWordsLink: string | null;

    /**
     * الكلمات المشروحة لكل آية في الفصل، مرتبة حسب رقم الآية.
     * كل قائمة مرتبة حسب ترتيب ورود الكلمات في الآية.
     */
    verses: {
        [verseNumber: string]: ChapterWord[];
    };
}

interface ChapterWord {
    /**
     * فهرس العنصر في مصفوفة محتوى الآية الذي ينطبق عليه التعليق التوضيحي.
     */
    contentIndex: number;

    /**
     * فهرس الحرف الأول من الكلمة المشروحة في نص عنصر المحتوى.
     */
    start: number;

    /**
     * الفهرس الذي يلي الحرف الأخير من الكلمة المشروحة في نص عنصر المحتوى.
     * أي أن text.slice(start, end) هي الكلمة المشروحة.
     */
    end: number;

    /**
     * رقم (أرقام) سترونغ للكلمة.
     * يتم حذفها إذا لم تقدم الترجمة سوى شروح أخرى للكلمة.
     */
    strongs?: string[];

    /**
     * الصيغة المعجمية (الاقتباسية) للكلمة.
     * يتم حذف النص إذا لم توفر الترجمة نصًا.
     */
    lemma?: string;

    /**
     * رمز تحليل الصرف للكلمة.
     * يتم حذف النص إذا لم توفر الترجمة نصًا.
     */
    morph?: string;

    /**
     * المؤشر إلى الكلمة في النص المصدر، بتنسيق <sourceName> : <location> .
     * يتم حذف النص إذا لم توفر الترجمة نصًا.
     */
    srcloc?: string;

    /**
     * أي تكرار للكلمة الأصلية يمثل هذه الكلمة؟ (يبدأ من 1).
     * يتم حذف النص إذا لم توفر الترجمة نصًا.
     */
    occurrence?: number;

    /**
     * إجمالي عدد مرات ظهور الكلمة المصدرية.
     * يتم حذف النص إذا لم توفر الترجمة نصًا.
     */
    occurrences?: number;
}
```

### مثال

بافتراض وجود فصل يحتوي أول آية فيه على عنصر محتوى واحد:

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

يقوم ملف الكلمات بشرح أحرف ذلك العنصر:

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

أي أن `"In the beginning...".slice(0, 2)` هو `"In"` ، وهو ما صنّفه المصدر بالرقم `G1722` .

## احصل على ترجمة كاملة

`GET https://bible.helloao.org/api/{translation}/complete.json`

يحصل على محتوى الترجمة كاملة.

-   `translation` هو معرف الترجمة (على سبيل المثال `BSB` ).

### مثال برمجي

::: code-tabsلغة عامية

@tab جافا سكريبت

```ts:no-line-numbers title="fetch-translation-complete.js"
const translation = 'BSB';

// احصل على سفر التكوين 1 من ترجمة BSB
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

### بناء

```typescript:no-line-numbers title="complete.ts"
/**
 * يحدد بيانات تنزيل الترجمة الكاملة.
 * يتم الربط بنقطة النهاية /api/:translationId/complete.json.
 */
export interface TranslationComplete {
    /**
     * بيانات الترجمة الوصفية.
     */
    translation: Translation;

    /**
     * القائمة الكاملة للكتب مع جميع فصولها.
     */
    books: TranslationCompleteBook[];
}

/**
 * كتاب مترجم بالكامل للتحميل.
 */
export interface TranslationCompleteBook {
    /**
     * رقم تعريف الكتاب.
     */
    id: string;

    /**
     * اسم الكتاب من الترجمة.
     */
    name: string;

    /**
     * الاسم الشائع للكتاب.
     */
    commonName: string;

    /**
     * عنوان الكتاب.
     */
    title: string | null;

    /**
     * ترتيب الكتاب.
     */
    order: number;

    /**
     * عدد فصول الكتاب.
     */
    numberOfChapters: number;

    /**
     * العدد الإجمالي للآيات في الكتاب.
     */
    totalNumberOfVerses: number;

    /**
     * سواء كان الكتاب منسوباً إلى مصادر غير موثوقة أم لا.
     */
    isApocryphal?: boolean;

    /**
     * القائمة الكاملة للفصول مع جميع محتوياتها.
     */
    chapters: TranslationCompleteChapter[];
}

/**
 * فصل من الترجمة الكاملة المتاحة للتحميل.
 */
export interface TranslationCompleteChapter {
    /**
     * عدد الآيات التي يحتويها الفصل.
     */
    numberOfVerses: number;

    /**
     * روابط لإصدارات صوتية مختلفة للفصل.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * توقيتات الصوت (أوقات بدء كل مقطع، بالثواني) للإصدارات الصوتية المختلفة للفصل.
     *
     * بخلاف `thisChapterAudioTimings` في نقطة نهاية الفصل الفردية (التي ترتبط بـ "الحصول على توقيتات الصوت للفصل" أدناه)، يحتوي هذا على التوقيتات نفسها - لأن الهدف من تنزيل الترجمة الكاملة هو الحصول على كل شيء في ملف واحد.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsMap;

    /**
     * رابط التعليقات التوضيحية على مستوى الكلمات للفصل.
     * يتم حذفها إذا لم يكن للفصل أي تعليقات توضيحية على مستوى الكلمات.
     */
    thisChapterWordsLink?: string;

    /**
     * المعلومات الخاصة بهذا الفصل.
     */
    chapter: ChapterData;
}

/**
 * التوقيتات الصوتية لفصل من كتاب، مضمنة مباشرة بدلاً من ربطها.
 * يربط معرف القارئ بقائمة الأوقات (بالثواني) التي يبدأ فيها كل بيت شعري، حسب ترتيب الأبيات.
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
