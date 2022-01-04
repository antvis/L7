---
title: PolygonLayer
order: 0
---

`markdown:docs/common/style.md`

## 简介

绘制 2D 多边形以及沿 Z 轴拉伸后的 3D 图形。

## 使用

```javascript
import { PolygonLayer } from '@antv/l7';
```

## shape 类型

`PolygonLayer` 填充图支持 3 种 shape

**填充面**

- fill 绘制填充面 不支持数据映射

<img width="60%" style="display: block;margin: 0 auto;" alt="面图层填充图" src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*v5dZT4Q1dgsAAAAAAAAAAAAAARQnAQ">

```javascript
import { Scene, PolygonLayer } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    pitch: 0,
    style: 'blank',
    center: [116.368652, 39.93866],
    zoom: 10.07,
  }),
});
scene.on('loaded', () => {
  fetch(
    'https://gw.alipayobjects.com/os/bmw-prod/d6da7ac1-8b4f-4a55-93ea-e81aa08f0cf3.json',
  )
    .then((res) => res.json())
    .then((data) => {
      const chinaPolygonLayer = new PolygonLayer({
        autoFit: true,
      })
        .source(data)
        .color('red')
        .shape('fill')
        .style({
          opacity: 1,
        });

      scene.addLayer(chinaPolygonLayer);
    });
});
```

**填充图描边**

- line 绘制填充图描边 不支持数据映射

<img width="60%" style="display: block;margin: 0 auto;" alt="面图层填充图" src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*KSlPQ6MCu4sAAAAAAAAAAAAAARQnAQ">

```javascript
import { Scene, PolygonLayer } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    pitch: 0,
    style: 'blank',
    center: [116.368652, 39.93866],
    zoom: 10.07,
  }),
});
scene.on('loaded', () => {
  fetch(
    'https://gw.alipayobjects.com/os/bmw-prod/d6da7ac1-8b4f-4a55-93ea-e81aa08f0cf3.json',
  )
    .then((res) => res.json())
    .then((data) => {
      const chinaPolygonLayer = new PolygonLayer({
        autoFit: true,
      })
        .source(data)
        .color('#000')
        .shape('line')
        .style({
          opacity: 1,
        });

      scene.addLayer(chinaPolygonLayer);
    });
});
```

**3D 填充图**

- extrude 对填充图 3D 拉伸 不支持数据映射

<img width="60%" style="display: block;margin: 0 auto;" alt="面图层填充图" src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*vcN8TptUA1cAAAAAAAAAAAAAARQnAQ">

```javascript
import { Scene, PolygonLayer } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    pitch: 0,
    style: 'blank',
    center: [116.368652, 39.93866],
    zoom: 10.07,
  }),
});
scene.on('loaded', () => {
  fetch(
    'https://gw.alipayobjects.com/os/bmw-prod/d6da7ac1-8b4f-4a55-93ea-e81aa08f0cf3.json',
  )
    .then((res) => res.json())
    .then((data) => {
      const chinaPolygonLayer = new PolygonLayer({
        autoFit: true,
      })
        .source(data)
        .color('name', [
          'rgb(239,243,255)',
          'rgb(189,215,231)',
          'rgb(107,174,214)',
          'rgb(49,130,189)',
          'rgb(8,81,156)',
        ])
        .shape('extrude')
        .size('childrenNum', (num) => num * 10000)
        .style({
          opacity: 1,
        });

      scene.addLayer(chinaPolygonLayer);
    });
});
```

`markdown:docs/common/layer/base.md`
