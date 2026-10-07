<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { RouteLink, withBase } from 'vuepress/client';

const DONATE_URL = 'https://better.giving/marketplace/1118469';
const DISCORD_URL = 'https://discord.com/invite/NbEZMCJmqC';
const GITHUB_URL = 'https://github.com/HelloAOLab/bible-api';
const ISSUES_URL = 'https://github.com/HelloAOLab/bible-api/issues';

const logo = withBase('/seed_bible_logo.png');
const logoDark = withBase('/seed_bible_logo_dark.png');

// The catalog grows. Fill the printed numbers from the live endpoint rather
// than letting them rot, but only once a session: the file is large.
const translations = ref('1,256');
const languages = ref('1,004');

function paintCounts(t: number, l: number) {
    if (t) translations.value = t.toLocaleString('en-US');
    if (l) languages.value = l.toLocaleString('en-US');
}

onMounted(() => {
    let hit: string | null = null;
    try {
        hit = sessionStorage.getItem('fuba-counts');
    } catch (e) {}
    if (hit) {
        try {
            const c = JSON.parse(hit);
            paintCounts(c.t, c.l);
            return;
        } catch (e) {}
    }

    const go = () => {
        fetch('https://bible.helloao.org/api/available_translations.json')
            .then((r) => (r.ok ? r.json() : null))
            .then((j) => {
                if (!j || !j.translations || !j.translations.length) return;
                const t = j.translations.length;
                const l = new Set(
                    j.translations
                        .map((x: any) => x.language)
                        .filter((x: any) => !!x)
                ).size;
                paintCounts(t, l);
                try {
                    sessionStorage.setItem(
                        'fuba-counts',
                        JSON.stringify({ t, l })
                    );
                } catch (e) {}
            })
            .catch(() => {});
    };

    if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(go, { timeout: 4000 });
    } else {
        setTimeout(go, 1200);
    }
});

type Mark = 'y' | 'p' | 'n';
const MARK_LABEL: Record<Mark, string> = {
    y: 'Yes',
    p: 'Conditional',
    n: 'Not granted',
};

const compareColumns = [
    'No account',
    'No usage limit',
    'Permissionless',
    'Store & cache*',
    'Open source',
];

const compareRows: {
    name: string;
    ours?: boolean;
    cells: [Mark, string][];
}[] = [
    {
        name: 'Free Use Bible API',
        ours: true,
        cells: [
            ['y', 'No account, key or approval'],
            ['y', 'No published usage limit'],
            [
                'y',
                'Nothing to accept. AO Lab adds no restrictions; each text keeps its own notice',
            ],
            ['y', 'Cache, store and download without expiry'],
            ['y', 'MIT licensed'],
        ],
    },
    {
        name: 'API.Bible',
        cells: [
            ['n', 'Account and API key required'],
            ['n', '5,000 calls a month on Starter'],
            [
                'n',
                'Accept API.Bible’s terms; commercial use adds a licence for each translation',
            ],
            ['p', 'Cache allowed, but must refresh at least every 30 days'],
            ['p', 'Client SDKs are open source; the API itself is not'],
        ],
    },
    {
        name: 'YouVersion Platform',
        cells: [
            ['n', 'App registration and key required'],
            ['n', 'Rate limited, no published number'],
            [
                'n',
                'Accept the platform terms, then a publisher agreement for each set of translations',
            ],
            [
                'p',
                'Set by each publisher agreement; some allow in-app offline use, some limit how much is shown at once',
            ],
            ['p', 'Client SDKs are open source; the API itself is not'],
        ],
    },
    {
        name: 'Bible Brain',
        cells: [
            ['n', 'Key required, granted at their discretion'],
            [
                'n',
                'None published, and access can be limited or revoked at any time',
            ],
            ['n', 'Accept the licence; keys are approved at their discretion'],
            ['p', 'Offline use only via their download endpoint'],
            ['y', 'The API is MIT licensed'],
        ],
    },
];
</script>

