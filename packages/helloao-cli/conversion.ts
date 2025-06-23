import { mkdir, readdir } from 'node:fs/promises';
import { existsSync } from 'fs';
import { execFile as execFileCallback } from "child_process";
import { promisify } from "util";
import { confirm, input } from '@inquirer/prompts';

const execFile = promisify(execFileCallback);

/**
 * Finds BibleMultiConverter.jar automatically in common locations
 */
export async function findBibleMultiConverterJar(providedPath?: string): Promise<string | null> {
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
        'BibleMultiConverter.jar'
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
            console.log(`Found BibleMultiConverter.jar at: ${jarPath}`);
            return jarPath;
        }
    }

    return null;
}

/**
 * Prompts user for BibleMultiConverter.jar location
 */
export async function promptForBibleMultiConverter(): Promise<string | null> {
    console.log('BibleMultiConverter.jar not found in common locations.');

    const hasConverter = await confirm({
        message: 'Do you have BibleMultiConverter.jar available?',
    });

    if (!hasConverter) {
        console.log('Please download BibleMultiConverter.jar from: https://github.com/schierlm/BibleMultiConverter/releases');
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
        }
    });

    return jarPath;
}

/**
 * Converts USFM directory to USX3 using BibleMultiConverter
 */
export async function convertUsfmToUsx3(
    inputDir: string,
    outputDir: string,
    jarPath: string,
    overwrite: boolean
): Promise<boolean> {
    try {
        console.log(`Converting USFM files from ${inputDir} to USX3 format...`);

        // Handle overwrite logic for output directory
        if (overwrite && existsSync(outputDir)) {
            console.log(`Overwriting existing USX3 directory: ${outputDir}`);
            const { rm } = await import('node:fs/promises');
            await rm(outputDir, { recursive: true, force: true });
        }

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
            '*.usx'
        ];

        console.log(`Running: java ${args.join(' ')}`);

        const { stdout, stderr } = await execFile('java', args);

        if (stdout) console.log('Conversion output:', stdout);
        if (stderr) console.log('Conversion warnings:', stderr);

        // Verify conversion worked
        const files = await readdir(outputDir);
        const usxFiles = files.filter(f => f.endsWith('.usx'));

        if (usxFiles.length > 0) {
            console.log(`Successfully converted to ${usxFiles.length} USX3 files`);
            return true;
        } else {
            console.log('No USX3 files were created');
            return false;
        }

    } catch (error: any) {
        console.error('Conversion failed:', error.message);
        return false;
    }
}