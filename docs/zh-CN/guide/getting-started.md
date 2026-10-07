---
description: '几分钟内即可开始使用免费圣经API。安装JavaScript SDK或直接调用JSON端点——无需API密钥或注册。'
---

# 入门

让我们直接进入正题吧！

## SDK

我们提供以下语言的 API 客户端：

-   [JavaScript/TypeScript](../sdks/javascript.md)

## API

圣经 API 由一组 JSON 文件组成，可从互联网下载。

利用这些文件，您可以获得可用翻译列表、特定翻译的书籍列表、特定书籍的章节列表以及每个章节的内容。

这些文件位于以下路径：

-   [`https://bible.helloao.org/api/available_translations.json`](../reference/translations/README.md#available-translations)
-   [`https://bible.helloao.org/api/{translation}/books.json`](../reference/translations/README.md#list-books-in-a-translation)
-   [`https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`](../reference/translations/standard.md#get-a-chapter-from-a-translation)
-   [`https://bible.helloao.org/api/available_commentaries.json`](../reference/commentaries/README.md#available-commentaries)
-   [`https://bible.helloao.org/api/c/{commentary}/books.json`](../reference/commentaries/README.md#list-books-in-a-commentary)
-   [`https://bible.helloao.org/api/c/{commentary}/{book}/{chapter}.json`](../reference/commentaries/README.md#get-a-chapter-from-a-commentary)
-   [`https://bible.helloao.org/api/available_datasets.json`](../reference/datasets/README.md#available-datasets)
-   [`https://bible.helloao.org/api/d/{dataset}/books.json`](../reference/datasets/README.md#list-books-in-a-dataset)
-   [`https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`](../reference/datasets/README.md#get-a-chapter-from-a-dataset)

有关每个端点的更多信息，请参见[下一页](./making-requests.md)。
