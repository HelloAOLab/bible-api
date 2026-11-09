/**
 * The support wall, drawn by components/SupportWall.vue on the home page and
 * the Support page. Edit WALL_DATA below by hand; nothing in the component
 * needs to change.
 *
 * Claimed squares show as outlines and fill with ink as money is received.
 * Claims beyond the goal are reported as going to the Free Use Fund. On the
 * page, "claimed" is labelled "Pledged".
 *
 * Current base (November 9, 2026):
 *   four active monthly donors on better.giving, $125 + $70 + $3 + $20 =
 *     $218 a month (the $20 donor joined Nov 4, 2026)
 *     pledged: 12 months of 2027 ($2,616) plus Nov and Dec 2026 payments
 *       ($436) = $3,052
 *     received so far: Nov 4 $20, Nov 7 $70 = $90
 *   $5,000 annual support, received
 *   $2 one-time gift, Oct 31, 2026, received
 *   others = { claimed: 3052 + 5000 + 2 = 8054, received: 90 + 5000 + 2 = 5092 }
 * Amounts are gross gifts, before processing fees.
 * Shown anonymously until each donor agrees to be named.
 *
 * Cutoff rule: AO Lab is already funded through December 2026, so all
 * support received from October 27, 2026 counts toward the 2027 wall,
 * including monthly payments made in November and December 2026 (Craig's
 * call, until he says otherwise).
 */

export interface WallSupporter {
    /** Shown when `public` is true. */
    name: string;
    /** false shows "Anonymous". */
    public: boolean;
    kind?: 'Individual' | 'Nonprofit' | 'Business';
    /** The rectangle, in squares: w × h × unit = claimed. */
    w: number;
    h: number;
    /** Dollars received so far this year. */
    received: number;
    cadence: 'monthly' | 'annual' | 'one-time';
    /** Adds the folded corner, and is shown on hover. */
    story?: string;
    /** Up to 80 characters, shown on hover. */
    message?: string;
    /**
     * Drawn inside the rectangle on white, from .vuepress/public (so
     * "/wall/lumen.svg" is .vuepress/public/wall/lumen.svg). Sizing guide:
     * support.html#logos
     */
    logo?: string;
    /** Optional spot, as fractions across and down. */
    at?: [number, number];
}

export interface WallData {
    /** The wall's year. */
    year: number;
    /** The wall's total, in dollars. */
    goal: number;
    /** One square's yearly amount, in dollars. */
    unit: number;
    /**
     * Running totals for everyone not listed by name: their squares fill
     * from the top of the wall in order. `claimed` is what has been committed
     * for the year; `received` is what has arrived.
     */
    others: { claimed: number; received: number };
    /** One entry per named or story-bearing supporter. */
    supporters: WallSupporter[];
}

export const WALL_DATA: WallData = {
    year: 2027,
    goal: 500000,
    unit: 240,
    others: { claimed: 8054, received: 5092 },
    supporters: [],
};
