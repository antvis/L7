// @ts-ignore
import { Scene, LineLayer } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
     
      map: new Map({
        center: [112, 30],
        zoom: 6,
      }),
    });

    const layer = new LineLayer({
      featureId: 'COLOR',
      sourceLayer: 'ecoregions2', // woods hillshade contour ecoregions ecoregions2 city
    });
    layer
      .source(
        'https://ganos.oss-cn-hangzhou.aliyuncs.com/m2/rs_l7/{z}/{x}/{y}.pbf',
        {
          parser: {
            type: 'mvt',
            tileSize: 256,
            zoomOffset: 0,
            maxZoom: 9,
            extent: [-180, -85.051129, 179, 85.051129],
          },
        },
      )
      // .shape('simple')
      .color('COLOR')
      .size(2)
      .select(true);
    scene.on('click', () => {
      console.log(scene.getZoom());
      layer.tileLayer.tileLayerService.tiles.map((t) => {
        console.log(t.layers[0].isVisible());
      });
    });

    scene.on('loaded', () => {
      scene.addLayer(layer);
      setTimeout(() => {
        layer
          .color('#f00')
          .size(1)
          .animate(true);
        scene.render();
      }, 3000);
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
