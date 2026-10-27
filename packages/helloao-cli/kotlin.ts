/**
 * Generates Kotlin (kotlinx.serialization) model classes from the Free Use Bible API OpenAPI document.
 *
 * General purpose OpenAPI generators produce poor Kotlin for the patterns that the API relies on
 * (anonymous unions such as `string | FormattedText | InlineHeading`, inline objects and nullable unions),
 * so this generator handles the subset of JSON Schema that the document uses:
 *
 * - Objects become `data class`es (or `data object`s when they have no properties).
 * - `oneOf`s with a discriminator become `sealed interface`s that use the discriminator as the class discriminator.
 * - Other `anyOf`/`oneOf`s of objects (and strings) become `sealed interface`s with a serializer
 *   that picks the variant based on which properties are present.
 * - String enums become `String`s, so that new values added to the API don't break existing clients.
 * - Maps (`additionalProperties`) become `Map<String, T>`.
 */

/**
 * A (very) loose representation of a JSON schema object from an OpenAPI document.
 */
export interface JsonSchema {
    $ref?: string;
    type?: string | string[];
    description?: string;
    properties?: Record<string, JsonSchema>;
    required?: string[];
    additionalProperties?: boolean | JsonSchema;
    items?: JsonSchema;
    anyOf?: JsonSchema[];
    oneOf?: JsonSchema[];
    allOf?: JsonSchema[];
    enum?: unknown[];
    const?: unknown;
    discriminator?: {
        propertyName: string;
        mapping?: Record<string, string>;
    };
    [key: string]: unknown;
}

export interface OpenApiDocumentLike {
    components?: {
        schemas?: Record<string, JsonSchema>;
    };
}

export interface KotlinModelOptions {
    /**
     * The package that the generated models should be placed in.
     */
    packageName: string;

    /**
     * The paths of the number properties that should be represented as `Double`s instead of `Int`s.
     *
     * Paths are formatted as `Schema.property`, with `[]` appended for array items and `{}` appended for map values.
     * For example, `ApiTranslationBookChapterAudioTimings.verses[]`.
     *
     * Entries without a `.` match a property with that name in any schema.
     */
    doubles?: string[];

    /**
     * The names that should be used for inline objects and unions, keyed by their path.
     * Inline types that aren't listed here are named by joining the name of the schema and the property.
     */
    names?: Record<string, string>;

    /**
     * Extra unions to generate, keyed by the name of the union.
     * Useful for endpoints that may return one of several schemas.
     */
    unions?: Record<string, { description?: string; variants: string[] }>;

    /**
     * The name of the class that represents strings in unions of strings and objects.
     * Defaults to `PlainText`.
     */
    stringVariantName?: string;

    /**
     * The command that should be mentioned in the header of the generated file.
     */
    generatedBy?: string;
}

interface ObjectDeclaration {
    kind: 'object';
    name: string;
    schema: JsonSchema;
    path: string;
    description?: string;
}

interface UnionDeclaration {
    kind: 'union';
    name: string;
    description?: string;
    /**
     * The property that is used to discriminate the variants. Undefined if the variants should be picked based on their contents.
     */
    discriminator?: string;
    variants: string[];
}

interface AliasDeclaration {
    kind: 'alias';
    name: string;
    type: string;
    description?: string;
}

type Declaration = ObjectDeclaration | UnionDeclaration | AliasDeclaration;

const KOTLIN_KEYWORDS = new Set([
    'as',
    'break',
    'class',
    'continue',
    'do',
    'else',
    'false',
    'for',
    'fun',
    'if',
    'in',
    'interface',
    'is',
    'null',
    'object',
    'package',
    'return',
    'super',
    'this',
    'throw',
    'true',
    'try',
    'typealias',
    'typeof',
    'val',
    'var',
    'when',
    'while',
]);

/**
 * Generates the source code of a Kotlin file containing the models for the schemas in the given OpenAPI document.
 * @param document The OpenAPI document.
 * @param options The options for the generator.
 */
export function generateKotlinModels(
    document: OpenApiDocumentLike,
    options: KotlinModelOptions
): string {
    return new KotlinModelGenerator(document, options).generate();
}

class KotlinModelGenerator {
    private _schemas: Record<string, JsonSchema>;
    private _options: KotlinModelOptions;
    private _stringVariantName: string;
    private _doubles: Set<string>;

    /**
     * The declarations to emit, keyed by name.
     */
    private _declarations = new Map<string, Declaration>();

