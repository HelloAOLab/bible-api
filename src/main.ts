
import { UsfmParser } from './usfm-parser';
import MarkdownIt from 'markdown-it';
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
