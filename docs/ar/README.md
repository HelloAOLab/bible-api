---
layout: HomeLayout
sidebar: false
title: 'واجهة برمجة تطبيقات الكتاب المقدس للاستخدام المجاني'
headTitle: 'واجهة برمجة تطبيقات الكتاب المقدس للاستخدام المجاني | مختبر AO'
description: 'واجهة برمجة تطبيقات JSON سهلة الاستخدام وكاملة الميزات لنصوص الكتاب المقدس. لا حاجة لمفتاح API، ولا قيود على الاستخدام، ولا قيود على حقوق النشر.'
---

<!--
  This page uses HomeLayout, which does not render the markdown below on the site,
  and HomeLayout pages are excluded from site search in .vuepress/config.ts.
  It is shown when browsing the docs directory on GitHub.
-->

# موقع التوثيق

يحتوي هذا المجلد على مصدر [bible.helloao.org/docs](https://bible.helloao.org/docs/) ، الذي تم إنشاؤه باستخدام VuePress. شغّل الأمر `pnpm dev:docs` من جذر المستودع لمعاينته، ​​والأمر `pnpm build:docs` لبنائه.

## ترجمة الوثائق

يقوم هذا البرنامج بترجمة المستندات الإنجليزية الموجودة في هذا المجلد `pnpm translate:docs` إلى أي لغة تدعمها [واجهة برمجة تطبيقات الترجمة السحابية من جوجل](https://cloud.google.com/translate/docs/languages) . ويتم التحقق من هوية المستخدم باستخدام بيانات اعتماد التطبيق الافتراضية، لذا كل ما تحتاجه هو مشروع مُفعّل عليه واجهة برمجة تطبيقات الترجمة السحابية وواجهة سطر الأوامر gcloud.

```bash
gcloud auth application-default login
gcloud auth application-default set-quota-project <project-id>

pnpm translate:docs --list-languages   # عرض رموز اللغات المدعومة
pnpm translate:docs es fr zh-CN         # يكتب docs/es، docs/fr، docs/zh-CN
```

تُترجم التعليقات الموجودة داخل كتل التعليمات البرمجية المُحاطة بسياج أيضًا (لللغات مثل TypeScript وJSON وbash)، ولكن تبقى التعليمات البرمجية نفسها، والتعليمات البرمجية المضمنة، وعناوين URL، وHTML دون تغيير، وتُعاد كتابة الروابط لتشير إلى الصفحات المترجمة. مرر القيمة `--skip-code-comments` للاحتفاظ بتعليقات التعليمات البرمجية باللغة الإنجليزية. يتم تخطي الملفات التي تكون ترجمتها أحدث من المصدر الإنجليزي؛ مرر القيمة `--force` لإعادة ترجمتها. استخدم القيمة `pnpm translate:docs --help` لجميع الخيارات.
