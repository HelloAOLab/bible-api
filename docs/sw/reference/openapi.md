# OpenAPI

API ya Biblia ya Matumizi ya Bure huchapisha hati [ya OpenAPI 3.1](https://spec.openapis.org/oas/v3.1.0) inayoelezea kila sehemu ya mwisho katika marejeleo haya, pamoja na vigezo vyake na miundo ya majibu.

`GET https://bible.helloao.org/openapi.json`

Unaweza kutumia hati hii kwa:

-   Tengeneza maktaba ya mteja kwa lugha ambayo hatuna [SDK](../sdks/README.md) yake.
-   Ingiza API kwenye zana kama vile [Postman](https://www.postman.com/) , [Insomnia](https://insomnia.rest/) , au [Swagger UI](https://swagger.io/tools/swagger-ui/) ili kuchunguza sehemu za mwisho.
-   Thibitisha majibu ya API dhidi ya mipango iliyochapishwa.

## Kutengeneza Mteja

Jenereta yoyote ya msimbo inayooana na OpenAPI inaweza kutumika kutengeneza mteja. Kwa mfano, [Jenereta ya OpenAPI](https://openapi-generator.tech/) inasaidia [lugha nyingi](https://openapi-generator.tech/docs/generators) :

```bash:no-line-numbers
# Chatu
npx @openapitools/openapi-generator-cli generate \
    -i https://bible.helloao.org/openapi.json \
    -g python \
    -o ./free-use-bible-api-python

# C#
npx @openapitools/openapi-generator-cli generate \
    -i https://bible.helloao.org/openapi.json \
    -g csharp \
    -o ./free-use-bible-api-csharp
```

Kwa TypeScript, unaweza kutumia [`@hey-api/openapi-ts`](https://heyapi.dev/) :

```bash:no-line-numbers
npx @hey-api/openapi-ts \
    -i https://bible.helloao.org/openapi.json \
    -o ./src/client
```

::: tip
Ikiwa unatumia JavaScript au TypeScript, huenda huhitaji kutengeneza mteja wako mwenyewe. Badala yake angalia [SDK ya JavaScript/TypeScript](../sdks/javascript.md) .
:::

## Operesheni

Kila sehemu ya mwisho katika hati ya OpenAPI ina `operationId` , ambayo jenereta nyingi hutumia kama jina la mbinu katika mteja aliyezalishwa. Kwa mfano:

| Kitambulisho cha Uendeshaji | Sehemu ya Mwisho                           |
| --------------------------- | ------------------------------------------ |
| `getAvailableTranslations`  | `/api/available_translations.json`         |
| `getTranslationBooks`       | `/api/{translation}/books.json`            |
| `getTranslationBookChapter` | `/api/{translation}/{book}/{chapter}.json` |
| `getAvailableCommentaries`  | `/api/available_commentaries.json`         |
| `getAvailableDatasets`      | `/api/available_datasets.json`             |

Tazama [hati ya OpenAPI](https://bible.helloao.org/openapi.json) kwa orodha kamili ya shughuli.
