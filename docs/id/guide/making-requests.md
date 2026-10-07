---
description: 'Cara membuat permintaan ke API Alkitab Gratis: mengambil terjemahan, buku, bab, komentar, dan kumpulan data melalui HTTP GET biasa.'
---

# Mengajukan Permintaan

Untuk mengakses API, Anda hanya perlu membuat Permintaan HTTP GET ke endpoint yang tepat.

Misalnya, untuk mengakses endpoint `available_translations.json` , Anda dapat menggunakan perintah JavaScript atau cURL berikut:

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

Di bawah ini, Anda dapat menemukan daftar contoh. Untuk dokumentasi yang lebih lengkap, lihat [Dokumentasi Referensi](../reference/README.md) .

## Contoh

### Dapatkan Daftar Terjemahan yang Tersedia

( [referensi](../reference/translations/README.md#available-translations) )

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

### Daftar Buku Terjemahan

( [referensi](../reference/translations/README.md#list-books-in-a-translation) )

`GET https://bible.helloao.org/api/{translation}/books.json`

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers
// Dapatkan daftar buku untuk terjemahan BSB.
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

### Dapatkan Satu Bab dari Terjemahan

( [referensi](../reference/translations/standard.md#get-a-chapter-from-a-translation) )

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers
// Dapatkan Kejadian 1 dari terjemahan BSB.
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

### Dapatkan Bab yang Disederhanakan dari Terjemahan

( [referensi](../reference/translations/simplified.md#get-a-simplified-chapter-from-a-translation) )

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.simple.json`

Gunakan ini jika Anda hanya menginginkan teks dari sebuah bab. Setiap ayat berisi satu string `text` , bukan daftar konten yang diformat, sehingga Anda tidak perlu membuat teks sendiri.

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers
// Dapatkan teks Kejadian 1 dari terjemahan BSB.
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

### Dapatkan Daftar Komentar yang Tersedia

( [referensi](../reference/commentaries/README.md#available-commentaries) )

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

### Daftar Buku dalam Sebuah Komentar

( [referensi](../reference/commentaries/README.md#list-books-in-a-commentary) )

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-commentary-books.js"
const commentary = 'adam-clarke';

// Dapatkan daftar buku untuk komentar Adam Clarke.
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

### Dapatkan Satu Bab dari Sebuah Komentar

( [referensi](../reference/commentaries/README.md#get-a-chapter-from-a-commentary) )

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-commentary-chapter.js"
const commentary = 'adam-clarke';
const book = 'GEN';
const chapter = 1;

// Dapatkan Kejadian 1 dari komentar Adam Clarke.
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

### Cantumkan Profil dalam Komentar

( [referensi](../reference/commentaries/README.md#list-profiles-in-a-commentary) )

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-commentary-profiles.js"
const commentary = 'tyndale';

// Dapatkan daftar profil untuk komentar Tyndale.
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

### Dapatkan Profil Anda di Bagian Komentar

( [referensi](../reference/commentaries/README.md#get-a-profile-in-a-commentary) )

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-commentary-profile.js"
const commentary = 'tyndale';
const profile = 'aaron';

// Dapatkan profil Aaron dari komentar Tyndale.
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

### Dapatkan daftar Kumpulan Data yang Tersedia

( [referensi](../reference/datasets/README.md#available-datasets) )

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

### Dapatkan daftar buku dalam sebuah dataset.

( [referensi](../reference/datasets/README.md#list-books-in-a-dataset) )

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-books.js"
const dataset = 'open-cross-ref';

// Dapatkan daftar buku untuk dataset open-cross-ref.
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

### Ambil Satu Bab dari Kumpulan Data

( [referensi](../reference/datasets/README.md#get-a-chapter-from-a-dataset) )

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-chapter.js"
const dataset = 'open-cross-ref';
const book = 'GEN';
const chapter = 1;

// Dapatkan Kejadian 1 dari dataset referensi silang terbuka.
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
