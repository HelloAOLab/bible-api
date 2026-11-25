// The page served at GET / to browsers: what the server is and how to connect to it.

export interface WebsiteOptions {
    /** Full URL of the MCP endpoint, e.g. https://example.com/mcp */
    endpointUrl: string;
}

const SERVER_KEY = 'seed-bible';

const TOOLS: { name: string; description: string }[] = [
    {
        name: 'getBibleReference',
        description:
            'Understands a reference like “John 3:16” or “Gen 1:1-3 WEB” and finds the passage.',
    },
    {
        name: 'fetchChapter',
        description: 'Returns the full text of a chapter.',
    },
    {
        name: 'fetchVerse',
        description: 'Returns the text of a verse or a range of verses.',
    },
    {
        name: 'getSeedBibleLink',
        description:
            'Gives a link that opens the chapter in the Seed Bible reader.',
    },
    {
        name: 'getVerseOfTheDay',
        description:
            'Picks the verse of the day for any date, with holiday verses on Christmas, Resurrection Sunday, and more.',
    },
    {
        name: 'listTranslations',
        description:
            'Searches the 1,000+ available translations by language or name.',
    },
];

const EXAMPLE_PROMPTS = [
    'What does Psalm 23 say in the World English Bible?',
    'Show me John 1:1 in the original Greek.',
    'What’s the verse of the day for Christmas?',
    'Which Spanish Bibles can you read from?',
    'Give me a link to read Romans 8 on Seed Bible.',
];

export function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function codeBlock(code: string): string {
    return `<div class="code"><pre><code>${escapeHtml(
        code
    )}</code></pre><button type="button" class="copy" data-copy="${escapeHtml(
        code
    )}">Copy</button></div>`;
}

interface SetupGuide {
    id: string;
    label: string;
    /** Steps that use only the app's own settings screens, no typing of code. */
    gui?: string;
    /** Steps that use a terminal command or a config file. */
    config?: string;
}

