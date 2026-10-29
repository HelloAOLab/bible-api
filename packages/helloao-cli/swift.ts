/**
 * Generates the Swift types and endpoint methods for the FreeUseBibleAPI Swift SDK
 * (packages/free-use-bible-api-swift) from the OpenAPI document for the API.
 *
 * The output is plain Swift with no dependencies:
 *
 * - Object schemas become `Codable` structs.
 * - String enums become "open" enums (a `RawRepresentable` struct with a static
 *   constant for each known value), so that values added to the API later don't
 *   break decoding.
 * - Unions become Swift enums with an associated value for each variant, plus an
 *   `unknown` case for variants that the SDK doesn't know about yet.
 * - Each operation becomes an `async throws` method on `FreeUseBibleAPI`.
 */

/**
 * The OpenAPI document describes every number as a "number", but almost all of them
 * are counts, indexes, and chapter/verse numbers. Those are generated as `Int`, and the
 * properties listed here are generated as `Double`.
 *
 * Keys are `<SchemaName>.<propertyName>`, or just `<SchemaName>` for a schema that is a map.
 */
const DOUBLE_PROPERTIES = new Set([
    'ScoredVerseRef.score',
    'ApiTranslationBookChapterAudioTimings.verses',
    'TranslationBookChapterAudioTimings',
    'ApiDatasetChapterPlace.latitude',
    'ApiDatasetChapterPlace.longitude',
    'ApiDatasetPlaceSummary.latitude',
    'ApiDatasetPlaceSummary.longitude',
    'DatasetPlace.latitude',
    'DatasetPlace.longitude',
]);

/**
 * The names to use for inline string enums, keyed by their sorted values.
 * Inline enums that aren't listed here are nested in the type that uses them.
 */
const ENUM_NAMES: Record<string, string> = {
    'ltr|rtl': 'TextDirection',
    'json|usfm': 'ApiFormat',
    'not-required|required': 'LicenseRequirement',
    'allowed|not-allowed': 'LicensePermission',
    'aramaic|greek|hebrew': 'OriginalLanguage',
};

/**
 * The names to use for inline unions, keyed by `<SchemaName>.<propertyName>` or by operation ID
 * for unions in responses.
 */
const UNION_NAMES: Record<string, string> = {
    'ChapterVerse.content': 'VerseContent',
    'ChapterHebrewSubtitle.content': 'HebrewSubtitleContent',
    getDatasetBookChapter: 'ApiDatasetBookChapterResponse',
};

/**
 * The case names to use for union variants, keyed by the name of the variant's schema.
 * By default, the case name is the schema name in lower camel case without the "Api" prefix.
 */
const UNION_CASE_NAMES: Record<string, string> = {
    DatasetChapterVerseReferences: 'references',
    DatasetChapterVerseWords: 'words',
    DatasetChapterVerseCategories: 'categories',
};

/**
 * Method names to use instead of the operation ID, so that the Swift SDK matches the
 * method names of the TypeScript SDK.
 */
const METHOD_NAMES: Record<string, string> = {
    getTranslationComplete: 'getCompleteTranslation',
    getSimpleTranslationComplete: 'getSimpleCompleteTranslation',
};

/**
 * Operations whose responses are too large to keep in the response cache.
 */
const UNCACHED_OPERATIONS = new Set([
    'getTranslationComplete',
    'getSimpleTranslationComplete',
]);

const SWIFT_KEYWORDS = new Set([
    'associatedtype',
    'class',
    'deinit',
    'enum',
    'extension',
    'fileprivate',
    'func',
    'import',
    'init',
    'inout',
    'internal',
    'let',
    'open',
    'operator',
    'private',
    'precedencegroup',
    'protocol',
    'public',
    'rethrows',
    'static',
    'struct',
    'subscript',
    'typealias',
    'var',
    'break',
    'case',
    'catch',
    'continue',
    'default',
    'defer',
    'do',
    'else',
    'fallthrough',
    'for',
    'guard',
    'if',
    'in',
    'repeat',
    'return',
    'throw',
    'switch',
    'where',
    'while',
    'Any',
    'as',
    'false',
    'is',
    'nil',
    'self',
    'Self',
    'super',
    'throws',
    'true',
    'try',
]);

