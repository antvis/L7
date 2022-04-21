---
title: Heatmap
order: 0
---

`markdown:docs/common/style.md`

## 简介

热力图是常见的可视化图表，L7 提供了多种表现形式的热力图

- 经典平面热力图
- 3D 热力图
- 网格热力图
- 蜂窝热力图

通过切换 shape 参数，用户可以得到不同的热力图

### 基本用法

```javascript
import { HeatmapLayer } from '@antv/l7';

const layer = new HeatmapLayer({})
  .source(data)
  .shape('heatmap')
  .size('mag', [0, 1.0]) // weight映射通道
  .style({
    intensity: 2,
    radius: 20,
    opacity: 1.0,
    rampColors: {
      colors: [
        '#FF4818',
        '#F7B74A',
        '#FFF598',
        '#F27DEB',
        '#8C1EB2',
        '#421EB2',
      ].reverse(),
      positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
    },
  });
```

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*UWhySqYeOqcAAAAAAAAAAAAAARQnAQ'>

[在线案例 经典热力 classical](../../../examples/heatmap/heatmap#heatmap)  
[在线案例 蜂窝热力 hexagon](../../../examples/heatmap/hexagon#light)  
[在线案例 网格热力 grid](/zh/examples/heatmap/grid#china)

`markdown:docs/common/layer/base.md`
