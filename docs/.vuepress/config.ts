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
// does not set its own `description` in frontmatter.
const description =
    'An easy-to-use and fully featured JSON API for Scripture. ' +
    'No API key, no usage limits, no copyright restrictions.';

export default defineUserConfig({
    base,
    lang: 'en-US',

    title,
    description: description,
    bundler: viteBundler() as any,

    head: [
        ['link', { rel: 'icon', href: '/docs/favicon.png' }],
        ['link', { rel: 'apple-touch-icon', href: '/docs/favicon.png' }],
        ['meta', { name: 'theme-color', content: '#ffffff' }],
        // og:type/title/description/image are emitted per page by seoPlugin
        // below, so they are deliberately not set here: a static site-wide
        // value would give every page the home page's card.
        //
        // Every page does share the same 1200x630 image, so the card type can
        // be set globally. Without this the seo plugin only emits twitter:card
        // for pages that declare their own `banner`/`cover`, and X renders the
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
        logo: '/seed_bible_logo.png',
        logoDark: '/seed_bible_logo_dark.png',
        logoAlt: 'Seed Bible',
        themePlugins: {
            // Disable the default theme's built-in prismjs highlighter since
            // shikiPlugin (registered below) already highlights code blocks.
            // Having both enabled caused code fences (and their titles) to be
            // rendered twice.
            prismjs: false,
        },
        repo: '',
        editLink: false,
        docsDir: '',
        editLinkText: '',
        lastUpdated: false,
        contributors: false,
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
                text: 'GitHub',
                link: 'https://github.com/HelloAOLab/bible-api',
            },
            {
                text: 'Donate',
                link: 'https://better.giving/marketplace/1118469',
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
                    children: [
                        '',
                        {
                            text: 'Translations, Books, & Chapters',
                            collapsible: true,
                            children: [
                                'translations/',
                                'translations/standard',
                                'translations/simplified',
                            ],
                        },
                        {
                            text: 'Commentaries',
                            collapsible: true,
                            children: ['commentaries/'],
                        },
                        {
                            text: 'Datasets',
                            collapsible: true,
                            children: ['datasets/'],
                        },
                        'openapi',
                    ],
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
            // Defensive fallbacks: a page without its own title/description
            // would otherwise get an empty og:title or og:description.
            ogp: (ogp) => ({
                ...ogp,
                'og:title': ogp['og:title'] || title,
                'og:description': ogp['og:description'] || description,
            }),
            jsonLd: (jsonLd) =>
                jsonLd['@type'] === 'WebPage'
                    ? { ...jsonLd, name: jsonLd.name || title }
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
