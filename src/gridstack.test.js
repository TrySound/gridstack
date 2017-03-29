import $ from 'jquery';
import './gridstack.js';

describe('gridstack', function() {
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

    describe('grid._setStaticClass', function() {
        beforeEach(function() {
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should add class grid-stack-static to the container.', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10,
                staticGrid: true
            };
            $('.grid-stack').gridstack(options);
            $('.grid-stack').removeClass('grid-stack-static');
            var grid = $('.grid-stack').data('gridstack');
            grid._setStaticClass();
            expect($('.grid-stack').hasClass('grid-stack-static')).toBe(true);
        });
        it('should remove class grid-stack-static from the container.', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10,
                staticGrid: false
            };
            $('.grid-stack').gridstack(options);
            $('.grid-stack').addClass('grid-stack-static');
            var grid = $('.grid-stack').data('gridstack');
            grid._setStaticClass();
            expect($('.grid-stack').hasClass('grid-stack-static')).toBe(false);
        });
    });

    describe('grid.getCellFromPixel', function() {
        it('should compute cell from pixel coords', function() {
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

    describe('grid.minWidth', function() {
        beforeEach(function() {
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should set data-gs-min-width to 2.', function() {
            var options = {
                cellHeight: 80
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            var items = $('.grid-stack-item');
            for (var i = 0; i < items.length; i++) {
                grid.minWidth(items[i], 2);
            }
            for (var j = 0; j < items.length; j++) {
                expect(parseInt($(items[j]).attr('data-gs-min-width'), 10)).toBe(2);
            }
        });
    });

    describe('grid.maxWidth', function() {
        beforeEach(function() {
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should set data-gs-min-width to 2.', function() {
            var options = {
                cellHeight: 80
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            var items = $('.grid-stack-item');
            for (var i = 0; i < items.length; i++) {
                grid.maxWidth(items[i], 2);
            }
            for (var j = 0; j < items.length; j++) {
                expect(parseInt($(items[j]).attr('data-gs-max-width'), 10)).toBe(2);
            }
        });
    });

    describe('grid.minHeight', function() {
        beforeEach(function() {
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should set data-gs-min-height to 2.', function() {
            var options = {
                cellHeight: 80
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            var items = $('.grid-stack-item');
            for (var i = 0; i < items.length; i++) {
                grid.minHeight(items[i], 2);
            }
            for (var j = 0; j < items.length; j++) {
                expect(parseInt($(items[j]).attr('data-gs-min-height'), 10)).toBe(2);
            }
        });
    });

    describe('grid.maxHeight', function() {
        beforeEach(function() {
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should set data-gs-min-height to 2.', function() {
            var options = {
                cellHeight: 80
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            var items = $('.grid-stack-item');
            for (var i = 0; i < items.length; i++) {
                grid.maxHeight(items[i], 2);
            }
            for (var j = 0; j < items.length; j++) {
                expect(parseInt($(items[j]).attr('data-gs-max-height'), 10)).toBe(2);
            }
        });
    });

    describe('grid.isAreaEmpty', function() {
        beforeEach(function() {
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should set return false.', function() {
            var options = {
                cellHeight: 80
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            var shouldBeFalse = grid.isAreaEmpty(1, 1, 1, 1);
            expect(shouldBeFalse).toBe(false);
        });
        it('should set return true.', function() {
            var options = {
                cellHeight: 80
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            var shouldBeTrue = grid.isAreaEmpty(5, 5, 1, 1);
            expect(shouldBeTrue).toBe(true);
        });
    });

    describe('grid method _packNodes with float', function() {
        beforeEach(function() {
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should allow same x, y coordinates for widgets.', function() {
            var options = {
                cellHeight: 80,
                float: true
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
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
        it('should not allow same x, y coordinates for widgets.', function() {
            var options = {
                cellHeight: 80
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
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

    describe('grid method addWidget with all parameters', function() {
        beforeEach(function() {
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should allow same x, y coordinates for widgets.', function() {
            var options = {
                cellHeight: 80,
                float: true
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
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

    describe('grid method addWidget with autoPosition true', function() {
        beforeEach(function() {
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should change x, y coordinates for widgets.', function() {
            var options = {
                cellHeight: 80
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
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

    describe('grid.destroy', function() {
        beforeEach(function() {
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            //document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should cleanup gridstack', function() {
            var options = {
                cellHeight: 80
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            grid.destroy();
            expect($('.grid-stack').length).toBe(0);
            expect(grid.grid).toBe(null);
        });
        it('should cleanup gridstack but leave elements', function() {
            var options = {
                cellHeight: 80
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            grid.destroy(false);
            expect($('.grid-stack').length).toBe(1);
            expect($('.grid-stack-item').length).toBe(2);
            expect(grid.grid).toBe(null);
            grid.destroy();
        });
    });

    describe('grid.resize', function() {
        beforeEach(function() {
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should resize widget', function() {
            var options = {
                cellHeight: 80
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            var items = $('.grid-stack-item');
            grid.resize(items[0], 5, 5);
            expect(parseInt($(items[0]).attr('data-gs-width'), 10)).toBe(5);
            expect(parseInt($(items[0]).attr('data-gs-height'), 10)).toBe(5);
        });
    });

    describe('grid.move', function() {
        beforeEach(function() {
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should move widget', function() {
            var options = {
                cellHeight: 80,
                float: true
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            var items = $('.grid-stack-item');
            grid.move(items[0], 5, 5);
            expect(parseInt($(items[0]).attr('data-gs-x'), 10)).toBe(5);
            expect(parseInt($(items[0]).attr('data-gs-y'), 10)).toBe(5);
        });
    });

    describe('grid.moveNode', function() {
        beforeEach(function() {
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should do nothing and return node', function() {
            var options = {
                cellHeight: 80
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            var items = $('.grid-stack-item');
            grid._updateElement(items[0], function(el, node) {
                var newNode = grid.grid.moveNode(node);
                expect(newNode).toBe(node);
            });
        });
        it('should do nothing and return node', function() {
            var options = {
                cellHeight: 80
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
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

    describe('grid.update', function() {
        beforeEach(function() {
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should move and resize widget', function() {
            var options = {
                cellHeight: 80,
                float: true
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            var items = $('.grid-stack-item');
            grid.update(items[0], 5, 5, 5 ,5);
            expect(parseInt($(items[0]).attr('data-gs-width'), 10)).toBe(5);
            expect(parseInt($(items[0]).attr('data-gs-height'), 10)).toBe(5);
            expect(parseInt($(items[0]).attr('data-gs-x'), 10)).toBe(5);
            expect(parseInt($(items[0]).attr('data-gs-y'), 10)).toBe(5);
        });
    });

    describe('grid.opts.rtl', function() {
        beforeEach(function() {
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should add grid-stack-rtl class', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10,
                rtl: true
            };
            $('.grid-stack').gridstack(options);
            expect($('.grid-stack').hasClass('grid-stack-rtl')).toBe(true);
        });
        it('should not add grid-stack-rtl class', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            expect($('.grid-stack').hasClass('grid-stack-rtl')).toBe(false);
        });
    });

    xdescribe('grid.enableMove', function() {
        beforeEach(function() {
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should enable move', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10,
                minWidth: 1,
                disableDrag: true
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            var items = $('.grid-stack-item');
            expect(grid.opts.disableDrag).toBe(true);
            grid.enableMove(true, true);
            for (var i = 0; i < items.length; i++) {
                expect($(items[i]).hasClass('ui-draggable-handle')).toBe(true);
            }
            expect(grid.opts.disableDrag).toBe(false);
        });
        it('should disable move', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10,
                minWidth: 1
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            var items = $('.grid-stack-item');
            grid.enableMove(false);
            for (var i = 0; i < items.length; i++) {
                expect($(items[i]).hasClass('ui-draggable-handle')).toBe(false);
            }
            expect(grid.opts.disableDrag).toBe(false);
        });
    });

    xdescribe('grid.enableResize', function() {
        beforeEach(function() {
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should enable resize', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10,
                minWidth: 1,
                disableResize: true
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            var items = $('.grid-stack-item');
            expect(grid.opts.disableResize).toBe(true);
            grid.enableResize(true, true);
            for (var i = 0; i < items.length; i++) {
                expect(($(items[i]).resizable('option','disabled'))).toBe(false);
            }
            expect(grid.opts.disableResize).toBe(false);
        });
        it('should disable resize', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10,
                minWidth: 1
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            var items = $('.grid-stack-item');
            grid.enableResize(false);
            for (var i = 0; i < items.length; i++) {
                expect(($(items[i]).resizable('option','disabled'))).toBe(true);
            }
            expect(grid.opts.disableResize).toBe(false);
        });
    });

    xdescribe('grid.enable', function() {
        beforeEach(function() {
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should enable movable and resizable', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10,
                minWidth: 1
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
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

    describe('grid.enable', function() {
        beforeEach(function() {
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should lock widgets', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            var items = $('.grid-stack-item');
            for (var i = 0; i < items.length; i++) {
                grid.locked(items[i], true);
                expect($(items[i]).attr('data-gs-locked')).toBe('yes');
            }
        });
        it('should unlock widgets', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            var items = $('.grid-stack-item');
            for (var i = 0; i < items.length; i++) {
                grid.locked(items[i], false);
                expect($(items[i]).attr('data-gs-locked')).toBe(undefined);
            }
        });
    });
});