    /**
     * The canonical forms of the inline objects that have been declared, mapped to their names.
     * Used to deduplicate inline objects that have the same structure.
     */
    private _inlineObjects = new Map<string, string>();

    /**
     * The unions that each class is a variant of.
     */
    private _parents = new Map<string, Set<string>>();

    /**
     * Whether a union includes plain strings.
     */
    private _usesStringVariant = false;

    constructor(document: OpenApiDocumentLike, options: KotlinModelOptions) {
        this._schemas = document.components?.schemas ?? {};
        this._options = options;
        this._stringVariantName = options.stringVariantName ?? 'PlainText';
        this._doubles = new Set(options.doubles ?? []);
    }

    generate(): string {
        for (const [name, schema] of Object.entries(this._schemas)) {
            this._declareComponent(name, schema);
        }

        for (const [name, union] of Object.entries(
            this._options.unions ?? {}
        )) {
            this._declareUnion(
                name,
                union.variants.map((v) => ({
                    $ref: `#/components/schemas/${v}`,
                })),
                union.description,
                undefined
            );
        }

        // Resolve the types of every property so that inline declarations (and their properties)
        // are discovered before rendering.
        const resolved = new Set<string>();
        let pending: ObjectDeclaration[];
        do {
            pending = [...this._declarations.values()].filter(
                (d): d is ObjectDeclaration =>
                    d.kind === 'object' && !resolved.has(d.name)
            );
            for (const declaration of pending) {
                resolved.add(declaration.name);
                this._resolveProperties(declaration);
            }
        } while (pending.length > 0);

        const blocks: string[] = [];
        if (this._usesStringVariant) {
            blocks.push(this._renderStringVariant());
        }
        for (const declaration of this._declarations.values()) {
            if (declaration.kind === 'object') {
                blocks.push(this._renderObject(declaration));
            } else if (declaration.kind === 'union') {
                blocks.push(this._renderUnion(declaration));
            } else {
                blocks.push(this._renderAlias(declaration));
            }
        }

        const discriminatedUnions = [...this._declarations.values()].filter(
            (d): d is UnionDeclaration =>
                d.kind === 'union' && !!d.discriminator
        );
        if (discriminatedUnions.length > 0) {
            blocks.push(
                [
                    '/**',
                    ' * Decodes unrecognized members of discriminated unions as their Unknown variants.',
                    ' */',
                    'internal val UnknownContentSerializersModule = SerializersModule {',
                    ...discriminatedUnions.map(
                        (d) =>
                            `    polymorphic(${d.name}::class) { defaultDeserializer { Unknown${d.name}.serializer() } }`
                    ),
                    '}',
                ].join('\n')
            );
        }

        const header = [
            `// This file was generated from the Free Use Bible API OpenAPI document. Do not edit it by hand.`,
            this._options.generatedBy
                ? `// To regenerate it, run: ${this._options.generatedBy}`
                : null,
            '',
            '@file:OptIn(ExperimentalSerializationApi::class)',
            '',
            `package ${this._options.packageName}`,
            '',
            'import kotlinx.serialization.DeserializationStrategy',
            'import kotlinx.serialization.ExperimentalSerializationApi',
            'import kotlinx.serialization.KSerializer',
            'import kotlinx.serialization.SerialName',
            'import kotlinx.serialization.Serializable',
            'import kotlinx.serialization.descriptors.PrimitiveKind',
            'import kotlinx.serialization.descriptors.PrimitiveSerialDescriptor',
            'import kotlinx.serialization.descriptors.SerialDescriptor',
            'import kotlinx.serialization.encoding.Decoder',
            'import kotlinx.serialization.encoding.Encoder',
            'import kotlinx.serialization.json.JsonClassDiscriminator',
            'import kotlinx.serialization.json.JsonContentPolymorphicSerializer',
            'import kotlinx.serialization.json.JsonElement',
            'import kotlinx.serialization.json.JsonObject',
            'import kotlinx.serialization.json.JsonPrimitive',
            'import kotlinx.serialization.modules.SerializersModule',
            'import kotlinx.serialization.modules.polymorphic',
        ].filter((line) => line !== null);

        return header.join('\n') + '\n\n' + blocks.join('\n\n') + '\n';
    }

