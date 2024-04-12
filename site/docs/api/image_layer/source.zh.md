---
title: Source
order: 2
---

<embed src="@/docs/api/common/style.md"></embed>

`imagelayer` 通过提供在线图片的 `url` 指定数据，通过 `extent` 指定图片在地图上的矩形范围的位置。

```js
layer.source('https://gw.alipayobjects.com/zos/rmsportal/FnHFeFklTzKDdUESRNDv.jpg', {
  parser: {
    type: 'image',
    extent: [121.168, 30.2828, 121.384, 30.4219],
  },
});
```

也可通过 `coordinates` 指定一系列坐，来定义图片在地图上的不规则形状范围的位置。

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
