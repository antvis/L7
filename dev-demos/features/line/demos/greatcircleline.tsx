import {
  LineLayer,
  Scene,
  Source,
  lineAtOffset,
  lineAtOffsetAsyc,
  PointLayer,
  // @ts-ignore
} from '@antv/l7';
// @ts-ignore
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [105, 32],
        zoom: 4,
        // pitch: 60
      }),
    });

    const geoData = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            offset: 0.3,
          },
          geometry: {
            type: 'MultiLineString',
            coordinates: [
              [
                [99.228515625, 37.43997405227057],
                [100.72265625, 27.994401411046148],
              ],
              [
                [108.544921875, 37.71859032558816],
                [112.412109375, 32.84267363195431],
              ],
            ],
          },
        },
        {
          type: 'Feature',
          properties: {
            offset: 0.8,
          },
          geometry: {
            type: 'MultiLineString',
            coordinates: [
              [
                [120, 30],
                [120, 40],
              ],
            ],
          },
        },
      ],
    };
    const source = new Source(geoData);

    // scene.on('zoom', e => console.log(e))

    const layer = new LineLayer({ blend: 'normal' })
      .source(source)
      .size(5)
      .shape('arc3d')
      .color('#f00')
      .style({
        //  sourceColor: '#00f',
        //  targetColor: '#0f0',
         opacity:1,
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
