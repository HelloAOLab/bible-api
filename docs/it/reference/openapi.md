# API aperta

L'API Free Use Bible pubblica un documento [OpenAPI 3.1](https://spec.openapis.org/oas/v3.1.0) che descrive ogni endpoint presente in questo riferimento, insieme ai relativi parametri e alle strutture di risposta.

`GET https://bible.helloao.org/openapi.json`

È possibile utilizzare questo documento per:

-   Genera una libreria client per un linguaggio per il quale non disponiamo di un [SDK](../sdks/README.md) .
-   Importa l'API in strumenti come [Postman](https://www.postman.com/) , [Insomnia](https://insomnia.rest/) o [Swagger UI](https://swagger.io/tools/swagger-ui/) per esplorare gli endpoint.
-   Convalidare le risposte API rispetto agli schemi pubblicati.

## Generazione di un client

Qualsiasi generatore di codice compatibile con OpenAPI può essere utilizzato per generare un client. Ad esempio, [OpenAPI Generator](https://openapi-generator.tech/) supporta [decine di linguaggi](https://openapi-generator.tech/docs/generators) :

```bash:no-line-numbers
# Pitone
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

Per TypeScript, puoi usare [`@hey-api/openapi-ts`](https://heyapi.dev/) :

```bash:no-line-numbers
npx @hey-api/openapi-ts \
    -i https://bible.helloao.org/openapi.json \
    -o ./src/client
```

::: tip
Se utilizzi JavaScript o TypeScript, probabilmente non hai bisogno di generare il tuo client. Dai un'occhiata [all'SDK JavaScript/TypeScript](../sdks/javascript.md) .
:::

## Operazioni

Ogni endpoint nel documento OpenAPI ha uno `operationId` , che la maggior parte dei generatori usa come nome del metodo nel client generato. Ad esempio:

| ID operazione               | Punto finale                               |
| --------------------------- | ------------------------------------------ |
| `getAvailableTranslations`  | `/api/available_translations.json`         |
| `getTranslationBooks`       | `/api/{translation}/books.json`            |
| `getTranslationBookChapter` | `/api/{translation}/{book}/{chapter}.json` |
| `getAvailableCommentaries`  | `/api/available_commentaries.json`         |
| `getAvailableDatasets`      | `/api/available_datasets.json`             |

Per l'elenco completo delle operazioni, consultare la [documentazione OpenAPI](https://bible.helloao.org/openapi.json) .
