import $ from 'jquery';
import 'jquery-ui/ui/data';
import 'jquery-ui/ui/disable-selection';
import 'jquery-ui/ui/focusable';
import 'jquery-ui/ui/form';
import 'jquery-ui/ui/ie';
import 'jquery-ui/ui/keycode';
import 'jquery-ui/ui/labels';
import 'jquery-ui/ui/jquery-1-7';
import 'jquery-ui/ui/plugin';
import 'jquery-ui/ui/safe-active-element';
import 'jquery-ui/ui/safe-blur';
import 'jquery-ui/ui/scroll-parent';
import 'jquery-ui/ui/tabbable';
import 'jquery-ui/ui/unique-id';
import 'jquery-ui/ui/version';
import 'jquery-ui/ui/widget';
import 'jquery-ui/ui/widgets/mouse';
import 'jquery-ui/ui/widgets/draggable';
import 'jquery-ui/ui/widgets/droppable';
import 'jquery-ui/ui/widgets/resizable';
import GridStackUI from './gridstack.js';

/**
* @class JQueryUIGridStackDragDropPlugin
* jQuery UI implementation of drag'n'drop gridstack plugin.
*/
function JQueryUIGridStackDragDropPlugin(grid) {
    GridStackUI.GridStackDragDropPlugin.call(this, grid);
}

GridStackUI.GridStackDragDropPlugin.registerPlugin(JQueryUIGridStackDragDropPlugin);

JQueryUIGridStackDragDropPlugin.prototype = Object.create(GridStackUI.GridStackDragDropPlugin.prototype);
JQueryUIGridStackDragDropPlugin.prototype.constructor = JQueryUIGridStackDragDropPlugin;

JQueryUIGridStackDragDropPlugin.prototype.resizable = function(el, opts) {
    el = $(el);
    if (opts === 'disable' || opts === 'enable') {
        el.resizable(opts);
    } else if (opts === 'option') {
        const key = arguments[2];
        const value = arguments[3];
        el.resizable(opts, key, value);
    } else {
        el.resizable(Object.assign({}, this.grid.opts.resizable, {
            start: opts.start || function() {},
            stop: opts.stop || function() {},
            resize: opts.resize || function() {}
        }));
    }
    return this;
};

JQueryUIGridStackDragDropPlugin.prototype.draggable = function(el, opts) {
    el = $(el);
    if (opts === 'disable' || opts === 'enable') {
        el.draggable(opts);
    } else {
        el.draggable(Object.assign({}, this.grid.opts.draggable, {
            containment: this.grid.opts.isNested ? this.grid.container.parent() : null,
            start: opts.start || function() {},
            stop: opts.stop || function() {},
            drag: opts.drag || function() {}
        }));
    }
    return this;
};

JQueryUIGridStackDragDropPlugin.prototype.droppable = function(el, opts) {
    el = $(el);
    if (opts === 'disable' || opts === 'enable') {
        el.droppable(opts);
    } else {
        el.droppable({
            accept: opts.accept
        });
    }
    return this;
};

JQueryUIGridStackDragDropPlugin.prototype.isDroppable = function(el) {
    el = $(el);
    return Boolean(el.data('droppable'));
};

JQueryUIGridStackDragDropPlugin.prototype.on = function(el, eventName, callback) {
    $(el).on(eventName, callback);
    return this;
};
