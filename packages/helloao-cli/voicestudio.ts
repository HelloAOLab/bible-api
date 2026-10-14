import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { log } from '@helloao/tools';
import type {
    ChapterContent,
    ChapterData,
    ChapterVerse,
} from '@helloao/tools/generation/common-types.js';
import { getBookId } from '@helloao/tools/utils.js';

/**
 * The kinds of sections that a chapter is split into for reading.
 *
 * - `prose` is a paragraph of ordinary text.
 * - `poetry` is a stanza of poetic lines (e.g. Psalms, prophetic oracles, songs).
 * - `subtitle` is a Hebrew subtitle (superscription) such as "A Psalm of David."
 */
export type ReadingSectionKind = 'prose' | 'poetry' | 'subtitle';

/**
 * The instructions that control how each kind of section is read aloud.
 * All durations are in milliseconds.
 *
 * VoiceStudio renders a `[pause Nms]` marker as real silence on every engine, so
 * these instructions are expressed by splitting the text into spans and placing
 * pause markers between them.
 */
export interface ReadingInstructions {
    /**
     * The pause after a sentence (after `.`, `!`, or `?`).
     * Applies to every kind of section, including inside a line of poetry.
     */
    sentencePauseMs: number;

    /**
     * The pause between the pieces of a sentence that is too long to synthesize in one span
     * (see `maxSpanChars`). The sentence is split at a clause boundary (`;`, `:`, `—`, or `,`).
     */
    clausePauseMs: number;

    /**
     * The pause after a line of poetry.
     * Used when the next line is at the same or a deeper indent, which usually means that
     * it continues or echoes the current line.
     */
    poetryLinePauseMs: number;

    /**
     * The pause after a line of poetry that closes a group of lines.
     * Used when the next line returns to a shallower indent (e.g. the end of a couplet).
     */
    poetryLineGroupPauseMs: number;

    /**
     * The pause between prose and poetry when the text flows from one into the other
     * without a paragraph break (e.g. "Hannah prayed, and said," followed by her song).
     */
    transitionPauseMs: number;

    /**
     * The pause between paragraphs of prose and between stanzas of poetry.
     */
    paragraphPauseMs: number;

    /**
     * The pause after a Hebrew subtitle.
     */
    subtitlePauseMs: number;

    /**
     * The pause between sections of a chapter (where a heading would be shown).
     * Headings themselves are never read.
     */
    sectionPauseMs: number;

    /**
     * The speed multiplier for each kind of section. Multiplied with the base speed.
     */
    speed: Record<ReadingSectionKind, number>;

    /**
     * The maximum number of characters in a single span (the text between two pauses).
     * VoiceStudio does not chunk text that contains pause markers, so longer
     * sentences are split at a clause boundary.
     */
    maxSpanChars: number;
}

/**
 * The default reading instructions.
 */
export const DEFAULT_READING_INSTRUCTIONS: ReadingInstructions = {
    sentencePauseMs: 300,
    clausePauseMs: 150,
    poetryLinePauseMs: 500,
    poetryLineGroupPauseMs: 750,
    transitionPauseMs: 600,
    paragraphPauseMs: 900,
    subtitlePauseMs: 1000,
    sectionPauseMs: 1500,
    speed: {
        prose: 1,
        poetry: 0.95,
        subtitle: 0.95,
    },
    maxSpanChars: 400,
};

/**
 * A piece of text that is synthesized in one go, followed by a pause.
 */
export interface ReadingSpan {
    text: string;

    /**
     * The silence after the span, in milliseconds.
     */
    pauseAfterMs: number;
}

/**
 * A section of a chapter that is read in a single style.
 */
export interface ReadingSection {
    kind: ReadingSectionKind;

    /**
     * The first and last verse numbers that the section contains text from.
     * Informational only. Verse markers do not affect how the text is read.
     */
    verses: [number, number] | null;

    /**
     * The speed multiplier for the section.
     */
    speed: number;

    /**
     * The spans of the section, in order.
     * The pause after the last span is the pause between this section and the next one.
     */
    spans: ReadingSpan[];
}

/**
 * The strength of a break between two pieces of text. Higher numbers are stronger.
 */
enum Break {
    None = 0,
    Line = 1,
    Paragraph = 2,
    Subtitle = 3,
    Section = 4,
}

