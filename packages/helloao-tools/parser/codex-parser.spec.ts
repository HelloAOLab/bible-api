import { CodexParser } from './codex-parser.js';
import CodexExample from './test/codex-simple-example.codex';
import NewCodexExample from './test/codex-new-example.codex';

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
                            languageId: 'html',
                            value: '<span>ཡོ་ན་ལ་ དང་པོ་ ཡི་ཤུའི་ ཁོ་ སུང་ཧད་ཞི་རྒེ་ མོལ་, "ཡོ་ན་ནེ་ པུ་ཙ་ ཨ་མི་ཏ་ཡེ་ འིན་," ཟེ་འིན་།</span>',
                            metadata: {
                                type: 'text',
                                id: 'JON 1:1',
                            },
                        },
                        {
                            kind: 2,
                            languageId: 'html',
                            value: 'ཡོྃ་རྡེ་ དངུལ་མེ་ ནི་ནེ་ཝེ་ སོང་, ཁོང་རྒུན་ལ་ ཀོན་འཇོག་རྒེ་ གསུང་, ཁོང་རྒུ་ནི་ ངན་པ་ ངེ་ མག་ལྟོང་ངེ་ ཐུག་པེན་ ཟེར་རྡེ་ མོལ་།',
                            metadata: {
                                type: 'text',
                                id: 'JON 1:2',
                            },
                        },
                        {
                            kind: 2,
                            languageId: 'html',
                            value: 'ཏེ་ནི་ ཡོ་ན་ ཀོན་འཇོག་རྒེ་ ཞིམ་གྱི་རེ་ རྒྱ་སྤོ་ རྒྱམ་ཚོའེ་ སྐོལ་རྦེ་ འདུན་ཏེ་, ཡོབ་མེ་ ལེབ་, ཏར་སུའི་པ་ སོང་འདེ་ ཆུ་ པེ་འང་ཞིག་ མངར་རྦེ་ རྩེ་མེད་མེ་ སོང་ ཁོ་རང་ངེ་ ཡོ་ཀེ་ནེ་ཀ་ ཀོན་འཇོག་རྒེ་ཀ་ནི་ རྒྱབ་ འགྱུར་རྦེ་ ཆུའི་ན་ སོང་ ཁོང་རྒུན་ལ་ ཏར་སུའི་པ་ རྒེ་ཀ་ ཡོྃ་ཏེ་ཀ་ནེ་ ལིའོ་ པེར་རྩེ་མེད་ མངར་རྦེ་ འིན་ཅེ་སོང་།',
                            metadata: {
                                type: 'text',
                                id: 'JON 1:3',
                            },
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
                                    'ཡོ་ན་ལ་ དང་པོ་ ཡི་ཤུའི་ ཁོ་ སུང་ཧད་ཞི་རྒེ་ མོལ་, "ཡོ་ན་ནེ་ པུ་ཙ་ ཨ་མི་ཏ་ཡེ་ འིན་," ཟེ་འིན་།',
                                ],
                            },
                            {
                                type: 'verse',
                                number: 2,
                                content: [
                                    'ཡོྃ་རྡེ་ དངུལ་མེ་ ནི་ནེ་ཝེ་ སོང་, ཁོང་རྒུན་ལ་ ཀོན་འཇོག་རྒེ་ གསུང་, ཁོང་རྒུ་ནི་ ངན་པ་ ངེ་ མག་ལྟོང་ངེ་ ཐུག་པེན་ ཟེར་རྡེ་ མོལ་།',
                                ],
                            },
                            {
                                type: 'verse',
                                number: 3,
                                content: [
                                    'ཏེ་ནི་ ཡོ་ན་ ཀོན་འཇོག་རྒེ་ ཞིམ་གྱི་རེ་ རྒྱ་སྤོ་ རྒྱམ་ཚོའེ་ སྐོལ་རྦེ་ འདུན་ཏེ་, ཡོབ་མེ་ ལེབ་, ཏར་སུའི་པ་ སོང་འདེ་ ཆུ་ པེ་འང་ཞིག་ མངར་རྦེ་ རྩེ་མེད་མེ་ སོང་ ཁོ་རང་ངེ་ ཡོ་ཀེ་ནེ་ཀ་ ཀོན་འཇོག་རྒེ་ཀ་ནི་ རྒྱབ་ འགྱུར་རྦེ་ ཆུའི་ན་ སོང་ ཁོང་རྒུན་ལ་ ཏར་སུའི་པ་ རྒེ་ཀ་ ཡོྃ་ཏེ་ཀ་ནེ་ ལིའོ་ པེར་རྩེ་མེད་ མངར་རྦེ་ འིན་ཅེ་སོང་།',
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
                            languageId: 'html',
                            value: '<span>ཡོ་ན་ལ་ དང་པོ་ ཡི་ཤུའི་ ཁོ་ སུང་ཧད་ཞི་རྒེ་ མོལ་, "ཡོ་ན་ནེ་ པུ་ཙ་ ཨ་མི་ཏ་ཡེ་ འིན་," ཟེ་འིན་།</span>',
                            metadata: {
                                type: 'text',
                                id: 'JON 1:1',
                            },
                        },
                        {
                            kind: 2,
                            languageId: 'html',
                            value: 'ཡོྃ་རྡེ་ དངུལ་མེ་ ནི་ནེ་ཝེ་ སོང་, ཁོང་རྒུན་ལ་ ཀོན་འཇོག་རྒེ་ གསུང་, ཁོང་རྒུ་ནི་ ངན་པ་ ངེ་ མག་ལྟོང་ངེ་ ཐུག་པེན་ ཟེར་རྡེ་ མོལ་།',
                            metadata: {
                                type: 'text',
                                id: 'JON 1:2',
                            },
                        },
                        {
                            kind: 2,
                            languageId: 'html',
                            value: 'ཏེ་ནི་ ཡོ་ན་ ཀོན་འཇོག་རྒེ་ ཞིམ་གྱི་རེ་ རྒྱ་སྤོ་ རྒྱམ་ཚོའེ་ སྐོལ་རྦེ་ འདུན་ཏེ་, ཡོབ་མེ་ ལེབ་, ཏར་སུའི་པ་ སོང་འདེ་ ཆུ་ པེ་འང་ཞིག་ མངར་རྦེ་ རྩེ་མེད་མེ་ སོང་ ཁོ་རང་ངེ་ ཡོ་ཀེ་ནེ་ཀ་ ཀོན་འཇོག་རྒེ་ཀ་ནི་ རྒྱབ་ འགྱུར་རྦེ་ ཆུའི་ན་ སོང་ ཁོང་རྒུན་ལ་ ཏར་སུའི་པ་ རྒེ་ཀ་ ཡོྃ་ཏེ་ཀ་ནེ་ ལིའོ་ པེར་རྩེ་མེད་ མངར་རྦེ་ འིན་ཅེ་སོང་།',
                            metadata: {
                                type: 'text',
                                id: 'JON 1:3',
                            },
                        },
                        {
                            kind: 2,
                            languageId: 'html',
                            value: '<span>ཡེ་གོ་བེ་ ཉ་ཆོན་མོ་ཞིག་རྒེ་ ནང་ནི་ ཡོ་ན་ལ་ འབློལ་ཏེ་ ཐོང་རྒེ་མེད་, དེ་ནི་ ཉ་ལུའི་ཧན་ ནང་ནི་ ཡོ་ན་ཚེན་ སུམ་ འདང་ ཉི་མ་ སུམ་མེ་ ཡོད་པེན་།</span>',
                            metadata: {
                                type: 'text',
                                id: 'JON 2:1',
                            },
                        },
                        {
                            kind: 2,
                            languageId: 'html',
                            value: 'ཉ་ལུའི་ཧན་ནང་ནས་ ཡོ་ན་ཡེ་གོ་བེ་ ཀོན་འཇོག་ལ་ མོ་ལམ་ ཞུའི་ མོལ་།',
                            metadata: {
                                type: 'text',
                                id: 'JON 2:2',
                            },
                        },
                        {
                            kind: 2,
                            languageId: 'html',
                            value: 'ངེ་ཀ་ འཇའི་རྐང་ནང་ ཡེ་གོ་བེ་དེ་ སོང་ ཟེར་དང་ ཁོང་ནི་ ཉམ་པོ་ ཏོང་རྒེ་མེད་། ངེ་ མངན་པོའི་ཧན་ནང་ ཤུག་རྒེ་ ཟེར་དང་ ཉེ་རང་ ངེ་ སུང་ཧད་ཅེ་ ཏུའི་རྒྱུན་ ཉེ་ནེ་ ཡོ་ཀན་འབོ།',
                            metadata: {
                                type: 'text',
                                id: 'JON 2:3',
                            },
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
                                    'ཡོ་ན་ལ་ དང་པོ་ ཡི་ཤུའི་ ཁོ་ སུང་ཧད་ཞི་རྒེ་ མོལ་, "ཡོ་ན་ནེ་ པུ་ཙ་ ཨ་མི་ཏ་ཡེ་ འིན་," ཟེ་འིན་།',
                                ],
                            },
                            {
                                type: 'verse',
                                number: 2,
                                content: [
                                    'ཡོྃ་རྡེ་ དངུལ་མེ་ ནི་ནེ་ཝེ་ སོང་, ཁོང་རྒུན་ལ་ ཀོན་འཇོག་རྒེ་ གསུང་, ཁོང་རྒུ་ནི་ ངན་པ་ ངེ་ མག་ལྟོང་ངེ་ ཐུག་པེན་ ཟེར་རྡེ་ མོལ་།',
                                ],
                            },
                            {
                                type: 'verse',
                                number: 3,
                                content: [
                                    'ཏེ་ནི་ ཡོ་ན་ ཀོན་འཇོག་རྒེ་ ཞིམ་གྱི་རེ་ རྒྱ་སྤོ་ རྒྱམ་ཚོའེ་ སྐོལ་རྦེ་ འདུན་ཏེ་, ཡོབ་མེ་ ལེབ་, ཏར་སུའི་པ་ སོང་འདེ་ ཆུ་ པེ་འང་ཞིག་ མངར་རྦེ་ རྩེ་མེད་མེ་ སོང་ ཁོ་རང་ངེ་ ཡོ་ཀེ་ནེ་ཀ་ ཀོན་འཇོག་རྒེ་ཀ་ནི་ རྒྱབ་ འགྱུར་རྦེ་ ཆུའི་ན་ སོང་ ཁོང་རྒུན་ལ་ ཏར་སུའི་པ་ རྒེ་ཀ་ ཡོྃ་ཏེ་ཀ་ནེ་ ལིའོ་ པེར་རྩེ་མེད་ མངར་རྦེ་ འིན་ཅེ་སོང་།',
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
                                    'ཡེ་གོ་བེ་ ཉ་ཆོན་མོ་ཞིག་རྒེ་ ནང་ནི་ ཡོ་ན་ལ་ འབློལ་ཏེ་ ཐོང་རྒེ་མེད་, དེ་ནི་ ཉ་ལུའི་ཧན་ ནང་ནི་ ཡོ་ན་ཚེན་ སུམ་ འདང་ ཉི་མ་ སུམ་མེ་ ཡོད་པེན་།',
                                ],
                            },
                            {
                                type: 'verse',
                                number: 2,
                                content: [
                                    'ཉ་ལུའི་ཧན་ནང་ནས་ ཡོ་ན་ཡེ་གོ་བེ་ ཀོན་འཇོག་ལ་ མོ་ལམ་ ཞུའི་ མོལ་།',
                                ],
                            },
                            {
                                type: 'verse',
                                number: 3,
                                content: [
                                    'ངེ་ཀ་ འཇའི་རྐང་ནང་ ཡེ་གོ་བེ་དེ་ སོང་ ཟེར་དང་ ཁོང་ནི་ ཉམ་པོ་ ཏོང་རྒེ་མེད་། ངེ་ མངན་པོའི་ཧན་ནང་ ཤུག་རྒེ་ ཟེར་དང་ ཉེ་རང་ ངེ་ སུང་ཧད་ཅེ་ ཏུའི་རྒྱུན་ ཉེ་ནེ་ ཡོ་ཀན་འབོ།',
                                ],
                            },
                        ],
                        footnotes: [],
                    },
                ],
            });
        });

        // it('should interpret multiple newlines as a line break', () => {
        //     const tree = parser.parse(
        //         JSON.stringify({
        //             cells: [
        //                 {
        //                     kind: 2,
        //                     languageId: 'scripture',
        //                     value: [
        //                         'JON 1:1 إيسيول ربّي إ يُونان ممّيس ن أمتّاي إنّاياس:',
        //                         '',
        //                         'JON 1:2 «كّر الدُّو غَر نِينَوى ثامدينث ثاخاثارث، أها ثسغويّد غيفسن هاثين ثوليد ثوخّوت نّسن د لمعصيّاث نّا دا تݣّان غر داثي».',
        //                     ].join('\n'),
        //                 },
        //             ],
        //         })
        //     );

        //     expect(tree).toEqual({
        //         type: 'root',
        //         id: 'JON',
        //         content: [
        //             {
        //                 type: 'chapter',
        //                 number: 1,
        //                 content: [
        //                     {
        //                         type: 'verse',
        //                         number: 1,
        //                         content: [
        //                             'إيسيول ربّي إ يُونان ممّيس ن أمتّاي إنّاياس:',
        //                         ],
        //                     },
        //                     {
        //                         type: 'line_break',
        //                     },
        //                     {
        //                         type: 'verse',
        //                         number: 2,
        //                         content: [
        //                             '«كّر الدُّو غَر نِينَوى ثامدينث ثاخاثارث، أها ثسغويّد غيفسن هاثين ثوليد ثوخّوت نّسن د لمعصيّاث نّا دا تݣّان غر داثي».',
        //                         ],
        //                     },
        //                 ],
        //                 footnotes: [],
        //             },
        //         ],
        //     });
        // });

        it('should be able to have a line break inside a verse', () => {
            const tree = parser.parse(
                JSON.stringify({
                    cells: [
                        {
                            kind: 2,
                            languageId: 'html',
                            value: '<span>ཡོ་ན་ལ་ དང་པོ་ ཡི་ཤུའི་ ཁོ་ སུང་ཧད་ཞི་རྒེ་ མོལ་, "ཡོ་ན་ནེ་ པུ་ཙ་ ཨ་མི་ཏ་ཡེ་ འིན་," ཟེ་འིན་།</span>',
                            metadata: {
                                type: 'text',
                                id: 'JON 1:1',
                            },
                        },
                        {
                            kind: 2,
                            languageId: 'html',
                            value: 'ཡོྃ་རྡེ་ དངུལ་མེ་ ནི་ནེ་ཝེ་ སོང་, ཁོང་རྒུན་ལ་ ཀོན་འཇོག་རྒེ་ གསུང་, ཁོང་རྒུ་ནི་\n ངན་པ་ ངེ་ མག་ལྟོང་ངེ་ ཐུག་པེན་ ཟེར་རྡེ་ མོལ་།',
                            metadata: {
                                type: 'text',
                                id: 'JON 1:2',
                            },
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
                                    'ཡོ་ན་ལ་ དང་པོ་ ཡི་ཤུའི་ ཁོ་ སུང་ཧད་ཞི་རྒེ་ མོལ་, "ཡོ་ན་ནེ་ པུ་ཙ་ ཨ་མི་ཏ་ཡེ་ འིན་," ཟེ་འིན་།',
                                ],
                            },
                            {
                                type: 'verse',
                                number: 2,
                                content: [
                                    'ཡོྃ་རྡེ་ དངུལ་མེ་ ནི་ནེ་ཝེ་ སོང་, ཁོང་རྒུན་ལ་ ཀོན་འཇོག་རྒེ་ གསུང་, ཁོང་རྒུ་ནི་',
                                    { lineBreak: true },
                                    ' ངན་པ་ ངེ་ མག་ལྟོང་ངེ་ ཐུག་པེན་ ཟེར་རྡེ་ མོལ་།',
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
                            kind: 2,
                            languageId: 'html',
                            value: '<h1>The Beginning</h1>',
                            metadata: {
                                type: 'paratext',
                                id: 'JON 1',
                            },
                        },
                        {
                            kind: 2,
                            languageId: 'html',
                            value: '<span>ཡོ་ན་ལ་ དང་པོ་ ཡི་ཤུའི་ ཁོ་ སུང་ཧད་ཞི་རྒེ་ མོལ་, "ཡོ་ན་ནེ་ པུ་ཙ་ ཨ་མི་ཏ་ཡེ་ འིན་," ཟེ་འིན་།</span>',
                            metadata: {
                                type: 'text',
                                id: 'JON 1:1',
                            },
                        },
                        {
                            kind: 2,
                            languageId: 'html',
                            value: 'ཡོྃ་རྡེ་ དངུལ་མེ་ ནི་ནེ་ཝེ་ སོང་, ཁོང་རྒུན་ལ་ ཀོན་འཇོག་རྒེ་ གསུང་, ཁོང་རྒུ་ནི་ ངན་པ་ ངེ་ མག་ལྟོང་ངེ་ ཐུག་པེན་ ཟེར་རྡེ་ མོལ་།',
                            metadata: {
                                type: 'text',
                                id: 'JON 1:2',
                            },
                        },
                        {
                            kind: 2,
                            languageId: 'html',
                            value: '<h1>The Wedding at Cana</h1>',
                            metadata: {
                                type: 'paratext',
                                id: 'JON 2',
                            },
                        },
                        {
                            kind: 2,
                            languageId: 'html',
                            value: '<span>ཡེ་གོ་བེ་ ཉ་ཆོན་མོ་ཞིག་རྒེ་ ནང་ནི་ ཡོ་ན་ལ་ འབློལ་ཏེ་ ཐོང་རྒེ་མེད་, དེ་ནི་ ཉ་ལུའི་ཧན་ ནང་ནི་ ཡོ་ན་ཚེན་ སུམ་ འདང་ ཉི་མ་ སུམ་མེ་ ཡོད་པེན་།</span>',
                            metadata: {
                                type: 'text',
                                id: 'JON 2:1',
                            },
                        },
                        {
                            kind: 2,
                            languageId: 'html',
                            value: 'ཉ་ལུའི་ཧན་ནང་ནས་ ཡོ་ན་ཡེ་གོ་བེ་ ཀོན་འཇོག་ལ་ མོ་ལམ་ ཞུའི་ མོལ་།',
                            metadata: {
                                type: 'text',
                                id: 'JON 2:2',
                            },
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
                                content: ['The Beginning'],
                            },
                            {
                                type: 'verse',
                                number: 1,
                                content: [
                                    'ཡོ་ན་ལ་ དང་པོ་ ཡི་ཤུའི་ ཁོ་ སུང་ཧད་ཞི་རྒེ་ མོལ་, "ཡོ་ན་ནེ་ པུ་ཙ་ ཨ་མི་ཏ་ཡེ་ འིན་," ཟེ་འིན་།',
                                ],
                            },
                            {
                                type: 'verse',
                                number: 2,
                                content: [
                                    'ཡོྃ་རྡེ་ དངུལ་མེ་ ནི་ནེ་ཝེ་ སོང་, ཁོང་རྒུན་ལ་ ཀོན་འཇོག་རྒེ་ གསུང་, ཁོང་རྒུ་ནི་ ངན་པ་ ངེ་ མག་ལྟོང་ངེ་ ཐུག་པེན་ ཟེར་རྡེ་ མོལ་།',
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
                                content: ['The Wedding at Cana'],
                            },
                            {
                                type: 'verse',
                                number: 1,
                                content: [
                                    'ཡེ་གོ་བེ་ ཉ་ཆོན་མོ་ཞིག་རྒེ་ ནང་ནི་ ཡོ་ན་ལ་ འབློལ་ཏེ་ ཐོང་རྒེ་མེད་, དེ་ནི་ ཉ་ལུའི་ཧན་ ནང་ནི་ ཡོ་ན་ཚེན་ སུམ་ འདང་ ཉི་མ་ སུམ་མེ་ ཡོད་པེན་།',
                                ],
                            },
                            {
                                type: 'verse',
                                number: 2,
                                content: [
                                    'ཉ་ལུའི་ཧན་ནང་ནས་ ཡོ་ན་ཡེ་གོ་བེ་ ཀོན་འཇོག་ལ་ མོ་ལམ་ ཞུའི་ མོལ་།',
                                ],
                            },
                        ],
                        footnotes: [],
                    },
                ],
            });
        });

        it('should be able to support multi-line chapter headings', () => {
            const tree = parser.parse(
                JSON.stringify({
                    cells: [
                        {
                            kind: 2,
                            languageId: 'html',
                            value: '<h1>The Beginning</h1>\n<h1>Second Line</h1>',
                            metadata: {
                                type: 'paratext',
                                id: 'JON 1',
                            },
                        },
                        {
                            kind: 2,
                            languageId: 'html',
                            value: '<span>ཡོ་ན་ལ་ དང་པོ་ ཡི་ཤུའི་ ཁོ་ སུང་ཧད་ཞི་རྒེ་ མོལ་, "ཡོ་ན་ནེ་ པུ་ཙ་ ཨ་མི་ཏ་ཡེ་ འིན་," ཟེ་འིན་།</span>',
                            metadata: {
                                type: 'text',
                                id: 'JON 1:1',
                            },
                        },
                        {
                            kind: 2,
                            languageId: 'html',
                            value: 'ཡོྃ་རྡེ་ དངུལ་མེ་ ནི་ནེ་ཝེ་ སོང་, ཁོང་རྒུན་ལ་ ཀོན་འཇོག་རྒེ་ གསུང་, ཁོང་རྒུ་ནི་ ངན་པ་ ངེ་ མག་ལྟོང་ངེ་ ཐུག་པེན་ ཟེར་རྡེ་ མོལ་།',
                            metadata: {
                                type: 'text',
                                id: 'JON 1:2',
                            },
                        },
                        {
                            kind: 2,
                            languageId: 'html',
                            value: '<h1>The Wedding at Cana</h1>\n<h1>Second Line</h1>',
                            metadata: {
                                type: 'paratext',
                                id: 'JON 2',
                            },
                        },
                        {
                            kind: 2,
                            languageId: 'html',
                            value: '<span>ཡེ་གོ་བེ་ ཉ་ཆོན་མོ་ཞིག་རྒེ་ ནང་ནི་ ཡོ་ན་ལ་ འབློལ་ཏེ་ ཐོང་རྒེ་མེད་, དེ་ནི་ ཉ་ལུའི་ཧན་ ནང་ནི་ ཡོ་ན་ཚེན་ སུམ་ འདང་ ཉི་མ་ སུམ་མེ་ ཡོད་པེན་།</span>',
                            metadata: {
                                type: 'text',
                                id: 'JON 2:1',
                            },
                        },
                        {
                            kind: 2,
                            languageId: 'html',
                            value: 'ཉ་ལུའི་ཧན་ནང་ནས་ ཡོ་ན་ཡེ་གོ་བེ་ ཀོན་འཇོག་ལ་ མོ་ལམ་ ཞུའི་ མོལ་།',
                            metadata: {
                                type: 'text',
                                id: 'JON 2:2',
                            },
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
                                content: ['The Beginning'],
                            },
                            {
                                type: 'line_break',
                            },
                            {
                                type: 'heading',
                                content: ['Second Line'],
                            },
                            {
                                type: 'verse',
                                number: 1,
                                content: [
                                    'ཡོ་ན་ལ་ དང་པོ་ ཡི་ཤུའི་ ཁོ་ སུང་ཧད་ཞི་རྒེ་ མོལ་, "ཡོ་ན་ནེ་ པུ་ཙ་ ཨ་མི་ཏ་ཡེ་ འིན་," ཟེ་འིན་།',
                                ],
                            },
                            {
                                type: 'verse',
                                number: 2,
                                content: [
                                    'ཡོྃ་རྡེ་ དངུལ་མེ་ ནི་ནེ་ཝེ་ སོང་, ཁོང་རྒུན་ལ་ ཀོན་འཇོག་རྒེ་ གསུང་, ཁོང་རྒུ་ནི་ ངན་པ་ ངེ་ མག་ལྟོང་ངེ་ ཐུག་པེན་ ཟེར་རྡེ་ མོལ་།',
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
                                content: ['The Wedding at Cana'],
                            },
                            {
                                type: 'line_break',
                            },
                            {
                                type: 'heading',
                                content: ['Second Line'],
                            },
                            {
                                type: 'verse',
                                number: 1,
                                content: [
                                    'ཡེ་གོ་བེ་ ཉ་ཆོན་མོ་ཞིག་རྒེ་ ནང་ནི་ ཡོ་ན་ལ་ འབློལ་ཏེ་ ཐོང་རྒེ་མེད་, དེ་ནི་ ཉ་ལུའི་ཧན་ ནང་ནི་ ཡོ་ན་ཚེན་ སུམ་ འདང་ ཉི་མ་ སུམ་མེ་ ཡོད་པེན་།',
                                ],
                            },
                            {
                                type: 'verse',
                                number: 2,
                                content: [
                                    'ཉ་ལུའི་ཧན་ནང་ནས་ ཡོ་ན་ཡེ་གོ་བེ་ ཀོན་འཇོག་ལ་ མོ་ལམ་ ཞུའི་ མོལ་།',
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
                            kind: 2,
                            languageId: 'html',
                            value: '<h1>The Beginning</h1>',
                            metadata: {
                                type: 'paratext',
                                id: 'JON 1',
                            },
                        },
                        {
                            kind: 2,
                            languageId: 'html',
                            value: '<span>ཡོ་ན་ལ་ དང་པོ་ ཡི་ཤུའི་ ཁོ་ སུང་ཧད་ཞི་རྒེ་ མོལ་, "ཡོ་ན་ནེ་ པུ་ཙ་ ཨ་མི་ཏ་ཡེ་ འིན་," ཟེ་འིན་།</span>',
                            metadata: {
                                type: 'text',
                                id: 'JON 1:1',
                            },
                        },
                        {
                            kind: 2,
                            languageId: 'html',
                            value: 'ཡོྃ་རྡེ་ དངུལ་མེ་ ནི་ནེ་ཝེ་ སོང་, ཁོང་རྒུན་ལ་ ཀོན་འཇོག་རྒེ་ གསུང་, ཁོང་རྒུ་ནི་ ངན་པ་ ངེ་ མག་ལྟོང་ངེ་ ཐུག་པེན་ ཟེར་རྡེ་ མོལ་།',
                            metadata: {
                                type: 'text',
                                id: 'JON 1:2',
                            },
                        },
                        {
                            kind: 2,
                            languageId: 'anything',
                            value: '<h1>The Wedding at Cana</h1>',
                            metadata: {
                                type: 'paratext',
                                id: 'JON 2',
                            },
                        },
                        {
                            kind: 2,
                            languageId: 'html',
                            value: 'ཉ་ལུའི་ཧན་ནང་ནས་ ཡོ་ན་ཡེ་གོ་བེ་ ཀོན་འཇོག་ལ་ མོ་ལམ་ ཞུའི་ མོལ་།',
                            metadata: {
                                type: 'text',
                                id: 'JON 2:2',
                            },
                        },
                        {
                            kind: 2,
                            languageId: 'html',
                            value: 'ངེ་ཀ་ འཇའི་རྐང་ནང་ ཡེ་གོ་བེ་དེ་ སོང་ ཟེར་དང་ ཁོང་ནི་ ཉམ་པོ་ ཏོང་རྒེ་མེད་། ངེ་ མངན་པོའི་ཧན་ནང་ ཤུག་རྒེ་ ཟེར་དང་ ཉེ་རང་ ངེ་ སུང་ཧད་ཅེ་ ཏུའི་རྒྱུན་ ཉེ་ནེ་ ཡོ་ཀན་འབོ།',
                            metadata: {
                                type: 'text',
                                id: 'JON 2:3',
                            },
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
                                content: ['The Beginning'],
                            },
                            {
                                type: 'verse',
                                number: 1,
                                content: [
                                    'ཡོ་ན་ལ་ དང་པོ་ ཡི་ཤུའི་ ཁོ་ སུང་ཧད་ཞི་རྒེ་ མོལ་, "ཡོ་ན་ནེ་ པུ་ཙ་ ཨ་མི་ཏ་ཡེ་ འིན་," ཟེ་འིན་།',
                                ],
                            },
                            {
                                type: 'verse',
                                number: 2,
                                content: [
                                    'ཡོྃ་རྡེ་ དངུལ་མེ་ ནི་ནེ་ཝེ་ སོང་, ཁོང་རྒུན་ལ་ ཀོན་འཇོག་རྒེ་ གསུང་, ཁོང་རྒུ་ནི་ ངན་པ་ ངེ་ མག་ལྟོང་ངེ་ ཐུག་པེན་ ཟེར་རྡེ་ མོལ་།',
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
                                number: 2,
                                content: [
                                    'ཉ་ལུའི་ཧན་ནང་ནས་ ཡོ་ན་ཡེ་གོ་བེ་ ཀོན་འཇོག་ལ་ མོ་ལམ་ ཞུའི་ མོལ་།',
                                ],
                            },
                            {
                                type: 'verse',
                                number: 3,
                                content: [
                                    'ངེ་ཀ་ འཇའི་རྐང་ནང་ ཡེ་གོ་བེ་དེ་ སོང་ ཟེར་དང་ ཁོང་ནི་ ཉམ་པོ་ ཏོང་རྒེ་མེད་། ངེ་ མངན་པོའི་ཧན་ནང་ ཤུག་རྒེ་ ཟེར་དང་ ཉེ་རང་ ངེ་ སུང་ཧད་ཅེ་ ཏུའི་རྒྱུན་ ཉེ་ནེ་ ཡོ་ཀན་འབོ།',
                                ],
                            },
                        ],
                        footnotes: [],
                    },
                ],
            });
        });

        it('should be able to ignore cells that dont have a', () => {
            const tree = parser.parse(
                JSON.stringify({
                    cells: [
                        {
                            kind: 2,
                            languageId: 'html',
                            value: '<h1>The Beginning</h1>',
                            metadata: {
                                type: 'paratext',
                                id: 'JON 1',
                            },
                        },
                        {
                            kind: 2,
                            languageId: 'html',
                            value: '',
                            metadata: {
                                type: 'text',
                                id: 'JON 1:1',
                            },
                        },
                        {
                            kind: 2,
                            languageId: 'html',
                            value: 'ཡོྃ་རྡེ་ དངུལ་མེ་ ནི་ནེ་ཝེ་ སོང་, ཁོང་རྒུན་ལ་ ཀོན་འཇོག་རྒེ་ གསུང་, ཁོང་རྒུ་ནི་ ངན་པ་ ངེ་ མག་ལྟོང་ངེ་ ཐུག་པེན་ ཟེར་རྡེ་ མོལ་།',
                            metadata: {
                                type: 'text',
                                id: 'JON 1:2',
                            },
                        },
                        {
                            kind: 2,
                            languageId: 'html',
                            value: '',
                            metadata: {
                                type: 'paratext',
                                id: 'JON 2',
                            },
                        },
                        {
                            kind: 2,
                            languageId: 'html',
                            value: 'ཉ་ལུའི་ཧན་ནང་ནས་ ཡོ་ན་ཡེ་གོ་བེ་ ཀོན་འཇོག་ལ་ མོ་ལམ་ ཞུའི་ མོལ་།',
                            metadata: {
                                type: 'text',
                                id: 'JON 2:2',
                            },
                        },
                        {
                            kind: 2,
                            languageId: 'html',
                            value: 'ངེ་ཀ་ འཇའི་རྐང་ནང་ ཡེ་གོ་བེ་དེ་ སོང་ ཟེར་དང་ ཁོང་ནི་ ཉམ་པོ་ ཏོང་རྒེ་མེད་། ངེ་ མངན་པོའི་ཧན་ནང་ ཤུག་རྒེ་ ཟེར་དང་ ཉེ་རང་ ངེ་ སུང་ཧད་ཅེ་ ཏུའི་རྒྱུན་ ཉེ་ནེ་ ཡོ་ཀན་འབོ།',
                            metadata: {
                                type: 'text',
                                id: 'JON 2:3',
                            },
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
                                content: ['The Beginning'],
                            },
                            {
                                type: 'verse',
                                number: 2,
                                content: [
                                    'ཡོྃ་རྡེ་ དངུལ་མེ་ ནི་ནེ་ཝེ་ སོང་, ཁོང་རྒུན་ལ་ ཀོན་འཇོག་རྒེ་ གསུང་, ཁོང་རྒུ་ནི་ ངན་པ་ ངེ་ མག་ལྟོང་ངེ་ ཐུག་པེན་ ཟེར་རྡེ་ མོལ་།',
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
                                number: 2,
                                content: [
                                    'ཉ་ལུའི་ཧན་ནང་ནས་ ཡོ་ན་ཡེ་གོ་བེ་ ཀོན་འཇོག་ལ་ མོ་ལམ་ ཞུའི་ མོལ་།',
                                ],
                            },
                            {
                                type: 'verse',
                                number: 3,
                                content: [
                                    'ངེ་ཀ་ འཇའི་རྐང་ནང་ ཡེ་གོ་བེ་དེ་ སོང་ ཟེར་དང་ ཁོང་ནི་ ཉམ་པོ་ ཏོང་རྒེ་མེད་། ངེ་ མངན་པོའི་ཧན་ནང་ ཤུག་རྒེ་ ཟེར་དང་ ཉེ་རང་ ངེ་ སུང་ཧད་ཅེ་ ཏུའི་རྒྱུན་ ཉེ་ནེ་ ཡོ་ཀན་འབོ།',
                                ],
                            },
                        ],
                        footnotes: [],
                    },
                ],
            });
        });

        // it('should be able to parse markdown notes', () => {
        //     const tree = parser.parse(
        //         JSON.stringify({
        //             cells: [
        //                 {
        //                     kind: 2,
        //                     languageId: 'markdown',
        //                     value: '<h1>The Beginning</h1>',
        //                     metadata: {
        //                         type: 'paratext',
        //                         id: 'JON 1',
        //                     },
        //                 },
        //                 {
        //                     kind: 2,
        //                     languageId: 'html',
        //                     value: '### note1',
        //                 },
        //                 {
        //                     kind: 2,
        //                     languageId: 'html',
        //                     value: '<span>ཡོ་ན་ལ་ དང་པོ་ ཡི་ཤུའི་ ཁོ་ སུང་ཧད་ཞི་རྒེ་ མོལ་, "ཡོ་ན་ནེ་ པུ་ཙ་ ཨ་མི་ཏ་ཡེ་ འིན་," ཟེ་འིན་།</span>',
        //                     metadata: {
        //                         type: 'text',
        //                         id: 'JON 1:1',
        //                     },
        //                 },
        //                 {
        //                     kind: 2,
        //                     languageId: 'html',
        //                     value: 'ཡོྃ་རྡེ་ དངུལ་མེ་ ནི་ནེ་ཝེ་ སོང་, ཁོང་རྒུན་ལ་ ཀོན་འཇོག་རྒེ་ གསུང་, ཁོང་རྒུ་ནི་ ངན་པ་ ངེ་ མག་ལྟོང་ངེ་ ཐུག་པེན་ ཟེར་རྡེ་ མོལ་།',
        //                     metadata: {
        //                         type: 'text',
        //                         id: 'JON 1:2',
        //                     },
        //                 },
        //                 {
        //                     kind: 2,
        //                     languageId: 'markdown',
        //                     value: '### note2',
        //                 },
        //             ],
        //         })
        //     );

        //     expect(tree).toEqual({
        //         type: 'root',
        //         id: 'JON',
        //         content: [
        //             {
        //                 type: 'chapter',
        //                 number: 1,
        //                 content: [
        //                     {
        //                         type: 'heading',
        //                         content: ['The Beginning'],
        //                     },
        //                     {
        //                         type: 'verse',
        //                         number: 1,
        //                         content: [
        //                             'ཡོ་ན་ལ་ དང་པོ་ ཡི་ཤུའི་ ཁོ་ སུང་ཧད་ཞི་རྒེ་ མོལ་, "ཡོ་ན་ནེ་ པུ་ཙ་ ཨ་མི་ཏ་ཡེ་ འིན་," ཟེ་འིན་།',
        //                         ],
        //                     },
        //                     {
        //                         type: 'verse',
        //                         number: 2,
        //                         content: [
        //                             'ཡོྃ་རྡེ་ དངུལ་མེ་ ནི་ནེ་ཝེ་ སོང་, ཁོང་རྒུན་ལ་ ཀོན་འཇོག་རྒེ་ གསུང་, ཁོང་རྒུ་ནི་ ངན་པ་ ངེ་ མག་ལྟོང་ངེ་ ཐུག་པེན་ ཟེར་རྡེ་ མོལ་།',
        //                         ],
        //                     },
        //                 ],
        //                 footnotes: [
        //                     {
        //                         noteId: 0,
        //                         text: '### note1',
        //                         caller: null,
        //                     },
        //                     {
        //                         noteId: 1,
        //                         text: '### note2',
        //                         caller: null,
        //                     },
        //                 ],
        //             },
        //         ],
        //     });
        // });

        // it.skip('should be able to transform markdown into regular text', () => {
        //     // parser.preserveMarkdown = false;

        //     const tree = parser.parse(
        //         JSON.stringify({
        //             cells: [
        //                 {
        //                     kind: 2,
        //                     languageId: 'html',
        //                     value: '<h1>The Beginning</h1>',
        //                     metadata: {
        //                         type: 'paratext',
        //                         id: 'JON 1',
        //                     },
        //                 },
        //                 {
        //                     kind: 2,
        //                     languageId: 'html',
        //                     value: '<span>note1</span>',
        //                 },
        //                 {
        //                     kind: 2,
        //                     languageId: 'html',
        //                     value: '<span>ཡོ་ན་ལ་ དང་པོ་ ཡི་ཤུའི་ ཁོ་ སུང་ཧད་ཞི་རྒེ་ མོལ་, "ཡོ་ན་ནེ་ པུ་ཙ་ ཨ་མི་ཏ་ཡེ་ འིན་," ཟེ་འིན་།</span>',
        //                     metadata: {
        //                         type: 'text',
        //                         id: 'JON 1:1',
        //                     },
        //                 },
        //                 {
        //                     kind: 2,
        //                     languageId: 'html',
        //                     value: 'ཡོྃ་རྡེ་ དངུལ་མེ་ ནི་ནེ་ཝེ་ སོང་, ཁོང་རྒུན་ལ་ ཀོན་འཇོག་རྒེ་ གསུང་, ཁོང་རྒུ་ནི་ ངན་པ་ ངེ་ མག་ལྟོང་ངེ་ ཐུག་པེན་ ཟེར་རྡེ་ མོལ་།',
        //                     metadata: {
        //                         type: 'text',
        //                         id: 'JON 1:2',
        //                     },
        //                 },
        //                 {
        //                     kind: 2,
        //                     languageId: 'html',
        //                     value: '<span>note2</span>',
        //                 },
        //             ],
        //         })
        //     );

        //     expect(tree).toEqual({
        //         type: 'root',
        //         id: 'JON',
        //         content: [
        //             {
        //                 type: 'chapter',
        //                 number: 1,
        //                 content: [
        //                     {
        //                         type: 'heading',
        //                         content: ['The Beginning'],
        //                     },
        //                     {
        //                         type: 'verse',
        //                         number: 1,
        //                         content: [
        //                             'ཡོ་ན་ལ་ དང་པོ་ ཡི་ཤུའི་ ཁོ་ སུང་ཧད་ཞི་རྒེ་ མོལ་, "ཡོ་ན་ནེ་ པུ་ཙ་ ཨ་མི་ཏ་ཡེ་ འིན་," ཟེ་འིན་།',
        //                         ],
        //                     },
        //                     {
        //                         type: 'verse',
        //                         number: 2,
        //                         content: [
        //                             'ཡོྃ་རྡེ་ དངུལ་མེ་ ནི་ནེ་ཝེ་ སོང་, ཁོང་རྒུན་ལ་ ཀོན་འཇོག་རྒེ་ གསུང་, ཁོང་རྒུ་ནི་ ངན་པ་ ངེ་ མག་ལྟོང་ངེ་ ཐུག་པེན་ ཟེར་རྡེ་ མོལ་།',
        //                         ],
        //                     },
        //                 ],
        //                 footnotes: [
        //                     {
        //                         noteId: 0,
        //                         text: 'note1',
        //                         caller: null,
        //                     },
        //                     {
        //                         noteId: 1,
        //                         text: 'note2',
        //                         caller: null,
        //                     },
        //                 ],
        //             },
        //         ],
        //     });
        // });

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
                                type: 'verse',
                                number: 1,
                                content: [
                                    'ཡོ་ན་ལ་ དང་པོ་ ཡི་ཤུའི་ ཁོ་ སུང་ཧད་ཞི་རྒེ་ མོལ་, "ཡོ་ན་ནེ་ པུ་ཙ་ ཨ་མི་ཏ་ཡེ་ འིན་," ཟེ་འིན་།',
                                ],
                            },
                            {
                                type: 'verse',
                                number: 2,
                                content: [
                                    'ཡོྃ་རྡེ་ དངུལ་མེ་ ནི་ནེ་ཝེ་ སོང་, ཁོང་རྒུན་ལ་ ཀོན་འཇོག་རྒེ་ གསུང་, ཁོང་རྒུ་ནི་ ངན་པ་ ངེ་ མག་ལྟོང་ངེ་ ཐུག་པེན་ ཟེར་རྡེ་ མོལ་།',
                                ],
                            },
                            {
                                type: 'verse',
                                number: 3,
                                content: [
                                    'ཏེ་ནི་ ཡོ་ན་ ཀོན་འཇོག་རྒེ་ ཞིམ་གྱི་རེ་ རྒྱ་སྤོ་ རྒྱམ་ཚོའེ་ སྐོལ་རྦེ་ འདུན་ཏེ་, ཡོབ་མེ་ ལེབ་, ཏར་སུའི་པ་ སོང་འདེ་ ཆུ་ པེ་འང་ཞིག་ མངར་རྦེ་ རྩེ་མེད་མེ་ སོང་ ཁོ་རང་ངེ་ ཡོ་ཀེ་ནེ་ཀ་ ཀོན་འཇོག་རྒེ་ཀ་ནི་ རྒྱབ་ འགྱུར་རྦེ་ ཆུའི་ན་ སོང་ ཁོང་རྒུན་ལ་ ཏར་སུའི་པ་ རྒེ་ཀ་ ཡོྃ་ཏེ་ཀ་ནེ་ ལིའོ་ པེར་རྩེ་མེད་ མངར་རྦེ་ འིན་ཅེ་སོང་།',
                                ],
                            },
                            {
                                type: 'verse',
                                number: 4,
                                content: [
                                    'ཡེ་གོ་བེ་ ཏེ་ རྒྱམ་ཚོའེ་ན་ ལུང་ཀྲག་ ཆོན་མོ་ཞིག་རྒེ་ འདེད་ཏེ་, དེ་དོན་སུ་ རྒྱམ་ཚོའེ་ན་ ཆུ་རེལ་ ཆོན་མོ་ཞིག་རྒེ་ སོང་།',
                                ],
                            },
                        ],
                        footnotes: [],
                    },
                    {
                        content: [
                            {
                                content: [
                                    'ཡེ་གོ་བེ་ ཉ་ཆོན་མོ་ཞིག་རྒེ་ ནང་ནི་ ཡོ་ན་ལ་ འབློལ་ཏེ་ ཐོང་རྒེ་མེད་, དེ་ནི་ ཉ་ལུའི་ཧན་ ནང་ནི་ ཡོ་ན་ཚེན་ སུམ་ འདང་ ཉི་མ་ སུམ་མེ་ ཡོད་པེན་།',
                                ],
                                number: 1,
                                type: 'verse',
                            },
                            {
                                content: [
                                    'ཉ་ལུའི་ཧན་ནང་ནས་ ཡོ་ན་ཡེ་གོ་བེ་ ཀོན་འཇོག་ལ་ མོ་ལམ་ ཞུའི་ མོལ་།',
                                ],
                                number: 2,
                                type: 'verse',
                            },
                            {
                                content: [
                                    'ངེ་ཀ་ འཇའི་རྐང་ནང་ ཡེ་གོ་བེ་དེ་ སོང་ ཟེར་དང་ ཁོང་ནི་ ཉམ་པོ་ ཏོང་རྒེ་མེད་། ངེ་ མངན་པོའི་ཧན་ནང་ ཤུག་རྒེ་ ཟེར་དང་ ཉེ་རང་ ངེ་ སུང་ཧད་ཅེ་ ཏུའི་རྒྱུན་ ཉེ་ནེ་ ཡོ་ཀན་འབོ།',
                                ],
                                number: 3,
                                type: 'verse',
                            },
                        ],
                        footnotes: [],
                        number: 2,
                        type: 'chapter',
                    },
                ],
            });
        });

        it('should parse a new codex file', () => {
            const tree = parser.parse(NewCodexExample);
            expect(tree).toMatchSnapshot();
        });
    });
});
