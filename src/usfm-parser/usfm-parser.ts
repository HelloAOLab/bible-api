import { findLast } from 'lodash';

/**
 * Defines a class that can tokenize a stream of characters into tokens.
 */
export class UsfmTokenizer {
    private _input: string = '';
    private _index: number = 0;
    private _start: number = 0;

    private get _tokenLength() {
        return this._index - this._start;
    }

    /**
     * Converts the given input into a list of tokens.
     * @param input The input that should be tokenized.
     */
    tokenize(input: string): SimpleToken[] {
        this._input = input;
        this._index = 0;

        return this._parseTokens();
    }

    private _parseTokens() {
        let tokens: SimpleToken[] = [];
        let token = this._parseToken();
        while(token) {
            tokens.push(token);
            token = this._parseToken();
        }

        return tokens;
    }

    private _parseToken(): SimpleToken | null {
        let state: 'none' | 'marker_start' | 'marker_number' | 'whitespace' | 'word' = 'none';
        let kind: T | null = null;
        this._start = this._index;
        
        while(this._index < this._input.length) {
            const codePointNumber = this._input.codePointAt(this._index);

            if (typeof codePointNumber === 'undefined') {
                throw new Error('Unable to get code point!');
            }

            const codePoint = String.fromCodePoint(codePointNumber);

            if (state === 'none') {
                if (codePoint === '\\') {
                    state = 'marker_start';
                } else if (isWhitespace(codePoint)) {
                    state = 'whitespace';
                } else {
                    state = 'word';
                }
            } else if (state === 'marker_start') {
                if (isDigit(codePoint)) {
                    if (this._tokenLength === 0) {
                        throw new Error('Invalid Marker: Markers must not contain only digits.');
                    }
                    state = 'marker_number';
                } else if (codePoint === '*') {
                    this._index += codePoint.length;
                    kind = 'marker';
                    break;
                } else if (isWhitespace(codePoint)) {
                    kind = 'marker';
                    break;
                }
            } else if(state === 'marker_number') {
                if (codePoint === '*') {
                    this._index += codePoint.length;
                    kind = 'marker';
                    break;
                } else if (!isDigit(codePoint)) {
                    kind = 'marker';
                    break;
                }
            } else if (state === 'whitespace') {
                if (!isWhitespace(codePoint)) {
                    kind = 'whitespace';
                    break;
                }
            } else if (state === 'word') {
                if (isWhitespace(codePoint) || codePoint === '\\') {
                    kind = 'word';
                    break;
                }
            }

            this._index += codePoint.length;
        }

        if (!kind) {
            if (this._index >= this._input.length) {
                if (state == 'marker_start' || state === 'marker_number') {
                    kind = 'marker';
                } else if (state === 'word') {
                    kind = 'word'
                } else if (state === 'whitespace') {
                    kind = 'whitespace';
                }
            }
        }

        if (kind) {
            return t(
                loc(this._start, this._index),
                kind
            );
        }

        return null;
    }
}

export interface UsfmParseOptions {
    paragraphs: Set<string>;
}

/**
 * Defines a USFM Parser.
 */
export class UsfmParser {

    private _poem: number | null = null;
    private _wordsOfJesus: boolean = false;
    
