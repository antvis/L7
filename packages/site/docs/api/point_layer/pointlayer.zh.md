---
title: PointLayer
order: 0
---

<embed src="@/docs/common/style.md"></embed>

## 简介

点图层一组经纬度数据来描述一系列点在地图上的位置，这些点可以是普通的圆点，也可以是文字、图标、柱子等。  
用户可以通过配置 `shape` 参数来选择点的类型，同时通过 `style`、`size`、`color` 方法调整点的样式。

```javascript
import { PointLayer } from '@antv/l7';

const layer = PointLayer({
  zIndex: 2,
})
  .source(data.list, {
    type: 'array',
    x: 'j',
    y: 'w',
  })
  .shape('cylinder')
  .size('t', (level) => {
    return [4, 4, level + 40];
  })
  .color('t', [
    '#002466',
    '#105CB3',
    '#2894E0',
    '#CFF6FF',
    '#FFF5B8',
    '#FFAB5C',
    '#F27049',
    '#730D1C',
  ]);
```
