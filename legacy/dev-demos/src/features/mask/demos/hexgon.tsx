// @ts-ignore
import { HeatmapLayer, PolygonLayer, Scene } from '@antv/l7';
// @ts-ignore
import { GaodeMap, Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      renderer: process.env.renderer,
      map: new (process.env.CI ? Map : GaodeMap)({
        center: [120.165, 30.26],
        pitch: 0,
        zoom: 6,
        style: 'dark',
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
                  [117.20214843749999, 30.29701788337205],
                  [119.66308593749999, 30.050076521698735],
                  [117.20214843749999, 29.286398892934763],
                ],
              ],
              [
                [
                  [119.13574218749999, 28.188243641850313],
                  [119.64111328125, 29.19053283229458],
                  [120.60791015625, 27.955591004642553],
                ],
              ],
            ],
          },
        },
      ],
    };

    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/a1a8158d-6fe3-424b-8e50-694ccf61c4d7.csv',
      )
        .then((res) => res.text())
        .then((data) => {
          const polygonLayer = new PolygonLayer()
            .source(maskData)
            .shape('fill')
            .color('#f00')
            .style({ opacity: 0.5 });
          const layer = new HeatmapLayer({
            maskLayers: [polygonLayer],
          })
            .source(data, {
              parser: {
                type: 'csv',
                x: 'lng',
                y: 'lat',
              },
              transforms: [
                {
                  type: 'hexagon',
                  size: 2500,
                  field: 'v',
                  method: 'sum',
                },
              ],
            })
            .size('sum', (sum) => {
              return sum * 200;
            })
            .shape('hexagonColumn')
            .style({
              coverage: 0.8,
              angle: 0,
              opacity: 1.0,
            })
            .color('sum', [
              '#094D4A',
              '#146968',
              '#1D7F7E',
              '#289899',
              '#34B6B7',
              '#4AC5AF',
              '#5FD3A6',
              '#7BE39E',
              '#A1EDB8',
              '#C3F9CC',
              '#DEFAC0',
              '#ECFFB1',
            ]);
          scene.addLayer(layer);
          scene.addLayer(polygonLayer);
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
