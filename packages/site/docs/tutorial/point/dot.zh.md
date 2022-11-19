---
title: 亮度图
order: 4
---
<embed src="@/docs/common/style.md"></embed>

亮度图又称点密度图，单位面积的内点的个数越多，亮度会越亮，亮度图一般用来表达海量点数据分布情况

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*xr8BQouXGvoAAAAAAAAAAABkARQnAQ'>
  </div>
</div>

### 实现

下面我们来介绍如何绘制一个简单的亮度图。

- 你可以在 `L7` 官网上找到[在线案例](/examples/gallery/basic#normal)

```javascript
import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [ 121.417463, 31.215175 ],
    style: 'dark',
    zoom: 11
  })
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/rmsportal/BElVQFEFvpAKzddxFZxJ.txt')
    .then(res => res.text())
    .then(data => {
      const pointLayer = new PointLayer({})
        .source(data, {
          parser: {
            type: 'csv',
            y: 'lat',
            x: 'lng'
          }
        })
        .size(0.5)
        .color('#080298');
      scene.addLayer(pointLayer);
    });
});
```

### shape

使用亮度图需要将 `shape` 的参数设置为 `dot`，或者不设置 `shape` 函数。
