// @ts-ignore
import { Scene, RasterLayer } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new Map({
          center: [123, 30],
          zoom: 0,
      }),
    });

    const url =
      'http://t0.tianditu.gov.cn/img_c/wmts?tk=b72aa81ac2b3cae941d1eb213499e15e&service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=c&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles';

    const layer = new RasterLayer({
      zIndex: 1,
    }).source(url, {
      parser: {
        type: 'rasterTile',
        tileSize: 256,
        zoomOffset: 0,
      },
    });

    scene.on('loaded', () => {
      scene.addLayer(layer);
    });
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