    private _declareComponent(name: string, schema: JsonSchema) {
        const variants = schema.oneOf ?? schema.anyOf;
        if (variants && !this._isNullableOrPrimitiveUnion(variants)) {
            this._declareUnion(
                name,
                variants,
                schema.description,
                schema.discriminator?.propertyName
            );
        } else if (schema.properties) {
            this._declareObject(name, schema, name);
        } else {
            this._declarations.set(name, {
                kind: 'alias',
                name,
                description: this._describe(schema),
                type: this._resolveType(schema, name, name).type,
            });
        }
    }

    private _declareObject(name: string, schema: JsonSchema, path: string) {
        this._declarations.set(name, {
            kind: 'object',
            name,
            schema,
            path,
            description: this._describe(schema),
        });
    }

    private _declareUnion(
        name: string,
        variants: JsonSchema[],
        description: string | undefined,
        discriminator: string | undefined
    ) {
        const variantNames: string[] = [];
        for (const variant of variants) {
            if (this._isNull(variant)) {
                continue;
            }
            let variantName: string;
            if (variant.$ref) {
                variantName = this._refName(variant.$ref);
            } else if (this._isString(variant)) {
                variantName = this._stringVariantName;
                this._usesStringVariant = true;
            } else if (variant.properties) {
                variantName = this._declareInlineObject(
                    `${name}${variantNames.length + 1}`,
                    variant,
                    `${name}|${variantNames.length}`
                );
            } else {
                throw new Error(
                    `Unsupported union variant in ${name}: ${JSON.stringify(variant)}`
                );
            }
            variantNames.push(variantName);
            let parents = this._parents.get(variantName);
            if (!parents) {
                parents = new Set();
                this._parents.set(variantName, parents);
            }
            parents.add(name);
        }

        this._declarations.set(name, {
            kind: 'union',
            name,
            description,
            discriminator,
            variants: variantNames,
        });
    }

    private _declareInlineObject(
        defaultName: string,
        schema: JsonSchema,
        path: string
    ): string {
        const canonical = JSON.stringify(stripDescriptions(schema));
        const existing = this._inlineObjects.get(canonical);
        if (existing) {
            return existing;
        }
        const name = this._options.names?.[path] ?? defaultName;
        if (this._declarations.has(name)) {
            throw new Error(
                `Unable to declare inline object at ${path} because the name "${name}" is already in use. Provide a name for it using the "names" option.`
            );
        }
        this._inlineObjects.set(canonical, name);
        this._declareObject(name, schema, path);
        return name;
    }

    private _resolveProperties(declaration: ObjectDeclaration) {
        for (const [prop, schema] of Object.entries(
            declaration.schema.properties ?? {}
        )) {
            this._resolveType(
                schema,
                `${declaration.path}.${prop}`,
                `${declaration.name}${pascalCase(prop)}`
            );
        }
    }

    /**
     * Resolves the Kotlin type for the given schema, declaring any inline types that it needs.
     * @param schema The schema.
     * @param path The path to the schema. Used for naming inline types and looking up overrides.
     * @param defaultName The name that inline types should use if they don't have an override.
     */
    private _resolveType(
        schema: JsonSchema,
        path: string,
        defaultName: string
    ): { type: string; nullable: boolean } {
        if (schema.$ref) {
            const name = this._refName(schema.$ref);
            return { type: name, nullable: false };
        }

        const variants = schema.anyOf ?? schema.oneOf;
        if (variants) {
            const nonNull = variants.filter((v) => !this._isNull(v));
            const nullable = nonNull.length !== variants.length;
            if (nonNull.length === 1) {
                const resolved = this._resolveType(
                    nonNull[0],
                    path,
                    defaultName
                );
                return {
                    type: resolved.type,
                    nullable: nullable || resolved.nullable,
                };
            }
            if (nonNull.every((v) => this._isString(v))) {
                return { type: 'String', nullable };
            }
            if (nonNull.every((v) => this._isNumber(v))) {
                return { type: this._numberType(path), nullable };
            }
            const name = this._options.names?.[path] ?? defaultName;
            if (!this._declarations.has(name)) {
                this._declareUnion(
                    name,
                    nonNull,
                    this._describe(schema),
                    schema.discriminator?.propertyName
                );
            }
            return { type: name, nullable };
        }

        const types = Array.isArray(schema.type)
            ? schema.type
            : schema.type
              ? [schema.type]
              : [];
        const nullable = types.includes('null');
        const type = types.find((t) => t !== 'null');

        if (schema.enum || typeof schema.const === 'string') {
            return { type: 'String', nullable };
        }

        switch (type) {
            case 'string':
                return { type: 'String', nullable };
            case 'boolean':
                return { type: 'Boolean', nullable };
            case 'integer':
                return { type: 'Int', nullable };
            case 'number':
                return { type: this._numberType(path), nullable };
            case 'array': {
                const item = this._resolveType(
                    schema.items ?? {},
                    `${path}[]`,
                    `${defaultName}Item`
                );
                return {
                    type: `List<${formatType(item)}>`,
                    nullable,
                };
            }
            case 'object':
            case undefined: {
                if (schema.properties) {
                    const name = this._declareInlineObject(
                        defaultName,
                        schema,
                        path
                    );
                    return { type: name, nullable };
                }
                if (
                    typeof schema.additionalProperties === 'object' &&
                    Object.keys(schema.additionalProperties).length > 0
                ) {
                    const value = this._resolveType(
                        schema.additionalProperties,
                        `${path}{}`,
                        `${defaultName}Value`
                    );
                    return {
                        type: `Map<String, ${formatType(value)}>`,
                        nullable,
                    };
                }
                return {
                    type: type === 'object' ? 'JsonObject' : 'JsonElement',
                    nullable,
                };
            }
            default:
                throw new Error(
                    `Unsupported schema type "${type}" at ${path}.`
                );
        }
    }

