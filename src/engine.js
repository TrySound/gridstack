import _ from 'lodash';
import $ from 'jquery';
import * as Utils from './utils.js';

var idSeq = 0;

export default class GridStackEngine {
    constructor(width, onchange, floatMode, height, items) {
        this.width = width;
        this.float = floatMode || false;
        this.height = height || 0;

        this.nodes = items || [];
        this.onchange = onchange || function() {};

        this._updateCounter = 0;
        this._float = this.float;

        this._addedNodes = [];
        this._removedNodes = [];
    }

    batchUpdate() {
        this._updateCounter = 1;
        this.float = true;
    }

    commit() {
        if (this._updateCounter !== 0) {
            this._updateCounter = 0;
            this.float = this._float;
            this._packNodes();
            this._notify();
        }
    }

    // For Meteor support: https://github.com/troolee/gridstack.js/pull/272
    getNodeDataByDOMEl(el) {
        return _.find(this.nodes, function(n) { return el.get(0) === n.el.get(0); });
    }

    _fixCollisions(node) {
        var self = this;
        this._sortNodes(-1);

        var nn = node;
        var hasLocked = Boolean(_.find(this.nodes, function(n) { return n.locked; }));
        if (!this.float && !hasLocked) {
            nn = {x: 0, y: node.y, width: this.width, height: node.height};
        }
        while (true) {
            var collisionNode = this.nodes.find(n => Utils._collisionNodeCheck(node, nn, n));
            if (typeof collisionNode == 'undefined') {
                return;
            }
            this.moveNode(collisionNode, collisionNode.x, node.y + node.height,
                collisionNode.width, collisionNode.height, true);
        }
    }

    isAreaEmpty(x, y, width, height) {
        var nn = {x: x || 0, y: y || 0, width: width || 1, height: height || 1};
        var collisionNode = _.find(this.nodes, _.bind(function(n) {
            return Utils.isIntercepted(n, nn);
        }, this));
        return collisionNode === null || typeof collisionNode === 'undefined';
    }

    _sortNodes(dir) {
        this.nodes = Utils.sort(this.nodes, dir, this.width);
    }

    _packNodes() {
        this._sortNodes();

        if (this.float) {
            _.each(this.nodes, _.bind(function(n, i) {
                if (n._updating || typeof n._origY == 'undefined' || n.y == n._origY) {
                    return;
                }

                var newY = n.y;
                while (newY >= n._origY) {
                    var collisionNode = _.chain(this.nodes)
                        .find(node => Utils._didCollide(n, newY, node))
                        .value();

                    if (!collisionNode) {
                        n._dirty = true;
                        n.y = newY;
                    }
                    --newY;
                }
            }, this));
        } else {
            _.each(this.nodes, _.bind(function(n, i) {
                if (n.locked) {
                    return;
                }
                while (n.y > 0) {
                    var newY = n.y - 1;
                    var canBeMoved = i === 0;

                    if (i > 0) {
                        var collisionNode = _.chain(this.nodes)
                            .take(i)
                            .find(node => Utils._didCollide(n, newY, node))
                            .value();
                        canBeMoved = typeof collisionNode == 'undefined';
                    }

                    if (!canBeMoved) {
                        break;
                    }
                    n._dirty = n.y != newY;
                    n.y = newY;
                }
            }, this));
        }
    }

    _prepareNode(node, resizing) {
        node = _.defaults(node || {}, {width: 1, height: 1, x: 0, y: 0});

        node.x = parseInt('' + node.x);
        node.y = parseInt('' + node.y);
        node.width = parseInt('' + node.width);
        node.height = parseInt('' + node.height);
        node.autoPosition = node.autoPosition || false;
        node.noResize = node.noResize || false;
        node.noMove = node.noMove || false;

        if (node.width > this.width) {
            node.width = this.width;
        } else if (node.width < 1) {
            node.width = 1;
        }

        if (node.height < 1) {
            node.height = 1;
        }

        if (node.x < 0) {
            node.x = 0;
        }

        if (node.x + node.width > this.width) {
            if (resizing) {
                node.width = this.width - node.x;
            } else {
                node.x = this.width - node.width;
            }
        }

        if (node.y < 0) {
            node.y = 0;
        }

        return node;
    }

    _notify() {
        var args = Array.prototype.slice.call(arguments, 0);
        args[0] = typeof args[0] === 'undefined' ? [] : [args[0]];
        args[1] = typeof args[1] === 'undefined' ? true : args[1];
        if (this._updateCounter) {
            return;
        }
        var deletedNodes = args[0].concat(this.getDirtyNodes());
        this.onchange(deletedNodes, args[1]);
    }

    cleanNodes() {
        if (this._updateCounter) {
            return;
        }
        _.each(this.nodes, function(n) {n._dirty = false; });
    }

    getDirtyNodes() {
        return _.filter(this.nodes, function(n) { return n._dirty; });
    }

