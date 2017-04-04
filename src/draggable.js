import { getMouse} from './drag.js';

const checkResize = (rect, e, offset = 12) => {
    const top = Math.abs(rect.top - e.clientY) <= offset;
    const right = Math.abs(rect.left + rect.width - e.clientX) <= offset;
    const bottom = Math.abs(rect.top + rect.height - e.clientY) <= offset;
    const left = Math.abs(rect.left - e.clientX) <= offset;
    if (top || right || bottom || left) {
        return {
            top,
            right,
            bottom,
            left
        };
    }
    return null;
};

export const makeDraggable = ({
    container = document.body,
    element,
    on = () => {}
}) => {
    element.addEventListener('mousedown', downEvent => {
        const containerRect = container.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const elementX = elementRect.left - containerRect.left;
        const elementY = elementRect.top - containerRect.top;
        const resize = checkResize(elementRect, downEvent);
        const [startX, startY] = getMouse(container, downEvent);
        on('start');

        const onMouseMove = e => {
            const [moveX, moveY] = getMouse(container, e);
            const dx = Math.max(0, moveX) - startX;
            const dy = Math.max(0, moveY) - startY;
            console.log(dx, dy);
            if (resize) {
                on('resize', Object.assign({}, resize, {
                    x: elementX + dx,
                    y: elementY + dy,
                    dx,
                    dy
                }));
            } else {
                on('drag', {
                    x: elementX + dx,
                    y: elementY + dy,
                    dx,
                    dy
                });
            }
        };

        const onMouseUp = () => {
            on('end');
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
};
