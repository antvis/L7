// @ts-ignore
import { Scene, PointLayer,PolygonLayer } from '@antv/l7';
// @ts-ignore
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
     
      map: new GaodeMap({
        center: [105, 32],
        pitch: 0,
        zoom: 4,
      }),
    });
    scene.addImage(
      '00',
      'https://gw.alipayobjects.com/zos/basement_prod/604b5e7f-309e-40db-b95b-4fac746c5153.svg',
    );
    const maskData = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              [
                [
                  [112.8515625, 47.635783590864854],
                  [117.59765625, 38.54816542304656],
                  [125.15625000000001, 45.02695045318546],
                ],
              ],
              [
                [
                  [88.681640625, 40.17887331434696],
                  [100.37109375, 35.460669951495305],
                  [89.82421875, 29.53522956294847],
                ],
              ],
            ],
          },
        },
      ],
    };

    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/rmsportal/oVTMqfzuuRFKiDwhPSFL.json',
      )
        .then((res) => res.json())
        .then((data) => {
          const polygonLayer = new PolygonLayer().source(maskData).shape('fill').color('#f00').style({opacity:0.5});
          const pointLayer = new PointLayer({
            maskLayers: [polygonLayer]
          })
            .source(data.list, {
              parser: {
                type: 'json',
                x: 'j',
                y: 'w',
              },
            })
            .shape('m', 'text')
            .size(12)
            .color('w', ['#0e0030', '#0e0030', '#0e0030'])
            .style({
              textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
              textOffset: [0, 0], // 文本相对锚点的偏移量 [水平, 垂直]
              spacing: 2, // 字符间距
              padding: [1, 1], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
              stroke: '#ffffff', // 描边颜色
              strokeWidth: 0.3, // 描边宽度
              strokeOpacity: 1.0,
              // textAllowOverlap: true
            });
          scene.addLayer(pointLayer);
          scene.addLayer(polygonLayer);
        });
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
