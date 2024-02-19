import { CanvasLayer2, GaodeMap, Scene } from '@antv/l7';
import type { FunctionComponent } from 'react';
import React, { useEffect, useState } from 'react';

const Demo: FunctionComponent = () => {
  const [scene, setScene] = useState<Scene | null>(null);

  useEffect(() => {
    const newScene = new Scene({
      id: 'map',
      map: new GaodeMap({
        style: 'dark',
        center: [120.104697, 30.260704],
        pitch: 0,
        zoom: 15,
      }),
      // logoVisible: false,
    });

    newScene.on('loaded', () => {
      const canvasLayer = new CanvasLayer2({
        zIndex: 1,
        render: ({ canvas, ctx, container, utils }) => {
          ctx.clearRect(0, 0, container.width, container.height);
          ctx.fillStyle = 'red';
          const { x, y } = utils.lngLatToContainer([120.104697, 30.260704]);
          ctx.fillRect(x - 10, y - 10, 20, 20);
        },
      });
      newScene.addLayer(canvasLayer);
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
