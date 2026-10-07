# 简化格式

章节、完整译文下载和词级注释的简化格式。有关译文和书籍列表，请参阅[“译文、书籍和章节”](./README.md) ；有关相同内容的原始结构化表示，请[参阅标准格式](./standard.md)。

## 从翻译中获取简体章节

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.simple.json`

获取给定书籍和译本的单个章节的内容，采用简化格式。

在简化的格式中，每节经文的内容都是一个单独的字符串，而不是一个格式化的内容列表。这意味着您无需自行构建经文文本，这避免了因格式问题而导致的文本编写难度——尤其是在空格方面。任何无法用普通字符串表示的内容——例如脚注、耶稣的话语、诗歌以及出现在经文中间的标题——都会以偏移量的形式保留在该字符串中，因此不会丢失任何信息。

如果您需要获取章节文本，请使用此端点。如果您需要以原始格式渲染章节，请使用[常规章节端点](./standard.md#get-a-chapter-from-a-translation)。

-   `translation`是翻译的 ID（例如`BSB` ）。
-   `book`是书籍的 ID（例如， `GEN`代表创世记 - 你可以[在这里](https://ubsicap.github.io/usfm/identification/books.html)找到书籍 ID 列表）。
-   `chapter`是章节编号（例如， `1`代表第一章）。

具有词级注释的章节通过`thisChapterWordsLink`链接到它们，这指向[简化的注释](#get-the-words-of-a-chapter-in-the-simplified-format)——偏移量与此文件中的文本相匹配的注释。

具有每个读者音频时间轴的章节通过`thisChapterAudioTimings`链接到它们，该 1 指向[音频时间轴端点](./standard.md#get-the-audio-timings-for-a-chapter)——与常规章节端点链接到的同一个文件，因为时间轴不依赖于章节格式。

### 代码示例

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-simple-chapter.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// 请从BSB译本中获取创世记1章的文本。
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

### 偏移量

简化格式中的所有偏移量`offset`和`end`都是指向包含它们的诗句第`text`行的索引。它们以 UTF- `start`代码单元为单位，这也是 JavaScript `String.prototype.length`和`String.prototype.slice()`所使用的编码格式。

`start`表示包含范围， `end`表示排除范围，因此`text.slice(start, end)`返回的正是标记的文本范围。脚注偏移量是指脚注调用者所在的位置，因此`text.slice(0, offset)`表示脚注之前的文本。

### 结构

```typescript:no-line-numbers title="simple-chapter.ts"
export interface SimpleTranslationBookChapter {
    /**
     * 本书章节的翻译信息。
     */
    translation: Translation;

    /**
     * 本书章节的书籍信息。
     */
    book: TranslationBook;

    /**
     * 当前章节的链接。
     */
    thisChapterLink: string;

    /**
     * 本章完整（非简化）版本的链接。
     */
    fullChapterApiLink: string;

    /**
     * 本章节不同音频版本的链接。
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * 本章节不同音频版本的音频时间轴链接。
     * 请参阅标准格式文档中的“获取章节的音频时间轴”——无论链接到哪个章节格式，时间轴文件都是相同的。
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsLinks;

    /**
     * 下一章的链接（简化版）。
     * 如果这是翻译的最后一章，则返回 null。
     */
    nextChapterApiLink: string | null;

    /**
     * 下一章的不同音频版本链接。
     * 如果这是翻译的最后一章，则返回 null。
     */
    nextChapterAudioLinks: TranslationBookChapterAudioLinks | null;

    /**
     * 下一章不同音频版本的音频时间轴链接。
     * 如果这是翻译的最后一章，则返回 null。
     */
    nextChapterAudioTimings: TranslationBookChapterAudioTimingsLinks | null;

    /**
     * 上一章的链接（简化版）。
     * 如果这是翻译的第一章，则为空。
     */
    previousChapterApiLink: string | null;

    /**
     * 上一章不同音频版本的链接。
     * 如果这是翻译的第一章，则为空。
     */
    previousChapterAudioLinks: TranslationBookChapterAudioLinks | null;

    /**
     * 上一章不同音频版本的音频时间轴链接。
     * 如果这是翻译的第一章，则为空。
     */
    previousChapterAudioTimings: TranslationBookChapterAudioTimingsLinks | null;

    /**
     * 该章节包含的经文数量。
     */
    numberOfVerses: number;

    /**
     * 本章内容。
     */
    chapter: SimpleChapterData;
}

interface SimpleChapterData {
    /**
     * 章节编号。
     */
    number: number;

    /**
     * 本章内容。
     */
    content: SimpleChapterContent[];

    /**
     * 无法与诗句关联的脚注列表。
     * 属于诗句的脚注包含在诗句本身中，因此该列表通常为空。
     */
    footnotes: ChapterFootnote[];
}

/**
 * 表示简化章节中单个内容的联合类型。
 */
