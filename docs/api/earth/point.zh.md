---
title: 点图层
order: 3
---

`markdown:docs/common/style.md`

## 简介

用户在地球模式下使用点图层无需做额外的操作，L7 会自动识别地球模式并相关的转化

## 示例图片
<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*ck1XSZ4Vw0QAAAAAAAAAAAAAARQnAQ" alt="L7 地球点图层" width="300" height="300" >

## 使用

```javascript
import { Scene, PointLayer, EarthLayer } from '@antv/l7';
import { Earth } from '@antv/l7-maps';
const scene = new Scene({
  id: 'map',
  map: new Earth({})
});

const d = [
  { lng: 121.61865234375, lat: 25.29437116258816 },
];

const pointlayer = new PointLayer()
  .source(
    d,
    {
      parser: {
        type: 'json',
        x: 'lng',
        y: 'lat'
      }
    }
  )
  .shape('circle')
  .color('#f00')
  .size(10)
  .active(true);

const earthlayer = new EarthLayer()
  .source(
    'https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*3-3NSpqRqUoAAAAAAAAAAAAAARQnAQ',
    {
      parser: {
        type: 'image'
      }
    }
  )
  .style({
    globelOtions: {
      ambientRatio: 1, // 环境光
    }
  })

scene.on('loaded', () => {
  scene.addLayer(earthlayer);
  scene.addLayer(pointlayer);

});

```
