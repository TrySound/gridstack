import $ from 'jquery';
import _ from 'lodash';
import * as Utils from './utils.js';
import GridStackEngine from './engine.js';

var scope = window;

/**
* @class GridStackDragDropPlugin
* Base class for drag'n'drop plugin.
*/
function GridStackDragDropPlugin(grid) {
    this.grid = grid;
}

GridStackDragDropPlugin.registeredPlugins = [];

GridStackDragDropPlugin.registerPlugin = function(pluginClass) {
    GridStackDragDropPlugin.registeredPlugins.push(pluginClass);
};

GridStackDragDropPlugin.prototype.resizable = function(el, opts) {
    return this;
};

GridStackDragDropPlugin.prototype.draggable = function(el, opts) {
    return this;
};

GridStackDragDropPlugin.prototype.droppable = function(el, opts) {
    return this;
};

GridStackDragDropPlugin.prototype.isDroppable = function(el) {
    return false;
};

GridStackDragDropPlugin.prototype.on = function(el, eventName, callback) {
    return this;
};


var GridStack = function(el, opts) {
    var self = this;
    var oneColumnMode, isAutoCellHeight;

    opts = opts || {};

    this.container = $(el);

    opts.itemClass = opts.itemClass || 'grid-stack-item';
    var isNested = this.container.closest('.' + opts.itemClass).length > 0;

    this.opts = _.defaults(opts || {}, {
        width: parseInt(this.container.attr('data-gs-width')) || 12,
        height: parseInt(this.container.attr('data-gs-height')) || 0,
        itemClass: 'grid-stack-item',
        placeholderClass: 'grid-stack-placeholder',
        placeholderText: '',
        handle: '.grid-stack-item-content',
        handleClass: null,
        cellWidth: 60,
        cellHeight: 60,
        auto: true,
        minWidth: 768,
        float: false,
        staticGrid: false,
        _class: 'grid-stack-instance-' + (Math.random() * 10000).toFixed(0),
        alwaysShowResizeHandle: opts.alwaysShowResizeHandle || false,
        resizable: _.defaults(opts.resizable || {}, {
            autoHide: !(opts.alwaysShowResizeHandle || false),
            handles: 'se'
        }),
        draggable: _.defaults(opts.draggable || {}, {
            handle: (opts.handleClass ? '.' + opts.handleClass : (opts.handle ? opts.handle : '')) ||
                '.grid-stack-item-content',
            scroll: false,
            appendTo: 'body'
        }),
        disableDrag: opts.disableDrag || false,
        disableResize: opts.disableResize || false,
        rtl: 'auto',
        removable: false,
        removeTimeout: 2000,
        cellHeightUnit: 'px',
        oneColumnModeClass: opts.oneColumnModeClass || 'grid-stack-one-column-mode',
        ddPlugin: null
    });

    if (this.opts.ddPlugin === false) {
        this.opts.ddPlugin = GridStackDragDropPlugin;
    } else if (this.opts.ddPlugin === null) {
        this.opts.ddPlugin = _.first(GridStackDragDropPlugin.registeredPlugins) || GridStackDragDropPlugin;
    }

    this.dd = new this.opts.ddPlugin(this);

    if (this.opts.rtl === 'auto') {
        this.opts.rtl = this.container.css('direction') === 'rtl';
    }

    if (this.opts.rtl) {
        this.container.addClass('grid-stack-rtl');
    }

    this.opts.isNested = isNested;

    isAutoCellHeight = this.opts.cellHeight === 'auto';
    if (isAutoCellHeight) {
        self.cellHeight(self.cellWidth(), true);
    } else {
        this.cellHeight(this.opts.cellHeight, true);
    }

    this.container.addClass(this.opts._class);

    if (isNested) {
        this.container.addClass('grid-stack-nested');
    }

    this._initStyles();

    this.grid = new GridStackEngine(this.opts.width, function(nodes, detachNode) {
        detachNode = typeof detachNode === 'undefined' ? true : detachNode;
        var maxHeight = 0;
        _.each(nodes, function(n) {
            if (detachNode && n._id === null) {
                if (n.el) {
                    n.el.remove();
                }
            } else {
                n.el
                    .attr('data-gs-x', n.x)
                    .attr('data-gs-y', n.y)
                    .attr('data-gs-width', n.width)
                    .attr('data-gs-height', n.height);
                maxHeight = Math.max(maxHeight, n.y + n.height);
            }
        });
        self._updateStyles(maxHeight + 10);
    }, this.opts.float, this.opts.height);

    if (this.opts.auto) {
        var elements = [];
        var _this = this;
        this.container.children('.' + this.opts.itemClass + ':not(.' + this.opts.placeholderClass + ')')
            .each(function(index, el) {
            el = $(el);
            elements.push({
                el: el,
                i: parseInt(el.attr('data-gs-x')) + parseInt(el.attr('data-gs-y')) * _this.opts.width
            });
        });
        _.chain(elements).sortBy(function(x) { return x.i; }).each(function(i) {
            self._prepareElement(i.el);
        }).value();
    }

    this.placeholder = $(
        '<div class="' + this.opts.placeholderClass + ' ' + this.opts.itemClass + '">' +
        '<div class="placeholder-content">' + this.opts.placeholderText + '</div></div>').hide();

    this._updateContainerHeight();

    this._updateHeightsOnResize = _.throttle(function() {
        self.cellHeight(self.cellWidth(), false);
    }, 100);

    this.onResizeHandler = function() {
        if (isAutoCellHeight) {
            self._updateHeightsOnResize();
        }

        if (self._isOneColumnMode()) {
            if (oneColumnMode) {
                return;
            }
            self.container.addClass(self.opts.oneColumnModeClass);
            oneColumnMode = true;

            self.grid._sortNodes();
            _.each(self.grid.nodes, function(node) {
                self.container.append(node.el);

                if (self.opts.staticGrid) {
                    return;
                }
                if (node.noMove || self.opts.disableDrag) {
                    self.dd.draggable(node.el, 'disable');
                }
                if (node.noResize || self.opts.disableResize) {
                    self.dd.resizable(node.el, 'disable');
                }

                node.el.trigger('resize');
            });
        } else {
            if (!oneColumnMode) {
                return;
            }

            self.container.removeClass(self.opts.oneColumnModeClass);
            oneColumnMode = false;

            if (self.opts.staticGrid) {
                return;
            }

            _.each(self.grid.nodes, function(node) {
                if (!node.noMove && !self.opts.disableDrag) {
                    self.dd.draggable(node.el, 'enable');
                }
                if (!node.noResize && !self.opts.disableResize) {
                    self.dd.resizable(node.el, 'enable');
                }

                node.el.trigger('resize');
            });
        }
    };

    $(window).resize(this.onResizeHandler);
    this.onResizeHandler();

    if (!self.opts.staticGrid && typeof self.opts.removable === 'string') {
        var trashZone = $(self.opts.removable);
        if (!this.dd.isDroppable(trashZone)) {
            this.dd.droppable(trashZone, {
                accept: '.' + self.opts.itemClass
            });
        }
        this.dd
            .on(trashZone, 'dropover', function(event, ui) {
                var el = $(ui.draggable);
                var node = el.data('_gridstack_node');
                if (node._grid !== self) {
                    return;
                }
                self._setupRemovingTimeout(el);
            })
            .on(trashZone, 'dropout', function(event, ui) {
                var el = $(ui.draggable);
                var node = el.data('_gridstack_node');
                if (node._grid !== self) {
                    return;
                }
                self._clearRemovingTimeout(el);
            });
    }

    if (!self.opts.staticGrid && self.opts.acceptWidgets) {
        var draggingElement = null;

        var onDrag = function(event, ui) {
            var el = draggingElement;
            var node = el.data('_gridstack_node');
            var pos = self.getCellFromPixel(ui.offset, true);
            var x = Math.max(0, pos.x);
            var y = Math.max(0, pos.y);
            if (!node._added) {
                node._added = true;

                node.el = el;
                node.x = x;
                node.y = y;
                self.grid.cleanNodes();
                self.grid.beginUpdate(node);
                self.grid.addNode(node);

                self.container.append(self.placeholder);
                self.placeholder
                    .attr('data-gs-x', node.x)
                    .attr('data-gs-y', node.y)
                    .attr('data-gs-width', node.width)
                    .attr('data-gs-height', node.height)
                    .show();
                node.el = self.placeholder;
                node._beforeDragX = node.x;
                node._beforeDragY = node.y;

                self._updateContainerHeight();
            } else {
                if (!self.grid.canMoveNode(node, x, y)) {
                    return;
                }
                self.grid.moveNode(node, x, y);
                self._updateContainerHeight();
            }
        };

        this.dd
            .droppable(self.container, {
                accept: function(el) {
                    el = $(el);
                    var node = el.data('_gridstack_node');
                    if (node && node._grid === self) {
                        return false;
                    }
                    return el.is(self.opts.acceptWidgets === true ? '.grid-stack-item' : self.opts.acceptWidgets);
                }
            })
            .on(self.container, 'dropover', function(event, ui) {
                var offset = self.container.offset();
                var el = $(ui.draggable);
                var cellWidth = self.cellWidth();
                var cellHeight = self.cellHeight();
                var origNode = el.data('_gridstack_node');

                var width = origNode ? origNode.width : (Math.ceil(el.outerWidth() / cellWidth));
                var height = origNode ? origNode.height : (Math.ceil(el.outerHeight() / cellHeight));

                draggingElement = el;

                var node = self.grid._prepareNode({width: width, height: height, _added: false, _temporary: true});
                el.data('_gridstack_node', node);
                el.data('_gridstack_node_orig', origNode);

                el.on('drag', onDrag);
            })
            .on(self.container, 'dropout', function(event, ui) {
                var el = $(ui.draggable);
                el.unbind('drag', onDrag);
                var node = el.data('_gridstack_node');
                node.el = null;
                self.grid.removeNode(node);
                self.placeholder.detach();
                self._updateContainerHeight();
                el.data('_gridstack_node', el.data('_gridstack_node_orig'));
            })
            .on(self.container, 'drop', function(event, ui) {
                self.placeholder.detach();

                var node = $(ui.draggable).data('_gridstack_node');
                node._grid = self;
                var el = $(ui.draggable).clone(false);
                el.data('_gridstack_node', node);
                $(ui.draggable).remove();
                node.el = el;
                self.placeholder.hide();
                el
                    .attr('data-gs-x', node.x)
                    .attr('data-gs-y', node.y)
                    .attr('data-gs-width', node.width)
                    .attr('data-gs-height', node.height)
                    .addClass(self.opts.itemClass)
                    .removeAttr('style')
                    .enableSelection()
                    .removeData('draggable')
                    .removeClass('ui-draggable ui-draggable-dragging ui-draggable-disabled')
                    .unbind('drag', onDrag);
                self.container.append(el);
                self._prepareElementsByNode(el, node);
                self._updateContainerHeight();
                self._triggerChangeEvent();

                self.grid.endUpdate();
            });
    }
};

