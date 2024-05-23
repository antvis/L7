import { RasterLayer } from '@antv/l7';
import * as GeoTIFF from 'geotiff';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const multiband: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [130.5, 47],
      zoom: 10.5,
    },
  });

  const url1 = 'https://gw.alipayobjects.com/zos/raptor/1667832825992/LC08_3857_clip_2.tif';
  const tiffdata = await getTiffData(url1);
  const layer = new RasterLayer({ zIndex: 10 });
  const tiff = await GeoTIFF.fromArrayBuffer(tiffdata);
  const image1 = await tiff.getImage();
  const value = await image1.readRasters();
  layer
    .source(value, {
      parser: {
        type: 'rgb',
        width: value.width,
        height: value.height,
        bands: [5, 4, 3],
        extent: [130.39565357746957, 46.905730725742366, 130.73364094187343, 47.10217234153133],
      },
    })
    .style({
      opacity: 1,
    });
  scene.addLayer(layer);

  return scene;
};

async function getTiffData(url: string) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return arrayBuffer;
}
