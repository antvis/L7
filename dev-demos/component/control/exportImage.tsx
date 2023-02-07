import { ExportImage, GaodeMap, PointLayer, Scene } from '@antv/l7';
import React, { useState } from 'react';
// tslint:disable-next-line:no-duplicate-imports
import { FunctionComponent, useEffect } from 'react';

const Demo: FunctionComponent = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [scene, setScene] = useState<Scene | undefined>();
  const [imgSrc, setImgSrc] = useState('');
  const [control, setControl] = useState<ExportImage | null>(null);

  useEffect(() => {
    const newScene = new Scene({
      id: 'map',
      map: new GaodeMap({
        style: 'normal',
        center: [120, 30],
        pitch: 0,
        zoom: 6.45,
        WebGLParams: {
          preserveDrawingBuffer: true,
        },
      }),
      // logoVisible: false,
    });

    newScene.on('loaded', () => {
      const newControl = new ExportImage({
        onExport: (base64) => {
          setImgSrc(base64);
        },
      });
      newScene.addControl(newControl);
      setControl(newControl);

      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json',
      )
        .then((res) => res.json())
        .then((data) => {
          const pointLayer = new PointLayer({
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
          newScene.addLayer(pointLayer);
          setScene(newScene);
        });
    });
  }, []);

  return (
    <>
      <button
        onClick={() => {
          control?.setOptions({
            imageType: 'jpeg',
          });
        }}
      >
        设置导出格式为 JPG
      </button>
      <div
        id="map"
        style={{
          height: '500px',
          position: 'relative',
        }}
      />
      <div>
        <div>截图展示：</div>
        <img src={imgSrc} style={{ width: 200, height: 100 }} />
      </div>
    </>
  );
};

export default Demo;