const HEADER = `// This file was generated from the Free Use Bible API OpenAPI document.
// Do not edit it by hand. Run \`npm run generate:swift\` to regenerate it.
`;

/**
 * The generated Swift source files.
 */
export interface GeneratedSwiftFiles {
    /**
     * The source for the model types (`Types.gen.swift`).
     */
    types: string;

    /**
     * The source for the endpoint methods (`Operations.gen.swift`).
     */
    operations: string;
}

/**
 * Generates the Swift SDK source files from the given OpenAPI document.
 * @param document The OpenAPI document.
 */
export function generateSwiftClient(document: any): GeneratedSwiftFiles {
    const generator = new SwiftGenerator(document);
    return generator.generate();
}

interface ResolveContext {
    /**
     * The key used to look up configuration for the schema. `<SchemaName>.<propertyName>`.
     */
    configKey: string;

    /**
     * The name to give an inline type that needs to be declared for the schema.
     */
    nestedName: string;

    /**
     * The full Swift name of the type that nested declarations are added to.
     * Null for top-level declarations.
     */
    ownerPath: string | null;

    /**
     * The list that nested declarations are added to.
     */
    nested: string[];
}

interface ResolvedType {
    type: string;
    optional: boolean;
}

class SwiftGenerator {
    private document: any;
    private schemas: Record<string, any>;
    private declarations: string[] = [];
    private inlineObjects = new Map<string, string>();
    private inlineEnums = new Map<string, string>();
    private usedTopLevelNames = new Set<string>();

    constructor(document: any) {
        this.document = document;
        this.schemas = document.components?.schemas ?? {};
        for (const name of Object.keys(this.schemas)) {
            this.usedTopLevelNames.add(name);
        }
    }

    generate(): GeneratedSwiftFiles {
        for (const [name, schema] of Object.entries(this.schemas)) {
            this.declarations.push(this.topLevelDeclaration(name, schema));
        }
        const operations = this.operations();

        const types = [
            HEADER,
            'import Foundation',
            '',
            ...this.declarations.map((d) => d + '\n'),
        ]
            .join('\n')
            .trimEnd();

        return {
            types: types + '\n',
            operations: operations,
        };
    }

    private topLevelDeclaration(name: string, schema: any): string {
        if (schema.type === 'string' && Array.isArray(schema.enum)) {
            return this.openEnum(name, schema.enum, schema.description);
        }

        if (schema.oneOf || schema.anyOf) {
            return this.union(
                name,
                schema.oneOf ?? schema.anyOf,
                schema.discriminator,
                schema.description,
                null
            );
        }

        if (schema.type === 'object' && schema.properties) {
            return this.struct(name, schema, name, null);
        }

        const resolved = this.resolve(schema, {
            configKey: name,
            nestedName: name,
            ownerPath: null,
            nested: [],
        });
        return [
            docComment(schema.description, ''),
            `public typealias ${name} = ${resolved.type}`,
        ]
            .filter((l) => l)
            .join('\n');
    }

