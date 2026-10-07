# تنسيق مبسط

التنسيق المبسط للفصول، وتنزيلات الترجمة الكاملة، والتعليقات على مستوى الكلمات. راجع [قسم "الترجمات والكتب والفصول"](./README.md) للاطلاع على نقاط نهاية قائمة الترجمة والكتب، أو [التنسيق القياسي](./standard.md) للعرض الأصلي والمنظم لهذا المحتوى نفسه.

## احصل على فصل مبسط من الترجمة

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.simple.json`

يحصل على محتوى فصل واحد من كتاب معين وترجمته، باستخدام التنسيق المبسط.

في الصيغة المبسطة، يُعرض محتوى كل آية كسلسلة نصية واحدة بدلاً من قائمة بمحتوى مُنسق. هذا يعني أنك لست مضطرًا لكتابة نص الآية بنفسك، وهو أمر قد يكون معقدًا بعض الشيء، خاصةً فيما يتعلق بالتباعد. أي شيء لا يمكن تمثيله بسلسلة نصية بسيطة - كالحواشي، وكلمات يسوع، والشعر، والعناوين التي تظهر في منتصف الآية - يُحفظ كإضافة ضمن تلك السلسلة، فلا يُفقد أي شيء.

استخدم هذه النقطة النهائية عندما تريد نص فصلٍ ما. استخدم [نقطة نهاية الفصل العادية](./standard.md#get-a-chapter-from-a-translation) عندما تريد عرض الفصل بتنسيقه الأصلي.

-   `translation` هو معرف الترجمة (على سبيل المثال `BSB` ).
-   `book` هو معرف الكتاب (على سبيل المثال `GEN` لسفر التكوين - يمكنك العثور على قائمة بمعرفات الكتب [هنا](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` هو رقم الفصل (على سبيل المثال `1` للفصل الأول).