    private _numberType(path: string): string {
        const prop = path
            .split('.')
            .pop()!
            .replace(/(\[\]|\{\})+$/, '');
        return this._doubles.has(path) || this._doubles.has(prop)
            ? 'Double'
            : 'Int';
    }

    private _renderObject(declaration: ObjectDeclaration): string {
        const { name, schema } = declaration;
        const parents = [...(this._parents.get(name) ?? [])];
        const discriminatedParents = parents
            .map((p) => this._declarations.get(p) as UnionDeclaration)
            .filter((p) => !!p.discriminator);
        const discriminators = new Set(
            discriminatedParents.map((p) => p.discriminator!)
        );

        let serialName: string | undefined;
        const properties: string[] = [];
        const required = new Set(schema.required ?? []);
        for (const [prop, propSchema] of Object.entries(
            schema.properties ?? {}
        )) {
            if (discriminators.has(prop)) {
                // The discriminator is handled by kotlinx.serialization, so it can't also be a property.
                if (typeof propSchema.const !== 'string') {
                    throw new Error(
                        `The "${prop}" discriminator property of ${name} must be a string constant.`
                    );
                }
                serialName = propSchema.const;
                continue;
            }

            const resolved = this._resolveType(
                propSchema,
                `${declaration.path}.${prop}`,
                `${name}${pascalCase(prop)}`
            );
            const nullable = resolved.nullable || !required.has(prop);
            let defaultValue = '';
            if (nullable) {
                defaultValue = ' = null';
            } else if (propSchema.const !== undefined) {
                defaultValue = ` = ${JSON.stringify(propSchema.const)}`;
            }

            const lines: string[] = [];
            const doc = renderDoc(this._describe(propSchema), '    ');
            if (doc) {
                lines.push(doc);
            }
            lines.push(
                `    public val ${identifier(prop)}: ${resolved.type}${nullable ? '?' : ''}${defaultValue},`
            );
            properties.push(lines.join('\n'));
        }

        const annotations = ['@Serializable'];
        if (serialName !== undefined) {
            annotations.push(`@SerialName(${JSON.stringify(serialName)})`);
        }
        const supertypes = parents.length > 0 ? ` : ${parents.join(', ')}` : '';
        const doc = renderDoc(declaration.description, '');
        const prefix = (doc ? doc + '\n' : '') + annotations.join('\n');

        if (properties.length === 0) {
            return `${prefix}\npublic data object ${name}${supertypes}`;
        }

        return `${prefix}\npublic data class ${name}(\n${properties.join('\n\n')}\n)${supertypes}`;
    }

