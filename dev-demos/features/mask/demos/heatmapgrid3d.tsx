// @ts-ignore
import { HeatmapLayer, Scene } from '@antv/l7';
// @ts-ignore
import { GaodeMap, Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      renderer: process.env.renderer,
      map: new (process.env.CI ? Map : GaodeMap)({
        style: 'light',
        pitch: 56.499,
        center: [114.07737552216226, 22.542656745583486],
        rotation: 39.19,
        zoom: 12.47985,
      }),
    });
    scene.addImage(
      '00',
      'https://gw.alipayobjects.com/zos/basement_prod/604b5e7f-309e-40db-b95b-4fac746c5153.svg',
    );

    const maskData = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              [
                [
                  [114.11087036132811, 22.669778674332314],
                  [114.02847290039062, 22.59372606392931],
                  [114.11636352539062, 22.485912942320958],
                  [114.22622680664062, 22.51255695405145],
                ],
              ],
            ],
          },
        },
      ],
    };

    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/513add53-dcb2-4295-8860-9e7aa5236699.json',
      )
        .then((res) => res.json())
        .then((data) => {
          const layer = new HeatmapLayer({
            mask: true,
            maskInside: false,
            maskColor: '#0f0',
            maskfence: maskData,
            maskOpacity: 0.3,
          })
            .source(data, {
              transforms: [
                {
                  type: 'grid',
                  size: 100,
                  field: 'h12',
                  method: 'sum',
                },
              ],
            })
            .size('sum', [0, 600])
            .shape('cylinder')
            .style({
              coverage: 0.8,
              angle: 0,
              opacity: 1.0,
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
          scene.addLayer(layer);
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
