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
          center: [110.19382669582967, 30.258134],
          pitch: 0,
          zoom: 2,
        }),
      });
  
      const layer = new PointLayer()
        .source(
          [
            {
              lng: 120,
              lat: 30,
              t: 'text1',
            },
          ],
          {
            parser: {
              type: 'json',
              x: 'lng',
              y: 'lat',
            },
          },
        )
        .size(100)
        .color('#f00')
        .shape('radar')
        .style({
          unit:'pixel'
        })
        .animate(true)
        .active(true);
  
      scene.on('loaded', () => {
        scene.addLayer(layer);
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
  