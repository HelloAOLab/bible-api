# OpenAPI

Die Free Use Bible API publiseer 'n [OpenAPI 3.1-](https://spec.openapis.org/oas/v3.1.0) dokument wat elke eindpunt in hierdie verwysing beskryf, tesame met sy parameters en reaksiestrukture.

`GET https://bible.helloao.org/openapi.json`

Jy kan hierdie dokument gebruik om:

-   Genereer 'n kliëntbiblioteek vir 'n taal waarvoor ons nie 'n [SDK](../sdks/README.md) het nie.
-   Voer die API in gereedskap soos [Postman](https://www.postman.com/) , [Insomnia](https://insomnia.rest/) of [Swagger UI](https://swagger.io/tools/swagger-ui/) in om die eindpunte te verken.
-   Valideer API-antwoorde teen die gepubliseerde skemas.

## Genereer 'n kliënt

Enige OpenAPI-versoenbare kodegenerator kan gebruik word om 'n kliënt te genereer. [OpenAPI Generator](https://openapi-generator.tech/) ondersteun byvoorbeeld [dosyne tale](https://openapi-generator.tech/docs/generators) :

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

Vir TypeScript kan jy [`@hey-api/openapi-ts`](https://heyapi.dev/) gebruik:

```bash:no-line-numbers
npx @hey-api/openapi-ts \
    -i https://bible.helloao.org/openapi.json \
    -o ./src/client
```

::: tip
As jy JavaScript of TypeScript gebruik, hoef jy waarskynlik nie jou eie kliënt te genereer nie. Kyk eerder na die [JavaScript/TypeScript SDK](../sdks/javascript.md) .
:::

## Bedrywighede

Elke eindpunt in die OpenAPI-dokument het 'n `operationId` , wat die meeste kragopwekkers as die metodenaam in die gegenereerde kliënt gebruik. Byvoorbeeld:

| Operasie-ID                 | Eindpunt                                   |
| --------------------------- | ------------------------------------------ |
| `getAvailableTranslations`  | `/api/available_translations.json`         |
| `getTranslationBooks`       | `/api/{translation}/books.json`            |
| `getTranslationBookChapter` | `/api/{translation}/{book}/{chapter}.json` |
| `getAvailableCommentaries`  | `/api/available_commentaries.json`         |
| `getAvailableDatasets`      | `/api/available_datasets.json`             |

Sien die [OpenAPI-dokument](https://bible.helloao.org/openapi.json) vir die volledige lys van bewerkings.
