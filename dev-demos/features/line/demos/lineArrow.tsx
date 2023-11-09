// @ts-ignore
import { LineLayer, Scene, PointLayer } from '@antv/l7';
// @ts-ignore
import { GaodeMap,Mapbox,Map,BaiduMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new BaiduMap({
        center: [ 120.15, 30.3 ],
        zoom: 9,
        style: 'dark'
      })
    });
    
  
    const lineLayer = new LineLayer({autoFit: true})
      .source({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [
                
                [
                  120.1863098144,
                  30.321915039121
                ],
                [
                  120.3401184082,
                  30.321915039121
                ]
              ]
            }
          },
          // {
          //   type: 'Feature',
          //   properties: {},
          //   geometry: {
          //     type: 'LineString',
          //     coordinates: [
                
              
          //       [
          //         120.3401184082,
          //         30.321915039121
          //       ],
          //       [
          //         120.1863098144,
          //         30.321915039121
          //       ],
          //     ]
          //   }
          // }
        ]
      }
      )
      .size(4)
      .shape('arrow')
      .color('#00f')
      .style({
        strokeWidth: 1,
        stroke: '#f00', 
        gapWidth: 10,
        opacity: 1,
        symbol:{
          source:'circle',
          target:'circle',
        }}

      )
      ;
    scene.on('loaded', () => {
      scene.addLayer(lineLayer);
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