interface Line {
    /**
     * The indent level of the line. Undefined for prose and subtitles.
     */
    level?: number;
    pieces: string[];
}

interface DraftSection {
    kind: ReadingSectionKind;
    lines: Line[];
    firstVerse: number | null;
    lastVerse: number | null;
    breakAfter: Break;
}

/**
 * Splits the given chapter into sections and spans that can be read aloud.
 *
 * - Headings (including headings inside verses) are not read. They become a section pause.
 * - Footnote references are skipped.
 * - Verse markers are ignored: text flows across verse boundaries as if they weren't there.
 * - Poetry is read line by line. Each line is followed by a pause, which is longer when the
 *   line closes a group of lines.
 * - Prose is read paragraph by paragraph with a brief pause after each sentence.
 * - Hebrew subtitles are read as their own section with a pause after them.
 *
 * @param chapter The chapter to plan.
 * @param instructions The reading instructions to use.
 */
export function planChapterReading(
    chapter: Pick<ChapterData, 'content'>,
    instructions: ReadingInstructions = DEFAULT_READING_INSTRUCTIONS
): ReadingSection[] {
    const drafts: DraftSection[] = [];
    let current: DraftSection | null = null;
    let pendingBreak = Break.None;

    // State used to decide whether a piece of poetry starts a new line.
    let lastPoem: {
        verse: number | null;
        wordsOfJesus: boolean;
        separatedByNote: boolean;
    } | null = null;

    const addBreak = (b: Break) => {
        pendingBreak = Math.max(pendingBreak, b);
    };

    const startSection = (kind: ReadingSectionKind) => {
        if (current) {
            current.breakAfter = Math.max(
                pendingBreak,
                // Prose flowing directly into poetry (or back) without a marked break.
                Break.Line
            );
        }
        current = {
            kind,
            lines: [],
            firstVerse: null,
            lastVerse: null,
            breakAfter: Break.None,
        };
        drafts.push(current);
        pendingBreak = Break.None;
        lastPoem = null;
        return current;
    };

    const addText = (
        text: string,
        kind: ReadingSectionKind,
        verse: number | null,
        poem?: { level: number; wordsOfJesus: boolean }
    ) => {
        const cleaned = cleanText(text);
        if (!cleaned) {
            return;
        }

        let section: DraftSection = current!;
        if (
            !current ||
            current.kind !== kind ||
            pendingBreak >= Break.Paragraph ||
            // An explicit line break in prose (or a subtitle) is a paragraph break.
            (kind !== 'poetry' && pendingBreak >= Break.Line)
        ) {
            if (current && pendingBreak === Break.Line) {
                pendingBreak = Break.Paragraph;
            }
            section = startSection(kind);
        }

        const lastLine = section.lines[section.lines.length - 1];
        let newLine = !lastLine;
        if (poem && lastLine && lastPoem) {
            // A new line of poetry starts on an explicit line break or a change of indent.
            // Within a verse, two adjacent pieces of poetry with the same formatting are
            // only separate if they came from separate lines. Pieces that were split by a
            // footnote or a change in formatting (e.g. words of Jesus) are on the same line.
            // Across verses, a piece with the same indent continues the line
            // because verse markers should not affect the reading.
            newLine =
                pendingBreak >= Break.Line ||
                lastLine.level !== poem.level ||
                (lastPoem.verse === verse &&
                    !lastPoem.separatedByNote &&
                    lastPoem.wordsOfJesus === poem.wordsOfJesus);
        }

        if (newLine) {
            section.lines.push({ level: poem?.level, pieces: [cleaned] });
        } else {
            lastLine.pieces.push(cleaned);
        }

        if (verse !== null) {
            section.firstVerse ??= verse;
            section.lastVerse = verse;
        }

        lastPoem = poem
            ? {
                  verse,
                  wordsOfJesus: poem.wordsOfJesus,
                  separatedByNote: false,
              }
            : null;
        pendingBreak = Break.None;
    };

    for (const content of chapter.content) {
        switch (content.type) {
            case 'heading':
                addBreak(Break.Section);
                break;
            case 'line_break':
                addBreak(Break.Paragraph);
                break;
            case 'hebrew_subtitle':
                addBreak(Break.Paragraph);
                startSection('subtitle');
                for (const item of content.content) {
                    if (typeof item === 'string') {
                        addText(item, 'subtitle', null);
                    } else if ('text' in item) {
                        addText(item.text, 'subtitle', null);
                    }
                }
                addBreak(Break.Subtitle);
                break;
            case 'verse':
                addVerse(content);
                break;
        }
    }

    function addVerse(verse: ChapterVerse) {
        for (const item of verse.content) {
            if (typeof item === 'string') {
                addText(item, 'prose', verse.number);
            } else if ('text' in item) {
                if (typeof item.poem === 'number') {
                    addText(item.text, 'poetry', verse.number, {
                        level: item.poem,
                        wordsOfJesus: !!item.wordsOfJesus,
                    });
                } else {
                    addText(item.text, 'prose', verse.number);
                }
            } else if ('heading' in item) {
                addBreak(Break.Section);
            } else if ('lineBreak' in item) {
                addBreak(Break.Line);
            } else if ('noteId' in item) {
                if (lastPoem) {
                    lastPoem.separatedByNote = true;
                }
            }
        }
    }

    return drafts
        .filter((d) => d.lines.length > 0)
        .map((draft, index, all) =>
            renderSection(
                draft,
                index < all.length - 1 ? draft.breakAfter : Break.None,
                instructions
            )
        );
}

