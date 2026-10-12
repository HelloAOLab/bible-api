# Free Use Bible MCP Server

An [MCP](https://modelcontextprotocol.io) server that exposes the [Free Use Bible API](https://bible.helloao.org) (BSB, WEB, Hebrew WLC, SBL Greek NT) through five tools:

- `getBibleReference` — turns a reference such as `John 3:16` or `Gen 1:1-3 WEB` into a passage result id.
- `fetchChapter` — returns the passage text for a result id from `getBibleReference`.
- `fetchVerse` — returns the text of a verse or verse range within one chapter, for a reference such as `John 3:16` or `Gen 1:1-3 WEB`.
- `getSeedBibleLink` — returns a link to the chapter on [Seed Bible](https://seedbible.org) (`https://seedbible.org/{translationId}/{bookId}/{chapter}`) for a reference such as `John 3:16` or `Ps 23 WEB`.
- `listTranslations` — lists the available translations, optionally filtered by language (e.g. `spa` or `Spanish`) and by name.

`getBibleReference`, `fetchVerse`, and `getSeedBibleLink` take an optional `translation` parameter that accepts any translation id from `listTranslations` (e.g. `spa_rv1909`). Without it, the translation is picked from the reference (BSB, WEB, WLC, or SBL), defaulting to BSB.

The server speaks the Streamable HTTP transport at `/mcp` and runs statelessly, so the same code runs on Node.js and on Cloudflare Workers.

## Layout

| File             | Purpose                                                          |
| ---------------- | ---------------------------------------------------------------- |
| `src/bible.ts`   | Reference parsing and Bible API helpers (web-standard APIs only) |
| `src/mcp.ts`     | `createBibleMcpServer()` — registers the MCP tools               |
| `src/handler.ts` | `handleRequest(Request): Response` — routing, CORS, transport    |
| `src/worker.ts`  | Cloudflare Workers entrypoint                                    |
| `src/node.ts`    | Node.js entrypoint                                               |

## Running on Node.js

```bash
pnpm start        # or: pnpm dev (watch mode)
```

Listens on `PORT` (default `8000`); the MCP endpoint is `http://localhost:8000/mcp`.

## Running on Cloudflare Workers

```bash
pnpm dev:worker   # local dev with wrangler at http://localhost:8787/mcp
pnpm deploy       # deploy to your Cloudflare account
```

Configuration lives in `wrangler.jsonc`.

### Continuous deployment

`.github/workflows/deploy-bible-mcp-worker.yml` deploys the Worker whenever changes to this package are pushed to `main` (it can also be run manually from the Actions tab). Pull requests that touch the package get a type-check and a `wrangler deploy --dry-run`.

The workflow needs two repository secrets:

- `CLOUDFLARE_API_TOKEN` — an API token with the **Edit Cloudflare Workers** permission
- `CLOUDFLARE_ACCOUNT_ID` — the Cloudflare account to deploy to

## Configuration

| Variable         | Default                         | Description                   |
| ---------------- | ------------------------------- | ----------------------------- |
| `BIBLE_API_BASE` | `https://bible.helloao.org/api` | Upstream Free Use Bible API   |
| `PORT`           | `8000`                          | Node.js only — listening port |

On Workers, set `BIBLE_API_BASE` under `vars` in `wrangler.jsonc` (or with `--var` for `wrangler dev`).

`GET /` and `GET /health` return a simple status response.
