import { Command } from 'commander';
import path, { extname } from 'path';
import {mkdir, readdir, writeFile} from 'fs/promises';
import Sql from 'better-sqlite3';
import { BibleClient } from '@gracious.tech/fetch-client';
import { GetTranslationsItem } from '@gracious.tech/fetch-client/dist/esm/collection';
import { getFirstNonEmpty, getTranslationId, normalizeLanguage } from '@helloao/tools/utils';
import { exists } from 'fs-extra';
import { InputFile, InputTranslationMetadata } from '@helloao/tools/generation/common-types';
import { bookChapterCountMap } from '@helloao/tools/generation/book-order';
import { DOMParser, Element, Node } from 'linkedom';
import { KNOWN_AUDIO_TRANSLATIONS } from '@helloao/tools/generation/audio';
import { downloadFile } from './downloads';
import { uploadApiFiles, uploadApiFilesFromDatabase } from './uploads';
import { fetchAudio, fetchTranslations, importTranslation, importTranslations, initDb } from './actions';
import { loadTranslationFiles, loadTranslationsFiles } from './files';
import { generateDataset } from '@helloao/tools/generation/dataset';
import { batch, toAsyncIterable } from '@helloao/tools/parser/iterators';

async function start() {
    const parser = new DOMParser();
    globalThis.DOMParser = DOMParser as any;
    globalThis.Element = Element as any;
    globalThis.Node = Node as any;

    const program = new Command();

    program.name('bible-api')
        .description('A CLI for managing a Bible API.')
        .version('0.0.1');

    program.command('init [path]')
        .description('Initialize a new Bible API DB.')
        .option('--source <path>', 'The source database to copy from.')
        .option('--language <languages...>', 'The language(s) that the database should be initialized with.')
        .action(async (dbPath: string, options: any) => {
            await initDb(dbPath, options);
        });

    program.command('import-translation <dir> [dirs...]')
        .description('Imports a translation from the given directory into the database.')
        .option('--overwrite', 'Whether to overwrite existing files.')
        .action(async (dir: string, dirs: string[], options: any) => {
            await importTranslation(dir, dirs, options);
        });
    
    program.command('import-translations <dir>')
        .description('Imports all translations from the given directory into the database.')
        .option('--overwrite', 'Whether to overwrite existing files.')
        .action(async (dir: string, options: any) => {
            await importTranslations(dir, options);
        });

    program.command('generate-translation-files <input> <dir>')
        .description('Generates API files from the given input translation.')
        .option('--batch-size <size>', 'The number of translations to generate API files for in each batch.', '50')
        .option('--translations <translations...>', 'The translations to generate API files for.')
        .option('--overwrite', 'Whether to overwrite existing files.')
        .option('--overwrite-common-files', 'Whether to overwrite only common files.')
        .option('--file-pattern <pattern>', 'The file pattern regex that should be used to filter the files that are generated.')
        .option('--use-common-name', 'Whether to use the common name for the book chapter API link. If false, then book IDs are used.')
        .option('--generate-audio-files', 'Whether to replace the audio URLs in the dataset with ones that are hosted locally.')
        .option('--profile <profile>', 'The AWS profile to use for uploading to S3.')
        .option('--pretty', 'Whether to generate pretty-printed JSON files.')
        .action(async (input: string, dest: string, options: any) => {
            const parser = new DOMParser();
            globalThis.DOMParser = DOMParser as any;
            globalThis.Element = Element as any;
            globalThis.Node = Node as any;

            const files = await loadTranslationFiles(path.resolve(input));
            const dataset = generateDataset(files, parser as any);
            await uploadApiFiles(path.resolve(dest), options, toAsyncIterable([dataset]));
        });

    program.command('generate-translations-files <input> <dir>')
        .description('Generates API files from the given input translations.')
        .option('--batch-size <size>', 'The number of translations to generate API files for in each batch.', '50')
        .option('--translations <translations...>', 'The translations to generate API files for.')
        .option('--overwrite', 'Whether to overwrite existing files.')
        .option('--overwrite-common-files', 'Whether to overwrite only common files.')
        .option('--file-pattern <pattern>', 'The file pattern regex that should be used to filter the files that are uploaded.')
        .option('--use-common-name', 'Whether to use the common name for the book chapter API link. If false, then book IDs are used.')
        .option('--generate-audio-files', 'Whether to replace the audio URLs in the dataset with ones that are hosted locally.')
        .option('--profile <profile>', 'The AWS profile to use for uploading to S3.')
        .option('--pretty', 'Whether to generate pretty-printed JSON files.')
        .action(async (input: string, dest: string, options: any) => {
            const parser = new DOMParser();
            globalThis.DOMParser = DOMParser as any;
            globalThis.Element = Element as any;
            globalThis.Node = Node as any;

            const dirs = await readdir(path.resolve(input));
            const batchSize = parseInt(options.batchSize);
            for (let b of batch(dirs, batchSize)) {
                const files = await loadTranslationsFiles(b);
                const dataset = generateDataset(files, parser as any);
                await uploadApiFiles(dest, options, toAsyncIterable([dataset]));
            }
        });

    program.command('upload-api-files')
        .argument('<dest>', 'The destination to upload the API files to.')
        .description('Uploads API files to the specified destination. For S3, use the format s3://bucket-name/path/to/folder.')
        .option('--batch-size <size>', 'The number of translations to generate API files for in each batch.', '50')
        .option('--translations <translations...>', 'The translations to generate API files for.')
        .option('--overwrite', 'Whether to overwrite existing files.')
        .option('--overwrite-common-files', 'Whether to overwrite only common files.')
        .option('--file-pattern <pattern>', 'The file pattern regex that should be used to filter the files that are uploaded.')
        .option('--use-common-name', 'Whether to use the common name for the book chapter API link. If false, then book IDs are used.')
        .option('--generate-audio-files', 'Whether to replace the audio URLs in the dataset with ones that are hosted locally.')
        .option('--profile <profile>', 'The AWS profile to use for uploading to S3.')
        .option('--pretty', 'Whether to generate pretty-printed JSON files.')
        .action(async (dest: string, options: any) => {
            await uploadApiFilesFromDatabase(dest, options);
        });

    program.command('fetch-translations <dir> [translations...]')
        .description('Fetches the specified translations from fetch.bible and places them in the given directory.')
        .option('-a, --all', 'Fetch all translations. If omitted, only undownloaded translations will be fetched.')
        .action(async (dir: string, translations: string[], options: any) => {
            await fetchTranslations(dir, translations, options);
        });

    program.command('fetch-audio <dir> [translations...]')
        .description('Fetches the specified audio translations and places them in the given directory.\nTranslations should be in the format "translationId/audioId". e.g. "BSB/gilbert"')
        .option('-a, --all', 'Fetch all translations. If omitted, only undownloaded translations will be fetched.')
        .action(async (dir: string, translations: string[], options: any) => {
            await fetchAudio(dir, translations, options);
        });

    program.command('fetch-bible-metadata <dir>')
        .description('Fetches the Theographic bible metadata and places it in the given directory.')
        .action(async (dir: string) => {
            let files = [
                'books.json',
                'chapters.json',
                'easton.json',
                'events.json',
                'people.json',
                'peopleGroups.json',
                'periods.json',
                'places.json',
                'verses.json',
            ];

            await mkdir(dir, { recursive: true });

            let promises = files.map(async file => {
                const url = `https://raw.githubusercontent.com/robertrouse/theographic-bible-metadata/master/json/${file}`;
                const fullPath = path.resolve(dir, file);
                await downloadFile(url, fullPath);
            });

            await Promise.all(promises);
        });

    await program.parseAsync(process.argv);
}

start();