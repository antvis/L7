import { LineLayer, Source } from '@antv/l7';
import type { Map } from 'maplibre-gl';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const wgs84Data: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [121.434765, 31.256735],
      zoom: 14.83,
      maxZoom: 23.9,
    },
  });

  const geoData = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            [120.10121458655186, 30.269329295915544],
            [120.10122467185921, 30.2693341645727],
            [120.10123176240315, 30.269323019911795],
          ],
        },
      },
    ],
  };

  const source = new Source(geoData);
  const layer = new LineLayer({ blend: 'normal', autoFit: true })
    .source(source)
    .size(2)
    .shape('line')
    .color('#f00')
    .style({
      opacity: 1,
    });

  scene.addLayer(layer);

  if (scene.getType() === 'mapbox') {
    const baseMap = scene.map as Map;
    baseMap.on('load', () => {
      baseMap.addSource('route', {
        type: 'geojson',
        data: geoData,
      });
      baseMap.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#0083FE',
          'line-width': 2,
        },
      });
    });
  }

  return scene;
};
