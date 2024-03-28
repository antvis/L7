// 空气质量
// https://gw.alipayobjects.com/zos/antvdemo/assets/2019_clip/ndvi_201905.tif
import { PolygonLayer, RasterLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as GeoTIFF from 'geotiff';
const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [121.268, 30.3628],
    zoom: 3,
    token: '6f025e700cbacbb0bb866712d20bb35c',
  }),
});
async function getTiffData() {
  const response = await fetch(
    'https://static.sencdn.com/stargazer/tiffs/forecast_aqi/2024020200_2024020211.tiff',
  );
  const arrayBuffer = await response.arrayBuffer();
  return arrayBuffer;
}
scene.on('loaded', async () => {
  const tiffdata = await getTiffData();
  const tiff = await GeoTIFF.fromArrayBuffer(tiffdata);
  const image = await tiff.getImage();
  const width = image.getWidth();
  const height = image.getHeight();
  const values = await image.readRasters();

  fetch('https://gw.alipayobjects.com/os/basement_prod/d2e0e930-fd44-4fca-8872-c1037b0fee7b.json')
    .then((res) => res.json())
    .then(async (maskData) => {
      const polygonLayer = new PolygonLayer({
        visible: false,
      })
        .source(maskData)
        .shape('fill')
        .color('#f00')
        .style({ opacity: 0.5 });

      const layer = new RasterLayer({
        maskLayers: [polygonLayer],
        autoFit: true,
      });
      layer
        .source(values[0], {
          parser: {
            type: 'raster',
            width,
            height,
            extent: [73, 17, 135.95, 53.95],
          },
        })
        .style({
          opacity: 1,
          clampLow: false,
          clampHigh: false,
          domain: [-0, 500],
          rampColors: {
            type: 'linear',
            colors: ['#d7191c', '#fdae61', '#ffffbf', '#a6d96a'].reverse(),
            positions: [0, 50, 100, 150, 300, 500],
          },
        });

      scene.addLayer(layer);
      scene.addLayer(polygonLayer);
    });
});
