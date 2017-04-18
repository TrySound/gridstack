/* eslint-env jest */
import dragNode from './dragNode.js';

const params = {
    cellWidth: 30,
    cellHeight: 30,
    resizeSize: 6
};

test('move node from center', () => {
    expect(
        dragNode({
            params,
            node: { x: 2, y: 2, width: 3, height: 3 },
            action: { startX: 75, startY: 75, endX: 125, endY: 125 }
        })
    ).toEqual({
        type: 'move',
        element: { x: 110, y: 110, width: 90, height: 90 },
        node: { x: 4, y: 4, width: 3, height: 3 }
    });
});

test('resize node from right', () => {
    expect(
        dragNode({
            params,
            node: { x: 2, y: 2, width: 3, height: 3 },
            action: { startX: 146, startY: 135, endX: 160, endY: 150 }
        })
    ).toEqual({
        type: 'resize',
        element: { x: 60, y: 60, width: 104, height: 90 },
        node: { x: 2, y: 2, width: 4, height: 3 }
    });
});

test('resize node from left', () => {
    expect(
        dragNode({
            params,
            node: { x: 2, y: 2, width: 3, height: 3 },
            action: { startX: 64, startY: 135, endX: 50, endY: 150 }
        })
    ).toEqual({
        type: 'resize',
        element: { x: 46, y: 60, width: 104, height: 90 },
        node: { x: 1, y: 2, width: 4, height: 3 }
    });
});

test('resize node from left to negative', () => {
    expect(
        dragNode({
            params,
            node: { x: 1, y: 1, width: 1, height: 1 },
            action: { startX: 34, startY: 45, endX: -50, endY: 60 }
        })
    ).toEqual({
        type: 'resize',
        element: { x: 0, y: 30, width: 60, height: 30 },
        node: { x: 0, y: 1, width: 2, height: 1 }
    });
});

test('resize node from left after right', () => {
    expect(
        dragNode({
            params,
            node: { x: 1, y: 1, width: 2, height: 1 },
            action: { startX: 34, startY: 45, endX: 105, endY: 60 }
        })
    ).toEqual({
        type: 'resize',
        element: { x: 60, y: 30, width: 30, height: 30 },
        node: { x: 2, y: 1, width: 1, height: 1 }
    });
});

test('resize node from right', () => {
    expect(
        dragNode({
            params,
            node: { x: 4, y: 0, width: 16, height: 3 },
            action: { startX: 598, startY: 40, endX: 230, endY: 45 }
        })
    ).toEqual({
        type: 'resize',
        element: { x: 120, y: 0, width: 112, height: 90 },
        node: { x: 4, y: 0, width: 4, height: 3 }
    });
});

test('resize node from right before left', () => {
    expect(
        dragNode({
            params,
            node: { x: 2, y: 1, width: 2, height: 1 },
            action: { startX: 116, startY: 45, endX: 45, endY: 60 }
        })
    ).toEqual({
        type: 'resize',
        element: { x: 60, y: 30, width: 30, height: 30 },
        node: { x: 2, y: 1, width: 1, height: 1 }
    });
});

test('resize node from bottom', () => {
    expect(
        dragNode({
            params,
            node: { y: 2, x: 2, height: 3, width: 3 },
            action: { startX: 135, startY: 146, endX: 150, endY: 160 }
        })
    ).toEqual({
        type: 'resize',
        element: { y: 60, x: 60, height: 104, width: 90 },
        node: { y: 2, x: 2, height: 4, width: 3 }
    });
});

test('resize node from top', () => {
    expect(
        dragNode({
            params,
            node: { y: 2, x: 2, height: 3, width: 3 },
            action: { startY: 64, startX: 135, endY: 50, endX: 150 }
        })
    ).toEqual({
        type: 'resize',
        element: { y: 46, x: 60, height: 104, width: 90 },
        node: { y: 1, x: 2, height: 4, width: 3 }
    });
});

test('resize node from top to negative', () => {
    expect(
        dragNode({
            params,
            node: { y: 1, x: 1, height: 1, width: 1 },
            action: { startY: 34, startX: 45, endY: -50, endX: 60 }
        })
    ).toEqual({
        type: 'resize',
        element: { y: 0, x: 30, height: 60, width: 30 },
        node: { y: 0, x: 1, height: 2, width: 1 }
    });
});

test('resize node from top after bottom', () => {
    expect(
        dragNode({
            params,
            node: { y: 1, x: 1, height: 2, width: 1 },
            action: { startY: 34, startX: 45, endY: 105, endX: 60 }
        })
    ).toEqual({
        type: 'resize',
        element: { y: 60, x: 30, height: 30, width: 30 },
        node: { y: 2, x: 1, height: 1, width: 1 }
    });
});

test('resize node from bottom', () => {
    expect(
        dragNode({
            params,
            node: { y: 4, x: 0, height: 16, width: 3 },
            action: { startY: 598, startX: 40, endY: 230, endX: 45 }
        })
    ).toEqual({
        type: 'resize',
        element: { y: 120, x: 0, height: 112, width: 90 },
        node: { y: 4, x: 0, height: 4, width: 3 }
    });
});

test('resize node from bottom before top', () => {
    expect(
        dragNode({
            params,
            node: { y: 2, x: 1, height: 2, width: 1 },
            action: { startY: 116, startX: 45, endY: 45, endX: 60 }
        })
    ).toEqual({
        type: 'resize',
        element: { y: 60, x: 30, height: 30, width: 30 },
        node: { y: 2, x: 1, height: 1, width: 1 }
    });
});

test('move node from right bottom with more then 6 resize size', () => {
    expect(
        dragNode({
            params,
            node: { y: 1, x: 1, height: 1, width: 1 },
            action: { startY: 53, startX: 53, endY: 28, endX: 28 }
        })
    ).toEqual({
        type: 'move',
        element: { y: 5, x: 5, height: 30, width: 30 },
        node: { y: 0, x: 0, height: 1, width: 1 }
    });
});
