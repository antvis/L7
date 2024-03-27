---
title: Source
order: 2
---

<embed src="@/docs/api/common/style.md"></embed>

It is recommended to use GeoJSON format data for geometry layer data.

- [GeoJSON](/api/source/geojson/#point)

### GeoJSON

```js
// Pass in GeoJSON type data *** L7 supports it by default and does not require parser analysis
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
