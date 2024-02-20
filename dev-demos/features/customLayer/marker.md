### marker

```tsx
import { Marker, PointLayer, PolygonLayer, Popup, Scene } from '@antv/l7';
import { GaodeMap, Mapbox,TMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map-marker',
      map: new TMap({
        center: [120.184824, 30.248341],
        pitch: 0,
        zoom: 18,
      }),
    });

    const popup = new Popup({
      offsets: [0, 20],
    }).setHTML('<h1 onclick= alert("12223")>111111111111</h1>');

    const el = document.createElement('h1');
    el.innerHTML = '<h1>111111111111</h1>';

    // const marker = new Marker({
    //   element: el,
    //   // offsets: [0, -20],
    // })
    const marker = new Marker()
      .setLnglat({
        lng: 120.184824,
        lat: 30.248341,
      })
      .setPopup(popup);

    scene.addMarker(marker);

    const arr = [
      {
        lng: 120.184824,
        lat: 30.248341,
        count: 40,
      },
    ];

    scene.on('loaded', () => {
      // @ts-ignore
      // marker.on('click', (e) => {
      // });
      // const marker1 = new AMap.Marker({
      //   map: scene.map,
      //   position: [120.184824, 30.248341],
      //   shadow: '#000',
      //   label: {
      //     content: '站点',
      //     direction: 'top',
      //   },
      // });
      // marker1.on('click', () => {
      //  console.log(this.scene.getZoom());
      //   console.log('选中的点', 1111);
      // });
      // this.scene = scene;
    });
  }, []);

  return (
    <div
      id="map-marker"
      style={{
        height: '500px',
        position: 'relative',
      }}
    />
  );
};
```
