// @ts-ignore
import { HeatmapLayer, Scene } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      renderer: process.env.renderer,
      map: new Map({
        style: 'light',
        pitch: 0,
        center: [114.07737552216226, 22.542656745583486],
        rotation: 0,
        zoom: 14,
      }),
    });
    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/513add53-dcb2-4295-8860-9e7aa5236699.json',
      )
        .then((res) => res.json())
        .then((data) => {
          const layer = new HeatmapLayer({})
            .source(data, {
              transforms: [
                {
                  type: 'hexagon',
                  size: 100,
                  field: 'h12',
                  method: 'sum',
                },
              ],
            })
            .size('sum', [0, 60])
            .shape('squareColumn')
            .style({
              opacity: 1,
            })
            .color(
              'sum',
              [
                '#094D4A',
                '#146968',
                '#1D7F7E',
                '#289899',
                '#34B6B7',
                '#4AC5AF',
                '#5FD3A6',
                '#7BE39E',
                '#A1EDB8',
                '#CEF8D6',
              ].reverse(),
            );
          scene.startAnimate();
          scene.addLayer(layer);
          scene.render();
        });
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
