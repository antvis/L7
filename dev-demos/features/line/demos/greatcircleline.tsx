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
      .size(1)
      .shape('greatcircle')
      .color('#f00')
      .style({
        // thetaOffset: 'offset'
        // segmentNumber: 10,
        // thetaOffset: 0.5,
      });

    source.on('update', () => {
      // const midPoints = lineAtOffset(source, 0.3, 'arc', 'offset');
      const midPoints = lineAtOffset(source, {
        offset: 2 / 30,
        shape: 'greatcircle',
        // thetaOffset: 0.5,
        mapVersion: scene.map.version,
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
        // offset: 12.681/30,
        // offset: 12/31,
        // offset: 48/186,
        offset: 0.3,
        shape: 'greatcircle',
        // thetaOffset: 0.5,
        mapVersion: scene.map.version,
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
