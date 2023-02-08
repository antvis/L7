// @ts-ignore
import { Earth, EarthLayer, Scene } from '@antv/l7';

import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new Earth({
        center: [120, 30],
        pitch: 0,
        zoom: 3,
      }),
    });

    const earthlayer = new EarthLayer()
      .source(
        'https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*3-3NSpqRqUoAAAAAAAAAAAAAARQnAQ',
        {
          parser: {
            type: 'image',
          },
        },
      )
      .shape('base')
      .style({
        globalOptions: {
          ambientRatio: 0.6, // 环境光
          diffuseRatio: 0.4, // 漫反射
          specularRatio: 0.1, // 高光反射
          // earthTime: 4.0
          earthTime: 0.1,
        },
      })
      .animate(true);

    const atomLayer = new EarthLayer()
      .color('#2E8AE6')
      .shape('atomSphere')
      .style({
        opacity: 1,
      });

    const bloomLayer = new EarthLayer().color('#fff').shape('bloomSphere');

    scene.on('loaded', () => {
      scene.addLayer(earthlayer);

      scene.addLayer(atomLayer);
      scene.addLayer(bloomLayer);

      earthlayer.setEarthTime(4.0);
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
