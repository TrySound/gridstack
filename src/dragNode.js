const resizeNode = (node, params, action, resize) => {
    const nodeX = node.x * params.cellWidth;
    const nodeWidth = node.width * params.cellWidth;
    const endX
        = resize.left
        ? Math.min(Math.max(action.startX - nodeX, action.endX), action.startX - params.cellWidth + nodeWidth)
        : resize.right
        ? Math.max(action.startX + params.cellWidth - nodeWidth, action.endX)
        : action.startX;
    const nodeY = node.y * params.cellHeight;
    const nodeHeight = node.height * params.cellHeight;
    const endY
        = resize.top
        ? Math.min(Math.max(action.startY - nodeY, action.endY), action.startY - params.cellHeight + nodeHeight)
        : resize.bottom
        ? Math.max(action.startY + params.cellHeight - nodeHeight, action.endY)
        : action.startY;

    const elementDx = endX - action.startX;
    const elementDy = endY - action.startY;
    const nodeDx = Math.floor(endX / params.cellWidth) - Math.floor(action.startX / params.cellWidth);
    const nodeDy = Math.floor(endY / params.cellHeight) - Math.floor(action.startY / params.cellHeight);
    return {
        type: 'resize',
        element: {
            x: nodeX + (resize.left ? elementDx : 0),
            y: nodeY + (resize.top ? elementDy : 0),
            width: nodeWidth + (resize.left ? -elementDx : resize.right ? elementDx : 0),
            height: nodeHeight + (resize.top ? -elementDy : resize.bottom ? elementDy : 0)
        },
        node: Object.assign({}, node, {
            x: node.x + (resize.left ? nodeDx : 0),
            y: node.y + (resize.top ? nodeDy : 0),
            width: node.width + (resize.left ? -nodeDx : resize.right ? nodeDx : 0),
            height: node.height + (resize.top ? -nodeDy : resize.bottom ? nodeDy : 0)
        })
    };
};

const moveNode = (node, params, action) => {
    const elementDx = action.endX - action.startX;
    const elementDy = action.endY - action.startY;
    const dx = Math.floor(action.endX / params.cellWidth) - Math.floor(action.startX / params.cellWidth);
    const dy = Math.floor(action.endY / params.cellHeight) - Math.floor(action.startY / params.cellHeight);
    return {
        type: 'move',
        element: {
            x: node.x * params.cellWidth + elementDx,
            y: node.y * params.cellHeight + elementDy,
            width: node.width * params.cellWidth,
            height: node.height * params.cellHeight
        },
        node: Object.assign({}, node, {
            x: node.x + dx,
            y: node.y + dy
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
