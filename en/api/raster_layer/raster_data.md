---
title: "Raster Data"
description: "Raster Data"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/api/raster_layer/raster_data/"
---

[Resource index](/llms.txt)

## Introduction

Single-band raster data rendering, visual coloring based on raster data

## source

Raster data is the visualization of data raster. The main source of raster data is satellite remote sensing data, such as digital elevation map, vegetation distribution map and night light map.

- data data
- option configuration item
  - parser data parsing parameters

### data

data The parsed data, which is an array

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

Taking geotiff as an example, the data needs to be parsed first and input to the source as data.

```tsx
import * as GeoTIFF from 'geotiff';

async function getTiffData() {
  async function getTiffData() {
    const response = await fetch(
      'https://gw.alipayobjects.com/zos/antvdemo/assets/light_clip/lightF182013.tiff',
    );
    const arrayBuffer = await response.arrayBuffer();
    const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
    const image = await tiff.getImage();
    const width = image.getWidth();
    const height = image.getHeight();
    const values = await image.readRasters();
    return {
      data: values[0],
      width,
      height,
    };
  }
}
const tiffdata = await getTiffData();
layer.source(tiffdata.data, {
  parser: {
    type: 'raster',
    width: tiffdata.width,
    height: tiffdata.height,
    extent: [73.4821902409999979, 3.8150178409999995, 135.1066187319999869, 57.6300459959999998],
  },
});
```

### parser

- type: raster
- extent: the latitude and longitude range of the raster \[minlng, minlat,maxLng, maxLat]
- width data width
- height data height

Add raster data to the map based on its latitude and longitude range.

```javascript
layer.source(rasterData, {
  parser: {
    type: 'raster',
    extent: [121.168, 30.2828, 121.384, 30.4219],
  },
});
```

### Complete example

[Raster ndi](../../../../examples/raster/data/#dem)


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
