---
title: 掩模图层 - 瓦片
order: 2
---
<embed src="@/docs/common/style.md"></embed>

我们在直接创建 `MaskLayer` 图层的时候支持加载矢量瓦片数据，创建瓦片类型的掩模图层，通常用于对瓦片图层进行掩模裁剪。

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*YwloTpTVWSkAAAAAAAAAAAAADmJ7AQ/original'>
  </div>
</div>

### 实现

下面我们来介绍如何创建一个 `MaskLayer` 瓦片图层。

```javascript
import { Scene, RasterLayer, MaskLayer } from '@antv/l7';
import { Map } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  stencil: true,
  map: new Map({
    center: [112, 30],
    zoom: 3,
  }),
});

const mask = new MaskLayer({
  sourceLayer: 'ecoregions2',
}).source(
  'http://ganos.oss-cn-hangzhou.aliyuncs.com/m2/rs_l7/{z}/{x}/{y}.pbf',
  {
    parser: {
      type: 'mvt',
      tileSize: 256,
      maxZoom: 9,
      extent: [-180, -85.051129, 179, 85.051129],
    },
  },
);

const layer = new RasterLayer({
  zIndex: 1,
  mask: true,
}).source('http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
  {
    parser: {
      type: 'rasterTile',
      tileSize: 256,
      updateStrategy: 'overlap',
    },
  },
);

scene.on('loaded', () => {
  scene.addLayer(mask);
  scene.addLayer(layer);
});
```