---
title: GeoJSON
order: 1
---

<embed src="@/docs/api/common/style.md"></embed>

## Introduction

GeoJSON is a format for encoding various geographic data structures. GeoJSON objects can represent geometries, features, or collections of features. GeoJSON supports the following geometry types: point, line, polygon, multipoint, multiline, polygon, and geometry collection. A feature in GeoJSON contains a geometric object and other attributes, and a feature collection represents a series of features.[The GeoJSON Format](https://tools.ietf.org/html/draft-butler-geojson-06)

L7 data source supports passing in the Geometry collection FeatureCollection

### Feature Collection Object

A feature Collection consists of pairs of features

```json
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

### Feature Object

A feature has geometry spatial information and properties attribute information, where geometry is a required field.

```json
{
  "type": "Feature",
  "properties": {},
  "geometry": {}
}
```

### Gemetry Object

Supports Gemetry Object type

#### Point

```json
{
  "type": "Point",
  "coordinates": [100.0, 0.0]
}
```

#### MultiPoint

```json
{
  "type": "MultiPoint",
  "coordinates": [
    [100.0, 0.0],
    [101.0, 1.0]
  ]
}
```

Line

#### LineSring

```json
{
  "type": "LineString",
  "coordinates": [
    [100.0, 0.0],
    [101.0, 1.0]
  ]
}
```

#### MultiLineString

```json
{
  "type": "MultiLineString",
  "coordinates": [
    [
      [100.0, 0.0],
      [101.0, 1.0]
    ],
    [
      [102.0, 2.0],
      [103.0, 3.0]
    ]
  ]
}
```

Polygon

#### Polygon

```json
{
  "type": "Polygon",
  "coordinates": [
    [
      [100.0, 0.0],
      [101.0, 0.0],
      [101.0, 1.0],
      [100.0, 1.0],
      [100.0, 0.0]
    ]
  ]
}
```

With holes:

```json
{
  "type": "Polygon",
  "coordinates": [
    [
      [-170.0, 10.0],
      [170.0, 10.0],
      [170.0, -10.0],
      [-170.0, -10.0],
      [-170.0, 10.0]
    ],
    [
      [175.0, 5.0],
      [-175.0, 5.0],
      [-175.0, -5.0],
      [175.0, -5.0],
      [175.0, 5.0]
    ]
  ]
}
```

#### MultiPolygon

```json
{
  "type": "MultiPolygon",
  "coordinates": [
    [
      [
        [102.0, 2.0],
        [103.0, 2.0],
        [103.0, 3.0],
        [102.0, 3.0],
        [102.0, 2.0]
      ]
    ],
    [
      [
        [100.0, 0.0],
        [101.0, 0.0],
        [101.0, 1.0],
        [100.0, 1.0],
        [100.0, 0.0]
      ],
      [
        [100.2, 0.2],
        [100.8, 0.2],
        [100.8, 0.8],
        [100.2, 0.8],
        [100.2, 0.2]
      ]
    ]
  ]
}
```

[geojson detailed documentation]()

## GeoJSON related JS libraries

### Geostatistical analysis tools

[turfjs](http://turfjs.org/): JavaScript library for geographic data calculation, processing, statistics, and analysis

### Online tools:

<http://geojson.io/>You can view, draw and modify GeoJSON data online

<https://mapshaper.org/>Ability to view larger geojson and also simplify GeoJSON data