    addNode(node, triggerAddEvent) {
        node = this._prepareNode(node);

        if (typeof node.maxWidth != 'undefined') { node.width = Math.min(node.width, node.maxWidth); }
        if (typeof node.maxHeight != 'undefined') { node.height = Math.min(node.height, node.maxHeight); }
        if (typeof node.minWidth != 'undefined') { node.width = Math.max(node.width, node.minWidth); }
        if (typeof node.minHeight != 'undefined') { node.height = Math.max(node.height, node.minHeight); }

        node._id = ++idSeq;
        node._dirty = true;

        if (node.autoPosition) {
            this._sortNodes();

            for (var i = 0;; ++i) {
                var x = i % this.width;
                var y = Math.floor(i / this.width);
                if (x + node.width > this.width) {
                    continue;
                }
                if (!this.nodes.find(n => Utils._isAddNodeIntercepted(x, y, node, n))) {
                    node.x = x;
                    node.y = y;
                    break;
                }
            }
        }

        this.nodes.push(node);
        if (typeof triggerAddEvent != 'undefined' && triggerAddEvent) {
            this._addedNodes.push(_.clone(node));
        }

        this._fixCollisions(node);
        this._packNodes();
        this._notify();
        return node;
    }

    removeNode(node, detachNode) {
        detachNode = typeof detachNode === 'undefined' ? true : detachNode;
        this._removedNodes.push(_.clone(node));
        node._id = null;
        this.nodes = _.without(this.nodes, node);
        this._packNodes();
        this._notify(node, detachNode);
    }

    canMoveNode(node, x, y, width, height) {
        if (!this.isNodeChangedPosition(node, x, y, width, height)) {
            return false;
        }
        var hasLocked = Boolean(_.find(this.nodes, function(n) { return n.locked; }));

        if (!this.height && !hasLocked) {
            return true;
        }

        var clonedNode;
        var clone = new GridStackEngine(
            this.width,
            null,
            this.float,
            0,
            _.map(this.nodes, function(n) {
                if (n == node) {
                    clonedNode = $.extend({}, n);
                    return clonedNode;
                }
                return $.extend({}, n);
            }));

        if (typeof clonedNode === 'undefined') {
            return true;
        }

        clone.moveNode(clonedNode, x, y, width, height);

        var res = true;

        if (hasLocked) {
            res &= !Boolean(_.find(clone.nodes, function(n) {
                return n != clonedNode && Boolean(n.locked) && Boolean(n._dirty);
            }));
        }
        if (this.height) {
            res &= clone.getGridHeight() <= this.height;
        }

        return res;
    }

    canBePlacedWithRespectToHeight(node) {
        if (!this.height) {
            return true;
        }

        var clone = new GridStackEngine(
            this.width,
            null,
            this.float,
            0,
            _.map(this.nodes, function(n) { return $.extend({}, n); }));
        clone.addNode(node);
        return clone.getGridHeight() <= this.height;
    }

    isNodeChangedPosition(node, x, y, width, height) {
        if (typeof x != 'number') { x = node.x; }
        if (typeof y != 'number') { y = node.y; }
        if (typeof width != 'number') { width = node.width; }
        if (typeof height != 'number') { height = node.height; }

        if (typeof node.maxWidth != 'undefined') { width = Math.min(width, node.maxWidth); }
        if (typeof node.maxHeight != 'undefined') { height = Math.min(height, node.maxHeight); }
        if (typeof node.minWidth != 'undefined') { width = Math.max(width, node.minWidth); }
        if (typeof node.minHeight != 'undefined') { height = Math.max(height, node.minHeight); }

        if (node.x == x && node.y == y && node.width == width && node.height == height) {
            return false;
        }
        return true;
    }

    moveNode(node, x, y, width, height, noPack) {
        if (!this.isNodeChangedPosition(node, x, y, width, height)) {
            return node;
        }
        if (typeof x != 'number') { x = node.x; }
        if (typeof y != 'number') { y = node.y; }
        if (typeof width != 'number') { width = node.width; }
        if (typeof height != 'number') { height = node.height; }

        if (typeof node.maxWidth != 'undefined') { width = Math.min(width, node.maxWidth); }
        if (typeof node.maxHeight != 'undefined') { height = Math.min(height, node.maxHeight); }
        if (typeof node.minWidth != 'undefined') { width = Math.max(width, node.minWidth); }
        if (typeof node.minHeight != 'undefined') { height = Math.max(height, node.minHeight); }

        if (node.x == x && node.y == y && node.width == width && node.height == height) {
            return node;
        }

        var resizing = node.width != width;
        node._dirty = true;

        node.x = x;
        node.y = y;
        node.width = width;
        node.height = height;

        node.lastTriedX = x;
        node.lastTriedY = y;
        node.lastTriedWidth = width;
        node.lastTriedHeight = height;

        node = this._prepareNode(node, resizing);

        this._fixCollisions(node);
        if (!noPack) {
            this._packNodes();
            this._notify();
        }
        return node;
    }

    getGridHeight() {
        return this.nodes.reduce((acc, n) => Math.max(acc, n.y + n.height), 0);
    }

    beginUpdate(node) {
        this.nodes.forEach(n => {
            n._origY = n.y;
        });
        node._updating = true;
    }

    endUpdate() {
        this.nodes.forEach(n => {
            n._origY = n.y;
        });
        const n = this.nodes.find(n => n._updating);
        if (n) {
            n._updating = false;
        }
    }
}
