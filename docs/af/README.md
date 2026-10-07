---
layout: HomeLayout
sidebar: false
title: 'Gratis Gebruik Bybel API'
headTitle: 'Gratis Gebruik Bybel API | AO Lab'
description: "'n Maklik-om-te-gebruik en volledig toegeruste JSON API vir die Skrif. Geen API-sleutel, geen gebruiksbeperkings, geen kopieregbeperkings nie."
---

<!--
  This page uses HomeLayout, which does not render the markdown below on the site,
  and HomeLayout pages are excluded from site search in .vuepress/config.ts.
  It is shown when browsing the docs directory on GitHub.
-->

# Dokumentasiewebwerf

Hierdie gids bevat die bronkode vir [bible.helloao.org/docs](https://bible.helloao.org/docs/) , gebou met VuePress. Voer `pnpm dev:docs` vanaf die wortel van die bewaarplek uit om dit te voorskou en `pnpm build:docs` om dit te bou.

## Vertaling van die dokumentasie

`pnpm translate:docs` vertaal die Engelse dokumente in hierdie gids masjienvertaal in enige taal wat deur die [Google Cloud Translation API](https://cloud.google.com/translate/docs/languages) ondersteun word. Dit verifieer met Toepassingsverstekbewyse, dus 'n projek met die Cloud Translation API geaktiveer en die gcloud CLI is al wat jy nodig het:

```bash
gcloud auth application-default login
gcloud auth application-default set-quota-project <project-id>

pnpm translate:docs --list-languages   # wys ondersteunde taalkodes
pnpm translate:docs es fr zh-CN         # skryf docs/es, docs/fr, docs/zh-CN
```

Kommentaar in omheinde kodeblokke word ook vertaal (vir tale soos TypeScript, JSON en bash), maar die kode self, inlynkode, URL'e en HTML word onaangeraak gelaat, en skakels word herskryf om na die vertaalde bladsye te wys. Slaag `--skip-code-comments` om kodekommentaar in Engels te hou. Lêers waarvan die vertaling nuwer is as die Engelse bronkode word oorgeslaan; slaag `--force` om dit weer te vertaal. Die navigasiebalk- en sybalketikette en die teks van die tuisblad en 404-bladsye, in `.vuepress/labels.json` , word in `<language>/labels.json` vertaal. Enige etiket wat in 'n vertaling ontbreek, val terug na Engels. Die Bybelverse wat op die tuisblad aangehaal word, word nooit masjienvertaal nie: hulle word aangehaal uit 'n vertaling in die Free Use Bible API. `pnpm fill:docs-verses` vul `<language>/verses.json` vir elke taal in, en kies 'n vertaling soos die Seed Bible-app dit doen. Verse wat reeds in 'n lêer is, word gehou (slaag `--force` om hulle te vervang), sodat hulle met die hand geredigeer kan word. Sien `.vuepress/verses.ts` Voer `pnpm translate:docs --help` uit vir alle opsies.
