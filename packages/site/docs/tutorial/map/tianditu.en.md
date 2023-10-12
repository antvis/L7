---
title: Tianditu
order: 2
---

`L7`Supports loading sky map tiles through tile layers.

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*2_vQT6N8Ug8AAAAAAAAAAAAADmJ7AQ/original'>
  </div>
</div>

### accomplish

Below we will introduce how to quickly create a map of the sky.

```js
import { Scene, RasterLayer } from '@antv/l7';
import { Map } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Map({
    center: [ 90.268, 40.3628 ],
    zoom: 3
  })
});
scene.on('loaded', () => {
  // 底图服务
  const baseLayer = new RasterLayer({ zIndex: 1 });
  .source(
    'https://t1.tianditu.gov.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}&tk=6557fd8a19b09d6e91ae6abf9d13ccbd',
    {
      parser: {
        type: 'rasterTile',
        tileSize: 256,
      }
    }
  );
  // 注记服务
  const annotionLayer = new RasterLayer({ zIndex: 2 });
  .source(
    'https://t1.tianditu.gov.cn/DataServer?T=cva_w&X={x}&Y={y}&L={z}&tk=6557fd8a19b09d6e91ae6abf9d13ccbd',
    {
      parser: {
        type: 'rasterTile',
        tileSize: 256,
      }
    }
  );
  scene.addLayer(baseLayer);
  scene.addLayer(annotionLayer);
});
```
