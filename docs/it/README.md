---
layout: HomeLayout
sidebar: false
title: 'API biblica ad uso gratuito'
headTitle: 'API biblica ad uso libero | AO Lab'
description: "Un'API JSON per le Sacre Scritture, facile da usare e completa di tutte le funzionalità. Nessuna chiave API richiesta, nessun limite di utilizzo, nessuna restrizione di copyright."
---

<!--
  This page uses HomeLayout, which does not render the markdown below on the site,
  and HomeLayout pages are excluded from site search in .vuepress/config.ts.
  It is shown when browsing the docs directory on GitHub.
-->

# Sito della documentazione

Questa directory contiene il codice sorgente di [bible.helloao.org/docs](https://bible.helloao.org/docs/) , realizzato con VuePress. Esegui il comando `pnpm dev:docs` dalla directory principale del repository per visualizzarne l'anteprima e `pnpm build:docs` per compilarlo.

## Traduzione della documentazione

`pnpm translate:docs` Traduce automaticamente la documentazione in inglese presente in questa directory in qualsiasi lingua supportata [dall'API di traduzione di Google Cloud](https://cloud.google.com/translate/docs/languages) . L'autenticazione avviene tramite le credenziali predefinite dell'applicazione, quindi è sufficiente un progetto con l'API di traduzione di Cloud abilitata e la CLI di gcloud:

```bash
gcloud auth application-default login
gcloud auth application-default set-quota-project <project-id>

pnpm translate:docs --list-languages   # mostra i codici lingua supportati
pnpm translate:docs es fr zh-CN         # scrive docs/es, docs/fr, docs/zh-CN
```

Anche i commenti nei blocchi di codice delimitati vengono tradotti (per linguaggi come TypeScript, JSON e bash), ma il codice stesso, il codice inline, gli URL e l'HTML rimangono invariati e i link vengono riscritti per puntare alle pagine tradotte. Passa `--skip-code-comments` per mantenere i commenti del codice in inglese. I file la cui traduzione è più recente della sorgente inglese vengono saltati; passa `--force` per ritradurli. Le etichette della barra di navigazione e della barra laterale e il testo delle pagine home e 404, in `.vuepress/labels.json` , vengono tradotti in `<language>/labels.json` Qualsiasi etichetta mancante in una traduzione torna all'inglese. I versetti biblici citati nella home page non vengono mai tradotti automaticamente: vengono citati da una traduzione presente nell'API Free Use Bible. `pnpm fill:docs-verses` compila `<language>/verses.json` per ogni lingua, scegliendo una traduzione nello stesso modo dell'app Seed Bible. I versetti già presenti in un file vengono mantenuti (passa `--force` per sostituirli), in modo che possano essere modificati manualmente. Vedi `.vuepress/verses.ts` Esegui `pnpm translate:docs --help` per tutte le opzioni.