    tokenize(input: string): Token[] {
        const simpleTokens = new UsfmTokenizer().tokenize(input);
        let tokens: Token[] = [];

        for(let t of simpleTokens) {
            if (t.kind === 'marker') {
                let source = input.substring(t.loc.start, t.loc.end);
                const isEnd = source.endsWith('*');

                if (isEnd) {
                    source = source.substring(0, source.length - 1);
                }
                
                let numberIndex = -1;
                for(let i = 0; i < source.length; i++) {
                    if (isDigit(source[i])) {
                        numberIndex = i;
                        break;
                    }
                }

                let number: number | null = null;
                if (numberIndex === 1) {
                    throw new Error('Markers must not be made only of numbers!');
                }
                if (numberIndex > 0) {
                    number = parseInt(source.substring(numberIndex));
                    source = source.substring(0, numberIndex);
                }

                if (source.length === 1) {
                    if (isEnd) {
                        // Ending marker does not have a command.
                        // We should look for a matching start marker.
                        const startMarker = findLast(tokens, t => t.kind === 'marker' && t.type === 'start') as MarkerToken;
                        if (startMarker) {
                            source = startMarker.command;
                        }
                    }

                    if (source.length === 1) {
                        throw new Error(`Markers must have a command! Token: ${t.loc.start}-${t.loc.end}`);
                    }
                }

                tokens.push(
                    marker(t.loc, source, number, isEnd ? 'end' : 'start')
                );
            } else if (t.kind === 'whitespace') {
                let source = input.substring(t.loc.start, t.loc.end);
                tokens.push(whitespace(t.loc, source));
            } else if (t.kind === 'word') {
                let source = input.substring(t.loc.start, t.loc.end);
                tokens.push(word(t.loc, source));
            }
        }

        return tokens;
    }

