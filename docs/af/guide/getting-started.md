---
description: 'Begin die Free Use Bible API binne minute gebruik. Installeer die JavaScript SDK of roep die JSON-eindpunte direk op — geen API-sleutel of registrasie nodig nie.'
---

# Aan die gang kom

Kom ons begin dadelik!

## SDK's

Ons het API-kliënte vir die volgende tale:

-   [JavaScript/TypeScript](../sdks/javascript.md)

## API

Die Bybel API is gestruktureer as 'n stel JSON-lêers wat beskikbaar is vir aflaai vanaf die internet.

Deur hierdie lêers te gebruik, kan jy 'n lys van beskikbare vertalings, die lys van boeke vir 'n spesifieke vertaling, die lys van hoofstukke vir 'n spesifieke boek en die inhoud van elke hoofstuk kry.

Hierdie lêers is beskikbaar op die volgende paaie:

-   [`https://bible.helloao.org/api/available_translations.json`](../reference/translations/README.md#available-translations)
-   [`https://bible.helloao.org/api/{translation}/books.json`](../reference/translations/README.md#list-books-in-a-translation)
-   [`https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`](../reference/translations/standard.md#get-a-chapter-from-a-translation)
-   [`https://bible.helloao.org/api/available_commentaries.json`](../reference/commentaries/README.md#available-commentaries)
-   [`https://bible.helloao.org/api/c/{commentary}/books.json`](../reference/commentaries/README.md#list-books-in-a-commentary)
-   [`https://bible.helloao.org/api/c/{commentary}/{book}/{chapter}.json`](../reference/commentaries/README.md#get-a-chapter-from-a-commentary)
-   [`https://bible.helloao.org/api/available_datasets.json`](../reference/datasets/README.md#available-datasets)
-   [`https://bible.helloao.org/api/d/{dataset}/books.json`](../reference/datasets/README.md#list-books-in-a-dataset)
-   [`https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`](../reference/datasets/README.md#get-a-chapter-from-a-dataset)

Vir meer inligting oor elke eindpunt, sien die [volgende bladsy](./making-requests.md) .
