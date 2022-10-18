// @ts-ignore
import { Scene, TileDebugLayer } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      stencil: true,
      map: new Map({
        center: [60, 30],
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
