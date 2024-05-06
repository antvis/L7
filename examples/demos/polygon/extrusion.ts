import { PolygonLayer, Scene } from '@antv/l7';
import * as allMap from '@antv/l7-maps';
import data from '../../data/indoor-3d-map.json';
import type { RenderDemoOptions } from '../../types';

export function MapRender(options: RenderDemoOptions) {
  const scene = new Scene({
    id: 'map',
    renderer: options.renderer,
    map: new allMap[options.map]({
      style: ['MapLibre', 'Mapbox'].includes(options.map)
        ? 'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json'
        : 'normal',
      center: [120, 29.732983],
      zoom: 6.2,
      pitch: 30,
    }),
  });

  scene.on('loaded', () => {
    const provincelayerSide = new PolygonLayer({
      autoFit: true,
    })
      .source(data)
      .size('height')
      .shape('extrusion')
      .color('color')
      .style({
        extrusionBase: {
          field: 'base_height',
        },
        opacity: 1.0,
      });
    scene.addLayer(provincelayerSide);

    if (window['screenshot']) {
      window['screenshot']();
    }
  });
}
