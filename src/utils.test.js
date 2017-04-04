import { findNode } from './utils.js';

test('find node by x and y', () => {
    expect(
        findNode([
            { id: 1, x: 1, y: 1, width: 3, height: 3 },
            { id: 2, x: 5, y: 5, width: 3, height: 3 }
        ], 6, 6)
    ).toEqual({ id: 2, x: 5, y: 5, width: 3, height: 3 });
});

test('null if node is not found', () => {
    expect(
        findNode([
            { id: 1, x: 1, y: 1, width: 3, height: 3 },
            { id: 2, x: 5, y: 5, width: 3, height: 3 }
        ], 4, 4)
    ).toEqual(null);
});
