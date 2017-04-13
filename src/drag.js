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
            const [dragX, dragY] = getMouse(startRect, e);
            const dx = dragX - startX;
            const dy = dragY - startY;
            if (offset < Math.abs(dx) || offset < Math.abs(dy)) {
                e.preventDefault();
                dispatch({
                    type: 'drag',
                    startX,
                    startY,
                    x: dragX,
                    y: dragY,
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
                x: endX,
                y: endY,
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
    const double = offset * 2;
    const t = Math.abs(rect.y - point.y) <= double;
    const r = Math.abs(rect.x + rect.width - point.x) <= double;
    const b = Math.abs(rect.y + rect.height - point.y) <= double;
    const l = Math.abs(rect.x - point.x) <= double;
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

const resizeNode = (params, node, start, end, resize) => {
    const nodeX = node.x * params.cellWidth;
    const nodeWidth = node.width * params.cellWidth;
    const endX
        = resize.l
        ? Math.min(Math.max(start.x - nodeX, end.x), start.x - params.cellWidth + nodeWidth)
        : resize.r
        ? Math.max(start.x + params.cellWidth - nodeWidth, end.x)
        : start.x;
    const nodeY = node.y * params.cellHeight;
    const nodeHeight = node.height * params.cellHeight;
    const endY
        = resize.t
        ? Math.min(Math.max(start.y - nodeY, end.y), start.y - params.cellHeight + nodeHeight)
        : resize.b
        ? Math.max(start.y + params.cellHeight - nodeHeight, end.y)
        : start.y;

    const elementDx = endX - start.x;
    const elementDy = endY - start.y;
    const nodeDx = Math.floor(endX / params.cellWidth) - Math.floor(start.x / params.cellWidth);
    const nodeDy = Math.floor(endY / params.cellHeight) - Math.floor(start.y / params.cellHeight);
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

const moveNode = (params, node, start, end) => {
    const elementDx = end.x - start.x;
    const elementDy = end.y - start.y;
    const dx = Math.floor(end.x / params.cellWidth) - Math.floor(start.x / params.cellWidth);
    const dy = Math.floor(end.y / params.cellHeight) - Math.floor(start.y / params.cellHeight);
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

export const dragNode = ({ params, node, start, end }) => {
    const rect = {
        x: node.x * params.cellWidth,
        y: node.y * params.cellHeight,
        width: node.width * params.cellWidth,
        height: node.height * params.cellHeight
    };
    const resize = checkResize(rect, start, params.resizeSize);
    return resize
        ? resizeNode(params, node, start, end, resize)
        : moveNode(params, node, start, end);
};
