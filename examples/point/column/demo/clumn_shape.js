import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    pitch: 66.02383,
    style: 'dark',
    center: [ 121.400257, 31.25287 ],
    zoom: 14.55,
    rotation: 134.95
  })
});
scene.on('loaded', () => {
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
        .animate(true)
        .active(true)
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
});
