---
title: 气泡图
order: 0
---

<embed src="@/docs/api/common/style.md"></embed>

气泡图地理区域上方会显示不同大小的圆点，圆形面积与其在数据集中的数值会成正比。

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*fNGiS7YI1tIAAAAAAAAAAABkARQnAQ'>
  </div>
</div>

### 实现

下面我们来介绍如何绘制一个常见的气泡图。

- 你可以在 `L7` 官网上找到[在线案例](/examples/point/bubble/#point)

```javascript
import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'light',
    center: [140.067171, 36.26186],
    zoom: 5.32,
    maxZoom: 10,
  }),
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json')
    .then((res) => res.json())
    .then((data) => {
      const pointLayer = new PointLayer({})
        .source(data)
        .shape('circle')
        .size('mag', [1, 25])
        .color('mag', (mag) => {
          return mag > 4.5 ? '#5B8FF9' : '#5CCEA1';
        })
        .style({
          opacity: 0.3,
          strokeWidth: 1,
        });
      scene.addLayer(pointLayer);
    });
});
```

### source

气泡图接受普通的点数据。

### shape

气泡图的 `shape` 一般为 `circle`，也可以是 `square`、`triangle` 等其他形状。

### size

气泡图的 `size` 一般用于表示数据中的某个字段，因此不会使用常量而是使用数据映射。

```js
layer.size('area', [1, 100]); // 使用区间映射
layer.size('area', (area) => {
  // 使用回调函数实现映射
  return area * 10;
});
```

### color

气泡图的 `color` 一般也会用于表示数据中的某个字段，因此不会使用常量而是使用数据映射。

```js
layer.color('area', ['#f00', '#ff0']); // 使用区间映射
layer.color('area', (area) => {
  // 使用回调函数实现映射
  if (area > 100) {
    return '#f00';
  } else {
    return '#ff0';
  }
});
```
