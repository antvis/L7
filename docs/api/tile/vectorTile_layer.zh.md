---
title: 矢量瓦片图层
order: 2
---

`markdown:docs/common/style.md`

L7 瓦片图层提供了对图片栅格瓦片、数据栅格瓦片、矢量瓦片的支持，通过使用瓦片图层，用户可以更加自由的选择地图底图，同时使用瓦片图层作为底图意味着不会增加 `webgl` 实例，对需要同时使用多个地图图表的情形更加友好。

## 支持多种瓦片图层

```javascript
// 矢量瓦片图层
import { PointLayer } from '@antv/l7';
import { LineLayer } from '@antv/l7';
import { PolygonLayer } from '@antv/l7';
```

<img width="80%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*0yJ8QYqOhCMAAAAAAAAAAAAAARQnAQ'>

## option

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

## source

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

### parser

矢量瓦片在 `parser` 中解析瓦片服务，配置瓦片的参数。

#### type: string

用于指定瓦片服务的解析方式，值为 `rasterTile` 和 `mvt`。  
`rasterTile` 用于栅格瓦片的解析，`mvt` 用于矢量瓦片的解析。

#### minZoom/maxZoom: number

设置瓦片数据的请求层级。当地图的缩放层级 `zoom` 小于 `minZoom` 后，或 `zoom` 大于 `maxZoom` 后将不再请求新的瓦片。  
`minZoom` 的默认值为 `-Infinity`。  
`maxZoom` 的默认值为 `Infinity`。

#### tileSize: number

设置的值是瓦片服务返回的瓦片大小。  
`tileSize` 的默认值为 256。  
ps： 该值在生产瓦片的时候确定，我们设置的 `tileSize` 需要和瓦片服务返回的保持一致。

#### extent: [number, number, number, number]

设置请求瓦片数据的边界， 格式是 `[minLng, maxLat, maxLng, minLat]`，只会请求范围内的瓦片数据。

#### zoomOffset: number

设置的值用于改变请求的瓦片数据的层级，通常在移动端可以请求更高一级的瓦片以获取更好的清晰度。
`zoomOffset` 的默认值为 0

## style

图片栅格和数据栅格拥有不同的 `style` 配置。

## 矢量图层的鼠标事件

在使用上，矢量图层绑定事件的操作和普通图层事件保持一致。

```javascript
layer.on('click', e => {...})
```

🌟 在事件的返回参数中，L7 内部对图形的数据做了合并的操作，以求获取到当前图层的完整数据。  
🌟 目前矢量瓦片支持的事件如下：

```javascript
layer.on('click', (e) => {});
layer.on('mousemove', (e) => {});
layer.on('mouseup', (e) => {});
layer.on('mouseenter', (e) => {});
layer.on('mouseout', (e) => {});
layer.on('mousedown', (e) => {});
layer.on('contextmenu', (e) => {});

// out side
layer.on('unclick', (e) => {});
layer.on('unmouseup', (e) => {});
layer.on('unmousedown', (e) => {});
layer.on('uncontextmenu', (e) => {});
```

## Mask

🌟 目前矢量瓦片不支持设置 Mask 掩模。
