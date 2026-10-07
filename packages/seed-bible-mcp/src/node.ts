// Node.js entrypoint. Serves the same web-standard handler as the Worker.
import { serve } from '@hono/node-server';
import { handleRequest } from './handler.js';

const port = parseInt(process.env.PORT ?? '8000', 10);
const apiBase = process.env.BIBLE_API_BASE;

serve({ fetch: (req) => handleRequest(req, { apiBase }), port }, (info) => {
    console.log(
        `Bible MCP server listening on http://localhost:${info.port}/mcp`
    );
});
