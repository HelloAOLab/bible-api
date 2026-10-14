import {
    createVoiceStudioRequests,
    DEFAULT_READING_INSTRUCTIONS,
    joinWavs,
    parseWav,
    planChapterReading,
    ReadingInstructions,
    splitLongText,
    splitSentences,
} from './voicestudio';
import type { ChapterContent } from '@helloao/tools/generation/common-types.js';

const instructions: ReadingInstructions = {
    ...DEFAULT_READING_INSTRUCTIONS,
    sentencePauseMs: 1,
    clausePauseMs: 2,
    poetryLinePauseMs: 3,
    poetryLineGroupPauseMs: 4,
    transitionPauseMs: 5,
    paragraphPauseMs: 6,
    subtitlePauseMs: 7,
    sectionPauseMs: 8,
};

function plan(content: ChapterContent[]) {
    return planChapterReading({ content }, instructions);
}

describe('planChapterReading()', () => {
    it('should not read headings and pause between sections instead', () => {
        const sections = plan([
            { type: 'heading', content: ['The Creation'] },
            { type: 'line_break' },
            {
                type: 'verse',
                number: 1,
                content: ['In the beginning God created the heavens.'],
            },
            { type: 'heading', content: ['The First Day'] },
            { type: 'line_break' },
            { type: 'verse', number: 2, content: ['And God said.'] },
        ]);

        expect(sections).toEqual([
            {
                kind: 'prose',
                verses: [1, 1],
                speed: 1,
                spans: [
                    {
                        text: 'In the beginning God created the heavens.',
                        pauseAfterMs: 8,
                    },
                ],
            },
            {
                kind: 'prose',
                verses: [2, 2],
                speed: 1,
                spans: [{ text: 'And God said.', pauseAfterMs: 0 }],
            },
        ]);
    });

    it('should not read inline headings', () => {
        const sections = plan([
            {
                type: 'verse',
                number: 1,
                content: ['First.', { heading: 'A heading' }, 'Second.'],
            },
        ]);

        expect(sections.map((s) => s.spans)).toEqual([
            [{ text: 'First.', pauseAfterMs: 8 }],
            [{ text: 'Second.', pauseAfterMs: 0 }],
        ]);
    });

    it('should ignore verse markers and footnotes in prose', () => {
        const sections = plan([
            {
                type: 'verse',
                number: 1,
                content: [
                    'When Jesus saw the crowds,',
                    { noteId: 1 },
                    'He went up on the mountain',
                    { noteId: 2 },
                    '. His disciples came to Him,',
                ],
            },
            {
                type: 'verse',
                number: 2,
                content: ['and He began to teach them.'],
            },
        ]);

        expect(sections).toEqual([
            {
                kind: 'prose',
                verses: [1, 2],
                speed: 1,
                spans: [
                    {
                        text: 'When Jesus saw the crowds, He went up on the mountain.',
                        pauseAfterMs: 1,
                    },
                    {
                        text: 'His disciples came to Him, and He began to teach them.',
                        pauseAfterMs: 0,
                    },
                ],
            },
        ]);
    });

    it('should treat a line break in prose as a paragraph break', () => {
        const sections = plan([
            {
                type: 'verse',
                number: 5,
                content: [
                    'God called the light “day.”',
                    { lineBreak: true },
                    'And there was evening.',
                ],
            },
        ]);

        expect(sections.map((s) => s.spans)).toEqual([
            [{ text: 'God called the light “day.”', pauseAfterMs: 6 }],
            [{ text: 'And there was evening.', pauseAfterMs: 0 }],
        ]);
    });

    it('should read poetry line by line', () => {
        const sections = plan([
            {
                type: 'hebrew_subtitle',
                content: [{ text: 'A Psalm of David.', poem: 2 }],
            },
            {
                type: 'verse',
                number: 1,
                content: [
                    { text: 'The LORD is my shepherd;', poem: 1 },
                    { noteId: 1 },
                    { text: 'I shall not want.', poem: 2 },
                ],
            },
            {
                type: 'verse',
                number: 3,
                content: [
                    { text: 'He restores my soul;', poem: 1 },
                    { text: 'He guides me', poem: 2 },
                    { text: 'for His name.', poem: 2 },
                ],
            },
            { type: 'line_break' },
            {
                type: 'verse',
                number: 5,
                content: [{ text: 'You prepare a table.', poem: 1 }],
            },
        ]);

        expect(sections).toEqual([
            {
                kind: 'subtitle',
                verses: null,
                speed: 0.95,
                spans: [{ text: 'A Psalm of David.', pauseAfterMs: 7 }],
            },
            {
                kind: 'poetry',
                verses: [1, 3],
                speed: 0.95,
                spans: [
                    { text: 'The LORD is my shepherd;', pauseAfterMs: 3 },
                    { text: 'I shall not want.', pauseAfterMs: 4 },
                    { text: 'He restores my soul;', pauseAfterMs: 3 },
                    { text: 'He guides me', pauseAfterMs: 3 },
                    { text: 'for His name.', pauseAfterMs: 6 },
                ],
            },
            {
                kind: 'poetry',
                verses: [5, 5],
                speed: 0.95,
                spans: [{ text: 'You prepare a table.', pauseAfterMs: 0 }],
            },
        ]);
    });

    it('should continue a line of poetry across verses, footnotes, and formatting changes', () => {
        const sections = plan([
            {
                type: 'verse',
                number: 1,
                content: [
                    { text: 'He brings down to Sheol', poem: 2 },
                    { noteId: 1 },
                    { text: 'and brings up', poem: 2 },
                ],
            },
            {
                type: 'verse',
                number: 2,
                content: [
                    { text: 'from the depths,', poem: 2 },
                    { text: 'says the Lord', poem: 2, wordsOfJesus: true },
                    { lineBreak: true },
                    { text: 'to all people.', poem: 2, wordsOfJesus: true },
                ],
            },
        ]);

        expect(sections.map((s) => s.spans)).toEqual([
            [
                {
                    text: 'He brings down to Sheol and brings up from the depths, says the Lord',
                    pauseAfterMs: 3,
                },
                { text: 'to all people.', pauseAfterMs: 0 },
            ],
        ]);
    });

    it('should pause between prose and poetry', () => {
        const sections = plan([
            {
                type: 'verse',
                number: 1,
                content: [
                    'Hannah prayed, and said,',
                    { text: '“My heart exults!', poem: 1 },
                ],
            },
            {
                type: 'verse',
                number: 2,
                content: [{ text: 'Amen.', poem: 1 }, 'And she left.'],
            },
        ]);

        expect(sections.map((s) => [s.kind, s.spans])).toEqual([
            ['prose', [{ text: 'Hannah prayed, and said,', pauseAfterMs: 5 }]],
            [
                'poetry',
                [
                    { text: '“My heart exults!', pauseAfterMs: 1 },
                    { text: 'Amen.', pauseAfterMs: 5 },
                ],
            ],
            ['prose', [{ text: 'And she left.', pauseAfterMs: 0 }]],
        ]);
    });

    it('should remove square brackets so that they are not read as VoiceStudio tags', () => {
        const sections = plan([
            {
                type: 'verse',
                number: 1,
                content: ['He went [to the city] [[quickly]].'],
            },
        ]);

        expect(sections[0].spans).toEqual([
            { text: 'He went to the city quickly.', pauseAfterMs: 0 },
        ]);
    });

    it('should split sentences that are too long at clause boundaries', () => {
        const sections = planChapterReading(
            {
                content: [
                    {
                        type: 'verse',
                        number: 1,
                        content: [
                            'Blessed be the God and Father of our Lord; who has blessed us, in the heavenly realms, with every spiritual blessing.',
                        ],
                    },
                ],
            },
            { ...instructions, maxSpanChars: 60 }
        );

        expect(sections[0].spans).toEqual([
            {
                text: 'Blessed be the God and Father of our Lord;',
                pauseAfterMs: 2,
            },
            {
                text: 'who has blessed us, in the heavenly realms,',
                pauseAfterMs: 2,
            },
            { text: 'with every spiritual blessing.', pauseAfterMs: 0 },
        ]);
    });

    it('should return nothing for a chapter without text', () => {
        expect(
            plan([
                { type: 'heading', content: ['Heading'] },
                { type: 'line_break' },
            ])
        ).toEqual([]);
    });
});

