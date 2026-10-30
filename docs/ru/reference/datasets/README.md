# Наборы данных

Конечные точки для просмотра дополнительных наборов данных по Библии, таких как перекрестные ссылки, библейские сущности (люди, места, события и группы людей), межстрочные слова на языке оригинала, лексиконы и варианты стихов дня, а также для получения информации о книгах, содержании глав, сущностях, лексиконах и категориях стихов.

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
     * Примечания к лицензии, добавленные через API.
     * Если примечания отсутствуют, значение равно null или undefined.
     */
    licenseNotes?: string | null;

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
     * 0 для наборов данных, не содержащих перекрестных ссылок.
     */
    totalNumberOfReferences: number;

    /**
     * Общее количество подстрочных слов, содержащихся в этом наборе данных.
     * Опускается, если набор данных не содержит подстрочных слов.
     */
    totalNumberOfWords?: number;

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

    /**
     * Ссылка на API для получения списка лексических записей в наборе данных.
     * Опускается, если набор данных не содержит лексических записей.
     */
    listOfLexiconApiLink?: string;

    /**
     * Общее количество лексических записей, содержащихся в наборе данных.
     * Опускается, если набор данных не содержит лексических записей.
     */
    totalNumberOfLexicon?: number;

    /**
     * Ссылка на API для получения списка всех стихов в наборе данных с указанием их категорий.
     * Опускается, если стихи в наборе данных не имеют категорий.
     */
    listOfVersesApiLink?: string;

    /**
     * Ссылка на API для получения списка категорий стихов в наборе данных.
     * Опускается, если набор данных не содержит категорий стихов.
     */
    listOfCategoriesApiLink?: string;

    /**
     * Общее количество категорий стихов, содержащихся в наборе данных.
     * Опускается, если набор данных не содержит категорий стихов.
     */
    totalNumberOfCategories?: number;
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

