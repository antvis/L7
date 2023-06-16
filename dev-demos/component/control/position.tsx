import { GaodeMap, IControlOption, Logo, Scale, Scene, Zoom } from '@antv/l7';
import React, { FunctionComponent, useEffect, useState } from 'react';

const Demo: FunctionComponent = () => {
  const [scene, setScene] = useState<Scene | null>(null);
  const [zoomList, setZoomList] = useState<Zoom[]>([]);

  useEffect(() => {
    const newScene = new Scene({
      id: 'map',
      map: new GaodeMap({
        style: 'dark',
        center: [120, 30],
        pitch: 0,
        zoom: 6.45,
      }),
      // logoVisible: false,
    });
    setScene(newScene);

    newScene.on('loaded', () => {
      function createTestControl(position: IControlOption['position']) {
        const zoom = new Zoom({
          position,
        });
        newScene.addControl(zoom);
        setZoomList((list) => [...list, zoom]);
        newScene.addControl(
          new Scale({
            position,
          }),
        );

        newScene.addControl(
          new Logo({
            position,
          }),
        );
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
          onClick={() => zoomList.forEach((zoom) => scene?.removeControl(zoom))}
        >
          Zoom 消失术
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
