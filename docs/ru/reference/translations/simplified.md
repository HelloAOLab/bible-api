# Упрощенный формат

Упрощенный формат для глав, загрузки полных переводов и аннотаций на уровне слов. Для получения информации о переводах и списках книг см. [разделы «Переводы», «Книги» и «Главы»](./README.md) , а для структурированного представления этого же контента используется [стандартный формат](./standard.md) .

## Получите упрощенную главу из перевода.

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.simple.json`

Получает содержимое отдельной главы для заданной книги и перевода, используя упрощенный формат.

В упрощенном формате содержимое каждого стиха представляет собой одну строку, а не список отформатированного контента. Это означает, что вам не нужно самостоятельно составлять текст стиха, что может быть непростой задачей, особенно когда дело касается пробелов. Все, что нельзя представить в виде простой строки — сноски, слова Иисуса, стихи и заголовки, расположенные в середине стиха, — сохраняется в виде смещения внутри этой строки, поэтому ничего не теряется.

Используйте этот адрес электронной почты, если вам нужен текст главы. Используйте [обычный адрес электронной почты главы,](./standard.md#get-a-chapter-from-a-translation) если вам нужно отобразить главу с её исходным форматированием.

-   `translation` — это идентификатор перевода (например `BSB` ).
-   `book` — это идентификатор книги (например, `GEN` для Книги Бытия — список идентификаторов книг можно найти [здесь](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` обозначает номер главы (например, `1` — первая глава).

