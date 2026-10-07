---
layout: HomeLayout
sidebar: false
title: 'I-API YeBhayibheli Yokusetshenziswa Kwamahhala'
headTitle: 'I-API Yokusebenzisa IBhayibheli Mahhala | I-AO Lab'
description: 'I-JSON API elula ukuyisebenzisa futhi efakiwe ngokugcwele yemiBhalo. Akukho khiye we-API, akukho mingcele yokusetshenziswa, akukho mingcele ye-copyright.'
---

<!--
  This page uses HomeLayout, which does not render the markdown below on the site,
  and HomeLayout pages are excluded from site search in .vuepress/config.ts.
  It is shown when browsing the docs directory on GitHub.
-->

# Isayithi Lamadokhumenti

Lolu hlu lwemibhalo luqukethe umthombo [we-bible.helloao.org/docs](https://bible.helloao.org/docs/) , owakhiwe nge-VuePress. Sebenzisa `pnpm dev:docs` kusuka empandeni yokugcina ukuze uwubuke kuqala kanye no `pnpm build:docs` ukuze uwakhe.

## Ukuhumusha Imibhalo

`pnpm translate:docs` machine-huhumusha amadokhumenti esiNgisi kulolu hlu lwemibhalo kunoma yiluphi ulimi olusekelwa yi- [Google Cloud Translation API](https://cloud.google.com/translate/docs/languages) . Iqinisekisa nge-Application Default Credentials, ngakho-ke iphrojekthi ene-Cloud Translation API enikwe amandla kanye ne-gcloud CLI yikho konke okudingayo:

```bash
gcloud auth application-default login
gcloud auth application-default set-quota-project <project-id>

pnpm translate:docs --list-languages   # bonisa amakhodi olimi asekelwayo
pnpm translate:docs es fr zh-CN         # ubhala amadokhumenti/ama-es, amadokhumenti/fr, amadokhumenti/zh-CN
```

Amazwana kumabhulokhi ekhodi abiyelwe nawo ayahunyushwa (ngezilimi ezifana ne-TypeScript, i-JSON ne-bash), kodwa ikhodi ngokwayo, ikhodi esemgqeni, ama-URL kanye ne-HTML ashiywa engathintekile, futhi izixhumanisi zibhalwa kabusha ukuze zikhombe amakhasi ahunyushwe. Dlula u `--skip-code-comments` ukuze ugcine amazwana ekhodi ngesiNgisi. Amafayela anokuhumusha okusha kunomthombo wesiNgisi ayeqiwa; dlula `--force` ukuze uwahumushe kabusha. Amalebula e-navbar kanye ne-sidebar kanye nombhalo wekhaya kanye namakhasi angu-404, ku `.vuepress/labels.json` , ahunyushwa ku- `<language>/labels.json` . Noma yiliphi ilebula elingekho ekuhumusheni libuyela emuva esiNgisini. Amavesi eBhayibheli acashunwe ekhasini lasekhaya awahunyushwa ngomshini: acashunwe ekuhumusheni ku-Free Use Bible API. `pnpm fill:docs-verses` agcwalisa ama `<language>/verses.json` ngolimi ngalunye, ekhetha ukuhumusha ngendlela uhlelo lokusebenza lwe-Seed Bible olukwenza ngayo. Amavesi asevele efayeleni ayagcinwa (dlula `--force` ukuze uwathathe indawo yawo), ukuze ahlelwe ngesandla. Bheka `.vuepress/verses.ts` . Sebenzisa `pnpm translate:docs --help` kuzo zonke izinketho.
