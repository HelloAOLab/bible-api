<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { RouteLink, usePageFrontmatter, usePageLang } from 'vuepress/client';
import SiteFooter from './SiteFooter.vue';
import SupportWall from './SupportWall.vue';
import VerseQuote from './VerseQuote.vue';
import {
    useLabels,
    useLocalePage,
    useLocalePath,
} from '../composables/useLocale';
import { fillLabel, labelHtml } from '../composables/formatLabel';
import { useVerses } from '../composables/useVerses';
import type { Labels } from '../labels';

const DISCORD_URL = 'https://discord.com/invite/NbEZMCJmqC';

const localePath = useLocalePath();
const localePage = useLocalePage();
const labels = useLabels();
const frontmatter = usePageFrontmatter();
const lang = usePageLang();
const verses = useVerses();

const formatCount = (n: number) => {
    try {
        return n.toLocaleString(lang.value);
    } catch {
        return n.toLocaleString('en-US');
    }
};

/* ---------- live translation counts ---------- */

// The catalog grows. Fill the printed numbers from the live endpoint rather
// than letting them rot, but only once a session: the file is large.
const translationCount = ref(1256);
const languageCount = ref(1004);

function paintCounts(t: number, l: number) {
    if (t) translationCount.value = t;
    if (l) languageCount.value = l;
}

const translations = computed(() => formatCount(translationCount.value));
const languages = computed(() => formatCount(languageCount.value));

function fetchCounts() {
    let hit: string | null = null;
    try {
        hit = sessionStorage.getItem('fuba-counts');
    } catch (e) {}
    if (hit) {
        try {
            const c = JSON.parse(hit);
            paintCounts(c.t, c.l);
            return;
        } catch (e) {}
    }

    const go = () => {
        fetch('https://bible.helloao.org/api/available_translations.json')
            .then((r) => (r.ok ? r.json() : null))
            .then((j) => {
                if (!j || !j.translations || !j.translations.length) return;
                const t = j.translations.length;
                const l = new Set(
                    j.translations
                        .map((x: any) => x.language)
                        .filter((x: any) => !!x)
                ).size;
                paintCounts(t, l);
                try {
                    sessionStorage.setItem(
                        'fuba-counts',
                        JSON.stringify({ t, l })
                    );
                } catch (e) {}
            })
            .catch(() => {});
    };

    if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(go, { timeout: 4000 });
    } else {
        setTimeout(go, 1200);
    }
}

/* ---------- the comparison table ---------- */

type Mark = 'y' | 'p' | 'n';
const markLabel = computed<Record<Mark, string>>(() => ({
    y: labels.value.home.markYes,
    p: labels.value.home.markConditional,
    n: labels.value.home.markNotGranted,
}));

type CompareColumn = keyof Labels['home']['compareColumns'];
const COMPARE_COLUMNS: CompareColumn[] = [
    'account',
    'usage',
    'permission',
    'storage',
    'openSource',
];

// The notes for each cell are in labels.json, under the same row and column.
const COMPARE_ROWS: {
    id: keyof Labels['home']['compareRows'];
    name: string;
    ours?: boolean;
    marks: Mark[];
}[] = [
    {
        id: 'ours',
        name: 'Free Use Bible API',
        ours: true,
        marks: ['y', 'y', 'y', 'y', 'y'],
    },
    { id: 'apiBible', name: 'API.Bible', marks: ['n', 'n', 'n', 'p', 'p'] },
    {
        id: 'youVersion',
        name: 'YouVersion Platform',
        marks: ['n', 'n', 'n', 'p', 'p'],
    },
    {
        id: 'bibleBrain',
        name: 'Bible Brain',
        marks: ['n', 'n', 'n', 'p', 'y'],
    },
];

const compareRows = computed(() =>
    COMPARE_ROWS.map((row) => ({
        ...row,
        cells: COMPARE_COLUMNS.map(
            (column, i) =>
                [
                    row.marks[i],
                    labels.value.home.compareRows[row.id][column],
                ] as [Mark, string]
        ),
    }))
);

/* ---------- what copyright terms forbid ---------- */

const FORBIDDEN: (keyof Labels['home']['forbidden'])[] = [
    'copying',
    'translating',
    'revising',
    'adapting',
    'distributing',
];

/* ---------- the API's translations by licence ---------- */

// A snapshot of the catalog's licences (1,256 translations, November 2026).
type Use = keyof Labels['home']['licenceUses'];
const USES: Use[] = ['copy', 'translate', 'revise', 'adapt', 'distribute'];
const LICENCE_GROUPS: {
    id: keyof Labels['home']['licenceGroups'];
    restricted?: boolean;
    rows: {
        id: keyof Labels['home']['licenceRows'];
        marks: Mark[];
        count: number;
    }[];
}[] = [
    {
        id: 'ideal',
        rows: [
            {
                id: 'publicDomain',
                marks: ['y', 'y', 'y', 'y', 'y'],
                count: 102,
            },
        ],
    },
    {
        id: 'viable',
        rows: [
            { id: 'attribution', marks: ['y', 'y', 'y', 'y', 'y'], count: 36 },
            { id: 'shareAlike', marks: ['y', 'p', 'p', 'p', 'y'], count: 283 },
        ],
    },
    {
        id: 'restricted',
        restricted: true,
        rows: [
            {
                id: 'noDerivatives',
                marks: ['y', 'n', 'n', 'n', 'y'],
                count: 92,
            },
            {
                id: 'nonCommercialNoDerivatives',
                marks: ['p', 'n', 'n', 'n', 'p'],
                count: 728,
            },
            { id: 'other', marks: ['p', 'p', 'p', 'p', 'p'], count: 15 },
        ],
    },
];
const LICENCE_TOTAL = LICENCE_GROUPS.reduce(
    (sum, g) => sum + g.rows.reduce((s, r) => s + r.count, 0),
    0
);

const licenceMark = computed<Record<Mark, string>>(() => ({
    y: labels.value.home.markAllowed,
    p: labels.value.home.markSomeCases,
    n: labels.value.home.markForbidden,
}));

