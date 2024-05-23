import { PointLayer, Zoom } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const zoom: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [121.46552, 31.223009],
      zoom: 19,
    },
  });

  const imageLayerText = new PointLayer()
    .source(
      [
        {
          longitude: 121.46552,
          latitude: 31.223009,
        },
      ],
      {
        parser: {
          type: 'json',
          x: 'longitude',
          y: 'latitude',
        },
      },
    )
    .shape('circle')
    .color('#f00')
    .size(10)
    .style({
      opacity: 0.8,
    });

  scene.addLayer(imageLayerText);

  const newControl = new Zoom({
    showZoom: true,
  });
  scene.addControl(newControl);

  return scene;
};
