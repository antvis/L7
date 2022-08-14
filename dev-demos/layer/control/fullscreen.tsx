import {
  GaodeMap,
  PositionType,
  Scene,
  Fullscreen,
  createL7Icon,
} from '@antv/l7';
import React, { useState } from 'react';
// tslint:disable-next-line:no-duplicate-imports
import { FunctionComponent, useEffect } from 'react';

const POSITION_LIST = Object.values(PositionType);

const Demo: FunctionComponent = () => {
  const [fullscreen, setFullscreen] = useState<Fullscreen | null>(null);

  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        style: 'normal',
        center: [120, 30],
        pitch: 0,
        zoom: 6.45,
      }),
      // logoVisible: false,
    });

    scene.on('loaded', () => {
      const newFullscreen = new Fullscreen();
      setFullscreen(newFullscreen);
      scene.addControl(newFullscreen);
    });
  }, []);

  return (
    <>
      <button
        onClick={() => {
          const flag = Math.random() > 0.5;
          fullscreen?.setOptions({
            position: flag ? 'topleft' : 'topright',
            btnIcon: flag ? createL7Icon('l7-icon-quanping') : undefined,
            btnText: !flag ? '全屏' : undefined,
          });
        }}
      >
        设置 options
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
