# Стандартный формат

Стандартный формат для глав, загрузки полных переводов и аннотаций на уровне слов. См. [«Переводы, книги и главы»](./README.md) для получения информации о переводах и списках книг, или [упрощенный формат](./simplified.md) для альтернативного представления этого же контента.

## Получить главу из перевода

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`

Получает содержимое отдельной главы для заданной книги и перевода.

-   `translation` — это идентификатор перевода (например `BSB` ).
-   `book` — это идентификатор книги (например, `GEN` для Книги Бытия — список идентификаторов книг можно найти [здесь](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` обозначает номер главы (например, `1` — первая глава).

### Пример кода

::: code-tabs#язык

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Получите первую главу Книги Бытия из перевода BSB.
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

### Структура

```typescript:no-line-numbers title="chapter.ts"
export interface TranslationBookChapter {
    /**
     * Информация для перевода главы книги.
     */
    translation: Translation;

    /**
     * Информация о книге, относящаяся к данной главе.
     */
    book: TranslationBook;

    /**
     * Ссылка на текущую главу.
     */
    thisChapterLink: string;

    /**
     * Ссылки на различные аудиоверсии главы.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * Ссылки на временные параметры различных аудиоверсий главы.
     * Каждая ссылка ведет к файлу с данными о времени воспроизведения аудио для соответствующего читателя — см. раздел «Получить данные о времени воспроизведения аудио для главы» ниже.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsLinks;

    /**
     * Ссылка на следующую главу.
     * Если это последняя глава в переводе, значение должно быть равно нулю.
     */
    nextChapterApiLink: string | null;

    /**
     * Ссылки на различные аудиоверсии следующей главы.
     * Если это последняя глава в переводе, значение должно быть равно нулю.
     */
    nextChapterAudioLinks: TranslationBookChapterAudioLinks | null;

    /**
     * Ссылки на временные параметры различных аудиоверсий для следующей главы.
     * Если это последняя глава в переводе, значение должно быть равно нулю.
     */
    nextChapterAudioTimings: TranslationBookChapterAudioTimingsLinks | null;

    /**
     * Ссылка на предыдущую главу.
     * Если это первая глава в переводе, значение должно быть равно нулю.
     */
    previousChapterApiLink: string | null;

    /**
     * Ссылки на различные аудиоверсии предыдущей главы.
     * Если это первая глава в переводе, значение должно быть равно нулю.
     */
    previousChapterAudioLinks: TranslationBookChapterAudioLinks | null;

    /**
     * Ссылки на временные параметры различных аудиоверсий из предыдущей главы.
     * Если это первая глава в переводе, значение должно быть равно нулю.
     */
    previousChapterAudioTimings: TranslationBookChapterAudioTimingsLinks | null;

    /**
     * Ссылка на пояснения к главе на уровне отдельных слов.
     * Опускается, если в главе отсутствуют пояснения на уровне слов.
     */
    thisChapterWordsLink?: string;

    /**
     * Ссылка на пояснения к следующей главе.
     * Эта аннотация опущена, если это последняя глава в переводе или если следующая глава не содержит пояснений к словам.
     */
    nextChapterWordsLink?: string;

    /**
     * Ссылка на аннотации к предыдущему разделу (на уровне слов).
     * Эта аннотация опущена, если это первая глава перевода или если в предыдущей главе отсутствуют пояснения к отдельным словам.
     */
    previousChapterWordsLink?: string;

    /**
     * Количество стихов, содержащихся в главе.
     */
    numberOfVerses: number;

    /**
     * Ссылка на упрощенную версию этой главы.
     * Опускается, если упрощенные главы недоступны.
     */
    simpleChapterApiLink?: string;

    /**
     * Информация для данной главы.
     */
    chapter: ChapterData;
}

interface ChapterData {
    /**
     * Номер главы.
     */
    number: number;

    /**
     * Содержание главы.
     */
    content: ChapterContent[];

    /**
     * Список сносок к главе.
     */
    footnotes: ChapterFootnote[];
}

/**
 * Тип объединения, представляющий собой отдельный фрагмент содержимого главы.
 * Содержание главы может представлять собой один из следующих элементов:
 * - Заголовок.
 * - Разрыв строки.
 * — Стих.
 * — Субтитры на иврите.
 */
type ChapterContent = ChapterHeading | ChapterLineBreak | ChapterVerse | ChapterHebrewSubtitle;

/**
 * Заголовок в главе.
 */
interface ChapterHeading {
    /**
     * Указывает на то, что содержимое представляет собой заголовок.
     */
    type: 'heading';

    /**
     * Содержание заголовка.
     * Если массив содержит несколько строк, их следует объединить пробелом.
     */
    content: string[];
}

/**
 * Разрыв строки в главе.
 */
interface ChapterLineBreak {
    /**
     * Указывает, что содержимое представляет собой перенос строки.
     */
    type: 'line_break';
}

/**
 * Субтитры на иврите в одной из глав.
 * Эти материалы часто используются в качестве информационного контента, который присутствовал в оригинальных рукописях.
 * Например, 49-й псалом имеет еврейский подзаголовок: «Начальнику хора. Псалом сынов Кораха».
 */
interface ChapterHebrewSubtitle {
    /**
     * Указывает на то, что контент представляет собой субтитры на иврите.
     */
    type: 'hebrew_subtitle';

    /**
     * Список содержимого, указанного в подзаголовке.
     * Каждый элемент в списке может представлять собой строку, отформатированный текст или ссылку на сноску.
     */
    content: (string | FormattedText | VerseFootnoteReference)[];
}

/**
 * Один стих в главе.
 */
interface ChapterVerse {
    /**
     * Указывает на то, что содержание представляет собой стих.
     */
    type: 'verse';

    /**
     * Номер стиха.
     */
    number: number;

    /**
     * Список содержания стиха.
     * Каждый элемент в списке может представлять собой строку, отформатированный текст или ссылку на сноску.
     */
    content: (string | FormattedText | InlineHeading | InlineLineBreak | VerseFootnoteReference)[];
}

/**
 * Форматированный текст. То есть текст, отформатированный определенным образом.
 */
interface FormattedText {
    /**
     * Отформатированный текст.
     */
    text: string;

    /**
     * Является ли данный текст стихотворением.
     * Число указывает уровень отступа.
     *
     * Часто встречается в псалмах.
     */
    poem?: number;

    /**
     * Соответствует ли текст словам Иисуса?
     */
    wordsOfJesus?: boolean;
}

/**
 * Определяет интерфейс, представляющий заголовок, встроенный в стихотворение.
 */
interface InlineHeading {
    /**
     * Текст заголовка.
     */
    heading: string;
}

/**
 * Определяет интерфейс, представляющий собой перенос строки, встроенный в текст стиха.
 */
interface InlineLineBreak {
    lineBreak: true;
}


/**
 * Сноска в стихе или субтитр на иврите.
 */
interface VerseFootnoteReference {
    /**
     * Идентификатор записки.
     */
    noteId: number;
}

/**
 * Информация о сноске.
 */
interface ChapterFootnote {
    /**
     * Идентификатор примечания, на которое делается ссылка.
     */
    noteId: number;

    /**
     * Текст сноски.
     */
    text: string;

    /**
     * Стихотворная ссылка для сноски.
     */
    reference?: {
        chapter: number;
        verse: number;
    };

    /**
     * Адрес, указанный в сноске.
     * В случае сносок, «вызывающий символ» — это символ, используемый в тексте для ссылки на сноску.
     *
     * Например, в тексте:
     * Привет, мир!
     *
     * ---- (a) Это сноска.
     *
     * "(a)" обозначает вызывающего абонента.
     *
     * Если стоит знак "+", то вызывающий объект должен быть сгенерирован автоматически.
     * Если значение равно null, то вызывающий объект должен быть пустым.
     * Если это строка, то вызывающей стороной должна быть эта строка.
     */
    caller: '+' | string | null;
}

/**
 * Аудиоссылки на главы книги.
 */
interface TranslationBookChapterAudioLinks {
    /**
     * Список чтецов для главы и ссылка на аудиофайл.
     */
    [reader: string]: string;
}

/**
 * Ссылки на аудиозаписи глав книги.
 */
interface TranslationBookChapterAudioTimingsLinks {
    /**
     * Для чтения главы указан текст, а также ссылка API на файл с временными параметрами аудиозаписи для этого текстового редактора.
     */
    [reader: string]: string;
}
```

