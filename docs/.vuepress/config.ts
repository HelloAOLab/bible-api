import { defineUserConfig } from 'vuepress';
import { backToTopPlugin } from '@vuepress/plugin-back-to-top';
import { mediumZoomPlugin } from '@vuepress/plugin-medium-zoom';
import { defaultTheme } from '@vuepress/theme-default';
import { viteBundler } from '@vuepress/bundler-vite';
import { searchPlugin } from '@vuepress/plugin-search';
import { seoPlugin } from '@vuepress/plugin-seo';
import { shikiPlugin } from '@vuepress/plugin-shiki';
import { sitemapPlugin } from '@vuepress/plugin-sitemap';
import { markdownIncludePlugin } from '@vuepress/plugin-markdown-include';

const hostname = 'https://bible.helloao.org';
const base = '/docs/';
const title = 'Free Use Bible API';
const ogImage = `${hostname}${base}og-image.png`;

// Used as the site-wide fallback <meta name="description"> for any page that
// does not set its own `description` in frontmatter. Kept around 155 characters
// so search engines show it without truncating.
const description =
    'A free JSON Bible API with over 1000 translations in 700+ languages. ' +
    'No API keys, no rate limits, no usage restrictions. Includes commentaries and datasets.';

// The home page has no markdown title, which would otherwise leave og:title and
// the JSON-LD name empty on the most-shared URL of the site.
const homeTitle = 'Free Use Bible API — A Free JSON API for the Bible';

export default defineUserConfig({
    base,
    lang: 'en-US',

    title,
    description: description,
    bundler: viteBundler() as any,

    head: [
        ['link', { rel: 'icon', href: '/docs/favicon.png' }],
        ['link', { rel: 'apple-touch-icon', href: '/docs/favicon.png' }],
        ['meta', { name: 'theme-color', content: '#3eaf7c' }],
        // Every page shares the same 1200x630 card, so the card type can be set
        // globally. Without this the seo plugin only emits twitter:card for
        // pages that declare their own `banner`/`cover`, and X renders the
        // small summary card instead of the large one.
        ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
        ['meta', { name: 'twitter:image', content: ogImage }],
        ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
        [
            'meta',
            { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
        ],
    ],

    theme: defaultTheme({
        repo: '',
        editLink: false,
        docsDir: '',
        editLinkText: '',
        lastUpdated: false,
        navbar: [
            {
                text: 'Guide',
                link: '/guide/',
            },
            {
                text: 'Reference',
                link: '/reference/',
            },
            {
                text: 'SDKs',
                link: '/sdks/',
            },
            {
                text: 'Source Code',
                link: 'https://github.com/HelloAOLab/bible-api',
            },
            {
                text: 'About Us',
                link: 'https://helloao.org/about-us',
            },
            {
                text: 'Donate',
                link: 'https://better.giving/marketplace/1118469',
            },
            {
                text: 'YouTube',
                link: 'https://www.youtube.com/@aolab',
            },
        ],
        sidebar: {
            '/guide/': [
                {
                    text: 'Guide',
                    collapsible: false,
                    children: [
                        '',
                        'getting-started',
                        'making-requests',
                        'downloads',
                        'a-biblical-model-for-licensing-the-bible',
                    ],
                },
            ],
            '/reference/': [
                {
                    text: 'Reference',
                    collapsible: false,
                    children: [''],
                },
            ],
            '/sdks/': [
                {
                    text: 'SDKs',
                    collapsible: false,
                    children: ['', 'javascript'],
                },
            ],
        },
    }),

    plugins: [
        searchPlugin(),
        shikiPlugin({
            // options
            langs: ['ts', 'json'],
            theme: 'dark-plus',
        }),
        seoPlugin({
            hostname,
            author: {
                name: 'AO Lab',
                url: 'https://helloao.org/',
            },
            fallBackImage: ogImage,
            // The plugin's string form of `canonical` ignores `base`, which
            // would emit https://bible.helloao.org/guide/ instead of
            // https://bible.helloao.org/docs/guide/. Build it explicitly.
            canonical: (page) =>
                `${hostname}${base}${page.path.replace(/^\//, '')}`,
            ogp: (ogp) => ({
                ...ogp,
                'og:title': ogp['og:title'] || homeTitle,
                'og:description': ogp['og:description'] || description,
            }),
            jsonLd: (jsonLd) =>
                jsonLd['@type'] === 'WebPage'
                    ? { ...jsonLd, name: jsonLd.name || homeTitle }
                    : jsonLd,
        }),
        sitemapPlugin({
            hostname,
        }),
        backToTopPlugin(),
        mediumZoomPlugin(),
        markdownIncludePlugin({}),
    ],
});
