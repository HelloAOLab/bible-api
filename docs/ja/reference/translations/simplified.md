# 簡略化された形式

章、全文翻訳のダウンロード、単語レベルの注釈のための簡略化された形式です。翻訳および書籍一覧のエンドポイントについては、 [「翻訳、書籍、章」を](./README.md)参照してください。同じコンテンツの元の構造化された表現については、[標準形式を](./standard.md)参照してください。

## 翻訳から簡略化された章を取得する

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.simple.json`

指定された書籍と翻訳版について、1章分の内容を簡略化された形式で取得します。

簡略化された形式では、各節の内容は書式設定されたコンテンツのリストではなく、単一の文字列になります。つまり、節のテキストを自分で作成する必要がなくなり、特に間隔の調整など、正しく作成するのが難しい作業が不要になります。脚注、イエスの言葉、詩、節の途中に現れる見出しなど、単純な文字列では表現できないものはすべて、その文字列内のオフセットとして保持されるため、何も失われることはありません。

章のテキストを取得したい場合は、このエンドポイントを使用してください。元の書式設定で章を表示したい場合は[、通常の章エンドポイント](./standard.md#get-a-chapter-from-a-translation)を使用してください。

-   `translation`は翻訳の ID です (例: `BSB` )。
-   `book`は書籍のIDです（例：創世記の場合は`GEN` - 書籍IDのリストは[こちらで](https://ubsicap.github.io/usfm/identification/books.html)確認できます）。
-   `chapter`は章番号を表します（例えば、 `1`は第1章）。

単語レベルの注釈がある章は、 `thisChapterWordsLink`でそれらにリンクしています。これは、このファイルのテキストとオフセットが一致する[簡略化された注釈](#get-the-words-of-a-chapter-in-the-simplified-format)を指しています。

読者ごとの音声タイミングが設定されている章は、 `thisChapterAudioTimings`でそのタイミングにリンクされます。これ[は音声タイミングのエンドポイントを](./standard.md#get-the-audio-timings-for-a-chapter)指しており、タイミングは章の形式に依存しないため、通常の章のエンドポイントがリンクするのと同じファイルです。

### コード例

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-simple-chapter.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// BSB訳の創世記1章の本文を入手してください。
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

### オフセット

簡略化された形式のオフセット（ `offset` `end`はすべて`start`それらを含む詩の`text`の要素へのインデックスです。これらはUTF-16コード単位で測定され、これはJavaScriptの`String.prototype.length`と`String.prototype.slice()`使用されている単位です。

`start`は範囲を含み、 `end`範囲を除外するため、 `text.slice(start, end)`マークされたテキストの範囲を正確に返します。脚注オフセットは、脚注の呼び出し元が属する位置を示すため、 `text.slice(0, offset)`脚注の直前のテキストになります。

### 構造

```typescript:no-line-numbers title="simple-chapter.ts"
export interface SimpleTranslationBookChapter {
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
     * この章の通常版（簡略化されていない版）へのリンクはこちらです。
     */
    fullChapterApiLink: string;

    /**
     * 各章の異なる音声版へのリンク。
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * この章の各音声バージョンの音声タイミングへのリンクです。
     * 標準フォーマットのドキュメントにある「チャプターのオーディオタイミングを取得する」を参照してください。タイミングファイルは、リンクされているチャプターフォーマットに関係なく同じです。
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsLinks;

    /**
     * 次の章へのリンク（簡略版）。
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
     * 前の章へのリンク（簡略版）。
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
     * その章に含まれる節の数。
     */
    numberOfVerses: number;

    /**
     * この章に関する情報。
     */
    chapter: SimpleChapterData;
}

interface SimpleChapterData {
    /**
     * 章の番号。
     */
    number: number;

    /**
     * 章の内容。
     */
    content: SimpleChapterContent[];

    /**
     * 特定の節に関連付けることができなかった脚注の一覧。
     * 節に付随する脚注は、その節自体に記載されているため、このリストは通常​​空です。
     */
    footnotes: ChapterFootnote[];
}

/**
 * 簡略化された章内の単一のコンテンツを表すユニオン型。
 */
type SimpleChapterContent = SimpleChapterHeading | ChapterLineBreak | SimpleChapterVerse | SimpleChapterHebrewSubtitle;

/**
 * 章の見出し。
 */
interface SimpleChapterHeading {
    /**
     * その内容が見出しであることを示します。
     */
    type: 'heading';

    /**
     * 見出しのテキスト。
     */
    text: string;
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
 * 章の中の一節。
 */
interface SimpleChapterVerse {
    /**
     * その内容が詩であることを示します。
     */
    type: 'verse';

    /**
     * 節の番号。
     */
    number: number;

    /**
     * その詩のテキスト。
     * 詩の行と改行は、改行文字（\n）で区切られます。
     */
    text: string;

    /**
     * 詩の中に挿入されている脚注。
     */
    footnotes: SimpleVerseFootnote[];

