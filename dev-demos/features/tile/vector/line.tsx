// @ts-ignore
import { Scene, LineLayer } from '@antv/l7';
// @ts-ignore
import { Mapbox } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'line',
      stencil: true,
      map: new Mapbox({
        center: [121.268, 30.3628],
        pitch: 0,
        style: 'blank',
        zoom: 4,
      }),
    });

    const layer = new LineLayer({
      featureId: 'COLOR',
      sourceLayer: 'ecoregions2', // woods hillshade contour ecoregions ecoregions2 city
    });
    layer
      .source(
        'http://ganos.oss-cn-hangzhou.aliyuncs.com/m2/rs_l7/{z}/{x}/{y}.pbf',
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

    scene.on('loaded', () => {
      scene.addLayer(layer);
      layer.on('click', (e) => {
        console.log(e);
      });
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
