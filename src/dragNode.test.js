/* eslint-env jest */
import dragNode from './dragNode.js';

const getParams = extension => Object.assign({}, { cellWidth: 30, cellHeight: 30 }, extension);

test('move node from center', () => {
    expect(
        dragNode({
            params: getParams(),
            node: { x: 2, y: 2, width: 3, height: 3 },
            action: { startX: 75, startY: 75, endX: 125, endY: 125 }
        })
    ).toEqual({
        type: 'move',
        element: { x: 110, y: 110, width: 90, height: 90 },
        node: { x: 4, y: 4, width: 3, height: 3 }
    });
});

test('resize node from right with enabled right resize', () => {
    expect(
        dragNode({
            params: getParams({
                resize: {
                    right: true
                }
            }),
            node: { x: 2, y: 2, width: 3, height: 3 },
            action: { startX: 146, startY: 135, endX: 160, endY: 150 }
        })
    ).toEqual({
        type: 'resize',
        element: { x: 60, y: 60, width: 104, height: 90 },
        node: { x: 2, y: 2, width: 4, height: 3 }
    });
});

test('move node from right with disabled right resize', () => {
    expect(
        dragNode({
            params: getParams(),
            node: { x: 2, y: 2, width: 3, height: 3 },
            action: { startX: 146, startY: 146, endX: 170, endY: 170 }
        })
    ).toEqual({
        type: 'move',
        element: { x: 84, y: 84, width: 90, height: 90 },
        node: { x: 3, y: 3, width: 3, height: 3 }
    });
});

test('resize node from left with enabled left resize', () => {
    expect(
        dragNode({
            params: getParams({
                resize: {
                    left: true
                }
            }),
            node: { x: 2, y: 2, width: 3, height: 3 },
            action: { startX: 64, startY: 135, endX: 50, endY: 150 }
        })
    ).toEqual({
        type: 'resize',
        element: { x: 46, y: 60, width: 104, height: 90 },
        node: { x: 1, y: 2, width: 4, height: 3 }
    });
});

test('move node from left with disabled left resize', () => {
    expect(
        dragNode({
            params: getParams(),
            node: { x: 2, y: 2, width: 3, height: 3 },
            action: { startX: 64, startY: 64, endX: 30, endY: 30 }
        })
    ).toEqual({
        type: 'move',
        element: { x: 26, y: 26, width: 90, height: 90 },
        node: { x: 1, y: 1, width: 3, height: 3 }
    });
});

test('resize node from left to negative', () => {
    expect(
        dragNode({
            params: getParams({
                resize: {
                    left: true
                }
            }),
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
            params: getParams({
                resize: {
                    left: true
                }
            }),
            node: { x: 1, y: 1, width: 2, height: 1 },
            action: { startX: 34, startY: 45, endX: 105, endY: 60 }
        })
    ).toEqual({
        type: 'resize',
        element: { x: 60, y: 30, width: 30, height: 30 },
        node: { x: 2, y: 1, width: 1, height: 1 }
    });
});

test('resize node from right before left', () => {
    expect(
        dragNode({
            params: getParams({
                resize: {
                    right: true
                }
            }),
            node: { x: 2, y: 1, width: 2, height: 1 },
            action: { startX: 116, startY: 45, endX: 45, endY: 60 }
        })
    ).toEqual({
        type: 'resize',
        element: { x: 60, y: 30, width: 30, height: 30 },
        node: { x: 2, y: 1, width: 1, height: 1 }
    });
});

test('resize node from bottom with enabled bottom resize', () => {
    expect(
        dragNode({
            params: getParams({
                resize: {
                    bottom: true
                }
            }),
            node: { y: 2, x: 2, height: 3, width: 3 },
            action: { startX: 135, startY: 146, endX: 150, endY: 160 }
        })
    ).toEqual({
        type: 'resize',
        element: { y: 60, x: 60, height: 104, width: 90 },
        node: { y: 2, x: 2, height: 4, width: 3 }
    });
});

test('move node from bottom with disabled bottom resize', () => {
    expect(
        dragNode({
            params: getParams(),
            node: { y: 2, x: 2, height: 3, width: 3 },
            action: { startX: 146, startY: 146, endX: 170, endY: 170 }
        })
    ).toEqual({
        type: 'move',
        element: { y: 84, x: 84, height: 90, width: 90 },
        node: { y: 3, x: 3, height: 3, width: 3 }
    });
});

test('resize node from top with enabled top resize', () => {
    expect(
        dragNode({
            params: getParams({
                resize: {
                    top: true
                }
            }),
            node: { y: 2, x: 2, height: 3, width: 3 },
            action: { startY: 64, startX: 135, endY: 50, endX: 150 }
        })
    ).toEqual({
        type: 'resize',
        element: { y: 46, x: 60, height: 104, width: 90 },
        node: { y: 1, x: 2, height: 4, width: 3 }
    });
});

test('move node from top with disabled top resize', () => {
    expect(
        dragNode({
            params: getParams(),
            node: { y: 2, x: 2, height: 3, width: 3 },
            action: { startY: 64, startX: 64, endY: 30, endX: 30 }
        })
    ).toEqual({
        type: 'move',
        element: { y: 26, x: 26, height: 90, width: 90 },
        node: { y: 1, x: 1, height: 3, width: 3 }
    });
});

