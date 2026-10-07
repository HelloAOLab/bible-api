# Наборы данных

Конечные точки для просмотра дополнительных наборов данных по Библии, таких как перекрестные ссылки и библейские сущности (люди, места, события и группы людей), а также для получения информации об их книгах, содержании глав и сущностях.

## Доступные наборы данных

`GET https://bible.helloao.org/api/available_datasets.json`

Получает список доступных в API наборов данных по Библии.

### Пример кода

::: code-tabs#язык

@tab JavaScript

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

### Структура

```typescript:no-line-numbers title="available-datasets.ts"
export interface AvailableDatasets {
    /**
     * Список наборов данных.
     */
    datasets: Dataset[];
}

export interface Dataset {
    /**
     * Идентификатор набора данных.
     */
    id: string;

    /**
     * Название набора данных.
     */
    name: string;

    /**
     * Веб-сайт, на котором размещен набор данных.
     */
    website: string;

    /**
     * URL-адрес, по которому можно найти лицензию на набор данных.
     */
    licenseUrl: string;

    /**
     * Английское название набора данных.
     */
    englishName: string;

    /**
     * Языковой тег ISO 639, состоящий из трех букв, на котором преимущественно представлен набор данных.
     */
    language: string;

    /**
     * Направление, в котором пишется язык.
     * "ltr" означает, что текст пишется слева направо.
     * "rtl" означает, что текст пишется справа налево по странице.
     */
    textDirection: 'ltr' | 'rtl';

    /**
     * Ссылка на API для получения списка доступных книг для этого набора данных.
     */
    listOfBooksApiLink: string;

    /**
     * Доступный список форматов.
     */
    availableFormats: ('json' | 'usfm')[];

    /**
     * Количество книг, содержащихся в этом наборе данных.
     */
    numberOfBooks: number;

    /**
     * Общее количество глав, содержащихся в этом наборе данных.
     */
    totalNumberOfChapters: number;

    /**
     * Общее количество стихов, содержащихся в этом наборе данных.
     */
    totalNumberOfVerses: number;

    /**
     * Общее количество перекрестных ссылок, содержащихся в этом наборе данных.
     */
    totalNumberOfReferences: number;

    /**
     * Получает название языка, на котором представлен набор данных.
     * Если название языка неизвестно, оно должно быть равно null или undefined.
     */
    languageName?: string;

    /**
     * Получает название языка на английском языке.
     * Если язык не имеет английского названия, значение равно null или undefined.
     */
    languageEnglishName?: string;

    /**
     * Ссылки на API для получения списков сущностей в наборе данных.
     * Опускается, если набор данных не содержит соответствующих сущностей.
     */
    listOfPeopleApiLink?: string;
    listOfPlacesApiLink?: string;
    listOfEventsApiLink?: string;
    listOfPeopleGroupsApiLink?: string;

    /**
     * Общее количество объектов, содержащихся в наборе данных.
     * Опускается, если набор данных не содержит соответствующих сущностей.
     */
    totalNumberOfPeople?: number;
    totalNumberOfPlaces?: number;
    totalNumberOfEvents?: number;
    totalNumberOfPeopleGroups?: number;
}
```

### Пример

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

## Список книг в наборе данных

`GET https://bible.helloao.org/api/d/{dataset}/books.json`

Получает список книг, доступных для заданного набора данных.

-   `dataset` идентификатор набора данных (например `open-cross-ref` ).

### Пример кода

::: code-tabs#язык

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-books.js"
const dataset = 'open-cross-ref';

// Получите список книг для набора данных Open Cross-Ref.
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

### Структура

