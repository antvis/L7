---
title: Data
order: 2
---

<embed src="@/docs/api/common/style.md"></embed>

## data

Currently, the data formats supported by L7 are:`GeoJSON`，`CSV`，`JSON`，`Image`。

- `GeoJSON`Supports all standard spatial data formats such as points, lines, and areas.

- `CSV`Supports data types such as points, line segments, and arcs.

- `JSON`Supports simple point, line, and area data types, but does not support multi-point, multi-line, and multi-area data formats.

### GeoJSON

`GeoJSON`Is a format for encoding various geographic data structures. GeoJSON objects can represent geometries, features, or feature collections. GeoJSON supports the following geometry types: point, line, polygon, multipoint, multiline, polygon, and geometry collection. Features in GeoJSON include a geometric object and other attributes, and feature collections represent a series of features.

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [110.478515625, 32.76880048488168],
            [117.68554687499999, 32.76880048488168],
            [117.68554687499999, 37.64903402157866]
          ]
        ]
      }
    }
  ]
}
```

## Geostatistical analysis tools

[turfjs](http://turfjs.org/): JavaScript library for geographic data calculation, processing, statistics, and analysis

## Online tools

<http://geojson.io/>You can view, draw and modify GeoJSON data online

<https://mapshaper.org/>Can view larger geojson and simplify GeoJSON data

## Data resources

#### National administrative division GeoJSON supports province, city and county latitude

[geojson, svg download](http://datav.aliyun.com/tools/atlas/#&lat=33.50475906922609&lng=104.32617187499999&zoom=4)

#### HighCharts Global Administrative Division Dataset

<https://img.hcharts.cn/mapdata/>
