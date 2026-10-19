## 1. Branch

- [x] 1.1 Sync `main` with `upstream/main` (HelloAOLab), create `vu/add-jpn-kougo-translation`, and verify `git log -1` matches `upstream/main`

## 2. OSIS → USFM converter (`@helloao/tools`)

- [x] 2.1 Add `parser/osis-to-usfm.ts` with `convertOsisToUsfm(xml, domParser)` and the OSIS→USFM book-code map (66 books, throwing on unknown IDs), exported from `parser/index.ts`, and verify `tsc --build` passes
- [x] 2.2 Handle book titles (`\h`, `\toc1`, `\toc2`, `\mt1`), chapters, container and milestone verses, `osisID` ranges (`\v 9-10`), and skipped chapter labels, and verify spec tests for the "Book titles", "Chapters and verses", "Combined verses" and "Chapter label dropped" scenarios pass
- [x] 2.3 Handle `<p>` → `\p`, `<lg>/<l>` → `\q1`, `<title type="psalm">` → `\d`, and `<w gloss>` → base text, and verify spec tests for the Psalm-title, milestone-across-paragraphs and furigana scenarios pass
- [x] 2.4 Merge `!a`/`!b` split verses and write that chapter in ascending order, and verify a test built from the real Exodus 22:1–5 markup gives 1, 2, 3 (3a+3b), 4, 5
- [x] 2.5 Throw on unhandled elements and types, naming the element and nearest verse, and verify a `<note>` fixture test fails with that message
- [x] 2.6 Add a test that feeds converter output through `generateDataset` (as `usfm-parser.spec.ts` does) and checks the parsed verse numbers, `hebrew_subtitle` and `poem` flags

## 3. CLI command (`@helloao/cli`)

- [x] 3.1 Add `convert-osis-to-usfm <file> <dir> [--overwrite]` in `cli.ts` → `actions.ts`, writing `<dir>/<bookid>.usfm`, refusing to overwrite without `--overwrite`, and writing nothing if conversion throws. Verify by running it on the downloaded source into a temp dir
- [x] 3.2 Add the command to the command list in `packages/helloao-cli/README.md`

## 4. Translation content

- [x] 4.1 Download `jpn-kougo.osis.xml` at open-bibles commit `3ca49fb73163f42297a32b7b1b1c40cf3dafd84b` and verify SHA-256 `6930015f5d0faf49f3038a7e2f482aeb45939510b6acb8a8fb1945640c1d91b6`
- [x] 4.2 Run `pnpm cli convert-osis-to-usfm <osis> ./bible/jpn_kou/usfm` and verify 66 `.usfm` files exist and no output file contains `gloss` or `第一章`
- [x] 4.3 Add `bible/jpn_kou/metadata.ts` (id `jpn_kou`, name/shortName `口語訳`, englishName `Japanese Kougo-yaku (1955)`, language `jpn`, direction `ltr`, public domain `license`, `licenseNotice` naming the 1954/1955 edition, website/licenseUrl → open-bibles file, type-only import) and `bible/jpn_kou/README.md` (source URL, commit, SHA-256, regeneration command, licence rationale)
- [x] 4.4 Import into a scratch DB (`pnpm cli import-translation ./bible/jpn_kou -- --db <scratch.db>`) and verify with SQL: 66 books, 1,189 chapters, 31,087 verses. Per-chapter verse counts must equal the source's `<verse>` element counts, with Exodus 22 one lower
- [x] 4.5 Generate API files for `jpn_kou` from the scratch DB into a temp dir and verify the spec scenarios: `books.json` (66 books, PSA = 150 chapters), `2CO/13.json` (13 verses), `REV/12.json` (18 verses), `PSA/23.json` (subtitle `ダビデの歌`), and the exact Gen 1:1, Ps 23:1, John 3:16 and Rev 22:21 text

## 5. Docs and checks

- [x] 5.1 Add a CHANGELOG entry under the next version (the `jpn_kou` translation and the `convert-osis-to-usfm` command)
- [x] 5.2 Run `pnpm test` (pretest builds with `tsc`) and verify all suites pass, including `osis-to-usfm.spec.ts`
- [x] 5.3 Run `npx prettier --check` on the changed source/docs files (the husky pre-commit runs `pretty-quick --staged`) and verify it passes

## 6. Pull request

- [x] 6.1 Run `/pr` to open the PR against `HelloAOLab/bible-api` `main`. The description must cover: the source (URL, commit, SHA-256), the licence rationale and JBS-revision caveat, the counts (31,088 elements → 31,104 references → 31,087 API verses), the KJV differences (2 Cor 13:14 absent; 3 John 1:15, Rev 12:18, Ps 47:10 extra) that explain the "14 missing", the 16 combined ranges, the Exodus 22:3 merge, and the furigana decision
