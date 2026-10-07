---
layout: HomeLayout
sidebar: false
title: 'Kostenlose Nutzung der Bibel-API'
headTitle: 'Kostenlose Bibel-API | AO Lab'
description: 'Eine benutzerfreundliche und voll ausgestattete JSON-API für die Heilige Schrift. Kein API-Schlüssel, keine Nutzungsbeschränkungen, keine Urheberrechtsbeschränkungen.'
---

<!--
  This page uses HomeLayout, which does not render the markdown below on the site,
  and HomeLayout pages are excluded from site search in .vuepress/config.ts.
  It is shown when browsing the docs directory on GitHub.
-->

# Dokumentationsseite

Dieses Verzeichnis enthält den Quellcode für [bible.helloao.org/docs](https://bible.helloao.org/docs/) , erstellt mit VuePress. Führen Sie Befehl `pnpm dev:docs` im Stammverzeichnis des Repositorys aus, um eine Vorschau anzuzeigen, und `pnpm build:docs` um das Projekt zu kompilieren.

## Übersetzung der Dokumentation

`pnpm translate:docs` Die englischen Dokumente in diesem Verzeichnis werden maschinell in jede von der [Google Cloud Translation API](https://cloud.google.com/translate/docs/languages) unterstützte Sprache übersetzt. Die Authentifizierung erfolgt mit den Standardanmeldeinformationen der Anwendung. Sie benötigen also lediglich ein Projekt mit aktivierter Cloud Translation API und die gcloud CLI.

```bash
gcloud auth application-default login
gcloud auth application-default set-quota-project <project-id>

pnpm translate:docs --list-languages   # Unterstützte Sprachcodes anzeigen
pnpm translate:docs es fr zh-CN         # schreibt Dokumente in den Sprachen es, fr und zh-CN.
```

Kommentare in Codeblöcken werden ebenfalls übersetzt (für Sprachen wie TypeScript, JSON und Bash), der eigentliche Code, Inline-Code, URLs und HTML bleiben jedoch unverändert. Links werden so umgeschrieben, dass sie auf die übersetzten Seiten verweisen. Geben Sie `--skip-code-comments` an, um die Codekommentare auf Englisch zu belassen. Dateien, deren Übersetzung neuer als die englische Quelldatei ist, werden übersprungen; geben Sie `--force` an, um sie neu zu übersetzen. Führen Sie `pnpm translate:docs --help` aus, um alle Optionen zu erhalten.
