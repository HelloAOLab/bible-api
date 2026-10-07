---
layout: HomeLayout
sidebar: false
title: 'बाइबिल एपीआई का निःशुल्क उपयोग करें'
headTitle: 'बाइबिल एपीआई का निःशुल्क उपयोग | एओ लैब'
description: 'धर्मग्रंथों के लिए एक उपयोग में आसान और पूर्ण विशेषताओं से युक्त JSON API। कोई API कुंजी नहीं, कोई उपयोग सीमा नहीं, कोई कॉपीराइट प्रतिबंध नहीं।'
---

<!--
  This page uses HomeLayout, which does not render the markdown below on the site,
  and HomeLayout pages are excluded from site search in .vuepress/config.ts.
  It is shown when browsing the docs directory on GitHub.
-->

# प्रलेखन साइट

इस डायरेक्टरी में VuePress का उपयोग करके निर्मित [bible.helloao.org/docs](https://bible.helloao.org/docs/) का स्रोत कोड मौजूद है। इसका पूर्वावलोकन करने के लिए रिपॉजिटरी रूट से कमांड `pnpm dev:docs` चलाएँ और इसे बिल्ड करने के लिए `pnpm build:docs` चलाएँ।

## दस्तावेज़ का अनुवाद करना

`pnpm translate:docs` कमांड इस डायरेक्टरी में मौजूद अंग्रेज़ी दस्तावेज़ों का [Google क्लाउड ट्रांसलेशन API](https://cloud.google.com/translate/docs/languages) द्वारा समर्थित किसी भी भाषा में मशीन अनुवाद करता है। यह एप्लिकेशन डिफ़ॉल्ट क्रेडेंशियल्स के साथ प्रमाणित होता है, इसलिए क्लाउड ट्रांसलेशन API सक्षम वाला एक प्रोजेक्ट और gcloud CLI ही काफी हैं।

```bash
gcloud auth application-default login
gcloud auth application-default set-quota-project <project-id>

pnpm translate:docs --list-languages   # समर्थित भाषा कोड दिखाएँ
pnpm translate:docs es fr zh-CN         # docs/es, docs/fr, docs/zh-CN लिखता है
```

कोड ब्लॉक में मौजूद टिप्पणियों का भी अनुवाद किया जाता है (टाइपस्क्रिप्ट, JSON और बैश जैसी भाषाओं के लिए), लेकिन मूल कोड, इनलाइन कोड, URL और HTML अपरिवर्तित रहते हैं, और लिंक को अनुवादित पृष्ठों पर इंगित करने के लिए पुनः लिखा जाता है। कोड टिप्पणियों को अंग्रेज़ी में रखने के लिए `--skip-code-comments` पास करें। जिन फ़ाइलों का अनुवाद अंग्रेज़ी मूल से नया है, उन्हें छोड़ दिया जाता है; उनका पुनः अनुवाद करने के लिए `--force` पास करें। नेविगेशन बार और साइडबार लेबल, साथ ही होम और 404 पृष्ठों का पाठ, जो `.vuepress/labels.json` में है, `<language>/labels.json` में अनुवादित किया जाता है। अनुवाद से अनुपस्थित कोई भी लेबल अंग्रेज़ी में वापस आ जाता है। होम पेज पर उद्धृत बाइबल की आयतों का मशीन अनुवाद कभी नहीं किया जाता: वे फ्री यूज़ बाइबल API में उपलब्ध अनुवाद से उद्धृत की जाती हैं। `pnpm fill:docs-verses` प्रत्येक भाषा के लिए `<language>/verses.json` को भरता है, और सीड बाइबल ऐप की तरह ही अनुवाद का चयन करता है। फ़ाइल में पहले से मौजूद आयतों को रखा जाता है (उन्हें बदलने के लिए `--force` पास करें), ताकि उन्हें मैन्युअल रूप से संपादित किया जा सके। `.vuepress/verses.ts` देखें। सभी विकल्पों के लिए `pnpm translate:docs --help` चलाएँ।
