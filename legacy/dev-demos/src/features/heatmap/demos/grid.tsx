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
        style: 'dark',
        pitch: 0,
        center: [127.5671666579043, 7.445038892195569],
        zoom: 2.632456779444394,
      }),
    });

    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json',
      )
        .then((res) => res.json())
        .then((data) => {
          const layer = new HeatmapLayer({})
            .source(data, {
              transforms: [
                {
                  type: 'grid',
                  size: 150000,
                  field: 'mag',
                  method: 'sum',
                },
              ],
            })
            .shape('square')
            .style({
              coverage: 1,
              angle: 0
            })
            .color(
              'count',
              [
                '#0B0030',
                '#100243',
                '#100243',
                '#1B048B',
                '#051FB7',
                '#0350C1',
                '#0350C1',
                '#0072C4',
                '#0796D3',
                '#2BA9DF',
                '#30C7C4',
                '#6BD5A0',
                '#A7ECB2',
                '#D0F4CA'
              ].reverse()
            );
          scene.addLayer(layer);

          scene.startAnimate();
          setTimeout(() => {
            layer.style({
              rampColors: {
                colors: [
                  '#FF4818',
                  '#F7B74A',
                  '#FFF598',
                  '#91EABC',
                  '#2EA9A1',
                  '#206C7C',
                ],
                positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
              },
            });
          }, 2000);
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
