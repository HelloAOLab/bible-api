# 数据集

用于浏览补充圣经数据集（例如交叉引用、圣经实体（人物、地点、事件和人群）、原文行间词、词典和每日经文候选）并获取其书籍、章节内容、实体、词典条目和经文类别的端点。

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
     * API 为许可证添加了注释。
     * 如果没有笔记，则返回 null 或 undefined。
     */
    licenseNotes?: string | null;

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
     * 对于不包含交叉引用的数据集，值为 0。
     */
    totalNumberOfReferences: number;

    /**
     * 该数据集中包含的行间词总数。
     * 如果数据集不包含行间词，则省略。
     */
    totalNumberOfWords?: number;

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

    /**
     * 数据集中词典条目列表的 API 链接。
     * 如果数据集不包含词典条目，则省略​​。
     */
    listOfLexiconApiLink?: string;

    /**
     * 数据集中包含的词典条目总数。
     * 如果数据集不包含词典条目，则省略​​。
     */
    totalNumberOfLexicon?: number;

    /**
     * 数据集中所有诗句及其类别的列表的 API 链接。
     * 如果数据集中的诗句没有类别，则省略。
     */
    listOfVersesApiLink?: string;

    /**
     * 数据集中诗歌类别列表的 API 链接。
     * 如果数据集不包含诗歌类别，则省略。
     */
    listOfCategoriesApiLink?: string;

    /**
     * 数据集中包含的诗歌类别总数。
     * 如果数据集不包含诗歌类别，则省略。
     */
    totalNumberOfCategories?: number;
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

