---
title: Source
order: 2
---

<embed src="@/docs/common/style.md"></embed>

`masklayer` 接收 `polygon` 类型的 `GeoJson` 数据作为数据源、同时支持矢量瓦片数据作为数据源。

### GeoJson

```js
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "tom"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [-2.8125, 34.59704151614417],
            [65.390625, 34.59704151614417],
            [65.390625, 61.10078883158897],
            [-2.8125, 61.10078883158897],
            [-2.8125, 34.59704151614417]
          ]
        ]
      }
    }
  ]
}
```

### 矢量数据源

```js
const mask = new MaskLayer({
  sourceLayer: 'ecoregions2',
}).source(
  'https://ganos.oss-cn-hangzhou.aliyuncs.com/m2/rs_l7/{z}/{x}/{y}.pbf',
  {
    parser: {
      type: 'mvt',
      tileSize: 256,
      maxZoom: 9,
    },
  },
);
```
