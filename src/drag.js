const getMouse = (rect, event) => [event.clientX - rect.left, event.clientY - rect.top];

export const trackDrag = (element, dispatch, offset = 3) => {
    const onMouseDown = downEvent => {
        const startRect = element.getBoundingClientRect();
        const [startX, startY] = getMouse(startRect, downEvent);

        dispatch({
            type: 'start',
            x: startX,
            y: startY,
            className: downEvent.target.className
        });

        const onMouseMove = e => {
            const [endX, endY] = getMouse(startRect, e);
            const dx = endX - startX;
            const dy = endY - startY;
            if (offset < Math.abs(dx) || offset < Math.abs(dy)) {
                e.preventDefault();
                dispatch({
                    type: 'drag',
                    startX,
                    startY,
                    endX,
                    endY,
                    dx,
                    dy,
                    className: downEvent.target.className
                });
            }
        };

        const onMouseUp = e => {
            const [endX, endY] = getMouse(startRect, e);
            dispatch({
                type: 'end',
                startX,
                startY,
                endX,
                endY,
                dx: endX - startX,
                dy: endY - startY,
                className: downEvent.target.className
            });
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };
    element.addEventListener('mousedown', onMouseDown);
    return () => element.removeEventListener('mousedown', onMouseDown);
};

const checkResize = (rect, point, offset = 6) => {
    const t = Math.abs(rect.y - point.y) <= offset;
    const r = Math.abs(rect.x + rect.width - point.x) <= offset;
    const b = Math.abs(rect.y + rect.height - point.y) <= offset;
    const l = Math.abs(rect.x - point.x) <= offset;
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

export const dragNode = ({ node, params, action }) => {
    const rect = {
        x: node.x * params.cellWidth,
        y: node.y * params.cellHeight,
        width: node.width * params.cellWidth,
        height: node.height * params.cellHeight
    };
    const resize = checkResize(rect, { x: action.startX, y: action.startY }, params.resizeSize);
    return resize
        ? resizeNode(node, params, action, resize)
        : moveNode(node, params, action);
};
