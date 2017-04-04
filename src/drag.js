const getMouse = (element, event) => {
    const rect = element.getBoundingClientRect();
    return [event.clientX - rect.left, event.clientY - rect.top];
};

export const trackDrag = (element, dispatch) => {
    const onMouseDown = downEvent => {
        const [startX, startY] = getMouse(element, downEvent);

        dispatch({
            type: 'start',
            x: startX,
            y: startY,
            className: downEvent.target.className
        });

        const onMouseMove = e => {
            const [dragX, dragY] = getMouse(element, e);
            dispatch({
                type: 'drag',
                x: dragX,
                y: dragY,
                dx: dragX - startX,
                dy: dragY - startY,
                className: downEvent.target.className
            });
        };

        const onMouseUp = e => {
            const [endX, endY] = getMouse(element, e);
            dispatch({
                type: 'end',
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
