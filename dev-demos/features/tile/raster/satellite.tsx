import { Scene, RasterLayer } from '@antv/l7';
import { GaodeMapV2 } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      pickBufferScale: 1.0,
      map: new GaodeMapV2({
        center: [121.268, 30.3628],
        pitch: 0,
        style: 'blank',
        zoom: 10,
      }),
    });

    const layerTile = new RasterLayer({
      zIndex: 1,
    });
    layerTile.source(
      '//t{0-4}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=f1f2021a42d110057042177cd22d856f',
      {
        parser: {
          type: 'rasterTile',
          tileSize: 256,
  
        },
      },
    );

    const layerTile2 = new RasterLayer({
      zIndex: 0,
    });
    layerTile2.source(
      'http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
      {
        parser: {
          type: 'rasterTile',
          tileSize: 256,
        },
      },
    );

    scene.on('loaded', () => {
      scene.addLayer(layerTile);
      scene.addLayer(layerTile2);
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
