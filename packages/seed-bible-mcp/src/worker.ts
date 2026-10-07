// Cloudflare Workers entrypoint.
import { handleRequest } from './handler.js';

export interface Env {
    /** Optional override for the Free Use Bible API base URL. */
    BIBLE_API_BASE?: string;
}

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        return handleRequest(request, { apiBase: env.BIBLE_API_BASE });
    },
};
