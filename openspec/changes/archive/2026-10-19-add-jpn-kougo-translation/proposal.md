## Why

The API's only Japanese translation is `jpn_loc`, the 1965 新改訳 New Testament (27 books, 7,939 verses), so Japanese readers have no Old Testament at all. The 口語訳 (Kougo-yaku, Japan Bible Society, NT 1954 / OT 1955) is the standard 20th-century Protestant Japanese Bible, it is complete (66 books), and it is in the public domain in Japan. A public domain OSIS edition is available in [seven1m/open-bibles](https://github.com/seven1m/open-bibles/blob/master/jpn-kougo.osis.xml).

eBible.org recently listed a complete Japanese "Freedom Bible" (`jpnm`), which may arrive with the next eBible refresh. It is a different, modern translation and doesn't replace the Kougo-yaku.

## What Changes

- Add a small **OSIS → USFM converter** to `@helloao/tools`, with a `convert-osis-to-usfm <file> <dir>` CLI command. The repo has no OSIS input today. Its locally committed translations (`bible/bsb`, `bible/arbnav`, `bible/hinirv`, `bible/hbomas`, …) are USFM files plus a metadata file that `import-translation` reads. Converting to USFM once and committing the result reuses that path unchanged, and nothing in the importer or generator has to change.
- Add the translation as **`bible/jpn_kou/`**: 66 converted USFM books and a `metadata.ts` with id `jpn_kou`, name `口語訳`, englishName `Japanese Kougo-yaku (1955)`, language `jpn`, direction `ltr`, and a public domain license.
- **Furigana is stripped.** The source has 278,970 `<w gloss="…">` ruby annotations. The API's `FormattedText` has no ruby field, and the USFM parser drops `\w` attributes, so the text keeps only the base characters (`<w gloss="ちち">父</w>` → `父`). Keeping furigana would need a schema change across the API and all its clients, which could be a follow-up.
- Versification follows the source (KJV-based, with the source's own differences). Nothing is renumbered.
- CHANGELOG entry under the next version, and CLI README entry for the new command.

### Source facts (verified against the downloaded file)

- 66 books, 1,189 chapters, 31,088 `<verse>` elements. The file lists the NT before the OT.
- 16 elements cover several verses (e.g. `Rom.1.9 Rom.1.10`, `Ps.132.3 Ps.132.4 Ps.132.5`), so the elements cover 31,105 references. One verse, Exod 22:3, is split into `!a`/`!b` halves, which leaves **31,104 distinct verse references**.
- The "14 missing verses" (31,102 − 31,088) is mostly an artifact of those combined elements. Against the KJV's 31,102 references, the only one absent is **2 Cor 13:14**: Japanese versification ends 2 Corinthians 13 at v. 13, and that verse holds the KJV v. 14 text. The source also has **three references the KJV lacks**: 3 John 1:15 (KJV 14b), Rev 12:18 (KJV 13:1a), and Ps 47:10 (the second half of KJV 47:9).
- Exod 22 is printed out of numeric order (1, 3b, 4, 2, 3a, 5…). This is the only verse-order break in the file.

### Licence rationale

The work was published in 1954 (NT) and 1955 (OT) by the Japan Bible Society (日本聖書協会), credited to the organization rather than to individual translators. Under Japanese copyright law at the time, works credited to an organization were protected for 50 years from publication, so protection expired at the end of 2005. The 2018 extension to 70 years was not retroactive and did not revive works whose term had already expired. JBS's current printings differ slightly from the 1955 text, so the metadata and PR state that the text is the 1954/1955 edition taken from open-bibles, not a current JBS printing.

## Capabilities

### New Capabilities
- `osis-conversion`: Converting an OSIS Bible file into per-book USFM files that the existing USFM import path accepts (verses, combined verses, split verses, poetry, Psalm titles, book titles, furigana).
- `jpn-kougo-translation`: The `jpn_kou` translation that the API serves (metadata, book/chapter/verse coverage, and text form).

### Modified Capabilities
<!-- none -->

## Impact

- `packages/helloao-tools`: new converter module and its spec. `linkedom` is already a dependency, and the USX parser uses a `DOMParser` the same way.
- `packages/helloao-cli`: new `convert-osis-to-usfm` command in `cli.ts`/`actions.ts`, plus a README entry.
- `bible/jpn_kou/`: about 12 MB of new USFM, similar in size to the existing `bible/*` translations.
- `CHANGELOG.md`.
- No API schema, generator, importer, or client changes. Maintainers publish with their usual `import-translation ./bible/jpn_kou` + upload flow.

## Revision: fetch instead of commit

After the PR was opened, the translation was moved out of the repository to keep about 1.5 MB of compressed USFM (5.5 MB on disk) out of the git history. This follows the newer convention for sources (eBible, interlinear, metadata, commentaries), which are fetched into the gitignored `sources/` directory, rather than the older committed `bible/` translations. The rest of this document describes the original committed-USFM plan; where they differ, this section wins:

- `bible/jpn_kou/` is not committed. The `fetch-osis-translations <dir>` command (`pnpm fetch:bible:osis` → `./sources/osis`) downloads the file from the pinned open-bibles commit, checks the SHA-256, converts it, and writes `sources/osis/jpn_kou/` with the 66 USFM books and a `metadata.json`. `pnpm import:bible:osis` imports it with `import-translations`. The fetched output is byte-identical to the USFM that was committed before.
- The metadata, source URL, hash and licence rationale live in `OSIS_TRANSLATIONS` in `packages/helloao-cli/osis.ts`, not in `bible/jpn_kou/metadata.ts` and `README.md`.
- The USFM books sit next to `metadata.json` at the translation root rather than in a `usfm/` subdirectory. The loader treats any root `.json` file as a translation file and then does not fall back to `usfm/`. It skips files named `metadata`, though.
