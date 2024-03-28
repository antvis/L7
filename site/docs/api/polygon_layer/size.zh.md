---
title: Size
order: 5
---

<embed src="@/docs/api/common/style.md"></embed>

`size` 方法用于设置 Polygon 的高度

### IPointSize: number ｜[number, number] | [number, number, number]

- size 类型为 number 则表示 Polygon 的高度

```javascript
pointLayer.size(1);
```

### size(width: IPointSize)

面图层可以直接设置半径。图层中所有的点使用一个高度。

```js
layer.size(2);
```

### size(field: string)

面图层的高度可以根据图层接受的数据值进行映射，接受传入数据的字段作为参数。

```js
layer.source([
  {
    lng: 120,
    lat: 30,
    r: 2,
  },
]);
layer.size('r');
```

### size(field: string, domain: IPointSize[])

`size` 方法支持简单的值映射，将根据 `field` 从传入图层的数据中提取的值映射到 `domain` 值域中。

```js
layer.size('type', [1, 2, 3]);
```

### size(field: string, callback: () => IPointSize )

`size` 方法支持回调函数的写法，将根据 `field` 作为 `callback` 方法的参数，`callback` 方法的返回值作为面图层实际高度。

```js
layer.size('type', (value) => {
  switch (value) {
    case 'path':
      return 1;
    case 'road':
      return 2;
  }
});
```
