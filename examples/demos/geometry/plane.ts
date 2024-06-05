import { GeometryLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const plane: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [120.1025, 30.2594],
      style: 'dark',
      zoom: 10,
    },
  });

  const layer = new GeometryLayer()
    .shape('plane')
    .style({
      opacity: 0.8,
      width: 0.074,
      height: 0.061,
      center: [120.1025, 30.2594],
    })
    .active(true)
    .color('#ff0');
  scene.addLayer(layer);

  return scene;
};
