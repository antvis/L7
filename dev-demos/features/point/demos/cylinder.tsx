// @ts-ignore
import { PointLayer, Scene } from '@antv/l7';
// @ts-ignore
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import React, { useEffect } from 'react';
  
export default () => {
    useEffect( () => {
      const scene = new Scene({
        id: 'map',
        map: new GaodeMap({
          center: [121.107846, 30.267069],
          pitch: 35.210526315789465,
          style: 'dark',
          zoom: 8,
          animateEnable: false,
        }),
      });
  
      scene.on('loaded', () => {
        fetch(
          'https://gw.alipayobjects.com/os/rmsportal/oVTMqfzuuRFKiDwhPSFL.json',
        )
          .then((res) => res.json())
          .then((data) => {
            const pointLayer = new PointLayer({ depth: false })
              .source(data.list, {
                parser: {
                  type: 'json',
                  x: 'j',
                  y: 'w',
                },
              })
              .shape('cylinder') // cylinder triangleColumn hexagonColumn squareColumn
              .size('t', function(level) {
                return [1, 1, level * 2 + 20];
              })
              .active(true)
              .color('#0ff')
              .style({
                // opacity: 0.8,
                opacityLinear: {
                  enable: true, // true - false
                  dir: 'up', // up - down
                },
                lightEnable: false,
                // sourceColor: '#f00',
                // targetColor: "#0f0"
              });
            scene.addLayer(pointLayer);
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
  