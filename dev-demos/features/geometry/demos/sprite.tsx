// @ts-ignore
import { GeometryLayer, Scene } from '@antv/l7';
// @ts-ignore
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      renderer: 'device',
      map: new GaodeMap({
        // map: new GaodeMap({
        // map: new Mapbox({
        pitch: 40,
        style: 'dark',
        center: [120, 30],
        zoom: 6,
      }),
    });

    scene.on('loaded', () => {
      const layer = new GeometryLayer()
        // .source([{x: 0, y: 0}], {parser: {type: 'json', x: 'x', y: 'y'}})
        .shape('sprite')
        .size(20)
        .style({
          // opacity: 0.3,
          mapTexture:
            'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*zLQwQKBSagYAAAAAAAAAAAAAARQnAQ', // snow
          // mapTexture: 'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*w2SFSZJp4nIAAAAAAAAAAAAAARQnAQ', // rain
          // mapTexture: 'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*bq1cS7ADjR4AAAAAAAAAAAAAARQnAQ', // blub
          center: [120, 30],
          // spriteAnimate: 'up',
          spriteCount: 60,
          spriteRadius: 10,
          spriteTop: 2500000,
          spriteUpdate: 10000,
          spriteScale: 0.8,

          // spriteTop: 1000,
          // spriteUpdate: 5,
          // spriteBottom: -10,
          // spriteScale: 0.6,
        })
        .active(true)
        .color('#f00');

      scene.addLayer(layer);
      scene.startAnimate();
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
