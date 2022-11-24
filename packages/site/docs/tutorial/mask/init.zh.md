---
title: 掩模图层 - 直接使用
order: 0
---
<embed src="@/docs/common/style.md"></embed>

我们可以直接创建一个 `MaskLayer` 添加到场景中用于裁剪支持掩模的图层。 

```js
const mask = new MaskLayer();
mask.source(...);
const layer = new PointLayer({
  mask: true,
});
scene.addLayer(mask);
scene.addLayer(layer);
```

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*jhWWS6dhKhYAAAAAAAAAAAAAARQnAQ'>
  </div>
</div>



### 实现

下面我们来介绍如何直接创建一个 `MaskLayer` 进行使用。

```javascript
import { RasterLayer, Scene, MaskLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as GeoTIFF from 'geotiff';
const scene = new Scene({
  id: 'map',
  stencil: true,
  map: new GaodeMap({
    style: 'dark',
    center: [ 105, 37.5 ],
    zoom: 2.5
  })
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/basement_prod/d2e0e930-fd44-4fca-8872-c1037b0fee7b.json')
    .then(res => res.json())
    .then(data => {
      const layer = new MaskLayer({}).source(data)
      scene.addLayer(layer);
    });
  addLayer();
});
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
    max: 8000
  };
}

async function addLayer() {
  const tiffdata = await getTiffData();
  const layer = new RasterLayer({ mask: true }).source(tiffdata.data, {
      parser: {
        type: 'raster',
        width: tiffdata.width,
        height: tiffdata.height,
        extent: [ 73.482190241, 3.82501784112, 135.106618732, 57.6300459963 ]
      }
    })
    .style({
      domain: [ 0, 8000 ],
      rampColors: {
        colors: [ '#FF4818', '#F7B74A', '#FFF598', '#91EABC', '#2EA9A1', '#206C7C' ].reverse(),
        positions: [ 0, 0.2, 0.4, 0.6, 0.8, 1.0 ]
      }
    });
  scene.addLayer(layer);
}
```