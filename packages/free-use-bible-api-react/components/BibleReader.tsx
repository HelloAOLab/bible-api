import {
    ApiTranslationBookChapter,
    ChapterFootnote,
    ChapterVerse,
} from 'free-use-bible-api';
import { CSSProperties } from 'react';

interface VerseLine {
    indentLevel: number;
    parts: ChapterVerse['content'];
}

function getPoemIndentLevel(part: ChapterVerse['content'][0]) {
    if (
        part &&
        typeof part === 'object' &&
        'text' in part &&
        typeof part.text === 'string' &&
        typeof part.poem === 'number' &&
        part.poem > 0
    ) {
        return part.poem;
    }

    return null;
}

function isFootnotePart(part: ChapterVerse['content'][0]) {
    return (
        !!part &&
        typeof part === 'object' &&
        'noteId' in part &&
        typeof part.noteId === 'number'
    );
}

type VerseSegment =
    | { type: 'inline'; parts: ChapterVerse['content'] }
    | { type: 'poetry'; lines: VerseLine[] };

interface ContentDecorationRange {
    start: number;
    end: number;
    className: string;
    style?: CSSProperties;
}

export interface SelectedFootnote {
    /** The selected footnote definition. */
    note: ChapterFootnote;
    /** Verse that contains the selected footnote reference, if found. */
    verse: ChapterVerse | null;
    /** Full chapter containing the selected footnote. */
    chapter: ApiTranslationBookChapter;
}

export interface VerseDecoration {
    /** Unique decoration identifier used for removal. */
    id: string;
    /** Translation ID this decoration applies to. Null targets the current translation. */
    translationId: string | null;
    /** Book ID this decoration applies to. */
    bookId: string;
    /** Chapter number this decoration applies to. */
    chapterNumber: number;
    /** One or more verse numbers to decorate. */
    verses: number[];
    /** Optional text fragment to target inside the verse content. */
    targetContent?: string;
    /** Optional character start index for range decorations. */
    startIndex?: number;
    /** Optional character end index for range decorations. */
    endIndex?: number;
    /** Optional CSS class to apply to the decorated verse/range. */
    className?: string;
    /** Optional inline style to apply to the decorated verse/range. */
    style?: CSSProperties;
    /** Optional delay in milliseconds before this decoration auto-removes itself. */
    removeAfterMs?: number;

    /**
     * Whether to preserve the decoration when the chapter changes.
     */
    preserveOnChapterChange?: boolean;
}

export interface BibleSelectedVerse {
    /** Book identifier (for example: GEN, MAT). */
    bookId: string;
    /** 1-based chapter number in the selected book. */
    chapterNumber: number;
    /** Verse payload as returned in chapter content. */
    verse: ChapterVerse;
    /** Active translation ID at selection time. */
    translationId: string | null;
    /** Optional X coordinate for contextual menu/tooltip anchoring. */
    selectionX?: number;
    /** Optional Y coordinate for contextual menu/tooltip anchoring. */
    selectionY?: number;
    /** Epoch timestamp indicating when the verse was selected. */
    selectedAt?: number;
}

function getInlineText(part: ChapterVerse['content'][0]): string {
    if (typeof part === 'string') {
        return part;
    }

    if (part && typeof part === 'object' && 'text' in part) {
        return typeof part.text === 'string' ? part.text : '';
    }

    return '';
}

function getVersePlainText(content: ChapterVerse['content']): string {
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

        const hasStart = typeof decoration.startIndex === 'number';
        const hasEnd = typeof decoration.endIndex === 'number';
        const windowStart = hasStart ? clampIndex(decoration.startIndex!) : 0;
        const windowEnd = hasEnd
            ? clampIndex(decoration.endIndex!)
            : verseLength;

        if (windowEnd <= windowStart) {
            return [];
        }

        const targetContent = decoration.targetContent?.trim();
        if (!targetContent) {
            return [
                {
                    start: windowStart,
                    end: windowEnd,
                    className,
                    style,
                },
            ];
        }

        const windowText = verseText.slice(windowStart, windowEnd);
        const ranges: ContentDecorationRange[] = [];
        let searchStart = 0;

        while (searchStart <= windowText.length) {
            const matchStartInWindow = windowText.indexOf(
                targetContent,
                searchStart
            );
            if (matchStartInWindow === -1) {
                break;
            }

            const absoluteStart = windowStart + matchStartInWindow;
            ranges.push({
                start: absoluteStart,
                end: absoluteStart + targetContent.length,
                className,
                style,
            });
            searchStart = matchStartInWindow + targetContent.length;
        }

        return ranges;
    });
}

