---
title: Source
order: 2
---

<embed src="@/docs/common/style.md"></embed>

`imagelayer` 通过提供在线图片的 `url` 指定数据，通过 `extent` 指定图片在地图上的位置。

```js
layer.source(
  'https://gw.alipayobjects.com/zos/rmsportal/FnHFeFklTzKDdUESRNDv.jpg',
  {
    parser: {
      type: 'image',
      extent: [121.168, 30.2828, 121.384, 30.4219],
    },
  },
);
```
