# OpenAPI

API Alkitab untuk Penggunaan Gratis menerbitkan dokumen [OpenAPI 3.1](https://spec.openapis.org/oas/v3.1.0) yang menjelaskan setiap endpoint dalam referensi ini, beserta parameter dan struktur responsnya.

`GET https://bible.helloao.org/openapi.json`

Anda dapat menggunakan dokumen ini untuk:

-   Buat pustaka klien untuk bahasa yang belum kami miliki [SDK-](../sdks/README.md) nya.
-   Impor API ke dalam alat seperti [Postman](https://www.postman.com/) , [Insomnia](https://insomnia.rest/) , atau [Swagger UI](https://swagger.io/tools/swagger-ui/) untuk menjelajahi endpoint-nya.
-   Validasi respons API terhadap skema yang telah dipublikasikan.

## Menghasilkan Klien

Generator kode apa pun yang kompatibel dengan OpenAPI dapat digunakan untuk menghasilkan klien. Misalnya, [OpenAPI Generator](https://openapi-generator.tech/) mendukung [puluhan bahasa](https://openapi-generator.tech/docs/generators) :

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

Untuk TypeScript, Anda dapat menggunakan [`@hey-api/openapi-ts`](https://heyapi.dev/) :

```bash:no-line-numbers
npx @hey-api/openapi-ts \
    -i https://bible.helloao.org/openapi.json \
    -o ./src/client
```

::: tip
Jika Anda menggunakan JavaScript atau TypeScript, Anda mungkin tidak perlu membuat klien sendiri. Sebaiknya gunakan [SDK JavaScript/TypeScript](../sdks/javascript.md) .
:::

## Operasi

Setiap endpoint dalam dokumen OpenAPI memiliki angka `operationId` , yang sebagian besar generator gunakan sebagai nama metode dalam klien yang dihasilkan. Misalnya:

| ID Operasi                  | Titik akhir                                |
| --------------------------- | ------------------------------------------ |
| `getAvailableTranslations`  | `/api/available_translations.json`         |
| `getTranslationBooks`       | `/api/{translation}/books.json`            |
| `getTranslationBookChapter` | `/api/{translation}/{book}/{chapter}.json` |
| `getAvailableCommentaries`  | `/api/available_commentaries.json`         |
| `getAvailableDatasets`      | `/api/available_datasets.json`             |

Lihat [dokumen OpenAPI](https://bible.helloao.org/openapi.json) untuk daftar operasi lengkap.
