
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
        renderer: process.env.renderer,
        map: new GaodeMap({
          style: 'dark',
          center: [120, 29.732983],
          zoom: 6.2,
          pitch: 60,
          token:"pk.eyJ1IjoiZmFrZXVzZXJnaXRodWIiLCJhIjoiY2pwOGlneGI4MDNnaDN1c2J0eW5zb2ZiNyJ9.mALv0tCpbYUPtzT7YysA2g"
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
              .size('height')
              .shape('extrusion')
              .color('color')
              .style({
                extrusionBase:{
                  field:'base_height',
                },
                opacity: 1.0,
              });
            scene.addLayer(provincelayerSide);
            scene.startAnimate()
  
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
  