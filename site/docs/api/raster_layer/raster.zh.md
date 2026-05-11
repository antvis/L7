---
title: RasterLayer
order: 0
---

<embed src="@/docs/api/common/style.md"></embed>

## 简介

`RasterLayer` 图层主要实现栅格数据的可视化，栅格数据主要来源是卫星遥感数据，如数字高程图、植被分布图、夜光图等。L7 支持三种栅格可视化模式：

| 模式        | shape 值    | 说明                                                 |
| ----------- | ----------- | ---------------------------------------------------- |
| Raster Data | `raster`    | 单波段，根据栅格数据值映射为颜色                     |
| Raster RGB  | `rasterRgb` | 多波段，不同波段映射为 R/G/B 三通道展示              |
| Raster NDI  | `rasterNdi` | 多波段，提供两个波段进行归一化指数计算 `(b-a)/(b+a)` |

```javascript
import { RasterLayer } from '@antv/l7';

// Raster Data 模式示例
const layer = new RasterLayer()
  .source(rasterData, {
    parser: {
      type: 'raster',
      width: 256,
      height: 256,
      extent: [73, 3, 136, 54],
    },
  })
  .style({
    rampColors: {
      colors: ['#FF4818', '#F7B74A', '#FFF598', '#91EABC', '#2EA9A1', '#206C7C'],
      positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
    },
  });
```

## options

<embed src="@/docs/api/raster_layer/options.zh.md"></embed>

## Raster Data

<embed src="@/docs/api/raster_layer/raster_data.zh.md"></embed>

## Raster RGB

<embed src="@/docs/api/raster_layer/raster_rgb.zh.md"></embed>

## Raster NDI

<embed src="@/docs/api/raster_layer/raster_ndi.zh.md"></embed>

## 图层通用方法

<embed src="@/docs/api/common/layer/base.zh.md"></embed>
