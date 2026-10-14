import { useLayoutEffect, useRef, useState, type RefObject } from 'react';
import {
    RIBBON_PAD_X_EM,
    RIBBON_RADIUS_EM,
    adjacentInlineRect,
    buildRibbonPath,
    collectLineRects,
    type RibbonRect,
} from './highlightRibbon.js';

/** Keep in sync with the `.fuba-highlight-ribbon` transition in BibleReader.css. */
export const RIBBON_FADE_MS = 250;

/**
 * One drawn highlight ribbon. `key` is the chapter plus the run's verse range
 * ("5-8"); `first`/`last` are that range as numbers, for coverage checks.
 * `enter` = fading in (a new highlight, not a reshape); `exiting` = fading out
 * before removal.
 */
export interface Ribbon {
    key: string;
    d: string;
    fill: string;
    first: number;
    last: number;
    enter: boolean;
    exiting: boolean;
}

/**
 * Measures the highlighted runs inside `contentRef` (elements carrying
 * `data-highlight-fill` and `data-highlight-key`) and turns each into a rounded
 * ribbon path to draw behind the text.
 *
 * Re-measures after every render of the calling component and whenever the
 * content box resizes. A highlight that appears fades in and one that is removed
 * fades out; a run that only changes shape (an edit, a reflow) snaps.
 *
 * @param chapterKey Identifies the chapter on screen. When it changes, the
 * previous chapter's ribbons are dropped instead of fading out at stale
 * positions.
 */
