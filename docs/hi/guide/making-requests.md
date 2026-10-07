---
description: 'फ्री यूज़ बाइबल एपीआई से अनुरोध कैसे करें: सामान्य HTTP GET अनुरोध के माध्यम से अनुवाद, पुस्तकें, अध्याय, टीकाएँ और डेटासेट प्राप्त करें।'
---

# अनुरोध करना

एपीआई तक पहुंचने के लिए, आपको बस सही एंडपॉइंट पर एक HTTP GET अनुरोध करना होगा।

उदाहरण के लिए, `available_translations.json` एंडपॉइंट तक पहुंचने के लिए, आप निम्नलिखित जावास्क्रिप्ट या cURL कमांड का उपयोग कर सकते हैं:

::: code-tabs#भाषा

@tab जावास्क्रिप्ट

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

नीचे आपको उदाहरणों की एक सूची मिलेगी। अधिक विस्तृत जानकारी के लिए, [संदर्भ दस्तावेज़](../reference/README.md) देखें।

## उदाहरण

### उपलब्ध अनुवादों की सूची प्राप्त करें

( [संदर्भ](../reference/translations/README.md#available-translations) )

`GET https://bible.helloao.org/api/available_translations.json`

::: code-tabs#भाषा

@tab जावास्क्रिप्ट

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

### अनुवाद में पुस्तकों की सूची

( [संदर्भ](../reference/translations/README.md#list-books-in-a-translation) )

`GET https://bible.helloao.org/api/{translation}/books.json`

::: code-tabs#भाषा

@tab जावास्क्रिप्ट

```ts:no-line-numbers
// बीएसबी अनुवाद के लिए पुस्तकों की सूची प्राप्त करें
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

### अनुवाद से एक अध्याय प्राप्त करें

( [संदर्भ](../reference/translations/standard.md#get-a-chapter-from-a-translation) )

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`

::: code-tabs#भाषा

@tab जावास्क्रिप्ट

```ts:no-line-numbers
// उत्पत्ति 1 को बीएसबी अनुवाद से प्राप्त करें
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

### अनुवाद से सरलीकृत अध्याय प्राप्त करें

( [संदर्भ](../reference/translations/simplified.md#get-a-simplified-chapter-from-a-translation) )

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.simple.json`

इसका उपयोग तब करें जब आपको केवल किसी अध्याय का पाठ चाहिए हो। प्रत्येक श्लोक में स्वरूपित सामग्री की सूची के बजाय एक एकल `text` स्ट्रिंग होती है, इसलिए आपको पाठ स्वयं बनाने की आवश्यकता नहीं है।

::: code-tabs#भाषा

@tab जावास्क्रिप्ट

```ts:no-line-numbers
// उत्पत्ति अध्याय 1 का पाठ बीएसबी अनुवाद से प्राप्त करें।
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

### उपलब्ध टीकाओं की सूची प्राप्त करें

( [संदर्भ](../reference/commentaries/README.md#available-commentaries) )

::: code-tabs#भाषा

@tab जावास्क्रिप्ट

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

### टीका में पुस्तकों की सूची

( [संदर्भ](../reference/commentaries/README.md#list-books-in-a-commentary) )

::: code-tabs#भाषा

@tab जावास्क्रिप्ट

```ts:no-line-numbers title="fetch-commentary-books.js"
const commentary = 'adam-clarke';

// एडम क्लार्क की टिप्पणी के लिए पुस्तकों की सूची प्राप्त करें
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

### टीका से एक अध्याय प्राप्त करें

( [संदर्भ](../reference/commentaries/README.md#get-a-chapter-from-a-commentary) )

::: code-tabs#भाषा

@tab जावास्क्रिप्ट

```ts:no-line-numbers title="fetch-commentary-chapter.js"
const commentary = 'adam-clarke';
const book = 'GEN';
const chapter = 1;

// एडम-क्लार्क की टीका से उत्पत्ति 1 प्राप्त करें
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

### किसी टिप्पणी में प्रोफाइलों की सूची बनाएं

( [संदर्भ](../reference/commentaries/README.md#list-profiles-in-a-commentary) )

::: code-tabs#भाषा

@tab जावास्क्रिप्ट

```ts:no-line-numbers title="fetch-commentary-profiles.js"
const commentary = 'tyndale';

// टिंडेल कमेंट्री के लिए प्रोफाइलों की सूची प्राप्त करें
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

### किसी टिप्पणी में प्रोफ़ाइल प्राप्त करें

( [संदर्भ](../reference/commentaries/README.md#get-a-profile-in-a-commentary) )

::: code-tabs#भाषा

@tab जावास्क्रिप्ट

```ts:no-line-numbers title="fetch-commentary-profile.js"
const commentary = 'tyndale';
const profile = 'aaron';

// टिंडेल कमेंट्री से आरोन की प्रोफाइल प्राप्त करें
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

### उपलब्ध डेटासेट की सूची प्राप्त करें

( [संदर्भ](../reference/datasets/README.md#available-datasets) )

::: code-tabs#भाषा

@tab जावास्क्रिप्ट

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

### किसी डेटासेट में मौजूद पुस्तकों की सूची प्राप्त करें

( [संदर्भ](../reference/datasets/README.md#list-books-in-a-dataset) )

::: code-tabs#भाषा

@tab जावास्क्रिप्ट

```ts:no-line-numbers title="fetch-dataset-books.js"
const dataset = 'open-cross-ref';

// ओपन-क्रॉस-रेफ़ डेटासेट के लिए पुस्तकों की सूची प्राप्त करें
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

### डेटासेट से एक अध्याय प्राप्त करें

( [संदर्भ](../reference/datasets/README.md#get-a-chapter-from-a-dataset) )

::: code-tabs#भाषा

@tab जावास्क्रिप्ट

```ts:no-line-numbers title="fetch-dataset-chapter.js"
const dataset = 'open-cross-ref';
const book = 'GEN';
const chapter = 1;

// ओपन-क्रॉस-रेफ़ डेटासेट से जेनेसिस 1 प्राप्त करें
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
