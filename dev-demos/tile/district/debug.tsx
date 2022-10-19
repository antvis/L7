// @ts-ignore
import { Scene, TileDebugLayer } from '@antv/l7';
// @ts-ignore
import { GaodeMapV2 } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      stencil: true,
      map: new GaodeMapV2 ({
        center: [120, 30],
        // zoom: 12,
        zoom: 12,
      }),
    });

    const debugerLayer = new TileDebugLayer();
    scene.addLayer(debugerLayer);
  }, []);
  return (
    <div
      id="map"
      style={{
        backgroundColor: 'rgba(175,200,253)',
        height: '500px',
        position: 'relative',
      }}
    />
  );
};