```typescript:no-line-numbers title="dataset-books.ts"
export interface DatasetBooks {
    /**
     * Информация о наборе данных для книг.
     */
    dataset: Dataset;

    /**
     * Список книг, доступных для включения в набор данных.
     */
    books: DatasetBook[];
}

interface DatasetBook {
    /**
     * Идентификатор книги.
     * Соответствует идентификатору соответствующей книги Библии (Бытие, Исход и т. д.).
     */
    id: string;

    /**
     * Порядок книг в Библии.
     */
    order: number;

    /**
     * Номер первой главы книги.
     */
    firstChapterNumber: number;

    /**
     * Ссылка на первую главу книги.
     */
    firstChapterApiLink: string | null;

    /**
     * Номер последней главы книги.
     */
    lastChapterNumber: number | null;

    /**
     * Ссылка на последнюю главу книги.
     */
    lastChapterApiLink: string | null;

    /**
     * Количество глав в книге.
     */
    numberOfChapters: number;

    /**
     * Количество стихов, содержащихся в книге.
     */
    totalNumberOfVerses: number;

    /**
     * Общее количество перекрестных ссылок, содержащихся в этой книге.
     */
    totalNumberOfReferences: number;
}
```

### Пример

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

## Извлечь главу из набора данных

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

Получает содержимое отдельной главы для заданной книги и набора данных.

