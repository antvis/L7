### markerLayer

```tsx
import { Marker, MarkerLayer, Scene } from '@antv/l7';
import { GaodeMap, GaodeMapV2, Mapbox } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const gaodeV1Scene = new Scene({
      id: 'gaodeV1',
      map: new GaodeMap({
        center: [105, 30.258134],
        zoom: 2,
      }),
    });
    // const gaodeV2Scene = new Scene({
    //   id: 'gaodeV2',
    //   map: new GaodeMapV2({
    //     center: [105, 30.258134],
    //     zoom: 3,
    //   }),
    // });
    const mapboxScene = new Scene({
      id: 'mapbox',
      map: new Mapbox({
        center: [120, 30],
        zoom: 2,
      }),
    });

    addMarkers(gaodeV1Scene);
    // addMarkers(gaodeV2Scene);
    addMarkers(mapboxScene);
  }, []);

  const addMarkers = (s) => {
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
        s.addMarkerLayer(markerLayer);
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
    <>
      <h2>400 个节点测试</h2>

      <h4>高德V1</h4>
      <div id="gaodeV1" style={{ height: '500px', position: 'relative' }} />

      <h4>Mapbox</h4>
      <div id="mapbox" style={{ height: '500px', position: 'relative' }} />
    </>
  );
};
```