function setupGuides(endpointUrl: string): SetupGuide[] {
    const url = `<code>${escapeHtml(endpointUrl)}</code>`;
    const vscodeJson = JSON.stringify(
        { servers: { [SERVER_KEY]: { type: 'http', url: endpointUrl } } },
        null,
        2
    );
    const cursorJson = JSON.stringify(
        { mcpServers: { [SERVER_KEY]: { url: endpointUrl } } },
        null,
        2
    );
    return [
        {
            id: 'claude',
            label: 'Claude',
            gui: `
<p>Add it once on claude.ai or in the Claude desktop app, and it's available everywhere you use Claude, including the mobile apps.</p>
<ol>
  <li>Go to <strong>Customize → Connectors</strong> (or open <a href="https://claude.ai/customize/connectors">claude.ai/customize/connectors</a>).</li>
  <li>Click <strong>+ Add</strong>, then <strong>Add custom connector</strong>.</li>
  <li>Name it <strong>Seed Bible</strong>, paste this URL: ${url}, and click <strong>Continue</strong>.</li>
  <li>Under <strong>Authentication</strong>, choose <strong>No sign in</strong>. Leave <strong>Request headers</strong> empty.</li>
  <li>Click <strong>Add</strong>.</li>
  <li>In a chat, click <strong>+</strong> at the lower left, open <strong>Connectors</strong>, and turn on Seed Bible.</li>
</ol>
<p class="note">Free plans can add one custom connector. On Team and Enterprise plans, an owner adds it first under <strong>Organization settings → Connectors</strong>; members then click <strong>Connect</strong> next to it in <strong>Customize → Connectors</strong>.</p>`,
        },
        {
            id: 'chatgpt',
            label: 'ChatGPT',
            gui: `
<ol>
  <li>Open <strong>Settings → Apps &amp; Connectors → Advanced settings</strong> and turn on <strong>Developer mode</strong>.</li>
  <li>Back in <strong>Apps &amp; Connectors</strong>, click <strong>Create</strong>.</li>
  <li>Name it <strong>Seed Bible</strong> and paste this URL as the <strong>MCP Server URL</strong>: ${url}</li>
  <li>Set <strong>Authentication</strong> to <strong>No authentication</strong>, confirm that you trust the app, and click <strong>Create</strong>.</li>
  <li>In a chat, click <strong>+</strong>, open <strong>Developer mode</strong>, and pick Seed Bible.</li>
</ol>
<p class="note">ChatGPT renames these menus often. If the steps don't match, search ChatGPT's help pages for “developer mode”.</p>`,
        },
        {
            id: 'vscode',
            label: 'VS Code',
            gui: `
<ol>
  <li>Open the Command Palette (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>, or <kbd>⌘</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> on a Mac).</li>
  <li>Run <strong>MCP: Add Server…</strong> and choose <strong>HTTP</strong>.</li>
  <li>Paste this URL: ${url}</li>
  <li>Name it <strong>seed-bible</strong>, then choose <strong>Global</strong> (every project) or <strong>Workspace</strong> (this project only).</li>
  <li>Open Copilot Chat, switch to <strong>Agent</strong> mode, and ask about a passage.</li>
</ol>`,
            config: `
<p>Add this to <code>.vscode/mcp.json</code> in your project:</p>
${codeBlock(vscodeJson)}`,
        },
        {
            id: 'cursor',
            label: 'Cursor',
            config: `
<ol>
  <li>Open <strong>Cursor Settings → Tools &amp; MCP</strong> and click <strong>New MCP Server</strong>. Cursor opens its <code>mcp.json</code> file (<code>~/.cursor/mcp.json</code>, used in every project).</li>
  <li>Paste this in and save:</li>
</ol>
${codeBlock(cursorJson)}
<p>Back in <strong>Tools &amp; MCP</strong>, Seed Bible should appear with a green dot. To use it in one project only, put the same file at <code>.cursor/mcp.json</code> in that project instead.</p>`,
        },
        {
            id: 'claude-code',
            label: 'Claude Code',
            config: `
<p>Run this in your terminal:</p>
${codeBlock(`claude mcp add --transport http ${SERVER_KEY} ${endpointUrl}`)}
<p>Add <code>--scope user</code> to use it in every project, not just the current one. Run <code>/mcp</code> inside Claude Code to check that it's connected.</p>`,
        },
        {
            id: 'codex',
            label: 'Codex',
            config: `
<p>Run this in your terminal:</p>
${codeBlock(`codex mcp add ${SERVER_KEY} --url ${endpointUrl}`)}
<p>Run <code>/mcp</code> inside Codex to check that it's connected. The Codex IDE extension reads the same settings, so this also sets it up there.</p>
<h4 class="method">Or with a config file</h4>
<p>Add this to <code>~/.codex/config.toml</code>:</p>
${codeBlock(`[mcp_servers.${SERVER_KEY}]\nurl = "${endpointUrl}"`)}`,
        },
        {
            id: 'other',
            label: 'Other apps',
            gui: `
<p>Most apps that support remote MCP servers have a settings screen to add one, often under a name like <strong>Connectors</strong>, <strong>Integrations</strong>, <strong>Tools</strong>, or <strong>MCP servers</strong>. Give it these details:</p>
<dl class="facts">
  <dt>Name</dt><dd>Seed Bible</dd>
  <dt>URL</dt><dd>${url}</dd>
  <dt>Type</dt><dd>Remote / HTTP (Streamable HTTP)</dd>
  <dt>Authentication</dt><dd>None</dd>
</dl>`,
            config: `
<p>If an app only supports local (stdio) servers in a config file, bridge to it with <a href="https://www.npmjs.com/package/mcp-remote">mcp-remote</a>:</p>
${codeBlock(
    JSON.stringify(
        {
            mcpServers: {
                [SERVER_KEY]: {
                    command: 'npx',
                    args: ['-y', 'mcp-remote', endpointUrl],
                },
            },
        },
        null,
        2
    )
)}`,
        },
    ];
}

