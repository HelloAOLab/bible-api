---
layout: HomeLayout
sidebar: false
title: 'API de la Biblia de uso libre'
headTitle: 'API de la Biblia de uso gratuito | AO Lab'
description: 'Una API JSON fácil de usar y con todas las funciones para las Escrituras. Sin clave de API, sin límites de uso, sin restricciones de derechos de autor.'
---

<!--
  This page uses HomeLayout, which does not render the markdown below on the site,
  and HomeLayout pages are excluded from site search in .vuepress/config.ts.
  It is shown when browsing the docs directory on GitHub.
-->

# Sitio de documentación

Este directorio contiene el código fuente de [bible.helloao.org/docs](https://bible.helloao.org/docs/) , creado con VuePress. Ejecuta el comando `pnpm dev:docs` desde la raíz del repositorio para previsualizarlo y `pnpm build:docs` para compilarlo.

## Traducción de la documentación

`pnpm translate:docs` Traduce automáticamente la documentación en inglés de este directorio a cualquier idioma compatible con la [API de traducción de Google Cloud](https://cloud.google.com/translate/docs/languages) . Se autentica con las credenciales predeterminadas de la aplicación, por lo que solo necesita un proyecto con la API de traducción de Cloud habilitada y la CLI de gcloud.

```bash
gcloud auth application-default login
gcloud auth application-default set-quota-project <project-id>

pnpm translate:docs --list-languages   # mostrar códigos de idioma compatibles
pnpm translate:docs es fr zh-CN         # escribe docs/es, docs/fr, docs/zh-CN
```

Los comentarios en los bloques de código delimitados también se traducen (para lenguajes como TypeScript, JSON y bash), pero el código en sí, el código en línea, las URL y el HTML permanecen intactos, y los enlaces se reescriben para que apunten a las páginas traducidas. Pase `--skip-code-comments` para mantener los comentarios del código en inglés. Los archivos cuya traducción sea más reciente que el código fuente en inglés se omiten; pase `--force` para volver a traducirlos. Ejecute `pnpm translate:docs --help` para todas las opciones.
