/* eslint-env jest */
import dragNode from './dragNode.js';

const getParams = extension => Object.assign({}, { cellWidth: 30, cellHeight: 30 }, extension);

test('move node from center', () => {
    expect(
        dragNode({
            params: getParams(),
            node: { id: '1', x: 2, y: 2, width: 3, height: 3 },
            action: { startX: 75, startY: 75, endX: 125, endY: 125 }
        })
    ).toEqual({
        type: 'move',
        element: { id: '1', id: '1', x: 110, y: 110, width: 90, height: 90 },
        node: { id: '1', x: 4, y: 4, width: 3, height: 3 }
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
            node: { id: '1', x: 2, y: 2, width: 3, height: 3 },
            action: { startX: 146, startY: 135, endX: 160, endY: 150 }
        })
    ).toEqual({
        type: 'resize',
        element: { id: '1', x: 60, y: 60, width: 104, height: 90 },
        node: { id: '1', x: 2, y: 2, width: 4, height: 3 }
    });
});

test('move node from right with disabled right resize', () => {
    expect(
        dragNode({
            params: getParams(),
            node: { id: '1', x: 2, y: 2, width: 3, height: 3 },
            action: { startX: 146, startY: 146, endX: 170, endY: 170 }
        })
    ).toEqual({
        type: 'move',
        element: { id: '1', x: 84, y: 84, width: 90, height: 90 },
        node: { id: '1', x: 3, y: 3, width: 3, height: 3 }
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
            node: { id: '1', x: 2, y: 2, width: 3, height: 3 },
            action: { startX: 64, startY: 135, endX: 50, endY: 150 }
        })
    ).toEqual({
        type: 'resize',
        element: { id: '1', x: 46, y: 60, width: 104, height: 90 },
        node: { id: '1', x: 1, y: 2, width: 4, height: 3 }
    });
});

test('move node from left with disabled left resize', () => {
    expect(
        dragNode({
            params: getParams(),
            node: { id: '1', x: 2, y: 2, width: 3, height: 3 },
            action: { startX: 64, startY: 64, endX: 30, endY: 30 }
        })
    ).toEqual({
        type: 'move',
        element: { id: '1', x: 26, y: 26, width: 90, height: 90 },
        node: { id: '1', x: 1, y: 1, width: 3, height: 3 }
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
            node: { id: '1', y: 2, x: 2, height: 3, width: 3 },
            action: { startX: 135, startY: 146, endX: 150, endY: 160 }
        })
    ).toEqual({
        type: 'resize',
        element: { id: '1', y: 60, x: 60, height: 104, width: 90 },
        node: { id: '1', y: 2, x: 2, height: 4, width: 3 }
    });
});

test('move node from bottom with disabled bottom resize', () => {
    expect(
        dragNode({
            params: getParams(),
            node: { id: '1', y: 2, x: 2, height: 3, width: 3 },
            action: { startX: 146, startY: 146, endX: 170, endY: 170 }
        })
    ).toEqual({
        type: 'move',
        element: { id: '1', y: 84, x: 84, height: 90, width: 90 },
        node: { id: '1', y: 3, x: 3, height: 3, width: 3 }
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
            node: { id: '1', y: 2, x: 2, height: 3, width: 3 },
            action: { startY: 64, startX: 135, endY: 50, endX: 150 }
        })
    ).toEqual({
        type: 'resize',
        element: { id: '1', y: 46, x: 60, height: 104, width: 90 },
        node: { id: '1', y: 1, x: 2, height: 4, width: 3 }
    });
});

test('move node from top with disabled top resize', () => {
    expect(
        dragNode({
            params: getParams(),
            node: { id: '1', y: 2, x: 2, height: 3, width: 3 },
            action: { startY: 64, startX: 64, endY: 30, endX: 30 }
        })
    ).toEqual({
        type: 'move',
        element: { id: '1', y: 26, x: 26, height: 90, width: 90 },
        node: { id: '1', y: 1, x: 1, height: 3, width: 3 }
    });
});

