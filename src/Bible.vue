<template>
  <div>
    <div v-if="!chapter">
      Loading...
    </div>
    <div v-else>
      <div v-html="chapter"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { TranslationBookChapter } from './usfm-parser/generator';
import MarkdownIt from 'markdown-it';

const props = defineProps({
  book: { type: String, required: true },
  chapter: { type: String, required: true }
});

const chapter = ref<string | null>(null);

const load = async () => {
  console.log("Load!");
  const url = `/build/bible/bsb/${props.book}/${props.chapter}.json`;
  const result = await fetch(url);
  const final = await result.json();

  const md = new MarkdownIt({
    html: true,
    breaks: false
  });

  const markdown = renderMarkdown(final);
  const html = md.render(markdown);

  chapter.value = html;
};

onMounted(() => {
  console.log("mounted!");
  load();
});

watch(props, () => {
  load();
});

function renderMarkdown(tree: TranslationBookChapter): string {
    let md = '';

    if (tree.book.commonName) {
        md += `# ${tree.book.commonName}\n`;
    }

    const c = tree.chapter;
    md += `### ${c.number}\n`;

    for (let content of c.content) {
        if (content.type === 'heading') {
            md += `#### ${content.content.join(' ')}\n`;
        } else if(content.type === 'line_break') {
            md += '\n\n';
        } else if(content.type === 'verse') {
            md += `<em>${content.number}</em>`;
            for (let v of content.content) {
                if (typeof v === 'string') {
                    md += v + ' ';
                } else if ('text' in v) {
                    md += v.text + ' ';
                }
            }
            md += '\n';
        }
    }

    return md;
}
</script>

<style>

</style>