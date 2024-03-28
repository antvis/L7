// @ts-ignore
import { Scene, GeometryLayer } from '@antv/l7';
// @ts-ignore
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      renderer: process.env.renderer,
      map: new GaodeMap({
        pitch: 80,
        style: 'dark',
        center: [0, 0],
        zoom: 5,
      }),
    });

    scene.on('loaded', () => {
      const img = new Image();
      img.crossOrigin = '';
      img.onload = () => {
        let billboard = new GeometryLayer().shape('billboard').style({
          width: 90,
          height: 30,
          canvasWidth: 360,
          canvasHeight: 120,
          center: [120, 30],
          drawCanvas: (canvas: HTMLCanvasElement) => {
            let { width, height } = canvas;
            let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
            ctx.globalAlpha = 0.5;
            ctx.drawImage(
              img,
              0,
              0,
              img.width,
              img.height,
              0,
              0,
              width,
              height,
            );
            ctx.globalAlpha = 1;
            ctx.fillStyle = '#0ff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = '36px Georgia';
            ctx.fillText('Hello World! 蚂蚁', width / 2, height / 2);
          },
          raisingHeight: 100,
        });
        billboard.active({
          color: '#0ff',
          mix: 0.5,
        });
        scene.startAnimate();
        scene.addLayer(billboard);
               };
      img.src =
        'https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*zMw0T6gEIZYAAAAAAAAAAAAAARQnAQ';
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
