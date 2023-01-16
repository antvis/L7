import { Scene } from '@antv/l7';
import { DrawPolygon } from '@antv/l7-draw';
import { Map } from '@antv/l7-maps';
import React, { useEffect, useState } from 'react';

const id = String(Math.random());

const Demo: React.FC = () => {
  const [, setLineDrawer] = useState<DrawPolygon | null>(null);

  useEffect(() => {
    const scene = new Scene({
      id,
      map: new Map({
        center: [120.151634, 30.244831],
        pitch: 0,
        style: 'dark',
        zoom: 10,
      }),
    });
    scene.on('mousedown', () => {
      console.log('mousedown');
    });

    scene.on('loaded', () => {
      const drawer = new DrawPolygon(scene, {
        // liveUpdate: true,
      });
      setLineDrawer(drawer);
      drawer.enable();
    });
  }, []);

  return (
    <div>
      <div id={id} style={{ height: 400, position: 'relative' }} />
    </div>
  );
};

export default Demo;
