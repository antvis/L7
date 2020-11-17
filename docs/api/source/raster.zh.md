---
title: 栅格
order: 5
---

`markdown:docs/common/style.md`

Raster 图层主要实现栅格数据的可视化，栅格数据主要来源是卫星遥感数据，如数字高程图，植被分布图，夜光图。

## parser

- type: raster
- extent: 栅格的经纬度范围 [minlng, minlat,maxLng, maxLat]
- width 数据宽度
- height 数据高度

根据图片的经纬度范围，将图片添加到地图上。

```javascript
layer.source(
  'https://gw.alipayobjects.com/zos/rmsportal/FnHFeFklTzKDdUESRNDv.jpg',
  {
    parser: {
      type: 'raster',
      extent: [121.168, 30.2828, 121.384, 30.4219],
    },
  },
);
```
