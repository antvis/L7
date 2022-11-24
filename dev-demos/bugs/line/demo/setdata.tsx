// @ts-ignore
import { PolygonLayer, Scene } from '@antv/l7';
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
          const data = {
            "type": "FeatureCollection",
            "features": [
              {
                "type": "Feature",
                "properties": {},
                "geometry": {
                  "type": "LineString",
                  "coordinates": [
                    [
                      80.15625,
                      54.57206165565852
                    ],
                    [
                      123.04687499999999,
                      31.052933985705163
                    ],
                    [
                      119.88281249999999,
                      -10.487811882056683
                    ],
                    [
                      60.8203125,
                      -2.460181181020993
                    ],
                    [
                      8.0859375,
                      16.636191878397664
                    ],
                    [
                      -2.109375,
                      43.83452678223682
                    ],
                    [
                      -5.625,
                      56.559482483762245
                    ],
                    [
                      -5.625,
                      59.712097173322924
                    ]
                  ]
                }
              }
            ]
          };
          scene.on('loaded', () => {
            
                const fill = new PolygonLayer({})
                  .source(data)
                  .shape('line')
                  .size(5)
                  .select(true)
                  .color('active',()=>{
                    const index =Math.floor(Math.random()*10);
                    return ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928'][index]
                  })
                  .style({
                   opacity:1,
                   
                  });
                 
                scene.addLayer(fill);
                scene.on('contextmenu',()=>{
                  fill.setData(data)
                })
              })
                
          
          
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
  