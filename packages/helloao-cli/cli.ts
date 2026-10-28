#!/usr/bin/env node

import { Command } from 'commander';
import path, { extname } from 'path';
import { mkdir, stat, writeFile } from 'fs/promises';
import { exec } from 'child_process';
import { DOMParser, Element, Node } from 'linkedom';
import { downloadFile } from './downloads.js';
import {
    uploadApiFilesFromDatabase,
    uploadOpenApiDocument,
} from './uploads.js';
import {
    convertOsisToUsfmFiles,
    askForMetadata,
    copyOpenBibleAudio,
    fetchAudio,
    fetchHistoryGlobe,
    fetchInterlinear,
    fetchOsisTranslations,
    generateTranslationFiles,
    generateTranslationsFiles,
    importApi,
    importBibleMetadata,
    importHistoryGlobe,
    importInterlinear,
    importAudioTimings,
    importCommentaries,
    importCommentary,
    importTranslation,
    importTranslations,
    initDb,
    listEBibleTranslations,
    listFetchBibleTranslations,
    refreshEBibleLicenses,
    sourceAllTranslations,
    sourceFetchBibleTranslations,
    sourceTranslations,
    searchTypesenseVerses,
    uploadTestTranslation,
    uploadTestTranslations,
    uploadTypesenseVerses,
} from './actions.js';
import { getPrismaDb } from './db.js';
import { sync } from './sync.js';
import {
    FETCH_BIBLE_COLLECTION_REF,
    FETCH_BIBLE_COLLECTION_REPO,
    FETCH_BIBLE_MANIFEST_URL,
} from './fetch-bible.js';
import { confirm, input } from '@inquirer/prompts';
import { log } from '@helloao/tools';
import { createFreeUseBibleApiOpenApiDocument } from './openapi.js';
import { createClient } from '@hey-api/openapi-ts';
import {
    FREE_USE_BIBLE_API_KOTLIN_MODEL_OPTIONS,
    generateKotlinModels,
    KOTLIN_MODELS_PATH,
} from './kotlin.js';
import { generateSwiftClient } from './swift.js';

const OPENAPI_CLIENT_LANGUAGES = [
    // ['csharp', 'csharp'],
    // ['java', 'java'],
    // ['go', 'go'],
    // ['python', 'python'],
    // ['dart', 'dart'],
    // ['swift', 'swift6'],
    ['typescript', '@hey-api/openapi-ts'],
] as const;

async function findProjectRoot(startDir: string): Promise<string> {
    let currentDir = path.resolve(startDir);
    while (true) {
        try {
            await stat(path.resolve(currentDir, 'openapitools.json'));
            return currentDir;
        } catch {
            // Keep searching upward for the repository root marker.
        }

        const parent = path.dirname(currentDir);
        if (parent === currentDir) {
            throw new Error(
                'Could not find project root (missing openapitools.json).'
            );
        }

        currentDir = parent;
    }
}

async function runOpenApiGenerator(
    cwd: string,
    inputPath: string,
    generatorName: string,
    outputPath: string
): Promise<void> {
    const executable = 'openapi-generator-cli';

    await new Promise<void>((resolve, reject) => {
        const child = exec(
            `${executable} generate -i "${inputPath}" -g "${generatorName}" -o "${outputPath}"`,
            {
                cwd,
            }
        );

        child.on('error', (error) => {
            const err = error as NodeJS.ErrnoException;
            if (err.code === 'ENOENT') {
                reject(
                    new Error(
                        'openapi-generator-cli was not found in PATH. Install it first and try again.'
                    )
                );
                return;
            }

            reject(error);
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolve();
                return;
            }

            reject(
                new Error(
                    `openapi-generator-cli failed for language "${generatorName}" with exit code ${code ?? 'unknown'}.`
                )
            );
        });
    });
}

