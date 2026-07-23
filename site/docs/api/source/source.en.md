---
title: Source
order: 0
---

<embed src="@/docs/api/common/style.md"></embed>

## Introduction

source geographical data processing module, mainly includes data analysis (parser) and data processing (transforms).

```js
const source = new Source(data, option);
```

- data
- option
  - cluster **boolean**Whether to aggregate
  - clusterOptions aggregation configuration items
  - parser data parsing configuration
  - transforms data processing configuration

## Compatibility

This progressive refactor (phases 0–6) keeps the **public API fully backward compatible** — existing code works unchanged:

- `new Source(data, cfg)` and `new Source(data)` keep working (`cfg` and `registry` are both optional).
- `cluster: true` silently uses the new `ClusterManager` direct path — **no warning**.
- Legacy `ISourceCFG` fields (`cluster` / `clusterOptions` / `parser` / `transforms` / `autoRender`) are all preserved.
- The `'update' { type: 'inited' | 'update' }` event behavior is unchanged; the new `'error'` event only surfaces failures explicitly (silent when no listener).

`Source.create` / `createSource` / `source.ready` / `source.stats()` / `source.dataVersion` are optional, better paths — existing code can migrate gradually, not required.

> `{ type: 'cluster' }` in the `transforms` option is deprecated (warns once at runtime, but still works). Use the top-level `cluster: true` option for aggregation, see [cluster](#cluster) below.

## data

Different parser types correspond to different data types

- The tile layer data is a url template and supports TMS, WMS, and WMTS data services.
- Non-tile layer data is a data object

## option

`source`pass`option`to describe or process data, which mainly include`parser`and`transforms`。

### parser

parser can process different types of spatial data into a unified data format. Spatial data is divided into three categories: vector data, raster data and tile services:

- Vector data support[GeoJSON](/api/source/geojson)、[CSV](/api/source/csv)、[JSON](/api/source/json)type
- Raster data support[Raster](/api/source/raster)、[Image](/api/source/image)type
- Tile service support[MVT](/api/source/mvt)、[RasterTile](/api/source/raster_tile), GeoJSON VT type

```js
type IParserType =
  | 'csv'
  | 'json'
  | 'geojson'
  | 'image'
  | 'raster'
  | 'rasterTile'
  | 'mvt'
  | 'geojsonvt';

interface IParser {
  type: IParserType;
  x?: string;
  y?: string;
  x1?: string;
  y1?: string;
  coordinates?: string;
  geometry?: string;
  [key: string]: any;
}
```

#### geojson

[geojson](https://www.yuque.com/antv/l7/dm2zll)It is the default data format and you do not need to set the parser parameter.

```javascript
layer.source(data);
```

### transforms

Transforms processes standardized data and can perform data operations such as data conversion, data statistics, grid layout, and data aggregation. After processing, standard data is returned. The standardized data structure includes coordinates geographical coordinate fields, and other attribute fields.

```json
[
  {
    "coordinates": [[]], // Geographical coordinates field
    "_id": "122", // New fields after standardization
    "name": "test",
    "value": 1
    // ....
  }
]
```

Currently, grid and hexagon heat maps support the data processing method transforms configuration item.

- type data processing type
- transforms cfg data processing configuration items

#### grid

Generate a square grid layout, based on data field statistics, mainly used in grid heat maps

- type: 'grid'
- size: grid radius
- field: data statistics field
- method: aggregation method, with 5 statistical dimensions: count, max, min, sum, mean

```javascript
layer.source(data, {
  transforms: [
    {
      type: 'grid',
      size: 15000,
      field: 'v',
      method: 'sum',
    },
  ],
});
```

#### hexagon

Generate hexagonal grid layout, statistics based on data fields

- type: 'hexagon'
- size: grid radius
- field: data statistics field
- method: aggregation method, with 5 statistical dimensions: count, max, min, sum, mean

#### map

Data mapping, used to transform each data item in the data source.

- type: 'map'
- callback: `(item: any) => any` - callback function that receives and returns each data item

```javascript
layer.source(data, {
  transforms: [
    {
      type: 'map',
      callback: function (item) {
        item.lat = parseFloat(item.lat);
        item.lng = parseFloat(item.lng);
        return item;
      },
    },
  ],
});
```

#### filter

Data filtering, used to filter out data items that do not meet the conditions.

- type: 'filter'
- callback: `(item: any) => boolean` - callback function that returns `true` to keep the item, `false` to remove it

```javascript
layer.source(data, {
  transforms: [
    {
      type: 'filter',
      callback: function (item) {
        return item.value > 10;
      },
    },
  ],
});
```

#### join

Data connection, in many cases in business, geographical data and business data are two separate sets of data. We can associate geographical data and business data through the join method.

**Configuration items**

- type: join
- sourceField: the name of the business data field that needs to be connected
- data: the data source to be connected, only supports json format
- targetField: associated geographic data field name

```javascript
// geoData is geographical data
const geoData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        city: 'Beijing',
      },
      geometry: {},
    },
  ],
};

// customData attribute data or business data
const customData = [
  {
    name: 'Beijing',
    value: 13,
  },
  {
    name: 'Tianjin',
    value: 20,
  },
];

// Through the join method, we can join the two data together

layer
  .source(geoData, {
    transforms: [
      {
        type: 'join',
        sourceField: 'name', //customData corresponding field name
        targetField: 'city', // geoData corresponding field name, the geographical data bound to
        data: customData,
      },
    ],
  })
  .color('value'); // You can use the value field of customData to map data to color.
```

### cluster

- cluster:`boolean`

`cluster`Indicates whether to aggregate data. Currently, only point layers support it.

> Prefer the top-level `cluster: true` option to enable aggregation.
> `transforms: [{ type: 'cluster' }]` is deprecated (corrupts `source.data` semantics and warns); kept only for backward compatibility.

### clusterOption optional

- radius: aggregate radius**number**default 40
- minZoom: Minimum aggregate zoom level**number**default 0
- maxZoom: Maximum aggregate zoom level**number** default 16

[Aggregation graph use cases](/examples/point/cluster#cluster)

## method

### getClusters(zoom: number)

Get aggregated data at the specified zoom level.

- `zoom` zoom level

```javascript
const clusters = source.getClusters(zoom);
```

### updateClusterData(zoom: number)

Update the aggregated data display for the specified zoom level.

- `zoom` zoom level

```javascript
source.updateClusterData(zoom);
```

### getClustersLeaves(cluster_id)

Use the aggregation graph to obtain the original data of the aggregation node

parameter:
id cluster_id of the aggregation node

```javascript
layer.on('click', (e) => {
  console.log(source.getClustersLeaves(e.feature.cluster_id));
});
```

### setData

Update source data

#### parameter

- data: data is the same as source initialization parameter
- option: configuration item is the same as source initialization parameter

### getFeatureById

Get feature elements based on featureID

#### parameter

- id featureId, unique feature ID encoded internally by L7

```tsx
const source = layer.getSource();
source.getFeatureById(1);
```

### updateFeaturePropertiesById

Updating source's attribute data based on ID will trigger re-rendering

#### parameter

- id featureId, unique feature ID encoded internally by L7
- Properties needs to update attribute data, merge operation

```tsx
const source = layer.getSource();
layer.on('click', (e) => {
  source.updateFeaturePropertiesById(e.featureId, {
    name: Math.random() * 10,
  });
});
```

### getFeatureId

Obtain the feature L7 encoding featureId based on the key and value of the attribute, and ensure that the value of the attribute is a unique value. If there are multiple, return the first one.

#### parameter

- key: attribute field
- value: corresponding value

```tsx
const source = layer.getSource();
source.getFeatureId('name', 'zhangsan');
```

### getSourceCfg()

Get the source configuration object, including parser type and transforms configuration.

```javascript
const cfg = source.getSourceCfg();
```

### getParserType()

Get the parser type string of the current source.

```javascript
const parserType = source.getParserType(); // e.g. 'geojson', 'csv', 'json'
```

### destroy()

Destroy the source and release related resources.

```javascript
source.destroy();
```

### create(data, cfg?) Async Factory

`Source.create` is an async factory method that internally `await`s source initialization (parse + cluster init + transforms) before returning. Unlike `new Source(data, cfg)` (fire-and-forget init), the instance returned by `create` has `data` already resolved and ready to read, eliminating the race where `source.data` could be `undefined`.

- `data` data, same as source initialization parameter
- `cfg` config, same as source initialization parameter
- Returns `Promise<Source>`

```javascript
const source = await Source.create(data, { parser: { type: 'json', x: 'lng', y: 'lat' } });
// source.data is now parsed, no undefined race
```

### createSource(data, cfg?, registry?) Sync Factory

`createSource` is a sync factory function behaviorally equivalent to `new Source`, returning a source instance (init remains fire-and-forget). The optional third `registry` parameter injects a custom `ParserRegistry` instance for subset registration or test isolation.

- `data` data, same as source initialization parameter
- `cfg` config, same as source initialization parameter
- `registry` (optional) custom parser/transform registry, defaults to the built-in `defaultRegistry`

```javascript
import { createSource } from '@antv/l7-source';

const source = createSource(data, { parser: { type: 'geojson' } });
```

### ready Readonly Property

`source.ready` is a `Promise<void>` that resolves when source initialization is complete (`inited === true` and data parsed). Consumers can `await source.ready` to eliminate the `source.data` race.

```javascript
const source = new Source(data);
await source.ready;
// source.data is ready
```

### stats() Get Data Snapshot

Returns a read-only snapshot of the current source data, useful for debugging and size monitoring. Does not affect internal state.

Returns an `ISourceStats` object:

- `rows: number` parsed data row count (`data.dataArray.length`)
- `bbox: BBox` data bounds `[minLng, minLat, maxLng, maxLat]`
- `parserType: string` current parser type (e.g. `'geojson'`, `'mvt'`)
- `tileCount: number` loaded tile count (`0` for non-tile sources or before viewport update)
- `isTile: boolean` whether this is a tile data source
- `cluster: boolean` whether clustering is enabled
- `dataVersion: number` data generation (see below)

```javascript
const stats = source.stats();
console.log(stats.rows, stats.parserType, stats.tileCount);
```

### dataVersion Data Version

`dataVersion` is a monotonically increasing data generation counter, incremented on each operation that may change the data:

- `+1` after `setData` (full data replacement)
- `+1` after `updateFeaturePropertiesById` (in-place property mutation)
- NOT bumped by `updateClusterData` (zoom-driven cluster view recompute, origin data unchanged)
- Initial parse on construction is generation `0`

Useful for detecting whether data has changed and avoiding redundant processing.

```javascript
const v1 = source.dataVersion;
source.setData(newData);
const v2 = source.dataVersion; // v2 === v1 + 1
```

## Events

| Event  | Description                                          |
| ------ | ---------------------------------------------------- |
| inited | Triggered after source initialization is complete    |
| update | Triggered when source data is updated                |
| error  | Triggered when data init or `setData` re-parse fails |

```javascript
source.on('update', () => {
  console.log('source data updated');
});
```

Listen to `error` to surface `setData` failures (previously silently hung):

```javascript
source.on('error', (err) => {
  console.error('source data update failed', err);
});
source.setData(newData);
```

> Note: `new Source(data, cfg)` construction-time init failure remains fire-and-forget (unhandled rejection, old behavior preserved). To observe construction-time failures, use `await Source.create(...)` or `await source.ready` (rejects on failure).

## Source update

If the data changes, the data may need to be updated.
This can be done by calling`layer`of`setData`Method to update data.

For details, see[Layer](/api/base_layer/base/#setdata)

```javascript
layer.setData(data);
```

<embed src="@/docs/api/common/source/tile/method.en.md"></embed>

### type of data

#### JSON

[JSON data format parsing](/api/source/json)

#### csv

[CSV data format analysis](/api/source/csv)

Raster data type

#### image

[Image data format analysis](/api/source/image)
