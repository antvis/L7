---
title: "简单线图层"
description: "简单线图层"
language: "zh"
canonical: "https://l7.antv.antgroup.com/zh/tutorial/line/simple/"
---

[资料索引](/llms.txt)

简单线图层为用户提供了一种大数据量性能更优的选择，能轻松渲染有几十万个节点的线段，但相应的，对比与普通的线图层，简单线图层也丢失了一些其他能力。

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*HulgSKEJAKMAAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

### 实现

下面我们来介绍如何绘制简单线。

- 你可以在 `L7` 官网上找到[在线案例](/zh/examples/gallery/animate/grid/)

```javascript
import { LineLayer } from '@antv/l7';
const layer = new LineLayer()
  .source(data)
  .shape('simple')
  .size(10) // size 方法不生效 线宽始终为 1px
  .color('#f00')
  .style(...)
```

### shape

为了绘制简单线，我们需要将 `shape` 的参数设置成 `simple`。

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


🌟 简单线图层不支持动画和纹理