test('resize node from left after right and from top after bottom', () => {
    expect(
        dragNode({
            params: getParams({
                resize: {
                    left: true,
                    top: true
                }
            }),
            node: { id: '1', x: 1, y: 1, width: 2, height: 2 },
            action: { startX: 34, startY: 34, endX: 105, endY: 105 }
        })
    ).toEqual({
        type: 'resize',
        element: { id: '1', x: 60, y: 60, width: 30, height: 30 },
        node: { id: '1', x: 2, y: 2, width: 1, height: 1 }
    });
});

test('resize node from left to negative and from top to negative', () => {
    expect(
        dragNode({
            params: getParams({
                resize: {
                    left: true,
                    top: true
                }
            }),
            node: { id: '1', x: 1, y: 1, width: 1, height: 1 },
            action: { startX: 34, startY: 34, endX: -50, endY: -50 }
        })
    ).toEqual({
        type: 'resize',
        element: { id: '1', x: 0, y: 0, width: 60, height: 60 },
        node: { id: '1', x: 0, y: 0, width: 2, height: 2 }
    });
});

test('resize node from right before left and from bottom before top', () => {
    expect(
        dragNode({
            params: getParams({
                resize: {
                    right: true,
                    bottom: true
                }
            }),
            node: { id: '1', x: 2, y: 2, width: 2, height: 2 },
            action: { startX: 116, startY: 116, endX: 45, endY: 45 }
        })
    ).toEqual({
        type: 'resize',
        element: { id: '1', x: 60, y: 60, width: 30, height: 30 },
        node: { id: '1', x: 2, y: 2, width: 1, height: 1 }
    });
});

test('move node from right bottom with more then 6 resize width', () => {
    expect(
        dragNode({
            params: getParams(),
            node: { id: '1', y: 1, x: 1, height: 1, width: 1 },
            action: { startY: 53, startX: 53, endY: 28, endX: 28 }
        })
    ).toEqual({
        type: 'move',
        element: { id: '1', y: 5, x: 5, height: 30, width: 30 },
        node: { id: '1', y: 0, x: 0, height: 1, width: 1 }
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
            node: { id: '1', x: 1, y: 1, width: 2, height: 2 },
            action: { startX: 79, startY: 79, endX: 54, endY: 54 }
        })
    ).toEqual({
        type: 'resize',
        element: { id: '1', x: 30, y: 30, width: 35, height: 35 },
        node: { id: '1', x: 1, y: 1, width: 1, height: 1 }
    });
});

test('null if start point is out of node', () => {
    expect(
        dragNode({
            params: getParams(),
            node: { id: '1', x: 1, y: 1, width: 1, height: 1 },
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
            node: { id: '1', x: 1, y: 1, width: 1, height: 1 },
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
            node: { id: '1', x: 1, y: 1, width: 2, height: 2 },
            action: { startX: 76, startY: 76, endX: 90, endY: 90 }
        })
    ).toEqual({
        type: 'resize',
        element: { id: '1', x: 30, y: 30, width: 74, height: 74 },
        node: { id: '1', x: 1, y: 1, width: 3, height: 3 }
    });
});

test('resize node with min width from right and bottom', () => {
    expect(
        dragNode({
            params: getParams({
                minWidth: 2,
                minHeight: 2,
                resize: {
                    right: true,
                    bottom: true
                }
            }),
            node: { id: '1', x: 1, y: 1, width: 4, height: 4 },
            action: { startX: 146, startY: 146, endX: 50, endY: 50 }
        })
    ).toEqual({
        type: 'resize',
        element: { id: '1', x: 30, y: 30, width: 60, height: 60 },
        node: { id: '1', x: 1, y: 1, width: 2, height: 2 }
    });
});

