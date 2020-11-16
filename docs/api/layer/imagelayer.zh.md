---
title: 图片图层
order: 5
---

`markdown:docs/common/style.md`

## 简介

将图片添加到地图上，需要指定图片的经纬度范围

## 使用

```javascript
import { ImageLayer } from '@antv/l7';
```

### 代码示例

```javascript
const layer = new ImageLayer({});
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
