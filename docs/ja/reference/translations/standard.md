# 標準フォーマット

章、全文翻訳のダウンロード、単語レベルの注釈の標準フォーマットです。翻訳および書籍一覧のエンドポイントについては、 [「翻訳、書籍、章」を](./README.md)参照してください。同じコンテンツの別の表現方法については、[簡略化されたフォーマットを](./simplified.md)参照してください。

## 翻訳版から章を取得する

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`

指定された書籍と翻訳版について、1章分の内容を取得します。

-   `translation`は翻訳の ID です (例: `BSB` )。
-   `book`は書籍のIDです（例：創世記の場合は`GEN` - 書籍IDのリストは[こちらで](https://ubsicap.github.io/usfm/identification/books.html)確認できます）。
-   `chapter`は章番号を表します（例えば、 `1`は第1章）。

### コード例

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// BSB訳の創世記1章を入手してください
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

### 構造

```typescript:no-line-numbers title="chapter.ts"
export interface TranslationBookChapter {
    /**
     * 書籍の章に関する翻訳情報。
     */
    translation: Translation;

    /**
     * 本書の該当章に関する情報。
     */
    book: TranslationBook;

    /**
     * 現在の章へのリンク。
     */
    thisChapterLink: string;

    /**
     * 各章の異なる音声版へのリンク。
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * この章の各音声バージョンの音声タイミングへのリンクです。
     * 各リンクは、その朗読者の音声タイミングファイルへのリンクです。詳しくは、下記の「章ごとの音声タイミングを取得する」をご覧ください。
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsLinks;

    /**
     * 次の章へのリンク。
     * これが翻訳の最終章の場合はnull。
     */
    nextChapterApiLink: string | null;

    /**
     * 次の章の様々な音声版へのリンクです。
     * これが翻訳の最終章の場合はnull。
     */
    nextChapterAudioLinks: TranslationBookChapterAudioLinks | null;

    /**
     * 次の章の各音声バージョンの音声タイミングへのリンクです。
     * これが翻訳の最終章の場合はnull。
     */
    nextChapterAudioTimings: TranslationBookChapterAudioTimingsLinks | null;

    /**
     * 前の章へのリンク。
     * これが翻訳の最初の章である場合はnull。
     */
    previousChapterApiLink: string | null;

    /**
     * 前章の様々な音声版へのリンクです。
     * これが翻訳の最初の章である場合はnull。
     */
    previousChapterAudioLinks: TranslationBookChapterAudioLinks | null;

    /**
     * 前章の各音声バージョンの音声タイミングへのリンクです。
     * これが翻訳の最初の章である場合はnull。
     */
    previousChapterAudioTimings: TranslationBookChapterAudioTimingsLinks | null;

    /**
     * 章の単語レベルの注釈へのリンク。
     * 章に単語レベルの注釈がない場合は省略されます。
     */
    thisChapterWordsLink?: string;

    /**
     * 次の章の単語レベルの注釈へのリンクです。
     * これが翻訳の最終章である場合、または次の章に単語レベルの注釈がない場合は省略されます。
     */
    nextChapterWordsLink?: string;

    /**
     * 前章の単語レベルの注釈へのリンク。
     * これが翻訳の最初の章である場合、または前の章に単語レベルの注釈がない場合は省略されます。
     */
    previousChapterWordsLink?: string;

    /**
     * その章に含まれる節の数。
     */
    numberOfVerses: number;

    /**
     * この章の簡略版へのリンクはこちらです。
     * 簡略化された章が利用できない場合は省略します。
     */
    simpleChapterApiLink?: string;

    /**
     * この章に関する情報。
     */
    chapter: ChapterData;
}

interface ChapterData {
    /**
     * 章の番号。
     */
    number: number;

    /**
     * 章の内容。
     */
    content: ChapterContent[];

    /**
     * この章の脚注一覧。
     */
    footnotes: ChapterFootnote[];
}