    private _renderUnion(declaration: UnionDeclaration): string {
        const { name } = declaration;
        const doc = renderDoc(declaration.description, '');
        const prefix = doc ? doc + '\n' : '';
        const parents = [...(this._parents.get(name) ?? [])];
        const supertypes = parents.length > 0 ? ` : ${parents.join(', ')}` : '';

        const unknown = this._renderUnknownVariant(name);
        if (declaration.discriminator) {
            return `${prefix}@Serializable\n@JsonClassDiscriminator(${JSON.stringify(declaration.discriminator)})\npublic sealed interface ${name}${supertypes}\n\n${unknown}`;
        }

        const serializerName = `${name}Serializer`;
        const objectVariants = declaration.variants.filter(
            (v) => v !== this._stringVariantName
        );
        const cases: string[] = [];
        if (objectVariants.length !== declaration.variants.length) {
            cases.push(
                `        element is JsonPrimitive && element.isString -> ${this._stringVariantName}.serializer()`
            );
        }
        for (const variant of objectVariants) {
            const key = this._findDistinguishingProperty(
                variant,
                objectVariants
            );
            cases.push(
                `        element is JsonObject && ${JSON.stringify(key)} in element -> ${variant}.serializer()`
            );
        }
        cases.push(`        else -> Unknown${name}.serializer()`);

        return (
            [
                `${prefix}@Serializable(with = ${serializerName}::class)`,
                `public sealed interface ${name}${supertypes}`,
                '',
                `internal object ${serializerName} : JsonContentPolymorphicSerializer<${name}>(${name}::class) {`,
                `    override fun selectDeserializer(element: JsonElement): DeserializationStrategy<${name}> = when {`,
                ...cases,
                '    }',
                '}',
            ].join('\n') +
            '\n\n' +
            unknown
        );
    }

    /**
     * Renders the fallback variant that keeps the raw JSON of union members
     * this version of the SDK does not know about.
     */
    private _renderUnknownVariant(name: string): string {
        return [
            `/**`,
            ` * A ${name} that this version of the SDK does not recognize.`,
            ` * The original JSON is kept in [raw].`,
            ` */`,
            `@Serializable(with = Unknown${name}Serializer::class)`,
            `public data class Unknown${name}(public val raw: JsonElement) : ${name}`,
            '',
            `/**`,
            ` * Reads and writes [Unknown${name}] as its raw JSON.`,
            ` */`,
            `internal object Unknown${name}Serializer : KSerializer<Unknown${name}> {`,
            `    override val descriptor: SerialDescriptor = JsonElement.serializer().descriptor`,
            `    override fun deserialize(decoder: Decoder): Unknown${name} {`,
            `        return Unknown${name}(decoder.decodeSerializableValue(JsonElement.serializer()))`,
            `    }`,
            `    override fun serialize(encoder: Encoder, value: Unknown${name}) {`,
            `        encoder.encodeSerializableValue(JsonElement.serializer(), value.raw)`,
            `    }`,
            `}`,
        ].join('\n');
    }

    private _renderAlias(declaration: AliasDeclaration): string {
        const doc = renderDoc(declaration.description, '');
        return `${doc ? doc + '\n' : ''}public typealias ${declaration.name} = ${declaration.type}`;
    }

    private _renderStringVariant(): string {
        const name = this._stringVariantName;
        const parents = [...(this._parents.get(name) ?? [])];
        return [
            '/**',
            ' * A piece of plain text in a union of text and objects.',
            ' *',
            ' * Serialized as a plain JSON string.',
            ' */',
            `@Serializable(with = ${name}Serializer::class)`,
            `public data class ${name}(`,
            '    /**',
            '     * The text.',
            '     */',
            '    public val text: String,',
            `) : ${parents.join(', ')}`,
            '',
            `internal object ${name}Serializer : KSerializer<${name}> {`,
            `    override val descriptor: SerialDescriptor = PrimitiveSerialDescriptor(${JSON.stringify(`${this._options.packageName}.${name}`)}, PrimitiveKind.STRING)`,
            '',
            `    override fun serialize(encoder: Encoder, value: ${name}): Unit = encoder.encodeString(value.text)`,
            '',
            `    override fun deserialize(decoder: Decoder): ${name} = ${name}(decoder.decodeString())`,
            '}',
        ].join('\n');
    }

    /**
     * Finds a required property of the given variant that none of the other variants have.
     */
    private _findDistinguishingProperty(
        variant: string,
        variants: string[]
    ): string {
        const schema = this._objectSchema(variant);
        const others = variants
            .filter((v) => v !== variant)
            .map((v) => this._objectSchema(v));
        for (const prop of schema.required ?? []) {
            if (others.every((o) => !o.properties?.[prop])) {
                return prop;
            }
        }
        throw new Error(
            `Unable to find a property that distinguishes ${variant} from the other variants of its union (${variants.join(', ')}).`
        );
    }

