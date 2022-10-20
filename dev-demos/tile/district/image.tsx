// @ts-ignore
import { Scene, RasterLayer, MaskLayer } from '@antv/l7';
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

    const mask = new MaskLayer({
      sourceLayer: 'ecoregions2', // woods hillshade contour ecoregions ecoregions2 city
    }).source(
        'http://ganos.oss-cn-hangzhou.aliyuncs.com/m2/rs_l7/{z}/{x}/{y}.pbf',
        {
          parser: {
            type: 'mvt',
            tileSize: 256,
            maxZoom: 9,
            extent: [-180, -85.051129, 179, 85.051129],
          },
        },
      )

    const layer = new RasterLayer({
      zIndex: 1,
      mask: true
    }).source(
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
        height: '500px',
        position: 'relative',
      }}
    />
  );
};
