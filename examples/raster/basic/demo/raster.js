import { Scene } from '@l7/scene';
import { RasterLayer } from '@l7/layers'
// import * as GeoTIFF from 'geotiff/dist/geotiff.bundle.js';
const scene = new Scene({
  id: 'map',
  pitch: 0,
  type: 'amap',
  style: 'light',
  center: [121.2680, 30.3628],
  zoom: 13,
});

async function addLayer() {
  const tiffdata = await this.getTiffData();
  const layer = new RasterLayer({});
  layer
    .source(tiffdata.data, {
      parser: {
        type: 'raster',
        width: tiffdata.width,
        height: tiffdata.height,
        min: 0,
        max: 8000,
        extent: [73.482190241, 3.82501784112, 135.106618732, 57.6300459963],
      },
    })
    .style({
      opacity: 0.8,
      rampColors: {
        colors: [
          '#002466',
          '#0D408C',
          '#105CB3',
          '#1A76C7',
          '#2894E0',
          '#3CB4F0',
          '#65CEF7',
          '#98E3FA',
          '#CFF6FF',
          '#E8FCFF',
        ],
        positions: [0, 0.02, 0.05, 0.1, 0.2, 0.3, 0.5, 0.6, 0.8, 1.0],
      },
    });
    return layer;
}
addLayer()
scene.on('loaded',()=>{
  const layer = addLayer();
  scene.addLayer(layer);
})

 async function getTiffData() {
  const response = await fetch(
    'https://gw.alipayobjects.com/os/rmsportal/XKgkjjGaAzRyKupCBiYW.dat',
  );
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
