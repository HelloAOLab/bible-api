# ओपनएपीआई

फ्री यूज़ बाइबल एपीआई एक [ओपनएपीआई 3.1](https://spec.openapis.org/oas/v3.1.0) दस्तावेज़ प्रकाशित करता है जो इस संदर्भ में प्रत्येक एंडपॉइंट का वर्णन करता है, साथ ही इसके पैरामीटर और प्रतिक्रिया संरचनाओं का भी।

`GET https://bible.helloao.org/openapi.json`

आप इस दस्तावेज़ का उपयोग निम्न कार्यों के लिए कर सकते हैं:

-   एक ऐसी भाषा के लिए क्लाइंट लाइब्रेरी बनाएं जिसके लिए हमारे पास [SDK](../sdks/README.md) उपलब्ध नहीं है।
-   API को [Postman](https://www.postman.com/) , [Insomnia](https://insomnia.rest/) या [Swagger UI](https://swagger.io/tools/swagger-ui/) जैसे टूल में इम्पोर्ट करें ताकि आप एंडपॉइंट्स का पता लगा सकें।
-   प्रकाशित स्कीमाओं के आधार पर API प्रतिक्रियाओं का सत्यापन करें।

## ग्राहक उत्पन्न करना

किसी भी OpenAPI-संगत कोड जनरेटर का उपयोग क्लाइंट उत्पन्न करने के लिए किया जा सकता है। उदाहरण के लिए, [OpenAPI जनरेटर](https://openapi-generator.tech/) [दर्जनों भाषाओं का](https://openapi-generator.tech/docs/generators) समर्थन करता है।

```bash:no-line-numbers
# पायथन
npx @openapitools/openapi-generator-cli generate \
    -i https://bible.helloao.org/openapi.json \
    -g python \
    -o ./free-use-bible-api-python

# सी#
npx @openapitools/openapi-generator-cli generate \
    -i https://bible.helloao.org/openapi.json \
    -g csharp \
    -o ./free-use-bible-api-csharp
```

टाइपस्क्रिप्ट के लिए, आप [`@hey-api/openapi-ts`](https://heyapi.dev/) उपयोग कर सकते हैं:

```bash:no-line-numbers
npx @hey-api/openapi-ts \
    -i https://bible.helloao.org/openapi.json \
    -o ./src/client
```

::: tip
यदि आप जावास्क्रिप्ट या टाइपस्क्रिप्ट का उपयोग कर रहे हैं, तो शायद आपको अपना क्लाइंट स्वयं बनाने की आवश्यकता नहीं है। इसके बजाय [जावास्क्रिप्ट/टाइपस्क्रिप्ट एसडीके](../sdks/javascript.md) देखें।
:::

## संचालन

ओपनएपीआई दस्तावेज़ में प्रत्येक एंडपॉइंट में `operationId` होता है, जिसका उपयोग अधिकांश जनरेटर जनरेटेड क्लाइंट में मेथड नाम के रूप में करते हैं। उदाहरण के लिए:

| ऑपरेशन आईडी                 | endpoint                                   |
| --------------------------- | ------------------------------------------ |
| `getAvailableTranslations`  | `/api/available_translations.json`         |
| `getTranslationBooks`       | `/api/{translation}/books.json`            |
| `getTranslationBookChapter` | `/api/{translation}/{book}/{chapter}.json` |
| `getAvailableCommentaries`  | `/api/available_commentaries.json`         |
| `getAvailableDatasets`      | `/api/available_datasets.json`             |

सभी कार्यों की पूरी सूची के लिए [ओपनएपीआई दस्तावेज़](https://bible.helloao.org/openapi.json) देखें।
