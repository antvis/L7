import { Marker, MarkerLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [105, 30.258134],
        zoom: 3,
      }),
    });

    fetch(
      'https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json'
    )
      .then(res => res.json())
      .then(nodes => {
        const markerLayer = new MarkerLayer();
        for (let i = 0; i < 400; i++) {
          const { coordinates } = nodes.features[i].geometry;
          const marker = new Marker().setLnglat({
            lng: coordinates[0],
            lat: coordinates[1]
          });
          markerLayer.addMarker(marker);
        }
        scene.addMarkerLayer(markerLayer);
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
