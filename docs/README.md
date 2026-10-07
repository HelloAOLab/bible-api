---
layout: HomeLayout
sidebar: false
title: Free Use Bible API
headTitle: Free Use Bible API | AO Lab
description: An easy-to-use and fully featured JSON API for Scripture. No API key, no usage limits, no copyright restrictions.
---

<!--
  This page uses HomeLayout, which does not render the markdown below on the site,
  and HomeLayout pages are excluded from site search in .vuepress/config.ts.
  It is shown when browsing the docs directory on GitHub.
-->

# Documentation Site

This directory contains the source for [bible.helloao.org/docs](https://bible.helloao.org/docs/), built with VuePress. Run `pnpm dev:docs` from the repository root to preview it and `pnpm build:docs` to build it.

## Translating the Documentation

`pnpm translate:docs` machine-translates the English docs in this directory into any language supported by the
[Google Cloud Translation API](https://cloud.google.com/translate/docs/languages). It authenticates with
Application Default Credentials, so a project with the Cloud Translation API enabled and the gcloud CLI are all you need:

```bash
gcloud auth application-default login
gcloud auth application-default set-quota-project <project-id>

pnpm translate:docs --list-languages   # show supported language codes
pnpm translate:docs es fr zh-CN         # writes docs/es, docs/fr, docs/zh-CN
```

Code blocks, inline code, URLs and HTML are left untouched, and links are rewritten to point at the translated pages.
Files whose translation is newer than the English source are skipped; pass `--force` to re-translate them.
Run `pnpm translate:docs --help` for all options.
