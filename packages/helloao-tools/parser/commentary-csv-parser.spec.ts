import { unparse } from 'papaparse';
import { CommentaryCsvParser } from './commentary-csv-parser';

describe('CommentaryCsvParser', () => {
    let parser: CommentaryCsvParser;

    beforeEach(() => {
        parser = new CommentaryCsvParser();
    });

    describe('parse()', () => {
        it('should be able to parse CSV data', () => {
            const result = parser.parse(
                unparse(
                    [
                        {
                            Book: 'Genesis',
                            Chapter: '',
                            'VERSE / INTRODUCTION': 'Book Introduction',
                            COMMENTARIES:
                                'This is the introduction to the book of Genesis.',
                        },
                    ],
                    {
                        header: true,
                    }
                )
            );

            expect(result).toEqual({
                type: 'commentary/root',
                books: [
                    {
                        type: 'book',
                        book: 'GEN',
                        introduction:
                            'This is the introduction to the book of Genesis.',
                        chapters: [],
                    },
                ],
            });
        });

        it('should be able to parse raw CSV data', () => {
            const result = parser.parse(
                `"Book","Chapter","VERSE / INTRODUCTION","COMMENTARIES","","","","","","","","","","","","","","","","","","","","","",""
"Genesis","","Book Introduction","INTRODUCTION TO GENESIS 

This book, in the Hebrew copies of the Bible, and by the Jewish writers, is generally called Bereshith, which signifies ""in the beginning"", being the first word of it; as the other four books of Moses are also called from their initial words. In the Syriac and Arabic versions, the title of this book is ""The Book of the Creation"", because it begins with an account of the creation of all things; and is such an account, and so good an one, as is not to be met with anywhere else: the Greek version calls it Genesis, and so we and other versions from thence; and that because it treats of the generation of all things, of the heavens, and the earth, and all that are in them, and of the genealogy of men: it treats of the first men, of the patriarchs before the flood, and after it to the times of Joseph. It is called the ""first"" book of Moses, because there are four more that follow; the name the Jewish Rabbins give to the whole is , ""the five fifths of the law"", to which the Greek word ""pentateuch"" answers; by which we commonly call these books, they being but one volume, consisting of five parts, of which this is the first. And that they were all written by Moses is generally believed by Jews and Christians. Some atheistical persons have suggested the contrary; our countryman Hobbes (a) would have it, that these books are called his, not from his being the author of them, but from his being the subject of them; not because they were written by him, but because they treat of him: but certain it is that Moses both wrote them, and was read, as he was in the Jewish synagogues, every sabbath day, which can relate to no other writings but these, Joh 1:45. And Spinosa, catching at some doubts raised by Aben Ezra on Deu 1:1 concerning some passages which seemed to him to have been added by another hand, forms objections against Moses being the author of the book of Genesis; which are sufficiently answered by Carpzovius (b). Nor can Ezra be the author of the Pentateuch, as Spinosa suspects; since it is plain these writings were in being before his time, in the times of Josiah, Amaziah, yea, of David, and also of Joshua, Ch2 34:14 nay, they are even referred to in the book of Ezra as the writings of Moses, Ezr 3:2 to which may be added, in proof of the same, Deu 31:9. Nor are there any other writings of his authentic; what are ascribed to him, as the Analepsis of Moses, his Apocalypse, and his Last Will and Testament, are apocryphal. That this book of Genesis particularly was written by him, is evident from the testimony of Philip, and even of our Lord Jesus Christ, who both testify that he wrote concerning the Messiah, Joh 1:45 as he did in this book, where he speaks of him as the seed of the woman that should break the serpent's head; as the seed of Abraham, in whom all the nations of the earth should be blessed; and as the Shiloh, to whom the gathering of the people should be, Gen 3:15. Nor is there any reason to believe that he wrote this book from the annals of the patriarchs, since it does not appear, nor is it very probable, that they had any; nor from traditions delivered down from one to another, from father to son, which is more probable, considering the length of the lives of the patriarchs: but yet such a variety of particulars respecting times, places, persons, their genealogies and circumstances, so nicely and exactly given, can scarcely be thought to be the fruit of memory; and much less is it to be imagined that he was assisted in it by Gabriel, when he lived in solitude in Midian: but it is best of all to ascribe it to divine inspiration, as all Scripture is by the apostle, Ti2 3:16 for who else but God could have informed him of the creation, and the manner and order in which every creature was brought into being, with a multitude of things recorded in this book? the design of which is to lead men into the knowledge and worship of the one true God, the Creator of all things, and of the origin of mankind, the fall of our first parents, and their posterity in them; and to point at the means and method of the recovery of man by the Messiah, the promised seed; and to give an account of the state and case of the church of God, in the times of the patriarchs, both before and after the flood, from Adam, in the line of Seth, to Noah; and from Noah to the times of Joseph, in whose death it ends: and, according to Usher (c), it contains an history of two thousand, three hundred, and sixty nine years. 

(a) Leviath. par. 3. c. 33. (b) Introduct. ad Libr. Bib. V. T. c. 4. sect. 2. (c) Annal. Vet. Test. p. 17. 



Next: Genesis Chapter 1

","","","","","","","","","","","","","","","","","","","","","",""`
            );

            expect(result).toEqual({
                type: 'commentary/root',
                books: [
                    {
                        type: 'book',
                        book: 'GEN',
                        introduction: expect.stringContaining(
                            'INTRODUCTION TO GENESIS'
                        ),
                        chapters: [],
                    },
                ],
            });
        });
    });

    describe('parseLines()', () => {
        it('should be able to parse book introductions', () => {
            const result = parser.parseLines([
                {
                    book: 'Genesis',
                    chapter: '',
                    verse: 'Book Introduction',
                    commentaries:
                        'This is the introduction to the book of Genesis.',
                },
            ]);

            expect(result).toEqual({
                type: 'commentary/root',
                books: [
                    {
                        type: 'book',
                        book: 'GEN',
                        introduction:
                            'This is the introduction to the book of Genesis.',
                        chapters: [],
                    },
                ],
            });
        });

        it('should be able to parse multiple books', () => {
            const result = parser.parseLines([
                {
                    book: 'Genesis',
                    chapter: '',
                    verse: 'Book Introduction',
                    commentaries:
                        'This is the introduction to the book of Genesis.',
                },
                {
                    book: 'Exodus',
                    chapter: '',
                    verse: 'Book Introduction',
                    commentaries:
                        'This is the introduction to the book of Exodus.',
                },
            ]);

            expect(result).toEqual({
                type: 'commentary/root',
                books: [
                    {
                        type: 'book',
                        book: 'GEN',
                        introduction:
                            'This is the introduction to the book of Genesis.',
                        chapters: [],
                    },
                    {
                        type: 'book',
                        book: 'EXO',
                        introduction:
                            'This is the introduction to the book of Exodus.',
                        chapters: [],
                    },
                ],
            });
        });

        it('should be able to parse book and chapter introductions', () => {
            const result = parser.parseLines([
                {
                    book: 'Genesis',
                    chapter: '',
                    verse: 'Book Introduction',
                    commentaries:
                        'This is the introduction to the book of Genesis.',
                },
                {
                    book: '',
                    chapter: '1',
                    verse: 'Chapter Introduction',
                    commentaries:
                        'This is the introduction to the Chapter 1 of Genesis.',
                },
            ]);

            expect(result).toEqual({
                type: 'commentary/root',
                books: [
                    {
                        type: 'book',
                        book: 'GEN',
                        introduction:
                            'This is the introduction to the book of Genesis.',
                        chapters: [
                            {
                                type: 'chapter',
                                number: 1,
                                introduction:
                                    'This is the introduction to the Chapter 1 of Genesis.',
                                verses: [],
                            },
                        ],
                    },
                ],
            });
        });

        it('should be able to parse verses', () => {
            const result = parser.parseLines([
                {
                    book: 'Genesis',
                    chapter: '',
                    verse: 'Book Introduction',
                    commentaries:
                        'This is the introduction to the book of Genesis.',
                },
                {
                    book: '',
                    chapter: '1',
                    verse: 'Chapter Introduction',
                    commentaries:
                        'This is the introduction to the Chapter 1 of Genesis.',
                },
                {
                    book: '',
                    chapter: '',
                    verse: 'Genesis 1:1',
                    commentaries: 'This is the commentary for Genesis 1:1.',
                },
                {
                    book: '',
                    chapter: '',
                    verse: 'Genesis 1:2',
                    commentaries: 'This is the commentary for Genesis 1:2.',
                },
                {
                    book: '',
                    chapter: '',
                    verse: 'Genesis 1:3',
                    commentaries: 'This is the commentary for Genesis 1:3.',
                },
            ]);

            expect(result).toEqual({
                type: 'commentary/root',
                books: [
                    {
                        type: 'book',
                        book: 'GEN',
                        introduction:
                            'This is the introduction to the book of Genesis.',
                        chapters: [
                            {
                                type: 'chapter',
                                number: 1,
                                introduction:
                                    'This is the introduction to the Chapter 1 of Genesis.',
                                verses: [
                                    {
                                        type: 'verse',
                                        number: 1,
                                        content: [
                                            'This is the commentary for Genesis 1:1.',
                                        ],
                                    },
                                    {
                                        type: 'verse',
                                        number: 2,
                                        content: [
                                            'This is the commentary for Genesis 1:2.',
                                        ],
                                    },
                                    {
                                        type: 'verse',
                                        number: 3,
                                        content: [
                                            'This is the commentary for Genesis 1:3.',
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            });
        });

        it('should be able to infer chapers', () => {
            const result = parser.parseLines([
                {
                    book: 'Genesis',
                    chapter: '',
                    verse: 'Book Introduction',
                    commentaries:
                        'This is the introduction to the book of Genesis.',
                },
                {
                    book: '',
                    chapter: '1',
                    verse: 'Chapter Introduction',
                    commentaries:
                        'This is the introduction to the Chapter 1 of Genesis.',
                },
                {
                    book: '',
                    chapter: '',
                    verse: 'Genesis 1:1',
                    commentaries: 'This is the commentary for Genesis 1:1.',
                },
                {
                    book: '',
                    chapter: '',
                    verse: 'Genesis 1:2',
                    commentaries: 'This is the commentary for Genesis 1:2.',
                },
                {
                    book: '',
                    chapter: '',
                    verse: 'Genesis 1:3',
                    commentaries: 'This is the commentary for Genesis 1:3.',
                },
                {
                    book: '',
                    chapter: '',
                    verse: 'Genesis 2:1',
                    commentaries: 'This is the commentary for Genesis 2:1.',
                },
            ]);

            expect(result).toEqual({
                type: 'commentary/root',
                books: [
                    {
                        type: 'book',
                        book: 'GEN',
                        introduction:
                            'This is the introduction to the book of Genesis.',
                        chapters: [
                            {
                                type: 'chapter',
                                number: 1,
                                introduction:
                                    'This is the introduction to the Chapter 1 of Genesis.',
                                verses: [
                                    {
                                        type: 'verse',
                                        number: 1,
                                        content: [
                                            'This is the commentary for Genesis 1:1.',
                                        ],
                                    },
                                    {
                                        type: 'verse',
                                        number: 2,
                                        content: [
                                            'This is the commentary for Genesis 1:2.',
                                        ],
                                    },
                                    {
                                        type: 'verse',
                                        number: 3,
                                        content: [
                                            'This is the commentary for Genesis 1:3.',
                                        ],
                                    },
                                ],
                            },
                            {
                                type: 'chapter',
                                number: 2,
                                introduction: null,
                                verses: [
                                    {
                                        type: 'verse',
                                        number: 1,
                                        content: [
                                            'This is the commentary for Genesis 2:1.',
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            });
        });
    });
});
