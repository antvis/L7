---
title: Image
order: 4
---

<embed src="@/docs/api/common/style.md"></embed>

Image 数据主要用于在地图上根据经纬度范围添加图片，比如一幅纸制地图扫描版需要显示在地图上。

## parser

- type: image
- extent: 图像的经纬度范围 `[minlng, minlat,maxLng, maxLat]` 可选
- coordinates: `[[number,number],[number,number],[number,number],[number,number]]`; 可选

  四个地理坐标，表示为经度和纬度数字的数组，定义图像的角点。 坐标从图像的左上角开始并按顺时针顺序进行。 它们不必代表矩形。

```javascript
layer.source('https://gw.alipayobjects.com/zos/rmsportal/FnHFeFklTzKDdUESRNDv.jpg', {
  parser: {
    type: 'image',
    extent: [121.168, 30.2828, 121.384, 30.4219],
  },
});
```

倾斜图片

```ts
layer.source(
  'https://mdn.alipayobjects.com/huamei_gjo0cl/afts/img/A*vm_9S64uA0UAAAAAAAAAAAAADjDHAQ/original',

  {
    parser: {
      type: 'image',
      coordinates: [
        [100.959388, 41.619522],
        [101.229887, 41.572654],
        [101.16971, 41.377836],
        [100.900015, 41.424628],
      ],
    },
  },
);
```