GridStack.prototype._triggerChangeEvent = function(forceTrigger) {
    var elements = this.grid.getDirtyNodes();
    var hasChanges = false;

    var eventParams = [];
    if (elements && elements.length) {
        eventParams.push(elements);
        hasChanges = true;
    }

    if (hasChanges || forceTrigger === true) {
        this.container.trigger('change', eventParams);
    }
};

GridStack.prototype._triggerAddEvent = function() {
    if (this.grid._addedNodes && this.grid._addedNodes.length > 0) {
        this.container.trigger('added', [_.map(this.grid._addedNodes, _.clone)]);
        this.grid._addedNodes = [];
    }
};

GridStack.prototype._triggerRemoveEvent = function() {
    if (this.grid._removedNodes && this.grid._removedNodes.length > 0) {
        this.container.trigger('removed', [_.map(this.grid._removedNodes, _.clone)]);
        this.grid._removedNodes = [];
    }
};

GridStack.prototype._initStyles = function() {
    if (this._stylesId) {
        Utils.removeStylesheet(this._stylesId);
    }
    this._stylesId = 'gridstack-style-' + (Math.random() * 100000).toFixed();
    this._styles = Utils.createStylesheet(this._stylesId);
    if (this._styles !== null) {
        this._styles._max = 0;
    }
};

