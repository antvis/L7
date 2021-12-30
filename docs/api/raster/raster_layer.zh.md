---
title: 栅格图层
order: 5
---

`markdown:docs/common/style.md`

Raster 图层主要实现栅格数据的可视化，栅格数据主要来源是卫星遥感数据，如数字高程图，植被分布图，夜光图。

L7 本身内部没有提供栅格数据格式 如 tiff,需要外部解析好做为 Source 传入。

## 使用

```javascript
import { RasterLayer } from '@antv/l7';
```

## source

见 [raster source](../source/raster)

## shape

`raster`

## size

无

## color

无

## style

- clampLow Boolean 默认 false, 设置为 true，低于 domain 的数据将不显示
- clampHigh Boolean 默认 false, 设置为 true，高于 domain 的数据将不显示
- opacity: 0.8 Number 透明度
- domain: [ 0, 8000 ] 数据映射区间
- noDataValue Number noDataValue 不会显示
- rampColors: {
  colors: [ '#FF4818', '#F7B74A', '#FFF598', '#91EABC', '#2EA9A1', '#206C7C' ],
  positions: [ 0, 0.2, 0.4, 0.6, 0.8, 1.0 ]
  } // 色带

  ⚠️ color, position 的长度要相同
