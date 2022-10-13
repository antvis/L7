// @ts-ignore
import { Scene, PointLayer } from '@antv/l7';
// @ts-ignore
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      stencil: true,
      map: new GaodeMap({
        center: [120.165, 30.26],
        pitch: 0,
        zoom: 15,
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
                  [120.16, 30.259660295442085],
                  [120.16, 30.25313608393673],
                  [120.17, 30.253729211980726],
                  [120.17, 30.258474107402265],
                ],
              ],
            ],
          },
        },
      ],
    };

    scene.on('loaded', () => {
      let point1 = new PointLayer({
        zIndex: 1,
        mask: true,
        maskInside: false,
        maskfence: maskData,
      })
        .source(
          [
            {
              name: 'n5',
              lng: 120.17,
              lat: 30.255,
            },
          ],
          {
            parser: {
              type: 'json',
              x: 'lng',
              y: 'lat',
            },
          },
        )
        .shape('simple')
        .size(30)
        .style({
          opacity: 0.6,
        })
        .active(true);

      let point2 = new PointLayer({
        zIndex: 3,
        mask: true,
        maskInside: true,
        maskfence: maskData,
        maskColor: '#f00',
        maskOpacity: 0.5,
      })
        .source(
          [
            {
              name: 'n4',
              lng: 120.17,
              lat: 30.2565,
            },
          ],
          {
            parser: {
              type: 'json',
              x: 'lng',
              y: 'lat',
            },
          },
        )
        .shape('simple')
        .size(30)
        .color('#0f0')
        .active(true);

      scene.addLayer(point1);
      scene.addLayer(point2);

      // scene.addLayer(mask1);

      setTimeout(() => {
        // scene.removeLayer(mask1);

        point1.style({ mask: false });
        point2.style({ mask: false });

        // scene.removeLayer(mask1);

        scene.render();
      }, 2000);
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
