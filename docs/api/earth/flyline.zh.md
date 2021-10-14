---
title: 飞线
order: 3
---

`markdown:docs/common/style.md`

## 简介

用户在地球模式下使用飞线图层无需做额外的操作，L7 会自动识别地球模式并相关的转化

## 使用

```javascript
// 1、引入对应模块
const flyLine = new LineLayer({ blend: 'normal' })
  .source(flydata, {
    parser: {
      type: 'json',
      coordinates: 'coord',
    },
  })
  .color('#b97feb')
  .shape('arc3d')
  .size(0.5)
  .active(true)
  .animate({
    interval: 2,
    trailLength: 2,
    duration: 1,
  })
  .style({
    opacity: 1,
    segmentNumber: 60,
    globalArcHeight: 20,
  });
...
// 2、注册服务
scene.addLayer(flyLine);

```