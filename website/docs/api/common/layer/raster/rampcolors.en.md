### rampColors color ramps

- type type supports \`linear','quantize','custom','cat'
- colors color array
- positions data segmentation interval, optional, quantize does not need to set position, position is the original data value

⚠️ 2.13 new features

#### cat enumeration type ribbon

The enumeration type ribbon only supports integer types from 0 to 255, and positions are used to set the enumeration.

```tsx
{
  type:'cat',
  colors:['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00'],
  positions:[1,20,101,102,200],
}
```

#### quantize equally spaced classification ribbons

Equally spaced segments are evenly divided only according to the interval domain of the data, such as domain \[0,10000]. If it is divided into 5 segments, the distance between each segment is 2000.
There is no need to set positions for equal spacing. You only need to set colors. Set the number of segments according to the length of colors.

```tsx
rampColors: {
  type:'quantize',
  colors: ['#f0f9e8','#bae4bc','#7bccc4','#43a2ca','#0868ac']
}
```

#### linear linear continuous ribbon

linear is an enhanced version of the existing continuous type. Positions supports setting source data without converting it to 0-1.

```tsx
rampColors: {
  type:'linear',
  colors: ['#f0f9e8','#bae4bc','#7bccc4','#43a2ca','#0868ac'],
  positions [0,200,1000,4000,8000]
}

⚠️ Compatible with versions before 2.13.0. When type is not set, the position value range is 0-1.
```

#### custom custom segmented ribbon

Customized segmented ribbons distinguish equal-spaced ribbons, and user-defined segment intervals.
The length of custom positions needs to be 1 more than the length of colors, and positions

```tsx
rampColors: {
  type:'custom',
  colors: ['#f0f9e8','#bae4bc','#7bccc4','#43a2ca','#0868ac'],
  positions [0,200,1000,4000,8000,10000]
}
```
