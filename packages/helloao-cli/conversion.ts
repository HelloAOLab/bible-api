import { mkdir, readdir } from 'node:fs/promises';
import { existsSync } from 'fs';
import { execFile as execFileCallback } from 'child_process';
import { promisify } from 'util';
import { confirm, input } from '@inquirer/prompts';
import { log } from '@helloao/tools';

const execFile = promisify(execFileCallback);

/**
 * Finds BibleMultiConverter.jar automatically in common locations
 */
export async function findBibleMultiConverterJar(
    providedPath?: string
): Promise<string | null> {
    const logger = log.getLogger();
    //Use provided path
    if (providedPath && existsSync(providedPath)) {
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
 * Converts USFM directory to USX3 using BibleMultiConverter
 */
export async function convertUsfmToUsx3(
    inputDir: string,
    outputDir: string,
    jarPath: string
): Promise<boolean> {
    const logger = log.getLogger();
    try {
        logger.log(`Converting USFM files from ${inputDir} to USX3 format...`);

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
            inputDir,
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
