import { Scene } from '@antv/l7-scene';
import { PointLayer } from '@antv/l7-layers';
const scene = new Scene({
  id: 'map',
  pitch: 60,
  type: 'mapbox',
  style: 'light',
  center: [ 121.412224, 31.26192438 ],
  zoom: 13.13438,
  rotation: 35.97133
});
window.mapScene = scene;

fetch(
  'https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json'
)
  .then(res => res.json())
  .then(data => {
    const pointLayer = new PointLayer({})
      .source(data, {
        parser: {
          type: 'json',
          x: 'longitude',
          y: 'latitude'
        }
      })
      .shape('name', [
        'cylinder',
        'triangleColumn',
        'hexagonColumn',
        'squareColumn'
      ])
      .size('unit_price', h => {
        return [ 6, 6, h / 500 ];
      })
      .color('name', [ '#5B8FF9', '#70E3B5', '#FFD458', '#FF7C6A' ])
      .style({
        opacity: 1.0
      });

    scene.addLayer(pointLayer);
  });
