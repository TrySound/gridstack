/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const orderPair = (a, b) => a < b && -1 || a > b && 1 || 0;

const orderBy = (array, get) => array.slice().sort((a, b) => orderPair(get(a), get(b)));
/* harmony export (immutable) */ __webpack_exports__["d"] = orderBy;


const isInterceptedVert = (a, b) => b.y < a.y + a.height && a.y < b.y + b.height;

const isInterceptedHorz = (a, b) => b.x < a.x + a.width && a.x < b.x + b.width;
/* harmony export (immutable) */ __webpack_exports__["e"] = isInterceptedHorz;


const isIntercepted = (a, b) => isInterceptedHorz(a, b) && isInterceptedVert(a, b);
/* unused harmony export isIntercepted */


const getRight = nodes => nodes.reduce((acc, node) => Math.max(acc, node.x + node.width), 0);
/* harmony export (immutable) */ __webpack_exports__["c"] = getRight;


const getBottom = nodes => nodes.reduce((acc, node) => Math.max(acc, node.y + node.height), 0);
/* harmony export (immutable) */ __webpack_exports__["a"] = getBottom;


const lowerNode = (nodes, node, start) =>
    nodes.reduce((acc, n) => n.y < acc + node.height && acc < n.y + n.height ? n.y + n.height : acc, start);
/* harmony export (immutable) */ __webpack_exports__["f"] = lowerNode;


const hasNodePoint = (node, x, y) => isIntercepted(node, { x, y, width: 1, height: 1 });

const findNode = (nodes, x, y) => nodes.reduce((acc, node) => hasNodePoint(node, x, y) ? node : acc, null);
/* harmony export (immutable) */ __webpack_exports__["b"] = findNode;



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const getMouse = (rect, event) => [event.clientX - rect.left, event.clientY - rect.top];

const trackDrag = (element, dispatch) => {
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
/* harmony export (immutable) */ __webpack_exports__["a"] = trackDrag;


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

const dragNode = ({ params, node, start, end }) => {
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
};
/* harmony export (immutable) */ __webpack_exports__["b"] = dragNode;



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_js__ = __webpack_require__(0);


/*
type Node = {
    id: string | number,
    x: number,
    y: number,
    width: number,
    height: number,
    static?: boolean
}
*/

const normalizeNodes = (nodes, maxWidth) => nodes.map(node => {
    const width = Math.min(Math.max(node.width, 1), maxWidth);
    return Object.assign({}, node, {
        x: Math.min(Math.max(0, node.x), maxWidth - width),
        y: Math.max(0, node.y),
        width,
        height: Math.max(node.height, 1)
    });
});

const sortNodes = function(nodes, maxWidth) {
    const width = maxWidth === Infinity ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_js__["c" /* getRight */])(nodes) : maxWidth;
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_js__["d" /* orderBy */])(nodes, d => d.x + d.y * width);
};

const resolveNodes = (nodes, updatingId) => [
    ...nodes.filter(node => node.static && node.id !== updatingId),
    ...nodes.filter(node => node.id === updatingId),
    ...nodes.filter(node => !node.static && node.id !== updatingId)
].reduce((acc, node, index) => {
    if (node.static) {
        return [...acc, node];
    }
    const interceptedNodes = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_js__["d" /* orderBy */])(acc.filter((n, i) => index !== i && __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_js__["e" /* isInterceptedHorz */])(node, n)), d => d.y);
    if (interceptedNodes.length) {
        const newNode = Object.assign({}, node, {
            y: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_js__["f" /* lowerNode */])(interceptedNodes, node, node.y)
        });
        return [...acc, newNode];
    }
    return [...acc, node];
}, []);

