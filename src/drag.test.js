/* eslint-env jest */
import { dragNode } from './drag.js';

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
            start: { x: 75, y: 75 },
            end: { x: 125, y: 125 }
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
            start: { x: 146, y: 135 },
            end: { x: 160, y: 150 }
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
            start: { x: 64, y: 135 },
            end: { x: 50, y: 150 }
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
            start: { x: 34, y: 45 },
            end: { x: -50, y: 60 }
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
            start: { x: 34, y: 45 },
            end: { x: 105, y: 60 }
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
            start: { x: 598, y: 40 },
            end: { x: 230, y: 45 }
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
            start: { x: 116, y: 45 },
            end: { x: 45, y: 60 }
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
            start: { y: 146, x: 135 },
            end: { y: 160, x: 150 }
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
            start: { y: 64, x: 135 },
            end: { y: 50, x: 150 }
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
            start: { y: 34, x: 45 },
            end: { y: -50, x: 60 }
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
            start: { y: 34, x: 45 },
            end: { y: 105, x: 60 }
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
            start: { y: 598, x: 40 },
            end: { y: 230, x: 45 }
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
            start: { y: 116, x: 45 },
            end: { y: 45, x: 60 }
        })
    ).toEqual({
        type: 'resize',
        element: { y: 60, x: 30, height: 30, width: 30 },
        node: { y: 2, x: 1, height: 1, width: 1 }
    });
});
