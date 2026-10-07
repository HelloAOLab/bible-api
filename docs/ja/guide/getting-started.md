---
description: '無料聖書APIは数分で使い始められます。JavaScript SDKをインストールするか、JSONエンドポイントを直接呼び出すだけでOK。APIキーやサインアップは不要です。'
---

# はじめる

早速本題に入りましょう！

## SDK

以下の言語に対応したAPIクライアントをご用意しています。

-   [JavaScript/TypeScript](../sdks/javascript.md)

## API

聖書APIは、インターネットからダウンロード可能な一連のJSONファイルとして構成されています。

これらのファイルを使用すると、利用可能な翻訳の一覧、特定の翻訳に対応する書籍の一覧、特定の書籍の章の一覧、および各章の内容を取得できます。

これらのファイルは以下のパスにあります。

-   [`https://bible.helloao.org/api/available_translations.json`](../reference/translations/README.md#available-translations)
-   [`https://bible.helloao.org/api/{translation}/books.json`](../reference/translations/README.md#list-books-in-a-translation)
-   [`https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`](../reference/translations/standard.md#get-a-chapter-from-a-translation)
-   [`https://bible.helloao.org/api/available_commentaries.json`](../reference/commentaries/README.md#available-commentaries)
-   [`https://bible.helloao.org/api/c/{commentary}/books.json`](../reference/commentaries/README.md#list-books-in-a-commentary)
-   [`https://bible.helloao.org/api/c/{commentary}/{book}/{chapter}.json`](../reference/commentaries/README.md#get-a-chapter-from-a-commentary)
-   [`https://bible.helloao.org/api/available_datasets.json`](../reference/datasets/README.md#available-datasets)
-   [`https://bible.helloao.org/api/d/{dataset}/books.json`](../reference/datasets/README.md#list-books-in-a-dataset)
-   [`https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`](../reference/datasets/README.md#get-a-chapter-from-a-dataset)

各エンドポイントの詳細については、[次のページ](./making-requests.md)をご覧ください。
