// @ts-ignore
import { Scene, RasterLayer } from '@antv/l7';
// @ts-ignore
import { GaodeMapV2 } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      stencil: true,
      map: new GaodeMapV2({
        center: [114.061677, 22.54899],
        zoom: 11,
      }),
    });

    const url =
      'https://pnr.sz.gov.cn/d-suplicmap/dynamap_1/rest/services/LAND_CERTAIN/MapServer/export?F=image&FORMAT=PNG32&TRANSPARENT=true&layers=show:1&SIZE=256,256&BBOX={bbox}&BBOXSR=4326&IMAGESR=3857&DPI=90';

    const layer = new RasterLayer({
      zIndex: 1,
    }).source(url, {
      parser: {
        type: 'rasterTile',
        tileSize: 256,
        zoomOffset: 1,
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
        height: '500px',
        position: 'relative',
      }}
    />
  );
};
