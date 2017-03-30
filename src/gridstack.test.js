/* eslint-env jasmine */
import $ from 'jquery';
import './gridstack.js';

describe('gridstack', () => {
    const gridstackHTML = `
        <div class="grid-stack">
           <div class="grid-stack-item" data-gs-x="0" data-gs-y="0" data-gs-width="4" data-gs-height="2">
               <div class="grid-stack-item-content"></div>
           </div>
            <div class="grid-stack-item" data-gs-x="4" data-gs-y="0" data-gs-width="4" data-gs-height="4">
                <div class="grid-stack-item-content"></div>
            </div>
        </div>
    `;

    it('getCellFromPixel method computes cell from pixel coords', () => {
        const grid = new window.GridStackUI(document.createElement('div'), {
            cellWidth: 60,
            cellHeight: 60
        });
        const cell = grid.getCellFromPixel({ left: 72, top: 125 });
        expect(cell).toEqual({ x: 1, y: 2 });
    });

    it('getCellFromPixel method computes cell in empty grid', () => {
        const grid = new window.GridStackUI(document.createElement('div'), {
            cellHeight: 80
        });
        const cell = grid.getCellFromPixel({ left: 72, top: 100 });
        expect(cell).toEqual({ x: 1, y: 1 });
    });

    it('cellWidth method returns default cellWidth', () => {
        const grid = new window.GridStackUI(document.createElement('div'), {
            cellHeight: 80,
            width: 10
        });
        expect(grid.cellWidth()).toBe(60);
    });

    it('cellWidth method returns value passed in options', () => {
        const grid = new window.GridStackUI(document.createElement('div'), {
            cellWidth: 40,
            cellHeight: 80,
            width: 12
        });
        expect(grid.cellWidth()).toBe(40);
    });

    it('minWidth method sets attribute', () => {
        const grid = new window.GridStackUI(document.createElement('div'));
        const cell = document.createElement('div');
        grid.addWidget(cell);
        grid.minWidth(cell, 2);
        expect(cell.getAttribute('data-gs-min-width')).toBe('2');
    });

    it('maxWidth method sets attribute', () => {
        const grid = new window.GridStackUI(document.createElement('div'));
        const cell = document.createElement('div');
        grid.addWidget(cell);
        grid.maxWidth(cell, 2);
        expect(cell.getAttribute('data-gs-max-width')).toBe('2');
    });

    it('minHeight method sets attribute', () => {
        const grid = new window.GridStackUI(document.createElement('div'), {
            cellHeight: 80
        });
        const cell = document.createElement('div');
        grid.addWidget(cell);
        grid.minHeight(cell, 2);
        expect(cell.getAttribute('data-gs-min-height')).toBe('2');
    });

    it('maxHeight method sets attribute', () => {
        const grid = new window.GridStackUI(document.createElement('div'), {
            cellHeight: 80
        });
        const cell = document.createElement('div');
        grid.addWidget(cell);
        grid.maxHeight(cell, 2);
        expect(cell.getAttribute('data-gs-max-height')).toBe('2');
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
            const grid = new window.GridStackUI(document.querySelector('.grid-stack'), {
                cellHeight: 80,
                float: true
            });
            const items = $('.grid-stack-item');
            let $el;
            let $oldEl;
            for (let i = 0; i < items.length; i++) {
                $el = $(grid.addWidget(items[i]));
                $oldEl = $(items[i]);
                expect($oldEl.attr('data-gs-x')).toBe($el.attr('data-gs-x'));
                expect($oldEl.attr('data-gs-y')).toBe($el.attr('data-gs-y'));
            }
        });
        it('should not allow same x, y coordinates for widgets', () => {
            const grid = new window.GridStackUI(document.querySelector('.grid-stack'), {
                cellHeight: 80
            });
            const items = $('.grid-stack-item');
            let $el;
            let $oldEl;
            let newY;
            for (let i = 0; i < items.length; i++) {
                $oldEl = $.extend(true, {}, $(items[i]));
                newY = parseInt($oldEl.attr('data-gs-y'), 10) + 5;
                $oldEl.attr('data-gs-y', newY);
                $el = $(grid.addWidget($oldEl));
                expect(parseInt($el.attr('data-gs-y'), 10)).not.toBe(newY);
            }
        });
    });

    it('addWidget method with all parameters', () => {
        const grid = new window.GridStackUI(document.createElement('div'), {
            cellHeight: 80,
            float: true
        });
        const cell = document.createElement('div');
        grid.addWidget(cell, 6, 7, 2, 3, false, 1, 4, 2, 5, 'coolWidget');
        expect({
            x: cell.getAttribute('data-gs-x'),
            y: cell.getAttribute('data-gs-y'),
            width: cell.getAttribute('data-gs-width'),
            height: cell.getAttribute('data-gs-height'),
            autoPosition: cell.getAttribute('data-gs-auto-position'),
            minWidth: cell.getAttribute('data-gs-min-width'),
            maxWidth: cell.getAttribute('data-gs-max-width'),
            minHeight: cell.getAttribute('data-gs-min-height'),
            maxHeight: cell.getAttribute('data-gs-max-height'),
            id: cell.getAttribute('data-gs-id')
        }).toEqual({
            x: '6',
            y: '7',
            width: '2',
            height: '3',
            autoPosition: null,
            minWidth: '1',
            maxWidth: '4',
            minHeight: '2',
            maxHeight: '5',
            id: 'coolWidget'
        });
    });

    it('addWidget sets attributes with inferred params if autoPosition is true', () => {
        const grid = new window.GridStackUI(document.createElement('div'), {
            cellHeight: 80
        });
        grid.addWidget(document.createElement('div'), 0, 0, 4, 2);
        grid.addWidget(document.createElement('div'), 4, 0, 4, 4);
        const cell = document.createElement('div');
        grid.addWidget(cell, 9, 7, 2, 3, true);
        expect({
            x: cell.getAttribute('data-gs-x'),
            y: cell.getAttribute('data-gs-y')
        }).toEqual({
            x: '8',
            y: '0'
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
            const grid = new window.GridStackUI(document.querySelector('.grid-stack'), {
                cellHeight: 80
            });
            grid.destroy();
            expect($('.grid-stack').length).toBe(0);
            expect(grid.grid).toBe(null);
        });
        it('should cleanup gridstack but leave elements', () => {
            const grid = new window.GridStackUI(document.querySelector('.grid-stack'), {
                cellHeight: 80
            });
            grid.destroy(false);
            expect($('.grid-stack').length).toBe(1);
            expect($('.grid-stack-item').length).toBe(2);
            expect(grid.grid).toBe(null);
            grid.destroy();
        });
    });

    it('resize method sets width and height attributes', () => {
        const grid = new window.GridStackUI(document.createElement('div'));
        const cell = document.createElement('div');
        grid.addWidget(cell);
        grid.resize(cell, 5, 10);
        expect({
            width: cell.getAttribute('data-gs-width'),
            height: cell.getAttribute('data-gs-height')
        }).toEqual({
            width: '5',
            height: '10'
        });
    });

    it('move method sets x and y attributes', () => {
        const grid = new window.GridStackUI(document.createElement('div'), {
            cellHeight: 80,
            float: true
        });
        const cell = document.createElement('div');
        grid.addWidget(cell);
        grid.move(cell, 5, 10);
        expect({
            x: cell.getAttribute('data-gs-x'),
            y: cell.getAttribute('data-gs-y')
        }).toEqual({
            x: '5',
            y: '10'
        });
    });

    // TODO engine method
    describe('grid.moveNode', () => {
        beforeEach(function() {
            document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should do nothing and return node', () => {
            const grid = new window.GridStackUI(document.querySelector('.grid-stack'), {
                cellHeight: 80
            });
            const items = $('.grid-stack-item');
            grid._updateElement(items[0], function(el, node) {
                const newNode = grid.grid.moveNode(node);
                expect(newNode).toBe(node);
            });
        });
        it('should do nothing and return node', () => {
            const grid = new window.GridStackUI(document.querySelector('.grid-stack'), {
                cellHeight: 80
            });
            const items = $('.grid-stack-item');
            grid.minWidth(items[0], 1);
            grid.maxWidth(items[0], 2);
            grid.minHeight(items[0], 1);
            grid.maxHeight(items[0], 2);
            grid._updateElement(items[0], function(el, node) {
                const newNode = grid.grid.moveNode(node);
                expect(newNode).toBe(node);
            });
        });
    });

    it('update method sets attributes', () => {
        const grid = new window.GridStackUI(document.createElement('div'), {
            float: true
        });
        const cell = document.createElement('div');
        grid.addWidget(cell);
        grid.update(cell, 5, 6, 7, 8);
        expect({
            x: cell.getAttribute('data-gs-x'),
            y: cell.getAttribute('data-gs-y'),
            width: cell.getAttribute('data-gs-width'),
            height: cell.getAttribute('data-gs-height')
        }).toEqual({
            x: '5',
            y: '6',
            width: '7',
            height: '8'
        });
    });

    it('rtl option adds grid-stack-rtl class', () => {
        const container = document.createElement('div');
        new window.GridStackUI(container, {
            rtl: true
        });
        expect(container.classList.contains('grid-stack-rtl')).toEqual(true);
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
            const grid = new window.GridStackUI(document.querySelector('.grid-stack'), {
                cellHeight: 80,
                verticalMargin: 10,
                minWidth: 1,
                disableDrag: true
            });
            const items = $('.grid-stack-item');
            expect(grid.opts.disableDrag).toBe(true);
            grid.enableMove(true, true);
            for (let i = 0; i < items.length; i++) {
                expect($(items[i]).hasClass('ui-draggable-handle')).toBe(true);
            }
            expect(grid.opts.disableDrag).toBe(false);
        });
        it('should disable move', () => {
            const grid = new window.GridStackUI(document.querySelector('.grid-stack'), {
                cellHeight: 80,
                verticalMargin: 10,
                minWidth: 1
            });
            const items = $('.grid-stack-item');
            grid.enableMove(false);
            for (let i = 0; i < items.length; i++) {
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
            const grid = new window.GridStackUI(document.querySelector('.grid-stack'), {
                cellHeight: 80,
                verticalMargin: 10,
                minWidth: 1,
                disableResize: true
            });
            const items = $('.grid-stack-item');
            expect(grid.opts.disableResize).toBe(true);
            grid.enableResize(true, true);
            for (let i = 0; i < items.length; i++) {
                expect(($(items[i]).resizable('option','disabled'))).toBe(false);
            }
            expect(grid.opts.disableResize).toBe(false);
        });
        it('should disable resize', () => {
            const grid = new window.GridStackUI(document.querySelector('.grid-stack'), {
                cellHeight: 80,
                verticalMargin: 10,
                minWidth: 1
            });
            const items = $('.grid-stack-item');
            grid.enableResize(false);
            for (let i = 0; i < items.length; i++) {
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
            const grid = new window.GridStackUI(document.querySelector('.grid-stack'), {
                cellHeight: 80,
                verticalMargin: 10,
                minWidth: 1
            });
            const items = $('.grid-stack-item');
            grid.enableResize(false);
            grid.enableMove(false);
            for (let i = 0; i < items.length; i++) {
                expect($(items[i]).hasClass('ui-draggable-handle')).toBe(false);
                expect(($(items[i]).resizable('option','disabled'))).toBe(true);
            }
            grid.enable();
            for (let j = 0; j < items.length; j++) {
                expect($(items[j]).hasClass('ui-draggable-handle')).toBe(true);
                expect(($(items[j]).resizable('option','disabled'))).toBe(false);
            }
        });
    });

    it('lock widget', () => {
        const grid = new window.GridStackUI(document.querySelector('.grid-stack'));
        const cell = document.createElement('div');
        grid.addWidget(cell);
        grid.locked(cell, true);
        expect(cell.getAttribute('data-gs-locked')).toEqual('yes');
    });

    it('unlock widget', () => {
        const grid = new window.GridStackUI(document.querySelector('.grid-stack'));
        const cell = document.createElement('div');
        grid.addWidget(cell);
        grid.locked(cell, true);
        grid.locked(cell, false);
        expect(cell.getAttribute('data-gs-locked')).toEqual(null);
    });
});
