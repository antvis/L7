import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'light',
    center: [ 120.19382669582967, 30.258134 ],
    zoom: 10
  })
});

const radius = 0.1;

function pointOnCircle(angle) {
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [
            120.19382669582967 + Math.cos(angle) * radius,
            30.258134 + Math.sin(angle) * radius
          ]
        }
      }
    ]
  };
}
const layer = new PointLayer({})
  .source(pointOnCircle(0))
  .shape('circle')
  .size(15) // default 1
  .active(false)
  .color('#2F54EB')
  .style({
    stroke: '#fff',
    strokeWidth: 2,
    opacity: 1
  });
scene.addLayer(layer);
layer.setData(pointOnCircle(1000));

function animateMarker(timestamp) {
  layer.setData(pointOnCircle(timestamp / 1000));
  scene.render();
  requestAnimationFrame(animateMarker);
}
animateMarker(0);
