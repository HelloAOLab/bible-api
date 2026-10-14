import type {
    ApiTranslationBookChapter,
    ChapterVerse,
} from 'free-use-bible-api';
import {
    Fragment,
    useRef,
    type AriaAttributes,
    type CSSProperties,
    type MouseEvent,
    type ReactNode,
} from 'react';
import type {
    BibleSelectedVerse,
    VerseDecoration,
} from './BibleReadingManager.js';
import { HighlightLayer, useHighlightRibbons } from './HighlightLayer.js';

/** Which parts of the text the reader shows. */
export interface ScriptureElements {
    showHeadings: boolean;
    showVerseNumbers: boolean;
    showFootnotes: boolean;
    /** Shows the words of Jesus in red. */
    showRedLettering: boolean;
    showHighlights: boolean;
}

export const DEFAULT_SCRIPTURE_ELEMENTS: ScriptureElements = {
    showHeadings: true,
    showVerseNumbers: true,
    showFootnotes: true,
    showRedLettering: true,
    showHighlights: true,
};

/**
 * A highlighted verse or range of verses, drawn as a rounded ribbon behind the
 * text.
 */
export interface VerseHighlight {
    /** Book identifier (for example: GEN, JHN). */
    bookId: string;
    chapterNumber: number;
    /** A verse number, or an inclusive `[first, last]` range. */
    verse: number | [number, number];
    /**
     * A preset color: yellow, green, cyan, blue, red, magenta, pink, purple,
     * orange, cream, gray, or tan. Presets follow the light/dark theme through
     * the `--fuba-highlight-<colorId>-*` CSS variables, so you can also define
     * your own color IDs in CSS.
     */
    colorId: string;
    /** Any CSS color. Overrides `colorId`. */
    customColor?: string;
    /** Text color for a `customColor` highlight. Defaults to the normal text color. */
    customFontColor?: string;
    /**
     * Limits the highlight to one translation. Omit to show it in every
     * translation.
     */
    translationId?: string | null;
}

type VersePart = ChapterVerse['content'][number];

interface VerseLine {
    indentLevel: number;
    parts: VersePart[];
}

type VerseSegment =
    | { type: 'inline'; parts: VersePart[] }
    | { type: 'poetry'; lines: VerseLine[] };

interface ContentDecorationRange {
    start: number;
    end: number;
    className: string;
    style?: CSSProperties;
}

function getPoemIndentLevel(part: VersePart): number | null {
    if (
        part &&
        typeof part === 'object' &&
        'text' in part &&
        typeof part.poem === 'number' &&
        part.poem > 0
    ) {
        return part.poem;
    }
    return null;
}

function isLineBreakPart(part: VersePart | undefined): boolean {
    return (
        !!part &&
        typeof part === 'object' &&
        'lineBreak' in part &&
        part.lineBreak === true
    );
}

function isFootnotePart(part: VersePart | undefined): boolean {
    return (
        !!part &&
        typeof part === 'object' &&
        'noteId' in part &&
        typeof part.noteId === 'number'
    );
}

// Move a footnote before an immediately preceding line break so the marker
// stays attached to the text it belongs to instead of starting the next line.
function reorderFootnoteBeforeLineBreak(content: VersePart[]): VersePart[] {
    let reorderedContent: VersePart[] | undefined;

    for (let index = 0; index < content.length - 1; index += 1) {
        const currentPart = content[index]!;
        const nextPart = content[index + 1]!;

        if (isLineBreakPart(currentPart) && isFootnotePart(nextPart)) {
            reorderedContent ??= [...content];
            reorderedContent[index] = nextPart;
            reorderedContent[index + 1] = currentPart;
            index += 1;
        }
    }

    return reorderedContent ?? content;
}

function getInlineText(part: VersePart): string {
    if (typeof part === 'string') {
        return part;
    }
    if (part && typeof part === 'object' && 'text' in part) {
        return typeof part.text === 'string' ? part.text : '';
    }
    return '';
}

function getVersePlainText(content: VersePart[]): string {
    return content.map((part) => getInlineText(part)).join('');
}

function hasContentTargeting(decoration: VerseDecoration): boolean {
    const hasTargetContent =
        typeof decoration.targetContent === 'string' &&
        decoration.targetContent.trim().length > 0;
    const hasIndexRange =
        typeof decoration.startIndex === 'number' ||
        typeof decoration.endIndex === 'number';
    return hasTargetContent || hasIndexRange;
}

