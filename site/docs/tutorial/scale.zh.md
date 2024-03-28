---
title: Scale 度量
order: 2
---

<embed src="@/docs/api/common/style.md"></embed>

## Scale 简介

Scale 度量是用于将地图数据值（数字、日期、类别等数据）转成视觉变量（颜色、大小、形状）。Scale 是数据可视化的基本元素，因为它们决定了数据视觉编码的方式。L7 目前支持连续、离散、枚举类型等常用的 Scale。

![L7 Scale](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*AOIvTpmPOmgAAAAAAAAAAAAADmJ7AQ/original)

## Scale 中的两个重要概念:

Range 和 Domain

Domain: 地图数据值的定义区间

Range：视觉值的区间定义

不同 Scale 的差异在于 Domain-> Range 的转换方法不同

| 数据类    | 度量类型                              |
| --------- | ------------------------------------- |
| 连续      | linear、log、pow                      |
| 连续分类  | quantize quantile,threshold,diverging |
| 分类 枚举 | cat                                   |

## L7 Scale

在使用 L7 过程中，默认情况下不需要进行 Scale 的配置，因为 L7 会根据数据类型对 scale 推断，推断过程如下：

查看用户是否设置了 Scale，如果没有:

判断字段的第一条数据的字段类型，如果数据中不存在对应的字段：

认为是常量为固定值

如果是数字则为 'linear';

如果是字符串类型 'cat';

## Cat 枚举

Cat 指枚举类型，用于展示分类数据，比如农作物种植区分布图，水稻、玉米、大豆等不同类别需要映射为不同的颜色。在 L7 如果判断字段的值为字符串，将认为是 Cat 类型并自动获取类型的唯一值，设置为 domain 。这样三种作物就会被一一映射成对应的颜色。

```tsx

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

如上面的代码所示，图层没有设置 Scale, L7 根据第一个数据"A"的类型 ,推断为枚举类型。同时取出该字段的去重后的所有值 ['A','B','C','D','E','F'] 设置为 scale 的 domain, 那么 range 就是对应的颜色 ['red','white','blue','yellow']。

![L7 scale Cat映射](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*rO53SYNk8hgAAAAAAAAAAAAADmJ7AQ/original)

如果不设置 domain，L7 内部会自动计算 domain，domain 顺序跟数据顺序相关。如果希望固定domain 可自己设置 domain。domain 数值 和 range数值 一一对应。

```

layer.scale('type', {
  type: 'cat',
  domain: ['B', 'A', 'C', 'D'],
});
layer.color('type', ['red', 'white', 'blue', 'yellow']);

```

![L7 Cat ](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*kyP2RpUXdGUAAAAAAAAAAAAADmJ7AQ/original)

## Linear 连续线性

线性是连续数据的映射方法，数据和视觉值是通过线性方法计算的。如数据范围domain [0,1000] 线性映射到 range [red,blue] 渐变色，就是依据线性函完成一一转换。

![L7 Scale 线性](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*Z_rGRr-jgI0AAAAAAAAAAAAADmJ7AQ/original')

```tsx
layer.color('rate', ['#ffffcc', '#b6e2b6', '#64c1c0', '#338cbb', '#253494']);
```

对于连续型
数据 L7 默认会设置为 linear, domain为数据的min、max值。颜色会根据 range 颜色生成渐变色。linear
默认可不设置 domain 区间

```ts
layer.scale('value', {
  type: 'linear',
  domain: [5, 100], // 可定义domain,也可以不设置，自定根据数据计算
});
```

## quantize 连续等间距

等间距分类会根据属性值范围划分为若干个大小相等的子范围。相等间隔最适用于常见的数据范围，如百分比和温度。这种方法强调的是某个属性值相对于其他值的量。

![L7 Scale 连续等间距](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*YmwwQ5L-d7QAAAAAAAAAAAAADmJ7AQ/original)

等间距分类只与数据 mix、max 有关，如果没有设置 domain,将自动计算数据的 min、max 进行分段，分段个数依据 range 颜色的个数。等间距会出现空类，而且每个分类要素分布不均匀。

```tsx
layer.color('type', ['red', 'white', 'blue', 'yellow']);
```

你也可以自定义 domain

```ts
layer.scale('value', {
  type: 'quantize',
  domain: [5, 100],
});

layer.color('type', ['red', 'white', 'blue', 'yellow']);
```

![L7 scale quantize](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*N61_Q6-U7jIAAAAAAAAAAAAADmJ7AQ/original)

## quantile 连续等分位

等分位要求每个分类区间都含有相等数量的要素。分位数为每个分类分配相等数量数据值，不存在空类，也不存在值过多或过少的类。

![L7 scale quantile](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*2SFpSLRD3yYAAAAAAAAAAAAADmJ7AQ/original)

等分位与数据的分布相关，需要拿到全量数据才能计算，因此等分位的 scale 不能单独设置 domain，只能自动计算。

```tsx
layer.scale('value', {
  type: 'quantile',
});

layer.color('value', ['red', 'white', 'blue', 'yellow']);
```

![L7 Scale quantile](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*EMcjSrYe1l0AAAAAAAAAAAAADmJ7AQ/original)

## threshold 自定义分类

自定义分类可以设定任意分类区间映射到对于视觉变量。domain 仍然是连续的，并根据提供的domain 进行分类。range 属性必须有 N+1 个元素，其中 N 是 domain 的个数。

threshold 为自定义分段，在使用时必须为 Scale 设置 domain, domain可以依据需求任意设置。

```tsx
layer
  .scale('rate', {
    type: 'threshold',
    domain: [3, 6, 8, 10],
  })
  .color('rate', ['#ffffcc', '#b6e2b6', '#64c1c0', '#338cbb', '#253494']);
```

![ L7 Scale threshold](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*e1YyRKELsjwAAAAAAAAAAAAADmJ7AQ/original)

## diverging 离散分类

离散分类通常与两种相反的色调一起使用，以显示从负值到中心到正值的变化。这些类型的地图显示了彼此相关的值的大小。

![L7 diverging](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*8anRRLJNu6YAAAAAAAAAAAAADmJ7AQ/original)

diverging 如果没有设置 domain 会自动根据数据计算min、middle、max 三个值作为domain。range 至少需要设置三个颜色，形成双极色带。

```ts
layer.scale('rate', {
         type: 'diverging'
         domain: [3, 6, 8, 10], //  the input domain and output range of a diverging scal
       })
       .color('rate', ['#ffffcc', '#b6e2b6', '#64c1c0', '#338cbb', '#253494'])
```

![L7 scale diverging](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*4rcDQIRdRdEAAAAAAAAAAAAADmJ7AQ/original)
