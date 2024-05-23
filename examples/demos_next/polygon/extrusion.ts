import { PolygonLayer } from '@antv/l7';
import data from '../../data/indoor-3d-map.json';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const extrusion: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [120, 29.732983],
      zoom: 6.2,
      pitch: 30,
    },
  });

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

  return scene;
};
