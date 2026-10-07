---
layout: HomeLayout
sidebar: false
title: 'بائبل API کا مفت استعمال کریں۔'
headTitle: 'Bible API کا مفت استعمال کریں | اے او لیب'
description: 'صحیفہ کے لیے استعمال میں آسان اور مکمل طور پر نمایاں JSON API۔ کوئی API کلید نہیں، استعمال کی کوئی حد نہیں، کاپی رائٹ کی کوئی پابندی نہیں۔'
---

<!--
  This page uses HomeLayout, which does not render the markdown below on the site,
  and HomeLayout pages are excluded from site search in .vuepress/config.ts.
  It is shown when browsing the docs directory on GitHub.
-->

# دستاویزی سائٹ

اس ڈائرکٹری میں [bible.helloao.org/docs](https://bible.helloao.org/docs/) کا ماخذ ہے، جو VuePress کے ساتھ بنایا گیا ہے۔ اس کا پیش نظارہ کرنے کے لیے ریپوزٹری روٹ سے `pnpm dev:docs` اور اسے بنانے کے لیے `pnpm build:docs` چلائیں۔

## دستاویزات کا ترجمہ کرنا

`pnpm translate:docs` مشین اس ڈائرکٹری میں موجود انگریزی دستاویزات کا [گوگل کلاؤڈ ٹرانسلیشن API](https://cloud.google.com/translate/docs/languages) کے ذریعے تعاون یافتہ کسی بھی زبان میں ترجمہ کرتی ہے۔ یہ ایپلیکیشن ڈیفالٹ اسناد کے ساتھ تصدیق کرتا ہے، لہذا کلاؤڈ ٹرانسلیشن API کے ساتھ ایک پروجیکٹ فعال ہے اور gcloud CLI آپ کی ضرورت ہے:

```bash
gcloud auth application-default login
gcloud auth application-default set-quota-project <project-id>

pnpm translate:docs --list-languages   # معاون زبان کے کوڈز دکھائیں۔
pnpm translate:docs es fr zh-CN         # docs/es، docs/fr، docs/zh-CN لکھتا ہے۔
```

باڑ والے کوڈ بلاکس میں تبصروں کا ترجمہ بھی کیا جاتا ہے (زبانوں جیسے کہ TypeScript، JSON اور bash کے لیے)، لیکن خود کوڈ، ان لائن کوڈ، URLs اور HTML کو اچھوتا چھوڑ دیا جاتا ہے، اور لنکس کو ترجمہ شدہ صفحات پر پوائنٹ کرنے کے لیے دوبارہ لکھا جاتا ہے۔ انگریزی میں کوڈ کمنٹس رکھنے کے لیے `--skip-code-comments` پاس کریں۔ وہ فائلیں جن کا ترجمہ انگریزی ماخذ سے نیا ہے چھوڑ دیا جاتا ہے۔ ان کا دوبارہ ترجمہ کرنے کے لیے `--force` پاس کریں۔ تمام اختیارات کے لیے `pnpm translate:docs --help` چلائیں۔
