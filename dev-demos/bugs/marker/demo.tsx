// @ts-ignore
import { MarkerLayer, Marker, Scene } from '@antv/l7';
// @ts-ignore
import { GaodeMapV2 } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMapV2({
        style: 'normal',
        center: [120.104446, 30.261081],
        zoom: 19.056,
      }),
    });
    scene.on('loaded', () => {
      // 创建默认 marker
      const markerLayer = new MarkerLayer({
        cluster: true,
      });
      scene.addMarkerLayer(markerLayer);
      const marker = new Marker().setLnglat([
        120.1047383116185,
        30.261127905299425,
      ]);
      markerLayer.addMarker(marker);
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
