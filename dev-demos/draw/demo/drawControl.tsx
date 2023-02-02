import { RasterLayer, Scene } from '@antv/l7';
import { DrawControl } from '@antv/l7-draw';
import { Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';

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
    scene.on('loaded', () => {
      const url1 =
        'https://tiles{1-3}.geovisearth.com/base/v1/img/{z}/{x}/{y}?format=webp&tmsIds=w&token=b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788';
      const url2 =
        'https://tiles{1-3}.geovisearth.com/base/v1/cia/{z}/{x}/{y}?format=png&tmsIds=w&token=b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788';
      const layer1 = new RasterLayer({
        zIndex: -10,
      }).source(url1, {
        parser: {
          type: 'rasterTile',
          tileSize: 256,
        },
      });

      const layer2 = new RasterLayer({
        zIndex: -9,
      }).source(url2, {
        parser: {
          type: 'rasterTile',
          tileSize: 256,
        },
      });
      // 实例化 DrawControl
      const drawControl = new DrawControl(scene, {
        defaultActiveType: 'point',
      });
      scene.addLayer(layer1);
      scene.addLayer(layer2);

      // 将 Control 添加至地图中
      scene.addControl(drawControl);
    });
  }, []);

  return (
    <div>
      <div id={id} style={{ height: 400, position: 'relative' }} />
    </div>
  );
};

export default Demo;