export function useHighlightRibbons(
    contentRef: RefObject<HTMLElement | null>,
    chapterKey: string
): Ribbon[] {
    const [ribbons, setRibbons] = useState<Ribbon[]>([]);
    // What's on screen (including ribbons fading out) so the reconcile can diff.
    const renderedRef = useRef<Ribbon[]>([]);
    const exitTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(
        new Map()
    );
    // Verses highlighted (any color) last measure; distinguishes new from
    // reshaped.
    const prevCoverageRef = useRef<Set<number>>(new Set());
    const chapterKeyRef = useRef('');
    const signatureRef = useRef('');

    const removeRibbon = (key: string) => {
        exitTimers.current.delete(key);
        renderedRef.current = renderedRef.current.filter((r) => r.key !== key);
        setRibbons(renderedRef.current);
    };

    const measure = () => {
        const content = contentRef.current;
        if (!content) {
            return;
        }

        if (chapterKey !== chapterKeyRef.current) {
            chapterKeyRef.current = chapterKey;
            renderedRef.current = [];
            prevCoverageRef.current = new Set();
            signatureRef.current = '';
            exitTimers.current.forEach((id) => clearTimeout(id));
            exitTimers.current.clear();
        }

        const box = content.getBoundingClientRect();
        const style = getComputedStyle(content);
        const fontSize = parseFloat(style.fontSize) || 16;
        const radius = RIBBON_RADIUS_EM * fontSize;
        const padX = RIBBON_PAD_X_EM * fontSize;
        // Line pitch so a run's outer edges fill their line slots and adjacent
        // ribbons meet with no gap. Only used for single-line runs. A non-px
        // ("normal") line-height falls back to ~1.5em.
        const computedPitch = parseFloat(style.lineHeight);
        const linePitch =
            computedPitch > fontSize ? computedPitch : fontSize * 1.5;
        const rtl = style.direction === 'rtl';

        const runs = Array.from(
            content.querySelectorAll<HTMLElement>('[data-highlight-fill]')
        )
            .map((el, index) => ({
                el,
                key: el.getAttribute('data-highlight-key') || `i${index}`,
                fill: el.getAttribute('data-highlight-fill') ?? '',
                lines: collectLineRects(el, box.left, box.top),
                leadPad: padX,
                trailPad: padX,
            }))
            .filter((run) => run.fill !== '' && run.lines.length > 0);

        // Where a run begins or ends mid-line, with another verse's text beside
        // it on the same line, its horizontal pad would reach over into that
        // text. Drop the pad on just that edge so the ribbon stops at its own
        // glyphs.
        const sharesLine = (r: RibbonRect, line: RibbonRect) =>
            r.top < line.bottom - 2 && r.bottom > line.top + 2;
        for (const run of runs) {
            const first = run.lines[0]!;
            const last = run.lines[run.lines.length - 1]!;
            const before = adjacentInlineRect(
                run.el,
                'before',
                box.left,
                box.top
            );
            const after = adjacentInlineRect(
                run.el,
                'after',
                box.left,
                box.top
            );
            if (before && sharesLine(before, first)) run.leadPad = 0;
            if (after && sharesLine(after, last)) run.trailPad = 0;
        }

        const next: Array<Omit<Ribbon, 'enter' | 'exiting'>> = [];
        for (const run of runs) {
            const d = buildRibbonPath(run.lines, radius, padX, linePitch, {
                leadPad: run.leadPad,
                trailPad: run.trailPad,
                rtl,
            });
            if (!d) continue;
            const dash = run.key.indexOf('-');
            next.push({
                // Prefixed with the chapter so keys never collide across
                // chapters.
                key: `${chapterKey}:${run.key}`,
                d,
                fill: run.fill,
                first: dash >= 0 ? Number(run.key.slice(0, dash)) : NaN,
                last: dash >= 0 ? Number(run.key.slice(dash + 1)) : NaN,
            });
        }

        // Measuring runs after every render, and setting state renders again;
        // this guard is what stops that from looping.
        const signature = JSON.stringify(next);
        if (signature === signatureRef.current) {
            return;
        }
        signatureRef.current = signature;

        // A run fades in only if none of its verses were highlighted before,
        // and fades out only if none are highlighted now; otherwise it just
        // changed shape, so it snaps.
        const liveCoverage = new Set<number>();
        for (const r of next) {
            for (let v = r.first; v <= r.last; v++) liveCoverage.add(v);
        }
        const prevCoverage = prevCoverageRef.current;
        const prevLiveKeys = new Set(
            renderedRef.current.filter((p) => !p.exiting).map((p) => p.key)
        );
        const liveKeys = new Set(next.map((r) => r.key));

        const result: Ribbon[] = next.map((r) => {
            const timer = exitTimers.current.get(r.key);
            if (timer !== undefined) {
                // Re-highlighted mid-fade — cancel its removal.
                clearTimeout(timer);
                exitTimers.current.delete(r.key);
            }
            let enter = !prevLiveKeys.has(r.key);
            if (enter) {
                for (let v = r.first; v <= r.last; v++) {
                    if (prevCoverage.has(v)) {
                        enter = false;
                        break;
                    }
                }
            }
            return { ...r, enter, exiting: false };
        });

        for (const prev of renderedRef.current) {
            if (liveKeys.has(prev.key)) continue;
            if (prev.exiting) {
                // Already fading out — keep it until its timer fires.
                if (exitTimers.current.has(prev.key)) result.push(prev);
                continue;
            }
            let stillCovered = false;
            for (let v = prev.first; v <= prev.last; v++) {
                if (liveCoverage.has(v)) {
                    stillCovered = true;
                    break;
                }
            }
            // Its verses are still highlighted as part of another run: it was
            // merged or split, so drop it without a fade.
            if (stillCovered) continue;
            result.push({ ...prev, enter: false, exiting: true });
            const key = prev.key;
            exitTimers.current.set(
                key,
                setTimeout(() => removeRibbon(key), RIBBON_FADE_MS + 50)
            );
        }

        renderedRef.current = result;
        prevCoverageRef.current = liveCoverage;
        setRibbons(result);
    };

    // The ResizeObserver is registered once, so it reaches the latest
    // `measure` (and its `chapterKey`) through this ref.
    const measureRef = useRef(measure);
    useLayoutEffect(() => {
        measureRef.current = measure;
        measure();
    });

    useLayoutEffect(() => {
        const content = contentRef.current;
        if (!content || typeof ResizeObserver === 'undefined') return;
        const observer = new ResizeObserver(() => measureRef.current());
        observer.observe(content);
        return () => observer.disconnect();
    }, [contentRef]);

    useLayoutEffect(() => {
        const timers = exitTimers.current;
        return () => {
            timers.forEach((id) => clearTimeout(id));
            timers.clear();
        };
    }, []);

    return ribbons;
}

/** The SVG layer that draws highlight ribbons behind the chapter text. */
export function HighlightLayer(props: { ribbons: Ribbon[] }) {
    return (
        <svg className="fuba-highlight-layer" aria-hidden="true">
            {props.ribbons.map((ribbon) => (
                <path
                    key={ribbon.key}
                    className={
                        ribbon.enter
                            ? 'fuba-highlight-ribbon fuba-highlight-ribbon-enter'
                            : 'fuba-highlight-ribbon'
                    }
                    d={ribbon.d}
                    style={{
                        fill: ribbon.fill,
                        opacity: ribbon.exiting ? 0 : undefined,
                    }}
                />
            ))}
        </svg>
    );
}
