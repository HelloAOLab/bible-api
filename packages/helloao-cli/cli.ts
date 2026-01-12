#!/usr/bin/env node

import { Command } from 'commander';
import path, { extname } from 'path';
import { mkdir, stat, writeFile } from 'fs/promises';
import { DOMParser, Element, Node } from 'linkedom';
import { downloadFile } from './downloads.js';
import { uploadApiFilesFromDatabase } from './uploads.js';
import {
    askForMetadata,
    fetchAudio,
    generateTranslationFiles,
    generateTranslationsFiles,
    importApi,
    importCommentaries,
    importCommentary,
    importTranslation,
    importTranslations,
    initDb,
    listEBibleTranslations,
    sourceTranslations,
    uploadTestTranslation,
    uploadTestTranslations,
} from './actions.js';
import { getPrismaDb } from './db.js';
import { confirm, input } from '@inquirer/prompts';
import { log } from '@helloao/tools';

async function start() {
    const parser = new DOMParser();
    globalThis.DOMParser = DOMParser as any;
    globalThis.Element = Element as any;
    globalThis.Node = Node as any;

    const program = new Command();

    program
        .name('helloao')
        .description('A CLI for managing a Free Use Bible API.')
        .option('--db <path>', 'Path to the database file.')
        .version('0.0.1');

    program
        .command('init [path]')
        .description('Initialize a new Bible API DB.')
        .option(
            '--source <path>',
            'The source database to copy from. If given a HTTPS URL, then the database will be downloaded from the given URL.'
        )
        .option('--overwrite', 'Whether to overwrite the existing database.')
        .option(
            '--language <languages...>',
            'The language(s) that the database should be initialized with.'
        )
        .action(async (dbPath: string, options: any) => {
            await initDb(dbPath, {
                ...program.opts(),
                ...options,
            });
        });

    program
        .command('generate-translation-metadata')
        .description('Generates a metadata file for a translation.')
        .action(async () => {
            const meta = await askForMetadata();

            const logger = log.getLogger();
            logger.log('Your metadata:', meta);

            const save = await confirm({
                message: 'Do you want to save this metadata?',
            });

            if (save) {
                let location = await input({
                    message: 'Where would you like to save the metadata?',
                });

                const ext = extname(location);

                if (!ext) {
                    if (!location.endsWith('/')) {
                        location += '/';
                    }
                    location += 'metadata.json';
                }

                logger.log('Saving metadata to:', location);

                const dir = path.dirname(location);
                await mkdir(dir, { recursive: true });
                await writeFile(location, JSON.stringify(meta, null, 2));
            }
        });

    program
        .command('import-translation <dir> [dirs...]')
        .description(
            'Imports a translation from the given directory into the database.'
        )
        .option('--overwrite', 'Whether to overwrite existing files.')
        .action(async (dir: string, dirs: string[], options: any) => {
            await importTranslation(dir, dirs, {
                ...program.opts(),
                ...options,
            });
        });

    program
        .command('import-translations <dir>')
        .description(
            'Imports all translations from the given directory into the database.'
        )
        .option('--overwrite', 'Whether to overwrite existing files.')
        .action(async (dir: string, options: any) => {
            await importTranslations(dir, {
                ...program.opts(),
                ...options,
            });
        });

    program
        .command('import-commentary <dir> [dirs...]')
        .description(
            'Imports a commentary from the given directory into the database.'
        )
        .option('--overwrite', 'Whether to overwrite existing files.')
        .action(async (dir: string, dirs: string[], options: any) => {
            await importCommentary(dir, dirs, {
                ...program.opts(),
                ...options,
            });
        });

    program
        .command('import-commentaries <dir>')
        .description(
            'Imports all commentaries from the given directory into the database.'
        )
        .option('--overwrite', 'Whether to overwrite existing files.')
        .action(async (dir: string, options: any) => {
            await importCommentaries(dir, {
                ...program.opts(),
                ...options,
            });
        });

    program
        .command('import-api <dir>')
        .description('Imports API files from the given directory into the DB.')
        .option('--overwrite', 'Whether to overwrite existing files.')
        .action(async (dir: string, options: any) => {
            await importApi(dir, {
                ...program.opts(),
                ...options,
            });
        });

    program
        .command('upload-test-translation <input>')
        .description(
            `Uploads a translation to the HelloAO Free Bible API test S3 bucket.\nRequires access to the HelloAO Free Bible API test S3 bucket.\nFor inquiries, please contact hello@helloao.org.`
        )
        .option(
            '--batch-size <size>',
            'The number of translations to generate API files for in each batch.',
            '50'
        )
        .option(
            '--translations <translations...>',
            'The translations to generate API files for.'
        )
        .option('--overwrite', 'Whether to overwrite existing files.')
        .option(
            '--overwrite-common-files',
            'Whether to overwrite only common files.'
        )
        .option(
            '--file-pattern <pattern>',
            'The file pattern regex that should be used to filter the files that are generated.'
        )
        .option(
            '--use-common-name',
            'Whether to use the common name for the book chapter API link. If false, then book IDs are used.'
        )
        .option(
            '--generate-audio-files',
            'Whether to replace the audio URLs in the dataset with ones that are hosted locally.'
        )
        .option(
            '--no-generate-complete-translation-files',
            'Whether to skip generating complete translation files.'
        )
        .option(
            '--profile <profile>',
            'The AWS profile to use for uploading to S3.'
        )
        .option(
            '--access-key-id <accessKeyId>',
            'The AWS access key ID to use for uploading to S3.'
        )
        .option(
            '--secret-access-key <secretAccessKey>',
            'The AWS Secret Access Key to use for uploading to S3.'
        )
        .option(
            '--s3-region <region>',
            'The AWS region to use for uploading to S3.'
        )
        .option('--pretty', 'Whether to generate pretty-printed JSON files.')
        .option(
            '--s3-url <s3Url>',
            'The S3 bucket URL to upload the files to.',
            's3://ao-bible-api-public-uploads'
        )
        .action(async (input: string, options: any) => {
            const good = await confirm({
                message:
                    'Uploaded files will be publicly accessible. Continue?',
                default: false,
            });
            if (!good) {
                return;
            }

            const result = await uploadTestTranslation(input, {
                ...program.opts(),
                ...options,
            });

            if (result) {
                const logger = log.getLogger();
                logger.log('\n');
                logger.log('Version:               ', result.version);
                logger.log('Uploaded to:           ', result.uploadS3Url);
                logger.log('URL:                   ', result.url);
                logger.log(
                    'Available Translations:',
                    result.availableTranslationsUrl
                );
            }
        });

    program
        .command('upload-test-translations <input>')
        .description(
            `Uploads all the translations in the given input directory to the HelloAO Free Bible API test S3 bucket.\nRequires access to the HelloAO Free Bible API test S3 bucket.\nFor inquiries, please contact hello@helloao.org.`
        )
        .option(
            '--batch-size <size>',
            'The number of translations to generate API files for in each batch.',
            '50'
        )
        .option(
            '--translations <translations...>',
            'The translations to generate API files for.'
        )
        .option('--overwrite', 'Whether to overwrite existing files.')
        .option(
            '--overwrite-common-files',
            'Whether to overwrite only common files.'
        )
        .option(
            '--file-pattern <pattern>',
            'The file pattern regex that should be used to filter the files that are generated.'
        )
        .option(
            '--use-common-name',
            'Whether to use the common name for the book chapter API link. If false, then book IDs are used.'
        )
        .option(
            '--generate-audio-files',
            'Whether to replace the audio URLs in the dataset with ones that are hosted locally.'
        )
        .option(
            '--no-generate-complete-translation-files',
            'Whether to skip generating complete translation files.'
        )
        .option(
            '--profile <profile>',
            'The AWS profile to use for uploading to S3.'
        )
        .option(
            '--access-key-id <accessKeyId>',
            'The AWS access key ID to use for uploading to S3.'
        )
        .option(
            '--secret-access-key <secretAccessKey>',
            'The AWS Secret Access Key to use for uploading to S3.'
        )
        .option(
            '--s3-region <region>',
            'The AWS region to use for uploading to S3.'
        )
        .option('--pretty', 'Whether to generate pretty-printed JSON files.')
        .option(
            '--s3-url <s3Url>',
            'The S3 bucket URL to upload the files to.',
            's3://ao-bible-api-public-uploads'
        )
        .action(async (input: string, options: any) => {
            const good = await confirm({
                message:
                    'Uploaded files will be publicly accessible. Continue?',
                default: false,
            });

            if (!good) {
                return;
            }

            const result = await uploadTestTranslations(input, {
                ...program.opts(),
                ...options,
            });

            if (result) {
                const logger = log.getLogger();
                logger.log('\nVersion:             ', result.version);
                logger.log('Uploaded to:          ', result.uploadS3Url);
                logger.log('URL:                  ', result.url);
                logger.log(
                    'Available Translations:',
                    result.availableTranslationsUrl
                );
            }
        });

    program
        .command('generate-translation-files <input> <dir>')
        .description('Generates API files from the given input translation.')
        .option(
            '--batch-size <size>',
            'The number of translations to generate API files for in each batch.',
            '50'
        )
        .option(
            '--translations <translations...>',
            'The translations to generate API files for.'
        )
        .option('--overwrite', 'Whether to overwrite existing files.')
        .option(
            '--overwrite-common-files',
            'Whether to overwrite only common files.'
        )
        .option(
            '--file-pattern <pattern>',
            'The file pattern regex that should be used to filter the files that are generated.'
        )
        .option(
            '--use-common-name',
            'Whether to use the common name for the book chapter API link. If false, then book IDs are used.'
        )
        .option(
            '--generate-audio-files',
            'Whether to replace the audio URLs in the dataset with ones that are hosted locally.'
        )
        .option(
            '--profile <profile>',
            'The AWS profile to use for uploading to S3.'
        )
        .option(
            '--access-key-id <accessKeyId>',
            'The AWS access key ID to use for uploading to S3.'
        )
        .option(
            '--secret-access-key <secretAccessKey>',
            'The AWS Secret Access Key to use for uploading to S3.'
        )
        .option(
            '--s3-region <region>',
            'The AWS region to use for uploading to S3.'
        )
        .option('--pretty', 'Whether to generate pretty-printed JSON files.')
        .option(
            '--no-generate-complete-translation-files',
            'Whether to skip generating complete translation files.'
        )
        .action(async (input: string, dest: string, options: any) => {
            await generateTranslationFiles(input, dest, {
                ...program.opts(),
                ...options,
            });
        });

    program
        .command('generate-translations-files <input> <dir>')
        .description('Generates API files from the given input translations.')
        .option(
            '--batch-size <size>',
            'The number of translations to generate API files for in each batch.',
            '50'
        )
        .option(
            '--translations <translations...>',
            'The translations to generate API files for.'
        )
        .option('--overwrite', 'Whether to overwrite existing files.')
        .option(
            '--overwrite-common-files',
            'Whether to overwrite only common files.'
        )
        .option(
            '--file-pattern <pattern>',
            'The file pattern regex that should be used to filter the files that are uploaded.'
        )
        .option(
            '--use-common-name',
            'Whether to use the common name for the book chapter API link. If false, then book IDs are used.'
        )
        .option(
            '--generate-audio-files',
            'Whether to replace the audio URLs in the dataset with ones that are hosted locally.'
        )
        .option(
            '--no-generate-complete-translation-files',
            'Whether to skip generating complete translation files.'
        )
        .option(
            '--profile <profile>',
            'The AWS profile to use for uploading to S3.'
        )
        .option(
            '--access-key-id <accessKeyId>',
            'The AWS access key ID to use for uploading to S3.'
        )
        .option(
            '--secret-access-key <secretAccessKey>',
            'The AWS Secret Access Key to use for uploading to S3.'
        )
        .option(
            '--s3-region <region>',
            'The AWS region to use for uploading to S3.'
        )
        .option('--pretty', 'Whether to generate pretty-printed JSON files.')
        .action(async (input: string, dest: string, options: any) => {
            await generateTranslationsFiles(input, dest, {
                ...program.opts(),
                ...options,
            });
        });

    program
        .command('upload-api-files')
        .argument('<dest>', 'The destination to upload the API files to.')
        .description(
            'Uploads API files to the specified destination. For S3, use the format s3://bucket-name/path/to/folder.'
        )
        .option(
            '--batch-size <size>',
            'The number of translations to generate API files for in each batch.',
            '50'
        )
        .option(
            '--translations <translations...>',
            'The translations or commentaries to generate API files for.'
        )
        .option('--overwrite', 'Whether to overwrite existing files.')
        .option(
            '--overwrite-common-files',
            'Whether to overwrite only common files.'
        )
        .option(
            '--overwrite-merged-files',
            'Whether to overwrite only merged files.'
        )
        .option(
            '--file-pattern <pattern>',
            'The file pattern regex that should be used to filter the files that are uploaded.'
        )
        .option(
            '--use-common-name',
            'Whether to use the common name for the book chapter API link. If false, then book IDs are used.'
        )
        .option(
            '--generate-audio-files',
            'Whether to replace the audio URLs in the dataset with ones that are hosted locally.'
        )
        .option(
            '--no-generate-complete-translation-files',
            'Whether to skip generating complete translation files.'
        )
        .option(
            '--profile <profile>',
            'The AWS profile to use for uploading to S3.'
        )
        .option(
            '--access-key-id <accessKeyId>',
            'The AWS access key ID to use for uploading to S3.'
        )
        .option(
            '--secret-access-key <secretAccessKey>',
            'The AWS Secret Access Key to use for uploading to S3.'
        )
        .option(
            '--s3-region <region>',
            'The AWS region to use for uploading to S3.'
        )
        .option('--pretty', 'Whether to generate pretty-printed JSON files.')
        .option(
            '--verbose',
            'Whether to output verbose information during the upload.'
        )
        .action(async (dest: string, options: any) => {
            const db = getPrismaDb(program.opts().db);
            try {
                await uploadApiFilesFromDatabase(db, dest, {
                    ...program.opts(),
                    ...options,
                });
            } finally {
                db.$disconnect();
            }
        });

    program
        .command('source-translations <dir> [translations...]')
        .description(
            'Finds translation sources from ebible.org and downloads it.'
        )
        .option(
            '--convert-to-usx3',
            'Convert USFM files to USX3 format after download'
        )
        .option(
            '--bible-multi-converter-path <path>',
            'Path to BibleMultiConverter.jar file'
        )
        .option('--overwrite', 'Overwrite existing files in output directory')
        .option('--no-database', 'Disable database tracking for downloads')
        .action(async (dir, translations, options) => {
            const sourceOptions = {
                convertToUsx3: options.convertToUsx3,
                bibleMultiConverterPath: options.bibleMultiConverterPath,
                useDatabase: options.database !== false,
                overwrite: options.overwrite,
                conversionOptions: {
                    overwrite: options.overwrite,
                },
            };

            await sourceTranslations(dir, translations, {
                ...program.opts(),
                ...sourceOptions,
            });
        });

    program
        .command('list-ebible-translations [search]')
        .description(
            'List available eBible translations. Optionally filter by search term.'
        )
        .action(async (search?: string) => {
            await listEBibleTranslations(search);
        });

    program
        .command('fetch-audio <dir> [translations...]')
        .description(
            'Fetches the specified audio translations and places them in the given directory.\nTranslations should be in the format "translationId/audioId". e.g. "BSB/gilbert"'
        )
        .option(
            '-a, --all',
            'Fetch all translations. If omitted, only undownloaded translations will be fetched.'
        )
        .action(async (dir: string, translations: string[], options: any) => {
            await fetchAudio(dir, translations, {
                ...program.opts(),
                ...options,
            });
        });

    program
        .command('fetch-bible-metadata <dir>')
        .description(
            'Fetches the Theographic bible metadata and places it in the given directory.'
        )
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

            let promises = files.map(async (file) => {
                const url = `https://raw.githubusercontent.com/robertrouse/theographic-bible-metadata/master/json/${file}`;
                const fullPath = path.resolve(dir, file);
                await downloadFile(url, fullPath);
            });

            await Promise.all(promises);
        });

    program
        .command('fetch-tyndale-open-resources <dir>')
        .description(
            'Fetches the Tyndale Open Bible Resources and places it in the given directory.'
        )
        .action(async (dir: string) => {
            let zipFiles = [
                'TyndaleOpenBibleDictionary.zip',
                'tyndale_open-studynotes.zip',
            ];

            await mkdir(dir, { recursive: true });

            let promises = zipFiles.map(async (file) => {
                const url = `https://tyndaleopenresources.com/wp-content/themes/tyndale-openresources/files/${file}`;
                const fullPath = path.resolve(dir, file);
                await downloadFile(url, fullPath);
            });

            await Promise.all(promises);
        });

    await program.parseAsync(process.argv);
}

start();
