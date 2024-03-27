---
title: Scale
order: 2
---

<embed src="@/docs/api/common/style.md"></embed>

## Introduction to Scale

Scale measures are used to convert map data values ​​(numbers, dates, categories, etc.) into visual variables (color, size, shape). Scales are fundamental elements of data visualization because they determine how data is visually encoded. L7 currently supports common Scales such as continuous, discrete, and enumerated types.

![L7 Scale](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*AOIvTpmPOmgAAAAAAAAAAAAADmJ7AQ/original)

## Two important concepts in Scale:

Range and Domain

Domain: definition interval of map data values

Range: interval definition of visual value

The difference between different Scales lies in the different conversion methods of Domain->Range

| data class                 | Measurement type                      |
| -------------------------- | ------------------------------------- |
| continuous                 | linear、log、pow                      |
| continuous classification  | quantize quantile,threshold,diverging |
| Classification Enumeration | cat                                   |

## L7 Scale

When using L7, there is no need to configure Scale by default because L7 will infer scale based on the data type. The inference process is as follows:

Check whether the user has set Scale, if not:

Determine the field type of the first data of the field, if the corresponding field does not exist in the data:

Consider a constant as a fixed value

'linear' if numeric;

If it is string type 'cat';

## Cat enumeration

Cat refers to the enumeration type, which is used to display categorical data, such as the distribution of crop planting areas. Different categories such as rice, corn, and soybeans need to be mapped to different colors. In L7, if the value of a field is judged to be a string, it will be considered to be of Cat type and the unique value of the type will be automatically obtained and set to domain. In this way, the three crops will be mapped to the corresponding colors one by one.

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

As shown in the code above, the layer does not set Scale, L7 infers the enumeration type based on the type of the first data "A". At the same time, take out all the deduplicated values ​​of the field \['A', 'B', 'C', 'D', 'E', 'F'] and set them to the domain of the scale, then the range is the corresponding color \[' red','white','blue','yellow'].

![L7 scale Cat映射](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*rO53SYNk8hgAAAAAAAAAAAAADmJ7AQ/original)

If the domain is not set, L7 will automatically calculate the domain internally, and the domain order is related to the data order. If you want to fix the domain, you can set the domain yourself. There is a one-to-one correspondence between domain values ​​and range values.

```
layer.scale('type', {
  type: 'cat',
  domain: ['B', 'A', 'C', 'D'],
});
layer.color('type', ['red', 'white', 'blue', 'yellow']);
```

![L7 Cat ](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*kyP2RpUXdGUAAAAAAAAAAAAADmJ7AQ/original)

## Linear continuous linear

Linear is a mapping method for continuous data, where data and visual values ​​are calculated using linear methods. For example, if the data range domain \[0,1000] is linearly mapped to the range \[red, blue] gradient color, the one-to-one conversion is completed based on the linear function.

![L7 Scale 线性](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*Z_rGRr-jgI0AAAAAAAAAAAAADmJ7AQ/original')

```tsx
layer.color('rate', ['#ffffcc', '#b6e2b6', '#64c1c0', '#338cbb', '#253494']);
```

For continuous
Data L7 is set to linear by default, and domain is the min and max values ​​of the data. The color will generate a gradient color based on the range color. linear
The domain interval can not be set by default

```ts
layer.scale('value', {
  type: 'linear',
  domain: [5, 100], // The domain can be defined or not set. It can be calculated based on the data.
});
```

## quantize continuous equally spaced

Equally spaced classification is divided into several equal-sized subranges based on the attribute value range. Equal intervals work best with common data ranges, such as percentages and temperatures. This method emphasizes the amount of a certain attribute value relative to other values.

![L7 Scale 连续等间距](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*YmwwQ5L-d7QAAAAAAAAAAAAADmJ7AQ/original)

Equally spaced classification is only related to the data mix and max. If domain is not set, the min and max of the data will be automatically calculated for segmentation. The number of segments is based on the number of range colors. Empty classes will appear at equal intervals, and each classification element will be unevenly distributed.

```tsx
layer.color('type', ['red', 'white', 'blue', 'yellow']);
```

You can also customize the domain

```ts
layer.scale('value', {
  type: 'quantize',
  domain: [5, 100],
});

layer.color('type', ['red', 'white', 'blue', 'yellow']);
```

![L7 scale quantize](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*N61_Q6-U7jIAAAAAAAAAAAAADmJ7AQ/original)

## quantile continuous equal quantiles

Equiquantiles require that each classification interval contains an equal number of features. Quantiles assign an equal number of data values ​​to each category; there are no empty classes or classes with too many or too few values.

![L7 scale quantile](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*2SFpSLRD3yYAAAAAAAAAAAAADmJ7AQ/original)

The decile is related to the distribution of the data and needs to be calculated in full amount of data. Therefore, the scale of the decile cannot be set separately and can only be calculated automatically.

```tsx
layer.scale('value', {
  type: 'quantile',
});

layer.color('value', ['red', 'white', 'blue', 'yellow']);
```

![L7 Scale quantile](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*EMcjSrYe1l0AAAAAAAAAAAAADmJ7AQ/original)

## threshold custom classification

Custom classification can set any classification interval to map to the visual variable. The domain is still contiguous and classified according to the provided domain. The range attribute must have N+1 elements, where N is the number of domains.

Threshold is a custom segment. When using it, you must set the domain for Scale. The domain can be set arbitrarily according to your needs.

```tsx
layer
  .scale('rate', {
    type: 'threshold',
    domain: [3, 6, 8, 10],
  })
  .color('rate', ['#ffffcc', '#b6e2b6', '#64c1c0', '#338cbb', '#253494']);
```

![ L7 Scale threshold](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*e1YyRKELsjwAAAAAAAAAAAAADmJ7AQ/original)

## diverging discrete classification

Discrete classification is often used with two opposite hues to show the change from negative values ​​to center to positive values. These types of maps show the magnitude of values ​​in relation to each other.

![L7 diverging](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*8anRRLJNu6YAAAAAAAAAAAAADmJ7AQ/original)

If diverging does not set the domain, it will automatically calculate the three values ​​of min, middle, and max based on the data as the domain. Range needs to set at least three colors to form a bipolar color band.

```ts
layer.scale('rate', {
         type: 'diverging'
         domain: [3, 6, 8, 10], //  the input domain and output range of a diverging scal
       })
       .color('rate', ['#ffffcc', '#b6e2b6', '#64c1c0', '#338cbb', '#253494'])
```

![L7 scale diverging](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*4rcDQIRdRdEAAAAAAAAAAAAADmJ7AQ/original)
