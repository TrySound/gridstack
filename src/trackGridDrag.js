import { getBottom, findNode } from './utils.js';
import { trackDrag, dragNode } from './drag.js';

const trackGridDrag = (container, {
    cellWidth,
    cellHeight,
    resizeSize,
    dispatch,
    initialState
}) => {
    let state = initialState;
    const setState = receivedState => {
        state = receivedState;
    };
    const destroy = trackDrag(container, action => {
        if (action.type === 'start') {

        }

        if (action.type === 'drag') {
            const node = findNode(state, Math.floor(action.startX / params.cellWidth), Math.floor(action.startY / params.cellHeight));
            if (node) {
                const drag = dragNode({
                    node,
                    params,
                    start: {
                        x: action.startX,
                        y: action.startY
                    },
                    end: {
                        x: action.x,
                        y: action.y
                    },
                });
                lastState = lastState.map(n => n.id === node.id ? drag.node : n);
                lastState = reduce(lastState, node.id);
                render(container, lastState);
            }
        }
        if (action.type === 'end') {
            state = lastState;
        }
    });

    return {
        setState,
        destroy
    };
};

export default trackGridDrag;
