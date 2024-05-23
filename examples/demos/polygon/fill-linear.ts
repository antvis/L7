import { PolygonLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const fillLinear: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [121.434765, 31.256735],
      zoom: 14.83,
    },
  });

  const data = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          testOpacity: 0.8,
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [113.8623046875, 30.031055426540206],
              [116.3232421875, 30.031055426540206],
              [116.3232421875, 31.090574094954192],
              [113.8623046875, 31.090574094954192],
              [113.8623046875, 30.031055426540206],
            ],
          ],
        },
      },
    ],
  };

  const layer = new PolygonLayer({
    autoFit: true,
  })
    .source(data)
    .shape('fill')
    .color('red')
    .active(true)
    .style({
      opacity: 0.5,
      opacityLinear: {
        enable: true,
        dir: 'in',
      },
    });

  scene.addLayer(layer);

  return scene;
};
