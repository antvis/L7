import { LineLayer, Scene } from '@antv/l7';
import * as allMap from '@antv/l7-maps';
import data from '../../data/hunan-citys.json';
import type { RenderDemoOptions } from '../../types';

export function MapRender(options: RenderDemoOptions) {
  const scene = new Scene({
    id: 'map',
    renderer: options.renderer,
    map: new allMap[options.map]({
      style: 'light',
      center: [121.434765, 31.256735],
      zoom: 14.83,
      pitch: 45,
    }),
  });

  const layer = new LineLayer({
    autoFit: true,
  })
    .source(data)
    .size(100000)
    .shape('wall')
    .style({
      opacity: 0.4,
      sourceColor: '#0DCCFF',
      targetColor: 'rbga(255,255,255, 0)',
      heightfixed: true,
    });
  scene.addLayer(layer);
}
