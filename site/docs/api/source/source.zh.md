---
title: Source
order: 0
---

<embed src="@/docs/api/common/style.md"></embed>

## 简介

source 地理数据处理模块，主要包含数据解析（parser）和数据处理（transforms）。

```js
const source = new Source(data, option);
```

- data
- option
  - cluster **boolean** 是否聚合
  - clusterOptions 聚合配置项
  - parser 数据解析配置
  - transforms 数据处理配置

## data

不同 parser 类型对应不同 data 类型

- 瓦片图层 data 为 url 模板，支持 TMS、WMS、WMTS 数据服务
- 非瓦片图层 data 为数据对象

## option

`source` 通过 `option` 来描述或处理数据， 其中主要包括 `parser` 和 `transforms`。

### parser

parser 可以将不同类型的空间数据处理成统一数据格式。空间数据分为矢量数据、栅格数据和瓦片服务三大类：

- 矢量数据 支持 [GeoJSON](/api/source/geojson)、[CSV](/api/source/csv)、[JSON](/api/source/json) 类型
- 栅格数据 支持 [Raster](/api/source/raster)、[Image](/api/source/image) 类型
- 瓦片服务 支持 [MVT](/api/source/mvt)、[RasterTile](/api/source/raster_tile)、GeoJSON VT 类型

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

[geojson](https://www.yuque.com/antv/l7/dm2zll) 为默认数据格式，可以不设置 parser 参数

```javascript
layer.source(data);
```

### transforms

transforms 处理的是标准化后的数据，可进行数据转换、数据统计、网格布局、数据聚合等数据操作，处理完后返回的也是标准数据。标准化后的数据结构包括 coordinates 地理坐标字段，以及其他属性字段。

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

目前 grid、hexagon 两种热力图支持使用数据处理方法 transforms 配置项

- type 数据处理类型
- transforms cfg  数据处理配置项

#### grid

生成方格网布局，根据数据字段统计，主要在网格热力图中使用

- type: 'grid'
- size: 网格半径
- field: 数据统计字段
- method: 聚合方法，有 count、max、min、sum、mean 5 个统计维度

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

- type: 'hexagon'
- size: 网格半径
- field: 数据统计字段
- method: 聚合方法，有 count、max、min、sum、mean 5 个统计维度

#### join

数据连接，业务中跟多情况是地理数据和业务数据分开的两套数据，我们可与通过 join 方法将地理数据和业务数据进行关联。

**配置项**

- type: join
- sourceField: 需要连接的业务数据字段名称
- data: 需要连接的数据源，仅支持 json 格式
- targetField: 关联的地理数据字段名称

```javascript
// geoData 是地理数据
const geoData = {
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

// customData 属性数据或者业务数据
const customData = [
  {
    name: '北京',
    value: 13,
  },
  {
    name: '天津',
    value: 20,
  },
];

// 通过 join 方法我们就可以将两个数据连接到一起

layer
  .source(geoData, {
    transforms: [
      {
        type: 'join',
        sourceField: 'name', //customData 对应字段名
        targetField: 'city', // geoData 对应字段名，绑定到的地理数据
        data: customData,
      },
    ],
  })
  .color('value'); // 可以采用 customData 的 value 字段进行数据到颜色的映射
```

### cluster

- cluster: `boolean`

`cluster` 表示是否对数据进行聚合操作， 目前只有点图层支持。

### clusterOption 可选

- radius: 聚合半径 **number** default 40
- minZoom: 最小聚合缩放等级 **number** default 0
- maxZoom: 最大聚合缩放等级 **number** default 16

[聚合图使用案例](/examples/point/cluster#cluster)

## 方法

### getClustersLeaves(cluster_id)

聚合图使用，获取聚合节点的原始数据

参数：
id 聚合节点的 cluster_id

```javascript
layer.on('click', (e) => {
  console.log(source.getClustersLeaves(e.feature.cluster_id));
});
```

### setData

更新 source 数据

#### 参数

- data: 数据同 source 初始化参数
- option: 配置项同 source 初始化参数

### getFeatureById

根据 featureID 获取 feature 要素

#### 参数

- id featureId，L7 内部编码的唯一要素 ID

```tsx
const source = layer.getSource();
source.getFeatureById(1);
```

### updateFeaturePropertiesById

根据 ID 更新 source 的属性数据，会触发从新渲染

#### 参数

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

### getFeatureId

根据属性的 key、value 获取要素 L7 编码 featureId，确保该属性的 value 是唯一值，如存在多个返回第一个。

#### 参数

- key: 属性字段
- value: 对应的值

```tsx
const source = layer.getSource();
source.getFeatureId('name', '张三');
```

## Source 更新

如果数据发生改变，可以需要更新数据。
可以通过调用 `layer` 的 `setData` 方法实现数据的更新。

具体见 [Layer](/api/base_layer/base/#setdata)

```javascript
layer.setData(data);
```

<embed src="@/docs/api/common/source/tile/method.zh.md"></embed>

### 数据类型

#### JSON

[JSON 数据格式解析](/api/source/json)

#### csv

[CSV 数据格式解析](/api/source/csv)

栅格数据类型

#### image

[Image 数据格式解析](/api/source/image)
