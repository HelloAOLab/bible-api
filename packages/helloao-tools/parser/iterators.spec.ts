import { DOMParser, Element, Node } from 'linkedom';
import { iterateAll, children, uncompletable, Rewindable, rewindable } from './iterators';

describe('iterators', () => {
    let dom: DOMParser;
    beforeEach(() => {
        dom = new DOMParser();
    });

    describe('iterateAll()', () => {
        it('should iterate through all nodes', () => {
            const html = `
                <div id="0">
                    <div id="1">
                        <div id="2">abc</div>
                        <div id="3">def</div>
                    </div>
                    <div id="4">
                        <div id="5">ghi</div>
                        <div id="6">jfk</div>
                    </div>
                    <div id="7">
                        <div id="8">lmn</div>
                        <div id="9">opq</div>
                    </div>
                </div>
            `;

            const tree = dom.parseFromString(html, 'text/html') as unknown as globalThis.Document;
    
            const node = tree.getElementById('0');
    
            const iterator = iterateAll(node!);

            expect(iterator).toBeInstanceOf(Rewindable);

            const nodes = [
                ...iterator
            ];

            expect(mapNodes(nodes)).toEqual([
                "#space",
                "1",
                "#space",
                "2",
                "abc",
                "#space",
                "3",
                "def",
                "#space",
                "#space",
                "4",
                "#space",
                "5",
                "ghi",
                "#space",
                "6",
                "jfk",
                "#space",
                "#space",
                "7",
                "#space",
                "8",
                "lmn",
                "#space",
                "9",
                "opq",
                "#space",
                "#space",
            ]);
        });
    });

    describe('children()', () => {
        it('should iterate through all children', () => {
            const html = `
                <div id="0">
                    <div id="1">
                        <div id="2">abc</div>
                        <div id="3">def</div>
                    </div>
                    <div id="4">
                        <div id="5">ghi</div>
                        <div id="6">jfk</div>
                    </div>
                    <div id="7">
                        <div id="8">lmn</div>
                        <div id="9">opq</div>
                    </div>
                </div>
            `;

            const tree = dom.parseFromString(html, 'text/html') as unknown as globalThis.Document;

            const root = tree.getElementById('0');
            const node = tree.getElementById('1');

            const iterator = iterateAll(root!);

            for(let node of uncompletable(iterator)) {
                if (node instanceof Element && (node as Element).id === '1') {
                    break;
                }
            }

            const nodes = [
                ...children(iterator, node!)
            ];

            expect(mapNodes(nodes)).toEqual(['#space', '2', 'abc', '#space', '3', 'def', '#space']);
        });

        it('should not exhaust the iterator', () => {
            const html = `
                <div id="0">
                    <div id="1">
                        <div id="2">abc</div>
                        <div id="3">def</div>
                    </div>
                    <div id="4">
                        <div id="5">ghi</div>
                        <div id="6">jfk</div>
                    </div>
                    <div id="7">
                        <div id="8">lmn</div>
                        <div id="9">opq</div>
                    </div>
                </div>
            `;

            const tree = dom.parseFromString(html, 'text/html') as unknown as globalThis.Document;

            const root = tree.getElementById('0');
            const node = tree.getElementById('1');

            let iterator =  iterateAll(root!);

            for(let node of uncompletable(iterator)) {
                if (node instanceof Element && (node as Element).id === '1') {
                    break;
                }
            }

            const nodes = [
                ...children(iterator, node!)
            ];

            expect(mapNodes(nodes)).toEqual(['#space', '2', 'abc', '#space', '3', 'def', '#space']);

            const remaining = [
                ...iterator
            ];
            
            expect(mapNodes(remaining)).toEqual(['#space', '4', '#space', '5', 'ghi', '#space', '6', 'jfk', '#space', '#space', '7', '#space', '8', 'lmn', '#space', '9', 'opq', '#space' ,'#space']);
        });
    });

    describe('rewindable()', () => {
        it('should be able to rewind the iterator', () => {
            function *gen() {
                yield 1;
                yield 2;
                yield 3;
            }

            const iterator = rewindable(gen());

            const { value: value1 } = iterator.next();
            const { value: value2 } = iterator.next();
            const { value: value3 } = iterator.next();

            iterator.rewind(1);

            const { value: value4 } = iterator.next();
            const { value: value5 } = iterator.next();

            expect(value1).toBe(1);
            expect(value2).toBe(2);
            expect(value3).toBe(3);
            expect(value4).toBe(3);
            expect(value5).toBeUndefined();
        });
    });

    function mapNodes(nodes: Node[]): string[] {
        return nodes.map(node => {
            if (node.nodeType === (Node as any).TEXT_NODE) {
                if (/\s/.test(node.textContent as string)) {
                    return '#space';
                } else {
                    return node.textContent;
                }
            } else if (node.nodeType === (Node as any).ELEMENT_NODE) {
                return (node as any).getAttribute('id');
            } else {
                return 'unknown';
            }
        });
    }
});