/**
 * Turns content-targeted decorations (a text fragment, or a character range)
 * into character ranges within the verse's plain text.
 */
function toContentDecorationRanges(
    verseText: string,
    decorations: VerseDecoration[]
): ContentDecorationRange[] {
    const verseLength = verseText.length;
    const clampIndex = (value: number) =>
        Math.max(0, Math.min(verseLength, Math.floor(value)));

    return decorations.flatMap((decoration) => {
        const className = decoration.className?.trim() ?? '';
        const style = decoration.style;
        const windowStart =
            typeof decoration.startIndex === 'number'
                ? clampIndex(decoration.startIndex)
                : 0;
        const windowEnd =
            typeof decoration.endIndex === 'number'
                ? clampIndex(decoration.endIndex)
                : verseLength;

        if (windowEnd <= windowStart) {
            return [];
        }

        const targetContent = decoration.targetContent?.trim();
        if (!targetContent) {
            return [{ start: windowStart, end: windowEnd, className, style }];
        }

        const windowText = verseText.slice(windowStart, windowEnd);
        const ranges: ContentDecorationRange[] = [];
        let searchStart = 0;
        while (searchStart <= windowText.length) {
            const matchStart = windowText.indexOf(targetContent, searchStart);
            if (matchStart === -1) {
                break;
            }
            const absoluteStart = windowStart + matchStart;
            ranges.push({
                start: absoluteStart,
                end: absoluteStart + targetContent.length,
                className,
                style,
            });
            searchStart = matchStart + targetContent.length;
        }
        return ranges;
    });
}

/**
 * Splits a verse into runs of prose and runs of poetry. Poetry lines are
 * rendered as indented blocks; prose stays inline so verses flow together.
 */
function splitVerseIntoSegments(content: VersePart[]): VerseSegment[] {
    const segments: VerseSegment[] = [];
    let currentInlineParts: VersePart[] = [];
    let currentPoetryLines: VerseLine[] = [];
    let currentPoetryLine: VerseLine = { indentLevel: 0, parts: [] };
    let inPoetry = false;

    const pushCurrentPoetryLine = () => {
        if (currentPoetryLine.parts.length > 0) {
            currentPoetryLines.push({
                indentLevel: currentPoetryLine.indentLevel,
                parts: [...currentPoetryLine.parts],
            });
            currentPoetryLine = {
                indentLevel: currentPoetryLine.indentLevel,
                parts: [],
            };
        }
    };

    const flushPoetry = () => {
        pushCurrentPoetryLine();
        if (currentPoetryLines.length > 0) {
            segments.push({ type: 'poetry', lines: currentPoetryLines });
            currentPoetryLines = [];
        }
        currentPoetryLine = { indentLevel: 0, parts: [] };
        inPoetry = false;
    };

    const flushInline = () => {
        if (currentInlineParts.length > 0) {
            segments.push({ type: 'inline', parts: currentInlineParts });
            currentInlineParts = [];
        }
    };

    for (const part of content) {
        const indentLevel = getPoemIndentLevel(part);

        if (isFootnotePart(part)) {
            if (inPoetry) {
                currentPoetryLine.parts.push(part);
            } else {
                currentInlineParts.push(part);
            }
            continue;
        }

        if (indentLevel !== null) {
            if (!inPoetry) {
                flushInline();
                inPoetry = true;
            }
            if (
                currentPoetryLine.parts.length > 0 &&
                currentPoetryLine.indentLevel !== indentLevel
            ) {
                pushCurrentPoetryLine();
            }
            currentPoetryLine.indentLevel = indentLevel;
            currentPoetryLine.parts.push(part);
        } else if (isLineBreakPart(part)) {
            if (inPoetry) {
                pushCurrentPoetryLine();
            } else {
                currentInlineParts.push(part);
            }
        } else {
            if (inPoetry) {
                flushPoetry();
            }
            currentInlineParts.push(part);
        }
    }

    if (inPoetry) {
        flushPoetry();
    } else {
        flushInline();
    }
    return segments;
}

