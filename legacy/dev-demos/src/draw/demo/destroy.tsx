import { Scene } from '@antv/l7';
import { DrawPolygon } from '@antv/l7-draw';
import { Map } from '@antv/l7-maps';
import { Button, Modal } from 'antd';
import React, { useEffect, useState } from 'react';

const id = String(Math.random());

const Demo: React.FC = () => {
  // const [circleDrawer, setCircleDrawer] = useState<DrawCircle | null>(null);

  useEffect(() => {
    const scene = new Scene({
      id,
      map: new Map({
        center: [120.151634, 30.244831],
        pitch: 0,
        zoom: 10,
      }),
    });
    let drawPolygon: DrawPolygon | undefined;
    scene.on('loaded', () => {
     
      // 实例化 DrawControl
      drawPolygon = new DrawPolygon(scene, {
        distanceOptions: {},
      });
    //   scene.addLayer(layer1);
    //   scene.addLayer(layer2);
      drawPolygon.enable();
    });

    return () => {
    //   drawPolygon?.destroy();
      scene.destroy();
    };
  }, []);

  return (
    <div>
      <div id={id} style={{ height: 400, position: 'relative' }} />
    </div>
  );
};

const Default = () => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Modal
        visible={visible}
        destroyOnClose
        onCancel={() => setVisible(false)}
      >
        <Demo />
      </Modal>
      <Button onClick={() => setVisible(true)}>展示按钮</Button>
    </>
  );
};

export default Default;