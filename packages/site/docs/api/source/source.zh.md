---
title: Source
order: 0
---

`markdown:docs/common/style.md`

## 概述

source 地理数据处理模块，主要包含数据解析（parser)，和数据处理（transform）

- data
- option
  - cluster **boolean** 是否聚合
  - clusterOption 聚合配置项
  - parser 数据解析配置
  - transforms 数据处理配置

### parser

不同数据类型处理成统一数据格式。矢量数据包括 GeoJON， CSV，Json 等不同数据格式，栅格数据，包括 Raster，Image 数据。将来还会支持瓦片格式数据。

空间数据分矢量数据和栅格数据两大类

- 矢量数据 支持 csv，geojson，json 三种数据类型

- 栅格数据 支持 image，Raster

### transform

数据转换，数据统计，网格布局，数据聚合等数据操作。

## API

### cluster `boolean` 可选 可以只设置

### clusterOption 可选

- radius 聚合半径 **number** default 40
- minZoom: 最小聚合缩放等级 **number** default 0
- maxZoom: 最大聚合缩放等级 **number** default 16

[聚合图使用案例](../../../examples/point/cluster#cluster)

### parser

**配置项**

- type: `csv|json|geojson|image|raster`
- 其他可选配置项，具体和数据格式相关

#### geojson

[geojson](https://www.yuque.com/antv/l7/dm2zll) 数据为默认数据格式，可以 不设置 parser 参数

```javascript
layer.source(data);
```

### Source 更新

如果数据发生改变，可以需要更新数据
可以通过调用 layer 的 setData 方法实现数据的更新

具体见 [Layer](../layer/layer/#setdata)

```javascript
layer.setData(data);
```

### 方法

#### getClustersLeaves(cluster_id)

聚合图使用，获取聚合节点的原始数据

参数：
id 聚合节点的 cluster_id

```javascript
layer.on('click', (e) => {
  console.log(source.getClustersLeaves(e.feature.cluster_id));
});
```

#### setData

更新 source 数据

##### 参数

- data 数据同 source 初始化参数
- option 配置项同 source 初始化参数

#### getFeatureById

根据 featurID 获取 feature 要素

##### 参数

- id featureId，L7 内部编码的唯一要素 ID

```tsx
const source = layer.getSource();
source.getFeatureById(1);
```

#### updateFeaturePropertiesById

根据 ID 更新 source 的属性数据，会触发从新渲染

##### 参数

- id featureId，L7 内部编码的唯一要素 ID
- Properties 需要更新属性数据，merge 操作

```tsx
const source = layer.getSource();
layer.on('click', (e) => {
  source.updateFeaturePropertiesById(e.featureId, {
    name: Math.random() * 10,
  });
});
```

#### getFeatureId

根据属性的 key、value 获取要素 L7 编码 featureId，确保该属性的 value 是唯一值，如存在多个返回第一个。

##### 参数

- key: 属性字段
- value: 对应的值

```tsx
const source = layer.getSource();
source.getFeatureId('name', '张三');
```

### 数据类型

#### JSON

[JSON 数据格式解析](./json)

#### csv

[CSV 数据格式解析](./csv)

栅格数据类型

#### image

[Image 数据格式解析](./image)

### transforms

tranforms 处理的是的标准化之后的数据
标准化之后的数据结构包括 coordinates 地理坐标字段，以及其他属性字段。

处理完之后返回的也是标准数据

```json
[
  {
    "coordinates": [[]], // 地理坐标字段
    "_id": "122", // 标准化之后新增字段
    "name": "test",
    "value": 1
    // ....
  }
]
```

目前支持两种热力图使用的数据处理方法 grid，hexagon transform 配置项

- type 数据处理类型
- tansform cfg  数据处理配置项

#### grid

生成方格网布局，根据数据字段统计，主要在网格热力图中使用

- type: 'grid',
- size: 网格半径
- field: 数据统计字段
- method: 聚合方法  count,max,min,sum,mean 5 个统计维度

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

#### join

数据连接，业务中跟多情况是地理数据和业务数据分开的两套数据，我们可与通过 join 方法将地理数据和业务数据进行关联。

**配置项**

- type: join
- sourceField 需要连接的业务数据字段名称
- data 需要连接的数据源 仅支持 json 格式
- targetField 关联的地理数据字段名称

```javascript
const data = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        city: '北京',
      },
      geometry: {},
    },
  ],
};

const data2 = [
  {
    name: '北京',
    value: 13,
  },
  {
    name: '天津',
    value: 20,
  },
];
// data 是地理数据
// data2 属性数据或者业务数据

// 通过join方法我们就可以将两个数据连接到一起

layer
  .source(data, {
    transforms: [
      {
        type: 'join',
        sourceField: 'name', //data1 对应字段名
        targetField: 'city', // data 对应字段名 绑定到的地理数据
        data: data2,
      },
    ],
  })
  .color('value'); // 可以采用data1的value字段进行数据到颜色的映射
```
