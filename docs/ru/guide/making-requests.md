---
description: 'Как отправлять запросы к API свободного использования Библии: получать переводы, книги, главы, комментарии и наборы данных по обычному HTTP GET-запросу.'
---

# Отправка запросов

Для доступа к API достаточно отправить HTTP GET-запрос к нужной конечной точке.

Например, для доступа к конечной точке `available_translations.json` можно использовать следующую команду JavaScript или cURL:

::: code-tabs#язык

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

Ниже приведен список примеров. Более подробную информацию см. в разделе [«Справочная документация»](../reference/README.md) .

## Примеры

### Получить список доступных переводов

( [ссылка](../reference/translations/README.md#available-translations) )

`GET https://bible.helloao.org/api/available_translations.json`

::: code-tabs#язык

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

### Список книг в переводе

( [ссылка](../reference/translations/README.md#list-books-in-a-translation) )

`GET https://bible.helloao.org/api/{translation}/books.json`

::: code-tabs#язык

@tab JavaScript

```ts:no-line-numbers
// Получите список книг для перевода BSB.
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

### Получить главу из перевода

( [ссылка](../reference/translations/standard.md#get-a-chapter-from-a-translation) )

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`

::: code-tabs#язык

@tab JavaScript

```ts:no-line-numbers
// Получите первую главу Книги Бытия из перевода BSB.
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

### Получите упрощенную главу из перевода.

( [ссылка](../reference/translations/simplified.md#get-a-simplified-chapter-from-a-translation) )

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.simple.json`

Используйте это, если вам нужен только текст главы. Каждый стих содержит одну строку с `text` значением вместо списка отформатированного содержимого, поэтому вам не нужно самостоятельно формировать текст.

::: code-tabs#язык

@tab JavaScript

```ts:no-line-numbers
// Получите текст первой главы Книги Бытия из перевода BSB.
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

### Получить список доступных комментариев

( [ссылка](../reference/commentaries/README.md#available-commentaries) )

::: code-tabs#язык

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

### Список книг в комментарии

( [ссылка](../reference/commentaries/README.md#list-books-in-a-commentary) )

::: code-tabs#язык

@tab JavaScript

```ts:no-line-numbers title="fetch-commentary-books.js"
const commentary = 'adam-clarke';

// Получите список книг для комментария Адама-Кларка.
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

### Получить главу из комментария

( [ссылка](../reference/commentaries/README.md#get-a-chapter-from-a-commentary) )

::: code-tabs#язык

@tab JavaScript

```ts:no-line-numbers title="fetch-commentary-chapter.js"
const commentary = 'adam-clarke';
const book = 'GEN';
const chapter = 1;

// Возьмите первую главу Книги Бытия из комментария Адама Кларка.
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

### Список биографий в комментарии

( [ссылка](../reference/commentaries/README.md#list-profiles-in-a-commentary) )

::: code-tabs#язык

@tab JavaScript

```ts:no-line-numbers title="fetch-commentary-profiles.js"
const commentary = 'tyndale';

// Получите список авторов комментариев к произведениям Тиндаля.
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

### Получите профиль в комментарии

( [ссылка](../reference/commentaries/README.md#get-a-profile-in-a-commentary) )

::: code-tabs#язык

@tab JavaScript

```ts:no-line-numbers title="fetch-commentary-profile.js"
const commentary = 'tyndale';
const profile = 'aaron';

// Ознакомьтесь с биографией Аарона Тиндаля в комментариях Тиндаля.
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

### Получить список доступных наборов данных

( [ссылка](../reference/datasets/README.md#available-datasets) )

::: code-tabs#язык

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

### Получить список книг в наборе данных

( [ссылка](../reference/datasets/README.md#list-books-in-a-dataset) )

::: code-tabs#язык

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-books.js"
const dataset = 'open-cross-ref';

// Получите список книг для набора данных Open Cross-Ref.
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

### Извлечь главу из набора данных

( [ссылка](../reference/datasets/README.md#get-a-chapter-from-a-dataset) )

::: code-tabs#язык

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-chapter.js"
const dataset = 'open-cross-ref';
const book = 'GEN';
const chapter = 1;

// Получите первую главу Книги Бытия из набора данных open-cross-ref.
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
