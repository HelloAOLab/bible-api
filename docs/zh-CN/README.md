---
layout: HomeLayout
sidebar: false
title: '免费使用圣经API'
headTitle: '免费使用圣经 API | AO 实验室'
description: '一个易于使用且功能齐全的圣经JSON API。无需API密钥，无使用限制，无版权限制。'
---

<!--
  This page uses HomeLayout, which does not render the markdown below on the site,
  and HomeLayout pages are excluded from site search in .vuepress/config.ts.
  It is shown when browsing the docs directory on GitHub.
-->

# 文档网站

此目录包含使用 VuePress 构建的[bible.helloao.org/docs](https://bible.helloao.org/docs/)的源代码。从仓库根目录运行命令`pnpm dev:docs`可预览，运行命令`pnpm build:docs`可构建。

## 翻译文档

`pnpm translate:docs`将此目录中的英文文档机器翻译成[Google Cloud Translation API](https://cloud.google.com/translate/docs/languages)支持的任何语言。它使用应用程序默认凭据进行身份验证，因此您只需要一个启用了 Cloud Translation API 的项目和 gcloud CLI 即可：

```bash
gcloud auth application-default login
gcloud auth application-default set-quota-project <project-id>

pnpm translate:docs --list-languages   # 显示支持的语言代码
pnpm translate:docs es fr zh-CN         # 编写文档（西班牙语、法语、中文）。
```

代码块内的注释也会被翻译（例如 TypeScript、JSON 和 bash 等语言），但代码本身、内联代码、URL 和 HTML 保持不变，链接会被重写以指向已翻译的页面。传递参数`--skip-code-comments`可保留英文代码注释。翻译版本比英文源文件更新的文件将被跳过；传递参数`--force`可重新翻译这些文件。运行参数`pnpm translate:docs --help`可启用所有选项。
