<script setup lang="ts">
import { RouteLink, withBase } from 'vuepress/client';
import { computed } from 'vue';
import { useLabels, useLocalePath } from '../composables/useLocale';
import { labelHtml } from '../composables/formatLabel';

const DONATE_URL = 'https://better.giving/marketplace/1118469';
const DISCORD_URL = 'https://discord.com/invite/NbEZMCJmqC';
const GITHUB_URL = 'https://github.com/HelloAOLab/bible-api';
const ISSUES_URL = 'https://github.com/HelloAOLab/bible-api/issues';
const NEWSLETTER_URL = 'https://helloao.org';

const localePath = useLocalePath();
const labels = useLabels();

// "Made with ♥ by AO Lab", with the heart and the link placed wherever the
// translation puts them.
const madeWith = computed(() =>
    labelHtml(labels.value.footer.madeWith, {
        love: `<span role="img" aria-label="${labelHtml(labels.value.footer.love)}">&#9829;&#xFE0E;</span>`,
        aoLab: '<a href="https://helloao.org">AO Lab</a>',
    })
);

const aoLabLogo = withBase('/ao_lab_logo.png');
const aoLabLogoDark = withBase('/ao_lab_logo_dark.png');
</script>

<template>
    <footer class="fuba-footer">
        <div class="shell">
            <div class="foot-top">
                <div class="foot-id">
                    <b>Free Use Bible API</b>
                    <p class="made" v-html="madeWith"></p>
                    <p>{{ labels.footer.joinUs }}</p>
                    <div class="foot-social">
                        <a :href="GITHUB_URL" :aria-label="labels.footer.github">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.55v-1.94c-3.2.7-3.88-1.54-3.88-1.54-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.02 11.02 0 015.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .3.2.66.8.55A11.51 11.51 0 0023.5 12C23.5 5.73 18.27.5 12 .5z"/></svg>
                        </a>
                        <a :href="DISCORD_URL" :aria-label="labels.footer.discord">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c1.8483 1.3579 3.6396 2.1867 5.3968 2.7367a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.7652-.5498 3.5565-1.3786 5.4048-2.7366a.0777.0777 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>
                        </a>
                        <a href="https://www.youtube.com/@aolab" :aria-label="labels.footer.youtube">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                        </a>
                    </div>
                </div>
                <div class="foot-reach">
                    <p class="lbl2">{{ labels.footer.contributePrompt }}</p>
                    <a :href="ISSUES_URL">{{ labels.footer.openIssue }} &rarr;</a>
                    <div class="reach2">
                        <p class="lbl2">{{ labels.footer.updatesPrompt }}</p>
                        <a :href="NEWSLETTER_URL">{{ labels.footer.newsletter }} &rarr;</a>
                    </div>
                </div>
            </div>

            <div class="foot-cols">
                <div>
                    <p class="lbl2">{{ labels.footer.docs }}</p>
                    <ul>
                        <li><RouteLink :to="localePath('/guide/getting-started.html')">{{ labels.footer.quickStart }}</RouteLink></li>
                        <li><RouteLink :to="localePath('/guide/')">{{ labels.footer.guide }}</RouteLink></li>
                        <li><RouteLink :to="localePath('/reference/')">{{ labels.footer.reference }}</RouteLink></li>
                        <li><RouteLink :to="localePath('/sdks/')">{{ labels.footer.sdks }}</RouteLink></li>
                        <li><RouteLink :to="localePath('/guide/downloads.html')">{{ labels.footer.downloads }}</RouteLink></li>
                        <li><a :href="ISSUES_URL">{{ labels.footer.reportIssue }}</a></li>
                    </ul>
                </div>
                <div>
                    <p class="lbl2">{{ labels.footer.resources }}</p>
                    <ul>
                        <li><RouteLink :to="localePath('/reference/translations/')">{{ labels.footer.translations }}</RouteLink></li>
                        <li><RouteLink :to="localePath('/reference/translations/standard.html#get-the-audio-timings-for-a-chapter')">{{ labels.footer.audio }}</RouteLink></li>
                        <li><RouteLink :to="localePath('/reference/commentaries/')">{{ labels.footer.commentaries }}</RouteLink></li>
                        <li><RouteLink :to="localePath('/reference/datasets/')">{{ labels.footer.datasets }}</RouteLink></li>
                        <li><span class="soon">{{ labels.footer.seedBibleSoon }}</span></li>
                    </ul>
                </div>
                <div>
                    <p class="lbl2">AO Lab</p>
                    <ul>
                        <li><a href="https://helloao.org">AO Lab</a></li>
                        <li><a href="https://helloao.org/about.html">{{ labels.footer.aboutUs }}</a></li>
                        <li><a :href="DONATE_URL">{{ labels.footer.donate }}</a></li>
                    </ul>
                </div>
            </div>

            <div class="foot-legal">
                <span
                    >{{ labels.footer.nonprofit }} &middot;
                    {{ labels.footer.established }}</span
                >
                <a class="foot-logo" href="https://helloao.org" aria-label="AO Lab">
                    <img class="light-only" :src="aoLabLogo" alt="AO Lab" />
                    <img class="dark-only" :src="aoLabLogoDark" alt="AO Lab" />
                </a>
                <span class="foot-terms">
                    <a href="https://helloao.org/privacy.html">{{ labels.footer.privacy }}</a> &middot;
                    <a href="https://helloao.org/terms.html">{{ labels.footer.terms }}</a>
                </span>
            </div>
        </div>
    </footer>
