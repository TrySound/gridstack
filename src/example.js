import { getBottom, findNode } from './utils.js';
import { packNodes } from './engine.js';
import { makeDraggable } from './draggable.js';

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
                element.style.transform = `translate(${node.x * 60}px, ${node.y * 60}px)`;
                element.style.transition = `.1s`;
                element.style.width = `${node.width * 60}px`;
                element.style.height = `${node.height * 60}px`;
            }
        });
    });
    container.style.height = getBottom(state) * 60 + 'px';
};

const reduce = (nodes, updatingId) => {
    return packNodes({
        hoist: true,
        updatingId,
        nodes
    });
};

let state = [
    { id: 2, x: 2, y: 4, width: 3, height: 3, static: true },
    { id: 1, x: 4, y: 0, width: 3, height: 3 },
    { id: 3, x: 3, y: 1, width: 3, height: 3 }
];

const container = document.createElement('div');

container.style.userSelect = 'none';
container.style.position = 'relative';

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
    let lastState = state;
    makeDraggable({
        container,
        element,
        getNode: () => state.find(n => n.id === node.id),
        dispatch: action => {
            if (action.type === 'MOVE_GHOST' || action.type === 'MOVE') {
                lastState = state.map(n => {
                    if (n.id === node.id) {
                        return Object.assign({}, n, {
                            x: n.x + Math.floor(action.dx / 60),
                            y: n.y + Math.floor(action.dy / 60)
                        });
                    }
                    return n;
                });
                lastState = reduce(lastState, node.id);
                render(container, lastState);
            }
            if (action.type === 'RESIZE_GHOST' || action.type === 'RESIZE') {
                const dx = Math.floor(action.dx / 60);
                const dy = Math.floor(action.dy / 60);
                lastState = state.map(n => {
                    if (n.id === node.id) {
                        return Object.assign({}, n, {
                            x: n.x + (action.left ? dx : 0),
                            y: n.y + (action.top ? dy : 0),
                            width: n.width + (action.left && -dx || action.right && dx || 0),
                            height: n.height + (action.top && -dy || action.bottom && dy || 0)
                        });
                    }
                    return n;
                });
                lastState = reduce(lastState, node.id);
                render(container, lastState);
            }
            if (action.type === 'MOVE' || action.type === 'RESIZE') {
                state = lastState;
            }
        }
    });
};

document.body.appendChild(container);

state = reduce(state);

state.forEach(addNode);

render(container, state);
