import { orderBy, isInterceptedHorz } from './utils.js';

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

const getRight = nodes => nodes.reduce((acc, node) => Math.max(acc, node.x + node.width), 0);

const normalizeNode = (node, maxWidth) => {
    const width = Math.min(Math.max(node.width, 1), maxWidth);
    return Object.assign({}, node, {
        x: Math.min(Math.max(0, node.x), maxWidth - width),
        y: Math.max(0, node.y),
        width,
        height: Math.max(node.height, 1)
    });
};

const sortNodes = function(nodes, dir, maxWidth) {
    const width = maxWidth === Infinity ? getRight(nodes) : maxWidth;
    return orderBy(nodes, d => dir * (d.x + d.y * width));
};

const resolveNodes = nodes => [
    ...nodes.filter(node => node.static),
    ...nodes.filter(node => !node.static)
].reduce((acc, node, index) => {
    if (node.static) {
        return [...acc, node];
    }
    const interceptedNodes = orderBy(acc.filter((n, i) => index !== i && isInterceptedHorz(node, n)), d => d.y);
    if (interceptedNodes.length) {
        const newNode = Object.assign({}, node, {
            y: interceptedNodes.reduce((acc2, n) => {
                if (!(acc2 + node.height <= n.y || n.y + n.height <= acc2)) {
                    return n.y + n.height;
                }
                return acc2;
            }, node.y)
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
    const bottomDynamic = vertNodes
        .filter(n => !n.static && n.y + n.height <= node.y)
        .reduce((acc, n) => n.y + n.height, 0);
    const bottom = vertNodes
        .filter(n => n.static)
        .reduce((acc, n) => n.y < acc + node.height && acc < n.y + n.height ? n.y + n.height : acc, bottomDynamic);
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
    const sorted = sortNodes(nodes, 1, maxWidth);
    const normalized = sorted.map(node => normalizeNode(node, maxWidth));
    const updatingIndex = normalized.findIndex(node => node.id === updatingId);
    const resolvedNodes = resolveNodes(normalized);
    if (hoist) {
        return hoistNodes(resolvedNodes, updatingIndex);
    }
    return resolvedNodes;
};
/*
export const addNode = ({
    hoist = false,
    maxWidth = Infinity,
    nodes,
    target
}) => {
    return nodes;
};

export const updateNode = ({
    hoist = false,
    maxWidth = Infinity,
    nodes,
    id,
    target
}) => {
    return nodes;
};

export const removeNode = ({
    hoist = false,
    maxWidth = Infinity,
    nodes,
    id
}) => {
    return nodes;
};
*/
