import { PolygonLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const extrudeCity: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      style: 'dark',
      center: [121.434765, 31.256735],
      zoom: 14.83,
      pitch: 45,
    },
  });

  const data = await fetch(
    'https://gw.alipayobjects.com/os/basement_prod/972566c5-a2b9-4a7e-8da1-bae9d0eb0117.json',
  ).then((res) => res.json());

  const layer = new PolygonLayer({ autoFit: true })
    .source(data)
    .shape('extrude')
    .size('h20', [100, 120, 160, 200, 260, 500])
    .color('h20', ['#816CAD', '#A67FB5', '#C997C7', '#DEB8D4', '#F5D4E6', '#FAE4F1', '#FFF3FC']);
  scene.addLayer(layer);

  return scene;
};