GridStack.prototype._updateStyles = function(maxHeight) {
    if (this._styles === null || typeof this._styles === 'undefined') {
        return;
    }

    var prefix = '.' + this.opts._class + ' .' + this.opts.itemClass;
    var self = this;
    var getHeight;

    if (typeof maxHeight == 'undefined') {
        maxHeight = this._styles._max;
        this._initStyles();
        this._updateContainerHeight();
    }
    if (!this.opts.cellHeight) { // The rest will be handled by CSS
        return ;
    }
    if (this._styles._max !== 0 && maxHeight <= this._styles._max) {
        return ;
    }

    getHeight = function(nbRows, nbMargins) {
        return (self.opts.cellHeight * nbRows) + self.opts.cellHeightUnit;
    };

    if (this._styles._max === 0) {
        Utils.insertCSSRule(this._styles, prefix, 'min-height: ' + getHeight(1, 0) + ';', 0);
    }

    if (maxHeight > this._styles._max) {
        for (var i = this._styles._max; i < maxHeight; ++i) {
            Utils.insertCSSRule(this._styles,
                prefix + '[data-gs-height="' + (i + 1) + '"]',
                'height: ' + getHeight(i + 1, i) + ';',
                i
            );
            Utils.insertCSSRule(this._styles,
                prefix + '[data-gs-min-height="' + (i + 1) + '"]',
                'min-height: ' + getHeight(i + 1, i) + ';',
                i
            );
            Utils.insertCSSRule(this._styles,
                prefix + '[data-gs-max-height="' + (i + 1) + '"]',
                'max-height: ' + getHeight(i + 1, i) + ';',
                i
            );
            Utils.insertCSSRule(this._styles,
                prefix + '[data-gs-y="' + i + '"]',
                'top: ' + getHeight(i, i) + ';',
                i
            );
        }
        this._styles._max = maxHeight;
    }
};

