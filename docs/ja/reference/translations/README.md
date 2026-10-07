# 翻訳、書籍、章

翻訳版を閲覧したり、書籍一覧を表示したり、章の内容を取得したりするためのエンドポイント。

章の内容、翻訳全文のダウンロード、単語レベルの注釈は、それぞれ2つの形式で利用可能です。

-   [**標準フォーマット**](./standard.md)― オリジナルの構造化されたフォーマット。詩の内容は、あなたが自分で組み立てる要素（プレーンテキスト、書式付きテキスト、脚注参照など）のリストです。
-   [**簡略化された形式**](./simplified.md)- 各詩の内容が単一の文字列であり、脚注、詩、その他のマークアップはその文字列へのオフセットとして表現される、フラット化された形式。

テキストの表示方法や処理方法に最も適した形式を使用してください。

## 利用可能な翻訳

`GET https://bible.helloao.org/api/available_translations.json`

APIで利用可能な翻訳の一覧を取得します。

### コード例

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

### 構造

```typescript:no-line-numbers title="available-translations.ts"
export interface AvailableTranslations {
    /**
     * 翻訳一覧。
     */
    translations: Translation[];
}

interface Translation {
    /**
     * 翻訳のID。
     */
    id: string;

    /**
     * 翻訳の名前。
     * これは通常、翻訳元の言語における翻訳名です。
     */
    name: string;

    /**
     * 翻訳の英語名。
     */
    englishName: string;

    /**
     * 翻訳サイト。
     */
    website: string;

    /**
     * 翻訳ライセンスが掲載されているURL。
     */
    licenseUrl: string;

    /**
     * 翻訳の略称。
     */
    shortName: string;

    /**
     * 翻訳が主に使用されているISO 639の3文字言語タグ。
     */
    language: string;

    /**
     * 翻訳元の言語名を取得します。
     * 言語名が不明な場合は、nullまたはundefinedになります。
     */
    languageName?: string;

    /**
     * 言語名を英語で取得します。
     * 言語に英語名がない場合は、nullまたはundefinedになります。
     */
    languageEnglishName?: string;

    /**
     * 言語が書かれている方向。
     * 「ltr」は、テキストがページの左側から右側に向かって書かれていることを示します。
     * 「rtl」は、テキストがページの右側から左側に向かって書かれていることを示します。
     */
    textDirection: 'ltr' | 'rtl';

    /**
     * 利用可能なフォーマットの一覧。
     */
    availableFormats: ('json' | 'usfm')[];

    /**
     * この翻訳で利用可能な書籍の一覧へのAPIリンク。
     */
    listOfBooksApiLink: string;

    /**
     * この翻訳に含まれる書籍の数。
     *
     * 完全な翻訳版は、聖書と同じ冊数（66冊）であるべきだ。
     */
    numberOfBooks: number;

    /**
     * この翻訳版に含まれる章の総数。
     *
     * 完全な翻訳版は、聖書と同じ章数（1,189章）を持つべきである。
     */
    totalNumberOfChapters: number;

    /**
     * この翻訳に含まれる節の総数。
     *
     * 完全な翻訳は聖書と同じ節数（約31,102節）を持つべきである（ただし、一部の翻訳では、原典に存在する可能性が高いと思われる節が除外されている）。
     */
    totalNumberOfVerses: number;

    /**
     * この翻訳に含まれる外典の総数。
     * 翻訳に外典が含まれていない場合は省略する。
     */
    numberOfApocryphalBooks?: number;

    /**
     * この翻訳に含まれる外典の章の総数。
     * 翻訳に外典が含まれていない場合は省略する。
     */
    totalNumberOfApocryphalChapters?: number;

    /**
     * この翻訳に含まれる外典の節の総数。
     * 翻訳に外典が含まれていない場合は省略する。
     */
    totalNumberOfApocryphalVerses?: number;
}
```

### 例

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

## 翻訳された書籍一覧

`GET https://bible.helloao.org/api/{translation}/books.json`

指定された翻訳版で利用可能な書籍のリストを取得します。

-   `translation`は翻訳の ID です (例: `BSB` )。

### コード例

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-books.js"
const translation = 'BSB';

// BSB翻訳の書籍リストを入手する
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

### 構造

```typescript:no-line-numbers title="books.ts"
export interface TranslationBooks {
    /**
     * 書籍の翻訳情報。
     */
    translation: Translation;

    /**
     * 翻訳可能な書籍の一覧。
     */
    books: TranslationBook[];
}

interface TranslationBook {
    /**
     * 本のID。
     */
    id: string;

    /**
     * 翻訳者がその本に付けた名前。
     */
    name: string;

    /**
     * その本の通称。
     */
    commonName: string;

    /**
     * 本のタイトル。
     * これは通常、本のタイトルをより詳しく説明したものです。
     * 利用できない場合は、翻訳時に提供されなかったことを意味します。
     */
    title: string | null;

    /**
     * 翻訳における書籍の番号順。
     */
    order: number;

    /**
     * その本に含まれる章の数。
     */
    numberOfChapters: number;

    /**
     * 本書における最初の章の番号。
     */
    firstChapterNumber: number;

    /**
     * 本書の第1章へのリンク。
     */
    firstChapterApiLink: string;

    /**
     * その本の最終章の番号。
     */
    lastChapterNumber: number;

    /**
     * 本書の最終章へのリンク。
     */
    lastChapterApiLink: string;

    /**
     * その書物に収録されている節の数。
     */
    totalNumberOfVerses: number;

    /**
     * その本が偽書かどうか。
     * 翻訳が正典である場合は省略されます。
     */
    isApocryphal?: boolean;
}
```

### 例

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
