<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { RouteLink, usePageLang } from 'vuepress/client';
import SiteFooter from './SiteFooter.vue';
import VerseQuote from './VerseQuote.vue';
import { fillLabel, labelHtml } from '../composables/formatLabel';
import { useCounts } from '../composables/useCounts';
import {
    useLabels,
    useLocalePage,
    useLocalePath,
} from '../composables/useLocale';
import { useVerses } from '../composables/useVerses';
import type { Labels } from '../labels';

// The open ecosystem page: where the "Let's build an open ecosystem" banner
// lands. It is linked from campaigns, not the navbar. It borrows the home
// page's sections in the order a newcomer needs them: the problem, the
// answer, what is in the API, then the Free Use Fund and the ways to start
// building at the end, so nothing sends a visitor away mid-page.

const DISCORD_URL = 'https://discord.com/invite/NbEZMCJmqC';

const labels = useLabels();
const localePath = useLocalePath();
const localePage = useLocalePage();
const lang = usePageLang();
const verses = useVerses();
const o = computed(() => labels.value.openEcosystem);
const { translationCount, languageCount } = useCounts();

const fmt = (n: number) => {
    try {
        return new Intl.NumberFormat(lang.value).format(n);
    } catch {
        return n.toLocaleString('en-US');
    }
};

// The titles carry a "\n" where they break on wide screens. Below 720px the
// break is hidden and the title wraps freely.
const lines = (label: string, html: Record<string, string> = {}) =>
    label
        .split('\n')
        .map((line) => labelHtml(line, html))
        // the space keeps the words apart where the break is hidden
        .join('<br class="lb" /> ');

const titleLines = computed(() => o.value.title.split('\n'));
const forbidTitle = computed(() =>
    lines(o.value.forbidTitle, {
        used: `<em>${labelHtml(o.value.forbidUsed)}</em>`,
    })
);
const flywheelTitle = computed(() => lines(o.value.flywheelTitle));
const apiSub = computed(() => labelHtml(o.value.apiSub));

/* ---------- the forbidden ways, and the flywheel ---------- */

const FORBIDDEN: (keyof Labels['home']['forbidden'])[] = [
    'copying',
    'translating',
    'revising',
    'adapting',
    'distributing',
];
const FLYWHEEL: (keyof Labels['home']['flywheel'])[] = [
    'start',
    'build',
    'release',
    'next',
];
const CARDS: (keyof Labels['openEcosystem']['cards'])[] = [
    'translations',
    'audio',
    'datasets',
    'seedBible',
];

/* ---------- the struck words: struck through once they scroll in ---------- */

const struck = ref<HTMLElement>();
const struckArmed = ref(false);
const struckOn = ref(false);
let io: IntersectionObserver | undefined;

onMounted(() => {
    if (!struck.value || !('IntersectionObserver' in window)) return;
    struckArmed.value = true;
    io = new IntersectionObserver(
        (entries) => {
            if (entries[0]?.isIntersecting) {
                struckOn.value = true;
                io?.disconnect();
            }
        },
        { threshold: 0.25 }
    );
    io.observe(struck.value);
});
onBeforeUnmount(() => io?.disconnect());
</script>