### Пример

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

## Узнайте продолжительность аудиосопровождения главы.

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.{reader}.audioTimings.json`

Получает временные параметры аудиозаписи для каждого куплета в рамках одной главы, для одного и того же озвучивания — то есть время (в секундах, относительно начала аудиофайла этого чтеца), с которого начинается каждый куплет. Клиенты могут использовать это для выделения куплета, который в данный момент читается во время воспроизведения аудио.

Только для некоторых переводов и чтецов есть информация о времени воспроизведения аудио. Глава, в которой такая информация есть для конкретного чтеца, ссылается на этот файл с записью в `thisChapterAudioTimings` , ключом к которой является идентификатор этого чтеца; если чтец не является ключом в этой карте, то этот файл для данного чтеца и главы не существует.

-   `translation` — это идентификатор перевода (например `BSB` ).
-   `book` — это идентификатор книги (например, `GEN` для Книги Бытия — список идентификаторов книг можно найти [здесь](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` обозначает номер главы (например, `1` — первая глава).
-   `reader` — это идентификатор читателя, для чьего повествования указаны временные метки (например, `hays` ) — доступные читатели для главы являются ключами ее `thisChapterAudioLinks` .

Конец куплета — это начало следующего куплета (или, для последнего куплета, конец аудиофайла), поэтому клиенту не нужно ничего, кроме упорядоченного списка начальных моментов, чтобы создать диапазоны выделения для всей главы.