</template>

<style lang="scss">
// The site footer, shared by the home page and the 404 page.
.fuba-footer {
    --text: var(--vp-c-text);
    --text-2: var(--fuba-text-2);
    --muted: var(--vp-c-text-mute);
    --line: var(--vp-c-divider);
    --line-strong: var(--fuba-line-strong);
    --max: 1160px;

    border-top: 1px solid var(--line);
    padding: clamp(40px, 5vw, 60px) 0 44px;
    background: var(--vp-c-bg);
    font-size: 14px;
    line-height: 1.55;
    color: var(--muted);

    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }
    a {
        color: inherit;
        text-decoration: none;
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

    // swap the black and white logo with the theme
    .dark-only {
        display: none !important;
    }

    .foot-top {
        display: grid;
        grid-template-columns: 1.15fr 0.85fr;
        gap: 40px;
        padding-bottom: 32px;
        border-bottom: 1px solid var(--line);
    }
    .foot-id b {
        display: block;
        font-size: 16px;
        letter-spacing: -0.02em;
        color: var(--text);
    }
    .foot-id p {
        margin: 8px 0 0;
        max-width: 60ch;
    }
    .foot-id .made {
        display: flex;
        align-items: center;
        gap: 6px;
        color: var(--text);
        font-weight: 600;
    }
    .foot-social {
        display: flex;
        gap: 8px;
        margin-top: 18px;
    }
    .foot-social a {
        width: 38px;
        height: 38px;
        display: grid;
        place-items: center;
        border: 1px solid var(--line);
        border-radius: 9px;
        color: var(--text-2);
    }
    .foot-social a:hover {
        color: var(--text);
        border-color: var(--line-strong);
    }
    .foot-social svg {
        width: 18px;
        height: 18px;
        fill: currentColor;
    }
    .foot-reach {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }
    .lbl2 {
        margin: 0;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--muted);
    }
    .foot-reach a {
        margin-top: 10px;
        font-size: clamp(19px, 2vw, 24px);
        font-weight: 600;
        letter-spacing: -0.025em;
        color: var(--text);
        align-self: flex-start;
        border-bottom: 1px solid var(--line);
        padding-bottom: 2px;
    }
    .foot-reach a:hover {
        border-bottom-color: var(--line-strong);
    }
    .foot-reach .reach2 {
        display: flex;
        flex-direction: column;
        margin-top: 28px;
    }
    .foot-cols {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 28px;
        padding: 30px 0 6px;
    }
    .foot-cols ul {
        list-style: none;
        margin: 12px 0 0;
        padding: 0;
        display: grid;
        gap: 9px;
    }
    .foot-cols a {
        color: var(--text-2);
    }
    .foot-cols .soon {
        color: var(--muted);
        cursor: default;
    }
    .foot-cols a:hover {
        color: var(--text);
        text-decoration: underline;
        text-underline-offset: 3px;
    }
    .foot-legal {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        gap: 14px 24px;
        margin-top: 26px;
        padding-top: 26px;
        border-top: 1px solid var(--line);
        font-size: 11.5px;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
    }
    .foot-legal .foot-terms {
        justify-self: end;
    }
    .foot-legal a {
        color: var(--muted);
    }
    .foot-legal a:hover {
        color: var(--text);
    }
    .foot-logo img {
        display: block;
        width: auto;
        height: 48px;
    }

    @media (max-width: 980px) {
        .foot-cols {
            grid-template-columns: repeat(2, 1fr);
        }
    }
    @media (max-width: 820px) {
        .foot-top {
            grid-template-columns: 1fr;
            gap: 28px;
        }
        .foot-cols {
            grid-template-columns: 1fr;
            gap: 26px;
        }
    }
    @media (max-width: 720px) {
        .foot-legal {
            grid-template-columns: 1fr;
            justify-items: center;
            text-align: center;
        }
        .foot-legal .foot-logo {
            order: -1;
        }
        .foot-legal .foot-terms {
            justify-self: center;
        }
    }
    @media (max-width: 620px) {
        .shell {
            padding: 0 16px;
        }
    }
}

[data-theme='dark'] .fuba-footer {
    .light-only {
        display: none !important;
    }
    .dark-only {
        display: block !important;
    }
}
</style>
