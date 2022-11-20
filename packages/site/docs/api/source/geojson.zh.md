---
title: GeoJSON
order: 1
---

<embed src="@/docs/common/style.md"></embed>

## 简介

GeoJSON 是一种对各种地理数据结构进行编码的格式。GeoJSON 对象可以表示几何、特征或者特征集合。GeoJSON 支持下面几何类型：点、线、面、多点、多线、多面和几何集合。GeoJSON 里的特征包含一个几何对象和其他属性，特征集合表示一系列特征。
[The GeoJSON Format](https://tools.ietf.org/html/draft-butler-geojson-06)

L7 数据 source 支持   传入 Geometry 集合 FeatureCollection

### Feature Collection Object

一个 feature Colletion 由对个 feature 组成

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

一个 feature 有 geometry 空间信息，properties 属性信息，其中 geometry 是必须字段

```json
{
  "type": "Feature",
  "properties": {},
  "geometry": {}
}
```

### Gemetry Object

支持 Gemetry Object 类型

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

[geojson 详细文档]()

## Geojson 相关的 JS 库

### 地理统计分析工具

[turfjs](http://turfjs.org/):   地理数据计算，处理，统计，分析的 Javascript 库

### 在线工具：

[http://geojson.io/](http://geojson.io/)     可以在线查看，绘制，修改 GeoJSON 数据

[https://mapshaper.org/](https://mapshaper.org/) 可以查看较大的 geojson，还能够简化 GeoJSON 数据
