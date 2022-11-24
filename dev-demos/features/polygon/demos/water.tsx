
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
      map: new GaodeMap({
        center: [120, 30],
        pitch: 0,
        zoom: 3,
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
                  [114.4140625, 35.460669951495305],
                  [114.4140625, 30.460669951495305],
                  [104.4140625, 30.460669951495305],
                  [104.4140625, 35.460669951495305],
                ],
              ],
            },
          },
        ],
      })
      .shape('water')
      .color('#1E90FF')
      .style({
        speed: 0.4,
        // waterTexture: 'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*EojwT4VzSiYAAAAAAAAAAAAAARQnAQ'
      })
      .animate(true);

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
