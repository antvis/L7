import { GaodeMap, PositionType, Scene, Zoom } from '@antv/l7';
import React, { useState } from 'react';
// tslint:disable-next-line:no-duplicate-imports
import type { FunctionComponent} from 'react';
import { useEffect } from 'react';

const POSITION_LIST = Object.values(PositionType);

const Demo: FunctionComponent = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [zoom, setZoom] = useState(() => {
    return new Zoom({
      position: 'topleft',
    });
  });

  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        style: 'dark',
        center: [120, 30],
        pitch: 0,
        zoom: 6.45,
      }),
      // logoVisible: false,
    });

    scene.on('loaded', () => {
      scene.addControl(zoom);
    });
  }, []);

  const onChangePosition = () => {
    const randomIndex = Math.floor(Math.random() * POSITION_LIST.length);
    zoom.setOptions({
      position: POSITION_LIST[randomIndex],
      className: `random-class-${Math.floor(Math.random() * 100)}`,
    });
  };

  return (
    <>
      <button onClick={onChangePosition}>设置随机Options</button>
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
