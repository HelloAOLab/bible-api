---
description: 'So stellen Sie Anfragen an die Free Use Bible API: Übersetzungen, Bücher, Kapitel, Kommentare und Datensätze über einfaches HTTP GET abrufen.'
---

# Anfragen stellen

Um auf die API zuzugreifen, müssen Sie lediglich eine HTTP-GET-Anfrage an den entsprechenden Endpunkt senden.

Um beispielsweise auf den Endpunkt `available_translations.json` zuzugreifen, können Sie den folgenden JavaScript- oder cURL-Befehl verwenden:

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

Nachfolgend finden Sie eine Liste mit Beispielen. Eine ausführlichere Dokumentation finden Sie in der [Referenzdokumentation](../reference/README.md) .

## Beispiele

### Liste der verfügbaren Übersetzungen abrufen

( [Referenz](../reference/translations/README.md#available-translations) )

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

### Liste der Bücher in einer Übersetzung

( [Referenz](../reference/translations/README.md#list-books-in-a-translation) )

`GET https://bible.helloao.org/api/{translation}/books.json`

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers
// Holen Sie sich die Liste der Bücher für die BSB-Übersetzung
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

### Holen Sie sich ein Kapitel aus einer Übersetzung

( [Referenz](../reference/translations/standard.md#get-a-chapter-from-a-translation) )

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers
// Holen Sie sich Genesis 1 aus der BSB-Übersetzung.
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

### Holen Sie sich ein vereinfachtes Kapitel aus einer Übersetzung

( [Referenz](../reference/translations/simplified.md#get-a-simplified-chapter-from-a-translation) )

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.simple.json`

Verwenden Sie diese Funktion, wenn Sie nur den Text eines Kapitels benötigen. Jeder Vers enthält eine einzelne `text` anstelle einer Liste formatierten Inhalts, sodass Sie den Text nicht selbst erstellen müssen.

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers
// Den Text von Genesis 1 finden Sie in der BSB-Übersetzung.
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

### Liste der verfügbaren Kommentare anzeigen

( [Referenz](../reference/commentaries/README.md#available-commentaries) )

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

### Bücher in einem Kommentar auflisten

( [Referenz](../reference/commentaries/README.md#list-books-in-a-commentary) )

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-commentary-books.js"
const commentary = 'adam-clarke';

// Hier finden Sie die Bücherliste für den Adam-Clarke-Kommentar.
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

### Lesen Sie ein Kapitel aus einem Kommentar

( [Referenz](../reference/commentaries/README.md#get-a-chapter-from-a-commentary) )

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-commentary-chapter.js"
const commentary = 'adam-clarke';
const book = 'GEN';
const chapter = 1;

// Holen Sie sich Genesis 1 aus dem Adam-Clarke-Kommentar
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

### Listenprofile in einem Kommentar

( [Referenz](../reference/commentaries/README.md#list-profiles-in-a-commentary) )

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-commentary-profiles.js"
const commentary = 'tyndale';

// Hier finden Sie die Liste der Profile für den Tyndale-Kommentator.
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

### Erhalten Sie ein Profil in einem Kommentar

( [Referenz](../reference/commentaries/README.md#get-a-profile-in-a-commentary) )

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-commentary-profile.js"
const commentary = 'tyndale';
const profile = 'aaron';

// Holen Sie sich das Aaron-Profil aus dem Tyndale-Kommentar.
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

### Liste der verfügbaren Datensätze abrufen

( [Referenz](../reference/datasets/README.md#available-datasets) )

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

### Die Liste der Bücher in einem Datensatz abrufen

( [Referenz](../reference/datasets/README.md#list-books-in-a-dataset) )

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-books.js"
const dataset = 'open-cross-ref';

// Rufen Sie die Liste der Bücher für den Open-Cross-Ref-Datensatz ab.
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

### Ein Kapitel aus einem Datensatz abrufen

( [Referenz](../reference/datasets/README.md#get-a-chapter-from-a-dataset) )

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-chapter.js"
const dataset = 'open-cross-ref';
const book = 'GEN';
const chapter = 1;

// Genesis 1 aus dem Open-Cross-Ref-Datensatz abrufen
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
