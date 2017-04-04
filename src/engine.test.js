/* eslint-env jest */
import { packNodes/*, addNode, removeNode, updateNode*/ } from './engine.js';

test('normalize node', () => {
    expect(
        packNodes({
            nodes: [
                { id: 1, x: -1, y: -1, width: -1, height: -1 }
            ]
        })
    ).toEqual([
        { id: 1, x: 0, y: 0, width: 1, height: 1 }
    ]);
});

test('pack single node', () => {
    expect(
        packNodes({
            nodes: [
                { id: 1, x: 1, y: 1, width: 2, height: 2 }
            ]
        })
    ).toEqual([
        { id: 1, x: 1, y: 1, width: 2, height: 2 }
    ]);
});

test('pack and hoist single node', () => {
    expect(
        packNodes({
            hoist: true,
            nodes: [
                { id: 1, x: 1, y: 1, width: 2, height: 2 }
            ]
        })
    ).toEqual([
        { id: 1, x: 1, y: 0, width: 2, height: 2 }
    ]);
});

test('pack and move single constrained node', () => {
    expect(
        packNodes({
            maxWidth: 5,
            nodes: [
                { id: 1, x: 6, y: 1, width: 2, height: 2 }
            ]
        })
    ).toEqual([
        { id: 1, x: 3, y: 1, width: 2, height: 2 }
    ]);
});

test('pack and cuts off too wide constrained node', () => {
    expect(
        packNodes({
            maxWidth: 5,
            nodes: [
                { id: 1, x: 3, y: 2, width: 7, height: 3 }
            ]
        })
    ).toEqual([
        { id: 1, x: 0, y: 2, width: 5, height: 3 }
    ]);
});

test('pack two nodes', () => {
    expect(
        packNodes({
            nodes: [
                { id: 1, x: 3, y: 3, width: 3, height: 3 },
                { id: 2, x: 2, y: 2, width: 3, height: 3 }
            ]
        })
    ).toEqual([
        { id: 2, x: 2, y: 2, width: 3, height: 3 },
        { id: 1, x: 3, y: 5, width: 3, height: 3 }
    ]);
});

test('pack and hoist three nodes', () => {
    expect(
        packNodes({
            hoist: true,
            nodes: [
                { id: 1, x: 3, y: 3, width: 3, height: 3 },
                { id: 2, x: 2, y: 2, width: 3, height: 3 },
                { id: 3, x: 6, y: 4, width: 3, height: 3 }
            ]
        })
    ).toEqual([
        { id: 2, x: 2, y: 0, width: 3, height: 3 },
        { id: 1, x: 3, y: 3, width: 3, height: 3 },
        { id: 3, x: 6, y: 0, width: 3, height: 3 }
    ]);
});

test('pack and stack constrained nodes', () => {
    expect(
        packNodes({
            maxWidth: 5,
            nodes: [
                { id: 1, x: 3, y: 3, width: 4, height: 4 },
                { id: 2, x: 1, y: 1, width: 3, height: 3 }
            ]
        })
    ).toEqual([
        { id: 2, x: 1, y: 1, width: 3, height: 3 },
        { id: 1, x: 1, y: 4, width: 4, height: 4 }
    ]);
});

test('hoist vertically intercepted nodes', () => {
    expect(
        packNodes({
            hoist: true,
            nodes: [
                { id: 1, x: 0, y: 0, width: 3, height: 3 },
                { id: 3, x: 6, y: 0, width: 3, height: 3 },
                { id: 4, x: 10, y: 0, width: 3, height: 3 },
                { id: 2, x: 2, y: 3, width: 3, height: 3 }
            ]
        })
    ).toEqual([
        { id: 1, x: 0, y: 0, width: 3, height: 3 },
        { id: 3, x: 6, y: 0, width: 3, height: 3 },
        { id: 4, x: 10, y: 0, width: 3, height: 3 },
        { id: 2, x: 2, y: 3, width: 3, height: 3 }
    ]);
});

