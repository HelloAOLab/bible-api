---
description: 'ফ্রি ইউজ বাইবেল এপিআই-তে কীভাবে অনুরোধ পাঠাবেন: সাধারণ HTTP GET ব্যবহার করে অনুবাদ, বই, অধ্যায়, ভাষ্য এবং ডেটাসেট সংগ্রহ করুন।'
---

# অনুরোধ করা

এপিআই অ্যাক্সেস করার জন্য আপনাকে সঠিক এন্ডপয়েন্টে একটি HTTP GET রিকোয়েস্ট পাঠাতে হবে।

উদাহরণস্বরূপ, `available_translations.json` এন্ডপয়েন্টটি অ্যাক্সেস করতে, আপনি নিম্নলিখিত জাভাস্ক্রিপ্ট বা cURL কমান্ডটি ব্যবহার করতে পারেন:

::: code-tabs#lang

@ট্যাব জাভাস্ক্রিপ্ট

```ts:no-line-numbers
fetch(`https://bible.helloao.org/api/available_translations.json`)
    .then(request => request.json())
    .then(availableTranslations => {
        console.log('The API has the following translations:', availableTranslations);
    });
```

@ট্যাব cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/available_translations.json
```

:::

নীচে উদাহরণগুলির একটি তালিকা দেওয়া হল। আরও সম্পূর্ণ বিবরণের জন্য, [রেফারেন্স ডকুমেন্টেশন](../reference/README.md) দেখুন।

## উদাহরণ

### উপলব্ধ অনুবাদগুলির তালিকা পান

