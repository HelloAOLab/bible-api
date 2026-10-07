# OpenAPI

La API de la Biblia de Uso Libre publica un documento [OpenAPI 3.1](https://spec.openapis.org/oas/v3.1.0) que describe cada punto final de esta referencia, junto con sus parámetros y estructuras de respuesta.

`GET https://bible.helloao.org/openapi.json`

Puedes utilizar este documento para:

-   Generar una biblioteca cliente para un lenguaje para el que no disponemos de un [SDK](../sdks/README.md) .
-   Importa la API en herramientas como [Postman](https://www.postman.com/) , [Insomnia](https://insomnia.rest/) o [Swagger UI](https://swagger.io/tools/swagger-ui/) para explorar los puntos finales.
-   Validar las respuestas de la API con respecto a los esquemas publicados.

## Generación de un cliente

Cualquier generador de código compatible con OpenAPI puede utilizarse para generar un cliente. Por ejemplo, [OpenAPI Generator](https://openapi-generator.tech/) admite [docenas de lenguajes](https://openapi-generator.tech/docs/generators) :

```bash:no-line-numbers
# Pitón
npx @openapitools/openapi-generator-cli generate \
    -i https://bible.helloao.org/openapi.json \
    -g python \
    -o ./free-use-bible-api-python

# DO#
npx @openapitools/openapi-generator-cli generate \
    -i https://bible.helloao.org/openapi.json \
    -g csharp \
    -o ./free-use-bible-api-csharp
```

Para TypeScript, puedes usar [`@hey-api/openapi-ts`](https://heyapi.dev/) :

```bash:no-line-numbers
npx @hey-api/openapi-ts \
    -i https://bible.helloao.org/openapi.json \
    -o ./src/client
```

::: tip
Si utilizas JavaScript o TypeScript, probablemente no necesites generar tu propio cliente. En su lugar, consulta el [SDK de JavaScript/TypeScript](../sdks/javascript.md) .
:::

## Operaciones

Cada punto final en el documento OpenAPI tiene un `operationId` , que la mayoría de los generadores utilizan como nombre del método en el cliente generado. Por ejemplo:

| ID de operación             | Punto final                                |
| --------------------------- | ------------------------------------------ |
| `getAvailableTranslations`  | `/api/available_translations.json`         |
| `getTranslationBooks`       | `/api/{translation}/books.json`            |
| `getTranslationBookChapter` | `/api/{translation}/{book}/{chapter}.json` |
| `getAvailableCommentaries`  | `/api/available_commentaries.json`         |
| `getAvailableDatasets`      | `/api/available_datasets.json`             |

Consulte el [documento de OpenAPI](https://bible.helloao.org/openapi.json) para obtener la lista completa de operaciones.
