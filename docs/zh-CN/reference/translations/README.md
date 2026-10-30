# 译文、书籍和章节

用于浏览译文、列出书籍和获取章节内容的端点。

章节内容、完整翻译下载和词级注释均提供两种格式：

-   [**标准格式**](./standard.md)——原始的结构化格式。诗歌内容是由您自行组合的各种部分（纯文本、格式化文本、脚注参考文献等）组成的列表。
-   [**简化格式**](./simplified.md)- 一种扁平化的格式，其中每节诗的内容都是一个字符串，脚注、诗歌和其他标记表示为该字符串中的偏移量。

选择最适合您计划如何渲染或处理文本的格式。

## 现有译文

`GET https://bible.helloao.org/api/available_translations.json`

获取 API 中可用的翻译列表。

### 代码示例

::: code-tabs#lang

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

### 结构

```typescript:no-line-numbers title="available-translations.ts"
export interface AvailableTranslations {
    /**
     * 译文列表。
     */
    translations: Translation[];
}

interface Translation {
    /**
     * 翻译的ID。
     */
    id: string;

    /**
     * 译文名称。
     * 这通常是译文在译文语言中的名称。
     */
    name: string;

    /**
     * 译文的英文名称。
     */
    englishName: string;

    /**
     * 翻译网站。
     */
    website: string;

    /**
     * 翻译许可证的网址。
     */
    licenseUrl: string;

    /**
     * API 为许可证添加了注释。
     * 如果没有笔记，则返回 null 或 undefined。
     */
    licenseNotes?: string | null;

    /**
     * 显示翻译内容时应显示的通知。
     * 如果翻译中没有提示信息，则返回 null 或 undefined。
     */
    licenseNotice?: string | null;

    /**
     * 检测到的用于翻译的结构化许可条款。
     * 如果无法确定术语，则为 null 或 undefined。
     * 在这种情况下，请查看 licenseUrl 页面上的条款。
     */
    license?: License | null;

    /**
     * 翻译的简称。
     */
    shortName: string;

    /**
     * 翻译主要使用的 ISO 639 三字母语言标签。
     */
    language: string;

    /**
     * 获取翻译所使用的语言名称。
     * 如果语言名称未知，则返回 null 或 undefined。
     */
    languageName?: string;

    /**
     * 获取该语言的英文名称。
     * 如果该语言没有英文名称，则返回 null 或 undefined。
     */
    languageEnglishName?: string;

    /**
     * 语言的书写方向。
     * “ltr”表示文本是从页面左侧向右侧书写的。
     * “rtl”表示文本是从页面右侧向左侧书写的。
     */
    textDirection: 'ltr' | 'rtl';

    /**
     * 可用的格式列表。
     */
    availableFormats: ('json' | 'usfm')[];

    /**
     * 此译本可用书籍列表的 API 链接。
     */
    listOfBooksApiLink: string;

    /**
     * 本译本包含的书籍数量。
     *
     * 完整的译本应该与圣经的卷数相同（66）。
     */
    numberOfBooks: number;

    /**
     * 本译本共包含章节总数。
     *
     * 完整的译本应该与圣经的章节数相同（1,189）。
     */
    totalNumberOfChapters: number;

    /**
     * 本译本共包含的诗节总数。
     *
     * 完整的译本应该与圣经的经文数量相同（大约 31,102 节——有些译本根据原文中可能存在的经文数量排除了某些经文）。
     */
    totalNumberOfVerses: number;

    /**
     * 此译本中包含的伪经总数。
     * 如果译文不包含伪经，则省略。
     */
    numberOfApocryphalBooks?: number;

    /**
     * 本译本中包含的伪经章节总数。
     * 如果译文不包含伪经，则省略。
     */
    totalNumberOfApocryphalChapters?: number;

    /**
     * 本译本中包含的伪经经文总数。
     * 如果译文不包含伪经，则省略。
     */
    totalNumberOfApocryphalVerses?: number;
}

/**
 * 定义为翻译检测到的结构化许可条款。
 */
interface License {
    /**
     * 使用译文时是否需要注明原文出处？
     */
    attribution: 'required' | 'not-required';

    /**
     * 是否允许将译文用于商业用途。
     */
    commercialUse: 'allowed' | 'not-allowed';

    /**
     * 是否允许创作和传播该译文的衍生作品。
     */
    derivatives: 'allowed' | 'not-allowed';

    /**
     * 衍生作品是否必须以相同的许可协议分发（即“相同方式共享”的要求）。
     */
    copyleft: boolean;

    /**
     * 该译本是否已进入公有领域。
     */
    publicDomain: boolean;
}
```

### 许可证

每部译文均按其各自的许可协议发布，因此在使用前请查看译文的条款。

-   `licenseUrl`始终链接到完整的许可条款。
-   `licenseNotice` （如有）是版权或署名声明，将显示在翻译内容旁边。
-   `licenseNotes`包含 API 添加的注释，例如对源文本所做的更改。
-   如果存在，则`license`会以代码可检查的形式汇总术语。例如，您可以将列表筛选为允许商业用途的翻译：

```ts:no-line-numbers title="commercial-translations.js"
fetch(`https://bible.helloao.org/api/available_translations.json`)
    .then(request => request.json())
    .then(({ translations }) => {
        const commercial = translations.filter(
            t => t.license?.commercialUse === 'allowed'
        );
        console.log('Translations that allow commercial use:', commercial);
    });
```

仅当术语可以自动检测到时才会设置`license`未设置 0 的翻译可能仍然允许您使用，因此请阅读第`licenseUrl`页以了解详情。

### 例子

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

## 列出翻译书籍

`GET https://bible.helloao.org/api/{translation}/books.json`

获取给定译本的可用书籍列表。

-   `translation`是翻译的 ID（例如`BSB` ）。

### 代码示例

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-books.js"
const translation = 'BSB';

// 获取 BSB 翻译所需的书籍列表
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

### 结构

```typescript:no-line-numbers title="books.ts"
export interface TranslationBooks {
    /**
     * 书籍的翻译信息。
     */
    translation: Translation;

    /**
     * 可供翻译的书籍清单。
     */
    books: TranslationBook[];
}

interface TranslationBook {
    /**
     * 这本书的ID。
     */
    id: string;

    /**
     * 译者为这本书提供的书名。
     */
    name: string;

    /**
     * 这本书的通用名称。
     */
    commonName: string;

    /**
     * 译者为本书提供的简称。
     * 如果没有，则表示翻译过程中没有提供相关信息。
     */
    shortName?: string;

    /**
     * 书名。
     * 这通常是书名的更具描述性的版本。
     * 如果没有，则表示翻译过程中没有提供相关信息。
     */
    title: string | null;

    /**
     * 译本中书籍的编号顺序。
     */
    order: number;

    /**
     * 这本书包含的章节数量。
     */
    numberOfChapters: number;

    /**
     * 本书第一章的编号。
     */
    firstChapterNumber: number;

    /**
     * 本书第一章的链接。
     */
    firstChapterApiLink: string;

    /**
     * 书中最后一章的章号。
     */
    lastChapterNumber: number;

    /**
     * 本书最后一章的链接。
     */
    lastChapterApiLink: string;

    /**
     * 这本书包含的诗节数量。
     */
    totalNumberOfVerses: number;

    /**
     * 这本书是否是伪经？
     * 如果译文为权威译文，则省略。
     */
    isApocryphal?: boolean;
}
```

### 例子

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
            "shortName": "Gen",
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
