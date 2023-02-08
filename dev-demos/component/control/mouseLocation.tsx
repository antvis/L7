import { GaodeMap, MouseLocation, Scene } from '@antv/l7';
import React from 'react';
// tslint:disable-next-line:no-duplicate-imports
import { FunctionComponent, useEffect } from 'react';

const Demo: FunctionComponent = () => {
  useEffect(() => {
    const newScene = new Scene({
      id: 'map',
      map: new GaodeMap({
        style: 'normal',
        center: [120, 30],
        pitch: 0,
        zoom: 6.45,
      }),
      // logoVisible: false,
    });

    newScene.on('loaded', () => {
      const newControl = new MouseLocation({});
      newScene.addControl(newControl);
      // const zoom = new Zoom({
      //   position: 'topright',
      // });
      // newScene.addControl(zoom);
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
