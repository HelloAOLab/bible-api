---
description: 'Die Free Use Bible API ist in wenigen Minuten einsatzbereit. Installieren Sie das JavaScript SDK oder rufen Sie die JSON-Endpunkte direkt auf – API-Schlüssel oder Registrierung sind nicht erforderlich.'
---

# Erste Schritte

Legen wir gleich los!

## SDKs

Wir bieten API-Clients für die folgenden Sprachen an:

-   [JavaScript/TypeScript](../sdks/javascript.md)

## API

Die Bibel-API ist als eine Reihe von JSON-Dateien strukturiert, die aus dem Internet heruntergeladen werden können.

Mithilfe dieser Dateien erhalten Sie eine Liste der verfügbaren Übersetzungen, die Liste der Bücher für eine bestimmte Übersetzung, die Liste der Kapitel für ein bestimmtes Buch und den Inhalt jedes Kapitels.

Diese Dateien sind unter folgenden Pfaden verfügbar:

-   [`https://bible.helloao.org/api/available_translations.json`](../reference/translations/README.md#available-translations)
-   [`https://bible.helloao.org/api/{translation}/books.json`](../reference/translations/README.md#list-books-in-a-translation)
-   [`https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`](../reference/translations/standard.md#get-a-chapter-from-a-translation)
-   [`https://bible.helloao.org/api/available_commentaries.json`](../reference/commentaries/README.md#available-commentaries)
-   [`https://bible.helloao.org/api/c/{commentary}/books.json`](../reference/commentaries/README.md#list-books-in-a-commentary)
-   [`https://bible.helloao.org/api/c/{commentary}/{book}/{chapter}.json`](../reference/commentaries/README.md#get-a-chapter-from-a-commentary)
-   [`https://bible.helloao.org/api/available_datasets.json`](../reference/datasets/README.md#available-datasets)
-   [`https://bible.helloao.org/api/d/{dataset}/books.json`](../reference/datasets/README.md#list-books-in-a-dataset)
-   [`https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`](../reference/datasets/README.md#get-a-chapter-from-a-dataset)

Weitere Informationen zu den einzelnen Endpunkten finden Sie auf der [nächsten Seite](./making-requests.md) .
