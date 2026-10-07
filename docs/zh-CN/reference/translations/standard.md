# 标准格式

章节、完整译文下载和词级注释的标准格式。有关译文和书籍列表的端点，请参阅[“译文、书籍和章节”](./README.md) ；有关相同内容的另一种表示形式，请[参阅简化格式](./simplified.md)。

## 从翻译中获取章节

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`

获取给定书籍和译本的单个章节的内容。

-   `translation`是翻译的 ID（例如`BSB` ）。
-   `book`是书籍的 ID（例如， `GEN`代表创世记 - 你可以[在这里](https://ubsicap.github.io/usfm/identification/books.html)找到书籍 ID 列表）。
-   `chapter`是章节编号（例如， `1`代表第一章）。

### 代码示例

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// 从 BSB 译本中获取创世记 1 章
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

### 结构

```typescript:no-line-numbers title="chapter.ts"
export interface TranslationBookChapter {
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
     * 本章节不同音频版本的链接。
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * 本章节不同音频版本的音频时间轴链接。
     * 每个链接都指向该读者的音频时间文件 - 请参阅下面的“获取章节的音频时间”。
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsLinks;

    /**
     * 下一章的链接。
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
     * 上一章的链接。
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
     * 指向该章节词级注释的链接。
     * 如果章节中没有任何词级注释，则省略。
     */
    thisChapterWordsLink?: string;

    /**
     * 下一章的词级注释链接。
     * 如果这是翻译的最后一章，或者下一章没有任何逐字注释，则省略。
     */
    nextChapterWordsLink?: string;

    /**
     * 上一章的词级注释链接。
     * 如果这是翻译的第一章，或者前一章没有任何逐字注释，则省略。
     */
    previousChapterWordsLink?: string;

    /**
     * 该章节包含的经文数量。
     */
    numberOfVerses: number;

    /**
     * 本章简化版链接。
     * 如果没有简化版章节，则省略。
     */
    simpleChapterApiLink?: string;

    /**
     * 本章内容。
     */
    chapter: ChapterData;
}

interface ChapterData {
    /**
     * 章节编号。
     */
    number: number;

    /**
     * 本章内容。
     */
    content: ChapterContent[];

    /**
     * 本章脚注列表。
     */
    footnotes: ChapterFootnote[];
}

/**
 * 表示单个章节内容的联合类型。
 * 章节内容可以是以下几种形式之一：
 * 标题。
 * - 换行符。
 * 一首诗。
 * - 提供希伯来语字幕。
 */
type ChapterContent = ChapterHeading | ChapterLineBreak | ChapterVerse | ChapterHebrewSubtitle;

/**
 * 章节标题。
 */
interface ChapterHeading {
    /**
     * 表示该内容为标题。
     */
    type: 'heading';

    /**
     * 标题内容。
     * 如果数组中包含多个字符串，则应使用空格将它们连接起来。
     */
    content: string[];
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
 * 章节中的希伯来语字幕。
 * 这些内容通常作为信息内容包含在原始手稿中。
 * 例如，《诗篇》第 49 篇的希伯来副标题是“交与伶长。可拉后裔的诗”。
 */
interface ChapterHebrewSubtitle {
    /**
     * 表示该内容为希伯来语字幕。
     */
    type: 'hebrew_subtitle';

    /**
     * 副标题中包含的内容列表。
     * 列表中的每个元素都可以是字符串、格式化文本或脚注引用。
     */
    content: (string | FormattedText | VerseFootnoteReference)[];
}

/**
 * 章节中的一节诗。
 */
interface ChapterVerse {
    /**
     * 表示内容为一首诗。
     */
    type: 'verse';

    /**
     * 诗节的编号。
     */
    number: number;

    /**
     * 诗歌内容列表。
     * 列表中的每个元素都可以是字符串、格式化文本或脚注引用。
     */
    content: (string | FormattedText | InlineHeading | InlineLineBreak | VerseFootnoteReference)[];
}

/**
 * 格式化文本。即以特定方式格式化的文本。
 */
interface FormattedText {
    /**
     * 已格式化的文本。
     */
    text: string;