GridStack.prototype._updateContainerHeight = function() {
    if (this.grid._updateCounter) {
        return;
    }
    var height = this.grid.getGridHeight();
    this.container.attr('data-gs-current-height', height);
    if (!this.opts.cellHeight) {
        return ;
    }
    this.container.css('height', (height * (this.opts.cellHeight)) + this.opts.cellHeightUnit);
};

GridStack.prototype._isOneColumnMode = function() {
    return (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) <=
        this.opts.minWidth;
};

GridStack.prototype._setupRemovingTimeout = function(el) {
    var self = this;
    var node = $(el).data('_gridstack_node');

    if (node._removeTimeout || !self.opts.removable) {
        return;
    }
    node._removeTimeout = setTimeout(function() {
        el.addClass('grid-stack-item-removing');
        node._isAboutToRemove = true;
    }, self.opts.removeTimeout);
};

GridStack.prototype._clearRemovingTimeout = function(el) {
    var node = $(el).data('_gridstack_node');

    if (!node._removeTimeout) {
        return;
    }
    clearTimeout(node._removeTimeout);
    node._removeTimeout = null;
    el.removeClass('grid-stack-item-removing');
    node._isAboutToRemove = false;
};

GridStack.prototype._prepareElementsByNode = function(el, node) {
    if (typeof $.ui === 'undefined') {
        return;
    }
    var self = this;

    var cellWidth;
    var cellHeight;

    var dragOrResize = function(event, ui) {
        var x = Math.round(ui.position.left / cellWidth);
        var y = Math.floor((ui.position.top + cellHeight / 2) / cellHeight);
        var width;
        var height;

        if (event.type != 'drag') {
            width = Math.round(ui.size.width / cellWidth);
            height = Math.round(ui.size.height / cellHeight);
        }

        if (event.type == 'drag') {
            if (x < 0 || x >= self.grid.width || y < 0) {
                if (self.opts.removable === true) {
                    self._setupRemovingTimeout(el);
                }

                x = node._beforeDragX;
                y = node._beforeDragY;

                self.placeholder.detach();
                self.placeholder.hide();
                self.grid.removeNode(node);
                self._updateContainerHeight();

                node._temporaryRemoved = true;
            } else {
                self._clearRemovingTimeout(el);

                if (node._temporaryRemoved) {
                    self.grid.addNode(node);
                    self.placeholder
                        .attr('data-gs-x', x)
                        .attr('data-gs-y', y)
                        .attr('data-gs-width', width)
                        .attr('data-gs-height', height)
                        .show();
                    self.container.append(self.placeholder);
                    node.el = self.placeholder;
                    node._temporaryRemoved = false;
                }
            }
        } else if (event.type == 'resize')  {
            if (x < 0) {
                return;
            }
        }
        // width and height are undefined if not resizing
        var lastTriedWidth = typeof width !== 'undefined' ? width : node.lastTriedWidth;
        var lastTriedHeight = typeof height !== 'undefined' ? height : node.lastTriedHeight;
        if (!self.grid.canMoveNode(node, x, y, width, height) ||
            (node.lastTriedX === x && node.lastTriedY === y &&
            node.lastTriedWidth === lastTriedWidth && node.lastTriedHeight === lastTriedHeight)) {
            return;
        }
        node.lastTriedX = x;
        node.lastTriedY = y;
        node.lastTriedWidth = width;
        node.lastTriedHeight = height;
        self.grid.moveNode(node, x, y, width, height);
        self._updateContainerHeight();
    };

    var onStartMoving = function(event, ui) {
        self.container.append(self.placeholder);
        var o = $(this);
        self.grid.cleanNodes();
        self.grid.beginUpdate(node);
        cellWidth = self.cellWidth();
        var strictCellHeight = Math.ceil(o.outerHeight() / o.attr('data-gs-height'));
        cellHeight = self.container.height() / parseInt(self.container.attr('data-gs-current-height'));
        self.placeholder
            .attr('data-gs-x', o.attr('data-gs-x'))
            .attr('data-gs-y', o.attr('data-gs-y'))
            .attr('data-gs-width', o.attr('data-gs-width'))
            .attr('data-gs-height', o.attr('data-gs-height'))
            .show();
        node.el = self.placeholder;
        node._beforeDragX = node.x;
        node._beforeDragY = node.y;

        self.dd.resizable(el, 'option', 'minWidth', cellWidth * (node.minWidth || 1));
        self.dd.resizable(el, 'option', 'minHeight', strictCellHeight * (node.minHeight || 1));

        if (event.type == 'resizestart') {
            o.find('.grid-stack-item').trigger('resizestart');
        }
    };

    var onEndMoving = function(event, ui) {
        var o = $(this);
        if (!o.data('_gridstack_node')) {
            return;
        }

        var forceNotify = false;
        self.placeholder.detach();
        node.el = o;
        self.placeholder.hide();

        if (node._isAboutToRemove) {
            forceNotify = true;
            el.removeData('_gridstack_node');
            el.remove();
        } else {
            self._clearRemovingTimeout(el);
            if (!node._temporaryRemoved) {
                o
                    .attr('data-gs-x', node.x)
                    .attr('data-gs-y', node.y)
                    .attr('data-gs-width', node.width)
                    .attr('data-gs-height', node.height)
                    .removeAttr('style');
            } else {
                o
                    .attr('data-gs-x', node._beforeDragX)
                    .attr('data-gs-y', node._beforeDragY)
                    .attr('data-gs-width', node.width)
                    .attr('data-gs-height', node.height)
                    .removeAttr('style');
                node.x = node._beforeDragX;
                node.y = node._beforeDragY;
                self.grid.addNode(node);
            }
        }
        self._updateContainerHeight();
        self._triggerChangeEvent(forceNotify);

        self.grid.endUpdate();

        var nestedGrids = o.find('.grid-stack');
        if (nestedGrids.length && event.type == 'resizestop') {
            nestedGrids.each(function(index, el) {
                $(el).data('gridstack').onResizeHandler();
            });
            o.find('.grid-stack-item').trigger('resizestop');
        }
    };

    this.dd
        .draggable(el, {
            start: onStartMoving,
            stop: onEndMoving,
            drag: dragOrResize
        })
        .resizable(el, {
            start: onStartMoving,
            stop: onEndMoving,
            resize: dragOrResize
        });

    if (node.noMove || this._isOneColumnMode() || this.opts.disableDrag) {
        this.dd.draggable(el, 'disable');
    }

    if (node.noResize || this._isOneColumnMode() || this.opts.disableResize) {
        this.dd.resizable(el, 'disable');
    }

    el.attr('data-gs-locked', node.locked ? 'yes' : null);
};

