---
description: 'Comece a usar a API gratuita da Bíblia em minutos. Instale o SDK JavaScript ou acesse os endpoints JSON diretamente — sem necessidade de chave de API ou cadastro.'
---

# Começando

Vamos direto ao assunto!

## SDKs

Temos clientes de API para os seguintes idiomas:

-   [JavaScript/TypeScript](../sdks/javascript.md)

## API

A API da Bíblia está estruturada como um conjunto de arquivos JSON que podem ser baixados da internet.

Utilizando esses arquivos, você pode obter uma lista de traduções disponíveis, a lista de livros para uma tradução específica, a lista de capítulos para um livro específico e o conteúdo de cada capítulo.

Esses arquivos estão disponíveis nos seguintes caminhos:

-   [`https://bible.helloao.org/api/available_translations.json`](../reference/translations/README.md#available-translations)
-   [`https://bible.helloao.org/api/{translation}/books.json`](../reference/translations/README.md#list-books-in-a-translation)
-   [`https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`](../reference/translations/standard.md#get-a-chapter-from-a-translation)
-   [`https://bible.helloao.org/api/available_commentaries.json`](../reference/commentaries/README.md#available-commentaries)
-   [`https://bible.helloao.org/api/c/{commentary}/books.json`](../reference/commentaries/README.md#list-books-in-a-commentary)
-   [`https://bible.helloao.org/api/c/{commentary}/{book}/{chapter}.json`](../reference/commentaries/README.md#get-a-chapter-from-a-commentary)
-   [`https://bible.helloao.org/api/available_datasets.json`](../reference/datasets/README.md#available-datasets)
-   [`https://bible.helloao.org/api/d/{dataset}/books.json`](../reference/datasets/README.md#list-books-in-a-dataset)
-   [`https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`](../reference/datasets/README.md#get-a-chapter-from-a-dataset)

Para obter mais informações sobre cada endpoint, consulte a [próxima página](./making-requests.md) .
