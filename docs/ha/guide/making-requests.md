---
description: 'Yadda ake yin buƙatu zuwa ga API ɗin Littafi Mai Tsarki na Kyauta: samo fassarori, littattafai, surori, sharhi, da bayanai akan HTTP GET mai sauƙi.'
---

# Yin Buƙatu

Don samun damar shiga API ɗin, abin da kawai za ku yi shi ne yin buƙatar HTTP GET zuwa ƙarshen dama.

Misali, don samun damar zuwa ƙarshen `available_translations.json` , zaku iya amfani da umarnin JavaScript ko cURL mai zuwa:

::: code-tabs#lang

@shafin JavaScript

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

A ƙasa, za ku iya samun jerin misalai. Don ƙarin cikakkun takardu, duba [Takardun Shaida](../reference/README.md) .

## Misalai

### Nemo Jerin Fassarorin da ake da su

( [nassoshi](../reference/translations/README.md#available-translations) )

`GET https://bible.helloao.org/api/available_translations.json`

::: code-tabs#lang

@shafin JavaScript

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

### Jera Littattafai a Fassara

( [nassoshi](../reference/translations/README.md#list-books-in-a-translation) )

`GET https://bible.helloao.org/api/{translation}/books.json`

::: code-tabs#lang

@shafin JavaScript

```ts:no-line-numbers
// Nemi jerin littattafan fassarar BSB
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

### Sami Babi daga Fassara

( [nassoshi](../reference/translations/standard.md#get-a-chapter-from-a-translation) )

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`

::: code-tabs#lang

@shafin JavaScript

```ts:no-line-numbers
// Samu Farawa 1 daga fassarar BSB
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

### Sami Babi Mai Sauƙi daga Fassara

( [nassoshi](../reference/translations/simplified.md#get-a-simplified-chapter-from-a-translation) )

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.simple.json`

Yi amfani da wannan lokacin da kawai kake son rubutun babi. Kowace baiti tana ɗauke da igiya ɗaya tilo mai lamba `text` maimakon jerin abubuwan da aka tsara, don haka ba lallai ne ka gina rubutun da kanka ba.

::: code-tabs#lang

@shafin JavaScript

```ts:no-line-numbers
// Samo rubutun Farawa 1 daga fassarar BSB
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

### Nemo Jerin Sharhin da ake da su

( [nassoshi](../reference/commentaries/README.md#available-commentaries) )

::: code-tabs#lang

@shafin JavaScript

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

### Jera Littattafai a cikin Sharhi

( [nassoshi](../reference/commentaries/README.md#list-books-in-a-commentary) )

::: code-tabs#lang

@shafin JavaScript

```ts:no-line-numbers title="fetch-commentary-books.js"
const commentary = 'adam-clarke';

// Nemi jerin littattafan da za a iya amfani da su don sharhin adam-clarke
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

### Sami Babi daga Sharhi

( [nassoshi](../reference/commentaries/README.md#get-a-chapter-from-a-commentary) )

::: code-tabs#lang

@shafin JavaScript

```ts:no-line-numbers title="fetch-commentary-chapter.js"
const commentary = 'adam-clarke';
const book = 'GEN';
const chapter = 1;

// Samu Farawa 1 daga sharhin adam-clarke
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

### Jera Bayanan martaba a cikin Sharhi

( [nassoshi](../reference/commentaries/README.md#list-profiles-in-a-commentary) )

::: code-tabs#lang

@shafin JavaScript

```ts:no-line-numbers title="fetch-commentary-profiles.js"
const commentary = 'tyndale';

// Nemi jerin bayanan martaba don sharhin tyndale
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

### Nemi Bayanin Sirri a cikin Sharhi

( [nassoshi](../reference/commentaries/README.md#get-a-profile-in-a-commentary) )

::: code-tabs#lang

@shafin JavaScript

```ts:no-line-numbers title="fetch-commentary-profile.js"
const commentary = 'tyndale';
const profile = 'aaron';

// Sami bayanin aaron daga sharhin tyndale
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

### Nemo jerin Set ɗin Bayanan da ake da su

( [nassoshi](../reference/datasets/README.md#available-datasets) )

::: code-tabs#lang

@shafin JavaScript

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

### Nemo jerin littattafai a cikin bayanai

( [nassoshi](../reference/datasets/README.md#list-books-in-a-dataset) )

::: code-tabs#lang

@shafin JavaScript

```ts:no-line-numbers title="fetch-dataset-books.js"
const dataset = 'open-cross-ref';

// Nemi jerin littattafai don bayanan da aka buɗe
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

### Sami Babi daga Tsarin Bayanai

( [nassoshi](../reference/datasets/README.md#get-a-chapter-from-a-dataset) )

::: code-tabs#lang

@shafin JavaScript

```ts:no-line-numbers title="fetch-dataset-chapter.js"
const dataset = 'open-cross-ref';
const book = 'GEN';
const chapter = 1;

// Sami Farawa 1 daga bayanan da aka buɗe na bayanin martaba
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
