---
title: Raster TileLayer
order: 0
---

<embed src="@/docs/common/style.md"></embed>

`L7` 的栅格图层支持加载 `TMS`、`WMS`、`WMTS` 等多种格式的图片瓦片，同时也支持 `Tiff`、`Lerc` 等多种格式的数据栅格瓦片。

| 分类     | Layer         | parserType   | dataType      | 描述             |
| -------- | ------------- | ------------ | ------------- | ---------------- |
| 栅格瓦片 | `RasterLayer` | `rasterTile` | `image`、`/`  | 图片栅格         |
| 栅格瓦片 | `RasterLayer` | `rasterTile` | `arraybuffer` | 数据栅格         |
| 栅格瓦片 | `RasterLayer` | `rasterTile` | `rgb`         | 彩色遥感影像栅格 |

🌟 目前只支持 `GCJ-02` 火星坐标系。

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

用于指定瓦片服务的解析方式，值为 `rasterTile` 和 `mvt`。  
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
`zoomOffset` 的默认值为 0

##### format: IRasterFormat

<description> _IFormat_ **必选** </description>

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

1. `format` 方法的返回值为栅格数据（`rasterData`）以及表示大小的 `width`、`height` 参数。
2. `format` 方法可以返回多份数据，表示从当前栅格文件中提取多份波段的数据。

##### operation: IOperation

<description> _IOperation_ **可选** </description>

在加载多波段数据的时候我们可以通过 `operation` 配置波段数据的运算。

🌟 我们可以不配置 `operation`，此时默认使用第一个栅格文件提取的第一个波段数据

1. `operation` 可以是一个函数，`allbands` 是我们从所有栅格文件中提取的所有波段数据的集合。

```js
const parser = {
  operation: (allBands) => {
    // operation 可以是一个函数，allbands 是我们从所有栅格文件中提取的所有波段数据的集合，
    // 在设立 allbands 就是 [band0]
    // 函数的返回值是单纯的波段数据，在这里我们直接返回第一个波段的数据
    return allBands[0].rasterData;
  },
};
```

2. `operation` 可以是以数组形式存在的计算表达式.

```js
// 下面表达式可以转述为 band1 * 0.5，表示将波段1 的值都乘上 0.5 并返回
const parser = {
  operation: ['*', ['band', 1], 0.5],
};
```

3. `operation` 可以嵌套使用：`['+', ['*', ['band', 0], 0.2], ['band', 1]]]`，返回结果为：`band0 * 0.2 + band1`。

4. `operation` 可以直接指定结果：`['band', 0]`。

5. `operation` 支持以下的数学运算。

```js
/** 数学运算 根据计算表达式进行数学运算
 * * * Math operators:
 * `['*', value1, value2]` 返回  `value1 * value2`
 * `['/', value1, value2]` 返回 `value1 / value2`
 * `['+', value1, value2]` 返回 `value1 + value2`
 * `['-', value1, value2]` 返回 `value2 - value1`
 * `['%', value1, value2]` 返回 `value1 % value2`
 * `['^', value1, value2]` 返回  `value1 ^ value2`
 * `['abs', value1]`       返回  `Math.abs(value1)`
 * `['floor', value1]`     返回  `Math.floor(value1)`
 * `['round', value1]`     返回  `Math.round(value1)`
 * `['ceil', value1]`      返回  `Math.ceil(value1)`
 * `['sin', value1]`       返回  `Math.sin(value1)`
 * `['cos', value1]`       返回  `Math.cos(value1)`
 * `['atan', value1, value2]` 返回  `n1===-1?Math.atan(n1): Math.atan2(n1, n2)`
 */
```
