const getMouse = (element, event) => {
    const rect = element.getBoundingClientRect();
    return [event.clientX - rect.left, event.clientY - rect.top];
};

const trackDrag = ({
    container,
    mouseMoveOffset = 3,
    dispatch
}) => {
    const onMouseDown = downEvent => {
        const [startX, startY] = getMouse(container, downEvent);
        dispatch({
            type: 'start',
            x: startX,
            y: startY
        }, downEvent.target);

        const onMouseMove = e => {
            const [endX, endY] = getMouse(container, e);
            if (mouseMoveOffset < Math.abs(endX - startX) || mouseMoveOffset < Math.abs(endY - startY)) {
                e.preventDefault();
                dispatch({
                    type: 'drag',
                    startX,
                    startY,
                    endX,
                    endY
                }, downEvent.target);
            }
        };

        const onMouseUp = e => {
            const [endX, endY] = getMouse(container, e);
            dispatch({
                type: 'end',
                startX,
                startY,
                endX,
                endY
            }, downEvent.target);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    container.addEventListener('mousedown', onMouseDown);

    return () => {
        container.removeEventListener('mousedown', onMouseDown);
    };
};

export default trackDrag;
