# データセット

聖書の補足データセット（相互参照、聖書の実体（人物、場所、出来事、民族集団）、原語の対訳語、語彙集、今日の聖句候補など）を閲覧し、それらの書籍、章の内容、実体、語彙集のエントリ、聖句のカテゴリを取得するためのエンドポイント。

## 利用可能なデータセット

`GET https://bible.helloao.org/api/available_datasets.json`

APIで利用可能な聖書データセットのリストを取得します。

### コード例

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

### 構造

```typescript:no-line-numbers title="available-datasets.ts"
export interface AvailableDatasets {
    /**
     * データセットの一覧。
     */
    datasets: Dataset[];
}

export interface Dataset {
    /**
     * データセットのID。
     */
    id: string;

    /**
     * データセットの名前。
     */
    name: string;

    /**
     * データセットのウェブサイト。
     */
    website: string;

    /**
     * データセットのライセンス情報が掲載されているURL。
     */
    licenseUrl: string;

    /**
     * APIに追加されたライセンスに関する注記。
     * メモがない場合は、nullまたはundefinedになります。
     */
    licenseNotes?: string | null;

    /**
     * データセットの英語名。
     */
    englishName: string;

    /**
     * データセットが主に含まれる言語を示す、ISO 639規格の3文字の言語タグ。
     */
    language: string;

    /**
     * 言語が書かれている方向。
     * 「ltr」は、テキストがページの左側から右側に向かって書かれていることを示します。
     * 「rtl」は、テキストがページの右側から左側に向かって書かれていることを示します。
     */
    textDirection: 'ltr' | 'rtl';

    /**
     * このデータセットで利用可能な書籍の一覧へのAPIリンク。
     */
    listOfBooksApiLink: string;

    /**
     * 利用可能なフォーマットの一覧。
     */
    availableFormats: ('json' | 'usfm')[];

    /**
     * このデータセットに含まれる書籍の数。
     */
    numberOfBooks: number;

    /**
     * このデータセットに含まれる章の総数。
     */
    totalNumberOfChapters: number;

    /**
     * このデータセットに含まれる詩句の総数。
     */
    totalNumberOfVerses: number;

    /**
     * このデータセットに含まれる相互参照の総数。
     * 相互参照を含まないデータセットの場合は0。
     */
    totalNumberOfReferences: number;

    /**
     * このデータセットに含まれる、行間にある単語の総数。
     * データセットに行間単語が含まれていない場合は省略されます。
     */
    totalNumberOfWords?: number;

    /**
     * データセットがどの言語で記述されているかを取得します。
     * 言語名が不明な場合は、nullまたはundefinedになります。
     */
    languageName?: string;

    /**
     * 言語名を英語で取得します。
     * 言語に英語名がない場合は、nullまたはundefinedになります。
     */
    languageEnglishName?: string;

    /**
     * データセット内のエンティティ一覧へのAPIリンク。
     * データセットに該当するエンティティが含まれていない場合は省略されます。
     */
    listOfPeopleApiLink?: string;
    listOfPlacesApiLink?: string;
    listOfEventsApiLink?: string;
    listOfPeopleGroupsApiLink?: string;

    /**
     * データセットに含まれるエンティティの総数。
     * データセットに該当するエンティティが含まれていない場合は省略されます。
     */
    totalNumberOfPeople?: number;
    totalNumberOfPlaces?: number;
    totalNumberOfEvents?: number;
    totalNumberOfPeopleGroups?: number;

    /**
     * データセット内の語彙項目一覧へのAPIリンク。
     * データセットに語彙項目が含まれていない場合は省略されます。
     */
    listOfLexiconApiLink?: string;

    /**
     * データセットに含まれる語彙項目の総数。
     * データセットに語彙項目が含まれていない場合は省略されます。
     */
    totalNumberOfLexicon?: number;

    /**
     * データセットに含まれるすべての詩句とそのカテゴリの一覧へのAPIリンク。
     * データセットの詩にカテゴリがない場合は省略されます。
     */
    listOfVersesApiLink?: string;

    /**
     * データセット内の詩のカテゴリ一覧へのAPIリンク。
     * データセットに詩のカテゴリが含まれていない場合は省略されます。
     */
    listOfCategoriesApiLink?: string;

    /**
     * データセットに含まれる詩のカテゴリの総数。
     * データセットに詩のカテゴリが含まれていない場合は省略されます。
     */
    totalNumberOfCategories?: number;
}
```

### 例

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

## データセット内の書籍を一覧表示する

`GET https://bible.helloao.org/api/d/{dataset}/books.json`

指定されたデータセットで利用可能な書籍のリストを取得します。

-   `dataset`データセットの ID (例: `open-cross-ref` )。

### コード例

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-books.js"
const dataset = 'open-cross-ref';

// open-cross-refデータセットの書籍リストを取得します
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

### 構造

```typescript:no-line-numbers title="dataset-books.ts"
export interface DatasetBooks {
    /**
     * 書籍に関するデータセット情報。
     */
    dataset: Dataset;

    /**
     * データセットで使用可能な書籍のリスト。
     */
    books: DatasetBook[];
}

interface DatasetBook {
    /**
     * 書籍のID。
     * 聖書の対応する書（創世記、出エジプト記など）のIDと一致します。
     */
    id: string;

    /**
     * 聖書における書物の順序。
     */
    order: number;

    /**
     * その本の最初の章の番号。
     */
    firstChapterNumber: number;

    /**
     * 本書の第1章へのリンク。
     */
    firstChapterApiLink: string | null;

    /**
     * その本の最終章の番号。
     */
    lastChapterNumber: number | null;

    /**
     * 本書の最終章へのリンク。
     */
    lastChapterApiLink: string | null;

    /**
     * その本に含まれる章の数。
     */
    numberOfChapters: number;

    /**
     * その書物に収録されている節の数。
     */
    totalNumberOfVerses: number;

    /**
     * 本書に含まれる相互参照の総数。
     */
    totalNumberOfReferences: number;
}
```

### 例

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

## データセットから章を取得する

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

指定された書籍とデータセットから、1つの章の内容を取得します。

