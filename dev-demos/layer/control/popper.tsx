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
          position: 'bottomcenter',
        }),
      );

      scene.addControl(
        new Popper({
          position: 'bottomleft',
        }),
      );

      scene.addControl(
        new Popper({
          position: 'bottomleft',
        }),
      );

      scene.addControl(
        new Popper({
          position: 'bottomright',
        }),
      );

      scene.addControl(
        new Popper({
          position: 'bottomright',
        }),
      );
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
