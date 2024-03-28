import type {
  IControlOption} from '@antv/l7';
import {
  GaodeMap,
  Logo,
  MouseLocation,
  Scale,
  Scene,
} from '@antv/l7';
import type { FunctionComponent} from 'react';
import React, { useEffect, useState } from 'react';

const Demo: FunctionComponent = () => {
  const [scene, setScene] = useState<Scene | null>(null);
  const [controlList, setControlList] = useState<MouseLocation[]>([]);

  useEffect(() => {
    const newScene = new Scene({
      id: 'map',
      map: new GaodeMap({
        style: 'dark',
        center: [120, 30],
        pitch: 0,
        zoom: 6.45,
      }),
      logoVisible: false,
    });
    setScene(newScene);

    newScene.on('loaded', () => {
      function createTestControl(position: IControlOption['position']) {
        newScene.addControl(
          new Logo({
            position,
          }),
        );
        newScene.addControl(
          new Scale({
            position,
          }),
        );
        const mouseLocation = new MouseLocation({
          position,
        });
        newScene.addControl(mouseLocation);
        setControlList((list) => [...list, mouseLocation]);
      }

      createTestControl('topleft');
      createTestControl('topright');
      createTestControl('bottomleft');
      createTestControl('bottomright');

      createTestControl('lefttop');
      createTestControl('leftbottom');
      createTestControl('righttop');
      createTestControl('rightbottom');

      createTestControl('topcenter');
      createTestControl('leftcenter');
      createTestControl('rightcenter');
      createTestControl('bottomcenter');

      // if (containerRef.current) {
      //   scene.addControl(
      //     new Logo({
      //       position: containerRef.current,
      //     }),
      //   );
      // }
    });
  }, []);
  return (
    <>
      <div>
        <button
          onClick={() =>
            controlList.forEach((zoom) => scene?.removeControl(zoom))
          }
        >
          MouseLocation 消失术
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
