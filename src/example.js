import { packNodes, trackDrag, dragNode, getBottom, findNode } from './index.js';

const params = {
    cellWidth: 60,
    cellHeight: 60,
    minWidth: 3,
    maxWidth: 6,
    minHeight: 2,
    maxHeight: 4,
    containerWidth: 12,
    resize: {
        top: true,
        right: true,
        bottom: true,
        left: true
    }
};

const render = (container, state) => {
    state.forEach(node => {
        Array.from(container.children).forEach(element => {
            if (element.dataset.id === String(node.id)) {
                element.className = 'class';
                element.style.position = 'absolute';
                element.style.border = '1px solid #000';
                element.style.boxSizing = 'border-box';
                element.style.left = 0;
                element.style.top = 0;
                element.style.transform = `translate(${node.x * params.cellWidth}px, ${node.y * params.cellHeight}px)`;
                element.style.transition = `.1s`;
                element.style.width = `${node.width * params.cellWidth}px`;
                element.style.height = `${node.height * params.cellHeight}px`;
            }
        });
    });
    container.style.height = getBottom(state) * params.cellHeight + 'px';
};

const reduce = (nodes, updatingId) => {
    return packNodes({
        containerWidth: params.containerWidth,
        updatingId,
        nodes
    });
};

let state = [
    { id: 1, x: 2, y: 4, width: 3, height: 3, static: true },
    { id: 2, x: 8, y: 7, width: 3, height: 3, static: true },
    { id: 3, x: 4, y: 0, width: 3, height: 3 },
    { id: 4, x: 9, y: 0, width: 3, height: 3 },
    { id: 5, x: 1, y: 0, width: 3, height: 3 },
    { id: 6, x: 3, y: 1, width: 3, height: 3 }
];

const container = document.createElement('div');

container.style.position = 'relative';

let lastState = state;

trackDrag({
    container,
    dispatch: action => {
        if (action.type === 'drag') {
            const node = findNode(
                state,
                Math.floor(action.startX / params.cellWidth),
                Math.floor(action.startY / params.cellHeight)
            );
            if (node) {
                const drag = dragNode({ node, params, action });
                lastState = lastState.map(n => n.id === node.id ? drag.node : n);
                lastState = reduce(lastState, node.id);
                render(container, lastState);
            }
        }
        if (action.type === 'end') {
            state = lastState;
        }
    }
});

const addNode = node => {
    const element = document.createElement('div');
    element.dataset.id = node.id;
    const child = document.createElement('div');
    child.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        bottom: 10px;
        left: 10px;
        background: #eee;
        pointer-events: none;
    `;
    child.textContent = `${node.id} ${node.static ? 'static' : 'dynamic'}`;
    element.appendChild(child);
    container.appendChild(element);
};

document.body.style.margin = '40px';
document.body.appendChild(container);

state = reduce(state);

state.forEach(addNode);

render(container, state);