<template>
    <div class="fuba-home">
        <main>
            <section class="hero">
                <div class="shell">
                    <h1>Free Use Bible API</h1>
                    <p class="sub">
                        An easy-to-use and fully featured JSON API for
                        Scripture.
                    </p>
                    <div class="cta">
                        <RouteLink class="btn primary" to="/guide/getting-started.html">
                            Quick Start <span aria-hidden="true">&rarr;</span>
                        </RouteLink>
                        <a class="btn secondary" :href="DONATE_URL">Donate</a>
                    </div>
                </div>
            </section>

            <section class="demo">
                <div class="shell">
                    <a
                        class="verse"
                        href="https://seedbible.org/?translation=AAB&book=MAT&chapter=10&verse=8"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Open Matthew 10:8 in Seed Bible"
                    >
                        <blockquote>
                            &ldquo;Freely you have received; freely give.&rdquo;
                        </blockquote>
                        <span class="ref">
                            <img class="seed light-only" :src="logo" alt="" />
                            <img class="seed dark-only" :src="logoDark" alt="" />
                            Matthew 10:8 &middot; AAB &#8599;
                        </span>
                    </a>
                </div>
            </section>

            <section class="proof">
                <div class="shell proof-grid">
                    <div>
                        <strong>{{ translations }} translations</strong>
                        <span>across {{ languages }} languages</span>
                    </div>
                    <div>
                        <strong>No API key</strong>
                        <span>Nothing to sign up for</span>
                    </div>
                    <div>
                        <strong>No usage limits</strong>
                        <span>Free forever</span>
                    </div>
                </div>
            </section>

            <section class="section ecosystem" id="ecosystem">
                <div class="shell">
                    <div class="head">
                        <h2>Welcome to freedom.</h2>
                        <p>
                            Get started today with <strong>no limits</strong>
                            and <strong>no red tape</strong>.
                        </p>
                        <p class="tiny-link">
                            <a href="#compare">
                                Compare us to other Bible APIs &rarr;
                            </a>
                        </p>
                    </div>
                    <div class="cards">
                        <RouteLink class="card" to="/reference/translations/">
                            <h3>Bible Translations</h3>
                            <p>
                                {{ translations }} translations as static JSON,
                                with headings, poetry, line breaks and
                                footnotes kept intact.
                            </p>
                            <span class="go">API reference &rarr;</span>
                        </RouteLink>
                        <RouteLink
                            class="card"
                            to="/reference/translations/standard.html#get-the-audio-timings-for-a-chapter"
                        >
                            <h3>Bible Audio</h3>
                            <p>
                                Scripture plainly read aloud and dramatized, for
                                easy listening and accessibility.
                            </p>
                            <span class="go">Audio endpoints &rarr;</span>
                        </RouteLink>
                        <RouteLink class="card" to="/reference/datasets/">
                            <h3>Bible Data Sets</h3>
                            <p>
                                Cross references and other Bible data sets, in
                                formats you can build with rather than parse
                                around.
                            </p>
                            <span class="go">Browse datasets &rarr;</span>
                        </RouteLink>
                        <div class="card">
                            <h3>Seed Bible Developer Docs</h3>
                            <p>
                                Utilize and extend our open platform instead of
                                starting from scratch.
                            </p>
                            <span class="go pending">Coming December</span>
                        </div>
                    </div>
                </div>
            </section>

            <section class="section compare" id="compare">
                <div class="shell">
                    <div class="head">
                        <h2>A Few Bible APIs Compared</h2>
                    </div>
                    <div class="matrix-wrap">
                        <table class="matrix">
                            <caption class="vh">
                                What the Free Use Bible API and three widely
                                used Bible APIs let you do
                            </caption>
                            <thead>
                                <tr>
                                    <th scope="col" class="matrix-corner">
                                        What you may do
                                    </th>
                                    <th
                                        v-for="col in compareColumns"
                                        :key="col"
                                        scope="col"
                                    >
                                        <span>{{ col }}</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="row in compareRows"
                                    :key="row.name"
                                    :class="{ 'ours-row': row.ours }"
                                >
                                    <th scope="row">{{ row.name }}</th>
                                    <td
                                        v-for="([mark, note], i) in row.cells"
                                        :key="i"
                                    >
                                        <span
                                            class="m"
                                            :class="mark"
                                            :title="note"
                                        ></span>
                                        <span class="vh">
                                            {{ MARK_LABEL[mark] }}. {{ note }}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="matrix-foot">
                        <p class="legend">
                            <span><span class="m y"></span> Yes</span>
                            <span><span class="m p"></span> Conditional</span>
                            <span><span class="m n"></span> Not granted</span>
                        </p>
                        <p class="legend-note">
                            *Copy and store on your own hardware, servers, or on
                            a device so it works offline.
                        </p>
                    </div>
                </div>
            </section>

            <section class="section contribute" id="contribute">
                <div class="shell contribute-grid">
                    <h2 class="contribute-title">
                        Help us expand the frontier.
                    </h2>
                    <div class="contribute-copy">
                        <p>
                            Let&rsquo;s create an open ecosystem of public
                            domain content and open source tools.
                        </p>
                        <div class="cta">
                            <a class="btn primary" :href="DONATE_URL">
                                Donate <span aria-hidden="true">&rarr;</span>
                            </a>
                            <a class="btn secondary" :href="DISCORD_URL">
                                Contribute on Discord
                                <span aria-hidden="true">&#8599;</span>
                            </a>
                        </div>
                    </div>

                    <a
                        class="verse"
                        href="https://seedbible.org/?translation=AAB&book=1PE&chapter=4&verse=10"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Open 1 Peter 4:10 in Seed Bible"
                    >
                        <blockquote>
                            &ldquo;As good stewards of the manifold grace of
                            God, each of you should use whatever gift he has
                            received to serve one another.&rdquo;
                        </blockquote>
                        <span class="ref">
                            <img class="seed light-only" :src="logo" alt="" />
                            <img class="seed dark-only" :src="logoDark" alt="" />
                            1 Peter 4:10 &middot; AAB &#8599;
                        </span>
                    </a>
                </div>
            </section>

            <section class="section build">
                <div class="shell">
                    <div class="build-card">
                        <div class="build-main">
                            <h3>Let&rsquo;s start building.</h3>
                            <RouteLink class="btn" to="/guide/getting-started.html">
                                Quick Start
                                <span aria-hidden="true">&rarr;</span>
                            </RouteLink>
                        </div>
                        <div class="build-opts">
                            <RouteLink to="/reference/">
                                <small>Want the details?</small>
                                <strong>Read the API reference &rarr;</strong>
                                <p>
                                    Every endpoint, with the exact shape of the
                                    JSON it returns.
                                </p>
                            </RouteLink>
                            <RouteLink to="/guide/making-requests.html#examples">
                                <small>Want something to copy?</small>
                                <strong>See examples &rarr;</strong>
                                <p>
                                    Common requests and working patterns you can
                                    adapt.
                                </p>
                            </RouteLink>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <footer>
            <div class="shell">
                <div class="foot-top">
                    <div class="foot-id">
                        <b>Free Use Bible API</b>
                        <p class="made">
                            Made with
                            <span role="img" aria-label="love">&#9829;&#xFE0E;</span>
                            by <a href="https://helloao.org">AO Lab</a>
                        </p>
                        <p>Join us on our journey with any of the links below.</p>
                        <div class="foot-social">
                            <a :href="GITHUB_URL" aria-label="Source code on GitHub">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.55v-1.94c-3.2.7-3.88-1.54-3.88-1.54-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.02 11.02 0 015.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .3.2.66.8.55A11.51 11.51 0 0023.5 12C23.5 5.73 18.27.5 12 .5z"/></svg>
                            </a>
                            <a :href="DISCORD_URL" aria-label="AO Lab on Discord">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c1.8483 1.3579 3.6396 2.1867 5.3968 2.7367a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.7652-.5498 3.5565-1.3786 5.4048-2.7366a.0777.0777 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>
                            </a>
                            <a href="https://www.youtube.com/@aolab" aria-label="AO Lab on YouTube">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                            </a>
                        </div>
                    </div>
                    <div class="foot-reach">
                        <p class="lbl2">Want to contribute or found a bug?</p>
                        <a :href="ISSUES_URL">Open an issue on GitHub &rarr;</a>
                        <div class="reach2">
                            <p class="lbl2">Want to talk with the team?</p>
                            <a :href="DISCORD_URL">Join us on Discord &rarr;</a>
                        </div>
                    </div>
                </div>

                <div class="foot-cols">
                    <div>
                        <p class="lbl2">Docs</p>
                        <ul>
                            <li><RouteLink to="/guide/getting-started.html">Quick Start</RouteLink></li>
                            <li><RouteLink to="/guide/">Guide</RouteLink></li>
                            <li><RouteLink to="/reference/">Reference</RouteLink></li>
                            <li><RouteLink to="/sdks/">SDKs</RouteLink></li>
                            <li><RouteLink to="/guide/downloads.html">Downloads</RouteLink></li>
                            <li><a :href="ISSUES_URL">Report an issue</a></li>
                        </ul>
                    </div>
                    <div>
                        <p class="lbl2">Resources</p>
                        <ul>
                            <li><RouteLink to="/reference/translations/">Bible translations</RouteLink></li>
                            <li><RouteLink to="/reference/translations/standard.html#get-the-audio-timings-for-a-chapter">Bible audio</RouteLink></li>
                            <li><RouteLink to="/reference/commentaries/">Bible commentaries</RouteLink></li>
                            <li><RouteLink to="/reference/datasets/">Bible data sets</RouteLink></li>
                            <li><span class="soon">Seed Bible (Coming soon)</span></li>
                        </ul>
                    </div>
                    <div>
                        <p class="lbl2">AO Lab</p>
                        <ul>
                            <li><a href="https://helloao.org">AO Lab</a></li>
                            <li><a href="https://helloao.org/about-us">About us</a></li>
                            <li><a :href="DONATE_URL">Donate to AO Lab</a></li>
                        </ul>
                    </div>
                </div>

                <div class="foot-legal">
                    <span>A 501(c)(3) nonprofit &middot; Established 2/2/2022</span>
                    <a class="foot-logo" href="https://helloao.org" aria-label="AO Lab">
                        <img class="light-only" :src="logo" alt="Seed Bible" />
                        <img class="dark-only" :src="logoDark" alt="Seed Bible" />
                    </a>
                    <span class="foot-terms">
                        <RouteLink to="/guide/a-biblical-model-for-licensing-the-bible.html">License</RouteLink>
                    </span>
                </div>
            </div>
        </footer>
    </div>
