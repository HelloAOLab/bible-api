
/**
 * Defines an interface that represents an iterator that can be rewound.
 */
export interface RewindableIterator<T> extends IterableIterator<T> {
    /**
     * Rewinds the iterator by the specified number of elements.
     * @param number The number of elements to rewind.
     */
    rewind(number: number): void;
}

/**
 * Defines a class that implements an iterator that can be rewound.
 */
export class Rewindable<T> implements RewindableIterator<T> {
    buffer: T[] = [];

    private _bufferSize: number = 0;
    private _position: number = -1;
    private _iterator: IterableIterator<T>;

    constructor(iterator: IterableIterator<T>, bufferSize: number = 2) {
        this._iterator = iterator;
        this._bufferSize = bufferSize;

        if(this._iterator.return) {
            this.return = (value?: any) => {
                return this._iterator.return!(value);
            };
        }
        if(this._iterator.throw) {
            this.throw = (value?: any) => {
                return this._iterator.throw!(value);
            };
        }
    }

    rewind(number: number): void {
        this._position += number;
    }

    [Symbol.iterator](): IterableIterator<T> {
        return this;
    }

    next(...args: [] | [undefined]): IteratorResult<T, any> {
        if (this._position >= 0) {
            let item = this.buffer[this._position];
            this._position--;
            return {
                value: item,
                done: false
            };
        }

        let result = this._iterator.next(...args);
        this.buffer.unshift(result.value);
        if (this.buffer.length > this._bufferSize) {
            this.buffer.splice(this._bufferSize, this.buffer.length - this._bufferSize);
        }
        return result;
    }

    return?(value?: any): IteratorResult<T, any>;
    throw?(e?: any): IteratorResult<T, any>;
}

export function *debug(label: string, iterator: IterableIterator<any>) {
    for (let value of uncompletable(iterator)) {
        if (value instanceof Element) {
            console.log(label, value.outerHTML);
        } else if(value instanceof Node) {
            console.log(label, value.textContent);
        } else {
            console.log(label, value);
        }
        yield value;
    }
}

/**
 * Creates a new rewindable iterator from the given iterator.
 * @param iterator The iterator.
 * @param bufferSize The size of the buffer.
 */
export function rewindable<T>(iterator: IterableIterator<T>, bufferSize: number = 2): Rewindable<T> {
    return new Rewindable(iterator, bufferSize);
}


function *iterateNodes(node: Node) {
    for(let i = 0; i < node.childNodes.length; i++) {
        yield node.childNodes[i];
    }
}

/**
 * Gets the char element that is the parent of the given node.
 * @param node The node.
 */
export function parentChar(node: Node): Element | null {
    return matchingParent(node, n => n instanceof Element && n.nodeName === 'char') as Element | null;
}

/**
 * Gets the note element that is the parent of the given node.
 * @param node The node.
 */
export function parentNote(node: Node): Element | null {
    return matchingParent(node, n => n instanceof Element && n.nodeName === 'note') as Element | null;
}

/**
 * Gets the parent node that matches the given filter.
 * @param node The node to start the search from.
 * @param filter The filter that should be used.
 */
export function matchingParent(node: Node, filter: (node: Node) => boolean): Node | null {
    let parent = node.parentNode;
    while(parent) {
        if (filter(parent)) {
            return parent;
        }
        parent = parent.parentNode;
    }
    return null;
}

/**
 * Determines if the given node is a child of the parent node.
 * @param node The node to test.
 * @param parent The parent.
 * @returns 
 */
export function isParent(node: Node, parent: Node): boolean {
    let parentNode = node.parentNode;
    while(parentNode) {
        if (parentNode === parent) {
            return true;
        }
        parentNode = parentNode.parentNode;
    }
    return false;
}

/**
 * Iterates through all of the nodes in the tree in a depth-first traversal.
 * @param node The node to start the traversal from. 
 */
export function iterateAll(node: Node): RewindableIterator<Node> {
    return rewindable(_iterateAll(node));
}

export function *iterateUntil<T>(iterator: IterableIterator<T>, predicate: (value: T) => boolean): IterableIterator<T> {
    for(let value of iterator) {
        if (predicate(value)) {
            return;
        }
        yield value;
    }
}

function *_iterateAll(node: Node): IterableIterator<Node> {
    for(let child of node.childNodes) {
        yield child;
        yield *iterateAll(child);
    }
}

/**
 * Iterates only the elements in the iterator.
 * @param iterator The iterator that should be used.
 */
export function *elements(iterator: IterableIterator<Node>): IterableIterator<Element> {
    for (let node of uncompletable(iterator)) {
        if (node instanceof Element) {
            yield node;
        }
    }
}

/**
 * Iterates only the children of the given node in the iterator.
 * @param iterator The iterator that should be used.
 * @param parent The parent node.
 */
export function *children(iterator: RewindableIterator<Node>, parent: Node): IterableIterator<Node> {
    for (let node of uncompletable(iterator)) {
        if (!isParent(node, parent)) {
            iterator.rewind(1);
            return;
        }

        yield node;
    }
}

/**
 * Wraps the given iterable in a generator that will prevent consumers from calling return() on the iterator.
 * @param iterable The iterable.
 */
export function *uncompletable<T>(iterable: IterableIterator<T>): IterableIterator<T> {
    while(true) {
        const { done, value } = iterable.next();
        if (done) {
            return;
        }
        yield value;
    }
}

/**
 * Converts the given iterable into an async iterable.
 * @param input The input iterable.
 */
export async function *toAsyncIterable<T>(input: Iterable<T>): AsyncIterable<T> {
    for (let item of input) {
        yield item;
    }
}

/**
 * Batches items from the given iterator.
 * @param input The input iterator.
 * @param batchSize The size of each batch.
 */
export function* batch<T>(input: Iterable<T>, batchSize: number): Iterable<T[]> {
    while(true) {
        let batch = [] as T[];
        for (let item of input) {
            batch.push(item);
            if (batch.length >= batchSize) {
                break;
            }
        }

        if (batch.length === 0) {
            return;
        }

        yield batch;
    }
}