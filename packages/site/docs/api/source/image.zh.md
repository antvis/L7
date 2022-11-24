---
title: Image
order: 4
---

<embed src="@/docs/common/style.md"></embed>

Image 数据主要用于在地图根据经纬度范围添加图图片，比如一幅纸制地图扫描版你要放在地图显示。

## parser

- type: image
- extent: 图像的经纬度范围 [minlng, minlat,maxLng, maxLat]

根据图片的经纬度范围，将图片添加到地图上。

```javascript
layer.source(
  'https://gw.alipayobjects.com/zos/rmsportal/FnHFeFklTzKDdUESRNDv.jpg',
  {
    parser: {
      type: 'image',
      extent: [121.168, 30.2828, 121.384, 30.4219],
    },
  },
);
```
