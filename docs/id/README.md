---
layout: HomeLayout
sidebar: false
title: 'API Alkitab untuk Penggunaan Gratis'
headTitle: 'API Alkitab Gratis untuk Digunakan | AO Lab'
description: 'API JSON yang mudah digunakan dan berfitur lengkap untuk Kitab Suci. Tanpa kunci API, tanpa batasan penggunaan, tanpa batasan hak cipta.'
---

<!--
  This page uses HomeLayout, which does not render the markdown below on the site,
  and HomeLayout pages are excluded from site search in .vuepress/config.ts.
  It is shown when browsing the docs directory on GitHub.
-->

# Situs Dokumentasi

Direktori ini berisi kode sumber untuk [bible.helloao.org/docs](https://bible.helloao.org/docs/) , yang dibangun dengan VuePress. Jalankan perintah `pnpm dev:docs` dari root repositori untuk melihat pratinjau dan `pnpm build:docs` untuk membangunnya.

## Menerjemahkan Dokumentasi

`pnpm translate:docs` Menerjemahkan dokumen berbahasa Inggris di direktori ini ke dalam bahasa apa pun yang didukung oleh [Google Cloud Translation API](https://cloud.google.com/translate/docs/languages) . Proses otentikasi menggunakan Kredensial Default Aplikasi, jadi Anda hanya memerlukan proyek dengan Cloud Translation API yang diaktifkan dan CLI gcloud:

```bash
gcloud auth application-default login
gcloud auth application-default set-quota-project <project-id>

pnpm translate:docs --list-languages   # Tampilkan kode bahasa yang didukung
pnpm translate:docs es fr zh-CN         # menulis docs/es, docs/fr, docs/zh-CN
```

Komentar dalam blok kode berpagar juga diterjemahkan (untuk bahasa seperti TypeScript, JSON, dan bash), tetapi kode itu sendiri, kode sebaris, URL, dan HTML dibiarkan tidak tersentuh, dan tautan ditulis ulang untuk mengarah ke halaman yang diterjemahkan. Lewati `--skip-code-comments` untuk mempertahankan komentar kode dalam bahasa Inggris. File yang terjemahannya lebih baru daripada sumber bahasa Inggris dilewati; lewati `--force` untuk menerjemahkannya kembali. Label navbar dan sidebar serta teks halaman beranda dan 404, di `.vuepress/labels.json` , diterjemahkan ke `<language>/labels.json` Label apa pun yang hilang dari terjemahan akan kembali ke bahasa Inggris. Ayat-ayat Alkitab yang dikutip di halaman beranda tidak pernah diterjemahkan mesin: ayat-ayat tersebut dikutip dari terjemahan di API Alkitab Penggunaan Gratis. `pnpm fill:docs-verses` mengisi `<language>/verses.json` untuk setiap bahasa, memilih terjemahan seperti yang dilakukan aplikasi Seed Bible. Ayat-ayat yang sudah ada dalam file dipertahankan (lewati `--force` untuk menggantinya), sehingga dapat diedit secara manual. Lihat `.vuepress/verses.ts` Jalankan `pnpm translate:docs --help` untuk semua opsi.
