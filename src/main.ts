
import { UsfmParser } from './usfm-parser';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import Genesis from '../bible/bsb/01GENBSB.usfm?raw';

const parser = new UsfmParser();

const tree = parser.parse(Genesis);

const markdown = parser.renderMarkdown(tree);

const md = new MarkdownIt({
    html: true,
    breaks: false
});

const html = md.render(markdown);

const app = document.getElementById('app');
if (!app) {
    throw new Error('App element not found!');
}
app.innerHTML = html;

const json = document.getElementById('json');

if (!json) {
    throw new Error('json element not found!');
}

// json.innerText = JSON.stringify(tree, undefined, 2);

// setTimeout(() => {
const final = hljs.highlight(JSON.stringify(tree, undefined, 2), { 
    language: 'json'
});

json.innerHTML = final.value;
// }, 5000);
