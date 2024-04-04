import { RasterLayer, Scene } from '@antv/l7';
import * as allMap from '@antv/l7-maps';
import * as GeoTIFF from 'geotiff';
import type { RenderDemoOptions } from '../../types';

async function getTiffData(url: string) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return arrayBuffer;
}

export function MapRender(options: RenderDemoOptions) {
  const scene = new Scene({
    id: 'map',
    renderer: options.renderer,
    map: new allMap[options.map]({
      center: [130.5, 47],
      zoom: 10.5,
    }),
  });
  scene.on('loaded', () => {
    addLayer();
  });

  async function addLayer() {
    const url1 = 'https://gw.alipayobjects.com/zos/raptor/1667832825992/LC08_3857_clip_2.tif';
    const tiffdata = await getTiffData(url1);
    const layer = new RasterLayer({ zIndex: 10 });
    const tiff = await GeoTIFF.fromArrayBuffer(tiffdata);
    const image1 = await tiff.getImage();
    const value = await image1.readRasters();
    layer
      .source(value, {
        parser: {
          type: 'ndi',
          width: value.width,
          height: value.height,
          bands: [3, 4], //  4 为 Band5是近红外（NIR）波段，3 为Band4是红光波段
          extent: [130.39565357746957, 46.905730725742366, 130.73364094187343, 47.10217234153133],
        },
      })
      .style({
        domain: [-0.3, 0.5],
        rampColors: {
          colors: ['#ce4a2e', '#f0a875', '#fff8ba', '#bddd8a', '#5da73e', '#235117'],
          positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
        },
      });
    scene.addLayer(layer);
    if (window['screenshot']) {
      window['screenshot']();
    }
  }
}
