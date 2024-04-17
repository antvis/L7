---
title: JSON
order: 2
---

<embed src="@/docs/api/common/style.md"></embed>

Although GeoJSON is a universal geographical data format, in specific usage scenarios, data service personnel may not be familiar with GeoJSON, or do not have the tools to generate GeoJSON. Therefore, L7 defines the concept of Parser for data, and your data can be in any format. , just use the geographic information field corresponding to the specified data.

## JSON

⚠️ json is not a standard geographical data structure, so be sure to set Parser when using it

json data parsing uses the corresponding JSON parser

## parser

Supports two parsing methods

### Simple analysis method

This method only supports analytical point data, or line segments with only two points, or arc data.

- type `string`required`json`
- x `string`Point data represents longitude
- y `string`Point data represents latitude
- x1 `string`longitude
- x2 `string`latitude

If the data is point data, you only need to set the x,y fields.

If it is line segment or arc data, you need to know the coordinates of the starting and ending points, x, y, x1, y1

```javascript
layer.source(data, {
  parser: {
    type: 'json',
    x: 'lng',
    y: 'lat',
  },
});
```

[JSON data demo example](/examples/gallery/animate#animate_path_texture)

### Universal parsing method

It can also analyze arbitrarily complex points, lines and surfaces.

- type `string`required`json`
- coordinates `array`Required, mainly used to express more complex formats, equivalent to the geojson coordinates attribute

```javascript
layer.source(data, {
  parser: {
    type: 'json',
    coordinates: 'coord',
  },
});
```

## Usage example

### point data

#### Simple analysis

- type json
- x: longitude field
- y: latitude field

```javascript
const data = [
  {
    lng: 112.345,
    lat: 30.455,
    value: 10,
  },
  {
    lng: 114.345,
    lat: 31.455,
    value: 10,
  },
];

layer.source(data, {
  parser: {
    type: 'json',
    x: 'lng',
    y: 'lat',
  },
});
```

#### general analysis

[Point coodinates data format](/api/source/geojson##point)

```javascript
const data = [
  {
    coord: [112.345, 30.455],
    value: 10,
  },
  {
    coord: [114.345, 32.455],
    value: 10,
  },
];

layer.source(data, {
  parser: {
    type: 'json',
    coordinates: 'coord',
  },
});
```

### line data

#### Simple analysis

- type: json
- x `string`longitude
- y `string`latitude
- x1 `string`longitude
- x2 `string`latitude

Simple analysis only supports line segments composed of two points. It is mainly used when drawing arcs. You only need to specify the starting and ending point coordinates of the line segment.

```javascript
const data = [
  {
    lng1: 112.345,
    lat1: 30.455,
    lng2: 112.345,
    lat2: 30.455,
    value: 10,
  },
  {
    lng1: 114.345,
    lat1: 31.455,
    lng2: 112.345,
    lat2: 30.455,
    value: 10,
  },
];

layer.source(data, {
  parser: {
    type: 'json',
    x: 'lng1',
    y: 'lat1',
    x1: 'lng1',
    y1: 'lat2',
  },
});
```

#### general analysis

Drawing line segments and arcs also supports using coordinates to organize data.

coordinates contains two coordinates,
The first coordinate corresponds to x, y
The second coordinate corresponds to x1, y1

```javascript
const data = [
  {
    id: '1',
    coord: [
      [101.953125, 50.51342652633956],
      [119.17968749999999, 33.137551192346145],
    ],
  },
];
layer.source(data, {
  parser: {
    type: 'json',
    coordinates: 'coord',
  },
});
```

If you need to use drawing trajectory data, you need to specify the point sequence of the line through codinates.

coordinate format The coordinate field of geojson supports LineString, MultiLineString

[Line coodinates data format](/api/source/geojson#linesring)

```javascript
const data = [
  {
    name: 'path1',
    path: [
      [58.00781249999999, 32.84267363195431],
      [85.78125, 25.16517336866393],
      [101.953125, 41.77131167976407],
      [114.9609375, 39.639537564366684],
      [117.42187500000001, 28.613459424004414],
    ],
  },
];
```

Specify by coordinates when using

```javascript
layer.source(data, {
  parser: {
    type: 'json',
    coordinates: 'path',
  },
});
```

### area data

The coordinates field of surface data is relatively complex and does not support simple parsing methods.

#### general analysis

The coordinates field needs to be specified. The format is the same as the coordinates field of GeoJSON.

[Face codinates data format](/api/source/geojson/#polygon)

**Note that surface data coord is a three-layer data structure**

```javascript
[
  {
    type: 'Polygon',
    geometryCoord: [
      [
        [115.1806640625, 30.637912028341123],
        [114.9609375, 29.152161283318915],
        [117.79541015625001, 27.430289738862594],
        [118.740234375, 29.420460341013133],
        [117.46582031249999, 31.50362930577303],
        [115.1806640625, 30.637912028341123],
      ],
    ],
  },
];

layer.source(data, {
  parser: {
    type: 'json',
    coordinates: 'geometryCoord',
  },
});
```
