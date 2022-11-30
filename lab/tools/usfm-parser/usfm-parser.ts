export function usfmParser() {
    return 'Hello world!';
}

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