    private resolve(schema: any, ctx: ResolveContext): ResolvedType {
        if (!schema || typeof schema !== 'object') {
            return { type: 'JSONValue', optional: false };
        }

        if (schema.$ref) {
            return { type: refName(schema.$ref), optional: false };
        }

        const variants: any[] | undefined = schema.anyOf ?? schema.oneOf;
        if (variants) {
            const nonNull = variants.filter((v) => v.type !== 'null');
            const optional = nonNull.length !== variants.length;
            if (nonNull.length === 1) {
                const inner = this.resolve(nonNull[0], ctx);
                return {
                    type: inner.type,
                    optional: optional || inner.optional,
                };
            }
            if (
                nonNull.every(
                    (v) => v.type === 'string' && !Array.isArray(v.enum)
                )
            ) {
                return { type: 'String', optional };
            }

            const unionName = UNION_NAMES[ctx.configKey] ?? ctx.nestedName;
            const isTopLevel = !!UNION_NAMES[ctx.configKey];
            const declaration = this.union(
                unionName,
                nonNull,
                schema.discriminator,
                undefined,
                isTopLevel ? null : ctx.ownerPath
            );
            if (isTopLevel) {
                this.declarations.push(declaration);
            } else {
                ctx.nested.push(declaration);
            }
            return { type: unionName, optional };
        }

        if (schema.type === 'array') {
            const item = this.resolve(schema.items, {
                ...ctx,
                nestedName: singular(ctx.nestedName),
            });
            return {
                type: `[${item.type}${item.optional ? '?' : ''}]`,
                optional: false,
            };
        }

        if (schema.type === 'object') {
            if (schema.properties) {
                return {
                    type: this.inlineStruct(schema, ctx),
                    optional: false,
                };
            }

            if (
                schema.additionalProperties &&
                typeof schema.additionalProperties === 'object'
            ) {
                const value = this.resolve(schema.additionalProperties, ctx);
                return {
                    type: `[String: ${value.type}${value.optional ? '?' : ''}]`,
                    optional: false,
                };
            }

            return { type: '[String: JSONValue]', optional: false };
        }

        if (schema.type === 'string') {
            if (Array.isArray(schema.enum)) {
                return { type: this.inlineEnum(schema, ctx), optional: false };
            }
            return { type: 'String', optional: false };
        }

        if (schema.type === 'integer') {
            return { type: 'Int', optional: false };
        }

        if (schema.type === 'number') {
            return {
                type: DOUBLE_PROPERTIES.has(ctx.configKey) ? 'Double' : 'Int',
                optional: false,
            };
        }

        if (schema.type === 'boolean') {
            return { type: 'Bool', optional: false };
        }

        return { type: 'JSONValue', optional: false };
    }

    private inlineStruct(schema: any, ctx: ResolveContext): string {
        const key = JSON.stringify(schema);
        const existing = this.inlineObjects.get(key);
        if (existing) {
            ctx.nested.push(`public typealias ${ctx.nestedName} = ${existing}`);
            return ctx.nestedName;
        }

        const path = ctx.ownerPath
            ? `${ctx.ownerPath}.${ctx.nestedName}`
            : ctx.nestedName;
        this.inlineObjects.set(key, path);
        ctx.nested.push(
            this.struct(ctx.nestedName, schema, ctx.configKey, ctx.ownerPath)
        );
        return ctx.nestedName;
    }

    private inlineEnum(schema: any, ctx: ResolveContext): string {
        const values: string[] = schema.enum;
        const key = [...values].sort().join('|');
        const configuredName = ENUM_NAMES[key];

        if (configuredName) {
            if (!this.inlineEnums.has(key)) {
                this.inlineEnums.set(key, configuredName);
                this.usedTopLevelNames.add(configuredName);
                this.declarations.push(
                    this.openEnum(configuredName, values, undefined)
                );
            }
            return configuredName;
        }

        ctx.nested.push(
            this.openEnum(ctx.nestedName, values, schema.description)
        );
        return ctx.nestedName;
    }

