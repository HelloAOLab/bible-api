<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { RouteLink, usePageFrontmatter, usePageLang } from 'vuepress/client';
import SiteFooter from './SiteFooter.vue';
import SupportWall from './SupportWall.vue';
import HomeVerse from './HomeVerse.vue';
import { useLabels, useLocale, useLocalePath } from '../composables/useLocale';
import { fillLabel, labelHtml } from '../composables/formatLabel';
import type { Labels } from '../labels';
import {
    HOME_VERSES,
    type HomeVerse as HomeVerseKey,
    type VerseRef,
    type Verses,
    type VerseText,
} from '../verses';

// Every locale's verses, keyed by locale path. Defined in config.ts.
declare const __SITE_VERSES__: Record<string, Verses>;

const DONATE_URL = 'https://better.giving/marketplace/1118469';
const DISCORD_URL = 'https://discord.com/invite/NbEZMCJmqC';
const NEWSLETTER_URL = 'https://helloao.org';
const CASE_PAGE = '/guide/a-biblical-model-for-licensing-the-bible.html';

const localePath = useLocalePath();
const labels = useLabels();
const home = computed(() => labels.value.home);
const frontmatter = usePageFrontmatter();
const lang = usePageLang();
const locale = useLocale();

// The quoted verses come from verses.json files rather than the
// machine-translated labels, falling back to English for a language that has
// none. See verses.ts.
const verses = computed(() => {
    const code = locale.value === '/' ? 'en' : locale.value.slice(1, -1);
    return Object.fromEntries(
        (Object.keys(HOME_VERSES) as HomeVerseKey[]).map((key) => {
            const own = __SITE_VERSES__[locale.value]?.[key];
            const verse = own ?? __SITE_VERSES__['/'][key]!;
            const {
                book,
                chapter,
                verse: number,
                endVerse,
            }: VerseRef = HOME_VERSES[key];
            const reference =
                `${verse.bookName} ${chapter}:${number}` +
                (endVerse ? `–${endVerse}` : '');
            return [
                key,
                {
                    ...verse,
                    html: labelHtml(verse.text),
                    // A verse short enough to stand as a screen's headline.
                    short: verse.text.length <= 80,
                    lang: verse.language ?? (own ? code : 'en'),
                    reference,
                    open: fillLabel(labels.value.home.openVerse, { reference }),
                    url:
                        'https://seedbible.org/?translation=' +
                        encodeURIComponent(verse.translationId) +
                        `&book=${book}&chapter=${chapter}&verse=${number}` +
                        (endVerse ? `-${endVerse}` : ''),
                },
            ];
        })
    ) as Record<
        HomeVerseKey,
        VerseText & {
            html: string;
            short: boolean;
            lang: string;
            reference: string;
            open: string;
            url: string;
        }
    >;
});

// The catalog grows. Fill the printed numbers from the live endpoint rather
// than letting them rot, but only once a session: the file is large.
const translationCount = ref(1256);
const languageCount = ref(1004);

function paintCounts(t: number, l: number) {
    if (t) translationCount.value = t;
    if (l) languageCount.value = l;
}

const formatCount = (n: number) => {
    try {
        return n.toLocaleString(lang.value);
    } catch {
        return n.toLocaleString('en-US');
    }
};
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

/** The five ways Scripture has always been passed on. */
type Use = keyof Labels['home']['uses'];
const USES: Use[] = ['copy', 'translate', 'revise', 'adapt', 'distribute'];

// The licence term that forbids each use, on the "copyright terms forbid" screen.
const FORBIDDEN_BY: Record<Use, 'allRightsReserved' | 'noDerivatives'> = {
    copy: 'allRightsReserved',
    translate: 'noDerivatives',
    revise: 'noDerivatives',
    adapt: 'noDerivatives',
    distribute: 'allRightsReserved',
};

// Modern Bible translations worldwide, estimated by AO Lab in October 2026.
const WORLD_OBEY = 100;
const WORLD_DISOBEY = 5000;

type Mark = 'y' | 'p' | 'n';
type Licence = keyof Labels['home']['licences'];

// The API's translations by licence, from our licence audit (October 2026),
// with what each licence lets you do for each of the five uses.
const LICENCES: { id: Licence; obey: boolean; count: number; marks: Mark[] }[] =
    [
        {
            id: 'publicDomain',
            obey: true,
            count: 102,
            marks: ['y', 'y', 'y', 'y', 'y'],
        },
        {
            id: 'attribution',
            obey: true,
            count: 36,
            marks: ['y', 'y', 'y', 'y', 'y'],
        },
        {
            id: 'shareAlike',
            obey: false,
            count: 283,
            marks: ['y', 'p', 'p', 'p', 'y'],
        },
        {
            id: 'noDerivatives',
            obey: false,
            count: 92,
            marks: ['y', 'n', 'n', 'n', 'y'],
        },
        {
            id: 'nonCommercial',
            obey: false,
            count: 1,
            marks: ['p', 'p', 'p', 'p', 'p'],
        },
        {
            id: 'nonCommercialNoDerivatives',
            obey: false,
            count: 728,
            marks: ['p', 'n', 'n', 'n', 'p'],
        },
        {
            id: 'custom',
            obey: false,
            count: 14,
            marks: ['p', 'p', 'p', 'p', 'p'],
        },
    ];
