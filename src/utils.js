import $ from 'jquery';
import _ from 'lodash';

export const isIntercepted = function(a, b) {
    return !(a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y);
};

export const sort = function(nodes, dir, width) {
    width = width || _.chain(nodes).map(function(node) { return node.x + node.width; }).max().value();
    dir = dir !== -1 ? 1 : -1;
    return _.sortBy(nodes, function(n) { return dir * (n.x + n.y * width); });
};

export const createStylesheet = function(id) {
    const style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.setAttribute('data-gs-style-id', id);
    if (style.styleSheet) {
        style.styleSheet.cssText = '';
    } else {
        style.appendChild(document.createTextNode(''));
    }
    document.getElementsByTagName('head')[0].appendChild(style);
    return style.sheet;
};

export const removeStylesheet = function(id) {
    $('STYLE[data-gs-style-id=' + id + ']').remove();
};

export const insertCSSRule = function(sheet, selector, rules, index) {
    if (typeof sheet.insertRule === 'function') {
        sheet.insertRule(selector + '{' + rules + '}', index);
    } else if (typeof sheet.addRule === 'function') {
        sheet.addRule(selector, rules, index);
    }
};

export const toBool = function(v) {
    if (typeof v === 'boolean') {
        return v;
    }
    if (typeof v === 'string') {
        v = v.toLowerCase();
        return !(v === '' || v === 'no' || v === 'false' || v === '0');
    }
    return Boolean(v);
};

export const _collisionNodeCheck = function(node, nn, n) {
    return n !== node && isIntercepted(n, nn);
};

export const _didCollide = function(n, newY, bn) {
    return isIntercepted({x: n.x, y: newY, width: n.width, height: n.height}, bn);
};

export const _isAddNodeIntercepted = function(x, y, node, n) {
    return isIntercepted({x, y, width: node.width, height: node.height}, n);
};

export const parseHeight = function(val) {
    let height = val;
    let heightUnit = 'px';
    if (height && _.isString(height)) {
        const match = height.match(/^(-[0-9]+\.[0-9]+|[0-9]*\.[0-9]+|-[0-9]+|[0-9]+)(px|em|rem|vh|vw)?$/);
        if (!match) {
            throw new Error('Invalid height');
        }
        heightUnit = match[2] || 'px';
        height = parseFloat(match[1]);
    }
    return {height, unit: heightUnit};
};
