---
title: 大圆航线
order: 3
---

<embed src="@/docs/api/common/style.md"></embed>

把地球看做一个球体，通过地面上任意两点和地心做一平面，平面与地球表面相交看到的圆周就是大圆。两点之间的大圆劣弧线是两点在地面上的最短距离。沿着这一段大圆弧线航行时的航线称为大圆航线。

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*6Qm_QY69sBMAAAAAAAAAAABkARQnAQ'>
  </div>
</div>

### 实现

下面我们来介绍如何绘制一个简单的大圆弧线。

- 你可以在 `L7` 官网上找到[在线案例](/examples/line/arc/#arccircle)

```javascript
import { Scene, LineLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'dark',
    center: [107.77791556935472, 35.443286920228644],
    zoom: 2.9142882493605033,
  }),
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/rmsportal/UEXQMifxtkQlYfChpPwT.txt')
    .then((res) => res.text())
    .then((data) => {
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
        .shape('greatcircle')
        .color('#8C1EB2')
        .style({
          opacity: 0.8,
        });
      scene.addLayer(layer);
    });
});
```

### source

绘制弧线需要同时提供起点和止点的坐标（起止点调换位置，弧线的形状会对称相反，飞线动画的方向也会相反）。

```javascript
const data = [
  {
    lng1: 120,
    lat1: 30,
    lng2: 130,
    lat2: 30,
  },
];
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

为了绘制大圆弧线图，我们需要将 `shape` 的参数设置成 `greatcircle`。

<embed src="@/docs/api/common/features/animate.zh.md"></embed>

### style

<embed src="@/docs/api/common/features/linear.zh.md"></embed>

<embed src="@/docs/api/common/features/dash.zh.md"></embed>

<embed src="@/docs/api/common/features/texture.zh.md"></embed>
