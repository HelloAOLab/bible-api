import { JSDOM } from 'jsdom';
import { iterateAll, children, uncompletable, Rewindable, rewindable } from './iterators';

describe('iterators', () => {
    let jsdom: JSDOM;
    beforeEach(() => {
        jsdom = new JSDOM();
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

            const tree = new jsdom.window.DOMParser().parseFromString(html, 'text/html');
    
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

            const tree = new jsdom.window.DOMParser().parseFromString(html, 'text/html');

            const root = tree.getElementById('0');
            const node = tree.getElementById('1');

            const iterator = iterateAll(root!);

            for(let node of uncompletable(iterator)) {
                if (node instanceof jsdom.window.Element && node.id === '1') {
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

            const tree = new jsdom.window.DOMParser().parseFromString(html, 'text/html');

            const root = tree.getElementById('0');
            const node = tree.getElementById('1');

            let iterator =  iterateAll(root!);

            for(let node of uncompletable(iterator)) {
                if (node instanceof jsdom.window.Element && node.id === '1') {
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
    
    // describe('iterateSiblingsAndCousins()', () => {
    //     it('should iterate through all siblings and cousins', () => {
    //         const html = `
    //             <div id="0">
    //                 <div id="1">
    //                     <div id="2">abc</div>
    //                     <div id="3">def</div>
    //                 </div>
    //                 <div id="4">
    //                     <div id="5">ghi</div>
    //                     <div id="6">jfk</div>
    //                 </div>
    //                 <div id="7">
    //                     <div id="8">lmn</div>
    //                     <div id="9">opq</div>
    //                 </div>
    //             </div>
    //         `;
    
    //         const tree = new jsdom.window.DOMParser().parseFromString(html, 'text/html');
    
    //         const node = tree.getElementById('2');
    
    //         const nodes = [
    //             ...iterateSiblingsAndCousins(node)
    //         ];
    
    //         expect(mapNodes(nodes)).toEqual(['#space', '3', '#space', '#space', '#space', '5', '#space', '6', '#space', '#space', '#space', '8', '#space', '9', '#space']);
    //     });
    
    //     it('should iterate past uncles that dont have any children', () => {
    //         const html = `
    //             <div id="0">
    //                 <div id="1">
    //                     <div id="2">abc</div>
    //                     <div id="3">def</div>
    //                 </div>
    //                 <br id="4"/>
    //                 <div id="7">
    //                     <div id="8">lmn</div>
    //                     <div id="9">opq</div>
    //                 </div>
    //             </div>
    //         `;
    
    //         const tree = new jsdom.window.DOMParser().parseFromString(html, 'text/html');
    
    //         const node = tree.getElementById('2');
    
    //         const nodes = [
    //             ...iterateSiblingsAndCousins(node)
    //         ];
    
    //         expect(mapNodes(nodes)).toEqual(['#space', '3', '#space', '#space', '#space', '4', '#space', '#space', '8', '#space', '9', '#space']);
    //     });
    
    //     // it('should support deeply nested nodes', () => {
    //     //     const html = `
    //     //         <usx version="3.0">
    //     //             <book code="GET" style="id">- BSB</book>
    //     //             <chapter number="26" style="c" sid="GEN 26"/>
    //     //             <para style="m"><verse number="8" style="v" sid="GEN 26:8"/><char style="w" strong="H3588">When</char> <char style="w" strong="H3327">Isaac</char> <char style="w" strong="H1961">had</char> <char style="w" strong="H1961">been</char> <char style="w" strong="H8033">there</char> <char style="w" strong="H1961">a</char> <char style="w" strong="H3117">long</char> <char style="w" strong="H3117">time</char>, <char style="w" strong="H0040">Abimelech</char> <char style="w" strong="H4428">king</char> <char style="w" strong="H4428">of</char> <char style="w" strong="H7200">the</char> <char style="w" strong="H6430">Philistines</char> <char style="w" strong="H7200">looked</char> <char style="w" strong="H8259">down</char> <char style="w" strong="H3117">from</char> <char style="w" strong="H7200">the</char> <char style="w" strong="H2474">window</char> <char style="w" strong="H4428">and</char> <char style="w" strong="H1961">was</char> <char style="w" strong="H8610">surprised</char> <char style="w" strong="H1961">to</char> <char style="w" strong="H7200">see</char> <char style="w" strong="H3327">Isaac</char> <char style="w" strong="H6711">caressing</char> <char style="w" strong="H7200">his</char> <char style="w" strong="H0802">wife</char> <char style="w" strong="H7259">Rebekah</char>.<verse eid="GEN 26:8"/> <verse number="9" style="v" sid="GEN 26:9"/><char style="w" strong="H0040">Abimelech</char> <char style="w" strong="H3327">sent</char> <char style="w" strong="H3588">for</char> <char style="w" strong="H3327">Isaac</char> <char style="w" strong="H3327">and</char> <char style="w" strong="H7121">said</char>, &#8220;<char style="w" strong="H6435">So</char> <char style="w" strong="H1931">she</char> <char style="w" strong="H1931">is</char> <char style="w" strong="H2088">really</char> <char style="w" strong="H5921">your</char> <char style="w" strong="H0802">wife</char>! <char style="w" strong="H3588">How</char> <char style="w" strong="H3201">could</char> <char style="w" strong="H3588">you</char> <char style="w" strong="H0559">say</char>, &#8216;<char style="w" strong="H1931">She</char> <char style="w" strong="H1931">is</char> <char style="w" strong="H5921">my</char> sister&#8217;?&#8221;</para>
    //     //             <para style="b"/>
    //     //             <para style="m"><char style="w" strong="H3327">Isaac</char> <char style="w" strong="H0559">replied</char>, &#8220;<char style="w" strong="H3588">Because</char> <char style="w" strong="H3588">I</char> <char style="w" strong="H0559">thought</char> <char style="w" strong="H3588">I</char> <char style="w" strong="H6435">might</char> <char style="w" strong="H4191">die</char> <char style="w" strong="H5921">on</char> <char style="w" strong="H5921">account</char> <char style="w" strong="H5921">of</char> <char style="w" strong="H5921">her</char>.&#8221;<verse eid="GEN 26:9"/></para>
    //     //         </usx>
    //     //     `;
    
    //     //     const tree = new jsdom.window.DOMParser().parseFromString(html, 'application/xml');
    
    //     //     const node = tree.querySelector('verse[number="9"]');
    
    //     //     const nodes = [
    //     //         ...iterateSiblingsAndCousins(node)
    //     //     ];
    
    //     //     expect(nodes.map(n => {
    //     //         return `${n.node.nodeName}: ${n.node.textContent} - ${n.parent.nodeName}`;
    //     //     })).toMatchSnapshot();
    //     // });
    
    //     function mapNodes(nodes: { node: Node, parent: Element }[]): string[] {
    //         return nodes.map(node => {
    //             if (node.node.nodeType === jsdom.window.Node.TEXT_NODE) {
    //                 if (/\s/.test(node.node.textContent as string)) {
    //                     return '#space';
    //                 } else {
    //                     return node.node.textContent;
    //                 }
    //             } else if (node.node.nodeType === jsdom.window.Node.ELEMENT_NODE) {
    //                 return (node.node as any).getAttribute('id');
    //             } else {
    //                 return 'unknown';
    //             }
    //         });
    //     }
    // });

    function mapNodes(nodes: Node[]): string[] {
        return nodes.map(node => {
            if (node.nodeType === jsdom.window.Node.TEXT_NODE) {
                if (/\s/.test(node.textContent as string)) {
                    return '#space';
                } else {
                    return node.textContent;
                }
            } else if (node.nodeType === jsdom.window.Node.ELEMENT_NODE) {
                return (node as any).getAttribute('id');
            } else {
                return 'unknown';
            }
        });
    }
});
