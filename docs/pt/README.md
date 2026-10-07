---
layout: HomeLayout
sidebar: false
title: 'API da Bíblia de uso gratuito'
headTitle: 'API Bíblica de Uso Gratuito | AO Lab'
description: 'Uma API JSON completa e fácil de usar para as Escrituras. Sem necessidade de chave de API, sem limites de uso, sem restrições de direitos autorais.'
---

<!--
  This page uses HomeLayout, which does not render the markdown below on the site,
  and HomeLayout pages are excluded from site search in .vuepress/config.ts.
  It is shown when browsing the docs directory on GitHub.
-->

# Site de documentação

Este diretório contém o código-fonte de [bible.helloao.org/docs](https://bible.helloao.org/docs/) , desenvolvido com VuePress. Execute o comando `pnpm dev:docs` na raiz do repositório para visualizar a documentação e `pnpm build:docs` para compilá-la.

## Traduzindo a documentação

`pnpm translate:docs` Traduz automaticamente a documentação em inglês deste diretório para qualquer idioma compatível com a [API de Tradução do Google Cloud](https://cloud.google.com/translate/docs/languages) . A autenticação é feita com as Credenciais Padrão do Aplicativo, portanto, tudo o que você precisa é de um projeto com a API de Tradução do Cloud ativada e a CLI gcloud:

```bash
gcloud auth application-default login
gcloud auth application-default set-quota-project <project-id>

pnpm translate:docs --list-languages   # Mostrar códigos de idioma suportados
pnpm translate:docs es fr zh-CN         # escreve docs/es, docs/fr, docs/zh-CN
```

Os comentários em blocos de código delimitados também são traduzidos (para linguagens como TypeScript, JSON e bash), mas o código em si, o código embutido, URLs e HTML permanecem intactos, e os links são reescritos para apontar para as páginas traduzidas. Passe `--skip-code-comments` para manter os comentários do código em inglês. Arquivos cuja tradução seja mais recente que o código-fonte em inglês serão ignorados; passe `--force` para traduzi-los novamente. Execute `pnpm translate:docs --help` para todas as opções.
