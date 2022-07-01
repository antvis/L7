---
title: 大圆航线
order: 5
---

`markdown:docs/common/style.md`

把地球看做一个球体，通过地面上任意两点和地心做一平面，平面与地球表面相交看到的圆周就是大圆。两点之间的大圆劣弧线是两点在地面上的最短距离。沿着这一段大圆弧线航行时的航线称为大圆航线。

## 使用

```javascript
import { LineLayer } from '@antv/l7';
```

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*6Qm_QY69sBMAAAAAAAAAAABkARQnAQ'>

[在线案例](../../../examples/line/arc#arcCircle)

### shape

shape 设置成 greatcircle 即可

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
