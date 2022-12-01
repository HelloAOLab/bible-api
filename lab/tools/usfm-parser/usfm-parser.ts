export function usfmParser() {
    return 'Hello world!';
}

/**
 * Defines a class that can tokenize a stream of characters into tokens.
 */
export class UsfmTokenizer {
    private _input: string;
    private _index: number;
    private _start: number;

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
                if (isWhitespace(codePoint)) {
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
                    throw new Error('Markers must have a command!');
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