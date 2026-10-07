# Переводы, книги и главы

Конечные точки для просмотра переводов, отображения списка книг и получения содержимого глав.

Содержание глав, полные переводы для скачивания и аннотации по словам доступны в двух форматах:

-   [**Стандартный формат**](./standard.md) — оригинальный, структурированный формат. Содержание стихов представляет собой список элементов (простой текст, отформатированный текст, ссылки на сноски и т. д.), которые вы составляете самостоятельно.
-   [**Упрощенный формат**](./simplified.md) — это сглаженный формат, в котором содержимое каждого стиха представляет собой единую строку, а сноски, стихи и другая разметка выражены в виде смещений внутри этой строки.

Используйте тот формат, который лучше всего подходит для того, как вы планируете отображать или обрабатывать текст.

## Доступные переводы

`GET https://bible.helloao.org/api/available_translations.json`

Получает список доступных переводов в API.

### Пример кода

::: code-tabs#язык

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

### Структура

```typescript:no-line-numbers title="available-translations.ts"
export interface AvailableTranslations {
    /**
     * Список переводов.
     */
    translations: Translation[];
}

interface Translation {
    /**
     * Идентификатор перевода.
     */
    id: string;

    /**
     * Название перевода.
     * Обычно это название перевода на языке, на котором он был сделан.
     */
    name: string;

    /**
     * Английское название перевода.
     */
    englishName: string;

    /**
     * Сайт для перевода.
     */
    website: string;

    /**
     * URL-адрес, по которому можно найти лицензию на перевод.
     */
    licenseUrl: string;

    /**
     * Сокращенное название перевода.
     */
    shortName: string;

    /**
     * Основной языковый тег ISO 639, состоящий из 3 букв.
     */
    language: string;

    /**
     * Получает название языка, на котором выполнен перевод.
     * Если название языка неизвестно, оно должно быть равно null или undefined.
     */
    languageName?: string;

    /**
     * Получает название языка на английском языке.
     * Если язык не имеет английского названия, значение равно null или undefined.
     */
    languageEnglishName?: string;

    /**
     * Направление, в котором пишется язык.
     * "ltr" означает, что текст пишется слева направо.
     * "rtl" означает, что текст пишется справа налево по странице.
     */
    textDirection: 'ltr' | 'rtl';

    /**
     * Доступный список форматов.
     */
    availableFormats: ('json' | 'usfm')[];

    /**
     * Ссылка на API со списком доступных для перевода книг.
     */
    listOfBooksApiLink: string;

    /**
     * Количество книг, включенных в этот перевод.
     *
     * Полные переводы должны содержать такое же количество книг, как и Библия (66).
     */
    numberOfBooks: number;

    /**
     * Общее количество глав, содержащихся в этом переводе.
     *
     * Полные переводы должны содержать такое же количество глав, как и Библия (1189).
     */
    totalNumberOfChapters: number;

    /**
     * Общее количество стихов, содержащихся в этом переводе.
     *
     * Полные переводы должны содержать такое же количество стихов, как и Библия (около 31 102 — в некоторых переводах стихи исключаются на основании вероятной возможности их наличия в оригинальных текстах).
     */
    totalNumberOfVerses: number;

    /**
     * Общее количество апокрифических книг, содержащихся в этом переводе.
     * Опускается, если перевод не включает апокрифы.
     */
    numberOfApocryphalBooks?: number;

    /**
     * Общее количество апокрифических глав, содержащихся в этом переводе.
     * Опускается, если перевод не включает апокрифы.
     */
    totalNumberOfApocryphalChapters?: number;

    /**
     * общее количество апокрифических стихов, содержащихся в этом переводе.
     * Опускается, если перевод не включает апокрифы.
     */
    totalNumberOfApocryphalVerses?: number;
}
```

### Пример

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

## Список книг в переводе

`GET https://bible.helloao.org/api/{translation}/books.json`

Получает список книг, доступных для данного перевода.

-   `translation` — это идентификатор перевода (например `BSB` ).

### Пример кода

::: code-tabs#язык

@tab JavaScript

```ts:no-line-numbers title="fetch-books.js"
const translation = 'BSB';

// Получите список книг для перевода BSB.
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

### Структура

```typescript:no-line-numbers title="books.ts"
export interface TranslationBooks {
    /**
     * Информация о переводе книг.
     */
    translation: Translation;

    /**
     * Список книг, доступных для перевода.
     */
    books: TranslationBook[];
}

interface TranslationBook {
    /**
     * Идентификатор книги.
     */
    id: string;

    /**
     * Название, которое было дано книге в результате перевода.
     */
    name: string;

    /**
     * Общепринятое название книги.
     */
    commonName: string;

    /**
     * Название книги.
     * Обычно это более описательный вариант названия книги.
     * Если такой возможности нет, значит, она не была предусмотрена в переводе.
     */
    title: string | null;

    /**
     * Порядковый номер книги в переводе.
     */
    order: number;

    /**
     * Количество глав в книге.
     */
    numberOfChapters: number;

    /**
     * Номер первой главы книги.
     */
    firstChapterNumber: number;

    /**
     * Ссылка на первую главу книги.
     */
    firstChapterApiLink: string;

    /**
     * Номер последней главы книги.
     */
    lastChapterNumber: number;

    /**
     * Ссылка на последнюю главу книги.
     */
    lastChapterApiLink: string;

    /**
     * Количество стихов, содержащихся в книге.
     */
    totalNumberOfVerses: number;

    /**
     * Является ли эта книга апокрифической.
     * Опускается, если перевод является каноническим.
     */
    isApocryphal?: boolean;
}
```

### Пример

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
