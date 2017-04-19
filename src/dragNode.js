const checkResize = (node, params, action) => {
    const offset = params.resizeSize || 6;
    const rect = {
        x: node.x * params.cellWidth,
        y: node.y * params.cellHeight,
        width: node.width * params.cellWidth,
        height: node.height * params.cellHeight
    };
    const t = Math.abs(rect.y - action.startY) <= offset;
    const r = Math.abs(rect.x + rect.width - action.startX) <= offset;
    const b = Math.abs(rect.y + rect.height - action.startY) <= offset;
    const l = Math.abs(rect.x - action.startX) <= offset;
    if (t || r || b || l) {
        return {
            t,
            r,
            b,
            l
        };
    }
    return null;
};

const resizeNode = (node, params, action, resize) => {
    const nodeX = node.x * params.cellWidth;
    const nodeWidth = node.width * params.cellWidth;
    const endX
        = resize.l
        ? Math.min(Math.max(action.startX - nodeX, action.endX), action.startX - params.cellWidth + nodeWidth)
        : resize.r
        ? Math.max(action.startX + params.cellWidth - nodeWidth, action.endX)
        : action.startX;
    const nodeY = node.y * params.cellHeight;
    const nodeHeight = node.height * params.cellHeight;
    const endY
        = resize.t
        ? Math.min(Math.max(action.startY - nodeY, action.endY), action.startY - params.cellHeight + nodeHeight)
        : resize.b
        ? Math.max(action.startY + params.cellHeight - nodeHeight, action.endY)
        : action.startY;

    const elementDx = endX - action.startX;
    const elementDy = endY - action.startY;
    const nodeDx = Math.floor(endX / params.cellWidth) - Math.floor(action.startX / params.cellWidth);
    const nodeDy = Math.floor(endY / params.cellHeight) - Math.floor(action.startY / params.cellHeight);
    return {
        type: 'resize',
        element: {
            x: nodeX + (resize.l ? elementDx : 0),
            y: nodeY + (resize.t ? elementDy : 0),
            width: nodeWidth + (resize.l ? -elementDx : resize.r ? elementDx : 0),
            height: nodeHeight + (resize.t ? -elementDy : resize.b ? elementDy : 0)
        },
        node: Object.assign({}, node, {
            x: node.x + (resize.l ? nodeDx : 0),
            y: node.y + (resize.t ? nodeDy : 0),
            width: node.width + (resize.l ? -nodeDx : resize.r ? nodeDx : 0),
            height: node.height + (resize.t ? -nodeDy : resize.b ? nodeDy : 0)
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
    const resize = checkResize(node, params, action);
    return resize
        ? resizeNode(node, params, action, resize)
        : moveNode(node, params, action);
};

export default dragNode;
