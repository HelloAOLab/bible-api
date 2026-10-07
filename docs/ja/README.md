---
layout: HomeLayout
sidebar: false
title: '無料で使用できる聖書API'
headTitle: '無料で使用できる聖書API | AO Lab'
description: '聖書用の使いやすく機能豊富なJSON API。APIキー不要、使用制限なし、著作権制限なし。'
---

<!--
  This page uses HomeLayout, which does not render the markdown below on the site,
  and HomeLayout pages are excluded from site search in .vuepress/config.ts.
  It is shown when browsing the docs directory on GitHub.
-->

# ドキュメントサイト

このディレクトリには、VuePressで構築された[bible.helloao.org/docs](https://bible.helloao.org/docs/)のソースコードが含まれています。リポジトリのルートディレクトリから`pnpm dev:docs`実行するとプレビューが表示され、 `pnpm build:docs`実行するとビルドされます。

## ドキュメントの翻訳

`pnpm translate:docs`このディレクトリ内の英語のドキュメントを[、Google Cloud Translation API](https://cloud.google.com/translate/docs/languages)でサポートされている任意の言語に機械翻訳します。アプリケーションのデフォルト認証情報で認証を行うため、Cloud Translation API が有効になっているプロジェクトと gcloud CLI があれば十分です。

```bash
gcloud auth application-default login
gcloud auth application-default set-quota-project <project-id>

pnpm translate:docs --list-languages   # サポートされている言語コードを表示します
pnpm translate:docs es fr zh-CN         # docs/es、docs/fr、docs/zh-CN を書き込む
```

フェンスで囲まれたコードブロック内のコメントも翻訳されます（TypeScript、JSON、bashなどの言語の場合）。ただし、コード自体、インラインコード、URL、HTMLは変更されず、リンクは翻訳されたページを指すように書き換えられます。コードコメントを英語のままにするには、 `--skip-code-comments`渡します。英語のソースよりも新しい翻訳のファイルはスキップされます。再翻訳するには、 `--force`を渡します。すべてのオプションを実行するには、 `pnpm translate:docs --help`実行します。
