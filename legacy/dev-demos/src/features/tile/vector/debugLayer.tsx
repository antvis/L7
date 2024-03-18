import { Scene, TileDebugLayer } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'test',
      //
      map: new Mapbox({
        center: [121.268, 30.3628],
        pitch: 0,
        // style: 'blank',
        zoom: 4,
      }),
    });

    const layer = new TileDebugLayer();

    scene.on('loaded', () => {
      scene.addLayer(layer);
    });
  }, []);
  return (
    <div
      id="test"
      style={{
        height: '500px',
        position: 'relative',
      }}
    />
  );
};
