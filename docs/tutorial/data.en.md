---
title: Source
order: 2
---
`markdown:docs/common/style.md`

## 数据

目前L7支持的数据格式有GeoJson,CSV,JSon Image

- GeoJSON 支持点、线、面等所有的标准空间数据格式。
- CSV 支持点、线段、弧线等数据类型。
- JSON 支持简单的点、线，面数据类型，不支持多点，多线的，多面数据格式。


## GeoJSON

> GeoJSON是一种对各种地理数据结构进行编码的格式。GeoJSON对象可以表示几何、特征或者特征集合。GeoJSON支持下面几何类型：点、线、面、多点、多线、多面和几何集合。GeoJSON里的特征包含一个几何对象和其他属性，特征集合表示一系列特征。



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
            [
              110.478515625,
              32.76880048488168
            ],
            [
              117.68554687499999,
              32.76880048488168
            ],
            [
              117.68554687499999,
              37.64903402157866
            ],
            [
              110.478515625,
              37.64903402157866
            ],
            [
              110.478515625,
              32.76880048488168
            ]
          ]
        ]
      }
    }
  ]
}
```

## 地理统计分析工具
[turfjs](http://turfjs.org/):  地理数据计算，处理，统计，分析的Javascript 库

## 在线工具

[http://geojson.io/](http://geojson.io/)    可以在线查看，绘制，修改GeoJSON数据

[https://mapshaper.org/](https://mapshaper.org/)  可以查看较大的geojson，还能够简化GeoJSON数据

## 数据资源

#### 全国行政区划GeoJON 支持省市县维度 
[geojson, svg下载](http://datav.aliyun.com/tools/atlas/#&lat=33.50475906922609&lng=104.32617187499999&zoom=4)

#### HighCharts 全球行政区划数据集

[https://img.hcharts.cn/mapdata/](https://img.hcharts.cn/mapdata/)