GridStack.prototype._prepareElement = function(el, triggerAddEvent) {
    triggerAddEvent = typeof triggerAddEvent != 'undefined' ? triggerAddEvent : false;
    var self = this;
    el = $(el);

    el.addClass(this.opts.itemClass);
    var node = self.grid.addNode({
        x: el.attr('data-gs-x'),
        y: el.attr('data-gs-y'),
        width: el.attr('data-gs-width'),
        height: el.attr('data-gs-height'),
        maxWidth: el.attr('data-gs-max-width'),
        minWidth: el.attr('data-gs-min-width'),
        maxHeight: el.attr('data-gs-max-height'),
        minHeight: el.attr('data-gs-min-height'),
        autoPosition: Utils.toBool(el.attr('data-gs-auto-position')),
        noResize: Utils.toBool(el.attr('data-gs-no-resize')),
        noMove: Utils.toBool(el.attr('data-gs-no-move')),
        locked: Utils.toBool(el.attr('data-gs-locked')),
        el: el,
        id: el.attr('data-gs-id'),
        _grid: self
    }, triggerAddEvent);
    el.data('_gridstack_node', node);

    this._prepareElementsByNode(el, node);
};

GridStack.prototype.addWidget = function(el, x, y, width, height, autoPosition, minWidth, maxWidth,
    minHeight, maxHeight, id) {
    el = $(el);
    if (typeof x != 'undefined') { el.attr('data-gs-x', x); }
    if (typeof y != 'undefined') { el.attr('data-gs-y', y); }
    if (typeof width != 'undefined') { el.attr('data-gs-width', width); }
    if (typeof height != 'undefined') { el.attr('data-gs-height', height); }
    if (typeof autoPosition != 'undefined') { el.attr('data-gs-auto-position', autoPosition ? 'yes' : null); }
    if (typeof minWidth != 'undefined') { el.attr('data-gs-min-width', minWidth); }
    if (typeof maxWidth != 'undefined') { el.attr('data-gs-max-width', maxWidth); }
    if (typeof minHeight != 'undefined') { el.attr('data-gs-min-height', minHeight); }
    if (typeof maxHeight != 'undefined') { el.attr('data-gs-max-height', maxHeight); }
    if (typeof id != 'undefined') { el.attr('data-gs-id', id); }
    this.container.append(el);
    this._prepareElement(el, true);
    this._triggerAddEvent();
    this._updateContainerHeight();
    this._triggerChangeEvent(true);

    return el;
};

