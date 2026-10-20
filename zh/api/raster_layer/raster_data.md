---
title: "Raster Data"
description: "Raster Data"
language: "zh"
canonical: "https://l7.antv.antgroup.com/zh/api/raster_layer/raster_data/"
---

[资料索引](/llms.txt)

## 简介

单波段栅格数据渲染、根据栅格数据进行可视化着色

## source

Raster data 数据栅格的可视化，栅格数据主要来源是卫星遥感数据，如数字高程图、植被分布图和夜光图。

- data 数据
- option 配置项
  - parser 数据解析参数

### data

data 解析后的数据，为数组

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

以 geotiff 为例需要先将数据解析出来，作为 data 输入给 source

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
- extent: 栅格的经纬度范围 [minlng, minlat,maxLng, maxLat]
- width 数据宽度
- height 数据高度

根据栅格数据的经纬度范围，将其添加到地图上。

```javascript
layer.source(rasterData, {
  parser: {
    type: 'raster',
    extent: [121.168, 30.2828, 121.384, 30.4219],
  },
});
```

### 完整示例

[Raster ndi](../../../../examples/raster/data/#dem)


## style

`style` 方法用于配制图层的样式，

- 单通道 绘制结果由是单一的数值控制，如灰度图，数值对应的颜色可以通过表示配置 `rampColors` 色带控制。

```js
layer.style({
  opacity: 0.5,
});
```

### 配置

| style       | 类型               | 描述                                        | 默认值        |
| ----------- | ------------------ | ------------------------------------------- | ------------- |
| opacity     | `number`           | 图形的透明度                                | `1`           |
| clampLow    | `boolean`          | 设置为 `true`，低于 `domain` 的数据将不显示 | `false`       |
| clampHigh   | `boolean`          | 设置为 `true`，高于 `domain` 的数据将不显示 | `false`       |
| domain      | `[number, number]` | 数据映射区间                                | `[ 0, 8000 ]` |
| noDataValue | `number`           | 不会显示的值                                | `-9999999`    |
| rampColors  | `IRampColors`      | 值域映射颜色的色带                          | `/`           |

### rampColors 颜色色带

- type 类型 支持 `linear','quantize','custom','cat'
- colors  颜色数组
- positions 数据分段区间，可选，quantize 不需要设置 position，position 为原始数据值

⚠️ 2.13 新增特性

#### cat 枚举类型色带

枚举类型色带只支持 0 -255 的整数类型，positions 用来设置枚举

```tsx
{
  type:'cat',
  colors:['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00'],
  positions:[1,20,101,102,200],
}
```

#### quantize 等间距分类色带

等间距只根据数据的区间 domain 进行均匀分段，如 domain [0,10000]，如果分 5 段，每段间距 2000。
等间距不需要设置 positions，只需要设置colors，根据colors 的长度设置分段数

```tsx
rampColors: {
  type:'quantize',
  colors: ['#f0f9e8','#bae4bc','#7bccc4','#43a2ca','#0868ac']
}
```

#### linear 线性连续色带

linear 为现有连续类型的加强版，positions 支持设置源数据，不需要转换成 0-1

```tsx
rampColors: {
  type:'linear',
  colors: ['#f0f9e8','#bae4bc','#7bccc4','#43a2ca','#0868ac'],
  positions [0,200,1000,4000,8000]
}

⚠️ 兼容 2.13.0 之前版本，未设置type 时，position 值域为 0-1。


```

#### custom 自定义分段色带

自定义分段色带区别等间距色带，用户自定义分段间隔。
自定义 positions 的长度需要比 colors 的长度多1个，同时poisitions

```tsx
rampColors: {
  type:'custom',
  colors: ['#f0f9e8','#bae4bc','#7bccc4','#43a2ca','#0868ac'],
  positions: [0,200,1000,4000,8000,10000]
}
```
