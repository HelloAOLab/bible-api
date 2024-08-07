import { CodexParser } from "./codex-parser";
import CodexExample from './test/codex-example.codex';

describe('CodexParser', () => {

    let parser: CodexParser;

    beforeEach(() => {
        parser = new CodexParser();
    });

    describe('parse', () => {
        it('should parse a codex file', () => {
            const tree = parser.parse(CodexExample);

            expect(tree).toEqual({
                type: 'root',
                content: [
                    {
                        type: 'chapter',
                        number: 1,
                        content: [
                            {
                                type: 'heading',
                                content: ['Chapter 1']
                            },
                            {
                                type: 'verse',
                                number: 1,
                                content: ['إيسيول ربّي إ يُونان ممّيس ن أمتّاي إنّاياس:']
                            },
                            {
                                type: 'verse',
                                number: 2,
                                content: ['«كّر الدُّو غَر نِينَوى ثامدينث ثاخاثارث، أها ثسغويّد غيفسن هاثين ثوليد ثوخّوت نّسن د لمعصيّاث نّا دا تݣّان غر داثي'],
                            },
                            {
                                type: 'verse',
                                number: 3,
                                content: ['داي إيكّر يونان، أد يرول زݣ داث ن ربّي غر ترشيش، إيݣّزد غر يافا يافن ديس يان لباطو إيوجدن إ ثوادا غر ترشيش، أها إيش الخلاص نّس إيݣز غر الباطو أد إيمون د إيمسافرغر ترشيش إيرول زݣ داث ن ربّي']
                            },
                        ]
                    },
                    {
                        type: 'chapter',
                        number: 2,
                        content: [
                            {
                                type: 'heading',
                                content: 'Chapter 2',
                            },
                            {
                                type: 'verse',
                                number: 1,
                                content: ['داي إيژّال يونان إتّر إ ربّي نّس زݣ أوديس ن-وسلم.']
                            }
                        ]
                    }
                ]
            });

        });
    });

});