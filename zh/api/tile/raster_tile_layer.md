---
title: "Raster 栅格瓦片"
description: "Raster 栅格瓦片"
language: "zh"
canonical: "https://l7.antv.antgroup.com/zh/api/tile/raster_tile_layer/"
---

[资料索引](/llms.txt)

`L7` 的栅格图层支持加载 `TMS`、`WMS`、`WMTS` 等多种格式的图片瓦片，同时也支持 `Tiff`、`Lerc` 等多种格式的数据栅格瓦片。

| 分类     | Layer         | parserType   | dataType      | 描述             |
| -------- | ------------- | ------------ | ------------- | ---------------- |
| 栅格瓦片 | `RasterLayer` | `rasterTile` | `image`、`/`  | 图片栅格         |
| 栅格瓦片 | `RasterLayer` | `rasterTile` | `arraybuffer` | 数据栅格         |
| 栅格瓦片 | `RasterLayer` | `rasterTile` | `rgb`         | 彩色遥感影像栅格 |

🌟 目前只支持 3857 坐标系

### source(url: string, option: IOption)

矢量瓦片的数据源需要传入矢量数据的瓦片服务以及对应的配置参数。

#### url

数据服务的路径处理支持单服务和多服务的写法，还支持同时请求多文件。

- 单服务器 向一台服务器请求瓦片数据。
- 多服务器 向多台服务器请求同一份服务的瓦片数据。
  - 使用大括号的写法请求设置多服务器，如 `{1-3}`、`{a-c}`。

- 请求多文件 同时请求多份瓦片服务的瓦片数据。
  - 使用数组的方式设置多服务。
  - 目前请求多文件的格式只有栅格瓦片支持。

```js
import { Source } from '@antv/l7'
// 单服务器
const source = new Source('http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', {...})

// 多服务器
const source = new Source('http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', {...})

// 请求多文件
const urls = [
  'https://ganos.oss-cn-hangzhou.aliyuncs.com/m2/l7/tiff_jx/{z}/{x}/{y}.tiff',
  'https://ganos.oss-cn-hangzhou.aliyuncs.com/m2/l7/tiff_jx/{z}/{x}/{y}.tiff',
]

const urls = [
  {
    url: 'https://ganos.oss-cn-hangzhou.aliyuncs.com/m2/l7/tiff_jx/{z}/{x}/{y}.tiff',
    bands: [0]
  },
  {
    url: 'https://ganos.oss-cn-hangzhou.aliyuncs.com/m2/l7/tiff_jx/{z}/{x}/{y}.tiff'
  },
  ...
]
const tileSource = new Source(urls, {...});
```

#### source option

通过配置 `parser` 中的参数，我们可以指定不同的瓦片类型以及瓦片服务的参数。

```js
const source = new Source(url, {
  parser: {...}
})
```

| 参数           | 类型                               | 默认值                                     | 描述                 |
| -------------- | ---------------------------------- | ------------------------------------------ | -------------------- |
| type           | `string`                           | /                                          | 描述不同类型的瓦片   |
| tileSize       | `number`                           | `256`                                      | 请求的瓦片尺寸       |
| minZoom        | `number`                           | `0`                                        | 请求瓦片的最小层级   |
| maxZoom        | `number`                           | `Infinity`                                 | 请求瓦片的最大层级   |
| zoomOffset     | `number`                           | `0`                                        | 请求瓦片层级的偏移量 |
| extent         | `[number, number, number, number]` | `[-Infinity,-Infinity,Infinity,Infinity,]` | 请求瓦片的边界       |
| updateStrategy | `UpdateTileStrategy`               | `replace`                                  | 瓦片的替换策略       |

```js
type UpdateTileStrategy = 'realtime' | 'overlap' | 'replace';
```

关于不同的栅格瓦片使用不同的 `parser` 参数。

| 瓦片类型    | type         | dataType      | 描述             |
| ----------- | ------------ | ------------- | ---------------- |
| TMS         | `rasterTile` | `image`       | 图片栅格         |
| WMS         | `rasterTile` | `image`       | 图片栅格         |
| WMTS        | `rasterTile` | `image`       | 图片栅格         |
| arraybuffer | `rasterTile` | `arraybuffer` | 数据栅格，单通道 |
| rgb         | `rasterRgb`  | `arraybuffer` | 数据栅格，多通道 |

🌟 `WMTS` 格式的瓦片有额外的参数。

| 参数          | 类型           | 值  | 描述         |
| ------------- | -------------- | --- | ------------ |
| `wmtsOptions` | `IWmtsOptions` | `/` | 设置请求参数 |

`IWmtsOptions` 的参数用于拼接 `url`。

```js
interface IWmtsOptions {
  layer: string;
  version?: string;
  style?: string;
  format: string;
  service?: string;
  tileMatrixset: string;
}
```

#### parser 参数

##### type: string

用于指定瓦片服务的解析方式，值为 `rasterTile` 和 `mvt`。<br />
`rasterTile` 用于栅格瓦片的解析，`mvt` 用于矢量瓦片的解析。

