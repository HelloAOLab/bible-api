// Web-standard (Request -> Response) MCP handler.
// Used directly by the Cloudflare Worker and adapted for Node.js in node.ts.
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { createBibleMcpServer, type BibleMcpOptions } from './mcp.js';

export interface HandlerOptions extends BibleMcpOptions {
    /** Path the MCP endpoint is served from. Defaults to /mcp */
    endpoint?: string;
}

const CORS_HEADERS: Record<string, string> = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers':
        'Content-Type, Accept, Authorization, Mcp-Session-Id, Mcp-Protocol-Version, Last-Event-ID',
    'Access-Control-Expose-Headers': 'Mcp-Session-Id, Mcp-Protocol-Version',
};

function withCors(res: Response): Response {
    const headers = new Headers(res.headers);
    for (const [k, v] of Object.entries(CORS_HEADERS)) headers.set(k, v);
    return new Response(res.body, {
        status: res.status,
        statusText: res.statusText,
        headers,
    });
}

/**
 * Handle a single HTTP request.
 *
 * The server runs in stateless mode: every request gets a fresh MCP server and
 * transport, so no state needs to survive between requests. This is what
 * allows it to run on Cloudflare Workers, where requests may land on any
 * isolate.
 */
export async function handleRequest(
    request: Request,
    options: HandlerOptions = {}
): Promise<Response> {
    const endpoint = options.endpoint ?? '/mcp';
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (url.pathname === '/' || url.pathname === '/health') {
        return withCors(Response.json({ status: 'ok', mcpEndpoint: endpoint }));
    }

    if (url.pathname !== endpoint) {
        return withCors(new Response('Not Found', { status: 404 }));
    }

    const server = createBibleMcpServer(options);
    const transport = new WebStandardStreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableJsonResponse: true,
    });

    try {
        await server.connect(transport);
        return withCors(await transport.handleRequest(request));
    } catch (err) {
        console.error('Error handling MCP request:', err);
        return withCors(
            Response.json(
                {
                    jsonrpc: '2.0',
                    error: { code: -32603, message: 'Internal server error' },
                    id: null,
                },
                { status: 500 }
            )
        );
    }
}
