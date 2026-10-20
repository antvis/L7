---
title: "Raster NDI"
description: "Raster NDI"
language: "zh"
canonical: "https://l7.antv.antgroup.com/zh/api/raster_layer/raster_ndi/"
---

[资料索引](/llms.txt)

## 简介

`Raster NDI` Normalized Difference Indices 归一化指数计算，提供另个波段，进行归一化计算

## source

raster-ndi(Normalized Difference Indices) source 是将多波段数据进行归一化指数计算，比如计算NDVI/NDWI 等指数，

- data 数据
- option 配置项
  - parser 数据解析参数
    - type 解析类型 `ndi`

```ts
layer.source(bandsValues, {
  parser: {
    type: 'ndi',
    width: bandsValues.width,
    height: bandsValues.height,
    bands: [4, 3], // 从零开始
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

data 为数组类型 `RasterDataType[]`

- 如果是多波段 Tiff 可以直接使用geotiff,js 读取所有波段，
- 如果是单文件单波段数据，需要单独读取并合并成一个数据。

单文件多波段读取示例

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

- type 解析类型 'rgb' `必选`
- bands `[number,number] 指定需要归一化的波段,data 数组长度需要大于等于 2  `必选`

  注：bands 序号从零开始（landsat 8 里的 5，4, 波段这样要设置为 4,3）

- width 长度 `必选`
- height 宽度 `必选`

### 完整示例

[Raster ndi](../../../../examples/raster/ndi/#ndbi)


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
