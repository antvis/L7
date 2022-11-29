// @ts-ignore
import {
    LineLayer,
    Scene,
    Source,
    lineAtOffset,
    lineAtOffsetAsyc,
    PointLayer,
    // @ts-ignore
  } from '@antv/l7';
  // @ts-ignore
  import { GaodeMapV1 } from '@antv/l7-maps';
  import React, { useEffect } from 'react';
  
  export default () => {
    useEffect(() => {
      const scene = new Scene({
        id: 'map',
        map: new GaodeMapV1({
          style: 'light',
          center: [-96, 37.8],
          zoom: 3,
        }),
      });
      scene.on('loaded', () => {
        
      });
      
      const scene2 = new Scene({
        id: 'map2',
        map: new GaodeMapV1({
          style: 'dark',
          center: [-96, 37.8],
          zoom: 3,
        }),
      });
      scene2.on('loaded', () => {
       
      });
      
  
    }, []);
    return (
      <>
      <div
        id="map"
        style={{
          float:'left',
          width:'50%',
          height: '500px',
          position: 'relative',
        }}
      />
       <div
        id="map2"
        style={{
         float:'right',
          width:'50%',
          height: '500px',
          position: 'relative',
        }}
      />
      </>
    );
  };
  