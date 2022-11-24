// @ts-ignore
import { Scene, HeatmapLayer } from '@antv/l7';
// @ts-ignore
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
     
      map: new GaodeMap({
        center: [120.165, 30.26],
        pitch: 0,
        zoom: 2,
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
                  [125.15625000000001, 8.407168163601076],
                  [116.54296874999999, -21.289374355860424],
                  [156.26953125, -20.632784250388013],
                  [150.29296875, 2.1088986592431382],
                ],
              ],
              [
                [
                  [78.57421875, 46.92025531537451],
                  [51.67968749999999, 37.020098201368114],
                  [87.890625, 28.76765910569123],
                ],
              ],
            ],
          },
        },
      ],
    };

    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/7359a5e9-3c5e-453f-b207-bc892fb23b84.csv',
      )
        .then((res) => res.text())
        .then((data) => {
          const heatmapLayer = new HeatmapLayer({
            mask: true,
            maskInside: true,
            maskfence: maskData,
            maskColor: '#ff0',
            maskOpacity: 0.2,
          })
            // const heatmapLayer = new HeatmapLayer({ mask: true, maskInside: false })
            .source(data, {
              parser: {
                type: 'csv',
                x: 'lng',
                y: 'lat',
              },
              transforms: [
                {
                  type: 'grid', // grid
                  size: 20000,
                  field: 'v',
                  method: 'sum',
                },
              ],
            })
            .shape('circle')
            .style({
              coverage: 0.9,
              angle: 0,
            })
            .color(
              'count',
              [
                '#8C1EB2',
                '#8C1EB2',
                '#DA05AA',
                '#F0051A',
                '#FF2A3C',
                '#FF4818',
                '#FF4818',
                '#FF8B18',
                '#F77B00',
                '#ED9909',
                '#ECC357',
                '#EDE59C',
              ].reverse(),
            );
          scene.addLayer(heatmapLayer);
          // scene.addMask(mask1, heatmapLayer.id);
          // scene.addMask(mask2, heatmapLayer.id);
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
