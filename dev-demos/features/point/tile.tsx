import { Scene, RasterLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      pickBufferScale: 1.0,
      map: new GaodeMap({
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
      '//t3.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=f1f2021a42d110057042177cd22d856f',
      {
        parser: {
          type: 'rasterTile',
          tileSize: 256,
          //   zoomOffset: 0
          zoomOffset: 1,
        },
      },
    );

    scene.on('loaded', () => {
      scene.addLayer(layerTile);
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
