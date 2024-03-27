---
title: GeoJsonVT 瓦片
order: 0
---

<embed src="@/docs/api/common/style.md"></embed>

`L7`In addition to the tile services provided by the backend, vector tiles also provide`geojson-vt`The tile slicing scheme allows the front end to use vector tiles without back-end support.

### Vector Tiles - GeoJsonVT

```javascript
import { PolygonLayer } from '@antv/l7';
fetch('https://gw.alipayobjects.com/os/bmw-prod/2b7aae6e-5f40-437f-8047-100e9a0d2808.json')
  .then((d) => d.json())
  .then((data) => {
    const source = new Source(data, {
      parser: { type: 'geojsonvt', maxZoom: 9 },
    });
    const polygon = new PolygonLayer({ featureId: 'COLOR' }).source(source).color('red');
  });
```

### sourceLayer

When using front-end tile segmentation, we no longer need to specify a data source for the tile layer.

### source(GeoJsonData: string, option: IOption)

When using vector tiles split by front-end tiles,`source`The method receives not the address of the data service, but the standard`GeoJSON`data.

#### option

When using front-end tile segmentation we need to`source parser`The type is set to`geojsonvt`。

```js
const source = new Source(data, {
  parser: {
    type: 'geojsonvt',
    maxZoom: 9,
    geojsonvtOptions: {},
  },
});
```

`geojsonOptions`The following parameters are supported:

| parameter      | type        | default value | describe                                                       |                                                         |
| -------------- | ----------- | ------------- | -------------------------------------------------------------- | ------------------------------------------------------- |
| maxZoom        | `number`    | `14`          | max zoom to preserve detail on                                 |                                                         |
| indexMaxZoom   | `number`    | `5`           | max zoom in the tile index                                     |                                                         |
| indexMaxPoints | `number`    | `100000`      | max number of points per tile in the tile index                |                                                         |
| tolerance      | `number`    | `3`           | simplification tolerance (higher means simpler)                |                                                         |
| extent         | `number`    | `4096`        | tile extent                                                    |                                                         |
| buffer         | `number`    | `64`          | tile buffer on each side                                       |                                                         |
| lineMetrics    | `boolean`   | `false`       | whether to calculate line metrics                              |                                                         |
| promoteId      | \`string    | null\`        | `null`                                                         | name of a feature property to be promoted to feature.id |
| generateId     | `boolean`   | `true`        | whether to generate feature ids. Cannot be used with promoteId |                                                         |
| debug          | `0, 1 or 2` | `0`           | logging level (0, 1 or 2)                                      |                                                         |
