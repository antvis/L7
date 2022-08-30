### marker-layer

```tsx
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
    // addMarkers1(scene);
    addMarkers2(scene);
  }, []);

  const addMarkers1 = (scene) => {
    fetch(
      'https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json',
    )
      .then((res) => res.json())
      .then((nodes) => {
        const markerLayer = new MarkerLayer();
        for (let i = 0; i < 400; i++) {
          const { coordinates } = nodes.features[i].geometry;
          const marker = new Marker().setLnglat({
            lng: coordinates[0],
            lat: coordinates[1],
          });
          markerLayer.addMarker(marker);
        }
        scene.addMarkerLayer(markerLayer);
      });
  };

  const addMarkers2 = (scene) => {
    fetch(
      'https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json',
    )
      .then((res) => res.json())
      .then((nodes) => {
        const markerLayer = new MarkerLayer();
        for (let i = 0; i < 400; i++) {
          const { coordinates } = nodes.features[i].geometry;
          const el = document.createElement('label');
          el.textContent = coordinates[1];
          el.style.background = getColor(coordinates[1]);
          el.style.borderColor = getColor(coordinates[1]);

          const marker = new Marker({
            element: el,
          }).setLnglat({
            lng: coordinates[0],
            lat: coordinates[1],
          });
          markerLayer.addMarker(marker);
        }
        scene.addMarkerLayer(markerLayer);
      });
  };

  const getColor = (v) => {
    const colors = [
      '#ffffe5',
      '#f7fcb9',
      '#d9f0a3',
      '#addd8e',
      '#78c679',
      '#41ab5d',
      '#238443',
      '#005a32',
    ];
    return v > 50
      ? colors[7]
      : v > 40
      ? colors[6]
      : v > 30
      ? colors[5]
      : v > 20
      ? colors[4]
      : v > 10
      ? colors[3]
      : v > 5
      ? colors[2]
      : v > 0
      ? colors[1]
      : colors[0];
  };

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
```
