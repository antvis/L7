import { PointLayer, PolygonLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const single: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [120.165, 30.26],
      pitch: 0,
      zoom: 15,
    },
  });

  const maskData = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'MultiPolygon',
          coordinates: [
            [
              [
                [120.16, 30.259660295442085],
                [120.16, 30.25313608393673],
                [120.17, 30.253729211980726],
                [120.17, 30.258474107402265],
              ],
            ],
          ],
        },
      },
    ],
  };

  const polygonLayer = new PolygonLayer()
    .source(maskData)
    .shape('fill')
    .color('#f00')
    .style({ opacity: 0.5 });

  const point1 = new PointLayer({
    zIndex: 1,
    maskLayers: [polygonLayer],
  })
    .source(
      [
        {
          name: 'n5',
          lng: 120.17,
          lat: 30.255,
        },
      ],
      {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      },
    )
    .shape('simple')
    .size(30)
    .style({
      opacity: 0.6,
    })
    .active(true);

  const point2 = new PointLayer({
    maskLayers: [polygonLayer],
  })
    .source(
      [
        {
          name: 'n4',
          lng: 120.17,
          lat: 30.2565,
        },
      ],
      {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      },
    )
    .shape('simple')
    .size(30)
    .color('#0f0')
    .active(true);

  scene.addLayer(point1);
  scene.addLayer(polygonLayer);
  scene.addLayer(point2);

  return scene;
};
