import { LineLayer, Scene, Source } from '@antv/l7';
// @ts-ignore
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      renderer: process.env.renderer,
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
            offset: 0.8,
          },
          geometry: {
            type: 'MultiLineString',
            coordinates: [
              [
                [116.371436,39.942372],
                [121.467025,31.2327],
              ],
            ],
          },
        },
      ],
    };

    const geoData2 = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            offset: 0.3,
          },
          geometry: {
            type: 'LineString',
            coordinates: [
                [112.548194,37.786985],
                [102.92417,24.9848]
            ],
          },
        },
      ],
    };
    const source = new Source(geoData);
    const source2 = new Source(geoData2);

    // scene.on('zoom', e => console.log(e))
    //北京-上海
    const layer = new LineLayer({ blend: 'normal' })
      .source(source)
      .size(5)
      .shape('greatcircle')
      .color('#f00')
      .style({
        lineType:'dash',
        sourceColor: '#00f',
        targetColor: '#0f0',
        opacity: 1,
      });
    //太原-昆明
    const layer2 = new LineLayer({ blend: 'normal' })
      .source(source2)
      .size(5)
      .shape('greatcircle')
      .color('#f00')
      .style({
        opacity: 1,
      });
    scene.on('loaded', () => {
      scene.addLayer(layer);
      // scene.addLayer(layer2);
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