    private struct(
        name: string,
        schema: any,
        configKey: string,
        ownerPath: string | null
    ): string {
        const path = ownerPath ? `${ownerPath}.${name}` : name;
        const required = new Set<string>(schema.required ?? []);
        const nested: string[] = [];

        interface Property {
            jsonName: string;
            swiftName: string;
            type: string;
            optional: boolean;
            description?: string;
            defaultValue?: string;
        }

        const properties: Property[] = [];
        for (const [jsonName, propSchema] of Object.entries<any>(
            schema.properties
        )) {
            const resolved = this.resolve(propSchema, {
                configKey: `${configKey}.${jsonName}`,
                nestedName: upperFirst(camelCase(jsonName)),
                ownerPath: path,
                nested,
            });
            const optional = resolved.optional || !required.has(jsonName);
            let defaultValue: string | undefined;
            if ('const' in propSchema && !optional) {
                defaultValue = JSON.stringify(propSchema.const);
            }
            properties.push({
                jsonName,
                swiftName: camelCase(jsonName),
                type: resolved.type,
                optional,
                description: propSchema.description,
                defaultValue,
            });
        }

        const lines: string[] = [];
        const doc = docComment(schema.description, '');
        if (doc) {
            lines.push(doc);
        }
        lines.push(`public struct ${name}: Codable, Hashable, Sendable {`);

        for (const prop of properties) {
            const propDoc = docComment(prop.description, '    ');
            if (propDoc) {
                lines.push(propDoc);
            }
            lines.push(
                `    public var ${escapeIdentifier(prop.swiftName)}: ${prop.type}${prop.optional ? '?' : ''}`
            );
            lines.push('');
        }

        // Memberwise initializer, since the synthesized one isn't public.
        if (properties.length > 0) {
            lines.push('    public init(');
            properties.forEach((prop, index) => {
                let param = `        ${escapeIdentifier(prop.swiftName)}: ${prop.type}${prop.optional ? '?' : ''}`;
                if (prop.optional) {
                    param += ' = nil';
                } else if (prop.defaultValue !== undefined) {
                    param += ` = ${prop.defaultValue}`;
                }
                lines.push(param + (index < properties.length - 1 ? ',' : ''));
            });
            lines.push('    ) {');
            for (const prop of properties) {
                const ident = escapeIdentifier(prop.swiftName);
                lines.push(`        self.${ident} = ${ident}`);
            }
            lines.push('    }');
        } else {
            lines.push('    public init() {}');
        }

        if (properties.some((p) => p.swiftName !== p.jsonName)) {
            lines.push('');
            lines.push('    private enum CodingKeys: String, CodingKey {');
            for (const prop of properties) {
                const ident = escapeIdentifier(prop.swiftName);
                if (prop.swiftName === prop.jsonName) {
                    lines.push(`        case ${ident}`);
                } else {
                    lines.push(
                        `        case ${ident} = ${JSON.stringify(prop.jsonName)}`
                    );
                }
            }
            lines.push('    }');
        }

        for (const declaration of nested) {
            lines.push('');
            lines.push(indent(declaration, '    '));
        }

        lines.push('}');
        return lines.join('\n');
    }

    private openEnum(
        name: string,
        values: string[],
        description: string | undefined
    ): string {
        const lines: string[] = [];
        const doc = docComment(description, '');
        if (doc) {
            lines.push(doc);
            lines.push('///');
        }
        lines.push(
            "/// Values that this version of the SDK doesn't know about are preserved in `rawValue`."
        );
        lines.push(
            `public struct ${name}: RawRepresentable, Codable, Hashable, Sendable, ExpressibleByStringLiteral, CustomStringConvertible {`
        );
        lines.push('    public var rawValue: String');
        lines.push('');
        lines.push('    public init(rawValue: String) {');
        lines.push('        self.rawValue = rawValue');
        lines.push('    }');
        lines.push('');
        lines.push('    public init(stringLiteral value: String) {');
        lines.push('        self.rawValue = value');
        lines.push('    }');
        lines.push('');
        lines.push('    public init(from decoder: Decoder) throws {');
        lines.push(
            '        self.rawValue = try decoder.singleValueContainer().decode(String.self)'
        );
        lines.push('    }');
        lines.push('');
        lines.push('    public func encode(to encoder: Encoder) throws {');
        lines.push('        var container = encoder.singleValueContainer()');
        lines.push('        try container.encode(rawValue)');
        lines.push('    }');
        lines.push('');
        lines.push('    public var description: String {');
        lines.push('        rawValue');
        lines.push('    }');
        lines.push('');

        const caseNames = values.map(enumCaseName);
        values.forEach((value, index) => {
            lines.push(
                `    public static let ${escapeIdentifier(caseNames[index])} = ${name}(rawValue: ${JSON.stringify(value)})`
            );
        });
        lines.push('');
        lines.push(
            '    /// All of the values that this version of the SDK knows about.'
        );
        lines.push(`    public static let allKnownValues: [${name}] = [`);
        caseNames.forEach((caseName) => {
            lines.push(`        .${escapeIdentifier(caseName)},`);
        });
        lines.push('    ]');
        lines.push('}');
        return lines.join('\n');
    }

