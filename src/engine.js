import { orderBy, isInterceptedHorz, getRight, getBottom, lowerNode } from './utils.js';

/*
type Node = {
    id: string | number,
    x: number,
    y: number,
    width: number,
    height: number,
    static?: boolean
}
*/

const normalizeNodes = (nodes, maxWidth) => nodes.map(node => {
    const width = Math.min(Math.max(node.width, 1), maxWidth);
    return Object.assign({}, node, {
        x: Math.min(Math.max(0, node.x), maxWidth - width),
        y: Math.max(0, node.y),
        width,
        height: Math.max(node.height, 1)
    });
});

const sortNodes = function(nodes, maxWidth) {
    const width = maxWidth === Infinity ? getRight(nodes) : maxWidth;
    return orderBy(nodes, d => d.x + d.y * width);
};

const resolveNodes = (nodes, updatingId) => [
    ...nodes.filter(node => node.static && node.id !== updatingId),
    ...nodes.filter(node => node.id === updatingId),
    ...nodes.filter(node => !node.static && node.id !== updatingId)
].reduce((acc, node, index) => {
    if (node.static) {
        return [...acc, node];
    }
    const interceptedNodes = orderBy(acc.filter((n, i) => index !== i && isInterceptedHorz(node, n)), d => d.y);
    if (interceptedNodes.length) {
        const newNode = Object.assign({}, node, {
            y: lowerNode(interceptedNodes, node, node.y)
        });
        return [...acc, newNode];
    }
    return [...acc, node];
}, []);

const hoistNodes = nodes => nodes.reduce((acc, node, index) => {
    if (node.static) {
        return acc;
    }
    const vertNodes = acc.filter((n, i) => index !== i && isInterceptedHorz(n, node));
    const bottomDynamic = getBottom(vertNodes.filter(n => !n.static && n.y + n.height <= node.y));
    const bottom = lowerNode(vertNodes.filter(n => n.static), node, bottomDynamic);
    const newNode = Object.assign({}, node, {
        y: bottom
    });
    return [...acc.slice(0, index), newNode, ...acc.slice(index + 1)];
}, nodes);

export const packNodes = ({
    hoist = false,
    maxWidth = Infinity,
    updatingId = null,
    nodes
}) => {
    const sorted = sortNodes(nodes, maxWidth);
    const normalized = normalizeNodes(sorted, maxWidth);
    const resolved = resolveNodes(normalized, updatingId);
    const hoisted = hoist ? hoistNodes(resolved) : resolved;
    return hoisted;
};
