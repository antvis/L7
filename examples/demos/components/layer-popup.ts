import { LayerPopup, PointLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const layerPopup: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [121.435159, 31.256971],
      zoom: 14.89,
      minZoom: 10,
    },
  });

  const data = await fetch(
    'https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json',
  ).then((res) => res.json());

  const pointLayer = new PointLayer({
    name: 'layer',
  })
    .source(data, {
      parser: {
        type: 'json',
        x: 'longitude',
        y: 'latitude',
      },
    })
    .shape('name', [
      'circle',
      'triangle',
      'square',
      'pentagon',
      'hexagon',
      'octogon',
      'hexagram',
      'rhombus',
      'vesica',
    ])
    .size('unit_price', [10, 25])
    .color('name', ['#5B8FF9', '#5CCEA1', '#5D7092', '#F6BD16', '#E86452'])
    .style({
      opacity: 1,
      strokeWidth: 2,
    });

  scene.addLayer(pointLayer);

  const layerPopup = new LayerPopup({
    items: [
      {
        layer: 'layer',
        fields: ['name', 'count'],
      },
    ],
  });

  scene.addPopup(layerPopup);

  return scene;
};