GridStack.prototype.makeWidget = function(el) {
    el = $(el);
    this._prepareElement(el, true);
    this._triggerAddEvent();
    this._updateContainerHeight();
    this._triggerChangeEvent(true);

    return el;
};

GridStack.prototype.willItFit = function(x, y, width, height, autoPosition) {
    var node = {x: x, y: y, width: width, height: height, autoPosition: autoPosition};
    return this.grid.canBePlacedWithRespectToHeight(node);
};

GridStack.prototype.removeWidget = function(el, detachNode) {
    detachNode = typeof detachNode === 'undefined' ? true : detachNode;
    el = $(el);
    var node = el.data('_gridstack_node');

    // For Meteor support: https://github.com/troolee/gridstack.js/pull/272
    if (!node) {
        node = this.grid.getNodeDataByDOMEl(el);
    }

    this.grid.removeNode(node, detachNode);
    el.removeData('_gridstack_node');
    this._updateContainerHeight();
    if (detachNode) {
        el.remove();
    }
    this._triggerChangeEvent(true);
    this._triggerRemoveEvent();
};

GridStack.prototype.removeAll = function(detachNode) {
    _.each(this.grid.nodes, _.bind(function(node) {
        this.removeWidget(node.el, detachNode);
    }, this));
    this.grid.nodes = [];
    this._updateContainerHeight();
};

GridStack.prototype.destroy = function(detachGrid) {
    $(window).off('resize', this.onResizeHandler);
    this.disable();
    if (typeof detachGrid != 'undefined' && !detachGrid) {
        this.removeAll(false);
        this.container.removeData('gridstack');
    } else {
        this.container.remove();
    }
    Utils.removeStylesheet(this._stylesId);
    if (this.grid) {
        this.grid = null;
    }
};