const LICENCE_TOTAL = LICENCES.reduce((sum, l) => sum + l.count, 0);

const markLabel = computed<Record<Mark, string>>(() => ({
    y: home.value.allowed,
    p: home.value.someCases,
    n: home.value.forbidden,
}));

const licenceGroups = computed(() =>
    [true, false].map((obey) => {
        const rows = LICENCES.filter((l) => l.obey === obey);
        return {
            obey,
            name: obey ? home.value.obeyGroup : home.value.disobeyGroup,
            count: formatCount(rows.reduce((sum, l) => sum + l.count, 0)),
            rows: rows.map((l) => ({
                ...home.value.licences[l.id],
                id: l.id,
                count: formatCount(l.count),
                width: `${((l.count / LICENCE_TOTAL) * 100).toFixed(2)}%`,
                marks: l.marks.map((mark, i) => ({
                    mark,
                    use: home.value.uses[USES[i]],
                    title: `${home.value.uses[USES[i]]}: ${markLabel.value[mark].toLocaleLowerCase(lang.value)}`,
                })),
            })),
        };
    })
);

const FAQ: (keyof Labels['home']['faq'])[] = [
    'problem',
    'attribution',
    'money',
    'nonCommercial',
];
// The verse each FAQ answer opens with, if any.
const FAQ_VERSES: Partial<Record<(typeof FAQ)[number], HomeVerseKey>> = {
    attribution: 'glory',
    money: 'worry',
};
const faqAnswer = (id: (typeof FAQ)[number]) => {
    const entry = home.value.faq[id] as { answer?: string };
    return entry.answer ? labelHtml(entry.answer) : '';
};

// The relay: one mark per generation, from Paul's letters to the reader.
const RELAY_MARKS = 66;

const root = ref<HTMLElement>();
const relay = ref<HTMLElement>();
const struck = ref<HTMLElement>();
const relayOn = ref(false);
// The strike-through animation is only armed once script runs, so without it
// the words are simply struck.
const struckArmed = ref(false);
const struckOn = ref(false);

const cueHidden = ref(false);
const cueOnInvert = ref(false);

function updateCue() {
    const el = root.value;
    if (!el) return;
    cueHidden.value =
        scrollY + innerHeight >= document.documentElement.scrollHeight - 160;
    const cue = el.querySelector('.scroll-cue');
    if (!cue) return;
    const c = cue.getBoundingClientRect();
    const y = c.top + c.height / 2;
    cueOnInvert.value = [...el.querySelectorAll('section.invert')].some((x) => {
        const r = x.getBoundingClientRect();
        return y >= r.top && y <= r.bottom;
    });
}

function scrollToNext() {
    const el = root.value;
    if (!el) return;
    const head =
        (document.querySelector('.vp-navbar') as HTMLElement | null)
            ?.offsetHeight ?? 0;
    const next = [
        ...el.querySelectorAll<HTMLElement>('main > section, footer'),
    ].find(
        (s) => s.getBoundingClientRect().top > head + 8 && s.offsetHeight > 150
    );
    next?.scrollIntoView({
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'auto'
            : 'smooth',
    });
}

const observers: IntersectionObserver[] = [];

/** Runs `go` once `el` has scrolled into view. */
function whenSeen(
    el: HTMLElement | undefined,
    threshold: number,
    go: () => void
) {
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
        go();
        return;
    }
    const io = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting) {
                go();
                io.disconnect();
            }
        },
        { threshold }
    );
    io.observe(el);
    observers.push(io);
}

onMounted(() => {
    fetchCounts();

    whenSeen(relay.value, 0.6, () => (relayOn.value = true));
    if ('IntersectionObserver' in window) {
        struckArmed.value = true;
        whenSeen(struck.value, 0.25, () => (struckOn.value = true));
    }

    addEventListener('scroll', updateCue, { passive: true });
    addEventListener('resize', updateCue);
    updateCue();
});

onBeforeUnmount(() => {
    observers.forEach((io) => io.disconnect());
    removeEventListener('scroll', updateCue);
    removeEventListener('resize', updateCue);
});
</script>

