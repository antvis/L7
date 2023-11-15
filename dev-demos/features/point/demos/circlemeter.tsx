import { Scene, PointLayer,PolygonLayer } from "@antv/l7";
import { GaodeMap,Map } from "@antv/l7-maps";
import React, { useEffect } from 'react';
import * as turf from '@turf/turf'
  
export default () => {
    useEffect( () => {
const scene = new Scene({
  id: "map",
  // renderer: 'device',
  map: new GaodeMap({
    style: "light",
    center: [120.099658370018, 30.263445807542666],
    zoom: 12
  })
});
scene.on("loaded", () => {

  const pointLayer = new PointLayer({
    autoFit: false
  })
    .source({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            name: "point1"
          
          },
          geometry: {
            type: "Point",
            coordinates: [120.099658370018, 30.263445807542666]
          }
        }
      ]
    })  
    .shape("circle")
    .size(1000)
    .color("red")
    // .active(true)
    .select(true)
    // .animate({ enable: true })
    .style({
      opacity: 1,
      strokeWidth: 1,
      unit: 'meter',
    });
    pointLayer.on('click', (e) => {
      console.log(e)
    });
  scene.addLayer(pointLayer);
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