##### dataType: string

使用 `dataType` 区分图片栅格和数据栅格，值为 `image` 和 `arraybuffer`，默认为 `image`。

```javascript
// 设置图片栅格
layer.source({
  'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
  {
    parser: {
      type: 'rasterTile',
      dataType: 'image',
      ...
    }
  }
})

// 设置数据栅格
layer.source({
  'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
  {
    parser: {
      type: 'rasterTile',
      dataType: 'arraybuffer',
      ...
    }
  }
})
```

##### minZoom/maxZoom: number

设置瓦片数据的请求层级。当地图的缩放层级 `zoom` 小于 `minZoom` 后，或 `zoom` 大于 `maxZoom` 后将不再请求新的瓦片。<br />
`minZoom` 的默认值为 `-Infinity`。<br />
`maxZoom` 的默认值为 `Infinity`。

##### tileSize: number

设置的值是瓦片服务返回的瓦片大小。<br />
`tileSize` 的默认值为 256。<br />
ps： 该值在生产瓦片的时候确定，我们设置的 `tileSize` 需要和瓦片服务返回的保持一致。

##### extent: [number, number, number, number]

设置请求瓦片数据的边界， 格式是 `[minLng, maxLat, maxLng, minLat]`，只会请求范围内的瓦片数据。

##### zoomOffset: number

设置的值用于改变请求的瓦片数据的层级，通常在移动端可以请求更高一级的瓦片以获取更好的清晰度。
`zoomOffset` 的默认值为 0

##### format: IRasterFormat

_IFormat_ **必选**

`format` 方法用于从传入的栅格文件二进制数据中提取波段数据。

- 第一个参数是栅格文件二进制数据。
- 第二个参数是第一个参数指定的栅格文件中应该提取的波段，方法参数是我们通过 `source` 参数传递的 `data` 数值。
- `format` 是一个 `async` 方法。

```js
interface IRasterData {
  rasterData: HTMLImageElement | Uint8Array | ImageBitmap | null | undefined;
  width: number;
  height: number;
}
type IRasterFormat = (
  data: ArrayBuffer,
  bands: number[],
) => Promise<IRasterData | IRasterData[]>;

const source = new Source(data, {
  parser: {
    format: async (data, bands) => {
      ...
      return {
        rasterData: bandData,
        width: 256;
        height: 256;
      }
    }
  }
})
```

## style

- 单通道 绘制结果由是单一的数值控制，如灰度图，数值对应的颜色可以通过表示配置 `rampColors` 色带控制。

```js
layer.style({
  opacity: 0.5,
});
```

### options

| style       | 类型               | 描述                                        | 默认值        |
| ----------- | ------------------ | ------------------------------------------- | ------------- |
| opacity     | `number`           | 图形的透明度                                | `1`           |
| clampLow    | `boolean`          | 设置为 `true`，低于 `domain` 的数据将不显示 | `false`       |
| clampHigh   | `boolean`          | 设置为 `true`，高于 `domain` 的数据将不显示 | `false`       |
| domain      | `[number, number]` | 数据映射区间                                | `[ 0, 8000 ]` |
| noDataValue | `number`           | 不会显示的值                                | `-9999999`    |
| rampColors  | `IRampColors`      | 值域映射颜色的色带                          | `/`           |

### rampColors 颜色色带

- type 类型 支持 `linear','quantize','custom','cat'
- colors  颜色数组
- positions 数据分段区间，可选，quantize 不需要设置 position，position 为原始数据值

⚠️ 2.13 新增特性

#### cat 枚举类型色带

枚举类型色带只支持 0 -255 的整数类型，positions 用来设置枚举

```tsx
{
  type:'cat',
  colors:['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00'],
  positions:[1,20,101,102,200],
}
```

#### quantize 等间距分类色带

等间距只根据数据的区间 domain 进行均匀分段，如 domain [0,10000]，如果分 5 段，每段间距 2000。
等间距不需要设置 positions，只需要设置colors，根据colors 的长度设置分段数

```tsx
rampColors: {
  type:'quantize',
  colors: ['#f0f9e8','#bae4bc','#7bccc4','#43a2ca','#0868ac']
}
```

#### linear 线性连续色带

linear 为现有连续类型的加强版，positions 支持设置源数据，不需要转换成 0-1

```tsx
rampColors: {
  type:'linear',
  colors: ['#f0f9e8','#bae4bc','#7bccc4','#43a2ca','#0868ac'],
  positions [0,200,1000,4000,8000]
}

⚠️ 兼容 2.13.0 之前版本，未设置type 时，position 值域为 0-1。


```

#### custom 自定义分段色带

自定义分段色带区别等间距色带，用户自定义分段间隔。
自定义 positions 的长度需要比 colors 的长度多1个，同时poisitions

```tsx
rampColors: {
  type:'custom',
  colors: ['#f0f9e8','#bae4bc','#7bccc4','#43a2ca','#0868ac'],
  positions: [0,200,1000,4000,8000,10000]
}
```
