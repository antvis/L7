import { GaodeMap, Scene, Zoom } from '@antv/l7';
import React, { useState } from 'react';
// tslint:disable-next-line:no-duplicate-imports
import { FunctionComponent, useEffect } from 'react';

const Demo: FunctionComponent = () => {
  const [control, setControl] = useState<Zoom | null>(null);

  useEffect(() => {
    const newScene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [120, 30],
        pitch: 0,
        zoom: 6.45,
      }),
    });

    newScene.on('loaded', () => {
      const newControl = new Zoom();
      newScene.addControl(newControl);
      setControl(newControl);
    });
  }, []);

  return (
    <>
      <button
        onClick={() => {
          control?.setOptions({
            zoomInText: '加',
            zoomInTitle: 'in',
            zoomOutText: '减',
            zoomOutTitle: 'out',
          });
        }}
      >
        更新配置
      </button>
      <button
        onClick={() => {
          control?.setOptions({
            zoomInText: undefined,
            zoomInTitle: undefined,
            zoomOutText: undefined,
            zoomOutTitle: undefined,
          });
        }}
      >
        还原配置
      </button>
      <button
        onClick={() => {
          control?.enable();
        }}
      >
        启用
      </button>
      <button
        onClick={() => {
          control?.disable();
        }}
      >
        禁用
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
