// @ts-ignore
import { PointLayer,LineLayer, Scene } from '@antv/l7';
// @ts-ignore
import {GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';
  
export default () => {
    useEffect( () => {
        let startPoint =[110.23,32];
        const scene = new Scene({
            id: 'map',
            map: new GaodeMap({
              center: [ 110, 36 ],
              style: 'light',
              zoom: 3
            })
          });
          scene.on('loaded', () => {
              
            const line = new LineLayer({})
            .source({
                "type": "FeatureCollection",
                "features": []
              })
            .shape('line')
            .size(1)
            .color('red')
            .style({ // 描边颜色
                lineType: 'dash',
                dashArray: [5, 5],
            });
            const pointLayer = new PointLayer({})
                .source([])
                .shape('name','text')
                .size(12)
                .color('red')
                .style({
                    strokeWidth: 0.3, // 描边宽度
                    strokeOpacity: 1.0,
                    textAllowOverlap: false,
                  });

                  const circleLayer = new PointLayer({})
                  .source({
                    "type": "FeatureCollection",
                    "features": []
                  })
                  .shape('circle')
                  .size(12)
                  .color('red')
                  .style({
                     stroke:'#fff',
                      strokeWidth: 2, // 描边宽度
                      strokeOpacity: 1.0,
                    });
                
            scene.addLayer(pointLayer);
            scene.addLayer(line);
            scene.addLayer(circleLayer);
               
              scene.on('mousemove',(e)=>{
                const {lng,lat} = e.lnglat;
                pointLayer.setData([])
                circleLayer.setData({
                    "type": "FeatureCollection",
                    "features": [
                      {
                        "type": "Feature",
                        "properties": {},
                        "geometry": {
                          "type": "Point",
                          "coordinates": [
                            77.34374999999999,
                                34.88593094075317
                          ]
                        }
                      },
                      {
                        "type": "Feature",
                        "properties": {},
                        "geometry": {
                          "type": "Point",
                          "coordinates": [
                            lng,lat
                          ]
                        }
                      }
                    ]
                  })
                line.setData({
                    "type": "FeatureCollection",
                    "features": [
                      {
                        "type": "Feature",
                        "properties": {},
                        "geometry": {
                          "type": "LineString",
                          "coordinates": [
                            [
                                77.34374999999999,
                                34.88593094075317
                            ],
                            [
                                lng,lat
                            ]
                          ]
                        }
                      }
                    ]
                  })
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
  