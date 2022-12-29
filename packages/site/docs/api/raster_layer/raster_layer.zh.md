---
title: Raster 栅格瓦片
order: 0
---

<embed src="@/docs/common/style.md"></embed>

## 简介

`RasterLayer` 图层主要实现栅格数据的可视化，栅格数据主要来源是卫星遥感数据，如数字高程图，植被分布图，夜光图。

- L7 本身内部没有提供栅格数据格式, 需要将外部的栅格数据文件解析后或者提供解析方法做传入、如 `tiff`、`lerc`。
- 栅格图层除了支持简单渲染之外还支持栅格数据的多波段计算，可以用于绘制遥感彩色影像。

### 数据绘制

我们可以直接在外部计算出栅格的波段数据后传给栅格图层使用。

- 不需要额外提供栅格数据的提取方法，在外部解析传入解析好的栅格数据。
- 这种方式只支持对单波段数据进行染色，无法进行波段计算。

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
      colors: [
        '#FF4818',
        '#F7B74A',
        '#FFF598',
        '#91EABC',
        '#2EA9A1',
        '#206C7C',
      ].reverse(),
      positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
    },
  });
```

### 多波段计算

我们可以将请求得到的栅格文件传给栅格图层使用。

- 需要额外提供栅格数据的解析方法，不同格式的栅格文件有需要对应的方法，如 `tiff` 格式的文件我们一般借助 `geotiff.js` 进行解析。
- 直接传入一（多）个栅格文件的时候，我们可以读取文件中包含的所有波段的栅格数据，同时支持对波段数据进行简单的数学运算。

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*lmJFT7WONcoAAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

#### 计算 NDVI

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
