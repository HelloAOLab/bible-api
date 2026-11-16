/**
 * The "Paul's letters … You" timeline on the home page: one stop per
 * milestone, from Paul's command to read his letter aloud to the reader.
 * The reader's dot on the relay line can be dragged through them (desktop
 * only). Drawn by components/RelayTimeline.vue.
 *
 * `acts` names which of the five activities in the #since paragraph the
 * milestone shows, by position: copying, translating, revising, adapting,
 * distributing. Each `src` is a citation link.
 *
 * The milestones are English only for now; the panel's own words are in
 * labels.json under home.timeline.
 */

export const RELAY_ACTS = [
    'copying',
    'translating',
    'revising',
    'adapting',
    'distributing',
] as const;

export type RelayAct = (typeof RELAY_ACTS)[number];

export interface RelayMilestone {
    when: string;
    title: string;
    body: string;
    acts: RelayAct[];
    place: string;
    note: string;
    src: { t: string; u: string }[];
}

export const RELAY_MILESTONES: RelayMilestone[] = [
    {
        "when": "First century AD",
        "title": "Read this letter to everyone",
        "body": "Paul charges the Thessalonian church to have his letter read to all the brothers.",
        "acts": [
            "distributing"
        ],
        "place": "Thessalonica",
        "note": "A command to read aloud. It does not itself specify a copying procedure or a translation. The date labels the apostolic period, not a precisely dated surviving manuscript.",
        "src": [
            {
                "t": "1 Thessalonians 5:27 · AAB",
                "u": "https://seedbible.org/?translation=AAB&book=1TH&chapter=5&verse=27"
            }
        ]
    },
    {
        "when": "First century AD",
        "title": "Let the next church read it too",
        "body": "Paul directs Colossae and Laodicea to exchange letters for reading in both churches.",
        "acts": [
            "distributing"
        ],
        "place": "Colossae and Laodicea",
        "note": "Direct evidence for intended circulation. The verse does not say whether the exchange used originals, copies, or both.",
        "src": [
            {
                "t": "Colossians 4:16 · AAB",
                "u": "https://seedbible.org/?translation=AAB&book=COL&chapter=4&verse=16"
            }
        ]
    },
    {
        "when": "Late first century AD",
        "title": "Corinth is told to read Paul again",
        "body": "Clement tells the Corinthians to take up Paul’s earlier letter and attend to its teaching.",
        "acts": [
            "distributing"
        ],
        "place": "Rome → Corinth",
        "note": "An early reception witness, conventionally dated near the end of the first century. It establishes continued access to 1 Corinthians, not the identity of a surviving copy.",
        "src": [
            {
                "t": "1 Clement 47",
                "u": "https://www.newadvent.org/fathers/1010.htm"
            }
        ]
    },
    {
        "when": "Early second century AD",
        "title": "Philippi still studies Paul",
        "body": "Polycarp urges the Philippians to study the letter Paul wrote to them. His own letter draws repeatedly on Paul’s writings.",
        "acts": [
            "distributing"
        ],
        "place": "Smyrna → Philippi",
        "note": "The date is approximate; the letter’s dating and possible composition in stages are discussed in scholarship. Quoting Paul demonstrates reception, not a new Bible translation.",
        "src": [
            {
                "t": "Polycarp to the Philippians 3",
                "u": "https://www.newadvent.org/fathers/0136.htm"
            },
            {
                "t": "University of Helsinki · introduction",
                "u": "https://libraryguides.helsinki.fi/hulce_epistula_polycarpi/introduction"
            }
        ]
    },
    {
        "when": "AD 180",
        "title": "Paul’s letters reach North Africa",
        "body": "At the trial of the Scillitan martyrs in Carthage, Speratus identifies books and Paul’s letters among their possessions.",
        "acts": [
            "distributing"
        ],
        "place": "Carthage, North Africa",
        "note": "The trial record attests possession of the letters. It does not identify their language, so this stop does not claim that these particular copies were Latin.",
        "src": [
            {
                "t": "Acts of the Scillitan Martyrs",
                "u": "https://www.newadvent.org/fathers/1013.htm"
            }
        ]
    },
    {
        "when": "c. AD 200",
        "title": "Paul’s letters are collected in a book",
        "body": "Papyrus 46 preserves a substantial Greek collection of Paul’s letters, copied onto papyrus and bound as a codex.",
        "acts": [
            "copying",
            "adapting"
        ],
        "place": "Egyptian manuscript tradition",
        "note": "Palaeographic dating is approximate, usually late second or early third century. Adapting refers to collecting and presenting letters in a book, not rewriting their message. Hebrews is present in this ancient collection without settling its authorship.",
        "src": [
            {
                "t": "CSNTM · Papyrus 46",
                "u": "https://manuscripts.csntm.org/manuscript/View/GA_P46"
            },
            {
                "t": "University of Michigan · P46",
                "u": "https://apps.lib.umich.edu/files/collections/papyrus/k12/reading/Paul/perspective.html"
            }
        ]
    },
    {
        "when": "c. AD 200",
        "title": "A copy of Titus survives",
        "body": "Papyrus 32 preserves portions of Titus in Greek, another physical witness to the copying of the letters.",
        "acts": [
            "copying"
        ],
        "place": "Now in Manchester",
        "note": "CSNTM describes it as possibly second century, around AD 200. This date is approximate; the fragment is not an original letter.",
        "src": [
            {
                "t": "CSNTM · Papyrus 32",
                "u": "https://manuscripts.csntm.org/manuscript/View/GA_P32"
            }
        ]
    },
    {
        "when": "Third century AD",
        "title": "More letters are copied on papyrus",
        "body": "Papyrus 30 preserves fragments of another Greek manuscript of Paul’s letters.",
        "acts": [
            "copying"
        ],
        "place": "Now in Ghent",
        "note": "The date is a century-level catalogue assignment, not a dated colophon. It is independent surviving evidence of copying, not a claimed ancestor of every later text.",
        "src": [
            {
                "t": "CSNTM · Papyrus 30",
                "u": "https://manuscripts.csntm.org/manuscript/View/GA_P30"
            }
        ]
    },
    {
        "when": "Third century AD",
        "title": "Another papyrus copy endures",
        "body": "Papyrus 49 preserves another fragmentary Greek copy from the Pauline manuscript tradition.",
        "acts": [
            "copying"
        ],
        "place": "Now at Yale",
        "note": "The manuscript catalogue assigns it to the third century. Its position after P30 is for browsing and does not imply that their exact chronological order is known.",
        "src": [
            {
                "t": "CSNTM · Papyrus 49",
                "u": "https://manuscripts.csntm.org/manuscript/View/GA_P49"
            }
        ]
    },
    {
        "when": "Fourth century AD",
        "title": "Paul is copied into a Greek Bible",
        "body": "Codex Vaticanus includes Romans, Corinthians, Galatians, Ephesians, and other letters in a large Greek biblical codex.",
        "acts": [
            "copying"
        ],
        "place": "Now in the Vatican Library",
        "note": "The Vatican catalogue dates the codex to the fourth century. Its surviving ancient New Testament is incomplete; this stop does not call it a complete surviving New Testament.",
        "src": [
            {
                "t": "Vatican Library · Vat. gr. 1209",
                "u": "https://digi.vatlib.it/view/MSS_Vat.gr.1209"
            }
        ]
    },
    {
        "when": "Fourth century AD",
        "title": "A complete New Testament survives",
        "body": "Codex Sinaiticus preserves the New Testament in Greek, including the letters from Romans through Philemon.",
        "acts": [
            "copying"
        ],
        "place": "Now held in several collections",
        "note": "The manuscript is fourth century. “Complete” refers to its New Testament text; much of the original Old Testament is lost.",
        "src": [
            {
                "t": "British Library · Sinaiticus New Testament",
                "u": "https://searcharchives.bl.uk/catalog/040-002169730"
            }
        ]
    },
    {
        "when": "Early fifth century AD",
        "title": "Paul is read in Syriac",
        "body": "The Peshitta New Testament takes shape in Syriac. Early surviving manuscripts include copies of Paul’s letters.",
        "acts": [
            "translating",
            "copying"
        ],
        "place": "Syriac-speaking churches",
        "note": "The reference dates the early Peshitta to the beginning of the fifth century and lists fifth- and sixth-century Pauline witnesses. This is a version-level date, not a named translator’s completion date.",
        "src": [
            {
                "t": "Gorgias Encyclopedic Dictionary · NT manuscripts",
                "u": "https://gedsh.bethmardutho.org/Bible-New-Testament-manuscripts.html"
            }
        ]
    },
    {
        "when": "AD 534",
        "title": "A donor pays for another copy",
        "body": "A Syriac manuscript of Paul’s letters is copied for a monastery library in Edessa. Its colophon records the year and its sponsor.",
        "acts": [
            "copying",
            "distributing"
        ],
        "place": "Edessa",
        "note": "The catalogue transcribes a colophon dating the manuscript to AD 534 and describing its commissioning. The donor’s personal name is damaged.",
        "src": [
            {
                "t": "Syriaca · British Library Add. 14479",
                "u": "https://bl.syriac.uk/ms/164"
            }
        ]
    },
    {
        "when": "AD 546–547",
        "title": "A Latin copy is checked and corrected",
        "body": "Victor of Capua corrects Codex Fuldensis, a Latin New Testament manuscript that includes Paul’s letters.",
        "acts": [
            "copying",
            "revising"
        ],
        "place": "Capua, Italy",
        "note": "Houghton’s catalogue specifically discusses Victor’s corrections in Paul. Revising here means checking and correcting a transmitted text, not claiming every historical correction was right.",
        "src": [
            {
                "t": "Houghton · Latin NT manuscript catalogue",
                "u": "https://academic.oup.com/book/12425/chapter/162898271"
            },
            {
                "t": "National Library of Ireland · microfilm record",
                "u": "https://catalogue.nli.ie/Record/MS_UR_010505"
            }
        ]
    },
    {
        "when": "AD 615–616",
        "title": "Syriac is compared with Greek",
        "body": "Thomas of Harkel prepares a Syriac recension with Greek variant readings. Its subscriptions explicitly include Paul’s letters.",
        "acts": [
            "translating",
            "revising"
        ],
        "place": "Near Alexandria, Egypt",
        "note": "The subscriptions date the work to AD 615/616. Its relationship to the earlier Philoxenian version is complex, so it is described here as a recension rather than a simple reprint.",
        "src": [
            {
                "t": "Gorgias Encyclopedic Dictionary · Harklean Version",
                "u": "https://gedsh.bethmardutho.org/Harqlean-Version.html"
            }
        ]
    },
    {
        "when": "By AD 716",
        "title": "A whole Bible travels toward Rome",
        "body": "Codex Amiatinus, copied at Wearmouth–Jarrow, carries Paul’s letters within a complete Latin Bible sent toward Rome.",
        "acts": [
            "copying",
            "distributing"
        ],
        "place": "Northumbria → Italy",
        "note": "The manuscript was produced before AD 716. The date marks its departure from England, not the first translation of its contents.",
        "src": [
            {
                "t": "University of Utah · Codex Amiatinus",
                "u": "https://lib.utah.edu/collections/rarebooks/database/medieval-manuscript-facsimiles/bible-texts/codex-amiatinus.php"
            },
            {
                "t": "National Endowment for the Humanities · research record",
                "u": "https://awardsearch.neh.gov/AwardDetail.aspx?gn=FB-51662-05"
            }
        ]
    },
    {
        "when": "c. AD 807–808",
        "title": "The New Testament is copied in Ireland",
        "body": "The Book of Armagh preserves the Latin New Testament alongside material associated with Patrick.",
        "acts": [
            "copying"
        ],
        "place": "Armagh, Ireland",
        "note": "The dated inscription concerns part of the manuscript’s production in AD 807/808. This is not a claim that every page was written in a single year.",
        "src": [
            {
                "t": "Royal Irish Academy · Book of Armagh",
                "u": "https://confessio.ie/manuscripts/dublin"
            },
            {
                "t": "Trinity College Dublin · medieval Latin",
                "u": "https://www.tcd.ie/library/research-collections/subject-strengths/medieval/medieval-latin.php"
            }
        ]
    },
    {
        "when": "c. AD 830–840",
        "title": "A revised Latin Bible is copied again",
        "body": "Scribes at Tours produce the Moutier-Grandval Bible using the Latin text revised by Alcuin. Paul’s letters travel within the whole Bible.",
        "acts": [
            "copying",
            "revising"
        ],
        "place": "Tours, France",
        "note": "This dates a surviving copy of Alcuin’s revised text, not Alcuin’s own work, which preceded his death in AD 804.",
        "src": [
            {
                "t": "British Library · Moutier-Grandval Bible",
                "u": "https://www.bl.uk/stories/blogs/posts/the-moutier-grandval-bible-loaned-to-jura"
            }
        ]
    },
    {
        "when": "Ninth century AD",
        "title": "Greek and Latin share the page",
        "body": "Codex Boernerianus places a Latin rendering between the lines of the Greek text of Paul’s letters.",
        "acts": [
            "copying",
            "adapting"
        ],
        "place": "Now in Dresden",
        "note": "A bilingual presentation is a concrete adaptation for reading and comparison. The ninth-century date is approximate; the Latin rendering was not necessarily first translated for this copy.",
        "src": [
            {
                "t": "SLUB Dresden · Pauline manuscript research",
                "u": "https://www.slub-dresden.de/en/research/digital-humanities/codex-boernerianus-gemeinsame-forschung-an-den-paulusbriefen"
            },
            {
                "t": "CSNTM · GA 012",
                "u": "https://manuscripts.csntm.org/manuscript/View/GA_012"
            }
        ]
    },
    {
        "when": "AD 867",
        "title": "Paul is translated into Arabic",
        "body": "Bishr ibn al-Sirri translates Paul’s letters from Syriac into Arabic, annotates them, and copies them in Damascus.",
        "acts": [
            "translating",
            "copying",
            "adapting"
        ],
        "place": "Damascus",
        "note": "The colophon dates this work to September/October AD 867. The manuscript distinguishes biblical text from explanatory annotations; the notes are not presented as Paul’s own words.",
        "src": [
            {
                "t": "Vevian Zaki · study of Sinai Arabic 151",
                "u": "https://biblia-arabica.com/lost-in-the-margins-reference-marks-in-ms-sinai-arabic-151/"
            }
        ]
    },
    {
        "when": "Eleventh century AD",
        "title": "The letters are read in Slavonic",
        "body": "The Enina Apostolos preserves Slavonic Acts-and-Epistles readings in an early Cyrillic manuscript.",
        "acts": [
            "translating",
            "copying",
            "adapting"
        ],
        "place": "Bulgaria",
        "note": "UNESCO dates the surviving fragment to the eleventh century and connects it to earlier Greek-to-Slavonic translation. This is a liturgical selection, not an intact copy of all Paul’s letters.",
        "src": [
            {
                "t": "UNESCO · Enina Apostolos",
                "u": "https://www.unesco.org/en/memory-world/enina-apostolos-old-bulgarian-cyrillic-manuscript-fragment-11th-century"
            }
        ]
    },
    {
        "when": "Twelfth–thirteenth centuries AD",
        "title": "Worn pages are copied and replaced",
        "body": "Readers preserve the AD 534 Syriac manuscript by replacing lost leaves, including the beginning of Romans.",
        "acts": [
            "copying"
        ],
        "place": "British Library Add. 14479",
        "note": "The catalogue assigns the first leaf, with Romans 1:1–10, to the twelfth century and two paper leaves to the thirteenth. These dates concern repairs, not a new translation.",
        "src": [
            {
                "t": "Syriaca · later replacement leaves",
                "u": "https://bl.syriac.uk/ms/164"
            }
        ]
    },
    {
        "when": "c. AD 1385",
        "title": "Paul is copied in Middle English",
        "body": "A surviving Wycliffite Bible includes Romans, Corinthians, Galatians, and the other letters in an English translation from Latin.",
        "acts": [
            "translating",
            "copying"
        ],
        "place": "England",
        "note": "The British Library dates this surviving Bible to about AD 1385. It witnesses the earlier Wycliffite translation, not proof that John Wycliffe personally translated each book.",
        "src": [
            {
                "t": "British Library · Egerton 617–618",
                "u": "https://searcharchives.bl.uk/catalog/032-001983667"
            },
            {
                "t": "British Library · New Testament contents",
                "u": "https://searcharchives.bl.uk/catalog/040-001983669"
            }
        ]
    },
    {
        "when": "c. AD 1454–1455",
        "title": "Printing multiplies the copies",
        "body": "Gutenberg’s Latin Bible reproduces the whole Bible, including Paul’s letters, with movable type.",
        "acts": [
            "copying",
            "distributing"
        ],
        "place": "Mainz, Germany",
        "note": "The publication is dated approximately AD 1454/1455. It is an early European typographic Bible, not the invention of printing worldwide.",
        "src": [
            {
                "t": "Library of Congress · Gutenberg Bible",
                "u": "https://www.loc.gov/item/2021666734/"
            },
            {
                "t": "Library of Congress · date and publication",
                "u": "https://guides.loc.gov/gutenberg?loclr=blogbib"
            }
        ]
    },
    {
        "when": "AD 1516",
        "title": "Greek and a new Latin version are printed",
        "body": "Erasmus publishes a Greek New Testament beside his Latin translation, bringing the letters into a new printed edition.",
        "acts": [
            "revising",
            "translating",
            "distributing"
        ],
        "place": "Basel, Switzerland",
        "note": "This was the first published printed Greek New Testament. The Complutensian New Testament had been printed earlier but published later.",
        "src": [
            {
                "t": "Museum of the Bible · 1516 edition",
                "u": "https://collections.museumofthebible.org/artifacts/413-novum-instrumentum-omne-erasmuss-new-testament?theme=collections-highlights"
            },
            {
                "t": "SMU Bridwell · Erasmus editions",
                "u": "https://bridwell.omeka.net/exhibits/show/highlightsbible/erasmus"
            }
        ]
    },
    {
        "when": "AD 1519",
        "title": "The printed edition is corrected",
        "body": "Erasmus’s second New Testament edition corrects typographical errors in the first. Revision continues after publication.",
        "acts": [
            "revising",
            "distributing"
        ],
        "place": "Basel, Switzerland",
        "note": "A documented correction of an earlier edition. This does not imply that Erasmus’s editions became free from error.",
        "src": [
            {
                "t": "Museum of the Bible · second edition",
                "u": "https://collections.museumofthebible.org/artifacts/18089-erasmuss-new-testament-in-greek-and-latin-second-edition?theme=a-history-of-translation"
            }
        ]
    },
    {
        "when": "AD 1522",
        "title": "Paul is printed in Luther’s German",
        "body": "Luther’s September Testament brings the New Testament, including Paul’s letters, to German readers in a new translation.",
        "acts": [
            "translating",
            "distributing"
        ],
        "place": "Wittenberg, Germany",
        "note": "Luther’s was not the first German Bible translation. The date identifies his September New Testament edition.",
        "src": [
            {
                "t": "Emory Pitts Library · September Testament",
                "u": "https://digital.pitts.emory.edu/s/digital-collections/item/5549"
            },
            {
                "t": "Morgan Library · Luther’s Bible",
                "u": "https://www.themorgan.org/exhibitions/online/word-and-image/7"
            }
        ]
    },
    {
        "when": "AD 1526",
        "title": "English copies cross the Channel",
        "body": "Tyndale’s printed English New Testament is published at Worms and copies are smuggled into England and Scotland.",
        "acts": [
            "translating",
            "distributing"
        ],
        "place": "Worms → Britain",
        "note": "The distribution claim follows the holding library’s account. The work includes all the New Testament letters, not only the Gospels.",
        "src": [
            {
                "t": "Chetham’s Library · Tyndale New Testament",
                "u": "https://library.chethams.com/collections/101-treasures-of-chethams/william-tyndales-new-testament/"
            }
        ]
    },
    {
        "when": "AD 1534",
        "title": "Tyndale revises his own translation",
        "body": "Tyndale publishes a corrected New Testament, comparing his English with Greek and improving the earlier edition.",
        "acts": [
            "revising"
        ],
        "place": "Antwerp",
        "note": "A direct example of revising an existing translation rather than merely copying it.",
        "src": [
            {
                "t": "Chetham’s Library · 1534 revision",
                "u": "https://library.chethams.com/collections/101-treasures-of-chethams/william-tyndales-new-testament/"
            },
            {
                "t": "Library of Congress · Tyndale’s influence",
                "u": "https://www.loc.gov/loc/lcib/9707/tyndale.html"
            }
        ]
    },
    {
        "when": "AD 1551",
        "title": "Verse numbers make passages easier to find",
        "body": "Robert Estienne’s New Testament introduces the numbered verse divisions that become the familiar reference system for Paul’s letters.",
        "acts": [
            "adapting",
            "distributing"
        ],
        "place": "Geneva",
        "note": "This concerns the modern New Testament verse-numbering system, not the first historical division of any biblical text. It is a navigation aid, not new inspired wording.",
        "src": [
            {
                "t": "Trinitarian Bible Society · 1551 edition",
                "u": "https://www.tbsbibles.org/page/1551StephanusGreekNewTestament"
            }
        ]
    },
    {
        "when": "AD 1611",
        "title": "Earlier English work is revised again",
        "body": "The King James translators build on the Bishops’ Bible and earlier English versions, checking their work against Hebrew and Greek.",
        "acts": [
            "translating",
            "revising",
            "distributing"
        ],
        "place": "England",
        "note": "The translators’ rules explicitly allowed the use of earlier translations. This stop describes transmission and revision, not the edition’s historical publishing privileges.",
        "src": [
            {
                "t": "SMU Bridwell · translation rules",
                "u": "https://bridwell.omeka.net/exhibits/show/kjb1611/king-james-and-his-translators"
            },
            {
                "t": "Cambridge University Library · 1611",
                "u": "https://wwwe.lib.cam.ac.uk/CUL/exhibitions/KJV/1611.html"
            }
        ]
    },
    {
        "when": "AD 1661",
        "title": "The letters are printed in Wôpanâak",
        "body": "The Wôpanâak New Testament associated with John Eliot’s translation work is printed in Cambridge, Massachusetts.",
        "acts": [
            "translating",
            "distributing"
        ],
        "place": "New England",
        "note": "The New Testament appeared in AD 1661; the complete Bible followed in AD 1663. The work involved Indigenous contributors as well as Eliot; this stop does not attribute the entire effort to one person.",
        "src": [
            {
                "t": "The Huntington · 1661 New Testament",
                "u": "https://www.huntington.org/collections/lib-18725"
            },
            {
                "t": "Wôpanâak Bible Census · editions",
                "u": "https://eliotcensus.org/about/"
            }
        ]
    },
    {
        "when": "AD 1715",
        "title": "Paul is printed in Tamil",
        "body": "The Tamil New Testament is published, including the letters, extending this transmission into a major South Indian language.",
        "acts": [
            "translating",
            "distributing"
        ],
        "place": "South India",
        "note": "Harvard’s holding-library account dates the translated and published New Testament to AD 1715. It does not date the later complete one-volume Tamil Bible to this year.",
        "src": [
            {
                "t": "Harvard Divinity School Library · Tamil",
                "u": "https://library.hds.harvard.edu/exhibits/incomparable-treasure/translations/tamil"
            }
        ]
    },
    {
        "when": "AD 1813",
        "title": "The letters are printed in Chinese",
        "body": "Robert Morrison’s Chinese New Testament is published, carrying Paul’s letters in a Chinese translation.",
        "acts": [
            "translating",
            "distributing"
        ],
        "place": "China",
        "note": "This stop identifies the dated edition held by Harvard. It does not claim that Morrison worked alone or that Chinese Christians had never encountered biblical material before.",
        "src": [
            {
                "t": "Harvard Library · 1813 New Testament",
                "u": "https://listview.lib.harvard.edu/lists/drs-432072489"
            }
        ]
    },
    {
        "when": "AD 1836",
        "title": "The New Testament can be read by touch",
        "body": "Perkins prints the New Testament in three volumes of Boston Line Type, an embossed alphabet for blind readers.",
        "acts": [
            "adapting",
            "copying"
        ],
        "place": "Boston, United States",
        "note": "The archive lists all three New Testament volumes under AD 1836. This was raised Roman lettering, not braille; all the letters were included within the New Testament.",
        "src": [
            {
                "t": "Perkins Archives · Boston Line Type inventory",
                "u": "https://www.perkins.org/finding-aid/perkins-boston-line-type-books/"
            }
        ]
    },
    {
        "when": "AD 1862",
        "title": "Paul’s letters are printed in Yoruba",
        "body": "An edition credits Samuel Ajayi Crowther and Thomas King with translating letters including Philippians, Colossians, Timothy, Titus, and Philemon.",
        "acts": [
            "translating",
            "distributing"
        ],
        "place": "Yoruba readers in West Africa",
        "note": "The dated bibliographic record explicitly names the Pauline letters and both translators. Its historical title also groups Hebrews with Paul; this timeline does not decide Hebrews’ authorship.",
        "src": [
            {
                "t": "WorldCat · 1862 Yoruba epistles",
                "u": "https://search.worldcat.org/title/The-Epistles-of-St.-Paul-to-the-Phillippians-Colossians-Thessalonians-Timothy-Titus-Philemon-and-the-Hebrews-the-General-Epistles-of-St.-John-the-General-Epistle-of-St.-Jude-and-the-Revelation-of-St.-John.-Translated-into-Yoruba-by-the-Rev.-S.-Crowther-and-the-Rev.-T.-King/oclc/792761014"
            }
        ]
    },
    {
        "when": "AD 1881",
        "title": "The English New Testament is revised",
        "body": "The Revised Version updates the English New Testament. Paul’s letters are compared and rendered again for another generation.",
        "acts": [
            "translating",
            "revising",
            "distributing"
        ],
        "place": "Britain and the United States",
        "note": "The New Testament was published in AD 1881; the Revised Version Old Testament followed in AD 1885. These publication dates should not be collapsed into one year.",
        "src": [
            {
                "t": "Library of Congress · 1881 Revised Testament",
                "u": "https://www.loc.gov/item/unk82095910/"
            },
            {
                "t": "Cambridge University Press · Greek text and revision",
                "u": "https://www.cambridge.org/core/books/new-testament-in-greek/82E206CA16D65ABA6562F0F8E9B57D71"
            }
        ]
    },
    {
        "when": "AD 1940s–1950s",
        "title": "The Bible becomes a recorded voice",
        "body": "Alexander Scourby records the King James Bible, allowing blind listeners and others to hear Paul’s letters in recorded form.",
        "acts": [
            "adapting",
            "distributing"
        ],
        "place": "United States",
        "note": "AFB dates a Bible recording to AD 1945; Scourby Bible Media identifies AD 1953. A range avoids conflating recordings or claiming an unsupported single completion date. Audio is a format adaptation here, not a claim about its legal classification or licence.",
        "src": [
            {
                "t": "American Foundation for the Blind · Scourby",
                "u": "https://afb.org/about-afb/history/online-museums/afb-talking-book-exhibit/celebrity-narrators/alexander-scourby"
            },
            {
                "t": "Scourby Bible Media · biography",
                "u": "https://www.scourby.com/about-scourby/"
            }
        ]
    },
    {
        "when": "AD 2009",
        "title": "An ancient copy becomes searchable online",
        "body": "The Codex Sinaiticus project reunites images of its surviving pages online, with a linked transcription that includes Paul’s letters.",
        "acts": [
            "copying",
            "adapting",
            "distributing"
        ],
        "place": "International digital collaboration",
        "note": "The online launch was 6 July AD 2009. Public access to a website is not, by itself, a claim that every image or digital asset has unrestricted reuse rights.",
        "src": [
            {
                "t": "University of Birmingham · project launch",
                "u": "https://www.birmingham.ac.uk/news-archive/2009/the-worlds-oldest-bible-reunited-online"
            },
            {
                "t": "Codex Sinaiticus · electronic edition",
                "u": "https://codexsinaiticus.org/en/project/edition.aspx"
            }
        ]
    },
    {
        "when": "AD 2020",
        "title": "A modern English text is freely reusable",
        "body": "The World English Bible’s stable text edition places a modern English Bible, including Paul’s letters, in the public domain.",
        "acts": [
            "translating",
            "revising",
            "distributing"
        ],
        "place": "Worldwide",
        "note": "The publisher identifies this as the AD 2020 stable text edition. The World English Bible name is a trademark; the translation text is public domain.",
        "src": [
            {
                "t": "eBible.org · World English Bible Classic",
                "u": "https://www.ebible.org/eng-web/copyright.htm"
            }
        ]
    },
    {
        "when": "AD 2023",
        "title": "A modern translation is released to everyone",
        "body": "The Berean Bible texts enter the public domain, permitting others to reproduce, integrate, and adapt Paul’s letters in these translations.",
        "acts": [
            "distributing"
        ],
        "place": "Worldwide",
        "note": "The publisher dates its dedication to 30 April AD 2023. This stop concerns the text dedication, not the separate rights in every recording, image, or edition.",
        "src": [
            {
                "t": "Berean Bible · publisher’s dedication",
                "u": "https://berean.bible/terms.htm"
            }
        ]
    },
    {
        "when": "Today",
        "title": "Now the letters reach you",
        "body": "You can read Paul’s letters on a screen, then carry the work forward by copying, translating, revising, adapting, and distributing.",
        "acts": [
            "copying",
            "translating",
            "revising",
            "adapting",
            "distributing"
        ],
        "place": "Wherever you are",
        "note": "This is the reader-facing endpoint, not a dated historical artifact. These milestones illustrate several branches of transmission, not a single proven line of descent.",
        "src": [
            {
                "t": "Read Romans · AAB",
                "u": "https://seedbible.org/?translation=AAB&book=ROM&chapter=1"
            },
            {
                "t": "Free Use Bible API",
                "u": "https://bible.helloao.org/docs/"
            }
        ]
    }
];
