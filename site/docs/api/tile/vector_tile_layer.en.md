---
title: Vector 矢量瓦片
order: 0
---

<embed src="@/docs/api/common/style.md"></embed>

### Introduction

`L7`The vector tile layer reuses the data visualization capabilities of ordinary layers and supports data mapping of layer styles. Currently, vector tiles support point, line, surface, mask and other layers.

| Classification | Layer            | parserType                          | describe                                         |
| -------------- | ---------------- | ----------------------------------- | ------------------------------------------------ |
| vector tiles   | `PointLayer`     | parser of PointLayer、`geojsonvt`   | vector point layer                               |
| vector tiles   | `LineLayer`      | parser of LineLayer、`geojsonvt`    | vector line layer                                |
| vector tiles   | `PolygonLayer`   | parser of PolygonLayer、`geojsonvt` | Vector geometry layer                            |
| vector tiles   | `MaskLayer`      | parser of MaskLayer、`geojsonvt`    | Vector mask layer                                |
| vector tiles   | `TileDebugLayer` | `/`                                 | `TileDebugLayer`No need to execute`source`method |

Other configuration items of the tile layer are consistent with the basic layers PointLayer, Linelayer, and PolygonLayer.

### options

<embed src="@/docs/api/tile/common/options.en.md"></embed>

### source(url: string, option: IOption)

The data source of vector tiles needs to pass in the tile service of vector data and the corresponding configuration parameters.

#### url

The data service path supports single service and multi-service writing.

- Single server Requests tile data from one server.
- Multiple servers request tile data for the same service from multiple servers.

  - Use braces to request the setting of multiple servers, such as`{1-3}`、`{a-c}`。

```js
// single server
const source = new Source('http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', {...})

//Multiple servers
const source = new Source('http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', {...} )
```

#### source option

Regarding the configuration parameters, what we need to relate to is the inside`parser`Parameters corresponding to the field.

```js
const source = new Source(url, {
  parser: {...}
})
```

| parameter      | type                               | default value                              | describe                           |
| -------------- | ---------------------------------- | ------------------------------------------ | ---------------------------------- |
| type           | `string`                           | /                                          | The fixed value is`mvt`            |
| tileSize       | `number`                           | `256`                                      | Requested tile size                |
| minZoom        | `number`                           | `0`                                        | Request the minimum level of tiles |
| maxZoom        | `number`                           | `Infinity`                                 | Request the maximum level of tiles |
| zoomOffset     | `number`                           | `0`                                        | Request tile level offset          |
| extent         | `[number, number, number, number]` | `[-Infinity,-Infinity,Infinity,Infinity,]` | Request the bounds of a tile       |
| updateStrategy | `UpdateTileStrategy`               | `replace`                                  | Tile replacement strategy          |

```js
type UpdateTileStrategy = 'realtime' | 'overlap' | 'replace';
```

🌟 Recommended reuse of vector tiles Source

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
