---
title: LineLayer
order: 0
---

<embed src="@/docs/api/common/style.md"></embed>

## 简介

线图层通过一组经纬度数据组来描述地图上的一条或者多条路径。通过路径的类型，将其区分为路径、弧线、3D 弧线以及其他的类型。  
用户可以通过配置 `shape` 参数来选择线的类型，同时通过 `style`、`size`、`color` 方法调整线的样式。

<div>
  <div style="width:40%;float:right; margin-left: 16px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*MxnRTrzcawcAAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

```js
import { LineLayer } from '@antv/l7';

const layer = new LineLayer()
  .source([{ lng: 120, lat: 30, lng1: 125, lat1: 30 }], {
    parser: {
      type: 'json',
      x: 'lng',
      y: 'lat',
      x1: 'lng1',
      y1: 'lat1',
    },
  })
  .shape('line')
  .size(2)
  .color('#f00');
```

## options

<embed src="@/docs/api/line_layer/options.zh.md"></embed>

## source

<embed src="@/docs/api/line_layer/source.zh.md"></embed>

## shape

<embed src="@/docs/api/line_layer/shape.zh.md"></embed>

## color

<embed src="@/docs/api/line_layer/color.zh.md"></embed>

## size

<embed src="@/docs/api/line_layer/size.zh.md"></embed>

## scale

<embed src="@/docs/api/line_layer/scale.zh.md"></embed>

## style

<embed src="@/docs/api/line_layer/style.zh.md"></embed>

## animate

<embed src="@/docs/api/line_layer/animate.zh.md"></embed>

## texture

<embed src="@/docs/api/line_layer/texture.zh.md"></embed>

## 图层通用方法

<embed src="@/docs/api/common/layer/base.zh.md"></embed>
