// @ts-ignore
import { Scene, RasterLayer, MaskLayer } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'line',
     
      map: new Map({
        center: [121.268, 30.3628],
        pitch: 0,
        style: 'blank',
        zoom: 4,
      }),
    });

    const layer = new MaskLayer({
      color: '#f00',
      
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
      )

      const satellite = new RasterLayer({
        mask: true
      })
        .source(
          'http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
          {
            parser: {
              type: 'rasterTile',
              tileSize: 256,
              zoomOffset: 0,
              updateStrategy: 'overlap',
            },
          },
        )

    scene.on('loaded', () => {
      scene.addLayer(layer);
      scene.addLayer(satellite);
    });
  }, []);
  return (
    <div
      id="line"
      style={{
        height: '500px',
        position: 'relative',
      }}
    />
  );
};
