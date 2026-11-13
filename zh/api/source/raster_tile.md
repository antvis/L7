---
title: "Raster Tile"
description: "Raster Tile"
language: "zh"
canonical: "https://l7.antv.antgroup.com/zh/api/source/raster_tile/"
---

[资料索引](/llms.txt)

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
const url = 'http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}';
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
const url1 = 'https://t0.tianditu.gov.cn/img_w/wmts?tk=b72aa81ac2b3cae941d1eb213499e15e&';
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

_string_ **必选** _default:_ rasterTile
固定值为 `rasterTile`

### tileSize `number`

_number_ **可选** _default:_ 256
请求瓦片的大小 optional

### zoomOffset

number **可选** _default:_ 0
瓦片请求瓦片层级的偏移

### maxZoom

_number_ **可选** _default:_ 0

瓦片最大缩放等级 `20`

### minZoom 瓦片最小缩放等

_number_ **可选** _default:_ 2-

### extent `[number, number, number, number]` 地图显示范围

_number[]_ **可选** 不限制:\_

### dataType

_string_ **可选** _default:_ image

瓦片数据类型

- image 图像类型
- arraybuffer 数据类型如 geotiff

### format func,

_func_ **可选** \_default:

数据栅格时使用,用于将栅格数据格式化为标准数据,自定义数据处理函数

### wmtsOptions wmsts 配置

_Object_ **可选** _default:_ null

#### layer

_string_ **必选** _default:_ img
图层

#### tileMatrixset

_string_ **必选** _default:_ w

#### format

_string_ **必选** _default:_ tiles
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

## 瓦片 source 属性

### tileset

瓦片数据集，可以获取当前视野内的瓦片信息, 瓦片状态

```ts
const source = layer1.getSource();
const tileSet = source.tileset;
```

#### 属性

##### isLoaded

瓦片是否加载完成

##### currentTiles

当前瓦片对象

##### currentZoom

当前瓦片层级；这里的曾经和map 的缩放层级不相等

#### 事件

##### tiles-load-start

地图拖动，需要加载新的瓦片时触发

```ts
tileSet.on('tiles-load-start', () => {
  console.log('tile start');
});
```

##### tiles-load-finished

所有需要加载的瓦片资源加载完成后触发

```ts
tileSet.on('tiles-load-finished', () => {
  console.log('tile finished');
});
```

## 瓦片 source 方法

### reloadAllTile

重新加载瓦片，会重新请求数据，适用与动态瓦片场景，如瓦片数据发生了更新，或者瓦片Join 的数据发生了更新

```ts pure
source.reloadAllTile();
```

### reloadTilebyId

重新加载特定瓦片的

参数

- z 缩放等级
- x 瓦片 x 坐标
- y 瓦片 y 坐标

```ts pure
source.reloadTileById(z, x, y);
```

### reloadTileByExtent

根据经纬度范围更新瓦片

参数

- extent: 经纬范围 [minLng, minLat, maxLng, maxLat]
- zoom: 缩放等级

### reloadTileByLnglat

根据经纬度更新瓦片，经纬度坐标转换成瓦片坐标更新

- lng 经度
- lat 纬度
- zoom 缩放等级

```tsx pure
source.reloadTileByLnglat(112, 30, 10);
```