type SimpleChapterContent = SimpleChapterHeading | ChapterLineBreak | SimpleChapterVerse | SimpleChapterHebrewSubtitle;

/**
 * 章节标题。
 */
interface SimpleChapterHeading {
    /**
     * 表示该内容为标题。
     */
    type: 'heading';

    /**
     * 标题文本。
     */
    text: string;
}

/**
 * 章节中的换行符。
 */
interface ChapterLineBreak {
    /**
     * 表示内容为换行符。
     */
    type: 'line_break';
}

/**
 * 章节中的一节诗。
 */
interface SimpleChapterVerse {
    /**
     * 表示内容为一首诗。
     */
    type: 'verse';

    /**
     * 诗节的编号。
     */
    number: number;

    /**
     * 诗句的文本。
     * 诗行和换行符之间用换行符（\n）分隔。
     */
    text: string;

    /**
     * 诗句中出现的脚注。
     */
    footnotes: SimpleVerseFootnote[];

    /**
     * 出现在诗句中间的标题。
     * 如果诗句中没有内联标题，则省略。
     */
    headings?: SimpleInlineHeading[];

    /**
     * 代表耶稣话语的经文范围。
     * 如果诗句中没有诗句，则省略。
     */
    wordsOfJesus?: SimpleTextRange[];

    /**
     * 诗歌文本中代表诗行的范围。
     * 如果诗句中没有诗句，则省略。
     */
    poem?: SimplePoemRange[];
}

/**
 * 章节中的希伯来语字幕。
 * 这些内容通常作为信息性内容包含在原始手稿中。
 * 例如，《诗篇》第 49 篇的希伯来副标题是“交与伶长。可拉后裔的诗”。
 */
interface SimpleChapterHebrewSubtitle extends Omit<SimpleChapterVerse, 'type' | 'number'> {
    /**
     * 表示该内容为希伯来语字幕。
     */
    type: 'hebrew_subtitle';
}

/**
 * 诗歌中的脚注。
 */
interface SimpleVerseFootnote {
    /**
     * 纸条的ID。
     */
    noteId: number;

    /**
     * 脚注引用者应插入的诗句正文中的索引位置。
     */
    offset: number;

    /**
     * 脚注正文。
     */
    text: string;

    /**
     * 脚注中应使用的调用者。
     * 如果为“+”，则调用者应自动生成。
     * 如果为空，则调用者应为空。
     * 如果是字符串，则调用者应该是该字符串。
     */
    caller: '+' | string | null;
}

/**
 * 诗句中嵌入的标题。
 */
interface SimpleInlineHeading {
    /**
     * 标题在诗句正文中出现的索引位置。
     */
    offset: number;

    /**
     * 标题文本。
     */
    text: string;
}

/**
 * 诗句中的一段文字。
 */
interface SimpleTextRange {
    /**
     * 该范围内第一个字符的索引。
     */
    start: number;

    /**
     * 范围最后一个字符之后的索引。
     */
    end: number;
}

/**
 * 诗句中代表一行诗的文本区域。
 */
interface SimplePoemRange extends SimpleTextRange {
    /**
     * 诗行应采用的缩进级别。
     */
    level: number;
}
```

### 例子

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

诗歌和耶稣的话语以范围的形式保留在经文文本中。例如，在译本`engwebp`中， `Matthew 5:3`看起来像这样：

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

## 获取章节的简体字版本

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.words.simple.json`

