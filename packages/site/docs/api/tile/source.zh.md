---
title: Source
order: 2
---

`markdown:docs/common/style.md`

瓦片图层并不接受普通的地理数据如 `GeoJSON`，瓦片图层一般来说接收的都是瓦片服务的地址。只有在使用 `geojson-vt` 前端瓦片切分的时候，`source` 接受的是普通的 `GeoJSON` 数据。

- `source` 接收瓦片服务，为每个瓦片单独请求数据
- `source` 接收 `GeoJSON` 数据，在前端进行瓦片数据的切分

### 瓦片服务

我们通过 `url` 的方式设置瓦片服务的地址，同时在创建不同类型瓦片图层的时候需要设置对应类型的 `parser` 参数用于设置服务参数。

```js
const source = new Source(url, {
  parser: ...
})
```

#### url

瓦片服务的 `url` 支持多种格式

- 单服务器 向一台服务器请求瓦片数据
- 多服务器 向多台服务器请求同一份服务的瓦片数据

  - 使用大括号的写法请求设置多服务器，如 `{1-3}`、`{a-c}`。

- 请求多文件 同时请求多份瓦片服务的瓦片数据
  - 使用数组的方式设置多服务

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

#### parser

不同类型的瓦片图层需要配置不同的 `parser` 参数。

```js
const source = new Source(url, {
  parser: {
    ...
  }
})
```

- 通用参数

| 参数           | 类型                               | 默认值                                     | 描述                 |
| -------------- | ---------------------------------- | ------------------------------------------ | -------------------- |
| tileSize       | `number`                           | `256`                                      | 请求的瓦片尺寸       |
| minZoom        | `number`                           | `0`                                        | 请求瓦片的最小层级   |
| maxZoom        | `number`                           | `Infinity`                                 | 请求瓦片的最大层级   |
| zoomOffset     | `number`                           | `0`                                        | 请求瓦片层级的偏移量 |
| extent         | `[number, number, number, number]` | `[-Infinity,-Infinity,Infinity,Infinity,]` | 请求瓦片的边界       |
| updateStrategy | `UpdateTileStrategy`               | `replace`                                  | 瓦片的替换策略       |

```js
type UpdateTileStrategy = 'realtime' | 'overlap' | 'replace';
```

- 图片栅格 - TMS

| 参数 | 类型     | 值           | 描述               |
| ---- | -------- | ------------ | ------------------ |
| type | `string` | `rasterTile` | 请求图片类型的瓦片 |

- 图片栅格 - WMS

| 参数 | 类型     | 值           | 描述               |
| ---- | -------- | ------------ | ------------------ |
| type | `string` | `rasterTile` | 请求图片类型的瓦片 |

- 图片栅格 - WMTS

| 参数        | 类型           | 值                 | 描述               |
| ----------- | -------------- | ------------------ | ------------------ |
| type        | `string`       | `rasterTile`       | 请求图片类型的瓦片 |
| wmtsOptions | `IWmtsOptions` | `\` | 设置请求参数 |

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

- 数据栅格 - arraybuffer

| 参数     | 类型             | 值            | 描述               |
| -------- | ---------------- | ------------- | ------------------ |
| type     | `string`         | `rasterTile`  | 请求栅格类型的瓦片 |
| dataType | `RasterTileType` | `arraybuffer` | 栅格瓦片的类型     |

```js
enum RasterTileType {
  ARRAYBUFFER = 'arraybuffer';
  IMAGE = 'image';
  RGB = 'rgb';
}
```

- 数据栅格 - rgb

| 参数     | 类型             | 值           | 描述               |
| -------- | ---------------- | ------------ | ------------------ |
| type     | `string`         | `rasterTile` | 请求栅格类型的瓦片 |
| dataType | `RasterTileType` | `rgb`        | 栅格瓦片的类型     |

- 矢量瓦片 - point、line、polygon

| 参数 | 类型     | 值    | 描述         |
| ---- | -------- | ----- | ------------ |
| type | `string` | `mvt` | 请求矢量瓦片 |

- 矢量瓦片 - 掩模图层

| 参数 | 类型     | 值    | 描述         |
| ---- | -------- | ----- | ------------ |
| type | `string` | `mvt` | 请求矢量瓦片 |

- 矢量瓦片 - 测试图层

测试图层不需要设置 `source`。

### GeoJSON VT 前端瓦片切分

瓦片在前端可以实现瓦片数据的切分，而不是依赖瓦片服务请求瓦片数据。

```js
const source = new Source(data, {
  parser: {
    type: 'geojsonvt',
    geojsonOptions: {
      maxZoom: 14
    },
    ...
  }
})
```

#### parser

我们通过 `parser` 中的 `geojsonOptions` 参数透传 `geojson-vt` 插件的参数。其余参数和普通矢量瓦片的 `parser` 参数保持一致。

| 参数             | 类型                | 值          | 描述                   |
| ---------------- | ------------------- | ----------- | ---------------------- |
| type             | `string`            | `geojsonvt` | 矢量瓦片前端切分       |
| geojsonvtOptions | `IGeojsonvtOptions` | `/`         | 设置瓦片数据切分的参数 |

#### geojsonOptions: IGeojsonvtOptions

`geojsonOptions` 支持如下参数：

| 参数           | 类型          | 默认值   | 描述                                                           |
| -------------- | ------------- | -------- | -------------------------------------------------------------- |
| maxZoom        | `number`      | `14`     | max zoom to preserve detail on                                 |
| indexMaxZoom   | `number`      | `5`      | max zoom in the tile index                                     |
| indexMaxPoints | `number`      | `100000` | max number of points per tile in the tile index                |
| tolerance      | `number`      | `3`      | simplification tolerance (higher means simpler)                |
| extent         | `number`      | `4096`   | tile extent                                                    |
| buffer         | `number`      | `64`     | tile buffer on each side                                       |
| lineMetrics    | `boolean`     | `false`  | whether to calculate line metrics                              |
| promoteId      | `string|null` | `null`   | name of a feature property to be promoted to feature.id        |
| generateId     | `boolean`     | `true`   | whether to generate feature ids. Cannot be used with promoteId |
| debug          | `0, 1 or 2`   | `0`      | logging level (0, 1 or 2)                                      |

```javascript
fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2b7aae6e-5f40-437f-8047-100e9a0d2808.json',
)
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
  });
```
