# اوپن اے پی آئی

The Free Use Bible API ایک [OpenAPI 3.1](https://spec.openapis.org/oas/v3.1.0) دستاویز شائع کرتا ہے جو اس حوالہ کے ہر اختتامی نقطہ کو اس کے پیرامیٹرز اور ردعمل کے ڈھانچے کے ساتھ بیان کرتا ہے۔

`GET https://bible.helloao.org/openapi.json`

آپ اس دستاویز کو استعمال کر سکتے ہیں:

-   ایک ایسی زبان کے لیے کلائنٹ لائبریری بنائیں جس کے لیے ہمارے پاس [SDK](../sdks/README.md) نہیں ہے۔
-   پوائنٹس کو دریافت کرنے کے لیے API کو [پوسٹ مین](https://www.postman.com/) ، [اندرا](https://insomnia.rest/) ، یا [سویگر UI](https://swagger.io/tools/swagger-ui/) جیسے ٹولز میں درآمد کریں۔
-   شائع شدہ اسکیموں کے خلاف API کے جوابات کی توثیق کریں۔

## ایک کلائنٹ پیدا کرنا

کوئی بھی OpenAPI سے مطابقت رکھنے والا کوڈ جنریٹر کلائنٹ بنانے کے لیے استعمال کیا جا سکتا ہے۔ مثال کے طور پر، [OpenAPI جنریٹر](https://openapi-generator.tech/) [درجنوں زبانوں کو](https://openapi-generator.tech/docs/generators) سپورٹ کرتا ہے:

```bash:no-line-numbers
# ازگر
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

TypeScript کے لیے، آپ [`@hey-api/openapi-ts`](https://heyapi.dev/) استعمال کر سکتے ہیں:

```bash:no-line-numbers
npx @hey-api/openapi-ts \
    -i https://bible.helloao.org/openapi.json \
    -o ./src/client
```

::: tip
اگر آپ JavaScript یا TypeScript استعمال کر رہے ہیں، تو شاید آپ کو اپنا کلائنٹ بنانے کی ضرورت نہیں ہے۔ اس کے بجائے [JavaScript/TypeScript SDK](../sdks/javascript.md) چیک کریں۔
:::

## آپریشنز

OpenAPI دستاویز میں ہر اختتامی نقطہ کا `operationId` ہوتا ہے، جسے زیادہ تر جنریٹر تیار کردہ کلائنٹ میں طریقہ کے نام کے طور پر استعمال کرتے ہیں۔ مثال کے طور پر:

| آپریشن ID                   | اختتامی نقطہ                               |
| --------------------------- | ------------------------------------------ |
| `getAvailableTranslations`  | `/api/available_translations.json`         |
| `getTranslationBooks`       | `/api/{translation}/books.json`            |
| `getTranslationBookChapter` | `/api/{translation}/{book}/{chapter}.json` |
| `getAvailableCommentaries`  | `/api/available_commentaries.json`         |
| `getAvailableDatasets`      | `/api/available_datasets.json`             |

آپریشنز کی مکمل فہرست کے لیے [OpenAPI دستاویز](https://bible.helloao.org/openapi.json) دیکھیں۔
