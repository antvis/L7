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
              center: [ 110, 36 ],
              style: 'light',
              zoom: 3
            })
          });
          scene.on('loaded', () => {
            fetch('https://gw.alipayobjects.com/os/rmsportal/oVTMqfzuuRFKiDwhPSFL.json')
              .then(res => res.json())
              .then(data => {
                const pointLayer = new PointLayer({ blend: 'additive' })
                  .source(data.list, {
                    parser: {
                      type: 'json',
                      x: 'j',
                      y: 'w'
                    }
                  })
                  .shape('simple')
                  .size(6)
                  .color('#ff0')
                  .style({
                    opacity: 0.3
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
  