const licenceGroups = computed(() =>
    LICENCE_GROUPS.map((group) => ({
        ...group,
        name: labels.value.home.licenceGroups[group.id],
        total: formatCount(group.rows.reduce((s, r) => s + r.count, 0)),
        rows: group.rows.map((row) => ({
            ...row,
            ...labels.value.home.licenceRows[row.id],
            total: formatCount(row.count),
            width: ((row.count / LICENCE_TOTAL) * 100).toFixed(2) + '%',
            marks: row.marks.map((mark, i) => ({
                mark,
                use: labels.value.home.licenceUses[USES[i]],
                title: fillLabel(labels.value.home.markFor, {
                    use: labels.value.home.licenceUses[USES[i]],
                    mark: licenceMark.value[mark],
                }),
            })),
        })),
    }))
);

const FLYWHEEL: (keyof Labels['home']['flywheel'])[] = [
    'start',
    'build',
    'release',
    'next',
];

type FaqId = Exclude<keyof Labels['home']['faq'], 'money'>;
const FAQ_ANSWERS: Record<FaqId, true> = {
    problem: true,
    attribution: true,
    shareAlike: true,
    conditions: true,
    nonCommercial: true,
};

/* ---------- motion: confetti, the relay, the struck words ---------- */

const reducedMotion = () =>
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const milestone = ref<'party' | 'settle' | ''>('');
const relay = ref<HTMLElement>();
const struck = ref<HTMLElement>();
const relayOn = ref(false);
const struckArmed = ref(false);
const struckOn = ref(false);
const cueHidden = ref(false);
const cueOnInvert = ref(false);
const RELAY_DOTS = 66;

const cleanups: (() => void)[] = [];

/* A confetti burst on load, in bright colours. The banner text cycles the
   same colours and is back to white at 2.75s; the confetti runs 30% longer,
   ending at about 3.6s. Skipped for reduced motion. */
function confetti() {
    if (reducedMotion()) return;
    milestone.value = 'party';
    const c = document.createElement('canvas');
    c.className = 'fuba-confetti';
    c.setAttribute('aria-hidden', 'true');
    document.body.appendChild(c);
    const x = c.getContext('2d')!;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let W = 0;
    let H = 0;
    const size = () => {
        W = innerWidth;
        H = innerHeight;
        c.width = W * dpr;
        c.height = H * dpr;
        x.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    addEventListener('resize', size);
    const tones = [
        '#ff3b5c',
        '#ffb400',
        '#2f80ff',
        '#00c389',
        '#8b5cf6',
        '#ff6a00',
        '#ff2d95',
        '#00b8d9',
    ];
    const N = W < 620 ? 90 : 170;
    const P = Array.from({ length: N }, (_, i) => {
        const left = i % 2 === 0;
        return {
            x: left ? -10 : W + 10,
            y: H * (0.35 + Math.random() * 0.35),
            vx: (left ? 1 : -1) * (4 + Math.random() * 9) * (W / 1280 + 0.4),
            vy: -(8 + Math.random() * 10),
            w: 5 + Math.random() * 6,
            h: 8 + Math.random() * 8,
            r: Math.random() * 6.3,
            vr: (Math.random() - 0.5) * 0.35,
            t: Math.random() * 6.3,
            term: 1.8 + Math.random() * 1.8,
            col: tones[i % tones.length],
            round: Math.random() < 0.3,
        };
    });
    const start = performance.now();
    const DUR = 3575;
    let raf = 0;
    const stop = () => {
        cancelAnimationFrame(raf);
        c.remove();
        removeEventListener('resize', size);
    };
    const frame = (now: number) => {
        const k = now - start;
        x.clearRect(0, 0, W, H);
        const fade = k > DUR - 900 ? Math.max(0, (DUR - k) / 900) : 1;
        if (k > 2000 && milestone.value === 'party') {
            milestone.value = 'settle';
            setTimeout(() => {
                milestone.value = '';
            }, 800);
        }
        x.globalAlpha = fade;
        P.forEach((p) => {
            p.vy = Math.min(p.vy + 0.22, p.term);
            p.vx *= 0.985;
            p.x += p.vx;
            p.y += p.vy;
            p.r += p.vr;
            p.t += 0.12;
            x.save();
            x.translate(p.x + Math.sin(p.t) * 2, p.y);
            x.rotate(p.r);
            x.fillStyle = p.col;
            if (p.round) {
                x.beginPath();
                x.arc(0, 0, p.w / 2, 0, 6.283);
                x.fill();
            } else {
                x.fillRect(
                    -p.w / 2,
                    (-p.h / 2) * Math.abs(Math.cos(p.t)),
                    p.w,
                    p.h * Math.abs(Math.cos(p.t)) + 1
                );
            }
            x.restore();
        });
        if (k < DUR) raf = requestAnimationFrame(frame);
        else stop();
    };
    raf = requestAnimationFrame(frame);
    cleanups.push(stop);
}

/** Runs `then` once `el` is this far into view. */
function whenVisible(
    el: HTMLElement | undefined,
    threshold: number,
    then: () => void
) {
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
        then();
        return;
    }
    const io = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting) {
                then();
                io.disconnect();
            }
        },
        { threshold }
    );
    io.observe(el);
    cleanups.push(() => io.disconnect());
}

/* ---------- the scroll cue ---------- */

const home = ref<HTMLElement>();

function sections() {
    return Array.from(
        home.value?.querySelectorAll<HTMLElement>(
            'main > section, .fuba-footer'
        ) ?? []
    );
}

function updateCue() {
    cueHidden.value =
        scrollY + innerHeight >= document.documentElement.scrollHeight - 160;
    const cue = home.value?.querySelector('.scroll-cue');
    if (!cue) return;
    const c = cue.getBoundingClientRect();
    const y = c.top + c.height / 2;
    cueOnInvert.value = Array.from(
        home.value!.querySelectorAll('section.invert')
    ).some((s) => {
        const r = s.getBoundingClientRect();
        return y >= r.top && y <= r.bottom;
    });
}

