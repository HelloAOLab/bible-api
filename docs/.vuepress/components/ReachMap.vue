<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { usePageLang } from 'vuepress/client';
import { useLabels } from '../composables/useLocale';
import { fillLabel } from '../composables/formatLabel';
import { MAP_HEIGHT, MAP_POINTS, MAP_SHAPES, MAP_WIDTH } from '../worldMap';
import { REACH_HITS } from '../reach';

/* The world map under "Help us spread God's word": each country shaded by
   how many requests come from it, with a bubble sized by the same count.
   Loaded on its own (see HomePage.vue), since the outlines are large. */

const labels = useLabels();
const lang = usePageLang();

const MAX = Math.max(...Object.values(REACH_HITS));
const LOG_MAX = Math.log10(MAX);
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

const formatCount = (n: number) => {
    try {
        return n.toLocaleString(lang.value);
    } catch {
        return n.toLocaleString('en-US');
    }
};

const describe = (id: string, n: number) =>
    fillLabel(labels.value.home.reachCountry, {
        country: countryName.value(id),
        count: formatCount(n),
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
            title: n ? describe(shape.id, n) : undefined,
        };
    })
);

// The area of a bubble follows the count. The smallest are drawn last, on
// top, so they stay visible where bubbles overlap.
const bubbles = computed(() =>
    Object.entries(REACH_HITS)
        .filter(([id]) => MAP_POINTS[id])
        .sort((a, b) => b[1] - a[1])
        .map(([id, n]) => ({
            id,
            x: MAP_POINTS[id][0],
            y: MAP_POINTS[id][1],
            r: +(1.6 + 30 * Math.sqrt(n / MAX)).toFixed(1),
            title: describe(id, n),
        }))
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
        <g class="rm-dots">
            <circle
                v-for="dot in bubbles"
                :key="dot.id"
                :cx="dot.x"
                :cy="dot.y"
                :r="dot.r"
            >
                <title>{{ dot.title }}</title>
            </circle>
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
    .rm-dots circle {
        fill: color-mix(in srgb, #ffb400 78%, transparent);
        stroke: var(--bg);
        stroke-width: 0.7;
    }
    @media (hover: hover) {
        .rm-land path.hit:hover {
            fill: var(--text);
        }
        .rm-dots circle:hover {
            fill: #ffb400;
        }
    }
}
</style>