/**
 * 章コンテンツの単一部分を表すユニオン型。
 * 章の内容は、以下のいずれかに該当する可能性があります。
 * 見出し。
 * 改行。
 * ―詩。
 * ヘブライ語の字幕付き。
 */
type ChapterContent = ChapterHeading | ChapterLineBreak | ChapterVerse | ChapterHebrewSubtitle;

/**
 * 章の見出し。
 */
interface ChapterHeading {
    /**
     * その内容が見出しであることを示します。
     */
    type: 'heading';

    /**
     * 見出しの内容。
     * 配列に複数の文字列が含まれる場合は、それらをスペースで連結する必要があります。
     */
    content: string[];
}

/**
 * 章の中の改行。
 */
interface ChapterLineBreak {
    /**
     * 内容が改行であることを示します。
     */
    type: 'line_break';
}

/**
 * 章の中にヘブライ語の副題がある。
 * これらは、元の原稿に掲載されていた情報コンテンツとしてよく利用される。
 * 例えば、詩篇49篇にはヘブライ語の副題「指揮者へ。コラの子らの詩」が付いている。
 */
interface ChapterHebrewSubtitle {
    /**
     * このコンテンツはヘブライ語の字幕であることを示します。
     */
    type: 'hebrew_subtitle';

    /**
     * サブタイトルに含まれるコンテンツの一覧。
     * リスト内の各要素は、文字列、書式設定されたテキスト、または脚注参照のいずれかになります。
     */
    content: (string | FormattedText | VerseFootnoteReference)[];
}

/**
 * 章の中の一節。
 */
interface ChapterVerse {
    /**
     * その内容が詩であることを示します。
     */
    type: 'verse';

    /**
     * 節の番号。
     */
    number: number;

    /**
     * その詩の内容一覧。
     * リスト内の各要素は、文字列、書式設定されたテキスト、または脚注参照のいずれかになります。
     */
    content: (string | FormattedText | InlineHeading | InlineLineBreak | VerseFootnoteReference)[];
}

/**
 * 書式設定されたテキスト。つまり、特定の形式で書式設定されたテキストのことです。
 */
interface FormattedText {
    /**
     * 書式設定されたテキスト。
     */
    text: string;

    /**
     * その文章が詩を表しているかどうか。
     * その数字はインデントのレベルを示しています。
     *
     * 詩篇によく見られる。
     */
    poem?: number;

    /**
     * その文章がイエスの言葉を表しているかどうか。
     */
    wordsOfJesus?: boolean;
}

/**
 * 詩の中に埋め込まれた見出しを表すインターフェースを定義します。
 */
interface InlineHeading {
    /**
     * 見出しのテキスト。
     */
    heading: string;
}

/**
 * 詩の中に埋め込まれた改行を表すインターフェースを定義します。
 */
interface InlineLineBreak {
    lineBreak: true;
}


/**
 * 聖句中の脚注参照、またはヘブライ語の副題。
 */
interface VerseFootnoteReference {
    /**
     * メモのID。
     */
    noteId: number;
}

/**
 * 脚注に関する情報。
 */
interface ChapterFootnote {
    /**
     * 参照されているメモのID。
     */
    noteId: number;

    /**
     * 脚注の本文。
     */
    text: string;

    /**
     * 脚注の参照箇所となる聖句。
     */
    reference?: {
        chapter: number;
        verse: number;
    };

    /**
     * 脚注に使用する呼び出し元。
     * 脚注の場合、「呼び出し文字」とは、本文中で脚注を参照するために使用される文字のことです。
     *
     * 例えば、本文では次のようになります。
     * こんにちは（a）世界
     *
     * ---- (a) これは脚注です。
     *
     * 「(a)」は呼び出し元です。
     *
     * 「+」の場合は、呼び出し元は自動生成されるべきです。
     * null の場合、呼び出し元は空である必要があります。
     * 文字列の場合、呼び出し元はその文字列であるべきです。
     */
    caller: '+' | string | null;
}