    /**
     * 詩の途中に現れる見出し。
     * 詩の中にインライン見出しが含まれていない場合は省略されます。
     */
    headings?: SimpleInlineHeading[];

    /**
     * イエスの言葉を表す聖句の範囲。
     * 該当の節に該当箇所がない場合は省略する。
     */
    wordsOfJesus?: SimpleTextRange[];

    /**
     * 詩の行を表す、詩文の範囲。
     * 該当の節に該当箇所がない場合は省略する。
     */
    poem?: SimplePoemRange[];
}

/**
 * 章の中にヘブライ語の副題がある。
 * これらは多くの場合、元の原稿に掲載されていた情報コンテンツとして含まれている。
 * 例えば、詩篇49篇にはヘブライ語の副題「指揮者へ。コラの子らの詩」が付いている。
 */
interface SimpleChapterHebrewSubtitle extends Omit<SimpleChapterVerse, 'type' | 'number'> {
    /**
     * このコンテンツはヘブライ語の字幕であることを示します。
     */
    type: 'hebrew_subtitle';
}

/**
 * 詩の中の脚注。
 */
interface SimpleVerseFootnote {
    /**
     * メモのID。
     */
    noteId: number;

    /**
     * 脚注呼び出しを挿入する詩文中のインデックス。
     */
    offset: number;

    /**
     * 脚注の本文。
     */
    text: string;

    /**
     * 脚注に使用する呼び出し元。
     * 「+」の場合は、呼び出し元は自動生成されるべきです。
     * null の場合、呼び出し元は空である必要があります。
     * 文字列の場合、呼び出し元はその文字列であるべきです。
     */
    caller: '+' | string | null;
}

/**
 * 詩の中に埋め込まれた見出し。
 */
interface SimpleInlineHeading {
    /**
     * 見出しが詩の本文中で出現する位置を示すインデックス。
     */
    offset: number;

    /**
     * 見出しのテキスト。
     */
    text: string;
}

/**
 * 詩句の中に含まれるテキストの範囲。
 */
interface SimpleTextRange {
    /**
     * 範囲の最初の文字のインデックス。
     */
    start: number;

