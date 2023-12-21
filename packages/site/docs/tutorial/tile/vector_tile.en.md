---
title: Vector Tile
order: 2
---

<embed src="@/docs/api/common/style.md"></embed>

Vector tiles can usually be used to render large amounts of geographical data. The characteristics of tiles are used to distribute request rendering data, thereby reducing the waiting time of requests and loading times and optimizing the user experience. At the same time, in scenarios that do not require full loading of data, vector tiles can effectively reduce the amount of data rendering and reduce rendering pressure while ensuring the experience.

### Draw vector tiles - point

```javascript
import { PointLayer } from '@antv/l7';
const point = new PointLayer({
  featureId: 'COLOR',
  sourceLayer: 'ecoregions2',
})
  .source(vectorSource)
  .shape('circle')
  .color('red')
  .size(10);
```

### Draw vector tiles - line

```javascript
import { LineLayer } from '@antv/l7';
const line = new LineLayer({
  featureId: 'COLOR',
  sourceLayer: 'ecoregions2',
})
  .source(vectorSource)
  .color('COLOR')
  .size(2);
```

### Draw vector tiles - polygon

```javascript
// Vector tile layer
import { PolygonLayer } from '@antv/l7';
const polygon = new PolygonLayer({
  featureId: 'COLOR'，
  sourceLayer: 'ecoregions2',
})
.source(source)
.color('red');
```

### Draw vector tiles - mask layer

Vector mask layers are generally used in conjunction with raster layers to mask raster layers.

```js
import { MaskLayer } from '@antv/l7';
const mask = new MaskLayer({sourceLayer: 'ecoregions2' })
.source( 'https://ganos.oss-cn-hangzhou.aliyuncs.com/m2/rs_l7/{z}/{x}/{y}.pbf' {
  parser: {
      type: 'mvt',
      maxZoom: 9,
      extent: [-180, -85.051129, 179, 85.051129],
  }});
```

### Draw vector tiles - test layer

```js
//Test tile layer
const debugerLayer = new TileDebugLayer();
```