    /**
     * 这段文字是否是一首诗？
     * 该数字表示缩进级别。
     *
     * 在《诗篇》中很常见。
     */
    poem?: number;

    /**
     * 这段文字是否代表耶稣的话语。
     */
    wordsOfJesus?: boolean;
}

/**
 * 定义一个表示嵌入诗句中的标题的接口。
 */
interface InlineHeading {
    /**
     * 标题文本。
     */
    heading: string;
}

/**
 * 定义一个表示嵌入诗句中的换行符的接口。
 */
interface InlineLineBreak {
    lineBreak: true;
}


/**
 * 诗句或希伯来语副标题中的脚注参考。
 */
interface VerseFootnoteReference {
    /**
     * 纸条的ID。
     */
    noteId: number;
}

/**
 * 关于脚注的信息。
 */
interface ChapterFootnote {
    /**
     * 被引用的笔记的ID。
     */
    noteId: number;

    /**
     * 脚注正文。
     */
    text: string;

    /**
     * 脚注所引用的经文。
     */
    reference?: {
        chapter: number;
        verse: number;
    };

    /**
     * 脚注中应使用的调用者。
     * 对于脚注而言，“引用者”是指在正文中用来引用脚注的字符。
     *
     * 例如，在文本中：
     * 你好（a）世界
     *
     * ---- (a) 这是脚注。
     *
     * “（a）”是调用者。
     *
     * 如果为“+”，则调用者应自动生成。
     * 如果为空，则调用者应为空。
     * 如果是字符串，则调用者应该是该字符串。
     */
    caller: '+' | string | null;
}

/**
 * 本书章节的音频链接。
 */
interface TranslationBookChapterAudioLinks {
    /**
     * 本章节的阅读器和音频文件的URL链接。
     */
    [reader: string]: string;
}

/**
 * 本书章节的音频时间轴链接。
 */
interface TranslationBookChapterAudioTimingsLinks {
    /**
     * 该章节的阅读器以及该阅读器音频时间文件的 API 链接。
     */
    [reader: string]: string;
}
```

### 例子

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

## 获取章节的音频时间轴

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.{reader}.audioTimings.json`

获取单个章节中每个诗句的音频时间，该时间由单个朗读者朗读——即每个诗句开始的时间（以秒为单位，相对于该朗读者音频文件的起始时间）。客户端可以使用此信息在音频播放时高亮显示当前正在朗读的诗句。

只有部分译本和读者提供音频时间轴。如果某个章节包含读者的音频时间轴，则会在该章节的索引`thisChapterAudioTimings`处添加一个条目，该条目以该读者的 ID 为键；如果某个读者不在该索引中，则该读者和章节的此文件不存在。

-   `translation`是翻译的 ID（例如`BSB` ）。
-   `book`是书籍的 ID（例如， `GEN`代表创世记 - 你可以[在这里](https://ubsicap.github.io/usfm/identification/books.html)找到书籍 ID 列表）。
-   `chapter`是章节编号（例如， `1`代表第一章）。
-   `reader`是叙述时间所对应的读者的 ID（例如`hays` ）——章节的可用读者是其`thisChapterAudioLinks`的键。

一节诗的结尾就是下一节诗的开头（或者，对于最后一节诗来说，就是音频文件的结尾），因此，客户只需要按顺序排列的开始时间列表，就可以为整个章节构建高亮显示范围。

无论从常规章节终点还是[简化章节](./simplified.md#get-a-simplified-chapter-from-a-translation)终点到达此文件，该文件都是相同的——每个翻译、书籍、章节和读者都只有一组时间。

### 代码示例

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter-audio-timings.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;
const reader = 'hays';

// 获取“hays”朗读的创世纪1（BSB）的音频时间轴。
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

### 结构

```typescript:no-line-numbers title="chapter-audio-timings.ts"
/**
 * 为单个读者定义书籍章节的音频播放时间。
 * 映射到 /api/{translation}/{book}/{chapter}.{reader}.audioTimings.json 端点。
 */
export interface TranslationBookChapterAudioTimings {
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
     * 这些计时数据所对应的阅读器 ID。
     */
    reader: string;

    /**
     * 这些时间轴对应的音频文件链接。
     */
    audioLink: string;

    /**
     * 本章信息的链接。
     */
    thisChapterLink: string;

    /**
     * 下一章信息的链接。
     * 如果这是翻译的最后一章，则返回 null。
     */
    nextChapterLink: string | null;

    /**
     * 上一章信息的链接。
     * 如果这是翻译的第一章，则为空。
     */
    previousChapterLink: string | null;

    /**
     * 此音频时序文件的链接。
     */
    thisChapterAudioTimingsLink: string;

    /**
     * 为同一读者提供的下一章阅读时间链接。
     * 如果这是翻译的最后一章，则返回 null。
     */
    nextChapterAudioTimingsLink: string | null;

    /**
     * 指向上一章的阅读时间链接，供同一读者参考。
     * 如果这是翻译的第一章，则为空。
     */
    previousChapterAudioTimingsLink: string | null;

    /**
     * 按顺序列出每节诗句开始的时间（以秒为单位）。
     * 第一个数字（索引 0）是录音中第一段歌词开始的时间。
     */
    verses: number[];
}
```

### 例子

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

`verses[0]`是第 1 节的开始时间， `verses[1]`是第 2 节的开始时间，依此类推——所以在这个例子中，创世记 1 章第 2 节（BSB，由“hays”朗读）从`audioLink`秒开始 4.32 秒。

## 获取章节内容

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.words.json`

获取单个章节的词级注释（斯特朗编号和相关来源数据）。

仅部分译文包含词级注释。包含词级注释的章节会链接到此文件，链接值为`thisChapterWordsLink` ；如果缺少此属性，则表示该章节不存在此文件。

-   `translation`是翻译的 ID（例如`BSB` ）。
-   `book`是书籍的 ID（例如， `GEN`代表创世记 - 你可以[在这里](https://ubsicap.github.io/usfm/identification/books.html)找到书籍 ID 列表）。
-   `chapter`是章节编号（例如， `1`代表第一章）。

每条注释都锚定在诗句`content`数组中单个元素`text.slice(start, end)`字符范围内： `contentIndex`是元素的索引， `start` / `end`是该元素文本中的字符偏移量。4 是排除的，所以`end`是被注释的单词。

将内容项（而不是整个经文）锚定，意味着对于内容被分成多个项（例如诗行、耶稣的话语和脚注参考）的经文，偏移量仍然正确。

### 代码示例

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter-words.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// 从 BSB 译本中获取创世记 1 章的经文。
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

### 结构

```typescript:no-line-numbers title="chapter-words.ts"
export interface TranslationBookChapterWords {
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
     * 本章信息的链接。
     */
    thisChapterLink: string;

    /**
     * 下一章信息的链接。
     * 如果这是翻译的最后一章，则返回 null。
     */
    nextChapterLink: string | null;

    /**
     * 上一章信息的链接。
     * 如果这是翻译的第一章，则为空。
     */
    previousChapterLink: string | null;

    /**
     * 此Word文档的链接。
     */
    thisChapterWordsLink: string;

    /**
     * 下一章的文本链接。
     * 如果这是翻译中的最后一章，或者下一章没有任何词级注释，则返回 null。
     */
    nextChapterWordsLink: string | null;

    /**
     * 上一章的文本链接。
     * 如果这是翻译中的第一章，或者前一章没有任何词级注释，则返回 null。
     */
    previousChapterWordsLink: string | null;

    /**
     * 章节中每一节经文的注释词，按节号标注。
     * 每个列表都按照诗句中词语出现的顺序排列。
     */
    verses: {
        [verseNumber: string]: ChapterWord[];
    };
}

interface ChapterWord {
    /**
     * 注释所应用到的诗句内容数组中的项的索引。
     */
    contentIndex: number;

    /**
     * 内容项文本中被注释词的第一个字符的索引。
     */
    start: number;

    /**
     * 内容项文本中被注释词的最后一个字符之后的索引。
     * 也就是说，text.slice(start, end) 是带注释的单词。
     */
    end: number;

    /**
     * 该词的斯特朗编号。
     * 如果译文仅提供了该词的其他注释，则省略。
     */
    strongs?: string[];

    /**
     * 该词的字典（引用）形式。
     * 如果译文中未提供，则省略。
     */
    lemma?: string;

    /**
     * 该词的词法解析代码。
     * 如果译文中未提供，则省略。
     */
    morph?: string;

    /**
     * 指向源文本中该单词的指针，格式为<sourceName> : <location> 。
     * 如果译文中未提供，则省略。
     */
    srcloc?: string;

    /**
     * 这个词是源词的哪一次出现？1-基数。
     * 如果译文中未提供，则省略。
     */
    occurrence?: number;

    /**
     * 源词出现的总次数。
     * 如果译文中未提供，则省略。
     */
    occurrences?: number;
}
```

### 例子

假设某一章节的第一节只有一个内容项：

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

“文件”一词用于注释该项目的字符：

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

也就是说， `"In the beginning...".slice(0, 2)`是`"In"` ，而源标记为`G1722` 。

## 获取完整翻译

`GET https://bible.helloao.org/api/{translation}/complete.json`

获取整个翻译的内容。

-   `translation`是翻译的 ID（例如`BSB` ）。

### 代码示例

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-translation-complete.js"
const translation = 'BSB';

// 从 BSB 译本中获取创世记 1 章
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

### 结构

```typescript:no-line-numbers title="complete.ts"
/**
 * 定义完整的翻译下载数据。
 * 映射到 /api/:translationId/complete.json 端点。
 */
export interface TranslationComplete {
    /**
     * 翻译元数据。
     */
    translation: Translation;

    /**
     * 包含所有章节的完整书籍列表。
     */
    books: TranslationCompleteBook[];
}

/**
 * 本书提供完整译本下载。
 */
export interface TranslationCompleteBook {
    /**
     * 这本书的ID。
     */
    id: string;

    /**
     * 译文中的书名。
     */
    name: string;

    /**
     * 这本书的通用名称。
     */
    commonName: string;

    /**
     * 书名。
     */
    title: string | null;

    /**
     * 本书的顺序。
     */
    order: number;

    /**
     * 这本书的章节数。
     */
    numberOfChapters: number;

    /**
     * 这本书的总诗节数。
     */
    totalNumberOfVerses: number;

    /**
     * 该书是否为伪经。
     */
    isApocryphal?: boolean;

    /**
     * 包含所有内容的完整章节列表。
     */
    chapters: TranslationCompleteChapter[];
}

/**
 * 完整翻译下载中的一章。
 */
export interface TranslationCompleteChapter {
    /**
     * 该章节包含的经文数量。
     */
    numberOfVerses: number;

    /**
     * 本章节不同音频版本的链接。
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * 本章节不同音频版本的音频时长（每节诗的开始时间，以秒为单位）。
     *
     * 与单个章节端点上的`thisChapterAudioTimings` （链接到下面的“获取章节的音频时间轴”）不同，这里包含了时间轴本身——因为完整翻译下载的目的就是将所有内容放在一个文件中。
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsMap;

    /**
     * 指向该章节词级注释的链接。
     * 如果章节中没有任何词级注释，则省略。
     */
    thisChapterWordsLink?: string;

    /**
     * 本章内容。
     */
    chapter: ChapterData;
}

/**
 * 书籍章节的音频时间轴，直接嵌入而非链接。
 * 将读者 ID 映射到每节诗开始的时间（以秒为单位）列表，按诗节顺序排列。
 */
interface TranslationBookChapterAudioTimingsMap {
    [reader: string]: number[];
}
```

### 例子

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
