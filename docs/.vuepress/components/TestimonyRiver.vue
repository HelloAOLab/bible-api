<script setup lang="ts">
/**
 * The testimony river under the cause heading on the home page. One lane of
 * testimony cards drifts by, with "Your testimony here" second and then after
 * every three. Once there are EXPAND_AT testimonies, "See all" opens it into
 * several lanes moving at different speeds. Lanes pause on hover and focus,
 * and hold still for reduced motion. Data in ../testimonies.ts.
 */
import { computed, onMounted, ref } from 'vue';
import { RouteLink, withBase } from 'vuepress/client';
import { useLabels, useLocalePage } from '../composables/useLocale';
import { fillLabel } from '../composables/formatLabel';
import { TESTIMONIES, type Testimony } from '../testimonies';

const EVERY = 3;
const EXPAND_AT = 8;
const LANES = 3;

const labels = useLabels();
const localePage = useLocalePage();
const r = computed(() => labels.value.home.river);
const link = computed(() => localePage('/support.html') + '#testimony');

const preview = ref(false);
onMounted(() => {
    preview.value = /[?&]river-preview\b/.test(location.search);
});

const items = computed<Testimony[]>(() => {
    const list = TESTIMONIES.slice();
    if (preview.value) {
        for (let n = 0; n < 12; n++) {
            list.push({
                name: `Sample name ${n + 1}`,
                role: 'Sample affiliation',
                quote:
                    n % 3
                        ? 'A sample testimony, a sentence or two on what the Free Use Bible API makes possible.'
                        : 'A shorter sample.',
            });
        }
    }
    return list;
});

const open = ref(false);
const canOpen = computed(() => items.value.length >= EXPAND_AT);

type Entry = { invite: true } | { invite: false; t: Testimony };

/* An invite after testimony number `from`, then after every three more. The
   first lane uses 0, so the invite is the second card on the page. Other
   lanes start later, so the invites never line up in a column. */
function sequence(list: Testimony[], from: number): Entry[] {
    const out: Entry[] = [];
    list.forEach((t, i) => {
        out.push({ invite: false, t });
        if (
            i >= from &&
            (i - from) % EVERY === 0 &&
            !(i === list.length - 1 && i !== from)
        ) {
            out.push({ invite: true });
        }
    });
    return out;
}

const lanes = computed(() => {
    const list = items.value;
    let groups: Testimony[][] = [list];
    if (open.value) {
        const k = Math.min(LANES, Math.ceil(list.length / 4));
        groups = Array.from({ length: k }, () => [] as Testimony[]);
        list.forEach((t, i) => groups[i % k].push(t));
    }
    return groups.map((g, i) => ({
        entries: sequence(g, [0, 2, 1][i % 3]),
        rev: i % 2 === 1,
        secs: Math.round(Math.max(36, g.length * 1.4 * 9) * (1 + i * 0.25)),
    }));
});

const initials = (n: string) =>
    n
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();

const moreLabel = computed(() =>
    open.value
        ? r.value.showLess
        : fillLabel(r.value.seeAll, { count: String(items.value.length) })
);

function openFromRiver(e: MouseEvent) {
    if (!canOpen.value || open.value) return;
    if ((e.target as HTMLElement).closest('a')) return;
    open.value = true;
}
</script>

<template>
    <div class="river-wrap">
        <div
            id="river"
            class="river"
            :class="{ 'rv-empty': !items.length, 'rv-can-open': canOpen }"
            :aria-label="r.label"
            @click="openFromRiver"
        >
            <div v-if="!items.length" class="rv-lane rv-still">
                <ul class="rv-track">
                    <li class="rv-card rv-you">
                        <RouteLink :to="link">
                            <span class="rv-face" aria-hidden="true">+</span>
                            <div class="rv-body">
                                <p class="rv-q">{{ r.invite }}</p>
                                <p class="rv-who">
                                    <b>{{ r.inviteCta }}&nbsp;&rarr;</b>
                                </p>
                            </div>
                        </RouteLink>
                    </li>
                </ul>
            </div>
            <div
                v-for="(lane, li) in lanes"
                v-else
                :key="`${open}-${li}`"
                class="rv-lane"
                :class="{ 'rv-rev': lane.rev }"
                :style="{ '--rv-dur': lane.secs + 's' }"
            >
                <!-- two copies, so the loop is seamless; the second is hidden
                     from screen readers -->
                <ul
                    v-for="copy in 2"
                    :key="copy"
                    class="rv-track"
                    :aria-hidden="copy === 2 ? 'true' : undefined"
                >
                    <template v-for="(e, ei) in lane.entries" :key="ei">
                        <li v-if="e.invite" class="rv-card rv-you">
                            <RouteLink
                                :to="link"
                                :tabindex="copy === 2 ? -1 : undefined"
                            >
                                <span class="rv-face" aria-hidden="true"
                                    >+</span
                                >
                                <div class="rv-body">
                                    <p class="rv-q">{{ r.invite }}</p>
                                    <p class="rv-who">
                                        <b>{{ r.inviteCta }}&nbsp;&rarr;</b>
                                    </p>
                                </div>
                            </RouteLink>
                        </li>
                        <li v-else class="rv-card">
                            <span class="rv-face">
                                <img
                                    v-if="e.t.photo"
                                    :src="withBase(e.t.photo)"
                                    alt=""
                                    width="44"
                                    height="44"
                                    loading="lazy"
                                />
                                <span v-else aria-hidden="true">{{
                                    initials(e.t.name)
                                }}</span>
                            </span>
                            <div class="rv-body">
                                <p class="rv-q">&ldquo;{{ e.t.quote }}&rdquo;</p>
                                <p class="rv-who">
                                    <b>{{ e.t.name }}</b>
                                    <small v-if="e.t.role"> {{ e.t.role }}</small>
                                    <small v-if="e.t.gave">
                                        {{ r.supporter }}</small
                                    >
                                </p>
                            </div>
                        </li>
                    </template>
                </ul>
            </div>
        </div>
        <button
            v-if="canOpen"
            type="button"
            class="rv-more"
            :aria-expanded="String(open)"
            aria-controls="river"
            @click="open = !open"
        >
            {{ moreLabel }}&nbsp;{{ open ? '↑' : '↓' }}
        </button>
    </div>
