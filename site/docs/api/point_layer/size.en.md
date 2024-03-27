---
title: Size
order: 5
---

<embed src="@/docs/api/common/style.md"></embed>

`size`Method used to set the size of point layer graphics.

### IPointSize: number ｜\[number, number] | \[number, number, number]

- If the size type is number, it represents the radius of point
- The size type can be \[number, number]|\[number, number, number] indicating the radius and height of the column

```javascript
pointLayer.size(1);
pointLayer.size([2, 10]); // The radius of the pillar is 2x2. The height is 10
pointLayer.size([2, 4, 10]); // The column radius is 2x4 and the height is 10
```

### size(width: IPointSize)

Point layers can set the radius directly. All points in the layer use one width.

```js
layer.size(2);
```

### size(field: string)

The width of a point layer can be mapped based on the data values ​​accepted by the layer, accepting fields of incoming data as arguments.

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

`size`The method supports the writing method of callback function, which will be based on`field`as`callback`method parameters,`callback`The return value of the method is the actual radius of the point layer.

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
