---
title: GeoJsonVT 瓦片
order: 0
---

<embed src="@/docs/common/style.md"></embed>

`L7` 矢量瓦片除了可以时候后端提供的瓦片服务之外，同时提供了 `geojson-vt` 瓦片切分方案，使得前端在没有后端支持的情况下也能使用矢量瓦片。

### 矢量瓦片 - GeoJsonVT

```javascript
import { PolygonLayer } from '@antv/l7';
fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2b7aae6e-5f40-437f-8047-100e9a0d2808.json',
)
  .then((d) => d.json())
  .then((data) => {
    const source = new Source(data, {
      parser: { type: 'geojsonvt', maxZoom: 9 },
    });
    const polygon = new PolygonLayer({ featureId: 'COLOR' })
      .source(source)
      .color('red');
  });
```

### sourceLayer

在使用前端瓦片切分的时候我们不再需要为瓦片图层指定数据源。

### source(GeoJsonData: string, option: IOption)

在使用前端瓦片切分的矢量瓦片时，`source` 方法接收的不在时数据服务的地址，而是标准的 `GeoJson` 数据。

#### option

在使用前端瓦片切分的时候我们需要将 `source parser` 的类型设置为 `geojsonvt`。

```js
const source = new Source(data, {
  parser: {
    type: 'geojsonvt',
    maxZoom: 9,
    geojsonvtOptions: {},
  },
});
```

`geojsonOptions` 支持如下参数:

| 参数           | 类型        | 默认值   | 描述                                                           |
| -------------- | ----------- | -------- | -------------------------------------------------------------- | ------------------------------------------------------- |
| maxZoom        | `number`    | `14`     | max zoom to preserve detail on                                 |
| indexMaxZoom   | `number`    | `5`      | max zoom in the tile index                                     |
| indexMaxPoints | `number`    | `100000` | max number of points per tile in the tile index                |
| tolerance      | `number`    | `3`      | simplification tolerance (higher means simpler)                |
| extent         | `number`    | `4096`   | tile extent                                                    |
| buffer         | `number`    | `64`     | tile buffer on each side                                       |
| lineMetrics    | `boolean`   | `false`  | whether to calculate line metrics                              |
| promoteId      | `string     | null`    | `null`                                                         | name of a feature property to be promoted to feature.id |
| generateId     | `boolean`   | `true`   | whether to generate feature ids. Cannot be used with promoteId |
| debug          | `0, 1 or 2` | `0`      | logging level (0, 1 or 2)                                      |
