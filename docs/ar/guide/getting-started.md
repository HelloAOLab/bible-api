---
description: 'ابدأ باستخدام واجهة برمجة تطبيقات الكتاب المقدس للاستخدام المجاني في دقائق. قم بتثبيت حزمة تطوير البرامج JavaScript أو اتصل بنقاط نهاية JSON مباشرةً - لا حاجة إلى مفتاح API أو التسجيل.'
---

# ابدء

لنبدأ مباشرة!

## مجموعات تطوير البرامج (SDKs)

لدينا عملاء واجهة برمجة التطبيقات (API) للغات التالية:

-   [جافا سكريبت/تايب سكريبت](../sdks/javascript.md)

## واجهة برمجة التطبيقات (API)

تم تصميم واجهة برمجة تطبيقات الكتاب المقدس على شكل مجموعة من ملفات JSON المتاحة للتنزيل من الإنترنت.

باستخدام هذه الملفات، يمكنك الحصول على قائمة بالترجمات المتاحة، وقائمة الكتب لترجمة معينة، وقائمة الفصول لكتاب معين، ومحتوى كل فصل.

تتوفر هذه الملفات في المسارات التالية:

-   [`https://bible.helloao.org/api/available_translations.json`](../reference/translations/README.md#available-translations)
-   [`https://bible.helloao.org/api/{translation}/books.json`](../reference/translations/README.md#list-books-in-a-translation)
-   [`https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`](../reference/translations/standard.md#get-a-chapter-from-a-translation)
-   [`https://bible.helloao.org/api/available_commentaries.json`](../reference/commentaries/README.md#available-commentaries)
-   [`https://bible.helloao.org/api/c/{commentary}/books.json`](../reference/commentaries/README.md#list-books-in-a-commentary)
-   [`https://bible.helloao.org/api/c/{commentary}/{book}/{chapter}.json`](../reference/commentaries/README.md#get-a-chapter-from-a-commentary)
-   [`https://bible.helloao.org/api/available_datasets.json`](../reference/datasets/README.md#available-datasets)
-   [`https://bible.helloao.org/api/d/{dataset}/books.json`](../reference/datasets/README.md#list-books-in-a-dataset)
-   [`https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`](../reference/datasets/README.md#get-a-chapter-from-a-dataset)

للحصول على مزيد من المعلومات حول كل نقطة نهاية، انظر [الصفحة التالية](./making-requests.md) .
