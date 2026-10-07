# OpenAPI

Die Free Use Bible API veröffentlicht ein [OpenAPI 3.1-](https://spec.openapis.org/oas/v3.1.0) Dokument, das jeden Endpunkt dieser Referenz sowie dessen Parameter und Antwortstrukturen beschreibt.

`GET https://bible.helloao.org/openapi.json`

Sie können dieses Dokument verwenden, um:

-   Generieren Sie eine Clientbibliothek für eine Sprache, für die wir kein [SDK](../sdks/README.md) haben.
-   Importieren Sie die API in Tools wie [Postman](https://www.postman.com/) , [Insomnia](https://insomnia.rest/) oder [Swagger UI](https://swagger.io/tools/swagger-ui/) , um die Endpunkte zu erkunden.
-   API-Antworten anhand der veröffentlichten Schemas validieren.

## Kundengewinnung

Zur Generierung eines Clients kann jeder OpenAPI-kompatible Codegenerator verwendet werden. Beispielsweise unterstützt [der OpenAPI Generator](https://openapi-generator.tech/) [Dutzende von Sprachen](https://openapi-generator.tech/docs/generators) :

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

Für TypeScript können Sie [`@hey-api/openapi-ts`](https://heyapi.dev/) verwenden:

```bash:no-line-numbers
npx @hey-api/openapi-ts \
    -i https://bible.helloao.org/openapi.json \
    -o ./src/client
```

::: tip
Wenn Sie JavaScript oder TypeScript verwenden, müssen Sie wahrscheinlich keinen eigenen Client generieren. Schauen Sie sich stattdessen das [JavaScript/TypeScript SDK](../sdks/javascript.md) an.
:::

## Betrieb

Jeder Endpunkt im OpenAPI-Dokument hat eine `operationId` , die von den meisten Generatoren als Methodenname im generierten Client verwendet wird. Zum Beispiel:

| Vorgangs-ID                 | Endpunkt                                   |
| --------------------------- | ------------------------------------------ |
| `getAvailableTranslations`  | `/api/available_translations.json`         |
| `getTranslationBooks`       | `/api/{translation}/books.json`            |
| `getTranslationBookChapter` | `/api/{translation}/{book}/{chapter}.json` |
| `getAvailableCommentaries`  | `/api/available_commentaries.json`         |
| `getAvailableDatasets`      | `/api/available_datasets.json`             |

Die vollständige Liste der Operationen finden Sie im [OpenAPI-Dokument](https://bible.helloao.org/openapi.json) .
