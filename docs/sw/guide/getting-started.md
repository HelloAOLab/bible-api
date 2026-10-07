---
description: 'Anza kutumia API ya Matumizi ya Bure ya Biblia kwa dakika chache. Sakinisha SDK ya JavaScript au piga simu sehemu za mwisho za JSON moja kwa moja — hakuna ufunguo wa API au usajili unaohitajika.'
---

# Kuanza

Hebu tuingie moja kwa moja!

## SDK

Tuna wateja wa API kwa lugha zifuatazo:

-   [JavaScript/TypeScript](../sdks/javascript.md)

## API

API ya Biblia imeundwa kama seti ya faili za JSON zinazopatikana kwa kupakuliwa kutoka kwenye mtandao.

Kwa kutumia faili hizi, unaweza kupata orodha ya tafsiri zinazopatikana, orodha ya vitabu vya tafsiri fulani, orodha ya sura za kitabu fulani, na maudhui ya kila sura.

Faili hizi zinapatikana katika njia zifuatazo:

-   [`https://bible.helloao.org/api/available_translations.json`](../reference/translations/README.md#available-translations)
-   [`https://bible.helloao.org/api/{translation}/books.json`](../reference/translations/README.md#list-books-in-a-translation)
-   [`https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`](../reference/translations/standard.md#get-a-chapter-from-a-translation)
-   [`https://bible.helloao.org/api/available_commentaries.json`](../reference/commentaries/README.md#available-commentaries)
-   [`https://bible.helloao.org/api/c/{commentary}/books.json`](../reference/commentaries/README.md#list-books-in-a-commentary)
-   [`https://bible.helloao.org/api/c/{commentary}/{book}/{chapter}.json`](../reference/commentaries/README.md#get-a-chapter-from-a-commentary)
-   [`https://bible.helloao.org/api/available_datasets.json`](../reference/datasets/README.md#available-datasets)
-   [`https://bible.helloao.org/api/d/{dataset}/books.json`](../reference/datasets/README.md#list-books-in-a-dataset)
-   [`https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`](../reference/datasets/README.md#get-a-chapter-from-a-dataset)

Kwa maelezo zaidi kuhusu kila sehemu ya mwisho, tazama [ukurasa unaofuata](./making-requests.md) .
