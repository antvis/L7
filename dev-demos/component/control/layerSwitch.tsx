import type {
  ILayer} from '@antv/l7';
import {
  GaodeMap,
  LayerSwitch,
  LineLayer,
  PointLayer,
  PolygonLayer,
  Scene,
} from '@antv/l7';
import React, { useState } from 'react';
// tslint:disable-next-line:no-duplicate-imports
import type { FunctionComponent} from 'react';
import { useEffect } from 'react';
import { message } from 'antd';

const Demo: FunctionComponent = () => {
  const [layers, setLayers] = useState<ILayer[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [scene, setScene] = useState<Scene | undefined>();
  const [newLayer, setNewLayer] = useState<ILayer | null>(null);
  const [control, setControl] = useState<LayerSwitch | null>(null);

  useEffect(() => {
    const newScene = new Scene({
      id: 'map',
      map: new GaodeMap({
        style: 'normal',
        center: [120, 30],
        pitch: 0,
        zoom: 6.45,
      }),
      // logoVisible: false,
    });

    newScene.on('loaded', () => {
      const newLayers: ILayer[] = [];
      window.Promise.all([
        fetch(
          'https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json',
        )
          .then((res) => res.json())
          .then((data) => {
            const pointLayer = new PointLayer({
              name: '点图层',
              autoFit: true,
            })
              .source(data)
              .shape('circle')
              .size('mag', [1, 25])
              .color('mag', (mag) => {
                return mag > 4.5 ? '#5B8FF9' : '#5CCEA1';
              })
              .active(true)
              .style({
                opacity: 0.3,
                strokeWidth: 1,
              });
            setNewLayer(pointLayer);
            newScene.addLayer(pointLayer);
          }),
        fetch(
          // 'https://gw.alipayobjects.com/os/bmw-prod/1981b358-28d8-4a2f-9c74-a857d5925ef1.json' //  获取行政区划P噢利用
          'https://gw.alipayobjects.com/os/bmw-prod/d6da7ac1-8b4f-4a55-93ea-e81aa08f0cf3.json',
        )
          .then((res) => res.json())
          .then((data) => {
            const chinaPolygonLayer = new PolygonLayer({
              name: '中国填充',
              autoFit: true,
            })
              .source(data)
              .color('name', [
                'rgb(239,243,255)',
                'rgb(189,215,231)',
                'rgb(107,174,214)',
                'rgb(49,130,189)',
                'rgb(8,81,156)',
              ])
              .shape('fill')
              .style({
                opacity: 1,
              });
            //  图层边界
            const layer2 = new LineLayer({
              name: '中国边框',
              zIndex: 2,
            })
              .source(data)
              .color('rgb(93,112,146)')
              .size(0.6)
              .style({
                opacity: 1,
              });

            newScene.addLayer(chinaPolygonLayer);
            newScene.addLayer(layer2);
            newLayers.push(chinaPolygonLayer, layer2);
          }),
      ]).then(() => {        
        const newControl = new LayerSwitch({
          layers: newLayers,
          multiple: false
        });
        setControl(newControl);
        newScene.addControl(newControl);
        setLayers(newLayers);
        setScene(newScene);
      });
    });
  }, []);

  return (
    <>
      <button
        onClick={() => {
          const layer = layers[0];
          if (layer?.isVisible()) {
            layer?.hide();
          } else {
            layer?.show();
          }
        }}
      >
        切换图层显隐
      </button>

      <button
        onClick={() => {
          control?.setOptions({
            multiple: !control.getOptions().multiple,
          });
          message.info(`当前图层选择模式：${control?.getOptions().multiple ? '多选' : '单选'}`);
        }}
      >
        切换单选或多选模式
      </button>

      <button
        onClick={() => {
          if (newLayer && control && !layers.includes(newLayer)) {
            const newLayers = [...layers, newLayer];
            control?.setOptions({
              layers: newLayers,
            });
            setLayers(newLayers);
          }
        }}
      >
        添加新的管理图层
      </button>
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
