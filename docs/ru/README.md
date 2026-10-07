---
layout: HomeLayout
sidebar: false
title: 'Бесплатный API Библии'
headTitle: 'API Библии для свободного использования | AO Lab'
description: 'Простой в использовании и полнофункциональный JSON API для работы со Священным Писанием. Не требуется ключ API, нет ограничений на использование, нет ограничений по авторским правам.'
---

<!--
  This page uses HomeLayout, which does not render the markdown below on the site,
  and HomeLayout pages are excluded from site search in .vuepress/config.ts.
  It is shown when browsing the docs directory on GitHub.
-->

# Сайт документации

В этой директории находится исходный код [bible.helloao.org/docs](https://bible.helloao.org/docs/) , собранный с помощью VuePress. Запустите команду `pnpm dev:docs` из корневой директории репозитория для предварительного просмотра и `pnpm build:docs` для сборки.

## Перевод документации

`pnpm translate:docs` Машинный перевод англоязычной документации из этого каталога на любой язык, поддерживаемый [API Google Cloud Translation](https://cloud.google.com/translate/docs/languages) . Аутентификация осуществляется с помощью учетных данных приложения по умолчанию, поэтому вам понадобится только проект с включенным API Cloud Translation и CLI gcloud:

```bash
gcloud auth application-default login
gcloud auth application-default set-quota-project <project-id>

pnpm translate:docs --list-languages   # показать поддерживаемые языковые коды
pnpm translate:docs es fr zh-CN         # пишет docs/es, docs/fr, docs/zh-CN
```

Комментарии в блоках кода, заключенных в рамки, также переводятся (для таких языков, как TypeScript, JSON и bash), но сам код, встроенный код, URL-адреса и HTML остаются неизменными, а ссылки переписываются, чтобы указывать на переведенные страницы. Передайте `--skip-code-comments` , чтобы комментарии к коду оставались на английском языке. Файлы, перевод которых новее, чем английский исходный код, пропускаются; передайте `--force` , чтобы перевести их заново. Метки навигационной панели и боковой панели, а также текст главной страницы и страницы 404, указанные в `.vuepress/labels.json` , переводятся в текст, указанный в `<language>/labels.json` Любая метка, отсутствующая в переводе, возвращается к английскому языку. Цитируемые на главной странице стихи из Библии никогда не переводятся машинным способом: они цитируются из перевода в API Free Use Bible. `pnpm fill:docs-verses` заполняет `<language>/verses.json` для каждого языка, выбирая перевод так же, как это делает приложение Seed Bible. Стихи, уже содержащиеся в файле, сохраняются (передайте `--force` , чтобы заменить их), поэтому их можно редактировать вручную. См. `.vuepress/verses.ts` Запустите пункт `pnpm translate:docs --help` для получения всех параметров.