GridStack.prototype.resizable = function(el, val) {
    var self = this;
    el = $(el);
    el.each(function(index, el) {
        el = $(el);
        var node = el.data('_gridstack_node');
        if (typeof node == 'undefined' || node === null || typeof $.ui === 'undefined') {
            return;
        }

        node.noResize = !(val || false);
        if (node.noResize || self._isOneColumnMode()) {
            self.dd.resizable(el, 'disable');
        } else {
            self.dd.resizable(el, 'enable');
        }
    });
    return this;
};

GridStack.prototype.movable = function(el, val) {
    var self = this;
    el = $(el);
    el.each(function(index, el) {
        el = $(el);
        var node = el.data('_gridstack_node');
        if (typeof node == 'undefined' || node === null || typeof $.ui === 'undefined') {
            return;
        }

        node.noMove = !(val || false);
        if (node.noMove || self._isOneColumnMode()) {
            self.dd.draggable(el, 'disable');
            el.removeClass('ui-draggable-handle');
        } else {
            self.dd.draggable(el, 'enable');
            el.addClass('ui-draggable-handle');
        }
    });
    return this;
};

GridStack.prototype.enableMove = function(doEnable, includeNewWidgets) {
    this.movable(this.container.children('.' + this.opts.itemClass), doEnable);
    if (includeNewWidgets) {
        this.opts.disableDrag = !doEnable;
    }
};

GridStack.prototype.enableResize = function(doEnable, includeNewWidgets) {
    this.resizable(this.container.children('.' + this.opts.itemClass), doEnable);
    if (includeNewWidgets) {
        this.opts.disableResize = !doEnable;
    }
};

GridStack.prototype.disable = function() {
    this.movable(this.container.children('.' + this.opts.itemClass), false);
    this.resizable(this.container.children('.' + this.opts.itemClass), false);
    this.container.trigger('disable');
};

GridStack.prototype.enable = function() {
    this.movable(this.container.children('.' + this.opts.itemClass), true);
    this.resizable(this.container.children('.' + this.opts.itemClass), true);
    this.container.trigger('enable');
};

GridStack.prototype.locked = function(el, val) {
    el = $(el);
    el.each(function(index, el) {
        el = $(el);
        var node = el.data('_gridstack_node');
        if (typeof node == 'undefined' || node === null) {
            return;
        }

        node.locked = (val || false);
        el.attr('data-gs-locked', node.locked ? 'yes' : null);
    });
    return this;
};

GridStack.prototype.maxHeight = function(el, val) {
    el = $(el);
    el.each(function(index, el) {
        el = $(el);
        var node = el.data('_gridstack_node');
        if (typeof node === 'undefined' || node === null) {
            return;
        }

        if (!isNaN(val)) {
            node.maxHeight = (val || false);
            el.attr('data-gs-max-height', val);
        }
    });
    return this;
};

GridStack.prototype.minHeight = function(el, val) {
    el = $(el);
    el.each(function(index, el) {
        el = $(el);
        var node = el.data('_gridstack_node');
        if (typeof node === 'undefined' || node === null) {
            return;
        }

        if (!isNaN(val)) {
            node.minHeight = (val || false);
            el.attr('data-gs-min-height', val);
        }
    });
    return this;
};

GridStack.prototype.maxWidth = function(el, val) {
    el = $(el);
    el.each(function(index, el) {
        el = $(el);
        var node = el.data('_gridstack_node');
        if (typeof node === 'undefined' || node === null) {
            return;
        }

        if (!isNaN(val)) {
            node.maxWidth = (val || false);
            el.attr('data-gs-max-width', val);
        }
    });
    return this;
};

GridStack.prototype.minWidth = function(el, val) {
    el = $(el);
    el.each(function(index, el) {
        el = $(el);
        var node = el.data('_gridstack_node');
        if (typeof node === 'undefined' || node === null) {
            return;
        }

        if (!isNaN(val)) {
            node.minWidth = (val || false);
            el.attr('data-gs-min-width', val);
        }
    });
    return this;
};

GridStack.prototype._updateElement = function(el, callback) {
    el = $(el).first();
    var node = el.data('_gridstack_node');
    if (typeof node == 'undefined' || node === null) {
        return;
    }

    var self = this;

    self.grid.cleanNodes();
    self.grid.beginUpdate(node);

    callback.call(this, el, node);

    self._updateContainerHeight();
    self._triggerChangeEvent();

    self.grid.endUpdate();
};

