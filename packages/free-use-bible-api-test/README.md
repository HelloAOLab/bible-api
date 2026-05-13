## Hello AO Tools

Tools for the [Free Use Bible API](https://bible.helloao.org).

### Features

-   Parse [USFM](https://ubsicap.github.io/usfm/), [USX](https://ubsicap.github.io/usx/), and Codex (JSON) files and understand some basic structure.
-   Generate JSON from USFM, USX, and other formats.

### Installation

```
$ npm install @helloao/tools
```

### Usage

#### Parse a USX File

```typescript
import { parser } from '@helloao/tools';
// Used to parse XML
const parser = new DOMParser();
const usx = new parser.USXParser(parser);
const parseTree = usx.parse('YOUR USX');
console.log(parseTree);
```

#### Generate the API Files for a translation

```typescript
import { parser, generation } from '@helloao/tools';

// Used to parse XML
const domParser = new DOMParser();

// Each input file needs some metadata about the translation that it is associated with
const translation: generation.ParseTreeMetadata = {
    translation: {
        // The ID of the translation
        // this should be unique for the translation
        id: 'my translation id',

        // The name of the translation in the translation's language
        name: 'my translation name',

        // The name of the translation in English
        englishName: 'my translation name',

        // The website that hosts information about the translation
        website: 'translation website',

        // The URL that hosts information about the license that the
        // translation is shared under
        licenseUrl: 'translation license',

        // The ISO 639 letter language tag that the translation is primarily in.
        language: 'eng',

        // The direction that the text is written in.
        // "ltr" means "left to right" and "rtl" means "right to left"
        direction: 'ltr',
    },
};

// The list of files that should be processed.
const files: generation.InputFile[] = [
    {
        // the metadata about the translation for this file
        metadata: translation,

        // The content contained in the file
        content: 'YOUR USX',

        // The type of the file.
        // One of "usx", "usfm", and "json"
        fileType: 'usx',
    },
];

// Generate a dataset from the files
// Datasets organize all the files and their content
// by translation, book, chapter, and verse
const dataset = generation.dataset.generateDataset(files, domParser);

// Generate an API representation from the files
// This adds links between chapters and additional metadata.
const api = generation.api.generateApiForDataset(dataset);

// Generate output files from the API representation.
// This will give us a list of files and file paths that represent
// the entire API.
const outputFiles = generation.api.generateFilesForApi(api);

for (let file of outputFiles) {
    console.log(file.path, file.content);
}
```
