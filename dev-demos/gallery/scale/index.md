## Scale 简介

Scale 度量是将地图数据值（数字、日期、类别等数据）转成视觉值（颜色、大小、形状）。尺度 Scale 是数据可视化的基本组成部分，因为它们决定了视觉编码的性质。 L7 目前支持连续、离散、枚举类型 Scale。

#### Scale 中的两个重要概念:

Range 和 domain

- domain: 地图数据值的定义区间
- range：视觉值的区间定义

不同 Scale 的差异在于 domain->range 的转换方法的不同

| 数据类型 | 度量类型                                   |
| -------- | ------------------------------------------ |
| 连续     | linear、log、pow、time、quantize、quantile |
| 分类     | cat                                        |
| 常量     | identity                                   |

在使用 L7 过程中，默认情况下不需要进行 Scale 的配置，因为 L7 代码内部已经根据数据的形式对度量进行了假设，其计算过程如下：

查看用户是否设置了 Scale，如果没有:

判断字段的第一条数据的字段类型

如果数据中不存在对应的字段，则为 identity;

如果是数字则为 'linear';

如果是字符串类型 'cat';

### Cat 枚举

Cat 指枚举类型，用于展示分类数据，比如农作物种植区分布图，水稻、玉米、大豆等不同类别需要映射为不同的颜色。在 L7 如果判断字段的值为字符串，将认为是 Cat 类型并自动获取类型的唯一值，设置为 domain

三种作物会分别转成对应的颜色

```tsx pure
const data = [
   {
   type:'A',
   x: 110,
   y:30
 },
 {
   type:'B',
   x: 110,
   y:32
 },
 {
   type:'C',
   x: 110,
   y:31
 }
 ,{
   type:'D',
   x: 111,
   y:33
 }，
 ,{
   type:'E',
   x: 112,
   y:30
 }
 ,{
   type:'F',
   x: 110,
   y:30
 }
]
layer.color('type',['red','white','blue','yellow'])
```

如上面的代码所示，图层没有设置 Scale, L7 内部根据第一个数据的类型 "A",推断为枚举类型。
同时字段取出该字段的去重后的值 既['A','B','C','D','E','F'] 设置为 scale 的 domain, 那么 range 就是['red','white','blue','yellow']。

<p align='center'>
<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*eDPfRaaw-GsAAAAAAAAAAAAAARQnAQ" alt="枚举映射" width="50%"/>
 </p>
如果不设置 Domain L7 内部会自动计算 Domain，自动计算的Domain数值顺序跟数据相关，如果我嗯希望固定Domain 据需要自己设置domain

```tsx pure
layer.scale('type', {
  type: 'cat',
  domain: ['B', 'A', 'C', 'D'],
});
layer.color('type', ['red', 'white', 'blue', 'yellow']);
```

使用上面的写法就可以固定设置 scale 的 domain.['B','A','C','D'] -> ['red','white','blue','yellow'] 这样就会一一对应了，跟数据顺序无关。同样如果 range 的个数小于 domain,不能对应的数据就循环取色。

美国地图区块名称染色

<code src="./cat.tsx"></code>

### Linear 连续线性

线性是连续数据的映射方法，数据和视觉值是通过线性方法换算的。如数据值 1-100 线性映射到红到蓝的线下渐变色每个数字对应一个唯一颜色

<p align='center'>
<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*Tp9OQKkXJTMAAAAAAAAAAAAAARQnAQ" alt="线性映射" width="50%"/>
 </p>

<code src="./linear.tsx"></code>

### quantize 连续等间距

相等间隔会将属性值的范围划分为若干个大小相等的子范围。相等间隔最适用于常见的数据范围，如百分比和温度。这种方法强调的是某个属性值相对于其他值的量。

<p align='center'>
<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*Z-k9TLkQGX8AAAAAAAAAAAAAARQnAQ" alt="等间距" width="50%"/>
 </p>

等间距分类只与数据 mix、max 有关，如果没有设置 domain,将自动计算数据的 min、max.分几类根据颜色的个数。

```tsx pure
layer.color('type', ['red', 'white', 'blue', 'yellow']);
```

你也可以自定义 domain

```tsx pure
layer.scale('value', {
  type: 'quantize',
  domain: [5, 100],
});

layer.color('type', ['red', 'white', 'blue', 'yellow']);
```

<code src="./quantize.tsx"></code>

### quantile 连续等分位

每个类都含有相等数量的要素。分位数分类非常适用于呈线性分布的数据。分位数为每个类分配数量相等的数据值。不存在空类，也不存在值过多或过少的类。

<p align='center'>
<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*KHU1SIM0fhQAAAAAAAAAAAAAARQnAQ" alt="等分位" width="50%"/>
 </p>

等分位与数据的分布相关，需要拿个每个数值才能计算，因此等分位的 scale 你不需要单独设置 domain

```tsx pure
layer.scale('value', {
  type: 'quantile',
});

layer.color('value', ['red', 'white', 'blue', 'yellow']);
```

### threshold 自定义分类

他允许将域的任意子集（非统一段）映射到范围内的离散值。输入域仍然是连续的，并根据提供给域属性的一组阈值划分为多个切片。 range 属性必须有 N+1 个元素，其中 N 是域中提供的阈值边界数

threshold 为自定义分段，在使用时就必须 为Scale 设置domain,Domain可以完全依据需求任意设置。

```tsx pure
 layer.scale('rate', {
          type: 'threshold',
          domain: [3, 6, 8, 10],
        })
        .color('rate', ['#ffffcc', '#b6e2b6', '#64c1c0', '#338cbb', '#253494'])

```

<code src="./quantile.tsx"></code>

### diverging 离散分类

双极级数：这些通常与两种相反的色调一起使用，以显示从负值到中心到正值的变化。这些类型的地图显示了彼此相关的值的大小。

<p align='center'>
<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*geDQQpZ6ZZYAAAAAAAAAAAAAARQnAQ" alt="离散色带" width="300"/>
 </p>

 diverging 如果没有设置 domain 会自动根据数据计算min、middle、max 三个值作为domain.

 ```tsx pure
 
 layer.scale('rate', {
          type: 'diverging'
          domain: [3, 6, 8, 10], //  the input domain and output range of a diverging scal
        })
        .color('rate', ['#ffffcc', '#b6e2b6', '#64c1c0', '#338cbb', '#253494'])

````

 <code src="./diverging.tsx"></code>
