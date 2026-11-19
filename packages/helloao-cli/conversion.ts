import {
    mkdir,
    mkdtemp,
    readdir,
    readFile,
    rm,
    writeFile,
} from 'node:fs/promises';
import { existsSync } from 'fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFile as execFileCallback } from 'child_process';
import { promisify } from 'util';
import { confirm, input } from '@inquirer/prompts';
import { log } from '@helloao/tools';

const execFile = promisify(execFileCallback);

/**
 * Finds BibleMultiConverter.jar automatically in common locations.
 * @param providedPath The path to BibleMultiConverter.jar. If given, it is used instead of searching,
 * and an error is thrown when it doesn't exist (so that a typo isn't silently replaced by another copy).
 */
export async function findBibleMultiConverterJar(
    providedPath?: string
): Promise<string | null> {
    const logger = log.getLogger();
    //Use provided path
    if (providedPath) {
        if (!existsSync(providedPath)) {
            throw new Error(
                `BibleMultiConverter.jar was not found at the given path: ${path.resolve(providedPath)}`
            );
        }
        return providedPath;
    }

    // Check common locations for standalone JAR file
    const commonPaths = [
        './BibleMultiConverter.jar',
        './tools/BibleMultiConverter.jar',
        '../BibleMultiConverter.jar',
        '../../BibleMultiConverter.jar',
        'BibleMultiConverter.jar',
    ];

    // Check common locations for JAR file inside BibleMultiConverter folder
    const folderPaths = [
        './BibleMultiConverter/BibleMultiConverter.jar',
        './tools/BibleMultiConverter/BibleMultiConverter.jar',
        '../BibleMultiConverter/BibleMultiConverter.jar',
        '../../BibleMultiConverter/BibleMultiConverter.jar',
    ];

    // Combine all paths to check
    const allPaths = [...commonPaths, ...folderPaths];

    for (const jarPath of allPaths) {
        if (existsSync(jarPath)) {
            logger.log(`Found BibleMultiConverter.jar at: ${jarPath}`);
            return jarPath;
        }
    }

    return null;
}

/**
 * Prompts user for BibleMultiConverter.jar location
 */
export async function promptForBibleMultiConverter(): Promise<string | null> {
    const logger = log.getLogger();
    logger.log('BibleMultiConverter.jar not found in common locations.');

    const hasConverter = await confirm({
        message: 'Do you have BibleMultiConverter.jar available?',
    });

    if (!hasConverter) {
        logger.log(
            'Please download BibleMultiConverter.jar from: https://github.com/schierlm/BibleMultiConverter/releases'
        );
        return null;
    }

    const jarPath = await input({
        message: 'Enter the full path to BibleMultiConverter.jar:',
        validate: (input: string) => {
            if (!existsSync(input)) {
                return 'File not found. Please enter a valid path.';
            }
            if (!input.endsWith('.jar')) {
                return 'Please provide a .jar file.';
            }
            return true;
        },
    });

    return jarPath;
}

/**
 * The version of the USFM preprocessing that convertUsfmToUsx3() does.
 * Increase this when preprocessUsfm() changes so that fetchers that skip unchanged sources
 * (e.g. fetchBsbTranslation()) convert them again.
 */
export const USFM_PREPROCESSING_VERSION = 1;

/**
 * Determines whether a source that was converted to USX3 with the given preprocessing version needs to be converted again,
 * because it was converted before the current USFM preprocessing (or wasn't converted at all).
 * @param version The preprocessing version that the source was converted with. Null or undefined if it wasn't converted.
 */
export function isUsfmPreprocessingOutdated(
    version: number | null | undefined
): boolean {
    return version !== USFM_PREPROCESSING_VERSION;
}

/**
 * Matches a USFM 3 reference (`\\ref TEXT|TARGET\\ref*`), including the nested form (`\\+ref ...\\+ref*`).
 * Group 1 is the "+" of a nested marker, group 2 is the display text, and group 3 is the optional link target
 * (e.g. `PSA 91:11-12` or `loc="PSA 91:11-12"`).
 */
const USFM_REF_REGEX =
    /\\(\+?)ref\s((?:(?!\\\+?ref\*)[^|])*?)(?:\|((?:(?!\\\+?ref\*)[\s\S])*?))?\\\1ref\*/g;

/**
 * The extensions of the files that are treated as USFM by preprocessUsfmDirectory().
 */
const USFM_EXTENSIONS = new Set(['.usfm', '.sfm']);

/**
 * Rewrites the USFM markup that BibleMultiConverter doesn't understand so that the converted USX3 contains
 * only the text that readers should see.
 *
 * - `\\ref TEXT|TARGET\\ref*` is replaced by `TEXT`. BibleMultiConverter doesn't know the `\\ref` marker, so it drops
 *   the markers and keeps the text on both sides of the pipe (e.g. "Psalm 91:11–12|PSA 91:11-12"), and it adds a space
 *   where the opening marker was (e.g. "( 1 Enoch 1:9|1:9)"). See https://github.com/HelloAOLab/bible-api/issues/144.
 *
 * @param usfm The USFM content.
 * @returns The preprocessed USFM content.
 */
export function preprocessUsfm(usfm: string): string {
    return usfm.replace(USFM_REF_REGEX, (_match, _plus, text: string) => text);
}

