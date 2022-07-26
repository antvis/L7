---
title: 3D弧线图
order: 3
---

`markdown:docs/common/style.md`

将两个点的连线绘制成弧形，绘制的弧线可以是贝塞尔曲线，大圆航线，通常用来表示两种地理事物关系和联系，或者人口迁移，物流起点目的地等

## 使用

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

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*xvaaQo2c0gMAAAAAAAAAAABkARQnAQ'>

[在线案例](../../../examples/line/arc#trip_arc)

### shape

shape 设置成 arc3d 即可

### source

绘制弧线只需提供起止点坐标即可（起止点调换位置，弧线的形状会对称相反，飞线动画的方向也会相反）

```javascript
source(data, {
  parser: {
    type: 'csv',
    x: 'lng1',
    y: 'lat1',
    x1: 'lng2',
    y1: 'lat2',
  },
});
```

`markdown:docs/api/line_layer/features/animate.zh.md`

### style

`markdown:docs/api/line_layer/features/linear.zh.md`

`markdown:docs/api/line_layer/features/dash.zh.md`

`markdown:docs/api/line_layer/features/texture.zh.md`
