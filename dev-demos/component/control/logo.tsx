import { GaodeMap, Logo, Scene } from '@antv/l7';
import React from 'react';
// tslint:disable-next-line:no-duplicate-imports
import { FunctionComponent, useEffect } from 'react';

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
      logoVisible: false,
    });

    scene.on('loaded', () => {
      const logo1 = new Logo({
        position: 'leftbottom',
      });
      scene.addControl(logo1);

      setTimeout(() => {
        logo1.setOptions({
          img: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
          href: '',
          style: 'height: 40px; width: 40px;',
        });
      }, 1000);

      const logo2 = new Logo({
        position: 'rightbottom',
        href: undefined,
      });
      scene.addControl(logo2);

      const logo3 = new Logo({
        position: 'topright',
        style: 'height: 40px; width: 40px;',
        img: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
        href: '',
      });
      scene.addControl(logo3);

      const logo4 = new Logo({
        position: 'topleft',
        style: 'height: 40px; width: 40px;',
        img: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
        href: 'https://ant.design/index-cn',
      });
      scene.addControl(logo4);
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
