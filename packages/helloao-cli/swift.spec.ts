import { readFileSync } from 'fs';
import path from 'path';
import { createFreeUseBibleApiOpenApiDocument } from './openapi';
import { generateSwiftClient } from './swift';

const swiftSourcesDir = path.resolve(
    __dirname,
    '..',
    'free-use-bible-api-swift',
    'Sources',
    'FreeUseBibleAPI'
);

describe('generateSwiftClient()', () => {
    const generated = generateSwiftClient(
        createFreeUseBibleApiOpenApiDocument()
    );

    it('should match the generated files in the Swift SDK', () => {
        // If this fails, run `npm run generate:swift` to regenerate the Swift SDK.
        expect(
            readFileSync(
                path.resolve(swiftSourcesDir, 'Types.gen.swift'),
                'utf-8'
            )
        ).toBe(generated.types);
        expect(
            readFileSync(
                path.resolve(swiftSourcesDir, 'Operations.gen.swift'),
                'utf-8'
            )
        ).toBe(generated.operations);
    });

    it('should generate a method for every operation', () => {
        const document = createFreeUseBibleApiOpenApiDocument();
        const operationIds = Object.values<any>(document.paths).map(
            (p) => p.get.operationId
        );
        expect(operationIds.length).toBeGreaterThan(0);
        for (const id of operationIds) {
            const methodName =
                id === 'getTranslationComplete'
                    ? 'getCompleteTranslation'
                    : id === 'getSimpleTranslationComplete'
                      ? 'getSimpleCompleteTranslation'
                      : id;
            expect(generated.operations).toContain(
                `public func ${methodName}(`
            );
        }
    });

    it('should generate number properties as Int unless they can be fractional', () => {
        expect(generated.types).toContain('public var chapter: Int');
        expect(generated.types).toContain('public var score: Double');
        expect(generated.types).toContain('public var latitude: Double?');
        expect(generated.types).toContain(
            'public typealias TranslationBookChapterAudioTimings = [String: [Double]]'
        );
    });
});
