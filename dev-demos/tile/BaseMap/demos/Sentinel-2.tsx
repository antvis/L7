// @ts-ignore
import { Scene, RasterLayer, TileDebugLayer } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
     
      map: new Map({
        center: [113.270854, 23.141717],
        zoom: 11,
      }),
    });

    const url1 =
      'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857_512/default/GoogleMapsCompatible_512/{z}/{y}/{x}.jpg';
    const layer1 = new RasterLayer({
      zIndex: 1,
    }).source(url1, {
      parser: {
        type: 'rasterTile',
        tileSize: 512,
        updateStrategy: 'realtime',
      },
    });

    scene.on('loaded', () => {
      scene.addLayer(layer1);
      const debugerLayer = new TileDebugLayer();
      scene.addLayer(debugerLayer);
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