    private union(
        name: string,
        variants: any[],
        discriminator: any,
        description: string | undefined,
        ownerPath: string | null
    ): string {
        if (discriminator?.propertyName && discriminator.mapping) {
            return this.discriminatedUnion(name, discriminator, description);
        }
        return this.untaggedUnion(name, variants, description, ownerPath);
    }

    private discriminatedUnion(
        name: string,
        discriminator: any,
        description: string | undefined
    ): string {
        const propertyName: string = discriminator.propertyName;
        const cases = Object.entries<string>(discriminator.mapping).map(
            ([value, ref]) => ({
                value,
                caseName: camelCase(value),
                type: refName(ref),
            })
        );

        const lines: string[] = [];
        const doc = docComment(description, '');
        if (doc) {
            lines.push(doc);
        }
        lines.push(`public enum ${name}: Codable, Hashable, Sendable {`);
        for (const c of cases) {
            lines.push(`    case ${escapeIdentifier(c.caseName)}(${c.type})`);
        }
        lines.push(
            "    /// A value that this version of the SDK doesn't know about."
        );
        lines.push('    case unknown(JSONValue)');
        lines.push('');
        lines.push('    public init(from decoder: Decoder) throws {');
        lines.push(
            '        let container = try decoder.container(keyedBy: AnyCodingKey.self)'
        );
        lines.push(
            `        let discriminator = try container.decodeIfPresent(String.self, forKey: AnyCodingKey(${JSON.stringify(propertyName)}))`
        );
        lines.push('        switch discriminator ?? "" {');
        for (const c of cases) {
            lines.push(`        case ${JSON.stringify(c.value)}:`);
            lines.push(
                `            self = .${escapeIdentifier(c.caseName)}(try ${c.type}(from: decoder))`
            );
        }
        lines.push('        default:');
        lines.push('            self = .unknown(try JSONValue(from: decoder))');
        lines.push('        }');
        lines.push('    }');
        lines.push('');
        lines.push(...this.unionEncode(cases.map((c) => c.caseName)));
        lines.push('}');
        return lines.join('\n');
    }

    private untaggedUnion(
        name: string,
        variants: any[],
        description: string | undefined,
        ownerPath: string | null
    ): string {
        interface Variant {
            caseName: string;
            type: string;
            primitive: boolean;
            uniqueKey?: string;
        }

        const nested: string[] = [];
        const path = ownerPath ? `${ownerPath}.${name}` : name;
        const usedNames = new Set<string>();
        const resolvedVariants: Variant[] = variants.map((variant, index) => {
            const resolved = this.resolve(variant, {
                configKey: `${name}.${index}`,
                nestedName: `Variant${index}`,
                ownerPath: path,
                nested,
            });
            let caseName = variant.$ref
                ? (UNION_CASE_NAMES[refName(variant.$ref)] ??
                  lowerFirst(refName(variant.$ref).replace(/^Api/, '')))
                : primitiveCaseName(resolved.type);
            if (usedNames.has(caseName)) {
                caseName = `${caseName}${index}`;
            }
            usedNames.add(caseName);
            return {
                caseName,
                type: resolved.type,
                primitive: !variant.$ref,
            };
        });

        // Distinguish the object variants by a required property that none of the other variants have.
        const objectSchemas = variants.map((v) =>
            v.$ref ? this.schemas[refName(v.$ref)] : null
        );
        objectSchemas.forEach((schema, index) => {
            if (!schema?.properties) {
                return;
            }
            const others = objectSchemas.filter(
                (other, otherIndex) => otherIndex !== index && other
            );
            const uniqueKey = (schema.required ?? []).find((key: string) =>
                others.every((other) => !(key in (other.properties ?? {})))
            );
            resolvedVariants[index].uniqueKey = uniqueKey;
        });

        const lines: string[] = [];
        const doc = docComment(description, '');
        if (doc) {
            lines.push(doc);
        }
        lines.push(`public enum ${name}: Codable, Hashable, Sendable {`);
        for (const v of resolvedVariants) {
            lines.push(`    case ${escapeIdentifier(v.caseName)}(${v.type})`);
        }
        lines.push(
            "    /// A value that this version of the SDK doesn't know about."
        );
        lines.push('    case unknown(JSONValue)');
        lines.push('');
        lines.push('    public init(from decoder: Decoder) throws {');
        for (const v of resolvedVariants.filter((v) => v.primitive)) {
            lines.push(
                `        if let value = try? decoder.singleValueContainer().decode(${v.type}.self) {`
            );
            lines.push(
                `            self = .${escapeIdentifier(v.caseName)}(value)`
            );
            lines.push('            return');
            lines.push('        }');
        }

        const keyed = resolvedVariants.filter(
            (v) => !v.primitive && v.uniqueKey
        );
        const unkeyed = resolvedVariants.filter(
            (v) => !v.primitive && !v.uniqueKey
        );
        if (keyed.length > 0) {
            lines.push(
                '        if let container = try? decoder.container(keyedBy: AnyCodingKey.self) {'
            );
            for (const v of keyed) {
                lines.push(
                    `            if container.contains(AnyCodingKey(${JSON.stringify(v.uniqueKey)})) {`
                );
                lines.push(
                    `                self = .${escapeIdentifier(v.caseName)}(try ${v.type}(from: decoder))`
                );
                lines.push('                return');
                lines.push('            }');
            }
            lines.push('        }');
        }
        for (const v of unkeyed) {
            lines.push(
                `        if let value = try? ${v.type}(from: decoder) {`
            );
            lines.push(
                `            self = .${escapeIdentifier(v.caseName)}(value)`
            );
            lines.push('            return');
            lines.push('        }');
        }
        lines.push('        self = .unknown(try JSONValue(from: decoder))');
        lines.push('    }');
        lines.push('');
        lines.push(
            ...this.unionEncode(
                resolvedVariants.map((v) => v.caseName),
                new Set(
                    resolvedVariants
                        .filter((v) => v.primitive)
                        .map((v) => v.caseName)
                )
            )
        );

        for (const declaration of nested) {
            lines.push('');
            lines.push(indent(declaration, '    '));
        }

        lines.push('}');
        return lines.join('\n');
    }

