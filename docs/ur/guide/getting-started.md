---
description: 'منٹوں میں مفت استعمال بائبل API کا استعمال شروع کریں۔ JavaScript SDK انسٹال کریں یا JSON اینڈ پوائنٹس کو براہ راست کال کریں — کسی API کلید یا سائن اپ کی ضرورت نہیں ہے۔'
---

# شروع کرنا

آئیے اس میں داخل ہوں!

## SDKs

ہمارے پاس درج ذیل زبانوں کے لیے API کلائنٹس ہیں:

-   [JavaScript/TypeScript](../sdks/javascript.md)

## API

Bible API کو JSON فائلوں کے ایک سیٹ کے طور پر تشکیل دیا گیا ہے جو انٹرنیٹ سے ڈاؤن لوڈ کے لیے دستیاب ہیں۔

ان فائلوں کا استعمال کرتے ہوئے، آپ دستیاب تراجم کی فہرست، کسی خاص ترجمے کے لیے کتابوں کی فہرست، کسی خاص کتاب کے ابواب کی فہرست، اور ہر باب کے لیے مواد حاصل کر سکتے ہیں۔

یہ فائلیں درج ذیل راستوں پر دستیاب ہیں:

-   [`https://bible.helloao.org/api/available_translations.json`](../reference/translations/README.md#available-translations)
-   [`https://bible.helloao.org/api/{translation}/books.json`](../reference/translations/README.md#list-books-in-a-translation)
-   [`https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`](../reference/translations/standard.md#get-a-chapter-from-a-translation)
-   [`https://bible.helloao.org/api/available_commentaries.json`](../reference/commentaries/README.md#available-commentaries)
-   [`https://bible.helloao.org/api/c/{commentary}/books.json`](../reference/commentaries/README.md#list-books-in-a-commentary)
-   [`https://bible.helloao.org/api/c/{commentary}/{book}/{chapter}.json`](../reference/commentaries/README.md#get-a-chapter-from-a-commentary)
-   [`https://bible.helloao.org/api/available_datasets.json`](../reference/datasets/README.md#available-datasets)
-   [`https://bible.helloao.org/api/d/{dataset}/books.json`](../reference/datasets/README.md#list-books-in-a-dataset)
-   [`https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`](../reference/datasets/README.md#get-a-chapter-from-a-dataset)

ہر اختتامی نقطہ کے بارے میں مزید معلومات کے لیے، [اگلا صفحہ](./making-requests.md) دیکھیں۔
