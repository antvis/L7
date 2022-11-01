// @ts-ignore
import { PointLayer, Scene } from '@antv/l7';
// @ts-ignore
import {GaodeMapV2 } from '@antv/l7-maps';
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
          
                const pointLayer = new PointLayer({})
                  .source({
                    "type": "FeatureCollection",
                    "features": [
                      {
                        "type": "Feature",
                        "properties": {
                          "name": "A"
                        },
                        "geometry": {
                          "type": "Point",
                          "coordinates": [
                            135.52734375,
                            46.31658418182218
                          ]
                        }
                      },
                      {
                        "type": "Feature",
                        "properties": {
                          "name": "B"
                        },
                        "geometry": {
                          "type": "Point",
                          "coordinates": [
                            120.9375,
                            27.059125784374068
                          ]
                        }
                      },
                      {
                        "type": "Feature",
                        "properties": {
                          "name": "C"
                        },
                        "geometry": {
                          "type": "Point",
                          "coordinates": [
                            107.22656249999999,
                            37.020098201368114
                          ]
                        }
                      }
                    ]
                  })
                  .shape('circle')
                  .size(12)
                  .color('red')
                  .style({
                    stroke: ['name', (name)=>{
                        switch (name) {
                            case 'A' :
                             return '#fc8d59';
                            
                            case 'B' :
                                return '#91cf60';
                            default:
                                return '#ffffbf';

                        }
                    }
                        
                    ], // 描边颜色
                    strokeWidth: 5, // 描边宽度
                 
                  });
                  
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
  