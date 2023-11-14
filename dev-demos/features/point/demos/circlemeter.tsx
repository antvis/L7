import { Scene, PointLayer,PolygonLayer } from "@antv/l7";
import { GaodeMap } from "@antv/l7-maps";
import React, { useEffect } from 'react';
import * as turf from '@turf/turf'
  
export default () => {
    useEffect( () => {
const scene = new Scene({
  id: "map",
  renderer: 'device',
  map: new GaodeMap({
    style: "light",
    center: [120.099658370018, 30.263445807542666],
    zoom: 10
  })
});
scene.on("loaded", () => {
  const size = 1000;
  const circle = turf.circle([120.099658370018, 30.263445807542666],size/1000,{
     steps: 60, units: 'kilometers'
  });
// const player = new PolygonLayer().source(turf.featureCollection([circle]))
// .shape('fill')
// .color('blue')
// .style({
//   opacity:0.5
// })
  const pointLayer = new PointLayer({
    autoFit: false
  })
    .source({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Point",
            coordinates: [120.099658370018, 30.263445807542666]
          }
        }
      ]
    })  
    .shape("circle")
    .size(100)
    .color("#ff0000")
    // .animate(true)
    // .active(true)
    .style({
      opacity: 1,
      strokeWidth: 1,
      // rotation: 30,
      // unit:'meter'
    });
  // scene.addLayer(player);
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