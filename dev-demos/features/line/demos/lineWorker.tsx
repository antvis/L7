// @ts-ignore
import {
  LineLayer,
  Scene,
  // @ts-ignore
} from '@antv/l7';
// @ts-ignore
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
    renderer: process.env.renderer,
      map: new GaodeMap({
        center: [120, 30],
        pitch: 0,
        zoom: 2,
      }),
    });
    const layer = new LineLayer({ workerEnabled: true })
      .source({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [
                [95.625, 38.47939467327645],
                [115.48828125000001, 28.92163128242129],
              ],
            },
          },
        ],
      })
      .shape('line')
      .color('#f00')
      .size(5);
    scene.on('loaded', () => {
      scene.addLayer(layer);
    });
  }, []);
  return (
    <div
      id="map"
      style={{
        height: '500px',
        position: 'relative',
      }}
    />
  );
};
