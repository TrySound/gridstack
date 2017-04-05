/* eslint-env jest */
import { dragNode } from './drag.js';

const params = {
    cellWidth: 30,
    cellHeight: 30,
    resizeOffset: 6
};

test('move node from center', () => {
    expect(
        dragNode({
            params,
            node: {
                x: 2,
                y: 2,
                width: 3,
                height: 3
            },
            start: {
                x: 75,
                y: 75
            },
            end: {
                x: 125,
                y: 125
            }
        })
    ).toEqual({
        type: 'move',
        element: {
            x: 110,
            y: 110,
            width: 90,
            height: 90
        },
        node: {
            x: 4,
            y: 4,
            width: 3,
            height: 3
        }
    });
});

test('resize node from right', () => {
    expect(
        dragNode({
            params,
            node: {
                x: 2,
                y: 2,
                width: 3,
                height: 3
            },
            start: {
                x: 146,
                y: 135
            },
            end: {
                x: 160,
                y: 150
            }
        })
    ).toEqual({
        type: 'resize',
        element: {
            x: 60,
            y: 60,
            width: 104,
            height: 90
        },
        node: {
            x: 2,
            y: 2,
            width: 4,
            height: 3
        }
    });
});

test('resize node from left', () => {
    expect(
        dragNode({
            params,
            node: {
                x: 2,
                y: 2,
                width: 3,
                height: 3
            },
            start: {
                x: 64,
                y: 135
            },
            end: {
                x: 50,
                y: 150
            }
        })
    ).toEqual({
        type: 'resize',
        element: {
            x: 46,
            y: 60,
            width: 104,
            height: 90
        },
        node: {
            x: 1,
            y: 2,
            width: 4,
            height: 3
        }
    });
});

test('resize node from left to negative', () => {
    expect(
        dragNode({
            params,
            node: {
                x: 2,
                y: 2,
                width: 3,
                height: 3
            },
            start: {
                x: 64,
                y: 135
            },
            end: {
                x: -50,
                y: 150
            }
        })
    ).toEqual({
        type: 'resize',
        element: {
            x: 0,
            y: 60,
            width: 150,
            height: 90
        },
        node: {
            x: 0,
            y: 2,
            width: 5,
            height: 3
        }
    });
});
