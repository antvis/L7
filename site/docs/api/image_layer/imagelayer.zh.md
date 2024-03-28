---
title: ImageLayer
order: 0
---

<embed src="@/docs/api/common/style.md"></embed>

## 简介

将图片添加到地图上，同时需要指定图片的经纬度范围和数据解析类型。

<div>
  <div style="width:40%; margin: 16px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*8MtWSIGTN8UAAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

```javascript
const layer = new ImageLayer({});
layer.source('https://gw.alipayobjects.com/zos/rmsportal/FnHFeFklTzKDdUESRNDv.jpg', {
  parser: {
    type: 'image',
    extent: [121.168, 30.2828, 121.384, 30.4219],
  },
});
```
