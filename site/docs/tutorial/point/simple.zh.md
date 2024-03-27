---
title: 简单点
order: 9
---

<embed src="@/docs/api/common/style.md"></embed>

点图层支持精灵模式的简单点，精灵模式的点图层效率更高，点始终面向相机。

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*dVFmQIKh5TUAAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

### 实现

下面我们来介绍如何绘制一个简单点图层。

- 你可以在 `L7` 官网上找到[在线案例](/examples/point/simple#simple)

```javascript
import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    pitch: 20,
    center: [ 120, 20 ],
    zoom: 3
  })
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json')
    .then(res => res.json())
    .then(data => {
      const pointLayer = new PointLayer({})
        .source(data)
        .shape('simple')
        .size(15)
        .color('mag', mag =>  mag > 4.5 ? '#5B8FF9' : '#5CCEA1';)
        .style({
          opacity: 0.6,
          strokeWidth: 3
        });
      scene.addLayer(pointLayer);
    });
});
```

### shape

简单点图层使用的 `shape` 参数固定为 `simple`。

### use

- 简单点图层的使用和一般的点图层表现一致

- 简单点图层的实质是精灵贴图，因此简单点图层始终面向相机（普通的 2D 点图层保持面向上）

- 🌟 当用户对点图层的朝向没有要求或是对点图层的可视化效果要求比较简单，那么推荐尽量使用简单点图层，可以节省大量性能

- 🌟 简单点图层由于实质是精灵贴图，因此有大小限制：一般是 [1, 64]，不同设备之间存在差异

```javascript
// L7 提供了查询方法快速查看

scene.getPointSizeRange(); // Float32Array - [min, max]
```