    private _objectSchema(name: string): JsonSchema {
        const declaration = this._declarations.get(name);
        if (!declaration || declaration.kind !== 'object') {
            throw new Error(`${name} is not an object.`);
        }
        return declaration.schema;
    }

    private _refName(ref: string): string {
        const prefix = '#/components/schemas/';
        if (!ref.startsWith(prefix)) {
            throw new Error(`Unsupported $ref: ${ref}`);
        }
        const name = ref.slice(prefix.length);
        if (!this._schemas[name]) {
            throw new Error(`Unknown schema: ${ref}`);
        }
        return name;
    }

    private _describe(schema: JsonSchema): string | undefined {
        if (schema.description) {
            return schema.description;
        }
        if (schema.$ref) {
            return this._schemas[this._refName(schema.$ref)]?.description;
        }
        return undefined;
    }

    private _isNull(schema: JsonSchema): boolean {
        return schema.type === 'null';
    }

    private _isString(schema: JsonSchema): boolean {
        return schema.type === 'string';
    }

    private _isNumber(schema: JsonSchema): boolean {
        return schema.type === 'number' || schema.type === 'integer';
    }

    private _isNullableOrPrimitiveUnion(variants: JsonSchema[]): boolean {
        const nonNull = variants.filter((v) => !this._isNull(v));
        return (
            nonNull.length <= 1 ||
            nonNull.every((v) => this._isString(v)) ||
            nonNull.every((v) => this._isNumber(v))
        );
    }
}

function formatType(resolved: { type: string; nullable: boolean }): string {
    return resolved.nullable ? `${resolved.type}?` : resolved.type;
}

function identifier(name: string): string {
    return KOTLIN_KEYWORDS.has(name) || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)
        ? `\`${name}\``
        : name;
}

function pascalCase(name: string): string {
    return name
        .split(/[^A-Za-z0-9]+/)
        .filter((part) => part.length > 0)
        .map((part) => part[0].toUpperCase() + part.slice(1))
        .join('');
}

function renderDoc(description: string | undefined, indent: string): string {
    if (!description) {
        return '';
    }
    const lines = description
        .trim()
        .replace(/\*\//g, '*&#47;')
        .replace(/\/\*/g, '&#47;*')
        .split(/\r?\n/);
    return [
        `${indent}/**`,
        ...lines.map((line) => `${indent} *${line ? ' ' + line : ''}`),
        `${indent} */`,
    ].join('\n');
}

function stripDescriptions(schema: unknown): unknown {
    if (Array.isArray(schema)) {
        return schema.map(stripDescriptions);
    }
    if (schema && typeof schema === 'object') {
        const result: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(schema)) {
            if (key === 'description') {
                continue;
            }
            result[key] = stripDescriptions(value);
        }
        return result;
    }
    return schema;
}

/**
 * The options that are used to generate the models for the Kotlin SDK (packages/free-use-bible-api-kotlin).
 */
export const FREE_USE_BIBLE_API_KOTLIN_MODEL_OPTIONS: KotlinModelOptions = {
    packageName: 'org.helloao.freeusebibleapi',
    generatedBy: 'pnpm generate:kotlin',
    doubles: [
        'latitude',
        'longitude',
        'score',
        'ApiTranslationBookChapterAudioTimings.verses[]',
        'TranslationBookChapterAudioTimings{}[]',
    ],
    names: {
        'ApiTranslationBookChapter.chapter': 'ChapterData',
        'ApiCommentaryBookChapter.chapter': 'CommentaryChapterData',
        'ChapterFootnote.reference': 'ChapterFootnoteReference',
        'ChapterVerse.content[]': 'VerseContent',
        'ChapterHebrewSubtitle.content[]': 'HebrewSubtitleContent',
    },
    unions: {
        ApiDatasetBookChapterResult: {
            description:
                'The content of a chapter of a dataset. Entity datasets (such as "theographic") return an ApiDatasetEntityBookChapter, while all other datasets return an ApiDatasetBookChapter.',
            variants: ['ApiDatasetBookChapter', 'ApiDatasetEntityBookChapter'],
        },
    },
};

/**
 * The path (relative to the repository root) of the file that the Kotlin SDK's models are generated into.
 */
export const KOTLIN_MODELS_PATH =
    'packages/free-use-bible-api-kotlin/src/main/kotlin/org/helloao/freeusebibleapi/Models.kt';
