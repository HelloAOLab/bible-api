import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import type { BibleReadingState } from './BibleReadingManager.js';
import {
    ChapterContent,
    DEFAULT_SCRIPTURE_ELEMENTS,
    type ReaderTheme,
    type ScriptureElements,
    type VerseHighlight,
} from './ChapterContent.js';
import { useSignalValue } from './hooks.js';
import { themeColorScheme } from './theme.js';

/**
 * How long a chapter switch keeps showing the previous chapter (dimmed) before
 * swapping it for a loading placeholder. Most loads finish well inside this, so
 * the reader never sees a placeholder flash.
 */
export const CHAPTER_SKELETON_DELAY_MS = 500;

/** The reader's built-in text, for translating or rewording the UI. */
export interface BibleReaderLabels {
    previousChapter: string;
    nextChapter: string;
    loading: string;
    chapterUnavailable: string;
    chapterUnavailableDescription: string;
    reload: string;
    bookNotFound: string;
    /** Receives the translation's name. */
    bookNotFoundMessage: (translationName: string) => string;
    /** Receives the first book's name and chapter. */
    goToFirstBook: (bookName: string, chapterNumber: number) => string;
    closeFootnote: string;
}

export const DEFAULT_BIBLE_READER_LABELS: BibleReaderLabels = {
    previousChapter: 'Previous chapter',
    nextChapter: 'Next chapter',
    loading: 'Loading chapter…',
    chapterUnavailable: 'Chapter unavailable',
    chapterUnavailableDescription:
        'We were unable to load the data for this chapter. Please check your internet connection and try again.',
    reload: 'Reload',
    bookNotFound: 'Book not found',
    bookNotFoundMessage: (translationName) =>
        `We couldn't find that book in ${translationName}.`,
    goToFirstBook: (bookName, chapterNumber) =>
        `Go to ${bookName} ${chapterNumber}`,
    closeFootnote: 'Close footnote',
};

export interface BibleReaderProps {
    readingState: BibleReadingState;
    /** Which parts of the text to show. Unset fields default to shown. */
    scriptureElements?: Partial<ScriptureElements>;
    labels?: Partial<BibleReaderLabels>;
    className?: string;
    /** Whether to show the book/chapter title and translation. Defaults to true. */
    showHeader?: boolean;
    /** Whether to show the previous/next chapter buttons. Defaults to true. */
    showNavigation?: boolean;
    /** Whether clicking a verse selects it. Defaults to true. */
    selectableVerses?: boolean;
    /** Extra content shown at the end of the header, such as your own buttons. */
    headerActions?: ReactNode;
    /**
     * Highlights to draw behind the text. Pass all of them; the reader shows the
     * ones for the chapter on screen.
     */
    highlights?: VerseHighlight[];
    /** Forces light or dark colors. Defaults to `system`, which follows the device. */
    theme?: ReaderTheme;
}

const SKELETON_PARAGRAPHS = [
    ['97%', '92%', '99%', '88%', '71%'],
    ['94%', '99%', '90%', '96%', '58%'],
    ['99%', '89%', '95%', '93%', '77%'],
] as const;

