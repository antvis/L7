---
title: 填充图
order: 0
---
<embed src="@/docs/common/style.md"></embed>

几何体图层在地图上最简单的表现就是填充图，即使用指定的颜色填充指定区域。

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*4Kp4Qp00kq4AAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

### 实现

下面我们来介绍如何绘制一个简单的填充图。

- 你可以在 `L7` 官网上找到[在线案例](/examples/polygon/fill#usa)

```javascript
import { Scene, PolygonLayer, LineLayer, Popup } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'light',
    center: [ -96, 37.8 ],
    zoom: 3
  })
});
scene.on('loaded', () => {
  fetch(
    'https://gw.alipayobjects.com/os/basement_prod/d36ad90e-3902-4742-b8a2-d93f7e5dafa2.json'
  )
    .then(res => res.json())
    .then(data => {
      const color = [ 'rgb(255,255,217)', 'rgb(237,248,177)', 'rgb(199,233,180)', 'rgb(127,205,187)', 'rgb(65,182,196)', 'rgb(29,145,192)', 'rgb(34,94,168)', 'rgb(12,44,132)' ];
      const layer = new PolygonLayer({})
        .source(data)
        .scale('density', {
          type: 'quantile'
        })
        .color(
          'density', color
        )
        .shape('fill')
        .active(true);
      const layer2 = new LineLayer({
        zIndex: 2
      })
        .source(data)
        .color('#fff')
        .active(true)
        .size(1)
        .style({
          lineType: 'dash',
          dashArray: [ 2, 2 ],
        });
      scene.addLayer(layer);
      scene.addLayer(layer2);
    });
});

```

### source

几何体图层推荐使用标准的 `GeoJSON` 数据。

### shape

绘制填充图，shape 为 `fill` 常量，不支持数据映射

```javascript
layer.shape('fill');
```

### size

填充图不需要设置 `size`;

### style

- `opacityLinear` 设置几何填充图的径向渐变。

```javascript
style({
  opacityLinear: {
    enable: true, // true - false
    dir: 'in', // in - out
  },
});
```

[径向渐变 in](/examples/polygon/fill#china_linear_in)

<img width="60%" style="display: block;margin: 0 auto;" alt="面图层填充图" src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*XjT5T4cT_CYAAAAAAAAAAAAAARQnAQ">

[径向渐变 out](/examples/polygon/fill#china_linear_out)

<img width="60%" style="display: block;margin: 0 auto;" alt="面图层填充图" src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*Ob62Q7JDpZ4AAAAAAAAAAAAAARQnAQ">

- `raisingHeight` 设置 `3D` 填充图的抬升高度。
