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
        ['meta', { name: 'theme-color', content: '#3eaf7c' }],
        ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
        [
            'meta',
            { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
        ],
    ],

    theme: defaultTheme({
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
