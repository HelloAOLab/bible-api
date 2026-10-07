# I-OpenAPI

I-Free Use Bible API ishicilela idokhumenti [ye-OpenAPI 3.1](https://spec.openapis.org/oas/v3.1.0) echaza yonke indawo yokugcina kulesi sithenjwa, kanye namapharamitha ayo kanye nezakhiwo zokuphendula.

`GET https://bible.helloao.org/openapi.json`

Ungasebenzisa le dokhumenti ukuze:

-   Dala umtapo wolwazi weklayenti wolimi esingenalo i [-SDK](../sdks/README.md) yalo.
-   Ngenisa i-API kumathuluzi afana ne [-Postman](https://www.postman.com/) , [Insomnia](https://insomnia.rest/) , noma [i-Swagger UI](https://swagger.io/tools/swagger-ui/) ukuze uhlole ama-endpoints.
-   Qinisekisa izimpendulo ze-API ngokumelene nama-schema ashicilelwe.

## Ukudala Iklayenti

Noma yimuphi umkhiqizi wekhodi ohambisana ne-OpenAPI ungasetshenziswa ukukhiqiza iklayenti. Isibonelo, [i-OpenAPI Generator](https://openapi-generator.tech/) isekela [izilimi eziningi](https://openapi-generator.tech/docs/generators) :

```bash:no-line-numbers
# I-Python
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

Ku-TypeScript, ungasebenzisa [`@hey-api/openapi-ts`](https://heyapi.dev/) :

```bash:no-line-numbers
npx @hey-api/openapi-ts \
    -i https://bible.helloao.org/openapi.json \
    -o ./src/client
```

::: tip
Uma usebenzisa i-JavaScript noma i-TypeScript, cishe awudingi ukukhiqiza iklayenti lakho. Bheka i [-JavaScript/TypeScript SDK](../sdks/javascript.md) esikhundleni salokho.
:::

## Imisebenzi

Iphuzu ngalinye lokugcina kudokhumenti ye-OpenAPI line- `operationId` , iningi labakhiqizi eliyisebenzisa njengegama lendlela kuklayenti elikhiqizwe. Isibonelo:

| I-ID Yokusebenza            | Iphuzu Lokugcina                           |
| --------------------------- | ------------------------------------------ |
| `getAvailableTranslations`  | `/api/available_translations.json`         |
| `getTranslationBooks`       | `/api/{translation}/books.json`            |
| `getTranslationBookChapter` | `/api/{translation}/{book}/{chapter}.json` |
| `getAvailableCommentaries`  | `/api/available_commentaries.json`         |
| `getAvailableDatasets`      | `/api/available_datasets.json`             |

Bheka [idokhumenti ye-OpenAPI](https://bible.helloao.org/openapi.json) ukuze uthole uhlu oluphelele lwemisebenzi.