const hoistNodes = nodes => nodes.reduce((acc, node, index) => {
    if (node.static) {
        return acc;
    }
    const vertNodes = acc.filter((n, i) => index !== i && __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_js__["e" /* isInterceptedHorz */])(n, node));
    const bottomDynamic = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_js__["a" /* getBottom */])(vertNodes.filter(n => !n.static && n.y + n.height <= node.y));
    const bottom = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_js__["f" /* lowerNode */])(vertNodes.filter(n => n.static), node, bottomDynamic);
    const newNode = Object.assign({}, node, {
        y: bottom
    });
    return [...acc.slice(0, index), newNode, ...acc.slice(index + 1)];
}, nodes);

const packNodes = ({
    hoist = false,
    maxWidth = Infinity,
    updatingId = null,
    nodes
}) => {
    const sorted = sortNodes(nodes, maxWidth);
    const normalized = normalizeNodes(sorted, maxWidth);
    const resolved = resolveNodes(normalized, updatingId);
    const hoisted = hoist ? hoistNodes(resolved) : resolved;
    return hoisted;
};
/* harmony export (immutable) */ __webpack_exports__["a"] = packNodes;


/*

export const addNodeToBottom = ({
    maxWidth = Infinity,
    nodes,
    id,
    width = 1,
    height = 1
}) => {
    return nodes;
};

export const addNodeToRight = ({
    maxWidth = Infinity,
    nodes,
    id,
    width = 1,
    height = 1
}) => {
    return nodes;
};

*/


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__engine_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__drag_js__ = __webpack_require__(1);




const render = (container, state) => {
    state.forEach(node => {
        Array.from(container.children).forEach(element => {
            if (element.dataset.id === String(node.id)) {
                element.className = 'class';
                element.style.position = 'absolute';
                element.style.border = '1px solid #000';
                element.style.boxSizing = 'border-box';
                element.style.left = 0;
                element.style.top = 0;
                element.style.transform = `translate(${node.x * 60}px, ${node.y * 60}px)`;
                element.style.transition = `.1s`;
                element.style.width = `${node.width * 60}px`;
                element.style.height = `${node.height * 60}px`;
            }
        });
    });
    container.style.height = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_js__["a" /* getBottom */])(state) * 60 + 'px';
};

const reduce = (nodes, updatingId) => {
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__engine_js__["a" /* packNodes */])({
        hoist: true,
        updatingId,
        nodes
    });
};

let state = [
    { id: 2, x: 2, y: 4, width: 3, height: 3, static: true },
    { id: 4, x: 7, y: 4, width: 3, height: 3, static: true },
    { id: 1, x: 4, y: 0, width: 3, height: 3 },
    { id: 3, x: 3, y: 1, width: 3, height: 3 }
];

const container = document.createElement('div');

container.style.userSelect = 'none';
container.style.position = 'relative';

const params = {
    cellWidth: 60,
    cellHeight: 60
};

let lastState = state;

__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__drag_js__["a" /* trackDrag */])(container, action => {
    if (action.type === 'drag') {
        const node = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_js__["b" /* findNode */])(state, Math.floor(action.startX / params.cellWidth), Math.floor(action.startY / params.cellHeight));
        if (node) {
            const drag = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__drag_js__["b" /* dragNode */])({
                node,
                params,
                start: {
                    x: action.startX,
                    y: action.startY
                },
                end: {
                    x: action.x,
                    y: action.y
                },
            });
            console.log(node, drag.node);
            lastState = lastState.map(n => n.id === node.id ? drag.node : n);
            lastState = reduce(lastState, node.id);
            render(container, lastState);
        }
    }
    if (action.type === 'end') {
        state = lastState;
    }
});

const addNode = node => {
    const element = document.createElement('div');
    element.dataset.id = node.id;
    const child = document.createElement('div');
    child.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        bottom: 10px;
        left: 10px;
        background: #eee;
        pointer-events: none;
    `;
    child.textContent = `${node.id} ${node.static ? 'static' : 'dynamic'}`;
    element.appendChild(child);
    container.appendChild(element);
};

document.body.appendChild(container);

state = reduce(state);

state.forEach(addNode);

render(container, state);


/***/ })
/******/ ]);
