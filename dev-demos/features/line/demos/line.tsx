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
      .shape('line')
      .color('#f00')
      .style({});

    source.on('update', () => {
      console.log(source);
      const midPoints = lineAtOffset(source, {
        offset: 0.1,
        shape: 'line',
      });
      const point = new PointLayer({ blend: 'normal', zIndex: 1 })
        .source(midPoints, {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat',
          },
        })
        .shape('circle')
        .size(10)
        .color('#ff0');
      scene.addLayer(point);
    });

    (async () => {
      // const midPoints = await lineAtOffsetAsyc(source, 0.1, 'arc', 'offset');
      const midPoints = await lineAtOffsetAsyc(source, {
        offset: 0.5,
        shape: 'line',
        featureId: 1,
      });
      const point = new PointLayer({ blend: 'normal', zIndex: 1 })
        .source(midPoints, {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat',
          },
        })
        .shape('circle')
        .size(5)
        .color('#0f0')
        .style({
          opacity: 0.8,
        });
      scene.addLayer(point);
    })();

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
