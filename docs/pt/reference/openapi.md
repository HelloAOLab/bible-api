# OpenAPI

A API Free Use Bible publica um documento [OpenAPI 3.1](https://spec.openapis.org/oas/v3.1.0) que descreve cada endpoint nesta referência, juntamente com seus parâmetros e estruturas de resposta.

`GET https://bible.helloao.org/openapi.json`

Você pode usar este documento para:

-   Gere uma biblioteca cliente para uma linguagem para a qual não temos um [SDK](../sdks/README.md) .
-   Importe a API para ferramentas como [Postman](https://www.postman.com/) , [Insomnia](https://insomnia.rest/) ou [Swagger UI](https://swagger.io/tools/swagger-ui/) para explorar os endpoints.
-   Validar as respostas da API em relação aos esquemas publicados.

## Gerando um Cliente

Qualquer gerador de código compatível com OpenAPI pode ser usado para gerar um cliente. Por exemplo, [o OpenAPI Generator](https://openapi-generator.tech/) oferece suporte [a dezenas de linguagens](https://openapi-generator.tech/docs/generators) :

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

Para TypeScript, você pode usar [`@hey-api/openapi-ts`](https://heyapi.dev/) :

```bash:no-line-numbers
npx @hey-api/openapi-ts \
    -i https://bible.helloao.org/openapi.json \
    -o ./src/client
```

::: tip
Se você estiver usando JavaScript ou TypeScript, provavelmente não precisa gerar seu próprio cliente. Em vez disso, confira o [SDK de JavaScript/TypeScript](../sdks/javascript.md) .
:::

## Operações

Cada endpoint no documento OpenAPI possui um `operationId` , que a maioria dos geradores utiliza como nome do método no cliente gerado. Por exemplo:

| ID da operação              | Ponto final                                |
| --------------------------- | ------------------------------------------ |
| `getAvailableTranslations`  | `/api/available_translations.json`         |
| `getTranslationBooks`       | `/api/{translation}/books.json`            |
| `getTranslationBookChapter` | `/api/{translation}/{book}/{chapter}.json` |
| `getAvailableCommentaries`  | `/api/available_commentaries.json`         |
| `getAvailableDatasets`      | `/api/available_datasets.json`             |

Consulte o [documento OpenAPI](https://bible.helloao.org/openapi.json) para obter a lista completa de operações.
