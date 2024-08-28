import path, { extname } from 'node:path';
import * as database from './db';
import Sql from 'better-sqlite3';
import { DOMParser, Element, Node } from 'linkedom';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { BibleClient } from '@gracious.tech/fetch-client';
import { GetTranslationsItem } from '@gracious.tech/fetch-client/dist/esm/collection';
import {
  getFirstNonEmpty,
  getTranslationId,
  normalizeLanguage,
} from '@helloao/tools/utils';
import { InputFile, InputTranslationMetadata } from '@helloao/tools/generation';
import { exists } from 'fs-extra';
import { KNOWN_AUDIO_TRANSLATIONS } from '@helloao/tools/generation/audio';
import { bookChapterCountMap } from '@helloao/tools/generation/book-order';
import { downloadFile } from './downloads';
import { batch, toAsyncIterable } from '@helloao/tools/parser/iterators';
import {
  hashInputFiles,
  loadTranslationFiles,
  loadTranslationsFiles,
} from './files';
import { generateDataset } from '@helloao/tools/generation/dataset';
import { uploadApiFiles, UploadApiOptions } from './uploads';
import { getHttpUrl, parseS3Url } from './s3';

export interface InitDbOptions {
  /**
   * The path to the source database to copy the schema from.
   */
  source?: string;

  /**
   * The languages to copy from the source database. If not specified, then all languages will be copied.
   */
  language?: string[];
}

/**
 * Initializes a new Bible API DB.
 * @param dbPath The path to the database. If null or empty, then the "bible-api.db" will be used from the current working directory.
 * @param options The options for the initialization.
 */
export async function initDb(
  dbPath: string | null,
  options: InitDbOptions
): Promise<void> {
  console.log('Initializing new Bible API DB...');

  if (options.source) {
    const db = new Sql(database.getDbPath(dbPath), {});
    const sourcePath = path.resolve(options.source);

    try {
      console.log('Copying schema from source DB...');

      if (options.language) {
        console.log('Copying only the following languages:', options.language);

        const languages = `(${options.language
          .map((l: string) => `'${l}'`)
          .join(', ')})`;
        db.exec(`
                    ATTACH DATABASE "${sourcePath}" AS source;

                    CREATE TABLE "_prisma_migrations" AS SELECT * FROM source._prisma_migrations;
                    
                    CREATE TABLE "Translation" AS SELECT * FROM source.Translation
                    WHERE language IN ${languages};

                    CREATE TABLE "Book" AS SELECT * FROM source.Book
                    INNER JOIN source.Translation ON source.Translation.id = source.Book.translationId
                    WHERE source.Translation.language IN ${languages};

                    CREATE TABLE "Chapter" AS SELECT * FROM source.Chapter
                    INNER JOIN source.Translation ON source.Translation.id = source.Chapter.translationId
                    WHERE source.Translation.language IN ${languages};

                    CREATE TABLE "ChapterVerse" AS SELECT * FROM source.ChapterVerse
                    INNER JOIN source.Translation ON source.Translation.id = source.ChapterVerse.translationId
                    WHERE source.Translation.language IN ${languages};

                    CREATE TABLE "ChapterFootnote" AS SELECT * FROM source.ChapterFootnote
                    INNER JOIN source.Translation ON source.Translation.id = source.ChapterFootnote.translationId
                    WHERE source.Translation.language IN ${languages};

                    CREATE TABLE "ChapterAudioUrl" AS SELECT * FROM source.ChapterAudioUrl
                    INNER JOIN source.Translation ON source.Translation.id = source.ChapterAudioUrl.translationId
                    WHERE source.Translation.language IN ${languages};
                `);
      } else {
        db.exec(`
                    ATTACH DATABASE "${sourcePath}" AS source;

                    CREATE TABLE "_prisma_migrations" AS SELECT * FROM source._prisma_migrations;
                    CREATE TABLE "Translation" AS SELECT * FROM source.Translation;
                    CREATE TABLE "Book" AS SELECT * FROM source.Book;
                    CREATE TABLE "Chapter" AS SELECT * FROM source.Chapter;
                    CREATE TABLE "ChapterVerse" AS SELECT * FROM source.ChapterVerse;
                    CREATE TABLE "ChapterFootnote" AS SELECT * FROM source.ChapterFootnote;
                    CREATE TABLE "ChapterAudioUrl" AS SELECT * FROM source.ChapterAudioUrl;
                `);
      }

      console.log('Done.');
    } finally {
      db.close();
    }
  } else {
    const db = await database.getDb(database.getDbPath(dbPath));
    db.close();
  }
}

export interface ImportTranslationOptions {
  /**
   * Whether to forcibly import the translations, even if they have already been imported.
   */
  overwrite?: boolean;
}

/**
 * Imports a translation from the given directory into the database in the current working directory.
 * @param dir The directory that the translation is located in.
 * @param dirs Any extra directories that should be imported.
 * @param options The options for the import.
 */