Для наборов данных с перекрестными ссылками (например, `open-cross-ref` ) глава содержит список перекрестных ссылок для каждого стиха. Для наборов данных с сущностями (например, `theographic` ) глава содержит информацию о людях, местах и ​​событиях, которые упоминаются в главе — см. [Получение сущностей в главе](#get-the-entities-in-a-chapter) .

-   `dataset` идентификатор набора данных (например `open-cross-ref` ).
-   `book` — это идентификатор книги (например, `GEN` для Книги Бытия).
-   `chapter` — это числовой номер главы (например, `1` для первой главы).

### Пример кода

::: code-tabs#язык

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-chapter.js"
const dataset = 'open-cross-ref';
const book = 'GEN';
const chapter = 1;

// Получите первую главу Книги Бытия из набора данных open-cross-ref.
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

### Структура

```typescript:no-line-numbers title="dataset-chapter.ts"
export interface DatasetBookChapter {
    /**
     * Информация о наборе данных для главы книги.
     */
    dataset: Dataset;

    /**
     * Информация о книге, относящаяся к данной главе.
     */
    book: DatasetBook;

    /**
     * Ссылка на эту главу.
     */
    thisChapterLink: string;

    /**
     * Ссылка на следующую главу.
     * Значение null указывает на то, что это последняя глава в наборе данных.
     */
    nextChapterApiLink: string | null;

    /**
     * Ссылка на предыдущую главу.
     * Если это первая глава в наборе данных, значение должно быть равно нулю.
     */
    previousChapterApiLink: string | null;

    /**
     * Количество стихов, содержащихся в главе.
     */
    numberOfVerses: number;

    /**
     * Информация для данной главы.
     */
    chapter: DatasetChapterData;
}

interface DatasetChapterData {
    /**
     * Номер главы.
     */
    number: number;

    /**
     * Содержание главы.
     */
    content: DatasetVerse[];
}

interface DatasetVerse {
    /**
     * Номер стиха.
     */
    verse: number;

    /**
     * Перекрестные ссылки на стих.
     *
     * Отсортировано по баллам, в порядке убывания.
     */
    references: DatasetReference[];
}

interface DatasetReference {
    /**
     * Идентификатор книги, на которую делается ссылка.
     */
    book: string;

    /**
     * Номер главы.
     */
    chapter: number;

    /**
     * Номер стиха.
     * Если присутствует `endVerse` , то это стих, с которого начинается ссылка.
     */
    verse: number;

    /**
     * Стих, на котором заканчивается отсылка.
     */
    endVerse?: number;

    /**
     * Показатель релевантности ссылки.
     */
    score?: number;
}
```

### Пример

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

## Сущности

Некоторые наборы данных, такие как набор данных [«Теографические метаданные Библии»](https://github.com/robertrouse/theographic-bible-metadata) ( `theographic` ), содержат сущности: людей, места, события и группы людей, а также связи между ними и библейскими стихами, в которых они упоминаются.

Наборы данных, содержащие сущности, включают `listOfPeopleApiLink` , `listOfPlacesApiLink` , `listOfEventsApiLink` и `listOfPeopleGroupsApiLink` свойства в своей записи в `/api/available_datasets.json` .

Наборы данных сущностей также предоставляют данные, соответствующие главам: `/api/d/{dataset}/books.json` перечисляет книги, главы которых содержат данные сущностей, а `/api/d/{dataset}/{book}/{chapter}.json` возвращает людей, места и события, которые упоминаются в этой главе, а также номера стихов, где каждое из них упоминается. См. [Получение сущностей в главе](#get-the-entities-in-a-chapter) .

Сущности ссылаются на библейские отрывки, используя те же идентификаторы книг, номера глав и стихов, что и остальная часть API, поэтому их можно комбинировать с любым переводом. Они ссылаются друг на друга с помощью ссылок на сущности:

```typescript:no-line-numbers title="entity-shared.ts"
export interface DatasetEntityRef {
    /**
     * Идентификатор объекта, на который делается ссылка.
     */
    id: string;

    /**
     * Тип сущности, на которую делается ссылка.
     * Соответствует сегменту коллекции API-ссылки сущности, поэтому ссылку можно сформировать как `/api/d/{dataset}/{type}/{id}.json` .
     */
    type: 'people' | 'places' | 'events' | 'groups';

    /**
     * Название объекта, на который делается ссылка.
     */
    name?: string;

    /**
     * Ссылка на API для сущности, на которую делается ссылка.
     */
    apiLink?: string;
}

export interface VerseRef {
    /**
     * Идентификатор книги (GEN, EXO и т. д.).
     */
    book: string;

    /**
     * Номер главы, с которой начинается ссылка.
     */
    chapter: number;

    /**
     * Номер стиха, с которого начинается ссылка.
     */
    verse: number;

    /**
     * Стих, на котором заканчивается отсылка.
     * Последовательные стихи в одной главе объединены в одну ссылку.
     */
    endVerse?: number;
}
```

## Найдите сущности в главе

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

Для наборов данных сущностей функция получает информацию о людях, местах и ​​событиях, которые упоминаются в одной главе, а также номера стихов в главе, где каждое из них упоминается.

-   `dataset` идентификатор набора данных (например `theographic` ).
-   `book` — это идентификатор книги (например, `GEN` для Книги Бытия).
-   `chapter` — это числовой номер главы (например, `1` для первой главы).

Список книг и глав, содержащих данные об сущностях, доступен по адресу `GET https://bible.helloao.org/api/d/{dataset}/books.json` , который имеет ту же структуру, что и [конечная точка набора данных книг](#list-books-in-a-dataset) . Для наборов данных сущностей `totalNumberOfVerses` — это количество стихов, упомянутых хотя бы одной сущностью, а `totalNumberOfReferences` — общее количество упоминаний стихов и сущностей.

### Пример кода

::: code-tabs#язык

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter-entities.js"
const dataset = 'theographic';
const book = 'GEN';
const chapter = 2;

// Узнайте о людях, местах и ​​событиях, упомянутых во второй главе Книги Бытия.
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

### Структура

```typescript:no-line-numbers title="dataset-chapter-entities.ts"
export interface DatasetEntityBookChapter {
    /**
     * Информация о наборе данных для главы книги.
     */
    dataset: Dataset;

    /**
     * Информация о книге, относящаяся к данной главе.
     */
    book: DatasetBook;

    /**
     * Данные об объектах, относящихся к данной главе.
     */
    chapter: DatasetEntityChapterData;

    /**
     * Ссылка на эту главу.
     */
    thisChapterLink: string;

    /**
     * Ссылка на следующую главу.
     * Значение null указывает на то, что это последняя глава в наборе данных.
     */
    nextChapterApiLink: string | null;

    /**
     * Ссылка на предыдущую главу.
     * Если это первая глава в наборе данных, значение должно быть равно нулю.
     */
    previousChapterApiLink: string | null;

    /**
     * Количество людей, мест и событий, упоминаемых в главе.
     */
    numberOfPeople: number;
    numberOfPlaces: number;
    numberOfEvents: number;
}

interface DatasetEntityChapterData {
    /**
     * Номер главы.
     */
    number: number;

    /**
     * Люди, которые появляются в этой главе.
     * Отсортировано по первому куплету, в котором они появляются.
     */
    people: ChapterPerson[];

    /**
     * Места, упомянутые в главе.
     * Отсортировано по первому куплету, в котором они появляются.
     */
    places: ChapterPlace[];

    /**
     * События, описанные в этой главе.
     * Отсортировано по первому куплету, в котором они появляются.
     */
    events: ChapterEvent[];
}

interface ChapterPerson {
    /**
     * Идентификационный номер человека.
     */
    id: string;

    /**
     * Имя человека.
     */
    name: string;

    /**
     * Является ли имя человека собственным именем.
     */
    isProperName?: boolean;

    /**
     * Пол человека.
     */
    gender?: string;

    /**
     * Год рождения человека и год его смерти.
     * Отрицательные числа обозначают годы до нашей эры. Положительные числа обозначают годы нашей эры.
     */
    birthYear?: number;
    deathYear?: number;

    /**
     * Ссылка на API для данного человека.
     */
    apiLink: string;

    /**
     * Номера стихов в главе, в которых упоминается данный человек.
     * Отсортировано в порядке возрастания.
     */
    verses: number[];
}

interface ChapterPlace {
    /**
     * Идентификатор места.
     */
    id: string;

    /**
     * Название места.
     */
    name: string;

    /**
     * Тип географического объекта, к которому относится данное место.
     */
    featureType?: string;

    /**
     * Широта и долгота этого места.
     */
    latitude?: number;
    longitude?: number;

    /**
     * Ссылка на API этого места.
     */
    apiLink: string;

    /**
     * Номера стихов в главе, в которых упоминается это место.
     * Отсортировано в порядке возрастания.
     */
    verses: number[];
}

interface ChapterEvent {
    /**
     * Идентификатор события.
     */
    id: string;

    /**
     * Название мероприятия.
     */
    name: string;

    /**
     * Дата начала мероприятия.
     */
    startDate?: string;

    /**
     * Ссылка на API мероприятия.
     */
    apiLink: string;

    /**
     * Номера стихов в главе, описывающих данное событие.
     * Отсортировано в порядке возрастания.
     */
    verses: number[];
}
```

### Пример

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

## Список людей в наборе данных

`GET https://bible.helloao.org/api/d/{dataset}/people.json`

Получает список людей, доступных для заданного набора данных.

-   `dataset` идентификатор набора данных (например `theographic` ).

### Пример кода

::: code-tabs#язык

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-people.js"
const dataset = 'theographic';

// Получите список людей для набора географических данных.
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

### Структура

```typescript:no-line-numbers title="dataset-people.ts"
export interface DatasetPeople {
    /**
     * Информация из набора данных предназначена для людей.
     */
    dataset: Dataset;

    /**
     * Список людей, доступных для включения в набор данных.
     */
    people: DatasetPersonSummary[];
}

interface DatasetPersonSummary {
    /**
     * Идентификационный номер человека.
     */
    id: string;

    /**
     * Имя человека.
     */
    name: string;

    /**
     * Является ли имя человека собственным именем.
     */
    isProperName?: boolean;

    /**
     * Пол человека.
     */
    gender?: string;

    /**
     * Количество упоминаний данного человека в Библии.
     */
    numberOfReferences: number;

    /**
     * Ссылка на API для данного человека.
     */
    thisPersonApiLink: string;
}
```

### Пример

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

## Как получить человека из набора данных

`GET https://bible.helloao.org/api/d/{dataset}/people/{person}.json`

Получает информацию об отдельном человеке, включая библейские ссылки, в которых он упоминается, а также его отношения с другими людьми, местами, событиями и группами людей.

-   `dataset` идентификатор набора данных (например `theographic` ).
-   `person` идентификатор человека (например `paul_2479` ).

### Пример кода

::: code-tabs#язык

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-person.js"
const dataset = 'theographic';
const person = 'paul_2479';

// Получите информацию о Поле из теографического набора данных.
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

### Структура

```typescript:no-line-numbers title="dataset-person.ts"
export interface DatasetPersonResponse {
    /**
     * Информация о человеке, содержащаяся в наборе данных.
     */
    dataset: Dataset;

    /**
     * Информация о человеке.
     */
    person: DatasetPerson;

    /**
     * Ссылка на API для этого человека.
     */
    thisPersonApiLink: string;
}

interface DatasetPerson {
    /**
     * Идентификационный номер человека.
     */
    id: string;

    /**
     * Имя человека.
     */
    name: string;

    /**
     * Другие имена, которыми называют этого человека.
     */
    alsoCalled?: string[];

    /**
     * Является ли имя человека собственным именем.
     */
    isProperName?: boolean;

    /**
     * Пол человека.
     */
    gender?: string;

    /**
     * Описание человека. Каждая строка представляет собой абзац текста.
     */
    description?: string[];

    /**
     * Год рождения человека и год его смерти.
     * Отрицательные числа обозначают годы до нашей эры. Положительные числа обозначают годы нашей эры.
     */
    birthYear?: number;
    deathYear?: number;

    /**
     * Годы, когда упоминается данный человек (самый ранний и самый поздний).
     */
    minYear?: number;
    maxYear?: number;

    /**
     * Место, где человек родился и умер.
     */
    birthPlace?: DatasetEntityRef;
    deathPlace?: DatasetEntityRef;

    /**
     * Семейные отношения человека.
     */
    father?: DatasetEntityRef[];
    mother?: DatasetEntityRef[];
    partners?: DatasetEntityRef[];
    children?: DatasetEntityRef[];
    siblings?: DatasetEntityRef[];
    halfSiblingsSameMother?: DatasetEntityRef[];
    halfSiblingsSameFather?: DatasetEntityRef[];

    /**
     * Группы людей, к которым принадлежит данный человек.
     */
    memberOf?: DatasetEntityRef[];

    /**
     * События, в которых участвовал данный человек.
     */
    events?: DatasetEntityRef[];

    /**
     * Список библейских источников, в которых упоминается данный человек.
     * Отсортировано по порядку книг, глав и стихов.
     */
    references: VerseRef[];
}
```

### Пример

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

## Список мест в наборе данных

`GET https://bible.helloao.org/api/d/{dataset}/places.json`

Получает список мест, доступных для заданного набора данных.

-   `dataset` идентификатор набора данных (например `theographic` ).

### Структура

```typescript:no-line-numbers title="dataset-places.ts"
export interface DatasetPlaces {
    /**
     * Информация о наборе данных по этим местам.
     */
    dataset: Dataset;

    /**
     * Список мест, доступных для размещения набора данных.
     */
    places: DatasetPlaceSummary[];
}

interface DatasetPlaceSummary {
    /**
     * Идентификатор места.
     */
    id: string;

    /**
     * Название места.
     */
    name: string;

    /**
     * Тип географического объекта, к которому относится данное место.
     * Например, «Город», «Регион», «Гора», «Вода» и т. д.
     */
    featureType?: string;

    /**
     * Широта и долгота этого места.
     */
    latitude?: number;
    longitude?: number;

    /**
     * Количество упоминаний этого места в Библии.
     */
    numberOfReferences: number;

    /**
     * Ссылка на API этого места.
     */
    thisPlaceApiLink: string;
}
```

## Получить место из набора данных

`GET https://bible.helloao.org/api/d/{dataset}/places/{place}.json`

Получает информацию об одном месте, включая библейские упоминания о нем, а также о связанных с ним людях и событиях.

-   `dataset` идентификатор набора данных (например `theographic` ).
-   `place` идентификатор места (например `jerusalem_636` ).

### Структура

```typescript:no-line-numbers title="dataset-place.ts"
export interface DatasetPlaceResponse {
    /**
     * Информация о данном месте в виде набора данных.
     */
    dataset: Dataset;

    /**
     * Информация об этом месте.
     */
    place: DatasetPlace;

    /**
     * Ссылка на API для этого места.
     */
    thisPlaceApiLink: string;
}

interface DatasetPlace {
    /**
     * Идентификатор места.
     */
    id: string;

    /**
     * Название места.
     */
    name: string;

    /**
     * Название места, как оно указано в Библии короля Якова и в Английской стандартной версии.
     */
    kjvName?: string;
    esvName?: string;

    /**
     * Другие названия, под которыми это место известно.
     */
    aliases?: string[];

    /**
     * Тип географического объекта, к которому относится данное место.
     */
    featureType?: string;
    featureSubType?: string;

    /**
     * Широта и долгота данного места, и насколько они точны.
     */
    latitude?: number;
    longitude?: number;
    precision?: string;

    /**
     * Описание места. Каждая строка представляет собой абзац текста.
     */
    description?: string[];

    /**
     * Комментарий авторов набора данных об этом месте.
     */
    comment?: string;

    /**
     * Корневое место этого места.
     * Разные названия одного и того же географического места имеют общий корень.
     */
    rootPlace?: DatasetEntityRef;

    /**
     * Место, копией которого является это место.
     */
    duplicateOf?: DatasetEntityRef;

    /**
     * Люди, которые там побывали, родились или умерли в этом месте.
     */
    people?: DatasetEntityRef[];
    peopleBorn?: DatasetEntityRef[];
    peopleDied?: DatasetEntityRef[];

    /**
     * События, произошедшие в этом месте.
     */
    events?: DatasetEntityRef[];

    /**
     * Список библейских источников, в которых упоминается это место.
     * Отсортировано по порядку книг, глав и стихов.
     */
    references: VerseRef[];
}
```

### Пример

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

## Список событий в наборе данных

`GET https://bible.helloao.org/api/d/{dataset}/events.json`

Получает список событий, доступных для заданного набора данных.

-   `dataset` идентификатор набора данных (например `theographic` ).

### Структура

```typescript:no-line-numbers title="dataset-events.ts"
export interface DatasetEvents {
    /**
     * Информация о наборе данных, относящаяся к событиям.
     */
    dataset: Dataset;

    /**
     * Список событий, доступных для данного набора данных.
     */
    events: DatasetEventSummary[];
}

interface DatasetEventSummary {
    /**
     * Идентификатор события.
     */
    id: string;

    /**
     * Название мероприятия.
     */
    name: string;

    /**
     * Дата начала мероприятия.
     * Отрицательные числа обозначают годы до нашей эры. Положительные числа обозначают годы нашей эры.
     * Для более точных дат используется формат `YYYY-MM-DD` .
     */
    startDate?: string;

    /**
     * Количество библейских ссылок, описывающих это событие.
     */
    numberOfReferences: number;

    /**
     * Ссылка на API мероприятия.
     */
    thisEventApiLink: string;
}
```

## Получение события из набора данных

`GET https://bible.helloao.org/api/d/{dataset}/events/{event}.json`

Получает информацию об отдельном событии, включая библейские ссылки, описывающие его, а также связанных с ним людей, места и группы людей.

-   `dataset` идентификатор набора данных (например `theographic` ).
-   `event` идентификатор события (например `saul-is-converted_326` ).

### Структура

```typescript:no-line-numbers title="dataset-event.ts"
export interface DatasetEventResponse {
    /**
     * Информация о наборе данных, относящихся к мероприятию.
     */
    dataset: Dataset;

    /**
     * Информация о мероприятии.
     */
    event: DatasetEvent;

    /**
     * Ссылка на API для этого мероприятия.
     */
    thisEventApiLink: string;
}

interface DatasetEvent {
    /**
     * Идентификатор события.
     */
    id: string;

    /**
     * Название мероприятия.
     */
    name: string;

    /**
     * Дата начала мероприятия.
     */
    startDate?: string;

    /**
     * Продолжительность мероприятия.
     * Например, "1D" означает один день, а "40Y" — сорок лет.
     */
    duration?: string;

    /**
     * Люди, принявшие участие в мероприятии.
     */
    participants?: DatasetEntityRef[];

    /**
     * Места, где произошло это событие.
     */
    locations?: DatasetEntityRef[];

    /**
     * Группы населения, принявшие участие в мероприятии.
     */
    groups?: DatasetEntityRef[];

    /**
     * Мероприятие, частью которого является данное мероприятие.
     */
    partOf?: DatasetEntityRef;

    /**
     * Событие, которое произошло до этого события.
     */
    predecessor?: DatasetEntityRef;

    /**
     * Список библейских источников, описывающих это событие.
     * Отсортировано по порядку книг, глав и стихов.
     */
    references: VerseRef[];
}
```

### Пример

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

## Список групп людей в наборе данных

`GET https://bible.helloao.org/api/d/{dataset}/groups.json`

Получает список групп людей, доступных для заданного набора данных.

-   `dataset` идентификатор набора данных (например `theographic` ).

### Структура

```typescript:no-line-numbers title="dataset-people-groups.ts"
export interface DatasetPeopleGroups {
    /**
     * Информация о наборе данных по группам населения.
     */
    dataset: Dataset;

    /**
     * Список групп людей, доступных для данного набора данных.
     */
    groups: DatasetPeopleGroupSummary[];
}

interface DatasetPeopleGroupSummary {
    /**
     * Идентификатор группы людей.
     */
    id: string;

    /**
     * Название группы людей.
     */
    name: string;

    /**
     * Количество людей, входящих в данную этническую группу.
     */
    numberOfMembers: number;

    /**
     * Ссылка на API для группы пользователей.
     */
    thisPeopleGroupApiLink: string;
}
```

## Получение группы людей из набора данных

`GET https://bible.helloao.org/api/d/{dataset}/groups/{group}.json`

Получает информацию об отдельной этнической группе, включая ее членов и мероприятия, в которых эта группа принимала участие.

-   `dataset` идентификатор набора данных (например `theographic` ).
-   `group` идентификатор группы людей (например `tribe-of-benjamin` ).

### Структура

```typescript:no-line-numbers title="dataset-people-group.ts"
export interface DatasetPeopleGroupResponse {
    /**
     * Информация о наборе данных для данной группы людей.
     */
    dataset: Dataset;

    /**
     * Информация о группе людей.
     */
    group: DatasetPeopleGroup;

    /**
     * Ссылка на API для этой группы людей.
     */
    thisPeopleGroupApiLink: string;
}

interface DatasetPeopleGroup {
    /**
     * Идентификатор группы людей.
     */
    id: string;

    /**
     * Название группы людей.
     */
    name: string;

    /**
     * Люди, являющиеся членами данной этнической группы.
     */
    members?: DatasetEntityRef[];

    /**
     * Мероприятия, в которых участвовала эта группа людей.
     */
    events?: DatasetEntityRef[];

    /**
     * Список библейских источников, в которых упоминается эта группа людей.
     * Отсортировано по порядку книг, глав и стихов.
     */
    references: VerseRef[];
}
```

### Пример

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
