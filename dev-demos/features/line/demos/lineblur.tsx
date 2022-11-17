// @ts-ignore
import { LineLayer, Scene } from '@antv/l7';
// @ts-ignore
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [122, 28],
        zoom: 5,
        style: 'dark',
      }),
    });

    fetch(
      'https://gw.alipayobjects.com/os/bmw-prod/55304d8d-4cb0-49e0-9d95-9eeacbe1c80a.json',
    )
      .then((res) => res.json())
      .then((data) => {
        const blurLine = new LineLayer()
          .source(data)
          .size(5)
          .style({
            opacity: 0.8,
            sourceColor: '#f00',
            targetColor: '#ff0',
            linearDir: 'horizontal',
          });
        scene.addLayer(blurLine);
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