export async function importTranslation(
  dir: string,
  dirs: string[],
  options: ImportTranslationOptions
): Promise<void> {
  const parser = new DOMParser();
  globalThis.DOMParser = DOMParser as any;
  globalThis.Element = Element as any;
  globalThis.Node = Node as any;

  const db = await database.getDbFromDir(process.cwd());
  try {
    await database.importTranslations(
      db,
      [dir, ...dirs],
      parser,
      !!options.overwrite
    );
  } finally {
    db.close();
  }
}

/**
 * Imports all the translations from the given directory into the database in the current working directory.
 * @param dir The directory that the translations are located in.
 * @param options The options.
 */
export async function importTranslations(
  dir: string,
  options: ImportTranslationOptions
): Promise<void> {
  const parser = new DOMParser();
  globalThis.DOMParser = DOMParser as any;
  globalThis.Element = Element as any;
  globalThis.Node = Node as any;

  const db = await database.getDbFromDir(process.cwd());
  try {
    const files = await readdir(dir);
    const translationDirs = files.map((f) => path.resolve(dir, f));
    console.log(`Importing ${translationDirs.length} translations`);
    await database.importTranslations(
      db,
      translationDirs,
      parser,
      !!options.overwrite
    );
  } finally {
    db.close();
  }
}

export interface FetchTranslationsOptions {
  /**
   * Fetch all translations. If omitted, only undownloaded translations will be fetched.
   */
  all?: boolean;
}

/**
 * Fetches the specified translations from fetch.bible and places them in the given directory.
 * @param dir The directory that the translations should be placed in.
 * @param translations The translations that should be downloaded. If not specified, then all translations will be downloaded.
 * @param options The options.
 */
export async function fetchTranslations(
  dir: string,
  translations?: string[],
  options: FetchTranslationsOptions = {}
): Promise<void> {
  const translationsSet = new Set(translations);
  const client = new BibleClient({
    remember_fetches: false,
  });

  const collection = await client.fetch_collection();
  const collectionTranslations = collection.get_translations();

  console.log(`Discovered ${collectionTranslations.length} translations`);

  const filtered =
    translations && translations.length <= 0
      ? collectionTranslations
      : collectionTranslations.filter((t) => translationsSet.has(t.id));

  let batches: GetTranslationsItem[][] = [];
  while (filtered.length > 0) {
    batches.push(filtered.splice(0, 10));
  }

  console.log(
    `Downloading ${filtered.length} translations in ${batches.length} batches`
  );

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`Downloading batch ${i + 1} of ${batches.length}`);
    const translations = await Promise.all(
      batch.map(async (t) => {
        const id = getTranslationId(t.id);
        const translation: InputTranslationMetadata = {
          id,
          name: getFirstNonEmpty(t.name_local, t.name_english, t.name_abbrev),
          direction: getFirstNonEmpty(t.direction, 'ltr'),
          englishName: getFirstNonEmpty(
            t.name_english,
            t.name_abbrev,
            t.name_local
          ),
          language: normalizeLanguage(t.language),
          licenseUrl: t.attribution_url,
          shortName: getFirstNonEmpty(t.name_abbrev, id),
          website: t.attribution_url,
        };

        const books = await Promise.all(
          collection.get_books(t.id).map(async (b) => {
            const name = `${b.id}.usx`;
            if (
              !options.all &&
              (await exists(path.resolve(dir, translation.id, name)))
            ) {
              return null;
            }

            const content = await collection.fetch_book(t.id, b.id, 'usx');

            const contentString = content.get_whole();
            const file: InputFile = {
              fileType: 'usx',
              content: contentString,
              metadata: {
                translation,
              },
              name,
            };

            return file;
          })
        );

        return {
          translation,
          books,
        };
      })
    );

    console.log(`Writing batch ${i + 1} of ${batches.length}`);
    let promises: Promise<void>[] = [];
    for (let { translation, books } of translations) {
      for (let book of books) {
        if (!book) {
          continue;
        }
        if (!book.name) {
          throw new Error('Book name is required');
        }
        const fullPath = path.resolve(dir, translation.id, book.name);
        await mkdir(path.dirname(fullPath), { recursive: true });
        const promise = writeFile(fullPath, book.content);
        promises.push(promise);
      }

      const translationPath = path.resolve(
        dir,
        translation.id,
        'metadata.json'
      );
      await mkdir(path.dirname(translationPath), { recursive: true });
      const translationData = JSON.stringify(translation, null, 2);
      promises.push(writeFile(translationPath, translationData));
    }

    await Promise.all(promises);
  }
}

/**
 * Fetches the specified audio translations and places them in the given directory.
 * Translations should be in the format "translationId/audioId". e.g. "BSB/gilbert"
 * @param dir The directory that the translations should be placed in.
 * @param translations The translations that should be downloaded.
 * @param options The options.
 */
