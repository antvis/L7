// @ts-ignore
import {
  LineLayer,
  Scene,
  // @ts-ignore
} from '@antv/l7';
// @ts-ignore
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [120.15, 30.246],
        pitch: 0,
        zoom: 13.5,
        style: 'dark',
        pitchEnable: false,
        rotation: -90,
      }),
    });

    scene.addImage(
      'arrow',
      'https://gw.alipayobjects.com/zos/bmw-prod/ce83fc30-701f-415b-9750-4b146f4b3dd6.svg',
    );

    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/40ef2173-df66-4154-a8c0-785e93a5f18e.json',
      )
        .then((res) => res.json())
        .then((data) => {
          const colors = ['#66c2a4', '#2ca25f', '#006d2c'];
          const layer = new LineLayer({})
            .source(data)
            .size(2.5)
            .shape('line')
            .texture('arrow')
            .color('', () => {
              return colors[Math.floor(Math.random() * colors.length)];
            })
            .animate({
              interval: 1, // 间隔
              duration: 1, // 持续时间，延时
              trailLength: 2, // 流线长度
            })
            .style({
              opacity: 0.6,
              lineTexture: true, // 开启线的贴图功能
              iconStep: 20, // 设置贴图纹理的间距
              borderWidth: 0.4, // 默认文 0，最大有效值为 0.5
              borderColor: '#fff', // 默认为 #ccc
            });
          scene.addLayer(layer);
        });
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
