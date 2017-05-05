const wrap = (min, value, max) => Math.min(Math.max(min, value), max);

const applyDefaults = ({ minWidth = 1, minHeight = 1, maxWidth = Infinity, maxHeight = Infinity, containerWidth = Infinity }) => {
    return { minWidth, minHeight, maxWidth, maxHeight, containerWidth };
};

const resizeNode = (node, params, action, resize) => {
    const { cellWidth, cellHeight } = params;
    const { minWidth, minHeight, maxWidth, maxHeight, containerWidth } = applyDefaults(params);

    const minX = maxWidth === Infinity ? 0 : node.x + node.width - maxWidth;
    const minY = maxHeight === Infinity ? 0 : node.y + node.height - maxHeight;
    const maxX = Math.min(node.x + node.width - minWidth, containerWidth - node.x);
    const maxY = node.y + node.height - minHeight;

    const dirX = (resize.left ? -1 : resize.right ? 1 : 0);
    const dirY = (resize.top ? -1 : resize.bottom ? 1 : 0);

    const elementX = node.x * cellWidth;
    const elementWidth = node.width * cellWidth;
    const elementY = node.y * cellHeight;
    const elementHeight = node.height * cellHeight;

    const endX
        = resize.left
        ? Math.max(action.startX - elementX, action.endX)
        : resize.right
        ? action.endX
        : action.startX;
    const endY
        = resize.top
        ? Math.max(action.startY - elementY, action.endY)
        : resize.bottom
        ? action.endY
        : action.startY;

    const elementDx = endX - action.startX;
    const elementDy = endY - action.startY;
    const nodeDx = Math.floor(endX / cellWidth) - Math.floor(action.startX / cellWidth);
    const nodeDy = Math.floor(endY / cellHeight) - Math.floor(action.startY / cellHeight);

    return {
        type: 'resize',
        element: {
            id: node.id,
            x: wrap(minX * cellWidth, elementX + (resize.left ? elementDx : 0), maxX * cellWidth),
            y: wrap(minY * cellHeight, elementY + (resize.top ? elementDy : 0), maxY * cellHeight),
            width: wrap(minWidth * cellWidth, elementWidth + dirX * elementDx, maxWidth * cellWidth),
            height: wrap(minHeight * cellHeight, elementHeight + dirY * elementDy, maxHeight * cellHeight)
        },
        node: Object.assign({}, node, {
            x: wrap(minX, node.x + (resize.left ? nodeDx : 0), maxX),
            y: wrap(minY, node.y + (resize.top ? nodeDy : 0), maxY),
            width: wrap(minWidth, node.width + dirX * nodeDx, maxWidth),
            height: wrap(minHeight, node.height + dirY * nodeDy, maxHeight)
        })
    };
};

const moveNode = (node, params, action) => {
    const { cellWidth, cellHeight } = params;
    const { containerWidth } = applyDefaults(params);
    const maxX = containerWidth - node.width;
    const elementDx = action.endX - action.startX;
    const elementDy = action.endY - action.startY;
    const dx = Math.floor(action.endX / cellWidth) - Math.floor(action.startX / cellWidth);
    const dy = Math.floor(action.endY / cellHeight) - Math.floor(action.startY / cellHeight);
    return {
        type: 'move',
        element: {
            id: node.id,
            x: wrap(0, node.x * cellWidth + elementDx, maxX * cellWidth),
            y: wrap(0, node.y * cellHeight + elementDy, Infinity),
            width: node.width * cellWidth,
            height: node.height * params.cellHeight
        },
        node: Object.assign({}, node, {
            x: wrap(0, node.x + dx, maxX),
            y: wrap(0, node.y + dy, Infinity)
        })
    };
};

const dragNode = ({ node, params, action }) => {
    const padding = params.padding || 0;
    const resize = Object.assign({ width: 6 }, params.resize);
    const nodeStartX = node.x * params.cellWidth + padding;
    const nodeStartY = node.y * params.cellHeight + padding;
    const nodeEndX = (node.x + node.width) * params.cellWidth - padding;
    const nodeEndY = (node.y + node.height) * params.cellHeight - padding;
    if (action.startX < nodeStartX || nodeEndX < action.startX ||
        action.startY < nodeStartY || nodeEndY < action.startY
    ) {
        return null;
    }
    const top = resize.top && Math.abs(nodeStartY - action.startY) <= resize.width;
    const right = resize.right && Math.abs(nodeEndX - action.startX) <= resize.width;
    const bottom = resize.bottom && Math.abs(nodeEndY - action.startY) <= resize.width;
    const left = resize.left && Math.abs(nodeStartX - action.startX) <= resize.width;

    if (top || right || bottom || left) {
        return resizeNode(node, params, action, { top, right, bottom, left });
    }
    return moveNode(node, params, action);
};

export default dragNode;
