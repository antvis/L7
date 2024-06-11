import { RasterLayer } from '@antv/l7';
import * as GeoTIFF from 'geotiff';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const dem: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [121.434765, 31.256735],
      zoom: 3,
    },
  });

  const tiffdata = await getTiffData();
  const tiff = await GeoTIFF.fromArrayBuffer(tiffdata);
  const image = await tiff.getImage();
  const width = image.getWidth();
  const height = image.getHeight();
  const values = await image.readRasters();

  const layer = new RasterLayer();
  layer
    .source(values[0], {
      parser: {
        type: 'raster',
        width,
        height,
        extent: [73.482190241, 3.82501784112, 135.106618732, 57.6300459963],
      },
    })
    .style({
      opacity: 1,
      // clampLow: false,
      // clampHigh: false,
      domain: [0, 10000],
      rampColors: {
        type: 'custom',
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
        positions: [0, 50, 200, 500, 2000, 3000, 4000, 5000, 8000, 10000],
      },
    });

  layer.on('inited', () => {
    console.log(layer.getLegend('color'));
  });

  scene.addLayer(layer);

  return scene;
};

async function getTiffData() {
  const response = await fetch(
    'https://gw.alipayobjects.com/os/rmsportal/XKgkjjGaAzRyKupCBiYW.dat',
  );
  const arrayBuffer = await response.arrayBuffer();
  return arrayBuffer;
}