( [তথ্যসূত্র](../reference/translations/README.md#available-translations) )

`GET https://bible.helloao.org/api/available_translations.json`

::: code-tabs#lang

@ট্যাব জাভাস্ক্রিপ্ট

```ts:no-line-numbers
fetch(`https://bible.helloao.org/api/available_translations.json`)
    .then(request => request.json())
    .then(availableTranslations => {
        console.log('The API has the following translations:', availableTranslations);
    });
```

@ট্যাব cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/available_translations.json
```

:::

### অনুবাদে বইয়ের তালিকা

( [তথ্যসূত্র](../reference/translations/README.md#list-books-in-a-translation) )

`GET https://bible.helloao.org/api/{translation}/books.json`

::: code-tabs#lang

@ট্যাব জাভাস্ক্রিপ্ট

```ts:no-line-numbers
// BSB অনুবাদের বইগুলোর তালিকা নিন।
fetch(`https://bible.helloao.org/api/BSB/books.json`)
    .then(request => request.json())
    .then(books => {
        console.log('The BSB has the following books:', books);
    });
```

@ট্যাব cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/books.json
```

:::

### অনুবাদ থেকে একটি অধ্যায় নিন

( [তথ্যসূত্র](../reference/translations/standard.md#get-a-chapter-from-a-translation) )

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`

::: code-tabs#lang

@ট্যাব জাভাস্ক্রিপ্ট

```ts:no-line-numbers
// BSB অনুবাদ থেকে আদিপুস্তক ১ সংগ্রহ করুন।
fetch(`https://bible.helloao.org/api/BSB/GEN/1.json`)
    .then(request => request.json())
    .then(chapter => {
        console.log('Genesis 1 (BSB):', chapter);
    });
```

@ট্যাব cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/GEN/1.json
```

:::

### অনুবাদ থেকে একটি সরলীকৃত অধ্যায় পান

( [তথ্যসূত্র](../reference/translations/simplified.md#get-a-simplified-chapter-from-a-translation) )

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.simple.json`

যখন আপনি শুধু একটি অধ্যায়ের লেখা চান, তখন এটি ব্যবহার করুন। প্রতিটি পদে ফরম্যাট করা বিষয়বস্তুর তালিকার পরিবর্তে একটি একক `text` স্ট্রিং থাকে, তাই আপনাকে নিজে থেকে লেখাটি তৈরি করতে হবে না।

::: code-tabs#lang

@ট্যাব জাভাস্ক্রিপ্ট

```ts:no-line-numbers
// BSB অনুবাদ থেকে আদিপুস্তক ১-এর পাঠটি নিন।
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

@ট্যাব cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/GEN/1.simple.json
```

:::

### উপলব্ধ ভাষ্যগুলির তালিকা পান

( [তথ্যসূত্র](../reference/commentaries/README.md#available-commentaries) )

::: code-tabs#lang

@ট্যাব জাভাস্ক্রিপ্ট

```ts:no-line-numbers title="fetch-commentaries.js"
fetch(`https://bible.helloao.org/api/available_commentaries.json`)
    .then(request => request.json())
    .then(availableCommentaries => {
        console.log('The API has the following commentaries:', availableCommentaries);
    });
```

@ট্যাব cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/available_commentaries.json
```

:::

### ভাষ্যের বইগুলির তালিকা

( [তথ্যসূত্র](../reference/commentaries/README.md#list-books-in-a-commentary) )

::: code-tabs#lang

@ট্যাব জাভাস্ক্রিপ্ট

```ts:no-line-numbers title="fetch-commentary-books.js"
const commentary = 'adam-clarke';

// অ্যাডাম-ক্লার্ক ভাষ্যের বইগুলোর তালিকাটি নিন।
fetch(`https://bible.helloao.org/api/c/${commentary}/books.json`)
    .then(request => request.json())
    .then(books => {
        console.log('The adam-clarke commentary has the following books:', books);
    });
```

@ট্যাব cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/c/adam-clarke/books.json
```

:::

### একটি ভাষ্য থেকে একটি অধ্যায় নিন

( [তথ্যসূত্র](../reference/commentaries/README.md#get-a-chapter-from-a-commentary) )

::: code-tabs#lang

@ট্যাব জাভাস্ক্রিপ্ট

```ts:no-line-numbers title="fetch-commentary-chapter.js"
const commentary = 'adam-clarke';
const book = 'GEN';
const chapter = 1;

// অ্যাডাম-ক্লার্ক ভাষ্য থেকে জেনেসিস ১ সংগ্রহ করুন।
fetch(`https://bible.helloao.org/api/c/${commentary}/${book}/${chapter}.json`)
    .then(request => request.json())
    .then(chapter => {
        console.log('Genesis 1 (adam-clarke):', chapter);
    });
```

@ট্যাব cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/c/adam-clarke/GEN/1.json
```

:::

### একটি ভাষ্যে প্রোফাইলের তালিকা

( [তথ্যসূত্র](../reference/commentaries/README.md#list-profiles-in-a-commentary) )

::: code-tabs#lang

@ট্যাব জাভাস্ক্রিপ্ট

```ts:no-line-numbers title="fetch-commentary-profiles.js"
const commentary = 'tyndale';

// টাইন্ডেল ধারাভাষ্যের জন্য প্রোফাইলের তালিকাটি নিন।
fetch(`https://bible.helloao.org/api/c/${commentary}/profiles.json`)
    .then(request => request.json())
    .then(profiles => {
        console.log('The tyndale commentary has the following profiles:', profiles);
    });
```

@ট্যাব cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/c/tyndale/profiles.json
```

:::

### একটি ভাষ্যে নিজের প্রোফাইল পান

( [তথ্যসূত্র](../reference/commentaries/README.md#get-a-profile-in-a-commentary) )

::: code-tabs#lang

@ট্যাব জাভাস্ক্রিপ্ট

```ts:no-line-numbers title="fetch-commentary-profile.js"
const commentary = 'tyndale';
const profile = 'aaron';

// টিনডেল কমেন্টারি থেকে অ্যারনের প্রোফাইলটি নিন।
fetch(`https://bible.helloao.org/api/c/${commentary}/profiles/${profile}.json`)
    .then(request => request.json())
    .then(profile => {
        console.log('The Aaron tyndale commentary profile:', profile);
    });
```

@ট্যাব cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/c/tyndale/profiles/aaron.json
```

:::

### উপলব্ধ ডেটাসেটগুলির তালিকা পান

( [তথ্যসূত্র](../reference/datasets/README.md#available-datasets) )

::: code-tabs#lang

@ট্যাব জাভাস্ক্রিপ্ট

```ts:no-line-numbers title="fetch-datasets.js"
fetch(`https://bible.helloao.org/api/available_datasets.json`)
    .then(request => request.json())
    .then(availableDatasets => {
        console.log('The API has the following datasets:', availableDatasets);
    });
```

@ট্যাব cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/available_datasets.json
```

:::

### একটি ডেটাসেটে থাকা বইগুলির তালিকা পান

( [তথ্যসূত্র](../reference/datasets/README.md#list-books-in-a-dataset) )

::: code-tabs#lang

@ট্যাব জাভাস্ক্রিপ্ট

```ts:no-line-numbers title="fetch-dataset-books.js"
const dataset = 'open-cross-ref';

// ওপেন-ক্রস-রেফ ডেটাসেটের জন্য বইয়ের তালিকাটি পান।
fetch(`https://bible.helloao.org/api/d/${dataset}/books.json`)
    .then(request => request.json())
    .then(books => {
        console.log('The open-cross-ref dataset has the following books:', books);
    });
```

@ট্যাব cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/open-cross-ref/books.json
```

:::

### একটি ডেটাসেট থেকে একটি অধ্যায় পান

( [তথ্যসূত্র](../reference/datasets/README.md#get-a-chapter-from-a-dataset) )

::: code-tabs#lang

@ট্যাব জাভাস্ক্রিপ্ট

```ts:no-line-numbers title="fetch-dataset-chapter.js"
const dataset = 'open-cross-ref';
const book = 'GEN';
const chapter = 1;

// ওপেন-ক্রস-রেফ ডেটাসেট থেকে জেনেসিস ১ পান।
fetch(`https://bible.helloao.org/api/d/${dataset}/${book}/${chapter}.json`)
    .then(request => request.json())
    .then(chapter => {
        console.log('Genesis 1 (open-cross-ref):', chapter);
    });
```

@ট্যাব cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/open-cross-ref/GEN/1.json
```

:::