<template>
    <div ref="root" class="fuba-home">
        <main>
            <section class="hero">
                <div class="shell">
                    <h1>{{ frontmatter.title }}</h1>
                    <p class="sub">{{ home.tagline }}</p>
                    <div class="cta">
                        <RouteLink
                            class="btn primary"
                            :to="localePath('/guide/getting-started.html')"
                        >
                            {{ home.quickStart }}
                            <span aria-hidden="true">&rarr;</span>
                        </RouteLink>
                        <RouteLink
                            class="btn secondary"
                            :to="localePath('/compare.html')"
                        >
                            {{ home.compareApis }}
                        </RouteLink>
                    </div>
                    <p class="more">
                        {{ home.more }}
                        <a href="#ecosystem"
                            >{{ home.learnMore }}&nbsp;&darr;</a
                        >
                    </p>
                </div>
            </section>

            <section class="proof">
                <div class="shell proof-grid">
                    <div>
                        <strong>{{
                            fillLabel(home.translationCount, {
                                count: translations,
                            })
                        }}</strong>
                        <span>{{
                            fillLabel(home.languageCount, {
                                count: languages,
                            })
                        }}</span>
                    </div>
                    <div>
                        <strong>{{ home.noApiKey }}</strong>
                        <span>{{ home.noApiKeyDetail }}</span>
                    </div>
                    <div>
                        <strong>{{ home.noUsageLimits }}</strong>
                        <span>{{ home.noUsageLimitsDetail }}</span>
                    </div>
                </div>
            </section>

            <section class="section" id="cause">
                <div class="shell">
                    <div class="cause-top">
                        <h2 class="m-h">{{ home.causeTitle }}</h2>
                        <a class="btn primary cause-cta" :href="DONATE_URL">
                            {{ home.donate }}
                            <span aria-hidden="true">&rarr;</span>
                        </a>
                    </div>
                    <SupportWall />
                </div>
            </section>

            <section class="section alt" id="ecosystem">
                <div class="shell">
                    <div class="head">
                        <h2>{{ home.welcome }}</h2>
                        <p v-html="labelHtml(home.welcomeDetail)"></p>
                    </div>
                    <div class="cards">
                        <RouteLink
                            class="card"
                            :to="localePath('/reference/translations/')"
                        >
                            <h3>{{ home.translationsTitle }}</h3>
                            <p>{{ home.translationsBody }}</p>
                            <span class="go"
                                >{{ home.translationsLink }} &rarr;</span
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
                            <h3>{{ home.audioTitle }}</h3>
                            <p>{{ home.audioBody }}</p>
                            <span class="go">{{ home.audioLink }} &rarr;</span>
                        </RouteLink>
                        <RouteLink
                            class="card"
                            :to="localePath('/reference/datasets/')"
                        >
                            <h3>{{ home.datasetsTitle }}</h3>
                            <p>{{ home.datasetsBody }}</p>
                            <span class="go"
                                >{{ home.datasetsLink }} &rarr;</span
                            >
                        </RouteLink>
                        <div class="card">
                            <h3>{{ home.seedBibleTitle }}</h3>
                            <p>{{ home.seedBibleBody }}</p>
                            <span class="go pending">{{
                                home.seedBibleComing
                            }}</span>
                        </div>
                    </div>
                </div>
            </section>

            <section class="section beat fg" id="freely">
                <div class="shell">
                    <h2 class="fg-h">{{ home.freelyTitle }}</h2>
                    <HomeVerse
                        class="fg-verse"
                        :class="{ 'fg-big': verses.freelyGive.short }"
                        :verse="verses.freelyGive"
                    />
                </div>
            </section>

            <section class="section beat fg alt" id="charge">
                <div class="shell">
                    <h2 class="fg-h">{{ home.chargeTitle }}</h2>
                    <HomeVerse class="fg-verse" :verse="verses.charge" />
                </div>
            </section>

            <section class="section beat fg" id="since">
                <div class="shell">
                    <h2 class="fg-h">{{ home.sinceTitle }}</h2>
                    <p class="fg-p" v-html="labelHtml(home.sinceBody)"></p>
                    <figure
                        ref="relay"
                        class="relay"
                        :class="{ go: relayOn }"
                        role="img"
                        :aria-label="home.relayLabel"
                    >
                        <div class="relay-line">
                            <i
                                v-for="n in RELAY_MARKS"
                                :key="n"
                                :class="{ you: n === 1 || n === RELAY_MARKS }"
                                :style="{ '--n': n - 1 }"
                            ></i>
                        </div>
                        <figcaption>
                            <span>{{ home.relayFrom }}</span>
                            <span>{{ home.relayTo }}</span>
                        </figcaption>
                    </figure>
                </div>
            </section>

            <section class="section beat fg invert" id="forbid">
                <div class="shell">
                    <h2 class="meant-h">{{ home.forbidTitle }}</h2>
                    <p class="fg-p">{{ home.forbidLead }}</p>
                    <ul
                        ref="struck"
                        class="struck"
                        :class="{ armed: struckArmed, go: struckOn }"
                    >
                        <li v-for="(use, i) in USES" :key="use">
                            <strong :style="{ '--n': i }">{{
                                home.forbid[use].name
                            }}</strong>
                            <p class="ex">{{ home.forbid[use].example }}</p>
                            <p class="lic">{{ home[FORBIDDEN_BY[use]] }}</p>
                        </li>
                    </ul>
                </div>
            </section>

            <section class="section beat fg" id="free-use">
                <div class="shell">
                    <h2 class="fg-h">{{ home.freeUseTitle }}</h2>
                    <figure
                        class="obey"
                        role="img"
                        :aria-label="
                            fillLabel(home.obeyLabel, {
                                obey: formatCount(WORLD_OBEY),
                                disobey: formatCount(WORLD_DISOBEY),
                            })
                        "
                    >
                        <p class="ob-title">
                            {{ home.obeyTitle }}<sup>&dagger;</sup>
                        </p>
                        <div class="obey-bar">
                            <span class="ob-yes" style="width: 2%"></span>
                            <span class="ob-no" style="width: 98%"></span>
                        </div>
                        <figcaption>
                            <span class="ob-k"
                                ><b>~{{ formatCount(WORLD_OBEY) }}</b
                                >{{ home.obey }}*</span
                            >
                            <span class="ob-k ob-k-no"
                                ><b>~{{ formatCount(WORLD_DISOBEY) }}</b
                                >{{ home.disobey }}</span
                            >
                        </figcaption>
                    </figure>
                    <p class="tiny-link fg-links">
                        <RouteLink :to="localePath(CASE_PAGE)"
                            >{{ home.readCase }} &rarr;</RouteLink
                        >
                    </p>
                    <p class="fine ob-note">
                        *{{ home.obeyNote }}<br />&dagger;{{ home.obeySource }}
                    </p>
                </div>
            </section>

            <section class="section beat fg" id="english">
                <div class="shell">
                    <h2 class="fg-h">{{ home.englishTitle }}</h2>
                    <p class="fg-p fg-p-wide">{{ home.englishBody }}</p>
                </div>
            </section>

            <section class="section beat fg alt" id="frontier">
                <div class="shell">
                    <h2 class="fg-h">{{ home.frontierTitle }}</h2>
                    <div class="lic-groups">
                        <p class="lr-head" aria-hidden="true">
                            <span></span>
                            <span class="lr-cols">
                                <span v-for="use in USES" :key="use">{{
                                    home.uses[use]
                                }}</span>
                            </span>
                            <span></span>
                        </p>
                        <div
                            v-for="group in licenceGroups"
                            :key="String(group.obey)"
                            class="lg"
                            :class="{ 'lg-no': !group.obey }"
                        >
                            <p class="lg-h">
                                <span>{{ group.name }}</span
                                ><b>{{ group.count }}</b>
                            </p>
                            <ul class="lr">
                                <li v-for="row in group.rows" :key="row.id">
                                    <span class="lr-name">{{ row.name }}</span>
                                    <span class="lr-why">{{ row.why }}</span>
                                    <span class="lr-marks">
                                        <span
                                            v-for="m in row.marks"
                                            :key="m.use"
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
                                    <b class="lr-n">{{ row.count }}</b>
                                    <span class="lr-bar"
                                        ><span
                                            :style="{ width: row.width }"
                                        ></span
                                    ></span>
                                </li>
                            </ul>
                        </div>
                        <p class="lr-legend">
                            <span
                                ><span class="m y"></span
                                >{{ home.allowed }}</span
                            >
                            <span
                                ><span class="m p"></span
                                >{{ home.someCases }}</span
                            >
                            <span
                                ><span class="m n"></span
                                >{{ home.forbidden }}</span
                            >
                        </p>
                    </div>
                </div>
            </section>

            <section class="section beat fg" id="hinder">
                <div class="shell">
                    <HomeVerse
                        class="fg-verse"
                        :class="{ 'fg-solo': verses.hinder.short }"
                        :verse="verses.hinder"
                    />
                </div>
            </section>

            <section class="section alt" id="involve">
                <div class="shell">
                    <h2 class="m-h">
                        {{ home.involveTitle }}<br />{{ home.involveTitle2 }}
                    </h2>
                    <div id="fund">
                        <p class="m-p">{{ home.involveBody }}</p>
                        <div class="cta left">
                            <a class="btn primary" :href="DONATE_URL">
                                {{ home.showSupport }}
                                <span aria-hidden="true">&rarr;</span>
                            </a>
                            <RouteLink
                                class="btn secondary"
                                :to="localePath(CASE_PAGE)"
                            >
                                {{ home.readCaseSupport }}
                                <span aria-hidden="true">&rarr;</span>
                            </RouteLink>
                        </div>
                    </div>
                </div>
            </section>

            <section class="section build">
                <div class="shell">
                    <div class="build-card">
                        <div class="build-main">
                            <h3>{{ home.buildTitle }}</h3>
                            <RouteLink
                                class="btn"
                                :to="localePath('/guide/getting-started.html')"
                            >
                                {{ home.quickStart }}
                                <span aria-hidden="true">&rarr;</span>
                            </RouteLink>
                        </div>
                        <div class="build-opts">
                            <a :href="NEWSLETTER_URL">
                                <small>{{ home.newsletterPrompt }}</small>
                                <strong
                                    >{{ home.newsletterLink }} &rarr;</strong
                                >
                                <p>{{ home.newsletterBody }}</p>
                            </a>
                            <a
                                :href="DISCORD_URL"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <small>{{ home.discordPrompt }}</small>
                                <strong
                                    >{{
                                        home.contributeDiscord
                                    }}
                                    &#8599;</strong
                                >
                                <p>{{ home.discordBody }}</p>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section class="section alt" id="faq">
                <div class="shell">
                    <h2 class="faq-h">{{ home.faqTitle }}</h2>
                    <div class="faq">
                        <details v-for="id in FAQ" :key="id" class="faq-q">
                            <summary>{{ home.faq[id].question }}</summary>
                            <div class="faq-a">
                                <HomeVerse
                                    v-if="FAQ_VERSES[id]"
                                    :verse="verses[FAQ_VERSES[id]!]"
                                />
                                <p
                                    v-if="faqAnswer(id)"
                                    v-html="faqAnswer(id)"
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
            :class="{ 'on-invert': cueOnInvert }"
            :hidden="cueHidden"
            :aria-label="home.scrollCue"
            @click="scrollToNext"
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
.fuba-home {
    // Tokens are defined globally in styles/index.scss so the docs pages and
    // the home page share one black-and-white system that follows the theme.
    --bg: var(--vp-c-bg);
    --surface: var(--vp-c-bg-alt);
    --surface-2: var(--fuba-surface-2);
    --text: var(--vp-c-text);
    --text-2: var(--fuba-text-2);
    --muted: var(--vp-c-text-mute);
    --line: var(--vp-c-divider);
    --line-strong: var(--fuba-line-strong);
    --btn-bg: var(--vp-c-accent-bg);
    --btn-fg: var(--vp-c-accent-text);
    --card-line: var(--fuba-card-line);
    --card-dim: var(--fuba-card-dim);
    --max: 1160px;

    padding-top: var(--navbar-height);
    background: var(--bg);
    color: var(--text);
    font-size: 16px;
    line-height: 1.55;
    font-variant-numeric: lining-nums tabular-nums;

    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }
    a {
        color: inherit;
        text-decoration: none;
    }
    h1,
    h2,
    h3 {
        margin: 0;
        padding: 0;
        border: 0;
        letter-spacing: -0.03em;
        line-height: 1.05;
        font-weight: 700;
    }
    h2 {
        text-wrap: balance;
    }
    :focus-visible {
        outline: 2px solid var(--line-strong);
        outline-offset: 3px;
        border-radius: 3px;
    }
    .shell {
        max-width: var(--max);
        margin: 0 auto;
        padding: 0 28px;
    }
    section[id] {
        scroll-margin-top: var(--navbar-height);
    }

    // swap the black and white logo with the theme
    .dark-only {
        display: none !important;
    }

    /* ---------- buttons ---------- */
    .btn {
        min-height: 48px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 0 20px;
        border: 1px solid var(--line-strong);
        border-radius: 8px;
        font-size: 15px;
        font-weight: 600;
        transition:
            background-color 0.15s ease,
            color 0.15s ease,
            border-color 0.15s ease,
            box-shadow 0.15s ease,
            transform 0.15s ease;
    }
    .btn > span[aria-hidden] {
        display: inline-block;
        transition: transform 0.15s ease;
    }
    .btn.primary {
        background: var(--btn-bg);
        color: var(--btn-fg);
    }
    .btn.secondary {
        background: transparent;
        color: var(--text);
    }
    @media (hover: hover) {
        // every button lifts a pixel, and its arrow leans the way it points
        .btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 18px rgb(0 0 0 / 14%);
        }
        .btn:hover > span[aria-hidden] {
            transform: translateX(3px);
        }
        // outlined buttons take a light tint and stay outlined
        .btn:not(.primary):hover {
            background: color-mix(in srgb, var(--text) 6%, transparent);
            border-color: var(--text);
            color: var(--text);
        }
        // solid buttons step one shade lighter and stay solid
        .btn.primary:hover {
            background: var(--text-2);
            border-color: var(--text-2);
            color: var(--btn-fg);
        }
    }
    .btn:active {
        transform: translateY(0);
        box-shadow: none;
    }
    .cta {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 12px;
        margin-top: 28px;
    }
    .cta.left {
        justify-content: flex-start;
    }

    /* ---------- hero ---------- */
    .hero {
        padding: clamp(48px, 6.5vw, 84px) 0 clamp(72px, 11vw, 160px);
        text-align: center;
    }
    .hero h1 {
        font-size: clamp(40px, 6vw, 68px);
        letter-spacing: -0.045em;
    }
    .hero .sub {
        margin: 16px auto 0;
        color: var(--muted);
        font-size: clamp(17px, 1.9vw, 21px);
        letter-spacing: -0.015em;
        text-wrap: balance;
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
            min-height: calc(100svh - var(--navbar-height) - 105px - 15svh);
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

    /* ---------- verses ---------- */
    .verse {
        display: block;
        max-width: none;
        margin: 34px 0 4px;
        padding: 0 0 0 20px;
        border-left: 2px solid var(--line-strong);
    }
    .verse blockquote {
        margin: 0;
        padding: 0;
        border: 0;
        max-width: 1040px;
        font-size: clamp(18px, 1.85vw, 22px);
        line-height: 1.4;
        letter-spacing: -0.02em;
        color: var(--text);
        text-wrap: pretty;
    }
    .verse .ref {
        display: inline-flex;
        align-items: center;
        gap: 9px;
        margin-top: 14px;
        font-size: 14px;
        font-weight: 600;
        color: var(--muted);
    }
    // the Seed Bible mark is wide, so it is sized by height
    .verse .ref img.seed {
        display: block;
        width: auto;
        height: 12px;
    }
    .verse:hover .ref {
        color: var(--text);
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

    /* ---------- sections ---------- */
    .section {
        padding: clamp(64px, 8vw, 100px) 0;
    }
    .section.alt {
        background: var(--surface);
        border-top: 1px solid var(--line);
        border-bottom: 1px solid var(--line);
    }
    .invert {
        background: var(--btn-bg);
        color: var(--btn-fg);
    }
    .head {
        max-width: 1040px;
        margin-bottom: 36px;
    }
    .head h2 {
        font-size: clamp(30px, 4vw, 48px);
        letter-spacing: -0.04em;
    }
    .head p {
        margin: 12px 0 0;
        color: var(--muted);
        font-size: 18px;
    }
    .head p strong {
        color: var(--text);
        font-weight: 700;
    }
    .m-h {
        margin: 0;
        font-size: clamp(30px, 4vw, 48px);
        letter-spacing: -0.04em;
    }
    .m-p {
        margin: 18px 0 0;
        color: var(--text-2);
        font-size: 18px;
        line-height: 1.55;
        max-width: 68ch;
    }
    .tiny-link {
        margin: 14px 0 0;
        font-size: 15px;
    }
    .tiny-link a {
        font-weight: 600;
        color: var(--text);
        text-decoration: underline;
        text-underline-offset: 3px;
    }
    .fine {
        margin: 30px 0 0;
        font-size: 13.5px;
        color: var(--muted);
        max-width: 80ch;
    }
    .vh {
        position: absolute;
        width: 1px;
        height: 1px;
        margin: -1px;
        padding: 0;
        overflow: hidden;
        clip: rect(0 0 0 0);
        white-space: nowrap;
        border: 0;
    }

    /* ---------- the support wall ---------- */
    .cause-top {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-end;
        justify-content: space-between;
        gap: 14px 40px;
    }
    .cause-top .m-h {
        flex: 0 1 auto;
    }
    .cause-cta {
        flex: none;
        margin-bottom: 0.3em;
    }

    /* ---------- cards ---------- */
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
        transition: border-color 0.15s ease;
    }
    @media (hover: hover) {
        a.card:hover {
            border-color: var(--line-strong);
        }
        a.card:hover .go {
            text-decoration: underline;
            text-underline-offset: 4px;
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

    /* ---------- beats: one statement owns the screen ---------- */
    .beat {
        min-height: 86svh;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .beat > .shell {
        width: 100%;
    }
    .fg .shell {
        text-align: center;
    }
    .fg-h {
        margin: 0;
        font-size: clamp(32px, 4.4vw, 60px);
        font-weight: 800;
        letter-spacing: -0.04em;
        line-height: 1.06;
    }
    #english .fg-h {
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
    }
    .fg-p {
        margin: clamp(20px, 2.6vh, 30px) auto 0;
        max-width: 44ch;
        color: var(--text-2);
        font-size: clamp(18px, 1.7vw, 21px);
        line-height: 1.5;
        letter-spacing: -0.012em;
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
    .fg-verse {
        margin: clamp(34px, 5vh, 60px) auto 0;
        padding: 0;
        border-left: 0;
    }
    .fg-verse blockquote {
        max-width: 34ch;
        margin: 0 auto;
        font-size: clamp(21px, 2.3vw, 29px);
        font-weight: 400;
        line-height: 1.36;
        letter-spacing: -0.02em;
    }
    .fg-verse blockquote strong {
        font-weight: 750;
    }
    .fg-verse .ref {
        justify-content: center;
        flex-wrap: wrap;
        gap: 8px;
        row-gap: 6px;
        margin-top: clamp(16px, 2.2vh, 22px);
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.16em;
        text-transform: uppercase;
    }
    // the page's few key statements keep the massive size
    .fg-big {
        margin-top: clamp(22px, 3.4vh, 40px);
    }
    .fg-big blockquote {
        max-width: none;
        font-size: clamp(40px, 6.2vw, 88px);
        font-weight: 800;
        letter-spacing: -0.045em;
        line-height: 1.04;
        text-wrap: balance;
    }
    .fg-big .ref {
        margin-top: clamp(28px, 4.4vh, 52px);
    }
    // a verse that is the screen's whole statement takes the heading's type
    #hinder .fg-verse {
        margin-top: 0;
    }
    .fg-solo blockquote {
        max-width: none;
        font-size: clamp(32px, 4.4vw, 60px);
        font-weight: 800;
        letter-spacing: -0.04em;
        line-height: 1.06;
        text-wrap: balance;
    }
    .fg-solo .ref {
        margin-top: clamp(20px, 3vh, 32px);
    }
    .fg-links {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 12px 28px;
        margin-top: clamp(36px, 5vh, 52px);
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

    /* the five words return, struck through: what is forbidden, and the
       licence term that forbids it */
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

    /* obedience: translations worldwide, by whether they allow all five */
    .obey {
        margin: clamp(40px, 6vh, 68px) auto 0;
        max-width: 880px;
    }
    .ob-title {
        margin: 0 0 12px;
        text-align: left;
        font-size: 15px;
        font-weight: 700;
        letter-spacing: -0.01em;
    }
    .ob-title sup {
        font-size: 0.75em;
        margin-left: 1px;
    }
    .obey-bar {
        display: flex;
        height: 14px;
        border-radius: 2px;
        overflow: hidden;
        gap: 3px;
    }
    .ob-yes {
        background: var(--text);
    }
    .ob-no {
        background: repeating-linear-gradient(
            135deg,
            color-mix(in srgb, var(--text) 30%, var(--bg)) 0 2px,
            transparent 2px 6px
        );
        box-shadow: inset 0 0 0 1px
            color-mix(in srgb, var(--text) 22%, var(--bg));
    }
    .obey figcaption {
        display: flex;
        justify-content: space-between;
        gap: 20px;
        margin-top: 16px;
        text-align: left;
    }
    .ob-k {
        display: flex;
        flex-direction: column;
        font-size: 15px;
        font-weight: 600;
        color: var(--text-2);
    }
    .ob-k b {
        margin-bottom: 6px;
        font-size: clamp(34px, 3.6vw, 52px);
        font-weight: 800;
        letter-spacing: -0.04em;
        line-height: 1;
        color: var(--text);
    }
    .ob-k-no {
        text-align: right;
        align-items: flex-end;
    }
    .ob-note {
        margin: clamp(40px, 6vh, 64px) auto 0;
        text-align: center;
        font-size: 12.5px;
        line-height: 1.7;
    }

    /* the API's own translations, by licence: obey above, disobey below */
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
        display: flex;
        flex-wrap: wrap;
        gap: 8px 22px;
        margin: 20px 0 0;
        font-size: 13px;
        color: var(--muted);
    }
    .lr-legend span span.m {
        margin-right: 7px;
        vertical-align: -1px;
    }
    // here "forbidden" is the point, so it carries full ink: a ring with a
    // bar through it
    .m {
        position: relative;
        display: inline-block;
        width: 14px;
        height: 14px;
        border-radius: 999px;
        border: 1.5px solid var(--text);
        cursor: help;
    }
    .lr-legend .m {
        cursor: default;
    }
    .m.y {
        background: var(--text);
    }
    .m.p {
        background: linear-gradient(90deg, var(--text) 50%, transparent 50%);
    }
    .m.n::after {
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

    /* ---------- get involved ---------- */
    #involve {
        padding-bottom: clamp(24px, 3vw, 40px);
    }
    #fund {
        padding-bottom: clamp(24px, 3vw, 40px);
    }

    /* ---------- start building ---------- */
    .build-card {
        border-radius: 20px;
        overflow: hidden;
        background: var(--text);
        color: var(--bg);
    }
    .build-main {
        padding: clamp(34px, 4.2vw, 60px) clamp(24px, 3.4vw, 56px)
            clamp(32px, 3.6vw, 52px);
        text-align: left;
    }
    .build-main h3 {
        margin: 0;
        font-size: clamp(30px, 4.2vw, 56px);
        letter-spacing: -0.045em;
        line-height: 1;
    }
    .build-main .btn {
        margin-top: clamp(22px, 2.6vw, 32px);
        background: var(--bg);
        color: var(--text);
        border-color: var(--bg);
        white-space: nowrap;
    }
    @media (hover: hover) {
        // the light button on the inverted panel greys a step and stays solid
        .build-main .btn:hover {
            background: color-mix(in srgb, var(--bg) 84%, var(--text));
            border-color: color-mix(in srgb, var(--bg) 84%, var(--text));
            color: var(--text);
        }
    }
    .build-opts {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        border-top: 1px solid var(--card-line);
    }
    .build-opts a {
        padding: 26px clamp(24px, 3.4vw, 32px) 28px;
        text-align: left;
        min-width: 0;
    }
    .build-opts a + a {
        border-left: 1px solid var(--card-line);
    }
    .build-opts a:hover {
        background: var(--card-line);
    }
    .build-opts small {
        display: block;
        margin-bottom: 7px;
        font-size: 13px;
        font-weight: 600;
        color: var(--card-dim);
    }
    .build-opts strong {
        display: block;
        font-size: 18px;
        letter-spacing: -0.02em;
    }
    .build-opts p {
        margin: 7px 0 0;
        font-size: 15px;
        line-height: 1.45;
        color: var(--card-dim);
    }

    /* ---------- FAQ: one column, each question opens in place ---------- */
    .faq-h {
        margin: 0;
        font-size: clamp(30px, 4vw, 48px);
        letter-spacing: -0.04em;
    }
    .faq {
        margin: clamp(24px, 3vw, 36px) 0 0;
        border-top: 1px solid var(--line);
    }
    .faq-q {
        border-bottom: 1px solid var(--line);
    }
    .faq-q summary {
        list-style: none;
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 24px;
        padding: 22px 0;
        cursor: pointer;
        font-size: clamp(18px, 1.7vw, 21px);
        font-weight: 700;
        letter-spacing: -0.015em;
    }
    .faq-q summary::-webkit-details-marker {
        display: none;
    }
    .faq-q summary::after {
        content: '+';
        flex: none;
        font-size: 24px;
        font-weight: 400;
        line-height: 1;
        color: var(--muted);
    }
    .faq-q[open] summary::after {
        content: '\2212';
    }
    @media (hover: hover) {
        .faq-q summary:hover::after {
            color: var(--text);
        }
    }
    .faq-a {
        padding: 0 0 26px;
    }
    .faq-a p {
        margin: 0;
        color: var(--text-2);
        font-size: 17px;
        line-height: 1.6;
    }
    .faq-a .verse {
        margin: 4px 0 18px;
    }
    .faq-a .verse blockquote {
        font-size: clamp(17px, 1.6vw, 19px);
    }
    .faq-a strong,
    .faq-a em {
        color: var(--text);
    }
    .faq-a em {
        font-style: normal;
        text-decoration: underline;
        text-underline-offset: 3px;
        text-decoration-thickness: 1.5px;
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
    .scroll-cue svg {
        width: 22px;
        height: 22px;
        // a small sway every few seconds: enough motion to catch the eye
        animation: fuba-cue-sway 4.5s ease-in-out 1.5s infinite;
    }
    .scroll-cue[hidden] {
        display: flex;
        opacity: 0;
        pointer-events: none;
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
    }
    @media (max-width: 820px) {
        .build-opts {
            grid-template-columns: 1fr;
        }
        .build-opts a + a {
            border-left: 0;
            border-top: 1px solid var(--card-line);
        }
    }
    @media (max-width: 760px) {
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
    }
    @media (max-width: 620px) {
        .shell {
            padding: 0 16px;
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
        .section {
            padding: clamp(40px, 9vw, 56px) 0;
        }
        .head {
            margin-bottom: 22px;
        }
        .head h2 {
            font-size: 29px;
        }
        .head p,
        .m-p {
            font-size: 16.5px;
        }
        .lr-name {
            font-size: 16px;
        }
        .lr-why {
            font-size: 14px;
        }
        .relay-line i {
            width: 3px;
            height: 3px;
        }
        .relay-line i.you {
            width: 11px;
            height: 11px;
        }
    }
    @media (prefers-reduced-motion: reduce) {
        * {
            transition: none !important;
        }
        .relay .relay-line i {
            opacity: 0.8;
            animation: none !important;
        }
        .struck.armed strong::after {
            transform: none;
        }
        .scroll-cue svg {
            animation: none;
        }
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

// The scroll cue takes the corner the back-to-top button would use.
html:has(.fuba-home) .vp-back-to-top-button {
    display: none;
}

[data-theme='dark'] .fuba-home {
    .light-only {
        display: none !important;
    }
    .dark-only {
        display: block !important;
    }
}
</style>
