---
title: Layer init
order: 1
---

<embed src="@/docs/api/common/style.md"></embed>

In map applications, rendering big data geographical data is a very common requirement. In order to ensure the smoothness of the application, it is necessary to pursue the ultimate rendering performance. For this reason, monitoring engine rendering content is of practical significance for optimizing performance and building map visualization application performance indicators. significance.

### accomplish

The following describes how to use the capabilities provided by L7 to simply obtain the initialization information of the layer.

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
