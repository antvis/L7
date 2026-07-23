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

#### map

对数据进行映射转换，可对每一个数据元素进行处理并返回新的数据元素。

**配置项**

- type: 'map'
- callback: `(feature: any) => any` 对每条数据进行处理的回调函数

```javascript
layer.source(data, {
  transforms: [
    {
      type: 'map',
      callback: (feature) => {
        feature.value = feature.value * 2;
        return feature;
      },
    },
  ],
});
```

#### filter

对数据进行过滤，仅保留满足条件的数据元素。

**配置项**

- type: 'filter'
- callback: `(feature: any) => boolean` 过滤条件回调函数，返回 `true` 时保留该条数据

```javascript
layer.source(data, {
  transforms: [
    {
      type: 'filter',
      callback: (feature) => {
        return feature.value > 10; // 仅保留 value 大于 10 的数据
      },
    },
  ],
});
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

### setData(data, options?) 更新数据

更新 source 数据，会触发图层重新渲染。

- `data` 数据，同 source 初始化参数
- `options` 配置项，同 source 初始化参数

```javascript
const source = new Source(data, { parser: { type: 'json', x: 'lng', y: 'lat' } });
// 更新数据
source.setData(newData);
```

### getFeatureById(id: number) 根据 ID 获取要素

根据 featureID 获取 feature 要素。

- `id` featureId，L7 内部编码的唯一要素 ID

```tsx
const source = layer.getSource();
const feature = source.getFeatureById(1);
```

### getFeatureId(field: string, value: any) 根据属性获取要素 ID

根据属性的 key、value 获取要素 L7 编码 featureId，确保该属性的 value 是唯一值，如存在多个返回第一个。

- `field` 属性字段
- `value` 对应的值

```tsx
const source = layer.getSource();
const featureId = source.getFeatureId('name', '张三');
```

### updateFeaturePropertiesById(id, properties) 更新要素属性

根据 ID 更新 source 的属性数据，会触发重新渲染。

- `id` featureId，L7 内部编码的唯一要素 ID
- `properties` 需要更新属性数据，进行 merge 操作

```tsx
const source = layer.getSource();
layer.on('click', (e) => {
  source.updateFeaturePropertiesById(e.featureId, {
    name: Math.random() * 10,
  });
});
```

### getClusters(zoom: number) 获取聚合数据

聚合图使用，获取指定缩放等级下的聚合数据。

- `zoom` 缩放等级

```javascript
const clusters = source.getClusters(scene.getZoom());
```

### getClustersLeaves(cluster_id) 获取聚合节点原始数据

聚合图使用，获取聚合节点的原始数据。

- `id` 聚合节点的 cluster_id

```javascript
layer.on('click', (e) => {
  console.log(source.getClustersLeaves(e.feature.cluster_id));
});
```

### updateClusterData(zoom: number) 更新聚合数据

更新聚合数据，在地图缩放后需要调用以刷新聚合结果。

- `zoom` 当前缩放等级

```javascript
scene.on('zoomchange', () => {
  source.updateClusterData(scene.getZoom());
});
```

### getSourceCfg() 获取 source 配置

获取 source 的初始化配置项。

```javascript
const cfg = source.getSourceCfg();
```

### getParserType() 获取解析器类型

获取当前 source 使用的数据解析器类型。

```javascript
const parserType = source.getParserType(); // 如 'geojson', 'json', 'csv', 'mvt' 等
```

### destroy() 销毁 source

销毁 source，释放相关资源。

```javascript
source.destroy();
```

### create(data, cfg?) 异步工厂方法

`Source.create` 是异步工厂方法，内部 `await` source 初始化（parse + cluster 初始化 + transforms）完成后返回。相比 `new Source(data, cfg)` 的 fire-and-forget 初始化，`create` 返回的实例 `data` 已就绪，可直接读取，消除 `source.data` 可能为 `undefined` 的竞态。

- `data` 数据，同 source 初始化参数
- `cfg` 配置项，同 source 初始化参数
- 返回 `Promise<Source>`

```javascript
const source = await Source.create(data, { parser: { type: 'json', x: 'lng', y: 'lat' } });
// 此时 source.data 已解析完成，无 undefined 竞态
```

### createSource(data, cfg?, registry?) 同步工厂

`createSource` 与 `new Source` 行为等价的同步工厂函数，返回 source 实例（初始化仍为 fire-and-forget）。第三个可选参数 `registry` 可注入自定义 `ParserRegistry` 实例，按需子集注册 parser / transform 或做测试隔离。

- `data` 数据，同 source 初始化参数
- `cfg` 配置项，同 source 初始化参数
- `registry`（可选）自定义 parser / transform 注册表，默认使用内置 `defaultRegistry`

```javascript
import { createSource } from '@antv/l7-source';

