import { GaodeMap, Marker, Scene } from '@antv/l7';
import React, { useEffect, useState } from 'react';

export default () => {
  const [marker, setMarker] = useState<Marker | undefined>(undefined);

  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [121.438579, 31.246384],
        pitch: 0,
        zoom: 10,
        style: 'normal',
      }),
    });


    scene.on('loaded', () => {
      const marker = new Marker({
        draggable: true,
      });
      marker.setLnglat({
        lng: 121.438579,
        lat: 31.246384,
      });
      scene.addMarker(marker);
      setScene(scene);
      setMarker(marker);

      marker.on('dragstart', e => console.log('dragstart', e));
      marker.on('dragging', e => console.log('dragging', e));
      marker.on('dragend', e => console.log('dragend', e));
    });
  }, []);

  const enableDrag = () => {
    marker?.setDraggable(true);
  };

  const disableDrag = () => {
    marker?.setDraggable(false);
  };

  return (
    <>
      <button onClick={enableDrag}>启用拖拽</button>
      <button onClick={disableDrag}>禁用拖拽</button>
      <div id="map" style={{ height: 500, position: 'relative' }}></div>
    </>
  );
};
