// @ts-ignore
import { LineLayer, Scene } from '@antv/l7';
// @ts-ignore
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [120, 30],
        pitch: 0,
        zoom: 2,
      }),
    });
    const layer = new LineLayer()
      .source({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [
                [95.625, 28],
                [115.48828125000001, 28],
              ],
            },
          },
        ],
      })
      .shape('halfLine')
      .color('#f00')
      .size(10)
      .style({
        opacity: 0.5,
        arrow: {
          enable: true,
        },
      });
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
