---
layout: HomeLayout
sidebar: false
title: 'API ya Biblia ya Matumizi Bila Malipo'
headTitle: 'API ya Biblia ya Matumizi ya Bure | Maabara ya AO'
description: 'API ya JSON rahisi kutumia na iliyoangaziwa kikamilifu kwa Maandiko Matakatifu. Hakuna ufunguo wa API, hakuna mipaka ya matumizi, hakuna vikwazo vya hakimiliki.'
---

<!--
  This page uses HomeLayout, which does not render the markdown below on the site,
  and HomeLayout pages are excluded from site search in .vuepress/config.ts.
  It is shown when browsing the docs directory on GitHub.
-->

# Tovuti ya Nyaraka

Saraka hii ina chanzo cha [bible.helloao.org/docs](https://bible.helloao.org/docs/) , kilichojengwa kwa kutumia VuePress. Endesha `pnpm dev:docs` kutoka kwenye mzizi wa hifadhi ili kuihakiki na `pnpm build:docs` ili kuijenga.

## Kutafsiri Nyaraka

`pnpm translate:docs` machine-hutafsiri hati za Kiingereza katika saraka hii katika lugha yoyote inayoungwa mkono na [Google Cloud Translation API](https://cloud.google.com/translate/docs/languages) . Inathibitisha kwa kutumia Vitambulisho Chaguo-msingi vya Programu, kwa hivyo mradi wenye API ya Tafsiri ya Wingu iliyowezeshwa na gcloud CLI ndio unahitaji tu:

```bash
gcloud auth application-default login
gcloud auth application-default set-quota-project <project-id>

pnpm translate:docs --list-languages   # onyesha misimbo ya lugha inayoungwa mkono
pnpm translate:docs es fr zh-CN         # anaandika hati/maandishi, hati/fr, hati/zh-CN
```

Maoni katika vizuizi vya msimbo vilivyozungushiwa uzio pia hutafsiriwa (kwa lugha kama vile TypeScript, JSON na bash), lakini msimbo wenyewe, msimbo wa ndani, URL na HTML huachwa bila kuguswa, na viungo huandikwa upya ili kuelekeza kwenye kurasa zilizotafsiriwa. Pitisha `--skip-code-comments` ili kuweka maoni ya msimbo kwa Kiingereza. Faili ambazo tafsiri yake ni mpya kuliko chanzo cha Kiingereza hurukwa; pitisha `--force` ili kuzitafsiri tena. Endesha `pnpm translate:docs --help` kwa chaguo zote.