describe('splitSentences()', () => {
    it('should split after sentence punctuation and closing quotes', () => {
        expect(
            splitSentences(
                'He said, “Go.” Then he left! Did he? “God will not deliver him.” Selah'
            )
        ).toEqual([
            'He said, “Go.”',
            'Then he left!',
            'Did he?',
            '“God will not deliver him.”',
            'Selah',
        ]);
    });

    it('should not split when the next word is lowercase', () => {
        expect(splitSentences('“Who is it?” he asked.')).toEqual([
            '“Who is it?” he asked.',
        ]);
    });
});

describe('splitLongText()', () => {
    it('should leave short text alone', () => {
        expect(splitLongText('Short text, here.', 100)).toEqual([
            'Short text, here.',
        ]);
    });

    it('should fall back to splitting between words', () => {
        expect(splitLongText('one two three four five six', 10)).toEqual([
            'one two',
            'three four',
            'five six',
        ]);
    });
});

describe('createVoiceStudioRequests()', () => {
    const sections = plan([
        { type: 'verse', number: 1, content: ['One. Two. Three.'] },
        { type: 'line_break' },
        { type: 'verse', number: 2, content: [{ text: 'Four', poem: 1 }] },
    ]);

    it('should create a request for each section with pause markers between spans', () => {
        const requests = createVoiceStudioRequests(sections, 1000);
        expect(
            requests.map((r) => [r.section.kind, r.text, r.pauseAfterMs])
        ).toEqual([
            ['prose', 'One. [pause 1ms] Two. [pause 1ms] Three.', 6],
            ['poetry', 'Four', 0],
        ]);
    });

    it('should split sections that are too long between spans', () => {
        const requests = createVoiceStudioRequests(sections, 9);
        expect(requests.map((r) => [r.text, r.pauseAfterMs])).toEqual([
            ['One. [pause 1ms] Two.', 1],
            ['Three.', 6],
            ['Four', 0],
        ]);
    });
});

