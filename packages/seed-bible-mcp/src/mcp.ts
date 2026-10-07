// MCP server definition shared by the Node.js and Cloudflare Workers entrypoints.
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { CfWorkerJsonSchemaValidator } from '@modelcontextprotocol/sdk/validation/cfworker';
import { z } from 'zod';
import {
    DEFAULT_BIBLE_API_BASE,
    chapterUrl,
    extractVerses,
    fetchChapterJson,
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
            const chapterJson = await fetchChapterJson(
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

    return server;
}
