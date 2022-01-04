---
title: 飞线
order: 3
---

`markdown:docs/common/style.md`

## 简介

用户在地球模式下使用飞线图层无需做额外的操作，L7 会自动识别地球模式并相关的转化

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*4ZCnQaH_nLIAAAAAAAAAAAAAARQnAQ" style="display: block; margin: 0 auto" alt="L7地球飞线图层" width="300" height="300">

## 使用

```javascript
import { Scene, EarthLayer, LineLayer } from '@antv/l7';
import { Earth } from '@antv/l7-maps';
const scene = new Scene({
  id: 'map',
  map: new Earth({}),
});

const flydata = [
  {
    coord: [
      [104.195397, 35.86166],
      [100.992541, 15.870032],
    ],
  },
];
const flyLine = new LineLayer({ blend: 'normal' })
  .source(flydata, {
    parser: {
      type: 'json',
      coordinates: 'coord',
    },
  })
  .color('#b97feb')
  .shape('arc3d')
  .size(0.5);

const earthlayer = new EarthLayer()
  .source(
    'https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*3-3NSpqRqUoAAAAAAAAAAAAAARQnAQ',
    {
      parser: {
        type: 'image',
      },
    },
  )
  .color('#2E8AE6')
  .shape('base');

scene.on('loaded', () => {
  scene.addLayer(earthlayer);
  scene.addLayer(flyLine);
  earthlayer.setEarthTime(4.0);
});
```
