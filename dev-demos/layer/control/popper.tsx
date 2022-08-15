import { GaodeMap, Scene, PopperControl } from '@antv/l7';
import { FunctionComponent, useEffect } from 'react';

class Popper extends PopperControl {}

const Demo: FunctionComponent = () => {
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
      scene.addControl(
        new Popper({
          position: 'rightcenter',
        }),
      );
      // function createTestControl(position: PositionName) {
      //   scene.addControl(
      //     new Zoom({
      //       position,
      //     }),
      //   );
      //   scene.addControl(
      //     new Scale({
      //       position,
      //     }),
      //   );
      //
      //   scene.addControl(
      //     new Logo({
      //       position,
      //     }),
      //   );
      // }
      //
      // createTestControl('topleft');
      // createTestControl('topright');
      // createTestControl('bottomleft');
      // createTestControl('bottomright');
      //
      // createTestControl('lefttop');
      // createTestControl('leftbottom');
      // createTestControl('righttop');
      // createTestControl('rightbottom');
      //
      // createTestControl('topcenter');
      // createTestControl('leftcenter');
      // createTestControl('rightcenter');
      // createTestControl('bottomcenter');
    });
  }, []);
  return (
    <div
      id="map"
      style={{
        height: '500px',
        position: 'relative',
      }}
    />
  );
};

export default Demo;
