# gridstack [![Build Status][travis-img]][travis]

[travis-img]: https://travis-ci.org/TrySound/gridstack.svg
[travis]: https://travis-ci.org/TrySound/gridstack

Packable layout library

## API

```js
type Node = {
    id: number | string,
    // cells
    x: number,
    y: number,
    width: number,
    height: number,
    static: boolean
}
```

### packNodes

```js
packNodes({
    hoist: false,
    containerWidth: Infinity, // cells
    updatingId: null,
    nodes: Nodes[]
}): Nodes[]
```

### trackDrag

```js
trackDrag({
    container: HTMLElement,
    mouseMoveOffset = 2, // pixels
    isDraggable: Element => boolean
    dispatch: (action, startTarget: HTMLElement) => void
})
```

### dragNode

```js
type Params = {
    cellWidth: Number, // pixels
    cellHeight: Number, // pixels
    minWidth?: 1, // cell
    maxWidth?: Infinity, // cell
    minHeight?: 1, // cell
    maxHeight?: Infinity, // cell
    padding?: 0, // pixels
    resize?: {
        width: 6, // pixels
        top: false,
        right: false,
        bottom: false,
        left: false
    }
}
```

```js
type DragResult = null | {
    type: 'resize' | 'move',
    // pixels
    element: { x: number, y: number, width: number, height: number },
    node: Node
}
```

```js
dragNode({
    params: Params,
    node: Node,
    // pixels
    action: { startX: number, startY: number, endX: number, endY: number }
}): DragResult
```

### utils

```js
getRight(nodes: Node[]): number // cells

getBottom(nodes: Node[]): number // cells

// takes cells
findNode(nodes: Node[], x: number, y: number): Node
```

## License

MIT © [Bogdan Chadkin](mailto:trysound@yandex.ru)