async function applyClientPatch(
    outputPath: string,
    language: string,
    patchPath: string
): Promise<boolean> {
    try {
        await stat(patchPath);
    } catch {
        return false;
    }

    await new Promise<void>((resolve, reject) => {
        const child = exec(`git apply "${patchPath}"`, {
            cwd: outputPath,
        });

        let stderr = '';

        child.stderr?.on('data', (chunk) => {
            stderr += String(chunk);
        });

        child.on('error', (error) => {
            const err = error as NodeJS.ErrnoException;
            if (err.code === 'ENOENT') {
                reject(
                    new Error(
                        'git was not found in PATH. Install git first and try again.'
                    )
                );
                return;
            }

            reject(error);
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolve();
                return;
            }

            const details = stderr.trim();
            reject(
                new Error(
                    `Failed to apply client patch for language "${language}" from "${patchPath}".${details ? `\n${details}` : ''}`
                )
            );
        });
    });

    return true;
}

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
        .command('generate-openapi-metadata')
        .description('Generates a OpenAPI document file for the API.')
        .action(async () => {
            const document = createFreeUseBibleApiOpenApiDocument();

            const logger = log.getLogger();
            logger.log(
                'Your OpenAPI document:',
                JSON.stringify(document, null, 2)
            );
        });

    program
        .command('generate-clients')
        .description(
            'Generates OpenAPI clients in /clients for csharp, java, go, python, dart, swift6, and typescript-fetch.'
        )
        .action(async () => {
            const logger = log.getLogger();
            const projectRoot = await findProjectRoot(process.cwd());
            const tempDir = path.resolve(projectRoot, 'temp');
            const clientsDir = path.resolve(projectRoot, 'clients');
            const packagesDir = path.resolve(projectRoot, 'packages');
            const clientPatchesDir = path.resolve(
                projectRoot,
                'client-patches'
            );
            const openApiPath = path.resolve(tempDir, 'openapi.json');

            await mkdir(tempDir, { recursive: true });
            await mkdir(clientsDir, { recursive: true });
            await mkdir(clientPatchesDir, { recursive: true });

            const document = createFreeUseBibleApiOpenApiDocument();
            await writeFile(openApiPath, JSON.stringify(document, null, 2), {
                encoding: 'utf-8',
            });

            logger.log('OpenAPI document written to:', openApiPath);

            for (const [language, generatorName] of OPENAPI_CLIENT_LANGUAGES) {
                const outputPath =
                    language === 'typescript'
                        ? path.resolve(packagesDir, 'free-use-bible-api', 'gen')
                        : path.resolve(clientsDir, language);
                await mkdir(outputPath, { recursive: true });
                logger.log(
                    'Generating client:',
                    language,
                    'with generator:',
                    generatorName
                );
                if (generatorName === '@hey-api/openapi-ts') {
                    const tsConfigPath = path.resolve(
                        packagesDir,
                        'free-use-bible-api',
                        'tsconfig.json'
                    );
                    await createClient({
                        input: openApiPath,
                        output: {
                            path: outputPath,
                            tsConfigPath,
                            module: {
                                extension: '.js',
                            },
                        },
                        plugins: [
                            {
                                name: '@hey-api/sdk',
                                operations: {
                                    containerName: 'FreeUseBibleApi',
                                    strategy: 'single',
                                    methods: 'instance',
                                },
                                responseStyle: 'data',
                                examples: {
                                    moduleName: 'free-use-bible-api',
                                    setupName: 'api',
                                    enabled: true,
                                },
                            },
                            {
                                name: '@hey-api/typescript',
                            },
                        ],
                    });
                } else {
                    await runOpenApiGenerator(
                        projectRoot,
                        openApiPath,
                        generatorName,
                        outputPath
                    );
                }

                const patchPath = path.resolve(
                    clientPatchesDir,
                    `${language}.patch`
                );
                const patchApplied = await applyClientPatch(
                    outputPath,
                    language,
                    patchPath
                );

                if (patchApplied) {
                    logger.log('Applied client patch for language:', language);
                } else {
                    logger.log('No client patch found for language:', language);
                }
            }

            logger.log('OpenAPI client generation complete.');
        });

    program
        .command('generate-swift-client [dir]')
        .description(
            'Generates the types and endpoint methods for the Swift SDK from the OpenAPI document. Writes to packages/free-use-bible-api-swift/Sources/FreeUseBibleAPI by default.'
        )
        .action(async (dir: string | undefined) => {
            const logger = log.getLogger();
            const outputDir = dir
                ? path.resolve(dir)
                : path.resolve(
                      await findProjectRoot(process.cwd()),
                      'packages',
                      'free-use-bible-api-swift',
                      'Sources',
                      'FreeUseBibleAPI'
                  );

            const document = createFreeUseBibleApiOpenApiDocument();
            const generated = generateSwiftClient(document);

            await mkdir(outputDir, { recursive: true });
            await writeFile(
                path.resolve(outputDir, 'Types.gen.swift'),
                generated.types,
                'utf-8'
            );
            await writeFile(
                path.resolve(outputDir, 'Operations.gen.swift'),
                generated.operations,
                'utf-8'
            );

            logger.log('Swift client written to:', outputDir);
        });

    program
        .command('generate-kotlin-models')
        .description(
            'Generates the models for the Kotlin SDK (packages/free-use-bible-api-kotlin) from the OpenAPI document.'
        )
        .action(async () => {
            const logger = log.getLogger();
            const projectRoot = await findProjectRoot(process.cwd());
            const outputPath = path.resolve(projectRoot, KOTLIN_MODELS_PATH);

            const document = createFreeUseBibleApiOpenApiDocument();
            const source = generateKotlinModels(
                document as any,
                FREE_USE_BIBLE_API_KOTLIN_MODEL_OPTIONS
            );

            await mkdir(path.dirname(outputPath), { recursive: true });
            await writeFile(outputPath, source, { encoding: 'utf-8' });

            logger.log('Kotlin models written to:', outputPath);
        });

    program
        .command('convert-osis-to-usfm <file> <dir>')
        .description('Converts an OSIS XML file into per-book USFM files.')
        .option('--overwrite', 'Whether to overwrite existing files.')
        .action(async (file: string, dir: string, options: any) => {
            await convertOsisToUsfmFiles(file, dir, options);
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
        .command('import-translations <dirs...>')
        .description(
            'Imports all translations from the given directories into the database.'
        )
        .option('--overwrite', 'Whether to overwrite existing files.')
        .action(async (dirs: string[], options: any) => {
            await importTranslations(dirs, {
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
        .command('import-bible-metadata <dir>')
        .description(
            'Imports the Theographic bible metadata (people, places, events, and people groups) from the given directory into the database.\nThe directory should contain the JSON files downloaded by the fetch-bible-metadata command.'
        )
        .action(async (dir: string, options: any) => {
            await importBibleMetadata(dir, {
                ...program.opts(),
                ...options,
            });
        });

    program
        .command('import-interlinear <dir>')
        .description(
            'Imports the Berean interlinear words and the STEPBible lexicons from the given directory into the database.\nThe directory should contain the files downloaded by the fetch-interlinear command.'
        )
        .action(async (dir: string, options: any) => {
            await importInterlinear(dir, {
                ...program.opts(),
                ...options,
            });
        });

    program
        .command('import-history-globe <dir>')
        .description(
            'Imports the History Globe places from the given directory into the database.\nThe directory should contain the files downloaded by the fetch-history-globe command.'
        )
        .action(async (dir: string, options: any) => {
            await importHistoryGlobe(dir, {
                ...program.opts(),
                ...options,
            });
        });

    program
        .command('import-audio-timings <file>')
        .description(
            'Imports chapter audio timing data from the given JSON file into the database.\nThe file should contain an array of records: { translationId, bookId, chapterNumber, reader, verses } where verses is an array of numbers (seconds) - one per verse in the chapter, in order.'
        )
        .action(async (file: string, options: any) => {
            await importAudioTimings(file, {
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
            '--no-generate-simple-chapter-files',
            'Whether to skip generating simplified chapter files.'
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
            '--no-generate-simple-chapter-files',
            'Whether to skip generating simplified chapter files.'
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
        .option(
            '--no-generate-simple-chapter-files',
            'Whether to skip generating simplified chapter files.'
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
            '--no-generate-simple-chapter-files',
            'Whether to skip generating simplified chapter files.'
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
            '25'
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
            '--no-generate-simple-chapter-files',
            'Whether to skip generating simplified chapter files.'
        )
        .option(
            '--no-generate-open-api-document',
            'Whether to skip generating the OpenAPI document file.'
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
            const db = await getPrismaDb(program.opts().db);
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
        .command('sync [config]')
        .description(
            'Imports the new, changed, and deleted sources from the given sync config into the database, and uploads the changed translations, commentaries, and datasets to the destinations in the config.\n' +
                'Only the sources in the config are kept in the database and uploaded. Sources are reprocessed when they change or when the code that processes them changes.\n' +
                'The config defaults to ./sync.config.json. See the README for its format.'
        )
        .option(
            '--dry-run',
            'Only report what would change, without changing the database or any destination.'
        )
        .option(
            '--skip-import',
            'Skip importing the sources into the database.'
        )
        .option('--skip-upload', 'Skip uploading to the destinations.')
        .option(
            '--destination <urls...>',
            'Only upload to the given destinations from the config.'
        )
        .option(
            '--reprocess-all',
            'Re-import every source, even ones that have not changed.'
        )
        .option(
            '--reupload-all',
            'Re-upload every item, even ones that have not changed.'
        )
        .option(
            '--ignore-processor-changes',
            'Do not reprocess sources just because the processor changed. Use when you know a processor change does not affect the existing sources.'
        )
        .option(
            '--batch-size <size>',
            'The number of items to load from the database and upload at a time.',
            '10'
        )
        .option('--verbose', 'Log details about every source and item.')
        .action(async (config: string | undefined, options: any) => {
            const result = await sync(config ?? './sync.config.json', {
                db: program.opts().db,
                dryRun: options.dryRun,
                skipImport: options.skipImport,
                skipUpload: options.skipUpload,
                destinations: options.destination,
                reprocessAll: options.reprocessAll,
                reuploadAll: options.reuploadAll,
                ignoreProcessorChanges: options.ignoreProcessorChanges,
                batchSize: parseInt(options.batchSize),
                verbose: options.verbose,
            });

            if (result.errors.length > 0) {
                process.exitCode = 1;
            }
        });

    program
        .command('upload-open-api-document')
        .argument(
            '<dest>',
            'The destination to upload the OpenAPI document to.'
        )
        .description(
            'Uploads the OpenAPI document to the specified destination. For S3, use the format s3://bucket-name/path/to/folder.'
        )
        .option(
            '--batch-size <size>',
            'The number of translations to generate API files for in each batch.',
            '50'
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
            await uploadOpenApiDocument(dest, {
                ...program.opts(),
                ...options,
            });
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
        .command('source-fetch-bible-translations <dir> [translations...]')
        .description(
            'Finds translation sources from fetch.bible and downloads them.\nTranslations that are already provided by eBible are skipped.'
        )
        .option(
            '--convert-to-usx3',
            'Convert USFM files to USX3 format after download'
        )
        .option(
            '--bible-multi-converter-path <path>',
            'Path to BibleMultiConverter.jar file'
        )
        .option(
            '--overwrite',
            'Overwrite existing translations in the output directory (when database tracking is disabled)'
        )
        .option('--no-database', 'Disable database tracking for downloads')
        .option(
            '--ebible-dir <dir>',
            'The directory that eBible translations were sourced into. Translations in it are not downloaded from fetch.bible.'
        )
        .option(
            '--include-ebible',
            'Also download translations that are already provided by eBible'
        )
        .option(
            '--manifest-url <url>',
            'The URL of the fetch.bible manifest',
            FETCH_BIBLE_MANIFEST_URL
        )
        .option(
            '--collection-repo <repo>',
            'The GitHub repository (owner/name) of the fetch.bible collection',
            FETCH_BIBLE_COLLECTION_REPO
        )
        .option(
            '--collection-ref <ref>',
            'The branch (or other git ref) of the fetch.bible collection to download from',
            FETCH_BIBLE_COLLECTION_REF
        )
        .action(async (dir, translations, options) => {
            await sourceFetchBibleTranslations(dir, translations, {
                ...program.opts(),
                convertToUsx3: options.convertToUsx3,
                bibleMultiConverterPath: options.bibleMultiConverterPath,
                useDatabase: options.database !== false,
                overwrite: options.overwrite,
                ebibleDir: options.ebibleDir,
                includeEBible: options.includeEbible,
                manifestUrl: options.manifestUrl,
                repo: options.collectionRepo,
                ref: options.collectionRef,
            });
        });

    program
        .command('source-all-translations <dir> [translations...]')
        .description(
            'Finds translation sources from eBible and fetch.bible, and downloads them (along with the pinned OSIS translations) into the given directory so that they can be imported with import-translations.\nTranslations available from eBible are downloaded from eBible, and the rest are downloaded from fetch.bible. Only new and changed translations are downloaded.'
        )
        .option(
            '--no-convert-to-usx3',
            'Keep USFM files instead of converting them to USX3'
        )
        .option(
            '--bible-multi-converter-path <path>',
            'Path to BibleMultiConverter.jar file'
        )
        .option(
            '--overwrite',
            'Overwrite existing translations in the output directory (when database tracking is disabled)'
        )
        .option('--no-database', 'Disable database tracking for downloads')
        .option(
            '--fetch-bible-dir <dir>',
            'Put the translations from fetch.bible in this directory instead of <dir>. <dir> then only holds the translations from eBible.'
        )
        .option(
            '--osis-dir <dir>',
            'Put the pinned OSIS translations (see fetch-osis-translations) in this directory instead of <dir>.'
        )
        .option('--no-osis', 'Skip the pinned OSIS translations')
        .option(
            '--manifest-url <url>',
            'The URL of the fetch.bible manifest',
            FETCH_BIBLE_MANIFEST_URL
        )
        .option(
            '--collection-repo <repo>',
            'The GitHub repository (owner/name) of the fetch.bible collection',
            FETCH_BIBLE_COLLECTION_REPO
        )
        .option(
            '--collection-ref <ref>',
            'The branch (or other git ref) of the fetch.bible collection to download from',
            FETCH_BIBLE_COLLECTION_REF
        )
        .action(async (dir, translations, options) => {
            await sourceAllTranslations(dir, translations, {
                ...program.opts(),
                convertToUsx3: options.convertToUsx3,
                bibleMultiConverterPath: options.bibleMultiConverterPath,
                useDatabase: options.database !== false,
                overwrite: options.overwrite,
                fetchBibleDir: options.fetchBibleDir,
                osisDir: options.osisDir,
                includeOsis: options.osis !== false,
                manifestUrl: options.manifestUrl,
                repo: options.collectionRepo,
                ref: options.collectionRef,
            });
        });

    program
        .command('list-fetch-bible-translations [search]')
        .description(
            'List available fetch.bible translations. Optionally filter by search term.'
        )
        .action(async (search?: string) => {
            await listFetchBibleTranslations(search);
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
        .command('refresh-ebible-licenses [translations...]')
        .description(
            'Detects the licenses of the eBible translations that are already in the database and stores them.\nOptionally limited to the given translation IDs.'
        )
        .option(
            '--dir <dir>',
            'The directory that the translations were sourced into. If provided, their metadata.json files are also updated so that the licenses are kept when they are re-imported.'
        )
        .action(async (translations: string[], options: any) => {
            await refreshEBibleLicenses(translations, {
                ...program.opts(),
                ...options,
            });
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
        .command('fetch-interlinear <dir>')
        .description(
            'Fetches the Berean interlinear table and the STEPBible lexicons (with their license) and places them in the given directory.'
        )
        .action(async (dir: string) => {
            await fetchInterlinear(dir);
        });

    program
        .command('fetch-osis-translations <dir>')
        .description(
            'Fetches the pinned OSIS translations (such as the Japanese Kougo-yaku), checks their SHA-256 hashes, converts them to USFM and places them in the given directory.'
        )
        .action(async (dir: string) => {
            await fetchOsisTranslations(dir);
        });

    program
        .command('fetch-history-globe <dir>')
        .description(
            'Fetches the History Globe places and their verse references and places them in the given directory.'
        )
        .action(async (dir: string) => {
            await fetchHistoryGlobe(dir);
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

    program
        .command('upload-typesense-verses <nodes...>')
        .description('Uploads bible chapter verses to a Typesense instance.')
        .option(
            '--api-key <apiKey>',
            'The Typesense API key. If not specified, uses the TYPESENSE_API_KEY environment variable.'
        )
        .option('--language <language>', 'Filter by language code.')
        .option(
            '--translations <translations...>',
            'The translations to upload. If not specified, all translations are uploaded.'
        )
        .action(async (nodes: string[], options: any) => {
            const apiKey = options.apiKey || process.env.TYPESENSE_API_KEY;

            if (!apiKey) {
                console.error(
                    'Error: No API key provided. Use --api-key or set the TYPESENSE_API_KEY environment variable.'
                );
                process.exit(1);
            }

            const db = await getPrismaDb(program.opts().db);
            try {
                await uploadTypesenseVerses(nodes, apiKey, db, {
                    ...program.opts(),
                    ...options,
                });
            } finally {
                db.$disconnect();
            }
        });

    program
        .command('typesense-search <node> <language> <query>')
        .description(
            'Searches verses in the bible-verses Typesense collection.'
        )
        .option(
            '--api-key <apiKey>',
            'The Typesense API key. If not specified, uses the TYPESENSE_API_KEY environment variable.'
        )
        .option('--translation <translation>', 'Filter by translation ID.')
        .option('--book <book>', 'Filter by book ID.')
        .option('--chapter <chapter>', 'Filter by chapter number.')
        .action(
            async (
                node: string,
                language: string,
                query: string,
                options: any
            ) => {
                const apiKey = options.apiKey || process.env.TYPESENSE_API_KEY;

                if (!apiKey) {
                    console.error(
                        'Error: No API key provided. Use --api-key or set the TYPESENSE_API_KEY environment variable.'
                    );
                    process.exit(1);
                }

                const result = await searchTypesenseVerses([node], apiKey, {
                    translation: options.translation,
                    book: options.book,
                    chapter: options.chapter,
                    language,
                    search: query,
                });

                const logger = log.getLogger();
                logger.log(JSON.stringify(result, null, 2));
            }
        );

    program
        .command('copy-openbible-audio <src> <dest>')
        .description(
            'Copies .mp3 files from the OpenBible filename format to the Free Use Bible API format:\n/api/{translationId}/{bookId}/{chapterNumber}/audio/{reader}.mp3'
        )
        .option(
            '--translation <translation>',
            'The translation ID to copy (e.g. "BSB"). If omitted, all known translations are copied.'
        )
        .option(
            '--readers <readers...>',
            'The readers to copy (e.g. "hays souer"). If omitted, all known readers for the translation are copied.'
        )
        .option('--overwrite', 'Whether to overwrite existing files.')
        .action(async (src: string, dest: string, options: any) => {
            await copyOpenBibleAudio(src, dest, {
                ...program.opts(),
                ...options,
            });
        });

    await program.parseAsync(process.argv);
}

start();
