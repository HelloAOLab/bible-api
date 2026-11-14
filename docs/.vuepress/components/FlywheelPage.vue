<script setup lang="ts">
import { computed } from 'vue';
import { RouteLink } from 'vuepress/client';
import SiteFooter from './SiteFooter.vue';
import VerseQuote from './VerseQuote.vue';
import {
    useLabels,
    useLocalePage,
    useLocalePath,
} from '../composables/useLocale';
import { useVerses } from '../composables/useVerses';
import type { Labels } from '../labels';

// Why Christians Should Build Open Ecosystems: the long form of the home
// page's flywheel section. The body of Christ, the flywheel drawn as a wheel,
// the restrictions that stop it, the licences that keep it turning, and what
// is left to build.

const DISCORD_URL = 'https://discord.com/invite/NbEZMCJmqC';
const GITHUB_URL = 'https://github.com/HelloAOLab/bible-api';

const labels = useLabels();
const localePath = useLocalePath();
const localePage = useLocalePage();
const verses = useVerses();
const f = computed(() => labels.value.flywheelPage);

type P = Labels['flywheelPage'];

// Around the wheel, clockwise from the top.
const STEPS: (keyof P['steps'])[] = ['start', 'build', 'release', 'next'];
const RESTRICTIONS: (keyof P['restrictions'])[] = [
    'copying',
    'translating',
    'revising',
    'adapting',
    'distributing',
];
const OPEN: (keyof P['open'])[] = ['content', 'software'];
const TODO: (keyof P['todo'])[] = [
    'scripture',
    'data',
    'media',
    'teaching',
    'extensions',
    'tools',
];

const lines = (s: string) => s.split('\n');
</script>

