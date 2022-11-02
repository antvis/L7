// @ts-ignore
import { PolygonLayer, Scene } from '@antv/l7';
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
            
                const fill = new PolygonLayer({})
                  .source({
                    type: 'FeatureCollection',
                    features:[]
                  })
                  .shape('line')
                  .color('red')
                  .style({
                   opacity:1,
                   
                  });
                 
                scene.addLayer(fill);
                setTimeout(()=>{
                    fill.setData({
                        "type": "FeatureCollection",
                        "features": [
                          {
                            "type": "Feature",
                            "properties": {},
                            "geometry": {
                              "type": "Polygon",
                              "coordinates": [
                                [
                                  [
                                    97.734375,
                                    29.6880527498568
                                  ],
                                  [
                                    119.88281249999999,
                                    29.6880527498568
                                  ],
                                  [
                                    119.88281249999999,
                                    42.8115217450979
                                  ],
                                  [
                                    97.734375,
                                    42.8115217450979
                                  ],
                                  [
                                    97.734375,
                                    29.6880527498568
                                  ]
                                ]
                              ]
                            }
                          }
                        ]
                      })
                },2000)
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
  