function renderSection(
    draft: DraftSection,
    breakAfter: Break,
    instructions: ReadingInstructions
): ReadingSection {
    const spans: ReadingSpan[] = [];
    draft.lines.forEach((line, index) => {
        const next = draft.lines[index + 1];
        let pauseAfterLine: number;
        if (next) {
            pauseAfterLine =
                next.level !== undefined &&
                line.level !== undefined &&
                next.level < line.level
                    ? instructions.poetryLineGroupPauseMs
                    : instructions.poetryLinePauseMs;
        } else {
            pauseAfterLine = sectionPause(breakAfter, instructions);
        }

        const sentences = splitSentences(joinPieces(line.pieces));
        sentences.forEach((sentence, sentenceIndex) => {
            const parts = splitLongText(sentence, instructions.maxSpanChars);
            parts.forEach((part, partIndex) => {
                const lastPart = partIndex === parts.length - 1;
                const lastSentence = sentenceIndex === sentences.length - 1;
                spans.push({
                    text: part,
                    pauseAfterMs: !lastPart
                        ? instructions.clausePauseMs
                        : !lastSentence
                          ? instructions.sentencePauseMs
                          : pauseAfterLine,
                });
            });
        });
    });

    return {
        kind: draft.kind,
        verses:
            draft.firstVerse !== null && draft.lastVerse !== null
                ? [draft.firstVerse, draft.lastVerse]
                : null,
        speed: instructions.speed[draft.kind],
        spans,
    };
}

function sectionPause(b: Break, instructions: ReadingInstructions): number {
    switch (b) {
        case Break.Section:
            return instructions.sectionPauseMs;
        case Break.Subtitle:
            return instructions.subtitlePauseMs;
        case Break.Paragraph:
            return instructions.paragraphPauseMs;
        case Break.Line:
            return instructions.transitionPauseMs;
        default:
            return 0;
    }
}

/**
 * Removes characters that VoiceStudio would interpret as markup (square brackets start tags
 * like `[pause]` or `[[pronunciation]]`) and normalizes whitespace.
 */
function cleanText(text: string): string {
    return text.replace(/[[\]]/g, '').replace(/\s+/g, ' ').trim();
}

/**
 * Joins pieces of text with spaces, except before closing punctuation.
 */
export function joinPieces(pieces: string[]): string {
    let result = '';
    for (const piece of pieces) {
        if (
            !result ||
            /^[,.;:!?)\]}”’»]/.test(piece) ||
            /[(“‘«—]$/.test(result)
        ) {
            result += piece;
        } else {
            result += ' ' + piece;
        }
    }
    return result;
}

/**
 * Splits text into sentences after `.`, `!`, `?`, or `…` (and any closing quotes or brackets).
 * A period followed by a lowercase letter does not end a sentence.
 */
