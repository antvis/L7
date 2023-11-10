// @ts-ignore
import { LineLayer, Scene, PointLayer } from '@antv/l7';
// @ts-ignore
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
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
                  8.628549054737778, 46.7719996986948
                ],
                [
                  9.36701599748908, 47.365427898323425
                ],
              ]
            }
          }
        ]
      }
      )
      .size(5)
      .shape('arrow')
      .color('#00f')
      .style({
        strokeWidth: 1,
        stroke: '#fff',  
        opacity: 1,
        // arrow: {
        //   type:'arrow',
        //   position:'end',
        // }
      })
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