function splitTextByDecorations(
    text: string,
    contentRanges: ContentDecorationRange[],
    partStartIndex: number
): Array<{ text: string; className: string; style?: CSSProperties }> {
    const partEndIndex = partStartIndex + text.length;
    const ranges = contentRanges
        .filter(
            (range) => range.end > partStartIndex && range.start < partEndIndex
        )
        .map((range) => ({
            ...range,
            start: Math.max(0, range.start - partStartIndex),
            end: Math.min(text.length, range.end - partStartIndex),
        }));

    if (ranges.length === 0) {
        return [{ text, className: '' }];
    }

    const boundaries = new Set<number>([0, text.length]);
    for (const range of ranges) {
        boundaries.add(range.start);
        boundaries.add(range.end);
    }
    const sortedBoundaries = Array.from(boundaries).sort((a, b) => a - b);

    const segments: Array<{
        text: string;
        className: string;
        style?: CSSProperties;
    }> = [];
    for (let i = 0; i < sortedBoundaries.length - 1; i += 1) {
        const segmentStart = sortedBoundaries[i]!;
        const segmentEnd = sortedBoundaries[i + 1]!;
        const segmentText = text.slice(segmentStart, segmentEnd);
        if (!segmentText) {
            continue;
        }

        const activeRanges = ranges.filter(
            (range) => segmentStart >= range.start && segmentEnd <= range.end
        );
        const className = activeRanges
            .map((range) => range.className)
            .filter((name) => name.length > 0)
            .join(' ');
        const style = activeRanges.reduce<CSSProperties | undefined>(
            (merged, range) =>
                range.style ? { ...(merged ?? {}), ...range.style } : merged,
            undefined
        );
        segments.push({ text: segmentText, className, style });
    }
    return segments;
}

function FootnoteIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            width="1em"
            height="1em"
            aria-hidden="true"
            focusable="false"
        >
            <path
                fill="currentColor"
                d="M11 17h2v-6h-2v6Zm1-8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm0 13a10 10 0 1 1 0-20 10 10 0 0 1 0 20Zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"
            />
        </svg>
    );
}

function renderInlineContent(
    part: VersePart,
    index: number,
    onOpenFootnote: (noteId: number) => void,
    elements: ScriptureElements,
    contentRanges: ContentDecorationRange[] = [],
    partStartIndex = 0,
    isBeforeFootnote = false
): ReactNode {
    const renderSegments = (text: string, leadingSpace: string) =>
        splitTextByDecorations(text, contentRanges, partStartIndex).map(
            (segment, segmentIndex) => (
                <span
                    key={segmentIndex}
                    className={segment.className || undefined}
                    style={segment.style}
                >
                    {(segmentIndex === 0 ? leadingSpace : '') + segment.text}
                </span>
            )
        );

    if (typeof part === 'string') {
        const text = isBeforeFootnote ? part.trimEnd() : part;
        return <span key={index}>{renderSegments(text, '')}</span>;
    }

    if (!part || typeof part !== 'object') {
        return null;
    }

    if ('text' in part && typeof part.text === 'string') {
        const className =
            part.wordsOfJesus && elements.showRedLettering
                ? 'fuba-words-of-jesus'
                : undefined;
        const text = isBeforeFootnote ? part.text.trimEnd() : part.text;
        return (
            <span key={index} className={className}>
                {renderSegments(text, index > 0 ? ' ' : '')}
            </span>
        );
    }

    if ('heading' in part && typeof part.heading === 'string') {
        if (!elements.showHeadings) {
            return null;
        }
        return <strong key={index}>{part.heading}</strong>;
    }

    if (isLineBreakPart(part)) {
        return <br key={index} />;
    }

    if ('noteId' in part && typeof part.noteId === 'number') {
        if (!elements.showFootnotes) {
            return <span key={index}> </span>;
        }
        const noteId = part.noteId;
        return (
            <span key={index} className="fuba-inline-footnote">
                {' '}
                <button
                    type="button"
                    className="fuba-inline-footnote-button"
                    aria-label={`Open footnote ${noteId}`}
                    title={`Open footnote ${noteId}`}
                    onClick={(event) => {
                        event.stopPropagation();
                        onOpenFootnote(noteId);
                    }}
                >
                    <FootnoteIcon />
                </button>
            </span>
        );
    }

    return null;
}

function isVerseEntry(entry: unknown): entry is ChapterVerse {
    return (
        !!entry &&
        typeof entry === 'object' &&
        (entry as { type?: unknown }).type === 'verse' &&
        typeof (entry as ChapterVerse).number === 'number' &&
        Array.isArray((entry as ChapterVerse).content)
    );
}

