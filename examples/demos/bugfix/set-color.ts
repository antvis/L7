import { LineLayer, PolygonLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const setColor: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [-96, 37.8],
      zoom: 3,
    },
  });

  const data = await fetch(
    // 'https://gw.alipayobjects.com/os/basement_prod/d36ad90e-3902-4742-b8a2-d93f7e5dafa2.json'
    'https://mdn.alipayobjects.com/afts/file/A*CFbnRqXpg8wAAAAAAAAAAAAADrd2AQ/test.json',
  ).then((res) => res.json());

  const layer = new PolygonLayer({ autoFit: true })
    .source(data)
    .color('#f00')
    .shape('fill')
    .active(true);
  const layer2 = new LineLayer({
    zIndex: 2,
  })
    .source(data)
    .color('#ffffff')
    .active(true)
    .size(1)
    .style({
      lineType: 'dash',
      dashArray: [2, 2],
    });
  scene.addLayer(layer);
  scene.addLayer(layer2);

  setColor.extendGUI = (gui) => {
    return [
      gui.add(
        {
          setColor: () => {
            layer.color('#f0f');
            layer2.color('#00f');
            scene.render();
          },
        },
        'setColor',
      ),
    ];
  };

  return scene;
};