function nextSection() {
    const head =
        document.querySelector<HTMLElement>('.vp-navbar')?.offsetHeight ?? 0;
    const next = sections().find(
        (s) => s.getBoundingClientRect().top > head + 8 && s.offsetHeight > 150
    );
    if (next) {
        const top = next.getBoundingClientRect().top + scrollY - head;
        window.scrollTo({
            top,
            behavior: reducedMotion() ? 'auto' : 'smooth',
        });
    }
}

onMounted(() => {
    fetchCounts();
    confetti();
    whenVisible(relay.value, 0.6, () => {
        relayOn.value = true;
    });
    if ('IntersectionObserver' in window) {
        struckArmed.value = true;
        whenVisible(struck.value, 0.25, () => {
            struckOn.value = true;
        });
    }
    addEventListener('scroll', updateCue, { passive: true });
    addEventListener('resize', updateCue);
    cleanups.push(() => {
        removeEventListener('scroll', updateCue);
        removeEventListener('resize', updateCue);
    });
    updateCue();
});

onBeforeUnmount(() => {
    cleanups.forEach((f) => f());
});
</script>

<template>
    <div ref="home" class="fuba-page fuba-home">
        <div class="milestone" :class="milestone">
            <p>
                <span>{{ labels.home.milestone }}</span>
            </p>
        </div>

        <main>
            <section class="hero">
                <div class="shell">
                    <h1>{{ frontmatter.title }}</h1>
                    <p class="sub">{{ labels.home.tagline }}</p>
                    <div class="cta">
                        <RouteLink
                            class="btn primary"
                            :to="localePath('/guide/getting-started.html')"
                        >
                            {{ labels.home.quickStart }}
                            <span aria-hidden="true">&rarr;</span>
                        </RouteLink>
                    </div>
                    <p class="more">
                        {{ labels.home.more }}
                        <a href="#ecosystem"
                            >{{ labels.home.learnMore }}&nbsp;&darr;</a
                        >
                    </p>
                </div>
            </section>

            <section class="proof">
                <div class="shell proof-grid">
                    <div>
                        <strong>{{
                            fillLabel(labels.home.translationCount, {
                                count: translations,
                            })
                        }}</strong>
                        <span>{{
                            fillLabel(labels.home.languageCount, {
                                count: languages,
                            })
                        }}</span>
                    </div>
                    <div>
                        <strong>{{ labels.home.noApiKey }}</strong>
                        <span>{{ labels.home.noApiKeyDetail }}</span>
                    </div>
                    <div>
                        <strong>{{ labels.home.noUsageLimits }}</strong>
                        <span>{{ labels.home.noUsageLimitsDetail }}</span>
                    </div>
                </div>
            </section>

            <section class="section cause" id="cause">
                <div class="shell">
                    <div class="cause-top">
                        <h2 class="cause-h">{{ labels.home.causeTitle }}</h2>
                        <RouteLink
                            class="btn primary cause-cta"
                            :to="localePage('/support.html')"
                        >
                            {{ labels.home.support }}
                            <span aria-hidden="true">&rarr;</span>
                        </RouteLink>
                    </div>
                    <SupportWall
                        :fund-link="localePage('/free-use-fund.html')"
                        show-note
                    />
                </div>
            </section>

            <section class="section alt ecosystem" id="ecosystem">
                <div class="shell">
                    <div class="head">
                        <h2>{{ labels.home.frontierTitle }}</h2>
                        <p v-html="labelHtml(labels.home.frontierDetail)"></p>
                        <p class="tiny-link">
                            <a href="#compare">
                                {{ labels.home.compareLink }} &rarr;
                            </a>
                        </p>
                    </div>
                    <div class="cards">
                        <RouteLink
                            class="card"
                            :to="localePath('/reference/translations/')"
                        >
                            <h3>{{ labels.home.translationsTitle }}</h3>
                            <p>
                                {{
                                    fillLabel(labels.home.translationsBody, {
                                        count: translations,
                                    })
                                }}
                            </p>
                            <span class="go"
                                >{{ labels.home.translationsLink }} &rarr;</span
                            >
                        </RouteLink>
                        <RouteLink
                            class="card"
                            :to="
                                localePath(
                                    '/reference/translations/standard.html#get-the-audio-timings-for-a-chapter'
                                )
                            "
                        >
                            <h3>{{ labels.home.audioTitle }}</h3>
                            <p>{{ labels.home.audioBody }}</p>
                            <span class="go"
                                >{{ labels.home.audioLink }} &rarr;</span
                            >
                        </RouteLink>
                        <RouteLink
                            class="card"
                            :to="localePath('/reference/datasets/')"
                        >
                            <h3>{{ labels.home.datasetsTitle }}</h3>
                            <p>{{ labels.home.datasetsBody }}</p>
                            <span class="go"
                                >{{ labels.home.datasetsLink }} &rarr;</span
                            >
                        </RouteLink>
                        <div class="card">
                            <h3>{{ labels.home.seedBibleTitle }}</h3>
                            <p>{{ labels.home.seedBibleBody }}</p>
                            <span class="go pending">{{
                                labels.home.seedBibleComing
                            }}</span>
                        </div>
                    </div>
                </div>
            </section>

            <section class="section alt compare" id="compare">
                <div class="shell">
                    <div class="head">
                        <h2>{{ labels.home.compareTitle }}</h2>
                    </div>
                    <div class="matrix-wrap">
                        <table class="matrix">
                            <caption class="vh">
                                {{
                                    labels.home.compareCaption
                                }}
                            </caption>
                            <thead>
                                <tr>
                                    <th scope="col" class="matrix-corner">
                                        {{ labels.home.compareCorner }}
                                    </th>
                                    <th
                                        v-for="col in COMPARE_COLUMNS"
                                        :key="col"
                                        scope="col"
                                    >
                                        <span>{{
                                            labels.home.compareColumns[col]
                                        }}</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="row in compareRows"
                                    :key="row.name"
                                    :class="{ 'ours-row': row.ours }"
                                >
                                    <th scope="row">{{ row.name }}</th>
                                    <td
                                        v-for="([mark, note], i) in row.cells"
                                        :key="i"
                                    >
                                        <span
                                            class="m"
                                            :class="mark"
                                            :title="note"
                                        ></span>
                                        <span class="vh">
                                            {{ markLabel[mark] }}. {{ note }}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="matrix-foot">
                        <p class="legend">
                            <span
                                ><span class="m y"></span>
                                {{ labels.home.markYes }}</span
                            >
                            <span
                                ><span class="m p"></span>
                                {{ labels.home.markConditional }}</span
                            >
                            <span
                                ><span class="m n"></span>
                                {{ labels.home.markNotGranted }}</span
                            >
                        </p>
                        <p class="legend-note">
                            {{ labels.home.storageNote }}
                        </p>
                    </div>
                </div>
            </section>

            <section class="section beat fg" id="freely">
                <div class="shell">
                    <h2 class="fg-h">{{ labels.home.freelyTitle }}</h2>
                    <VerseQuote
                        class="fg-verse fg-big"
                        :verse="verses.freelyGive"
                    />
                </div>
            </section>

            <section class="section beat fg alt" id="charge">
                <div class="shell">
                    <h2 class="fg-h">{{ labels.home.chargeTitle }}</h2>
                    <VerseQuote class="fg-verse" :verse="verses.charge" />
                </div>
            </section>

            <section class="section beat fg" id="since">
                <div class="shell">
                    <h2 class="fg-h">{{ labels.home.sinceTitle }}</h2>
                    <p
                        class="fg-p"
                        v-html="labelHtml(labels.home.sinceBody)"
                    ></p>
                    <figure
                        ref="relay"
                        class="relay"
                        :class="{ go: relayOn }"
                        role="img"
                        :aria-label="labels.home.relayLabel"
                    >
                        <div class="relay-line">
                            <i
                                v-for="n in RELAY_DOTS"
                                :key="n"
                                :class="{
                                    you: n === 1 || n === RELAY_DOTS,
                                }"
                                :style="{ '--n': n - 1 }"
                            ></i>
                        </div>
                        <figcaption>
                            <span>{{ labels.home.relayStart }}</span>
                            <span>{{ labels.home.relayEnd }}</span>
                        </figcaption>
                    </figure>
                </div>
            </section>

            <section class="section beat fg invert" id="forbid">
                <div class="shell">
                    <h2 class="meant-h">{{ labels.home.forbidTitle }}</h2>
                    <p class="fg-p">{{ labels.home.forbidLead }}</p>
                    <ul
                        ref="struck"
                        class="struck"
                        :class="{ armed: struckArmed, go: struckOn }"
                    >
                        <li v-for="(id, i) in FORBIDDEN" :key="id">
                            <strong :style="{ '--n': i }">{{
                                labels.home.forbidden[id].name
                            }}</strong>
                            <p class="ex">
                                {{ labels.home.forbidden[id].example }}
                            </p>
                            <p class="lic">
                                {{ labels.home.forbidden[id].licence }}
                            </p>
                        </li>
                    </ul>
                    <p class="fg-p forbid-end">{{ labels.home.forbidEnd }}</p>
                </div>
            </section>

            <section class="section beat fg" id="english">
                <div class="shell">
                    <h2 class="fg-h">{{ labels.home.englishTitle }}</h2>
                    <p class="fg-p fg-p-wide">{{ labels.home.englishBody }}</p>
                </div>
            </section>

            <section class="section beat fg alt" id="hinder">
                <div class="shell">
                    <h2 class="fg-h">{{ labels.home.hinderTitle }}</h2>
                    <VerseQuote class="fg-verse" :verse="verses.hinder" />
                </div>
            </section>

            <section class="section beat fg" id="frontier">
                <div class="shell">
                    <h2 class="fg-h">{{ labels.home.licencesTitle }}</h2>
                    <div class="lic-groups">
                        <p class="lr-head" aria-hidden="true">
                            <span></span>
                            <span class="lr-cols">
                                <span v-for="use in USES" :key="use">{{
                                    labels.home.licenceUses[use]
                                }}</span>
                            </span>
                            <span></span>
                        </p>
                        <div
                            v-for="group in licenceGroups"
                            :key="group.id"
                            class="lg"
                            :class="{ 'lg-no': group.restricted }"
                        >
                            <p class="lg-h">
                                <span>{{ group.name }}</span>
                                <b>{{ group.total }}</b>
                            </p>
                            <ul class="lr">
                                <li v-for="row in group.rows" :key="row.id">
                                    <span class="lr-name">{{ row.name }}</span>
                                    <span class="lr-why">{{ row.why }}</span>
                                    <span class="lr-marks">
                                        <span
                                            v-for="(m, i) in row.marks"
                                            :key="i"
                                            class="lr-m"
                                        >
                                            <span
                                                class="m"
                                                :class="m.mark"
                                                :title="m.title"
                                            ></span>
                                            <span
                                                class="lr-v"
                                                aria-hidden="true"
                                                >{{ m.use }}</span
                                            >
                                            <span class="vh"
                                                >{{ m.title }}.</span
                                            >
                                        </span>
                                    </span>
                                    <b class="lr-n">{{ row.total }}</b>
                                    <span class="lr-bar"
                                        ><span
                                            :style="{ width: row.width }"
                                        ></span
                                    ></span>
                                </li>
                            </ul>
                        </div>
                        <p class="legend lr-legend">
                            <span
                                ><span class="m y"></span
                                >{{ labels.home.markAllowed }}</span
                            >
                            <span
                                ><span class="m p"></span
                                >{{ labels.home.markSomeCases }}</span
                            >
                            <span
                                ><span class="m n"></span
                                >{{ labels.home.markForbidden }}</span
                            >
                        </p>
                    </div>
                </div>
            </section>

            <section class="section beat fg invert" id="flywheel">
                <div class="shell">
                    <h2 class="fg-h">{{ labels.home.flywheelTitle }}</h2>
                    <ol class="fw-flow" :aria-label="labels.home.flywheelLabel">
                        <li v-for="step in FLYWHEEL" :key="step">
                            {{ labels.home.flywheel[step] }}
                        </li>
                    </ol>
                </div>
            </section>

            <section class="section build">
                <div class="shell">
                    <div class="build-card">
                        <div class="build-main">
                            <h3>{{ labels.home.buildTitle }}</h3>
                            <RouteLink
                                class="btn"
                                :to="localePath('/guide/getting-started.html')"
                            >
                                {{ labels.home.quickStart }}
                                <span aria-hidden="true">&rarr;</span>
                            </RouteLink>
                        </div>
                        <div class="build-opts">
                            <a href="#newsletter" class="js-newsletter-trigger">
                                <small>{{
                                    labels.home.newsletterPrompt
                                }}</small>
                                <strong
                                    >{{
                                        labels.home.newsletterLink
                                    }}
                                    &rarr;</strong
                                >
                                <p>{{ labels.home.newsletterBody }}</p>
                            </a>
                            <a
                                :href="DISCORD_URL"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <small>{{ labels.home.discordPrompt }}</small>
                                <strong
                                    >{{
                                        labels.home.contributeDiscord
                                    }}
                                    &#8599;</strong
                                >
                                <p>{{ labels.home.discordBody }}</p>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section class="section alt" id="faq">
                <div class="shell">
                    <h2 class="faq-h">{{ labels.home.faqTitle }}</h2>
                    <div class="faq">
                        <details class="faq-q">
                            <summary>{{ labels.home.faq.problem.q }}</summary>
                            <div class="faq-a">
                                <p
                                    v-html="
                                        labelHtml(labels.home.faq.problem.a)
                                    "
                                ></p>
                            </div>
                        </details>
                        <details class="faq-q">
                            <summary>
                                {{ labels.home.faq.attribution.q }}
                            </summary>
                            <div class="faq-a">
                                <VerseQuote :verse="verses.notToUs" />
                                <p
                                    v-html="
                                        labelHtml(labels.home.faq.attribution.a)
                                    "
                                ></p>
                            </div>
                        </details>
                        <details class="faq-q">
                            <summary>
                                {{ labels.home.faq.shareAlike.q }}
                            </summary>
                            <div class="faq-a">
                                <p
                                    v-html="
                                        labelHtml(labels.home.faq.shareAlike.a)
                                    "
                                ></p>
                            </div>
                        </details>
                        <details class="faq-q">
                            <summary>
                                {{ labels.home.faq.conditions.q }}
                            </summary>
                            <div class="faq-a">
                                <p
                                    v-html="
                                        labelHtml(labels.home.faq.conditions.a)
                                    "
                                ></p>
                            </div>
                        </details>
                        <details class="faq-q">
                            <summary>{{ labels.home.faq.money.q }}</summary>
                            <div class="faq-a">
                                <VerseQuote :verse="verses.doNotWorry" />
                            </div>
                        </details>
                        <details class="faq-q">
                            <summary>
                                {{ labels.home.faq.nonCommercial.q }}
                            </summary>
                            <div class="faq-a">
                                <p
                                    v-html="
                                        labelHtml(
                                            labels.home.faq.nonCommercial.a
                                        )
                                    "
                                ></p>
                            </div>
                        </details>
                    </div>
                </div>
            </section>
        </main>

        <SiteFooter />

        <button
            type="button"
            class="scroll-cue"
            :class="{ 'on-invert': cueOnInvert, gone: cueHidden }"
            :aria-label="labels.home.scrollCue"
            :tabindex="cueHidden ? -1 : 0"
            @click="nextSection"
        >
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
            >
                <path d="M12 5v14M6 13l6 6 6-6" />
            </svg>
        </button>
    </div>
