// @ts-ignore
import { LineLayer, PointLayer, Scene } from '@antv/l7';
// @ts-ignore
import { GaodeMap,Mapbox,Map, } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
    renderer: process.env.renderer,
      map: new Mapbox({
        center: [116.3956, 39.9392],
        zoom: 10,
        token:"pk.eyJ1IjoiZmFrZXVzZXJnaXRodWIiLCJhIjoiY2pwOGlneGI4MDNnaDN1c2J0eW5zb2ZiNyJ9.mALv0tCpbYUPtzT7YysA2g",
      }),
      debug: true,
    });

    scene.on('loaded', () => {
      fetch('https://gw.alipayobjects.com/os/rmsportal/ZVfOvhVCzwBkISNsuKCc.json')
    .then(res => res.json())
    .then(data => {
      const layer = new LineLayer({
        autoFit:true,
      })
        .source(data)
        .size('ELEV', h => {
          return [ h % 50 === 0 ? 1.0 : 0.5, (h - 1400) * 20 ];
        })
        .shape('line')
        .scale('ELEV', {
          type: 'quantize'
        })
        .style({
          lineType: 'dash',
              opacity:1,
              dashArray: [5, 5],
          heightfixed: true
        })
        .color('ELEV', [
          '#094D4A',
          '#146968',
          '#1D7F7E',
          '#289899',
          '#34B6B7',
          '#4AC5AF',
          '#5FD3A6',
          '#7BE39E',
          '#A1EDB8',
          '#CEF8D6'
        ]);
      scene.addLayer(layer);
    });
      // fetch(
      //   'https://gw.alipayobjects.com/os/basement_prod/0d2f0113-f48b-4db9-8adc-a3937243d5a3.json',
      // )
      //   .then((res) => res.json())
      //   .then((data) => {
      //     const layer = new LineLayer({autoFit:true})
      //       .source(data)
      //       .size(1.5)
      //       .shape('line')
      //       .color('标准名称', ['#5B8FF9', '#5CCEA1', '#F6BD16'])
      //       .active(true)
      //       .style({
      //         lineType: 'dash',
      //         opacity:1,
      //         dashArray: [5, 5],
      //         raisingHeight: 100
      //       });
      //     scene.addLayer(layer);
         
          

        // });
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