/**
 * Copies the files in the given directory to the given output directory and runs preprocessUsfm() on every USFM file.
 * Other files are copied unchanged.
 * @param inputDir The directory that contains the USFM files.
 * @param outputDir The directory that the preprocessed files should be written to.
 * @returns The number of USFM files that were changed.
 */
export async function preprocessUsfmDirectory(
    inputDir: string,
    outputDir: string
): Promise<number> {
    await mkdir(outputDir, { recursive: true });
    let changed = 0;
    for (const entry of await readdir(inputDir, { withFileTypes: true })) {
        if (!entry.isFile()) {
            continue;
        }
        const inputPath = path.join(inputDir, entry.name);
        const outputPath = path.join(outputDir, entry.name);
        const content = await readFile(inputPath);
        if (USFM_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
            const text = content.toString('utf-8');
            const processed = preprocessUsfm(text);
            if (processed !== text) {
                changed += 1;
                await writeFile(outputPath, processed, 'utf-8');
                continue;
            }
        }
        await writeFile(outputPath, content);
    }
    return changed;
}

/**
 * Converts USFM directory to USX3 using BibleMultiConverter.
 * The USFM files are first preprocessed with preprocessUsfm() in a temporary directory, so the input directory is not modified.
 */
export async function convertUsfmToUsx3(
    inputDir: string,
    outputDir: string,
    jarPath: string
): Promise<boolean> {
    const logger = log.getLogger();
    let preprocessedDir: string | null = null;
    try {
        logger.log(`Converting USFM files from ${inputDir} to USX3 format...`);

        preprocessedDir = await mkdtemp(
            path.join(tmpdir(), 'bible-api-usfm-preprocessed-')
        );
        const changed = await preprocessUsfmDirectory(
            inputDir,
            preprocessedDir
        );
        if (changed > 0) {
            logger.log(`Preprocessed ${changed} USFM files before conversion.`);
        }

        // Handle overwrite logic for output directory
        // if (overwrite && existsSync(outputDir)) {
        //     logger.log(`Overwriting existing USX3 directory: ${outputDir}`);
        //     const { rm } = await import('node:fs/promises');
        //     await rm(outputDir, { recursive: true, force: true });
        // }

        await mkdir(outputDir, { recursive: true });

        // Run BibleMultiConverter
        const args = [
            '-jar',
            jarPath,
            'ParatextConverter',
            'USFM',
            preprocessedDir,
            'USX3',
            outputDir,
            '*.usx',
        ];

        logger.log(`Running: java ${args.join(' ')}`);

        const { stdout, stderr } = await execFile('java', args);

        if (stdout) logger.log('Conversion output:', stdout);
        if (stderr) logger.log('Conversion warnings:', stderr);

        // Verify conversion worked
        const files = await readdir(outputDir);
        const usxFiles = files.filter((f) => f.endsWith('.usx'));

        if (usxFiles.length > 0) {
            logger.log(
                `Successfully converted to ${usxFiles.length} USX3 files`
            );
            return true;
        } else {
            logger.log('No USX3 files were created');
            return false;
        }
    } catch (error: any) {
        logger.error('Conversion failed:', error.message);
        return false;
    } finally {
        if (preprocessedDir) {
            await rm(preprocessedDir, { recursive: true, force: true });
        }
    }
}

/**
 * Instructions for manual USFM to USX3 conversion using BibleMultiConverter
 */
export const CONVERSION_INSTRUCTIONS = {
    downloadUrl: 'https://github.com/schierlm/BibleMultiConverter/releases',
    javaRequirement: 'Java 8 or higher required',

    getConversionCommand: (
        inputDir: string,
        outputDir: string,
        filenamePattern: string = '*.usx'
    ) => {
        return `java -jar BibleMultiConverter.jar ParatextConverter USFM "${inputDir}" USX3 "${outputDir}" "${filenamePattern}"`;
    },

    examples: {
        windows:
            'java -jar BibleMultiConverter.jar ParatextConverter USFM "C:\\input\\usfm" USX3 "C:\\output\\usx3" "*.usx"',
        unix: 'java -jar BibleMultiConverter.jar ParatextConverter USFM "/path/to/input/usfm" USX3 "/path/to/output/usx3" "*.usx"',
    },
};

/**
 * Prints conversion instructions for the user
 */
export function printConversionInstructions(): void {
    const logger = log.getLogger();
    logger.log('\n=== MANUAL CONVERSION REQUIRED ===');
    logger.log('Automatic conversion is not available.');
    logger.log('');
    logger.log('To enable automatic conversion, please:');
    logger.log('1. Download BibleMultiConverter.zip from:');
    logger.log(`   ${CONVERSION_INSTRUCTIONS.downloadUrl}`);
    logger.log('');
    logger.log('2. Extract the zip file to one of these locations:');
    logger.log('   • Current directory (./BibleMultiConverter/)');
    logger.log('   • Tools subdirectory (./tools/BibleMultiConverter/)');
    logger.log('   • Parent directory (../BibleMultiConverter/)');
    logger.log(
        '   • Or extract anywhere and provide the JAR path when prompted'
    );
    logger.log('');
    logger.log('3. Ensure Java 8+ is installed');
    logger.log('');
    logger.log('4. Re-run this command with the --convertToUsx3 option');
    logger.log('');
    logger.log('==========================================\n');
}