export function splitSentences(text: string): string[] {
    return text
        .split(/(?<=[.!?…]["'”’»)\]]*)\s+(?!\p{Ll})/u)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
}

/**
 * Splits text that is longer than the given number of characters at clause boundaries,
 * falling back to word boundaries.
 */
export function splitLongText(text: string, maxChars: number): string[] {
    const parts: string[] = [];
    let remaining = text;
    while (remaining.length > maxChars) {
        const window = remaining.slice(0, maxChars + 1);
        const cut =
            lastBoundary(window, /[;:—–]\s*/g) ??
            lastBoundary(window, /,\s+/g) ??
            lastBoundary(window, /\s+/g);
        if (!cut) {
            break;
        }
        parts.push(remaining.slice(0, cut).trim());
        remaining = remaining.slice(cut).trim();
    }
    if (remaining) {
        parts.push(remaining);
    }
    return parts;
}

function lastBoundary(text: string, regex: RegExp): number | null {
    let result: number | null = null;
    for (const match of text.matchAll(regex)) {
        const end = match.index! + match[0].length;
        // Don't cut so early that the first piece is tiny.
        if (end > text.length / 3 && end <= text.length) {
            result = end;
        }
    }
    return result;
}

/**
 * Formats a pause in the VoiceStudio pause marker syntax.
 */
function pauseMarker(ms: number): string {
    return `[pause ${Math.round(ms)}ms]`;
}

/**
 * A single request to the VoiceStudio `/generate` API.
 */
export interface VoiceStudioRequest {
    section: ReadingSection;

    /**
     * The text to send, with pause markers between the spans.
     */
    text: string;

    /**
     * The silence to add after the generated audio, in milliseconds.
     */
    pauseAfterMs: number;
}

/**
 * Groups the spans of the given sections into requests.
 * Each section is sent separately (so that it can be read at its own speed) and
 * sections that are longer than the given number of characters are split between spans.
 *
 * The pause after the last span of each request is added locally instead of being sent
 * as a trailing pause marker.
 */
export function createVoiceStudioRequests(
    sections: ReadingSection[],
    maxRequestChars: number
): VoiceStudioRequest[] {
    const requests: VoiceStudioRequest[] = [];
    for (const section of sections) {
        let spans: ReadingSpan[] = [];
        let length = 0;
        const flush = () => {
            if (spans.length === 0) {
                return;
            }
            let text = '';
            spans.forEach((span, i) => {
                text += span.text;
                if (i < spans.length - 1) {
                    text +=
                        span.pauseAfterMs > 0
                            ? ` ${pauseMarker(span.pauseAfterMs)} `
                            : ' ';
                }
            });
            requests.push({
                section,
                text,
                pauseAfterMs: spans[spans.length - 1].pauseAfterMs,
            });
            spans = [];
            length = 0;
        };

        for (const span of section.spans) {
            if (
                spans.length > 0 &&
                length + span.text.length > maxRequestChars
            ) {
                flush();
            }
            spans.push(span);
            length += span.text.length;
        }
        flush();
    }
    return requests;
}

/**
 * Formats the given sections as a human-readable script.
 */
export function formatReadingScript(sections: ReadingSection[]): string {
    return sections
        .map((section) => {
            const verses = section.verses
                ? section.verses[0] === section.verses[1]
                    ? ` v${section.verses[0]}`
                    : ` v${section.verses[0]}-${section.verses[1]}`
                : '';
            const header = `## ${section.kind}${verses} (speed ${section.speed})`;
            const body = section.spans
                .map((span) =>
                    span.pauseAfterMs > 0
                        ? `${span.text} ${pauseMarker(span.pauseAfterMs)}`
                        : span.text
                )
                .join('\n');
            return `${header}\n${body}`;
        })
        .join('\n\n');
}

/**
 * The parts of a WAV file that are needed to join WAV files together.
 */
export interface WavAudio {
    /**
     * The raw bytes of the `fmt ` chunk.
     */
    format: Buffer;
    audioFormat: number;
    channels: number;
    sampleRate: number;
    bitsPerSample: number;
    blockAlign: number;
    data: Buffer;
}

/**
 * Parses a RIFF/WAVE file.
 */
export function parseWav(buffer: Buffer): WavAudio {
    if (
        buffer.length < 12 ||
        buffer.toString('ascii', 0, 4) !== 'RIFF' ||
        buffer.toString('ascii', 8, 12) !== 'WAVE'
    ) {
        throw new Error('The audio is not a WAV file.');
    }

    let format: Buffer | null = null;
    let data: Buffer | null = null;
    let offset = 12;
    while (offset + 8 <= buffer.length) {
        const id = buffer.toString('ascii', offset, offset + 4);
        const size = buffer.readUInt32LE(offset + 4);
        const start = offset + 8;
        // Streamed WAVs may have a placeholder size, so clamp to the end of the buffer.
        const end = Math.min(start + size, buffer.length);
        if (id === 'fmt ') {
            format = buffer.subarray(start, end);
        } else if (id === 'data') {
            data = buffer.subarray(start, end);
        }
        offset = end + (size % 2);
    }

    if (!format || format.length < 16 || !data) {
        throw new Error('The WAV file is missing its fmt or data chunk.');
    }

    return {
        format,
        audioFormat: format.readUInt16LE(0),
        channels: format.readUInt16LE(2),
        sampleRate: format.readUInt32LE(4),
        blockAlign: format.readUInt16LE(12),
        bitsPerSample: format.readUInt16LE(14),
        data,
    };
}

/**
 * Joins the given WAV audio clips into a single WAV file,
 * inserting the given amount of silence after each clip.
 */
export function joinWavs(
    clips: { audio: WavAudio; silenceAfterMs: number }[]
): Buffer {
    if (clips.length === 0) {
        throw new Error('There is no audio to join.');
    }

    const first = clips[0].audio;
    const parts: Buffer[] = [];
    for (const { audio, silenceAfterMs } of clips) {
        if (
            audio.audioFormat !== first.audioFormat ||
            audio.channels !== first.channels ||
            audio.sampleRate !== first.sampleRate ||
            audio.bitsPerSample !== first.bitsPerSample
        ) {
            throw new Error(
                'Cannot join WAV files with different formats. Make sure every request uses the same engine and settings.'
            );
        }
        parts.push(audio.data);
        const frames = Math.round((first.sampleRate * silenceAfterMs) / 1000);
        if (frames > 0) {
            // 8-bit PCM is unsigned, so its silence is 128 instead of 0.
            parts.push(
                Buffer.alloc(
                    frames * first.blockAlign,
                    first.bitsPerSample === 8 ? 0x80 : 0
                )
            );
        }
    }

    const dataLength = parts.reduce((sum, p) => sum + p.length, 0);
    const header = Buffer.alloc(12 + 8 + first.format.length + 8);
    let offset = 0;
    offset = header.write('RIFF', offset, 'ascii');
    offset = header.writeUInt32LE(header.length - 8 + dataLength, offset);
    offset += header.write('WAVE', offset, 'ascii');
    offset += header.write('fmt ', offset, 'ascii');
    offset = header.writeUInt32LE(first.format.length, offset);
    offset += first.format.copy(header, offset);
    offset += header.write('data', offset, 'ascii');
    header.writeUInt32LE(dataLength, offset);

    return Buffer.concat([header, ...parts]);
}

export interface GenerateChapterAudioOptions {
    /**
     * The path to the database to load the chapter from.
     */
    db?: string | null;

    /**
     * The path to a chapter JSON file to load the chapter from.
     * Either a `ChapterData` object or a Free Use Bible API chapter response.
     */
    input?: string;

    /**
     * The URL of the Free Use Bible API to load the chapter from when no database or input is given.
     */
    apiUrl?: string;

    /**
     * The path that the audio should be written to.
     */
    output?: string;

    /**
     * The path that the reading script should be written to.
     */
    script?: string;

    /**
     * Whether to only print the reading script without generating audio.
     */
    dryRun?: boolean;

    /**
     * The base URL of the VoiceStudio server.
     */
    voicestudioUrl?: string;

    /**
     * The VoiceStudio API key.
     */
    apiKey?: string;

    /**
     * The ID of the VoiceStudio voice profile to read with.
     */
    profileId?: string;

    /**
     * A reference audio clip to clone the voice from.
     */
    refAudio?: string;

    /**
     * The transcript of the reference audio clip.
     */
    refText?: string;

    /**
     * The voice design attributes (e.g. "male, middle-aged, low pitch").
     */
    instruct?: string;

    language?: string;
    engine?: string;
    seed?: string;
    numStep?: string;

    /**
     * The base speed. Multiplied by the speed of each kind of section.
     */
    speed?: string;

    /**
     * The maximum number of characters to send in a single request.
     */
    maxRequestChars?: string;

    sentencePause?: string;
    clausePause?: string;
    linePause?: string;
    lineGroupPause?: string;
    transitionPause?: string;
    paragraphPause?: string;
    subtitlePause?: string;
    sectionPause?: string;
    proseSpeed?: string;
    poetrySpeed?: string;
    subtitleSpeed?: string;
}

/**
 * Generates audio for a chapter using the VoiceStudio audio generation API.
 */
export async function generateChapterAudio(
    translationId: string,
    book: string,
    chapterNumber: number,
    options: GenerateChapterAudioOptions = {}
): Promise<void> {
    const logger = log.getLogger();
    const bookId = getBookId(book) ?? book.toUpperCase();
    if (!Number.isInteger(chapterNumber) || chapterNumber < 1) {
        throw new Error(`Invalid chapter number: ${chapterNumber}`);
    }

    const chapter = await loadChapter(
        translationId,
        bookId,
        chapterNumber,
        options
    );
    const instructions = getReadingInstructions(options);
    const sections = planChapterReading(chapter, instructions);
    const script = formatReadingScript(sections);

    if (options.script) {
        await writeFile(options.script, script + '\n', 'utf-8');
        logger.log('Wrote reading script to', options.script);
    }

    if (options.dryRun) {
        logger.log(script);
        return;
    }

    if (sections.length === 0) {
        throw new Error('The chapter has no text to read.');
    }

    const requests = createVoiceStudioRequests(
        sections,
        parseNumber(options.maxRequestChars, 'max-request-chars') ?? 1500
    );
    const baseUrl = (
        options.voicestudioUrl ??
        process.env.VOICESTUDIO_URL ??
        'http://localhost:3900'
    ).replace(/\/+$/, '');
    const apiKey = options.apiKey ?? process.env.VOICESTUDIO_API_KEY;
    const baseSpeed = parseNumber(options.speed, 'speed') ?? 1;
    const refAudio = options.refAudio
        ? {
              name: path.basename(options.refAudio),
              data: await readFile(options.refAudio),
          }
        : null;

    if (!options.profileId && !refAudio && !options.instruct) {
        logger.warn(
            'No --profile-id, --ref-audio, or --instruct was given, so VoiceStudio may use a different voice for each section. Use one of them (and --seed) for a consistent reader.'
        );
    }

    const clips: { audio: WavAudio; silenceAfterMs: number }[] = [];
    for (let i = 0; i < requests.length; i++) {
        const request = requests[i];
        logger.log(
            `[${i + 1}/${requests.length}] Generating ${request.section.kind}${
                request.section.verses
                    ? ` (verses ${request.section.verses[0]}-${request.section.verses[1]})`
                    : ''
            }...`
        );

        const form = new FormData();
        form.set('text', request.text);
        form.set('speed', String(round(baseSpeed * request.section.speed)));
        setIfDefined(form, 'profile_id', options.profileId);
        setIfDefined(form, 'ref_text', options.refText);
        setIfDefined(form, 'instruct', options.instruct);
        setIfDefined(form, 'language', options.language);
        setIfDefined(form, 'engine', options.engine);
        setIfDefined(form, 'seed', options.seed);
        setIfDefined(form, 'num_step', options.numStep);
        if (refAudio) {
            form.set('ref_audio', new Blob([refAudio.data]), refAudio.name);
        }

        const wav = await postGenerate(baseUrl, form, apiKey);
        clips.push({
            audio: parseWav(wav),
            silenceAfterMs: i < requests.length - 1 ? request.pauseAfterMs : 0,
        });
    }

    const output =
        options.output ?? `${translationId}-${bookId}-${chapterNumber}.wav`;
    await writeFile(output, joinWavs(clips));
    logger.log('Wrote audio to', output);
}

async function postGenerate(
    baseUrl: string,
    form: FormData,
    apiKey: string | undefined,
    maxAttempts: number = 4
): Promise<Buffer> {
    const logger = log.getLogger();
    for (let attempt = 1; ; attempt++) {
        const response = await fetch(`${baseUrl}/generate`, {
            method: 'POST',
            body: form,
            headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
        });

        if (response.ok) {
            const dropped = response.headers.get('X-OmniVoice-Dropped-Chunks');
            if (dropped) {
                logger.warn(
                    `VoiceStudio produced no audio for ${dropped} chunk(s): ${
                        response.headers.get('X-OmniVoice-Dropped-Text') ?? ''
                    }`
                );
            }
            return Buffer.from(await response.arrayBuffer());
        }

        const body = await response.text();
        const retryable =
            response.headers.get('X-OmniVoice-Retryable') === 'true' ||
            response.status === 429;
        if (retryable && attempt < maxAttempts) {
            const seconds =
                Number(response.headers.get('Retry-After')) || 10 * attempt;
            logger.warn(
                `VoiceStudio is busy (${response.status}). Retrying in ${seconds}s...`
            );
            await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
            continue;
        }

        throw new Error(
            `VoiceStudio request failed: ${response.status} ${response.statusText}\n${body}`
        );
    }
}

async function loadChapter(
    translationId: string,
    bookId: string,
    chapterNumber: number,
    options: GenerateChapterAudioOptions
): Promise<ChapterData> {
    const logger = log.getLogger();
    if (options.input) {
        return unwrapChapter(
            JSON.parse(await readFile(options.input, 'utf-8'))
        );
    }

    if (options.db) {
        // Imported lazily so that the reading planner can be used without the database.
        const { getDb } = await import('./db.js');
        const db = await getDb(options.db);
        try {
            const row = db
                .prepare(
                    'SELECT json FROM Chapter WHERE translationId = ? AND bookId = ? AND number = ?;'
                )
                .get(translationId, bookId, chapterNumber) as
                | { json: string }
                | undefined;
            if (!row) {
                throw new Error(
                    `Chapter not found in the database: ${translationId} ${bookId} ${chapterNumber}`
                );
            }
            return unwrapChapter(JSON.parse(row.json));
        } finally {
            db.close();
        }
    }

    const apiUrl = (options.apiUrl ?? 'https://bible.helloao.org/api').replace(
        /\/+$/,
        ''
    );
    const url = `${apiUrl}/${translationId}/${bookId}/${chapterNumber}.json`;
    logger.log('Fetching chapter from', url);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(
            `Failed to fetch ${url}: ${response.status} ${response.statusText}`
        );
    }
    return unwrapChapter(await response.json());
}

/**
 * Gets the chapter data from either a `ChapterData` object or a chapter API response.
 */
function unwrapChapter(json: any): ChapterData {
    const chapter = json && !Array.isArray(json.content) ? json.chapter : json;
    if (!chapter || !Array.isArray(chapter.content)) {
        throw new Error('The chapter JSON does not contain any content.');
    }
    return chapter;
}

function getReadingInstructions(
    options: GenerateChapterAudioOptions
): ReadingInstructions {
    const d = DEFAULT_READING_INSTRUCTIONS;
    const n = (value: string | undefined, name: string, fallback: number) =>
        parseNumber(value, name) ?? fallback;
    return {
        sentencePauseMs: n(
            options.sentencePause,
            'sentence-pause',
            d.sentencePauseMs
        ),
        clausePauseMs: n(options.clausePause, 'clause-pause', d.clausePauseMs),
        poetryLinePauseMs: n(
            options.linePause,
            'line-pause',
            d.poetryLinePauseMs
        ),
        poetryLineGroupPauseMs: n(
            options.lineGroupPause,
            'line-group-pause',
            d.poetryLineGroupPauseMs
        ),
        transitionPauseMs: n(
            options.transitionPause,
            'transition-pause',
            d.transitionPauseMs
        ),
        paragraphPauseMs: n(
            options.paragraphPause,
            'paragraph-pause',
            d.paragraphPauseMs
        ),
        subtitlePauseMs: n(
            options.subtitlePause,
            'subtitle-pause',
            d.subtitlePauseMs
        ),
        sectionPauseMs: n(
            options.sectionPause,
            'section-pause',
            d.sectionPauseMs
        ),
        speed: {
            prose: n(options.proseSpeed, 'prose-speed', d.speed.prose),
            poetry: n(options.poetrySpeed, 'poetry-speed', d.speed.poetry),
            subtitle: n(
                options.subtitleSpeed,
                'subtitle-speed',
                d.speed.subtitle
            ),
        },
        maxSpanChars: d.maxSpanChars,
    };
}

function parseNumber(value: string | undefined, name: string): number | null {
    if (value === undefined) {
        return null;
    }
    const result = Number(value);
    if (!Number.isFinite(result) || result < 0) {
        throw new Error(`--${name} must be a non-negative number.`);
    }
    return result;
}

function setIfDefined(form: FormData, name: string, value: string | undefined) {
    if (value !== undefined && value !== '') {
        form.set(name, value);
    }
}

function round(value: number): number {
    return Math.round(value * 1000) / 1000;
}
