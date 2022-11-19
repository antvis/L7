---
title: 掩模图层 - 配置构造参数
order: 1
---
<embed src="@/docs/common/style.md"></embed>

为了快速使用掩膜图层，我们可以在创建普通图层的时候直接配置掩模参数。

```js
const layer = new PointLayer({
  mask: true,
  maskfence: ...
})
```

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*9MkxQon-WwcAAAAAAAAAAAAADmJ7AQ/original'>
  </div>
</div>

### 实现

下面我们来介绍如何创建普通图层的时候直接配置掩模参数。

```javascript
import { Scene, RasterLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as GeoTIFF from 'geotiff';

async function getTiffData() {
  const response = await fetch('https://gw.alipayobjects.com/os/rmsportal/XKgkjjGaAzRyKupCBiYW.dat');
  const arrayBuffer = await response.arrayBuffer();
  const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
  const image = await tiff.getImage();
  const width = image.getWidth();
  const height = image.getHeight();
  const values = await image.readRasters();
  return {
    data: values[0],
    width,
    height,
    min: 0,
    max: 8000,
  };
}

const scene = new Scene({
id: 'map',
stencil: true,
map: new GaodeMap({
  center: [120.165, 30.26],
  zoom: 2,
  style: 'dark',
}),
});

const tiffdata = await getTiffData();

fetch('https://gw.alipayobjects.com/os/basement_prod/d2e0e930-fd44-4fca-8872-c1037b0fee7b.json')
.then((res) => res.json())
.then((maskData) => {
  const layer = new RasterLayer({ mask: true, maskfence: maskData })
    .source(tiffdata.data, {
      parser: {
        type: 'raster',
        width: tiffdata.width,
        height: tiffdata.height,
        extent: [ 73.482190241, 3.82501784112, 135.106618732, 57.6300459963,],
      },
    })
    .style({
      clampLow: true,
      rampColors: {
        colors: [
          'rgb(166,97,26)',
          'rgb(223,194,125)',
          'rgb(245,245,245)',
          'rgb(128,205,193)',
          'rgb(1,133,113)',
        ],
        positions: [0, 0.25, 0.5, 0.75, 1.0],
      },
    });
  scene.addLayer(layer);
});
```