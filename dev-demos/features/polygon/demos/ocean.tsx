
import {
  Scene,
  PolygonLayer,
  // @ts-ignore
} from '@antv/l7';
// @ts-ignore
import { GaodeMap, Mapbox } from '@antv/l7-maps';
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
    const layer = new PolygonLayer()
      .source({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [104.4140625, 35.460669951495305],
                  [98.7890625, 24.206889622398023],
                  [111.796875, 27.371767300523047],
                  [104.4140625, 35.460669951495305],
                ],
              ],
            },
          },
        ],
      })
      .shape('ocean')
      .animate(true)
      .color('#f00')
      .style({
        watercolor: '#6D99A8',
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