    parse(input: string): ParseTree {
        let root: ParseTree = {
            type: 'root',
            content: []
        };

        const tokens = this.tokenize(input);

        let expectingId = 0;
        let expectingName = 0;
        let expectingTitle = 0;
        let expectingSectionHeading = 0;
        let expectingFootnote = 0;
        let expectingFootnoteReference = 0;
        let expectingFootnoteText = 0;
        let expectingReferenceText = 0;
        let expectingWordAttribute = 0;
        let expectingNestedWordAttribute = 0;
        let expectingWordsOfJesus = 0;
        let expectingIntroParagraph = 0;
        let expectingCrossReference = 0;
        let expectingUnknownCommand = 0;

        let canParseFootnotes = true;
        let chapter: Chapter | null = null;
        let lastVerse: Verse | null = null;
        let verse: Verse | null = null;
        let subtitle: HebrewSubtitle | null = null;
        let words: string[] = [];
        let verseContent: (Text | FootnoteReference | string)[] = [];
        let sectionContent: string = '';
        let currentFootnoteId = 0;
        let footnote: Footnote | null = null;
        
        this._poem = null;
        
        const addWordsToVerseOrSubtitle = () => {
            if (words.length > 0) {
                const text = this._text(words.join('').trimEnd());
                if (verse) {
                    verse.content.push(text);
                } else if (subtitle) {
                    subtitle.content.push(text);
                } else {
                    verseContent.push(text);
                }
                words = [];
            }
        };

        const addVerseContentToChapter = (token: Token | null) => {
            if (!chapter) {
                return;
            }
            if (verseContent.length > 0) {
                if (chapter.content.some(c => c.type === 'verse')) {
                    this._throwError(input, token, 'Cannot infer first verse after other verses have been added to the chapter!');
                }
                // Implicit first verse
                verse = {
                    type: 'verse',
                    number: 1,
                    content: verseContent
                };
                chapter.content.push(verse);
                verseContent = [];
            }
        };

        const cleanupVerse = () => {
            if (!verse || !chapter) {
                return;
            }
            let chapterContent: Chapter['content'] = [];
            for (let i = verse.content.length - 1; i >= 0; i--) {
                let content = verse.content[i];
                if (typeof content === 'object' && 'heading' in content) {
                    // move headings that occur at the end of a verse to the chapter
                    chapterContent.unshift({
                        type: 'heading',
                        content: [content.heading]
                    });
                    verse.content.splice(i, 1);
                } else if(typeof content === 'object' && 'lineBreak' in content && content.lineBreak) {
                    // move line breaks that occur at the end of a verse to the chapter
                    chapterContent.unshift({
                        type: 'line_break'
                    });
                    verse.content.splice(i, 1);
                } else {
                    break;
                }
            }

            for(let content of chapterContent) {
                chapter.content.push(content);
            }
        };

        const completeVerseOrSubtitle = (token: Token | null) => {
            if (verse && isNaN(verse.number)) {
                // Verse is invalid for some reason.
                const index = chapter!.content.indexOf(verse);
                if (index >= 0) {
                    chapter!.content.splice(index, 1);
                }
                verse = null;
            }
            if (verse || subtitle) {
                addWordsToVerseOrSubtitle();
            }

            addVerseContentToChapter(token);
            cleanupVerse();
        };

        const completeSection = () => {
            if (expectingSectionHeading > 0) {
                if (verse) {
                    addWordsToVerseOrSubtitle();
                    verse.content.push({
                        heading: sectionContent
                    });
                } else if (chapter) {
                    chapter.content.push({
                        type: 'heading',
                        content: [sectionContent]
                    });
                } else {
                    root.content.push({
                        type: 'heading',
                        content: [sectionContent]
                    });
                }
                sectionContent = '';
                expectingSectionHeading = 0;
            }
        };

        const addWordsToFootnote = () => {
            if (footnote && words.length > 0) {
                footnote.text += words.join(' ');
                words = [];
            }
        };

        for(let token of tokens) {
            if (token.kind === 'marker') {
                if (token.command === '\\c') {
                    addWordsToVerseOrSubtitle();
                    cleanupVerse();

                    chapter = {
                        type: 'chapter',
                        number: NaN,
                        content: [],
                        footnotes: [],
                    };
                    verse = null;
                    verseContent = [];

                    root.content.push(chapter);
                } else if (token.command === '\\v') {
                    if (!chapter) {
                        this._throwError(input, token, 'Cannot parse a verse without chapter information!');
                    } else {
                        completeSection();
                        completeVerseOrSubtitle(token);

                        lastVerse = verse;
                        verse = {
                            type: 'verse',
                            number: NaN,
                            content: []
                        };
                        
                        chapter.content.push(verse);
                    }
                } else if (token.command === '\\d') {
                    if (!chapter) {
                        this._throwError(input, token, 'Cannot parse a hebrew subtitle without chapter information!');
                    } else {
                        completeVerseOrSubtitle(token);

                        subtitle = {
                            type: 'hebrew_subtitle',
                            content: []
                        };

                        chapter.content.push(subtitle);
                    }
                } else if(token.command === '\\b' || token.command === '\\p') {
                    if (!chapter) {
                        this._throwError(input, token, 'Cannot parse a line break without chapter information!');
                    } else {
                        if (verse) {
                            addWordsToVerseOrSubtitle();
                            verse.content.push({
                                lineBreak: true
                            });
                        } else {
                            completeVerseOrSubtitle(token);
                            chapter.content.push({
                                type: 'line_break'
                            });
                        }
                    }
                } else if (token.command === '\\q') {
                    addWordsToVerseOrSubtitle();
                    this._poem = token.number;
                } else if (token.command === '\\p') {
                    addWordsToVerseOrSubtitle();
                    this._poem = null;
                } else if (token.command === '\\id') {
                    expectingId = 1;
                } else if (token.command === '\\h') {
                    expectingName = 1;
                    root.header = undefined;
                } else if (token.command === '\\mt' || token.command === '\\+mt') {
                    expectingTitle = 1;
                } else if (token.command === '\\s') {
                    expectingSectionHeading = 1;
                } else if (token.command === '\\r') {
                    expectingReferenceText = 1;
                } else if (token.command === '\\f' && canParseFootnotes) {
                    if (token.type === 'start') {
                        if (!chapter) {
                            this._throwError(input, token, 'Cannot start a footnote outside of a chapter!', true);
                        } else {
                            addWordsToVerseOrSubtitle();
                            footnote = {
                                noteId: currentFootnoteId,
                                text: '',
                                caller: null
                            };
                            const ref: FootnoteReference = {
                                noteId: footnote.noteId
                            };
                            expectingFootnote = 1;

                            chapter.footnotes.push(footnote);

                            if (verse) {
                                verse.content.push(ref);
                            } else if (subtitle) {
                                subtitle.content.push(ref);
                            } else {
                                verseContent.push(ref);
                            }

                            currentFootnoteId += 1;
                        }
                    } else {
                        addWordsToFootnote();
                        expectingFootnote = 0;
                        expectingFootnoteText = 0;
                        expectingFootnoteReference = 0;
                        footnote = null;
                    }
                } else if (token.command === '\\fr' && canParseFootnotes) {
                    if (!footnote) {
                        this._throwError(input, token, 'Cannot start a footnote reference outside of a footnote!', true);
                    } else {
                        expectingFootnoteReference = 1;
                    }
                } else if (token.command === '\\ft' && canParseFootnotes) {
                    if (!footnote) {
                        this._throwError(input, token, 'Cannot start footnote text outside of a footnote!', true);
                    } else {
                        expectingFootnoteText = 1;
                    }
                } else if (token.command === '\\w') {
                    if (token.type === 'start') {
                        expectingWordAttribute = 1;
                    } else {
                        expectingWordAttribute = 0;
                    }
                } else if(token.command === '\\+w') {
                    if (token.type === 'start') {
                        expectingNestedWordAttribute = 1;
                    } else {
                        expectingNestedWordAttribute = 0;
                    }
                } else if (token.command === '\\wj' || token.command === '\\+wj') {
                    if (token.type === 'start') {
                        addWordsToVerseOrSubtitle();
                        this._wordsOfJesus = true;
                    } else {
                        addWordsToVerseOrSubtitle();
                        this._wordsOfJesus = false;
                    }
                } else if (token.command === '\\ip') {
                    expectingIntroParagraph = 1;
                    canParseFootnotes = false;
                } else if (token.command === '\\x') {
                    if (token.type === 'start') {
                        expectingCrossReference = 1;
                    } else {
                        expectingCrossReference = 0;
                    }
                } else if (token.command.indexOf('-') >= 0) {
                    if (token.type === 'start') {
                        expectingUnknownCommand = 1;
                    }
                } else if (token.type === 'end') {
                    expectingUnknownCommand = 0;
                }
            } else if (token.kind === 'word') {
                if (expectingId > 0) {
                    if  (expectingId === 1) {
                        root.id = token.word;
                        expectingId = 2;
                    }
                } else if (expectingName > 0) {
                    if (root.header) {
                        root.header += ' ' + token.word;
                    } else {
                        root.header = token.word;
                    }
                } else if (expectingTitle > 0) {
                    if (root.title) {
                        root.title += ' ' + token.word;
                    } else {
                        root.title = token.word;
                    }
                } else if(expectingSectionHeading > 0) {
                    if (sectionContent) {
                        sectionContent += ' ' + token.word;
                    } else {
                        sectionContent = token.word;
                    }
                } else if (expectingFootnoteReference > 0) {
                    if (expectingFootnoteReference = 1) {
                        const [chapter, verse] = token.word.split(/[\.\:]/);

                        if (footnote) {
                            footnote.reference = {
                                chapter: parseInt(chapter),
                                verse: parseInt(verse)
                            };
                        }

                        expectingFootnoteReference = 0;
                    }
                } else if (expectingFootnoteText > 0) {
                    words.push(token.word);
                } else if (expectingFootnote > 0) {
                    if (expectingFootnote === 1) {
                        if (token.word) {
                            if (footnote) {
                                if (token.word === '+' || token.word !== '-') {
                                    footnote.caller = token.word;
                                } else {
                                    footnote.caller = null;
                                }
                            }
                            // this._throwError(input, token, 'Footnotes must use the "+" caller.');
                        }
                        expectingFootnote = 2;
                    } else {
                        words.push(token.word);
                    }
                } else if (expectingReferenceText > 0) {
                    // Skip processing words for references
                    // because references aren't included in the JSON format
                    // (for now)
                } else if(expectingCrossReference > 0) {
                    // Skip processing words for cross references
                } else if (chapter && isNaN(chapter.number)) {
                    chapter.number = parseInt(token.word);
                    if (isNaN(chapter.number)) {
                        this._throwError(input, token, 'The first word token after a chapter marker must be parsable to an integer!');
                    }
                } else if (verse && isNaN(verse.number)) {
                    verse.number = parseInt(token.word);
                    if (isNaN(verse.number)) {
                        this._throwError(input, token, 'The first word token after a verse marker must be parsable to an integer!');
                    }
                } else if (expectingWordAttribute > 0) {
                    if (expectingWordAttribute === 1) {
                        const firstVerticalBarIndex = token.word.indexOf('|');

                        if (firstVerticalBarIndex >= 0) {
                            const name = token.word.slice(0, firstVerticalBarIndex);
                            // const rest = token.word.slice(firstVerticalBarIndex + '|'.length);
                            words.push(name);
                            expectingWordAttribute = 2;
                        } else {
                            words.push(token.word);
                        }
                    }
                } else if (expectingNestedWordAttribute > 0) {
                    if (expectingNestedWordAttribute === 1) {
                        const firstVerticalBarIndex = token.word.indexOf('|');

                        if (firstVerticalBarIndex >= 0) {
                            const name = token.word.slice(0, firstVerticalBarIndex);
                            // const rest = token.word.slice(firstVerticalBarIndex + '|'.length);
                            words.push(name);
                            expectingNestedWordAttribute = 2;
                        } else {
                            words.push(token.word);
                        }
                    }
                } else if (expectingUnknownCommand > 0) {
                } else if (expectingIntroParagraph > 0) {
                    // Skip processing words for intro paragraphs
                } else {
                    words.push(token.word);
                }
            } else if (token.kind === 'whitespace') {
                if (expectingId > 0) {
                    if (token.whitespace.includes('\n')) {
                        expectingId = 0;
                    }
                } else if (expectingName > 0) {
                    if (token.whitespace.includes('\n')) {
                        expectingName = 0;
                    }
                } else if (expectingTitle > 0) {
                    if (token.whitespace.includes('\n')) {
                        expectingTitle = 0;
                    }
                } else if (expectingSectionHeading > 0) {
                    if (token.whitespace.includes('\n')) {
                        completeSection();
                    }
                } else if (expectingReferenceText > 0) {
                    if (token.whitespace.includes('\n')) {
                        expectingReferenceText = 0;
                    }
                } else if (expectingIntroParagraph > 0) {
                    if (token.whitespace.includes('\n')) {
                        expectingIntroParagraph = 0;
                        canParseFootnotes = true;
                    }
                } else if (expectingId > 0 || expectingName > 0 || expectingTitle > 0 || expectingSectionHeading > 0 || expectingFootnote > 0 || expectingFootnoteReference > 0 || expectingFootnoteText > 0 || expectingReferenceText > 0 || expectingCrossReference > 0 || expectingWordAttribute > 0 || expectingNestedWordAttribute > 0) {
                    // Skip
                } else if (expectingUnknownCommand > 0) {
                    if (token.whitespace.includes('\n')) {
                        expectingUnknownCommand = 0;
                    }
                } else if (words.length > 0) {
                    let lastWord = words[words.length - 1];
                    if (lastWord !== ' ') {
                        words.push(' ');
                    }
                }
            }
        }

        completeVerseOrSubtitle(null);

        return root;
    }

