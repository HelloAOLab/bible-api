<script setup lang="ts">
import { withBase } from 'vuepress/client';

/** A verse quoted on the home page, linked to it in Seed Bible. */
defineProps<{
    verse: {
        /** The text, as HTML, without quotation marks. */
        html: string;
        lang: string;
        reference: string;
        translationAbbreviation: string;
        /** "Open … in Seed Bible", for screen readers. */
        open: string;
        url: string;
    };
}>();

const logo = withBase('/seed_bible_logo.png');
const logoDark = withBase('/seed_bible_logo_dark.png');
</script>

<template>
    <a
        class="verse"
        :href="verse.url"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="verse.open"
    >
        <blockquote
            :lang="verse.lang"
            dir="auto"
            v-html="`&ldquo;${verse.html}&rdquo;`"
        ></blockquote>
        <span class="ref">
            <img class="seed light-only" :src="logo" alt="" />
            <img class="seed dark-only" :src="logoDark" alt="" />
            <span :lang="verse.lang"
                >{{ verse.reference }} &middot;
                {{ verse.translationAbbreviation }} &#8599;</span
            >
        </span>
    </a>
</template>
