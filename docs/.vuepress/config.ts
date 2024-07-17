const { description } = require('../../package')
import { defineUserConfig } from 'vuepress';
import { backToTopPlugin } from '@vuepress/plugin-back-to-top';
import { mediumZoomPlugin } from '@vuepress/plugin-medium-zoom';
import { defaultTheme } from '@vuepress/theme-default';
import { viteBundler} from '@vuepress/bundler-vite';
import { searchPlugin } from '@vuepress/plugin-search';
import { shikiPlugin } from '@vuepress/plugin-shiki';

export default defineUserConfig({
  base: '/docs/',

  title: 'Free Use Bible API',
  description: description,
  bundler: viteBundler(),

  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
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
        link: '/reference/'
      },
      {
        text: 'Source Code',
        link: 'https://github.com/HelloAOLab/bible-api'
      }
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          collapsible: false,
          children: [
            '',
            'making-requests',
            'a-biblical-model-for-licensing-the-bible',
          ]
        }
      ],
      '/reference/': [
        {
          text: 'Reference',
          collapsible: false,
          children: [
            ''
          ]
        }
      ]
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
  ]
});
