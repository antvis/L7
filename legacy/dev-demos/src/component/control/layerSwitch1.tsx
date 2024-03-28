import { GaodeMap, LayerSwitch, RasterLayer, Scene } from '@antv/l7';
import React from 'react';
// tslint:disable-next-line:no-duplicate-imports
import type { FunctionComponent} from 'react';
import { useEffect } from 'react';

const Demo: FunctionComponent = () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map1',
      map: new GaodeMap({
        pitch: 0,
        style: 'normal',
        center: [120.154672, 30.241095],
        zoom: 12,
      }),
    });
    scene.on('loaded', () => {
      const url1 =
        'https://gac-geo.googlecnapps.cn/maps/vt?lyrs=s&gl=CN&x={x}&y={y}&z={z}';
      const rasterLayer1 = new RasterLayer({
        zIndex: 1,
      }).source(url1, {
        parser: {
          type: 'rasterTile',
          tileSize: 256,
          zoomOffset: 0,
        },
      });

      const url2 =
        'https://gac-geo.googlecnapps.cn/maps/vt?lyrs=h&gl=CN&x={x}&y={y}&z={z}';
      const rasterLayer2 = new RasterLayer({
        zIndex: 1,
      }).source(url2, {
        parser: {
          type: 'rasterTile',
          tileSize: 256,
          zoomOffset: 0,
        },
      });

      scene.addLayer(rasterLayer1);
      scene.addLayer(rasterLayer2);

      const layerSwitch = new LayerSwitch({
        layers: [
          {
            layer: rasterLayer1,
            name: '遥感影像图层',
            img: 'https://mdn.alipayobjects.com/huamei_k6sfo0/afts/img/A*fG9HQpyNuv0AAAAAAAAAAAAADjWqAQ/original',
          },
          {
            layer: rasterLayer2,
            name: '文字标注图层',
            img: 'https://mdn.alipayobjects.com/huamei_k6sfo0/afts/img/A*CP5pQY_8Q_YAAAAAAAAAAAAADjWqAQ/original',
          },
        ],
      });
      scene.addControl(layerSwitch);
    });
  }, []);

  return (
    <>
      <div
        id="map1"
        style={{
          height: '500px',
          position: 'relative',
        }}
      />
    </>
  );
};

export default Demo;
