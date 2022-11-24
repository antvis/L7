import { GaodeMap, IControlOption, Logo, Scale, Scene, Zoom } from '@antv/l7';
import React, { FunctionComponent, useEffect, useRef } from 'react';

const Demo: FunctionComponent = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

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
      function createTestControl(position: IControlOption['position']) {
        scene.addControl(
          new Zoom({
            position,
          }),
        );
        scene.addControl(
          new Scale({
            position,
          }),
        );

        scene.addControl(
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

      if (containerRef.current) {
        scene.addControl(
          new Logo({
            position: containerRef.current,
          }),
        );
      }
    });
  }, []);
  return (
    <>
      <div ref={containerRef} />
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