</template>

<style scoped>
.river-wrap {
    margin: clamp(28px, 3.4vw, 40px) 0 clamp(36px, 4.4vw, 52px);
}
.river {
    display: flex;
    flex-direction: column;
    gap: 14px;
    overflow: hidden;
    -webkit-mask-image: linear-gradient(
        90deg,
        transparent,
        #000 6%,
        #000 94%,
        transparent
    );
    mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
}
.river.rv-empty {
    -webkit-mask-image: none;
    mask-image: none;
}
.river.rv-can-open {
    cursor: pointer;
}
.rv-lane {
    display: flex;
    width: max-content;
}
.rv-track {
    list-style: none;
    margin: 0;
    padding: 0 14px 0 0;
    display: flex;
    align-items: stretch;
    gap: 14px;
    flex: none;
}
.rv-lane:not(.rv-still) .rv-track {
    animation: fuba-rv-flow var(--rv-dur, 60s) linear infinite;
}
.rv-rev .rv-track {
    animation-direction: reverse;
}
.rv-lane:hover .rv-track,
.rv-lane:focus-within .rv-track {
    animation-play-state: paused;
}
@keyframes fuba-rv-flow {
    to {
        transform: translateX(-100%);
    }
}
.rv-card {
    flex: none;
    width: max-content;
    max-width: 600px;
    display: flex;
    align-items: center;
    gap: 14px;
    margin: 0;
    padding: 14px 20px 14px 14px;
    border: 1px solid var(--line);
    border-radius: 12px;
    background: var(--bg);
    cursor: auto;
}
.rv-card > a {
    display: flex;
    align-items: center;
    gap: 14px;
    color: inherit;
    text-decoration: none;
}
.rv-body {
    min-width: 0;
}
.rv-q {
    margin: 0;
    font-size: 15px;
    line-height: 1.45;
    letter-spacing: -0.01em;
    color: var(--text);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.rv-who {
    margin: 4px 0 0;
    font-size: 13px;
    line-height: 1.4;
    color: var(--muted);
}
.rv-who b {
    font-weight: 700;
    color: var(--text);
}
.rv-who small {
    font-size: inherit;
}
.rv-who small::before {
    content: '\00b7\00a0';
}
.rv-face {
    flex: none;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    overflow: hidden;
    display: grid;
    place-items: center;
    background: var(--surface-2);
    font-size: 14px;
    font-weight: 700;
    color: var(--text-2);
}
.rv-face img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}
.rv-you {
    border-style: dashed;
    border-color: var(--line-strong);
    background: transparent;
}
.rv-you a {
    cursor: pointer;
}
.rv-you .rv-q {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: -0.02em;
}
.rv-you .rv-face {
    background: transparent;
    border: 1px dashed var(--line-strong);
    font-size: 20px;
    font-weight: 400;
    color: var(--text);
}
@media (hover: hover) {
    .rv-you a:hover b {
        text-decoration: underline;
        text-underline-offset: 4px;
    }
}
.rv-more {
    display: block;
    margin: 16px auto 0;
    padding: 8px 4px;
    border: 0;
    background: none;
    color: var(--text);
    font: inherit;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 4px;
}
@media (prefers-reduced-motion: reduce) {
    .river {
        overflow-x: auto;
        -webkit-mask-image: none;
        mask-image: none;
    }
    .rv-lane .rv-track {
        animation: none !important;
    }
    .rv-lane .rv-track[aria-hidden] {
        display: none;
    }
}
@media (max-width: 620px) {
    .rv-card {
        max-width: 320px;
    }
    .rv-q {
        font-size: 14px;
    }
}
</style>
