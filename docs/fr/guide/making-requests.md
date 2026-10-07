---
description: "Comment effectuer des requêtes auprès de l'API Free Use Bible : récupérer des traductions, des livres, des chapitres, des commentaires et des ensembles de données via une simple requête HTTP GET."
---

# Faire des demandes

Pour accéder à l'API, il vous suffit d'effectuer une requête HTTP GET vers le point de terminaison approprié.

Par exemple, pour accéder au point de terminaison `available_translations.json` , vous pouvez utiliser la commande JavaScript ou cURL suivante :

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

Vous trouverez ci-dessous une liste d'exemples. Pour une documentation plus complète, consultez la [documentation de référence](../reference/README.md) .

## Exemples

### Obtenir la liste des traductions disponibles

( [référence](../reference/translations/README.md#available-translations) )

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

### Liste de livres en traduction

( [référence](../reference/translations/README.md#list-books-in-a-translation) )

`GET https://bible.helloao.org/api/{translation}/books.json`

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers
// Obtenez la liste des livres pour la traduction BSB
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

### Obtenir un chapitre à partir d'une traduction

( [référence](../reference/translations/standard.md#get-a-chapter-from-a-translation) )

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers
// Obtenez Genèse 1 à partir de la traduction BSB
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

### Obtenez un chapitre simplifié à partir d'une traduction

( [référence](../reference/translations/simplified.md#get-a-simplified-chapter-from-a-translation) )

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.simple.json`

Utilisez cette fonction lorsque vous souhaitez uniquement le texte d'un chapitre. Chaque verset contient une seule chaîne de caractères vide `text` au lieu d'une liste de contenu formaté ; vous n'avez donc pas besoin de construire le texte vous-même.

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers
// Obtenez le texte de Genèse 1 à partir de la traduction BSB
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

### Obtenez la liste des commentaires disponibles

( [référence](../reference/commentaries/README.md#available-commentaries) )

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

### Liste des livres dans un commentaire

( [référence](../reference/commentaries/README.md#list-books-in-a-commentary) )

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-commentary-books.js"
const commentary = 'adam-clarke';

// Obtenez la liste des livres pour le commentaire d'Adam et Clarke
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

### Obtenir un chapitre d'un commentaire

( [référence](../reference/commentaries/README.md#get-a-chapter-from-a-commentary) )

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-commentary-chapter.js"
const commentary = 'adam-clarke';
const book = 'GEN';
const chapter = 1;

// Obtenez le chapitre 1 de la Genèse à partir du commentaire d'Adam et Clarke.
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

### Liste des profils dans un commentaire

( [référence](../reference/commentaries/README.md#list-profiles-in-a-commentary) )

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-commentary-profiles.js"
const commentary = 'tyndale';

// Obtenez la liste des profils pour les commentaires de Tyndale
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

### Obtenez un profil dans un commentaire

( [référence](../reference/commentaries/README.md#get-a-profile-in-a-commentary) )

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-commentary-profile.js"
const commentary = 'tyndale';
const profile = 'aaron';

// Obtenez le profil d'Aaron à partir des commentaires de Tyndale.
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

### Obtenir la liste des jeux de données disponibles

( [référence](../reference/datasets/README.md#available-datasets) )

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

### Obtenir la liste des livres dans un ensemble de données

( [référence](../reference/datasets/README.md#list-books-in-a-dataset) )

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-books.js"
const dataset = 'open-cross-ref';

// Obtenez la liste des livres pour l'ensemble de données open-cross-ref
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

### Obtenir un chapitre à partir d'un ensemble de données

( [référence](../reference/datasets/README.md#get-a-chapter-from-a-dataset) )

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-chapter.js"
const dataset = 'open-cross-ref';
const book = 'GEN';
const chapter = 1;

// Récupérez le chapitre 1 de la Genèse à partir de l'ensemble de données open-cross-ref.
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
