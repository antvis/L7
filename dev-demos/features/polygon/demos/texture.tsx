
import {
    Scene,
    PolygonLayer,
    PointLayer,
    LineLayer,
    // @ts-ignore
  } from '@antv/l7';
  // @ts-ignore
  import { GaodeMap } from '@antv/l7-maps';
  import React, { useEffect } from 'react';
  
  export default () => {
    useEffect(() => {
      const scene = new Scene({
        id: 'map',
        map: new GaodeMap({
          style: 'dark',
          center: [120, 29.732983],
          zoom: 6.2,
          pitch: 0,
        }),
      });
  

      scene.on('loaded', () => {
  
        fetch('https://geo.datav.aliyun.com/areas_v3/bound/330000.json')
          .then((res) => res.json())
          .then((data) => {
     
            console.log(data);
  
            const provincelayerTop = new PolygonLayer({})
              .source(data)
              .size(1000)
              .shape('extrude')
              .size(10000)
              .color('#0DCCFF')
            //   .active({
            //     color: 'rgb(100,230,255)',
            //   })
              .style({
                heightfixed: true,
                // pickLight: true,
                mapTexture:'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*bm0eRKOCcNoAAAAAAAAAAAAADmJ7AQ/original',
                // mapTexture:'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*3UcORbAv_zEAAAAAAAAAAAAADmJ7AQ/original',
                // raisingHeight: 10000,
                opacity: 0.8,
                // sidesurface: false,
              });
            scene.addLayer(provincelayerTop);
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
  