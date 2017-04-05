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

**packNodes({ hoise: false, maxWidth: Infinity, upgradeId: null, nodes: Nodes[] })**

**trackDrag(element, action => {})**

**dragNode({ params, node: Node, start: { x: PX, y: PX }, end: { x: PX, y: PX } })**

**getRight(nodes: Node[])**

**getBottom(nodes: Node[])**

**findNode(nodes: Node[], x, y)**

## License

MIT © [Bogdan Chadkin](mailto:trysound@yandex.ru)
