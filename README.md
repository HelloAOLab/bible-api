# Free Use Bible API

**A free JSON Bible API with over 1000 Bible translations in 700+ languages.** No API keys, no rate limits, and no copyright restrictions — for personal, open source, or commercial use.

[![npm](https://img.shields.io/npm/v/free-use-bible-api?label=free-use-bible-api)](https://www.npmjs.com/package/free-use-bible-api)
[![npm](https://img.shields.io/npm/v/@helloao/cli?label=%40helloao%2Fcli)](https://www.npmjs.com/package/@helloao/cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

📖 **[Documentation](https://bible.helloao.org/docs/guide/)** · **[API Reference](https://bible.helloao.org/docs/reference/)** · **[SDKs](https://bible.helloao.org/docs/sdks/)**

## Quick Start

No signup, no key — just make an HTTP GET request:

```bash
curl https://bible.helloao.org/api/BSB/GEN/1.json
```

Or use the JavaScript/TypeScript client:

```bash
npm install free-use-bible-api
```

```ts
import { FreeUseBibleApi } from 'free-use-bible-api';

const api = new FreeUseBibleApi();

const available = await api.getAvailableTranslations();
console.log('Total translations:', available.translations.length);

const chapter = await api.getTranslationBookChapter('BSB', 'GEN', 1);
console.log('Verses in Genesis 1:', chapter.numberOfVerses);
```

## Features

### The Bible in JSON

Access over 1000 Bible translations in an easy-to-use JSON format that also includes basic formatting information and additions like footnotes.

### Globally Accessible

Hosted on the AWS network, the API is available anywhere in the world at low latencies.

### Free

No usage limits, no API Keys required, and no copyright restrictions whatsoever (including for modification or commercial uses). We only ask that if you change the content of a translation be sure to call it a different name to avoid confusion.

## What's Available

| Resource         | Endpoint                                    | Description                                                        |
| ---------------- | ------------------------------------------- | ------------------------------------------------------------------ |
| **Translations** | `/api/{translation}/{book}/{chapter}.json`  | Over 1000 Bible translations in more than 700 languages            |
| **Commentaries** | `/api/c/{commentary}/{book}/{chapter}.json` | Public domain Bible commentaries, including Tyndale Open Resources |
| **Datasets**     | `/api/d/{dataset}/{book}/{chapter}.json`    | Supplementary data such as cross references                        |

See the [API Reference](https://bible.helloao.org/docs/reference/) for every endpoint and its response types.

## Downloads

Prefer to work offline? The whole API is available in bulk:

- [api.zip](https://bible.helloao.org/api.zip) (1.5 GB) — the entire API as static JSON files
- [bible.db](https://bible.helloao.org/bible.db) (11 GB) — every translation as a SQLite database
- [bible.eng.db](https://bible.helloao.org/bible.eng.db) (1.5 GB) — English translations only

## Packages

| Package                                                                  | Description                                                   |
| ------------------------------------------------------------------------ | ------------------------------------------------------------- |
| [`free-use-bible-api`](https://www.npmjs.com/package/free-use-bible-api) | JavaScript/TypeScript client for the API                      |
| [`@helloao/cli`](https://www.npmjs.com/package/@helloao/cli)             | CLI for generating and hosting your own Free Use Bible API    |
| [`@helloao/tools`](https://www.npmjs.com/package/@helloao/tools)         | Parsers and generators for USFM, USX, and Codex Bible formats |

## Our Inspiration

**"Freely you have received; freely give." - Matthew 10:8**

We believe the Bible should be freely available to everyone. Read more about
[a biblical model for licensing the Bible](https://bible.helloao.org/docs/guide/a-biblical-model-for-licensing-the-bible.html).

## Get Started

See [https://bible.helloao.org/docs/guide/](https://bible.helloao.org/docs/guide/) for instructions on using and accessing the API.

## License

The API and this source code are available under the [MIT license](./LICENSE). The Berean Standard Bible and Majority Bible texts are [dedicated to the public domain](https://creativecommons.org/publicdomain/zero/1.0/).

## About Us

[Made by AO Lab with ❤️](https://helloao.org/)
