# データセット

聖書の補足データセット（相互参照や聖書の実体（人物、場所、出来事、民族集団など））を閲覧し、それらの書籍、章の内容、実体を取得するためのエンドポイント。

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
     */
    totalNumberOfReferences: number;

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
     * 本のID。
     * 聖書の対応する書（創世記、出エジプト記など）のIDと一致します。
     */
    id: string;

    /**
     * 聖書における書物の順序。
     */
    order: number;

    /**
     * 本書における最初の章の番号。
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

相互参照データセット（例： `open-cross-ref` ）の場合、章には各節の相互参照リストが含まれます。エンティティデータセット（例： `theographic` ）の場合、章にはその章に登場する人物、場所、イベントが含まれます。詳しくは[「章内のエンティティを取得する」を](#get-the-entities-in-a-chapter)参照してください。

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

interface DatasetVerse {
    /**
     * 節の番号。
     */
    verse: number;

    /**
     * その聖句の相互参照。
     *
     * スコアの高い順に並べ替え（降順）。
     */
    references: DatasetReference[];
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
     * 書籍の順番、章、節順に並べ替えられています。
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
     * その民族集団に属する人々。
     */
    members?: DatasetEntityRef[];

    /**
     * その民族集団が参加した出来事。
     */
    events?: DatasetEntityRef[];

    /**
     * その民族集団について言及している聖書箇所の一覧。
     * 書籍の順番、章、節順に並べ替えられています。
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
