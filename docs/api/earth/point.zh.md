---
title: 点图层
order: 3
---

`markdown:docs/common/style.md`

## 简介

用户在地球模式下使用点图层无需做额外的操作，L7 会自动识别地球模式并相关的转化

## 使用

```javascript
// 1、构建 pointlayer
const pointlayer = new PointLayer()
  .source(
    data,
    {
      parser: {
        type: 'json',
        x: 'lng',
        y: 'lat',
      },
    },
  )
  // .shape('circle') // cylinder
  .color('#f00')
  .size(20) // .size('', () => [1, 1, 10])

...

// 2、添加 pointlayer 图层对象
scene.addLayer(pointlayer);

```
