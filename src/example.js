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
    let lastState;
    let prevX;
    let prevY;
    let prevWidth;
    let prevHeight;
    makeDraggable({
        container,
        element,
        on: (name, event) => {
            if (name === 'start') {
                lastState = state;
            }
            if (name === 'drag') {
                const x = Math.floor(event.x / 60);
                const y = Math.floor(event.y / 60);
                if (x !== prevX || y !== prevY) {
                    prevX = x;
                    prevY = y;
                    lastState = state.map(n => n.id === node.id ? Object.assign({}, n, { x, y }) : n);
                    console.log(JSON.stringify(lastState));
                    lastState = reduce(lastState, node.id);
                    render(container, lastState);
                }
            }
            if (name === 'resize') {
                const lastNode = state.find(n => n.id === node.id);
                const width = lastNode.width + Math.floor(event.dx / 60);
                const height = lastNode.height + Math.floor(event.dy / 60);
                console.log(width, height);
                if (prevWidth !== width || prevHeight !== height) {
                    prevWidth = width;
                    prevHeight = height;
                    lastState = state.map(n => n.id === node.id ? Object.assign({}, n, { width, height }) : n);
                    console.log(JSON.stringify(lastState));
                    lastState = reduce(lastState, node.id);
                    render(container, lastState);
                }
            }
            if (name === 'end') {
                state = lastState;
            }
        }
    });
};

document.body.appendChild(container);

state = reduce(state);

state.forEach(addNode);

render(container, state);