export interface ChapterContentProps {
    chapter: ApiTranslationBookChapter;
    elements?: ScriptureElements;
    selectedVerses?: BibleSelectedVerse[];
    decorations?: VerseDecoration[];
    /** Highlights to draw. Ones for other chapters are ignored. */
    highlights?: VerseHighlight[];
    /** Extra classes for the container element. */
    className?: string;
    'aria-busy'?: AriaAttributes['aria-busy'];
    /** Called when a verse is clicked. Omit to make verses non-interactive. */
    onVerseClick?: (verse: BibleSelectedVerse, event: MouseEvent) => void;
    onOpenFootnote?: (noteId: number, verse: ChapterVerse | null) => void;
}

/**
 * Renders a chapter's headings, verses, poetry, and footnote markers.
 * Purely presentational — pair it with a `BibleReadingState` through
 * `BibleReader`, or render any chapter on its own.
 */
export function ChapterContent(props: ChapterContentProps) {
    const {
        chapter,
        elements = DEFAULT_SCRIPTURE_ELEMENTS,
        selectedVerses = [],
        decorations = [],
        highlights = [],
        onVerseClick,
        onOpenFootnote = () => {},
    } = props;

    const contentRef = useRef<HTMLDivElement>(null);
    const chapterKey = `${chapter.translation.id}:${chapter.book.id}:${chapter.chapter.number}`;
    const ribbons = useHighlightRibbons(contentRef, chapterKey);

    const chapterHighlights = elements.showHighlights
        ? highlights.filter(
              (highlight) =>
                  (!highlight.translationId ||
                      highlight.translationId === chapter.translation.id) &&
                  highlight.bookId === chapter.book.id &&
                  highlight.chapterNumber === chapter.chapter.number
          )
        : [];
    const getVerseHighlight = (verseNumber: number) =>
        chapterHighlights.find((highlight) => {
            const [first, last] =
                typeof highlight.verse === 'number'
                    ? [highlight.verse, highlight.verse]
                    : highlight.verse;
            return verseNumber >= first && verseNumber <= last;
        }) ?? null;

    // Pointer type of the most recent `pointerdown` on a poetry verse, read by
    // that verse's click handler to decide how forgiving its tap area is.
    const lastVersePointerType = useRef('');

    const getVerseDecorations = (verseNumber: number) =>
        decorations.filter(
            (decoration) =>
                (!decoration.translationId ||
                    decoration.translationId === chapter.translation.id) &&
                decoration.bookId === chapter.book.id &&
                decoration.chapterNumber === chapter.chapter.number &&
                decoration.verses.includes(verseNumber)
        );

    const renderVerseNumber = (verseNumber: number) =>
        elements.showVerseNumbers ? (
            <sup className="fuba-verse-number">{verseNumber}</sup>
        ) : null;

    const renderVerseNode = (value: ChapterVerse, entryIndex: number) => {
        const verse: BibleSelectedVerse = {
            bookId: chapter.book.id,
            chapterNumber: chapter.chapter.number,
            verse: value,
            translationId: chapter.translation.id,
        };
        const isSelected = selectedVerses.some(
            (v) =>
                v.verse.number === value.number &&
                v.bookId === chapter.book.id &&
                v.chapterNumber === chapter.chapter.number
        );
        const content = reorderFootnoteBeforeLineBreak(value.content);
        const segments = splitVerseIntoSegments(content);
        const hasPoetry = segments.some((s) => s.type === 'poetry');
        const verseDecorations = getVerseDecorations(value.number);
        const wholeVerseDecorations = verseDecorations.filter(
            (decoration) => !hasContentTargeting(decoration)
        );
        const contentRanges = toContentDecorationRanges(
            getVersePlainText(value.content),
            verseDecorations.filter(hasContentTargeting)
        );
        let currentTextOffset = 0;
        const getPartTextStartIndex = (part: VersePart) => {
            const startIndex = currentTextOffset;
            currentTextOffset += getInlineText(part).length;
            return startIndex;
        };
        const verseClassName = [
            'fuba-verse',
            hasPoetry ? 'fuba-verse-poetry' : '',
            isSelected ? 'fuba-verse-selected' : '',
        ]
            .filter(Boolean)
            .join(' ');
        const decoratorClassName = [
            'fuba-verse-decorator',
            ...wholeVerseDecorations.map((d) => d.className?.trim() ?? ''),
        ]
            .filter(Boolean)
            .join(' ');
        const decoratorStyle = wholeVerseDecorations.reduce<CSSProperties>(
            (merged, decoration) => ({ ...merged, ...decoration.style }),
            {}
        );
        const renderParts = (parts: VersePart[], keyOffset: number) =>
            parts.map((part, partIndex) =>
                renderInlineContent(
                    part,
                    keyOffset + partIndex,
                    (noteId) => onOpenFootnote(noteId, value),
                    elements,
                    contentRanges,
                    getPartTextStartIndex(part),
                    isFootnotePart(parts[partIndex + 1])
                )
            );
        const interactiveProps = onVerseClick
            ? { role: 'button', tabIndex: 0 }
            : {};

        if (hasPoetry) {
            return (
                <span
                    key={`verse-${entryIndex}`}
                    className={verseClassName}
                    data-verse-number={value.number}
                    {...interactiveProps}
                    onPointerDown={(event) => {
                        lastVersePointerType.current = event.pointerType;
                    }}
                    onClick={(event) => {
                        if (!onVerseClick) {
                            return;
                        }
                        // Poetry lines are blocks spanning the full width, so a
                        // click in the blank space past a short line still lands
                        // in this verse. With a mouse only count clicks on the
                        // words themselves; touch is imprecise, so keep the whole
                        // block tappable there.
                        const target = event.target as HTMLElement | null;
                        const verseTapSelector =
                            lastVersePointerType.current === 'touch'
                                ? '.fuba-verse'
                                : '.fuba-verse-decorator';
                        if (!target?.closest(verseTapSelector)) {
                            return;
                        }
                        onVerseClick(verse, event);
                    }}
                >
                    {segments.map((segment, segIndex) => {
                        if (segment.type === 'inline') {
                            return (
                                <span
                                    key={`seg-${segIndex}-inline`}
                                    className={decoratorClassName}
                                    style={decoratorStyle}
                                >
                                    {segIndex === 0 &&
                                        renderVerseNumber(value.number)}
                                    {renderParts(
                                        segment.parts,
                                        segIndex * 10000
                                    )}
                                </span>
                            );
                        }
                        return segment.lines.map((line, lineIndex) => (
                            <span
                                key={`seg-${segIndex}-line-${lineIndex}`}
                                className="fuba-verse-line"
                                style={{
                                    paddingInlineStart:
                                        line.indentLevel > 0
                                            ? `${line.indentLevel * 30}px`
                                            : undefined,
                                }}
                            >
                                <span
                                    className={decoratorClassName}
                                    style={decoratorStyle}
                                >
                                    {segIndex === 0 &&
                                        lineIndex === 0 &&
                                        renderVerseNumber(value.number)}
                                    {renderParts(line.parts, 0)}
                                </span>
                            </span>
                        ));
                    })}
                </span>
            );
        }

        return (
            <span
                key={`verse-${entryIndex}`}
                className={verseClassName}
                data-verse-number={value.number}
                {...interactiveProps}
                onClick={
                    onVerseClick
                        ? (event) => onVerseClick(verse, event)
                        : undefined
                }
            >
                <span className={decoratorClassName} style={decoratorStyle}>
                    {renderVerseNumber(value.number)}
                    {renderParts(content, 0)}
                </span>
            </span>
        );
    };

    const nodes: ReactNode[] = [];
    // Verse text carries no surrounding spaces of its own; with numbers on, the
    // number's margins keep verses apart. With numbers hidden, adjacent verses
    // would run together ("...your fill.Do not..."), so add a real space.
    const needsVerseSpacing = !elements.showVerseNumbers;
    let previousWasVerse = false;
    // Index just past the last verse already rendered inside a highlight run.
    let highlightRunEnd = 0;
    const entries = chapter.chapter.content;

    entries.forEach((entry, i) => {
        if (!entry || typeof entry !== 'object') {
            return;
        }

        if (entry.type === 'heading' && Array.isArray(entry.content)) {
            previousWasVerse = false;
            if (!elements.showHeadings) {
                return;
            }
            const heading = (entry.content as unknown[])
                .filter((item) => typeof item === 'string')
                .join(' ');
            nodes.push(
                <h3 key={`heading-${i}`} className="fuba-chapter-heading">
                    {heading}
                </h3>
            );
            return;
        }

        if (entry.type === 'line_break') {
            previousWasVerse = false;
            nodes.push(<div key={`break-${i}`} className="fuba-line-break" />);
            return;
        }

        if (entry.type === 'hebrew_subtitle' && Array.isArray(entry.content)) {
            previousWasVerse = false;
            nodes.push(
                <p key={`subtitle-${i}`} className="fuba-subtitle">
                    {entry.content.map((part, index) =>
                        renderInlineContent(
                            part,
                            index,
                            (noteId) => onOpenFootnote(noteId, null),
                            elements,
                            [],
                            0,
                            isFootnotePart(entry.content[index + 1])
                        )
                    )}
                </p>
            );
            return;
        }

        if (isVerseEntry(entry)) {
            if (i < highlightRunEnd) {
                // Already rendered as part of a highlight run that started at an
                // earlier verse.
                return;
            }
            if (needsVerseSpacing && previousWasVerse) {
                nodes.push(<Fragment key={`space-${i}`}> </Fragment>);
            }
            previousWasVerse = true;

            const highlight = getVerseHighlight(entry.number);
            if (!highlight) {
                nodes.push(renderVerseNode(entry, i));
                return;
            }

            // Contiguous same-color prose verses share one wrapper, so the layer
            // draws a single continuous ribbon across them. Poetry stays one verse
            // per wrapper: its indented lines already read as a connected shape.
            const colorKey = highlightColorKey(highlight);
            const runEntries: ChapterVerse[] = [entry];
            let j = i + 1;
            if (!isPoetryVerse(entry)) {
                while (j < entries.length) {
                    const nextEntry = entries[j];
                    if (!isVerseEntry(nextEntry)) break;
                    const nextHighlight = getVerseHighlight(nextEntry.number);
                    if (
                        !nextHighlight ||
                        highlightColorKey(nextHighlight) !== colorKey ||
                        isPoetryVerse(nextEntry)
                    ) {
                        break;
                    }
                    runEntries.push(nextEntry);
                    j += 1;
                }
            }
            highlightRunEnd = j;

            const presentation = highlightPresentation(highlight);
            const firstVerse = runEntries[0]!.number;
            const lastVerse = runEntries[runEntries.length - 1]!.number;
            nodes.push(
                <span
                    key={`highlight-run-${i}`}
                    className={presentation.className}
                    style={presentation.style}
                    data-highlight-fill={presentation.fill}
                    data-highlight-key={`${firstVerse}-${lastVerse}`}
                >
                    {runEntries.flatMap((runEntry, runIndex) => {
                        const verseNode = renderVerseNode(
                            runEntry,
                            i + runIndex
                        );
                        return needsVerseSpacing && runIndex > 0
                            ? [
                                  <Fragment key={`space-${i + runIndex}`}>
                                      {' '}
                                  </Fragment>,
                                  verseNode,
                              ]
                            : [verseNode];
                    })}
                </span>
            );
        }
    });

    return (
        <div
            ref={contentRef}
            className={['fuba-chapter-content', props.className]
                .filter(Boolean)
                .join(' ')}
            aria-busy={props['aria-busy']}
        >
            <HighlightLayer ribbons={ribbons} />
            {nodes}
        </div>
    );
}