<template>
    <div class="fuba-page fuba-open">
        <main>
            <section class="hero">
                <div class="shell">
                    <h1>
                        <span v-for="(line, i) in titleLines" :key="i">{{
                            line
                        }}</span>
                    </h1>
                    <p class="sub">{{ o.sub }}</p>
                    <div class="cta">
                        <a class="btn primary" href="#join"
                            >{{ o.join }}
                            <span aria-hidden="true">&darr;</span></a
                        >
                    </div>
                </div>
            </section>

            <section class="section fg alt" id="forbid">
                <div class="shell">
                    <h2 class="meant-h" v-html="forbidTitle"></h2>
                    <p class="fg-p">{{ o.forbidLead }}</p>
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
                    <p class="fg-p forbid-end">{{ o.forbidEnd }}</p>
                </div>
            </section>

            <section class="section beat fg invert" id="flywheel">
                <div class="shell">
                    <h2 class="fg-h" v-html="flywheelTitle"></h2>
                    <ol class="fw-flow" :aria-label="labels.home.flywheelLabel">
                        <li v-for="step in FLYWHEEL" :key="step">
                            {{ labels.home.flywheel[step] }}
                        </li>
                    </ol>
                    <p class="fw-more">
                        <RouteLink
                            :to="localePage('/open-ecosystem-flywheel.html')"
                            >{{ labels.home.flywheelLink }}
                            <span aria-hidden="true">&rarr;</span></RouteLink
                        >
                    </p>
                </div>
            </section>

            <section class="api-start" id="api" aria-labelledby="api-title">
                <div class="shell">
                    <h2 id="api-title">{{ o.apiTitle }}</h2>
                    <p class="api-sub" v-html="apiSub"></p>
                </div>
            </section>
            <section class="proof">
                <div class="shell proof-grid">
                    <div>
                        <strong>{{
                            fillLabel(labels.home.translationCount, {
                                count: fmt(translationCount),
                            })
                        }}</strong>
                        <span>{{
                            fillLabel(labels.home.languageCount, {
                                count: fmt(languageCount),
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

            <section class="api-cards" :aria-label="o.cardsLabel">
                <div class="shell">
                    <div class="cards">
                        <div v-for="card in CARDS" :key="card" class="card">
                            <h3>{{ o.cards[card].title }}</h3>
                            <p>{{ o.cards[card].body }}</p>
                            <span
                                v-if="card === 'seedBible'"
                                class="go pending"
                                >{{ o.seedBibleComing }}</span
                            >
                        </div>
                    </div>
                </div>
            </section>

            <section class="fund-intro" id="fund" aria-labelledby="fund-title">
                <div class="shell">
                    <div class="narrow">
                        <h2 id="fund-title">{{ o.fundTitle }}</h2>
                        <p>{{ o.fundBody1 }}</p>
                        <p>{{ o.fundBody2 }}</p>
                        <p>{{ o.fundBody3 }}</p>
                        <div class="cta">
                            <RouteLink
                                class="btn primary"
                                :to="localePage('/free-use-fund.html')"
                                >{{ o.fundLink }}
                                <span aria-hidden="true">&rarr;</span></RouteLink
                            >
                        </div>
                        <VerseQuote :verse="verses.wholeBody" />
                    </div>
                </div>
            </section>

            <section class="section build" id="join" :aria-label="o.buildLabel">
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
                                    >{{ labels.home.newsletterLink }}
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
                                    >{{ labels.home.contributeDiscord }}
                                    &#8599;</strong
                                >
                                <p>{{ labels.home.discordBody }}</p>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <SiteFooter />
    </div>
</template>

<style lang="scss">
// The shared pieces (tokens, buttons, verses, the build card) are in
// styles/pages.scss. The sections borrowed from the home page (the struck
// words, the flywheel, the proof row, the cards) are copied from
// HomePage.vue, whose styles are scoped to .fuba-home.
.fuba-page.fuba-open {
    p {
        margin: 0;
    }

    /* ---------- hero ---------- */
    .hero {
        padding-bottom: clamp(72px, 11vw, 160px);
    }
    .hero .sub {
        max-width: 640px;
    }
    // one line per span on wide screens; on narrow ones the title wraps
    // freely
    .hero h1 span + span::before {
        content: ' ';
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
    }
    @media (min-width: 760px) {
        .hero h1 span {
            display: block;
        }
        .hero h1 span + span::before {
            content: none;
        }
    }
    @media (max-width: 720px) {
        br.lb {
            display: none;
        }
    }

    /* ---------- the story sections, as on the home page ---------- */
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
    .meant-h {
        margin: 0 auto;
        text-align: center;
        font-size: clamp(40px, 6.2vw, 88px);
        font-weight: 800;
        letter-spacing: -0.045em;
        line-height: 1.04;
        text-wrap: balance;
    }
    .meant-h em {
        font-style: italic;
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
    .forbid-end {
        margin-top: clamp(28px, 3.4vw, 40px);
        font-weight: 700;
    }

    /* ---------- the problem, as compact rows: what is forbidden, what that
       stops, and the licence ---------- */
    #forbid {
        padding: clamp(72px, 9vw, 112px) 0;
    }
    .struck {
        list-style: none;
        max-width: 820px;
        margin: clamp(32px, 4vw, 44px) auto 0;
        padding: 0;
        border-top: 1px solid var(--line);
        text-align: left;
    }
    .struck li {
        display: grid;
        grid-template-columns: 200px 1fr auto;
        align-items: baseline;
        gap: 8px 24px;
        padding: 18px 0;
        border-bottom: 1px solid var(--line);
    }
    .struck strong {
        position: relative;
        display: inline-block;
        justify-self: start;
        font-size: clamp(22px, 2.2vw, 28px);
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
        margin: 0;
        font-size: 17px;
        line-height: 1.45;
        opacity: 0.86;
    }
    .struck .lic {
        margin: 0;
        white-space: nowrap;
        text-align: right;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        opacity: 0.62;
    }
    @media (max-width: 720px) {
        .struck li {
            grid-template-columns: 1fr;
            gap: 4px;
        }
        .struck .lic {
            text-align: left;
        }
    }

    .fw-more {
        margin: clamp(30px, 4.4vh, 44px) 0 0;
        font-size: 15px;
        font-weight: 600;
    }
    .fw-more a {
        color: inherit;
        text-decoration: underline;
        text-underline-offset: 4px;
    }
    /* ---------- the flywheel ---------- */
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

    /* ---------- the API: heading, proof row, cards ---------- */
    .api-start {
        padding: clamp(64px, 8vw, 96px) 0 0;
        text-align: center;
    }
    .api-start h2 {
        font-size: clamp(30px, 4vw, 44px);
        letter-spacing: -0.04em;
    }
    .api-sub {
        margin: 12px 0 0;
        color: var(--muted);
        font-size: 18px;
    }
    .api-sub strong {
        color: var(--text);
    }
    .proof {
        margin-top: clamp(28px, 3.5vw, 40px);
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
    .api-cards {
        padding: clamp(32px, 4vw, 48px) 0 0;
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
        padding-top: 18px;
        font-weight: 600;
        font-size: 15px;
    }
    .card .go.pending {
        color: var(--muted);
    }
    // the cards sit under a centred heading and proof row, and carry no
    // links here, so centre their text and let them hug it
    @media (min-width: 621px) {
        .card {
            min-height: 0;
            text-align: center;
            align-items: center;
            padding: 32px 28px;
        }
        .card p {
            margin: 0 auto;
        }
    }

    /* ---------- the Free Use Fund ---------- */
    .fund-intro {
        margin-top: clamp(64px, 8vw, 96px);
        padding: clamp(64px, 8vw, 96px) 0;
        background: var(--surface);
        border-top: 1px solid var(--line);
        border-bottom: 1px solid var(--line);
        text-align: center;
    }
    #fund {
        padding-bottom: clamp(24px, 3vw, 40px);
    }
    .build-card {
        margin-top: clamp(30px, 4vw, 48px);
    }
    .fund-intro .narrow {
        max-width: 760px;
        margin: 0 auto;
    }
    .fund-intro h2 {
        font-size: clamp(30px, 4vw, 44px);
        letter-spacing: -0.04em;
    }
    .fund-intro p {
        margin: 16px 0 0;
        font-size: 18px;
        line-height: 1.65;
        color: var(--text-2);
    }
    .fund-intro .cta {
        justify-content: center;
        margin-top: 28px;
    }
    .fund-intro .verse {
        margin: 40px 0 0;
        padding: 30px 0 0;
        border-left: 0;
        border-top: 1px solid var(--line);
    }
    .fund-intro .verse blockquote {
        max-width: none;
        margin: 0 auto;
    }
    .fund-intro .verse .ref {
        justify-content: center;
    }

    @media (max-width: 900px) {
        .cards {
            gap: 12px;
        }
        .card {
            padding: 24px 22px;
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
    @media (max-width: 720px) {
        .beat {
            min-height: auto;
            padding: clamp(88px, 22vw, 120px) 0;
        }
    }
    @media (max-width: 620px) {
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
        .fund-intro p {
            font-size: 16.5px;
        }
    }
    @media (prefers-reduced-motion: reduce) {
        .struck.armed strong::after {
            transform: none;
            transition: none;
        }
    }
}
</style>
