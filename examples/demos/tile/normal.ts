import { RasterLayer, Scene } from '@antv/l7';
import * as allMap from '@antv/l7-maps';
import type { RenderDemoOptions } from '../../types';

export function MapRender(options: RenderDemoOptions) {
  const scene = new Scene({
    id: 'map',
    renderer: options.renderer,
    map: new allMap[options.map]({
      style: 'light',
      center: [121.434765, 31.256735],
      zoom: 4.83,
    }),
  });

  const url1 =
    'https://tiles{1-3}.geovisearth.com/base/v1/ter/{z}/{x}/{y}?format=webp&tmsIds=w&token=b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788';
  const url2 =
    'https://tiles{1-3}.geovisearth.com/base/v1/cat/{z}/{x}/{y}?format=png&tmsIds=w&token=b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788';
  const layer1 = new RasterLayer({
    zIndex: 1,
  }).source(url1, {
    parser: {
      type: 'rasterTile',
      tileSize: 256,
      zoomOffset: 0,
    },
  });

  scene.on('loaded', () => {
    scene.addLayer(layer1);
    // scene.startAnimate()
  });
}
