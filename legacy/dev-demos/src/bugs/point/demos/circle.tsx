// @ts-ignore
import { PointLayer, Scene,Popup } from '@antv/l7';
// @ts-ignore
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import React, { useEffect } from 'react';
  
export default () => {
  // @ts-ignore
    useEffect( async () => {
      const scene = new Scene({
        id: 'map',
        map: new GaodeMap({
          style: 'light',
          center: [ 121.434765, 31.256735 ],
          zoom: 14.83
        })
      });
      scene.addImage(
        '00',
        'https://gw.alipayobjects.com/zos/basement_prod/604b5e7f-309e-40db-b95b-4fac746c5153.svg'
      );
      scene.addImage(
        '01',
        'https://gw.alipayobjects.com/zos/basement_prod/30580bc9-506f-4438-8c1a-744e082054ec.svg'
      );
      scene.addImage(
        '02',
        'https://gw.alipayobjects.com/zos/basement_prod/7aa1f460-9f9f-499f-afdf-13424aa26bbf.svg'
      );
      scene.on('loaded', () => {
        fetch(
          'https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json'
        )
          .then(res => res.json())
          .then(data => {
            const imageLayer = new PointLayer()
              .source(data, {
                parser: {
                  type: 'json',
                  x: 'longitude',
                  y: 'latitude'
                }
              })
              .color('red')
              .shape('square')
              .size('unit_price',[2,30])
              .style({
                rotation: {
                  field:'unit_price',
                  value: [0,360]
                },
                opacity: 1,
              });
              const imageLayer2 = new PointLayer()
              .source(data, {
                parser: {
                  type: 'json',
                  x: 'longitude',
                  y: 'latitude'
                }
              })
              .color('#00f')
              .shape('circle')
              .size(6)
              .style({
                opacity: 1,
              });
            scene.addLayer(imageLayer);
            imageLayer.on('click',(e)=>{
              console.log(e)
            })
            scene.addLayer(imageLayer2);
          });
      });
      
     
          
    }, []);
    return (
      <>
      <div style={{
        width:'50px',
        height:'50px',
        background: 'blue',
      }}></div>
      <div
        id="map"
        style={{
          height: '500px',
          position: 'relative',
        }}
      />
      </>
    );
  };
  