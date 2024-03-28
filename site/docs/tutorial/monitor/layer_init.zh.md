---
title: 图层初始化
order: 1
---

<embed src="@/docs/api/common/style.md"></embed>

在地图应用中，渲染大数据的地理数据是十分常见的需求，为了保证应用的流畅性，需要追求极致的渲染性能，为此监控引擎渲染内容对于优化性能，建设地图可视化应用性能指标有切实的意义。

### 实现

下面介绍如何使用 L7 提供的能力简单获取图层的初始化的信息。

```javascript
import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [60, 40.7128],
    zoom: 2,
  }),
  debug: true,
});
scene.on('loaded', () => {
  const debugService = scene.getDebugService();
  const layer = new PointLayer()
    .source([{ lng: 120, lat: 30 }], {
      parser: {
        type: 'json',
        x: 'lng',
        y: 'lat',
      },
    })
    .shape('circle')
    .size(10)
    .color('#f00');
  layer.on('inited', () => {
    console.log(debugService.getLog(layer.id));
  });
  scene.addLayer(layer);
});
```
