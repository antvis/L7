import { PointLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';
import data from './data.json';
export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'point_circle',
      map: new GaodeMap({
        style: 'dark',
        center: [121.24357, 32.58264],
        pitch: 0,
        zoom: 4,
      }),
    });
    scene.on('loaded', () => {
      const pointLayer = new PointLayer({})
        .source(data)
        .shape('circle')
        .size(16)
        .color('marker-color')
        // .scale('marker-color',{
        //     type:'identity',
        //     unknown:'#fff'
        // })
        .style({
          opacity: 1,
          strokeWidth: 0,
          stroke: '#fff',
        });

      // const pointLayerText = new PointLayer({})
      // .source(data)
      // .shape('name','text')
      // .size(16)
      // .color('#fff')
      // .style({
      //   opacity: 1,
      //   strokeWidth: 1,
      //   stroke: '#000',
      // });
      pointLayer.on('inited', () => {
        const colorScale = pointLayer.getScale('color');
        console.log(colorScale('#ea6161'));
      });
      scene.addLayer(pointLayer);

      //   scene.addLayer(pointLayerText);
    });
  }, []);
  return (
    <div
      id="point_circle"
      style={{
        height: '500px',
        position: 'relative',
      }}
    />
  );
};
