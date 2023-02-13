import { GaodeMap, MapTheme, Scene } from '@antv/l7';
import React from 'react';
// tslint:disable-next-line:no-duplicate-imports
import { FunctionComponent, useEffect } from 'react';

const Demo: FunctionComponent = () => {
  useEffect(() => {
    const newScene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [120, 30],
        pitch: 0,
        zoom: 6.45,
        style: 'normal',
      }),
      // map: new GaodeMap({
      //   style: 'dark',
      //   center: [120, 30],
      //   pitch: 0,
      //   zoom: 6.45,
      // }),
      // map: new GaodeMap({
      //   style: 'dark',
      //   center: [120, 30],
      //   pitch: 0,
      //   zoom: 6.45,
      // }),
    });

    newScene.on('loaded', () => {
      const newControl = new MapTheme({
        // defaultValue: 'normal',
      });
      newScene.addControl(newControl);
    });
  }, []);

  return (
    <>
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
