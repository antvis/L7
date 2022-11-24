---
title: 散点图
order: 2
---
<embed src="@/docs/common/style.md"></embed>

散点图在地理区域上放置相等大小的圆点，用来表示地域上的空间布局或数据分布。

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*LnlmQ7sFWigAAAAAAAAAAABkARQnAQ'>
  </div>
</div>

### 实现

下面我们来介绍如何绘制一个常见的散点图。

- 你可以在 `L7` 官网上找到[在线案例](/examples/point/scatter/#scatter)


```javascript
import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'light',
    center: [ -121.24357, 37.58264 ],
    zoom: 6.45
  })
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/basement_prod/6c4bb5f2-850b-419d-afc4-e46032fc9f94.csv')
    .then(res => res.text())
    .then(data => {
      const pointLayer = new PointLayer({})
        .source(data, {
          parser: {
            type: 'csv',
            x: 'Longitude',
            y: 'Latitude'
          }
        })
        .shape('circle')
        .size(4)
        .color('Magnitude', [
          '#0A3663',
          '#1558AC',
          '#3771D9',
          '#4D89E5',
          '#64A5D3',
          '#72BED6',
          '#83CED6',
          '#A6E1E0',
          '#B8EFE2',
          '#D7F9F0'
        ])
      scene.addLayer(pointLayer);
    });
});
```

### shape

散点图 `shape` 一般设置成常量，通常是 `2D` 的图表。

- circle
- square
- hexagon
- triangle
- pentagon
- octogon
- hexagram
- rhombus
- vesica




