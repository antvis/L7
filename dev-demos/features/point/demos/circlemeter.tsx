import { Scene, PointLayer,PolygonLayer } from "@antv/l7";
import { GaodeMap,Map } from "@antv/l7-maps";
import React, { useEffect } from 'react';
  
export default () => {
    useEffect( () => {
const scene = new Scene({
  id: "map",
  // renderer: 'device',
  map: new GaodeMap({
    style: "light",
    center: [120.099658370018, 30.263445807542666],
    zoom: 10
  })
});
scene.on("loaded", () => {

  const pointLayer = new PointLayer({
    autoFit: true
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
    .size(1000)
    .color("#ff0000")
    .active(true)
    // .animate({ enable: true })
    .style({
      opacity: 1,
      strokeWidth: 1,
      unit: 'meter',
    });
  setTimeout(() => {
    pointLayer.style({
      opacity: 0.5,
    })
    scene.render();

  }, 1000);
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