---
title: Source
order: 2
---

<embed src="@/docs/api/common/style.md"></embed>

`imagelayer`By providing online pictures`url`Specify data via`extent`Specify the image's location on the map, and can also define the irregular shape range position of the image on the map by specifying a series of coordinates via `coordinates`.


```js
layer.source('https://gw.alipayobjects.com/zos/rmsportal/FnHFeFklTzKDdUESRNDv.jpg', {
  parser: {
    type: 'image',
    extent: [121.168, 30.2828, 121.384, 30.4219],
  },
});
```

```js
layer.source('https://gw.alipayobjects.com/zos/rmsportal/FnHFeFklTzKDdUESRNDv.jpg', {
  parser: {
    type: 'image',
    coordinates: [
      [100.959388, 41.619522],
      [101.229887, 41.572654],
      [101.16971, 41.377836],
      [100.900015, 41.424628],
    ]
  },
});
```