function isPoetryVerse(verse: ChapterVerse): boolean {
    return splitVerseIntoSegments(verse.content).some(
        (segment) => segment.type === 'poetry'
    );
}

function highlightColorKey(highlight: VerseHighlight): string {
    return highlight.customColor
        ? `custom:${highlight.customColor}:${highlight.customFontColor ?? ''}`
        : highlight.colorId;
}

/**
 * How a highlighted run's wrapper looks. The wrapper paints no background itself
 * — the ribbon layer draws that behind the text, reading `fill` back off the
 * DOM. The wrapper only carries the readable text color.
 */
function highlightPresentation(highlight: VerseHighlight): {
    className: string;
    style: CSSProperties | undefined;
    fill: string;
} {
    if (highlight.customColor) {
        return {
            className: 'fuba-highlight',
            style: highlight.customFontColor
                ? { color: highlight.customFontColor }
                : undefined,
            fill: highlight.customColor,
        };
    }
    // The `transparent` fallback matters: a color ID with no matching variable
    // would otherwise make `fill` invalid, and SVG `fill` then falls back to
    // black — a solid black bar behind the verse.
    return {
        className: `fuba-highlight fuba-highlight-${highlight.colorId}`,
        style: undefined,
        fill: `var(--fuba-highlight-${highlight.colorId}-color, transparent)`,
    };
}
