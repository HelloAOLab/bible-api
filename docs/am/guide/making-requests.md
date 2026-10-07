---
description: 'ለነፃ አጠቃቀም የመጽሐፍ ቅዱስ ኤፒአይ ጥያቄዎችን እንዴት ማቅረብ እንደሚቻል፡ ትርጉሞችን፣ መጻሕፍትን፣ ምዕራፎችን፣ ሐተታዎችን እና የውሂብ ስብስቦችን በ HTTP GET ላይ ያግኙ።'
---

# ጥያቄዎችን ማቅረብ

ኤፒአይን ለመድረስ፣ ማድረግ ያለብዎት የኤችቲቲፒ GET ጥያቄን ወደ ትክክለኛው የመጨረሻ ነጥብ ማስገባት ብቻ ነው።

ለምሳሌ፣ የ `available_translations.json` የመጨረሻ ነጥብ ለመድረስ የሚከተለውን የጃቫስክሪፕት ወይም የcURL ትዕዛዝ መጠቀም ይችላሉ

::: code-tabs#ቋንቋ

@tab ጃቫስክሪፕት

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

ከታች የምሳሌዎች ዝርዝር ማግኘት ይችላሉ። ለተጨማሪ የተሟላ ሰነድ [የማጣቀሻ ሰነዱን](../reference/README.md) ይመልከቱ።

## ምሳሌዎች

### የሚገኙ ትርጉሞችን ዝርዝር ያግኙ

( [ማጣቀሻ](../reference/translations/README.md#available-translations) )

`GET https://bible.helloao.org/api/available_translations.json`

::: code-tabs#ቋንቋ

@tab ጃቫስክሪፕት

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

### በትርጉም ውስጥ መጽሐፍትን ዘርዝር

( [ማጣቀሻ](../reference/translations/README.md#list-books-in-a-translation) )

`GET https://bible.helloao.org/api/{translation}/books.json`

::: code-tabs#ቋንቋ

@tab ጃቫስክሪፕት

```ts:no-line-numbers
// የቢኤስቢ ትርጉም የመጽሐፍት ዝርዝር ያግኙ
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

### ከትርጉም አንድ ምዕራፍ ያግኙ

( [ማጣቀሻ](../reference/translations/standard.md#get-a-chapter-from-a-translation) )

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`

::: code-tabs#ቋንቋ

@tab ጃቫስክሪፕት

```ts:no-line-numbers
// ዘፍጥረት 1ን ከቢኤስቢ ትርጉም ያግኙ
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

### ከትርጉም ቀለል ያለ ምዕራፍ ያግኙ

( [ማጣቀሻ](../reference/translations/simplified.md#get-a-simplified-chapter-from-a-translation) )

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.simple.json`

የአንድ ምዕራፍ ጽሑፍ ብቻ ሲፈልጉ ይህንን ይጠቀሙ። እያንዳንዱ ጥቅስ የተቀረጸ ይዘት ዝርዝር ሳይሆን አንድ ነጠላ `text` ሕብረቁምፊ ይዟል፣ ስለዚህ ጽሑፉን እራስዎ መገንባት የለብዎትም።

::: code-tabs#ቋንቋ

@tab ጃቫስክሪፕት

```ts:no-line-numbers
// የዘፍጥረት 1ን ጽሑፍ ከቢኤስቢ ትርጉም ያግኙ
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

### የሚገኙ የአስተያየቶችን ዝርዝር ያግኙ

( [ማጣቀሻ](../reference/commentaries/README.md#available-commentaries) )

::: code-tabs#ቋንቋ

@tab ጃቫስክሪፕት

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

### መጽሐፍትን በአስተያየት ውስጥ ዘርዝር

( [ማጣቀሻ](../reference/commentaries/README.md#list-books-in-a-commentary) )

::: code-tabs#ቋንቋ

@tab ጃቫስክሪፕት

```ts:no-line-numbers title="fetch-commentary-books.js"
const commentary = 'adam-clarke';

// ለአዳም-ክላርክ አስተያየት የሚሆኑ የመጽሐፍት ዝርዝር ያግኙ
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

### ከአስተያየት አንድ ምዕራፍ ያግኙ

( [ማጣቀሻ](../reference/commentaries/README.md#get-a-chapter-from-a-commentary) )

::: code-tabs#ቋንቋ

@tab ጃቫስክሪፕት

```ts:no-line-numbers title="fetch-commentary-chapter.js"
const commentary = 'adam-clarke';
const book = 'GEN';
const chapter = 1;

// ዘፍጥረት 1ን ከአዳም-ክላርክ ሐተታ ያግኙ
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

### መገለጫዎችን በአስተያየት ውስጥ ዘርዝር

( [ማጣቀሻ](../reference/commentaries/README.md#list-profiles-in-a-commentary) )

::: code-tabs#ቋንቋ

@tab ጃቫስክሪፕት

```ts:no-line-numbers title="fetch-commentary-profiles.js"
const commentary = 'tyndale';

// የቲንዴል አስተያየት የመገለጫዎችን ዝርዝር ያግኙ
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

### በአስተያየት ውስጥ መገለጫ ያግኙ

( [ማጣቀሻ](../reference/commentaries/README.md#get-a-profile-in-a-commentary) )

::: code-tabs#ቋንቋ

@tab ጃቫስክሪፕት

```ts:no-line-numbers title="fetch-commentary-profile.js"
const commentary = 'tyndale';
const profile = 'aaron';

// የአሮንን መገለጫ ከቲንዴል አስተያየት ያግኙ
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

### የሚገኙ የውሂብ ስብስቦችን ዝርዝር ያግኙ

( [ማጣቀሻ](../reference/datasets/README.md#available-datasets) )

::: code-tabs#ቋንቋ

@tab ጃቫስክሪፕት

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

### የመጽሐፍት ዝርዝርን በውሂብ ስብስብ ውስጥ ያግኙ

( [ማጣቀሻ](../reference/datasets/README.md#list-books-in-a-dataset) )

::: code-tabs#ቋንቋ

@tab ጃቫስክሪፕት

```ts:no-line-numbers title="fetch-dataset-books.js"
const dataset = 'open-cross-ref';

// ለክፍት-መስቀል-ማጣቀሻ የውሂብ ስብስብ የመጽሐፍት ዝርዝር ያግኙ
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

### ከውሂብ ስብስብ አንድ ምዕራፍ ያግኙ

( [ማጣቀሻ](../reference/datasets/README.md#get-a-chapter-from-a-dataset) )

::: code-tabs#ቋንቋ

@tab ጃቫስክሪፕት

```ts:no-line-numbers title="fetch-dataset-chapter.js"
const dataset = 'open-cross-ref';
const book = 'GEN';
const chapter = 1;

// ዘፍጥረት 1ን ከክፍት-መስቀል-ማጣቀሻ የውሂብ ስብስብ ያግኙ
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
