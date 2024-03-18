// @ts-ignore
import { PolygonLayer, Scene,Popup } from '@antv/l7';
// @ts-ignore
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import { DrawControl } from '@antv/l7-draw';
import React, { useEffect } from 'react';
  
export default () => {
  // @ts-ignore
    useEffect( async () => {
      const scene = new Scene({
        id: 'map',
        map: new Mapbox({
          center: [121.4, 31.258134],
          zoom: 14,
          pitch: 0,
          style: 'normal',
          doubleClickZoom:false,
        }),
      });

      fetch(
        'https://gw.alipayobjects.com/os/alisis/geo-data-v0.1.1/administrative-data/area-list.json'
      )
        .then(res => res.json())
        .then(data => {
          const layer = new PolygonLayer({})
            .source(data,{
              parser:{
                  type:'json',
                  x:'lng',
                  y:'lat'
              }
              
            })
            .color('blue')
            .shape('helloworld')
            .size(18)
            .style({
                // fontSize: 10,
                stroke: "#fff",
                strokeWidth: 1.5,
                textAnchor:'center',
                textAllowOverlap: false,
                padding: [5, 5]
            });
          scene.addLayer(layer);
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
  