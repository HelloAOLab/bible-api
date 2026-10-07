# OpenAPI

تنشر واجهة برمجة تطبيقات الكتاب المقدس للاستخدام المجاني وثيقة [OpenAPI 3.1](https://spec.openapis.org/oas/v3.1.0) التي تصف كل نقطة نهاية في هذا المرجع، إلى جانب معلماتها وهياكل الاستجابة الخاصة بها.

`GET https://bible.helloao.org/openapi.json`

يمكنك استخدام هذه الوثيقة من أجل:

-   قم بإنشاء مكتبة عميل للغة لا نملك لها [حزمة تطوير برمجية (SDK)](../sdks/README.md) .
-   قم باستيراد واجهة برمجة التطبيقات (API) إلى أدوات مثل [Postman](https://www.postman.com/) أو [Insomnia](https://insomnia.rest/) أو [Swagger UI](https://swagger.io/tools/swagger-ui/) لاستكشاف نقاط النهاية.
-   التحقق من صحة استجابات واجهة برمجة التطبيقات (API) مقابل المخططات المنشورة.

## توليد عميل

يمكن استخدام أي مولد أكواد متوافق مع OpenAPI لإنشاء عميل. على سبيل المثال، يدعم [OpenAPI Generator](https://openapi-generator.tech/) [عشرات اللغات](https://openapi-generator.tech/docs/generators) :

```bash:no-line-numbers
# بايثون
npx @openapitools/openapi-generator-cli generate \
    -i https://bible.helloao.org/openapi.json \
    -g python \
    -o ./free-use-bible-api-python

# سي شارب
npx @openapitools/openapi-generator-cli generate \
    -i https://bible.helloao.org/openapi.json \
    -g csharp \
    -o ./free-use-bible-api-csharp
```

بالنسبة لـ TypeScript، يمكنك استخدام [`@hey-api/openapi-ts`](https://heyapi.dev/) :

```bash:no-line-numbers
npx @hey-api/openapi-ts \
    -i https://bible.helloao.org/openapi.json \
    -o ./src/client
```

::: tip
إذا كنت تستخدم جافا سكريبت أو تايب سكريبت، فربما لا تحتاج إلى إنشاء عميلك الخاص. بدلاً من ذلك، يمكنك الاطلاع على [حزمة تطوير البرامج (SDK) الخاصة بجافا سكريبت/تايب سكريبت](../sdks/javascript.md) .
:::

## العمليات

تحتوي كل نقطة نهاية في مستند OpenAPI على الرقم `operationId` ، والذي تستخدمه معظم مولدات البرامج كاسم للطريقة في العميل المُنشأ. على سبيل المثال:

| معرف العملية                | نقطة النهاية                               |
| --------------------------- | ------------------------------------------ |
| `getAvailableTranslations`  | `/api/available_translations.json`         |
| `getTranslationBooks`       | `/api/{translation}/books.json`            |
| `getTranslationBookChapter` | `/api/{translation}/{book}/{chapter}.json` |
| `getAvailableCommentaries`  | `/api/available_commentaries.json`         |
| `getAvailableDatasets`      | `/api/available_datasets.json`             |

راجع [وثيقة OpenAPI](https://bible.helloao.org/openapi.json) للاطلاع على القائمة الكاملة للعمليات.