function wav(samples: number[], sampleRate = 1000): Buffer {
    const data = Buffer.alloc(samples.length * 2);
    samples.forEach((s, i) => data.writeInt16LE(s, i * 2));
    const header = Buffer.alloc(44);
    header.write('RIFF', 0, 'ascii');
    header.writeUInt32LE(36 + data.length, 4);
    header.write('WAVE', 8, 'ascii');
    header.write('fmt ', 12, 'ascii');
    header.writeUInt32LE(16, 16);
    header.writeUInt16LE(1, 20);
    header.writeUInt16LE(1, 22);
    header.writeUInt32LE(sampleRate, 24);
    header.writeUInt32LE(sampleRate * 2, 28);
    header.writeUInt16LE(2, 32);
    header.writeUInt16LE(16, 34);
    header.write('data', 36, 'ascii');
    header.writeUInt32LE(data.length, 40);
    return Buffer.concat([header, data]);
}

describe('joinWavs()', () => {
    it('should join WAV files with silence between them', () => {
        const joined = joinWavs([
            { audio: parseWav(wav([1, 2])), silenceAfterMs: 3 },
            { audio: parseWav(wav([4])), silenceAfterMs: 0 },
        ]);

        expect(joined.equals(wav([1, 2, 0, 0, 0, 4]))).toBe(true);
    });

    it('should not join WAV files with different formats', () => {
        expect(() =>
            joinWavs([
                { audio: parseWav(wav([1], 1000)), silenceAfterMs: 0 },
                { audio: parseWav(wav([1], 2000)), silenceAfterMs: 0 },
            ])
        ).toThrow();
    });
});

describe('parseWav()', () => {
    it('should skip unknown chunks', () => {
        const original = wav([7, 8]);
        const withList = Buffer.concat([
            original.subarray(0, 36),
            Buffer.from('LIST'),
            Buffer.from([3, 0, 0, 0, 1, 2, 3, 0]),
            original.subarray(36),
        ]);
        const parsed = parseWav(withList);
        expect(parsed.sampleRate).toBe(1000);
        expect([...parsed.data]).toEqual([7, 0, 8, 0]);
    });

    it('should reject files that are not WAVs', () => {
        expect(() => parseWav(Buffer.from('not a wav file'))).toThrow();
    });
});