    renderMarkdown(tree: ParseTree): string {
        let md = '';

        if (tree.header) {
            md += `# ${tree.header}\n`;
        }

        for (let c of tree.content) {
            if (c.type === 'heading') {
                md += `## ${c.content.join(' ')}\n`;
            } else if(c.type === 'chapter') {
                md += `### ${c.number}\n`;

                for(let content of c.content) {
                    if (content.type === 'heading') {
                        md += `#### ${content.content.join(' ')}\n`;
                    } else if(content.type === 'line_break') {
                        md += '\n\n';
                    } else if(content.type === 'verse') {
                        md += `<em>${content.number}</em>`;
                        for (let v of content.content) {
                            if (typeof v === 'string') {
                                md += v + ' ';
                            } else if ('text' in v) {
                                md += v.text + ' ';
                            }
                        }
                        md += '\n';
                    }
                }
            }
        }

        return md;
    }

    private _hasAttribute() {
        return this._poem !== null || this._wordsOfJesus;
    }

    private _text(text: string): Text | string {
        if(!this._hasAttribute()) {
            return text;
        }
        const t: Text = {
            text
        };

        if (this._poem !== null) {
            t.poem = this._poem;
        }

        if (this._wordsOfJesus) {
            t.wordsOfJesus = true;
        }

        return t;
    }

