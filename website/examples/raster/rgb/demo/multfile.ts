// @ts-ignore
import { RasterLayer, Scene } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';

import * as GeoTIFF from 'geotiff';

async function getTiffData(url: string) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return arrayBuffer;
}


const scene = new Scene({
  id: 'map',
  map: new Map({
    center: [130.5, 47],
    zoom: 10.5,
  }),
});

scene.on('loaded', async () => {
  const url1 =
    'https://gw.alipayobjects.com/zos/raptor/1667832825992/LC08_3857_clip_2.tif';
  const tiffdata = await getTiffData(url1);
  const url2 =
    'https://t0.tianditu.gov.cn/img_w/wmts?tk=b72aa81ac2b3cae941d1eb213499e15e&';

  const layer2 = new RasterLayer({
    zIndex: 1,
  }).source(url2, {
    parser: {
      type: 'rasterTile',
      tileSize: 256,
      zoomOffset: 1,
      wmtsOptions: {
        layer: 'img',
        tileMatrixset: 'w',
        format: 'tiles',
      },
    },
  });
  // NDBI 6,5
  // NDWI 3,5
  const layer = new RasterLayer({
    zIndex: 10,
  });

  layer
    .source(
      [
        {
          data: tiffdata,
          bands: [6, 5].map((v) => v - 1),
        },
      ],
      {
        parser: {
          type: 'raster',
          format: async (data, bands) => {
            const tiff = await GeoTIFF.fromArrayBuffer(data);
            const image = await tiff.getImage();
            const width = image.getWidth();
            const height = image.getHeight();
            const values = await image.readRasters();
            return [
              { rasterData: values[bands[0]], width, height }, // R
              { rasterData: values[bands[1]], width, height }, // NIR
            ];
          },
          operation: 'ndvi',
          extent: [
            130.39565357746957, 46.905730725742366, 130.73364094187343,
            47.10217234153133,
          ],
        },
      },
    )
    .style({
      domain: [-0.35, 0.6],
      rampColors: {
        colors: ['#276419', '#f7f7f7', '#ff0000'].reverse(),
        positions: [0, 0.38, 1.0],
      },
    });

  scene.addLayer(layer2);
  scene.addLayer(layer);
});
