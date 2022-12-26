import { LineLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [105, 30.258134],
        zoom: 5,
      }),
    });

    const geoData = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            testOpacity: 0.8,
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [99.228515625, 37.43997405227057],
                [99.228515625, 35.02999636902566],
                [101.337890625, 32.99023555965106],
                [99.052734375, 30.29701788337205],
                [100.72265625, 27.994401411046148],
                [99.49218749999999, 26.352497858154024],
                [100.634765625, 23.725011735951796],
              ],
              [
                [108.544921875, 37.71859032558816],
                [110.74218749999999, 34.66935854524543],
                [110.21484375, 32.76880048488168],
                [112.412109375, 32.84267363195431],
                [112.1484375, 30.751277776257812],
                [114.08203125, 31.42866311735861],
              ],
            ],
          },
        },
      ],
    };

    const layer = new LineLayer({})
      .source(geoData)
      .size(10)
      .shape('linearline')
      .style({
        rampColors: {
          colors: [
            '#FF4818',
            '#206C7C',
          ],
          positions: [0., 1.0],
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
