# 数据集

用于浏览补充圣经数据集（例如交叉引用和圣经实体（人物、地点、事件和人群））并获取其书籍、章节内容和实体的端点。

## 可用数据集

`GET https://bible.helloao.org/api/available_datasets.json`

获取 API 中可用的圣经数据集列表。

### 代码示例

::: code-tabs#lang

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

### 结构

```typescript:no-line-numbers title="available-datasets.ts"
export interface AvailableDatasets {
    /**
     * 数据集列表。
     */
    datasets: Dataset[];
}

export interface Dataset {
    /**
     * 数据集的ID。
     */
    id: string;

    /**
     * 数据集的名称。
     */
    name: string;

    /**
     * 数据集的网站。
     */
    website: string;

    /**
     * 数据集许可证的网址。
     */
    licenseUrl: string;

    /**
     * 数据集的英文名称。
     */
    englishName: string;

    /**
     * 数据集主要采用的 ISO 639 三字母语言标签。
     */
    language: string;

    /**
     * 语言的书写方向。
     * “ltr”表示文本是从页面左侧向右侧书写的。
     * “rtl”表示文本是从页面右侧向左侧书写的。
     */
    textDirection: 'ltr' | 'rtl';

    /**
     * 此数据集可用书籍列表的 API 链接。
     */
    listOfBooksApiLink: string;

    /**
     * 可用的格式列表。
     */
    availableFormats: ('json' | 'usfm')[];

    /**
     * 该数据集包含的书籍数量。
     */
    numberOfBooks: number;

    /**
     * 该数据集包含的章节总数。
     */
    totalNumberOfChapters: number;

    /**
     * 该数据集包含的诗句总数。
     */
    totalNumberOfVerses: number;

    /**
     * 该数据集包含的交叉引用总数。
     */
    totalNumberOfReferences: number;

    /**
     * 获取数据集所使用的语言名称。
     * 如果语言名称未知，则返回 null 或 undefined。
     */
    languageName?: string;

    /**
     * 获取该语言的英文名称。
     * 如果该语言没有英文名称，则返回 null 或 undefined。
     */
    languageEnglishName?: string;

    /**
     * 数据集中实体列表的 API 链接。
     * 如果数据集中不包含相应的实体，则省略。
     */
    listOfPeopleApiLink?: string;
    listOfPlacesApiLink?: string;
    listOfEventsApiLink?: string;
    listOfPeopleGroupsApiLink?: string;

    /**
     * 数据集中包含的实体总数。
     * 如果数据集中不包含相应的实体，则省略。
     */
    totalNumberOfPeople?: number;
    totalNumberOfPlaces?: number;
    totalNumberOfEvents?: number;
    totalNumberOfPeopleGroups?: number;
}
```

### 例子

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

## 列出数据集中的书籍

`GET https://bible.helloao.org/api/d/{dataset}/books.json`

获取给定数据集可用的书籍列表。

-   `dataset`数据集的 ID（例如`open-cross-ref` ）。

### 代码示例

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-books.js"
const dataset = 'open-cross-ref';

// 获取开放交叉引用数据集的书籍列表
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

### 结构

```typescript:no-line-numbers title="dataset-books.ts"
export interface DatasetBooks {
    /**
     * 书籍的数据集信息。
     */
    dataset: Dataset;

    /**
     * 数据集中包含的书籍列表。
     */
    books: DatasetBook[];
}

interface DatasetBook {
    /**
     * 这本书的ID。
     * 与圣经中相应书籍的 ID 相符（创世记、出埃及记等）。
     */
    id: string;

    /**
     * 圣经中各卷书的顺序。
     */
    order: number;

    /**
     * 本书第一章的编号。
     */
    firstChapterNumber: number;

    /**
     * 本书第一章的链接。
     */
    firstChapterApiLink: string | null;

    /**
     * 书中最后一章的章号。
     */
    lastChapterNumber: number | null;

    /**
     * 本书最后一章的链接。
     */
    lastChapterApiLink: string | null;

    /**
     * 这本书包含的章节数量。
     */
    numberOfChapters: number;

    /**
     * 这本书包含的诗节数量。
     */
    totalNumberOfVerses: number;

    /**
     * 本书所包含的交叉引用总数。
     */
    totalNumberOfReferences: number;
}
```

