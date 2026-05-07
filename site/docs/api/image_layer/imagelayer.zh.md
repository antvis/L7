---
title: ImageLayer
order: 0
---

<embed src="@/docs/api/common/style.md"></embed>

## 简介

图片图层将图片叠加到地图上，需要指定图片的经纬度范围（`extent`）和数据解析类型。支持 PNG、JPG、WebP 等常见图片格式。

<div>
  <div style="width:40%; margin: 16px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*8MtWSIGTN8UAAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

```javascript
import { ImageLayer } from '@antv/l7';

const layer = new ImageLayer({});
layer.source('https://gw.alipayobjects.com/zos/rmsportal/FnHFeFklTzKDdUESRNDv.jpg', {
  parser: {
    type: 'image',
    extent: [121.168, 30.2828, 121.384, 30.4219],
  },
});
```

## options

<embed src="@/docs/api/image_layer/options.zh.md"></embed>

## source

<embed src="@/docs/api/image_layer/source.zh.md"></embed>

## style

<embed src="@/docs/api/image_layer/style.zh.md"></embed>

## 图层通用方法

<embed src="@/docs/api/common/layer/base.zh.md"></embed>
