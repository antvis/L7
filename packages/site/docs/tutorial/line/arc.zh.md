---
title: 弧线图
order: 1
---
`markdown:docs/common/style.md`

有时候为了可视化效果，会选择使用弧线连接地图上的两点。同时也可以使用弧线完成一些有趣的效果。


<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*dUk8RbtjUDIAAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

### 实现

下面我们来介绍如何使用弧线绘制一个模拟的风场。

- 你可以在 `L7` 官网上找到[在线案例](/zh/examples/line/animate/#wind)

```javascript
import { Scene, LineLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'light',
    center: [ 60, 40.7128 ],
    zoom: 2
  })
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/bmw-prod/7455fead-1dc0-458d-b91a-fb4cf99e701e.txt')
    .then(res => res.text())
    .then(data => {
      const layer = new LineLayer({ blend: 'normal' })
        .source(data,
          {
            parser: {
              type: 'csv',
              x: 'lng1',
              y: 'lat1',
              x1: 'lng2',
              y1: 'lat2'
            }
          })
        .size(1)
        .shape('arc')
        .color('#6495ED')
        .animate({
          duration: 4,
          interval: 0.2,
          trailLength: 0.6
        });
      scene.addLayer(layer);
    });
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

为了绘制弧线图，我们需要将 `shape` 的参数设置成 `arc`。


`markdown:docs/api/line_layer/features/animate.zh.md`

### style

`markdown:docs/api/line_layer/features/segmentNumber.zh.md`

`markdown:docs/api/line_layer/features/thetaOffset.zh.md`

`markdown:docs/api/line_layer/features/linear.zh.md`

`markdown:docs/api/line_layer/features/dash.zh.md`

`markdown:docs/api/line_layer/features/texture.zh.md`