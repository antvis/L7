// @ts-ignore
import { Scene, RasterLayer, MaskLayer } from '@antv/l7';
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
    );

    const layer = new RasterLayer({
      zIndex: 1,
      mask: true,
    }).source(
      'https://tiles{1-3}.geovisearth.com/base/v1/img/{z}/{x}/{y}?format=webp&tmsIds=w&token=b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788',
      {
        parser: {
          type: 'rasterTile',
          tileSize: 256,
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
