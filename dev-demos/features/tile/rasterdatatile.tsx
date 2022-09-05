import { Scene, RasterLayer } from '@antv/l7';
import { Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new Map({
        center: [130, 30],
        pitch: 0,
        style: 'normal',
        zoom: 1.5,
      }),
    });

   

    scene.on('loaded', () => {
      const layer = new RasterLayer({})
        .source(
          'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
          {
            parser: {
              type: 'rasterTile',
              tileSize: 256,

              zoomOffset: 0,
              updateStrategy: 'overlap',
            },
          },
        )
        .shape('dataImage')
        .style({
          clampLow: false,
          clampHigh: false,
          // opacity: 0.8,
          domain: [0, 8000],
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
          // float value = u_pixelConstant + ((r * u_pixelConstantR + g * u_pixelConstantG + b * u_pixelConstantB) * u_pixelConstantRGB);
          pixelConstant: 0.0,
          pixelConstantR: 256 * 20,
          pixelConstantG: 256,
          pixelConstantB: 1,
          pixelConstantRGB: 1,
        });

      scene.addLayer(layer);
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
