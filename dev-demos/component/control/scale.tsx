import { GaodeMap, Scale, Scene } from '@antv/l7';
import React, { useState } from 'react';
// tslint:disable-next-line:no-duplicate-imports
import { FunctionComponent, useEffect } from 'react';

const Demo: FunctionComponent = () => {
  const [control, setControl] = useState<Scale | null>(null);

  useEffect(() => {
    const newScene = new Scene({
      id: 'map',
      // map: new GaodeMap({
      //   center: [120, 30],
      //   pitch: 0,
      //   zoom: 6.45,
      // }),
      map: new GaodeMap({
        center: [120, 30],
        pitch: 0,
        zoom: 6.45,
        style: 'normal',
      }),
    });

    newScene.on('loaded', () => {
      const scale = new Scale({
        metric: true,
        position: 'rightbottom',
        // imperial: true,
      });
      // const zoom = new Zoom({
      //   position: 'rightbottom',
      // });
      newScene.addControl(scale);
      // newScene.addControl(zoom);
      setControl(scale);
    });
  }, []);

  return (
    <>
      <button
        onClick={() => {
          control?.setOptions({
            imperial: true,
            metric: false,
          });
        }}
      >
        更新配置
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
