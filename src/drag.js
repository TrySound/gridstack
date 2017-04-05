const getMouse = (rect, event) => [event.clientX - rect.left, event.clientY - rect.top];;

export const trackDrag = (element, dispatch) => {
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
            dispatch({
                type: 'drag',
                startX,
                startY,
                x: dragX,
                y: dragY,
                dx: dragX - startX,
                dy: dragY - startY,
                className: downEvent.target.className
            });
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

export const dragNode = ({ params, node, start, end }) => {
    const rect = {
        x: node.x * params.cellWidth,
        y: node.y * params.cellHeight,
        width: node.width * params.cellWidth,
        height: node.height * params.cellHeight
    };
    const endX = Math.max(start.x - rect.x, end.x);
    const endY = Math.max(start.y - rect.y, end.y);
    const elementDx = endX - start.x;
    const elementDy = endY - start.y;
    const dx = Math.floor(endX / params.cellWidth) - Math.floor(start.x / params.cellWidth);
    const dy = Math.floor(endY / params.cellHeight) - Math.floor(start.y / params.cellHeight);
    const resize = checkResize(rect, start, params.resizeOffset);
    if (resize) {
        return {
            type: 'resize',
            element: {
                x: node.x * params.cellWidth + (resize.l ? elementDx : 0),
                y: node.y * params.cellHeight + (resize.t ? elementDy : 0),
                width: node.width * params.cellWidth + (resize.l && -(elementDx) || resize.r && (elementDx) || 0),
                height: node.height * params.cellHeight + (resize.t && -(elementDy) || resize.b && (elementDy) || 0)
            },
            node: Object.assign({}, node, {
                x: node.x + (resize.l ? dx : 0),
                y: node.y + (resize.t ? dy : 0),
                width: node.width + (resize.l && -dx || resize.r && dx || 0),
                height: node.height + (resize.t && -dy || resize.b && dy || 0)
            })
        };
    }

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
}