相互参照データセット（例： `open-cross-ref` ）の場合、章には各節の相互参照リストが含まれます。行間データセット（例： `bsb-interlinear` ）の場合、章には各節の原語の単語が含まれます。[行間データセット](#interlinear-datasets)を参照してください。エンティティデータセット（例： `theographic` ）の場合、章には章に登場する人物、場所、イベントが含まれます。[章内のエンティティを取得するを](#get-the-entities-in-a-chapter)参照してください。6 データセットの場合、章には章内の今日の聖句候補とそのカテゴリが含まれます。[今日の聖句を](#verse-of-the-day)`verse-of-the-day`してください。

-   `dataset`データセットの ID (例: `open-cross-ref` )。
-   `book`は書籍のIDです（例：創世記の場合は`GEN` ）。
-   `chapter`は章番号（例えば、 `1`は第1章）を表します。

### コード例

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-chapter.js"
const dataset = 'open-cross-ref';
const book = 'GEN';
const chapter = 1;

// open-cross-refデータセットからGenesis 1を取得する
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

### 構造

```typescript:no-line-numbers title="dataset-chapter.ts"
export interface DatasetBookChapter {
    /**
     * 書籍の章に関するデータセット情報。
     */
    dataset: Dataset;

    /**
     * 本書の該当章に関する情報。
     */
    book: DatasetBook;

    /**
     * この章へのリンク。
     */
    thisChapterLink: string;

    /**
     * 次の章へのリンク。
     * これがデータセットの最後の章である場合はnull。
     */
    nextChapterApiLink: string | null;

    /**
     * 前の章へのリンク。
     * これがデータセットの最初の章である場合はnull。
     */
    previousChapterApiLink: string | null;

    /**
     * その章に含まれる節の数。
     */
    numberOfVerses: number;

    /**
     * この章に関する情報。
     */
    chapter: DatasetChapterData;
}

interface DatasetChapterData {
    /**
     * 章の番号。
     */
    number: number;

    /**
     * 章の内容。
     */
    content: DatasetVerse[];
}

/**
 * 聖句には、 `references` （相互参照データセット）、 `words` （行間データセット）、または`categories` （今日の聖句データセット）のいずれかの番号が割り当てられます。
 * `'words' in verse`または`'categories' in verse`でどちらが存在するかを確認してください。
 */
type DatasetVerse =
    | DatasetReferencesVerse
    | DatasetWordsVerse
    | DatasetCategoriesVerse;

interface DatasetReferencesVerse {
    /**
     * 節の番号。
     */
    verse: number;

    /**
     * その聖句の相互参照。
     *
     * 得点の高い順に並べ替え（降順）。
     */
    references: DatasetReference[];
}

interface DatasetWordsVerse {
    /**
     * 節の番号。
     */
    verse: number;

    /**
     * 原文の順序で、詩の原語の単語を記載します。
     * 下記の「相互参照データセット」を参照してください。
     */
    words: InterlinearWord[];
}

interface DatasetCategoriesVerse {
    /**
     * 節の番号。
     * `endVerse`が存在する場合、これはその文章が始まる節です。
     */
    verse: number;

    /**
     * その文章が終わる節。
     * 単一の詩句の場合は省略する。
     */
    endVerse?: number;

    /**
     * その詩が属するカテゴリのIDを、関連性の高い順に表示します。
     * 下記の「今日の聖句」をご覧ください。
     */
    categories: string[];

    /**
     * その聖句が「今日の聖句」として採用される最初の年。
     * 当該節が常にリストに含まれている場合は省略される。
     */
    addedIn?: number;

    /**
     * その聖句がもはや「今日の聖句」として使えなくなる最初の年。
     * 削除された詩句もデータセット内に残るため、それ以前の年の詩句を選択することは可能です。
     * リストから削除されていない節は省略されます。
     */
    removedIn?: number;
}

interface DatasetReference {
    /**
     * 参照されている書籍のID。
     */
    book: string;

    /**
     * 章番号。
     */
    chapter: number;

    /**
     * 節番号。
     * `endVerse`が存在する場合、これは参照が始まる節です。
     */
    verse: number;

    /**
     * 参照箇所が終わる節。
     */
    endVerse?: number;

    /**
     * 参照文献の関連性スコア。
     */
    score?: number;
}

// InterlinearWordの構造については、下記の「Interlinear Datasets」を参照してください。
```

### 例

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

## エンティティ

[神学聖書メタデータ](https://github.com/robertrouse/theographic-bible-metadata)データセット（ `theographic` ）などのデータセットには、人物、場所、出来事、人々のグループなどのエンティティと、それらとそれらに言及している聖書の節との関係が含まれています。

[History Globe](https://historyglobe.app)データセット ( `history-globe` ) には場所のみが含まれています。聖書に名前が付けられている場所とその座標、およびそれらの場所の名前が付けられた聖句です。場所 ID (エルサレムの場合は`a15257a`など) は History Globe の安定した場所 ID であり、独自の[オープン データ API](https://historyglobe.app/docs/api.html)で使用されているものと同じであるため、名前が修正されても変更されません。4 `featureType`値は Theographic データセットで使用されている値 ( `City` 、 `Region` 、 `Water`など) に従い、 `featureSubType`はより具体的な種類がある場合 ( `River` 、 `Gate` 、 `Spring`など) が含まれます。

エンティティを含むデータセットには`listOfPlacesApiLink`エントリ`/api/available_datasets.json`に`listOfPeopleApiLink` 、および`listOfEventsApiLink` `listOfPeopleGroupsApiLink`プロパティが含まれます。

エンティティデータセットには、章に合わせたデータも含まれています。1 `/api/d/{dataset}/books.json`エンティティデータを含む章を持つ書籍の一覧を表示し、 `/api/d/{dataset}/{book}/{chapter}.json`その章に登場する人物、場所、出来事と、それぞれが言及されている節番号を返します。詳しくは、 [「章内のエンティティを取得する」を](#get-the-entities-in-a-chapter)参照してください。

エンティティは、APIの他の部分と同じ書籍ID、章番号、節番号を使用して聖書の箇所を参照するため、どの翻訳とも組み合わせることができます。エンティティ同士は、エンティティ参照を使用して相互に参照します。

```typescript:no-line-numbers title="entity-shared.ts"
export interface DatasetEntityRef {
    /**
     * 参照されているエンティティのID。
     */
    id: string;

    /**
     * 参照されているエンティティの種類。
     * エンティティの API リンクのコレクション セグメントに一致するため、リンクは`/api/d/{dataset}/{type}/{id}.json`として構築できます。
     */
    type: 'people' | 'places' | 'events' | 'groups';

    /**
     * 参照されているエンティティの名前。
     */
    name?: string;

    /**
     * 参照されているエンティティのAPIリンク。
     */
    apiLink?: string;
}

export interface VerseRef {
    /**
     * 書籍のID（GEN、EXOなど）。
     */
    book: string;

    /**
     * 参照箇所が始まる章番号。
     */
    chapter: number;

    /**
     * 参照箇所が始まる節番号。
     */
    verse: number;

    /**
     * 参照箇所が終わる節。
     * 同じ章内の連続する節は、1つの参照としてまとめられます。
     */
    endVerse?: number;
}
```

### 歴史地球儀の帰属

History Globe のデータは[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)ライセンスで提供されています。このデータを使用する場合は、History Globe ( https://historyglobe.app ) および、その基盤となっている OpenBible.info Bible Geocoding Data をクレジットとして明記し、変更点があれば注記してください。データセットの`licenseNotes`プロパティにクレジットが記載されています。

## 章内のエンティティを取得する

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

エンティティデータセットの場合、単一の章に登場する人物、場所、出来事と、それぞれが言及されている章内の節番号を取得します。

-   `dataset`データセットの ID (例: `theographic` )。
-   `book`は書籍のIDです（例：創世記の場合は`GEN` ）。
-   `chapter`は章番号（例えば、 `1`は第1章）を表します。

エンティティデータを含む書籍と章のリストは、[データセット books エンドポイント](#list-books-in-a-dataset)と同じ構造を持つ`GET https://bible.helloao.org/api/d/{dataset}/books.json`から入手できます。エンティティデータセットの場合、 `totalNumberOfVerses`少なくとも 1 つのエンティティによって言及されている節の数、 `totalNumberOfReferences`エンティティと節の言及の総数です。

### コード例

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter-entities.js"
const dataset = 'theographic';
const book = 'GEN';
const chapter = 2;

// 創世記2章に登場する人物、場所、出来事を取得する
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

### 構造

```typescript:no-line-numbers title="dataset-chapter-entities.ts"
export interface DatasetEntityBookChapter {
    /**
     * 書籍の章に関するデータセット情報。
     */
    dataset: Dataset;

    /**
     * 本書の該当章に関する情報。
     */
    book: DatasetBook;

    /**
     * この章のエンティティデータ。
     */
    chapter: DatasetEntityChapterData;

    /**
     * この章へのリンク。
     */
    thisChapterLink: string;

    /**
     * 次の章へのリンク。
     * これがデータセットの最後の章である場合はnull。
     */
    nextChapterApiLink: string | null;

    /**
     * 前の章へのリンク。
     * これがデータセットの最初の章である場合はnull。
     */
    previousChapterApiLink: string | null;

    /**
     * その章に登場する人物、場所、出来事の数。
     */
    numberOfPeople: number;
    numberOfPlaces: number;
    numberOfEvents: number;
}

interface DatasetEntityChapterData {
    /**
     * 章の番号。
     */
    number: number;

    /**
     * この章に登場する人々。
     * 登場する最初の節順に並べられています。
     */
    people: ChapterPerson[];

    /**
     * この章に登場する場所。
     * 登場する最初の節順に並べられています。
     */
    places: ChapterPlace[];

    /**
     * この章に登場する出来事。
     * 登場する最初の節順に並べられています。
     */
    events: ChapterEvent[];
}

interface ChapterPerson {
    /**
     * その人物のID。
     */
    id: string;

    /**
     * その人の名前。
     */
    name: string;

    /**
     * その人物の名前が固有名詞であるかどうか。
     */
    isProperName?: boolean;

    /**
     * その人の性別。
     */
    gender?: string;

    /**
     * その人が生まれた年と亡くなった年。
     * 負の数は紀元前（BC）年、正の数は紀元後（AD）年を表します。
     */
    birthYear?: number;
    deathYear?: number;

    /**
     * その人物のAPIリンク。
     */
    apiLink: string;

    /**
     * その章の中で、その人物に言及している節の数。
     * 昇順でソートされています。
     */
    verses: number[];
}

interface ChapterPlace {
    /**
     * その場所の識別情報。
     */
    id: string;

    /**
     * その場所の名前。
     */
    name: string;

    /**
     * その場所が属する地理的特徴の種類。
     */
    featureType?: string;

    /**
     * その場所の緯度と経度。
     */
    latitude?: number;
    longitude?: number;

    /**
     * その場所のAPIリンク。
     */
    apiLink: string;

    /**
     * その章の中で、その場所について言及している節の番号。
     * 昇順でソートされています。
     */
    verses: number[];
}

interface ChapterEvent {
    /**
     * イベントのID。
     */
    id: string;

    /**
     * イベント名。
     */
    name: string;

    /**
     * イベントが開始された日付。
     */
    startDate?: string;

    /**
     * イベントのAPIリンク。
     */
    apiLink: string;

    /**
     * その出来事を記述している章の節の番号。
     * 昇順でソートされています。
     */
    verses: number[];
}
```

### 例

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

## データセット内の人物一覧

`GET https://bible.helloao.org/api/d/{dataset}/people.json`

指定されたデータセットで使用可能な人物のリストを取得します。

-   `dataset`データセットの ID (例: `theographic` )。

### コード例

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-people.js"
const dataset = 'theographic';

// 神学データセットの人物リストを取得する
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

### 構造

```typescript:no-line-numbers title="dataset-people.ts"
export interface DatasetPeople {
    /**
     * 人々のデータセット情報。
     */
    dataset: Dataset;

    /**
     * データセットに使用可能な人物のリスト。
     */
    people: DatasetPersonSummary[];
}

interface DatasetPersonSummary {
    /**
     * その人物のID。
     */
    id: string;

    /**
     * その人の名前。
     */
    name: string;

    /**
     * その人物の名前が固有名詞であるかどうか。
     */
    isProperName?: boolean;

    /**
     * その人の性別。
     */
    gender?: string;

    /**
     * その人物について言及している聖書箇所の数。
     */
    numberOfReferences: number;

    /**
     * その人物のAPIリンク。
     */
    thisPersonApiLink: string;
}
```

### 例

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

## データセットから人物を取得する

`GET https://bible.helloao.org/api/d/{dataset}/people/{person}.json`

特定の人物に関する情報を取得します。これには、その人物について言及している聖書の箇所や、その人物と他の人物、場所、出来事、民族集団との関係などが含まれます。

-   `dataset`データセットの ID (例: `theographic` )。
-   `person`人物の ID (例: `paul_2479` ) です。

### コード例

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-person.js"
const dataset = 'theographic';
const person = 'paul_2479';

// 神学データセットからポールに関する情報を取得する
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

### 構造

```typescript:no-line-numbers title="dataset-person.ts"
export interface DatasetPersonResponse {
    /**
     * その人物に関するデータセット情報。
     */
    dataset: Dataset;

    /**
     * その人物に関する情報。
     */
    person: DatasetPerson;

    /**
     * この人物のAPIリンク。
     */
    thisPersonApiLink: string;
}

interface DatasetPerson {
    /**
     * その人物のID。
     */
    id: string;

    /**
     * その人の名前。
     */
    name: string;

    /**
     * その人が呼ばれるその他の名前。
     */
    alsoCalled?: string[];

    /**
     * その人物の名前が固有名詞であるかどうか。
     */
    isProperName?: boolean;

    /**
     * その人の性別。
     */
    gender?: string;

    /**
     * 人物の説明。各文字列は段落を表します。
     */
    description?: string[];

    /**
     * その人が生まれた年と亡くなった年。
     * 負の数は紀元前（BC）年、正の数は紀元後（AD）年を表します。
     */
    birthYear?: number;
    deathYear?: number;

    /**
     * その人物について言及されている最も古い年と最も新しい年。
     */
    minYear?: number;
    maxYear?: number;

    /**
     * その人が生まれ、亡くなった場所。
     */
    birthPlace?: DatasetEntityRef;
    deathPlace?: DatasetEntityRef;

    /**
     * その人物の家族関係。
     */
    father?: DatasetEntityRef[];
    mother?: DatasetEntityRef[];
    partners?: DatasetEntityRef[];
    children?: DatasetEntityRef[];
    siblings?: DatasetEntityRef[];
    halfSiblingsSameMother?: DatasetEntityRef[];
    halfSiblingsSameFather?: DatasetEntityRef[];

    /**
     * その人が所属している人々の集団。
     */
    memberOf?: DatasetEntityRef[];

    /**
     * その人物が参加したイベント。
     */
    events?: DatasetEntityRef[];

    /**
     * その人物について言及している聖書箇所の一覧。
     * 書籍の順番、章、節順に並べ替えられています。
     */
    references: VerseRef[];
}
```

### 例

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

## データセット内の場所を一覧表示する

`GET https://bible.helloao.org/api/d/{dataset}/places.json`

指定されたデータセットで利用可能な場所のリストを取得します。

-   `dataset`データセットの ID (例: `theographic` )。

### 構造

```typescript:no-line-numbers title="dataset-places.ts"
export interface DatasetPlaces {
    /**
     * 場所に関するデータセット情報。
     */
    dataset: Dataset;

    /**
     * データセットで使用可能な場所のリスト。
     */
    places: DatasetPlaceSummary[];
}

interface DatasetPlaceSummary {
    /**
     * その場所の識別情報。
     */
    id: string;

    /**
     * その場所の名前。
     */
    name: string;

    /**
     * その場所が属する地理的特徴の種類。
     * 例えば、「都市」、「地域」、「山」、「水域」など。
     */
    featureType?: string;

    /**
     * その場所の緯度と経度。
     */
    latitude?: number;
    longitude?: number;

    /**
     * その場所について言及している聖書箇所の数。
     */
    numberOfReferences: number;

    /**
     * その場所のAPIリンク。
     */
    thisPlaceApiLink: string;
}
```

## データセットから場所を取得する

`GET https://bible.helloao.org/api/d/{dataset}/places/{place}.json`

特定の場所に関する情報を取得します。これには、その場所について言及している聖書の箇所、関連する人物や出来事などが含まれます。

-   `dataset`データセットの ID (例: `theographic` )。
-   `place`場所の ID (例: `jerusalem_636` )。

### 構造

```typescript:no-line-numbers title="dataset-place.ts"
export interface DatasetPlaceResponse {
    /**
     * その場所に関するデータセット情報。
     */
    dataset: Dataset;

    /**
     * その場所に関する情報。
     */
    place: DatasetPlace;

    /**
     * この場所のAPIリンク。
     */
    thisPlaceApiLink: string;
}

interface DatasetPlace {
    /**
     * その場所の識別情報。
     */
    id: string;

    /**
     * その場所の名前。
     */
    name: string;

    /**
     * 欽定訳聖書と標準英語訳聖書に登場する地名。
     */
    kjvName?: string;
    esvName?: string;

    /**
     * その場所のその他の呼び名。
     */
    aliases?: string[];

    /**
     * その場所が属する地理的特徴の種類。
     */
    featureType?: string;
    featureSubType?: string;

    /**
     * その場所の緯度と経度、そしてそれらの精度。
     */
    latitude?: number;
    longitude?: number;
    precision?: string;

    /**
     * 場所の説明。各文字列は段落を表します。
     */
    description?: string[];

    /**
     * データセット作成者による、その場所に関するコメント。
     */
    comment?: string;

    /**
     * この場所の起源となる場所。
     * 同じ地理的な場所を指す異なる名称は、同じ語源を共有している。
     */
    rootPlace?: DatasetEntityRef;

    /**
     * この場所が複製された場所。
     */
    duplicateOf?: DatasetEntityRef;

    /**
     * その場所にいた人、その場所で生まれた人、その場所で亡くなった人。
     */
    people?: DatasetEntityRef[];
    peopleBorn?: DatasetEntityRef[];
    peopleDied?: DatasetEntityRef[];

    /**
     * その場所で起こった出来事。
     */
    events?: DatasetEntityRef[];

    /**
     * その場所について言及している聖書箇所の一覧。
     * 書籍の順番、章、節順に並べ替えられています。
     */
    references: VerseRef[];
}
```

### 例

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

## データセット内のイベントを一覧表示する

`GET https://bible.helloao.org/api/d/{dataset}/events.json`

指定されたデータセットで使用可能なイベントのリストを取得します。

-   `dataset`データセットの ID (例: `theographic` )。

### 構造

```typescript:no-line-numbers title="dataset-events.ts"
export interface DatasetEvents {
    /**
     * イベントに関するデータセット情報。
     */
    dataset: Dataset;

    /**
     * データセットで使用可能なイベントの一覧。
     */
    events: DatasetEventSummary[];
}

interface DatasetEventSummary {
    /**
     * イベントのID。
     */
    id: string;

    /**
     * イベント名。
     */
    name: string;

    /**
     * イベントが開始された日付。
     * 負の数は紀元前（BC）年、正の数は紀元後（AD）年を表します。
     * より具体的な日付は`YYYY-MM-DD`形式で表記します。
     */
    startDate?: string;

    /**
     * その出来事を記述している聖書の箇所数。
     */
    numberOfReferences: number;

    /**
     * イベントのAPIリンク。
     */
    thisEventApiLink: string;
}
```

## データセットからイベントを取得する

`GET https://bible.helloao.org/api/d/{dataset}/events/{event}.json`

特定の出来事に関する情報を取得します。これには、その出来事を記述している聖書の箇所、および関連する人物、場所、民族集団が含まれます。

-   `dataset`データセットの ID (例: `theographic` )。
-   `event`イベントの ID (例: `saul-is-converted_326` )。

### 構造

```typescript:no-line-numbers title="dataset-event.ts"
export interface DatasetEventResponse {
    /**
     * イベントに関するデータセット情報。
     */
    dataset: Dataset;

    /**
     * イベントに関する情報。
     */
    event: DatasetEvent;

    /**
     * このイベントのAPIリンク。
     */
    thisEventApiLink: string;
}

interface DatasetEvent {
    /**
     * イベントのID。
     */
    id: string;

    /**
     * イベント名。
     */
    name: string;

    /**
     * イベントが開始された日付。
     */
    startDate?: string;

    /**
     * イベントの期間。
     * 例えば、「1D」は1日、「40Y」は40年を表します。
     */
    duration?: string;

    /**
     * イベントに参加した人々。
     */
    participants?: DatasetEntityRef[];

    /**
     * その出来事が起こった場所。
     */
    locations?: DatasetEntityRef[];

    /**
     * イベントに参加した人々のグループ。
     */
    groups?: DatasetEntityRef[];

    /**
     * このイベントが属するイベント。
     */
    partOf?: DatasetEntityRef;

    /**
     * この出来事の前に起こった出来事。
     */
    predecessor?: DatasetEntityRef;

    /**
     * その出来事を記述している聖書の箇所一覧。
     * 書籍の順番、章、節ごとに並べ替えられています。
     */
    references: VerseRef[];
}
```

### 例

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

## データセット内の人物グループを一覧表示する

`GET https://bible.helloao.org/api/d/{dataset}/groups.json`

指定されたデータセットで使用可能な人々グループのリストを取得します。

-   `dataset`データセットの ID (例: `theographic` )。

### 構造

```typescript:no-line-numbers title="dataset-people-groups.ts"
export interface DatasetPeopleGroups {
    /**
     * 人々グループに関するデータセット情報。
     */
    dataset: Dataset;

    /**
     * データセットで使用可能な人々グループのリスト。
     */
    groups: DatasetPeopleGroupSummary[];
}

interface DatasetPeopleGroupSummary {
    /**
     * その集団の識別番号。
     */
    id: string;

    /**
     * その民族集団の名前。
     */
    name: string;

    /**
     * その集団に属する人数。
     */
    numberOfMembers: number;

    /**
     * 対象グループのAPIリンク。
     */
    thisPeopleGroupApiLink: string;
}
```

## データセットから人物グループを取得する

`GET https://bible.helloao.org/api/d/{dataset}/groups/{group}.json`

特定の民族集団に関する情報（構成員や、その集団が参加したイベントなど）を取得します。

-   `dataset`データセットの ID (例: `theographic` )。
-   `group`人々のグループの ID (例: `tribe-of-benjamin` ) です。

### 構造

```typescript:no-line-numbers title="dataset-people-group.ts"
export interface DatasetPeopleGroupResponse {
    /**
     * 対象人物グループに関するデータセット情報。
     */
    dataset: Dataset;

    /**
     * その民族集団に関する情報。
     */
    group: DatasetPeopleGroup;

    /**
     * この民族グループのAPIリンク。
     */
    thisPeopleGroupApiLink: string;
}

interface DatasetPeopleGroup {
    /**
     * その集団の識別番号。
     */
    id: string;

    /**
     * その民族集団の名前。
     */
    name: string;

    /**
     * その民族集団のメンバーである人々。
     */
    members?: DatasetEntityRef[];

    /**
     * その民族集団が参加した出来事。
     */
    events?: DatasetEntityRef[];

    /**
     * その民族集団について言及している聖書箇所の一覧。
     * 書籍の順番、章、節ごとに並べ替えられています。
     */
    references: VerseRef[];
}
```

### 例

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

## 相互参照データセット

ベレア語対訳データセット（ `bsb-interlinear` ）には、聖書の各節の原語（ヘブライ語、アラム語、ギリシャ語）の単語が、原文に登場する順にリストされています。各単語には、音訳、文法解析、[ストロング番号](https://en.wikipedia.org/wiki/Strong%27s_Concordance)、および[ベレア標準聖書](https://berean.bible)で使用されている英語のフレーズが記載されています。

このデータセットは、他のデータセットと同じエンドポイントを使用します。

-   `GET https://bible.helloao.org/api/d/bsb-interlinear/books.json` 66冊の本がリストされています。
-   `GET https://bible.helloao.org/api/d/bsb-interlinear/{book}/{chapter}.json` (例`/api/d/bsb-interlinear/GEN/1.json` ) は章を返し、各節に`{ verse, words }`割り当てられます。レスポンスは[データセット chapter](#get-a-chapter-from-a-dataset)です。

単語データは、パブリックドメインである[ベレア標準聖書の対訳表](https://bereanbible.com/)から取得されています。単語のストロング番号は、[辞書](#lexicon)（ `stepbible-lexicon` ）で調べられます。

### 構造

```typescript:no-line-numbers title="interlinear-word.ts"
interface InterlinearWord {
    /**
     * 原文における単語の順序を1から始まる順位で表したもの。
     * 単語は以下の順序で記載されています。
     */
    pos: number;

    /**
     * ベレア標準聖書の英語の語順における、その単語の1から始まる順位。
     */
    bsbPos: number;

    /**
     * 言葉の言語。
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * 元のスクリプトにある単語。NFC規格化済み。
     */
    text: string;

    /**
     * その単語の音訳。
     */
    transliteration: string | null;

    /**
     * 単語の短い文法解析コード。例：「N-mp」または「V-Qal-Perf-3ms」。
     */
    parsing: string | null;

    /**
     * 単語の文法的な解析結果を詳細に示したもの。
     */
    parsingFull: string | null;

    /**
     * 単語のストロング番号（ゼロ埋め）。例：「H0430」または「G3056」。
     * ゼロ埋め処理済み。これはKJVの`.words.json`値と一致する。
     * 他の翻訳値の結合には、ゼロ埋めと接尾辞の削除が必要になる場合があります。
     * ソースにストロング番号が記載されていない場合はnull（これは、代名詞の接尾辞など、一部の接尾辞に該当する単語に当てはまります）。
     */
    strongs: string | null;

    /**
     * ベレア標準訳聖書における、この単語の英語表現。
     * BSBが単語を翻訳しない場合（ヘブライ語の直接目的語マーカーなど）はnullになります。
     */
    gloss: string | null;
}
```

### 例

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

### 単語と翻訳を結びつける

行間の`strongs`値はゼロ埋めされます（例： `H0430` ）。これは、KJVの単語注釈の`strongs`値と一致します（ `/api/eng_kjv/{book}/{chapter}.words.json` ）。他の翻訳の値は、結合する前にゼロ埋めと接尾辞の削除が必要になる場合があります（例： `H430`または`H1961a`から`H0430`と`H1961` ）。

-   **KJV。**キング・ジェームズ版（ `eng_kjv`と`eng_kja` ）の場合、章の`.words.json`ファイルにあるストロング番号を、同じ節の行間単語の`strongs`と結合します。たとえば、 `H0853`節の`/api/eng_kjv/GEN/1.words.json`で注釈され`H8064`いるすべてのストロング番号（ `H7225` ） `H0430` `H1254` `H0776`の`/api/d/bsb-interlinear/GEN/1.json`節の単語の中に`strongs`値として表示されます。
-   **ベレア標準聖書。**各単語の`gloss`は、その単語の BSB のフレーズです。節の単語を`bsbPos`順序でたどり、各`gloss` BSB 翻訳の節の本文と照合して、その単語の翻訳がどこにあるかを見つけます。

2つの資料の番号付けは必ずしも一致しません。例えば、KJVでは「was」というタグが`G2258`になっていますが、ベレア表では`G1510`になっています。このような違いのために、いくつかの結合が失敗します。

### 帰属

ベレア語対訳表はパブリックドメインです。[語彙集は](#lexicon)CC BY 4.0ライセンスの下で提供されており、出典を明記する必要があります。

## 用語集

STEPBible語彙データセット（ `stepbible-lexicon` ）には、ケンブリッジのティンダル・ハウスにある[STEPBible.org](https://www.stepbible.org/)のヘブライ語、アラム語、ギリシャ語の簡略語彙集（TBESHおよびTBESG）が含まれています。各基本ストロング番号ごとに1つのエントリがあり、各エントリには、語幹、音訳、品詞、英語の注釈、定義とともに1つ以上の意味があります。

語彙集に登録されている[単語](#interlinear-datasets)の、ゼロ埋めされた`strongs`値は、再フォーマットせずに`/api/d/stepbible-lexicon/lexicon/{strongs}.json`で検索できます。KJVの`.words.json`値についても同様です。他の翻訳では、まずゼロ埋めと接尾辞の削除が必要になる場合があります。ストロング番号のないギリシャ語の項目は、語彙集には掲載されません。

語彙エントリを含むデータセットには、 `/api/available_datasets.json`のエントリに`listOfLexiconApiLink`と`totalNumberOfLexicon`含まれます。

### 帰属

この語彙データは[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)ライセンスの下で提供されています。ご利用の際は、STEPBible.org / Tyndale House, Cambridgeをクレジット表記し、変更点があれば明記してください。データセットのプロパティ`licenseNotes`にクレジット表記が記載されています。

## データセット内の語彙項目を一覧表示する

`GET https://bible.helloao.org/api/d/{dataset}/lexicon.json`

データセットで使用可能な語彙エントリのリストを取得します。

-   `dataset`データセットの ID (例: `stepbible-lexicon` )。

### コード例

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

### 構造

```typescript:no-line-numbers title="dataset-lexicon.ts"
export interface DatasetLexicon {
    /**
     * 語彙集のデータセット情報。
     */
    dataset: Dataset;

    /**
     * データセットで使用可能な語彙項目の一覧。
     */
    lexicon: DatasetLexiconEntrySummary[];
}

export interface DatasetLexiconEntrySummary {
    /**
     * 語彙項目のストロング番号をゼロ埋めしたもの。例：「H0430」。
     */
    id: string;

    /**
     * 語彙項目の言語。
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * 語彙項目の名前。
     * これは、この項目の第一の意味における補題です。
     */
    name: string;

    /**
     * 語彙項目へのAPIリンク。
     */
    apiLink: string;
}
```

### 例

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

## データセットから語彙エントリを取得する

`GET https://bible.helloao.org/api/d/{dataset}/lexicon/{strongs}.json`

単一の基本ストロング番号に対応する語彙エントリと、そのすべての意味を取得します。

-   `dataset`データセットの ID (例: `stepbible-lexicon` )。
-   `strongs`はゼロ埋めされたストロング番号です（例えば、ヘブライ語の単語*elohim*の場合は`H0430` 、ギリシャ語の単語*logos*の場合は`G3056` ）。

### コード例

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

### 構造

```typescript:no-line-numbers title="dataset-lexicon-entry.ts"
export interface DatasetLexiconEntry {
    /**
     * 語彙項目に関するデータセット情報。
     */
    dataset: Dataset;

    /**
     * 語彙項目。
     */
    entry: DatasetLexiconEntryContent;

    /**
     * この語彙項目のAPIリンク。
     */
    thisLexiconEntryApiLink: string;
}

export interface DatasetLexiconEntryContent {
    /**
     * エントリのストロング番号（ゼロ埋め）。例：「H0430」。
     */
    id: string;

    /**
     * エントリーの言語。
     * これは、この項目の最初の意味における言語表現です。
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * エントリーの五感（ID順）。
     */
    senses: DatasetLexiconSense[];
}

export interface DatasetLexiconSense {
    /**
     * センスの拡張ID。例：「H0001G」。
     * その数が単一の意味を持つ場合、基本ストロング番号と等しい。
     */
    id: string;

    /**
     * 感覚の言語。
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * 原文における意味の補題。
     */
    lemma: string;

    /**
     * 見出し語の音訳。
     */
    transliteration: string | null;

    /**
     * 意味を表す品詞（形態論）コード。
     */
    partOfSpeech: string | null;

    /**
     * その意味を簡潔に英語で説明したもの。
     */
    gloss: string | null;

    /**
     * 意味の定義を平文で示す。
     * 段落は空白行で区切られています。ソースコード内のマークアップは削除されています。
     */
    definition: string;
}
```

### 例

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

## 今日の聖句

「今日の聖句」データセット（ `verse-of-the-day` ）は、「今日の聖句」としてふさわしい、よく知られた聖句や短い一節（最大3節）を厳選したリストです。年間を通して毎日640以上、キリスト教の祝日には100以上が収録されています。それぞれ単独で意味を持ちます。

毎日掲載される聖句は、以下の固定されたセットから、最も関連性の高いものから順に、1つから3つのカテゴリーに分類されます。

| ID            | 説明                                                                         |
| ------------- | ---------------------------------------------------------------------------- |
| `comfort`     | 悲しみ、苦難、孤独の中にあっても、神はそばにいて、私たちを気遣ってくださる。 |
| `courage`     | 毅然とした態度を保ち、恐れないこと。                                         |
| `faith`       | 神と神の約束を信じる。                                                       |
| `forgiveness` | 神による罪の赦しと、他者を赦すこと。                                         |
| `gratitude`   | 神に感謝を捧げる。                                                           |
| `guidance`    | 神は私たちの歩み、計画、決断を導いてくださる。                               |
| `hope`        | 神が約束された未来への確信。                                                 |
| `inspiration` | 信仰を実践し、善行を行うよう励ます。                                         |
| `joy`         | 神にあって喜びと歓喜を。                                                     |
| `love`        | 神の私たちへの愛、そして私たちが神と他者を愛すること。                       |
| `peace`       | 休息、静寂、そして不安からの解放。                                           |
| `praise`      | 神への崇拝と、神の偉大さを宣言すること。                                     |
| `prayer`      | 神に祈り、神が耳を傾けてくださるという約束を信じる。                         |
| `provision`   | 神は私たちに必要なものを与えてくださる。                                     |
| `salvation`   | キリストにおける贖罪、恵み、そして新しい命。                                 |
| `strength`    | 神が力と忍耐を与えてくださる。                                               |
| `wisdom`      | 神の知恵と、人生のための実践的な教え。                                       |

祝日には独自のカテゴリーがあります。祝日には、その日の聖句はその祝日の聖句の一つであり、他の日にはその聖句は使用されません。祝日は通常1日続きます。復活祭後祝日は復活祭後の3日間続くため、3つの日付すべてが記載されています。各祝日カテゴリーには日付とともに`holiday`が付きます。毎年同じ日付の祝日には`month`と`day`が付き、毎年日付が変わる祝日（復活祭または待降節に依存するため）には、2026年から2125年までのグレゴリオ暦で`dates`付きます。

| ID                         | 休日           | 日付                        |
| -------------------------- | -------------- | --------------------------- |
| `epiphany`                 | 公現祭         | 1月6日                      |
| `ash-wednesday`            | 灰の水曜日     | 復活祭の46日前              |
| `palm-sunday`              | 棕櫚の主日     | 復活祭前の日曜日            |
| `maundy-thursday`          | 聖木曜日       | 復活祭前の木曜日            |
| `good-friday`              | 聖金曜日       | 復活祭前の金曜日            |
| `resurrection-sunday`      | 復活祭         | イースターサンデー          |
| `post-resurrection-sunday` | 復活祭後       | 復活祭の日曜日の後の3日間   |
| `ascension-day`            | 昇天祭         | 復活祭から39日後            |
| `pentecost`                | ペンテコステ   | 復活祭から49日後            |
| `all-hallows-eve`          | 万聖節前夜     | 10月31日                    |
| `all-saints-day`           | 万聖節         | 11月1日                     |
| `advent-sunday`            | 待降節第一主日 | クリスマス前の4番目の日曜日 |
| `christmas-eve`            | クリスマスイブ | 12月24日                    |
| `christmas`                | クリスマス     | 12月25日                    |

このデータセットには参照情報のみが含まれており、詩のテキストは含まれていないため、どの翻訳でも使用できます。詩の番号は標準的な英語の番号付け（BSBと同じ）を使用しています。データは3つの方法で読み取ることができます。

-   [`/api/d/verse-of-the-day/verses.json`](#list-verses-in-a-dataset)データセット内のすべての詩とそのカテゴリ、および祝日とその日付が 1 つのファイルに一覧表示されています。
-   [`/api/d/verse-of-the-day/categories/{category}.json`](#get-a-category-from-a-dataset) 、各カテゴリーに含まれるすべての聖句を一覧表示します。これは、一つのカテゴリーからその日の聖句を選ぶ最も簡単な方法です。
-   [`/api/d/verse-of-the-day/{book}/{chapter}.json`](#get-a-chapter-from-a-dataset) 、各章の候補者とそのカテゴリーを一覧表示します。候補者が含まれている章のみが表示されます。書籍の章リンク、または`/api/d/verse-of-the-day/books.json`使用して候補者を探してください。

詩のカテゴリを含むデータセットには`listOfCategoriesApiLink` `/api/available_datasets.json`のエントリにある`listOfVersesApiLink` 、および`totalNumberOfCategories`含まれます。

### 今日の聖句を選ぶ

APIは静的ファイルで構成されているため、自動的に聖句を選択するわけではありません。その代わりに、聖句を選択するための規約があり、それに従うすべてのアプリが同じ日に同じ聖句を表示するようになっています。アプリは自由に異なる聖句を選択することもできますが、この規約は共通のデフォルト値を提供するだけです。

この規則では、 `/api/d/verse-of-the-day/verses.json`に含まれる聖句と祝日から選択します。祝日には、その祝日の聖句を 1 年ずつ選択していくので、祝日の聖句はすべて使い切られるまで、毎年異なる聖句が使用されます。その他の日には、その年に使用されている聖句が各年ごとにシャッフルされ (各聖句の参照、年、およびオプションのシードのハッシュによって順序付けられます)、その日の聖句はそのシャッフルでその日のその日の聖句になります。データセットには、毎年、毎日使用される 366 を超える聖句が含まれているため、聖句は暦年内で繰り返されることはなく、順序は毎年変わり、同じ日付では常に同じ聖句が使用されます。新しい聖句は ( `addedIn`で) 追加され、古い聖句は ( `removedIn`で) まだ始まっていない年にのみ削除されるため、過去の日付の聖句は変わりません。

[「今日の聖句」の規約](./verse-of-the-day-convention.md)ページでは、アルゴリズムが擬似コードとテスト値を用いて段階的に説明されているため、どのプログラミング言語でも実装できます。

独自の順番でシャッフルするには、独自のシード（例えば、アプリ名）を選択してください。これにより、同じ保証付きで異なるシャッフル結果が得られます。また、単一のカテゴリの詩から選択することもできますが、各カテゴリの詩の数は1年の日数よりも少ないため、同じ詩が繰り返される頻度が高くなります。

SDKは以下の慣例に従います。

```ts:no-line-numbers title="verse-of-the-day.js"
import { FreeUseBibleApi } from 'free-use-bible-api';

const api = new FreeUseBibleApi();

// YYYY-MM-DD形式の日付、またはDateオブジェクト（ローカルカレンダーの日付が使用されます）。デフォルトは今日の日付です。
const ref = await api.getVerseOfTheDay('2026-01-01');

// 翻訳からその聖句のテキストを入手する。
const chapter = await api.getTranslationBookChapter('BSB', ref.book, ref.chapter);
const verses = chapter.chapter.content.filter(
    (c) =>
        c.type === 'verse' &&
        c.number >= ref.verse &&
        c.number <= (ref.endVerse ?? ref.verse)
);
console.log(ref, verses);
```

-   `getVerseOfTheDay(date?, { seed?, category?, dataset? }?)`詩のリストをダウンロードしてそこから選択します。1 `pickVerseOfTheDay(verses, date?, { seed?, category? }?)`既に持っているリストから選択します。
-   Kotlin SDKには、日付を`YYYY-MM-DD`文字列として扱う`getVerseOfTheDay(date?, seed?, category?)`と`pickVerseOfTheDay(verses, date?, seed?, category?)`あります。
-   Swift SDKには、日付を`YYYY-MM-DD`文字列または`Date` （現在のタイムゾーンのカレンダー日付が使用される）として受け取る`getVerseOfTheDay(date:seed:category:)`と`pickVerseOfTheDay(_:date:seed:category:holidays:)`あります。
-   [MCPサーバーには、](https://github.com/HelloAOLab/bible-api/tree/main/packages/seed-bible-mcp)その日の聖句とそのテキストを返すツールが`getVerseOfTheDay`あります。
-   `@helloao/tools`パッケージには`@helloao/tools/generation/verse-of-the-day.js`と同じリストと`getVerseOfTheDay(date?, { seed?, category? }?)`関数があります。

### ライセンス

このリストはAO Labによって作成され、 [MITライセンス](https://github.com/HelloAOLab/bible-api/blob/main/LICENSE)の下で公開されています。詩のテキストは、あなたが取得した翻訳版に基づいています。

## データセット内の聖句を一覧表示する

`GET https://bible.helloao.org/api/d/{dataset}/verses.json`

データセット内のすべての詩節（または短い一節）を、それぞれが属するカテゴリとともに、正規の順序で取得します。カテゴリを持つ詩節を含むデータセットでのみ利用可能です（例： `verse-of-the-day` ）。

-   `dataset`データセットの ID (例: `verse-of-the-day` )。

### コード例

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

### 構造

```typescript:no-line-numbers title="dataset-verses.ts"
export interface DatasetVerses {
    /**
     * 詩句に関するデータセット情報。
     */
    dataset: Dataset;

    /**
     * データセット内のすべての詩（または短い一節）とそのカテゴリを、標準的な順序で示します。
     */
    verses: DatasetCategorizedVerse[];

    /**
     * それぞれの祝日には、日付とともに独自の詩句が定められている。
     * データセットに祝日が含まれていない場合は省略されます。
     */
    holidays?: DatasetVersesHoliday[];
}

export interface DatasetVersesHoliday extends DatasetCategoryHoliday {
    /**
     * 祝日のカテゴリID。例：「クリスマス」。
     */
    id: string;

    /**
     * 祝日の英語名。例：「クリスマス」。
     */
    name: string;
}

export interface DatasetCategoryHoliday {
    /**
     * 毎年同じ日に当たる祝日の月（1月の場合は1）と日。
     * 毎年日付が変わる祝日は省略する。
     */
    month?: number;
    day?: number;

    /**
     * 毎年日付が変わる祝日の日付（YYYY-MM-DD、グレゴリオ暦）を順番に表示します。
     * これらの祝日は、一定期間（現在は2026年から2125年）にわたって事前に計算されており、記載されている日付にのみ祝日として扱われます。
     * 毎年同じ日に当たる祝日は省略します。
     */
    dates?: string[];
}

export interface DatasetCategorizedVerse {
    /**
     * 書籍のID。例：「PRO」。
     */
    book: string;

    /**
     * 章番号。
     */
    chapter: number;

    /**
     * 節番号。
     * `endVerse`が存在する場合、これはその文章が始まる節です。
     */
    verse: number;

    /**
     * その文章が終わる節。
     * 単一の詩句の場合は省略する。
     */
    endVerse?: number;

    /**
     * その詩が属するカテゴリのIDを、関連性の高い順に表示します。
     */
    categories: string[];

    /**
     * その聖句が「今日の聖句」として採用される最初の年。
     * 当該節が常にリストに含まれている場合は省略される。
     */
    addedIn?: number;

    /**
     * その聖句がもはや「今日の聖句」として使えなくなる最初の年。
     * 削除された詩句もデータセット内に残るため、それ以前の年の詩句を選択することは可能です。
     * リストから削除されていない節は省略されます。
     */
    removedIn?: number;
}
```

### 例

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

## データセット内のカテゴリを一覧表示する

`GET https://bible.helloao.org/api/d/{dataset}/categories.json`

データセットで使用可能な詩のカテゴリ一覧を取得します。

-   `dataset`データセットの ID (例: `verse-of-the-day` )。

### コード例

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

### 構造

```typescript:no-line-numbers title="dataset-categories.ts"
export interface DatasetCategories {
    /**
     * カテゴリごとのデータセット情報。
     */
    dataset: Dataset;

    /**
     * データセットで使用可能な詩のカテゴリ一覧。
     */
    categories: DatasetCategorySummary[];
}

export interface DatasetCategorySummary {
    /**
     * カテゴリのID。例：「希望」。
     */
    id: string;

    /**
     * カテゴリーの英語名。例：「希望」。
     */
    name: string;

    /**
     * そのカテゴリーに含まれる詩句の内容の説明。
     */
    description: string;

    /**
     * そのカテゴリーに属する詩句（または短い一節）の数。
     */
    numberOfVerses: number;

    /**
     * そのカテゴリが対象とする祝日の日付（上記の DatasetCategoryHoliday を参照）。
     * 祝日に関係しないカテゴリーは省略されています。
     */
    holiday?: DatasetCategoryHoliday;

    /**
     * そのカテゴリのAPIリンク。
     */
    apiLink: string;
}
```

### 例

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

## データセットからカテゴリを取得する

`GET https://bible.helloao.org/api/d/{dataset}/categories/{category}.json`

単一の詩のカテゴリと、それに属するすべての詩を取得します。

-   `dataset`データセットの ID (例: `verse-of-the-day` )。
-   `category`はカテゴリのIDです（例： `hope` ）。

### コード例

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

### 構造

```typescript:no-line-numbers title="dataset-category.ts"
export interface DatasetCategoryResponse {
    /**
     * カテゴリに関するデータセット情報。
     */
    dataset: Dataset;

    /**
     * カテゴリーと、それに属する詩句。
     */
    category: DatasetCategory;

    /**
     * このカテゴリのAPIリンク。
     */
    thisCategoryApiLink: string;
}

export interface DatasetCategory {
    /**
     * カテゴリのID。例：「希望」。
     */
    id: string;

    /**
     * カテゴリーの英語名。例：「希望」。
     */
    name: string;

    /**
     * そのカテゴリーに含まれる詩句の内容の説明。
     */
    description: string;

    /**
     * そのカテゴリが対象とする祝日の日付（「データセット内の聖句のリスト」の DatasetCategoryHoliday を参照）。
     * これらの日付では、その日の聖句はそのカテゴリーに属する聖句の一つであり、他の日には使用されません。
     * 祝日に関係しないカテゴリーは省略されています。
     */
    holiday?: DatasetCategoryHoliday;

    /**
     * このカテゴリーに属する詩句（または短い一節）を、正典の順序で示します。
     * リストから削除された節も含まれています（ `removedIn`参照）。
     */
    verses: DatasetCategoryVerse[];
}

export interface DatasetCategoryVerse {
    /**
     * 書籍のID。例：「JER」。
     */
    book: string;

    /**
     * 章番号。
     */
    chapter: number;

    /**
     * 節番号。
     * `endVerse`が存在する場合、これはその文章が始まる節です。
     */
    verse: number;

    /**
     * その文章が終わる節。
     * 参照箇所が単一の詩節の場合は省略する。
     */
    endVerse?: number;

    /**
     * その聖句が「今日の聖句」として採用される最初の年。
     * 当該節が常にリストに含まれている場合は省略される。
     */
    addedIn?: number;

    /**
     * その聖句がもはや「今日の聖句」として使えなくなる最初の年。
     * 削除された詩句もデータセット内に残るため、それ以前の年の詩句を選択することは可能です。
     * リストから削除されていない節は省略されます。
     */
    removedIn?: number;
}
```

### 例

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
