# Buɗe API

API ɗin Littafi Mai Tsarki na Kyauta yana buga takardar [OpenAPI 3.1](https://spec.openapis.org/oas/v3.1.0) wadda ke bayyana kowane ƙarshen wannan nassin, tare da sigoginsa da tsarin amsawarsa.

`GET https://bible.helloao.org/openapi.json`

Zaka iya amfani da wannan doka don:

-   Samar da ɗakin karatu na abokin ciniki don harshen da ba mu da [SDK](../sdks/README.md) a kai.
-   Shigo da API ɗin zuwa kayan aiki kamar [Postman](https://www.postman.com/) , [Insomnia](https://insomnia.rest/) , ko [Swagger UI](https://swagger.io/tools/swagger-ui/) don bincika ƙarshen.
-   Tabbatar da martanin API akan tsare-tsaren da aka buga.

## Samar da Abokin Ciniki

Ana iya amfani da duk wani mai samar da lambar da ya dace da OpenAPI don samar da abokin ciniki. Misali, [OpenAPI Generator](https://openapi-generator.tech/) yana goyan bayan [harsuna da dama](https://openapi-generator.tech/docs/generators) :

```bash:no-line-numbers
# Python
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

Don amfani da TypeScript, zaka iya amfani da [`@hey-api/openapi-ts`](https://heyapi.dev/) :

```bash:no-line-numbers
npx @hey-api/openapi-ts \
    -i https://bible.helloao.org/openapi.json \
    -o ./src/client
```

::: tip
Idan kana amfani da JavaScript ko TypeScript, wataƙila ba kwa buƙatar ƙirƙirar abokin cinikinka na kanka. Duba [JavaScript/TypeScript SDK](../sdks/javascript.md) maimakon haka.
:::

## Ayyuka

Kowace ƙarshen da ke cikin takardar OpenAPI tana da `operationId` , wanda yawancin janareto ke amfani da shi azaman sunan hanyar a cikin abokin ciniki da aka samar. Misali:

| ID na aiki                  | ƙarshen wuri                               |
| --------------------------- | ------------------------------------------ |
| `getAvailableTranslations`  | `/api/available_translations.json`         |
| `getTranslationBooks`       | `/api/{translation}/books.json`            |
| `getTranslationBookChapter` | `/api/{translation}/{book}/{chapter}.json` |
| `getAvailableCommentaries`  | `/api/available_commentaries.json`         |
| `getAvailableDatasets`      | `/api/available_datasets.json`             |

Duba [takardar OpenAPI](https://bible.helloao.org/openapi.json) don cikakken jerin ayyukan.