test('not hoist static nodes', () => {
    expect(
        packNodes({
            hoist: true,
            nodes: [
                { id: 2, x: 2, y: 2, width: 3, height: 3, static: true },
                { id: 3, x: 6, y: 0, width: 3, height: 3 },
                { id: 1, x: 0, y: 10, width: 3, height: 3 }
            ]
        })
    ).toEqual([
        { id: 2, x: 2, y: 2, width: 3, height: 3, static: true },
        { id: 3, x: 6, y: 0, width: 3, height: 3 },
        { id: 1, x: 0, y: 5, width: 3, height: 3 }
    ]);
});

test('static nodes save their place', () => {
    expect(
        packNodes({
            nodes: [
                { id: 2, x: 2, y: 4, width: 3, height: 3, static: true },
                { id: 3, x: 3, y: 2, width: 3, height: 3 },
                { id: 1, x: 1, y: 7, width: 3, height: 3 }
            ]
        })
    ).toEqual([
        { id: 2, x: 2, y: 4, width: 3, height: 3, static: true },
        { id: 3, x: 3, y: 7, width: 3, height: 3 },
        { id: 1, x: 1, y: 10, width: 3, height: 3 }
    ]);
});

test('non-static nodes does not conflict with static ones', () => {
    expect(
        packNodes({
            hoist: true,
            nodes: [
                { id: 2, x: 2, y: 4, width: 3, height:3, static:true },
                { id: 1, x: 0, y: 0, width: 3, height:3 },
                { id: 3, x: 2, y: 1, width: 3, height:3 }
            ]
        })
    ).toEqual([
        { id: 2, x: 2, y: 4, width: 3, height: 3, static: true },
        { id: 1, x: 0, y: 0, width: 3, height: 3 },
        { id: 3, x: 2, y: 7, width: 3, height: 3 }
    ]);
});

test('non-static nodes after static should not conflict with hoist', () => {
    expect(
        packNodes({
            hoist: true,
            nodes: [
                { id: 2, x: 1, y: 0, width: 3, height: 3, static: true },
                { id: 1, x: 0, y: 3, width: 3, height: 3 },
                { id: 3, x: 2, y: 3, width: 3, height: 3 }
            ]
        })
    ).toEqual([
        { id: 2, x: 1, y: 0, width: 3, height: 3, static: true },
        { id: 1, x: 0, y: 3, width: 3, height: 3 },
        { id: 3, x: 2, y: 6, width: 3, height: 3 }
    ]);
});

test('non-static nodes hoist through static ones', () => {
    expect(
        packNodes({
            hoist: true,
            nodes: [
                { id: 2, x: 2, y: 8, width: 3, height: 3, static: true },
                { id: 3, x: 3, y: 10, width: 3, height: 3 },
                { id: 1, x: 1, y: 13, width: 3, height: 3 }
            ]
        })
    ).toEqual([
        { id: 2, x: 2, y: 8, width: 3, height: 3, static: true },
        { id: 3, x: 3, y: 0, width: 3, height: 3 },
        { id: 1, x: 1, y: 3, width: 3, height: 3 }
    ]);
});

test('non-static nodes stack with hoist on static ones if no place', () => {
    expect(
        packNodes({
            hoist: true,
            nodes: [
                { id: 2, x: 2, y: 2, width: 3, height: 3, static: true },
                { id: 1, x: 1, y: 5, width: 3, height: 3 }
            ]
        })
    ).toEqual([
        { id: 2, x: 2, y: 2, width: 3, height: 3, static: true },
        { id: 1, x: 1, y: 5, width: 3, height: 3 }
    ]);
});

test('non-static nodes are resolved with not intercepted firstly', () => {
    expect(
        packNodes({
            nodes: [
                { id: 2, x: 2, y: 4, width: 3, height: 3, static: true },
                { id: 1, x: 0, y: 0, width: 3, height: 3 },
                { id: 3, x: 2, y: 1, width: 3, height: 3 }
            ]
        })
    ).toEqual([
        { id: 2, x: 2, y: 4, width: 3, height: 3, static: true },
        { id: 1, x: 0, y: 0, width: 3, height: 3 },
        { id: 3, x: 2, y: 7, width: 3, height: 3 }
    ]);
});

