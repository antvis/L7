---
title: Source
order: 0
---

<embed src="@/docs/api/common/style.md"></embed>

## Introduction

The source geographical data processing module mainly includes data analysis (parser) and data processing (transform).

```js
const source = new Source(data, option);
```

* data
* option
  * cluster **boolean**Whether to aggregate
  * clusterOptions aggregation configuration items
  * parser data parsing configuration
  * transforms data processing configuration

## data

Different parser types correspond to different data types

* The tile layer data is a url template and supports TMS, WMS, and WMTS data services.
* Non-tile layer data is a data object

## option

`source`pass`option`to describe how the data is processed, which mainly include`parser`and`transforms`。

### parser

Different data types are processed into a unified data format. Vector data includes different data formats such as GeoJON, CSV, and Json, and raster data includes Raster and Image data. Tile format data will also be supported in the future.

Spatial data is divided into three categories: vector data, raster data and tiles

* Vector data supports three data types: csv, geojson, and json.
* Raster data supports image, Raster
* Tile service supports mvt, rasterTile, geojsonvt

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

[geojson](https://www.yuque.com/antv/l7/dm2zll)The data is in the default data format, and the parser parameter does not need to be set.

```javascript
layer.source(data);
```

### transforms

Transforms processes standardized data and performs data operations such as data conversion, data statistics, grid layout, and data aggregation. After processing, standard data is returned.\
The standardized data structure includes coordinates geographical coordinate fields, and other attribute fields.

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

Currently, two data processing methods used in heat maps are supported: grid and hexagon transform configuration items

* type data processing type
* tansform cfg data processing configuration items

#### grid

Generate a square grid layout, based on data field statistics, mainly used in grid heat maps

* type: 'grid',
* size: grid radius
* field: data statistics field
* method: aggregation method count,max,min,sum,mean 5 statistical dimensions

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

* type: 'hexagon',
* size: grid radius
* field: data statistics field
* method: aggregation method count, max, min, sum, mean 5 statistical dimensions

#### join

Data connection, in many cases in business, geographical data and business data are two separate sets of data. We can associate geographical data and business data through the join method.

**Configuration items**

* type: join
* sourceField The name of the business data field that needs to be connected
* data The data source to be connected only supports json format
* targetField associated geographic data field name

```javascript
const data = {
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

const data2 = [
  {
    name: 'Beijing',
    value: 13,
  },
  {
    name: 'Tianjin',
    value: 20,
  },
];
// data is geographical data
// data2 attribute data or business data

// We can join two data together through the join method

layer
  .source(data, {
    transforms: [
      {
        type: 'join',
        sourceField: 'name', //data1 corresponding field name
        targetField: 'city', // data corresponds to the field name and is bound to the geographical data
        data: data2,
      },
    ],
  })
  .color('value'); // You can use the value field of data1 to map data to color.
```

### cluster

* cluster:`boolean`

`cluster`Indicates whether to aggregate data. Currently, only point layers support it.

### clusterOption optional

* radius aggregate radius**number**default 40
* minZoom: Minimum aggregate zoom level**number**default 0
* maxZoom: Maximum aggregate zoom level**number** default 16

[Aggregation graph use cases](/examples/point/cluster#cluster)

## method

### getClustersLeaves(cluster\_id)

Use the aggregation graph to obtain the original data of the aggregation node

parameter:
id cluster\_id of the aggregation node

```javascript
layer.on('click', (e) => {
  console.log(source.getClustersLeaves(e.feature.cluster_id));
});
```

### setData

Update source data

#### parameter

* data data is the same as source initialization parameter
* option configuration item is the same as source initialization parameter

### getFeatureById

Get feature elements based on featureID

#### parameter

* id featureId, unique feature ID encoded internally by L7

```tsx
const source = layer.getSource();
source.getFeatureById(1);
```

### updateFeaturePropertiesById

Updating source's attribute data based on ID will trigger re-rendering

#### parameter

* id featureId, unique feature ID encoded internally by L7
* Properties needs to update attribute data, merge operation

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

* key: attribute field
* value: corresponding value

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
