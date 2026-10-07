// MCP server definition shared by the Node.js and Cloudflare Workers entrypoints.
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { CfWorkerJsonSchemaValidator } from '@modelcontextprotocol/sdk/validation/cfworker';
import { z } from 'zod';
import {
    DEFAULT_BIBLE_API_BASE,
    chapterUrl,
    extractVerses,
    fetchSimpleChapterJson,
    filterTranslations,
    getAvailableTranslations,
    makeResultId,
    parseQueryToRef,
    parseResultId,
    passageTitle,
} from './bible.js';

export interface BibleMcpOptions {
    /** Base URL of the Free Use Bible API. Defaults to https://bible.helloao.org/api */
    apiBase?: string;
}

function json(value: unknown) {
    return {
        content: [{ type: 'text' as const, text: JSON.stringify(value) }],
    };
}

function error(message: string) {
    return {
        content: [{ type: 'text' as const, text: message }],
        isError: true,
    };
}

/**
 * Create a new MCP server instance with the Bible tools registered.
 *
 * The server holds no per-connection state, so it is safe to create one per
 * request (as the Workers entrypoint does) or share one across requests.
 */
export function createBibleMcpServer(options: BibleMcpOptions = {}): McpServer {
    const apiBase = (options.apiBase || DEFAULT_BIBLE_API_BASE).replace(
        /\/+$/,
        ''
    );

    const server = new McpServer(
        {
            name: 'Free Use Bible (BSB/WEB/WLC/SBL)',
            version: '1.0.0',
        },
        {
            instructions:
                'Use getBibleReference() to interpret a user query into a Bible passage result. ' +
                'Then use fetchChapter() to retrieve the full passage text. ' +
                'To get the text of a verse or verse range directly, use fetchVerse(). ' +
                'Use listTranslations() to find available translations by language or name. ' +
                'Supports BSB, WEB (ENGWEBP), Hebrew WLC (heb_wlc), and SBL Greek NT (grc_sbl).',
            // The default Ajv validator compiles schemas with `new Function`,
            // which Cloudflare Workers forbids. The cfworker validator is pure JS
            // and works on every runtime.
            jsonSchemaValidator: new CfWorkerJsonSchemaValidator(),
        }
    );

    server.registerTool(
        'getBibleReference',
        {
            description:
                'Interpret a natural-language query into a single Bible passage result.',
            inputSchema: {
                query: z
                    .string()
                    .describe(
                        'A passage reference, e.g. "John 3:16" or "Gen 1:1-3 WEB".'
                    ),
            },
        },
        async ({ query }) => {
            const ref = await parseQueryToRef(apiBase, query);
            if (!ref) return json({ results: [] });

            const [translation, book, chapter, verses] = ref;
            return json({
                results: [
                    {
                        id: makeResultId(translation, book, chapter, verses),
                        title: passageTitle(translation, book, chapter, verses),
                        url: chapterUrl(apiBase, translation, book, chapter),
                    },
                ],
            });
        }
    );

    server.registerTool(
        'fetchChapter',
        {
            description:
                'Retrieve the full passage text for a result id from getBibleReference().',
            inputSchema: {
                id: z
                    .string()
                    .describe('A result id returned by getBibleReference().'),
            },
        },
        async ({ id }) => {
            const [translation, book, chapter, verses] = parseResultId(id);
            const chapterJson = await fetchSimpleChapterJson(
                apiBase,
                translation,
                book,
                chapter
            );

            return json({
                id,
                title: passageTitle(translation, book, chapter, verses),
                text: extractVerses(chapterJson, verses),
                url: chapterUrl(apiBase, translation, book, chapter),
                metadata: { translation, book, chapter, verses },
            });
        }
    );

    server.registerTool(
        'fetchVerse',
        {
            description:
                'Retrieve the text of a single Bible verse or a range of verses within one chapter, from a reference such as "John 3:16" or "John 3:16-18".',
            inputSchema: {
                reference: z
                    .string()
                    .describe(
                        'A verse or verse range reference, optionally followed by a translation, e.g. "John 3:16", "Gen 1:1-3" or "Ps 23:1-6 WEB".'
                    ),
            },
        },
        async ({ reference }) => {
            const ref = await parseQueryToRef(apiBase, reference);
            if (!ref || !ref[3]) {
                return error(
                    `Could not interpret "${reference}" as a verse reference.`
                );
            }

            const [translation, book, chapter, verses] = ref;
            const title = passageTitle(translation, book, chapter, verses);
            const chapterJson = await fetchSimpleChapterJson(
                apiBase,
                translation,
                book,
                chapter
            );
            let text = extractVerses(chapterJson, verses);
            if (!text) {
                return error(`${title} was not found.`);
            }
            if (!verses.includes('-')) {
                // Drop the "N. " prefix that extractVerses() adds; it's
                // redundant for a single verse.
                text = text.replace(/^\d+\. /, '');
            }

            return json({
                id: makeResultId(translation, book, chapter, verses),
                title,
                text,
                url: chapterUrl(apiBase, translation, book, chapter),
                metadata: { translation, book, chapter, verses },
            });
        }
    );

    server.registerTool(
        'listTranslations',
        {
            description:
                'List the Bible translations available in the Free Use Bible API, optionally filtered by language and/or name.',
            inputSchema: {
                language: z
                    .string()
                    .optional()
                    .describe(
                        'Filter by language: an ISO 639-3 code (e.g. "spa") or part of the language name in English or the language itself (e.g. "Spanish", "Español").'
                    ),
                name: z
                    .string()
                    .optional()
                    .describe(
                        'Filter by part of the translation id, name, English name, or short name (e.g. "BSB", "Reina", "King James").'
                    ),
                limit: z
                    .number()
                    .int()
                    .min(1)
                    .max(500)
                    .optional()
                    .describe(
                        'The maximum number of translations to return. Defaults to 50.'
                    ),
            },
        },
        async ({ language, name, limit }) => {
            const all = await getAvailableTranslations(apiBase);
            const matches = filterTranslations(all, { language, name });
            return json({
                total: matches.length,
                translations: matches.slice(0, limit ?? 50),
            });
        }
    );

    return server;
}
