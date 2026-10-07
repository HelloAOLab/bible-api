---
description: 'কয়েক মিনিটের মধ্যেই ফ্রি ইউজ বাইবেল এপিআই ব্যবহার করা শুরু করুন। জাভাস্ক্রিপ্ট এসডিকে ইনস্টল করুন অথবা সরাসরি JSON এন্ডপয়েন্টগুলো কল করুন — কোনো এপিআই কী বা সাইনআপের প্রয়োজন নেই।'
---

# শুরু করা

চলুন সরাসরি শুরু করা যাক!

## এসডিকে

আমাদের নিম্নলিখিত ভাষাগুলোর জন্য এপিআই ক্লায়েন্ট রয়েছে:

-   [জাভাস্ক্রিপ্ট/টাইপস্ক্রিপ্ট](../sdks/javascript.md)

## এপিআই

বাইবেল এপিআইটি একগুচ্ছ JSON ফাইল হিসেবে গঠিত, যা ইন্টারনেট থেকে ডাউনলোড করা যায়।

এই ফাইলগুলো ব্যবহার করে আপনি উপলব্ধ অনুবাদগুলোর তালিকা, কোনো নির্দিষ্ট অনুবাদের বইগুলোর তালিকা, কোনো নির্দিষ্ট বইয়ের অধ্যায়গুলোর তালিকা এবং প্রতিটি অধ্যায়ের বিষয়বস্তু পেতে পারেন।

এই ফাইলগুলো নিম্নলিখিত পাথগুলিতে পাওয়া যাবে:

-   [`https://bible.helloao.org/api/available_translations.json`](../reference/translations/README.md#available-translations)
-   [`https://bible.helloao.org/api/{translation}/books.json`](../reference/translations/README.md#list-books-in-a-translation)
-   [`https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`](../reference/translations/standard.md#get-a-chapter-from-a-translation)
-   [`https://bible.helloao.org/api/available_commentaries.json`](../reference/commentaries/README.md#available-commentaries)
-   [`https://bible.helloao.org/api/c/{commentary}/books.json`](../reference/commentaries/README.md#list-books-in-a-commentary)
-   [`https://bible.helloao.org/api/c/{commentary}/{book}/{chapter}.json`](../reference/commentaries/README.md#get-a-chapter-from-a-commentary)
-   [`https://bible.helloao.org/api/available_datasets.json`](../reference/datasets/README.md#available-datasets)
-   [`https://bible.helloao.org/api/d/{dataset}/books.json`](../reference/datasets/README.md#list-books-in-a-dataset)
-   [`https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`](../reference/datasets/README.md#get-a-chapter-from-a-dataset)

প্রতিটি এন্ডপয়েন্ট সম্পর্কে আরও তথ্যের জন্য [পরবর্তী পৃষ্ঠা](./making-requests.md) দেখুন।
