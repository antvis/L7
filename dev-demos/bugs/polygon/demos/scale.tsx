// 

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
        const data = fetch('https://gw.alipayobjects.com/os/raptor/1669276113315/33.json').then(res=>res.json()).then((data)=>{
            const features = data.features.map((fe)=>{
                const name = fe.properties.name;
                fe.properties.value = name ==='杭州市'? 46:0;
             return fe;
            })

            const fill = new PolygonLayer({
                autoFit:true
            })
                  .source({
                    type: 'FeatureCollection',
                    features,
                  })
                  .shape('fill')
                  .scale('value',{
                    type:'quantile'
                  })
                  .color('value',[
                    "rgb(247, 251, 255)",
                    "rgb(222, 235, 247)",
                    "rgb(198, 219, 239)",
                    "rgb(158, 202, 225)",
                    "rgb(107, 174, 214)",
                    "rgb(66, 146, 198)",
                    "rgb(33, 113, 181)",
                    "rgb(8, 81, 156)",
                    "rgb(8, 48, 107)"
                ])
                  .style({
                   opacity:1,
                   
                  });

                  scene.addLayer(fill);
                  fill.on('inited',()=>{
                    console.log(fill.getLegend('color'))
                  })
              
                  console.log(fill);
            
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
  