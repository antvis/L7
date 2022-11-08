---
title: 矢量瓦片
order: 2
---
`markdown:docs/common/style.md`

矢量瓦片通常可以用于大数据量地理数据的渲染，借助瓦片的特性分布请求渲染数据，从而达到减少请求、加载时间的等待，优化使用体验的目的。同时，在不需要全量加载数据的场景下，通过矢量瓦片的形式可以在保证体验的前提下有效减少数据的渲染量，减少渲染压力。

### 使用

`L7` 支持多种类型的矢量图层，同时为了减少降低新增概念，矢量瓦片图层和普通的图层保持相同的使用方法，只是在 `source` 数据类型上有所区别。以点图层为列，也就是说，`PointLayer` 既可以是普通的点图层，也可以是矢量点图层。

```js
// 普通点图层
const layer = new PointLayer()
.source([{lng: 120, lat: 30}], {parser: {
  type: 'json',
  x: 'lng',
  y: 'lat',
}})
.shape('circle')
.size(10)
.color('#f00');
// 矢量点图层瓦片
const vectorTileLayer = new PointLayer()
.source('http://ganos.oss-cn-hangzhou.aliyuncs.com/m2/rs_l7/{z}/{x}/{y}.pbf',
  {
  parser: {
    type: 'mvt',
    maxZoom: 9,
    extent: [-180, -85.051129, 179, 85.051129],
  })
.shape('circle')
.size(10)
.color('#f00');
```

### option

在初始化瓦片的时候，除了普通图层支持的 `options` 参数之外，还需要需要我们提前设置矢量数据相关的参数。
- `featureId`: string
  - 用于可以自定义指定。用于指定瓦片的拾取高亮。
- `sourceLayer`: string
  - 用于必须传入，且要在返回的矢量数据中存在，指定绘制矢量数据中那一图层数据。

```javascript
const layer = new RasterLayer({
  featureId: 'id',
  sourceLayer: 'water',
});
```
### source

瓦片图层复用了原有的普通图层，在使用上通过 `source` 来进行区分。

```javascript
// 普通图层在 source 中直接传入数据，而瓦片图层则在 source 中设置瓦片服务
// 设置矢量瓦片服务
import { Source } from '@antv/l7'
const tileSource = new Source({
  'http://ganos.oss-cn-hangzhou.aliyuncs.com/m2/rs_l7/{z}/{x}/{y}.pbf',
  { // parser
    parser: {
      type: 'mvt',
      ...
    }
  }
})
layer.source(tileSource)
```

#### parser

矢量瓦片在 `parser` 中解析瓦片服务，配置瓦片的参数。

##### type: string

用于指定瓦片服务的解析方式，值为 `rasterTile` 和 `mvt`。  
`rasterTile` 用于栅格瓦片的解析，`mvt` 用于矢量瓦片的解析。

##### minZoom/maxZoom: number

设置瓦片数据的请求层级。当地图的缩放层级 `zoom` 小于 `minZoom` 后，或 `zoom` 大于 `maxZoom` 后将不再请求新的瓦片。  
`minZoom` 的默认值为 `-Infinity`。  
`maxZoom` 的默认值为 `Infinity`。

##### tileSize: number

设置的值是瓦片服务返回的瓦片大小。  
`tileSize` 的默认值为 256。  
ps： 该值在生产瓦片的时候确定，我们设置的 `tileSize` 需要和瓦片服务返回的保持一致。

##### extent: [number, number, number, number]

设置请求瓦片数据的边界， 格式是 `[minLng, maxLat, maxLng, minLat]`，只会请求范围内的瓦片数据。

##### zoomOffset: number

设置的值用于改变请求的瓦片数据的层级，通常在移动端可以请求更高一级的瓦片以获取更好的清晰度。
`zoomOffset` 的默认值为 `0`。

### style

矢量图层的 `style` 样式和普通图层保持一致。

### 特殊的矢量图层

#### MaskLayer

`MaskLayer` 一般用于对另外一个瓦片图层做掩模，`source` 接收数据类型为 `GeoJSON Polygon` 类型的瓦片服务。

```js
// 对卫星图做掩模
const mask = new MaskLayer({ sourceLayer: 'ecoregions2'}).source(
    'http://ganos.oss-cn-hangzhou.aliyuncs.com/m2/rs_l7/{z}/{x}/{y}.pbf',
    {
      parser: {
        type: 'mvt',
        tileSize: 256,
        maxZoom: 9,
        extent: [-180, -85.051129, 179, 85.051129],
      },
    },
  )

const satellite = new RasterLayer({ mask: true })
  .source(
    'http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
    {
      parser: {
        type: 'rasterTile',
        tileSize: 256,
        zoomOffset: 0,
        updateStrategy: 'overlap',
      },
    },
  )
```
#### TileDebugLayer

用于测试使用，用于展示瓦片金字塔，一般在开发时使用。

```js
const layer = new TileDebugLayer();
scene.addLayer(layer);
```

### 前端瓦片切分方案

矢量图层还支持以 `GeoJSON-VT` 的形式实现瓦片数据的前端切片，这就意味着瓦片图层不再依赖后端提供瓦片服务，可以很大程度上减少瓦片图层的使用限制。

- `geojsonvt` 需要把 `parser` 的 `type` 类型设置为 `geojsonvt`。

```js
fetch( 'https://gw.alipayobjects.com/os/bmw-prod/2b7aae6e-5f40-437f-8047-100e9a0d2808.json')
.then((d) => d.json())
.then((data) => {
  const source = new Source(data, {
    parser: {
      type: 'geojsonvt',
      maxZoom: 9,
    },
  });

  const polygon = new PolygonLayer({ featureId: 'COLOR' })
    .source(source)
    .color('COLOR')
    .select(true)
    .style({
      opacity: 0.6,
    });
  scene.addLayer(polygon);
})
```