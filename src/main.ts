

import hljs from 'highlight.js';
import Genesis1 from '../build/bible/BSB/Genesis/1.json';
import { ChapterContent, TranslationBookChapter } from './usfm-parser/generator';
import { createRouter, createWebHashHistory } from 'vue-router';
import { createApp } from 'vue';
import Bible from './Bible.vue';
import App from './App.vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/:translation/:book/:chapter',
            component: Bible,
            props: true
        }
    ]
});

const app = createApp(App);

app.use(router);

app.mount('#app');
