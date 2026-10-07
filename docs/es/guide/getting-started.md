---
description: 'Empiece a usar la API de la Biblia de uso gratuito en cuestión de minutos. Instale el SDK de JavaScript o llame directamente a los puntos finales JSON; no se requiere clave de API ni registro.'
---

# Empezando

¡Vamos a ello de inmediato!

## SDK

Disponemos de clientes API para los siguientes lenguajes:

-   [JavaScript/TypeScript](../sdks/javascript.md)

## API

La API de la Biblia está estructurada como un conjunto de archivos JSON que se pueden descargar desde Internet.

Utilizando estos archivos, podrá obtener una lista de las traducciones disponibles, la lista de libros correspondientes a una traducción específica, la lista de capítulos de un libro en particular y el contenido de cada capítulo.

Estos archivos están disponibles en las siguientes rutas:

-   [`https://bible.helloao.org/api/available_translations.json`](../reference/translations/README.md#available-translations)
-   [`https://bible.helloao.org/api/{translation}/books.json`](../reference/translations/README.md#list-books-in-a-translation)
-   [`https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`](../reference/translations/standard.md#get-a-chapter-from-a-translation)
-   [`https://bible.helloao.org/api/available_commentaries.json`](../reference/commentaries/README.md#available-commentaries)
-   [`https://bible.helloao.org/api/c/{commentary}/books.json`](../reference/commentaries/README.md#list-books-in-a-commentary)
-   [`https://bible.helloao.org/api/c/{commentary}/{book}/{chapter}.json`](../reference/commentaries/README.md#get-a-chapter-from-a-commentary)
-   [`https://bible.helloao.org/api/available_datasets.json`](../reference/datasets/README.md#available-datasets)
-   [`https://bible.helloao.org/api/d/{dataset}/books.json`](../reference/datasets/README.md#list-books-in-a-dataset)
-   [`https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`](../reference/datasets/README.md#get-a-chapter-from-a-dataset)

Para obtener más información sobre cada punto final, consulte la [página siguiente](./making-requests.md) .