</template>

<style lang="scss">
// The shared pieces (tokens, buttons, verses, the build card, the FAQ) are in
// styles/pages.scss.

// The confetti is drawn on a canvas appended to <body>.
.fuba-confetti {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 70;
}

.fuba-page.fuba-home {
    /* ---------- the milestone ----------
       A thin black band under the navbar, plus a one-time confetti burst on
       load. To retire it, remove the .milestone element, these rules and the
       confetti() call. */
    .milestone {
        background: #0d0d0d;
        color: #ffffff;
        text-align: center;
        padding: 7px 16px;
        font-size: 14px;
        line-height: 1.35;
        font-weight: 600;
        letter-spacing: -0.005em;
        font-variant-numeric: lining-nums;
    }
    .milestone p {
        margin: 0;
    }
    /* while the confetti falls, the banner text runs through the confetti
       colours, then fades back to white */
    .milestone span {
        color: #fff;
        transition: color 0.75s ease;
    }
    .milestone.party span,
    .milestone.settle span {
        background: linear-gradient(
            90deg,
            #ff3b5c,
            #ffb400,
            #00c389,
            #00b8d9,
            #2f80ff,
            #8b5cf6,
            #ff2d95,
            #ff3b5c
        );
        background-size: 300% 100%;
        -webkit-background-clip: text;
        background-clip: text;
    }
    .milestone.party span {
        color: transparent;
        animation: fuba-party-shift 1.4s linear infinite;
    }

    /* ---------- hero ---------- */
    .hero {
        padding-bottom: clamp(72px, 11vw, 160px);
    }
    .more {
        margin: 26px 0 0;
        font-size: 14px;
        color: var(--muted);
    }
    .more a {
        font-weight: 600;
        color: var(--text);
        text-decoration: underline;
        text-underline-offset: 3px;
    }
    @media (min-width: 721px) {
        .hero {
            min-height: calc(
                100svh - var(--navbar-height) - 33px - 105px - 15svh
            );
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: clamp(40px, 5vw, 64px) 0;
        }
        .hero .sub {
            margin-top: 22px;
        }
        .hero .cta {
            margin-top: 38px;
        }
        .hero .more {
            margin-top: 34px;
        }
    }

    /* ---------- proof row ---------- */
    .proof {
        border-top: 1px solid var(--line);
        border-bottom: 1px solid var(--line);
        background: var(--surface);
    }
    .proof-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
    }
    .proof-grid div {
        padding: 22px 24px;
        text-align: center;
    }
    .proof-grid div + div {
        border-left: 1px solid var(--line);
    }
    .proof-grid strong {
        display: block;
        font-size: 22px;
        letter-spacing: -0.03em;
    }
    .proof-grid div > span {
        color: var(--muted);
        font-size: 13.5px;
    }

    /* ---------- the cause: the support wall ---------- */
    .cause-top {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-end;
        justify-content: space-between;
        gap: 14px 40px;
    }
    .cause-h {
        flex: 0 1 auto;
        max-width: 22ch;
        margin: 0;
        font-size: clamp(30px, 4vw, 48px);
        letter-spacing: -0.04em;
        text-wrap: balance;
    }
    .cause-cta {
        flex: none;
        margin-bottom: 0.3em;
    }

    /* ---------- ecosystem and the comparison ---------- */
    .ecosystem {
        padding-bottom: clamp(36px, 4.4vw, 56px);
        border-bottom: 0;
    }
    .ecosystem .head {
        max-width: 1040px;
    }
    .compare {
        padding-top: clamp(28px, 3.6vw, 48px);
        border-top: 0;
    }
    .cards {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
    }
    .card {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 30px 28px;
        border: 1px solid var(--line);
        border-radius: 12px;
        background: var(--bg);
        min-height: 190px;
    }
    @media (hover: hover) {
        a.card:hover {
            border-color: var(--line-strong);
        }
    }
    .card h3 {
        margin: 0 0 8px;
        font-size: 24px;
    }
    .card p {
        margin: 0;
        color: var(--muted);
        font-size: 15.5px;
        max-width: 46ch;
    }
    .card .go {
        margin-top: 0;
        padding-top: 18px;
        font-weight: 600;
        font-size: 15px;
    }
    .card .go.pending {
        color: var(--muted);
    }

    .matrix-wrap {
        overflow-x: auto;
        border: 1px solid var(--line);
        border-radius: 12px;
        background: var(--bg);
        -webkit-overflow-scrolling: touch;
    }
    .matrix {
        display: table;
        width: 100%;
        margin: 0;
        border-collapse: collapse;
        font-size: 14px;
        min-width: 560px;
    }
    .matrix tr {
        border: 0;
        background: none;
    }
    .matrix th,
    .matrix td {
        padding: 0;
        border: 0;
        text-align: center;
        vertical-align: middle;
    }
    .matrix thead th {
        padding: 14px 8px;
        background: var(--surface);
        border-bottom: 1px solid var(--line);
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.07em;
        text-transform: uppercase;
        color: var(--muted);
        line-height: 1.3;
    }
    .matrix thead th span {
        display: block;
        max-width: 15ch;
        margin: 0 auto;
    }
    .matrix .matrix-corner {
        text-align: left;
    }
    .matrix tbody th {
        position: sticky;
        left: 0;
        z-index: 1;
        padding: 13px 16px;
        text-align: left;
        background: var(--bg);
        border-bottom: 1px solid var(--line);
        border-right: 1px solid var(--line);
        font-size: 14.5px;
        font-weight: 600;
        white-space: nowrap;
    }
    .matrix thead th:first-child {
        position: sticky;
        left: 0;
        z-index: 3;
        text-align: left;
        padding-left: 16px;
        border-right: 1px solid var(--line);
    }
    .matrix tbody td {
        position: relative;
        padding: 13px 8px;
        border-bottom: 1px solid var(--line);
    }
    .matrix tbody tr:last-child th,
    .matrix tbody tr:last-child td {
        border-bottom: 0;
    }
    .matrix .ours-row th,
    .matrix .ours-row td {
        background: var(--surface-2);
        font-weight: 700;
    }
    .matrix-foot {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: 10px clamp(18px, 3vw, 40px);
        margin-top: 16px;
    }
    .legend-note {
        margin: 0;
        flex: 1 1 380px;
        max-width: 74ch;
        font-size: 13.5px;
        line-height: 1.5;
        color: var(--muted);
    }

    /* ---------- the story: one claim per screen, centred ---------- */
    .beat {
        min-height: 86svh;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .beat > .shell {
        width: 100%;
    }
    .invert {
        background: var(--btn-bg);
        color: var(--btn-fg);
    }
    .fg .shell {
        text-align: center;
    }
    .fg-h {
        max-width: 24ch;
        margin: 0 auto;
        font-size: clamp(32px, 4.4vw, 60px);
        font-weight: 800;
        letter-spacing: -0.04em;
        line-height: 1.06;
        text-wrap: balance;
    }
    #english .fg-h {
        max-width: 28ch;
        font-size: clamp(32px, 3.9vw, 54px);
    }
    #english {
        border-top: 1px solid var(--line);
    }
    .meant-h {
        margin: 0 auto;
        text-align: center;
        font-size: clamp(40px, 6.2vw, 88px);
        font-weight: 800;
        letter-spacing: -0.045em;
        line-height: 1.04;
        text-wrap: balance;
    }
    .fg-p {
        margin: clamp(20px, 2.6vh, 30px) auto 0;
        max-width: 44ch;
        color: var(--text-2);
        font-size: clamp(18px, 1.7vw, 21px);
        line-height: 1.5;
        letter-spacing: -0.012em;
        text-wrap: balance;
    }
    .fg-p strong {
        color: var(--text);
        font-weight: 750;
    }
    .fg-p-wide {
        max-width: 52ch;
    }
    .invert .fg-p {
        color: var(--btn-fg);
        opacity: 0.86;
    }
    .forbid-end {
        margin-top: clamp(36px, 5vh, 56px);
        font-weight: 700;
    }
    .invert .forbid-end {
        opacity: 1;
    }
    .verse.fg-verse {
        margin: clamp(34px, 5vh, 60px) auto 0;
        padding: 0;
        border-left: 0;
    }
    .verse.fg-verse blockquote {
        max-width: 34ch;
        margin: 0 auto;
        font-size: clamp(21px, 2.3vw, 29px);
        font-weight: 400;
        line-height: 1.36;
        letter-spacing: -0.02em;
    }
    .verse.fg-verse .ref {
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px;
        row-gap: 6px;
        margin-top: clamp(16px, 2.2vh, 22px);
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.16em;
        text-transform: uppercase;
    }
    .verse.fg-big {
        margin-top: clamp(22px, 3.4vh, 40px);
    }
    .verse.fg-big blockquote {
        max-width: 18ch;
        font-size: clamp(40px, 6.2vw, 88px);
        font-weight: 800;
        letter-spacing: -0.045em;
        line-height: 1.04;
        text-wrap: balance;
    }
    .verse.fg-big .ref {
        margin-top: clamp(28px, 4.4vh, 52px);
    }

    /* the relay: one mark per generation from the first letters to the
       reader, filled in order */
    .relay {
        margin: clamp(44px, 6.5vh, 76px) auto 0;
        max-width: 880px;
    }
    .relay-line {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 14px;
    }
    .relay-line::before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        height: 1px;
        background: var(--line);
    }
    .relay-line i {
        position: relative;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: var(--text);
        opacity: 0.28;
    }
    .relay-line i.you {
        width: 13px;
        height: 13px;
        opacity: 1;
    }
    .relay figcaption {
        display: flex;
        justify-content: space-between;
        margin-top: 14px;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--muted);
    }
    .relay figcaption span:last-child {
        color: var(--text);
    }
    .relay.go .relay-line i {
        animation: fuba-relay-on 0.5s ease forwards;
        animation-delay: calc(var(--n) * 28ms);
    }
    .relay.go .relay-line i.you {
        animation: fuba-relay-you 0.6s ease forwards;
        animation-delay: calc(var(--n) * 28ms);
    }

    /* the five words return, struck through, each with what is forbidden and
       the licence term that forbids it */
    .struck {
        list-style: none;
        margin: clamp(44px, 6vh, 76px) auto 0;
        padding: 0;
        max-width: 700px;
    }
    .struck li + li {
        margin-top: clamp(30px, 4.4vh, 46px);
    }
    .struck strong {
        position: relative;
        display: inline-block;
        font-size: clamp(34px, 3.2vw, 46px);
        font-weight: 800;
        letter-spacing: -0.045em;
        line-height: 1.1;
    }
    .struck strong::after {
        content: '';
        position: absolute;
        left: -4%;
        right: -4%;
        top: 55%;
        height: 0.075em;
        background: currentColor;
        transform-origin: left center;
    }
    .struck.armed strong::after {
        transform: scaleX(0);
        transition: transform 0.45s cubic-bezier(0.6, 0, 0.25, 1);
        transition-delay: calc(var(--n) * 160ms + 120ms);
    }
    .struck.armed.go strong::after {
        transform: scaleX(1);
    }
    .struck .ex {
        margin: 10px auto 0;
        max-width: 40ch;
        font-size: clamp(17px, 1.5vw, 20px);
        line-height: 1.45;
        opacity: 0.86;
    }
    .struck .lic {
        margin: 6px 0 0;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        opacity: 0.62;
    }

    /* the API's translations, grouped by what their licences allow */
    .lic-groups {
        max-width: 880px;
        margin: clamp(40px, 6vh, 64px) auto 0;
        text-align: left;
    }
    .lg + .lg {
        margin-top: clamp(36px, 5vh, 52px);
    }
    .lg-h {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin: 0;
        padding-bottom: 10px;
        border-bottom: 2px solid var(--text);
    }
    .lg-h span {
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.16em;
        text-transform: uppercase;
    }
    .lg-h b {
        font-size: clamp(30px, 3.2vw, 44px);
        font-weight: 800;
        letter-spacing: -0.04em;
        line-height: 1;
    }
    .lr {
        list-style: none;
        margin: 0;
        padding: 0;
    }
    .lr li {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto 56px;
        column-gap: 24px;
        padding: 16px 0 18px;
        border-bottom: 1px solid var(--line);
    }
    .lr-name {
        grid-column: 1;
        font-size: 17px;
        font-weight: 700;
        letter-spacing: -0.01em;
    }
    .lr-why {
        grid-column: 1;
        margin-top: 3px;
        font-size: 15px;
        line-height: 1.45;
        color: var(--text-2);
    }
    .lr-marks {
        grid-column: 2;
        grid-row: 1 / span 2;
        align-self: center;
        display: grid;
        grid-template-columns: repeat(5, 88px);
    }
    .lr-m {
        display: flex;
        justify-content: center;
    }
    .lr-v {
        display: none;
    }
    .lr-n {
        grid-column: 3;
        grid-row: 1 / span 2;
        align-self: center;
        text-align: right;
        font-size: clamp(20px, 2vw, 26px);
        font-weight: 800;
        letter-spacing: -0.03em;
    }
    .lr-bar {
        grid-column: 1 / -1;
        display: block;
        height: 4px;
        margin-top: 12px;
        border-radius: 2px;
        overflow: hidden;
        background: color-mix(in srgb, var(--text) 8%, transparent);
    }
    .lr-bar span {
        display: block;
        height: 100%;
        min-width: 3px;
        background: var(--text);
    }
    .lg-no .lr-bar span {
        background: color-mix(in srgb, var(--text) 42%, transparent);
    }
    .lr-head {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto 56px;
        column-gap: 24px;
        margin: 0 0 10px;
    }
    .lr-cols {
        display: grid;
        grid-template-columns: repeat(5, 88px);
    }
    .lr-cols span {
        text-align: center;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--muted);
    }
    .lr-legend {
        flex-wrap: wrap;
        gap: 8px 22px;
        margin: 20px 0 0;
        font-size: 13px;
        font-weight: 400;
        color: var(--muted);
    }
    .lr-legend span span.m {
        margin-right: 7px;
    }
    /* here "forbidden" is the point, so it carries full ink: a ring with a
       bar through it */
    .lic-groups .m {
        width: 14px;
        height: 14px;
    }
    .lic-groups .m.y {
        background: var(--text);
        border-color: var(--text);
    }
    .lic-groups .m.p {
        border: 1.5px solid var(--text);
        background: linear-gradient(90deg, var(--text) 50%, transparent 50%);
    }
    .lic-groups .m.n {
        position: relative;
        opacity: 1;
        border: 1.5px solid var(--text);
        background: transparent;
    }
    .lic-groups .m.n::after {
        content: '';
        position: absolute;
        left: 50%;
        top: -1px;
        bottom: -1px;
        width: 1.5px;
        margin-left: -0.75px;
        background: var(--text);
        transform: rotate(45deg);
    }

    /* the flywheel */
    .fw-flow {
        list-style: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        margin: clamp(30px, 4.4vh, 48px) 0 0;
        padding: 0;
    }
    .fw-flow li {
        font-size: clamp(18px, 1.8vw, 22px);
        font-weight: 700;
        letter-spacing: -0.015em;
    }
    .fw-flow li + li::before {
        content: '\2193';
        display: block;
        margin: 0 0 8px;
        font-weight: 400;
        opacity: 0.55;
    }

    /* ---------- scroll cue: a quiet down arrow, bottom right ---------- */
    .scroll-cue {
        position: fixed;
        right: clamp(16px, 2.4vw, 32px);
        bottom: clamp(16px, 2.4vw, 32px);
        z-index: 40;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        border: 0;
        background: none;
        color: var(--muted);
        cursor: pointer;
        transition:
            opacity 0.25s ease,
            color 0.2s ease;
    }
    .scroll-cue.on-invert {
        color: color-mix(in srgb, var(--btn-fg) 72%, transparent);
    }
    .scroll-cue.gone {
        opacity: 0;
        pointer-events: none;
    }
    .scroll-cue svg {
        width: 22px;
        height: 22px;
        animation: fuba-cue-sway 4.5s ease-in-out 1.5s infinite;
    }
    @media (hover: hover) {
        .scroll-cue:hover {
            color: var(--text);
        }
        .scroll-cue.on-invert:hover {
            color: var(--btn-fg);
        }
        .scroll-cue:hover svg {
            animation-play-state: paused;
        }
    }

    @media (max-width: 900px) {
        .cards {
            gap: 12px;
        }
        .card {
            padding: 24px 22px;
            min-height: 170px;
        }
        .card h3 {
            margin: 0 0 6px;
            font-size: 21px;
        }
        .proof-grid {
            grid-template-columns: 1fr;
        }
        .proof-grid div + div {
            border-left: 0;
            border-top: 1px solid var(--line);
        }
        .lr-head {
            display: none;
        }
        .lr li {
            grid-template-columns: minmax(0, 1fr) auto;
        }
        .lr-n {
            grid-column: 2;
        }
        .lr-marks {
            grid-column: 1 / -1;
            grid-row: 3;
            grid-template-columns: repeat(5, 1fr);
            margin-top: 14px;
        }
        .lr-m {
            flex-direction: column;
            align-items: center;
            gap: 6px;
        }
        .lr-v {
            display: block;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: -0.005em;
            color: var(--text-2);
        }
    }
    @media (max-width: 720px) {
        .beat {
            min-height: auto;
            padding: clamp(88px, 22vw, 120px) 0;
        }
        .matrix tbody th {
            white-space: normal;
            max-width: 126px;
            padding: 11px 12px;
            font-size: 13px;
        }
        .matrix thead th:first-child {
            padding-left: 12px;
            font-size: 10px;
        }
        .matrix tbody td {
            padding: 11px 6px;
        }
    }
    @media (max-width: 620px) {
        .milestone {
            font-size: 13px;
            padding: 6px 16px;
        }
        .cards {
            grid-template-columns: 1fr;
            gap: 0;
            border-top: 1px solid var(--line);
        }
        .card {
            min-height: 0;
            padding: 20px 0;
            border: 0;
            border-bottom: 1px solid var(--line);
            border-radius: 0;
            background: transparent;
        }
        .card h3 {
            margin: 0 0 5px;
            font-size: 18px;
            letter-spacing: -0.025em;
        }
        .card p {
            font-size: 14px;
            line-height: 1.45;
            max-width: none;
        }
        .card .go {
            padding-top: 11px;
            font-size: 13.5px;
        }
        .matrix-foot {
            gap: 12px;
        }
        .legend-note {
            flex-basis: 100%;
        }
        .matrix {
            min-width: 0;
        }
        .matrix tbody th {
            max-width: 76px;
            padding: 10px 6px;
            font-size: 12px;
        }
        .matrix thead th {
            padding: 10px 2px;
            font-size: 9px;
            letter-spacing: 0.04em;
        }
        .matrix thead th:first-child {
            padding-left: 8px;
        }
        .matrix tbody td {
            padding: 10px 2px;
        }
        .relay-line i {
            width: 3px;
            height: 3px;
        }
        .relay-line i.you {
            width: 11px;
            height: 11px;
        }
        .lr-name {
            font-size: 16px;
        }
        .lr-why {
            font-size: 14px;
        }
    }
    @media (max-width: 360px) {
        .milestone {
            font-size: 12px;
            padding: 6px 12px;
        }
    }
    @media (prefers-reduced-motion: reduce) {
        .struck.armed strong::after {
            transform: none;
            transition: none;
        }
        .relay .relay-line i {
            opacity: 0.8;
            animation: none !important;
        }
        .scroll-cue svg {
            animation: none;
        }
    }
}

[data-theme='dark'] .fuba-home .milestone {
    border-bottom: 1px solid #2a2a2a;
}

@keyframes fuba-party-shift {
    to {
        background-position: -300% 0;
    }
}
@keyframes fuba-relay-on {
    to {
        opacity: 0.8;
    }
}
@keyframes fuba-relay-you {
    0% {
        transform: scale(0.4);
    }
    60% {
        transform: scale(1.25);
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}
@keyframes fuba-cue-sway {
    0%,
    72%,
    100% {
        transform: rotate(0);
    }
    78% {
        transform: rotate(-16deg);
    }
    86% {
        transform: rotate(12deg);
    }
    93% {
        transform: rotate(-5deg);
    }
}
</style>
