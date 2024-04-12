---
title: Source
order: 2
---

<embed src="@/docs/api/common/style.md"></embed>

`imagelayer`By providing online pictures`url`Specify data via`extent`Specifies the position of the image within a rectangular range on the map.

```js
layer.source('https://gw.alipayobjects.com/zos/rmsportal/FnHFeFklTzKDdUESRNDv.jpg', {
  parser: {
    type: 'image',
    extent: [121.168, 30.2828, 121.384, 30.4219],
  },
});
```

Also available via`coordinates`Specify a series of locations that define the location of the image within an irregularly shaped range on the map.

```js
layer.source('https://gw.alipayobjects.com/zos/rmsportal/FnHFeFklTzKDdUESRNDv.jpg', {
  parser: {
    type: 'image',
    coordinates: [
      [100.959388, 41.619522],
      [101.229887, 41.572654],
      [101.16971, 41.377836],
      [100.900015, 41.424628],
    ],
  },
});
```
