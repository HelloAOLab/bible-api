# OpenAPI

В рамках проекта Free Use Bible API опубликован документ [OpenAPI 3.1](https://spec.openapis.org/oas/v3.1.0) , описывающий каждую конечную точку в этом справочнике, а также ее параметры и структуры ответов.

`GET https://bible.helloao.org/openapi.json`

Этот документ можно использовать для:

-   Создайте клиентскую библиотеку для языка, для которого у нас нет [SDK](../sdks/README.md) .
-   Импортируйте API в такие инструменты, как [Postman](https://www.postman.com/) , [Insomnia](https://insomnia.rest/) или [Swagger UI](https://swagger.io/tools/swagger-ui/) , чтобы изучить конечные точки.
-   Проверьте ответы API на соответствие опубликованным схемам.

## Привлечение клиента

Для генерации клиента можно использовать любой генератор кода, совместимый с OpenAPI. Например, [OpenAPI Generator](https://openapi-generator.tech/) поддерживает [десятки языков](https://openapi-generator.tech/docs/generators) :

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

Для TypeScript можно использовать [`@hey-api/openapi-ts`](https://heyapi.dev/) :

```bash:no-line-numbers
npx @hey-api/openapi-ts \
    -i https://bible.helloao.org/openapi.json \
    -o ./src/client
```

::: tip
Если вы используете JavaScript или TypeScript, вам, вероятно, не нужно создавать собственный клиент. Вместо этого воспользуйтесь [SDK для JavaScript/TypeScript](../sdks/javascript.md) .
:::

## Операции

В документе OpenAPI каждая конечная точка имеет значение `operationId` , которое большинство генераторов используют в качестве имени метода в сгенерированном клиенте. Например:

| Идентификатор операции      | Конечная точка                             |
| --------------------------- | ------------------------------------------ |
| `getAvailableTranslations`  | `/api/available_translations.json`         |
| `getTranslationBooks`       | `/api/{translation}/books.json`            |
| `getTranslationBookChapter` | `/api/{translation}/{book}/{chapter}.json` |
| `getAvailableCommentaries`  | `/api/available_commentaries.json`         |
| `getAvailableDatasets`      | `/api/available_datasets.json`             |

Полный список операций см. [в документе OpenAPI](https://bible.helloao.org/openapi.json) .
