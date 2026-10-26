import { readFileSync } from 'fs';
import path from 'path';
import {
    FREE_USE_BIBLE_API_KOTLIN_MODEL_OPTIONS,
    generateKotlinModels,
    JsonSchema,
    KOTLIN_MODELS_PATH,
} from './kotlin';
import { createFreeUseBibleApiOpenApiDocument } from './openapi';

function generate(
    schemas: Record<string, JsonSchema>,
    options: Partial<Parameters<typeof generateKotlinModels>[1]> = {}
): string {
    return generateKotlinModels(
        { components: { schemas } },
        { packageName: 'test', ...options }
    );
}

describe('generateKotlinModels()', () => {
    it('should keep the Kotlin SDK models up to date with the OpenAPI document', () => {
        const expected = generateKotlinModels(
            createFreeUseBibleApiOpenApiDocument() as any,
            FREE_USE_BIBLE_API_KOTLIN_MODEL_OPTIONS
        );
        const actual = readFileSync(
            path.resolve(__dirname, '..', '..', KOTLIN_MODELS_PATH),
            'utf-8'
        );

        // If this fails, run "pnpm generate:kotlin" to regenerate the models.
        expect(actual).toBe(expected);
    });

    it('should generate data classes for objects', () => {
        const source = generate(
            {
                Thing: {
                    type: 'object',
                    description: 'A thing.',
                    properties: {
                        id: { type: 'string', description: 'The ID.' },
                        count: { type: 'number' },
                        score: { type: 'number' },
                        enabled: { type: 'boolean' },
                        tags: { type: 'array', items: { type: 'string' } },
                        links: {
                            type: 'object',
                            additionalProperties: { type: 'string' },
                        },
                        note: { anyOf: [{ type: 'string' }, { type: 'null' }] },
                        in: { type: 'string' },
                    },
                    required: ['id', 'count', 'score', 'tags', 'links', 'note'],
                },
            },
            { doubles: ['Thing.score'] }
        );

        expect(source).toContain(`/**
 * A thing.
 */
@Serializable
public data class Thing(
    /**
     * The ID.
     */
    public val id: String,

    public val count: Int,

    public val score: Double,

    public val enabled: Boolean? = null,

    public val tags: List<String>,

    public val links: Map<String, String>,

    public val note: String? = null,

    public val \`in\`: String? = null,
)`);
    });

    it('should generate sealed interfaces for discriminated unions', () => {
        const source = generate({
            Content: {
                oneOf: [
                    { $ref: '#/components/schemas/Heading' },
                    { $ref: '#/components/schemas/Break' },
                ],
                discriminator: { propertyName: 'type' },
            },
            Heading: {
                type: 'object',
                properties: {
                    type: { type: 'string', const: 'heading' },
                    text: { type: 'string' },
                },
                required: ['type', 'text'],
            },
            Break: {
                type: 'object',
                properties: {
                    type: { type: 'string', const: 'line_break' },
                },
                required: ['type'],
            },
        });

        expect(source).toContain(
            '@Serializable\n@JsonClassDiscriminator("type")\npublic sealed interface Content'
        );
        expect(source).toContain(
            'public data class UnknownContent(public val raw: JsonElement) : Content'
        );
        expect(source).toContain(
            'polymorphic(Content::class) { defaultDeserializer { UnknownContent.serializer() } }'
        );
        expect(source).toContain(
            '@Serializable\n@SerialName("heading")\npublic data class Heading(\n    public val text: String,\n) : Content'
        );
        expect(source).toContain(
            '@Serializable\n@SerialName("line_break")\npublic data object Break : Content'
        );
    });

    it('should generate content-based serializers for other unions', () => {
        const source = generate(
            {
                Verse: {
                    type: 'object',
                    properties: {
                        content: {
                            type: 'array',
                            items: {
                                anyOf: [
                                    { type: 'string' },
                                    { $ref: '#/components/schemas/Text' },
                                    { $ref: '#/components/schemas/Note' },
                                ],
                            },
                        },
                    },
                    required: ['content'],
                },
                Text: {
                    type: 'object',
                    properties: {
                        text: { type: 'string' },
                        poem: { type: 'number' },
                    },
                    required: ['text'],
                },
                Note: {
                    type: 'object',
                    properties: { noteId: { type: 'number' } },
                    required: ['noteId'],
                },
            },
            { names: { 'Verse.content[]': 'VerseContent' } }
        );

        expect(source).toContain('public val content: List<VerseContent>,');
        expect(source).toContain(
            '@Serializable(with = VerseContentSerializer::class)\npublic sealed interface VerseContent'
        );
        expect(source).toContain(
            'element is JsonPrimitive && element.isString -> PlainText.serializer()'
        );
        expect(source).toContain(
            'element is JsonObject && "text" in element -> Text.serializer()'
        );
        expect(source).toContain(
            'element is JsonObject && "noteId" in element -> Note.serializer()'
        );
        expect(source).toContain('else -> UnknownVerseContent.serializer()');
        expect(source).toContain(
            'public data class UnknownVerseContent(public val raw: JsonElement) : VerseContent'
        );
        expect(source).toContain(') : VerseContent\n');
        expect(source).toContain('public data class PlainText(');
    });

    it('should reuse inline objects with the same structure', () => {
        const chapter = {
            type: 'object',
            properties: { number: { type: 'number' } },
            required: ['number'],
        };
        const source = generate(
            {
                A: {
                    type: 'object',
                    properties: { chapter: { ...chapter, description: 'A' } },
                    required: ['chapter'],
                },
                B: {
                    type: 'object',
                    properties: { chapter: { ...chapter, description: 'B' } },
                    required: ['chapter'],
                },
            },
            { names: { 'A.chapter': 'ChapterData' } }
        );

        expect(source.match(/data class ChapterData\(/g)).toHaveLength(1);
        expect(source.match(/public val chapter: ChapterData,/g)).toHaveLength(
            2
        );
    });

    it('should generate extra unions', () => {
        const source = generate(
            {
                A: {
                    type: 'object',
                    properties: { a: { type: 'string' } },
                    required: ['a'],
                },
                B: {
                    type: 'object',
                    properties: { b: { type: 'string' } },
                    required: ['b'],
                },
            },
            { unions: { AOrB: { variants: ['A', 'B'] } } }
        );

        expect(source).toContain('public sealed interface AOrB');
        expect(source).toContain(') : AOrB');
    });

    it('should throw when union variants cannot be told apart', () => {
        const schema: JsonSchema = {
            type: 'object',
            properties: { a: { type: 'string' } },
            required: ['a'],
        };
        expect(() =>
            generate(
                { A: schema, B: schema },
                { unions: { AOrB: { variants: ['A', 'B'] } } }
            )
        ).toThrow(/Unable to find a property that distinguishes A/);
    });

    it('should represent enums as strings', () => {
        const source = generate({
            Direction: { type: 'string', enum: ['ltr', 'rtl'] },
        });
        expect(source).toContain('public typealias Direction = String');
    });
});
