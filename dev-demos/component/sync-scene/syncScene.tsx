import { GaodeMap, Scene } from '@antv/l7';
import React from 'react';
// tslint:disable-next-line:no-duplicate-imports
import type { FunctionComponent } from 'react';
import { useEffect } from 'react';
import { syncScene } from './helper';

const Demo: FunctionComponent = () => {
  useEffect(() => {
    const newScene = new Scene({
      id: 'map',
      map: new GaodeMap({
        style: 'dark',
        center: [120.104697, 30.260704],
        pitch: 0,
        zoom: 15,
      }),
      // logoVisible: false,
    });
    const newScene1 = new Scene({
      id: 'map1',
      map: new GaodeMap({
        style: 'dark',
        center: [120.104697, 30.260704],
        pitch: 0,
        zoom: 15,
      }),
      // logoVisible: false,
    });
    syncScene([newScene, newScene1]);
  }, []);

  return (
    <div style={{ display: 'flex', height: '500px' }}>
      <div
        id="map"
        style={{
          width: '50%',
          height: '500px',
          position: 'relative',
        }}
      />
      <div
        id="map1"
        style={{
          width: '50%',
          height: '500px',
          position: 'relative',
        }}
      />
    </div>
  );
};

export default Demo;