test('updating node forces dymnamic', () => {
    expect(
        packNodes({
            updatingId: 2,
            nodes: [
                { id: 1, x: 2, y: 2, width: 3, height: 3 },
                { id: 2, x: 4, y: 4, width: 3, height: 3 }
            ]
        })
    ).toEqual([
        { id: 2, x: 4, y: 4, width: 3, height: 3 },
        { id: 1, x: 2, y: 7, width: 3, height: 3 }
    ]);
});

test('updating is forced by static', () => {
    expect(
        packNodes({
            updatingId: 2,
            nodes: [
                { id: 1, x: 2, y: 2, width: 3, height: 3, static: true },
                { id: 2, x: 4, y: 4, width: 3, height: 3 }
            ]
        })
    ).toEqual([
        { id: 1, x: 2, y: 2, width: 3, height: 3, static: true },
        { id: 2, x: 4, y: 5, width: 3, height: 3 }
    ]);
});

/*
const clearNodes = nodes => nodes.map(node => ({
    x: node.x,
    y: node.y,
    width: node.width,
    height: node.height
}));

test('isAreaEmpty', function() {
    const nodes = [
        { x: 3, y: 2, width: 3, height: 2 }
    ];
    expect(isAreaEmpty(nodes, { x: 0, y: 0, width: 3, height: 2})).toEqual(true);
    expect(isAreaEmpty(nodes, { x: 3, y: 4, width: 3, height: 2})).toEqual(true);
    expect(isAreaEmpty(nodes, { x: 1, y: 1, width: 3, height: 2})).toEqual(false);
    expect(isAreaEmpty(nodes, { x: 2, y: 3, width: 3, height: 2})).toEqual(false);
});

test('addNode adds node to array', () => {
    const nodes = addNode(Infinity, false, [], { x: 1, y: 2, width: 3, height: 4 });
    expect(clearNodes(nodes)).toEqual([
    ]);
});

test('addNode constrains new node', () => {
    const nodes = addNode(10, false, [], { x: 6, y: 2, width: 6, height: 4 });
    expect(clearNodes(nodes)).toEqual([
        { x: 4, y: 2, width: 6, height: 4 }
    ]);
});

test('addNode places new node before depend on x', () => {
    const nodes = addNode(Infinity, false, [
        { x: 3, y: 2, width: 3, height: 2 }
    ], { x: 2, y: 3, width: 2, height: 3 });
    expect(clearNodes(nodes)).toEqual([
        { x: 3, y: 6, width: 3, height: 2 },
        { x: 2, y: 3, width: 2, height: 3 }
    ]);
});

test('packNodes respects locked nodes', function() {
    const updated = { x: 0, y: 3, width: 1, height: 3, id: 2 };
    const nodes = updateNode(12, false, [
        { x: 0, y: 2, width: 1, height: 3, id: 1, locked: true },
        updated
    ], updated, updated);

    expect(clearNodes(nodes.filter(node => node.id === 1))).toEqual([
        { x: 0, y: 2, width: 1, height: 3 }
    ]);
    expect(clearNodes(nodes.filter(node => node.id === 2))).toEqual([
        { x: 0, y: 5, width: 1, height: 3 }
    ]);
});
*/
/*
xdescribe('gridstack engine', function() {

    it('defaults', function() {
        const engine = new Engine();
        expect(engine.width).toEqual(undefined);
        expect(engine.float).toEqual(false);
        expect(engine.height).toEqual(0);
        expect(engine.nodes).toEqual([]);
    });

    it('sets witdh, onchange, floatMode, height, items if passed', () => {
        const engine = new Engine(12, true, 10, [
            { x: 1, y: 1, width: 1, height: 1}
        ]);
        expect(engine.width).toEqual(12);
        expect(engine.float).toEqual(true);
        expect(engine.height).toEqual(10);
        expect(engine.nodes).toEqual([
            { x: 1, y: 1, width: 1, height: 1 }
        ]);
    });

    describe('test _prepareNode', function() {
        let engine;

        beforeAll(function() {
            engine = new Engine(12);
        });

        it('should prepare a node', function() {
            expect(engine._prepareNode({}, false)).toEqual(jasmine.objectContaining({x: 0, y: 0, width: 1, height: 1}));
            expect(engine._prepareNode({x: 10}, false)).toEqual(jasmine.objectContaining({x: 10, y: 0, width: 1, height: 1}));
            expect(engine._prepareNode({x: -10}, false)).toEqual(jasmine.objectContaining({x: 0, y: 0, width: 1, height: 1}));
            expect(engine._prepareNode({y: 10}, false)).toEqual(jasmine.objectContaining({x: 0, y: 10, width: 1, height: 1}));
            expect(engine._prepareNode({y: -10}, false)).toEqual(jasmine.objectContaining({x: 0, y: 0, width: 1, height: 1}));
            expect(engine._prepareNode({width: 3}, false)).toEqual(jasmine.objectContaining({x: 0, y: 0, width: 3, height: 1}));
            expect(engine._prepareNode({width: 100}, false)).toEqual(jasmine.objectContaining({x: 0, y: 0, width: 12, height: 1}));
            expect(engine._prepareNode({width: 0}, false)).toEqual(jasmine.objectContaining({x: 0, y: 0, width: 1, height: 1}));
            expect(engine._prepareNode({width: -190}, false)).toEqual(jasmine.objectContaining({x: 0, y: 0, width: 1, height: 1}));
            expect(engine._prepareNode({height: 3}, false)).toEqual(jasmine.objectContaining({x: 0, y: 0, width: 1, height: 3}));
            expect(engine._prepareNode({height: 0}, false)).toEqual(jasmine.objectContaining({x: 0, y: 0, width: 1, height: 1}));
            expect(engine._prepareNode({height: -10}, false)).toEqual(jasmine.objectContaining({x: 0, y: 0, width: 1, height: 1}));
            expect(engine._prepareNode({x: 4, width: 10}, false)).toEqual(jasmine.objectContaining({x: 2, y: 0, width: 10, height: 1}));
            expect(engine._prepareNode({x: 4, width: 10}, true)).toEqual(jasmine.objectContaining({x: 4, y: 0, width: 8, height: 1}));
        });
    });

    describe('test packNodes', function() {
        describe('using not float mode', function() {
            let engine;

            const findNode = function(engine, id) {
                return engine.nodes.find(i => i._id === id);
            };

            beforeEach(function() {
                engine = new Engine(12, null, false);
            });

            it('shouldn\'t pack one node with y coord eq 0', function() {
                engine.nodes = [
                    {x: 0, y: 0, width: 1, height: 1, _id: 1},
                ];

                packNodes(engine.nodes, engine.width, engine.float);

                expect(findNode(engine, 1)).toEqual(jasmine.objectContaining({x: 0, y: 0, width: 1, height: 1}));
                expect(findNode(engine, 1)._dirty).toBeFalsy();
            });

            it('should pack one node correctly', function() {
                engine.nodes = [
                    {x: 0, y: 1, width: 1, height: 1, _id: 1},
                ];

                packNodes(engine.nodes, engine.width, engine.float);

                expect(findNode(engine, 1)).toEqual(jasmine.objectContaining({x: 0, y: 0, width: 1, height: 1, _dirty: true}));
            });

            it('should pack nodes correctly', function() {
                engine.nodes = [
                    {x: 0, y: 1, width: 1, height: 1, _id: 1},
                    {x: 0, y: 5, width: 1, height: 1, _id: 2},
                ];

                packNodes(engine.nodes, engine.width, engine.float);

                expect(findNode(engine, 1)).toEqual(jasmine.objectContaining({x: 0, y: 0, width: 1, height: 1, _dirty: true}));
                expect(findNode(engine, 2)).toEqual(jasmine.objectContaining({x: 0, y: 1, width: 1, height: 1, _dirty: true}));
            });

            it('should pack nodes correctly', function() {
                engine.nodes = [
                    {x: 0, y: 5, width: 1, height: 1, _id: 1},
                    {x: 0, y: 1, width: 1, height: 1, _id: 2},
                ];

                packNodes(engine.nodes, engine.width, engine.float);

                expect(findNode(engine, 2)).toEqual(jasmine.objectContaining({x: 0, y: 0, width: 1, height: 1, _dirty: true}));
                expect(findNode(engine, 1)).toEqual(jasmine.objectContaining({x: 0, y: 1, width: 1, height: 1, _dirty: true}));
            });
        });
    });
});
*/