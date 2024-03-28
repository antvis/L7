---
title: 矢量瓦片
order: 2
---

<embed src="@/docs/api/common/style.md"></embed>

矢量瓦片通常可以用于大数据量地理数据的渲染，借助瓦片的特性分布请求渲染数据，从而达到减少请求、加载时间的等待，优化使用体验的目的。同时，在不需要全量加载数据的场景下，通过矢量瓦片的形式可以在保证体验的前提下有效减少数据的渲染量，减少渲染压力。

### 绘制矢量瓦片 - point

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

### 绘制矢量瓦片 - line

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

### 绘制矢量瓦片 - polygon

```javascript
// 矢量瓦片图层
import { PolygonLayer } from '@antv/l7';
const polygon = new PolygonLayer({
  featureId: 'COLOR'，
  sourceLayer: 'ecoregions2',
})
.source(source)
.color('red');
```

### 绘制矢量瓦片 - 掩模图层

矢量掩模图层一般配合栅格图层使用，对栅格图层进行掩模处理。

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

### 绘制矢量瓦片 - 测试图层

```js
// 测试瓦片图层
const debugerLayer = new TileDebugLayer();
```