### 例子

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

## 从数据集中获取章节

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

获取给定书籍和数据集的单个章节的内容。

对于交叉引用数据集（例如`open-cross-ref` ），章节包含每节经文的交叉引用列表。对于实体数据集（例如`theographic` ），章节包含章节中出现的人物、地点和事件——请参阅[“获取章节中的实体”](#get-the-entities-in-a-chapter) 。

-   `dataset`数据集的 ID（例如`open-cross-ref` ）。
-   `book`是书籍的 ID（例如， `GEN`代表《创世记》）。
-   `chapter`是章节编号（例如，第一章为`1` ）。

### 代码示例

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-chapter.js"
const dataset = 'open-cross-ref';
const book = 'GEN';
const chapter = 1;

// 从开放交叉引用数据集获取创世记1章
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

### 结构

```typescript:no-line-numbers title="dataset-chapter.ts"
export interface DatasetBookChapter {
    /**
     * 本书章节的数据集信息。
     */
    dataset: Dataset;

    /**
     * 本书章节的书籍信息。
     */
    book: DatasetBook;

    /**
     * 本章节链接。
     */
    thisChapterLink: string;

    /**
     * 下一章的链接。
     * 如果这是数据集中的最后一章，则返回 null。
     */
    nextChapterApiLink: string | null;

    /**
     * 上一章的链接。
     * 如果这是数据集中的第一章，则为空。
     */
    previousChapterApiLink: string | null;

    /**
     * 该章节包含的经文数量。
     */
    numberOfVerses: number;

    /**
     * 本章内容。
     */
    chapter: DatasetChapterData;
}

interface DatasetChapterData {
    /**
     * 章节编号。
     */
    number: number;

    /**
     * 本章内容。
     */
    content: DatasetVerse[];
}

interface DatasetVerse {
    /**
     * 诗节的编号。
     */
    verse: number;

    /**
     * 该经文的交叉引用。
     *
     * 按分数降序排列。
     */
    references: DatasetReference[];
}

interface DatasetReference {
    /**
     * 被引用书籍的ID。
     */
    book: string;

    /**
     * 章节编号。
     */
    chapter: number;

    /**
     * 诗节编号。
     * 如果存在`endVerse` ，则表示引用从此诗句开始。
     */
    verse: number;

    /**
     * 引用结束的那节诗。
     */
    endVerse?: number;

    /**
     * 参考文献的相关性得分。
     */
    score?: number;
}
```

### 例子

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

## 实体

有些数据集（例如[Theographic Bible Metadata](https://github.com/robertrouse/theographic-bible-metadata)数据集 ( `theographic` )）包含实体：人物、地点、事件和人群，以及它们与提及它们的圣经经文之间的关系。

包含实体的数据集在其条目中包括`listOfPeopleApiLink`和`listOfEventsApiLink` `listOfPeopleGroupsApiLink`属性`listOfPlacesApiLink`见第`/api/available_datasets.json`节）。

实体数据集还提供与章节对齐的数据： `/api/d/{dataset}/books.json`列出章节包含实体数据的书籍， `/api/d/{dataset}/{book}/{chapter}.json`返回该章节中出现的人物、地点和事件，以及每个元素出现的经文编号。请参阅[“获取章节中的实体”](#get-the-entities-in-a-chapter) 。

实体引用圣经经文时，使用与 API 其他部分相同的书籍 ID、章节号和经文号，因此可以与任何译本结合使用。它们之间通过实体引用进行相互引用：

```typescript:no-line-numbers title="entity-shared.ts"
export interface DatasetEntityRef {
    /**
     * 被引用实体的ID。
     */
    id: string;

    /**
     * 被引用实体的类型。
     * 与实体 API 链接的集合段匹配，因此链接可以构造为`/api/d/{dataset}/{type}/{id}.json` 。
     */
    type: 'people' | 'places' | 'events' | 'groups';

    /**
     * 被引用的实体的名称。
     */
    name?: string;

    /**
     * 被引用实体的 API 链接。
     */
    apiLink?: string;
}

export interface VerseRef {
    /**
     * 书籍的 ID（GEN、EXO 等）。
     */
    book: string;

    /**
     * 参考文献起始的章节号。
     */
    chapter: number;

    /**
     * 引用的起始诗节编号。
     */
    verse: number;

    /**
     * 引用结束的那节诗。
     * 同一章中连续的经文合并为一个引用。
     */
    endVerse?: number;
}
```

## 获取章节中的实体

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

对于实体数据集，获取单个章节中出现的人物、地点和事件，以及每个人物、地点和事件在该章节中的诗节编号。

-   `dataset`数据集的 ID（例如`theographic` ）。
-   `book`是书籍的 ID（例如， `GEN`代表《创世记》）。
-   `chapter`是章节编号（例如，第一章为`1` ）。

包含实体数据的书籍和章节列表可通过`GET https://bible.helloao.org/api/d/{dataset}/books.json`获取，其结构与[数据集书籍端点](#list-books-in-a-dataset)相同。对于实体数据集， `totalNumberOfVerses`表示至少被一个实体提及的诗句数量， `totalNumberOfReferences`表示实体与诗句提及的总数。

### 代码示例

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter-entities.js"
const dataset = 'theographic';
const book = 'GEN';
const chapter = 2;

// 获取《创世记》第二章中出现的人物、地点和事件。
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

### 结构

```typescript:no-line-numbers title="dataset-chapter-entities.ts"
export interface DatasetEntityBookChapter {
    /**
     * 本书章节的数据集信息。
     */
    dataset: Dataset;

    /**
     * 本书章节的书籍信息。
     */
    book: DatasetBook;

    /**
     * 本章节的实体数据。
     */
    chapter: DatasetEntityChapterData;

    /**
     * 本章节链接。
     */
    thisChapterLink: string;

    /**
     * 下一章的链接。
     * 如果这是数据集中的最后一章，则返回 null。
     */
    nextChapterApiLink: string | null;

    /**
     * 上一章的链接。
     * 如果这是数据集中的第一章，则为空。
     */
    previousChapterApiLink: string | null;

    /**
     * 本章中出现的人物、地点和事件的数量。
     */
    numberOfPeople: number;
    numberOfPlaces: number;
    numberOfEvents: number;
}

interface DatasetEntityChapterData {
    /**
     * 章节编号。
     */
    number: number;

    /**
     * 本章中出现的人物。
     * 按首次出现的诗句排序。
     */
    people: ChapterPerson[];

    /**
     * 本章中出现的地点。
     * 按首次出现的诗句排序。
     */
    places: ChapterPlace[];

    /**
     * 本章中出现的事件。
     * 按首次出现的诗句排序。
     */
    events: ChapterEvent[];
}

interface ChapterPerson {
    /**
     * 此人的身份信息。
     */
    id: string;

    /**
     * 此人的姓名。
     */
    name: string;

    /**
     * 这个人的名字是否是专有名词。
     */
    isProperName?: boolean;

    /**
     * 人的性别。
     */
    gender?: string;

    /**
     * 人的出生年份和去世年份。
     * 负数表示公元前，正数表示公元后。
     */
    birthYear?: number;
    deathYear?: number;

    /**
     * 该人员的 API 链接。
     */
    apiLink: string;

    /**
     * 该章节中提到此人的经文数量。
     * 按升序排列。
     */
    verses: number[];
}

interface ChapterPlace {
    /**
     * 地点的ID。
     */
    id: string;

    /**
     * 地名。
     */
    name: string;

    /**
     * 该地点的地理特征类型。
     */
    featureType?: string;

    /**
     * 该地点的纬度和经度。
     */
    latitude?: number;
    longitude?: number;

    /**
     * 该地点的 API 链接。
     */
    apiLink: string;

    /**
     * 章节中提到该地点的经文编号。
     * 按升序排列。
     */
    verses: number[];
}

interface ChapterEvent {
    /**
     * 事件的ID。
     */
    id: string;

    /**
     * 活动名称。
     */
    name: string;

    /**
     * 活动开始的日期。
     */
    startDate?: string;

    /**
     * 该活动的 API 链接。
     */
    apiLink: string;

    /**
     * 章节中描述该事件的经文编号。
     * 按升序排列。
     */
    verses: number[];
}
```

### 例子

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

## 列出数据集中的人员

`GET https://bible.helloao.org/api/d/{dataset}/people.json`

获取可用于给定数据集的人员列表。

-   `dataset`数据集的 ID（例如`theographic` ）。

### 代码示例

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-people.js"
const dataset = 'theographic';

// 获取地貌数据集的人员列表
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

### 结构

```typescript:no-line-numbers title="dataset-people.ts"
export interface DatasetPeople {
    /**
     * 人群数据集信息。
     */
    dataset: Dataset;

    /**
     * 数据集中包含的人员列表。
     */
    people: DatasetPersonSummary[];
}

interface DatasetPersonSummary {
    /**
     * 此人的身份信息。
     */
    id: string;

    /**
     * 此人的姓名。
     */
    name: string;

    /**
     * 这个人的名字是否是专有名词。
     */
    isProperName?: boolean;

    /**
     * 人的性别。
     */
    gender?: string;

    /**
     * 圣经中提及此人的经文数量。
     */
    numberOfReferences: number;

    /**
     * 该人员的 API 链接。
     */
    thisPersonApiLink: string;
}
```

### 例子

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

## 从数据集中获取人员

`GET https://bible.helloao.org/api/d/{dataset}/people/{person}.json`

获取有关单个人的信息，包括提及他们的圣经参考文献以及他们与其他人、地点、事件和人群的关系。

-   `dataset`数据集的 ID（例如`theographic` ）。
-   `person`人员 ID（例如`paul_2479` ）。

### 代码示例

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-person.js"
const dataset = 'theographic';
const person = 'paul_2479';

// 从地名数据集中获取有关保罗的信息
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

### 结构

```typescript:no-line-numbers title="dataset-person.ts"
export interface DatasetPersonResponse {
    /**
     * 该人员的数据集信息。
     */
    dataset: Dataset;

    /**
     * 关于此人的信息。
     */
    person: DatasetPerson;

    /**
     * 此人的 API 链接。
     */
    thisPersonApiLink: string;
}

interface DatasetPerson {
    /**
     * 此人的身份信息。
     */
    id: string;

    /**
     * 此人的姓名。
     */
    name: string;

    /**
     * 此人的其他称呼。
     */
    alsoCalled?: string[];

    /**
     * 这个人的名字是否是专有名词。
     */
    isProperName?: boolean;

    /**
     * 人的性别。
     */
    gender?: string;

    /**
     * 人物描述。每行代表一个段落。
     */
    description?: string[];

    /**
     * 人的出生年份和去世年份。
     * 负数表示公元前，正数表示公元后。
     */
    birthYear?: number;
    deathYear?: number;

    /**
     * 该人物最早和最晚被提及的年份。
     */
    minYear?: number;
    maxYear?: number;

    /**
     * 人的出生地和去世地。
     */
    birthPlace?: DatasetEntityRef;
    deathPlace?: DatasetEntityRef;

    /**
     * 此人的家庭关系。
     */
    father?: DatasetEntityRef[];
    mother?: DatasetEntityRef[];
    partners?: DatasetEntityRef[];
    children?: DatasetEntityRef[];
    siblings?: DatasetEntityRef[];
    halfSiblingsSameMother?: DatasetEntityRef[];
    halfSiblingsSameFather?: DatasetEntityRef[];

    /**
     * 此人所属的人群。
     */
    memberOf?: DatasetEntityRef[];

    /**
     * 此人参与的活动。
     */
    events?: DatasetEntityRef[];

    /**
     * 列出圣经中提及此人的经文。
     * 按书籍顺序、章节和诗节排序。
     */
    references: VerseRef[];
}
```

### 例子

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

## 列出数据集中的地点

`GET https://bible.helloao.org/api/d/{dataset}/places.json`

获取给定数据集中可用的地点列表。

-   `dataset`数据集的 ID（例如`theographic` ）。

### 结构

```typescript:no-line-numbers title="dataset-places.ts"
export interface DatasetPlaces {
    /**
     * 地点的数据集信息。
     */
    dataset: Dataset;

    /**
     * 数据集中可用的地点列表。
     */
    places: DatasetPlaceSummary[];
}

interface DatasetPlaceSummary {
    /**
     * 地点的ID。
     */
    id: string;

    /**
     * 地名。
     */
    name: string;

    /**
     * 该地点的地理特征类型。
     * 例如，“城市”、“地区”、“山脉”、“水域”等。
     */
    featureType?: string;

    /**
     * 该地点的纬度和经度。
     */
    latitude?: number;
    longitude?: number;

    /**
     * 圣经中提及该地的经文数量。
     */
    numberOfReferences: number;

    /**
     * 该地点的 API 链接。
     */
    thisPlaceApiLink: string;
}
```

## 从数据集中获取位置

`GET https://bible.helloao.org/api/d/{dataset}/places/{place}.json`

获取有关某个地方的信息，包括提及该地的圣经经文以及与其相关的人物和事件。

-   `dataset`数据集的 ID（例如`theographic` ）。
-   `place`地点 ID（例如`jerusalem_636` ）。

### 结构

```typescript:no-line-numbers title="dataset-place.ts"
export interface DatasetPlaceResponse {
    /**
     * 该地点的数据集信息。
     */
    dataset: Dataset;

    /**
     * 关于这个地方的信息。
     */
    place: DatasetPlace;

    /**
     * 此地点的 API 链接。
     */
    thisPlaceApiLink: string;
}

interface DatasetPlace {
    /**
     * 地点的ID。
     */
    id: string;

    /**
     * 地名。
     */
    name: string;

    /**
     * 该地名在《詹姆斯国王钦定版圣经》和《英文标准版圣经》中的写法。
     */
    kjvName?: string;
    esvName?: string;

    /**
     * 这个地方的其他名称。
     */
    aliases?: string[];

    /**
     * 该地点的地理特征类型。
     */
    featureType?: string;
    featureSubType?: string;

    /**
     * 该地点的纬度和经度，以及它们的精确度。
     */
    latitude?: number;
    longitude?: number;
    precision?: string;

    /**
     * 地点描述。每行代表一个段落。
     */
    description?: string[];

    /**
     * 数据集作者对该地点的评论。
     */
    comment?: string;

    /**
     * 这个地方的根源。
     * 同一地理位置的不同名称源于同一个地方。
     */
    rootPlace?: DatasetEntityRef;

    /**
     * 这个地方与另一个地方一模一样。
     */
    duplicateOf?: DatasetEntityRef;

    /**
     * 曾到过那里、出生在那里或去世在那里的人。
     */
    people?: DatasetEntityRef[];
    peopleBorn?: DatasetEntityRef[];
    peopleDied?: DatasetEntityRef[];

    /**
     * 那里发生的事件。
     */
    events?: DatasetEntityRef[];

    /**
     * 圣经中提及该地的经文列表。
     * 按书籍顺序、章节和诗节排序。
     */
    references: VerseRef[];
}
```

### 例子

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

## 列出数据集中的事件

`GET https://bible.helloao.org/api/d/{dataset}/events.json`

获取给定数据集的可用事件列表。

-   `dataset`数据集的 ID（例如`theographic` ）。

### 结构

```typescript:no-line-numbers title="dataset-events.ts"
export interface DatasetEvents {
    /**
     * 事件的数据集信息。
     */
    dataset: Dataset;

    /**
     * 数据集中包含的事件列表。
     */
    events: DatasetEventSummary[];
}

interface DatasetEventSummary {
    /**
     * 事件的ID。
     */
    id: string;

    /**
     * 活动名称。
     */
    name: string;

    /**
     * 活动开始的日期。
     * 负数表示公元前，正数表示公元后。
     * 更具体的日期使用`YYYY-MM-DD`格式。
     */
    startDate?: string;

    /**
     * 圣经中描述该事件的经文数量。
     */
    numberOfReferences: number;

    /**
     * 该活动的 API 链接。
     */
    thisEventApiLink: string;
}
```

## 从数据集中获取事件

`GET https://bible.helloao.org/api/d/{dataset}/events/{event}.json`

获取有关单个事件的信息，包括描述该事件的圣经参考文献以及与其相关的人物、地点和人群。

-   `dataset`数据集的 ID（例如`theographic` ）。
-   `event`事件的 ID（例如`saul-is-converted_326` ）。

### 结构

```typescript:no-line-numbers title="dataset-event.ts"
export interface DatasetEventResponse {
    /**
     * 该事件的数据集信息。
     */
    dataset: Dataset;

    /**
     * 活动信息。
     */
    event: DatasetEvent;

    /**
     * 本次活动的API链接。
     */
    thisEventApiLink: string;
}

interface DatasetEvent {
    /**
     * 事件的ID。
     */
    id: string;

    /**
     * 活动名称。
     */
    name: string;

    /**
     * 活动开始的日期。
     */
    startDate?: string;

    /**
     * 活动的持续时间。
     * 例如，“1D”表示一天，“40Y”表示四十年。
     */
    duration?: string;

    /**
     * 参与此次活动的人员。
     */
    participants?: DatasetEntityRef[];

    /**
     * 事件发生的地点。
     */
    locations?: DatasetEntityRef[];

    /**
     * 参与此次活动的各族人民。
     */
    groups?: DatasetEntityRef[];

    /**
     * 该活动是其中的一部分。
     */
    partOf?: DatasetEntityRef;

    /**
     * 在此事件之前发生的事件。
     */
    predecessor?: DatasetEntityRef;

    /**
     * 描述该事件的圣经经文列表。
     * 按书籍顺序、章节和诗节排序。
     */
    references: VerseRef[];
}
```

### 例子

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

## 列出数据集中的人群

`GET https://bible.helloao.org/api/d/{dataset}/groups.json`

获取给定数据集中可用的人群列表。

-   `dataset`数据集的 ID（例如`theographic` ）。

### 结构

```typescript:no-line-numbers title="dataset-people-groups.ts"
export interface DatasetPeopleGroups {
    /**
     * 人群数据集信息。
     */
    dataset: Dataset;

    /**
     * 数据集中包含的人群列表。
     */
    groups: DatasetPeopleGroupSummary[];
}

interface DatasetPeopleGroupSummary {
    /**
     * 人群的ID。
     */
    id: string;

    /**
     * 该民族的名称。
     */
    name: string;

    /**
     * 该人群的成员人数。
     */
    numberOfMembers: number;

    /**
     * 该人群的 API 链接。
     */
    thisPeopleGroupApiLink: string;
}
```

## 从数据集中获取人群

`GET https://bible.helloao.org/api/d/{dataset}/groups/{group}.json`

获取有关某个民族群体的信息，包括其成员以及该群体参与的事件。

-   `dataset`数据集的 ID（例如`theographic` ）。
-   `group`人群的 ID（例如`tribe-of-benjamin` ）。

### 结构

```typescript:no-line-numbers title="dataset-people-group.ts"
export interface DatasetPeopleGroupResponse {
    /**
     * 该人群的数据集信息。
     */
    dataset: Dataset;

    /**
     * 关于该族群的信息。
     */
    group: DatasetPeopleGroup;

    /**
     * 该人群的 API 链接。
     */
    thisPeopleGroupApiLink: string;
}

interface DatasetPeopleGroup {
    /**
     * 人群的ID。
     */
    id: string;

    /**
     * 该民族的名称。
     */
    name: string;

    /**
     * 该族群的成员。
     */
    members?: DatasetEntityRef[];

    /**
     * 该族群参与的活动。
     */
    events?: DatasetEntityRef[];

    /**
     * 圣经中提及该民族的经文列表。
     * 按书籍顺序、章节和诗节排序。
     */
    references: VerseRef[];
}
```

### 例子

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
