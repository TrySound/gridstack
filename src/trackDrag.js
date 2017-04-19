const getMouse = (rect, event) => [event.clientX - rect.left, event.clientY - rect.top];

const trackDrag = ({
    container,
    mouseMoveOffset = 3,
    validateStartTarget = () => true,
    dispatch
}) => {
    const onMouseDown = downEvent => {
        const startRect = container.getBoundingClientRect();
        const [startX, startY] = getMouse(startRect, downEvent);
        const valid = validateStartTarget(downEvent.target);
        if (valid) {
            dispatch({
                type: 'start',
                x: startX,
                y: startY
            });
        }

        const onMouseMove = e => {
            const [endX, endY] = getMouse(startRect, e);
            if (mouseMoveOffset < Math.abs(endX - startX) || mouseMoveOffset < Math.abs(endY - startY)) {
                e.preventDefault();
                dispatch({
                    type: 'drag',
                    startX,
                    startY,
                    endX,
                    endY
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
                endY
            });
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        if (valid) {
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        }
    };

    container.addEventListener('mousedown', onMouseDown);

    return () => {
        container.removeEventListener('mousedown', onMouseDown);
    };
};

export default trackDrag;