test('resize node with min width from left and top', () => {
    expect(
        dragNode({
            params: getParams({
                minWidth: 2,
                minHeight: 2,
                resize: {
                    left: true,
                    top: true
                }
            }),
            node: { id: '1', x: 1, y: 1, width: 4, height: 4 },
            action: { startX: 34, startY: 34, endX: 150, endY: 150 }
        })
    ).toEqual({
        type: 'resize',
        element: { id: '1', x: 90, y: 90, width: 60, height: 60 },
        node: { id: '1', x: 3, y: 3, width: 2, height: 2 }
    });
});

test('resize node with max width from right and bottom', () => {
    expect(
        dragNode({
            params: getParams({
                maxWidth: 4,
                maxHeight: 4,
                resize: {
                    right: true,
                    bottom: true
                }
            }),
            node: { id: '1', x: 1, y: 1, width: 2, height: 2 },
            action: { startX: 86, startY: 86, endX: 200, endY: 200 }
        })
    ).toEqual({
        type: 'resize',
        element: { id: '1', x: 30, y: 30, width: 120, height: 120 },
        node: { id: '1', x: 1, y: 1, width: 4, height: 4 }
    });
});

test('resize node with max width from left and top', () => {
    expect(
        dragNode({
            params: getParams({
                maxWidth: 4,
                maxHeight: 4,
                resize: {
                    left: true,
                    top: true
                }
            }),
            node: { id: '1', x: 4, y: 4, width: 2, height: 2 },
            action: { startX: 124, startY: 124, endX: 20, endY: 20 }
        })
    ).toEqual({
        type: 'resize',
        element: { id: '1', x: 60, y: 60, width: 120, height: 120 },
        node: { id: '1', x: 2, y: 2, width: 4, height: 4 }
    });
});

test('resize from bottom to top issue #1', () => {
    expect(
        dragNode({
            params: {
                cellWidth: 108,
                cellHeight: 67,
                minWidth: 2,
                minHeight: 3,
                maxWidth: 6,
                maxHeight: 13,
                padding: 8,
                resize: {
                    right: true,
                    bottom: true
                }
            },
            node: { id: '1', x: 0, y: 3, width: 4, height: 8 },
            action: { startX: 197, startY: 725, endX: 197, endY: 721 }
        })
    ).toEqual({
        type: 'resize',
        element: { id: '1', x: 0, y: 201, height: 532, width: 432 },
        node: { id: '1', x: 0, y: 3, width: 4, height: 8 }
    });
});

test('move is constrained with zero', () => {
    expect(
        dragNode({
            params: getParams(),
            node: { id: '1', x: 1, y: 1, width: 2, height: 2 },
            action: { startX: 45, startY: 45, endX: -100, endY: -100 }
        })
    ).toEqual({
        type: 'move',
        element: { id: '1', x: 0, y: 0, width: 60, height: 60 },
        node: { id: '1', x: 0, y: 0, width: 2, height: 2 }
    });
});

test('move is constrained with containerWidth', () => {
    expect(
        dragNode({
            params: getParams({
                containerWidth: 4
            }),
            node: { id: '1', x: 1, y: 1, width: 2, height: 2 },
            action: { startX: 45, startY: 45, endX: 200, endY: 45 }
        })
    ).toEqual({
        type: 'move',
        element: { id: '1', x: 60, y: 30, width: 60, height: 60 },
        node: { id: '1', x: 2, y: 1, width: 2, height: 2 }
    });
});

test.only('resize is constrained with containerWidth and maxWidth', () => {
    expect(
        dragNode({
            params: getParams({
                containerWidth: 4,
                maxWidth: 6,
                resize: {
                    right: true
                }
            }),
            node: { id: '1', x: 1, y: 1, width: 2, height: 2 },
            action: { startX: 86, startY: 75, endX: 300, endY: 75 }
        })
    ).toEqual({
        type: 'resize',
        element: { id: '1', x: 30, y: 30, width: 90, height: 60 },
        node: { id: '1', x: 1, y: 1, width: 3, height: 2 }
    });
});

