// @ts-ignore
import { LineLayer, Scene, PointLayer } from '@antv/l7';
// @ts-ignore
import { GaodeMap,Mapbox,Map,BaiduMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const symbol = {
      source:'classic',
      target:'classic',
    };
    const scene = new Scene({
      id: 'map',
    renderer: process.env.renderer,
      map: new GaodeMap({
        center: [ 120.15, 30.3 ],
        zoom: 5,
        style: 'dark'
      })
    });
    const scene2 = new Scene({
      id: 'map2',
    renderer: process.env.renderer,
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
                  30.321915039121 + 0.02 * 1,
                ]
              ]
            }
          }
        ]
      }
      )
      .size(20)
      .shape('flowline')
      .color('#00f')
      .style({
        strokeWidth: 1,
        stroke: '#f00', 
        gapWidth: 10,
        opacity: 1,
        symbol
      }

      );

      const lineLayer2 = new LineLayer({autoFit: true})
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
      .size(10)
      .shape('flowline')
      .color('#00f')
      .style({
        strokeWidth: 1,
        stroke: '#f00', 
        gapWidth: 10,
        opacity: 1,
        symbol,}

      );
    scene.on('loaded', () => {
      scene.addLayer(lineLayer);
      scene.startAnimate();
    });
    scene2.on('loaded', () => {
      scene2.addLayer(lineLayer2);
      // scene.startAnimate();
    });
  }, []);
  return (
    <div style={{
      display:'flex',
      height: '500px',
      position: 'relative',
    }}>
    <div
      id="map"
      style={{
        height: '500px',
        width:'450px',
        position: 'relative'
      }}
    />
     <div
      id="map2"
      style={{
        height: '500px',
        width:'450px',
        position: 'relative'
      }}
    />
    </div>
  );
};