对于交叉引用数据集（例如`open-cross-ref` ），章节包含每节经文的交叉引用列表。对于行间引用数据集（例如`bsb-interlinear` ），章节包含每节经文的原文词汇——参见[“行间引用数据集”](#interlinear-datasets) 。对于实体数据集（例如`theographic` ），章节包含该章节中出现的人物、地点和事件——参见[“获取章节中的实体”](#get-the-entities-in-a-chapter) 。对于`verse-of-the-day`数据集，章节包含该章节中的每日经文候选词及其类别——参见[“每日经文”](#verse-of-the-day) 。

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

/**
 * 一节经文包含`references` （交叉引用数据集）、 `words` （行间数据集）或`categories` （每日经文数据集）。
 * 检查哪个存在，值为`'words' in verse`或`'categories' in verse` 。
 */
type DatasetVerse =
    | DatasetReferencesVerse
    | DatasetWordsVerse
    | DatasetCategoriesVerse;

interface DatasetReferencesVerse {
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

interface DatasetWordsVerse {
    /**
     * 诗节的编号。
     */
    verse: number;

    /**
     * 诗歌原文，按原文顺序排列。
     * 请参见下文“行间数据集”。
     */
    words: InterlinearWord[];
}

interface DatasetCategoriesVerse {
    /**
     * 诗节的编号。
     * 如果存在`endVerse` ，则表示该段落从第 1 节开始。
     */
    verse: number;

    /**
     * 这段文字最后结束的那节经文。
     * 如果条目只有一节诗，则省略。
     */
    endVerse?: number;

    /**
     * 诗歌所属类别的 ID，按相关性排序，最相关的类别排在最前面。
     * 请参阅下方的“每日经文”。
     */
    categories: string[];

    /**
     * 这是这节经文首次成为每日经文。
     * 如果该诗句一直都在列表中，则省略。
     */
    addedIn?: number;

    /**
     * 这是该经文首次不再能作为每日经文的年份。
     * 删除的诗句仍保留在数据集中，以便仍然可以选择更早年份的诗句。
     * 如果诗句尚未从列表中删除，则省略。
     */
    removedIn?: number;
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

// 有关 InterlinearWord 的结构，请参见下面的“行间数据集”。
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

[历史地球](https://historyglobe.app)数据集（ `history-globe` ）仅包含地点信息：圣经中提到的地点，以及它们的坐标和提及它们的经文。其地点 ID（例如耶路撒冷的 ID 为`a15257a` ）是历史地球的稳定地点 ID，与它自己的[开放数据 API](https://historyglobe.app/docs/api.html)使用的 ID 相同，因此即使名称被更正`Region`这些 ID 也不会改变。它的`featureType`值与 Theographic 数据集使用的值相同（ `City` `Water` ），而`featureSubType`值则包含更`Gate` `Spring` `River`

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

### 历史地球仪归属

History Globe 数据采用[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)许可协议。如果您使用该数据，请注明 History Globe ( https://historyglobe.app ) 及其所基于的 OpenBible.info 圣经地理编码数据，并注明任何更改。数据集的`licenseNotes`属性包含版权信息。

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
     * 此人的出生地和去世地。
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

## 行间数据集

Berean 经文对照数据集 ( `bsb-interlinear` ) 列出了圣经每一节经文的原文（希伯来语、亚兰语和希腊语）词汇，顺序与它们在原文中出现的顺序一致。每个词都有其音译、语法分析、 [Strong 编号](https://en.wikipedia.org/wiki/Strong%27s_Concordance)以及[Berean 标准圣经](https://berean.bible)中对应的英文短语。

该数据集使用与其他数据集相同的端点：

-   `GET https://bible.helloao.org/api/d/bsb-interlinear/books.json`列出了 66 本书。
-   `GET https://bible.helloao.org/api/d/bsb-interlinear/{book}/{chapter}.json` （例如`/api/d/bsb-interlinear/GEN/1.json` ）返回章节， `{ verse, words }`代表每一节诗。响应是一个[数据集章节](#get-a-chapter-from-a-dataset)。

词语数据来自[Berean 标准圣经的经文对照表](https://bereanbible.com/)，该对照表属于公共领域。词语的 Strong 编号在[词典](#lexicon)中查找 ( `stepbible-lexicon` )。

### 结构

```typescript:no-line-numbers title="interlinear-word.ts"
interface InterlinearWord {
    /**
     * 该词在原文顺序中的排名（从 1 开始）。
     * 单词按此顺序排列。
     */
    pos: number;

    /**
     * 该词在《贝里亚标准圣经》英文词序中的从 1 开始的排名。
     */
    bsbPos: number;

    /**
     * 词语的语言。
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * 原始脚本中的单词。NFC标准化处理。
     */
    text: string;

    /**
     * 该词的音译。
     */
    transliteration: string | null;

    /**
     * 单词的简短语法分析代码。例如“N-mp”或“V-Qal-Perf-3ms”。
     */
    parsing: string | null;

    /**
     * 对该词进行详细的语法分析。
     */
    parsingFull: string | null;

    /**
     * 单词的零填充 Strong 编号。例如“H0430”或“G3056”。
     * 以零填充，与钦定版圣经的`.words.json`值相匹配。
     * 其他译文的值在合并之前可能需要进行零填充和去除后缀。
     * 当来源未给出单词的 Strong 编号时，则为空（某些词是后缀，例如代词后缀）。
     */
    strongs: string | null;

    /**
     * 《贝里亚标准圣经》中该词的英文短语。
     * 当 BSB 未翻译该词时（例如希伯来语直接宾语标记），则为空。
     */
    gloss: string | null;
}
```

### 例子

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

### 将词语与翻译联系起来

行间`strongs`值会用零填充（例如`H0430` ）。这与钦定版圣经词语注释中的`strongs`值相匹配（ `/api/eng_kjv/{book}/{chapter}.words.json` ）。其他译本的值可能需要零填充和去除后缀（例如`H430`或`H1961a`变为`H0430`和`H1961` ）才能连接。

-   **KJV。**对于钦定版圣经（ `eng_kjv`和`eng_kja` ），将章节`.words.json`文件中的 Strong 编号与同一节经文的行间`H0776` `strongs`连接起来。例如，第`H0853`节经文中`/api/eng_kjv/GEN/1.words.json`注释`H1254` `H0430` `H7225`以`strongs`值出现在第 12 节`/api/d/bsb-interlinear/GEN/1.json` `H8064`词语中。
-   **《贝里亚标准圣经》（Berean Standard Bible）。**每个单词的`gloss`代表该单词在《贝里亚标准圣经》中的对应短语。按`bsbPos`阅读经文，将每`gloss`与《贝里亚标准圣经》译本中的相应经文进行匹配，即可找到该单词的译文所在位置。

这两个来源的编号并不总是一致。例如，KJV 将“was”标记为`G2258` ，而 Berean 表中的值为`G1510`由于此类差异，一些连接操作会失败。

### 归因

Berean 的行间对照表属于公共领域。[词典](#lexicon)采用 CC BY 4.0 许可协议，使用时需注明出处。

## 词典

STEPBible 词典数据集 ( `stepbible-lexicon` ) 包含来自剑桥廷代尔出版社[STEPBible.org](https://www.stepbible.org/)的希伯来语、亚兰语和希腊语简明词典 (TBESH 和 TBESG)。它为每个斯特朗编号都提供了一个词条，每个词条都有一个或多个释义，包括词条、音译、词性、英文释义和定义。

任何在词典中已有条目的[行间词条](#interlinear-datasets)，其值若以零填充为`strongs`则无需重新格式化即可在`/api/d/stepbible-lexicon/lexicon/{strongs}.json`中查找。钦定版圣经的`.words.json`值也同样适用；其他译本的值可能需要先进行零填充并去除后缀。词典中添加的、没有 Strong 编号的希腊词条不予出版。

包含词典条目的数据集在其条目中包含`listOfLexiconApiLink`和`totalNumberOfLexicon` （见`/api/available_datasets.json`节）。

### 归因

词典数据采用[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)许可协议。如果您使用它，请注明出处为 STEPBible.org / Tyndale House, Cambridge，并注明任何更改。数据集的属性`licenseNotes`包含版权信息。

## 列出数据集中的词典条目

`GET https://bible.helloao.org/api/d/{dataset}/lexicon.json`

获取数据集中可用的词典条目列表。

-   `dataset`数据集的 ID（例如`stepbible-lexicon` ）。

### 代码示例

::: code-tabs#lang

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

### 结构

```typescript:no-line-numbers title="dataset-lexicon.ts"
export interface DatasetLexicon {
    /**
     * 词典的数据集信息。
     */
    dataset: Dataset;

    /**
     * 数据集中可用的词典条目列表。
     */
    lexicon: DatasetLexiconEntrySummary[];
}

export interface DatasetLexiconEntrySummary {
    /**
     * 以零填充的斯特朗编号，即词条编号。例如“H0430”。
     */
    id: string;

    /**
     * 词条的语言。
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * 词条名称。
     * 这是词条第一个义项的引理。
     */
    name: string;

    /**
     * 词典条目的 API 链接。
     */
    apiLink: string;
}
```

### 例子

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

## 从数据集中获取词典条目

`GET https://bible.helloao.org/api/d/{dataset}/lexicon/{strongs}.json`

获取单个基本斯特朗编号的词条及其所有含义。

-   `dataset`数据集的 ID（例如`stepbible-lexicon` ）。
-   `strongs`是零填充的 Strong 编号（例如，希伯来语单词 _elohim_ 为`H0430` ，希腊语单词 _logos_ 为`G3056` ）。

### 代码示例

::: code-tabs#lang

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

### 结构

```typescript:no-line-numbers title="dataset-lexicon-entry.ts"
export interface DatasetLexiconEntry {
    /**
     * 词典条目的数据集信息。
     */
    dataset: Dataset;

    /**
     * 词条。
     */
    entry: DatasetLexiconEntryContent;

    /**
     * 该词条的 API 链接。
     */
    thisLexiconEntryApiLink: string;
}

export interface DatasetLexiconEntryContent {
    /**
     * 条目的以零填充的 Strong 编号。例如“H0430”。
     */
    id: string;

    /**
     * 参赛作品的语言。
     * 这是该词条第一个释义的语言。
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * 词条含义，按 ID 顺序排列。
     */
    senses: DatasetLexiconSense[];
}

export interface DatasetLexiconSense {
    /**
     * 该语义的扩展 ID。例如“H0001G”。
     * 当数字只有一个含义时，等于该数字的基本斯特朗数。
     */
    id: string;

    /**
     * 意义的语言。
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * 原文中意义的引理。
     */
    lemma: string;

    /**
     * 词条的音译。
     */
    transliteration: string | null;

    /**
     * 词性（形态学）编码词义。
     */
    partOfSpeech: string | null;

    /**
     * 该词义的简短英文释义。
     */
    gloss: string | null;

    /**
     * 以纯文本形式定义意义。
     * 段落之间用空行分隔。源代码中的标记已被移除。
     */
    definition: string;
}
```

### 例子

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

## 每日经文

每日经文数据集（ `verse-of-the-day` ）是一个精心挑选的列表，其中包含许多广为人知的经文和短篇段落（最多三节），它们都非常适合作为“每日经文”：一年中的每一天都有超过640条经文可供选择，基督教节日也有超过100条经文可供选择。每条经文本身都很有意义。

每天的每一节经文都包含一到三个类别，从以下固定集合中，最相关的类别排在最前面：

| ID            | 描述                                                   |
| ------------- | ------------------------------------------------------ |
| `comfort`     | 在悲伤、困境和孤独中，上帝与我们同在，并给予我们关怀。 |
| `courage`     | 立场坚定，无所畏惧。                                   |
| `faith`       | 信靠上帝和他的应许。                                   |
| `forgiveness` | 上帝赦免罪孽并宽恕他人。                               |
| `gratitude`   | 感谢上帝。                                             |
| `guidance`    | 上帝指引我们的步伐、计划和决定。                       |
| `hope`        | 对上帝所应许的未来充满信心。                           |
| `inspiration` | 鼓励人们践行信仰，行善事。                             |
| `joy`         | 在上帝里欢欣喜乐。                                     |
| `love`        | 上帝对我们的爱，以及我们对上帝和他人的爱。             |
| `peace`       | 休息、平静和摆脱焦虑。                                 |
| `praise`      | 敬拜和宣告上帝的伟大。                                 |
| `prayer`      | 呼求上帝，祈求祂垂听祂的应许。                         |
| `provision`   | 上帝供应我们所需。                                     |
| `salvation`   | 在基督里得救赎、得恩典、得新生命。                     |
| `strength`    | 上帝赐予力量和耐力。                                   |
| `wisdom`      | 属灵的智慧和实用的生活指导。                           |

节日有其自身的分类。在节日当天，诵读的经文是该节日的经文之一，这些经文在其他日子里不会使用。节日通常持续一天；复活节后的节日则持续复活节后的三天，因此会列出这三天的日期。每个节日类别都以`holiday`标记其日期；每年日期相同的节日分别标记为“ `month`和`day` ；而日期每年都不同的节日（因为它们取决于复活节或将临期）则以`dates`标记其在公历中的日期，该日期已预先计算至2026年至2125年。

| ID                         | 假期           | 日期                   |
| -------------------------- | -------------- | ---------------------- |
| `epiphany`                 | 主显节         | 1月6日                 |
| `ash-wednesday`            | 圣灰星期三     | 复活节前46天           |
| `palm-sunday`              | 棕枝主日       | 复活节前的星期日       |
| `maundy-thursday`          | 圣周四         | 复活节前的星期四       |
| `good-friday`              | 耶稣受难日     | 复活节前的星期五       |
| `resurrection-sunday`      | 复活节         | 复活节                 |
| `post-resurrection-sunday` | 复活节后       | 复活节后的三天         |
| `ascension-day`            | 耶稣升天节     | 复活节后第39天         |
| `pentecost`                | 五旬节         | 复活节后第49天         |
| `all-hallows-eve`          | 万圣节前夜     | 10月31日               |
| `all-saints-day`           | 诸圣节         | 11月1日                |
| `advent-sunday`            | 将临期第一主日 | 圣诞节前的第四个星期日 |
| `christmas-eve`            | 圣诞节前夕     | 12月24日               |
| `christmas`                | 圣诞节         | 12月25日               |

该数据集仅包含参考文献，不包含诗节文本，因此适用于所有译本。诗节编号采用标准英文编号（与英国圣经注释版相同）。数据可通过三种方式读取：

-   [`/api/d/verse-of-the-day/verses.json`](#list-verses-in-a-dataset)将数据集中的每一首诗及其类别，以及节日及其日期，都列在一个文件中。
-   [`/api/d/verse-of-the-day/categories/{category}.json`](#get-a-category-from-a-dataset)列出了该类别中的所有经文。这是从某一类别中选择每日经文的最简单方法。
-   [`/api/d/verse-of-the-day/{book}/{chapter}.json`](#get-a-chapter-from-a-dataset)列出了各章节中的候选人及其类别。只有包含候选人的章节才能查看；请使用书中的章节链接或`/api/d/verse-of-the-day/books.json`查找这些章节。

包含诗歌类别`totalNumberOfCategories`数据集在其条目`/api/available_datasets.json`中包含`listOfVersesApiLink`和`listOfCategoriesApiLink` 。

### 每日经文选读

该 API 由静态文件构成，因此不会自动选择经文。取而代之的是，它采用一种约定俗成的经文选择方式，确保所有遵循此约定的应用在同一天显示相同的经文。应用可以自由选择不同的经文；该约定只是为它们提供了一个共享的默认值。

该约定从数据集`/api/d/verse-of-the-day/verses.json`中的经文和节日中选取经文。在节日，它会选取该节日的经文之一，逐年轮换，因此每个节日每年的经文都不同，直到所有经文都被使用完毕。在其他日子，每年都会对当年使用的经文进行一次随机排序（排序依据是每节经文的引用、年份以及一个可选的种子值），当天的经文就是该日期对应的经文。数据集包含每年每天使用的超过 366 节经文，因此同一节经文在同一年内不会重复出现，经文的顺序每年都会变化，并且同一日期总是对应同一节经文。新经文的添加（使用`addedIn` ）和旧经文的移除（使用`removedIn` ）仅针对尚未开始的年份，因此过去日期的当天经文永远不会改变。

[每日经文约定](./verse-of-the-day-convention.md)页面一步一步地详细说明了算法，并附有伪代码和测试值，以便您可以使用任何语言来实现它。

要使用自定义顺序，请选择您自己的种子（例如，您的应用名称）：这样可以得到不同的随机排序，但保证不变。您也可以从单个类别中选择歌词，但每个类别的歌词数量少于一年的天数，因此其歌词会更频繁地重复出现。

SDK遵循以下约定：

```ts:no-line-numbers title="verse-of-the-day.js"
import { FreeUseBibleApi } from 'free-use-bible-api';

const api = new FreeUseBibleApi();

// 日期格式为 YYYY-MM-DD，或 Date 对象（使用本地日历日期）。默认为今天。
const ref = await api.getVerseOfTheDay('2026-01-01');

// 从译本中获取这节经文的文本。
const chapter = await api.getTranslationBookChapter('BSB', ref.book, ref.chapter);
const verses = chapter.chapter.content.filter(
    (c) =>
        c.type === 'verse' &&
        c.number >= ref.verse &&
        c.number <= (ref.endVerse ?? ref.verse)
);
console.log(ref, verses);
```

-   `getVerseOfTheDay(date?, { seed?, category?, dataset? }?)`下载歌词列表并从中挑选。1 `pickVerseOfTheDay(verses, date?, { seed?, category? }?)`从已有的列表中挑选。
-   Kotlin SDK 有`getVerseOfTheDay(date?, seed?, category?)`和`pickVerseOfTheDay(verses, date?, seed?, category?)` ，它们将日期作为`YYYY-MM-DD`字符串接收。
-   Swift SDK 有`getVerseOfTheDay(date:seed:category:)`和`pickVerseOfTheDay(_:date:seed:category:holidays:)` ，分别接受日期作为`YYYY-MM-DD`字符串或`Date` （使用当前时区的日历日期）。
-   [MCP 服务器](https://github.com/HelloAOLab/bible-api/tree/main/packages/seed-bible-mcp)有`getVerseOfTheDay`工具，可以返回每日经文及其文本。
-   `@helloao/tools`包与`@helloao/tools/generation/verse-of-the-day.js`中的列表相同，并且有一个`getVerseOfTheDay(date?, { seed?, category? }?)`函数。

### 执照

该列表由AO Lab整理，并以[MIT许可证](https://github.com/HelloAOLab/bible-api/blob/main/LICENSE)发布。诗句文本来自您获取的任何译本。

## 列出数据集中的经文

`GET https://bible.helloao.org/api/d/{dataset}/verses.json`

获取数据集中的每一节诗句（或短文），以及它们所属的类别，并按规范顺序排列。仅适用于诗句具有类别的数据集，例如`verse-of-the-day` 。

-   `dataset`数据集的 ID（例如`verse-of-the-day` ）。

### 代码示例

::: code-tabs#lang

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

### 结构

```typescript:no-line-numbers title="dataset-verses.ts"
export interface DatasetVerses {
    /**
     * 诗歌的数据集信息。
     */
    dataset: Dataset;

    /**
     * 数据集中的每一节诗（或短文）及其类别，按规范顺序排列。
     */
    verses: DatasetCategorizedVerse[];

    /**
     * 那些有自己专属诗歌和日期的节日。
     * 如果数据集中没有节假日，则省略。
     */
    holidays?: DatasetVersesHoliday[];
}

export interface DatasetVersesHoliday extends DatasetCategoryHoliday {
    /**
     * 节日类别的 ID，例如“圣诞节”。
     */
    id: string;

    /**
     * 该节日的英文名称，例如“圣诞节”。
     */
    name: string;
}

export interface DatasetCategoryHoliday {
    /**
     * 每年同一天的节日的月份（1 代表一月）和日期。
     * 每年日期都会改变的节假日不予列出。
     */
    month?: number;
    day?: number;

    /**
     * 每年日期都会变化的节日的日期（YYYY-MM-DD，公历），按顺序排列。
     * 这些日期是预先计算的，涵盖一系列年份（目前为 2026 年至 2125 年），并且假期只在列出的日期庆祝。
     * 每年同一天的节假日不予列出。
     */
    dates?: string[];
}

export interface DatasetCategorizedVerse {
    /**
     * 书籍的ID，例如“PRO”。
     */
    book: string;

    /**
     * 章节编号。
     */
    chapter: number;

    /**
     * 诗节编号。
     * 如果存在`endVerse` ，则表示该段落从第 1 节开始。
     */
    verse: number;

    /**
     * 这段文字最后出现的诗句。
     * 如果条目只有一节诗，则省略。
     */
    endVerse?: number;

    /**
     * 诗歌所属类别的 ID，按相关性排序，最相关的类别排在最前面。
     */
    categories: string[];

    /**
     * 这是这节经文首次成为每日经文。
     * 如果该诗句一直都在列表中，则省略。
     */
    addedIn?: number;

    /**
     * 这是该经文首次不再能作为每日经文的年份。
     * 删除的诗句仍保留在数据集中，以便仍然可以选择更早年份的诗句。
     * 如果诗句尚未从列表中删除，则省略。
     */
    removedIn?: number;
}
```

### 例子

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

## 数据集中的类别列表

`GET https://bible.helloao.org/api/d/{dataset}/categories.json`

获取数据集中可用的诗歌类别列表。

-   `dataset`数据集的 ID（例如`verse-of-the-day` ）。

### 代码示例

::: code-tabs#lang

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

### 结构

```typescript:no-line-numbers title="dataset-categories.ts"
export interface DatasetCategories {
    /**
     * 各类别的数据集信息。
     */
    dataset: Dataset;

    /**
     * 数据集中可用的诗歌类别列表。
     */
    categories: DatasetCategorySummary[];
}

export interface DatasetCategorySummary {
    /**
     * 类别的 ID，例如“希望”。
     */
    id: string;

    /**
     * 类别的英文名称。例如“希望”。
     */
    name: string;

    /**
     * 该类别中诗歌内容的描述。
     */
    description: string;

    /**
     * 属于该类别的诗句（或短文）的数量。
     */
    numberOfVerses: number;

    /**
     * 该类别所代表的节日的日期（参见上面的 DatasetCategoryHoliday）。
     * 非节假日类别已省略。
     */
    holiday?: DatasetCategoryHoliday;

    /**
     * 该类别对应的 API 链接。
     */
    apiLink: string;
}
```

### 例子

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

## 从数据集中获取类别

`GET https://bible.helloao.org/api/d/{dataset}/categories/{category}.json`

获取一个单独的诗歌类别，以及属于该类别的所有诗歌。

-   `dataset`数据集的 ID（例如`verse-of-the-day` ）。
-   `category`是类别的 ID（例如`hope` ）。

### 代码示例

::: code-tabs#lang

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

### 结构

```typescript:no-line-numbers title="dataset-category.ts"
export interface DatasetCategoryResponse {
    /**
     * 该类别的数据集信息。
     */
    dataset: Dataset;

    /**
     * 该类别及其包含的诗歌。
     */
    category: DatasetCategory;

    /**
     * 此类别对应的 API 链接。
     */
    thisCategoryApiLink: string;
}

export interface DatasetCategory {
    /**
     * 类别的 ID，例如“希望”。
     */
    id: string;

    /**
     * 类别的英文名称。例如“希望”。
     */
    name: string;

    /**
     * 该类别中诗歌内容的描述。
     */
    description: string;

    /**
     * 该类别对应的节日日期（参见“在数据集中列出诗句”中的 DatasetCategoryHoliday）。
     * 在这些日期，每日经文是该类别中的一节经文，其他日期则不使用。
     * 非节假日类别已省略。
     */
    holiday?: DatasetCategoryHoliday;

    /**
     * 属于该类别的经文（或短篇段落），按正典顺序排列。
     * 包括已从列表中删除的诗句（见`removedIn` ）。
     */
    verses: DatasetCategoryVerse[];
}

export interface DatasetCategoryVerse {
    /**
     * 书籍的ID，例如“JER”。
     */
    book: string;

    /**
     * 章节编号。
     */
    chapter: number;

    /**
     * 诗节编号。
     * 如果存在`endVerse` ，则表示该段落从第 1 节开始。
     */
    verse: number;

    /**
     * 这段文字最后结束的那节经文。
     * 如果引用的是单行诗，则省略。
     */
    endVerse?: number;

    /**
     * 这是这节经文首次成为每日经文。
     * 如果该诗句一直都在列表中，则省略。
     */
    addedIn?: number;

    /**
     * 这是该经文首次不再能作为每日经文的年份。
     * 删除的诗句仍保留在数据集中，以便仍然可以选择更早年份的诗句。
     * 如果诗句尚未从列表中删除，则省略。
     */
    removedIn?: number;
}
```

### 例子

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
