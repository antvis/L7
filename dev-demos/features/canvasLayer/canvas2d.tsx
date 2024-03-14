import { CanvasLayer, GaodeMap, PointLayer, Scene } from '@antv/l7';
import * as turf from '@turf/turf';
import type { FunctionComponent } from 'react';
import React, { useEffect } from 'react';

const POSITION = [120.104697, 30.260704] as [number, number];

const Demo: FunctionComponent = () => {
  useEffect(() => {
    const newScene = new Scene({
      id: 'map',
      map: new GaodeMap({
        style: 'normal',
        center: POSITION,
        pitch: 0,
        zoom: 15,
      }),
      // logoVisible: false,
    });

    newScene.on('loaded', () => {
      const canvasLayer = new CanvasLayer({
        zIndex: 100,
      });
      canvasLayer.draw(({ ctx, container, utils }) => {
        ctx.clearRect(0, 0, container.width, container.height);
        ctx.fillStyle = 'blue';
        const { x, y } = utils.lngLatToContainer(POSITION);
        const realSize = 36 * window.devicePixelRatio;
        ctx.fillRect(x - realSize / 2, y - realSize / 2, realSize, realSize);
      });
      newScene.addLayer(canvasLayer);

      const pointLayer = new PointLayer({});
      pointLayer
        .source(turf.featureCollection([turf.point(POSITION)]))
        .color('red')
        .shape('circle')
        .size(30);
      newScene.addLayer(pointLayer);

      pointLayer.on('click', (e) => {
        console.log('layer click', e);
      });
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