export async function fetchAudio(
  dir: string,
  translations: string[],
  options: FetchTranslationsOptions = {}
): Promise<void> {
  for (let translation of translations) {
    const [translationId, reader] = translation.split('/');
    const generator = KNOWN_AUDIO_TRANSLATIONS.get(translationId)?.get(reader);

    if (!generator) {
      console.warn('Unknown translation:', translation);
      continue;
    }

    for (let [bookId, chapters] of bookChapterCountMap) {
      for (let chapter = 1; chapter <= chapters; chapter++) {
        const url = generator(bookId, chapter);
        const ext = extname(url);

        const [translationId, reader] = translation.split('/');

        const name = `${chapter}.${reader}${ext}`;
        const fullPath = path.resolve(
          dir,
          'audio',
          translationId,
          bookId,
          name
        );

        if (!options.all && (await exists(fullPath))) {
          continue;
        }

        await downloadFile(url, fullPath);
      }
    }
  }
}

/**
 * Generates the translation files directly from the translations stored in the given input directory.
 * @param input The input directory that the translations are stored in.
 * @param dest The destination to upload the API files to.
 * @param options The options for the generation.
 */
export async function generateTranslationsFiles(
  input: string,
  dest: string,
  options: UploadApiOptions
): Promise<void> {
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
}

/**
 * Generates the translation files directly from the translation stored in the given input directory.
 * @param input The input directory that the translation is stored in.
 * @param dest The destination to upload the API files to.
 * @param options The options for the generation.
 */
export async function generateTranslationFiles(
  input: string,
  dest: string,
  options: UploadApiOptions
): Promise<void> {
  const parser = new DOMParser();
  globalThis.DOMParser = DOMParser as any;
  globalThis.Element = Element as any;
  globalThis.Node = Node as any;

  const files = await loadTranslationFiles(path.resolve(input));
  const dataset = generateDataset(files, parser as any);
  await uploadApiFiles(dest, options, toAsyncIterable([dataset]));
}

/**
 * The options for uploading the test translations.
 */
export interface UploadTestTranslationOptions extends UploadApiOptions {
  /**
   * The s3 URL to upload the translations to.
   * Defaults to "s3://ao-bible-api-public-uploads"
   */
  s3Url?: string;
}

export interface UploadTestTranslationResult {
  /**
   * The S3 URL where the translations were uploaded to.
   */
  uploadS3Url: string;

  /**
   * The HTTP URL that the version can be accessed at.
   */
  url: string;

  /**
   * The URL that the available translations can be accessed at.
   */
  availableTranslationsUrl: string;

  /**
   * The version that was uploaded.
   * This is a SHA-256 hash of the input files.
   */
  version: string;
}

/**
 * Generates the API files directly from the translations stored in the given input directory and
 * uploads them to the HelloAO test s3 bucket.
 *
 * Requires access to the HelloAO test s3 bucket. Email hello@helloao.org for access.
 *
 * @param input The input directory that the translations are stored in.
 * @param options The options to use for the upload.
 */
export async function uploadTestTranslations(
  input: string,
  options: UploadTestTranslationOptions
): Promise<UploadTestTranslationResult> {
  const parser = new DOMParser();
  globalThis.DOMParser = DOMParser as any;
  globalThis.Element = Element as any;
  globalThis.Node = Node as any;

  const dirs = await readdir(path.resolve(input));
  const files = await loadTranslationsFiles(dirs);
  const hash = hashInputFiles(files);

  const dataset = generateDataset(files, parser as any);

  const url = options.s3Url || 's3://ao-bible-api-public-uploads';
  const dest = `${url}/${hash}`;

  await uploadApiFiles(dest, options, toAsyncIterable([dataset]));

  return {
    ...getUrls(dest),
    version: hash,
  };
}

/**
 * Generates the API files directly from the given translation and
 * uploads them to the HelloAO test s3 bucket.
 *
 * Requires access to the HelloAO test s3 bucket. Email hello@helloao.org for access.
 *
 * @param input The input directory that the translations are stored in.
 * @param options The options to use for the upload.
 */
export async function uploadTestTranslation(
  input: string,
  options: UploadTestTranslationOptions
): Promise<UploadTestTranslationResult> {
  const parser = new DOMParser();
  globalThis.DOMParser = DOMParser as any;
  globalThis.Element = Element as any;
  globalThis.Node = Node as any;

  const files = await loadTranslationFiles(path.resolve(input));
  const hash = hashInputFiles(files);
  const dataset = generateDataset(files, parser as any);

  const url = options.s3Url || 's3://ao-bible-api-public-uploads';
  const dest = `${url}/${hash}`;

  await uploadApiFiles(dest, options, toAsyncIterable([dataset]));

  return {
    ...getUrls(dest),
    version: hash,
  };
}

function getUrls(dest: string) {
  const url = getHttpUrl(dest);

  return {
    uploadS3Url: dest,
    url: url as string,
    availableTranslationsUrl: `${url}/api/available_translations.json`,
  };
}
