import { renderWebsite } from './website';

describe('renderWebsite()', () => {
    it('puts the endpoint URL into every setup guide', () => {
        const html = renderWebsite({
            endpointUrl: 'https://bible-mcp.example/mcp',
        });

        expect(html).toContain(
            'claude mcp add --transport http seed-bible https://bible-mcp.example/mcp'
        );
        expect(html).toContain(
            '&quot;url&quot;: &quot;https://bible-mcp.example/mcp&quot;'
        );
        expect(html).toContain('&quot;mcp-remote&quot;');
    });

    it('gives a no-code settings route for apps that have one', () => {
        const html = renderWebsite({ endpointUrl: 'https://x.example/mcp' });
        const panel = (id: string) =>
            html.slice(
                html.indexOf(`id="panel-${id}"`),
                html.indexOf('</section>', html.indexOf(`id="panel-${id}"`))
            );

        for (const id of ['claude', 'chatgpt', 'vscode', 'other']) {
            expect(panel(id)).toContain('<span class="pill">No code</span>');
            expect(panel(id)).toContain('<code>https://x.example/mcp</code>');
        }
        for (const id of ['cursor', 'claude-code']) {
            expect(panel(id)).not.toContain('No code');
        }
    });

    it('lists every tool the server registers', () => {
        const html = renderWebsite({ endpointUrl: 'https://x.example/mcp' });

        for (const tool of [
            'getBibleReference',
            'fetchChapter',
            'fetchVerse',
            'getSeedBibleLink',
            'getVerseOfTheDay',
            'listTranslations',
        ]) {
            expect(html).toContain(`<code>${tool}</code>`);
        }
    });

    it('escapes an endpoint URL taken from a hostile Host header', () => {
        const html = renderWebsite({
            endpointUrl: 'https://"><script>alert(1)</script>/mcp',
        });

        expect(html).not.toContain('<script>alert(1)</script>');
        expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    });
});
