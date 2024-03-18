import { GaodeMap, MapTheme, Scene } from '@antv/l7';
import React, { useState } from 'react';
// tslint:disable-next-line:no-duplicate-imports
import type { FunctionComponent} from 'react';
import { useEffect } from 'react';

const Demo: FunctionComponent = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [zoom, setZoom] = useState(() => {
    return new MapTheme({
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

  return (
    <>
      <button
        onClick={() => {
          zoom.show();
        }}
      >
        展示
      </button>
      <button
        onClick={() => {
          zoom.hide();
        }}
      >
        隐藏
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