    /**
     * 範囲の最後の文字の後のインデックス。
     */
    end: number;
}

/**
 * 詩句の中にある、詩の一行を表すテキストの範囲。
 */
interface SimplePoemRange extends SimpleTextRange {
    /**
     * 詩の各行を表示する際のインデントのレベル。
     */
    level: number;
}
```

### 例

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

詩とイエスの言葉は、詩のテキスト全体にわたって範囲として保持されます。たとえば、 `engwebp`翻訳における`Matthew 5:3`次のようになります。

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

## 章の単語数を簡略化した形式で入手する

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.words.simple.json`

1つの章の単語レベルの注釈を取得し、そのオフセットを各[簡略化された節](#get-a-simplified-chapter-from-a-translation)のテキストに再マッピングします。

[通常の注釈](./standard.md#get-the-words-of-a-chapter)におけるオフセットは、節の`content`配列の要素に固定されていますが、簡略化された形式ではそれが単一の文字列に置き換えられるため、通常の注釈と併用することはできません。簡略化された章を扱う場合は、代わりにこちらのファイルを使用してください。

-   `translation`は翻訳の ID です (例: `BSB` )。
-   `book`は書籍のIDです（例：創世記の場合は`GEN` - 書籍IDのリストは[こちらで](https://ubsicap.github.io/usfm/identification/books.html)確認できます）。
-   `chapter`は章番号を表します（例えば、 `1`は第1章）。

これらのエントリには`contentIndex`はありません。1 `start` `end` 、簡略化された章の脚注、詩、およびイエスの言葉のオフセットとまったく同じように、詩の`text`にオフセットされているため、 `text.slice(start, end)`は注釈付きの単語です。

通常の注釈と同様に、一部の翻訳版にのみ注釈が含まれています。注釈が含まれている簡略化された章は、このファイルへのリンクに`thisChapterWordsLink`を付けています。このプロパティがない場合、その章にはこのファイルは存在しません。

### コード例

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-simple-chapter-words.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// 創世記1章の本文と、そこに注釈が付けられている単語を入手してください。
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

### 構造

構造は[通常の注釈](./standard.md#get-the-words-of-a-chapter)と一致しますが、リンクは簡略化されたファイルを指し、エントリには`contentIndex`がありません。

```typescript:no-line-numbers title="simple-words.ts"
export interface SimpleTranslationBookChapterWords {
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
     * これらの注釈が適用される、簡略化された章へのリンクです。
     */
    thisChapterLink: string;

    /**
     * 次の簡略化された章へのリンク。
     * これが翻訳の最終章の場合はnull。
     */
    nextChapterLink: string | null;

    /**
     * 前の簡略化された章へのリンク。
     * これが翻訳の最初の章である場合はnull。
     */
    previousChapterLink: string | null;

    /**
     * これらの注釈へのリンク。
     */
    thisChapterWordsLink: string;

    /**
     * 次の章の注釈へのリンクです。
     * これが翻訳の最終章である場合、または次の章に単語レベルの注釈がない場合は、null を返します。
     */
    nextChapterWordsLink: string | null;

    /**
     * 前章の注釈へのリンク。
     * これが翻訳の最初の章である場合、または前の章に単語レベルの注釈がない場合は、null になります。
     */
    previousChapterWordsLink: string | null;

    /**
     * 章内の各節に対応する注釈付き単語。節番号順に並べられています。
     * 各リストは、詩の中で単語が出現する順に並んでいます。
     */
    verses: {
        [verseNumber: string]: SimpleChapterWord[];
    };
}

/**
 * 簡略化された章における、単語レベルの注釈。
 */
export interface SimpleChapterWord {
    /**
     * 詩のテキストにおける、注釈付き単語の最初の文字のインデックス。
     */
    start: number;

    /**
     * 詩のテキスト中の注釈対象単語の最後の文字の後のインデックス。
     */
    end: number;

    /**
     * その単語のストロング番号。
     */
    strongs?: string[];

    /**
     * 原文言語における単語の語幹（辞書上の形）。
     */
    lemma?: string;

    /**
     * 原語における単語の形態。
     */
    morph?: string;

    /**
     * 原文における単語の位置。
     */
    srcloc?: string;

    /**
     * この単語は、この節のどの箇所に出現しますか。
     */
    occurrence?: number;

    /**
     * その単語が詩の中で出現する回数。
     */
    occurrences?: number;
}
```

### 例

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

その章の1節には`"In the beginning was the Word, and the Word was with God, and the Word was God."`というテキストがあるので、 `text.slice(7, 16)`は`"beginning"`です。

## 簡略化された形式で翻訳全体を入手する

`GET https://bible.helloao.org/api/{translation}/complete.simple.json`

簡略化された形式を使用して、翻訳全体の内容を取得します。これは[、完全な翻訳のダウンロード](./standard.md#get-an-entire-translation)に適用される[簡略化された章形式](#get-a-simplified-chapter-from-a-translation)です。翻訳全体を含む1つのファイルで、各節の内容は単一の文字列です。

章ごとにリクエストしたり、自分でテキストを作成したりすることなく、翻訳全体のテキストが必要な場合に使用してください。

-   `translation`は翻訳の ID です (例: `BSB` )。

このファイルは`complete.json`と同時に生成されるため、翻訳には両方が含まれるか、どちらも含まれないかのどちらかになります。両方のファイルにある`translation`オブジェクトには`completeTranslationApiLink`と`simpleCompleteTranslationApiLink`含まれているため、2つのフォーマット間を移動できます。

### コード例

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-translation-complete-simple.js"
const translation = 'BSB';

// BSB翻訳の全文を入手
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

### 構造

構成は[通常の完全翻訳版のダウンロード](./standard.md#get-an-entire-translation)と同じですが、各章が簡略化された形式になっています。

```typescript:no-line-numbers title="complete-simple.ts"
/**
 * 簡略化された章形式を使用して、完全な翻訳ダウンロードデータを定義します。
 * /api/:translationId/complete.simple.json エンドポイントにマッピングされます。
 */
export interface SimpleTranslationComplete {
    /**
     * 翻訳メタデータ。
     */
    translation: Translation;

    /**
     * 全章を含む書籍の完全なリスト。
     */
    books: SimpleTranslationCompleteBook[];
}

/**
 * 簡略化された章立て形式で、完全翻訳版の書籍をダウンロードできます。
 */
export interface SimpleTranslationCompleteBook extends Omit<TranslationCompleteBook, 'chapters'> {
    /**
     * 全章の内容を含む完全な一覧。
     */
    chapters: SimpleTranslationCompleteChapter[];
}

/**
 * 完全翻訳版ダウンロードに含まれる章の一つで、簡略化された章形式を使用しています。
 */
export interface SimpleTranslationCompleteChapter {
    /**
     * その章に含まれる節の数。
     */
    numberOfVerses: number;

    /**
     * 各章の異なる音声版へのリンク。
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * この章の音声タイミング（各節の開始時間、秒単位）。
     *
     * 完全な翻訳ファイルにはタイミング情報自体が含まれています（標準フォーマットのドキュメントにある TranslationBookChapterAudioTimingsMap を参照）。個々の章のエンドポイントには、タイミング情報へのリンクが含まれています。
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsMap;

    /**
     * 章の単語レベルの注釈へのリンク（簡略化された形式）。章に単語レベルの注釈がない場合は省略されます。
     */
    thisChapterWordsLink?: string;

    /**
     * この章に関する簡略化された情報。
     */
    chapter: SimpleChapterData;
}
```

### 例

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
