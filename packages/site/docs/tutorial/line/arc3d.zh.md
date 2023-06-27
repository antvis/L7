---
title: 3D 弧线图
order: 2
---
<embed src="@/docs/common/style.md"></embed>

除了 2D 的弧线，我们还指出 3D 的弧线，在使用上只要改变 `shape` 的参数即可。


<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*xvaaQo2c0gMAAAAAAAAAAABkARQnAQ'>
  </div>
</div>

### 实现

下面我们来介绍如何绘制一个简单的 `3D` 弧线图。

- 你可以在 `L7` 官网上找到[在线案例](/examples/line/arc#trip_arc)

```javascript
import { LineLayer } from '@antv/l7';
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
    opacity: 0.8,
  });
```

### source

绘制弧线需要同时提供起点和止点的坐标（起止点调换位置，弧线的形状会对称相反，飞线动画的方向也会相反）。

```javascript
const data = [{
  lng1: 120, lat1: 30,
  lng2: 130, lat2: 30
}]
layer.source(data, {
  parser: {
    type: 'json',
    x: 'lng1',
    y: 'lat1',
    x1: 'lng2',
    y1: 'lat2',
  },
});
```

### shape

为了绘制弧线图，我们需要将 `shape` 的参数设置成 `arc3d`。

<embed src="@/docs/common/features/animate.zh.md"></embed>

### style

<embed src="@/docs/common/features/linear.zh.md"></embed>

<embed src="@/docs/common/features/dash.zh.md"></embed>

<embed src="@/docs/common/features/texture.zh.md"></embed>
