---
description: 'Hoe om versoeke aan die Free Use Bible API te rig: haal vertalings, boeke, hoofstukke, kommentare en datastelle oor gewone HTTP GET.'
---

# Versoeke maak

Om toegang tot die API te verkry, hoef jy net 'n HTTP GET-versoek na die regte eindpunt te maak.

Byvoorbeeld, om toegang tot die `available_translations.json` eindpunt te verkry, kan jy die volgende JavaScript- of cURL-opdrag gebruik:

::: code-tabs#taal

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

Hieronder vind u 'n lys van voorbeelde. Vir meer volledige dokumentasie, sien die [Verwysingsdokumentasie](../reference/README.md) .

## Voorbeelde

### Kry die lys van beskikbare vertalings

( [verwysing](../reference/translations/README.md#available-translations) )

`GET https://bible.helloao.org/api/available_translations.json`

::: code-tabs#taal

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

### Lys boeke in 'n vertaling

( [verwysing](../reference/translations/README.md#list-books-in-a-translation) )

`GET https://bible.helloao.org/api/{translation}/books.json`

::: code-tabs#taal

@tab JavaScript

```ts:no-line-numbers
// Kry die lys van boeke vir die BSB-vertaling
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

### Kry 'n hoofstuk uit 'n vertaling

( [verwysing](../reference/translations/standard.md#get-a-chapter-from-a-translation) )

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`

::: code-tabs#taal

@tab JavaScript

```ts:no-line-numbers
// Kry Genesis 1 uit die BSB-vertaling
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

### Kry 'n vereenvoudigde hoofstuk uit 'n vertaling

( [verwysing](../reference/translations/simplified.md#get-a-simplified-chapter-from-a-translation) )

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.simple.json`

Gebruik dit wanneer jy net die teks van 'n hoofstuk wil hê. Elke vers bevat 'n enkele `text` string in plaas van 'n lys van geformateerde inhoud, so jy hoef nie self die teks te bou nie.

::: code-tabs#taal

@tab JavaScript

```ts:no-line-numbers
// Kry die teks van Genesis 1 uit die BSB-vertaling
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

### Kry die lys van beskikbare kommentare

( [verwysing](../reference/commentaries/README.md#available-commentaries) )

::: code-tabs#taal

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

### Lys boeke in 'n kommentaar

( [verwysing](../reference/commentaries/README.md#list-books-in-a-commentary) )

::: code-tabs#taal

@tab JavaScript

```ts:no-line-numbers title="fetch-commentary-books.js"
const commentary = 'adam-clarke';

// Kry die lys van boeke vir die Adam-Clarke-kommentaar
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

### Kry 'n hoofstuk uit 'n kommentaar

( [verwysing](../reference/commentaries/README.md#get-a-chapter-from-a-commentary) )

::: code-tabs#taal

@tab JavaScript

```ts:no-line-numbers title="fetch-commentary-chapter.js"
const commentary = 'adam-clarke';
const book = 'GEN';
const chapter = 1;

// Kry Genesis 1 uit die Adam-Clarke-kommentaar
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

### Lys Profiele in 'n Kommentaar

( [verwysing](../reference/commentaries/README.md#list-profiles-in-a-commentary) )

::: code-tabs#taal

@tab JavaScript

```ts:no-line-numbers title="fetch-commentary-profiles.js"
const commentary = 'tyndale';

// Kry die lys van profiele vir die Tyndale-kommentaar
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

### Kry 'n Profiel in 'n Kommentaar

( [verwysing](../reference/commentaries/README.md#get-a-profile-in-a-commentary) )

::: code-tabs#taal

@tab JavaScript

```ts:no-line-numbers title="fetch-commentary-profile.js"
const commentary = 'tyndale';
const profile = 'aaron';

// Kry die Aaron-profiel van die Tyndale-kommentaar
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

### Kry die lys van beskikbare datastelle

( [verwysing](../reference/datasets/README.md#available-datasets) )

::: code-tabs#taal

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

### Kry die lys van boeke in 'n datastel

( [verwysing](../reference/datasets/README.md#list-books-in-a-dataset) )

::: code-tabs#taal

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-books.js"
const dataset = 'open-cross-ref';

// Kry die lys van boeke vir die oop-kruisverwysingsdatastel
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

### Kry 'n hoofstuk uit 'n datastel

( [verwysing](../reference/datasets/README.md#get-a-chapter-from-a-dataset) )

::: code-tabs#taal

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-chapter.js"
const dataset = 'open-cross-ref';
const book = 'GEN';
const chapter = 1;

// Kry Genesis 1 van die oop-kruisverwysingsdatastel
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