    private _throwError(source: string, token: Token | null, message: string, warn: boolean = false): void {
        if (token) {
            let line = 1;
            let column = 1;

            let start = token.loc.start;

            for (let i = 0; i < start; i++) {
                let char = source[i];
                if (char === '\n') {
                    line += 1;
                    column = 1;
                } else {
                    column += 1;
                }
            }

            let tokenDebug = '';
            if (token.kind === 'word') {
                tokenDebug = ', word';
            } else if(token.kind === 'marker') {
                tokenDebug = ', ' + token.command;
            } else {
                tokenDebug = ''
            }

            if (warn) {
                console.warn(`(${line}, ${column}${tokenDebug}) ${message}`);
            } else {
                throw new Error(`(${line}, ${column}${tokenDebug}) ${message}`);
            }
        } else {
            if (warn) {
                console.warn(message);
            } else {
                throw new Error(message);
            }
        }
    }
}

/**
 * Determines if the given character is a digit.
 * @param char The character.
 */
export function isDigit(char: string): boolean {
    return char.length === 1 && char >= '0' && char <= '9';
}

/**
 * Determines if the given character is considered whitespace.
 * @param char The character.
 */
export function isWhitespace(char: string): boolean {
    return char === ' ' || char === '\t' || char === '\n' || char === '\r';
}

