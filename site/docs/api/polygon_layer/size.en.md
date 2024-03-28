---
title: Size
order: 5
---

<embed src="@/docs/api/common/style.md"></embed>

`size`Method used to set the height of the Polygon

### IPointSize: number ｜\[number, number] | \[number, number, number]

- The size type is number, which represents the height of the Polygon.

```javascript
pointLayer.size(1);
```

### size(width: IPointSize)

The radius can be set directly on the polygon layer. All points in the layer use a height.

```js
layer.size(2);
```

### size(field: string)

The height of a polygon layer can be mapped based on the data values ​​accepted by the layer, accepting fields of incoming data as parameters.

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

### size(field: string, domain: IPointSize\[])

`size`Method supports simple value mapping and will be based on`field`The values ​​extracted from the data passed into the layer are mapped to`domain`in the value range.

```js
layer.size('type', [1, 2, 3]);
```

### size(field: string, callback: () => IPointSize )

`size`The method supports the writing method of callback function, which will be based on`field`as`callback`method parameters,`callback`The return value of the method is the actual height of the polygon layer.

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
