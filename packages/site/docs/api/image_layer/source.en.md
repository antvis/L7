---
title: Source
order: 2
---

<embed src="@/docs/api/common/style.md"></embed>

`imagelayer`By providing online pictures`url`Specify data via`extent`Specify the image's location on the map.

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
