import $ from 'jquery';
import './gridstack.js';

describe('gridstack', () => {
    'use strict';

    var gridstackHTML = `
        <div class="grid-stack">
           <div class="grid-stack-item" data-gs-x="0" data-gs-y="0" data-gs-width="4" data-gs-height="2">
               <div class="grid-stack-item-content"></div>
           </div>
            <div class="grid-stack-item" data-gs-x="4" data-gs-y="0" data-gs-width="4" data-gs-height="4">
                <div class="grid-stack-item-content"></div>
            </div>
        </div>
    `;

    describe('grid.getCellFromPixel', () => {
        it('should compute cell from pixel coords', () => {
            const grid = new window.GridStackUI(document.createElement('div'), {
                cellWidth: 60,
                cellHeight: 60
            });
            const cell = grid.getCellFromPixel({ left: 72, top: 125 });
            expect(cell).toEqual({ x: 1, y: 2 });
        });

        it('should compute cell in empty grid', () => {
            const grid = new window.GridStackUI(document.createElement('div'), {
                cellHeight: 80
            })
            const cell = grid.getCellFromPixel({ left: 72, top: 100 });
            expect(cell).toEqual({ x: 1, y: 1 });
        });
    });

    describe('grid.cellWidth', () => {
        it('should return default cellWidth', () => {
            const grid = new window.GridStackUI(document.createElement('div'), {
                cellHeight: 80,
                width: 10
            });
            expect(grid.cellWidth()).toBe(60);
        });

        it('should return cellWidth passed in options', () => {
            const grid = new window.GridStackUI(document.createElement('div'), {
                cellWidth: 40,
                cellHeight: 80,
                width: 12
            });
            expect(grid.cellWidth()).toBe(40);
        });
    });

    describe('grid.minWidth', () => {
        it('should set data-gs-min-width to 2', () => {
            const grid = new window.GridStackUI(document.createElement('div'));
            const cell = document.createElement('div');
            grid.addWidget(cell);
            grid.minWidth(cell, 2);
            expect(cell.getAttribute('data-gs-min-width')).toBe('2');
        });
    });

    describe('grid.maxWidth', () => {
        it('should set data-gs-min-width to 2', () => {
            const grid = new window.GridStackUI(document.createElement('div'));
            const cell = document.createElement('div');
            grid.addWidget(cell);
            grid.maxWidth(cell, 2);
            expect(cell.getAttribute('data-gs-max-width')).toBe('2');
        });
    });

    describe('grid.minHeight', () => {
        it('should set data-gs-min-height to 2', () => {
            const grid = new window.GridStackUI(document.createElement('div'), {
                cellHeight: 80
            });
            const cell = document.createElement('div');
            grid.addWidget(cell);
            grid.minHeight(cell, 2);
            expect(cell.getAttribute('data-gs-min-height')).toBe('2');
        });
    });

    describe('grid.maxHeight', () => {
        it('should set data-gs-min-height to 2', () => {
            const grid = new window.GridStackUI(document.createElement('div'), {
                cellHeight: 80
            });
            const cell = document.createElement('div');
            grid.addWidget(cell);
            grid.maxHeight(cell, 2);
            expect(cell.getAttribute('data-gs-max-height')).toBe('2');
        });
    });

    describe('grid.isAreaEmpty', () => {
        beforeEach(function() {
            document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should set return false', () => {
            const grid = new window.GridStackUI(document.querySelector('.grid-stack'), {
                cellHeight: 80
            });
            expect(grid.isAreaEmpty(1, 1, 1, 1)).toBe(false);
        });
        it('should set return true', () => {
            const grid = new window.GridStackUI(document.querySelector('.grid-stack'), {
                cellHeight: 80
            });
            expect(grid.isAreaEmpty(5, 5, 1, 1)).toBe(true);
        });
    });

    describe('grid method _packNodes with float', () => {
        beforeEach(function() {
            document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should allow same x, y coordinates for widgets', () => {
            var grid = new window.GridStackUI(document.querySelector('.grid-stack'), {
                cellHeight: 80,
                float: true
            });
            var items = $('.grid-stack-item');
            var $el;
            var $oldEl;
            for (var i = 0; i < items.length; i++) {
                $el = $(grid.addWidget(items[i]));
                $oldEl = $(items[i]);
                expect(parseInt($oldEl.attr('data-gs-x'), 10)).toBe(parseInt($el.attr('data-gs-x'), 10));
                expect(parseInt($oldEl.attr('data-gs-y'), 10)).toBe(parseInt($el.attr('data-gs-y'), 10));
            }
        });
        it('should not allow same x, y coordinates for widgets', () => {
            var grid = new window.GridStackUI(document.querySelector('.grid-stack'), {
                cellHeight: 80
            });
            var items = $('.grid-stack-item');
            var $el;
            var $oldEl;
            var newY;
            var oldY;
            for (var i = 0; i < items.length; i++) {
                $oldEl = $.extend(true, {}, $(items[i]));
                newY = parseInt($oldEl.attr('data-gs-y'), 10) + 5;
                $oldEl.attr('data-gs-y', newY);
                $el = $(grid.addWidget($oldEl));
                expect(parseInt($el.attr('data-gs-y'), 10)).not.toBe(newY);
            }
        });
    });

    describe('grid method addWidget with all parameters', () => {
        beforeEach(function() {
            document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should allow same x, y coordinates for widgets', () => {
            var grid = new window.GridStackUI(document.querySelector('.grid-stack'), {
                cellHeight: 80,
                float: true
            });
            var widgetHTML =
                '   <div class="grid-stack-item">' +
                '       <div class="grid-stack-item-content"></div>' +
                '   </div>';
            var widget = grid.addWidget(widgetHTML, 6, 7, 2, 3, false, 1, 4, 2, 5, 'coolWidget');
            var $widget = $(widget);
            expect(parseInt($widget.attr('data-gs-x'), 10)).toBe(6);
            expect(parseInt($widget.attr('data-gs-y'), 10)).toBe(7);
            expect(parseInt($widget.attr('data-gs-width'), 10)).toBe(2);
            expect(parseInt($widget.attr('data-gs-height'), 10)).toBe(3);
            expect($widget.attr('data-gs-auto-position')).toBe(undefined);
            expect(parseInt($widget.attr('data-gs-min-width'), 10)).toBe(1);
            expect(parseInt($widget.attr('data-gs-max-width'), 10)).toBe(4);
            expect(parseInt($widget.attr('data-gs-min-height'), 10)).toBe(2);
            expect(parseInt($widget.attr('data-gs-max-height'), 10)).toBe(5);
            expect($widget.attr('data-gs-id')).toBe('coolWidget');
        });
    });

    describe('grid method addWidget with autoPosition true', () => {
        beforeEach(function() {
            document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should change x, y coordinates for widgets', () => {
            var grid = new window.GridStackUI(document.querySelector('.grid-stack'), {
                cellHeight: 80
            });
            var widgetHTML =
                '   <div class="grid-stack-item">' +
                '       <div class="grid-stack-item-content"></div>' +
                '   </div>';
            var widget = grid.addWidget(widgetHTML, 9, 7, 2, 3, true);
            var $widget = $(widget);
            expect(parseInt($widget.attr('data-gs-x'), 10)).not.toBe(6);
            expect(parseInt($widget.attr('data-gs-y'), 10)).not.toBe(7);
        });
    });

    describe('grid.destroy', () => {
        beforeEach(function() {
            document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
        });
        afterEach(function() {
            //document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should cleanup gridstack', () => {
            var grid = new window.GridStackUI(document.querySelector('.grid-stack'), {
                cellHeight: 80
            });
            grid.destroy();
            expect($('.grid-stack').length).toBe(0);
            expect(grid.grid).toBe(null);
        });
        it('should cleanup gridstack but leave elements', () => {
            var grid = new window.GridStackUI(document.querySelector('.grid-stack'), {
                cellHeight: 80
            });
            grid.destroy(false);
            expect($('.grid-stack').length).toBe(1);
            expect($('.grid-stack-item').length).toBe(2);
            expect(grid.grid).toBe(null);
            grid.destroy();
        });
    });

    describe('grid.resize', () => {
        beforeEach(function() {
            document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should resize widget', () => {
            var grid = new window.GridStackUI(document.querySelector('.grid-stack'), {
                cellHeight: 80
            });
            var items = $('.grid-stack-item');
            grid.resize(items[0], 5, 5);
            expect(parseInt($(items[0]).attr('data-gs-width'), 10)).toBe(5);
            expect(parseInt($(items[0]).attr('data-gs-height'), 10)).toBe(5);
        });
    });

    describe('grid.move', () => {
        beforeEach(function() {
            document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should move widget', () => {
            var grid = new window.GridStackUI(document.querySelector('.grid-stack'), {
                cellHeight: 80,
                float: true
            });
            var items = $('.grid-stack-item');
            grid.move(items[0], 5, 5);
            expect(parseInt($(items[0]).attr('data-gs-x'), 10)).toBe(5);
            expect(parseInt($(items[0]).attr('data-gs-y'), 10)).toBe(5);
        });
    });

    describe('grid.moveNode', () => {
        beforeEach(function() {
            document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should do nothing and return node', () => {
            var grid = new window.GridStackUI(document.querySelector('.grid-stack'), {
                cellHeight: 80
            });
            var items = $('.grid-stack-item');
            grid._updateElement(items[0], function(el, node) {
                var newNode = grid.grid.moveNode(node);
                expect(newNode).toBe(node);
            });
        });
        it('should do nothing and return node', () => {
            var grid = new window.GridStackUI(document.querySelector('.grid-stack'), {
                cellHeight: 80
            });
            var items = $('.grid-stack-item');
            grid.minWidth(items[0], 1);
            grid.maxWidth(items[0], 2);
            grid.minHeight(items[0], 1);
            grid.maxHeight(items[0], 2);
            grid._updateElement(items[0], function(el, node) {
                var newNode = grid.grid.moveNode(node);
                expect(newNode).toBe(node);
            });
        });
    });

    describe('grid.update', () => {
        beforeEach(function() {
            document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should move and resize widget', () => {
            var grid = new window.GridStackUI(document.querySelector('.grid-stack'), {
                cellHeight: 80,
                float: true
            });
            var items = $('.grid-stack-item');
            grid.update(items[0], 5, 5, 5 ,5);
            expect(parseInt($(items[0]).attr('data-gs-width'), 10)).toBe(5);
            expect(parseInt($(items[0]).attr('data-gs-height'), 10)).toBe(5);
            expect(parseInt($(items[0]).attr('data-gs-x'), 10)).toBe(5);
            expect(parseInt($(items[0]).attr('data-gs-y'), 10)).toBe(5);
        });
    });

    describe('grid.opts.rtl', () => {
        beforeEach(function() {
            document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should add grid-stack-rtl class', () => {
            var grid = new window.GridStackUI(document.querySelector('.grid-stack'), {
                cellHeight: 80,
                verticalMargin: 10,
                rtl: true
            });
            expect($('.grid-stack').hasClass('grid-stack-rtl')).toBe(true);
        });
        it('should not add grid-stack-rtl class', () => {
            var grid = new window.GridStackUI(document.querySelector('.grid-stack'), {
                cellHeight: 80,
                verticalMargin: 10
            });
            expect($('.grid-stack').hasClass('grid-stack-rtl')).toBe(false);
        });
    });

    xdescribe('grid.enableMove', () => {
        beforeEach(function() {
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should enable move', () => {
            var grid = new window.GridStackUI(document.querySelector('.grid-stack'), {
                cellHeight: 80,
                verticalMargin: 10,
                minWidth: 1,
                disableDrag: true
            });
            var items = $('.grid-stack-item');
            expect(grid.opts.disableDrag).toBe(true);
            grid.enableMove(true, true);
            for (var i = 0; i < items.length; i++) {
                expect($(items[i]).hasClass('ui-draggable-handle')).toBe(true);
            }
            expect(grid.opts.disableDrag).toBe(false);
        });
        it('should disable move', () => {
            var grid = new window.GridStackUI(document.querySelector('.grid-stack'), {
                cellHeight: 80,
                verticalMargin: 10,
                minWidth: 1
            });
            var items = $('.grid-stack-item');
            grid.enableMove(false);
            for (var i = 0; i < items.length; i++) {
                expect($(items[i]).hasClass('ui-draggable-handle')).toBe(false);
            }
            expect(grid.opts.disableDrag).toBe(false);
        });
    });

    xdescribe('grid.enableResize', () => {
        beforeEach(function() {
            document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should enable resize', () => {
            var grid = new window.GridStackUI(document.querySelector('.grid-stack'), {
                cellHeight: 80,
                verticalMargin: 10,
                minWidth: 1,
                disableResize: true
            });
            var items = $('.grid-stack-item');
            expect(grid.opts.disableResize).toBe(true);
            grid.enableResize(true, true);
            for (var i = 0; i < items.length; i++) {
                expect(($(items[i]).resizable('option','disabled'))).toBe(false);
            }
            expect(grid.opts.disableResize).toBe(false);
        });
        it('should disable resize', () => {
            var grid = new window.GridStackUI(document.querySelector('.grid-stack'), {
                cellHeight: 80,
                verticalMargin: 10,
                minWidth: 1
            });
            var items = $('.grid-stack-item');
            grid.enableResize(false);
            for (var i = 0; i < items.length; i++) {
                expect(($(items[i]).resizable('option','disabled'))).toBe(true);
            }
            expect(grid.opts.disableResize).toBe(false);
        });
    });

    xdescribe('grid.enable', () => {
        beforeEach(function() {
            document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should enable movable and resizable', () => {
            var grid = new window.GridStackUI(document.querySelector('.grid-stack'), {
                cellHeight: 80,
                verticalMargin: 10,
                minWidth: 1
            });
            var items = $('.grid-stack-item');
            grid.enableResize(false);
            grid.enableMove(false);
            for (var i = 0; i < items.length; i++) {
                expect($(items[i]).hasClass('ui-draggable-handle')).toBe(false);
                expect(($(items[i]).resizable('option','disabled'))).toBe(true);
            }
            grid.enable();
            for (var j = 0; j < items.length; j++) {
                expect($(items[j]).hasClass('ui-draggable-handle')).toBe(true);
                expect(($(items[j]).resizable('option','disabled'))).toBe(false);
            }
        });
    });

    describe('grid.enable', () => {
        beforeEach(function() {
            document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should lock widgets', () => {
            var grid = new window.GridStackUI(document.querySelector('.grid-stack'), {
                cellHeight: 80,
                verticalMargin: 10
            });
            var items = $('.grid-stack-item');
            for (var i = 0; i < items.length; i++) {
                grid.locked(items[i], true);
                expect($(items[i]).attr('data-gs-locked')).toBe('yes');
            }
        });
        it('should unlock widgets', () => {
            var grid = new window.GridStackUI(document.querySelector('.grid-stack'), {
                cellHeight: 80,
                verticalMargin: 10
            });
            var items = $('.grid-stack-item');
            for (var i = 0; i < items.length; i++) {
                grid.locked(items[i], false);
                expect($(items[i]).attr('data-gs-locked')).toBe(undefined);
            }
        });
    });
});
