# OpenAPI

The Free Use Bible API publishes an [OpenAPI 3.1](https://spec.openapis.org/oas/v3.1.0) document that describes every endpoint in this reference, along with its parameters and response structures.

`GET https://bible.helloao.org/openapi.json`

You can use this document to:

-   Generate a client library for a language that we don't have an [SDK](../sdks/README.md) for.
-   Import the API into tools like [Postman](https://www.postman.com/), [Insomnia](https://insomnia.rest/), or [Swagger UI](https://swagger.io/tools/swagger-ui/) to explore the endpoints.
-   Validate API responses against the published schemas.

## Generating a Client

Any OpenAPI-compatible code generator can be used to generate a client. For example, [OpenAPI Generator](https://openapi-generator.tech/) supports [dozens of languages](https://openapi-generator.tech/docs/generators):

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

For TypeScript, you can use [`@hey-api/openapi-ts`](https://heyapi.dev/):

```bash:no-line-numbers
npx @hey-api/openapi-ts \
    -i https://bible.helloao.org/openapi.json \
    -o ./src/client
```

::: tip
If you are using JavaScript or TypeScript, you probably don't need to generate your own client. Check out the [JavaScript/TypeScript SDK](../sdks/javascript.md) instead.
:::

## Operations

Each endpoint in the OpenAPI document has an `operationId`, which most generators use as the method name in the generated client. For example:

| Operation ID                | Endpoint                                   |
| --------------------------- | ------------------------------------------ |
| `getAvailableTranslations`  | `/api/available_translations.json`         |
| `getTranslationBooks`       | `/api/{translation}/books.json`            |
| `getTranslationBookChapter` | `/api/{translation}/{book}/{chapter}.json` |
| `getAvailableCommentaries`  | `/api/available_commentaries.json`         |
| `getAvailableDatasets`      | `/api/available_datasets.json`             |

See the [OpenAPI document](https://bible.helloao.org/openapi.json) for the complete list of operations.
