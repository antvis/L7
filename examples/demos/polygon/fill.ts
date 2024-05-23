import { PolygonLayer } from '@antv/l7';
import data from '../../data/us-states.json';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const fill: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [-96, 37.8],
      zoom: 3,
    },
  });

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

  return scene;
};
