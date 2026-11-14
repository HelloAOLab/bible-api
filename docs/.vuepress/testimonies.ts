/**
 * The testimony river: the slow-moving row of faces and testimonies under
 * "Supported by partners who believe Scripture should be truly free." on the
 * home page. Drawn by components/TestimonyRiver.vue. Edit TESTIMONIES by hand.
 *
 * Only real testimonies from real people, shared with their permission. The
 * river slips a "Your testimony here" card in after every few entries, linking
 * to the Support page's #testimony section. With no entries, it shows one
 * invitation instead.
 *
 * Preview the design with sample cards by adding ?river-preview to the
 * address. Sample cards are never shown otherwise.
 *
 * Quotes stay in the language they were given in, so they are not in
 * labels.json.
 */

export interface Testimony {
    /** Shown as written. */
    name: string;
    /** Optional affiliation: title and organization. */
    role?: string;
    /**
     * Optional path under .vuepress/public: square, at least 96 px, under
     * 30 KB. Without one, initials are drawn.
     */
    photo?: string;
    /** One or two sentences, about 160 characters. */
    quote: string;
    /** True if they also support AO Lab. */
    gave?: boolean;
}

/* From the case for support. */
export const TESTIMONIES: Testimony[] = [
    {
        name: 'Ted Hallum',
        role: 'Director of Analytics & Information Management, Ligonier Ministries',
        photo: '/people/ted-hallum.jpg',
        quote: 'If you’re a Christian developer wanting to incorporate God’s Word into your project unencumbered, then AO Lab’s Free Use Bible API is the single most important piece of infrastructure on planet Earth.',
    },
    {
        name: 'Ryder Wishart, PhD',
        role: 'CEO, Frontier R&D, makers of Aquilla',
        quote: 'It’s the best Bible API ever. It’s on seedbible.org (the best Bible reading environment) and we use it in aquilla.app.',
    },
    {
        name: 'Maxwell Warren',
        role: 'Building an open source Bible app',
        quote: 'Praise be to God that He is raising people up to make high quality open source software.',
    },
    {
        name: 'Larry Hendrix',
        role: 'Building an app to help his church engage Scripture',
        quote: 'The end goal isn’t who has the best tech, but enabling growth in believers.',
    },
];
