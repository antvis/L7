---
title: RasterLayer
order: 0
---

`markdown:docs/common/style.md`

## 简介

`RasterLayer` 图层主要实现栅格数据的可视化，栅格数据主要来源是卫星遥感数据，如数字高程图，植被分布图，夜光图。

- L7 本身内部没有提供栅格数据格式 如 `tiff`, 需要外部解析或者提供解析方法做传入。
- 栅格图层除了支持简单渲染之外还支持栅格数据的多波段计算，可以用于绘制遥感彩色影像。

### 直接绘制

我们可以直接在外部计算出栅格的波段数据后传给栅格图层使用，不需要额外提供栅格数据的提取方法，同时也无法进行波段计算。

```js
const layer = new RasterLayer({}).source(tiffdata.data, {
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
    heightRatio: 100,
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

我们可以将栅格文件传给栅格图层使用，额外提供栅格数据的提取方法，支持对数据波段计算。

```javascript
const layer = new RasterLayer({}).source([{
    data: tiffdata,
    bands: [0, 1, 2, 3],
}], {
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
    operation: ['/', 
        ['-', ['band', 0], ['band', 1]], // R > NIR
        ['+', ['band', 0], ['band', 1]]
    ],
    extent: [73.482190241, 3.82501784112, 135.106618732, 57.6300459963],
    },
})
.style({
    domain: [0, 0.25],
    rampColors: {
    colors: [ 'rgb(166,97,26)', 'rgb(223,194,125)', 'rgb(245,245,245)', 'rgb(128,205,193)', 'rgb(1,133,113)' ],
    positions: [ 0, 0.25, 0.5, 0.75, 1.0 ]
    },
});
```
