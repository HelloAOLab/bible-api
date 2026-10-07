---
description: 'مفت استعمال بائبل API سے درخواستیں کیسے کریں: سادہ HTTP GET پر ترجمے، کتابیں، ابواب، تبصرے، اور ڈیٹا سیٹس حاصل کریں۔'
---

# درخواستیں کرنا

API تک رسائی حاصل کرنے کے لیے، آپ کو صرف صحیح اختتامی نقطہ پر HTTP GET درخواست کرنے کی ضرورت ہے۔

مثال کے طور پر، `available_translations.json` اینڈ پوائنٹ تک رسائی حاصل کرنے کے لیے، آپ درج ذیل JavaScript یا cURL کمانڈ استعمال کر سکتے ہیں:

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

ذیل میں آپ کو مثالوں کی فہرست مل سکتی ہے۔ مزید مکمل دستاویزات کے لیے، [حوالہ دستاویزات](../reference/README.md) دیکھیں۔

## مثالیں

### دستیاب تراجم کی فہرست حاصل کریں۔

( [حوالہ](../reference/translations/README.md#available-translations) )

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

### ترجمہ میں کتابوں کی فہرست بنائیں

( [حوالہ](../reference/translations/README.md#list-books-in-a-translation) )

`GET https://bible.helloao.org/api/{translation}/books.json`

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers
// بی ایس بی ترجمہ کے لیے کتابوں کی فہرست حاصل کریں۔
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

### ترجمہ سے ایک باب حاصل کریں۔

( [حوالہ](../reference/translations/standard.md#get-a-chapter-from-a-translation) )

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers
// BSB ترجمہ سے پیدائش 1 حاصل کریں۔
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

### ترجمہ سے ایک آسان باب حاصل کریں۔

( [حوالہ](../reference/translations/simplified.md#get-a-simplified-chapter-from-a-translation) )

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.simple.json`

جب آپ صرف ایک باب کا متن چاہتے ہو تو اسے استعمال کریں۔ ہر آیت میں فارمیٹ شدہ مواد کی فہرست کے بجائے ایک واحد `text` سٹرنگ ہوتا ہے، لہذا آپ کو خود سے متن بنانے کی ضرورت نہیں ہے۔

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers
// BSB ترجمہ سے پیدائش 1 کا متن حاصل کریں۔
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

### دستیاب تبصروں کی فہرست حاصل کریں۔

( [حوالہ](../reference/commentaries/README.md#available-commentaries) )

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

### ایک تفسیر میں کتابوں کی فہرست بنائیں

( [حوالہ](../reference/commentaries/README.md#list-books-in-a-commentary) )

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-commentary-books.js"
const commentary = 'adam-clarke';

// ایڈم کلارک کی تفسیر کے لیے کتابوں کی فہرست حاصل کریں۔
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

### تفسیر سے ایک باب حاصل کریں۔

( [حوالہ](../reference/commentaries/README.md#get-a-chapter-from-a-commentary) )

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-commentary-chapter.js"
const commentary = 'adam-clarke';
const book = 'GEN';
const chapter = 1;

// آدم کلارک کی تفسیر سے پیدائش 1 حاصل کریں۔
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

### کمنٹری میں پروفائلز کی فہرست بنائیں

( [حوالہ](../reference/commentaries/README.md#list-profiles-in-a-commentary) )

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-commentary-profiles.js"
const commentary = 'tyndale';

// ٹنڈیل کمنٹری کے لیے پروفائلز کی فہرست حاصل کریں۔
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

### کمنٹری میں پروفائل حاصل کریں۔

( [حوالہ](../reference/commentaries/README.md#get-a-profile-in-a-commentary) )

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-commentary-profile.js"
const commentary = 'tyndale';
const profile = 'aaron';

// ٹنڈیل کمنٹری سے آرون پروفائل حاصل کریں۔
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

### دستیاب ڈیٹا سیٹس کی فہرست حاصل کریں۔

( [حوالہ](../reference/datasets/README.md#available-datasets) )

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

### ڈیٹا سیٹ میں کتابوں کی فہرست حاصل کریں۔

( [حوالہ](../reference/datasets/README.md#list-books-in-a-dataset) )

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-books.js"
const dataset = 'open-cross-ref';

// اوپن کراس ریف ڈیٹاسیٹ کے لیے کتابوں کی فہرست حاصل کریں۔
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

### ڈیٹا سیٹ سے ایک باب حاصل کریں۔

( [حوالہ](../reference/datasets/README.md#get-a-chapter-from-a-dataset) )

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-chapter.js"
const dataset = 'open-cross-ref';
const book = 'GEN';
const chapter = 1;

// اوپن کراس ریف ڈیٹاسیٹ سے جینیسس 1 حاصل کریں۔
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
