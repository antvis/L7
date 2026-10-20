---
title: "PolygonLayer"
description: "PolygonLayer"
language: "zh"
canonical: "https://l7.antv.antgroup.com/zh/api/polygon_layer/polygonlayer/"
---

[资料索引](/llms.txt)

## 简介

面图层用于绘制 2D 多边形以及沿 Z 轴拉伸后的 3D 图形，支持 GeoJSON Polygon / MultiPolygon 数据。

```javascript
import { PolygonLayer } from '@antv/l7';

const layer = new PolygonLayer()
  .source({
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [104.4140625, 35.460669951495305],
              [98.7890625, 24.206889622398023],
              [111.796875, 27.371767300523047],
              [104.4140625, 35.460669951495305],
            ],
          ],
        },
      },
    ],
  })
  .shape('fill')
  .color('#f00')
  .style({
    opacity: 0.6,
  });
```

## options


### name

_string_ **optional** _default:_ 自动数字编号

设置图层名称,可根据 name 获取 layer

```javascript
scene.getLayerByName(name);
```

### visible

_bool_ **optional** _default:_ true

图层是否可见

### zIndex

_int_ **optional** _default:_ 0

图层绘制顺序，数值大绘制在上层，可以控制图层绘制的上下层级

L7 采用队列渲染的机制，所有的图层在内部保存在一个数组中，每一帧的渲染会将图层数组按照 zIndex 的值进行排序，然后遍历数组，将符合条件的图层渲染到场景中

### minZoom

_number_ **optional** _default:_ Mapbox （0-24） 高德 （2-19)

图层显示最小缩放等级

### maxZoom

_number_ **optional** _default:_ Mapbox （0-24） 高德 （2-19)

图层显示最大缩放等级

### autoFit

_bool_ **optional** _default:_ false

layer 初始化完成之后，地图是否自动缩放到图层范围

### pickingBuffer

_bool_ **optional** _default:_ 0

图层拾取缓存机制，如 1px 宽度的线鼠标很难拾取(点击)到, 通过设置该参数可扩大拾取的范围（放大图层对象的尺寸）

### blend

_string_ **optional** _default:_ 'normal'

图层元素混合效果

- normal 正常效果 默认 发生遮挡的时候，只会显示前面的图层的颜色
- additive 叠加模式 发生遮挡的时候，显示前后图层颜色的叠加
- subtractive 相减模式 发生遮挡的时候，显示前后图层颜色的相减
- max 最大值 发生遮挡的时候，显示图层颜色 rgb 的最大值

### enablePropagation

_boolean_ **optional** _default:_ 'false'
图层事件，默认只响应最上层图层，设置为true 将允许事件透传

⚠️ mask、maskfence 不推荐使用，一下配置 2.14.x 之后版本生效

模板图层：用做模板的图层，PointLayer、LineLayer、PolygonLayer 都可以作为模板
掩模图层：被模板切割的图层

### enableRelativeCoordinates

图层使用相对坐标系，缩放等级大于 20,室内场景

### maskLayers

掩模图层生效

_array Layer_ **optional** _default:_ []

### enableMask

掩模图层生效

是否开启掩模，默认开启 maskLayers 不为空时生效

_bool_ **optional** _default:_ true

### maskInside

    掩模图层生效

_boolean_ **optional** _default:_ true

用来描述当前图层的内容与掩模边界显示。

- `true` 在掩模内部显示
- `false` 在掩模外部显示

### maskOpetation 掩模方式

模板图层生效
_枚举_ **optional** _default:_ and
maskLayers 为多个时失效，需要在模板图层设置

- or 交集
- and 并集

使用示例

```ts
const polygonLayer = new Polygon();
const rasterLayer = new Raster({
  // 栅格图层使用polygon 掩模
  maskLayers: [polygonLayer],
  enableMask: true,
  maskInside: true,
});
```




## source


几何体图层数据推荐使用 GeoJSON 格式的数据。