test('resize node from top to negative', () => {
    expect(
        dragNode({
            params: getParams({
                resize: {
                    top: true
                }
            }),
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
            params: getParams({
                resize: {
                    top: true
                }
            }),
            node: { y: 1, x: 1, height: 2, width: 1 },
            action: { startY: 34, startX: 45, endY: 105, endX: 60 }
        })
    ).toEqual({
        type: 'resize',
        element: { y: 60, x: 30, height: 30, width: 30 },
        node: { y: 2, x: 1, height: 1, width: 1 }
    });
});

test('resize node from bottom before top', () => {
    expect(
        dragNode({
            params: getParams({
                resize: {
                    bottom: true
                }
            }),
            node: { y: 2, x: 1, height: 2, width: 1 },
            action: { startY: 116, startX: 45, endY: 45, endX: 60 }
        })
    ).toEqual({
        type: 'resize',
        element: { y: 60, x: 30, height: 30, width: 30 },
        node: { y: 2, x: 1, height: 1, width: 1 }
    });
});

test('move node from right bottom with more then 6 resize width', () => {
    expect(
        dragNode({
            params: getParams(),
            node: { y: 1, x: 1, height: 1, width: 1 },
            action: { startY: 53, startX: 53, endY: 28, endX: 28 }
        })
    ).toEqual({
        type: 'move',
        element: { y: 5, x: 5, height: 30, width: 30 },
        node: { y: 0, x: 0, height: 1, width: 1 }
    });
});

test('resize node according customized resize width', () => {
    expect(
        dragNode({
            params: getParams({
                resize: {
                    width: 12,
                    right: true,
                    bottom: true
                }
            }),
            node: { x: 1, y: 1, width: 2, height: 2 },
            action: { startX: 79, startY: 79, endX: 54, endY: 54 }
        })
    ).toEqual({
        type: 'resize',
        element: { x: 30, y: 30, width: 35, height: 35 },
        node: { x: 1, y: 1, width: 1, height: 1 }
    });
});

test('null if start point is out of node', () => {
    expect(
        dragNode({
            params: getParams(),
            node: { x: 1, y: 1, width: 1, height: 1 },
            action: { startX: 90, startY: 90, endX: 45, endY: 45 }
        })
    ).toEqual(null);
});

test('null if start point is out of padded area', () => {
    expect(
        dragNode({
            params: getParams({
                padding: 10
            }),
            node: { x: 1, y: 1, width: 1, height: 1 },
            action: { startX: 35, startY: 35, endX: 45, endY: 45 }
        })
    ).toEqual(null);
});

test('resize node with padding', () => {
    expect(
        dragNode({
            params: getParams({
                padding: 10,
                resize: {
                    right: true,
                    bottom: true
                }
            }),
            node: { x: 1, y: 1, width: 2, height: 2 },
            action: { startX: 76, startY: 76, endX: 90, endY: 90 }
        })
    ).toEqual({
        type: 'resize',
        element: { x: 30, y: 30, width: 74, height: 74 },
        node: { x: 1, y: 1, width: 3, height: 3 }
    });
});

test('resize node with min width from right', () => {
    expect(
        dragNode({
            params: getParams({
                minWidth: 2,
                resize: {
                    right: true
                }
            }),
            node: { x: 1, y: 1, width: 4, height: 4 },
            action: { startX: 146, startY: 146, endX: 50, endY: 50 }
        })
    ).toEqual({
        type: 'resize',
        element: { x: 30, y: 30, width: 60, height: 120 },
        node: { x: 1, y: 1, width: 2, height: 4 }
    });
});

test('resize node with min width from left', () => {
    expect(
        dragNode({
            params: getParams({
                minWidth: 2,
                resize: {
                    left: true
                }
            }),
            node: { x: 1, y: 1, width: 4, height: 4 },
            action: { startX: 34, startY: 34, endX: 150, endY: 150 }
        })
    ).toEqual({
        type: 'resize',
        element: { x: 90, y: 30, width: 60, height: 120 },
        node: { x: 3, y: 1, width: 2, height: 4 }
    });
});

test('resize node with min height from bottom', () => {
    expect(
        dragNode({
            params: getParams({
                minHeight: 2,
                resize: {
                    bottom: true
                }
            }),
            node: { x: 1, y: 1, width: 4, height: 4 },
            action: { startX: 146, startY: 146, endX: 50, endY: 50 }
        })
    ).toEqual({
        type: 'resize',
        element: { x: 30, y: 30, width: 120, height: 60 },
        node: { x: 1, y: 1, width: 4, height: 2 }
    });
});

test('resize node with min height from top', () => {
    expect(
        dragNode({
            params: getParams({
                minHeight: 2,
                resize: {
                    top: true
                }
            }),
            node: { x: 1, y: 1, width: 4, height: 4 },
            action: { startX: 34, startY: 34, endX: 150, endY: 150 }
        })
    ).toEqual({
        type: 'resize',
        element: { x: 30, y: 90, width: 120, height: 60 },
        node: { x: 1, y: 3, width: 4, height: 2 }
    });
});
