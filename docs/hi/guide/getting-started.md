---
description: 'कुछ ही मिनटों में फ्री यूज़ बाइबल एपीआई का उपयोग शुरू करें। जावास्क्रिप्ट एसडीके इंस्टॉल करें या सीधे JSON एंडपॉइंट्स को कॉल करें — किसी एपीआई कुंजी या साइन अप की आवश्यकता नहीं है।'
---

# शुरू करना

चलिए सीधे मुद्दे पर आते हैं!

## एसडीके

हमारे पास निम्नलिखित भाषाओं के लिए एपीआई क्लाइंट उपलब्ध हैं:

-   [जावास्क्रिप्ट/टाइपस्क्रिप्ट](../sdks/javascript.md)

## एपीआई

बाइबल एपीआई को JSON फाइलों के एक सेट के रूप में संरचित किया गया है जो इंटरनेट से डाउनलोड के लिए उपलब्ध हैं।

इन फाइलों का उपयोग करके, आप उपलब्ध अनुवादों की सूची, किसी विशेष अनुवाद के लिए पुस्तकों की सूची, किसी विशेष पुस्तक के लिए अध्यायों की सूची और प्रत्येक अध्याय की सामग्री प्राप्त कर सकते हैं।

ये फाइलें निम्नलिखित पथों पर उपलब्ध हैं:

-   [`https://bible.helloao.org/api/available_translations.json`](../reference/translations/README.md#available-translations)
-   [`https://bible.helloao.org/api/{translation}/books.json`](../reference/translations/README.md#list-books-in-a-translation)
-   [`https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`](../reference/translations/standard.md#get-a-chapter-from-a-translation)
-   [`https://bible.helloao.org/api/available_commentaries.json`](../reference/commentaries/README.md#available-commentaries)
-   [`https://bible.helloao.org/api/c/{commentary}/books.json`](../reference/commentaries/README.md#list-books-in-a-commentary)
-   [`https://bible.helloao.org/api/c/{commentary}/{book}/{chapter}.json`](../reference/commentaries/README.md#get-a-chapter-from-a-commentary)
-   [`https://bible.helloao.org/api/available_datasets.json`](../reference/datasets/README.md#available-datasets)
-   [`https://bible.helloao.org/api/d/{dataset}/books.json`](../reference/datasets/README.md#list-books-in-a-dataset)
-   [`https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`](../reference/datasets/README.md#get-a-chapter-from-a-dataset)

प्रत्येक एंडपॉइंट के बारे में अधिक जानकारी के लिए, [अगला पृष्ठ](./making-requests.md) देखें।
