// @ts-ignore
import { Scene, PolygonLayer } from '@antv/l7';
// @ts-ignore
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {

    const scene = new Scene({
      id: "map",
      map: new GaodeMap({
        center: [120, 30],
        zoom: 4
      })
    });
    
    const dataList = [
      { name: "杭州", data: '#f00' },
      { name: "北京", data: '#ff0' }
    ];
    const dataList2 = [{ name: "杭州", data: '#0f0' }];
    
    const geo = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            color: "#f00",
            name: "杭州"
          },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [100, 30],
                [120, 35],
                [120, 30]
              ]
            ]
          }
        },
      ]
    };
    
    const layer = new PolygonLayer()
      .source(geo)
      .shape("fill")
      .color("#f00")
      // .active(true)
      .select(true)
    
    scene.on("loaded", () => {
      scene.addLayer(layer);
      layer.on('mousemove', () => {

      })
   
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
