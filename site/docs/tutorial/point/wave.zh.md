---
title: 水波图
order: 3
---

<embed src="@/docs/api/common/style.md"></embed>

平面点图层在开启动画模式的情况下，是一种特殊的图层类型：水波点。图层由一圈圈向外扩散的圆环构成。

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*pcp3RKnNK1oAAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

### 实现

根据下面的代码可以实现一个简单的水波点案例。

- 你可以在 `L7` 官网上找到[在线案例](/examples/point/scatter#animatepoint)。

- 具体的使用可以查看[详细文档](/api/point_layer/animate#水波点)。

```js
import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'light',
    center: [112, 23.69],
    zoom: 2.5,
  }),
});
fetch('https://gw.alipayobjects.com/os/basement_prod/9078fd36-ce8d-4ee2-91bc-605db8315fdf.csv')
  .then((res) => res.text())
  .then((data) => {
    const pointLayer = new PointLayer({})
      .source(data, {
        parser: {
          type: 'csv',
          x: 'Longitude',
          y: 'Latitude',
        },
      })
      .shape('circle')
      .animate(true)
      .size(40)
      .color('#ffa842');
    scene.addLayer(pointLayer);
  });
```

### shape

为了实现水波点，点图层的 `shape` 参数只要是 `circle`、`triangle`、`square` 等平面图形即可。

### animate

- boolean ｜ animateOption

```javascript
.animate(true)

.animate({
  enable: true
})
```

#### 水波配置项

- `speed` 水波速度
- `rings` 水波环数

### size

在水波点图层中，由于边缘透明的原因，点的大小看上去要比相同 size 的非水波点要小一些。
