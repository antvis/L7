---
title: "Raster NDI"
description: "Raster NDI"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/api/raster_layer/raster_ndi/"
---

[Resource index](/llms.txt)

## Introduction

`Raster NDI`Normalized Difference Indices Calculation of normalized indices, providing another band for normalized calculation

## source

raster-ndi(Normalized Difference Indices) source is to calculate the normalized index of multi-band data, such as calculating NDVI/NDWI and other indices.

- data data
- option configuration item
  - parser data parsing parameters
    - type parsing type`ndi`

```ts
layer.source(bandsValues, {
  parser: {
    type: 'ndi',
    width: bandsValues.width,
    height: bandsValues.height,
    bands: [4, 3], // start from zero
    extent: [130.39565357746957, 46.905730725742366, 130.73364094187343, 47.10217234153133],
  },
});
```

### data

```ts
type RasterDataType =
  | Uint8Array
  | Int8Array
  | Uint16Array
  | Int16Array
  | Uint32Array
  | Int32Array
  | Float32Array
  | Float64Array;
```

data is an array type`RasterDataType[]`

- If it is a multi-band Tiff, you can directly use geotiff,js to read all bands.
- If it is a single file and single band data, it needs to be read separately and merged into one data.

Single file multi-band reading example

```ts
async function getTiffData(url: string) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
  const image1 = await tiff.getImage();
  const bandsValues = await image1.readRasters();
  return bandsValues;
}
```

### parser

- type parsing type 'rgb'`必选`

- bands `[number,number] 指定需要归一化的波段,data 数组长度需要大于等于 2  `Required\`

  Note: The bands serial number starts from zero (5, 4 in landsat 8, the band should be set to 4, 3)

- width length`必选`

- height width`必选`

### Complete example

[Raster ndi](../../../../examples/raster/ndi/#ndbi)


## style

`style`Method is used to configure the style of the layer,

- The single-channel drawing result is controlled by a single numerical value, such as a grayscale image. The color corresponding to the numerical value can be configured by expressing`rampColors`Ribbon control.

```js
layer.style({
  opacity: 0.5,
});
```

### Configuration

| style       | type               | describe                                                    | default value |
| ----------- | ------------------ | ----------------------------------------------------------- | ------------- |
| opacity     | `number`           | Graphic transparency                                        | `1`           |
| clampLow    | `boolean`          | Set as`true`, lower than`domain`data will not be displayed  | `false`       |
| clampHigh   | `boolean`          | Set as`true`, higher than`domain`data will not be displayed | `false`       |
| domain      | `[number, number]` | Data mapping interval                                       | `[ 0, 8000 ]` |
| noDataValue | `number`           | Values ​​that will not be displayed                         | `-9999999`    |
| rampColors  | `IRampColors`      | The color ramp for the range mapping color                  | `/`           |

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