Этот файл одинаков независимо от того, получен ли он из обычной или [упрощенной](./simplified.md#get-a-simplified-chapter-from-a-translation) конечной точки главы — для каждого перевода, книги, главы и читателя используется только один набор временных параметров.

### Пример кода

::: code-tabs#язык

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter-audio-timings.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;
const reader = 'hays';

// Получите аудиозапись первой главы Книги Бытия (BSB), озвученную пользователем "hays".
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

### Структура

```typescript:no-line-numbers title="chapter-audio-timings.ts"
/**
 * Задает продолжительность аудиосопровождения главы книги для одного читателя.
 * Сопоставляется с конечной точкой /api/{translation}/{book}/{chapter}.{reader}.audioTimings.json.
 */
export interface TranslationBookChapterAudioTimings {
    /**
     * Идентификатор перевода.
     */
    translationId: string;

    /**
     * Идентификатор книги.
     */
    bookId: string;

    /**
     * Номер главы.
     */
    chapterNumber: number;

    /**
     * Идентификатор считывателя, для которого предназначены эти временные параметры.
     */
    reader: string;

    /**
     * Ссылка на аудиофайл, для которого предназначены эти временные параметры.
     */
    audioLink: string;

    /**
     * Ссылка на информацию по данной главе.
     */
    thisChapterLink: string;

    /**
     * Ссылка на информацию к следующей главе.
     * Если это последняя глава в переводе, значение должно быть равно нулю.
     */
    nextChapterLink: string | null;

    /**
     * Ссылка на информацию из предыдущей главы.
     * Если это первая глава в переводе, значение должно быть равно нулю.
     */
    previousChapterLink: string | null;

    /**
     * Ссылка на этот аудиофайл с временными параметрами.
     */
    thisChapterAudioTimingsLink: string;

    /**
     * Ссылка на расписание выхода следующей главы для того же читателя.
     * Если это последняя глава в переводе, значение должно быть равно нулю.
     */
    nextChapterAudioTimingsLink: string | null;

    /**
     * Ссылка на расписание предыдущей главы для того же читателя.
     * Если это первая глава в переводе, значение должно быть равно нулю.
     */
    previousChapterAudioTimingsLink: string | null;

    /**
     * Время начала каждого куплета в секундах, в порядке следования.
     * Первая цифра (индекс 0) обозначает момент времени в записи, с которого начинается первый куплет.
     */
    verses: number[];
}
```

### Пример

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

`verses[0]` — это время начала первого стиха, `verses[1]` — время начала второго стиха и так далее — таким образом, в этом примере второй стих Бытия 1 (BSB, как читает "hays") начинается через 4,32 секунды после `audioLink` .

## Найдите текст главы.

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.words.json`

Получает аннотации на уровне слов (номера Стронга и связанные с ними исходные данные) для отдельной главы.

Только некоторые переводы содержат аннотации на уровне слов. Глава, в которой они есть, ссылается на этот файл с помощью `thisChapterWordsLink` ; если это свойство отсутствует, то для данной главы этот файл не существует.

-   `translation` — это идентификатор перевода (например `BSB` ).
-   `book` — это идентификатор книги (например, `GEN` для Книги Бытия — список идентификаторов книг можно найти [здесь](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` обозначает номер главы (например, `1` — первая глава).

Каждая аннотация привязана к диапазону символов в одном элементе `content` массива стиха: `contentIndex` — это индекс элемента, а `start` `end` смещения символов в тексте этого элемента. `end` исключает этот диапазон, поэтому `text.slice(start, end)` — это аннотированное слово.

Привязка к конкретному элементу содержания (а не к стиху в целом) означает, что смещения остаются корректными для стихов, содержание которых разделено на несколько элементов, таких как строки стихотворения, слова Иисуса и ссылки в сносках.

### Пример кода

::: code-tabs#язык

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter-words.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Найдите текст первой главы Книги Бытия в переводе BSB.
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

### Структура

```typescript:no-line-numbers title="chapter-words.ts"
export interface TranslationBookChapterWords {
    /**
     * Идентификатор перевода.
     */
    translationId: string;

    /**
     * Идентификатор книги.
     */
    bookId: string;

    /**
     * Номер главы.
     */
    chapterNumber: number;

    /**
     * Ссылка на информацию по данной главе.
     */
    thisChapterLink: string;

    /**
     * Ссылка на информацию к следующей главе.
     * Если это последняя глава в переводе, значение должно быть равно нулю.
     */
    nextChapterLink: string | null;

    /**
     * Ссылка на информацию из предыдущей главы.
     * Если это первая глава в переводе, значение должно быть равно нулю.
     */
    previousChapterLink: string | null;

    /**
     * Ссылка на этот текстовый файл.
     */
    thisChapterWordsLink: string;

    /**
     * Ссылка на текст следующей главы.
     * Значение null, если это последняя глава перевода или если следующая глава не содержит пояснений на уровне слов.
     */
    nextChapterWordsLink: string | null;

    /**
     * Ссылка на текст предыдущей главы.
     * Значение null, если это первая глава перевода или если в предыдущей главе отсутствуют пояснения к словам.
     */
    previousChapterWordsLink: string | null;

    /**
     * Аннотированные слова для каждого стиха в главе, с указанием номера стиха.
     * Каждый список составлен в порядке появления слов в стихе.
     */
    verses: {
        [verseNumber: string]: ChapterWord[];
    };
}

interface ChapterWord {
    /**
     * Индекс элемента в массиве содержимого стиха, к которому относится аннотация.
     */
    contentIndex: number;

    /**
     * Индекс первого символа аннотированного слова в тексте элемента контента.
     */
    start: number;

    /**
     * Индекс, следующий за последним символом аннотированного слова в тексте элемента контента.
     * То есть, text.slice(start, end) — это аннотированное слово.
     */
    end: number;

    /**
     * Номер (номера) слова по Стронгу.
     * Опускается, если перевод содержал только дополнительные пояснения к слову.
     */
    strongs?: string[];

    /**
     * Словарная (цитационная) форма слова.
     * Если в переводе такой опции не было, она опущена.
     */
    lemma?: string;

    /**
     * Морфологический код разбора слова.
     * Если в переводе такой опции не было, она опущена.
     */
    morph?: string;

    /**
     * Указатель на слово в исходном тексте в формате <sourceName> : <location> .
     * Если в переводе такой опции не было, она опущена.
     */
    srcloc?: string;

    /**
     * В каком случае исходного слова встречается это слово? 1-основано.
     * Если в переводе такой опции не было, она опущена.
     */
    occurrence?: number;

    /**
     * Общее количество вхождений исходного слова.
     * Если в переводе такой опции не было, она опущена.
     */
    occurrences?: number;
}
```

### Пример

Дана глава, первый стих которой содержит всего один содержательный элемент:

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

В текстовом файле содержатся аннотации к символам данного элемента:

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

То есть `"In the beginning...".slice(0, 2)` равно `"In"` , которое в источнике обозначено как `G1722` .

## Получить полный перевод

`GET https://bible.helloao.org/api/{translation}/complete.json`

Получает содержимое всего перевода.

-   `translation` — это идентификатор перевода (например `BSB` ).

### Пример кода

::: code-tabs#язык

@tab JavaScript

```ts:no-line-numbers title="fetch-translation-complete.js"
const translation = 'BSB';

// Получите первую главу Книги Бытия из перевода BSB.
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

### Структура

```typescript:no-line-numbers title="complete.ts"
/**
 * Определяет полный набор данных для загрузки перевода.
 * Сопоставляется с конечной точкой /api/:translationId/complete.json.
 */
export interface TranslationComplete {
    /**
     * Метаданные перевода.
     */
    translation: Translation;

    /**
     * Полный список книг со всеми их главами.
     */
    books: TranslationCompleteBook[];
}

/**
 * Книга в полном переводе (скачать).
 */
export interface TranslationCompleteBook {
    /**
     * Идентификатор книги.
     */
    id: string;

    /**
     * Название книги из перевода.
     */
    name: string;

    /**
     * Общепринятое название книги.
     */
    commonName: string;

    /**
     * Название книги.
     */
    title: string | null;

    /**
     * Порядок книг.
     */
    order: number;

    /**
     * Количество глав в книге.
     */
    numberOfChapters: number;

    /**
     * Общее количество стихов в книге.
     */
    totalNumberOfVerses: number;

    /**
     * Является ли эта книга апокрифической.
     */
    isApocryphal?: boolean;

    /**
     * Полный список глав со всем содержанием.
     */
    chapters: TranslationCompleteChapter[];
}

/**
 * Одна из глав полного перевода, доступного для скачивания.
 */
export interface TranslationCompleteChapter {
    /**
     * Количество стихов, содержащихся в главе.
     */
    numberOfVerses: number;

    /**
     * Ссылки на различные аудиоверсии главы.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * Указана продолжительность звучания (время начала каждого куплета в секундах) для различных аудиоверсий главы.
     *
     * В отличие от значения `thisChapterAudioTimings` в адресе отдельной главы (которое ведет к ссылке "Получить временные параметры аудио для главы" ниже), здесь содержатся сами временные параметры, поскольку цель загрузки полного перевода — собрать все в одном файле.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsMap;

    /**
     * Ссылка на пояснения к главе на уровне отдельных слов.
     * Опускается, если в главе отсутствуют пояснения на уровне слов.
     */
    thisChapterWordsLink?: string;

    /**
     * Информация для данной главы.
     */
    chapter: ChapterData;
}

/**
 * Продолжительность аудиосопровождения главы книги, встроенная непосредственно в текст, а не по ссылке.
 * Сопоставляет идентификатор читателя со списком временных меток (в секундах), с которых начинается каждый куплет, в порядке следования стихов.
 */
interface TranslationBookChapterAudioTimingsMap {
    [reader: string]: number[];
}
```

### Пример

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
