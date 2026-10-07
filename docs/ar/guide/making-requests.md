---
description: 'كيفية تقديم الطلبات إلى واجهة برمجة تطبيقات الكتاب المقدس للاستخدام المجاني: جلب الترجمات والكتب والفصول والتعليقات ومجموعات البيانات عبر طلب HTTP GET عادي.'
---

# تقديم الطلبات

للوصول إلى واجهة برمجة التطبيقات (API)، كل ما عليك فعله هو إرسال طلب HTTP GET إلى نقطة النهاية الصحيحة.

على سبيل المثال، للوصول إلى نقطة النهاية `available_translations.json` ، يمكنك استخدام أمر JavaScript أو cURL التالي:

::: code-tabsلغة عامية

@tab جافا سكريبت

```ts:no-line-numbers
fetch(`https://bible.helloao.org/api/available_translations.json`)
    .then(request => request.json())
    .then(availableTranslations => {
        console.log('The API has the following translations:', availableTranslations);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/available_translations.json
```

:::

ستجد أدناه قائمة بالأمثلة. للاطلاع على وثائق أكثر شمولاً، راجع [الوثائق المرجعية](../reference/README.md) .

## أمثلة

### احصل على قائمة الترجمات المتاحة

( [مرجع](../reference/translations/README.md#available-translations) )

`GET https://bible.helloao.org/api/available_translations.json`

::: code-tabsلغة عامية

@tab جافا سكريبت

```ts:no-line-numbers
fetch(`https://bible.helloao.org/api/available_translations.json`)
    .then(request => request.json())
    .then(availableTranslations => {
        console.log('The API has the following translations:', availableTranslations);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/available_translations.json
```

:::

### قائمة الكتب المترجمة

( [مرجع](../reference/translations/README.md#list-books-in-a-translation) )

`GET https://bible.helloao.org/api/{translation}/books.json`

::: code-tabsلغة عامية

@tab جافا سكريبت

```ts:no-line-numbers
// احصل على قائمة الكتب لترجمة BSB
fetch(`https://bible.helloao.org/api/BSB/books.json`)
    .then(request => request.json())
    .then(books => {
        console.log('The BSB has the following books:', books);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/books.json
```

:::

### احصل على فصل من ترجمة

( [مرجع](../reference/translations/standard.md#get-a-chapter-from-a-translation) )

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`

::: code-tabsلغة عامية

@tab جافا سكريبت

```ts:no-line-numbers
// احصل على سفر التكوين 1 من ترجمة BSB
fetch(`https://bible.helloao.org/api/BSB/GEN/1.json`)
    .then(request => request.json())
    .then(chapter => {
        console.log('Genesis 1 (BSB):', chapter);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/GEN/1.json
```

:::

### احصل على فصل مبسط من الترجمة

( [مرجع](../reference/translations/simplified.md#get-a-simplified-chapter-from-a-translation) )

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.simple.json`

استخدم هذا الخيار عندما تريد نص فصلٍ ما فقط. تحتوي كل آية على سلسلة نصية واحدة `text` بدلاً من قائمة محتوى منسق، لذا لن تحتاج إلى إنشاء النص بنفسك.

::: code-tabsلغة عامية

@tab جافا سكريبت

```ts:no-line-numbers
// احصل على نص سفر التكوين 1 من ترجمة BSB
fetch(`https://bible.helloao.org/api/BSB/GEN/1.simple.json`)
    .then(request => request.json())
    .then(chapter => {
        for (let content of chapter.chapter.content) {
            if (content.type === 'verse') {
                console.log(`${content.number}. ${content.text}`);
            }
        }
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/GEN/1.simple.json
```

:::

### احصل على قائمة التعليقات المتاحة

( [مرجع](../reference/commentaries/README.md#available-commentaries) )

::: code-tabsلغة عامية

@tab جافا سكريبت

```ts:no-line-numbers title="fetch-commentaries.js"
fetch(`https://bible.helloao.org/api/available_commentaries.json`)
    .then(request => request.json())
    .then(availableCommentaries => {
        console.log('The API has the following commentaries:', availableCommentaries);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/available_commentaries.json
```

:::

### قائمة الكتب في تعليق

( [مرجع](../reference/commentaries/README.md#list-books-in-a-commentary) )

::: code-tabsلغة عامية

@tab جافا سكريبت

```ts:no-line-numbers title="fetch-commentary-books.js"
const commentary = 'adam-clarke';

// احصل على قائمة الكتب الخاصة بشرح آدم كلارك
fetch(`https://bible.helloao.org/api/c/${commentary}/books.json`)
    .then(request => request.json())
    .then(books => {
        console.log('The adam-clarke commentary has the following books:', books);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/c/adam-clarke/books.json
```

:::

### احصل على فصل من أحد التعليقات

( [مرجع](../reference/commentaries/README.md#get-a-chapter-from-a-commentary) )

::: code-tabsلغة عامية

@tab جافا سكريبت

```ts:no-line-numbers title="fetch-commentary-chapter.js"
const commentary = 'adam-clarke';
const book = 'GEN';
const chapter = 1;

// احصل على شرح سفر التكوين 1 من تعليق آدم كلارك
fetch(`https://bible.helloao.org/api/c/${commentary}/${book}/${chapter}.json`)
    .then(request => request.json())
    .then(chapter => {
        console.log('Genesis 1 (adam-clarke):', chapter);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/c/adam-clarke/GEN/1.json
```

:::

### قائمة بالملفات الشخصية في تعليق

( [مرجع](../reference/commentaries/README.md#list-profiles-in-a-commentary) )

::: code-tabsلغة عامية

@tab جافا سكريبت

```ts:no-line-numbers title="fetch-commentary-profiles.js"
const commentary = 'tyndale';

// احصل على قائمة الملفات الشخصية لتعليق تينديل
fetch(`https://bible.helloao.org/api/c/${commentary}/profiles.json`)
    .then(request => request.json())
    .then(profiles => {
        console.log('The tyndale commentary has the following profiles:', profiles);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/c/tyndale/profiles.json
```

:::

### احصل على ملف تعريف في تعليق

( [مرجع](../reference/commentaries/README.md#get-a-profile-in-a-commentary) )

::: code-tabsلغة عامية

@tab جافا سكريبت

```ts:no-line-numbers title="fetch-commentary-profile.js"
const commentary = 'tyndale';
const profile = 'aaron';

// احصل على ملف تعريف آرون من تعليق تينديل
fetch(`https://bible.helloao.org/api/c/${commentary}/profiles/${profile}.json`)
    .then(request => request.json())
    .then(profile => {
        console.log('The Aaron tyndale commentary profile:', profile);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/c/tyndale/profiles/aaron.json
```

:::

### احصل على قائمة مجموعات البيانات المتاحة

( [مرجع](../reference/datasets/README.md#available-datasets) )

::: code-tabsلغة عامية

@tab جافا سكريبت

```ts:no-line-numbers title="fetch-datasets.js"
fetch(`https://bible.helloao.org/api/available_datasets.json`)
    .then(request => request.json())
    .then(availableDatasets => {
        console.log('The API has the following datasets:', availableDatasets);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/available_datasets.json
```

:::

### احصل على قائمة الكتب في مجموعة البيانات

( [مرجع](../reference/datasets/README.md#list-books-in-a-dataset) )

::: code-tabsلغة عامية

@tab جافا سكريبت

```ts:no-line-numbers title="fetch-dataset-books.js"
const dataset = 'open-cross-ref';

// احصل على قائمة الكتب لمجموعة بيانات المراجع المفتوحة
fetch(`https://bible.helloao.org/api/d/${dataset}/books.json`)
    .then(request => request.json())
    .then(books => {
        console.log('The open-cross-ref dataset has the following books:', books);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/open-cross-ref/books.json
```

:::

### استخراج فصل من مجموعة بيانات

( [مرجع](../reference/datasets/README.md#get-a-chapter-from-a-dataset) )

::: code-tabsلغة عامية

@tab جافا سكريبت

```ts:no-line-numbers title="fetch-dataset-chapter.js"
const dataset = 'open-cross-ref';
const book = 'GEN';
const chapter = 1;

// احصل على سفر التكوين 1 من مجموعة بيانات المراجع المفتوحة المتقاطعة
fetch(`https://bible.helloao.org/api/d/${dataset}/${book}/${chapter}.json`)
    .then(request => request.json())
    .then(chapter => {
        console.log('Genesis 1 (open-cross-ref):', chapter);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/open-cross-ref/GEN/1.json
```

:::
