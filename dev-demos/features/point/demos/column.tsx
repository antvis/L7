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
          pitch: 66.02383,
          style: 'dark',
          center: [121.400257, 31.25287],
          zoom: 14.55,
          rotation: 134.9507,
        }),
      });
      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json',
      )
        .then((res) => res.json())
        .then((data) => {
          const pointLayer = new PointLayer({})
            .source(data, {
              parser: {
                type: 'json',
                x: 'longitude',
                y: 'latitude',
              },
            })
            .shape('name', [
              'cylinder',
              'triangleColumn',
              'hexagonColumn',
              'squareColumn',
            ])
            .size('unit_price', (h) => {
              return [6, 6, 100];
            })
            .color('name', ['#739DFF', '#61FCBF', '#FFDE74', '#FF896F'])
            .style({
              opacity:1,
            });
          console.log(pointLayer);
          scene.addLayer(pointLayer);
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
  