export function t(loc: SourceLocation, kind: T): SimpleToken {
    return {
        loc,
        kind
    };
}

/**
 * Creates a new source location.
 * @param start The start of the location.
 * @param end The end of the location.
 */
export function loc(start: number, end: number): SourceLocation {
    return {
        start,
        end
    };
}

/**
 * Creates a new marker token.
 * @param loc The location for the token.
 * @param command The command that the token contains.
 * @param number The number that the marker contains.
 * @param type The type of the marker.
 */
export function marker(loc: SourceLocation, command: string, number: number | null = null, type: MarkerToken['type'] = 'start'): MarkerToken {
    return {
        kind: 'marker',
        loc,
        command,
        number,
        type
    };
}

/**
 * Creates a new word token.
 * @param loc The location for the token.
 * @param word The word contained by the token.
 */
export function word(loc: SourceLocation, word: string): WordToken {
    return {
        kind: 'word',
        loc,
        word
    };
}

export function whitespace(loc: SourceLocation, whitespace: string): WhitespaceToken {
    return {
        kind: 'whitespace',
        loc,
        whitespace
    };
}

export type T = Token['kind'];

/**
 * Defines a simple token.
 */
export interface SimpleToken {
    kind: T;
    loc: SourceLocation;
}

export type Token = MarkerToken | WordToken | WhitespaceToken;

/**
 * Defines an interface for a USFM marker node.
 * That is, the syntax for a marker.
 */
export interface MarkerToken {
    kind: 'marker';

