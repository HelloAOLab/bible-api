const { description } = require('../../package');
import { defineUserConfig } from 'vuepress';
import { backToTopPlugin } from '@vuepress/plugin-back-to-top';
import { mediumZoomPlugin } from '@vuepress/plugin-medium-zoom';
import { defaultTheme } from '@vuepress/theme-default';
import { viteBundler } from '@vuepress/bundler-vite';
import { searchPlugin } from '@vuepress/plugin-search';
import { shikiPlugin } from '@vuepress/plugin-shiki';
import { markdownIncludePlugin } from '@vuepress/plugin-markdown-include';

export default defineUserConfig({
    base: '/docs/',

    title: 'Free Use Bible API',
    description: description,
    bundler: viteBundler() as any,

    head: [
        ['link', { rel: 'icon', href: '/docs/favicon.png' }],
        ['meta', { name: 'theme-color', content: '#ffffff' }],
        ['meta', { property: 'og:type', content: 'website' }],
        ['meta', { property: 'og:title', content: 'Free Use Bible API' }],
        [
            'meta',
            {
                property: 'og:description',
                content:
                    'An easy-to-use and fully featured JSON API for Scripture. No API key, no usage limits, no copyright restrictions.',
            },
        ],
        [
            'meta',
            {
                property: 'og:image',
                content: 'https://bible.helloao.org/docs/seed_bible_logo.png',
            },
        ],
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
        backToTopPlugin(),
        mediumZoomPlugin(),
        markdownIncludePlugin({}),
    ],
});
