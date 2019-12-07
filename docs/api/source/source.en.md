---
title: Source
order: 0
---

## 概述

source 地理数据处理模块，主要包含数据解析（parser)，和数据处理(transform);

### parser

不同数据类型处理成统一数据格式。矢量数据包括 GeoJON, CSV，Json 等不同数据格式，栅格数据，包括 Raster，Image 数据。将来还会支持瓦片格式数据。

空间数据分矢量数据和栅格数据两大类

- 矢量数据 支持 csv，geojson，json 三种数据类型

- 栅格数据 支持 image，Raster

### transform

数据转换，数据统计，网格布局，数据聚合等数据操作。

## API

### parser

**配置项**

- type: `csv|json|geojson|image|raster`
- 其他可选配置项，具体和数据格式相关

#### geojson

[geojson](https://www.yuque.com/antv/l7/dm2zll) 数据为默认数据格式，可以 不设置 parser 参数

```javascript
layer.source(data);
```

#### JSON

[JSON 数据格式解析](../json)

#### csv

点，线数据配置项同 json 数据类型

```javascript
layer.source(data, {
  parser: {
    type: 'csv',
    x: 'lng1',
    y: 'lat1',
    x1: 'lng1',
    y1: 'lat2',
  },
});
```

**栅格数据类型 **

#### image

根据图片的经纬度范围，将图片添加到地图上。  配置项

- type: image
- extent: 图像的经纬度范围 []

```javascript
layer.source(
  'https://gw.alipayobjects.com/zos/rmsportal/FnHFeFklTzKDdUESRNDv.jpg',
  {
    parser: {
      type: 'image',
      extent: [121.168, 30.2828, 121.384, 30.4219],
    },
  },
);
```

#### raster

栅格数据类型，主要表示遥感数据类型 data 栅格数据的二维矩阵数据 parser 配置项

- type  raster
- width  数据宽度二维矩阵 columns
- height 数据高度
- min 数据最大值
- max 数据最小值
- extent 经纬度范围

```javascript
source(values, {
  parser: {
    type: 'raster',
    width: n,
    height: m,
    min: 0,
    max: 8000,
    extent: [73.482190241, 3.82501784112, 135.106618732, 57.6300459963],
  },
});
```

### transforms

目前支持三种数据处理方法 map，grid，hexagon transform 配置项

- type 数据处理类型
- tansform cfg  数据处理配置项

#### map

数据处理，支持自定义 callback 函数

- callback:function 回调函数

```javascript
layer.source(data, {
  transforms: [
    {
      type: 'map',
      callback: function(item) {
        const [x, y] = item.coordinates;
        item.lat = item.lat * 1;
        item.lng = item.lng * 1;
        item.v = item.v * 1;
        item.coordinates = [x * 1, y * 1];
        return item;
      },
    },
  ],
});
```

#### grid

生成方格网布局，根据数据字段统计，主要在网格热力图中使用

- type: 'grid',
- size: 网格半径
- field: 数据统计字段
- method:聚合方法   count,max,min,sum,mean5 个统计维度

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

生成六边形网格布局，根据数据字段统计

- type: 'hexagon',
- size: 网格半径
- field: 数据统计字段
- method:聚合方法   count,max,min,sum,mean5 个统计维度
