import { packNodes } from './engine.js';

const reduce = (nodes, updatingId) => {
    return packNodes({
        // hoist: true,
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

const applyNode = (element, node) => {
    element.style.position = 'absolute';
    element.style.border = '1px solid #000';
    element.style.boxSizing = 'border-box';
    element.style.left = 0;
    element.style.top = 0;
    element.style.transform = `translate(${node.x * 60}px, ${node.y * 60}px)`;
    element.style.transition = `.1s`;
    element.style.width = `${node.width * 60}px`;
    element.style.height = `${node.height * 60}px`;
};


const updateNode = node => {
    Array.from(container.children).forEach(element => {
        if (element.dataset.id === String(node.id)) {
            applyNode(element, node);
        }
    });
};

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
    applyNode(element, node);
    container.appendChild(element);
    element.addEventListener('mousedown', downEvent => {
        const target = downEvent.currentTarget;
        const id = Number(target.dataset.id);
        const { left: containerX, top: containerY } = container.getBoundingClientRect();
        const { left: elementX, top: elementY } = target.getBoundingClientRect();
        const nodeX = elementX - containerX;
        const nodeY = elementY - containerY;

        const startX = downEvent.clientX;
        const startY = downEvent.clientY;

        let { x: prevX, y: prevY } = state.find(n => n.id === id);
        let lastState = state;

        const onMouseMove = e => {
            const x = Math.floor((nodeX + e.clientX - startX) / 60);
            const y = Math.floor((nodeY + e.clientY - startY) / 60);
            if (x !== prevX || y !== prevY) {
                prevX = x;
                prevY = y;
                lastState = state.map(n => n.id === id ? Object.assign({}, n, { x, y }) : n);
                console.log(JSON.stringify(lastState));
                lastState = reduce(lastState, id);
                lastState.forEach(updateNode);
            }
        };

        const onMouseUp = () => {
            state = lastState;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
};

document.body.appendChild(container);

state = reduce(state);

state.forEach(addNode);
