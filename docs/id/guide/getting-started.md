---
description: 'Mulai gunakan API Alkitab Gratis dalam hitungan menit. Instal SDK JavaScript atau panggil endpoint JSON secara langsung — tidak diperlukan kunci API atau pendaftaran.'
---

# Memulai

Mari kita langsung mulai!

## SDK

Kami memiliki klien API untuk bahasa-bahasa berikut:

-   [JavaScript/TypeScript](../sdks/javascript.md)

## API

API Alkitab disusun sebagai sekumpulan file JSON yang tersedia untuk diunduh dari internet.

Dengan menggunakan berkas-berkas ini, Anda bisa mendapatkan daftar terjemahan yang tersedia, daftar buku untuk terjemahan tertentu, daftar bab untuk buku tertentu, dan isi untuk setiap bab.

File-file ini tersedia di jalur berikut:

-   [`https://bible.helloao.org/api/available_translations.json`](../reference/translations/README.md#available-translations)
-   [`https://bible.helloao.org/api/{translation}/books.json`](../reference/translations/README.md#list-books-in-a-translation)
-   [`https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`](../reference/translations/standard.md#get-a-chapter-from-a-translation)
-   [`https://bible.helloao.org/api/available_commentaries.json`](../reference/commentaries/README.md#available-commentaries)
-   [`https://bible.helloao.org/api/c/{commentary}/books.json`](../reference/commentaries/README.md#list-books-in-a-commentary)
-   [`https://bible.helloao.org/api/c/{commentary}/{book}/{chapter}.json`](../reference/commentaries/README.md#get-a-chapter-from-a-commentary)
-   [`https://bible.helloao.org/api/available_datasets.json`](../reference/datasets/README.md#available-datasets)
-   [`https://bible.helloao.org/api/d/{dataset}/books.json`](../reference/datasets/README.md#list-books-in-a-dataset)
-   [`https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`](../reference/datasets/README.md#get-a-chapter-from-a-dataset)

Untuk informasi lebih lanjut tentang setiap endpoint, lihat [halaman berikutnya](./making-requests.md) .
