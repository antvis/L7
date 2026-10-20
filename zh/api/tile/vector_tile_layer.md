---
title: "Vector 矢量瓦片"
description: "Vector 矢量瓦片"
language: "zh"
canonical: "https://l7.antv.antgroup.com/zh/api/tile/vector_tile_layer/"
---

[资料索引](/llms.txt)

### 简介

`L7` 的矢量瓦片图层复用了普通图层的数据可视化能力，支持对图层的样式进行数据映射。目前矢量瓦片支持了点、线、面、掩模等图层

| 分类     | Layer            | parserType                          | 描述                                      |
| -------- | ---------------- | ----------------------------------- | ----------------------------------------- |
| 矢量瓦片 | `PointLayer`     | parser of PointLayer、`geojsonvt`   | 矢量点图层                                |
| 矢量瓦片 | `LineLayer`      | parser of LineLayer、`geojsonvt`    | 矢量线图层                                |
| 矢量瓦片 | `PolygonLayer`   | parser of PolygonLayer、`geojsonvt` | 矢量几何体图层                            |
| 矢量瓦片 | `MaskLayer`      | parser of MaskLayer、`geojsonvt`    | 矢量掩模图层                              |
| 矢量瓦片 | `TileDebugLayer` | `/`                                 | `TileDebugLayer` 不需要执行 `source` 方法 |

瓦片图层其他配置项和基础图层 PointLayer、Linelayer、PolygonLayer 保持一致

### options


#### sourceLayer

_string_ **required**

只有矢量图层生效，用于设置矢量图层的数据源。

🌟 一般矢量服务返回的数据中存在多个图层的数据，我们需要从中进行选取。

```javascript
const layer = new PointLayer({
  sourceLayer: 'city',
});
```

#### featureId

_string_ **optional** _default:_ 自动数字编号

只有矢量图层生效，用于指定矢量图层的编码 `id`。

🌟 编码 `id` 用于在图层高亮时使用。

```javascript
const layer = new PointLayer({
  featureId: 'id',
});
```


### source(url: string, option: IOption)

矢量瓦片的数据源需要传入矢量数据的瓦片服务以及对应的配置参数。

#### url

数据服务的路径支持单服务和多服务的写法。

- 单服务器 向一台服务器请求瓦片数据。
- 多服务器 向多台服务器请求同一份服务的瓦片数据。
  - 使用大括号的写法请求设置多服务器，如 `{1-3}`、`{a-c}`。

```js
// 单服务器
const source = new Source('http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', {...})

// 多服务器
const source = new Source('http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', {...})
```

#### source option

关于配置参数我们需要关系的是里面 `parser` 字段对应的参数。

```js
const source = new Source(url, {
  parser: {...}
})
```

| 参数           | 类型                               | 默认值                                     | 描述                 |
| -------------- | ---------------------------------- | ------------------------------------------ | -------------------- |
| type           | `string`                           | /                                          | 固定值为 `mvt`       |
| tileSize       | `number`                           | `256`                                      | 请求的瓦片尺寸       |
| minZoom        | `number`                           | `0`                                        | 请求瓦片的最小层级   |
| maxZoom        | `number`                           | `Infinity`                                 | 请求瓦片的最大层级   |
| zoomOffset     | `number`                           | `0`                                        | 请求瓦片层级的偏移量 |
| extent         | `[number, number, number, number]` | `[-Infinity,-Infinity,Infinity,Infinity,]` | 请求瓦片的边界       |
| updateStrategy | `UpdateTileStrategy`               | `replace`                                  | 瓦片的替换策略       |

```js
type UpdateTileStrategy = 'realtime' | 'overlap' | 'replace';
```

🌟 矢量瓦片推荐复用 Source

```js
const vectorSource = new Source(
  'https://ganos.oss-cn-hangzhou.aliyuncs.com/m2/rs_l7/{z}/{x}/{y}.pbf',
  {
    parser: {
      type: 'mvt',
      maxZoom: 9,
      extent: [-180, -85.051129, 179, 85.051129],
    },
  },
);
// 复用
layer1.source(vectorSource);
layer2.source(vectorSource);
```
