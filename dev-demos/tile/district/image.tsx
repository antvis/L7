// @ts-ignore
import {
    Scene,
    RasterLayer,
  } from '@antv/l7';
  // @ts-ignore
  import { Map } from '@antv/l7-maps';
  import React, { useEffect } from 'react';
  
  export default () => {
    useEffect(() => {

  
      const scene = new Scene({
        id: 'map',
        stencil: true,
        map: new Map({
          center: [112, 30],
          // zoom: 12,
          zoom: 3,
        }),
      });
  
      const layer = new RasterLayer({})
      .source(
        'http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
        {
          parser: {
            type: 'rasterTile',
            tileSize: 256,
            updateStrategy: 'overlap',
          },
        },
      )
  
      scene.on('loaded', () => {
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
  