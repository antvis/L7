import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    pitch: 20,
    style: 'light',
    center: [ 120, 20 ],
    zoom: 3
  })
});
scene.on('loaded', () => {
  fetch(
    'https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json'
  )
    .then(res => res.json())
    .then(data => {
      const pointLayer = new PointLayer({})
        .source(data)
        .shape('simple')
        .size(15)
        .color('mag', mag => {
          return mag > 4.5 ? '#5B8FF9' : '#5CCEA1';
        })
        .active(true)
        .style({
          opacity: 0.6,
          strokeWidth: 3
        });
      scene.addLayer(pointLayer);
    });
});
