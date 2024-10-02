import { CodexParser } from './codex-parser.js';
import CodexExample from './test/codex-simple-example.codex';

describe('CodexParser', () => {
    let parser: CodexParser;

    beforeEach(() => {
        parser = new CodexParser();
    });

    describe('parse', () => {
        it('should parse a scripture cell into verses', () => {
            const tree = parser.parse(
                JSON.stringify({
                    cells: [
                        {
                            kind: 2,
                            language: 'scripture',
                            value: [
                                'JON 1:1 إيسيول ربّي إ يُونان ممّيس ن أمتّاي إنّاياس:',
                                'JON 1:2 «كّر الدُّو غَر نِينَوى ثامدينث ثاخاثارث، أها ثسغويّد غيفسن هاثين ثوليد ثوخّوت نّسن د لمعصيّاث نّا دا تݣّان غر داثي».',
                                'JON 1:3 داي إيكّر يونان، أد يرول زݣ داث ن ربّي غر ترشيش، إيݣّزد غر يافا يافن ديس يان لباطو إيوجدن إ ثوادا غر ترشيش، أها إيش الخلاص نّس إيݣز غر الباطو أد إيمون د إيمسافرغر ترشيش إيرول زݣ داث ن ربّي.',
                            ].join('\n'),
                        },
                    ],
                })
            );

            expect(tree).toEqual({
                type: 'root',
                id: 'JON',
                content: [
                    {
                        type: 'chapter',
                        number: 1,
                        content: [
                            {
                                type: 'verse',
                                number: 1,
                                content: [
                                    'إيسيول ربّي إ يُونان ممّيس ن أمتّاي إنّاياس:',
                                ],
                            },
                            {
                                type: 'verse',
                                number: 2,
                                content: [
                                    '«كّر الدُّو غَر نِينَوى ثامدينث ثاخاثارث، أها ثسغويّد غيفسن هاثين ثوليد ثوخّوت نّسن د لمعصيّاث نّا دا تݣّان غر داثي».',
                                ],
                            },
                            {
                                type: 'verse',
                                number: 3,
                                content: [
                                    'داي إيكّر يونان، أد يرول زݣ داث ن ربّي غر ترشيش، إيݣّزد غر يافا يافن ديس يان لباطو إيوجدن إ ثوادا غر ترشيش، أها إيش الخلاص نّس إيݣز غر الباطو أد إيمون د إيمسافرغر ترشيش إيرول زݣ داث ن ربّي.',
                                ],
                            },
                        ],
                        footnotes: [],
                    },
                ],
            });
        });

        it('should parse a scripture cell into multiple chapters', () => {
            const tree = parser.parse(
                JSON.stringify({
                    cells: [
                        {
                            kind: 2,
                            language: 'scripture',
                            value: [
                                'JON 1:1 إيسيول ربّي إ يُونان ممّيس ن أمتّاي إنّاياس:',
                                'JON 1:2 «كّر الدُّو غَر نِينَوى ثامدينث ثاخاثارث، أها ثسغويّد غيفسن هاثين ثوليد ثوخّوت نّسن د لمعصيّاث نّا دا تݣّان غر داثي».',
                                'JON 1:3 داي إيكّر يونان، أد يرول زݣ داث ن ربّي غر ترشيش، إيݣّزد غر يافا يافن ديس يان لباطو إيوجدن إ ثوادا غر ترشيش، أها إيش الخلاص نّس إيݣز غر الباطو أد إيمون د إيمسافرغر ترشيش إيرول زݣ داث ن ربّي.',
                                'JON 2:1 داي إيژّال يونان إتّر إ ربّي نّس زݣ أوديس ن-وسلم.',
                                'JON 2:2 إينّا: «غريخ إ يهويه ربّي ݣ-ثمارانو إيجَاوبِي، زݣ آيث ليخرا سغُويّخاشن أيهويه ربّي نو، تسفلت إ تغُويّيت إينو.',
                            ].join('\n'),
                        },
                    ],
                })
            );

            expect(tree).toEqual({
                type: 'root',
                id: 'JON',
                content: [
                    {
                        type: 'chapter',
                        number: 1,
                        content: [
                            {
                                type: 'verse',
                                number: 1,
                                content: [
                                    'إيسيول ربّي إ يُونان ممّيس ن أمتّاي إنّاياس:',
                                ],
                            },
                            {
                                type: 'verse',
                                number: 2,
                                content: [
                                    '«كّر الدُّو غَر نِينَوى ثامدينث ثاخاثارث، أها ثسغويّد غيفسن هاثين ثوليد ثوخّوت نّسن د لمعصيّاث نّا دا تݣّان غر داثي».',
                                ],
                            },
                            {
                                type: 'verse',
                                number: 3,
                                content: [
                                    'داي إيكّر يونان، أد يرول زݣ داث ن ربّي غر ترشيش، إيݣّزد غر يافا يافن ديس يان لباطو إيوجدن إ ثوادا غر ترشيش، أها إيش الخلاص نّس إيݣز غر الباطو أد إيمون د إيمسافرغر ترشيش إيرول زݣ داث ن ربّي.',
                                ],
                            },
                        ],
                        footnotes: [],
                    },
                    {
                        type: 'chapter',
                        number: 2,
                        content: [
                            {
                                type: 'verse',
                                number: 1,
                                content: [
                                    'داي إيژّال يونان إتّر إ ربّي نّس زݣ أوديس ن-وسلم.',
                                ],
                            },
                            {
                                type: 'verse',
                                number: 2,
                                content: [
                                    'إينّا: «غريخ إ يهويه ربّي ݣ-ثمارانو إيجَاوبِي، زݣ آيث ليخرا سغُويّخاشن أيهويه ربّي نو، تسفلت إ تغُويّيت إينو.',
                                ],
                            },
                        ],
                        footnotes: [],
                    },
                ],
            });
        });

        it('should interpret multiple newlines as a line break', () => {
            const tree = parser.parse(
                JSON.stringify({
                    cells: [
                        {
                            kind: 2,
                            language: 'scripture',
                            value: [
                                'JON 1:1 إيسيول ربّي إ يُونان ممّيس ن أمتّاي إنّاياس:',
                                '',
                                'JON 1:2 «كّر الدُّو غَر نِينَوى ثامدينث ثاخاثارث، أها ثسغويّد غيفسن هاثين ثوليد ثوخّوت نّسن د لمعصيّاث نّا دا تݣّان غر داثي».',
                            ].join('\n'),
                        },
                    ],
                })
            );

            expect(tree).toEqual({
                type: 'root',
                id: 'JON',
                content: [
                    {
                        type: 'chapter',
                        number: 1,
                        content: [
                            {
                                type: 'verse',
                                number: 1,
                                content: [
                                    'إيسيول ربّي إ يُونان ممّيس ن أمتّاي إنّاياس:',
                                ],
                            },
                            {
                                type: 'line_break',
                            },
                            {
                                type: 'verse',
                                number: 2,
                                content: [
                                    '«كّر الدُّو غَر نِينَوى ثامدينث ثاخاثارث، أها ثسغويّد غيفسن هاثين ثوليد ثوخّوت نّسن د لمعصيّاث نّا دا تݣّان غر داثي».',
                                ],
                            },
                        ],
                        footnotes: [],
                    },
                ],
            });
        });

        it('should be able to have a line break inside a verse', () => {
            const tree = parser.parse(
                JSON.stringify({
                    cells: [
                        {
                            kind: 2,
                            language: 'scripture',
                            value: [
                                'JON 1:1 إيسيول ربّي إ يُونان ممّيس ن\n\n أمتّاي إنّاياس:',
                                'JON 1:2 «كّر الدُّو غَر نِينَوى ثامدينث ثاخاثارث، أها ثسغويّد غيفسن هاثين ثوليد ثوخّوت نّسن د لمعصيّاث نّا دا تݣّان غر داثي».',
                            ].join('\n'),
                        },
                    ],
                })
            );

            expect(tree).toEqual({
                type: 'root',
                id: 'JON',
                content: [
                    {
                        type: 'chapter',
                        number: 1,
                        content: [
                            {
                                type: 'verse',
                                number: 1,
                                content: [
                                    'إيسيول ربّي إ يُونان ممّيس ن',
                                    { lineBreak: true },
                                    ' أمتّاي إنّاياس:',
                                ],
                            },
                            {
                                type: 'verse',
                                number: 2,
                                content: [
                                    '«كّر الدُّو غَر نِينَوى ثامدينث ثاخاثارث، أها ثسغويّد غيفسن هاثين ثوليد ثوخّوت نّسن د لمعصيّاث نّا دا تݣّان غر داثي».',
                                ],
                            },
                        ],
                        footnotes: [],
                    },
                ],
            });
        });

        it('should be able to support chapter headings', () => {
            const tree = parser.parse(
                JSON.stringify({
                    cells: [
                        {
                            kind: 1,
                            language: 'markdown',
                            value: '# Jonah 1',
                            metadata: {
                                type: 'chapter-heading',
                                data: {
                                    chapter: '1',
                                },
                            },
                        },
                        {
                            kind: 2,
                            language: 'scripture',
                            value: [
                                'JON 1:1 إيسيول ربّي إ يُونان ممّيس ن أمتّاي إنّاياس:',
                                'JON 1:2 «كّر الدُّو غَر نِينَوى ثامدينث ثاخاثارث، أها ثسغويّد غيفسن هاثين ثوليد ثوخّوت نّسن د لمعصيّاث نّا دا تݣّان غر داثي».',
                            ].join('\n'),
                        },
                        {
                            kind: 1,
                            language: 'markdown',
                            value: '# Jonah 2',
                            metadata: {
                                type: 'chapter-heading',
                                data: {
                                    chapter: '2',
                                },
                            },
                        },
                        {
                            kind: 2,
                            language: 'scripture',
                            value: [
                                'JON 2:1 داي إيژّال يونان إتّر إ ربّي نّس زݣ أوديس ن-وسلم.',
                                'JON 2:2 إينّا: «غريخ إ يهويه ربّي ݣ-ثمارانو إيجَاوبِي، زݣ آيث ليخرا سغُويّخاشن أيهويه ربّي نو، تسفلت إ تغُويّيت إينو.',
                            ].join('\n'),
                        },
                    ],
                })
            );

            expect(tree).toEqual({
                type: 'root',
                id: 'JON',
                content: [
                    {
                        type: 'chapter',
                        number: 1,
                        content: [
                            {
                                type: 'heading',
                                content: ['# Jonah 1'],
                            },
                            {
                                type: 'verse',
                                number: 1,
                                content: [
                                    'إيسيول ربّي إ يُونان ممّيس ن أمتّاي إنّاياس:',
                                ],
                            },
                            {
                                type: 'verse',
                                number: 2,
                                content: [
                                    '«كّر الدُّو غَر نِينَوى ثامدينث ثاخاثارث، أها ثسغويّد غيفسن هاثين ثوليد ثوخّوت نّسن د لمعصيّاث نّا دا تݣّان غر داثي».',
                                ],
                            },
                        ],
                        footnotes: [],
                    },
                    {
                        type: 'chapter',
                        number: 2,
                        content: [
                            {
                                type: 'heading',
                                content: ['# Jonah 2'],
                            },
                            {
                                type: 'verse',
                                number: 1,
                                content: [
                                    'داي إيژّال يونان إتّر إ ربّي نّس زݣ أوديس ن-وسلم.',
                                ],
                            },
                            {
                                type: 'verse',
                                number: 2,
                                content: [
                                    'إينّا: «غريخ إ يهويه ربّي ݣ-ثمارانو إيجَاوبِي، زݣ آيث ليخرا سغُويّخاشن أيهويه ربّي نو، تسفلت إ تغُويّيت إينو.',
                                ],
                            },
                        ],
                        footnotes: [],
                    },
                ],
            });
        });

        it('should be able to ignore cells that dont have the right language', () => {
            const tree = parser.parse(
                JSON.stringify({
                    cells: [
                        {
                            kind: 1,
                            language: 'markdown',
                            value: '# Jonah 1',
                            metadata: {
                                type: 'chapter-heading',
                                data: {
                                    chapter: '1',
                                },
                            },
                        },
                        {
                            kind: 2,
                            language: 'scripture',
                            value: [
                                'JON 1:1 إيسيول ربّي إ يُونان ممّيس ن أمتّاي إنّاياس:',
                                'JON 1:2 «كّر الدُّو غَر نِينَوى ثامدينث ثاخاثارث، أها ثسغويّد غيفسن هاثين ثوليد ثوخّوت نّسن د لمعصيّاث نّا دا تݣّان غر داثي».',
                            ].join('\n'),
                        },
                        {
                            kind: 1,
                            language: 'anything',
                            value: '# Jonah 2',
                            metadata: {
                                type: 'chapter-heading',
                                data: {
                                    chapter: '2',
                                },
                            },
                        },
                        {
                            kind: 2,
                            language: 'anything',
                            value: [
                                'JON 2:1 داي إيژّال يونان إتّر إ ربّي نّس زݣ أوديس ن-وسلم.',
                                'JON 2:2 إينّا: «غريخ إ يهويه ربّي ݣ-ثمارانو إيجَاوبِي، زݣ آيث ليخرا سغُويّخاشن أيهويه ربّي نو، تسفلت إ تغُويّيت إينو.',
                            ].join('\n'),
                        },
                    ],
                })
            );

            expect(tree).toEqual({
                type: 'root',
                id: 'JON',
                content: [
                    {
                        type: 'chapter',
                        number: 1,
                        content: [
                            {
                                type: 'heading',
                                content: ['# Jonah 1'],
                            },
                            {
                                type: 'verse',
                                number: 1,
                                content: [
                                    'إيسيول ربّي إ يُونان ممّيس ن أمتّاي إنّاياس:',
                                ],
                            },
                            {
                                type: 'verse',
                                number: 2,
                                content: [
                                    '«كّر الدُّو غَر نِينَوى ثامدينث ثاخاثارث، أها ثسغويّد غيفسن هاثين ثوليد ثوخّوت نّسن د لمعصيّاث نّا دا تݣّان غر داثي».',
                                ],
                            },
                        ],
                        footnotes: [],
                    },
                ],
            });
        });

        it('should be able to parse markdown notes', () => {
            const tree = parser.parse(
                JSON.stringify({
                    cells: [
                        {
                            kind: 1,
                            language: 'markdown',
                            value: '# Jonah 1',
                            metadata: {
                                type: 'chapter-heading',
                                data: {
                                    chapter: '1',
                                },
                            },
                        },
                        {
                            kind: 2,
                            language: 'markdown',
                            value: '### note1',
                        },
                        {
                            kind: 2,
                            language: 'scripture',
                            value: [
                                'JON 1:1 إيسيول ربّي إ يُونان ممّيس ن أمتّاي إنّاياس:',
                                'JON 1:2 «كّر الدُّو غَر نِينَوى ثامدينث ثاخاثارث، أها ثسغويّد غيفسن هاثين ثوليد ثوخّوت نّسن د لمعصيّاث نّا دا تݣّان غر داثي».',
                            ].join('\n'),
                        },
                        {
                            kind: 2,
                            language: 'markdown',
                            value: '### note2',
                        },
                    ],
                })
            );

            expect(tree).toEqual({
                type: 'root',
                id: 'JON',
                content: [
                    {
                        type: 'chapter',
                        number: 1,
                        content: [
                            {
                                type: 'heading',
                                content: ['# Jonah 1'],
                            },
                            {
                                type: 'verse',
                                number: 1,
                                content: [
                                    'إيسيول ربّي إ يُونان ممّيس ن أمتّاي إنّاياس:',
                                ],
                            },
                            {
                                type: 'verse',
                                number: 2,
                                content: [
                                    '«كّر الدُّو غَر نِينَوى ثامدينث ثاخاثارث، أها ثسغويّد غيفسن هاثين ثوليد ثوخّوت نّسن د لمعصيّاث نّا دا تݣّان غر داثي».',
                                ],
                            },
                        ],
                        footnotes: [
                            {
                                noteId: 0,
                                text: '### note1',
                                caller: null,
                            },
                            {
                                noteId: 1,
                                text: '### note2',
                                caller: null,
                            },
                        ],
                    },
                ],
            });
        });

        it.skip('should be able to transform markdown into regular text', () => {
            // parser.preserveMarkdown = false;

            const tree = parser.parse(
                JSON.stringify({
                    cells: [
                        {
                            kind: 1,
                            language: 'markdown',
                            value: '# Jonah 1',
                            metadata: {
                                type: 'chapter-heading',
                                data: {
                                    chapter: '1',
                                },
                            },
                        },
                        {
                            kind: 2,
                            language: 'markdown',
                            value: '### note1',
                        },
                        {
                            kind: 2,
                            language: 'scripture',
                            value: [
                                'JON 1:1 إيسيول ربّي إ يُونان ممّيس ن أمتّاي إنّاياس:',
                                'JON 1:2 «كّر الدُّو غَر نِينَوى ثامدينث ثاخاثارث، أها ثسغويّد غيفسن هاثين ثوليد ثوخّوت نّسن د لمعصيّاث نّا دا تݣّان غر داثي».',
                            ].join('\n'),
                        },
                        {
                            kind: 2,
                            language: 'markdown',
                            value: '### note2',
                        },
                    ],
                })
            );

            expect(tree).toEqual({
                type: 'root',
                id: 'JON',
                content: [
                    {
                        type: 'chapter',
                        number: 1,
                        content: [
                            {
                                type: 'heading',
                                content: ['Jonah 1'],
                            },
                            {
                                type: 'verse',
                                number: 1,
                                content: [
                                    'إيسيول ربّي إ يُونان ممّيس ن أمتّاي إنّاياس:',
                                ],
                            },
                            {
                                type: 'verse',
                                number: 2,
                                content: [
                                    '«كّر الدُّو غَر نِينَوى ثامدينث ثاخاثارث، أها ثسغويّد غيفسن هاثين ثوليد ثوخّوت نّسن د لمعصيّاث نّا دا تݣّان غر داثي».',
                                ],
                            },
                        ],
                        footnotes: [
                            {
                                noteId: 0,
                                text: 'note1',
                                caller: null,
                            },
                            {
                                noteId: 1,
                                text: 'note2',
                                caller: null,
                            },
                        ],
                    },
                ],
            });
        });

        it('should parse a codex file', () => {
            const tree = parser.parse(CodexExample);
            expect(tree).toEqual({
                type: 'root',
                id: 'JON',
                content: [
                    {
                        type: 'chapter',
                        number: 1,
                        content: [
                            {
                                type: 'heading',
                                content: ['# Chapter 1'],
                            },
                            {
                                type: 'verse',
                                number: 1,
                                content: [
                                    'إيسيول ربّي إ يُونان ممّيس ن أمتّاي إنّاياس:',
                                ],
                            },
                            {
                                type: 'verse',
                                number: 2,
                                content: [
                                    '«كّر الدُّو غَر نِينَوى ثامدينث ثاخاثارث، أها ثسغويّد غيفسن هاثين ثوليد ثوخّوت نّسن د لمعصيّاث نّا دا تݣّان غر داثي».',
                                ],
                            },
                            {
                                type: 'verse',
                                number: 3,
                                content: [
                                    'داي إيكّر يونان، أد يرول زݣ داث ن ربّي غر ترشيش، إيݣّزد غر يافا يافن ديس يان لباطو إيوجدن إ ثوادا غر ترشيش، أها إيش الخلاص نّس إيݣز غر الباطو أد إيمون د إيمسافرغر ترشيش إيرول زݣ داث ن ربّي.',
                                ],
                            },
                        ],
                        footnotes: [
                            {
                                noteId: 0,
                                text: '### Notes for Chapter 1',
                                caller: null,
                            },
                        ],
                    },
                    {
                        type: 'chapter',
                        number: 2,
                        content: [
                            {
                                type: 'heading',
                                content: ['# Chapter 2'],
                            },
                            {
                                type: 'verse',
                                number: 1,
                                content: [
                                    'داي إيژّال يونان إتّر إ ربّي نّس زݣ أوديس ن-وسلم.',
                                ],
                            },
                            {
                                type: 'verse',
                                number: 2,
                                content: [
                                    'إينّا: «غريخ إ يهويه ربّي ݣ-ثمارانو إيجَاوبِي، زݣ آيث ليخرا سغُويّخاشن أيهويه ربّي نو، تسفلت إ تغُويّيت إينو.',
                                ],
                            },
                        ],
                        footnotes: [
                            {
                                noteId: 1,
                                text: '### Notes for Chapter 2',
                                caller: null,
                            },
                        ],
                    },
                    {
                        type: 'chapter',
                        number: 3,
                        content: [
                            {
                                type: 'heading',
                                content: ['# Chapter 3'],
                            },
                            {
                                type: 'verse',
                                number: 1,
                                content: [
                                    'داي إيسيول ربّي إ يونان المرث ثيسناث إينّاس:',
                                ],
                            },
                            {
                                type: 'line_break',
                            },
                            {
                                type: 'verse',
                                number: 2,
                                content: [
                                    '«كّر الدّو غرنينوى ثمدينث تاخاثارث، ثسغويث دييس سوينّا الدّيخ أداش إينيخ».',
                                ],
                            },
                        ],
                        footnotes: [
                            {
                                noteId: 2,
                                text: '### Notes for Chapter 3',
                                caller: null,
                            },
                        ],
                    },
                    {
                        type: 'chapter',
                        number: 4,
                        content: [
                            {
                                type: 'heading',
                                content: ['# Chapter 4'],
                            },
                            {
                                type: 'verse',
                                number: 1,
                                content: [
                                    'داي إسطّيراست أوينّا إيونان شيݣان، إيسغوس أُوولنس.',
                                ],
                            },
                            {
                                type: 'verse',
                                number: 2,
                                content: [
                                    'أها إيژّال إتر إ ربّي إينّا: «عفاش أ يهويه ربّي إيس أوريد أوال إينو أيا النّا النّيخ أيللّيݣ سولخ يتمازيرت إينو أينّاخ أس الكّيخ ريخ أدرولخ غر ترشيش إتخ سنخ إيد شݣ ربّي أرحيم أحنين وريزربن ي الغظب نس إيعدّا ليخلاص نّش أرتسمهالث ثيثي خف أونّا يخّان.',
                                ],
                            },
                        ],
                        footnotes: [
                            {
                                noteId: 3,
                                text: '### Notes for Chapter 4',
                                caller: null,
                            },
                        ],
                    },
                ],
            });
        });
    });
});
