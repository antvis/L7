---
title: "Simple Line"
description: "Simple Line"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/tutorial/line/simple/"
---

[Resource index](/llms.txt)

The simple line layer provides users with a better choice for large data volumes and can easily render line segments with hundreds of thousands of nodes. However, compared with ordinary line layers, the simple line layer is also lost. some other abilities.

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*HulgSKEJAKMAAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

### accomplish

Let's introduce how to draw a simple line.

- you can`L7`Found on the official website[Online case](/en/examples/gallery/animate/grid/)

```javascript
import { LineLayer } from '@antv/l7';
const layer = new LineLayer()
  .source(data)
  .shape('simple')
  .size(10) // The size method does not take effect. The line width is always 1px.
  .color('#f00')
  .style(...)
```

### shape

In order to draw a simple line we need to`shape`The parameters are set to`simple`。

#### linearColor

线图层通过在 style 中设置起始颜色和终点颜色来设置颜色渐变，渐变色的优先级比 color 方法设置的颜色更高

```javascript
const layer = new LineLayer({})
  .source(data, {
    parser: {
      type: 'csv',
      x: 'lng1',
      y: 'lat1',
      x1: 'lng2',
      y1: 'lat2',
    },
  })
  .size(1)
  .shape('arc')
  .color('#8C1EB2')
  .style({
    sourceColor: '#f00', // 起点颜色
    targetColor: '#0f0', // 终点颜色
  });
```

<img width="450px" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*8DYQTZeQyZ4AAAAAAAAAAAAAARQnAQ'>

[在线案例](/zh/examples/line/arc/trip-arc-dark-linear/)


🌟 Simple line layer does not support animation and textures
