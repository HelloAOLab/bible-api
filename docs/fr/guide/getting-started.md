---
description: "Commencez à utiliser l'API Bible gratuite en quelques minutes. Installez le SDK JavaScript ou appelez directement les points de terminaison JSON ; aucune clé API ni inscription n'est requise."
---

# Commencer

Entrons tout de suite dans le vif du sujet !

## SDK

Nous proposons des clients API pour les langages suivants :

-   [JavaScript/TypeScript](../sdks/javascript.md)

## API

L'API biblique est structurée sous forme d'un ensemble de fichiers JSON disponibles en téléchargement sur Internet.

Grâce à ces fichiers, vous pouvez obtenir la liste des traductions disponibles, la liste des livres pour une traduction particulière, la liste des chapitres pour un livre particulier et le contenu de chaque chapitre.

Ces fichiers sont disponibles aux emplacements suivants :

-   [`https://bible.helloao.org/api/available_translations.json`](../reference/translations/README.md#available-translations)
-   [`https://bible.helloao.org/api/{translation}/books.json`](../reference/translations/README.md#list-books-in-a-translation)
-   [`https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`](../reference/translations/standard.md#get-a-chapter-from-a-translation)
-   [`https://bible.helloao.org/api/available_commentaries.json`](../reference/commentaries/README.md#available-commentaries)
-   [`https://bible.helloao.org/api/c/{commentary}/books.json`](../reference/commentaries/README.md#list-books-in-a-commentary)
-   [`https://bible.helloao.org/api/c/{commentary}/{book}/{chapter}.json`](../reference/commentaries/README.md#get-a-chapter-from-a-commentary)
-   [`https://bible.helloao.org/api/available_datasets.json`](../reference/datasets/README.md#available-datasets)
-   [`https://bible.helloao.org/api/d/{dataset}/books.json`](../reference/datasets/README.md#list-books-in-a-dataset)
-   [`https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`](../reference/datasets/README.md#get-a-chapter-from-a-dataset)

Pour plus d'informations sur chaque point de terminaison, consultez la [page suivante](./making-requests.md) .
