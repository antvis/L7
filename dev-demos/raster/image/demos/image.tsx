// @ts-ignore
import { ImageLayer,RasterLayer, Scene } from '@antv/l7';
// @ts-ignore
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';
import * as GeoTIFF from 'geotiff';

export default () => {
  useEffect(() => {

    const scene = new Scene({
        id: 'map',
        map: new GaodeMap({
          style: 'light',
          center: [ 121.268, 30.3628 ],
          zoom: 11
        })
      });

      scene.on('loaded', () => {
     const url1 =
        'https://tiles{1-3}.geovisearth.com/base/v1/img/{z}/{x}/{y}?format=webp&tmsIds=w&token=b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788';
      const layer1 = new RasterLayer({
        zIndex: 0,
      }).source(url1, {
        parser: {
          type: 'rasterTile',
          tileSize: 256,
        },
      });
      scene.addLayer(layer1);
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
        height: '60vh',
        position: 'relative',
      }}
    />
  );
};
