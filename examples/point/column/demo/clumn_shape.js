import { Scene } from '@l7/scene';
import { PointLayer } from '@l7/layers';
const scene = new Scene({
  id: 'map',
  pitch: 66.02383,
  type: 'amap',
  style: 'dark',
  center: [ 121.400257, 31.25287 ],
  zoom: 14.55,
  rotation: 134.9507
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
      .color('name', [ '#739DFF', '#61FCBF', '#FFDE74', '#FF896F' ])
      .style({
        opacity: 1.0
      });

    scene.addLayer(pointLayer);
  });
