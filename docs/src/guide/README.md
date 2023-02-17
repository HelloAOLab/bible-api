# Introduction

The Bible, the very inspired word of God, is the most important set of documents in the history of the world. It has been studied for countless generations by cultures from all around the world, and it contains many foundational truths upon which our entire existence is built.

## About Us

[AO Lab](https://linktr.ee/helloaolab) is a non-profit company dedicated to loving and living out the Word of God. The goal of this project is to make the Bible freely available to anyone who should need it in a format that is optimized for use by applications.

We are excited to partner with the [BSB team](https://bereanbibles.com/). Without their help and support, this API would not be available.

If you’d like to learn more about the BSB please [click here](https://bereanbibles.com/about-berean-study-bible/).

## A Note About Translations

Originally written in ancient Hebrew, Greek and Aramaic, the Bible is now primarily consumed as a set of translations into popular modern languages like English, German, and Spanish. Because ancient Hebrew and Greek are very different from our modern languages, there are many decisions that a translator must make in order to accurately and precisely render the Bible in a modern language like English. As a result, translation is ultimately a creative process of interpretation that requires much deliberation and historical context. Therefore, there is no one definitive translation of the Bible into a modern language. This by no means discounts the reliability of the scriptures in general, but it does leave us open to the risk of misunderstanding the original author’s intent if we only read a single translation.

Today many separate translations of the Bible have been made that each attempt different approaches and give weight to different ideas in order to try and make the Bible accessible and understandable in a precise and accurate manner. Every translator seeks to make the Bible comprehensible in a given language, but they may take different approaches to that end. 

::: tip
For example, translators historically have to decide between taking a "word-for-word" approach to translation where they try to identify the original meanings of the Hebrew and Greek words and render the equivalent English/Spanish/etc, or a "thought-for-thought" approach where they try to find the original meaning of phrases and concepts and then translate an equivalent meaning.

Many modern translations take a combination of approaches to try and arrive at something that feels natural in the target language while also maintaining the accuracy of the originals.
:::

It is important to note that the vast majority of translations agree in content, but a deep reading of any particular translation can be misleading because there are connotations and undertones which exist in the original language that may be hard to represent in the translation, and likewise suggested ideas which exist in the translation language that may not be the precise intention of the original author if not studied carefully.

When reading the Bible, it is important to ask yourself what you are trying to understand, and then select one or more translations which can help you achieve your task. For example, if you are simply reading The Bible for enjoyment and basic insight, then choosing any modern translation like the [BSB](https://bereanbibles.com/), [ESV](https://www.esv.org/), or [NASB](https://www.lockman.org/new-american-standard-bible-nasb/) translations. However, if you are trying to understand a particular phrasing or connotation, then it is best to compare multiple translations against each other or even grab an interlinear bible which makes it easy for you to see the source Hebrew/Greek of a particular passage.

But most important of all is prayer for wisdom of guidance of the Holy Spirit, for in the words of Jesus: **“...He, the Spirit of truth, will guide you into all the truth.” - John 16:13**

## Getting Started

Let's get right into it! The Bible API is structured as a set of JSON files that are available for download from the internet.

Using these files, you can get a list of available translations, the list of books for a particular translation, the list of chapters for a particular book, and the content for each chapter.

These files are available at the following paths:

-   `https://bible-api.pages.dev/api/available_translations.json`
-   `https://bible-api.pages.dev/api/{translation}/books.json`
-   `https://bible-api.pages.dev/api/{translation}/{book}/{chapter}.json`

For more information about each endpoint, see the [next page](./making-requests.md).