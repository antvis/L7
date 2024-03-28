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
    'https://static.sencdn.com/stargazer/tiffs/rtnc_tmp_tiff/2024020210.tiff',
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
          domain: [-400, 400],
          rampColors: {
            type: 'linear',
            colors: [
              '#b2182b',
              '#d6604d',
              '#f4a582',
              '#fddbc7',
              '#f7f7f7',
              '#d1e5f0',
              '#92c5de',
              '#4393c3',
              '#2166ac',
            ],
            positions: [-35, -20, -10, -5, 0, 5, 10, 15, 20, 40].map((v) => v * 10).reverse(),
          },
        });

      scene.addLayer(layer);
      scene.addLayer(polygonLayer);
    });
});