    /**
     * The command that the marker represents.
     * This is generally the name of the marker (like "p" or "v" for paragraph and verse markers)
     */
    command: string;

    /**
     * The number that the marker contains.
     * Null if no number was specified.
     */
    number: number | null;

    /**
     * Whether the marker represents a start or an end.
     */
    type: 'start' | 'end';

    /**
     * The location of the node.
     */
    loc: SourceLocation;
}

/**
 * Defines an interface for a Whitespace node.
 */
export interface WhitespaceToken {
    kind: 'whitespace';

    /**
     * The whitespace contained by the node.
     */
    whitespace: string;

    /**
     * The location of the node.
     */
    loc: SourceLocation;
}

/**
 * Defines an interface for a word token.
 */
export interface WordToken {
    kind: 'word';

    /**
     * The word contained by the token.
     */
    word: string;

    /**
     * The location of the word.
     */
    loc: SourceLocation;
}

/**
 * The source location of the node.
 */
export interface SourceLocation {
    start: number;
    end: number;
}

/**
 * The parse tree that is gathered.
 */
export interface ParseTree {
    type: 'root';

    /**
     * The ID of the parse tree.
     */
    id?: string;

    /**
     * The header that was associated with the tree.
     */
    header?: string;

    /**
     * The major title that was associated with the tree.
     */
    title?: string;

    /**
     * The list of chapters for the tree.
     */
    content: (Heading | Chapter)[];
}

export interface Heading {
    type: 'heading';
    content: string[];
}

/**
 * Defines an interface that represents a chapter.
 */
export interface Chapter {
    type: 'chapter';
    number: number;

    /**
     * The contents of the chapter.
     */
    content: (Heading | Verse | HebrewSubtitle | LineBreak)[];

    /**
     * The list of footnotes for the chapter.
     */
    footnotes: Footnote[];
}

/**
 * Defines an interface that represents a hebrew subtitle.
 */
export interface HebrewSubtitle {
    type: 'hebrew_subtitle';

    /**
     * The contents of the subtitle.
     */
    content: (string | Text | FootnoteReference)[];
}

/**
 * Defines an interface that represents a verse.
 */
export interface Verse {
    type: 'verse';

    number: number;

    /**
     * The contents of the verse.
     */
    content: (string | Text | InlineHeading | InlineLineBreak | FootnoteReference)[];
}

/**
 * Defines an interface that represents text that has some markup attributes applied to it.
 */
export interface Text {

    /**
     * The text that is contained.
     */
    text: string;

    /**
     * Whether the text represents a poem.
     * The number indicates the level of indent.
     */
    poem?: number;

    /**
     * Whether the text contains the words of Jesus.
     */
    wordsOfJesus?: boolean;
}

/**
 * Defines an interface that represents a heading that is embedded in a verse.
 */
export interface InlineHeading {
    /**
     * The text of the heading.
     */
    heading: string;
}

/**
 * Defines an interface that represents a line break that is embedded in a verse.
 */
export interface InlineLineBreak {
    lineBreak: true;
}

export interface FootnoteReference {
    /**
     * The ID of the note that is referenced.
     */
    noteId: number;
}

export interface Footnote {
    noteId: number;

    /**
     * The text of the footnote.
     */
    text: string;

    /**
     * The caller that should be used for the footnote.
     * For footnotes, a "caller" is the character that is used in the text to reference to footnote.
     * 
     * For example, in the text:
     * Hello (a) World
     * 
     * ----
     * (a) This is a footnote.
     * 
     * The "(a)" is the caller.
     * 
     * If "+", then the caller should be autogenerated.
     * If null, then the caller should be empty.
     * If a string, then the caller should be that string.
     */
    caller: '+' | string | null;

    /**
     * The verse reference for the footnote.
     */
    reference?: {
        chapter: number,
        verse: number
    };
}

export interface LineBreak {
    type: 'line_break';
}