import { PointLayer, PolygonLayer, Scene } from '@antv/l7';
import * as allMap from '@antv/l7-maps';
import type { RenderDemoOptions } from '../../types';

export function MapRender(options: RenderDemoOptions) {
  const scene = new Scene({
    id: 'map',
    renderer: options.renderer,
    map: new allMap[options.map]({
      style: 'light',
      center: [120.165, 30.26],
      pitch: 0,
      zoom: 15,
    }),
  });

  scene.addImage(
    '00',
    'https://gw.alipayobjects.com/zos/basement_prod/604b5e7f-309e-40db-b95b-4fac746c5153.svg',
  );
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

  scene.on('loaded', () => {
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

    if (window['screenshot']) {
      window['screenshot']();
    }
  });
}
