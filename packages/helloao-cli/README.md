## Hello AO CLI

A Command Line Interface (CLI) that makes it easy to generate and manage your own [Free Use Bible API](https://bible.helloao.org/).

Additionally, it includes many functions and utilities that can make working with commonly formatted Bible data much easier.

### Features

-   Supports [USFM](https://ubsicap.github.io/usfm/), [USX](https://ubsicap.github.io/usx/), and Codex (A JSON format).
-   Download over 1000 Bible translations from [fetch.bible](https://fetch.bible/).
-   Import Bible translations into a SQLite database.
-   Upload to S3, a zip file, or a local directory.

### Usage

```
Usage: helloao [options] [command]

A CLI for managing a Free Use Bible API.

Options:
  -V, --version                                          output the version number
  -h, --help                                             display help for command

Commands:
  init [options] [path]                                  Initialize a new Bible API DB.
  generate-translation-metadata                          Generates a metadata file for a translation.
  convert-osis-to-usfm [options] <file> <dir>            Converts an OSIS XML file into per-book USFM files.
  import-translation [options] <dir> [dirs...]           Imports a translation from the given directory into the database.
  import-translations [options] <dir>                    Imports all translations from the given directory into the database.
  import-commentary [options] <dir> [dirs...]            Imports a commentary from the given directory into the database.
  import-commentaries [options] <dir>                    Imports all commentaries from the given directory into the database.
  import-bible-metadata <dir>                            Imports the Theographic bible metadata (people, places, events, and people groups) from the given directory into the database.
                                                         The directory should contain the JSON files downloaded by the fetch-bible-metadata command.
  import-interlinear <dir>                               Imports the Berean interlinear words and the STEPBible lexicons from the given directory into the database.
                                                         The directory should contain the files downloaded by the fetch-interlinear command.
  import-history-globe <dir>                             Imports the History Globe places from the given directory into the database.
                                                         The directory should contain the files downloaded by the fetch-history-globe command.
  import-verse-of-the-day                                Imports the verse of the day dataset into the database.
                                                         The dataset is built into @helloao/tools, so it does not need to be fetched first.
  review-verse-of-the-day [options] [dir]                Prints the verses of the verse of the day dataset with their categories and their text, so that the list can be reviewed.
                                                         The text comes from the USFM files in the given directory, which defaults to ./bible/bsb (the Berean Standard Bible).
  upload-test-translation [options] <input>              Uploads a translation to the HelloAO Free Bible API test S3 bucket.
                                                         Requires access to the HelloAO Free Bible API test S3 bucket.
                                                         For inquiries, please contact hello@helloao.org.
  upload-test-translations [options] <input>             Uploads all the translations in the given input directory to the HelloAO Free Bible API test S3 bucket.
                                                         Requires access to the HelloAO Free Bible API test S3 bucket.
                                                         For inquiries, please contact hello@helloao.org.
  generate-translation-files [options] <input> <dir>     Generates API files from the given input translation.
  generate-translations-files [options] <input> <dir>    Generates API files from the given input translations.
  upload-api-files [options] <dest>                      Uploads API files to the specified destination. For S3, use the format s3://bucket-name/path/to/folder.
  sync [options] [config]                                Imports the new, changed, and deleted sources from the given sync config into the database, and uploads the changed translations, commentaries, and datasets to the destinations in the config.
  source-translations [options] <dir> [translations...]  Finds translation sources from ebible.org and downloads it.
  source-fetch-bible-translations [options] <dir> [translations...]
                                                         Finds translation sources from fetch.bible and downloads them.
                                                         Translations that are already provided by eBible are skipped.
  source-all-translations [options] [dir] [translations...]
                                                         Finds translation sources from eBible and fetch.bible, and downloads them (along with the pinned OSIS translations and the Berean Standard Bible from bereanbible.com) into the given directory so that they can be imported with import-translations.
                                                         Translations available from eBible are downloaded from eBible, and the rest are downloaded from fetch.bible. Only new and changed translations are downloaded.
                                                         With --config (or when <dir> is omitted, ./source.config.json), the database, the sources, and the directories they are downloaded to are read from the config, and every argument is a translation ID. See the README for its format.
  list-fetch-bible-translations [search]                 List available fetch.bible translations. Optionally filter by search term.
  list-ebible-translations [search]                      List available eBible translations. Optionally filter by search term.
  refresh-ebible-licenses [options] [translations...]    Detects the licenses of the eBible translations that are already in the database and stores them.
                                                         Optionally limited to the given translation IDs.
  fetch-audio [options] <dir> [translations...]          Fetches the specified audio translations and places them in the given directory.
                                                         Translations should be in the format "translationId/audioId". e.g. "BSB/gilbert"
  fetch-bible-metadata <dir>                             Fetches the Theographic bible metadata and places it in the given directory.
  fetch-interlinear <dir>                                Fetches the Berean interlinear table and the STEPBible lexicons (with their license) and places them in the given directory.
  fetch-osis-translations <dir>                          Fetches the pinned OSIS translations (the Japanese Kougo-yaku and Bungo-yaku), checks their hashes, converts them to USX and places them in the given directory.
  fetch-bsb [options] <dir>                              Fetches the Berean Standard Bible USFM files from bereanbible.com, converts them to USX3 (like source-translations --convert-to-usx3) and places them in <dir>/BSB.
                                                         The translation is only replaced when the download or metadata has changed.
  fetch-wordproject-translations [options] <dir> [translations...]
                                                         Downloads Bible texts from wordproject.org, converts them to USX and places them in the given directory, ready for import-translations.
  list-wordproject-translations                          Lists the Bible texts on wordproject.org that fetch-wordproject-translations can download.
  fetch-history-globe <dir>                              Fetches the History Globe places and their verse references and places them in the given directory.
  fetch-sword-commentaries [options] <dir> [modules...]  Fetches the commentaries from the CrossWire SWORD module repository, with a metadata.json for each.
  fetch-tyndale-open-resources <dir>                     Fetches the Tyndale Open Bible Resources and places it in the given directory.
  help [command]                                         display help for command
```

> **Berean Standard Bible.** eBible's copy of the BSB is often out of date, so `fetch-bsb <dir>` (`npm run fetch:bible:bsb`) downloads it straight from [bereanbible.com](https://bereanbible.com/bsb_usfm.zip) instead. The USFM files are converted to USX3 with [BibleMultiConverter](https://github.com/schierlm/BibleMultiConverter), the same way `source-translations --convert-to-usx3` converts eBible translations (use `--no-convert-to-usx3` to keep the USFM files), and written to `<dir>/BSB` with a `metadata.json` (from `meta/BSB.json`). A `bsb.txt` file records the SHA-256 hash of the download, so later runs only replace the translation when the zip or metadata changes (or with `--overwrite`). To avoid importing the BSB twice, exclude `BSB` from the eBible source (e.g. `"exclude": ["BSB"]` in a sync config).

> **Wordproject translations.** `fetch-wordproject-translations <dir> [translations...]` downloads the Bible texts published on [wordproject.org](https://www.wordproject.org/bibles/index.htm) and writes each one to `<dir>/<id>/` as one USX 3.0 file per book plus a `metadata.json`, so the directory can be imported with `import-translations <dir>` (or `npm run fetch:bible:wordproject` followed by `npm run import:bible:wordproject`). Run `list-wordproject-translations` to see the catalog: 87 texts in 80 languages, with the IDs they get in the API (e.g. `hau_wp`, `eng_wpdrc`, `amh_amh`). Translations can be given by ID or by their wordproject.org folder (e.g. `am` or `new/hau`). With no translations, the 14 texts that the API doesn't already have and that may be published are downloaded: 13 public domain texts, and the complete Amharic Bible, which may only be used non-commercially and gets a license and notice that say so. The Amharic Bible uses the ID `amh_amh` and replaces the New Testament only copy from eBible: `source-translations` and `source-all-translations` no longer download eBible's copy, and `import-translations` skips any `amh_amh` directory that doesn't have the `wordproject.txt` file that `fetch-wordproject-translations` writes, so the two copies are never mixed. In a `sync` config, exclude it from the eBible source instead (`"exclude": ["amh_amh"]`), as `sync.config.example.json` does; otherwise `sync` keeps whichever copy it imported first and reports an error for the other. `--all` downloads every text in the catalog instead. Wordproject doesn't state the license of its texts, and most of them turned out to be copyrighted; [wordproject-licenses.md](./wordproject-licenses.md) has the research behind each one, and `list-wordproject-translations` shows the default texts, the license status of each text, and the API translation that already has the same text (`duplicate`). The duplicates were found by comparing seven sample chapters of every Wordproject text with every API translation in the same language, and the books each one has. Each Bible is downloaded as one zip file from [Wordproject's download page](https://www.wordproject.org/download/bibles/index.htm) (`https://www.wordpocket.org/bibles/download_zip/<folder>_new.zip`), which holds the same chapter pages as the website. Some zips are older than the website and are missing the text of some verses, so any chapter in the zip with empty verses is also downloaded from the website, and the more complete copy is used. Bibles without a zip (the ones under `new/`, Khmer, Armenian, Igbo, Pashto, Turkmen, Estonian, and the Khomenko Ukrainian Bible) are downloaded page by page from the website (`--concurrency <n>` pages at a time, 4 by default); use `--no-zip` to download every Bible that way. Verses that still have no text are listed in the output. Chapter titles (like Psalm titles) become `d` (Hebrew subtitle) paragraphs, the words of Jesus are marked with `<char style="wj">`, and Catholic Bibles include their deuterocanonical books. Books are saved to `<dir>.partial/<id>/` as they finish, so a failed or interrupted download continues where it stopped when the command is run again, and the translation only moves into `<dir>` once every book is done. Translations that are already in `<dir>` are skipped (use `--overwrite` to download them again). **Licenses:** Only the public domain texts get a public domain `license` in their `metadata.json`, and the Amharic Bible gets its non-commercial license. Check the license of any other text before publishing it.

> **eBible licenses.** `source-translations` detects the license of each eBible translation (from the Creative Commons link on its ebible.org details page, falling back to a "public domain" copyright notice) and stores it in `metadata.json`. To add licenses to a database that was imported before license detection existed, run `helloao refresh-ebible-licenses --db <path> --dir <sourced translations dir>`. It updates the `license` column of each eBible translation in place, and `--dir` also writes the licenses into the matching `metadata.json` files so that a later re-import doesn't clear them. Translations whose license can't be detected are left unchanged.

> **Sourcing translations.** `source-all-translations <dir>` is the one command for keeping a directory of translations up to date. It reconciles the translation lists from [eBible](https://ebible.org) and [fetch.bible](https://fetch.bible) so that each translation is downloaded from only one source: translations that eBible has are downloaded from eBible (like `source-translations`), and translations that only fetch.bible has (or that eBible lists but has no USFM download for) are downloaded from the [fetch.bible collection](https://github.com/gracious-tech/fetch_collection). Downloads are tracked in the database (`--db`), so later runs only download new and changed translations. Changes are detected from the git history of the fetch.bible collection: each run looks up the collection's latest commit with the GitHub API (3 requests) and compares the git tree SHA of each translation's directory with the one that was downloaded, and files are downloaded from that exact commit. Set `GITHUB_TOKEN` to raise the GitHub API rate limit; if the API is unavailable, changes are detected from each translation's `meta.json` instead. Use `--collection-repo` and `--collection-ref` to download from a fork or another branch. USFM files are converted to USX3 with [BibleMultiConverter](https://github.com/schierlm/BibleMultiConverter) (use `--no-convert-to-usx3` to keep the USFM files). Up to 10 conversions run at once; each one is a separate Java process, so lower this with `--conversion-concurrency <n>` to reduce memory usage (the same option works with `source-translations` and `source-fetch-bible-translations`). Every translation gets a `metadata.json` (including its license), so the directory can be imported straight away with `import-translations <dir>`. To keep the fetch.bible translations in their own directory, add `--fetch-bible-dir <fetch dir>`; `<dir>` then only holds the eBible translations, and both are imported with `import-translations <dir> <fetch dir>`. When a translation that was downloaded from fetch.bible later becomes available from eBible, its copy in the fetch.bible directory is removed so that it isn't imported twice. Translations listed in `<dir>/ignorelist.txt` (or the fetch.bible directory's `ignorelist.txt`) (by eBible ID, fetch.bible ID, or translation ID) are never downloaded. To only download from fetch.bible, use `source-fetch-bible-translations <dir>`, which skips translations that the database (or `--ebible-dir`) shows were already downloaded from eBible. Translations that came from fetch.bible have a `fetch-bible.txt` file in their directory. The pinned OSIS translations (the ones `fetch-osis-translations` downloads, such as `jpn_kou`) are fetched as well, after their SHA-256 hashes are checked, and are never downloaded from eBible or fetch.bible. They have an `osis.txt` file in their directory that records their source, so they are only downloaded again when their source or metadata changes (or with `--overwrite`). Put them in their own directory with `--osis-dir <osis dir>`, or skip them with `--no-osis`. The Berean Standard Bible is downloaded from bereanbible.com (like `fetch-bsb`) instead of eBible, and is only replaced when the download changes. Put it in its own directory with `--bsb-dir <bsb dir>`, or use `--no-bsb` to source it from eBible like the other translations. The database and the sources can also be read from a config file instead; see [Sourcing translations from a config](#sourcing-translations-from-a-config).

> **SWORD commentaries.** `import-commentary`, `import-commentaries`, and `sync` can import commentaries from [SWORD](https://crosswire.org/sword/) modules, like the ones from the [CrossWire module repository](https://crosswire.org/sword/modules/ModDisp.jsp?modType=Commentaries). Put the module's `.zip` file in the commentary's directory, or extract it there (so that the directory contains `mods.d/` and `modules/`). The commentary's metadata comes from the module's `.conf` file: its ID is the module name in lowercase (e.g. `clarke`), and its name is the module's `Description`. To change any of these, add a `metadata.json` with just the values to override (e.g. `{ "id": "adam-clarke" }`). The `zCom`, `zCom4`, `RawCom`, and `RawCom4` drivers are supported, with the KJV versification and OSIS, ThML, GBF, or plain text markup. Entries are converted to plain text, with one line per paragraph; notes are left out. Book and chapter headings become the book and chapter introductions, and a comment that covers several verses (a linked entry) is only listed under its first verse. Some commentaries (like Adam Clarke's) start each comment with a "Verse N" heading: the heading is removed, and any text before the "Verse 1" heading becomes the chapter introduction.

> **Fetching the CrossWire commentaries.** `fetch-sword-commentaries <dir> [modules...]` (or `npm run fetch:sword:commentaries`) downloads the commentaries listed on the [CrossWire commentaries page](https://www.crosswire.org/sword/modules/ModDisp.jsp?modType=Commentaries) into `<dir>`, so that it can be imported with `import-commentaries <dir>`. Each commentary gets its own directory, named after its ID (the lowercase module name): `<dir>/clarke/Clarke.zip`, `<dir>/clarke/metadata.json`, and `<dir>/clarke/crosswire.json`. The module list comes from the page, and the module configs come from CrossWire's `mods.d.tar.gz`, so the command picks up new modules by itself.
>
> -   **Metadata.** `metadata.json` holds the full metadata of the commentary: its name (the module's `Description`), English name, ISO 639-3 language, text direction, website, license URL, license notice, and structured `license` terms. The license comes from the module's `DistributionLicense`: public domain and CC0 modules have no notice, Creative Commons modules link to their license and get an attribution notice, and copyrighted modules get their copyright and distribution terms as the notice. `CROSSWIRE_COMMENTARY_OVERRIDES` in `crosswire.ts` adds English names for the commentaries that aren't in English and licenses for the modules whose config leaves it out (Family and Geneva are public domain).
> -   **Which commentaries are fetched.** By default only commentaries that are public domain or openly licensed (allowing commercial use and derivatives, like CC BY or CC BY-SA), and that can be imported, are fetched. Add `--all-licenses` to also fetch copyrighted, non-commercial, and unlicensed commentaries, and `--include-unsupported` to also fetch the ones that can't be imported yet (modules that use a versification other than KJV, and non-commentary modules like `Personal`). Don't import a directory that contains unsupported modules, since the import fails on them. Name modules (e.g. `Clarke TSK`) to only fetch those, and use `--dry-run` to see what would be downloaded and why each commentary is skipped.
> -   **Updates.** `crosswire.json` records the module version, URL, and SHA-256 of the downloaded ZIP, so later runs only download modules whose version changed (or every module with `--overwrite`). `metadata.json` is only rewritten when its content changes, so `sync` doesn't reprocess unchanged commentaries.

> **Audio timings.** The `import-audio-timings <file>` command loads per-verse start times for a chapter's audio into the database, from a JSON array of `{ translationId, bookId, chapterNumber, reader, verses }` records. To generate that file from the audio itself, see [`tools/audio-timings`](../../tools/audio-timings/README.md), which transcribes a chapter with whisperX and aligns the result against the chapter's known verse text.

> **Importing a folder of audio timings.** `import-audio-timings-folder <dir> --translation <id> --reader <reader>` loads one narrator's timings from a folder with one `<book>.biblejson` file per book (named by lowercase USFM ID, e.g. `1ch.biblejson`), the format used by the [SDA church app](https://github.com/New-York-Chinese-Seventh-day-Adventist/sda-church-app/tree/main/assets/bible/audio-timings). Each file is `{ "chapters": [null, chapter 1, chapter 2, ...] }`, and each chapter is a list of verse start times in seconds indexed by verse number (index 0 is verse 1), with `null` for a verse that has no time, or `null` for a chapter with no times. The times are converted to one time per verse in the order of the translation's verses in the database. A chapter is skipped (and listed in the output) when its times don't line up with the translation: a verse in the translation has no time, there is a time for a verse the translation doesn't have, or the times go backwards. Use `--books GEN EXO` to import only some books, and `--dry-run` to check the timings without changing the database. The reader must be the name of the audio the timings were made from, or the timings aren't attached to that audio. For example, the SDA app's `rv1909` timings were made from the [Wordproject](https://www.wordproject.org/bibles/audio/index.htm) Reina-Valera 1909 recording, which the API serves for `spa_r09` under the `wordproject` reader:
>
> ```bash
> helloao --db ./bible-api.db import-audio-timings-folder ./sda-church-app/assets/bible/audio-timings/rv1909 --translation spa_r09 --reader wordproject
> ```
>
> This imports 1181 of the 1189 chapters. The other 8 are skipped: in 2 Samuel 20, 2 Chronicles 33, Job 35, Acts 19, and 2 Corinthians 13 the last verse is empty in `spa_r09` (the 1909 text joins it to the verse before) and has no time; Hosea 14:9 and Zechariah 11:17 have no time; and the 3 John timings have 15 verses where `spa_r09` has 14.

### Keeping an API up to date with `sync`

The `sync` command runs the whole pipeline (import into the database, generate, and upload) incrementally, from a JSON config that lists exactly which sources make up the API:

```json
{
    "db": "./free-use-bible-api.db",
    "exclude": ["eng_kjv*"],
    "sources": [
        { "type": "translations", "path": "./sources/ebible" },
        { "type": "translation", "path": "./bible/bsb" },
        { "type": "commentaries", "path": "./sources/comment" },
        { "type": "theographic", "path": "./sources/metadata" },
        { "type": "interlinear", "path": "./sources/interlinear" },
        { "type": "history-globe", "path": "./sources/history-globe" },
        { "type": "verse-of-the-day" },
        { "type": "api", "path": "./sources/other-api" }
    ],
    "destinations": [
        { "url": "s3://my-bucket", "profile": "my-aws-profile" },
        { "url": "./api.zip" },
        {
            "type": "typesense",
            "url": "https://search.example.com",
            "translations": ["BSB", "eng_*"]
        }
    ]
}
```

```
helloao sync ./sync.config.json [--dry-run] [--skip-import] [--skip-upload] [--destination <urls...>]
                                [--reprocess-all] [--reupload-all] [--ignore-processor-changes] [--verbose]
```

Paths in the config are relative to the config file, and `--db` overrides `db`. See `sync.config.example.json` in the repository for a starting point.

-   **Sources.** `translations` and `commentaries` are directories where every subdirectory is a translation or commentary. `translation` and `commentary` are a single one. `theographic`, `interlinear`, and `history-globe` are the directories written by `fetch-bible-metadata`, `fetch-interlinear`, and `fetch-history-globe`. `verse-of-the-day` is the verse of the day dataset, which is built into `@helloao/tools`, so it has no `path`; it is reimported whenever the list of verses changes. `api` is a directory of already generated API files (the directory that contains the `api` folder, like the output of `generate-translation-files`, `upload-api-files`, or another sync's local destination); every translation, commentary, and dataset in it is imported, the same way `import-api` does, and it is reimported as a whole when any of its files change. Items from `api` sources take precedence over the same items from the other types of sources, so `api` sources can hold fixed copies of translations: the fixed copy replaces the original as a whole, and the original is not even processed (so a source that fails to import can be fixed this way). When the fix is removed from the `api` source (or excluded from it), the original is reimported. If the `api` source fails to import, the original is kept. Two `api` sources can't provide the same item. A configured directory that is missing is an error, so an unmounted drive can't be mistaken for every source being deleted.
-   **Include and exclude.** `include` and `exclude` lists can be set for the whole config and for each source. They match translation, commentary, and dataset IDs (and the names of translation and commentary directories), case-insensitively, with `*` and `?` wildcards. Excluded sources are never parsed or imported.
-   **Change detection.** Each source is fingerprinted by the names, sizes, and modification times of its files, so untouched sources are skipped without being read. When the fingerprint changes, the file contents are hashed, and the source is only reprocessed if they changed. This includes `metadata.json`, so metadata and license changes are picked up.
-   **Deletions.** When a source is deleted or becomes excluded, its translations, commentaries, or datasets are removed from the database and their files are deleted from every destination. When a source changes, it is replaced as a whole, so books and chapters that were removed from it are deleted too. Audio timings that were loaded with `import-audio-timings` are kept.
-   **Processor changes.** Sources are reprocessed when the code that processes them changes. The build hashes the minified code of the parsers and dataset generators (so comments and formatting don't count), and each source records the version it was imported with. Translations and commentaries, the Theographic dataset, the interlinear datasets, the History Globe dataset, and the verse of the day are versioned separately. Loading API files isn't part of `@helloao/tools`, so `api` sources are versioned by `API_LOADER_VERSION` in `processor.ts`, which should be incremented by hand when that code changes. If you know that a change doesn't affect the output, `--ignore-processor-changes` skips the reprocessing. Changes to the import code in this package are tracked by `IMPORT_VERSION` in `processor.ts`, which should be incremented by hand.
-   **Uploads.** For each destination, the sync records what was uploaded for every item. Only items whose content (`sha256`) changed, or that were never uploaded, are generated and uploaded. When the API generator code or the destination's options change, every item is re-uploaded (S3 still skips files whose checksum matches). `available_translations.json` and the other merged files are rebuilt from the recorded parts of every item, so they always list exactly the synced items. Files for removed items, and files that an item no longer has, are deleted from S3 and local directories only after the merged files stop linking to them. Zip files are rewritten from scratch whenever anything changes.
-   **Typesense.** A destination with `"type": "typesense"` uploads the verses of the synced translations to the Typesense node at `url` (add more nodes of the same cluster with `nodes`), the same way `upload-typesense-verses` does: each language gets a `bibleVerses.{language}` collection. `translations` lists the translation IDs to upload (with the same `*` and `?` wildcards as `include`); without it, every translation in the sync is uploaded. Commentaries and datasets are never uploaded to Typesense. The API key is read from the `TYPESENSE_API_KEY` environment variable, or from `apiKey` (prefer the environment variable, so the key stays out of the config). Like other destinations, only translations that changed are uploaded: a changed translation has its old verses deleted and is uploaded again, and the verses of translations that are removed from the sync or from `translations` are deleted. Translations whose language has no ISO 639-1 code are skipped, because Typesense needs one to stem the verse text. `--destination` matches the destination's `url`. When the upload code changes, increment `TYPESENSE_UPLOAD_VERSION` in `sync-typesense.ts` so every translation is re-uploaded.

Only the items imported by the sync are uploaded, so translations that were imported into the same database by other commands (like `import-api`) are never published. This includes the merged files: `available_datasets.json` (and the other `available_*.json` files) only list the items from the sources in the config, so a dataset that was imported with `import-bible-metadata` but has no `theographic` source in the config disappears from the list on the first sync. The sync warns about every item in the database that no source in the config provides. To publish API files with the sync, add them as an `api` source instead of importing them with `import-api`. To keep private translations out of a public API, give the private pipeline its own config and database:

```json
{
    "db": "./private.db",
    "sources": [
        { "type": "translations", "path": "./sources/ebible" },
        { "type": "translations", "path": "./private/translations" }
    ],
    "destinations": [{ "url": "s3://my-private-bucket" }]
}
```

The sync state is stored in the `SyncSource`, `SyncUpload`, `SyncPendingDelete`, and `SyncDestination` tables of the database. The first sync of an existing database imports every source and uploads every item once.

### Sourcing translations from a config

Like `sync`, `source-all-translations` can read its settings from a JSON config instead of the command line. The config sets the database that tracks downloads and lists the sources to download translations from, with the directory each one is downloaded to:

```json
{
    "db": "./free-use-bible-api.db",
    "ignorelist": ["amh_amh"],
    "convertToUsx3": true,
    "bibleMultiConverterPath": "./tools/BibleMultiConverter.jar",
    "conversionConcurrency": 4,
    "sources": [
        { "type": "ebible", "path": "./sources/ebible" },
        {
            "type": "fetch-bible",
            "path": "./sources/fetch-bible",
            "repo": "gracious-tech/fetch_collection",
            "ref": "main"
        },
        { "type": "osis", "path": "./sources/osis" },
        { "type": "bsb", "path": "./sources/bsb" }
    ]
}
```

```
helloao source-all-translations --config ./source.config.json [translations...]
helloao source-all-translations    # reads ./source.config.json
```

Paths in the config are relative to the config file, and `--db` overrides `db`. See `source.config.example.json` in the repository for a starting point.

-   **Sources.** `ebible` is required. `fetch-bible` downloads the translations that eBible doesn't have from the fetch.bible collection (`manifestUrl`, `repo`, and `ref` are optional and only allowed here). `osis` downloads the pinned OSIS translations, and `bsb` downloads the Berean Standard Bible from bereanbible.com. Each type can be listed once, and a source that is left out isn't downloaded from (without `bsb`, the BSB is downloaded from eBible). Sources can share a directory.
-   **Ignorelist.** `ignorelist` lists translations that are never downloaded (by eBible ID, fetch.bible ID, or translation ID), in addition to the `ignorelist.txt` file of each source directory.
-   **Conversion.** `convertToUsx3` and `conversionConcurrency` set the USFM to USX3 conversion. `bibleMultiConverterPath` is the path to `BibleMultiConverter.jar`, relative to the config file; without it, the jar is searched for in the usual places (like `./tools/BibleMultiConverter.jar`), and you're asked for its location if it isn't found. If the jar isn't at the given path, the command stops with an error instead of searching. `--no-convert-to-usx3`, `--bible-multi-converter-path`, and `--conversion-concurrency` override them.
-   **Command line.** With a config, every argument is a translation ID to download, and `--overwrite` and `--no-database` still work. The options that choose sources and directories (`--fetch-bible-dir`, `--osis-dir`, `--no-osis`, `--bsb-dir`, `--no-bsb`, `--manifest-url`, `--collection-repo`, and `--collection-ref`) can't be combined with a config.
-   **Importing.** To import the downloaded translations with `sync`, add each source's directory to the sync config as a `translations` source.

The `@helloao/cli` package can also be used as a library.

The library exports a variety of actions, utilities, and supporting classes designed to assist with generating and managing a Free Use Bible API.

There are 8 main exports:

-   `actions` - This export contains function versions of the CLI commands. They make it easy to call a CLI command from a script.
-   `db` - This export contains functions that make working with a database easier. It supports operations like importing translations into a database, inserting chapters, verses, etc. and getting an updated database instance from a path.
-   `downloads` - This export contains functions that make downloading files easier.
-   `files` - This export contains functions that make working with files easier. It has functions to load files from a translation, discover translation metadata from the filesystem, and classes that support uploading API files to the local file system or to a zip archive.
-   `uploads` - This export contains functions that make it easy to upload an API to a destination like S3, the local filesystem, or a zip archive.
-   `s3` - This export contains a class that can upload files to S3.
-   `sync` - This export contains the function version of the `sync` command (`sync()` and `syncWithConfig()`) and the functions that find, import, and upload the sources in a sync config.
-   `sourceConfig` - This export contains `sourceAllTranslationsFromConfig()`, which runs `source-all-translations` from a source config, and `loadSourceConfig()`.

Here are some common operations that you might want to perform:

#### Get a SQL Database

```typescript
import { db } from '@helloao/cli';

const pathToDb = './bible-database.db';
const database = await db.getDb(pathToDb);

// do work on the database

// Close it when you are done.
database.close();
```

#### Import a translation into a database from a directory

```typescript
import { db } from '@helloao/cli';

const pathToDb = './bible-database.db';
const database = await db.getDb(pathToDb);

// Get a DOMParser for parsing USX.
// On Node.js, you may have to import jsdom or linkedom.
const parser = new DOMParser();

const pathToTranslation = './path/to/translation';

// Whether to overwrite files that already exist in the database.
// The system will automatically determine the hashes of the input files and overwrite changed files if needed, so this is only needed
// when you know that they need to be overwritten.
const overwrite = false;
await db.importTranslations(database, pathToTranslation, parser, overwrite);
```

#### Generate an API from a translation

```typescript
import { files, uploads } from '@helloao/cli';
import { generation } from '@helloao/tools';
import { toAsyncIterable } from '@helloao/tools/parser/iterators';

const translationPath = './path/to/translation';
const translationFiles = await files.loadTranslationFiles(translationPath);

// Used to parse XML
const domParser = new DOMParser();

// Generate a dataset from the files
// Datasets organize all the files and their content
// by translation, book, chapter, and verse
const dataset = generation.dataset.generateDataset(files, parser);

// You can optionally specifiy a prefix that should be added to all API
// links
const pathPrefix = '';

// Generate an API representation from the files
// This adds links between chapters and additional metadata.
const api = generation.api.generateApiForDataset(dataset, {
    pathPrefix,
});

// Generate output files from the API representation.
// This will give us a list of files and file paths that represent
// the entire API.
const outputFiles = generation.api.generateFilesForApi(api);

// Optionally upload files by using:
// const dest = 's3://my-bucket';
// await uploads.serializeAndUploadDatasets(dest, toAsyncIterable(outputFiles));
```