function guideBody(guide: SetupGuide): string {
    if (!guide.gui) return guide.config ?? '';
    const gui = `<h4 class="method"><span class="pill">No code</span> In ${escapeHtml(
        guide.id === 'other' ? "the app's" : `${guide.label}'s`
    )} settings</h4>${guide.gui}`;
    if (!guide.config) return gui;
    return `${gui}<h4 class="method">Or with a config file</h4>${guide.config}`;
}

export function renderWebsite({ endpointUrl }: WebsiteOptions): string {
    const guides = setupGuides(endpointUrl);
    const tabs = guides
        .map(
            (g, i) =>
                `<button type="button" role="tab" id="tab-${g.id}" aria-controls="panel-${g.id}" aria-selected="${
                    i === 0
                }"${i === 0 ? '' : ' tabindex="-1"'}>${escapeHtml(g.label)}${
                    g.gui ? '<span class="pill">No code</span>' : ''
                }</button>`
        )
        .join('');
    const panels = guides
        .map(
            (g) =>
                `<section role="tabpanel" id="panel-${g.id}" aria-labelledby="tab-${g.id}"><h3 class="panel-title">${escapeHtml(
                    g.label
                )}</h3>${guideBody(g)}</section>`
        )
        .join('');
    const tools = TOOLS.map(
        (t) =>
            `<li><code>${t.name}</code><span>${escapeHtml(
                t.description
            )}</span></li>`
    ).join('');
    const prompts = EXAMPLE_PROMPTS.map(
        (p) => `<li>${escapeHtml(p)}</li>`
    ).join('');

    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Seed Bible MCP</title>
<meta name="description" content="Connect Claude, ChatGPT, and other AI assistants to the Bible. Free, with no sign-in or API key.">
<style>
:root {
  --bg: #fdfaf6;
  --surface: #ffffff;
  --text: #1f1a17;
  --muted: #6b625c;
  --border: #e8e0d8;
  --accent: #c8602f;
  --accent-soft: #fbeee6;
  --code-bg: #f6f1ec;
  color-scheme: light;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #171412;
    --surface: #211d1a;
    --text: #f2ece6;
    --muted: #a89e96;
    --border: #3a332e;
    --accent: #f0905f;
    --accent-soft: #3a2619;
    --code-bg: #2a2521;
    color-scheme: dark;
  }
}
* { box-sizing: border-box; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font: 16px/1.6 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
main { max-width: 760px; margin: 0 auto; padding: 48px 16px 64px; }
h1 { font-size: 2.4rem; line-height: 1.15; margin: 0 0 12px; letter-spacing: -0.02em; }
h2 { font-size: 1.4rem; margin: 48px 0 12px; }
p { margin: 0 0 12px; }
a { color: var(--accent); }
code { font: 0.9em/1.5 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; background: var(--code-bg); padding: 1px 5px; border-radius: 4px; overflow-wrap: anywhere; }
.eyebrow { color: var(--accent); font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.8rem; margin-bottom: 8px; }
.lead { font-size: 1.15rem; color: var(--muted); }
.endpoint { margin: 24px 0 8px; display: flex; gap: 8px; align-items: stretch; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 8px 8px 8px 14px; }
.endpoint code { flex: 1; background: none; padding: 0; align-self: center; font-size: 0.95rem; }
.badges { display: flex; flex-wrap: wrap; gap: 8px; padding: 0; margin: 16px 0 0; list-style: none; }
.badges li { background: var(--accent-soft); color: var(--text); border-radius: 999px; padding: 2px 12px; font-size: 0.9rem; }
button { font: inherit; cursor: pointer; }
.copy, .endpoint button { border: 1px solid var(--border); background: var(--surface); color: var(--text); border-radius: 6px; padding: 4px 12px; font-size: 0.85rem; }
.copy:hover, .endpoint button:hover { border-color: var(--accent); }
.tools { list-style: none; padding: 0; margin: 0; display: grid; gap: 8px; }
.tools li { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 12px 14px; display: grid; gap: 2px; }
.tools code { background: none; padding: 0; font-weight: 600; color: var(--accent); }
.tools span { color: var(--muted); }
.prompts { padding-left: 20px; }
.prompts li { margin-bottom: 4px; }
.prompts li::marker { content: "“ "; color: var(--accent); }
[role="tablist"] { display: flex; flex-wrap: wrap; gap: 4px; border-bottom: 1px solid var(--border); margin-top: 16px; }
[role="tab"] { border: none; background: none; color: var(--muted); padding: 8px 12px; border-bottom: 2px solid transparent; margin-bottom: -1px; }
[role="tab"][aria-selected="true"] { color: var(--accent); border-bottom-color: var(--accent); font-weight: 600; }
[role="tabpanel"] { background: var(--surface); border: 1px solid var(--border); border-top: none; border-radius: 0 0 10px 10px; padding: 20px; }
.js [role="tabpanel"][hidden] { display: none; }
.js .panel-title { display: none; }
.panel-title { margin: 0 0 8px; font-size: 1.1rem; }
html:not(.js) [role="tablist"] { display: none; }
html:not(.js) [role="tabpanel"] { border-top: 1px solid var(--border); border-radius: 10px; margin-bottom: 12px; }
ol { padding-left: 22px; }
ol li { margin-bottom: 6px; }
.pill { display: inline-block; background: var(--accent-soft); color: var(--accent); border-radius: 999px; padding: 0 8px; font-size: 0.72rem; font-weight: 600; line-height: 1.6; vertical-align: 0.1em; white-space: nowrap; }
[role="tab"] .pill { margin-left: 6px; }
.method { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 1rem; margin: 0 0 8px; }
.method:not(:first-child) { margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border); }
.js .panel-title + .method { margin-top: 0; padding-top: 0; border-top: none; }
kbd { font: 0.85em ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; border: 1px solid var(--border); border-bottom-width: 2px; border-radius: 4px; padding: 0 4px; background: var(--surface); }
.note { color: var(--muted); font-size: 0.9rem; }
.code { position: relative; margin: 8px 0 12px; }
.code pre { margin: 0; background: var(--code-bg); border-radius: 8px; padding: 14px 16px; padding-right: 72px; overflow-x: auto; }
.code pre code { background: none; padding: 0; overflow-wrap: normal; }
.code .copy { position: absolute; top: 8px; right: 8px; }
.facts { display: grid; grid-template-columns: max-content 1fr; gap: 4px 16px; margin: 8px 0 16px; }
.facts dt { font-weight: 600; }
.facts dd { margin: 0; }
footer { margin-top: 56px; padding-top: 20px; border-top: 1px solid var(--border); color: var(--muted); font-size: 0.9rem; }
@media (max-width: 520px) {
  h1 { font-size: 1.9rem; }
  .endpoint { flex-direction: column; padding: 12px; }
}
</style>
</head>
<body>
<script>document.documentElement.classList.add('js');</script>
<main>
  <div class="eyebrow">Seed Bible MCP</div>
  <h1>Bring the Bible into your AI assistant.</h1>
  <p class="lead">Connect Claude, ChatGPT, or any other assistant that supports MCP, and it can look up verses, read whole chapters, find the verse of the day, and link you to them on <a href="https://seedbible.org">Seed Bible</a>. It quotes the actual text instead of recalling it from memory.</p>
  <div class="endpoint">
    <code id="endpoint-url">${escapeHtml(endpointUrl)}</code>
    <button type="button" class="copy" data-copy="${escapeHtml(endpointUrl)}">Copy URL</button>
  </div>
  <ul class="badges">
    <li>Free</li>
    <li>No sign-in or API key</li>
    <li>1,000+ translations</li>
    <li>Hebrew &amp; Greek originals</li>
  </ul>

  <h2>What is MCP?</h2>
  <p>MCP (Model Context Protocol) is a standard way to plug tools into an AI assistant, a bit like installing an app on your phone. Once you add this server, your assistant can fetch Bible text on its own whenever a question needs it.</p>
  <p>That matters because a model answering from memory can misquote a verse or mix up translations. With this server, it reads the passage from the <a href="https://bible.helloao.org">Free Use Bible API</a> and quotes it word for word.</p>

  <h2>Set it up</h2>
  <p>Pick your app. Each one takes about a minute. Apps marked <span class="pill">No code</span> can be set up entirely from their settings screens: just copy the URL above and paste it in.</p>
  <div role="tablist" aria-label="Apps">${tabs}</div>
  ${panels}

  <h2>Things to try</h2>
  <ul class="prompts">${prompts}</ul>

  <h2>What your assistant can do</h2>
  <ul class="tools">${tools}</ul>

  <h2>Translations</h2>
  <p>References can name four translations directly: the <strong>Berean Standard Bible</strong> (BSB, the default), the <strong>World English Bible</strong> (WEB), the <strong>Westminster Leningrad Codex</strong> (Hebrew Old Testament), and the <strong>SBL Greek New Testament</strong>. Your assistant can also search more than 1,000 other translations in hundreds of languages and read from any of them.</p>

  <footer>
    <p>The Seed Bible MCP is made by <a href="https://helloao.org">HelloAO</a> and uses the <a href="https://bible.helloao.org">Free Use Bible API</a>. Read the Bible on <a href="https://seedbible.org">seedbible.org</a>. Source code on <a href="https://github.com/HelloAOLab/bible-api/tree/main/packages/seed-bible-mcp">GitHub</a>.</p>
  </footer>
</main>
<script>
(function () {
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  function select(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { select(tab, false); });
    tab.addEventListener('keydown', function (e) {
      var next = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : null;
      if (next === null) return;
      e.preventDefault();
      select(tabs[(next + tabs.length) % tabs.length], true);
    });
  });
  if (tabs.length) select(tabs[0], false);
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('[data-copy]');
    if (!btn || !navigator.clipboard) return;
    var label = btn.textContent;
    navigator.clipboard.writeText(btn.getAttribute('data-copy')).then(function () {
      btn.textContent = 'Copied';
      setTimeout(function () { btn.textContent = label; }, 1500);
    });
  });
})();
</script>
</body>
</html>`;
}
