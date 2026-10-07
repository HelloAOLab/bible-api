---
layout: HomeLayout
sidebar: false
title: 'API biblique gratuite'
headTitle: 'API biblique gratuite | AO Lab'
description: "Une API JSON simple d'utilisation et complète pour les Écritures. Aucune clé API, aucune limite d'utilisation, aucune restriction de droits d'auteur."
---

<!--
  This page uses HomeLayout, which does not render the markdown below on the site,
  and HomeLayout pages are excluded from site search in .vuepress/config.ts.
  It is shown when browsing the docs directory on GitHub.
-->

# Site de documentation

Ce répertoire contient le code source de [bible.helloao.org/docs](https://bible.helloao.org/docs/) , généré avec VuePress. Exécutez la commande `pnpm dev:docs` à la racine du dépôt pour prévisualiser le code et `pnpm build:docs` pour le compiler.

## Traduction de la documentation

`pnpm translate:docs` commande traduit automatiquement la documentation anglaise de ce répertoire dans n'importe quelle langue prise en charge par l' [API Google Cloud Translation](https://cloud.google.com/translate/docs/languages) . L'authentification s'effectue avec les identifiants par défaut de l'application ; un projet avec l'API Cloud Translation activée et l'interface de ligne de commande gcloud suffisent.

```bash
gcloud auth application-default login
gcloud auth application-default set-quota-project <project-id>

pnpm translate:docs --list-languages   # afficher les codes de langue pris en charge
pnpm translate:docs es fr zh-CN         # écrit docs/es, docs/fr, docs/zh-CN
```

Les commentaires dans les blocs de code délimités sont également traduits (pour les langages tels que TypeScript, JSON et bash), mais le code lui-même, le code intégré, les URL et le HTML restent inchangés, et les liens sont réécrits pour pointer vers les pages traduites. Indiquez `--skip-code-comments` pour conserver les commentaires du code en anglais. Les fichiers dont la traduction est plus récente que la source anglaise sont ignorés ; indiquez `--force` pour les retraduire. Les étiquettes de la barre de navigation et de la barre latérale, ainsi que le texte des pages d'accueil et 404 (dans `.vuepress/labels.json` ), sont traduits en `<language>/labels.json` Toute étiquette manquante dans une traduction est remplacée par l'anglais. Les versets bibliques cités sur la page d'accueil ne sont jamais traduits automatiquement : ils proviennent d'une traduction de l'API Free Use Bible. `pnpm fill:docs-verses` remplit `<language>/verses.json` pour chaque langue, en choisissant une traduction de la même manière que l'application Seed Bible. Les versets déjà présents dans un fichier sont conservés (indiquez `--force` pour les remplacer), afin qu'ils puissent être modifiés manuellement. Voir `.vuepress/verses.ts` Exécutez `pnpm translate:docs --help` pour afficher toutes les options.
