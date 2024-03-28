// @ts-ignore
import { PointLayer, Scene } from '@antv/l7';
// @ts-ignore
import { GaodeMapV2 } from '@antv/l7-maps';
import React, { useEffect } from 'react';
  
export default () => {
    useEffect( () => {
        const scene = new Scene({
            id: 'map',
            map: new GaodeMapV2({
              center: [ 110, 36 ],
              style: 'light',
              zoom: 3
            })
          });
          scene.on('loaded', () => {
            fetch('https://gw.alipayobjects.com/os/rmsportal/oVTMqfzuuRFKiDwhPSFL.json')
              .then(res => res.json())
              .then(data => {
                const highlightLayer = new PointLayer({ blend: 'normal' })
                .source([], {
                  parser: {
                    type: 'json',
                    coordinates:'coordinates',
                  }
                })
                .shape('circle')
                .active(false)
                .select(false)
                .size(20)
                .color('#f0027f')
                .style({
                  opacity: 1,
                });
                const pointLayer = new PointLayer({ blend: 'normal' })
                  .source(data.list, {
                    parser: {
                      type: 'json',
                      x: 'j',
                      y: 'w'
                    }
                  })
                  .shape('circle')
                  .active(false)
                  .select(false)
                  .size(10)
                  .color('t',['#7fc97f','#beaed4','#fdc086','#ffff99','#386cb0','#f0027f','#bf5b17','#666666'])
                  .style({
                    opacity: 1
                  });
                  pointLayer.on('mousemove',(e)=>{
          
                    highlightLayer.setData([e.feature
                    ],{
                      parser: {
                        type: 'json',
                        coordinates:'coordinates',
                      }
                    })
                  })
                scene.addLayer(pointLayer);
                scene.addLayer(highlightLayer)
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
  