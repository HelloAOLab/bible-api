---
description: '無料聖書APIへのリクエスト方法：通常のHTTP GETを使用して、翻訳、書籍、章、解説、データセットを取得します。'
---

# リクエストを行う

APIにアクセスするには、適切なエンドポイントに対してHTTP GETリクエストを送信するだけで済みます。

例えば、エンドポイント`available_translations.json`にアクセスするには、次のJavaScriptまたはcURLコマンドを使用できます。

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers
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

以下に例を示します。より詳細なドキュメントについては、[リファレンスドキュメント](../reference/README.md)を参照してください。

## 例

### 利用可能な翻訳の一覧を取得する

（[参照](../reference/translations/README.md#available-translations)）

`GET https://bible.helloao.org/api/available_translations.json`

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers
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

### 翻訳された書籍一覧

（[参照](../reference/translations/README.md#list-books-in-a-translation)）

`GET https://bible.helloao.org/api/{translation}/books.json`

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers
// BSB翻訳の書籍リストを入手する
fetch(`https://bible.helloao.org/api/BSB/books.json`)
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

### 翻訳版から章を取得する

（[参照](../reference/translations/standard.md#get-a-chapter-from-a-translation)）

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers
// BSB訳の創世記1章を入手してください
fetch(`https://bible.helloao.org/api/BSB/GEN/1.json`)
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

### 翻訳から簡略化された章を取得する

（[参照](../reference/translations/simplified.md#get-a-simplified-chapter-from-a-translation)）

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.simple.json`

章のテキストだけが必要な場合は、これを使用してください。各節には、書式設定されたコンテンツのリストではなく、単一の`text`文字列が含まれているため、自分でテキストを作成する必要はありません。

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers
// BSB訳の創世記1章の本文を入手してください。
fetch(`https://bible.helloao.org/api/BSB/GEN/1.simple.json`)
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

### 利用可能な解説書のリストを取得する

（[参照](../reference/commentaries/README.md#available-commentaries)）

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-commentaries.js"
fetch(`https://bible.helloao.org/api/available_commentaries.json`)
    .then(request => request.json())
    .then(availableCommentaries => {
        console.log('The API has the following commentaries:', availableCommentaries);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/available_commentaries.json
```

:::

### 解説書に収録されている書籍の一覧

（[参照](../reference/commentaries/README.md#list-books-in-a-commentary)）

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-commentary-books.js"
const commentary = 'adam-clarke';

// アダム・クラーク解説書の参考文献リストを入手する
fetch(`https://bible.helloao.org/api/c/${commentary}/books.json`)
    .then(request => request.json())
    .then(books => {
        console.log('The adam-clarke commentary has the following books:', books);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/c/adam-clarke/books.json
```

:::

### 解説書から章を取得する

（[参照](../reference/commentaries/README.md#get-a-chapter-from-a-commentary)）

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-commentary-chapter.js"
const commentary = 'adam-clarke';
const book = 'GEN';
const chapter = 1;

// アダム・クラーク解説書から創世記1章を入手してください。
fetch(`https://bible.helloao.org/api/c/${commentary}/${book}/${chapter}.json`)
    .then(request => request.json())
    .then(chapter => {
        console.log('Genesis 1 (adam-clarke):', chapter);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/c/adam-clarke/GEN/1.json
```

:::

### 解説記事にプロフィール一覧を掲載する

（[参照](../reference/commentaries/README.md#list-profiles-in-a-commentary)）

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-commentary-profiles.js"
const commentary = 'tyndale';

// ティンダル解説書のプロフィール一覧を入手する
fetch(`https://bible.helloao.org/api/c/${commentary}/profiles.json`)
    .then(request => request.json())
    .then(profiles => {
        console.log('The tyndale commentary has the following profiles:', profiles);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/c/tyndale/profiles.json
```

:::

### 解説記事でプロフィールを取得する

（[参照](../reference/commentaries/README.md#get-a-profile-in-a-commentary)）

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-commentary-profile.js"
const commentary = 'tyndale';
const profile = 'aaron';

// ティンダル解説書からアーロンのプロフィールを入手してください。
fetch(`https://bible.helloao.org/api/c/${commentary}/profiles/${profile}.json`)
    .then(request => request.json())
    .then(profile => {
        console.log('The Aaron tyndale commentary profile:', profile);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/c/tyndale/profiles/aaron.json
```

:::

### 利用可能なデータセットの一覧を取得する

（[参照](../reference/datasets/README.md#available-datasets)）

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

### データセット内の書籍リストを取得する

（[参照](../reference/datasets/README.md#list-books-in-a-dataset)）

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

### データセットから章を取得する

（[参照](../reference/datasets/README.md#get-a-chapter-from-a-dataset)）

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
