
import {
    Scene,
    PolygonLayer,
    PointLayer,
    LineLayer,
    // @ts-ignore
  } from '@antv/l7';
  // @ts-ignore
  import { GaodeMap,Mapbox } from '@antv/l7-maps';
  import React, { useEffect } from 'react';
  
  export default () => {
    useEffect(() => {
      const scene = new Scene({
        id: 'map',
        map: new GaodeMap({
          style: 'dark',
          center: [120, 29.732983],
          zoom: 6.2,
          pitch: 60,
        }),
      });

  
      scene.on('loaded', () => {
  
        fetch('https://mdn.alipayobjects.com/afts/file/A*CGKZTL6s_ywAAAAAAAAAAAAADrd2AQ/indoor-3d-map.json')
          .then((res) => res.json())
          .then((data) => {
            
  
            const provincelayerSide = new PolygonLayer({
                autoFit: true,
            })
              .source(data)
              .size('height',(val)=>{
                return val * 1.2;
              })
              .shape('extrusion')
              .color('color')
              .style({
                extrusionBase:{
                  field:'base_height',
                  // value:(val)=>{
                  //   return val;
                  // }

                },
                opacity: 1.0,
                // topsurface: false,
              });
            scene.addLayer(provincelayerSide);
  
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
  