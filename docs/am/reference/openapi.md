# ክፍት ኤፒአይ

ነፃ አጠቃቀም የመጽሐፍ ቅዱስ ኤፒአይ በዚህ ማጣቀሻ ውስጥ ያለውን እያንዳንዱን የመጨረሻ ነጥብ፣ መለኪያዎቹን እና የምላሽ አወቃቀሮቹን የሚገልጽ [የOpenAPI 3.1](https://spec.openapis.org/oas/v3.1.0) ሰነድ ያትማል።

`GET https://bible.helloao.org/openapi.json`

ይህንን ሰነድ ለሚከተሉት መጠቀም ይችላሉ፦

-   [ኤስዲኬ](../sdks/README.md) የሌለንበትን ቋንቋ ለማግኘት የደንበኛ ቤተ-መጽሐፍት ይፍጠሩ።
-   የመጨረሻ ነጥቦችን ለማሰስ ኤፒአይውን እንደ [Postman](https://www.postman.com/) ፣ [Insomnia](https://insomnia.rest/) ወይም [Swagger UI](https://swagger.io/tools/swagger-ui/) ባሉ መሳሪያዎች ውስጥ ያስመጡ።
-   የኤፒአይ ምላሾችን ከታተሙት ንድፎች ጋር በማነፃፀር ያረጋግጡ።

## ደንበኛ መፍጠር

ማንኛውም ከ OpenAPI ጋር ተኳሃኝ የሆነ የኮድ ጀነሬተር ደንበኛን ለማመንጨት ሊያገለግል ይችላል። ለምሳሌ፣ [OpenAPI ጀነሬተር](https://openapi-generator.tech/) [በደርዘን የሚቆጠሩ ቋንቋዎችን](https://openapi-generator.tech/docs/generators) ይደግፋል

```bash:no-line-numbers
# ፓይቶን
npx @openapitools/openapi-generator-cli generate \
    -i https://bible.helloao.org/openapi.json \
    -g python \
    -o ./free-use-bible-api-python

# ሲ#
npx @openapitools/openapi-generator-cli generate \
    -i https://bible.helloao.org/openapi.json \
    -g csharp \
    -o ./free-use-bible-api-csharp
```

ለTypeScript፣ [`@hey-api/openapi-ts`](https://heyapi.dev/) መጠቀም ይችላሉ

```bash:no-line-numbers
npx @hey-api/openapi-ts \
    -i https://bible.helloao.org/openapi.json \
    -o ./src/client
```

::: tip
ጃቫስክሪፕት ወይም ታይፕስክሪፕት የሚጠቀሙ ከሆነ፣ የራስዎን ደንበኛ መፍጠር አያስፈልግዎትም። በምትኩ [የጃቫስክሪፕት/ታይፕስክሪፕት ኤስዲኬን](../sdks/javascript.md) ይመልከቱ።
:::

## ኦፕሬሽኖች

በOpenAPI ሰነድ ውስጥ ያለው እያንዳንዱ የመጨረሻ ነጥብ `operationId` አለው፣ ይህም አብዛኛዎቹ ጀነሬተሮች በተፈጠረው ደንበኛ ውስጥ እንደ ዘዴ ስም ይጠቀማሉ። ለምሳሌ

| የክወና መታወቂያ                  | የመጨረሻ ነጥብ                                  |
| --------------------------- | ------------------------------------------ |
| `getAvailableTranslations`  | `/api/available_translations.json`         |
| `getTranslationBooks`       | `/api/{translation}/books.json`            |
| `getTranslationBookChapter` | `/api/{translation}/{book}/{chapter}.json` |
| `getAvailableCommentaries`  | `/api/available_commentaries.json`         |
| `getAvailableDatasets`      | `/api/available_datasets.json`             |

ሙሉውን የአሠራር ዝርዝር ለማግኘት [የOpenAPI ሰነዱን](https://bible.helloao.org/openapi.json) ይመልከቱ።
