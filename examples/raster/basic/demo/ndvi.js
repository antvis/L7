// https://gw.alipayobjects.com/zos/antvdemo/assets/2019_clip/ndvi_201905.tif
import { RasterLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as GeoTIFF from 'geotiff';
const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    pitch: 0,
    style: 'dark',
    center: [ 105, 37.5 ],
    zoom: 2.5
  })
});
scene.on('loaded', () => {
  addLayer();
});
// async function getAllYearData() {
//   const allData = [];
//   for (let i = 1; i < 13; i++) {
//     const month = i < 10 ? '0' + i : i;
//     const res = await getTiffData(month);
//     allData.push(res);
//   }
//   return allData;
// }
async function getTiffData(month) {
  const response = await fetch(
    'https://gw.alipayobjects.com/zos/antvdemo/assets/2019_clip/ndvi_2019' + month + '.tiff'
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
    height
  };
}

async function addLayer() {
  const layer = new RasterLayer();
  const tiffdata = await getTiffData('06');
  layer
    .source(tiffdata.data, {
      parser: {
        type: 'raster',
        width: tiffdata.width,
        height: tiffdata.height,
        extent: [ 73.4766000000000048, 18.1054999999999993, 135.1066187, 57.6300460 ]
      }
    })
    .style({
      opacity: 0.8,
      clampLow: false,
      clampHigh: false,
      domain: [ -3000, 10000 ],
      rampColors: {
        colors: [ 'rgb(166,97,26)', 'rgb(223,194,125)', 'rgb(245,245,245)', 'rgb(128,205,193)', 'rgb(1,133,113)' ],
        positions: [ 0, 0.25, 0.5, 0.75, 1.0 ]
      }
    });

  scene.addLayer(layer);
}
