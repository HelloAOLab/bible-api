---
description: 'Indlela yokwenza izicelo ku-Free Use Bible API: landa izinguqulo, izincwadi, izahluko, amazwana, kanye namasethi edatha nge-HTTP GET ecacile.'
---

# Ukwenza Izicelo

Ukuze ufinyelele i-API, okudingeka ukwenze nje ukwenza isicelo se-HTTP GET endaweni efanele.

Isibonelo, ukuze ufinyelele iphuzu lokugcina `available_translations.json` , ungasebenzisa umyalo olandelayo we-JavaScript noma we-cURL:

::: code-tabs#lang

@tab I-JavaScript

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

Ngezansi, ungathola uhlu lwezibonelo. Ukuze uthole imibhalo ephelele, bheka i- [Reference Documentation](../reference/README.md) .

## Izibonelo

### Thola Uhlu Lokuhumusha Okutholakalayo

( [inkomba](../reference/translations/README.md#available-translations) )

`GET https://bible.helloao.org/api/available_translations.json`

::: code-tabs#lang

@tab I-JavaScript

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

### Bhala Izincwadi Ezihunyushweni

( [inkomba](../reference/translations/README.md#list-books-in-a-translation) )

`GET https://bible.helloao.org/api/{translation}/books.json`

::: code-tabs#lang

@tab I-JavaScript

```ts:no-line-numbers
// Thola uhlu lwezincwadi zokuhumusha i-BSB
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

### Thola Isahluko Esihunyushweni

( [inkomba](../reference/translations/standard.md#get-a-chapter-from-a-translation) )

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`

::: code-tabs#lang

@tab I-JavaScript

```ts:no-line-numbers
// Thola uGenesise 1 enguqulweni ye-BSB
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

### Thola Isahluko Esenziwe Lula Enguqulweni

( [inkomba](../reference/translations/simplified.md#get-a-simplified-chapter-from-a-translation) )

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.simple.json`

Sebenzisa lokhu uma ufuna umbhalo wesahluko kuphela. Ivesi ngalinye liqukethe umucu owodwa ongu `text` esikhundleni sohlu lokuqukethwe okufomethiwe, ngakho akudingeki ukuthi uzakhele umbhalo ngokwakho.

::: code-tabs#lang

@tab I-JavaScript

```ts:no-line-numbers
// Thola umbhalo kaGenesise 1 enguqulweni ye-BSB
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

### Thola Uhlu Lwamazwana Atholakalayo

( [inkomba](../reference/commentaries/README.md#available-commentaries) )

::: code-tabs#lang

@tab I-JavaScript

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

### Bhala Izincwadi Kumazwana

( [inkomba](../reference/commentaries/README.md#list-books-in-a-commentary) )

::: code-tabs#lang

@tab I-JavaScript

```ts:no-line-numbers title="fetch-commentary-books.js"
const commentary = 'adam-clarke';

// Thola uhlu lwezincwadi zokuphawula kuka-adam-clarke
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

### Thola Isahluko Kumazwana

( [inkomba](../reference/commentaries/README.md#get-a-chapter-from-a-commentary) )

::: code-tabs#lang

@tab I-JavaScript

```ts:no-line-numbers title="fetch-commentary-chapter.js"
const commentary = 'adam-clarke';
const book = 'GEN';
const chapter = 1;

// Thola uGenesise 1 kumazwana ka-adam-clarke
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

### Bhala Amaphrofayili Kumazwana

( [inkomba](../reference/commentaries/README.md#list-profiles-in-a-commentary) )

::: code-tabs#lang

@tab I-JavaScript

```ts:no-line-numbers title="fetch-commentary-profiles.js"
const commentary = 'tyndale';

// Thola uhlu lwamaphrofayili okuphawula kukaTyndale
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

### Thola Iphrofayili Kumazwana

( [inkomba](../reference/commentaries/README.md#get-a-profile-in-a-commentary) )

::: code-tabs#lang

@tab I-JavaScript

```ts:no-line-numbers title="fetch-commentary-profile.js"
const commentary = 'tyndale';
const profile = 'aaron';

// Thola iphrofayela ka-aaron kumazwana ka-tyndale
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

### Thola uhlu lwamasethi edatha atholakalayo

( [inkomba](../reference/datasets/README.md#available-datasets) )

::: code-tabs#lang

@tab I-JavaScript

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

### Thola uhlu lwezincwadi kusethi yedatha

( [inkomba](../reference/datasets/README.md#list-books-in-a-dataset) )

::: code-tabs#lang

@tab I-JavaScript

```ts:no-line-numbers title="fetch-dataset-books.js"
const dataset = 'open-cross-ref';

// Thola uhlu lwezincwadi zedatha ye-open-cross-ref
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

### Thola Isahluko ku-Dataset

( [inkomba](../reference/datasets/README.md#get-a-chapter-from-a-dataset) )

::: code-tabs#lang

@tab I-JavaScript

```ts:no-line-numbers title="fetch-dataset-chapter.js"
const dataset = 'open-cross-ref';
const book = 'GEN';
const chapter = 1;

// Thola uGenesise 1 kusethi yedatha ye-open-cross-ref
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