GridStack.prototype.resize = function(el, width, height) {
    this._updateElement(el, function(el, node) {
        width = (width !== null && typeof width != 'undefined') ? width : node.width;
        height = (height !== null && typeof height != 'undefined') ? height : node.height;

        this.grid.moveNode(node, node.x, node.y, width, height);
    });
};

GridStack.prototype.move = function(el, x, y) {
    this._updateElement(el, function(el, node) {
        x = (x !== null && typeof x != 'undefined') ? x : node.x;
        y = (y !== null && typeof y != 'undefined') ? y : node.y;

        this.grid.moveNode(node, x, y, node.width, node.height);
    });
};

GridStack.prototype.update = function(el, x, y, width, height) {
    this._updateElement(el, function(el, node) {
        x = (x !== null && typeof x != 'undefined') ? x : node.x;
        y = (y !== null && typeof y != 'undefined') ? y : node.y;
        width = (width !== null && typeof width != 'undefined') ? width : node.width;
        height = (height !== null && typeof height != 'undefined') ? height : node.height;

        this.grid.moveNode(node, x, y, width, height);
    });
};

GridStack.prototype.cellHeight = function(val, noUpdate) {
    if (typeof val == 'undefined') {
        if (this.opts.cellHeight) {
            return this.opts.cellHeight;
        }
        var o = this.container.children('.' + this.opts.itemClass).first();
        return Math.ceil(o.outerHeight() / o.attr('data-gs-height'));
    }
    var heightData = Utils.parseHeight(val);

    if (this.opts.cellHeightUnit === heightData.heightUnit && this.opts.height === heightData.height) {
        return ;
    }
    this.opts.cellHeightUnit = heightData.unit;
    this.opts.cellHeight = heightData.height;

    if (!noUpdate) {
        this._updateStyles();
    }

};

GridStack.prototype.cellWidth = function() {
    return this.opts.cellWidth;
};

GridStack.prototype.getCellFromPixel = function(position, useOffset) {
    var containerPos = (typeof useOffset != 'undefined' && useOffset) ?
        this.container.offset() : this.container.position();
    var relativeLeft = position.left - containerPos.left;
    var relativeTop = position.top - containerPos.top;

    return {x: Math.floor(relativeLeft / this.opts.cellWidth), y: Math.floor(relativeTop / this.opts.cellHeight)};
};

GridStack.prototype.batchUpdate = function() {
    this.grid.batchUpdate();
};

GridStack.prototype.commit = function() {
    this.grid.commit();
    this._updateContainerHeight();
};

GridStack.prototype.isAreaEmpty = function(x, y, width, height) {
    return this.grid.isAreaEmpty(x, y, width, height);
};

GridStack.prototype.setStatic = function(staticValue) {
    this.opts.staticGrid = (staticValue === true);
    this.enableMove(!staticValue);
    this.enableResize(!staticValue);
};

GridStack.prototype._updateNodeWidths = function(oldWidth, newWidth) {
    this.grid._sortNodes();
    this.grid.batchUpdate();
    var node = {};
    for (var i = 0; i < this.grid.nodes.length; i++) {
        node = this.grid.nodes[i];
        this.update(node.el, Math.round(node.x * newWidth / oldWidth), undefined,
            Math.round(node.width * newWidth / oldWidth), undefined);
    }
    this.grid.commit();
};

GridStack.prototype.setGridWidth = function(gridWidth,doNotPropagate) {
    this.container.removeClass('grid-stack-' + this.opts.width);
    if (doNotPropagate !== true) {
        this._updateNodeWidths(this.opts.width, gridWidth);
    }
    this.opts.width = gridWidth;
    this.grid.width = gridWidth;
    this.container.addClass('grid-stack-' + gridWidth);
};

scope.GridStackUI = GridStack;

scope.GridStackUI.Utils = Utils;
scope.GridStackUI.Engine = GridStackEngine;
scope.GridStackUI.GridStackDragDropPlugin = GridStackDragDropPlugin;

$.fn.gridstack = function(opts) {
    return this.each(function() {
        var o = $(this);
        if (!o.data('gridstack')) {
            o
                .data('gridstack', new GridStack(this, opts));
        }
    });
};

export default GridStack;
