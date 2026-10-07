# ওপেনএপিআই

ফ্রি ইউজ বাইবেল এপিআই একটি [ওপেনএপিআই ৩.১](https://spec.openapis.org/oas/v3.1.0) ডকুমেন্ট প্রকাশ করে, যেখানে এই রেফারেন্সের প্রতিটি এন্ডপয়েন্টের প্যারামিটার এবং রেসপন্স স্ট্রাকচারসহ বর্ণনা দেওয়া হয়েছে।

`GET https://bible.helloao.org/openapi.json`

আপনি এই নথিটি নিম্নলিখিত কাজে ব্যবহার করতে পারেন:

-   এমন একটি ভাষার জন্য একটি ক্লায়েন্ট লাইব্রেরি তৈরি করুন, যার জন্য আমাদের কোনো [SDK](../sdks/README.md) নেই।
-   এন্ডপয়েন্টগুলো অন্বেষণ করতে [Postman](https://www.postman.com/) , [Insomnia](https://insomnia.rest/) বা [Swagger UI-এর](https://swagger.io/tools/swagger-ui/) মতো টুলগুলিতে API-টি ইম্পোর্ট করুন।
-   প্রকাশিত স্কিমাগুলোর সাথে এপিআই প্রতিক্রিয়াগুলো যাচাই করুন।

## ক্লায়েন্ট তৈরি করা

যেকোনো OpenAPI-উপযোগী কোড জেনারেটর ব্যবহার করে একটি ক্লায়েন্ট তৈরি করা যায়। উদাহরণস্বরূপ, [OpenAPI Generator](https://openapi-generator.tech/) [কয়েক ডজন ভাষা](https://openapi-generator.tech/docs/generators) সমর্থন করে:

```bash:no-line-numbers
# পাইথন
npx @openapitools/openapi-generator-cli generate \
    -i https://bible.helloao.org/openapi.json \
    -g python \
    -o ./free-use-bible-api-python

# সি#
npx @openapitools/openapi-generator-cli generate \
    -i https://bible.helloao.org/openapi.json \
    -g csharp \
    -o ./free-use-bible-api-csharp
```

টাইপস্ক্রিপ্টের জন্য, আপনি [`@hey-api/openapi-ts`](https://heyapi.dev/) ব্যবহার করতে পারেন:

```bash:no-line-numbers
npx @hey-api/openapi-ts \
    -i https://bible.helloao.org/openapi.json \
    -o ./src/client
```

::: tip
আপনি যদি জাভাস্ক্রিপ্ট বা টাইপস্ক্রিপ্ট ব্যবহার করেন, তাহলে সম্ভবত আপনার নিজের ক্লায়েন্ট তৈরি করার প্রয়োজন নেই। এর পরিবর্তে [জাভাস্ক্রিপ্ট/টাইপস্ক্রিপ্ট এসডিকে (SDK)](../sdks/javascript.md) ব্যবহার করে দেখুন।
:::

## অপারেশন

OpenAPI ডকুমেন্টের প্রতিটি এন্ডপয়েন্টে একটি `operationId` থাকে, যা বেশিরভাগ জেনারেটর তৈরি করা ক্লায়েন্টে মেথডের নাম হিসেবে ব্যবহার করে। উদাহরণস্বরূপ:

| অপারেশন আইডি                | এন্ডপয়েন্ট                                |
| --------------------------- | ------------------------------------------ |
| `getAvailableTranslations`  | `/api/available_translations.json`         |
| `getTranslationBooks`       | `/api/{translation}/books.json`            |
| `getTranslationBookChapter` | `/api/{translation}/{book}/{chapter}.json` |
| `getAvailableCommentaries`  | `/api/available_commentaries.json`         |
| `getAvailableDatasets`      | `/api/available_datasets.json`             |

অপারেশনগুলোর সম্পূর্ণ তালিকার জন্য [OpenAPI ডকুমেন্টেশন](https://bible.helloao.org/openapi.json) দেখুন।
