# OpenAPI

《免费使用圣经 API》发布了一份[OpenAPI 3.1](https://spec.openapis.org/oas/v3.1.0)文档，其中描述了本参考资料中的每个端点及其参数和响应结构。

`GET https://bible.helloao.org/openapi.json`

您可以使用此文档执行以下操作：

-   为我们没有[SDK](../sdks/README.md)的语言生成客户端库。
-   将 API 导入[Postman](https://www.postman.com/) 、 [Insomnia](https://insomnia.rest/)或[Swagger UI](https://swagger.io/tools/swagger-ui/)等工具，以探索端点。
-   根据已发布的模式验证 API 响应。

## 开发客户

任何兼容 OpenAPI 的代码生成器都可以用来生成客户端。例如， [OpenAPI Generator](https://openapi-generator.tech/)支持[数十种语言](https://openapi-generator.tech/docs/generators)：

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

对于 TypeScript，您可以使用[`@hey-api/openapi-ts`](https://heyapi.dev/) ：

```bash:no-line-numbers
npx @hey-api/openapi-ts \
    -i https://bible.helloao.org/openapi.json \
    -o ./src/client
```

::: tip
如果您使用的是 JavaScript 或 TypeScript，则可能不需要自行生成客户端。您可以直接使用[JavaScript/TypeScript SDK](../sdks/javascript.md) 。
:::

## 运营

OpenAPI 文档中的每个端点都有一个`operationId` ，大多数生成器会将其用作生成的客户端中的方法名称。例如：

| 操作 ID                     | 端点                                       |
| --------------------------- | ------------------------------------------ |
| `getAvailableTranslations`  | `/api/available_translations.json`         |
| `getTranslationBooks`       | `/api/{translation}/books.json`            |
| `getTranslationBookChapter` | `/api/{translation}/{book}/{chapter}.json` |
| `getAvailableCommentaries`  | `/api/available_commentaries.json`         |
| `getAvailableDatasets`      | `/api/available_datasets.json`             |

有关操作的完整列表，请参阅[OpenAPI 文档](https://bible.helloao.org/openapi.json)。
