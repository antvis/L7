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

### clusterOption optional

- radius: aggregate radius**number**default 40
- minZoom: Minimum aggregate zoom level**number**default 0
- maxZoom: Maximum aggregate zoom level**number** default 16

[Aggregation graph use cases](/examples/point/cluster#cluster)

## method

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
source.getFeatureId('name', '张三');
```

## Source update

If the data changes, the data may need to be updated.
This can be done by calling`layer`of`setData`Method to update data.

For details, see[Layer](/api/base_layer/base/#setdata)

```javascript
layer.setData(data);
```

<embed src="@/docs/api/common/source/tile/method.zh.md"></embed>

### type of data

#### JSON

[JSON data format parsing](/api/source/json)

#### csv

[CSV data format analysis](/api/source/csv)

Raster data type

#### image

[Image data format analysis](/api/source/image)
