// @ts-ignore
import { Scene, RasterLayer,PolygonLayer } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';
import { RDBSource } from 'district-data';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new Map({
          center: [123, 30],
          zoom: 0,
          crs:'EPSG:4326'
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
      const source = new RDBSource({});
      source.getData({ level: 'province' }).then((data) => {
        const fill = new PolygonLayer({
          autoFit: true,
          zIndex: 2,
        })
          .source(data)
          .shape('fill')
          .color('name', [
            '#a6cee3',
            '#1f78b4',
            '#b2df8a',
            '#33a02c',
            '#fb9a99',
            '#e31a1c',
            '#fdbf6f',
            '#ff7f00',
            '#cab2d6',
            '#6a3d9a',
            '#ffff99',
            '#b15928',
          ])
          .active(false);
        scene.addLayer(fill);
        // scene.addLayer(layer);
      });
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
