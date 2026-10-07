# API ouverte

L'API Free Use Bible publie un document [OpenAPI 3.1](https://spec.openapis.org/oas/v3.1.0) qui décrit chaque point de terminaison de cette référence, ainsi que ses paramètres et ses structures de réponse.

`GET https://bible.helloao.org/openapi.json`

Vous pouvez utiliser ce document pour :

-   Générer une bibliothèque cliente pour un langage pour lequel nous ne disposons pas de [SDK](../sdks/README.md) .
-   Importez l'API dans des outils comme [Postman](https://www.postman.com/) , [Insomnia](https://insomnia.rest/) ou [Swagger UI](https://swagger.io/tools/swagger-ui/) pour explorer les points de terminaison.
-   Validez les réponses de l'API par rapport aux schémas publiés.

## Générer un client

N'importe quel générateur de code compatible OpenAPI peut être utilisé pour générer un client. Par exemple, [OpenAPI Generator](https://openapi-generator.tech/) prend en charge [des dizaines de langages](https://openapi-generator.tech/docs/generators) :

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

Pour TypeScript, vous pouvez utiliser [`@hey-api/openapi-ts`](https://heyapi.dev/) :

```bash:no-line-numbers
npx @hey-api/openapi-ts \
    -i https://bible.helloao.org/openapi.json \
    -o ./src/client
```

::: tip
Si vous utilisez JavaScript ou TypeScript, vous n'avez probablement pas besoin de générer votre propre client. Consultez plutôt le [SDK JavaScript/TypeScript](../sdks/javascript.md) .
:::

## Opérations

Chaque point de terminaison du document OpenAPI possède un `operationId` , que la plupart des générateurs utilisent comme nom de méthode dans le client généré. Par exemple :

| ID d'opération              | Point de terminaison                       |
| --------------------------- | ------------------------------------------ |
| `getAvailableTranslations`  | `/api/available_translations.json`         |
| `getTranslationBooks`       | `/api/{translation}/books.json`            |
| `getTranslationBookChapter` | `/api/{translation}/{book}/{chapter}.json` |
| `getAvailableCommentaries`  | `/api/available_commentaries.json`         |
| `getAvailableDatasets`      | `/api/available_datasets.json`             |

Consultez la [documentation OpenAPI](https://bible.helloao.org/openapi.json) pour obtenir la liste complète des opérations.
