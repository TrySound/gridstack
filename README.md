# gridstack [![Build Status][travis-img]][travis]

[travis-img]: https://travis-ci.org/TrySound/gridstack.svg
[travis]: https://travis-ci.org/TrySound/gridstack

Packable layout library

## API

```js
type Node = {
    id: number | string,
    x: number,
    y: number,
    width: number,
    height: number
};
```

```js
type Params = {
    cellWidth: Number,
    cellHeight: Number,
    resize?: {
        width: 6,
        top: false,
        right: false,
        bottom: false,
        left: false
    }
};
```

**packNodes({ hoist: false, maxWidth: Infinity, upgradeId: null, nodes: Nodes[] })**

**trackDrag({ container, mouseMoveOffset = 6, validateStartTarget: Element => true, action => {} })**

**dragNode({ params: Params, node: Node, action: { startX: PX, startY: PX, endX: PX, endY: PX } })**

**getRight(nodes: Node[])**

**getBottom(nodes: Node[])**

**findNode(nodes: Node[], x, y)**

## License

MIT © [Bogdan Chadkin](mailto:trysound@yandex.ru)
