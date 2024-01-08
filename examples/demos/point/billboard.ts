import { PointLayer, Scene } from '@antv/l7';
import * as allMap from '@antv/l7-maps';

export function MapRender(option: {
  map: string;
  renderer: 'regl' | 'device';
}) {
  const scene = new Scene({
    id: 'map',
    renderer: option.renderer,
    map: new allMap[option.map || 'Map']({
      style: 'light',
      center: [120.188193, 30.292542],
      pitch: 0,
      zoom: 16,
    }),
  });
  const layer = new PointLayer()
    .source({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: [120.188193, 30.292542],
          },
        },
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: [120.201665, 30.26873],
          },
        },
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: [120.225209, 30.290802],
          },
        },
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: [120.189641, 30.293248],
          },
        },
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: [120.189389, 30.292542],
          },
        },
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: [120.190837, 30.293303],
          },
        },
      ],
    })
    .size(10)
    .color('#f00')
    .shape('simple');

  scene.on('loaded', () => {
    scene.addLayer(layer);

    if (window['screenshot']) {
      window['screenshot']();
    }
  });
}