Главы, содержащие аннотации на уровне слов, ссылаются на них с помощью `thisChapterWordsLink` , который указывает на [упрощенные аннотации](#get-the-words-of-a-chapter-in-the-simplified-format) — те, смещения которых соответствуют тексту в этом файле.

Главы, для которых указаны временные параметры аудиозаписи для каждого читателя, содержат ссылку на них с кодом `thisChapterAudioTimings` , указывающим на [конечную точку для указания временных параметров аудиозаписи](./standard.md#get-the-audio-timings-for-a-chapter) — тот же файл, на который ссылается обычная конечная точка для глав, поскольку временные параметры не зависят от формата главы.

### Пример кода

::: code-tabs#язык

@tab JavaScript

```ts:no-line-numbers title="fetch-simple-chapter.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Получите текст первой главы Книги Бытия из перевода BSB.
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

### Смещения

Все смещения в упрощенном формате — `offset` , `start` и `end` — являются индексами в `text` номере стиха, который их содержит. Они измеряются в единицах кода UTF-16, которые используются в JavaScript ( `String.prototype.length` и `String.prototype.slice()` .

`start` включает диапазон текста, а `end` исключает, поэтому `text.slice(start, end)` возвращает точно тот диапазон текста, который был отмечен. Смещение сноски — это позиция, к которой относится вызывающая сноска, поэтому `text.slice(0, offset)` — это текст, который предшествует ей.

### Структура

```typescript:no-line-numbers title="simple-chapter.ts"
export interface SimpleTranslationBookChapter {
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
     * Ссылка на обычную (неупрощенную) версию этой главы.
     */
    fullChapterApiLink: string;

    /**
     * Ссылки на различные аудиоверсии главы.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * Ссылки на временные параметры различных аудиоверсий главы.
     * См. раздел "Получение временных параметров аудио для главы" в документации по стандартному формату — файл с временными параметрами одинаков независимо от того, к какому формату главы он привязан.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsLinks;

    /**
     * Ссылка на следующую главу в упрощенном формате.
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
     * Ссылка на предыдущую главу в упрощенном формате.
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
     * Количество стихов, содержащихся в главе.
     */
    numberOfVerses: number;

    /**
     * Информация для данной главы.
     */
    chapter: SimpleChapterData;
}

interface SimpleChapterData {
    /**
     * Номер главы.
     */
    number: number;

    /**
     * Содержание главы.
     */
    content: SimpleChapterContent[];

    /**
     * Список сносок, которые не удалось связать со стихом.
     * Сноски, относящиеся к стиху, указываются непосредственно в самом стихе, поэтому этот список обычно пуст.
     */
    footnotes: ChapterFootnote[];
}

/**
 * Тип объединения, представляющий собой отдельный фрагмент контента в упрощенной главе.
 */
type SimpleChapterContent = SimpleChapterHeading | ChapterLineBreak | SimpleChapterVerse | SimpleChapterHebrewSubtitle;

/**
 * Заголовок в главе.
 */
interface SimpleChapterHeading {
    /**
     * Указывает на то, что содержимое представляет собой заголовок.
     */
    type: 'heading';

    /**
     * Текст заголовка.
     */
    text: string;
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
 * Один стих в главе.
 */
interface SimpleChapterVerse {
    /**
     * Указывает на то, что содержание представляет собой стих.
     */
    type: 'verse';

    /**
     * Номер стиха.
     */
    number: number;

    /**
     * Текст стиха.
     * Строки стихов и переносы строк разделяются символами новой строки (\n).
     */
    text: string;

    /**
     * Сноски, встречающиеся в стихе.
     */
    footnotes: SimpleVerseFootnote[];

    /**
     * Заголовки, расположенные в середине стиха.
     * Опускается, если в тексте стиха отсутствуют заголовки.
     */
    headings?: SimpleInlineHeading[];

    /**
     * Диапазоны стихов, представляющие собой слова Иисуса.
     * Опускается, если в стихе нет ни одного слова.
     */
    wordsOfJesus?: SimpleTextRange[];

    /**
     * Диапазоны стихотворного текста, представляющие собой строки поэзии.
     * Опускается, если в стихе нет ни одного слова.
     */
    poem?: SimplePoemRange[];
}

/**
 * Субтитры на иврите в одной из глав.
 * Зачастую они включаются в качестве информационного контента, который присутствовал в оригинальных рукописях.
 * Например, 49-й псалом имеет еврейский подзаголовок: «Начальнику хора. Псалом сынов Кораха».
 */
interface SimpleChapterHebrewSubtitle extends Omit<SimpleChapterVerse, 'type' | 'number'> {
    /**
     * Указывает на то, что контент представляет собой субтитры на иврите.
     */
    type: 'hebrew_subtitle';
}

/**
 * Сноска в стихе.
 */
interface SimpleVerseFootnote {
    /**
     * Идентификатор записки.
     */
    noteId: number;

    /**
     * Укажите в тексте стихотворения индекс, на котором следует разместить ссылку на источник.
     */
    offset: number;

    /**
     * Текст сноски.
     */
    text: string;

    /**
     * Адрес, указанный в сноске.
     * Если стоит знак "+", то вызывающий объект должен быть сгенерирован автоматически.
     * Если значение равно null, то вызывающий объект должен быть пустым.
     * Если это строка, то вызывающей стороной должна быть эта строка.
     */
    caller: '+' | string | null;
}

/**
 * Заголовок, встроенный в стихотворение.
 */
interface SimpleInlineHeading {
    /**
     * Указатель в тексте стихотворения, где встречается данный заголовок.
     */
    offset: number;

    /**
     * Текст заголовка.
     */
    text: string;
}

/**
 * Текстовый фрагмент внутри стихотворения.
 */
interface SimpleTextRange {
    /**
     * Индекс первого символа диапазона.
     */
    start: number;

    /**
     * Индекс, следующий за последним символом диапазона.
     */
    end: number;
}

/**
 * Текстовый фрагмент внутри стихотворения, представляющий собой строку поэзии.
 */
interface SimplePoemRange extends SimpleTextRange {
    /**
     * Уровень отступа, с которым должна отображаться строка стихотворения.
     */
    level: number;
}
```

### Пример

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

Стихи и слова Иисуса хранятся в виде диапазонов над текстом стиха. Например, `Matthew 5:3` в переводе `engwebp` выглядит так:

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

## Получите текст главы в упрощенном формате.

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.words.simple.json`

Получает пословные аннотации для одной главы, при этом их смещения переназначаются на текст каждого [упрощенного стиха](#get-a-simplified-chapter-from-a-translation) .

В [обычных аннотациях](./standard.md#get-the-words-of-a-chapter) смещения привязаны к элементам массива `content` стиха, которые в упрощенном формате заменяются одной строкой, поэтому их нельзя использовать с ним. Используйте этот файл при работе с упрощенными главами.

-   `translation` — это идентификатор перевода (например `BSB` ).
-   `book` — это идентификатор книги (например, `GEN` для Книги Бытия — список идентификаторов книг можно найти [здесь](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` обозначает номер главы (например, `1` — первая глава).

В этих записях нет `contentIndex` . `start` и `end` — это смещения относительно `text` -го стиха, точно так же, как смещения в сноске, стихотворении и словах Иисуса в упрощенных главах, поэтому `text.slice(start, end)` это аннотированное слово.

Как и обычные аннотации, они присутствуют только в некоторых переводах. Упрощенная глава, содержащая аннотации, ссылается на этот файл с помощью параметра `thisChapterWordsLink` ; если этот параметр отсутствует, то для данной главы этот файл не существует.

### Пример кода

::: code-tabs#язык

@tab JavaScript

```ts:no-line-numbers title="fetch-simple-chapter-words.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Получите текст первой главы Книги Бытия и слова, которые в ней аннотированы.
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

### Структура

Структура соответствует [стандартным аннотациям](./standard.md#get-the-words-of-a-chapter) , за исключением того, что ссылки указывают на упрощенные файлы, а записи не содержат `contentIndex` .

```typescript:no-line-numbers title="simple-words.ts"
export interface SimpleTranslationBookChapterWords {
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
     * Ссылка на упрощенную главу, к которой относятся эти примечания.
     */
    thisChapterLink: string;

    /**
     * Ссылка на следующую упрощенную главу.
     * Если это последняя глава в переводе, значение должно быть равно нулю.
     */
    nextChapterLink: string | null;

    /**
     * Ссылка на предыдущую упрощенную главу.
     * Если это первая глава в переводе, значение должно быть равно нулю.
     */
    previousChapterLink: string | null;

    /**
     * Ссылка на эти аннотации.
     */
    thisChapterWordsLink: string;

    /**
     * Ссылка на комментарии к следующей главе.
     * Значение null, если это последняя глава перевода или если следующая глава не содержит пояснений на уровне слов.
     */
    nextChapterWordsLink: string | null;

    /**
     * Ссылка на комментарии к предыдущей главе.
     * Значение null, если это первая глава перевода или если в предыдущей главе отсутствуют пояснения к словам.
     */
    previousChapterWordsLink: string | null;

    /**
     * Аннотированные слова для каждого стиха в главе, с указанием номера стиха.
     * Каждый список составлен в порядке появления слов в стихе.
     */
    verses: {
        [verseNumber: string]: SimpleChapterWord[];
    };
}

/**
 * Аннотация на уровне отдельных слов в упрощенной главе.
 */
export interface SimpleChapterWord {
    /**
     * Индекс первого символа аннотированного слова в тексте стиха.
     */
    start: number;

    /**
     * Указатель, следующий за последней буквой аннотированного слова в тексте стиха.
     */
    end: number;

    /**
     * Числа Стронга для этого слова.
     */
    strongs?: string[];

    /**
     * Лемма (словарная форма) слова в языке-источнике.
     */
    lemma?: string;

    /**
     * Морфология слова в языке-источнике.
     */
    morph?: string;

    /**
     * Местоположение слова в исходном тексте.
     */
    srcloc?: string;

    /**
     * В каком именно месте этого стиха встречается данное слово?
     */
    occurrence?: number;

    /**
     * Количество раз, которое это слово встречается в стихе.
     */
    occurrences?: number;
}
```

### Пример

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

В первом стихе этой главы текст равен `"In the beginning was the Word, and the Word was with God, and the Word was God."` , поэтому `text.slice(7, 16)` равно `"beginning"` .

## Получите полный перевод в упрощенном формате.

`GET https://bible.helloao.org/api/{translation}/complete.simple.json`

Получает содержимое всего перевода в упрощенном формате. Это [упрощенный формат глав](#get-a-simplified-chapter-from-a-translation) , применяемый к [загрузке полного перевода](./standard.md#get-an-entire-translation) : один файл, содержащий весь перевод, где содержимое каждого стиха представляет собой одну строку.

Используйте это, если вам нужен текст всего перевода целиком, без необходимости отправлять запрос по каждой главе и без необходимости самостоятельно составлять текст.

-   `translation` — это идентификатор перевода (например `BSB` ).

Этот файл генерируется одновременно с `complete.json` , поэтому при переводе либо присутствуют оба объекта, либо ни один из них. Объект `translation` в обоих файлах содержит `completeTranslationApiLink` и `simpleCompleteTranslationApiLink` , поэтому вы можете переключаться между двумя форматами.

### Пример кода

::: code-tabs#язык

@tab JavaScript

```ts:no-line-numbers title="fetch-translation-complete-simple.js"
const translation = 'BSB';

// Получите полный текст перевода BSB.
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

### Структура

Структура соответствует [стандартному полному переводу, доступному для скачивания](./standard.md#get-an-entire-translation) , за исключением того, что каждая глава использует упрощенный формат.

```typescript:no-line-numbers title="complete-simple.ts"
/**
 * Определяет полный набор данных для загрузки перевода, используя упрощенный формат глав.
 * Сопоставляется с конечной точкой /api/:translationId/complete.simple.json.
 */
export interface SimpleTranslationComplete {
    /**
     * Метаданные перевода.
     */
    translation: Translation;

    /**
     * Полный список книг со всеми их главами.
     */
    books: SimpleTranslationCompleteBook[];
}

/**
 * Книга в полном переводе, доступная для скачивания, с использованием упрощенного формата глав.
 */
export interface SimpleTranslationCompleteBook extends Omit<TranslationCompleteBook, 'chapters'> {
    /**
     * Полный список глав со всем содержанием.
     */
    chapters: SimpleTranslationCompleteChapter[];
}

/**
 * Одна из глав полного перевода, доступного для скачивания, в упрощенном формате.
 */
export interface SimpleTranslationCompleteChapter {
    /**
     * Количество стихов, содержащихся в главе.
     */
    numberOfVerses: number;

    /**
     * Ссылки на различные аудиоверсии главы.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * Продолжительность аудиозаписи (время начала каждого куплета в секундах) для данной главы.
     *
     * Обратите внимание, что полные файлы перевода содержат сами временные параметры (см. TranslationBookChapterAudioTimingsMap в документации по стандартному формату), в отличие от отдельных конечных точек глав, которые содержат ссылки на них.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsMap;

    /**
     * Ссылка на пояснения к главе в упрощенном формате. Опускается, если глава не содержит пояснений.
     */
    thisChapterWordsLink?: string;

    /**
     * Упрощенная информация к главе.
     */
    chapter: SimpleChapterData;
}
```

### Пример

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
