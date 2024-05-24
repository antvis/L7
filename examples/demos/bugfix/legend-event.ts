import { PolygonLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const legendEvent: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [116.368652, 39.93866],
      zoom: 10.07,
    },
  });

  const data = await fetch(
    'https://gw.alipayobjects.com/os/basement_prod/1d27c363-af3a-469e-ab5b-7a7e1ce4f311.json',
  ).then((res) => res.json());

  const layer = new PolygonLayer({
    autoFit: true,
  })
    .source(data)
    .color(
      'unit_price',
      [
        '#1A4397',
        '#2555B7',
        '#3165D1',
        '#467BE8',
        '#6296FE',
        '#7EA6F9',
        '#98B7F7',
        '#BDD0F8',
        '#DDE6F7',
        '#F2F5FC',
      ].reverse(),
    )
    .shape('fill')
    .active(true);

  scene.addLayer(layer);

  layer.on('legend:color', (color) => {
    console.log('color legend', layer.getLegend('color'));
  });

  legendEvent.extendGUI = (gui) => {
    return [
      gui.add(
        {
          setData: () => {
            console.log('update data');
            const newData = {
              ...data,
              features: data.features.slice(1, 10),
            };
            layer.setData(newData);
          },
        },
        'setData',
      ),
      gui.add(
        {
          updateColor: () => {
            console.log('update color');
            layer.color('unit_price', [
              '#1A4397',
              '#2555B7',
              '#3165D1',
              '#467BE8',
              '#6296FE',
              '#7EA6F9',
              '#98B7F7',
              '#BDD0F8',
              '#DDE6F7',
              '#F2F5FC',
            ]);
            scene.render();
          },
        },
        'updateColor',
      ),
    ];
  };

  return scene;
};