    private unionEncode(
        caseNames: string[],
        primitiveCases: Set<string> = new Set()
    ): string[] {
        const lines: string[] = [];
        lines.push('    public func encode(to encoder: Encoder) throws {');
        lines.push('        switch self {');
        for (const caseName of caseNames) {
            lines.push(
                `        case .${escapeIdentifier(caseName)}(let value):`
            );
            if (primitiveCases.has(caseName)) {
                lines.push(
                    '            var container = encoder.singleValueContainer()'
                );
                lines.push('            try container.encode(value)');
            } else {
                lines.push('            try value.encode(to: encoder)');
            }
        }
        lines.push('        case .unknown(let value):');
        lines.push('            try value.encode(to: encoder)');
        lines.push('        }');
        lines.push('    }');
        return lines;
    }

    private operations(): string {
        const lines: string[] = [HEADER, 'import Foundation', ''];
        lines.push('extension FreeUseBibleAPI {');

        const methods: string[] = [];
        for (const [path, pathItem] of Object.entries<any>(
            this.document.paths ?? {}
        )) {
            const operation = pathItem.get;
            if (!operation) {
                continue;
            }
            methods.push(this.operation(path, operation));
        }

        lines.push(methods.join('\n\n'));
        lines.push('}');
        return lines.join('\n') + '\n';
    }

