---
title: Size
order: 5
---

<embed src="@/docs/api/common/style.md"></embed>

line layer`size`Method can set the width and height of the line.

### ILineSize: number | \[number, number]

- If the size type is number, it represents the width of the line
- The size type is \[number, number] representing width and height respectively.

```javascript
lineLayer.size(1); // The width of the line is 1
lineLayer.size([1, 2]); // Width is 1, height is 2
```

### size(width: ILineSize)

The width value of the line layer can be set directly. All lines in the layer use one width.

```js
layer.size(2);
```

### size(field: string)

The width of the line layer can be mapped based on the data values ​​accepted by the layer, accepting fields of incoming data as arguments.

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

### size(field: string, domain: ILineSize\[])

`size`Method supports simple value mapping and will be based on`field`The values ​​extracted from the data passed into the layer are mapped to`domain`in the value range.

```js
layer.size('type', [1, 2, 3]);
```

### size(field: string, callback: () => ILineSize )

`size`The method supports the writing method of callback function, which will be based on`field`as`callback`method parameters,`callback`The return value of the method is the actual width and height of the line layer.

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
