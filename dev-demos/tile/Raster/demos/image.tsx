// @ts-ignore
import { Scene, RasterLayer, PolygonLayer } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
     
      map: new Map({
        center: [112, 30],
        // zoom: 12,
        zoom: 3,
      }),
    });

    const mask = new PolygonLayer({
      visible: false,
      sourceLayer: 'ecoregions2', // woods hillshade contour ecoregions ecoregions2 city
    }).source(
      'https://ganos.oss-cn-hangzhou.aliyuncs.com/m2/rs_l7/{z}/{x}/{y}.pbf',
      {
        parser: {
          type: 'mvt',
          tileSize: 256,
          maxZoom: 9,
          extent: [-180, -85.051129, 179, 85.051129],
        },
      },
    ).shape('fill').color('red');

    const layer = new RasterLayer({
      zIndex: 1,
      maskLayers: [mask],
    }).source(
      // 'https://www.google.cn/maps/vt?lyrs=s@820&gl=cn&x={x}&y={y}&z={z}',
      'http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
      {
        parser: {
          type: 'rasterTile',
          tileSize: 256,
          updateStrategy: 'overlap',
        },
      },
    );

    scene.on('loaded', () => {
      scene.addLayer(mask);
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
