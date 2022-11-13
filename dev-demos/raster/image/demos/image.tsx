// @ts-ignore
import { ImageLayer, Scene } from '@antv/l7';
// @ts-ignore
import { GaodeMapV2 } from '@antv/l7-maps';
import React, { useEffect } from 'react';
import * as GeoTIFF from 'geotiff';

export default () => {
  useEffect(() => {

    const scene = new Scene({
        id: 'map',
        map: new GaodeMapV2({
          style: 'light',
          center: [ 121.268, 30.3628 ],
          zoom: 10
        })
      });
      scene.on('loaded', () => {
        const layer = new ImageLayer({});
        layer.source(
          'https://gw.alipayobjects.com/zos/rmsportal/FnHFeFklTzKDdUESRNDv.jpg',
          {
            parser: {
              type: 'image',
              extent: [ 121.168, 30.2828, 121.384, 30.4219 ]
            }
          }
        );
        scene.addLayer(layer);
      })
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
