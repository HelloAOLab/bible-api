---
layout: HomeLayout
sidebar: false
title: 'ነፃ የመጽሐፍ ቅዱስ አጠቃቀም ኤፒአይ'
headTitle: 'ነፃ የመጽሐፍ ቅዱስ ኤፒአይ | AO ላብ'
description: 'ለአጠቃቀም ቀላል እና ሙሉ በሙሉ ተለይቶ የቀረበ የJSON ኤፒአይ ለቅዱስ ጽሑፉ። ምንም የኤፒአይ ቁልፍ፣ የአጠቃቀም ገደቦች፣ እና የቅጂ መብት ገደቦች የሉም።'
---

<!--
  This page uses HomeLayout, which does not render the markdown below on the site,
  and HomeLayout pages are excluded from site search in .vuepress/config.ts.
  It is shown when browsing the docs directory on GitHub.
-->

# የሰነድ ጣቢያ

ይህ ማውጫ የ [bible.helloao.org/docs](https://bible.helloao.org/docs/) ምንጭን የያዘ ሲሆን በVuePress የተገነባ ነው። `pnpm dev:docs` ከማከማቻ ስርወ መዝገብ ውስጥ አስገብተው አስቀድመው ይመልከቱት እና `pnpm build:docs` ይገንቡት።

## ሰነዶቹን መተርጎም

`pnpm translate:docs` ማሽን በዚህ ማውጫ ውስጥ ያሉትን የእንግሊዝኛ ሰነዶች በ [Google Cloud Translation API](https://cloud.google.com/translate/docs/languages) ወደሚደገፍ ማንኛውም ቋንቋ ይተረጉማል። በApplication Default Credentials አማካኝነት ያረጋግጣል፣ ስለዚህ የደመና ትርጉም ኤፒአይ የነቃለት እና የgcloud CLI ያለው ፕሮጀክት እርስዎ የሚያስፈልጉዎት ብቻ ናቸው

```bash
gcloud auth application-default login
gcloud auth application-default set-quota-project <project-id>

pnpm translate:docs --list-languages   # የሚደገፉ የቋንቋ ኮዶችን አሳይ
pnpm translate:docs es fr zh-CN         # ሰነዶች/es፣ docs/fr፣ docs/zh-CN ይጽፋል
```

በተከለሉ የኮድ ብሎኮች ውስጥ ያሉ አስተያየቶችም ተተርጉመዋል (እንደ TypeScript፣ JSON እና bash ላሉ ቋንቋዎች)፣ ነገር ግን ኮዱ ራሱ፣ የመስመር ውስጥ ኮድ፣ ዩአርኤሎች እና HTML ሳይነኩ ይቀራሉ፣ እና አገናኞች ወደ የተተረጎሙት ገጾች ለማመልከት እንደገና ይጻፋሉ። የኮድ አስተያየቶችን በእንግሊዝኛ ለማስቀመጥ `--skip-code-comments` ይለፉ። ከእንግሊዝኛ ምንጭ የበለጠ አዲስ የሆኑ ፋይሎች ተዘለዋል፤ እንደገና ለመተርጎም `--force` ይለፉ። ለሁሉም አማራጮች `pnpm translate:docs --help` ያሂዱ።
