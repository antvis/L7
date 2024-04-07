import { LineLayer, PointLayer, Scene, Source } from '@antv/l7';
import * as allMap from '@antv/l7-maps';
import type { RenderDemoOptions } from '../../types';

export function MapRender(options: RenderDemoOptions) {
  const scene = new Scene({
    id: 'map',
    renderer: options.renderer,
    map: new allMap[options.map]({
      style: 'light',
      center: [121.434765, 31.256735],
      zoom: 14.83,
    }),
  });

  const geoData = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          offset: 0.8,
        },
        geometry: {
          type: 'MultiLineString',
          coordinates: [
            [
              [116.371436, 39.942372],
              [121.467025, 31.2327],
            ],
          ],
        },
      },
    ],
  };

  const geoData2 = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          offset: 0.3,
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [112.548194, 37.786985],
            [102.92417, 24.9848],
          ],
        },
      },
    ],
  };
  const source = new Source(geoData);
  const source2 = new Source(geoData2);

  // scene.on('zoom', e => console.log(e))

  const layer = new LineLayer({ blend: 'normal', autoFit: true })
    .source(source)
    .size(2)
    .shape('arc')
    .color('#f00')
    .style({
      // lineType:'dash',
      // thetaOffset: 'offset'
      // segmentNumber: 10,
      thetaOffset: 0.5,
    });
  const layer2 = new LineLayer({ blend: 'normal' })
    .source(source2)
    .size(2)
    .shape('arc')
    .color('#f00')
    .style({
      lineType: 'dash',
      // thetaOffset: 'offset'
      // segmentNumber: 10,
      thetaOffset: 0.5,
    });

  const point = new PointLayer({ blend: 'normal', zIndex: 1 })
    .source(
      [
        {
          lng: 116.43,
          lat: 39.97,
        },
        {
          lng: 108.39,
          lat: 22.91,
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
    .shape('circle')
    .size(10)
    .color('blue');
  const point2 = new PointLayer({ blend: 'normal', zIndex: 1 })
    .source(
      [
        {
          lng: 116.43,
          lat: 39.97,
        },
        {
          lng: 108.39,
          lat: 22.91,
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
    .shape('circle')
    .size(100000)
    .color('blue')
    .style({
      opacity: 0.5,
      unit: 'meter',
    });
  scene.addLayer(point);
  scene.addLayer(point2);

  scene.addLayer(layer);
  scene.addLayer(layer2);
  if (window['screenshot']) {
    window['screenshot']();
  }
}
