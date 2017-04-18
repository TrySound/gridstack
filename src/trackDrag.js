const getMouse = (rect, event) => [event.clientX - rect.left, event.clientY - rect.top];

const trackDrag = (element, dispatch, offset = 3) => {
    const onMouseDown = downEvent => {
        const startRect = element.getBoundingClientRect();
        const [startX, startY] = getMouse(startRect, downEvent);
        const source = downEvent.target;

        dispatch(source, {
            type: 'start',
            x: startX,
            y: startY
        });

        const onMouseMove = e => {
            const [endX, endY] = getMouse(startRect, e);
            const dx = endX - startX;
            const dy = endY - startY;
            if (offset < Math.abs(dx) || offset < Math.abs(dy)) {
                e.preventDefault();
                dispatch(source, {
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
            dispatch(source, {
                type: 'end',
                startX,
                startY,
                endX,
                endY
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

export default trackDrag;