function ChapterSkeleton(props: { label: string }) {
    return (
        <div className="fuba-chapter-skeleton" role="status">
            <span className="fuba-visually-hidden">{props.label}</span>
            {SKELETON_PARAGRAPHS.map((widths, paragraphIndex) => (
                <div
                    key={paragraphIndex}
                    className="fuba-chapter-skeleton-paragraph"
                    aria-hidden="true"
                >
                    {widths.map((width, lineIndex) => (
                        <div
                            key={lineIndex}
                            className="fuba-chapter-skeleton-line"
                            style={{ width }}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

/**
 * A complete Bible reader: title, chapter text, previous/next navigation, and
 * footnotes. All state lives in the `BibleReadingState` it is given, so the same
 * state can also drive your own controls (a book picker, say).
 */
export function BibleReader(props: BibleReaderProps) {
    const {
        readingState,
        className,
        showHeader = true,
        showNavigation = true,
        selectableVerses = true,
        headerActions,
        highlights,
        theme,
    } = props;
    const elements: ScriptureElements = {
        ...DEFAULT_SCRIPTURE_ELEMENTS,
        ...props.scriptureElements,
    };
    const labels: BibleReaderLabels = {
        ...DEFAULT_BIBLE_READER_LABELS,
        ...props.labels,
    };

    const translationId = useSignalValue(readingState.translationId);
    const translation = useSignalValue(readingState.translation);
    const bookId = useSignalValue(readingState.bookId);
    const chapterNumber = useSignalValue(readingState.chapterNumber);
    const translationBooks = useSignalValue(readingState.translationBooks);
    const chapterData = useSignalValue(readingState.chapterData);
    const selectedVerses = useSignalValue(readingState.selectedVerses);
    const decorations = useSignalValue(readingState.decorations);
    const selectedFootnote = useSignalValue(readingState.selectedFootnote);
    const loading = useSignalValue(readingState.loading);
    const isContentStale = useSignalValue(readingState.isChapterContentStale);
    const error = useSignalValue(readingState.error);
    const hasNext = useSignalValue(readingState.hasNext);
    const hasPrevious = useSignalValue(readingState.hasPrevious);
    const title = useSignalValue(readingState.title);
    const scrollToVerse = useSignalValue(readingState.scrollToVerse);

    const contentRef = useRef<HTMLDivElement>(null);
    const footnoteTitleId = useId();

    // Keep the previous chapter up (dimmed) for a moment before swapping in the
    // placeholder, so fast loads don't flash.
    const [isWaitLong, setIsWaitLong] = useState(false);
    useEffect(() => {
        if (!isContentStale) {
            setIsWaitLong(false);
            return;
        }
        const timer = setTimeout(
            () => setIsWaitLong(true),
            CHAPTER_SKELETON_DELAY_MS
        );
        return () => clearTimeout(timer);
    }, [isContentStale, translationId, bookId, chapterNumber]);

    useEffect(() => {
        if (scrollToVerse === null || isContentStale) {
            return;
        }
        const verseElement = contentRef.current?.querySelector(
            `[data-verse-number="${scrollToVerse}"]`
        );
        verseElement?.scrollIntoView?.({ block: 'start' });
        readingState.scrollToVerse.value = null;
    }, [scrollToVerse, isContentStale, chapterData, readingState]);

    useEffect(() => {
        if (!selectedFootnote) {
            return;
        }
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                readingState.selectFootnote(null);
            }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [selectedFootnote, readingState]);

    const currentBook =
        translationBooks?.books.find((book) => book.id === bookId) ?? null;
    // The requested book isn't in this translation's book list.
    const bookNotFound =
        !loading &&
        !error &&
        translationBooks !== null &&
        bookId !== null &&
        currentBook === null;
    const showLoadError = !!error && !loading;
    const showSkeleton = isContentStale && (chapterData === null || isWaitLong);
    const dimStaleChapter = isContentStale && !showSkeleton;
    const licenseNotice = translation?.licenseNotice?.trim() ?? '';
    const website = translation?.website?.trim() ?? '';
    const firstBook = translationBooks?.books[0];
    const containerClassNames = decorations
        .filter(
            (decoration) =>
                decoration.containerClassName &&
                decoration.bookId === bookId &&
                decoration.chapterNumber === chapterNumber
        )
        .map((decoration) => decoration.containerClassName);

    const renderNavigationButton = (direction: 'previous' | 'next') => {
        const isNext = direction === 'next';
        return (
            <button
                type="button"
                className={`fuba-bible-reader-nav fuba-bible-reader-nav-${direction}`}
                aria-label={
                    isNext ? labels.nextChapter : labels.previousChapter
                }
                title={isNext ? labels.nextChapter : labels.previousChapter}
                disabled={isNext ? !hasNext : !hasPrevious}
                onClick={() => {
                    void (isNext
                        ? readingState.loadNextChapter()
                        : readingState.loadPreviousChapter());
                }}
            >
                <span aria-hidden="true">{isNext ? '›' : '‹'}</span>
            </button>
        );
    };

    return (
        <div
            className={['fuba-bible-reader', className]
                .filter(Boolean)
                .join(' ')}
            dir={
                translation?.textDirection ??
                chapterData?.translation.textDirection
            }
            lang={translation?.language ?? chapterData?.translation.language}
            style={{ colorScheme: themeColorScheme(theme) }}
        >
            {showHeader && (
                <div className="fuba-bible-reader-header">
                    {showNavigation && renderNavigationButton('previous')}
                    <div className="fuba-bible-reader-heading">
                        <h2 className="fuba-bible-reader-title">
                            {title || bookId || ''}
                        </h2>
                        <span
                            className="fuba-bible-reader-translation"
                            title={translation?.name}
                        >
                            {translation?.shortName ?? translationId}
                        </span>
                    </div>
                    {headerActions}
                    {showNavigation && renderNavigationButton('next')}
                </div>
            )}

            <div
                ref={contentRef}
                className={['fuba-bible-reader-content', ...containerClassNames]
                    .filter(Boolean)
                    .join(' ')}
            >
                {bookNotFound && (
                    <div className="fuba-reader-not-found">
                        <p className="fuba-reader-not-found-title">
                            {labels.bookNotFound}
                        </p>
                        <p className="fuba-reader-not-found-body">
                            {labels.bookNotFoundMessage(
                                translation?.name ?? translationId
                            )}
                        </p>
                        {firstBook && (
                            <button
                                type="button"
                                className="fuba-reader-not-found-action"
                                onClick={() => {
                                    void readingState.selectChapter(
                                        firstBook.id,
                                        firstBook.firstChapterNumber ?? 1
                                    );
                                }}
                            >
                                {labels.goToFirstBook(
                                    firstBook.name,
                                    firstBook.firstChapterNumber ?? 1
                                )}
                            </button>
                        )}
                    </div>
                )}

                {showLoadError && (
                    <div className="fuba-reader-error" role="alert">
                        <h3 className="fuba-reader-error-title">
                            {labels.chapterUnavailable}
                        </h3>
                        <p className="fuba-reader-error-message">
                            {labels.chapterUnavailableDescription}
                        </p>
                        <button
                            type="button"
                            className="fuba-reader-error-retry"
                            onClick={() => void readingState.retryLoad()}
                        >
                            {labels.reload}
                        </button>
                    </div>
                )}

                {!showLoadError &&
                    !bookNotFound &&
                    (showSkeleton ? (
                        <ChapterSkeleton label={labels.loading} />
                    ) : (
                        chapterData && (
                            <ChapterContent
                                className={
                                    dimStaleChapter
                                        ? 'fuba-chapter-content-stale'
                                        : undefined
                                }
                                aria-busy={dimStaleChapter || undefined}
                                chapter={chapterData}
                                elements={elements}
                                selectedVerses={selectedVerses}
                                decorations={decorations}
                                highlights={highlights}
                                onVerseClick={
                                    selectableVerses
                                        ? (verse, event) =>
                                              readingState.selectVerse(
                                                  verse,
                                                  event.clientX,
                                                  event.clientY
                                              )
                                        : undefined
                                }
                                onOpenFootnote={(noteId) =>
                                    readingState.selectFootnote(noteId)
                                }
                            />
                        )
                    ))}

                {!showLoadError && licenseNotice.length > 0 && (
                    <p className="fuba-translation-license-notice">
                        {licenseNotice}
                    </p>
                )}
                {!showLoadError && website.length > 0 && (
                    <p className="fuba-translation-website">
                        <a
                            href={website}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {website}
                        </a>
                    </p>
                )}
            </div>

            {elements.showFootnotes && selectedFootnote && (
                <div
                    className="fuba-footnote-overlay"
                    onClick={() => readingState.selectFootnote(null)}
                >
                    <div
                        className="fuba-footnote-dialog"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={footnoteTitleId}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="fuba-footnote-header">
                            <h3
                                id={footnoteTitleId}
                                className="fuba-footnote-title"
                            >
                                {selectedFootnote.chapter.book.name}{' '}
                                {selectedFootnote.chapter.chapter.number}
                                {selectedFootnote.verse
                                    ? `:${selectedFootnote.verse.number}`
                                    : ''}
                            </h3>
                            <button
                                type="button"
                                className="fuba-footnote-close"
                                aria-label={labels.closeFootnote}
                                title={labels.closeFootnote}
                                onClick={() =>
                                    readingState.selectFootnote(null)
                                }
                            >
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="fuba-footnote-content">
                            {selectedFootnote.note.text}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
