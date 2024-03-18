---
title: Size
order: 5
---

<embed src="@/docs/api/common/style.md"></embed>

线图层的 `size` 方法可以设置线的宽度和高度。

### ILineSize: number | [number, number]

- size 类型为 number 则表示 line 的宽度
- size 类型为 [number , number] 分别表示宽度和高度

```javascript
lineLayer.size(1); // 线的宽度为 1
lineLayer.size([1, 2]); // 宽度为1，高度2
```

### size(width: ILineSize)

线图层可以直接设置宽度值。图层中所有的线使用一个宽度。

```js
layer.size(2);
```

### size(field: string)

线图层的宽度可以根据图层接受的数据值进行映射，接受传入数据的字段作为参数。

```js
layer.source({
  type: 'Feature',
  properties: {
    lineSize: 2,
  },
  geometry: {
    type: 'LineString',
    coordinates: [
      [119.988511, 30.269614],
      [119.9851, 30.269323],
      [119.99271, 30.22088],
    ],
  },
});
layer.size('lineSize');
```

### size(field: string, domain: ILineSize[])

`size` 方法支持简单的值映射，将根据 `field` 从传入图层的数据中提取的值映射到 `domain` 值域中。

```js
layer.size('type', [1, 2, 3]);
```

### size(field: string, callback: () => ILineSize )

`size` 方法支持回调函数的写法，将根据 `field` 作为 `callback` 方法的参数，`callback` 方法的返回值作为线图层实际的宽高。

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
