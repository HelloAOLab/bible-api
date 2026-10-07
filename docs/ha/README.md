---
layout: HomeLayout
sidebar: false
title: 'API ɗin Littafi Mai Tsarki na Amfani Kyauta'
headTitle: 'API ɗin Littafi Mai Tsarki Mai Amfani Kyauta | AO Lab'
description: 'API mai sauƙin amfani kuma cikakke mai fasali na JSON don Littafi Mai Tsarki. Babu maɓallin API, babu iyakokin amfani, babu ƙuntatawa ta haƙƙin mallaka.'
---

<!--
  This page uses HomeLayout, which does not render the markdown below on the site,
  and HomeLayout pages are excluded from site search in .vuepress/config.ts.
  It is shown when browsing the docs directory on GitHub.
-->

# Shafin Takardu

Wannan kundin adireshi ya ƙunshi tushen [bible.helloao.org/docs](https://bible.helloao.org/docs/) , wanda aka gina da VuePress. Gudu `pnpm dev:docs` daga tushen ma'ajiyar bayanai don yin samfoti da `pnpm build:docs` don gina shi.

## Fassara Takardu

`pnpm translate:docs` na'ura tana fassara takardun Turanci a cikin wannan kundin adireshi zuwa kowace harshe da [Google Cloud Translation API](https://cloud.google.com/translate/docs/languages) ke tallafawa. Yana tabbatarwa da Takaddun Shaida na Aikace-aikace, don haka aikin da ke da Cloud Translation API da gcloud CLI sune duk abin da kuke buƙata:

```bash
gcloud auth application-default login
gcloud auth application-default set-quota-project <project-id>

pnpm translate:docs --list-languages   # nuna lambobin harshe masu goyan baya
pnpm translate:docs es fr zh-CN         # yana rubuta takardu/es, takardu/fr, takardu/zh-CN
```

Ana fassara sharhi a cikin tubalan lambar da aka shinge (don harsuna kamar TypeScript, JSON da bash), amma an bar lambar da kanta, lambar layi, URLs da HTML ba a taɓa su ba, kuma an sake rubuta hanyoyin haɗi don nuna shafukan da aka fassara. Wuce `--skip-code-comments` don ajiye sharhin lambar a Turanci. Fayilolin da fassararsu ta fi ta asalin Turanci sabo ne an tsallake su; wuce `--force` don sake fassara su. Gudu `pnpm translate:docs --help` don duk zaɓuɓɓuka.
