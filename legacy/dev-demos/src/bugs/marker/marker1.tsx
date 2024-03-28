// @ts-ignore
import { Marker, Scene } from '@antv/l7';
// @ts-ignore
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        style: 'normal',
        center: [120.104446, 30.261081],
        zoom: 19.056,
      }),
    });
    scene.on('loaded', () => {
      // 创建默认 marker
    //   const markerLayer = new MarkerLayer();
    //   scene.addMarkerLayer(markerLayer);
      const marker = new Marker().setLnglat([
        120.1047383116185, 30.261127905299425,
      ]);
      marker.on('click', () => {
        alert('click');
      })
      scene.addMarker(marker);
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