</template>

<style lang="scss">
.fuba-home {
    // Tokens are defined globally in styles/index.scss so the docs pages and
    // the home page share one black-and-white system that follows the theme.
    --bg: var(--vp-c-bg);
    --surface: var(--vp-c-bg-alt);
    --surface-2: var(--fuba-surface-2);
    --text: var(--vp-c-text);
    --text-2: var(--fuba-text-2);
    --muted: var(--vp-c-text-mute);
    --line: var(--vp-c-divider);
    --line-strong: var(--fuba-line-strong);
    --btn-bg: var(--vp-c-accent-bg);
    --btn-fg: var(--vp-c-accent-text);
    --card-line: var(--fuba-card-line);
    --card-dim: var(--fuba-card-dim);
    --max: 1160px;

    padding-top: var(--navbar-height);
    background: var(--bg);
    color: var(--text);
    font-size: 16px;
    line-height: 1.55;
    font-variant-numeric: lining-nums tabular-nums;

    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }
    a {
        color: inherit;
        text-decoration: none;
    }
    h1,
    h2,
    h3 {
        margin: 0;
        padding: 0;
        border: 0;
        letter-spacing: -0.03em;
        line-height: 1.05;
        font-weight: 700;
    }
    :focus-visible {
        outline: 2px solid var(--line-strong);
        outline-offset: 3px;
        border-radius: 3px;
    }
    .shell {
        max-width: var(--max);
        margin: 0 auto;
        padding: 0 28px;
    }

    // swap the black and white logo with the theme
    .dark-only {
        display: none !important;
    }

    /* ---------- buttons ---------- */
    .btn {
        min-height: 48px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 0 20px;
        border: 1px solid var(--line-strong);
        border-radius: 8px;
        font-size: 15px;
        font-weight: 600;
        transition:
            background 0.15s ease,
            color 0.15s ease;
    }
    .btn.primary {
        background: var(--btn-bg);
        color: var(--btn-fg);
    }
    .btn.primary:hover {
        background: var(--text-2);
    }
    .btn.secondary {
        background: transparent;
        color: var(--text);
    }
    .btn.secondary:hover {
        background: var(--surface);
    }

    /* ---------- hero ---------- */
    .hero {
        padding: clamp(48px, 6.5vw, 84px) 0 clamp(40px, 4.6vw, 58px);
        text-align: center;
    }
    .hero h1 {
        font-size: clamp(40px, 6vw, 68px);
        letter-spacing: -0.045em;
    }
    .hero .sub {
        margin: 16px auto 0;
        color: var(--muted);
        font-size: clamp(17px, 1.9vw, 21px);
        letter-spacing: -0.015em;
        text-wrap: balance;
    }
    .cta {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 12px;
        margin-top: 28px;
    }
    .demo {
        padding: 0 0 clamp(54px, 6vw, 78px);
    }

    /* ---------- verses ---------- */
    .verse {
        display: block;
        max-width: none;
        margin: 34px 0 4px;
        padding: 0 0 0 20px;
        border-left: 2px solid var(--line-strong);
    }
    .verse blockquote {
        margin: 0;
        padding: 0;
        border: 0;
        max-width: 1040px;
        font-size: clamp(18px, 1.85vw, 22px);
        line-height: 1.4;
        letter-spacing: -0.02em;
        color: var(--text);
        text-wrap: pretty;
    }
    .verse .ref {
        display: inline-flex;
        align-items: center;
        gap: 9px;
        margin-top: 14px;
        font-size: 14px;
        font-weight: 600;
        color: var(--muted);
    }
    // the Seed Bible mark is wide, so it is sized by height
    .verse .ref img.seed {
        display: block;
        width: auto;
        height: 12px;
    }
    .verse:hover .ref {
        color: var(--text);
    }
    .demo .verse {
        margin: 0 auto;
        padding: 0;
        border-left: 0;
        text-align: center;
    }
    .demo .verse blockquote {
        max-width: 30ch;
        margin: 0 auto;
        font-size: clamp(21px, 2.3vw, 27px);
        font-weight: 500;
        line-height: 1.3;
    }
    .demo .verse .ref {
        justify-content: center;
        margin-top: 11px;
    }

    /* ---------- proof row ---------- */
    .proof {
        border-top: 1px solid var(--line);
        border-bottom: 1px solid var(--line);
        background: var(--surface);
    }
    .proof-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
    }
    .proof-grid div {
        padding: 22px 24px;
        text-align: center;
    }
    .proof-grid div + div {
        border-left: 1px solid var(--line);
    }
    .proof-grid strong {
        display: block;
        font-size: 22px;
        letter-spacing: -0.03em;
    }
    .proof-grid div > span {
        color: var(--muted);
        font-size: 13.5px;
    }

    /* ---------- sections ---------- */
    .section {
        padding: clamp(64px, 8vw, 100px) 0;
    }
    .ecosystem {
        padding-bottom: clamp(36px, 4.4vw, 56px);
    }
    .compare {
        padding-top: clamp(28px, 3.6vw, 48px);
    }
    .head {
        max-width: 720px;
        margin-bottom: 36px;
    }
    .ecosystem .head {
        max-width: 1040px;
    }
    .head h2 {
        font-size: clamp(30px, 4vw, 48px);
        letter-spacing: -0.04em;
    }
    .head p {
        margin: 12px 0 0;
        color: var(--muted);
        font-size: 18px;
    }
    .head p strong {
        color: var(--text);
        font-weight: 700;
    }
    .tiny-link {
        margin: 14px 0 0;
        font-size: 15px;
    }
    .head p.tiny-link {
        font-size: 15px;
    }
    .tiny-link a {
        font-weight: 600;
        color: var(--text);
        text-decoration: underline;
        text-underline-offset: 3px;
    }

    /* ---------- cards ---------- */
    .cards {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
    }
    .card {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 30px 28px;
        border: 1px solid var(--line);
        border-radius: 12px;
        background: var(--bg);
        min-height: 190px;
    }
    @media (hover: hover) {
        a.card:hover {
            border-color: var(--line-strong);
        }
    }
    .card h3 {
        margin: 0 0 8px;
        font-size: 24px;
    }
    .card p {
        margin: 0;
        color: var(--muted);
        font-size: 15.5px;
        max-width: 46ch;
    }
    .card .go {
        margin-top: 0;
        padding-top: 18px;
        font-weight: 600;
        font-size: 15px;
    }
    .card .go.pending {
        color: var(--muted);
    }

    /* ---------- the feature matrix ---------- */
    .matrix-wrap {
        overflow-x: auto;
        border: 1px solid var(--line);
        border-radius: 12px;
        -webkit-overflow-scrolling: touch;
    }
    .matrix {
        display: table;
        width: 100%;
        margin: 0;
        border-collapse: collapse;
        font-size: 14px;
        min-width: 560px;
    }
    .matrix tr {
        border: 0;
        background: none;
    }
    .matrix th,
    .matrix td {
        padding: 0;
        border: 0;
        text-align: center;
        vertical-align: middle;
    }
    .matrix thead th {
        padding: 14px 8px;
        background: var(--surface);
        border-bottom: 1px solid var(--line);
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.07em;
        text-transform: uppercase;
        color: var(--muted);
        line-height: 1.3;
    }
    .matrix thead th span {
        display: block;
        max-width: 15ch;
        margin: 0 auto;
    }
    .matrix .matrix-corner {
        text-align: left;
    }
    .matrix tbody th {
        position: sticky;
        left: 0;
        z-index: 1;
        padding: 13px 16px;
        text-align: left;
        background: var(--bg);
        border-bottom: 1px solid var(--line);
        border-right: 1px solid var(--line);
        font-size: 14.5px;
        font-weight: 600;
        white-space: nowrap;
    }
    .matrix thead th:first-child {
        position: sticky;
        left: 0;
        z-index: 3;
        text-align: left;
        padding-left: 16px;
        border-right: 1px solid var(--line);
    }
    .matrix tbody td {
        position: relative;
        padding: 13px 8px;
        border-bottom: 1px solid var(--line);
    }
    .matrix tbody tr:last-child th,
    .matrix tbody tr:last-child td {
        border-bottom: 0;
    }
    .matrix .ours-row th,
    .matrix .ours-row td {
        background: var(--surface-2);
        font-weight: 700;
    }
    .m {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 999px;
        border: 1.5px solid var(--line-strong);
        cursor: help;
    }
    .m.y {
        background: var(--line-strong);
    }
    .m.p {
        background: linear-gradient(
            90deg,
            var(--line-strong) 50%,
            transparent 50%
        );
    }
    .m.n {
        border-color: var(--muted);
        opacity: 0.38;
    }
    .matrix-foot {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: 10px clamp(18px, 3vw, 40px);
        margin-top: 16px;
    }
    .legend {
        margin: 0;
        display: flex;
        gap: 18px;
        font-size: 13.5px;
        font-weight: 600;
        white-space: nowrap;
    }
    .legend span span.m {
        margin-right: 6px;
        vertical-align: -1px;
        cursor: default;
    }
    .legend-note {
        margin: 0;
        flex: 1 1 380px;
        max-width: 74ch;
        font-size: 13.5px;
        line-height: 1.5;
        color: var(--muted);
    }
    .vh {
        position: absolute;
        width: 1px;
        height: 1px;
        margin: -1px;
        padding: 0;
        overflow: hidden;
        clip: rect(0 0 0 0);
        white-space: nowrap;
        border: 0;
    }

    /* ---------- contribute ---------- */
    .contribute {
        padding: clamp(48px, 6vw, 76px) 0;
        background: var(--surface);
        border-top: 1px solid var(--line);
        border-bottom: 1px solid var(--line);
    }
    .contribute-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: clamp(22px, 2.6vw, 34px) clamp(36px, 5vw, 80px);
        align-items: center;
    }
    .contribute-title {
        grid-column: 1;
        grid-row: 1;
        margin: 0;
        text-wrap: balance;
        font-size: clamp(30px, 4vw, 48px);
        letter-spacing: -0.04em;
    }
    .contribute-copy {
        grid-column: 1;
        grid-row: 2;
    }
    .contribute-copy p {
        margin: 0;
        max-width: 44ch;
        color: var(--muted);
        font-size: 18px;
    }
    .contribute-copy .cta {
        justify-content: flex-start;
        margin-top: 26px;
    }
    .contribute .verse {
        grid-column: 2;
        grid-row: 1 / span 2;
        align-self: center;
        margin: 0;
        padding-left: clamp(20px, 2.2vw, 28px);
    }
    .contribute .verse blockquote {
        max-width: 34ch;
        font-size: clamp(20px, 1.7vw, 24px);
        line-height: 1.4;
    }

    /* ---------- start building ---------- */
    .build-card {
        border-radius: 20px;
        overflow: hidden;
        background: var(--text);
        color: var(--bg);
    }
    .build-main {
        padding: clamp(34px, 4.2vw, 60px) clamp(24px, 3.4vw, 56px)
            clamp(32px, 3.6vw, 52px);
        text-align: left;
    }
    .build-main h3 {
        margin: 0;
        font-size: clamp(30px, 4.2vw, 56px);
        letter-spacing: -0.045em;
        line-height: 1;
    }
    .build-main .btn {
        margin-top: clamp(22px, 2.6vw, 32px);
        background: var(--bg);
        color: var(--text);
        border-color: var(--bg);
        white-space: nowrap;
    }
    .build-main .btn:hover {
        background: var(--card-dim);
        color: var(--text);
    }
    .build-opts {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        border-top: 1px solid var(--card-line);
    }
    .build-opts a {
        padding: 26px clamp(24px, 3.4vw, 32px) 28px;
        text-align: left;
        min-width: 0;
    }
    .build-opts a + a {
        border-left: 1px solid var(--card-line);
    }
    .build-opts a:hover {
        background: var(--card-line);
    }
    .build-opts small {
        display: block;
        margin-bottom: 7px;
        font-size: 13px;
        font-weight: 600;
        color: var(--card-dim);
    }
    .build-opts strong {
        display: block;
        font-size: 18px;
        letter-spacing: -0.02em;
    }
    .build-opts p {
        margin: 7px 0 0;
        font-size: 15px;
        line-height: 1.45;
        color: var(--card-dim);
    }

    /* ---------- footer ---------- */
    footer {
        border-top: 1px solid var(--line);
        padding: clamp(40px, 5vw, 60px) 0 44px;
        font-size: 14px;
        color: var(--muted);
    }
    .foot-top {
        display: grid;
        grid-template-columns: 1.15fr 0.85fr;
        gap: 40px;
        padding-bottom: 32px;
        border-bottom: 1px solid var(--line);
    }
    .foot-id b {
        display: block;
        font-size: 16px;
        letter-spacing: -0.02em;
        color: var(--text);
    }
    .foot-id p {
        margin: 8px 0 0;
        max-width: 60ch;
    }
    .foot-id .made {
        display: flex;
        align-items: center;
        gap: 6px;
        color: var(--text);
        font-weight: 600;
    }
    .foot-social {
        display: flex;
        gap: 8px;
        margin-top: 18px;
    }
    .foot-social a {
        width: 38px;
        height: 38px;
        display: grid;
        place-items: center;
        border: 1px solid var(--line);
        border-radius: 9px;
        color: var(--text-2);
    }
    .foot-social a:hover {
        color: var(--text);
        border-color: var(--line-strong);
    }
    .foot-social svg {
        width: 18px;
        height: 18px;
        fill: currentColor;
    }
    .foot-reach {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }
    .lbl2 {
        margin: 0;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--muted);
    }
    .foot-reach a {
        margin-top: 10px;
        font-size: clamp(19px, 2vw, 24px);
        font-weight: 600;
        letter-spacing: -0.025em;
        color: var(--text);
        align-self: flex-start;
        border-bottom: 1px solid var(--line);
        padding-bottom: 2px;
    }
    .foot-reach a:hover {
        border-bottom-color: var(--line-strong);
    }
    .foot-reach .reach2 {
        display: flex;
        flex-direction: column;
        margin-top: 28px;
    }
    .foot-cols {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 28px;
        padding: 30px 0 6px;
    }
    .foot-cols ul {
        list-style: none;
        margin: 12px 0 0;
        padding: 0;
        display: grid;
        gap: 9px;
    }
    .foot-cols a {
        color: var(--text-2);
    }
    .foot-cols .soon {
        color: var(--muted);
        cursor: default;
    }
    .foot-cols a:hover {
        color: var(--text);
        text-decoration: underline;
        text-underline-offset: 3px;
    }
    .foot-legal {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        gap: 14px 24px;
        margin-top: 26px;
        padding-top: 26px;
        border-top: 1px solid var(--line);
        font-size: 11.5px;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
    }
    .foot-legal .foot-terms {
        justify-self: end;
    }
    .foot-legal a {
        color: var(--muted);
    }
    .foot-legal a:hover {
        color: var(--text);
    }
    .foot-logo img {
        display: block;
        width: auto;
        height: 40px;
    }

    @media (max-width: 980px) {
        .foot-cols {
            grid-template-columns: repeat(2, 1fr);
        }
    }
    @media (max-width: 900px) {
        .cards {
            gap: 12px;
        }
        .card {
            padding: 24px 22px;
            min-height: 170px;
        }
        .card h3 {
            margin: 0 0 6px;
            font-size: 21px;
        }
        .proof-grid {
            grid-template-columns: 1fr;
        }
        .proof-grid div + div {
            border-left: 0;
            border-top: 1px solid var(--line);
        }
    }
    @media (max-width: 860px) {
        .contribute-grid {
            grid-template-columns: 1fr;
            gap: 24px;
        }
        .contribute-title,
        .contribute-copy,
        .contribute .verse {
            grid-column: auto;
            grid-row: auto;
        }
        .contribute .verse blockquote {
            max-width: none;
        }
    }
    @media (max-width: 820px) {
        .build-opts {
            grid-template-columns: 1fr;
        }
        .build-opts a + a {
            border-left: 0;
            border-top: 1px solid var(--card-line);
        }
        .foot-top {
            grid-template-columns: 1fr;
            gap: 28px;
        }
        .foot-cols {
            grid-template-columns: 1fr;
            gap: 26px;
        }
    }
    @media (max-width: 720px) {
        .foot-legal {
            grid-template-columns: 1fr;
            justify-items: center;
            text-align: center;
        }
        .foot-legal .foot-logo {
            order: -1;
        }
        .foot-legal .foot-terms {
            justify-self: center;
        }
        .matrix tbody th {
            white-space: normal;
            max-width: 126px;
            padding: 11px 12px;
            font-size: 13px;
        }
        .matrix thead th:first-child {
            padding-left: 12px;
            font-size: 10px;
        }
        .matrix tbody td {
            padding: 11px 6px;
        }
    }
    @media (max-width: 620px) {
        .shell {
            padding: 0 16px;
        }
        .demo .verse blockquote {
            max-width: 20ch;
        }
        .cards {
            grid-template-columns: 1fr;
            gap: 0;
            border-top: 1px solid var(--line);
        }
        .card {
            min-height: 0;
            padding: 20px 0;
            border: 0;
            border-bottom: 1px solid var(--line);
            border-radius: 0;
            background: transparent;
        }
        .card h3 {
            margin: 0 0 5px;
            font-size: 18px;
            letter-spacing: -0.025em;
        }
        .card p {
            font-size: 14px;
            line-height: 1.45;
            max-width: none;
        }
        .card .go {
            padding-top: 11px;
            font-size: 13.5px;
        }
        .section {
            padding: clamp(40px, 9vw, 56px) 0;
        }
        .head {
            margin-bottom: 22px;
        }
        .head h2 {
            font-size: 29px;
        }
        .head p {
            font-size: 16.5px;
        }
        .matrix-foot {
            gap: 12px;
        }
        .legend-note {
            flex-basis: 100%;
        }
        .matrix {
            min-width: 0;
        }
        .matrix tbody th {
            max-width: 76px;
            padding: 10px 6px;
            font-size: 12px;
        }
        .matrix thead th {
            padding: 10px 2px;
            font-size: 9px;
            letter-spacing: 0.04em;
        }
        .matrix thead th:first-child {
            padding-left: 8px;
        }
        .matrix tbody td {
            padding: 10px 2px;
        }
    }
    @media (prefers-reduced-motion: reduce) {
        * {
            transition: none !important;
        }
    }
}

[data-theme='dark'] .fuba-home {
    .light-only {
        display: none !important;
    }
    .dark-only {
        display: block !important;
    }
}
</style>
