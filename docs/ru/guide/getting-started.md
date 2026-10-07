---
description: 'Начните использовать бесплатный API Библии за считанные минуты. Установите JavaScript SDK или напрямую вызывайте JSON-конечные точки — ключ API или регистрация не требуются.'
---

# Начиная

Давайте сразу перейдём к делу!

## SDK

У нас есть API-клиенты для следующих языков:

-   [JavaScript/TypeScript](../sdks/javascript.md)

## API

Библейский API представляет собой набор JSON-файлов, доступных для скачивания из интернета.

Используя эти файлы, вы можете получить список доступных переводов, список книг для конкретного перевода, список глав для конкретной книги и содержание каждой главы.

Эти файлы доступны по следующим путям:

-   [`https://bible.helloao.org/api/available_translations.json`](../reference/translations/README.md#available-translations)
-   [`https://bible.helloao.org/api/{translation}/books.json`](../reference/translations/README.md#list-books-in-a-translation)
-   [`https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`](../reference/translations/standard.md#get-a-chapter-from-a-translation)
-   [`https://bible.helloao.org/api/available_commentaries.json`](../reference/commentaries/README.md#available-commentaries)
-   [`https://bible.helloao.org/api/c/{commentary}/books.json`](../reference/commentaries/README.md#list-books-in-a-commentary)
-   [`https://bible.helloao.org/api/c/{commentary}/{book}/{chapter}.json`](../reference/commentaries/README.md#get-a-chapter-from-a-commentary)
-   [`https://bible.helloao.org/api/available_datasets.json`](../reference/datasets/README.md#available-datasets)
-   [`https://bible.helloao.org/api/d/{dataset}/books.json`](../reference/datasets/README.md#list-books-in-a-dataset)
-   [`https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`](../reference/datasets/README.md#get-a-chapter-from-a-dataset)

Для получения более подробной информации о каждой конечной точке см. [следующую страницу](./making-requests.md) .