Для наборов данных с перекрестными ссылками (например, `open-cross-ref` ) глава содержит список перекрестных ссылок для каждого стиха. Для наборов данных с межстрочными ссылками (например, `bsb-interlinear` ) глава содержит слова каждого стиха на языке оригинала — см. [Межстрочные наборы данных](#interlinear-datasets) . Для наборов данных с сущностями (например, `theographic` ) глава содержит людей, места и события, которые упоминаются в главе — см. [Получение сущностей в главе](#get-the-entities-in-a-chapter) . Для набора данных `verse-of-the-day` глава содержит варианты стиха дня в главе и их категории — см. [Стих дня](#verse-of-the-day) .

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

/**
 * Стих обозначается как `references` (в наборах данных для перекрестных ссылок), `words` (в подстрочных наборах данных) или `categories` (в наборе данных «стих дня»).
 * Отметьте, какой из них присутствует, `'words' in verse` или `'categories' in verse` .
 */
type DatasetVerse =
    | DatasetReferencesVerse
    | DatasetWordsVerse
    | DatasetCategoriesVerse;

interface DatasetReferencesVerse {
    /**
     * Номер стиха.
     */
    verse: number;

    /**
     * Перекрестные ссылки к этому стиху.
     *
     * Отсортировано по баллам, в порядке убывания.
     */
    references: DatasetReference[];
}

interface DatasetWordsVerse {
    /**
     * Номер стиха.
     */
    verse: number;

    /**
     * Оригинальные слова стиха в порядке следования в оригинальном тексте.
     * См. раздел «Интерлинейные наборы данных» ниже.
     */
    words: InterlinearWord[];
}

interface DatasetCategoriesVerse {
    /**
     * Номер стиха.
     * Если присутствует `endVerse` , то это стих, с которого начинается отрывок.
     */
    verse: number;

    /**
     * Стих, которым заканчивается данный отрывок.
     * Если запись состоит из одного стиха, она опускается.
     */
    endVerse?: number;

    /**
     * Идентификаторы категорий, к которым относится стих, начиная с наиболее релевантных.
     * См. «Стих дня» ниже.
     */
    categories: string[];

    /**
     * Первый год, когда этот стих может стать стихом дня.
     * Опускается, если стих всегда присутствовал в списке.
     */
    addedIn?: number;

    /**
     * Первый год, когда этот стих уже не может быть стихом дня.
     * Удаленные стихи остаются в наборе данных, чтобы можно было по-прежнему выбирать стихи более ранних лет.
     * Пропускается, если стих не был удален из списка.
     */
    removedIn?: number;
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

// Структуру InterlinearWord см. в разделе «Межстрочные наборы данных» ниже.
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

Набор данных [History Globe](https://historyglobe.app) ( `history-globe` ) содержит только места: места, упомянутые в Библии, с их координатами и стихами, в которых они упоминаются. Его идентификаторы мест (например, `a15257a` для Иерусалима) — это стабильные идентификаторы мест History Globe, те же самые, которые использует его собственный [API открытых данных](https://historyglobe.app/docs/api.html) , поэтому они не меняются при исправлении названия. Его значения `featureType` соответствуют значениям, используемым в наборе данных Theographic ( `City` , `Region` , `Water` и так далее), а `featureSubType` содержит более специфический тип, если таковой имеется (например, `River` , `Gate` , `Spring` ).

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

### Источник: History Globe

Данные History Globe распространяются по лицензии [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) . При использовании укажите History Globe ( https://historyglobe.app ) и данные OpenBible.info Bible Geocoding Data, на которых они основаны, а также отметьте любые изменения. Указание авторства содержится в свойстве `licenseNotes` набора данных.

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
     * Информация о наборе данных для группы людей.
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

## Интерлинейные наборы данных

В подстрочном наборе данных Береанской Библии ( `bsb-interlinear` ) перечислены слова каждого стиха Библии на языке оригинала (иврите, арамейском и греческом) в том порядке, в котором они появляются в оригинальном тексте. Каждое слово имеет свою транслитерацию, грамматический анализ, [номер Стронга](https://en.wikipedia.org/wiki/Strong%27s_Concordance) и английскую фразу, которую [Береанская стандартная Библия](https://berean.bible) использует для него.

В этом наборе данных используются те же конечные точки, что и в других наборах данных:

-   В списке `GET https://bible.helloao.org/api/d/bsb-interlinear/books.json` указаны 66 книг.
-   `GET https://bible.helloao.org/api/d/bsb-interlinear/{book}/{chapter}.json` (например `/api/d/bsb-interlinear/GEN/1.json` ) возвращает главу, при этом `{ verse, words }` соответствует каждому стиху. Ответ представляет собой [набор данных «глава»](#get-a-chapter-from-a-dataset) .

Данные о словах взяты из [подстрочных таблиц стандартной Библии Береана](https://bereanbible.com/) , которые находятся в общественном достоянии. Номера Стронга для слов найдены в [лексиконе](#lexicon) ( `stepbible-lexicon` ).

### Структура

```typescript:no-line-numbers title="interlinear-word.ts"
interface InterlinearWord {
    /**
     * Ранг слова в порядке следования в исходном тексте, начинающийся с 1.
     * Слова перечислены в этом порядке.
     */
    pos: number;

    /**
     * Ранг слова в английском алфавитном порядке, начиная с 1.
     */
    bsbPos: number;

    /**
     * Язык слова.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * Слово из оригинального текста. Нормализовано по NFC.
     */
    text: string;

    /**
     * Транслитерация слова.
     */
    transliteration: string | null;

    /**
     * Краткий грамматический код слова. Например, "N-mp" или "V-Qal-Perf-3ms".
     */
    parsing: string | null;

    /**
     * Грамматический анализ слова с помощью печатных букв.
     */
    parsingFull: string | null;

    /**
     * Номер слова по Стронгу с добавлением нулей. Например, "H0430" или "G3056".
     * Добавлены нули, что соответствует `.words.json` значениям в Библии короля Якова.
     * Для других значений переводов может потребоваться добавление нулей и удаление суффиксов перед объединением.
     * Значение null, если в источнике слово не имеет номера Стронга (это относится к некоторым словам, являющимся суффиксами, например, к суффиксам местоимений).
     */
    strongs: string | null;

    /**
     * В Библии Berean Standard Bible используется английская фраза, обозначающая это слово.
     * Значение null, если BSB оставляет слово без перевода (например, маркер прямого дополнения в иврите).
     */
    gloss: string | null;
}
```

### Пример

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

### Связывание слов с переводом

Значения подстрочного перевода, равные `strongs` , дополняются нулями (например, `H0430` ). Это соответствует значениям `strongs` в аннотациях слов в Библии короля Якова ( `/api/eng_kjv/{book}/{chapter}.words.json` ). Значения других переводов могут потребовать дополнения нулями и удаления суффиксов (например, `H430` или `H1961a` до `H0430` и `H1961` ), прежде чем их можно будет объединить.

-   **KJV.** Для версии короля Якова ( `eng_kjv` и `eng_kja` ) объедините номера Стронга во `.words.json` файле главы с `strongs` подстрочными словами того же стиха. Например, каждый номер Стронга, указанный в `/api/eng_kjv/GEN/1.words.json` для первого стиха ( `H7225` , `H1254` , `H0430` , `H0853` , `H8064` , `H0776` ), появляется как значение `strongs` среди слов первого стиха в `/api/d/bsb-interlinear/GEN/1.json` .
-   **Библия Береанского стандарта.** Цифра `gloss` в каждом слове обозначает фразу BSB для этого слова. Пройдите по словам стиха в порядке `bsbPos` и сопоставьте каждую `gloss` с текстом стиха в переводе BSB, чтобы определить, где находится перевод слова.

Нумерация в двух источниках не всегда совпадает. Например, в KJV теги "was" равны `G2258` , тогда как в таблице Береан — `G1510` Из-за подобных различий некоторые соединения оказываются некорректными.

### Атрибуция

Подстрочные таблицы Береана находятся в общественном достоянии. [Лексикон](#lexicon) распространяется по лицензии CC BY 4.0 и требует указания авторства.

## Лексикон

Набор данных лексикона STEPBible ( `stepbible-lexicon` ) содержит краткие лексиконы иврита, арамейского и греческого языков (TBESH и TBESG) с [сайта STEPBible.org](https://www.stepbible.org/) в Тиндаль-Хаусе, Кембридж. Он содержит одну запись для каждого базового числа Стронга, и каждая запись содержит одно или несколько значений с леммой, транслитерацией, частью речи, английским глоссированием и определением.

Любое значение `strongs` , дополненное нулями, из [межстрочного слова](#interlinear-datasets) , имеющего лексическую запись, можно найти по значению `/api/d/stepbible-lexicon/lexicon/{strongs}.json` без переформатирования. То же самое относится к значениям `.words.json` в Библии короля Якова; значения других переводов могут потребовать предварительного дополнения нулями и удаления суффиксов. Греческие записи, добавленные лексиконом без номера Стронга, не публикуются.

Наборы данных, содержащие лексические записи, включают `listOfLexiconApiLink` и `totalNumberOfLexicon` в свою запись в `/api/available_datasets.json` .

### Атрибуция

Данные лексикона распространяются по лицензии [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) . При использовании указывайте в качестве источника STEPBible.org / Tyndale House, Cambridge и отмечайте любые изменения. Указание авторства содержится в свойстве `licenseNotes` набора данных.

## Список лексических записей в наборе данных

`GET https://bible.helloao.org/api/d/{dataset}/lexicon.json`

Получает список лексических записей, доступных для набора данных.

-   `dataset` идентификатор набора данных (например `stepbible-lexicon` ).

### Пример кода

::: code-tabs#язык

@tab JavaScript

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

### Структура

```typescript:no-line-numbers title="dataset-lexicon.ts"
export interface DatasetLexicon {
    /**
     * Информация о наборе данных для лексикона.
     */
    dataset: Dataset;

    /**
     * Список лексических статей, доступных для данного набора данных.
     */
    lexicon: DatasetLexiconEntrySummary[];
}

export interface DatasetLexiconEntrySummary {
    /**
     * Номер словаря Стронга с добавлением нулей. Например, "H0430".
     */
    id: string;

    /**
     * Язык словарной статьи.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * Название словарной статьи.
     * Это лемма первого значения данной статьи.
     */
    name: string;

    /**
     * Ссылка на API для словарной статьи.
     */
    apiLink: string;
}
```

### Пример

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

## Получение лексической записи из набора данных

`GET https://bible.helloao.org/api/d/{dataset}/lexicon/{strongs}.json`

Получает словарную статью для однобазового числа Стронга со всеми его значениями.

-   `dataset` идентификатор набора данных (например `stepbible-lexicon` ).
-   `strongs` — это число Стронга с добавлением нулей (например, `H0430` для еврейского слова _elohim_ или `G3056` для греческого слова _logos_).

### Пример кода

::: code-tabs#язык

@tab JavaScript

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

### Структура

```typescript:no-line-numbers title="dataset-lexicon-entry.ts"
export interface DatasetLexiconEntry {
    /**
     * Информация о наборе данных для словарной статьи.
     */
    dataset: Dataset;

    /**
     * Словарная статья.
     */
    entry: DatasetLexiconEntryContent;

    /**
     * Ссылка на API для данной лексической статьи.
     */
    thisLexiconEntryApiLink: string;
}

export interface DatasetLexiconEntryContent {
    /**
     * Номер записи в базе данных, дополненный нулями. Например, "H0430".
     */
    id: string;

    /**
     * Язык записи.
     * Это язык, соответствующий первому смыслу данной словарной статьи.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * Смысловые обозначения записи, в порядке идентификации.
     */
    senses: DatasetLexiconSense[];
}

export interface DatasetLexiconSense {
    /**
     * Расширенный идентификатор значения. Например, "H0001G".
     * Равно базовому числу Стронга, когда число имеет одно значение.
     */
    id: string;

    /**
     * Язык чувств.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * Лемма смысла в оригинальном тексте.
     */
    lemma: string;

    /**
     * Транслитерация леммы.
     */
    transliteration: string | null;

    /**
     * Морфологический код части речи, обозначающий смысл.
     */
    partOfSpeech: string | null;

    /**
     * Краткое английское толкование смысла.
     */
    gloss: string | null;

    /**
     * Определение смысла в виде простого текста.
     * Абзацы разделены пустыми строками. Разметка в исходном коде удалена.
     */
    definition: string;
}
```

### Пример

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

## Стих дня

Набор данных «стих дня» ( `verse-of-the-day` ) представляет собой тщательно подобранный список известных стихов и коротких отрывков (не более трех стихов), которые хорошо подходят для «стиха дня»: более 640 для каждого дня года и более 100 для христианских праздников. Каждый из них имеет смысл сам по себе.

Каждый стих на каждый день включает от одной до трех категорий, начиная с наиболее релевантных, из этого фиксированного набора:

| ИДЕНТИФИКАТОР | Описание                                                    |
| ------------- | ----------------------------------------------------------- |
| `comfort`     | Близость и забота Бога в скорби, беде и одиночестве.        |
| `courage`     | Твердо стоять на своем и не бояться.                        |
| `faith`       | Доверяйте Богу и Его обещаниям.                             |
| `forgiveness` | Божье прощение грехов и прощение других.                    |
| `gratitude`   | Благодарение Богу.                                          |
| `guidance`    | Бог направляет наши шаги, планы и решения.                  |
| `hope`        | Уверенность в будущем, обещанном Богом.                     |
| `inspiration` | Призыв жить по вере и творить добро.                        |
| `joy`         | Радость и ликование в Боге.                                 |
| `love`        | Божья любовь к нам и наша любовь к Богу и ближним.          |
| `peace`       | Отдых, спокойствие и избавление от тревоги.                 |
| `praise`      | Поклонение и провозглашение величия Бога.                   |
| `prayer`      | Обращаясь к Богу и Его обещанию услышать.                   |
| `provision`   | Бог обеспечивает нас всем необходимым.                      |
| `salvation`   | Искупление, благодать и новая жизнь во Христе.              |
| `strength`    | Бог дарует силу и выносливость.                             |
| `wisdom`      | Божественная мудрость и практические наставления для жизни. |

Праздники имеют свои собственные категории. В день праздника стих дня — это один из стихов этого праздника, и эти стихи не используются в другие дни. Праздник обычно длится один день; праздник после Воскресения Христова длится три дня после Воскресения Христова, поэтому в нем указаны все три даты. Каждая категория праздников имеет `holiday` рядом с датами: праздники, которые отмечаются в одну и ту же дату каждый год, имеют `month` и `day` , а праздники, дата которых меняется каждый год (поскольку они зависят от Воскресения Христова или Адвента), имеют `dates` в григорианском календаре, рассчитанном на период с 2026 по 2125 год.

| ИДЕНТИФИКАТОР              | Праздничный день           | Дата                                   |
| -------------------------- | -------------------------- | -------------------------------------- |
| `epiphany`                 | Богоявление                | 6 января                               |
| `ash-wednesday`            | Пепельная среда            | За 46 дней до Воскресения Христова     |
| `palm-sunday`              | Вербное воскресенье        | Воскресенье перед Воскресеньем         |
| `maundy-thursday`          | Великий четверг            | Четверг перед Воскресением Христовым   |
| `good-friday`              | Страстная пятница          | Пятница перед Воскресением Христовым   |
| `resurrection-sunday`      | Воскресение Христово       | Пасхальное воскресенье                 |
| `post-resurrection-sunday` | После Воскресения Христова | Три дня после Воскресения Христова     |
| `ascension-day`            | День Вознесения            | 39 дней после Воскресения Христова     |
| `pentecost`                | Пятидесятница              | 49 дней после Воскресения Христова     |
| `all-hallows-eve`          | Канун Дня всех святых      | 31 октября                             |
| `all-saints-day`           | День всех святых           | 1 ноября                               |
| `advent-sunday`            | Первое воскресенье Адвента | Четвёртое воскресенье перед Рождеством |
| `christmas-eve`            | сочельник                  | 24 декабря                             |
| `christmas`                | Рождество                  | 25 декабря                             |

Набор данных содержит только ссылки, а не текст стихов, поэтому он работает с любым переводом. Нумерация стихов использует стандартную английскую нумерацию (такую ​​же, как в системе BSB). Данные можно читать тремя способами:

-   В одном файле перечислены [`/api/d/verse-of-the-day/verses.json`](#list-verses-in-a-dataset) стихи из набора данных с указанием категорий, а также праздники с их датами.
-   В [`/api/d/verse-of-the-day/categories/{category}.json`](#get-a-category-from-a-dataset) перечислены все стихи из каждой категории. Это самый простой способ выбрать стих дня из одной категории.
-   [`/api/d/verse-of-the-day/{book}/{chapter}.json`](#get-a-chapter-from-a-dataset) перечислены кандидаты в каждой главе с указанием их категорий. Доступны только главы, содержащие кандидата; для их поиска используйте ссылки на главы в книге или `/api/d/verse-of-the-day/books.json` .

В наборы данных, содержащие категории стихов, в записи `/api/available_datasets.json` указаны значения `listOfVersesApiLink` , `listOfCategoriesApiLink` и `totalNumberOfCategories` .

### Выбор стиха дня

API состоит из статических файлов, поэтому он не выбирает стих за вас. Вместо этого существует соглашение о выборе стиха, так что каждое приложение, которое его использует, отображает один и тот же стих в один и тот же день. Приложения могут выбирать другие стихи; соглашение просто устанавливает для них общее значение по умолчанию.

В рамках соглашения выбор осуществляется из стихов и праздников, указанных в `/api/d/verse-of-the-day/verses.json` В праздничный день выбирается один из стихов этого праздника, проходя по ним по одному году за раз, поэтому каждый год для праздника используется новый стих, пока не будут использованы все его стихи. В другие дни каждый год происходит собственное перемешивание стихов, используемых в этом году (упорядоченных по хешу ссылки на каждый стих, году и необязательному начальному значению), и стихом дня является тот, который используется в этот день года. В наборе данных содержится более 366 стихов для каждого дня, используемого каждый год, поэтому стих никогда не повторяется в течение календарного года, порядок меняется каждый год, и одна и та же дата всегда дает один и тот же стих. Новые стихи добавляются (с помощью `addedIn` ), а старые удаляются (с помощью `removedIn` ) только из года, который еще не начался, поэтому стих дня для прошедшей даты никогда не меняется.

На странице [«Соглашение о стихе дня»](./verse-of-the-day-convention.md) алгоритм описывается шаг за шагом, с псевдокодом и тестовыми значениями, так что вы можете реализовать его на любом языке.

Чтобы использовать свой собственный порядок, выберите собственное начальное значение (например, название вашего приложения): это даст другой порядок перемешивания с теми же гарантиями. Вы также можете выбрать стихи из одной категории, но в каждой категории стихов меньше, чем дней в году, поэтому стихи в ней повторяются чаще.

SDK соответствуют следующему соглашению:

```ts:no-line-numbers title="verse-of-the-day.js"
import { FreeUseBibleApi } from 'free-use-bible-api';

const api = new FreeUseBibleApi();

// Дата в формате ГГГГ-ММ-ДД или дата (используется ее локальная календарная дата). По умолчанию — сегодняшняя дата.
const ref = await api.getVerseOfTheDay('2026-01-01');

// Получите текст стиха из перевода.
const chapter = await api.getTranslationBookChapter('BSB', ref.book, ref.chapter);
const verses = chapter.chapter.content.filter(
    (c) =>
        c.type === 'verse' &&
        c.number >= ref.verse &&
        c.number <= (ref.endVerse ?? ref.verse)
);
console.log(ref, verses);
```

-   `getVerseOfTheDay(date?, { seed?, category?, dataset? }?)` загружает список стихов и выбирает из него. `pickVerseOfTheDay(verses, date?, { seed?, category? }?)` выбирает из уже имеющегося у вас списка.
-   В SDK Kotlin есть значения `getVerseOfTheDay(date?, seed?, category?)` и `pickVerseOfTheDay(verses, date?, seed?, category?)` , которые принимают дату как строку `YYYY-MM-DD` элементов.
-   В Swift SDK есть `getVerseOfTheDay(date:seed:category:)` и `pickVerseOfTheDay(_:date:seed:category:holidays:)` , которые принимают дату либо в виде строки `YYYY-MM-DD` , либо в виде строки `Date` (используется календарная дата в текущем часовом поясе).
-   [На сервере MCP](https://github.com/HelloAOLab/bible-api/tree/main/packages/seed-bible-mcp) есть `getVerseOfTheDay` , который возвращает стих дня вместе с его текстом.
-   В пакете `@helloao/tools` тот же список, а в `@helloao/tools/generation/verse-of-the-day.js` есть функция `getVerseOfTheDay(date?, { seed?, category? }?)` .

### Лицензия

Список составлен AO Lab и распространяется под [лицензией MIT](https://github.com/HelloAOLab/bible-api/blob/main/LICENSE) . Текст стихотворения берется из того перевода, из которого вы его получаете.

## Список стихов в наборе данных

`GET https://bible.helloao.org/api/d/{dataset}/verses.json`

Получает все стихи (или короткие отрывки) из набора данных, а также категории, к которым каждый из них относится, в каноническом порядке. Доступно только для наборов данных, стихи которых имеют категории, например, `verse-of-the-day` .

-   `dataset` идентификатор набора данных (например `verse-of-the-day` ).

### Пример кода

::: code-tabs#язык

@tab JavaScript

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

### Структура

```typescript:no-line-numbers title="dataset-verses.ts"
export interface DatasetVerses {
    /**
     * Информация о наборе данных для стихов.
     */
    dataset: Dataset;

    /**
     * Каждый стих (или короткий отрывок) в наборе данных, с указанием его категорий, в каноническом порядке.
     */
    verses: DatasetCategorizedVerse[];

    /**
     * Праздники, для которых существуют свои стихи и даты.
     * Опускается, если в наборе данных нет праздников.
     */
    holidays?: DatasetVersesHoliday[];
}

export interface DatasetVersesHoliday extends DatasetCategoryHoliday {
    /**
     * Идентификатор категории праздника, например, "Рождество".
     */
    id: string;

    /**
     * Английское название праздника. Например, "Christmas".
     */
    name: string;
}

export interface DatasetCategoryHoliday {
    /**
     * Месяц (1 для января) и день праздника, который выпадает на одну и ту же дату каждый год.
     * Исключено для праздников, дата которых меняется каждый год.
     */
    month?: number;
    day?: number;

    /**
     * Даты (ГГГГ-ММ-ДД, григорианский календарь) праздника, дата которого меняется каждый год, в порядке убывания.
     * Они рассчитываются заранее для определенного диапазона лет (в настоящее время с 2026 по 2125 год), и праздник отмечается только в указанные даты.
     * Исключено для праздников, которые выпадают на одну и ту же дату каждый год.
     */
    dates?: string[];
}

export interface DatasetCategorizedVerse {
    /**
     * Идентификатор книги, например, "PRO".
     */
    book: string;

    /**
     * Номер главы.
     */
    chapter: number;

    /**
     * Номер стиха.
     * Если присутствует `endVerse` , то это стих, с которого начинается отрывок.
     */
    verse: number;

    /**
     * Стих, которым заканчивается данный отрывок.
     * Если запись состоит из одного стиха, она опускается.
     */
    endVerse?: number;

    /**
     * Идентификаторы категорий, к которым относится стих, начиная с наиболее релевантных.
     */
    categories: string[];

    /**
     * Первый год, когда этот стих может стать стихом дня.
     * Опускается, если стих всегда присутствовал в списке.
     */
    addedIn?: number;

    /**
     * Первый год, когда этот стих уже не может быть стихом дня.
     * Удаленные стихи остаются в наборе данных, чтобы можно было по-прежнему выбирать стихи более ранних лет.
     * Пропускается, если стих не был удален из списка.
     */
    removedIn?: number;
}
```

### Пример

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

## Список категорий в наборе данных

`GET https://bible.helloao.org/api/d/{dataset}/categories.json`

Получает список категорий стихов, доступных для набора данных.

-   `dataset` идентификатор набора данных (например `verse-of-the-day` ).

### Пример кода

::: code-tabs#язык

@tab JavaScript

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

### Структура

```typescript:no-line-numbers title="dataset-categories.ts"
export interface DatasetCategories {
    /**
     * Информация о наборе данных для категорий.
     */
    dataset: Dataset;

    /**
     * Список категорий стихов, доступных для данного набора данных.
     */
    categories: DatasetCategorySummary[];
}

export interface DatasetCategorySummary {
    /**
     * Идентификатор категории. Например, "надежда".
     */
    id: string;

    /**
     * Английское название категории. Например, "Hope".
     */
    name: string;

    /**
     * Описание содержания стихов в данной категории.
     */
    description: string;

    /**
     * Количество стихов (или коротких отрывков), относящихся к данной категории.
     */
    numberOfVerses: number;

    /**
     * Даты праздника, к которому относится данная категория (см. DatasetCategoryHoliday выше).
     * Исключено для категорий, не связанных с праздниками.
     */
    holiday?: DatasetCategoryHoliday;

    /**
     * Ссылка на API для данной категории.
     */
    apiLink: string;
}
```

### Пример

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

## Получение категории из набора данных

`GET https://bible.helloao.org/api/d/{dataset}/categories/{category}.json`

Получает отдельную категорию стихов, включающую все стихи, относящиеся к ней.

-   `dataset` идентификатор набора данных (например `verse-of-the-day` ).
-   `category` — это идентификатор категории (например `hope` ).

### Пример кода

::: code-tabs#язык

@tab JavaScript

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

### Структура

```typescript:no-line-numbers title="dataset-category.ts"
export interface DatasetCategoryResponse {
    /**
     * Информация о наборе данных для данной категории.
     */
    dataset: Dataset;

    /**
     * Категория, а также стихи, которые к ней относятся.
     */
    category: DatasetCategory;

    /**
     * Ссылка на API для этой категории.
     */
    thisCategoryApiLink: string;
}

export interface DatasetCategory {
    /**
     * Идентификатор категории. Например, "надежда".
     */
    id: string;

    /**
     * Английское название категории. Например, "Hope".
     */
    name: string;

    /**
     * Описание содержания стихов в данной категории.
     */
    description: string;

    /**
     * Даты праздника, к которому относится данная категория (см. DatasetCategoryHoliday в разделе "Список стихов в наборе данных").
     * В указанные даты стихом дня является один из стихов данной категории, и в другие дни он не используется.
     * Исключено для категорий, не связанных с праздниками.
     */
    holiday?: DatasetCategoryHoliday;

    /**
     * Стихи (или короткие отрывки), относящиеся к данной категории, в каноническом порядке.
     * Включает стихи, которые были удалены из списка (см. `removedIn` ).
     */
    verses: DatasetCategoryVerse[];
}

export interface DatasetCategoryVerse {
    /**
     * Идентификатор книги, например, "JER".
     */
    book: string;

    /**
     * Номер главы.
     */
    chapter: number;

    /**
     * Номер стиха.
     * Если присутствует `endVerse` , то это стих, с которого начинается отрывок.
     */
    verse: number;

    /**
     * Стих, которым заканчивается данный отрывок.
     * Если ссылка относится к одному стиху, она опускается.
     */
    endVerse?: number;

    /**
     * Первый год, когда этот стих может стать стихом дня.
     * Опускается, если стих всегда присутствовал в списке.
     */
    addedIn?: number;

    /**
     * Первый год, когда этот стих уже не может быть стихом дня.
     * Удаленные стихи остаются в наборе данных, чтобы можно было по-прежнему выбирать стихи более ранних лет.
     * Пропускается, если стих не был удален из списка.
     */
    removedIn?: number;
}
```

### Пример

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
