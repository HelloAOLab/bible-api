<script setup lang="ts">
import { computed } from 'vue';
import { usePageLang } from 'vuepress/client';
import SiteFooter from './SiteFooter.vue';
import VerseQuote from './VerseQuote.vue';
import { fillLabel, labelHtml } from '../composables/formatLabel';
import { useLabels, useLocalePath } from '../composables/useLocale';
import { useVerses } from '../composables/useVerses';
import type { Labels } from '../labels';
import { WALL_DATA } from '../wallData';

const PROPOSAL_FORM = 'https://forms.gle/sVqU2KsaNxdFqNZJ7';
const HELLO_EMAIL = 'hello@helloao.org';

const labels = useLabels();
const localePath = useLocalePath();
const lang = usePageLang();
const verses = useVerses();
const f = computed(() => labels.value.fund);

const mailto = (subject: string) =>
    `mailto:${HELLO_EMAIL}?subject=${encodeURIComponent(subject)}`;
const link = (href: string, text: string) =>
    `<a class="inref" href="${href}">${labelHtml(text)}</a>`;

function money(n: number) {
    try {
        return new Intl.NumberFormat(lang.value, {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(n);
    } catch {
        return '$' + n.toLocaleString('en-US');
    }
}

// The home page's support wall shows how close the year is to its goal.
const status = computed(() =>
    labelHtml(f.value.statusBody, {
        goal: money(WALL_DATA.goal),
        here: link(localePath('/') + '#cause', f.value.statusHere),
    })
);
const invite = computed(() =>
    labelHtml(f.value.statusInvite, {
        proposals: `<strong>${link('#propose', f.value.statusProposals)}</strong>`,
        feedback: link(mailto(f.value.feedbackSubject), f.value.statusFeedback),
    })
);

const STEPS: (keyof Labels['fund']['steps'])[] = ['build', 'licences', 'why'];
const FAQ: (keyof Labels['fund']['faq'])[] = [
    'who',
    'early',
    'decides',
    'money',
    'licences',
    'translation',
    'progress',
    'public',
];
const answer = (id: keyof Labels['fund']['faq']) =>
    labelHtml(f.value.faq[id].a, {
        contact: link(mailto(f.value.questionSubject), f.value.contactUs),
    });
</script>

<template>
    <div class="fuba-page fuba-fund">
        <main>
            <section class="hero">
                <div class="shell">
                    <p class="eyebrow hero-intro">{{ f.eyebrow }}</p>
                    <h1>{{ f.title }}</h1>
                    <p class="sub">{{ f.sub }}</p>
                    <div class="cta">
                        <a class="btn primary" href="#propose"
                            >{{ f.propose }}
                            <span aria-hidden="true">&darr;</span></a
                        >
                    </div>
                </div>
            </section>

            <section class="fund-band" id="how-it-works">
                <div class="shell">
                    <div class="narrow">
                        <div class="section-head">
                            <h2>{{ f.whatTitle }}</h2>
                        </div>
                        <div class="body-case">
                            <p>{{ f.whatBody1 }}</p>
                            <p>{{ f.whatBody2 }}</p>
                        </div>
                        <VerseQuote :verse="verses.wholeBody" />
                    </div>
                </div>
            </section>

            <section class="current-status">
                <div class="shell">
                    <div class="narrow">
                        <h2>{{ f.statusTitle }}</h2>
                        <p v-html="status"></p>
                        <p v-html="invite"></p>
                    </div>
                </div>
            </section>

            <section class="proposal-section" id="propose">
                <div class="shell">
                    <div class="narrow">
                        <p class="eyebrow">{{ f.callEyebrow }}</p>
                        <h2>{{ f.callTitle }}</h2>
                        <p class="proposal-intro">{{ f.callIntro }}</p>
                        <ol class="proposal-list">
                            <li v-for="step in STEPS" :key="step">
                                <strong>{{ f.steps[step].title }}</strong>
                                <span>{{ f.steps[step].body }}</span>
                            </li>
                        </ol>
                        <div class="cta">
                            <a
                                class="btn on-ink"
                                :href="PROPOSAL_FORM"
                                target="_blank"
                                rel="noopener noreferrer"
                                >{{ f.submit }}
                                <span aria-hidden="true">&#8599;</span></a
                            >
                        </div>
                    </div>
                </div>
            </section>

            <section class="reporting">
                <div class="shell">
                    <div class="narrow">
                        <div class="section-head">
                            <p class="eyebrow">{{ f.reportingEyebrow }}</p>
                            <h2>{{ f.reportingTitle }}</h2>
                        </div>
                        <p class="reporting-summary">{{ f.reportingBody }}</p>
                    </div>
                </div>
            </section>

            <section class="fund-faq">
                <div class="shell">
                    <div class="narrow">
                        <h2 class="faq-h">{{ f.faqTitle }}</h2>
                        <div class="faq">
                            <details v-for="id in FAQ" :key="id" class="faq-q">
                                <summary>{{ f.faq[id].q }}</summary>
                                <div class="faq-a">
                                    <p v-html="answer(id)"></p>
                                </div>
                            </details>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <SiteFooter />
    </div>
</template>

<style lang="scss">
.fuba-page.fuba-fund {
    .narrow {
        max-width: 680px;
        margin: 0 auto;
    }
    .eyebrow {
        margin: 0;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: var(--muted);
    }
    .hero {
        padding: clamp(64px, 9vw, 112px) 0 clamp(56px, 7vw, 88px);
    }
    .hero-intro {
        margin-bottom: 16px;
    }
    .section-head {
        text-align: center;
        margin-bottom: clamp(24px, 3vw, 32px);
    }
    .section-head .eyebrow {
        margin-bottom: 14px;
    }
    h2 {
        font-size: clamp(30px, 4vw, 48px);
        letter-spacing: -0.04em;
        line-height: 1.1;
        text-wrap: balance;
    }
    p {
        margin: 0;
    }
    .fund-band {
        background: var(--surface);
        border-top: 1px solid var(--line);
        border-bottom: 1px solid var(--line);
        padding: clamp(64px, 8vw, 92px) 0;
    }
    .body-case p {
        font-size: 18px;
        line-height: 1.75;
        color: var(--text-2);
    }
    .body-case p + p {
        margin-top: 20px;
    }
    .narrow .verse {
        margin: 34px 0 0;
        padding: 30px 0 0;
        border-left: 0;
        border-top: 1px solid var(--line);
        text-align: center;
    }
    .narrow .verse blockquote {
        max-width: none;
        margin: 0 auto;
        font-size: clamp(19px, 2vw, 23px);
        line-height: 1.45;
    }
    .narrow .verse .ref {
        justify-content: center;
        margin-top: 14px;
    }
    .current-status {
        padding: clamp(56px, 7vw, 76px) 0;
    }
    .current-status h2 {
        font-size: clamp(28px, 3.5vw, 36px);
        letter-spacing: -0.035em;
    }
    .current-status p {
        font-size: 18px;
        line-height: 1.75;
        color: var(--text-2);
        margin-top: 18px;
    }
    .proposal-section {
        background: var(--btn-bg);
        color: var(--btn-fg);
        padding: clamp(64px, 8vw, 92px) 0;
    }
    .proposal-section .eyebrow {
        color: inherit;
        opacity: 0.7;
        text-align: center;
    }
    .proposal-section h2 {
        text-align: center;
        margin-top: 16px;
        font-size: clamp(32px, 4.4vw, 60px);
        font-weight: 800;
        line-height: 1.06;
    }
    .proposal-intro {
        margin: 20px auto 0;
        text-align: center;
        text-wrap: pretty;
        font-size: 18px;
        line-height: 1.65;
        opacity: 0.86;
    }
    .proposal-list {
        list-style: none;
        counter-reset: proposal;
        padding: 0;
        margin: 36px 0 0;
    }
    .proposal-list li {
        counter-increment: proposal;
        position: relative;
        padding: 21px 0 23px 47px;
        border-top: 1px solid color-mix(in srgb, var(--btn-fg) 23%, transparent);
    }
    .proposal-list li:last-child {
        border-bottom: 1px solid
            color-mix(in srgb, var(--btn-fg) 23%, transparent);
    }
    .proposal-list li::before {
        content: counter(proposal, decimal-leading-zero);
        position: absolute;
        left: 0;
        top: 24px;
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.08em;
        opacity: 0.6;
    }
    .proposal-list strong {
        display: block;
        font-size: 18px;
        letter-spacing: -0.01em;
        line-height: 1.4;
    }
    .proposal-list span {
        display: block;
        font-size: 16px;
        line-height: 1.65;
        margin-top: 5px;
        opacity: 0.8;
    }
    .proposal-section .cta {
        margin-top: 34px;
    }
    .reporting {
        padding: clamp(64px, 8vw, 92px) 0 clamp(48px, 6vw, 72px);
    }
    .reporting-summary {
        font-size: 18px;
        line-height: 1.75;
        color: var(--text-2);
    }
    .fund-faq {
        padding: clamp(48px, 6vw, 72px) 0 clamp(64px, 8vw, 92px);
        border-top: 1px solid var(--line);
    }
    .faq-h {
        font-size: clamp(28px, 3.5vw, 36px);
        letter-spacing: -0.035em;
    }
    .faq-a p {
        font-size: 16px;
        line-height: 1.7;
    }
    .inref {
        font-weight: 600;
        color: var(--text);
        text-decoration: underline;
        text-underline-offset: 3px;
    }
    @media (max-width: 620px) {
        .body-case p,
        .current-status p,
        .reporting-summary,
        .proposal-intro {
            font-size: 16px;
        }
        .narrow .verse blockquote {
            font-size: 21px;
        }
        .proposal-list li {
            padding-left: 34px;
        }
        .proposal-list strong {
            font-size: 17px;
        }
        .proposal-list span {
            font-size: 15px;
        }
    }
    @media (max-width: 380px) {
        h2 {
            font-size: 26px;
        }
        .proposal-section h2 {
            font-size: 30px;
        }
    }
}
</style>
