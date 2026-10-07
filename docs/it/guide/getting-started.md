---
description: "Inizia a utilizzare l'API gratuita della Bibbia in pochi minuti. Installa l'SDK JavaScript o chiama direttamente gli endpoint JSON: non sono necessarie chiavi API né registrazione."
---

# Iniziare

Andiamo subito al sodo!

## SDK

Disponiamo di client API per i seguenti linguaggi:

-   [JavaScript/TypeScript](../sdks/javascript.md)

## API

L'API della Bibbia è strutturata come un insieme di file JSON scaricabili da internet.

Utilizzando questi file, è possibile ottenere un elenco delle traduzioni disponibili, l'elenco dei libri per una determinata traduzione, l'elenco dei capitoli per un determinato libro e il contenuto di ciascun capitolo.

Questi file sono disponibili ai seguenti percorsi:

-   [`https://bible.helloao.org/api/available_translations.json`](../reference/translations/README.md#available-translations)
-   [`https://bible.helloao.org/api/{translation}/books.json`](../reference/translations/README.md#list-books-in-a-translation)
-   [`https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`](../reference/translations/standard.md#get-a-chapter-from-a-translation)
-   [`https://bible.helloao.org/api/available_commentaries.json`](../reference/commentaries/README.md#available-commentaries)
-   [`https://bible.helloao.org/api/c/{commentary}/books.json`](../reference/commentaries/README.md#list-books-in-a-commentary)
-   [`https://bible.helloao.org/api/c/{commentary}/{book}/{chapter}.json`](../reference/commentaries/README.md#get-a-chapter-from-a-commentary)
-   [`https://bible.helloao.org/api/available_datasets.json`](../reference/datasets/README.md#available-datasets)
-   [`https://bible.helloao.org/api/d/{dataset}/books.json`](../reference/datasets/README.md#list-books-in-a-dataset)
-   [`https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`](../reference/datasets/README.md#get-a-chapter-from-a-dataset)

Per maggiori informazioni su ciascun endpoint, consultare la [pagina successiva](./making-requests.md) .
