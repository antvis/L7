// @ts-ignore
import { PointLayer, Scene } from '@antv/l7';
// @ts-ignore
import { GaodeMap, Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      renderer: process.env.renderer,
      map: new (process.env.CI ? Map : GaodeMap)({
        // style: 'blank',
        center: [120.099658370018, 30.263445807542666],
        pitch: 0,
        zoom: 11,
      }),
    });
    scene.on('loaded', () => {
      // fetch(
      //   'https://gw.alipayobjects.com/os/rmsportal/BElVQFEFvpAKzddxFZxJ.txt',
      // )
      //   .then((res) => res.text())
      //   .then((data) => {
      const pointLayer = new PointLayer({ blend: 'additive' })
        .source({
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Point',
                coordinates: [120.099658370018, 30.263445807542666],
              },
            },
          ],
        })
        .size(40)
        .shape('dot')
        .color('#f00')
        .style({
          sizeScale: 0.5,
          opacity: 0.6,
          stroke: '#00f',
        });

      scene.addLayer(pointLayer);
      // });
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
