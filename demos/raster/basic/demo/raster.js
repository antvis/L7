import { Scene } from '@l7/scene';
import { RasterLayer } from '@l7/layers'
import * as GeoTIFF from 'geotiff';
const scene = new Scene({
  id: 'map',
  pitch: 0,
  type: 'mapbox',
  style: 'light',
  center: [121.2680, 30.3628],
  zoom: 3,
});
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

async function addLayer() {
  const tiffdata = await getTiffData();

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
      heightRatio:100,
      opacity: 0.8,
      rampColors: {
        colors: [ '#FF4818', '#F7B74A', '#FFF598', '#91EABC', '#2EA9A1', '#206C7C' ].reverse(),
        positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0]
      },
    });
    return layer;
}
scene.on('loaded', async () =>{
  const layer = await addLayer();
  scene.addLayer(layer);
  scene.render();
})

