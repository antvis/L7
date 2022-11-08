import { GaodeMap, Scene, Zoom } from '@antv/l7';
import React, { useState } from 'react';
// tslint:disable-next-line:no-duplicate-imports
import { FunctionComponent, useEffect } from 'react';

const Demo: FunctionComponent = () => {
  const [scene, setScene] = useState<Scene | null>(null);
  const [zoom, setZoom] = useState<Zoom | null>(null);

  useEffect(() => {
    const newScene = new Scene({
      id: 'map',
      map: new GaodeMap({
        style: 'dark',
        center: [120, 30],
        pitch: 0,
        zoom: 6.45,
      }),
      // logoVisible: false,
    });

    newScene.on('loaded', () => {
      setScene(newScene);
    });
  }, []);

  return (
    <>
      <button
        disabled={!!zoom}
        onClick={() => {
          if (!zoom) {
            const newZoom = new Zoom();
            scene?.addControl(newZoom);
            setZoom(newZoom);
          }
        }}
      >
        插入
      </button>
      <button
        disabled={!zoom}
        onClick={() => {
          if (zoom) {
            scene?.removeControl(zoom);
            setZoom(null);
          }
        }}
      >
        移除
      </button>
      <div
        id="map"
        style={{
          height: '500px',
          position: 'relative',
        }}
      />
    </>
  );
};

export default Demo;
