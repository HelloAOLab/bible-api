import { FileHandle, mkdir, open, readFile, readdir, writeFile } from "fs/promises";
import { extname } from "path";
import * as path from "path";
import { existsSync } from "fs-extra";
import { InputFile, InputTranslationMetadata, ParseTreeMetadata } from "@helloao/tools/generation/common-types";
import { SerializedFile, Uploader } from "./db";
import { ZipWriter, Writer, TextReader, Reader } from '@zip.js/zip.js';
import { Readable, Writable } from "stream";
import { sha256 } from "hash.js";
import { PARSER_VERSION } from "@helloao/tools/parser/usx-parser";

/**
 * Loads the files for the given translations.
 * @param dir The directory that the translations exist in.
 */
export async function loadTranslationsFiles(dirs: string[]): Promise<InputFile[]> {
    const promises = [] as Promise<InputFile[]>[];
    for (let dir of dirs) {
        const fullPath = path.resolve(dir);
        promises.push(loadTranslationFiles(fullPath));
    }

    const allFiles = await Promise.all(promises);
    const files = allFiles.flat();
    return files;
}

/**
 * Loads the files for the given translation.
 * @param translation The directory that the translation exists in.
 * @returns 
 */
export async function loadTranslationFiles(translation: string): Promise<InputFile[]> {
    const metadata: InputTranslationMetadata | null = await loadTranslationMetadata(translation);

    if (!metadata) {
        console.error('Could not load metadata for translation!', translation);
        return [];
    }

    let files = await readdir(translation);
    let usfmFiles = files.filter(f => extname(f) === '.usfm' || extname(f) === '.usx');

    if (usfmFiles.length <= 0) {
        translation = path.resolve(translation, 'usfm');
        if (existsSync(translation)) {
            files = await readdir(translation);
            usfmFiles = files.filter(f => extname(f) === '.usfm');
        }
    }

    if (usfmFiles.length <= 0) {
        console.error('Could not find USFM files for translation!', translation);
        return [];
    }

    let promises = [] as Promise<InputFile>[];
    for (let file of usfmFiles) {
        if (file === 'metadata.ts') {
            continue;
        }
        const filePath = path.resolve(translation, file);
        promises.push(loadFile(filePath, {
            translation: metadata
        }));
    }

    return await Promise.all(promises);
}

/**
 * Loads the metadata for the given translation.
 * @param translation The translation that the metadata should be loaded for.
 * @returns 
 */
async function loadTranslationMetadata(translation: string): Promise<InputTranslationMetadata | null> {
    const metadataTs = path.resolve(translation, 'metadata.ts');
    if (existsSync(metadataTs)) {
        return (await import(metadataTs)).default as InputTranslationMetadata;
    } else {
        const metadataJson = path.resolve(translation, 'meta.json');
        if (existsSync(metadataJson)) {
            const data = await readFile(metadataJson, { encoding: 'utf-8' });
            const metadata = JSON.parse(data) as CollectionTranslationMetadata;

            return {
                id: metadata.id ?? metadata.source.id,
                language: metadata.language,
                name: metadata.name.local,
                englishName: metadata.name.english,
                licenseUrl: metadata.copyright.attribution_url,
                website: metadata.copyright.attribution_url,
                shortName: metadata.name.abbrev,
                direction: metadata.direction
            };
        } else {
            const metadataJson = path.resolve(translation, 'metadata.json');
            if (existsSync(metadataJson)) {
                const data = await readFile(metadataJson, { encoding: 'utf-8' });
                return JSON.parse(data) as InputTranslationMetadata;
            }
        }
    }
    console.error('Could not find metadata for translation!', translation);
    return null;
}

/**
 * Loads the file from the given path using the given metadata.
 * @param file The file that should be loaded.
 * @param metadata The metadata.
 */
async function loadFile(file: string, metadata: ParseTreeMetadata): Promise<InputFile> {
    const extension = path.extname(file);

    const content = await readFile(file, {
        encoding: 'utf-8'
    });

    const hash = sha256()
        .update(content)

        // Hack to ensure that file hashes are different for different versions of the parser.
        .update(PARSER_VERSION)
        .digest('hex');

    return {
        content,
        metadata: metadata,
        name: file,
        sha256: hash,
        fileType: extension.slice(1) as 'usfm' | 'usx',
    }
}

export interface CollectionTranslationMetadata {
    name: {
        local: string;
        abbrev: string;
        english: string;
    },
    language: string;
    year: number;
    direction: 'ltr' | 'rtl';
    copyright: {
        licenses: any[];
        attribution: string;
        attribution_url: string;
    },
    id: string | null;
    source: {
        id: string;
    }
}

/**
 * Defines an uploader that is able to upload files to a directory.
 */
export class FilesUploader implements Uploader {
    
    private _dir: string;

    constructor(dir: string) {
        this._dir = dir;
    }

    get idealBatchSize(): number | null {
        return null;
    }

    async upload(file: SerializedFile, overwrite: boolean): Promise<boolean> {
        const filePath = path.resolve(this._dir, file.path);
        await mkdir(path.dirname(filePath), { recursive: true });

        if (overwrite || !existsSync(filePath)) {
            await writeFile(filePath, file.content, 'utf-8');
            return true;
        }

        return false;
    }

}

/**
 * Defines an uploader that is able to upload files into a zip file.
 */
export class ZipUploader implements Uploader {
    private _path: string;
    private _initPromise: Promise<ZipWriter<unknown>>;
    private _fileHandle: FileHandle | null = null;
    private _zip: ZipWriter<unknown> | null = null;

    constructor(filePath: string) {
        this._path = filePath;
        this._initPromise = this._init();
    }

    private async _init(): Promise<ZipWriter<unknown>> {
        this._fileHandle = await open(path.resolve(this._path), 'w');
        const writableStream = this._fileHandle.createWriteStream();
        this._zip = new ZipWriter(Writable.toWeb(writableStream));
        return this._zip;
    }

    get idealBatchSize(): number | null {
        return 50;
    }

    async upload(file: SerializedFile, _overwrite: boolean): Promise<boolean> {
        const zip = await this._initPromise;

        let reader: Reader<any> | ReadableStream;
        if (file.content instanceof Readable) {
            reader = Readable.toWeb(file.content) as any;
        } else if (typeof file.content === 'string') {
            reader = new TextReader(file.content);
        } else {
            throw new Error('Unknown file content type');
        }

        await zip.add(trimRelativePath(file.path), reader);
        return true;
    }

    async dispose(): Promise<void> {
        if (this._zip) {
            await this._zip.close();
        }
        if (this._fileHandle) {
            await this._fileHandle.close();
        }
    }
}

function trimRelativePath(path: string): string {
    if (path.startsWith('./')) {
        return path.substring(2);
    } else if (path.startsWith('../')) {
        return path.substring(3);
    } else if (path.startsWith('/')) {
        return path.substring(1);
    }

    return path;
}