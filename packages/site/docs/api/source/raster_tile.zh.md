---
title: RasterTile 栅格瓦片
order: 7
---

<embed src="@/docs/common/style.md"></embed>

L7 加载栅格瓦片地图的时候需要在 `source` 中对瓦片服务进行解析，同时配置瓦片服务的请求参数。

## data

瓦片 URL,仅支持 EPSG 3857 的坐标系，支持 TMS、WMS、WMTS 协议

### TMS

通过 url 模板传参，参与需要使用 `{}`

- 1-4 服务器编码 {1-4}
- z 缩放等级
- x 瓦片 x 坐标
- y 瓦片 y 坐标

```js
const url =
  'http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}';
```

### WMS

url 模板参数

- 1-x 服务器编码 {1-4}
- bbox 瓦片范围模板 BBOXSR 只支持 4326,IMAGESR 只支持 3857

示例

```js
const url =
  'https://pnr.sz.gov.cn/d-suplicmap/dynamap_1/rest/services/LAND_CERTAIN/MapServer/export?F=image&FORMAT=PNG32&TRANSPARENT=true&layers=show:1&SIZE=256,256&BBOX={bbox}&BBOXSR=4326&IMAGESR=3857&DPI=90';
```

### WMTS

url 模板参数

- 1-4 服务器编码 {1-4}

WMTS 两种方式

- 使用方式和 TMS 相似，可以拼接 url 字符串
- 通过 parser 参数 wmtsOptions 设置服务参数

```js
const url1 =
  'https://t0.tianditu.gov.cn/img_w/wmts?tk=b72aa81ac2b3cae941d1eb213499e15e&';
const layer1 = new RasterLayer({
  zIndex: 1,
}).source(url1, {
  parser: {
    type: 'rasterTile',
    tileSize: 256,
    wmtsOptions: {
      layer: 'img',
      tileMatrixset: 'w',
      format: 'tiles',
    },
  },
});
```

## parser

### type

<description> _string_ **必选** _default:_ rasterTile</description>
固定值为 `rasterTile`

### tileSize `number`

<description> _number_ **可选** _default:_ 256</description>
请求瓦片的大小 optional

### zoomOffset

<description> number **可选** _default:_ 0</description>
瓦片请求瓦片层级的偏移

### maxZoom

<description> _number_ **可选** _default:_ 0</description>

瓦片最大缩放等级 `20`

### minZoom 瓦片最小缩放等

<description> _number_ **可选** _default:_ 2-</description>

### extent `[number, number, number, number]` 地图显示范围

<description> _number[]_ **可选** 不限制:\_ </description>

### dataType

<description> _string_ **可选** _default:_ image</description>

瓦片数据类型

- image 图像类型
- arraybuffer 数据类型如 geotiff

### format func,

<description> _func_ **可选** \_default:</description>

数据栅格时使用,用于将栅格数据格式化为标准数据,自定义数据处理函数

### wmtsOptions wmsts 配置

<description> _Object_ **可选** _default:_ null</description>

#### layer

<description> _string_ **必选** _default:_ img</description>
图层

#### tileMatrixset

<description> _string_ **必选** _default:_ w</description>

#### format

<description> _string_ **必选** _default:_ tiles</description>
服务类型

```javascript
const rasterSource = new Source(
  'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
  {
    parser: {
      type: 'rasterTile',
      tileSize: 256,
      zoomOffset: 0,
      extent: [-180, -85.051129, 179, 85.051129],
    },
  },
);
```
<embed src="@/docs/api/source/tile/method.md"></embed>
