import { PointLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const setSize: TestCase = async (options) => {
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

  const pointLayer = new PointLayer({})
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
    .active(true)
    .color('name', ['#5B8FF9', '#5CCEA1', '#5D7092', '#F6BD16', '#E86452'])
    .style({
      opacity: 1,
      strokeWidth: 2,
    });

  scene.addLayer(pointLayer);
  scene.on('zoomchange', () => {
    console.log('zoomchange');
  });
  scene.setZoom(15);

  setSize.extendGUI = (gui) => {
    return [
      gui.add(
        {
          setSize: () => {
            console.log('start update');
            pointLayer.size(30);
            scene.render();
            console.log('update');
          },
        },
        'setSize',
      ),
    ];
  };

  return scene;
};