const source = createSource(data, { parser: { type: 'geojson' } });
```

### ready 只读属性

`source.ready` 是一个 `Promise<void>`，resolve 时 source 初始化完成（`inited === true` 且数据已解析）。可在消费侧 `await source.ready` 消除 `source.data` 竞态。

```javascript
const source = new Source(data);
await source.ready;
// source.data 已就绪
```

### stats() 获取数据快照

返回 source 当前数据的只读快照，便于调试与大小监控。不影响 source 内部状态。

返回 `ISourceStats` 对象：

- `rows: number` 已解析数据行数（`data.dataArray.length`）
- `bbox: BBox` 数据范围 `[minLng, minLat, maxLng, maxLat]`
- `parserType: string` 当前解析器类型（如 `'geojson'`、`'mvt'`）
- `tileCount: number` 已加载瓦片数（非瓦片源或未触发视口更新时为 `0`）
- `isTile: boolean` 是否为瓦片数据源
- `cluster: boolean` 是否开启聚合
- `dataVersion: number` 数据 generation（见下）

```javascript
const stats = source.stats();
console.log(stats.rows, stats.parserType, stats.tileCount);
```

### dataVersion 数据版本号

`dataVersion` 是单调递增的数据 generation 计数器，每次「数据可能变化」的操作 `+1`：

- `setData`（全量数据替换）后 `+1`
- `updateFeaturePropertiesById`（原地属性变更）后 `+1`
- `updateClusterData`（zoom 驱动的聚合视图重算，原始数据未变）**不** bump
- 构造期首次解析为 generation `0`

可用于判断数据是否已变化、避免重复处理。

```javascript
const v1 = source.dataVersion;
source.setData(newData);
const v2 = source.dataVersion; // v2 === v1 + 1
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

## 事件

Source 继承自 EventEmitter，支持 `on`/`off`/`once`/`emit` 等事件方法。

### update

数据更新事件，在以下情况触发：

- source 初始化完成后（`type: 'inited'`）
- 调用 `setData` 或 `updateFeaturePropertiesById` 后（`type: 'update'`）

```javascript
const source = layer.getSource();
source.on('update', (e) => {
  if (e.type === 'inited') {
    console.log('source 初始化完成');
  } else if (e.type === 'update') {
    console.log('source 数据已更新');
  }
});
```

### error

数据初始化或更新失败事件。当 `setData` 触发的 re-parse / cluster 初始化 / transform 执行失败时触发，payload 为错误对象。使用 `setData` 时建议监听 `error` 事件以感知失败（旧版本失败会静默 hang，现为显式 surfacing）。

```javascript
const source = layer.getSource();
source.on('error', (err) => {
  console.error('source 数据更新失败', err);
});
source.setData(newData);
```

> 注：`new Source(data, cfg)` 构造期 init 失败仍为 fire-and-forget（未捕获 rejection，保留旧行为）。若需感知构造期失败，使用 `await Source.create(...)` 或 `await source.ready`（失败时 reject）。
