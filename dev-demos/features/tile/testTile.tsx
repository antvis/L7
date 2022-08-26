
import { Scene, TileTestLayer } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      // stencil: true,
      map: new Mapbox({
        center: [121.268, 30.3628],
        pitch: 0,
        // style: 'blank',
        zoom: 4,
      }),
    });

    const layer = new TileTestLayer();
    layer
      .source(
        'http://ganos.oss-cn-hangzhou.aliyuncs.com/m2/rs_l7/{z}/{x}/{y}.pbf',
        {
          parser: {
            type: 'testTile',
            tileSize: 256,
            updateStrategy: 'overlap'
          },
        },
      )
      .shape('simple')

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
      id="map"
      style={{
        height: '500px',
        position: 'relative',
      }}
    />
  );
};
