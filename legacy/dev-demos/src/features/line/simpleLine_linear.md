### Line - simpleLinear
```tsx
// @ts-ignore
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
import { Map,GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      renderer: process.env.renderer,
      map: new GaodeMap({
        center: [105, 32],
        zoom: 4,
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
                [110, 27.994401411046148],
                [110, 25],
                [100, 25],
              ],
              [
                [108.544921875, 37.71859032558816],
                [112.412109375, 32.84267363195431],
                [115, 32.84267363195431],
                [115, 35],
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
                [110, 30],
                [120, 30],
                [120, 40],
              ],
            ],
          },
        },
      ],
    };
    const source = new Source(geoData);
    const layer = new LineLayer({ blend: 'normal' })
      .source(source)
      .size(10)
      .shape('simple')
      .color('#f00')
      .style({
        lineType:'dash',
        dashArray:[0.5,0.5],
        opacity:1,
        sourceColor: '#f00',
        targetColor: '#0f0',
      });

    scene.on('loaded', () => {
      scene.addLayer(layer);
      scene.startAnimate();
    
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
```