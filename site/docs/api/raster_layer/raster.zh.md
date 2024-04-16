---
title: RasterLayer
order: 0
---

<embed src="@/docs/api/common/style.md"></embed>

## 简介

`RasterLayer` 图层主要实现栅格数据的可视化，栅格数据主要来源是卫星遥感数据，如数字高程图，植被分布图，夜光图。

### Raster Data

单波段，根据栅格数据值，映射为颜色

### Raster RGB

多波段，不同不波段映射为 R/G/B 三通道可视化展示

### Raster NDI

多波段，提供两个波段，进行归一化指数计算 `(b-a)/(b+a)`