获取单个章节的词级注释，并将它们的偏移量重新映射到每个[简化诗句](#get-a-simplified-chapter-from-a-translation)的文本上。

[常规注释](./standard.md#get-the-words-of-a-chapter)中的偏移量锚定在诗节的`content`数组元素上，而简化格式会将这些元素替换为单个字符串——因此它们无法与简化格式一起使用。处理简化章节时，请改用此文件。

-   `translation`是翻译的 ID（例如`BSB` ）。
-   `book`是书籍的 ID（例如， `GEN`代表创世记 - 你可以[在这里](https://ubsicap.github.io/usfm/identification/books.html)找到书籍 ID 列表）。
-   `chapter`是章节编号（例如， `1`代表第一章）。

这些条目没有`contentIndex` `start` `end`是插入到经文第`text`节的偏移量，就像简化章节中的脚注、诗歌和耶稣的话语的偏移量一样，所以`text.slice(start, end)`是注释词。

与常规注释一样，只有部分译本包含注释。包含注释的简化章节会链接到此文件，链接值为`thisChapterWordsLink` ；如果缺少此属性，则表示该章节不存在此文件。

### 代码示例

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-simple-chapter-words.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// 获取《创世记》第一章的文本及其注释。
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

### 结构

结构与[常规注释](./standard.md#get-the-words-of-a-chapter)相符，只是链接指向简化的文件，并且条目没有`contentIndex` 。

```typescript:no-line-numbers title="simple-words.ts"
export interface SimpleTranslationBookChapterWords {
    /**
     * 翻译的ID。
     */
    translationId: string;

    /**
     * 这本书的ID。
     */
    bookId: string;

    /**
     * 章节编号。
     */
    chapterNumber: number;

    /**
     * 这些注释对应的是简化版章节的链接。
     */
    thisChapterLink: string;

    /**
     * 下一章简明版的链接。
     * 如果这是翻译的最后一章，则返回 null。
     */
    nextChapterLink: string | null;

    /**
     * 上一章简化版的链接。
     * 如果这是翻译的第一章，则为空。
     */
    previousChapterLink: string | null;

    /**
     * 这些注释的链接。
     */
    thisChapterWordsLink: string;

    /**
     * 下一章注释的链接。
     * 如果这是翻译中的最后一章，或者下一章没有任何词级注释，则返回 null。
     */
    nextChapterWordsLink: string | null;

    /**
     * 上一章注释的链接。
     * 如果这是翻译中的第一章，或者上一章没有任何词级注释，则返回 null。
     */
    previousChapterWordsLink: string | null;

    /**
     * 章节中每一节经文的注释词，按节号标注。
     * 每个列表都按照诗句中词语出现的顺序排列。
     */
    verses: {
        [verseNumber: string]: SimpleChapterWord[];
    };
}

/**
 * 简化章节中的词级注释。
 */
export interface SimpleChapterWord {
    /**
     * 诗句文本中被注释单词的第一个字符的索引。
     */
    start: number;

    /**
     * 诗句文本中被注释单词最后一个字符后的索引。
     */
    end: number;

    /**
     * 斯特朗氏词典中该词的计数。
     */
    strongs?: string[];

    /**
     * 源语言中该词的词条（字典形式）。
     */
    lemma?: string;

    /**
     * 源语言中该词的形态。
     */
    morph?: string;

    /**
     * 该词在原文中的位置。
     */
    srcloc?: string;

    /**
     * 这是该词在诗句中的哪一次出现？
     */
    occurrence?: number;

    /**
     * 该词在诗句中出现的次数。
     */
    occurrences?: number;
}
```

### 例子

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

该章第 1 节的文本是`"In the beginning was the Word, and the Word was with God, and the Word was God."` ，所以`text.slice(7, 16)`是`"beginning"` 。

## 获取完整的简体格式翻译

`GET https://bible.helloao.org/api/{translation}/complete.simple.json`

获取整篇译文的内容，采用简化格式。这是应用于[完整译文下载的](./standard.md#get-an-entire-translation)[简化章节格式](#get-a-simplified-chapter-from-a-translation)：一个包含整篇译文的文件，其中每节经文的内容都是一个单独的字符串。

如果您想要获取整部译文的文本，而无需逐章提出请求，也无需自己构建文本，请使用此功能。

-   `translation`是翻译的 ID（例如`BSB` ）。

此文件与文件`complete.json`同时生成，因此翻译要么同时包含这两个文件，要么都不包含。两个文件中的`translation`对象都包含`completeTranslationApiLink`和`simpleCompleteTranslationApiLink` ，因此您可以在两种格式之间进行转换。

### 代码示例

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-translation-complete-simple.js"
const translation = 'BSB';

// 获取完整的BSB翻译文本
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

### 结构

结构与[常规完整翻译下载](./standard.md#get-an-entire-translation)相同，只是每个章节都使用简化格式。

```typescript:no-line-numbers title="complete-simple.ts"
/**
 * 使用简化的章节格式定义完整的翻译下载数据。
 * 映射到 /api/:translationId/complete.simple.json 端点。
 */
export interface SimpleTranslationComplete {
    /**
     * 翻译元数据。
     */
    translation: Translation;

    /**
     * 包含所有章节的完整书籍列表。
     */
    books: SimpleTranslationCompleteBook[];
}

/**
 * 本书提供完整翻译下载，采用简化的章节格式。
 */
export interface SimpleTranslationCompleteBook extends Omit<TranslationCompleteBook, 'chapters'> {
    /**
     * 包含所有内容的完整章节列表。
     */
    chapters: SimpleTranslationCompleteChapter[];
}

/**
 * 完整翻译下载中的一章，采用简化的章节格式。
 */
export interface SimpleTranslationCompleteChapter {
    /**
     * 该章节包含的经文数量。
     */
    numberOfVerses: number;

    /**
     * 本章节不同音频版本的链接。
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * 本章节的音频时间（每节诗的开始时间，以秒为单位）。
     *
     * 请注意，完整的翻译文件包含时间轴本身（请参阅标准格式文档中的 TranslationBookChapterAudioTimingsMap），这与包含指向时间轴链接的各个章节端点不同。
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsMap;

    /**
     * 提供章节词级注释的链接，采用简化格式。如果章节没有词级注释，则省略此链接。
     */
    thisChapterWordsLink?: string;

    /**
     * 本章的简化信息。
     */
    chapter: SimpleChapterData;
}
```

### 例子

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
