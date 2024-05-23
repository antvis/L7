import { PolygonLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

const data1 = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        base_height: 100,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [119.948198, 30.339818],
            [120.344273, 30.513865],
            [120.414729, 30.288859],
            [120.346177, 30.160522],
            [120.100535, 30.041909],
            [119.906306, 30.094644],
            [119.845646, 30.175339],
            [119.81137, 30.244454],
            [119.807562, 30.352965],
            [119.948198, 30.339818],
          ],
        ],
      },
    },
  ],
};

const data2 = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        base_height: 200,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [119.948198, 30.339818],
            [120.344273, 30.513865],
            [120.414729, 30.288859],
            [121.346177, 30.160522],
            [120.100535, 30.041909],
            [119.906306, 30.094644],
            [119.845646, 30.175339],
            [119.81137, 30.244454],
            [119.807562, 30.352965],
            [119.948198, 30.339818],
          ],
        ],
      },
    },
  ],
};

export const setData: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [120.100535, 30.041909],
      zoom: 14.83,
    },
  });

  const layer = new PolygonLayer({
    autoFit: false,
  })
    .source(data1)
    .shape('fill')
    .active(true)
    .color('red');

  layer.once('inited', () => {
    layer.fitBounds({ animate: false });
  });

  scene.addLayer(layer);

  setData.extendGUI = (gui) => {
    return [
      gui.add(
        {
          setData: () => {
            console.log('setData: ');
            layer.setData(data2);
          },
        },
        'setData',
      ),
    ];
  };

  return scene;
};