الفصول التي تحتوي على تعليقات توضيحية على مستوى الكلمات ترتبط بها بالرقم `thisChapterWordsLink` ، والذي يشير إلى [التعليقات التوضيحية المبسطة](#get-the-words-of-a-chapter-in-the-simplified-format) - تلك التي تتطابق إزاحاتها مع النص الموجود في هذا الملف.

ترتبط الفصول التي تحتوي على توقيتات صوتية لكل قارئ بها باستخدام `thisChapterAudioTimings` ، والذي يشير إلى [نقطة نهاية التوقيتات الصوتية](./standard.md#get-the-audio-timings-for-a-chapter) - وهو نفس الملف الذي ترتبط به نقطة نهاية الفصل العادية، لأن التوقيتات لا تعتمد على تنسيق الفصل.

### مثال برمجي

::: code-tabsلغة عامية

@tab جافا سكريبت

```ts:no-line-numbers title="fetch-simple-chapter.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// احصل على نص سفر التكوين 1 من ترجمة BSB
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

### الإزاحات

جميع الإزاحات في الصيغة المبسطة - `offset` و `start` و `end` - هي مؤشرات في `text` من الآية التي تحتوي عليها. تُقاس هذه الإزاحات بوحدات ترميز UTF-16، وهي الوحدات المستخدمة في JavaScript `String.prototype.length` `String.prototype.slice()` .

يشير `start` إلى النطاق الكامل، بينما يشير `end` إلى النطاق الكامل، لذا فإن `text.slice(start, end)` يُعيد بالضبط نطاق النص الذي تم تحديده. أما إزاحات الحواشي السفلية فهي موضع النص الذي يسبق الحاشية، لذا فإن `text.slice(0, offset)` يُعيد النص الذي يسبقها.

### بناء

```typescript:no-line-numbers title="simple-chapter.ts"
export interface SimpleTranslationBookChapter {
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
     * الرابط إلى النسخة العادية (غير المبسطة) من هذا الفصل.
     */
    fullChapterApiLink: string;

    /**
     * روابط لإصدارات صوتية مختلفة للفصل.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * روابط التوقيتات الصوتية للإصدارات الصوتية المختلفة للفصل.
     * راجع "الحصول على توقيتات الصوت لفصل ما" في وثائق التنسيق القياسي - ملف التوقيتات هو نفسه بغض النظر عن تنسيق الفصل المرتبط به.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsLinks;

    /**
     * رابط الفصل التالي، بصيغة مبسطة.
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
     * رابط الفصل السابق، بصيغة مبسطة.
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
     * عدد الآيات التي يحتويها الفصل.
     */
    numberOfVerses: number;

    /**
     * المعلومات الخاصة بهذا الفصل.
     */
    chapter: SimpleChapterData;
}

interface SimpleChapterData {
    /**
     * رقم الفصل.
     */
    number: number;

    /**
     * محتوى الفصل.
     */
    content: SimpleChapterContent[];

    /**
     * قائمة الحواشي التي لم يكن من الممكن ربطها بآية.
     * تُدرج الحواشي التي تنتمي إلى الآية في الآية نفسها، لذا فإن هذه القائمة عادة ما تكون فارغة.
     */
    footnotes: ChapterFootnote[];
}

/**
 * نوع من أنواع الاتحاد يمثل جزءًا واحدًا من المحتوى في فصل مبسط.
 */
type SimpleChapterContent = SimpleChapterHeading | ChapterLineBreak | SimpleChapterVerse | SimpleChapterHebrewSubtitle;

/**
 * عنوان في فصل.
 */
interface SimpleChapterHeading {
    /**
     * يشير إلى أن المحتوى يمثل عنوانًا.
     */
    type: 'heading';

    /**
     * نص العنوان.
     */
    text: string;
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
 * آية في فصل.
 */
interface SimpleChapterVerse {
    /**
     * يشير ذلك إلى أن المحتوى عبارة عن آية.
     */
    type: 'verse';

    /**
     * رقم الآية.
     */
    number: number;

    /**
     * نص الآية.
     * يتم فصل أبيات الشعر وفواصل الأسطر بواسطة أحرف سطر جديد (\n).
     */
    text: string;

    /**
     * الحواشي التي تظهر في الآية.
     */
    footnotes: SimpleVerseFootnote[];

    /**
     * العناوين التي تظهر في منتصف الآية.
     * يتم حذفها إذا لم تحتوي الآية على عناوين داخلية.
     */
    headings?: SimpleInlineHeading[];

    /**
     * نطاقات نص الآية التي تمثل كلمات يسوع.
     * يُحذف إذا لم تحتوي الآية على أي منها.
     */
    wordsOfJesus?: SimpleTextRange[];

    /**
     * نطاقات نص الآية التي تمثل أبيات الشعر.
     * يُحذف إذا لم تحتوي الآية على أي منها.
     */
    poem?: SimplePoemRange[];
}

/**
 * يوجد عنوان فرعي باللغة العبرية في أحد الفصول.
 * غالباً ما يتم تضمين هذه المعلومات كمحتوى إعلامي ظهر في المخطوطات الأصلية.
 * فعلى سبيل المثال، يحتوي المزمور 49 على العنوان الفرعي العبري "إلى قائد الجوقة. مزمور لبني قورح".
 */
interface SimpleChapterHebrewSubtitle extends Omit<SimpleChapterVerse, 'type' | 'number'> {
    /**
     * يشير هذا إلى أن المحتوى يمثل ترجمة عبرية.
     */
    type: 'hebrew_subtitle';
}

/**
 * حاشية في بيت شعري.
 */
interface SimpleVerseFootnote {
    /**
     * رقم تعريف المذكرة.
     */
    noteId: number;

    /**
     * الفهرس في نص الآية الذي يجب إدراج مرجع الحاشية عنده.
     */
    offset: number;

    /**
     * نص الحاشية.
     */
    text: string;

    /**
     * المتصل الذي ينبغي استخدامه للحاشية السفلية.
     * إذا كانت القيمة "+"، فيجب إنشاء المتصل تلقائيًا.
     * إذا كانت القيمة فارغة، فيجب أن يكون المتصل فارغًا.
     * إذا كانت سلسلة نصية، فيجب أن يكون المتصل هو تلك السلسلة النصية.
     */
    caller: '+' | string | null;
}

/**
 * عنوان مُضمّن في بيت شعري.
 */
interface SimpleInlineHeading {
    /**
     * الرقم الموجود في نص الآية الذي يظهر فيه العنوان.
     */
    offset: number;

    /**
     * نص العنوان.
     */
    text: string;
}

/**
 * مجموعة من النصوص داخل بيت شعري.
 */
interface SimpleTextRange {
    /**
     * فهرس الحرف الأول من النطاق.
     */
    start: number;

    /**
     * الفهرس الذي يلي الحرف الأخير من النطاق.
     */
    end: number;
}

/**
 * مجموعة من النصوص داخل بيت شعري تمثل سطراً من الشعر.
 */
interface SimplePoemRange extends SimpleTextRange {
    /**
     * مستوى المسافة البادئة التي يجب عرض سطر الشعر بها.
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

تُحفظ القصائد وكلمات يسوع على شكل نطاقات ضمن نص الآية. على سبيل المثال، يبدو `Matthew 5:3` في الترجمة `engwebp` كما يلي:

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

## احصل على كلمات الفصل بصيغة مبسطة

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.words.simple.json`

يحصل على التعليقات التوضيحية على مستوى الكلمات لفصل واحد، مع إعادة تعيين إزاحاتها على نص كل [آية مبسطة](#get-a-simplified-chapter-from-a-translation) .

تُربط الإزاحات في [التعليقات التوضيحية العادية](./standard.md#get-the-words-of-a-chapter) بعناصر المصفوفة `content` للآية، والتي يستبدلها التنسيق المبسط بسلسلة نصية واحدة، لذا لا يمكن استخدامها معه. استخدم هذا الملف بدلاً من ذلك عند العمل مع الفصول المبسطة.

-   `translation` هو معرف الترجمة (على سبيل المثال `BSB` ).
-   `book` هو معرف الكتاب (على سبيل المثال `GEN` لسفر التكوين - يمكنك العثور على قائمة بمعرفات الكتب [هنا](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` هو رقم الفصل (على سبيل المثال `1` للفصل الأول).

لا تحتوي هذه المدخلات على `contentIndex` `start` و `end` عبارة عن إزاحات في `text` من الآية، تمامًا مثل الحاشية السفلية والقصيدة وإزاحات كلمات يسوع في الفصول المبسطة، لذا فإن `text.slice(start, end)` هي الكلمة المشروحة.

كما هو الحال مع التعليقات التوضيحية العادية، لا تحتوي عليها إلا بعض الترجمات. يرتبط الفصل المبسط الذي يحتوي عليها بهذا الملف بالقيمة `thisChapterWordsLink` ؛ وعندما تكون هذه الخاصية مفقودة، فهذا يعني أن هذا الملف غير موجود لهذا الفصل.

### مثال برمجي

::: code-tabsلغة عامية

@tab جافا سكريبت

```ts:no-line-numbers title="fetch-simple-chapter-words.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// احصل على نص سفر التكوين 1 والكلمات المشروحة فيه
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

### بناء

يتطابق الهيكل مع [التعليقات التوضيحية العادية](./standard.md#get-the-words-of-a-chapter) ، باستثناء أن الروابط تشير إلى الملفات المبسطة وأن الإدخالات لا تحتوي على `contentIndex` .

```typescript:no-line-numbers title="simple-words.ts"
export interface SimpleTranslationBookChapterWords {
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
     * الرابط إلى الفصل المبسط الذي تُخصص له هذه التعليقات.
     */
    thisChapterLink: string;

    /**
     * الرابط إلى الفصل المبسط التالي.
     * لا شيء إذا كان هذا هو الفصل الأخير في الترجمة.
     */
    nextChapterLink: string | null;

    /**
     * الرابط إلى الفصل المبسط السابق.
     * لا شيء إذا كان هذا هو الفصل الأول في الترجمة.
     */
    previousChapterLink: string | null;

    /**
     * الرابط إلى هذه التعليقات التوضيحية.
     */
    thisChapterWordsLink: string;

    /**
     * رابط التعليقات التوضيحية للفصل التالي.
     * قيمة فارغة إذا كان هذا هو الفصل الأخير في الترجمة، أو إذا لم يكن للفصل التالي أي تعليقات على مستوى الكلمات.
     */
    nextChapterWordsLink: string | null;

    /**
     * رابط التعليقات التوضيحية للفصل السابق.
     * قيمة فارغة إذا كان هذا هو الفصل الأول في الترجمة، أو إذا لم يكن للفصل السابق أي تعليقات على مستوى الكلمات.
     */
    previousChapterWordsLink: string | null;

    /**
     * الكلمات المشروحة لكل آية في الفصل، مرتبة حسب رقم الآية.
     * كل قائمة مرتبة حسب ترتيب ورود الكلمات في الآية.
     */
    verses: {
        [verseNumber: string]: SimpleChapterWord[];
    };
}

/**
 * شرح تفصيلي على مستوى الكلمات في فصل مبسط.
 */
export interface SimpleChapterWord {
    /**
     * فهرس الحرف الأول من الكلمة المشروحة في نص الآية.
     */
    start: number;

    /**
     * الفهرس الذي يلي الحرف الأخير من الكلمة المشروحة في نص الآية.
     */
    end: number;

    /**
     * أرقام سترونغ للكلمة.
     */
    strongs?: string[];

    /**
     * الجذر اللغوي (الشكل المعجمي) للكلمة في اللغة المصدر.
     */
    lemma?: string;

    /**
     * مورفولوجيا الكلمة في اللغة المصدر.
     */
    morph?: string;

    /**
     * موقع الكلمة في النص الأصلي.
     */
    srcloc?: string;

    /**
     * أي موضع وردت فيه هذه الكلمة في الآية؟
     */
    occurrence?: number;

    /**
     * عدد مرات ورود الكلمة في الآية.
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

الآية 1 من ذلك الفصل تحتوي على النص `"In the beginning was the Word, and the Word was with God, and the Word was God."` ، لذا `text.slice(7, 16)` هو `"beginning"` .

## احصل على ترجمة كاملة بالصيغة المبسطة

`GET https://bible.helloao.org/api/{translation}/complete.simple.json`

يستخرج هذا الملف محتوى الترجمة كاملةً، باستخدام الصيغة المبسطة. هذه هي [صيغة الفصل المبسطة](#get-a-simplified-chapter-from-a-translation) المطبقة على [ملف الترجمة الكامل](./standard.md#get-an-entire-translation) : ملف واحد يحتوي على الترجمة كاملةً، حيث يكون محتوى كل آية عبارة عن سلسلة نصية واحدة.

استخدم هذا عندما تريد نص ترجمة كاملة دون تقديم طلب لكل فصل ودون الحاجة إلى إنشاء النص بنفسك.

-   `translation` هو معرف الترجمة (على سبيل المثال `BSB` ).

يتم إنشاء هذا الملف بالتزامن مع الملف `complete.json` ، لذا فإن الترجمة إما أن تحتوي على كليهما أو لا تحتوي على أي منهما. يحتوي العنصر `translation` في كلا الملفين على العنصرين `completeTranslationApiLink` و `simpleCompleteTranslationApiLink` ، مما يسمح لك بالتنقل بين التنسيقين.

### مثال برمجي

::: code-tabsلغة عامية

@tab جافا سكريبت

```ts:no-line-numbers title="fetch-translation-complete-simple.js"
const translation = 'BSB';

// احصل على نص الترجمة الكاملة لـ BSB
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

### بناء

يتطابق الهيكل مع [التنزيل الكامل للترجمة العادية](./standard.md#get-an-entire-translation) ، باستثناء أن كل فصل يستخدم التنسيق المبسط.

```typescript:no-line-numbers title="complete-simple.ts"
/**
 * يحدد بيانات تنزيل الترجمة الكاملة، باستخدام تنسيق الفصل المبسط.
 * يتم الربط بنقطة النهاية /api/:translationId/complete.simple.json.
 */
export interface SimpleTranslationComplete {
    /**
     * بيانات الترجمة الوصفية.
     */
    translation: Translation;

    /**
     * القائمة الكاملة للكتب مع جميع فصولها.
     */
    books: SimpleTranslationCompleteBook[];
}

/**
 * كتاب مترجم بالكامل، قابل للتحميل، باستخدام تنسيق الفصول المبسط.
 */
export interface SimpleTranslationCompleteBook extends Omit<TranslationCompleteBook, 'chapters'> {
    /**
     * القائمة الكاملة للفصول مع جميع محتوياتها.
     */
    chapters: SimpleTranslationCompleteChapter[];
}

/**
 * فصل من الترجمة الكاملة القابلة للتنزيل، باستخدام تنسيق الفصل المبسط.
 */
export interface SimpleTranslationCompleteChapter {
    /**
     * عدد الآيات التي يحتويها الفصل.
     */
    numberOfVerses: number;

    /**
     * روابط لإصدارات صوتية مختلفة للفصل.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * توقيتات الصوت (أوقات بدء كل مقطع، بالثواني) للفصل.
     *
     * لاحظ أن ملفات الترجمة الكاملة تحتوي على التوقيتات نفسها (انظر TranslationBookChapterAudioTimingsMap في وثائق التنسيق القياسي)، على عكس نقاط نهاية الفصول الفردية، والتي تحتوي على روابط إليها.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsMap;

    /**
     * رابطٌ إلى شروح الكلمات في الفصل، باستخدام الصيغة المبسطة. يُحذف هذا الرابط إذا لم يكن للفصل أي شروح على مستوى الكلمات.
     */
    thisChapterWordsLink?: string;

    /**
     * المعلومات المبسطة للفصل.
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
