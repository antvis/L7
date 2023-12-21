---
title: Source
order: 2
---

<embed src="@/docs/api/common/style.md"></embed>

几何体图层数据推荐使用 GeoJSON 格式的数据。

- [GeoJSON](/api/source/geojson/#point)

### GeoJSON

```js
// 传入 GeoJSON 类型数据 *** L7 默认支持，不需要 parser 解析
const data = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [104.4140625, 35.460669951495305],
            [98.7890625, 24.206889622398023],
            [111.796875, 27.371767300523047],
            [104.4140625, 35.460669951495305],
          ],
        ],
      },
    },
  ],
};

const layer = new PolygonLayer().source(data);
```