function splitVerseIntoSegments(
    content: ChapterVerse['content']
): VerseSegment[] {
    const segments: VerseSegment[] = [];
    let currentInlineParts: ChapterVerse['content'] = [];
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
        const isFootnote = isFootnotePart(part);
        const indentLevel = getPoemIndentLevel(part);
        const isLineBreak =
            part &&
            typeof part === 'object' &&
            'lineBreak' in part &&
            part.lineBreak === true;

        if (isFootnote) {
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
        } else if (isLineBreak) {
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

function renderInlineContent(
    part: ChapterVerse['content'][0],
    index: number,
    onOpenFootnote: (noteId: number) => void,
    showHeadings: boolean,
    showFootnotes: boolean,
    showRedLettering: boolean,
    contentRanges: ContentDecorationRange[] = [],
    partStartIndex = 0
) {
    const splitTextByDecorations = (text: string) => {
        const partEndIndex = partStartIndex + text.length;
        const ranges = contentRanges
            .filter(
                (range) =>
                    range.end > partStartIndex && range.start < partEndIndex
            )
            .map((range) => ({
                start: Math.max(0, range.start - partStartIndex),
                end: Math.min(text.length, range.end - partStartIndex),
                className: range.className,
                style: range.style,
            }))
            .sort((left, right) => {
                if (left.start !== right.start) {
                    return left.start - right.start;
                }
                return left.end - right.end;
            });

        if (ranges.length === 0) {
            return [
                {
                    text,
                    className: '',
                    style: undefined as CSSProperties | undefined,
                },
            ];
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
            if (segmentStart === segmentEnd) {
                continue;
            }

            const segmentText = text.slice(segmentStart, segmentEnd);
            if (!segmentText) {
                continue;
            }

            const activeRanges = ranges.filter(
                (range) =>
                    segmentStart >= range.start && segmentEnd <= range.end
            );
            const className = activeRanges
                .map((range) => range.className)
                .filter((name) => name.length > 0)
                .join(' ');
            const style = activeRanges.reduce<CSSProperties | undefined>(
                (merged, range) => {
                    if (!range.style) {
                        return merged;
                    }

                    return {
                        ...(merged ?? {}),
                        ...range.style,
                    };
                },
                undefined
            );

            segments.push({
                text: segmentText,
                className,
                style,
            });
        }

        return segments;
    };

    if (typeof part === 'string') {
        const segments = splitTextByDecorations(part);
        return (
            <span key={index}>
                {segments.map((segment, segmentIndex) => (
                    <span
                        key={`${index}-${segmentIndex}`}
                        className={segment.className}
                        style={segment.style}
                    >
                        {segment.text}
                    </span>
                ))}
            </span>
        );
    }

    if (!part || typeof part !== 'object') {
        return null;
    }

    if ('text' in part && typeof part.text === 'string') {
        let className = '';
        if (part.wordsOfJesus && showRedLettering) {
            className += ' sb-words-of-jesus';
        }

        const segments = splitTextByDecorations(part.text);
        return (
            <span key={index} className={className.trim()}>
                {segments.map((segment, segmentIndex) => (
                    <span
                        key={`${index}-${segmentIndex}`}
                        className={segment.className}
                        style={segment.style}
                    >
                        {(index > 0 ? ' ' : '') + segment.text}
                    </span>
                ))}
            </span>
        );
    }

    if ('heading' in part && typeof part.heading === 'string') {
        if (!showHeadings) {
            return null;
        }
        return <strong key={index}>{part.heading}</strong>;
    }

    if ('lineBreak' in part && part.lineBreak === true) {
        return <br key={index} />;
    }

    if ('noteId' in part && typeof part.noteId === 'number') {
        if (!showFootnotes) {
            return <span> </span>;
        }
        return (
            <button
                key={index}
                className="sb-inline-footnote-button"
                aria-label={`Open footnote ${part.noteId}`}
                title={`Open footnote ${part.noteId}`}
                onClick={(event: React.MouseEvent) => {
                    event.stopPropagation();
                    onOpenFootnote(part.noteId);
                }}
            >
                <span className="material-symbols-outlined">info</span>
            </button>
        );
    }

    return null;
}

function renderChapterContent(
    chapterData: ApiTranslationBookChapter | null,
    onVerseClick: (verse: BibleSelectedVerse, event: MouseEvent) => void,
    selectedVerses: BibleSelectedVerse[],
    onOpenFootnote: (noteId: number, verse: ChapterVerse | null) => void,
    decorations: VerseDecoration[],
    scriptureElements: ScriptureElements
) {
    if (!chapterData) {
        return null;
    }

    const getDecorationPresentation = (verseDecorations: VerseDecoration[]) => {
        const matchingDecorations = verseDecorations.filter((decoration) => {
            return !hasContentTargeting(decoration);
        });

        return matchingDecorations.reduce(
            (presentation, decoration) => ({
                className: decoration.className
                    ? `${presentation.className} ${decoration.className}`
                    : presentation.className,
                style: decoration.style
                    ? {
                          ...(presentation.style ?? {}),
                          ...decoration.style,
                      }
                    : presentation.style,
            }),
            {
                className: '',
                style: undefined as CSSProperties | undefined,
            }
        );
    };

    const getVerseDecorations = (verseNumber: number) => {
        return decorations.filter(
            (decoration) =>
                (!decoration.translationId ||
                    decoration.translationId === chapterData.translation.id) &&
                decoration.bookId === chapterData.book.id &&
                decoration.chapterNumber === chapterData.chapter.number &&
                decoration.verses.includes(verseNumber)
        );
    };

    const entries = chapterData.chapter.content;
    return entries.map((entry, entryIndex) => {
        if (!entry || typeof entry !== 'object') {
            return null;
        }

        const value = entry;

        if (value.type === 'heading' && Array.isArray(value.content)) {
            if (!scriptureElements.showHeadings) {
                return null;
            }
            const heading = (value.content as unknown[])
                .filter((item) => typeof item === 'string')
                .join(' ');
            return (
                <h3
                    key={`heading-${entryIndex}`}
                    className="sb-chapter-heading"
                >
                    {heading}
                </h3>
            );
        }

        if (value.type === 'line_break') {
            return (
                <div key={`break-${entryIndex}`} className="sb-line-break" />
            );
        }

        if (value.type === 'hebrew_subtitle' && Array.isArray(value.content)) {
            return (
                <p key={`subtitle-${entryIndex}`} className="sb-subtitle">
                    {value.content.map((part, index) =>
                        renderInlineContent(
                            part,
                            index,
                            (noteId) => onOpenFootnote(noteId, null),
                            scriptureElements.showHeadings,
                            scriptureElements.showFootnotes,
                            scriptureElements.showRedLettering
                        )
                    )}
                </p>
            );
        }

        if (
            value.type === 'verse' &&
            typeof value.number === 'number' &&
            Array.isArray(value.content)
        ) {
            const verse: BibleSelectedVerse = {
                bookId: chapterData.book.id,
                chapterNumber: chapterData.chapter.number,
                verse: value,
                translationId: chapterData.translation.id,
            };
            const isSelected = selectedVerses.some(
                (v) =>
                    v.verse.number === value.number &&
                    v.bookId === chapterData.book.id &&
                    v.chapterNumber === chapterData.chapter.number
            );
            const segments = splitVerseIntoSegments(value.content);
            const hasPoetry = segments.some((s) => s.type === 'poetry');
            const highlight = scriptureElements.showHighlights
                ? getVerseHighlight(value.number)
                : null;
            const highlightPresentation = getHighlightPresentation(highlight);
            const verseDecorations = getVerseDecorations(value.number);
            const decorationPresentation =
                getDecorationPresentation(verseDecorations);
            const contentDecorations = verseDecorations.filter((decoration) =>
                hasContentTargeting(decoration)
            );
            const contentRanges = toContentDecorationRanges(
                getVersePlainText(value.content),
                contentDecorations
            );
            let currentTextOffset = 0;
            const getPartTextStartIndex = (
                part: ChapterVerse['content'][0]
            ) => {
                const startIndex = currentTextOffset;
                currentTextOffset += getInlineText(part).length;
                return startIndex;
            };
            const verseClassName = [
                'sb-verse',
                hasPoetry ? 'sb-verse-poetry' : '',
                isSelected ? 'sb-verse-selected' : '',
            ]
                .filter(Boolean)
                .join(' ');
            const verseDecoratorClassName = [
                'sb-verse-decorator',
                highlightPresentation.className.trim(),
                decorationPresentation.className.trim(),
            ]
                .filter(Boolean)
                .join(' ');
            const verseDecoratorStyle = {
                ...(highlightPresentation.style ?? {}),
                ...(decorationPresentation.style ?? {}),
            };

            if (hasPoetry) {
                return (
                    <span
                        key={`verse-${entryIndex}`}
                        className={verseClassName}
                        data-verse-number={value.number}
                        onClick={(event: MouseEvent) => {
                            onVerseClick(verse, event);
                        }}
                        style={{
                            cursor: 'pointer',
                        }}
                        role="button"
                        tabIndex={0}
                    >
                        {segments.map((segment, segIndex) => {
                            if (segment.type === 'inline') {
                                return (
                                    <span
                                        key={`verse-${entryIndex}-seg-${segIndex}-inline`}
                                        className={verseDecoratorClassName}
                                        style={verseDecoratorStyle}
                                    >
                                        {segIndex === 0 &&
                                            scriptureElements.showVerseNumbers && (
                                                <sup className="sb-verse-number">
                                                    {value.number}
                                                </sup>
                                            )}
                                        {segment.parts.map((part, partIndex) =>
                                            renderInlineContent(
                                                part,
                                                segIndex * 10000 + partIndex,
                                                (noteId) =>
                                                    onOpenFootnote(
                                                        noteId,
                                                        value
                                                    ),
                                                scriptureElements.showHeadings,
                                                scriptureElements.showFootnotes,
                                                scriptureElements.showRedLettering,
                                                contentRanges,
                                                getPartTextStartIndex(part)
                                            )
                                        )}
                                    </span>
                                );
                            }
                            return segment.lines.map((line, lineIndex) => (
                                <span
                                    key={`verse-${entryIndex}-seg-${segIndex}-line-${lineIndex}`}
                                    className="sb-verse-line"
                                    style={{
                                        paddingInlineStart:
                                            line.indentLevel > 0
                                                ? `${line.indentLevel * 30}px`
                                                : undefined,
                                    }}
                                >
                                    <span
                                        className={verseDecoratorClassName}
                                        style={verseDecoratorStyle}
                                    >
                                        {segIndex === 0 &&
                                            lineIndex === 0 &&
                                            scriptureElements.showVerseNumbers && (
                                                <sup className="sb-verse-number">
                                                    {value.number}
                                                </sup>
                                            )}
                                        {line.parts.map((part, partIndex) =>
                                            renderInlineContent(
                                                part,
                                                partIndex,
                                                (noteId) =>
                                                    onOpenFootnote(
                                                        noteId,
                                                        value
                                                    ),
                                                scriptureElements.showHeadings,
                                                scriptureElements.showFootnotes,
                                                scriptureElements.showRedLettering,
                                                contentRanges,
                                                getPartTextStartIndex(part)
                                            )
                                        )}
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
                    onClick={(event: MouseEvent) => {
                        onVerseClick(verse, event);
                    }}
                    style={{
                        cursor: 'pointer',
                    }}
                    role="button"
                    tabIndex={0}
                >
                    <span
                        className={verseDecoratorClassName}
                        style={verseDecoratorStyle}
                    >
                        {scriptureElements.showVerseNumbers && (
                            <sup className="sb-verse-number">
                                {value.number}
                            </sup>
                        )}
                        {value.content.map((part, index) =>
                            renderInlineContent(
                                part,
                                index,
                                (noteId) => onOpenFootnote(noteId, value),
                                scriptureElements.showHeadings,
                                scriptureElements.showFootnotes,
                                scriptureElements.showRedLettering,
                                contentRanges,
                                getPartTextStartIndex(part)
                            )
                        )}
                    </span>
                </span>
            );
        }

        return null;
    });
}

interface BibleReaderProps {
    chapter: ApiTranslationBookChapter;
    scriptureElements?: ScriptureElements;
}

export interface ScriptureElements {
    showHeadings: boolean;
    showVerseNumbers: boolean;
    showFootnotes: boolean;
    showHighlights: boolean;
    showRedLettering: boolean;
}

export function BibleReader(props: BibleReaderProps) {
    const { chapter } = props;
    const { translation, book } = chapter;

    const translationLicenseNotice = translation.licenseNotice?.trim() ?? '';
    const translationWebsite = translation.website?.trim() ?? '';

    const scriptureElements: ScriptureElements = props.scriptureElements ?? {
        showHeadings: true,
        showVerseNumbers: true,
        showFootnotes: true,
        showHighlights: true,
        showRedLettering: true,
    };

    const openBookSelector = () => {};
    const openTranslationSelector = () => {};

    const renderMainContent = () => (
        <>
            <div className="sb-chapter-content">
                {renderChapterContent(
                    chapter,
                    (verse, event) => {},
                    [],
                    (noteId) => {},
                    [],
                    scriptureElements
                )}
            </div>

            {translationLicenseNotice.length > 0 && (
                <>
                    <p className="sb-translation-license-notice">
                        {translationLicenseNotice}
                    </p>
                    {translationWebsite.length > 0 && (
                        <p className="sb-translation-website">
                            <a
                                href={translationWebsite}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {translationWebsite}
                            </a>
                        </p>
                    )}
                </>
            )}
        </>
    );

    return (
        <div
            className={`sb-bible-reader`}
            dir={translation.textDirection ?? 'auto'}
        >
            <h2
                onClick={() => selectorState.setOpen(true, currentPane)}
                className="sb-bible-reader-title"
            >
                <span className="sb-bible-reader-book">{book.name}</span>
                {String.fromCharCode(160)}
                <span className="sb-bible-reader-chapter">
                    {chapterData.number}
                </span>
                {String.fromCharCode(160)}
                <span className="sb-bible-reader-translation">
                    /{String.fromCharCode(160)}
                    {translation.id}
                </span>
            </h2>
            {renderMainContent()}

            {scriptureElements.showFootnotes &&
                selectedFootnote.value !== null && (
                    <div
                        className="sb-footnote-modal-overlay"
                        onClick={() => {
                            selectFootnote(null);
                        }}
                    >
                        <div
                            className="sb-footnote-modal"
                            onClick={(
                                event: React.MouseEvent<HTMLDivElement>
                            ) => {
                                event.stopPropagation();
                            }}
                        >
                            <div className="sb-footnote-modal-header">
                                <h3 className="sb-footnote-modal-title">
                                    {selectedFootnote.value.chapter.book.name}{' '}
                                    {
                                        selectedFootnote.value.chapter.chapter
                                            .number
                                    }
                                    {selectedFootnote.value.verse
                                        ? ':' +
                                          selectedFootnote.value.verse.number
                                        : ''}
                                </h3>
                                <button
                                    className="sb-footnote-modal-close"
                                    aria-label={t('close-footnote', {
                                        defaultValue: 'Close footnote',
                                    })}
                                    onClick={() => {
                                        selectFootnote(null);
                                    }}
                                >
                                    <span className="material-symbols-outlined">
                                        close
                                    </span>
                                </button>
                            </div>

                            <div className="sb-footnote-modal-content">
                                {selectedFootnote.value.note.text}
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
}
