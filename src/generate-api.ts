import { readdir, readFile, mkdir, writeFile } from 'fs/promises';
import * as path from 'path';
import { generate, InputFile, InputTranslationMetadata, ParseTreeMetadata } from './usfm-parser/generator';

const bibleDirectory = path.resolve(__dirname, '..', 'bible');

const outputDirectory = path.resolve(__dirname, '..', 'build');

async function start() {
    const translations = await readdir(bibleDirectory);

    let promises = [] as Promise<InputFile[]>[];

    for(let translation of translations) {
        const translationPath = path.resolve(bibleDirectory, translation);
        console.log('translation', translationPath);
        promises.push(loadTranslation(translationPath));
    }

    const allFiles = await Promise.all(promises);

    const files = allFiles.flatMap(f => f);

    const output = generate(files);

    await mkdir(outputDirectory, {
        recursive: true,
    });

    let writePromises = [] as Promise<void>[];
    for (let file of output) {
        const finalPath = path.resolve(outputDirectory, file.path[0] === "/" ? file.path.slice(1) : file.path);

        const dir = path.dirname(finalPath);

        let promise = mkdir(dir, {
            recursive: true
        }).then(() => {
            return writeFile(finalPath, file.content);
        });

        writePromises.push(promise);
    }

    await Promise.all(writePromises);
}

async function loadTranslation(translation: string): Promise<InputFile[]> {
    const metadata: InputTranslationMetadata = (await import(path.resolve(translation, 'metadata.ts'))).default;

    if (!metadata) {
        console.error('Could not load metadata for translation!', translation);
        return [];
    }

    const files = await readdir(translation);

    let promises = [] as Promise<InputFile>[];
    for (let file of files) {
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

async function loadFile(file: string, metadata: ParseTreeMetadata): Promise<InputFile> {
    const extension = path.extname(file);

    const content = await readFile(file, {
        encoding: 'utf-8'
    });

    return {
        content,
        metadata: metadata,
        name: file,
        fileType: extension.slice(1) as 'usfm',
    }
}

start();