/**
 * 書籍の章ごとの音声リンク。
 */
interface TranslationBookChapterAudioLinks {
    /**
     * 章の朗読者と音声ファイルへのURLリンク。
     */
    [reader: string]: string;
}

/**
 * 書籍の章ごとの音声再生タイミングへのリンク。
 */
interface TranslationBookChapterAudioTimingsLinks {
    /**
     * 該当章の朗読者と、その朗読者の音声タイミングファイルへのAPIリンク。
     */
    [reader: string]: string;
}
```

### 例

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

## チャプターごとの音声タイミングを取得する

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.{reader}.audioTimings.json`

1つの章について、1人の朗読者による朗読ごとに、節ごとの音声タイミングを取得します。つまり、各節が始まる時間（朗読者の音声ファイルの開始時点からの秒数）を取得します。クライアントはこれを利用して、音声再生中に現在朗読されている節をハイライト表示できます。

音声タイミング情報を持つ翻訳と朗読者は一部に限られます。朗読者ごとに音声タイミング情報を持つ章は、その朗読者のIDをキーとして、 `thisChapterAudioTimings`のエントリを持つこのファイルにリンクしています。朗読者がそのマップのキーでない場合、その朗読者と章に対応するこのファイルは存在しません。

-   `translation`は翻訳の ID です (例: `BSB` )。
-   `book`は書籍のIDです（例：創世記の場合は`GEN` - 書籍IDのリストは[こちらで](https://ubsicap.github.io/usfm/identification/books.html)確認できます）。
-   `chapter`は章番号を表します（例えば、 `1`は第1章）。
-   `reader`は、タイミングが設定されている朗読者の ID (例: `hays` ) です。章で使用可能な朗読者は、その章のキーです`thisChapterAudioLinks`です。

詩の終わりは次の詩の始まり（または、最後の詩の場合は音声ファイルの終わり）となるため、クライアントは章全体のハイライト範囲を作成するために、開始時刻の順序付きリスト以外に何も必要としません。

このファイルは、通常の章のエンドポイントからアクセスした場合でも、[簡略化されたエンドポイント](./simplified.md#get-a-simplified-chapter-from-a-translation)からアクセスした場合でも同じです。翻訳、書籍、章、および読者ごとに、タイミングのセットは1つしかありません。

### コード例

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter-audio-timings.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;
const reader = 'hays';

// 「hays」が朗読した創世記1章（BSB）の音声タイミングを取得してください。
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

### 構造

```typescript:no-line-numbers title="chapter-audio-timings.ts"
/**
 * 書籍の章ごとに、一人の読者に対する音声再生タイミングを定義します。
 * /api/{translation}/{book}/{chapter}.{reader}.audioTimings.json エンドポイントにマッピングされます。
 */
export interface TranslationBookChapterAudioTimings {
    /**
     * 翻訳のID。
     */
    translationId: string;

    /**
     * 本のID。
     */
    bookId: string;

    /**
     * 章の番号。
     */
    chapterNumber: number;

    /**
     * このタイミングが対象とするリーダーのID。
     */
    reader: string;

    /**
     * これらのタイミングが適用される音声ファイルへのリンク。
     */
    audioLink: string;

    /**
     * この章の情報へのリンクはこちらです。
     */
    thisChapterLink: string;

    /**
     * 次の章の情報へのリンクです。
     * これが翻訳の最終章の場合はnull。
     */
    nextChapterLink: string | null;

    /**
     * 前章の情報へのリンク。
     * これが翻訳の最初の章である場合はnull。
     */
    previousChapterLink: string | null;

    /**
     * この音声タイミングファイルへのリンク。
     */
    thisChapterAudioTimingsLink: string;

    /**
     * 同じ読者向けの、次の章のタイミングへのリンク。
     * これが翻訳の最終章の場合はnull。
     */
    nextChapterAudioTimingsLink: string | null;

    /**
     * 同じ読者向けの、前の章の所要時間へのリンクです。
     * これが翻訳の最初の章である場合はnull。
     */
    previousChapterAudioTimingsLink: string | null;

    /**
     * 各節が始まる時刻（秒単位）を順番に示します。
     * 最初の数字（インデックス0）は、録音の中で最初の詩が始まる時間を示しています。
     */
    verses: number[];
}
```

### 例

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

`verses[0]`は 1 節の開始時間、 `verses[1]` 2 節の開始時間、といった具合です。この例では、創世記 1 章の 2 節 (BSB、hays による読み方) は`audioLink`の 4.32 秒から始まります。

## 章の単語数を取得する

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.words.json`

1つの章について、単語レベルの注釈（ストロング番号と関連するソースデータ）を取得します。

単語レベルの注釈が含まれている翻訳は一部のみです。注釈が含まれている章は、このファイルへのリンクを`thisChapterWordsLink`で示します。このプロパティがない場合、その章にはこのファイルは存在しません。

-   `translation`は翻訳の ID です (例: `BSB` )。
-   `book`は書籍のIDです（例：創世記の場合は`GEN` - 書籍IDのリストは[こちらで](https://ubsicap.github.io/usfm/identification/books.html)確認できます）。
-   `chapter`は章番号を表します（例えば、 `1`は第1章）。

各注釈は、詩の`content`配列内の単一項目の文字範囲に固定されます`contentIndex`は項目のインデックス、 `start` / `end`はその項目のテキスト内の文字オフセットです。4 `end`除外されるため、 `text.slice(start, end)`注釈対象の単語になります。

（詩全体ではなく）コンテンツ項目に固定することで、詩の行、イエスの言葉、脚注参照など、コンテンツが複数の項目に分割されている詩の場合でも、オフセットが正しく維持されます。

### コード例

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter-words.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// 創世記1章の歌詞はBSB訳から入手してください。
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

### 構造

```typescript:no-line-numbers title="chapter-words.ts"
export interface TranslationBookChapterWords {
    /**
     * 翻訳のID。
     */
    translationId: string;

    /**
     * 本のID。
     */
    bookId: string;

    /**
     * 章の番号。
     */
    chapterNumber: number;

    /**
     * この章の情報へのリンクはこちらです。
     */
    thisChapterLink: string;

    /**
     * 次の章の情報へのリンクです。
     * これが翻訳の最終章の場合はnull。
     */
    nextChapterLink: string | null;

    /**
     * 前章の情報へのリンク。
     * これが翻訳の最初の章である場合はnull。
     */
    previousChapterLink: string | null;

    /**
     * この単語ファイルへのリンク。
     */
    thisChapterWordsLink: string;

    /**
     * 次の章の文章へのリンクです。
     * これが翻訳の最終章である場合、または次の章に単語レベルの注釈がない場合は、null を返します。
     */
    nextChapterWordsLink: string | null;

    /**
     * 前の章の文章へのリンク。
     * これが翻訳の最初の章である場合、または前の章に単語レベルの注釈がない場合は、null になります。
     */
    previousChapterWordsLink: string | null;

    /**
     * 章内の各節に対応する注釈付き単語。節番号順に並べられています。
     * 各リストは、詩の中で単語が出現する順に並んでいます。
     */
    verses: {
        [verseNumber: string]: ChapterWord[];
    };
}

interface ChapterWord {
    /**
     * 注釈が適用される、詩の内容配列内の項目のインデックス。
     */
    contentIndex: number;

    /**
     * コンテンツアイテムのテキスト内で、注釈対象単語の最初の文字のインデックス。
     */
    start: number;

    /**
     * コンテンツアイテムのテキスト内の、注釈付き単語の最後の文字の後のインデックス。
     * つまり、text.slice(start, end) は注釈付きの単語です。
     */
    end: number;

    /**
     * その単語のストロング番号。
     * 翻訳でその単語に対する他の注釈のみが提供されている場合は省略されます。
     */
    strongs?: string[];

    /**
     * 辞書（引用）形式における単語の語形。
     * 翻訳に該当箇所が含まれていない場合は省略する。
     */
    lemma?: string;

    /**
     * 単語の形態素解析コード。
     * 翻訳に該当箇所が含まれていない場合は省略する。
     */
    morph?: string;

    /**
     * ソーステキスト内の単語へのポインタ（ <sourceName> : <location>形式）。
     * 翻訳に該当箇所が含まれていない場合は省略する。
     */
    srcloc?: string;

    /**
     * この単語は、元の単語のどの出現箇所にあたりますか。1 ベース。
     * 翻訳に該当箇所が含まれていない場合は省略する。
     */
    occurrence?: number;

    /**
     * 元の単語が出現した合計回数。
     * 翻訳に該当箇所が含まれていない場合は省略する。
     */
    occurrences?: number;
}
```

### 例

最初の節に単一のコンテンツ項目が含まれている章を例にとると、次のようになります。

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

単語ファイルは、その項目の文字に注釈を付けます。

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

つまり、 `"In the beginning...".slice(0, 2)`は`"In"`であり、ソースは`G1722`でタグ付けしている。

## 翻訳全体を取得する

`GET https://bible.helloao.org/api/{translation}/complete.json`

翻訳全体の内容を取得します。

-   `translation`は翻訳の ID です (例: `BSB` )。

### コード例

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-translation-complete.js"
const translation = 'BSB';

// BSB訳の創世記1章を入手してください
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

### 構造

```typescript:no-line-numbers title="complete.ts"
/**
 * 翻訳ダウンロードデータ全体を定義します。
 * /api/:translationId/complete.json エンドポイントにマッピングされます。
 */
export interface TranslationComplete {
    /**
     * 翻訳メタデータ。
     */
    translation: Translation;

    /**
     * 全章を含む書籍の完全なリスト。
     */
    books: TranslationCompleteBook[];
}

/**
 * 完全翻訳版の書籍をダウンロードできます。
 */
export interface TranslationCompleteBook {
    /**
     * 本のID。
     */
    id: string;

    /**
     * 翻訳版に収録されている本のタイトル。
     */
    name: string;

    /**
     * その本の通称。
     */
    commonName: string;

    /**
     * 本のタイトル。
     */
    title: string | null;

    /**
     * 本の順番。
     */
    order: number;

    /**
     * その本の章数。
     */
    numberOfChapters: number;

    /**
     * 本書に収録されている詩の総数。
     */
    totalNumberOfVerses: number;

    /**
     * その書物が偽書かどうか。
     */
    isApocryphal?: boolean;

    /**
     * 全章の内容を含む完全な一覧。
     */
    chapters: TranslationCompleteChapter[];
}

/**
 * 完全翻訳版ダウンロードに含まれる一章。
 */
export interface TranslationCompleteChapter {
    /**
     * その章に含まれる節の数。
     */
    numberOfVerses: number;

    /**
     * 各章の異なる音声版へのリンク。
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * この章における、異なる音声バージョンの音声タイミング（各節の開始時間、秒単位）。
     *
     * 個々のチャプターのエンドポイントにある`thisChapterAudioTimings` （下の「チャプターの音声タイミングを取得する」にリンクされています）とは異なり、こちらにはタイミング自体が含まれています。これは、完全な翻訳をダウンロードする目的は、すべてを1つのファイルにまとめることだからです。
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsMap;

    /**
     * 章の単語レベルの注釈へのリンク。
     * 章に単語レベルの注釈がない場合は省略されます。
     */
    thisChapterWordsLink?: string;

    /**
     * この章に関する情報。
     */
    chapter: ChapterData;
}

/**
 * 書籍の章ごとの音声タイミングを、リンクではなく直接埋め込んで表示します。
 * 読者IDを、各詩の開始時刻（秒単位）のリストに、詩の順序でマッピングします。
 */
interface TranslationBookChapterAudioTimingsMap {
    [reader: string]: number[];
}
```

### 例

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