<template>
    <div class="fuba-page fuba-flywheel">
        <main>
            <section class="section beat fg" id="body">
                <div class="shell">
                    <h1 class="kicker">{{ f.kicker }}</h1>
                    <h2 class="fg-h">
                        <template
                            v-for="(line, i) in lines(f.bodyTitle)"
                            :key="i"
                            >{{ i ? ' ' : '' }}<br v-if="i" class="lb" />{{
                                line
                            }}</template
                        >
                    </h2>
                    <VerseQuote class="fg-verse" :verse="verses.wholeBody" />
                </div>
            </section>

            <section class="section fx alt" id="flywheel">
                <div class="shell">
                    <h2 class="fx-h">{{ f.flywheelTitle }}</h2>
                    <p class="fx-lead">{{ f.flywheelLead }}</p>
                    <div class="wheel" role="img" :aria-label="f.wheelLabel">
                        <svg
                            class="wheel-ring"
                            viewBox="0 0 300 300"
                            aria-hidden="true"
                        >
                            <defs>
                                <marker
                                    id="wh-arrow"
                                    viewBox="0 0 10 10"
                                    refX="7"
                                    refY="5"
                                    markerWidth="7"
                                    markerHeight="7"
                                    orient="auto-start-reverse"
                                >
                                    <path
                                        d="M1 1 L8 5 L1 9"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="1.6"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </marker>
                            </defs>
                            <path
                                d="M166 18 A132 132 0 0 1 282 134"
                                marker-end="url(#wh-arrow)"
                            />
                            <path
                                d="M282 166 A132 132 0 0 1 166 282"
                                marker-end="url(#wh-arrow)"
                            />
                            <path
                                d="M134 282 A132 132 0 0 1 18 166"
                                marker-end="url(#wh-arrow)"
                            />
                            <path
                                d="M18 134 A132 132 0 0 1 134 18"
                                marker-end="url(#wh-arrow)"
                            />
                            <g class="wheel-spin">
                                <circle cx="150" cy="18" r="5" />
                            </g>
                        </svg>
                        <p class="wheel-core">
                            <template
                                v-for="(line, i) in lines(f.wheelCore)"
                                :key="i"
                                ><br v-if="i" />{{ line }}</template
                            >
                        </p>
                        <ol class="wheel-steps">
                            <li
                                v-for="(step, i) in STEPS"
                                :key="step"
                                :class="`ws${i + 1}`"
                            >
                                <i>{{ i + 1 }}</i
                                ><b>{{ f.steps[step].title }}</b
                                ><span>{{ f.steps[step].body }}</span>
                            </li>
                        </ol>
                        <p class="wheel-again">
                            <i aria-hidden="true">&#8634;</i>{{ f.again }}
                        </p>
                    </div>
                </div>
            </section>

            <section class="section fx invert" id="restrictions">
                <div class="shell">
                    <h2 class="fx-h">{{ f.restrictTitle }}</h2>
                    <ul class="rows struck-rows">
                        <li v-for="r in RESTRICTIONS" :key="r">
                            <b>{{ f.restrictions[r].title }}</b>
                            <p>{{ f.restrictions[r].body }}</p>
                            <small>{{ f.restrictions[r].licence }}</small>
                        </li>
                    </ul>
                    <p class="fx-lead">{{ f.restrictLead }}</p>
                    <p class="tiny-link">
                        <RouteLink :to="localePath('/') + '#freely'"
                            >{{ f.restrictLink }}
                            <span aria-hidden="true">&rarr;</span></RouteLink
                        >
                    </p>
                </div>
            </section>

            <section class="section fx" id="open">
                <div class="shell">
                    <h2 class="fx-h">{{ f.openTitle }}</h2>
                    <ul class="rows">
                        <li v-for="o in OPEN" :key="o">
                            <b>{{ f.open[o].title }}</b>
                            <p>{{ f.open[o].body }}</p>
                        </li>
                    </ul>
                </div>
            </section>

            <section class="section fx alt" id="many">
                <div class="shell">
                    <h2 class="fx-h">{{ f.manyTitle }}</h2>
                    <p class="fx-lead">{{ f.manyLead }}</p>
                    <div class="todo">
                        <div v-for="c in TODO" :key="c" class="todo-cat">
                            <h3>{{ f.todo[c].title }}</h3>
                            <ul>
                                <li
                                    v-for="(item, i) in lines(f.todo[c].items)"
                                    :key="i"
                                >
                                    {{ item }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section class="section build">
                <div class="shell">
                    <div class="build-card">
                        <div class="build-main">
                            <h3>{{ f.workTitle }}</h3>
                            <a
                                class="btn"
                                :href="DISCORD_URL"
                                target="_blank"
                                rel="noopener noreferrer"
                                >{{ f.workCta }}
                                <span aria-hidden="true">&#8599;</span></a
                            >
                        </div>
                        <div class="build-opts">
                            <RouteLink :to="localePage('/support.html')">
                                <small>{{ f.fundAsk }}</small>
                                <strong
                                    >{{ f.fundLink }}
                                    <span aria-hidden="true"
                                        >&rarr;</span
                                    ></strong
                                >
                                <p>{{ f.fundBody }}</p>
                            </RouteLink>
                            <a
                                :href="GITHUB_URL"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <small>{{ f.codeAsk }}</small>
                                <strong
                                    >{{ f.codeLink }}
                                    <span aria-hidden="true"
                                        >&#8599;</span
                                    ></strong
                                >
                                <p>{{ f.codeBody }}</p>
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
// styles/pages.scss.
.fuba-page.fuba-flywheel {
    p {
        margin: 0;
    }

    /* ---------- one claim per screen, centred, as on the home page ---------- */
    .beat {
        min-height: 86svh;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .beat > .shell {
        width: 100%;
    }
    .fg .shell,
    .fx .shell {
        text-align: center;
    }
    // the page title, set small above the first claim
    .kicker {
        margin: 0 auto clamp(22px, 3vh, 32px);
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--muted);
        line-height: 1.5;
    }
    #body {
        padding-top: clamp(64px, 8vw, 96px);
    }
    .fg-h {
        margin: 0;
        font-size: clamp(32px, 4.4vw, 60px);
        font-weight: 800;
        letter-spacing: -0.04em;
        line-height: 1.06;
        text-wrap: pretty;
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

    /* ---------- one idea per section ---------- */
    .section.alt {
        border-top: 0;
        border-bottom: 0;
    }
    .fx {
        padding: clamp(80px, 10vw, 128px) 0;
    }
    .invert {
        background: var(--btn-bg);
        color: var(--btn-fg);
    }
    .fx-h {
        margin: 0;
        font-size: clamp(30px, 4vw, 48px);
        font-weight: 800;
        letter-spacing: -0.04em;
        line-height: 1.08;
        text-wrap: pretty;
    }
    .fx-lead {
        margin: 18px auto 0;
        max-width: 60ch;
        font-size: clamp(17px, 1.6vw, 20px);
        line-height: 1.5;
        color: var(--text-2);
    }
    .invert .fx-lead {
        color: var(--btn-fg);
        opacity: 0.8;
    }

    /* label-and-line rows: the restrictions and the licences */
    .rows {
        list-style: none;
        max-width: 860px;
        margin: clamp(32px, 4vw, 48px) auto 0;
        padding: 0;
        text-align: left;
        border-top: 1px solid var(--line);
    }
    .rows li {
        display: grid;
        grid-template-columns: 220px 1fr;
        gap: 6px 28px;
        align-items: baseline;
        padding: 20px 0;
        border-bottom: 1px solid var(--line);
    }
    .rows b {
        font-size: 20px;
        letter-spacing: -0.02em;
    }
    .rows p {
        color: var(--text-2);
        font-size: 17px;
        line-height: 1.6;
    }
    .rows + .fx-lead {
        margin-top: clamp(28px, 3.4vw, 40px);
    }
    .struck-rows b {
        text-decoration: line-through;
        text-decoration-thickness: 0.09em;
    }
    .struck-rows li {
        grid-template-columns: 200px 1fr auto;
    }
    .struck-rows small {
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--muted);
        white-space: nowrap;
        text-align: right;
    }
    // the dark screen
    .invert .rows {
        border-top-color: color-mix(in srgb, var(--btn-fg) 24%, transparent);
    }
    .invert .rows li {
        border-bottom-color: color-mix(
            in srgb,
            var(--btn-fg) 24%,
            transparent
        );
    }
    .invert .rows p {
        color: var(--btn-fg);
        opacity: 0.8;
    }
    .invert .struck-rows small {
        color: var(--btn-fg);
        opacity: 0.6;
    }
    .invert .tiny-link a {
        color: var(--btn-fg);
    }

    /* ---------- the flywheel, drawn: four steps around a ring ---------- */
    .wheel {
        position: relative;
        display: grid;
        grid-template-columns: 1fr 300px 1fr;
        grid-template-rows: auto 300px auto;
        gap: 18px 28px;
        max-width: 860px;
        margin: clamp(28px, 4vw, 44px) auto 0;
        align-items: center;
    }
    .wheel-ring {
        grid-column: 2;
        grid-row: 2;
        width: 300px;
        height: 300px;
        overflow: visible;
        color: var(--text);
    }
    .wheel-ring path {
        fill: none;
        stroke: currentColor;
        stroke-width: 1.6;
    }
    .wheel-ring circle {
        fill: currentColor;
    }
    .wheel-spin {
        transform-origin: 150px 150px;
        animation: fuba-wheel-spin 12s linear infinite;
    }
    .wheel-core {
        grid-column: 2;
        grid-row: 2;
        text-align: center;
        font-size: 17px;
        font-weight: 700;
        letter-spacing: -0.02em;
        line-height: 1.35;
        color: var(--text);
    }
    .wheel-steps {
        display: contents;
        list-style: none;
        margin: 0;
        padding: 0;
    }
    .wheel-steps li {
        max-width: 260px;
    }
    .wheel-again {
        display: none;
    }
    .wheel-steps i {
        display: inline-grid;
        place-items: center;
        width: 26px;
        height: 26px;
        margin: 0 0 8px;
        border-radius: 999px;
        background: var(--text);
        color: var(--bg);
        font-style: normal;
        font-size: 13px;
        font-weight: 700;
    }
    .wheel-steps b {
        display: block;
        font-size: 18px;
        letter-spacing: -0.02em;
        line-height: 1.3;
    }
    .wheel-steps span {
        display: block;
        margin-top: 4px;
        font-size: 15px;
        line-height: 1.5;
        color: var(--muted);
    }
    .ws1 {
        grid-column: 2;
        grid-row: 1;
        justify-self: center;
        text-align: center;
    }
    .ws2 {
        grid-column: 3;
        grid-row: 2;
        justify-self: start;
        text-align: left;
    }
    .ws3 {
        grid-column: 2;
        grid-row: 3;
        justify-self: center;
        text-align: center;
    }
    .ws4 {
        grid-column: 1;
        grid-row: 2;
        justify-self: end;
        text-align: right;
    }
    .wheel-steps .ws1,
    .wheel-steps .ws3 {
        max-width: 300px;
    }

    .build-card {
        margin-top: clamp(30px, 4vw, 48px);
    }

    /* ---------- what is left to build: a directory of categories ---------- */
    .todo {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: clamp(28px, 3vw, 40px) 28px;
        max-width: var(--max);
        margin: clamp(36px, 4.4vw, 56px) auto 0;
        text-align: left;
    }
    .todo-cat h3 {
        margin: 0 0 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid var(--line-strong);
        font-size: 17px;
        letter-spacing: -0.02em;
    }
    .todo-cat ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }
    .todo-cat li {
        margin: 0;
        padding: 5px 0;
        font-size: 15px;
        line-height: 1.4;
        color: var(--text-2);
    }

    @media (max-width: 1000px) {
        .todo {
            grid-template-columns: repeat(2, 1fr);
        }
    }
    // narrow screens: the steps stack, and a return line closes the loop
    @media (max-width: 760px) {
        .wheel {
            grid-template-columns: 1fr;
            grid-template-rows: none;
            gap: 0;
            max-width: none;
            padding-left: 34px;
            border-left: 2px solid var(--line-strong);
            margin-left: 13px;
        }
        .wheel-ring,
        .wheel-core {
            display: none;
        }
        .wheel-steps li {
            grid-column: 1 !important;
            grid-row: auto !important;
            justify-self: stretch !important;
            text-align: left !important;
            max-width: none !important;
            position: relative;
            padding: 0 0 26px;
        }
        .wheel-steps i {
            position: absolute;
            left: -48px;
            top: 0;
            margin: 0;
        }
        .wheel-again {
            display: block;
            position: relative;
            padding: 3px 0 0;
            text-align: left;
            font-size: 15px;
            font-weight: 600;
            color: var(--muted);
        }
        .wheel-again i {
            position: absolute;
            left: -48px;
            top: 0;
            display: grid;
            place-items: center;
            width: 26px;
            height: 26px;
            border-radius: 999px;
            border: 1.5px solid var(--text);
            background: var(--surface);
            color: var(--text);
            font-style: normal;
            font-size: 14px;
        }
    }
    @media (max-width: 720px) {
        .beat {
            min-height: auto;
            padding: clamp(88px, 22vw, 120px) 0;
        }
        br.lb {
            display: none;
        }
        .rows li,
        .struck-rows li {
            grid-template-columns: 1fr;
        }
        .struck-rows small {
            text-align: left;
        }
    }
    @media (max-width: 520px) {
        .todo {
            grid-template-columns: 1fr;
        }
    }
    @media (prefers-reduced-motion: reduce) {
        .wheel-spin {
            animation: none;
        }
    }
}

@keyframes fuba-wheel-spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