    private operation(path: string, operation: any): string {
        const operationId: string = operation.operationId;
        const methodName = METHOD_NAMES[operationId] ?? operationId;
        const parameters: any[] = (operation.parameters ?? []).filter(
            (p: any) => p.in === 'path'
        );

        const responseSchema =
            operation.responses?.['200']?.content?.['application/json']?.schema;
        const response = this.resolve(responseSchema, {
            configKey: operationId,
            nestedName: upperFirst(operationId) + 'Response',
            ownerPath: null,
            nested: this.declarations,
        });

        const params = parameters.map((p) => {
            const resolved = this.resolve(p.schema, {
                configKey: `${operationId}.${p.name}`,
                nestedName: upperFirst(camelCase(p.name)),
                ownerPath: null,
                nested: this.declarations,
            });
            return {
                name: p.name as string,
                swiftName: camelCase(p.name),
                type: resolved.type,
                description: (p.description ?? p.schema?.description) as
                    | string
                    | undefined,
            };
        });

        let urlPath = path.replace(/^\//, '');
        for (const p of params) {
            const ident = escapeIdentifier(p.swiftName);
            let value: string;
            if (p.type === 'String') {
                value = ident;
            } else if (p.type === 'Int' || p.type === 'Double') {
                value = `String(${ident})`;
            } else {
                value = `${ident}.rawValue`;
            }
            urlPath = urlPath.replace(
                `{${p.name}}`,
                `\\(encodePathComponent(${value}))`
            );
        }

        const lines: string[] = [];
        const docLines: string[] = [];
        if (operation.description) {
            docLines.push(operation.description);
        }
        if (UNCACHED_OPERATIONS.has(operationId)) {
            docLines.push('');
            docLines.push(
                'The results of this endpoint are very large, so the response is not cached.'
            );
        }
        docLines.push('');
        docLines.push(`\`GET ${path}\``);
        docLines.push('');
        docLines.push('- Parameters:');
        for (const p of params) {
            docLines.push(
                `  - ${p.swiftName}: ${oneLine(p.description ?? '')}`.trimEnd()
            );
        }
        docLines.push(
            '  - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.'
        );
        lines.push(docComment(docLines.join('\n'), '    '));

        const signatureParams = [
            ...params.map((p) => `${escapeIdentifier(p.swiftName)}: ${p.type}`),
            'endpoint: URL? = nil',
        ];
        lines.push(
            `    public func ${methodName}(${signatureParams.join(', ')}) async throws -> ${response.type} {`
        );
        const cacheArg = UNCACHED_OPERATIONS.has(operationId)
            ? ', useCache: false'
            : '';
        lines.push(
            `        try await getJSON("${urlPath}", endpoint: endpoint${cacheArg})`
        );
        lines.push('    }');
        return lines.join('\n');
    }
}

function refName(ref: string): string {
    return ref.split('/').pop()!;
}

function camelCase(value: string): string {
    const parts = value.split(/[^A-Za-z0-9]+/).filter((p) => p);
    if (parts.length === 0) {
        return '_';
    }
    const result = parts
        .map((part, index) =>
            index === 0 ? lowerFirst(part) : upperFirst(part)
        )
        .join('');
    return /^[0-9]/.test(result) ? `_${result}` : result;
}

function enumCaseName(value: string): string {
    // Codes like book IDs ("GEN", "1SA") are kept as they are.
    if (/^[A-Z0-9]+$/.test(value)) {
        return /^[0-9]/.test(value) ? `_${value}` : value;
    }
    return camelCase(value);
}

function primitiveCaseName(type: string): string {
    switch (type) {
        case 'String':
            return 'text';
        case 'Int':
        case 'Double':
            return 'number';
        case 'Bool':
            return 'bool';
        default:
            return lowerFirst(type.replace(/[^A-Za-z0-9]/g, ''));
    }
}

function lowerFirst(value: string): string {
    return value.charAt(0).toLowerCase() + value.slice(1);
}

function upperFirst(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

function singular(value: string): string {
    if (value.endsWith('ies')) {
        return value.slice(0, -3) + 'y';
    }
    if (value.endsWith('s') && !value.endsWith('ss')) {
        return value.slice(0, -1);
    }
    return value;
}

function escapeIdentifier(value: string): string {
    return SWIFT_KEYWORDS.has(value) ? `\`${value}\`` : value;
}

function oneLine(value: string): string {
    return value.replace(/\s*\n\s*/g, ' ').trim();
}

function docComment(text: string | undefined, prefix: string): string {
    if (!text) {
        return '';
    }
    return text
        .trim()
        .split('\n')
        .map((line) => `${prefix}///${line.trim() ? ' ' + line.trimEnd() : ''}`)
        .join('\n');
}

function indent(text: string, prefix: string): string {
    return text
        .split('\n')
        .map((line) => (line ? prefix + line : line))
        .join('\n');
}
