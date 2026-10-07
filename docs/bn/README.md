---
layout: HomeLayout
sidebar: false
title: 'বাইবেল এপিআই বিনামূল্যে ব্যবহার করুন'
headTitle: 'ফ্রি ইউজ বাইবেল এপিআই | এও ল্যাব'
description: 'ধর্মগ্রন্থের জন্য একটি সহজে ব্যবহারযোগ্য এবং পূর্ণাঙ্গ বৈশিষ্ট্যসম্পন্ন JSON API। কোনো API কী নেই, ব্যবহারের কোনো সীমাবদ্ধতা নেই, কোনো কপিরাইট বিধিনিষেধ নেই।'
---

<!--
  This page uses HomeLayout, which does not render the markdown below on the site,
  and HomeLayout pages are excluded from site search in .vuepress/config.ts.
  It is shown when browsing the docs directory on GitHub.
-->

# ডকুমেন্টেশন সাইট

এই ডিরেক্টরিতে [bible.helloao.org/docs-](https://bible.helloao.org/docs/) এর সোর্স কোড রয়েছে, যা VuePress দিয়ে বিল্ড করা হয়েছে। এটি প্রিভিউ করার জন্য রিপোজিটরি রুট থেকে `pnpm dev:docs` এবং বিল্ড করার জন্য `pnpm build:docs` রান করুন।

## ডকুমেন্টেশন অনুবাদ করা

এটি এই ডিরেক্টরিতে থাকা ইংরেজি ডকুমেন্টগুলোকে [গুগল ক্লাউড ট্রান্সলেশন এপিআই](https://cloud.google.com/translate/docs/languages) দ্বারা সমর্থিত যেকোনো ভাষায় `pnpm translate:docs` -ট্রান্সলেট করে। এটি অ্যাপ্লিকেশন ডিফল্ট ক্রেডেনশিয়াল ব্যবহার করে অথেন্টিকেট করে, তাই ক্লাউড ট্রান্সলেশন এপিআই সক্রিয় করা একটি প্রজেক্ট এবং gcloud CLI-ই আপনার প্রয়োজন:

```bash
gcloud auth application-default login
gcloud auth application-default set-quota-project <project-id>

pnpm translate:docs --list-languages   # সমর্থিত ভাষা কোডগুলি দেখান
pnpm translate:docs es fr zh-CN         # docs/es, docs/fr, docs/zh-CN লেখে
```

ফেন্সড কোড ব্লকের ভেতরের কমেন্টগুলোও অনুবাদ করা হয় (যেমন TypeScript, JSON এবং bash-এর ক্ষেত্রে), কিন্তু মূল কোড, ইনলাইন কোড, URL এবং HTML অপরিবর্তিত থাকে, এবং লিঙ্কগুলো নতুন করে লিখে অনূদিত পেজগুলোতে নির্দেশ করা হয়। কোডের কমেন্ট ইংরেজিতে রাখতে `--skip-code-comments` পাস করুন। যে ফাইলগুলোর অনুবাদ ইংরেজি সোর্সের চেয়ে নতুন, সেগুলো বাদ দেওয়া হবে; সেগুলোকে পুনরায় অনুবাদ করতে `--force` পাস করুন। সমস্ত অপশনের জন্য `pnpm translate:docs --help` রান করুন।
