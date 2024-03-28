---
title: RasterLayer
order: 0
---

<embed src="@/docs/api/common/style.md"></embed>

## Introduction

`RasterLayer`The layer mainly realizes the visualization of raster data. The main source of raster data is satellite remote sensing data, such as digital elevation map, vegetation distribution map, and night light map.

- L7 itself does not provide a raster data format internally. It needs to parse the external raster data file or provide a parsing method to pass it in, such as`tiff`、`lerc`。
- In addition to supporting simple rendering, the raster layer also supports multi-band calculations of raster data, and can be used to draw remote sensing color images.

### Data plotting

We can directly calculate the band data of the raster externally and then pass it to the raster layer for use.

- There is no need to provide additional extraction methods for raster data, and the parsed raster data can be parsed externally.
- This method only supports coloring of single-band data and cannot perform band calculations.

```js
const layer = new RasterLayer({})
  .source(tiffdata.data, {
    parser: {
      type: 'raster',
      width: tiffdata.width,
      height: tiffdata.height,
      min: 0,
      max: 80,
      extent: [73.482190241, 3.82501784112, 135.106618732, 57.6300459963],
    },
  })
  .style({
    opacity: 0.8,
    domain: [0, 2000],
    rampColors: {
      colors: ['#FF4818', '#F7B74A', '#FFF598', '#91EABC', '#2EA9A1', '#206C7C'].reverse(),
      positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
    },
  });
```

### Multi-band calculation

We can pass the requested raster file to the raster layer for use.

- Additional parsing methods for raster data need to be provided. Raster files in different formats require corresponding methods, such as`tiff`For files in the format we generally use`geotiff.js`Perform analysis.
- When directly importing one (multiple) raster files, we can read the raster data of all bands contained in the file and support simple mathematical operations on the band data.

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*lmJFT7WONcoAAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

#### Calculate NDVI

```javascript
async function getTiffData(url: string) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return arrayBuffer;
}
// tiffdata 是请求到的二进制的栅格文件
const tiffdata = await getTiffData('https: // xxx');
const layer = new RasterLayer({})
  .source(
    [
      {
        data: tiffdata,
        bands: [0, 1, 2, 3],
      },
    ],
    {
      parser: {
        type: 'raster',
        format: async (data, bands) => {
          const tiff = await GeoTIFF.fromArrayBuffer(data);
          const imageCount = await tiff.getImageCount();
          const image1 = await tiff.getImage(1);
          const value1 = await image1.readRasters();
          const value = value1;
          return [
            { rasterData: value[2], width: value.width, height: value.height }, // R
            { rasterData: value[3], width: value.width, height: value.height }, // NIR
          ];
        },
        // blue green red nir
        // NDVI = ABS(NIR - R) / (NIR + R) = 近红外与红光之差 / 近红外与红光之和
        operation: [
          '/',
          ['-', ['band', 0], ['band', 1]], // R > NIR
          ['+', ['band', 0], ['band', 1]],
        ],
        extent: [73.482190241, 3.82501784112, 135.106618732, 57.6300459963],
      },
    },
  )
  .style({
    domain: [0, 0.25],
    rampColors: {
      colors: [
        'rgb(166,97,26)',
        'rgb(223,194,125)',
        'rgb(245,245,245)',
        'rgb(128,205,193)',
        'rgb(1,133,113)',
      ],
      positions: [0, 0.25, 0.5, 0.75, 1.0],
    },
  });
```
