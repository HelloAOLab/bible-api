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

Ana fassara sharhi a cikin tubalan lambar da aka shinge suma (ga harsuna kamar TypeScript, JSON da bash), amma lambar da kanta, lambar layi, URLs da HTML an bar su ba tare da an taɓa su ba, kuma an sake rubuta hanyoyin haɗi don nuna shafukan da aka fassara. Wuce `--skip-code-comments` don adana sharhin lamba a Turanci. Fayilolin da fassararsu ta fi asalin Ingilishi sabo an tsallake su; wucewa `--force` don sake fassara su. Lakabin maɓalli da gefen gefe da rubutun gida da shafuka 404, a cikin `.vuepress/labels.json` , an fassara su zuwa `<language>/labels.json` Duk wani lakabin da ya ɓace daga fassarar ya koma Turanci. ayoyin Littafi Mai Tsarki da aka ambata a shafin farko ba a taɓa fassara su ta hanyar na'ura ba: an ambace su daga fassarar a cikin Free Use Bible API. `pnpm fill:docs-verses` yana cika `<language>/verses.json` ga kowane harshe, yana zaɓar fassarar kamar yadda manhajar Seed Bible ke yi. Ana ajiye ayoyi da suka riga suka shiga fayil (wuce `--force` don maye gurbinsu), don haka ana iya gyara su da hannu. Duba `.vuepress/verses.ts` Gudu `pnpm translate:docs --help` don duk zaɓuɓɓuka.
