// 

// @ts-ignore
import { Scene, PolygonLayer, LineLayer, Popup } from '@antv/l7';
// @ts-ignore
import { GaodeMap, Map,Mapbox, GaodeMapV1 } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    
    const scene = new Scene({
        id: 'map',
        map: new GaodeMap({
          style: 'light',
          center: [ -96, 37.8 ],
          zoom: 3
        })
      });
      scene.on('loaded', () => {
        fetch(
          'https://gw.alipayobjects.com/os/basement_prod/d36ad90e-3902-4742-b8a2-d93f7e5dafa2.json'
        )
          .then(res => res.json())
          .then(data => {
            const color = ['red', 'blue'];
            const layer = new PolygonLayer({})
              .source(data)
              .scale('density', {
                type: 'quantile'
              })
              .color(
                'density', color
              )
              .shape('fill')
              .active(true);
            const layer2 = new LineLayer({
              zIndex: 2
            })
              .source(data)
              .color('#fff')
              .active(true)
              .size(1)
              .style({
                lineType: 'dash',
                dashArray: [ 2, 2 ],
              });
            scene.addLayer(layer);
            scene.addLayer(layer2);
      
            layer.on('mousemove', e => {
              const popup = new Popup({
                offsets: [ 0, 0 ],
                closeButton: false
              })
                .setLnglat(e.lngLat)
                .setHTML(`<span>${e.feature.properties.name}: ${e.feature.properties.density}</span>`);
              scene.addPopup(popup);
            });
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
