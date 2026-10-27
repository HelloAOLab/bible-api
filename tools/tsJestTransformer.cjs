const { TsJestTransformer } = require('ts-jest');

/**
 * Wraps ts-jest so that modules which use `import.meta` can be loaded by Jest,
 * which runs the tests as CommonJS. `import.meta.url` and `import.meta.dirname`
 * are replaced with their CommonJS equivalents before the module is compiled.
 *
 * This lets the tests load the CLI's database code and the generated Prisma client.
 */
function replaceImportMeta(sourceText) {
    return sourceText
        .replace(
            /\bimport\.meta\.url\b/g,
            "require('url').pathToFileURL(__filename).href"
        )
        .replace(/\bimport\.meta\.dirname\b/g, '__dirname');
}

class ImportMetaTransformer extends TsJestTransformer {
    process(sourceText, sourcePath, options) {
        return super.process(
            replaceImportMeta(sourceText),
            sourcePath,
            options
        );
    }

    processAsync(sourceText, sourcePath, options) {
        return super.processAsync(
            replaceImportMeta(sourceText),
            sourcePath,
            options
        );
    }

    getCacheKey(sourceText, sourcePath, options) {
        return super.getCacheKey(
            replaceImportMeta(sourceText),
            sourcePath,
            options
        );
    }
}

module.exports = {
    createTransformer(tsJestConfig) {
        return new ImportMetaTransformer(tsJestConfig);
    },
};
