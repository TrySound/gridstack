const orderPair = (a, b) => a < b && -1 || a > b && 1 || 0;

export const orderBy = (array, get) => array.slice().sort((a, b) => orderPair(get(a), get(b)));

const isInterceptedVert = (a, b) => b.y < a.y + a.height && a.y < b.y + b.height;

export const isInterceptedHorz = (a, b) => b.x < a.x + a.width && a.x < b.x + b.width;

export const isIntercepted = (a, b) => isInterceptedHorz(a, b) && isInterceptedVert(a, b);

export const getRight = nodes => nodes.reduce((acc, node) => Math.max(acc, node.x + node.width), 0);

export const getBottom = nodes => nodes.reduce((acc, node) => Math.max(acc, node.y + node.height), 0);

export const lowerNode = (nodes, node, start) =>
    nodes.reduce((acc, n) => n.y < acc + node.height && acc < n.y + n.height ? n.y + n.height : acc, start);

const hasNodePoint = (node, x, y) => isIntercepted(node, { x, y, width: 1, height: 1 });

export const findNode = (nodes, x, y) => nodes.reduce((acc, node) => hasNodePoint(node, x, y) ? node : acc, null);
