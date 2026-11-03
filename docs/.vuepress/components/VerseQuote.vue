<script setup lang="ts">
import { withBase } from 'vuepress/client';
import type { QuotedVerse } from '../composables/useVerses';

// A quoted verse that opens in Seed Bible. Styled by .verse in
// styles/pages.scss.
defineProps<{ verse: QuotedVerse }>();

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
        <blockquote :lang="verse.lang" dir="auto">
            &ldquo;{{ verse.text }}&rdquo;
        </blockquote>
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
