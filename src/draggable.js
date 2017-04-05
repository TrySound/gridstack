import { trackDrag } from './drag.js';

const checkResize = (rect, action, offset = 6) => {
    const double = offset * 2;
    const top = Math.abs(action.y) <= double;
    const right = Math.abs(rect.width - action.x) <= double;
    const bottom = Math.abs(rect.height - action.y) <= double;
    const left = Math.abs(action.x) <= double;
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
    element,
    getParams = () => ({}),
    getNode,
    dispatch = () => {}
}) => {
    let resize;
    return trackDrag(element, action => {
        const params = getParams();
        if (action.type === 'start') {
            resize = checkResize(element.getBoundingClientRect(), action, params.resizeOffset);
        }
        if (action.type === 'drag') {
            if (resize) {
                dispatch({
                    type: 'RESIZE_GHOST',
                    top: resize.top,
                    right: resize.right,
                    bottom: resize.bottom,
                    left: resize.left,
                    dx: action.dx,
                    dy: action.dy
                });
            } else {
                dispatch({
                    type: 'MOVE_GHOST',
                    dx: action.dx,
                    dy: action.dy,
                    className: action.className
                });
            }
        }
        if (action.type === 'end') {
            if (resize) {
                dispatch({
                    type: 'RESIZE',
                    top: resize.top,
                    right: resize.right,
                    bottom: resize.bottom,
                    left: resize.left,
                    dx: action.dx,
                    dy: action.dy
                });
            } else {
                dispatch({
                    type: 'MOVE',
                    dx: action.dx,
                    dy: action.dy,
                    className: action.className
                });
            }
        }
    });
};
