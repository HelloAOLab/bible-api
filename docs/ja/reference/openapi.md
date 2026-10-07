# OpenAPI

Free Use Bible APIは、このリファレンスに記載されているすべてのエンドポイント、およびそのパラメータとレスポンス構造を説明する[OpenAPI 3.1](https://spec.openapis.org/oas/v3.1.0)ドキュメントを公開しています。

`GET https://bible.helloao.org/openapi.json`

この文書は以下の目的で使用できます。

-   [SDKが](../sdks/README.md)提供されていない言語用のクライアントライブラリを生成します。
-   APIを[Postman](https://www.postman.com/) 、 [Insomnia](https://insomnia.rest/) 、 [Swagger UI](https://swagger.io/tools/swagger-ui/)などのツールにインポートして、エンドポイントを調べてください。
-   APIレスポンスを公開されているスキーマと照合して検証する。

## クライアントの生成

OpenAPI互換のコードジェネレーターであればどれでもクライアントの生成に使用できます。例えば、 [OpenAPI Generatorは](https://openapi-generator.tech/)[数十種類の言語](https://openapi-generator.tech/docs/generators)をサポートしています。

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

TypeScript の場合は、 [`@hey-api/openapi-ts`](https://heyapi.dev/)使用できます。

```bash:no-line-numbers
npx @hey-api/openapi-ts \
    -i https://bible.helloao.org/openapi.json \
    -o ./src/client
```

::: tip
JavaScriptまたはTypeScriptを使用している場合は、独自のクライアントを生成する必要はないでしょう。代わりに[JavaScript/TypeScript SDKを](../sdks/javascript.md)ご利用ください。
:::

## 業務

OpenAPIドキュメントの各エンドポイントには`operationId`が割り当てられており、ほとんどのジェネレーターはこれを生成されたクライアントのメソッド名として使用します。例：

| オペレーションID            | 終点                                       |
| --------------------------- | ------------------------------------------ |
| `getAvailableTranslations`  | `/api/available_translations.json`         |
| `getTranslationBooks`       | `/api/{translation}/books.json`            |
| `getTranslationBookChapter` | `/api/{translation}/{book}/{chapter}.json` |
| `getAvailableCommentaries`  | `/api/available_commentaries.json`         |
| `getAvailableDatasets`      | `/api/available_datasets.json`             |

操作の完全なリストについては、 [OpenAPIドキュメント](https://bible.helloao.org/openapi.json)を参照してください。
