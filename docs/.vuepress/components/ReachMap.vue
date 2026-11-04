<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { usePageLang } from 'vuepress/client';
import { useLabels } from '../composables/useLocale';
import { MAP_HEIGHT, MAP_SHAPES, MAP_WIDTH } from '../worldMap';
import { REACH_HITS } from '../reach';

/* The world map under "Help us spread God's word": each country shaded by
   how many requests come from it.
   Loaded on its own (see HomePage.vue), since the outlines are large. */

const labels = useLabels();
const lang = usePageLang();

const LOG_MAX = Math.log10(Math.max(...Object.values(REACH_HITS)));
const LOG_MIN = 2; // REACH_HITS starts at 100 requests

// Country names come from the browser, after hydration: Node and browsers
// ship different name data, and the server-rendered page must match.
const mounted = ref(false);
onMounted(() => (mounted.value = true));

const countryName = computed(() => {
    if (!mounted.value) return (id: string) => id;
    try {
        const names = new Intl.DisplayNames([lang.value, 'en'], {
            type: 'region',
        });
        return (id: string) => names.of(id) ?? id;
    } catch {
        return (id: string) => id;
    }
});

// Shade by the order of magnitude, so the long tail still shows.
const shade = (n: number) =>
    Math.round(18 + ((Math.log10(n) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * 70) +
    '%';

const shapes = computed(() =>
    MAP_SHAPES.map((shape, i) => {
        const n = shape.id ? REACH_HITS[shape.id] : undefined;
        return {
            key: shape.id || `x${i}`,
            d: shape.d,
            fill: n ? shade(n) : undefined,
            title: n ? countryName.value(shape.id) : undefined,
        };
    })
);
</script>

<template>
    <svg
        class="reach-map"
        :viewBox="`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`"
        role="img"
        :aria-label="labels.home.reachLabel"
    >
        <g class="rm-land">
            <path
                v-for="shape in shapes"
                :key="shape.key"
                :d="shape.d"
                :class="{ hit: shape.fill }"
                :style="shape.fill ? { '--shade': shape.fill } : undefined"
            >
                <title v-if="shape.title">{{ shape.title }}</title>
            </path>
        </g>
    </svg>
</template>

<style lang="scss">
.fuba-page .reach-map {
    display: block;
    width: 100%;
    height: auto;
    overflow: visible;

    .rm-land path {
        fill: var(--surface-2);
        stroke: var(--bg);
        stroke-width: 0.6;
        stroke-linejoin: round;
    }
    .rm-land path.hit {
        fill: color-mix(in srgb, var(--text) var(--shade), var(--surface-2));
    }
    @media (hover: hover) {
        .rm-land path.hit:hover {
            fill: var(--text);
        }
    }
}
</style>
