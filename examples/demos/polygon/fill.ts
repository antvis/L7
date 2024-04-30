import { PolygonLayer, Scene } from '@antv/l7';
import * as allMap from '@antv/l7-maps';
import data from '../../data/us-states.json';
import type { RenderDemoOptions } from '../../types';

export function MapRender(options: RenderDemoOptions) {
  const scene = new Scene({
    id: 'map',
    renderer: options.renderer,
    map: new allMap[options.map]({
      style: 'light',
      center: [-96, 37.8],
      zoom: 3,
    }),
  });

  scene.on('loaded', () => {
    const color = [
      'rgb(255,255,217)',
      'rgb(237,248,177)',
      'rgb(199,233,180)',
      'rgb(127,205,187)',
      'rgb(65,182,196)',
      'rgb(29,145,192)',
      'rgb(34,94,168)',
      'rgb(12,44,132)',
    ];
    const layer = new PolygonLayer({})
      .source(data)
      .scale('density', {
        type: 'quantile',
      })
      .color('density', color)
      .shape('fill')
      .active(true);

    scene.addLayer(layer);

    if (window['screenshot']) {
      window['screenshot']();
    }
  });
}
