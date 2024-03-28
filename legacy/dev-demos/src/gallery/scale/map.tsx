import { LineLayer, PointLayer, PolygonLayer, Scene, Source } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    fetch(
      'https://mdn.alipayobjects.com/afts/file/A*7HqFT7he7KoAAAAAAAAAAAAADrd2AQ/12.20%20%E5%90%84%E7%9C%81%E4%BB%BD%E9%A6%96%E8%BD%AE%E6%84%9F%E6%9F%93%E9%AB%98%E5%B3%B0%E6%9C%9F%E9%A2%84%E6%B5%8B.json',
    )
      .then((res) => res.json())
      .then((data) => {
        const scene = new Scene({
          id: 'map',
          map: new GaodeMap({
            pitch: 0,
            style: 'dark',
            center: [112, 37.8],
            zoom: 3,
          }),
        });
        const chinaSource = new Source(data, {
          parser: {
            type: 'json',
            geometry: 'geometry',
          },
        });
        const layer = new PolygonLayer({
          autoFit: true,
        })
          .source(chinaSource)
          .scale('达峰进度条', {
            type: 'quantize',
            domain: [0, 100],
            unknown: '#f7f4f9',
          })
          .shape('fill')
          .color('达峰进度条', [
            '#fee5d9',
            '#fc9272',
            '#fb6a4a',
            '#de2d26',
            '#a50f15',
          ])
          .style({
            opacity: 1,
          });
        const linelayer = new LineLayer({})
          .source(chinaSource)
          .shape('line')
          .color('#ddd')
          .style({
            opacity: 1,
          });

        layer.on('inited', () => {
          console.log(layer.getLegend('color'));
        });
        const pointSource = new Source(data, {
          parser: {
            type: 'json',
            geometry: 'center',
          },
        });
        const nameLayer = new PointLayer()
          .source(pointSource)
          .size(12)
          .shape('name', 'text')
          .color('#525252')
          .style({
            textAnchor: 'top', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
            textOffset: [0, 0], // 文本相对锚点的偏移量 [水平, 垂直]
            //   spacing: 2, // 字符间距
            //   padding: [ 1, 1 ], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
            stroke: '#fff', // 描边颜色
            strokeWidth: 1, // 描边宽度
            strokeOpacity: 1.0,
          });

        const textLayer = new PointLayer()
          .source(pointSource)
          .size(14)
          .shape('达峰进度条', 'text')
          .color('#e7298a')
          .style({
            textAnchor: 'bottom', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
            textOffset: [0, -20], // 文本相对锚点的偏移量 [水平, 垂直]
            //   spacing: 2, // 字符间距
            //   padding: [ 1, 1 ], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
            stroke: '#fff', // 描边颜色
            strokeWidth: 2, // 描边宽度
            strokeOpacity: 1.0,
            fontWeight: 800,
            textAllowOverlap: true,
          });

        scene.addLayer(layer);
        scene.addLayer(linelayer);
        scene.addLayer(nameLayer);
        scene.addLayer(textLayer);
      });
  }, []);

  return (
    <div
      id="map"
      style={{
        height: '100vh',
        position: 'relative',
      }}
    />
  );
};
