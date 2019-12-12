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

[JSON 数据格式解析](./json)

#### csv

[CSV 数据格式解析](./csv)

栅格数据类型

#### image

[Image 数据格式解析](./image)

### transforms

目前支持两种热力图使用的数据处理方法 grid，hexagon transform 配置项

- type 数据处理类型
- tansform cfg  数据处理配置项

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
- method:聚合方法   count,max,min,sum,mean 5 个统计维度
