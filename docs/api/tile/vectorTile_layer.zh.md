---
title: 矢量瓦片图层
order: 2
---

`markdown:docs/common/style.md`

L7 瓦片图层提供了对图片栅格瓦片、数据栅格瓦片、矢量瓦片的支持，通过使用瓦片图层，用户可以更加自由的选择地图底图，同时使用瓦片图层作为底图意味着不会增加 `webgl` 实例，对需要同时使用多个地图图表的情形更加友好。

### layer

L7 支持多种类型的矢量图层。

```javascript
// 矢量瓦片图层
import { PointLayer } from '@antv/l7';
import { LineLayer } from '@antv/l7';
import { PolygonLayer } from '@antv/l7';
```

<img width="80%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*0yJ8QYqOhCMAAAAAAAAAAAAAARQnAQ'>

[在线案例](/zh/examples/tile/vector#polygon)

### option

矢量瓦片图层可以在初始化的时候传入 `zIndex` 配置图层的渲染顺序。  
矢量瓦片图层需要在初始化的时候传入 `featureId` 和 `sourceLayer` 参数，`featureId` 用于指定瓦片的拾取高亮，`sourceLayer` 指定绘制矢量数据中那一图层数据。

```javascript
const layer = new RasterLayer({
  zIndex: 1,
  featureId: 'id',
  sourceLayer: 'water',
});
```

- featureId: string
  用于可以自定义指定。
- sourceLayer: string
  用于必须传入，且要在返回的矢量数据中存在。

### source

L7 的瓦片图层复用了原有的普通图层，在使用上通过 `source` 来进行区分。

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

#### opacity: number

设置矢量图形的透明度。
🌟 vector text、point、line、polygon

#### stroke: string

设置边框的颜色值。
🌟 vector text、point

#### strokeWidth: number

设置边框的宽度。
🌟 vector text

#### textAllowOverlap: boolean

是否允许文字覆盖。
🌟 vector text

#### textAnchor: 'center'

文本相对锚点的位置 `center`|`left`|`right`|`top`|`bottom`|`top-left`。
🌟 vector text

#### textOffset: [number, number]

文本相对锚点的偏移量 [水平, 垂直]。
🌟 vector text

#### spacing: number

字符间距。
🌟 vector text

#### padding: [number, number]

文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近。
🌟 vector text
