import { GaodeMap, Scene } from '@antv/l7';
import React, { useState } from 'react';
// tslint:disable-next-line:no-duplicate-imports
import { FunctionComponent, useEffect } from 'react';

const Demo: FunctionComponent = () => {
  const [scene, setScene] = useState<Scene | null>(null);

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

    newScene.on('loaded', () => {
      setScene(newScene);

      newScene.on('selectstart', (...params) => {
        // tslint:disable-next-line:no-console
        console.log('selectstart', ...params);
      });

      newScene.on('selecting', (...params) => {
        // tslint:disable-next-line:no-console
        console.log('selecting', ...params);
      });

      newScene.on('selectend', (...params) => {
        // tslint:disable-next-line:no-console
        console.log('selectend', ...params);
      });
    });
  }, []);

  return (
    <>
      <div>
        <button
          onClick={() => {
            scene?.enableBoxSelect(true);
          }}
        >
          开始框选
        </button>
        <button
          onClick={() => {
            scene?.disableBoxSelect();
          }}
        >
          结束框选
        </button>
      </div>
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