- [GeoJSON](/zh/api/source/geojson/#point)

### GeoJSON

```js
// 传入 GeoJSON 类型数据 *** L7 默认支持，不需要 parser 解析
const data = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [104.4140625, 35.460669951495305],
            [98.7890625, 24.206889622398023],
            [111.796875, 27.371767300523047],
            [104.4140625, 35.460669951495305],
          ],
        ],
      },
    },
  ],
};

const layer = new PolygonLayer().source(data);
```


## shape


`shape` 方法用于指定面图层绘制图形的类型，如填充图，填充线，挤出集合体等。

### shape('fill')

`shape` 为 `fill` 几何图层用于绘制平面的几何图形。

```js
layer.shape('fill');
```

### shape('extrude')

`shape` 为 `extrude` 几何图层用于绘制 3D 的几何体。

```js
layer.shape('extrude');
```

### extrusion

extrude 图层的升级版, 支持 extrusionBase（基础高度）数据映射

```js
layer.shape('extrusion');
```

### shape('water')

`shape` 为 `water` 几何图层用于绘制平面水体。

```js
layer.shape('water');
```

### shape('ocean')

`shape` 为 `ocean` 几何图层用于绘制平面海洋水体。

```js
layer.shape('ocean');
```

### shape('line')

`shape` 为 `line` 几何图层用于绘制线。

```js
layer.shape('line');
```

### shape('point_fill')

`shape` 为 `point_fill` 几何图层用于绘制填充点。

```js
layer.shape('point_fill');
```

### shape('point_image')

`shape` 为 `point_image` 几何图层用于绘制点图标。

```js
layer.shape('point_image');
```

### shape('point_extrude')

`shape` 为 `point_extrude` 几何图层用于绘制柱子。

```js
layer.shape('point_extrude');
```

### shape('text')

`shape` 为 `text` 几何图层用于绘制文字。

```js
layer.shape('text');
```


## color


`color` 方法用于设置图形的颜色。

### IColor: string

`color` 类型的字符串。

- color 类型可以为 rgb 的写法 `rgb(200, 100, 100)`、`rgba(255, 0, 0, 1)`
- color 类型可以为十六进制的写法 `#ffffff`、`#000`
- color 类型可以是颜色名称的写法 `red`、`yellow`

### color(color: IColor)

图层可以直接设置颜色值。

```js
layer.color('#f00');
```

### color(field: string)

图层的颜色可以根据图层接受的数据值进行映射，接受传入数据的字段作为参数。

```js
layer.source([
  {
    lng: 120,
    lat: 30,
    c: '#f00',
  },
]);
layer.color('c');
```

### color(field: string, domain: IColor[])

`color` 方法支持简单的值映射，将根据 `field` 从传入图层的数据中提取的值映射到 `domain` 值域中。

```js
layer.color('type', ['#f00', '#0f0', '#00f']);
```

### color(field: string, callback: () => IColor )

`color` 方法支持回调函数的写法，将根据 `field` 作为 `callback` 方法的参数，`callback` 方法的返回值作为图层实际的颜色。

```js
layer.color('type', (value) => {
  switch (value) {
    case 'water':
      return '#f00';
    case 'wood':
      return '#0f0';
  }
});
```



## size


`size` 方法用于设置 Polygon 的高度

### IPointSize: number ｜[number, number] | [number, number, number]

- size 类型为 number 则表示 Polygon 的高度

```javascript
pointLayer.size(1);
```

### size(width: IPointSize)

面图层可以直接设置半径。图层中所有的点使用一个高度。

```js
layer.size(2);
```

### size(field: string)

面图层的高度可以根据图层接受的数据值进行映射，接受传入数据的字段作为参数。

```js
layer.source([
  {
    lng: 120,
    lat: 30,
    r: 2,
  },
]);
layer.size('r');
```

### size(field: string, domain: IPointSize[])

`size` 方法支持简单的值映射，将根据 `field` 从传入图层的数据中提取的值映射到 `domain` 值域中。

```js
layer.size('type', [1, 2, 3]);
```

### size(field: string, callback: () => IPointSize )

`size` 方法支持回调函数的写法，将根据 `field` 作为 `callback` 方法的参数，`callback` 方法的返回值作为面图层实际高度。

```js
layer.size('type', (value) => {
  switch (value) {
    case 'path':
      return 1;
    case 'road':
      return 2;
  }
});
```


## scale


`scale` 方法设置数据字段映射方法，用于设将地图数据值（数字、日期、类别等数据）转成视觉值（颜色、大小、形状）。尺度 Scale 是数据可视化的基本组成部分，因为它们决定了视觉编码的性质。

### scale(field: string, scaleConfig: IScaleConfig)

- `field` 指定 source 中传入的数据中用于映射的字段名
- `scaleConfig` 列定义配置，对象类型

```javascript
interface IScaleConfig {
  type: ScaleTypeName;
  domain?: any[];
  ...
}

layer.color('id', ['#f00', '#ff0'])
.size('mag', [1, 80])
.scale('mag', {
  type: 'linear',
  domain: [ 1, 50]
})；
```

### ScaleTypeName

`scale` 的类型可以分为 `3` 类 `11` 种，不同 `Scale` 的差异在于 `domain->range` 的转换方法的不同。<br />
`range` 和 `domain` 是 `Scale` 中非常重要的两个参数。

- domain: 地图数据值的定义区间
- range：视觉值的区间定义

| 数据类型 | 度量类型                                                          |
| -------- | ----------------------------------------------------------------- |
| 连续     | linear、log、pow、time、sequential、quantize、quantile、threshold |
| 分类     | cat、time                                                         |
| 常量     | identity                                                          |

#### Cat

Cat 指枚举类型，用于展示分类数据，比如农作物种植区分布图，水稻、玉米、大豆等不同类别需要映射为不同的颜色。

```js
// 三种作物会分别转成对应的颜色
// domain = ['corn','rice', 'soybean'];
// range = ['red','white','blue'];
const data = [
  { lng: 120, lat: 30, t: 'corn' },
  { lng: 121, lat: 30, t: 'rice' },
  { lng: 122, lat: 30, t: 'soybean' },
];
layer.source(data, {
  parser: {
    type: 'type',
    x: 'lng',
    y: 'lat',
  },
});
layer.scale('t', { type: 'cat' });
layer.color('t', ['red', 'white', 'blue']);
```

#### identify

常量度量 某个字段是不变的常量。

#### linear

线性是连续数据的映射方法，数据和视觉值是通过线性方法换算的。如数据值 1-100 线性映射到红到蓝的线下渐变色每个数字对应一个颜色

#### quantize

相等间隔会将属性值的范围划分为若干个大小相等的子范围。相等间隔最适用于常见的数据范围，如百分比和温度。这种方法强调的是某个属性值相对于其他值的量

#### quantile

每个类都含有相等数量的要素。分位数分类非常适用于呈线性分布的数据。分位数为每个类分配数量相等的数据值。不存在空类，也不存在值过多或过少的类。
由于使用“分位数”分类将要素以同等数量分组到每个类中，因此得到的地图往往具有误导性。可能会将相似的要素置于相邻的类中，或将值差异较大的要素置于相同类中。可通过增加类的数量将这种失真降至最低。

#### threshold

他允许将域的任意子集（非统一段）映射到范围内的离散值。输入域仍然是连续的，并根据提供给域属性的一组阈值划分为多个切片。 range 属性必须有 N+1 个元素，其中 N 是域中提供的阈值边界数

手动设置间隔 Manual interval 手动设置分级分类区间，某些数据会有相应的业界标准，或者需要进行某种特殊的显示。如空气质量数据有严格数据分段标准

```
-1   => "red"
0    => "white"
0.5  => "white"
1.0  => "blue"
1000 => "blue

```

#### diverging || Sequential

用于返回给定的颜色数组的统一非有理 B-spline 插值器函数，该数组将转换为RGB颜色。

```js
const scaleColors = d3interpolate.interpolateRgbBasis(colors);
```

### IScaleConfig

```js
interface IScaleConfig {
  type: ScaleTypeName;
  domain?: any[];
  range?: any[];
  neutral?: number;
  field?: string;
  unknown?: string;
  ticks?: any[];
  nice?: boolean;
  clamp?: boolean;
  format?: () => any;
}
```



## style


`style` 方法用于配制图层的样式，相同图层拥有不同的 `shape` 图形，不同 `shape` 的图层 `style` 方法接受不同的参数。

```js
layer.style({
  opacity: 0.5,
});
```

### common

通用 `style` 参数，所有图形都支持的参数。

| style   | 类型     | 描述         | 默认值 |
| ------- | -------- | ------------ | ------ |
| opacity | `number` | 图形的透明度 | `1`    |

### fill

`shape` 为平面填充几何体。

- [fill](/zh/api/polygon_layer/shape#shapefill)

| style         | 类型             | 描述     | 默认值 |
| ------------- | ---------------- | -------- | ------ |
| raisingHeight | `number`         | 抬升高度 | `0`    |
| opacityLinear | `IOpacityLinear` | 透明渐变 | `/`    |

#### opacityLinear

```js
type IDir = 'in' | 'out';

interface IOpacityLinear {
  enable: false;
  dir: IDir;
}
```

### extrude

`shape` 为挤出几何体。

- [extrude](/zh/api/polygon_layer/shape#shapeextrude)

| style         | 类型      | 描述                       | 默认值  |
| ------------- | --------- | -------------------------- | ------- |
| raisingHeight | `number`  | 抬升高度                   | `0`     |
| heightfixed   | `boolean` | 抬升高度是否随 `zoom` 变化 | `false` |
| topsurface    | `boolean` | 顶部是否显示               | `true`  |
| sidesurface   | `boolean` | 侧面是否显示               | `true`  |
| sourceColor   | `IColor`  | 侧面底部颜色               | `/`     |
| targetColor   | `IColor`  | 侧面顶部颜色               | `/`     |

### extrusion

`shape` 为挤出几何体。

- [extrusion](/zh/api/polygon_layer/shape#extrusion)

| style         | 类型     | 描述             | 是否支持数据映射 | 默认值 |
| ------------- | -------- | ---------------- | ---------------- | ------ |
| extrusionBase | `number` | 基础高度，单位米 | 支持             | `0`    |

#### linear

几何体图层支持配置渐变效果（sourceColor、targetColor），在配置渐变效果后会覆盖 `layer.color` 方法设置的颜色。

### water

`shape` 为水体表面几何体。

- [water](/zh/api/polygon_layer/shape#shapewater)

| style        | 类型     | 描述     | 默认值 |
| ------------ | -------- | -------- | ------ |
| speed        | `number` | 水波速度 | `0.5`  |
| waterTexture | `string` | 水面贴图 | `0`    |

`waterTexture` 默认值为 'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*EojwT4VzSiYAAAAAAAAAAAAAARQnAQ'

### ocean

`shape` 为海洋表面几何体。

- [ocean](/zh/api/polygon_layer/shape#shapeocean)

| style       | 类型     | 描述     | 默认值    |
| ----------- | -------- | -------- | --------- |
| watercolor  | `IColor` | 水面颜色 | `#6D99A8` |
| watercolor2 | `IColor` | 水面颜色 | `#0F121C` |

### other

几何体图层支持的其他 `shape` 都有对应的图层，可以参考对应图层的样式参数。


## animate


几何体图层在 `shape` 为 `water` 或 `ocean` 的时候会得到流动的水面，此时我们需要使用 `animate` 方法开启动画。

<div>
  <div style="width:40%;float:left; margin: 16px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*BiawTbtX-CYAAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

### animate(boolean)

`animate` 方法支持布尔值和对象传值。

```javascript
layer.animate(true);

layer.animate({
  enable: true,
});
```


## 图层通用方法

## options

### name

_string_ **optional** _default:_ 自动数字编号

设置图层名称,可根据 name 获取 layer

```javascript
scene.getLayerByName(name);
```

### visible

_bool_ **optional** _default:_ true

图层是否可见

### zIndex

_int_ **optional** _default:_ 0

图层绘制顺序，数值大绘制在上层，可以控制图层绘制的上下层级

L7 采用队列渲染的机制，所有的图层在内部保存在一个数组中，每一帧的渲染会将图层数组按照 zIndex 的值进行排序，然后遍历数组，将符合条件的图层渲染到场景中

### minZoom

_number_ **optional** _default:_ Mapbox （0-24） 高德 （2-19)

图层显示最小缩放等级

### maxZoom

_number_ **optional** _default:_ Mapbox （0-24） 高德 （2-19)

图层显示最大缩放等级

### autoFit

_bool_ **optional** _default:_ false

layer 初始化完成之后，地图是否自动缩放到图层范围

### pickingBuffer

_bool_ **optional** _default:_ 0

图层拾取缓存机制，如 1px 宽度的线鼠标很难拾取(点击)到, 通过设置该参数可扩大拾取的范围（放大图层对象的尺寸）

### blend

_string_ **optional** _default:_ 'normal'

图层元素混合效果

- normal 正常效果 默认 发生遮挡的时候，只会显示前面的图层的颜色
- additive 叠加模式 发生遮挡的时候，显示前后图层颜色的叠加
- subtractive 相减模式 发生遮挡的时候，显示前后图层颜色的相减
- max 最大值 发生遮挡的时候，显示图层颜色 rgb 的最大值

### enablePropagation

_boolean_ **optional** _default:_ 'false'
图层事件，默认只响应最上层图层，设置为true 将允许事件透传

⚠️ mask、maskfence 不推荐使用，一下配置 2.14.x 之后版本生效

模板图层：用做模板的图层，PointLayer、LineLayer、PolygonLayer 都可以作为模板
掩模图层：被模板切割的图层

### enableRelativeCoordinates

图层使用相对坐标系，缩放等级大于 20,室内场景

### maskLayers

掩模图层生效

_array Layer_ **optional** _default:_ []

### enableMask

掩模图层生效

是否开启掩模，默认开启 maskLayers 不为空时生效

_bool_ **optional** _default:_ true

### maskInside

    掩模图层生效

_boolean_ **optional** _default:_ true

用来描述当前图层的内容与掩模边界显示。

- `true` 在掩模内部显示
- `false` 在掩模外部显示

### maskOpetation 掩模方式

模板图层生效
_枚举_ **optional** _default:_ and
maskLayers 为多个时失效，需要在模板图层设置

- or 交集
- and 并集

使用示例

```ts
const polygonLayer = new Polygon();
const rasterLayer = new Raster({
  // 栅格图层使用polygon 掩模
  maskLayers: [polygonLayer],
  enableMask: true,
  maskInside: true,
});
```



## 数据方法

### source 数据

设置图层数据以及解析配置 `source(data, config)`。

- data { geojson | json | csv }
- config   可选   数据源配置项
  - parser 数据解析，默认是解析层 geojson
  - transforms [transform，transform ]  数据处理转换可设置多个

`parser` 和  `transforms` [见 source 文档](/zh/api/source/source)。

```javascript
layer.source(data, {
  parser: {
    type: 'csv',
    x: 'lng',
    y: 'lat',
  },
  transforms: [
    {
      type: 'map',
      callback: function (item) {
        const [x, y] = item.coordinates;
        item.lat = item.lat * 1;
        item.lng = item.lng * 1;
        item.v = item.v * 1;
        item.coordinates = [x * 1, y * 1];
        return item;
      },
    },
    {
      type: 'hexagon',
      size: 6000,
      field: 'v',
      method: 'sum',
    },
  ],
});
```

### cluster

我们在使用 `cluster` 配置聚合图之后就可以使用一些聚合方法来获取对应参数。

#### getClusters(zoom: number): IFeatureCollection

获取指定缩放等级的聚合数据

- `zoom` 缩放等级

#### getClustersLeaves(id: string): IFeatureCollection

根据 `id` 获取聚合节点的数据，每个聚合节点会有一个唯一 `ID`。

- `id` 聚合节点的 `id`

```ts
const source = layer.getSource();
source.getClustersLeaves(id);
layer.on('click', (e) => {
  console.log(source.getClustersLeaves(e.feature.cluster_id));
});
```

## scale 数据度量

Scale 度量是将地图数据值（数字、日期、类别等数据）转成视觉值（颜色、大小、形状）。尺度 Scale 是数据可视化的基本组成部分，因为它们决定了视觉编码的性质。 L7 目前支持连续、离散、枚举类型数据的Scale，并支持位置、形状、大小和颜色编码的映射。

在使用 L7 过程中，默认情况下不需要进行 Scale 的配置，因为 L7 会根据数据类型对 scale 推断，推断过程如下：

查看用户是否设置了 Scale，如果没有:

判断字段的第一条数据的字段类型，如果数据中不存在对应的字段：

认为是常量为固定值

如果是数字则为 'linear';

如果是字符串类型 'cat';

### scale

[Scale 详细介绍](https://mp.weixin.qq.com/s/QyD1_ypu0PDwMxEz45v6Jg)

参数： (field: string, scaleOptions: IscaleOptions)

- `field` 指定 source 中传入的数据中用于映射的字段名
- `scaleOptions` 列定义配置，对象类型
  - type scale 类型
  - unknown 未匹配颜色 可选 默认透明
  - domain 值域 可选

```javascript
interface IscaleOptions {
  type: ScaleTypeName;
  domain?: any[];
  ...
}

layer.color('id', ['#f00', '#ff0'])
.size('mag', [1, 80])
.scale('mag', {
  type: 'linear',
  domain: [ 1, 50]
})；
```

#### 类型

Range 和 domain 是 Scale 中非常重要的两个参数

domain: 地图数据值的定义区间
range：视觉值的区间
不同Scale 的差异在于 domain->range 的转换方法的不同

- domain: 地图数据值的定义区间
- range：视觉值的区间定义

| 数据类    | 度量类型                              |
| --------- | ------------------------------------- |
| 连续      | linear、log、pow                      |
| 连续分类  | quantize quantile,threshold,diverging |
| 分类 枚举 | cat                                   |

#### Cat

Cat 指枚举类型，用于展示分类数据，比如农作物种植区分布图，水稻、玉米、大豆等不同类别需要映射为不同的颜色。

```js
// 三种作物会分别转成对应的颜色
// domain = ['corn','rice', 'soybean'];
// range = ['red','white','blue'];
const data = [
  { lng: 120, lat: 30, t: 'corn' },
  { lng: 121, lat: 30, t: 'rice' },
  { lng: 122, lat: 30, t: 'soybean' },
];
layer.source(data, {
  parser: {
    type: 'type',
    x: 'lng',
    y: 'lat',
  },
});
layer.scale('t', { type: 'cat' });
layer.color('t', ['red', 'white', 'blue']);
```

#### identify

数据值和映射值相同
比如数据中value 字段记录了每个要素的颜色，数值既为要映射的结果值s

```
// 设置为 identify
layer.scale('value', { type: 'identify' });

// 或者

layer.scale('value'); // L7  能够自动推断为  identify

```

#### linear

线性是连续数据的映射方法，数据和视觉值是通过线性方法换算的。如数据值 1-100 线性映射到红到蓝的线下渐变色每个数字对应一个颜色

#### quantize

相等间隔会将属性值的范围划分为若干个大小相等的子范围。相等间隔最适用于常见的数据范围，如百分比和温度。这种方法强调的是某个属性值相对于其他值的量

#### quantile

每个类都含有相等数量的要素。分位数分类非常适用于呈线性分布的数据。分位数为每个类分配数量相等的数据值。不存在空类，也不存在值过多或过少的类。
由于使用“分位数”分类将要素以同等数量分组到每个类中，因此得到的地图往往具有误导性。可能会将相似的要素置于相邻的类中，或将值差异较大的要素置于相同类中。可通过增加类的数量将这种失真降至最低。

#### threshold

他允许将域的任意子集（非统一段）映射到范围内的离散值。输入域仍然是连续的，并根据提供给域属性的一组阈值划分为多个切片。 range 属性必须有 N+1 个元素，其中 N 是域中提供的阈值边界数

手动设置间隔 Manual interval 手动设置分级分类区间，某些数据会有相应的业界标准，或者需要进行某种特殊的显示。如空气质量数据有严格数据分段标准

```
-1   => "red"
0    => "white"
0.5  => "white"
1.0  => "blue"
1000 => "blue

```

#### diverging

离散分类通常与两种相反的色调一起使用，以显示从负值到中心到正值的变化。这些类型的地图显示了彼此相关的值的大小。

### getScale(scaleName:string)

根据视觉通道名称获取 scale 实例,调用之前确保 layer 已经初始化完成

```ts
const scale = layer.getScale('color');
const color = scale(1); // 将数值转换成颜色
```

更多是方法
<a  target="_blank" href='https://github.com/antvis/L7/blob/master/packages/layers/src/core/BaseLayer.ts#L1176'>scale 示例使用</a>

## 视觉编码方法

可视化编码是将数据转换为可视形式的过程，L7 目前支持形状，大小，颜色 3 种视觉通道，你可以指定数据字段，为不同要素设置不同的图形属性。

<img width="100%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*PzoTRJnY-fIAAAAAAAAAAAAAARQnAQ'>

### filter

数据过滤方法,支持回调函数，将数据映射为true | false, 结果为true 时可见

```ts
pointLayer.filter('type', (type) => {
  // 回调函数
  if (type === 'a') {
    return false;
  }
  return true;
});
```

### size

将数据值映射到图形的大小上的方法，size 方法具体的参数使用可以查看对应图层的详细文档

```javascript
pointLayer.size(10); // 常量
pointLayer.size('type'); // 使用字段映射到大小
pointLayer.size('type', [0, 10]); // 使用字段映射到大小，并指定最大值和最小值
pointLayer.size('type', (type) => {
  // 回调函数
  if (type === 'a') {
    return 10;
  }
  return 5;
});
```

#### size(value）

传入数字常量，如  `pointLayer.size(20)`

#### size(field)

根据 field 字段的值映射大小，使用默认的`最大值 max:10`  和`最小值 min: 1`。

#### size(field, callback)

使用回调函数控制图形大小。

- `callback`: function 回调函数。

```javascript
pointLayer.size('age', (value) => {
  if (value === 1) {
    return 5;
  }
  return 10;
});
```

### color

将数据值映射到图形的颜色上的方法。

```javascript
layer.color('red'); // 常量颜色
layer.color('type'); // 对 type 字段进行映射，使用内置的颜色
layer.color('type', ['red', 'blue']); // 指定颜色
layer.color('type', (type) => {
  // 通过回调函数
  if (type === 'a') {
    return 'red';
  }
  return 'blue';
});
layer.color('type*value', (type, value) => {
  //多个参数，通过回调函数
  if (type === 'a' && value > 100) {
    return 'red';
  }
  return 'blue';
});
```

#### color(value)

参数：`value` ：string

只支持接收一个参数，value 可以是：

- 映射至颜色属性的数据源字段名，如果数据源中不存在这个字段名的话，则按照常量进行解析，这个时候会使用 L7 默认提供的颜色。

- 也可以直接指定某一个具体的颜色值 color，如 '#fff', 'white','rgba(255,0,0,0.5)' ,rgb(255,0,1) 等。

如果数据为映射到颜色，默认为透明色不显示，如果需要设置该颜色，需要在scale 中设置

示例

```javascript
layer.color('name'); // 映射数据字段
layer.color('white'); // 指定颜色
```

#### color(field, colors)

参数：

- `field`: stringfield 为映射至颜色属性的数据源字段名，也支持指定多个参数。

- `colors`: string | array | function

colors 的参数有以下情况：  如果为空，即未指定颜色的数组，那么使用内置的全局的颜色；如果需要指定颜色，则需要以数组格式传入，那么分类的颜色按照数组中的颜色确定。

```javascript
layer.scale('name',{
  type:'quantile'
  unknown:'#ccc' // 设置无效颜色
})
layer.color('name'); // 使用identity
layer.color('name', ['red', 'blue']); // 使用传入的指定颜色
```

- colors 如果是回调函数，则该回调函数的参数为对应字段的数值，具体使用如下，当 color 映射为多个字段时，参数按照字段声明的顺序传入：

```javascript
layer.color('gender', (value) => {
  if (value === 1) {
    return 'red';
  }
  return 'blue';
});
layer.color('gender*age', (gender, age) => {
  if (age === 20 && gender == ' 男') {
    return 'red';
  }
  return 'blue';
});
```

### shape

通常一种图层可以有多种表现形式，shape 方法用于指定图层具体的表现形式，以 PointLayer 的 shape 为例：

```javascript
shape('circle'); // 圆形
shape('triangle'); // 三角形
shape('cylinder'); // 圆柱
```

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*iN0nTYRDd3AAAAAAAAAAAABkARQnAQ'>

**shape(shape)**

参数 `shape` string

- 只支持接收一个参数，指定几何图像对象绘制的形状。下表列出了不同的 图层 几何图形对象支持的 shape 形状

| layer 类型 | shape 类型                                                                             | 备注 |
| ---------- | -------------------------------------------------------------------------------------- | ---- |
| point      | 2d:point,circle, square, triangle,hexagon,image,text 3d:circle,triangle,hexagon,square |      |
| line       | line,arc, arc3d, greatcircle                                                           |      |
| polygon    | fill,line, extrude                                                                     |      |

**shape(field, shapes)**

- shape 根据字段指定行形状，比如根据字段指定 PointLayer/imageLayer 的 icon 类型

```javascript
scene.addImage(
  '00',
  'https://gw.alipayobjects.com/zos/basement_prod/604b5e7f-309e-40db-b95b-4fac746c5153.svg',
);
scene.addImage(
  '01',
  'https://gw.alipayobjects.com/zos/basement_prod/30580bc9-506f-4438-8c1a-744e082054ec.svg',
);
scene.addImage(
  '02',
  'https://gw.alipayobjects.com/zos/basement_prod/7aa1f460-9f9f-499f-afdf-13424aa26bbf.svg',
);
const imageLayer = new PointLayer()
  .source(data, {
    parser: {
      type: 'json',
      x: 'longitude',
      y: 'latitude',
    },
  })
  .shape('name', ['00', '01', '02'])
  .size(20);
scene.addLayer(imageLayer);
```

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*oVyHT5S3sv0AAAAAAAAAAABkARQnAQ'>

[在线案例](/zh/examples/point/image/image/)

**shape(field, callback)**

- shape 也支持回调函数的写法

```javascript
.shape('key', value => {
  if(value > 10) {
    return 'circle';
  } else {
    return 'triangle';
  }
}
```

### rotate

将数据值映射到图形的旋转角度上的方法，用于控制点图层图标/图形的旋转。

```javascript
layer.rotate(45); // 常量，所有元素旋转 45 度
layer.rotate('angle'); // 字段映射
layer.rotate('angle', [0, 360]); // 字段映射到角度范围
layer.rotate('angle', (angle) => {
  return angle * (Math.PI / 180); // 回调函数
});
```

### label

为图层设置标注（文字标签），将数据字段映射为标注内容显示在图层元素旁边。主要在特定图层类型（如 PointLayer 的文字标注）中生效。

```javascript
layer.label('name'); // 以 name 字段的值作为标注文本
layer.label('name', (name) => `${name}市`); // 回调函数处理标注文本
```


### style

style 方法通常用于描述图层具体的样式，大多数图层会支持一些比较通用的属性， 如 opacity 属性，同时每个图层也会有仅限本图层支持的属性，如只有
CityBuildingLayer 支持的 windowColor 属性，每个图层具体要如何配置属性请查看每个图层的详细文档。

- opacity 设置透明度 大部分图层都支持

- stroke 线填充颜色 仅点图层支持

- strokeWidth 线的宽度 仅点图层支持

```javascript
layer.style({
  opacity: 0.8,
  stroke: 'white',
});
```

- 样式数据映射🌟<br />
  在正常情况下，style 的参数会作用到一个图层上的所有图形，如一个 PointLayer 中有十个点，我们设置 opacity = 0.5， 这样十个点的透明度都是 0.5。<br />
  而在特殊情况下，我们可能需要为每个点分别设置一个透明度，这时候按照原来的方式直接设置 style 方法的 opacity 的值就无法满足需求了，为此我们需要提供特殊的赋值方式。<br />
  通常我们会根据传入图层的数据为图层的每个图形设置单独的值，因此我们称之为“样式数据映射”。<br />
  我们支持几种设置 style 中的参数从 source 数据中动态取值的写法。

```javascript
// 根据数据中的 v 字段的值设置点图层各个点的透明度
const data = [
  {
    lng: 120,
    lat: 30,
    v: 0.5
  },
  ...
]
const layer = new PointLayer()
  .source(data, {
    parser: {
      x: 'lng',
      y: 'lat'
    }
  })
  .shape('circle')
  .color('#f00')
  .size({
    // 第一种写法 根据字段从 data 中直接取值
    opacity: 'v'// opacity = 0.5
  });
scene.addLayer(layer);
```

[在线案例](/zh/examples/point/text/style-map/)

从 `L7 2.5` 开始，各图层样式将逐步支持样式数据映射，目前支持样式数据映射的 `style` 参数如下：

| layer 类型/shape       | 支持的样式字段                                       | 备注                              |
| ---------------------- | ---------------------------------------------------- | --------------------------------- |
| pointLayer/fill        | opacity、strokeOpacity、strokeWidth、stroke、offsets | shape circle、triangle...         |
| pointLayer/image       | opacity、offsets                                     | offsets 经纬度偏移                |
| pointLayer/normal      | opacity、offsets                                     |                                   |
| pointLayer/text        | opacity、strokeWidth、stroke、textOffset             | textOffset 相对文字画布位置的偏移 |
| pointLayer/extrude     | opacity                                              |                                   |
| polygonLayer/fill      | opacity                                              |                                   |
| polygonLayer/extrude   | opacity                                              |                                   |
| lineLayer/line         | opacity                                              |                                   |
| lineLayer/arc          | opacity、thetaOffset                                 | thetaOffset 弧线的弯曲弧度        |
| lineLayer/arc3d        | opacity                                              |                                   |
| lineLayer/great_circle | opacity                                              |                                   |

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*iz3ERZdg2SkAAAAAAAAAAAAAARQnAQ'>

[在线案例](/zh/examples/point/scatter/scatter-style-map/)


### texture

目前只在线图层上支持了纹理方法

- texture 方法支持传入由 scene.addImage 方法添加的全局 icon 贴图资源

```javascript
// 首先在全局加载图片资源
scene.addImage(
  'plane',
  'https://gw.alipayobjects.com/zos/bmw-prod/0ca1668e-38c2-4010-8568-b57cb33839b9.svg',
);

const layer = new LineLayer({
  blend: 'normal',
})
  .source(data, {
    parser: {
      type: 'json',
      x: 'lng1',
      y: 'lat1',
      x1: 'lng2',
      y1: 'lat2',
    },
  })
  .size(25)
  .shape('arc')
  .texture('plane') // 为图层绑定纹理
  .color('#8C1EB2')
  .style({
    lineTexture: true, // 开启线的贴图功能
    iconStep: 30, // 设置贴图纹理的间距
    textureBlend: 'replace', // 设置纹理混合方式，默认值为 normal，可选值有 normal/replace 两种
  });
```

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*KEupSZ_p0pYAAAAAAAAAAAAAARQnAQ'>

[在线案例](/zh/examples/line/animate/plane-animate2/)


## 图层更新方法

如果已经添加了图层，需要修改图层显示样式可以再次调用图形映射方法，然后调用 `scene.render()`更新渲染即可

### scale 更新

重新调用scale 方法

```tsx
layer.scale('value', {
  type: 'quantile',
});
scene.render();
```

### 数据映射

重新调用 color/size/filter/shape等方法

```javascript
layer.color('blue');
layer.size(10);

scene.render();
```

### layer.style

```javascript
layer.style({
  opacity: 1,
});

scene.render();
```

### setData(data, option?: {})

更新 Source 数据

参数:

- data 数据
- option 默认和初始配置项一致，如果数据格式相同可不设置

调用 setData 方法会自动更新图层渲染

```javascript
layer.setData(data);
```

### setBlend(type: string)

设置图层叠加方法
参数：

- type blend 类型 normal ｜ additive ｜ subtractive ｜ max


## 图层控制方法

### show()

图层显示

```javascript
layer.show();
```

### hide()

图层隐藏

```javascript
layer.hide();
```

### isVisible(): boolean

图层是否可见

```javascript
layer.isVisible();
```

### setIndex(zIndex: int)

设置图层绘制顺序

```javascript
layer.setIndex(1);
```

### fitBounds()

缩放到图层范围

```javascript
layer.fitBounds();
```

### setMinZoom(zoom: number)

设置图层最小缩放等级

```javascript
layer.setMinZoom(zoom);
```

### setMaxZoom(zoom: number)

设置图层最大缩放等级

参数

- zoom {number}

```javascript
layer.setMaxZoom(zoom);
```

### getMinZoom(): number

获取图层最小缩放等级

```javascript
const minZoom = layer.getMinZoom();
```

### getMaxZoom(): number

获取图层最大缩放等级

```javascript
const maxZoom = layer.getMaxZoom();
```

### destroy()

销毁图层，释放相关资源。场景调用 `removeLayer` 时会自动销毁图层，一般不需要手动调用。

```javascript
layer.destroy();
```


## 图层交互方法

### active(activeOption | boolean)

- 开启或者关闭 mousehover 元素高亮效果
- `activeOption`
  - `color`: 高亮颜色
  - `mix`: 可选参数，默认为 0，表示高亮颜色是指定纯色，最大有效值是1，表示高亮色全部是底色

```javascript
activeOption: {
  color: '#f00';
  mix: 0.6;
}
```

```javascript
// 开启 Active  使用默认高亮颜色
layer.active(true);

//  开启 Active  自定义高亮颜色

layer.active({
  color: 'red',
  mix: 0.6,
});

// 关闭高亮效果
layer.active(false);
```

### setActive(featureId: int)

根据元素 ID 设置指定元素 hover 高亮

🌟 指定元素高亮不等于图层高亮，一个图层包含多个元素，一般传入 source 的数据数组中有多少单条数据，一个图层就有多少元素

```javascript
layer.setActive(featureId);
```

### select(selectOption | boolean)

- 开启或者关闭 mouseclick 元素选中高亮效果
- selectOption
  - `color`: 选中高亮颜色
  - `mix`: 可选参数，默认为 0，表示选中高亮颜色是指定纯色，最大有效值是1，表示选中高亮色全部是底色

```javascript
selectOption: {
  color: '#f00';
  mix: 0.6;
}
```

```javascript
// 开启 Active  使用默认高亮颜色
layer.select(true);

//  开启 Active  自定义高亮颜色

layer.select({
  color: 'red',
  mix: 0.6,
});

// 关闭高亮效果
layer.select(false);
```

### setSelect(featureId: int)

根据元素 ID 设置指定元素 click 选中 高亮

🌟 指定元素高亮不等于图层高亮，一个图层包含多个元素，一般传入 source 的数据数组中有多少单条数据，一个图层就有多少元素

```javascript
layer.setSelect(featureId);
```

### setAutoFit(autoFit: boolean)

让用户可以主动设置图层的 autoFit 参数<br />
🌟 设置完该方法后会在图层发生更新的时候生效，如在 setData 之后触发

```javascript
// 使用方法
layer.setAutoFit(true);
// 内部实现
public setAutoFit(autoFit: boolean): ILayer {
    this.updateLayerConfig({
      autoFit,
    });
    return this;
  }
```

### getScale(attr: string)

支持单独获取某个图形经过 scale 计算后的值， 满足用户获取图层某些 feature 值的需求。

- attr scale 的属性值

```javascript
const data = [
  { lng: 120, lat: 30, name: 'n1' },
  { lng: 120, lat: 30, name: 'n2' },
];
const layer = new PointLayer()
  .source(data, {
    parser: {
      x: 'lng',
      y: 'lat',
      type: 'json',
    },
  })
  .shape('circle')
  .color('name', ['#f00', '#ff0'])
  .size('name', [20, 40]);

scene.addLayer(layer);

// 此时在 scene 上绘制两个点
// 一个颜色为黄色，大小为 40 的点，对应 name 为 n1
// 一个颜色为红色，大小为 20 的点，对应 name 为 n2

const colorScale = layer.getScale('color'); // 获取 color 方法产生的 scale
const color1 = colorScale('n1'); // '#ff0'
const color1 = colorScale('n2'); // '#f00'

const sizeScale = layer.getScale('size'); // 获取 size 方法产生的 scale
const size1 = sizeScale('n1'); // 40
const size2 = sizeScale('n2'); // 20
```

### getLegendItems(type: string)

不推荐使用，将废弃，

获取图例配置

- type 图例类型
- index 可选 默认

```javascript
layer.getLegendItems('color');

layer.getLegendItems('size');
```

### getLegend(type: string)

getLegendItems方法的替代方法

该方法需要

返回值

- type 图例类型
- field 映射字段
- items 图例项

```javascript
layer.getLegend('color');

layer.getLegend('size');
```

注：rasterayer 只支持 color 类型


## 图层掩模方法

### addMask

    添加 Mask 图层

```ts
const polygonLayer = new Polygon();
layer.addMask(polygonLayer);
scene.render();
```

### removeMask

```ts
const polygonLayer = new Polygon();
layer.removeMask(polygonLayer);
scene.render();
```

### disableMask

```ts
layer.disableMask();
scene.render();
```

### enableMask

```ts
layer.enableMask();
scene.render();
```


## 鼠标事件

鼠标事件回调参数 target

```javascript
layer.on(eventName, (target) => console.log(target));
```

- x: number 鼠标  在地图位置 x 坐标
- y: number 鼠标  在地图位置 y 坐标
- type: string 鼠标事件类型
- lngLat: 经度度对象 {lng:number, lat: number }; 鼠标所在位置经纬度
- feature: any; 数据选中的地理要素信息
- featureId: number | null; 数据选中的地理要素的 ID

### click

点击事件

```javascript
layer.on('click', (e) => console.log(e));
```

### dblclick

双击

```javascript
layer.on('dblclick', (e) => console.log(e));
```

### mousemove

鼠标移动事件

```javascript
layer.on('mousemove', (e) => console.log(e));
```

### mouseout

鼠标移除

```javascript
layer.on('mouseout', (e) => console.log(e));
```

### mouseup

鼠标抬起

```javascript
layer.on('mouseup', (e) => console.log(e));
```

### mousedown

鼠标按下

```javascript
layer.on('mousedown', (e) => console.log(e));
```

### contextmenu

鼠标右键

```javascript
layer.on('contextmenu', (e) => console.log(e));
```

### dblclick

双击拾取元素

```javascript
layer.on('dblclick', (e) => console.log(e));
```

### mouseenter

鼠标进入图层要素时触发

```javascript
layer.on('mouseenter', (e) => console.log(e));
```

### unclick

点击未拾取到元素

```javascript
layer.on('unclick', (e) => console.log(e));
```

### unmousemove

鼠标移动未拾取到元素

```javascript
layer.on('unmousemove', (e) => console.log(e));
```

### unmouseup

鼠标抬起未拾取到元素

```javascript
layer.on('unmouseup', (e) => console.log(e));
```

### unmousedown

鼠标按下未拾取到元素

```javascript
layer.on('unmousedown', (e) => console.log(e));
```

### uncontextmenu

鼠标右键位拾取到元素

```javascript
layer.on('uncontextmenu', (e) => console.log(e));
```

### unpick

所有鼠标事件未拾取到

```javascript
layer.on('unpick', (e) => console.log(e));
```

### touchstart

移动端事件 touchstart

```javascript
layer.on('touchstart', (e) => console.log(e));
```

### touchend

移动端事件 touchend

```javascript
layer.on('touchend', (e) => console.log(e));
```

使用示例

```javascript
layer.on('click', (ev) => {}); // 鼠标左键点击图层事件
layer.on('mouseenter', (ev) => {}); // 鼠标进入图层要素
layer.on('mousemove', (ev) => {}); // 鼠标在图层上移动时触发
layer.on('mouseout', (ev) => {}); // 鼠标移出图层要素时触发
layer.on('mouseup', (ev) => {}); // 鼠标在图层上单击抬起时触发
layer.on('mousedown', (ev) => {}); // 鼠标在图层上单击按下时触发
layer.on('contextmenu', (ev) => {}); // 图层要素点击右键菜单

// 鼠标在图层外的事件
layer.on('unclick', (ev) => {}); // 图层外点击
layer.on('unmousemove', (ev) => {}); // 图层外移动
layer.on('unmouseup', (ev) => {}); // 图层外鼠标抬起
layer.on('unmousedown', (ev) => {}); // 图层外单击按下时触发
layer.on('uncontextmenu', (ev) => {}); // 图层外点击右键
layer.on('unpick', (ev) => {}); // 图层外的操作的所有事件
```


## 图层事件

### inited

参数 option

- target 当前 layer
- type 事件类型

图层初始化完成后触发

```javascript
layer.on('inited', (option) => {});
```

### add

图层添加到 scene

参数 option

- target 当前 layer
- type 事件类型

```javascript
layer.on('add', (type) => console.log(type));
```

### remove

图层移除时触发

参数 option

- target 当前 layer
- type 事件类型

```javascript
layer.on('remove', (type) => console.log(type));
```

### legend

数据映射更新，图例发生变化,主要 color、size

### `legend:color`

数据映射更新，图例 color 颜色改变

参数 option：

- type 图例类型
- field 映射字段
- items 图例项

```js
layer.on('legend:color', (ev) => console.log(ev));
```

### `legend:size`

数据映射更新，图例 size 大小改变

参数 option：

- type 图例类型
- field 映射字段
- items 图例项

```js
layer.on('legend:size', (ev) => console.log(ev));
```

## 图层框选

### boxSelect

参数 option

- box [x1: number, y1: number, x2: number, y2: number] 相较于
- cb (...args: any[]) => void 传入的回调方法，返回框选内部的 feature

```javascript
layer.boxSelect(box, cb);
// (x1, y1), (x2, y2) 框选的方框左上角和右下角相对于地图左上角的像素坐标
// cb 是传入的回调函数，回调函数返回的参数是选中的 feature 对象数组，对象的字段和用户传入的数据相关
```
