// @ts-ignore
import { PointLayer, Scene } from '@antv/l7';
// @ts-ignore
import {GaodeMap } from '@antv/l7-maps';
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
          
                const pointLayer = new PointLayer({})
                  .source({
                    "type": "FeatureCollection",
                    "features": [
                      {
                        "type": "Feature",
                        "properties": {
                          "name": "A",
                          "color":"red",
                          size:10,
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
                          "name": "B",
                          "color":"yellow",
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
                          "name": "E",
                          "color":"blue",
                          size:13,
                        },
                        "geometry": {
                          "type": "Point",
                          "coordinates": [
                            121.9375,
                            27.059125784374068
                          ]
                        }
                      },
                      {
                        "type": "Feature",
                        "properties": {
                          "name": "C",
                          "color":"red",
                          size:10,
                        },
                        "geometry": {
                          "type": "Point",
                          "coordinates": [
                            107.22656249999999,
                            37.020098201368114
                          ]
                        }
                      },
                      {
                        "type": "Feature",
                        "properties": {
                          "name": "F",
                          "color":"red",
                          size:15,
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
                  // .scale('color',{
                  //   type:'identity'
                  // })
                  .scale('size',{
                    type:'identity'
                  })
                  .shape('circle')
                  .size('size')
                  .active({
                    color:'red',
                  })
                  .select(true)
                  .color('color')
                  .style({
                    // stroke: ['name', (name)=>{
                    //     switch (name) {
                    //         case 'A' :
                    //          return '#fc8d59';
                            
                    //         case 'B' :
                    //             return '#91cf60';
                    //         default:
                    //             return '#ffffbf';

                    //     }
                    // }
                        
                    // ], // 描边颜色
                    strokeWidth: 5, // 描边宽度
                 
                  });
                  

                scene.addLayer(pointLayer);
            
                pointLayer.on('inited',()=>{
                  console.log(pointLayer.getLegend('size'))
                })
          
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
  