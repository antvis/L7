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

`scale` 的类型可以分为 `3` 类 `11` 种，不同 `Scale` 的差异在于 `domain->range` 的转换方法的不同。  
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
