// @ts-ignore
import { Scene, GeometryLayer } from '@antv/l7';
// @ts-ignore
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
        id: 'map',
        renderer: process.env.renderer,
        map: new GaodeMap({
          center: [ 120.1025, 30.2594 ],
          style: 'dark',
          zoom: 10
        })
      });
      
      scene.on('loaded', () => {
        const layer = new GeometryLayer()
          .shape('plane')
          .style({
            opacity: 0.8,
            width: 0.074,
            height: 0.061,
            center: [ 120.1025, 30.2594 ]
          })
          .active(true)
          .color('#ff0');
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
