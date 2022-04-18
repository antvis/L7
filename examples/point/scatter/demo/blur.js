import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [ 112, 30.267069 ],
    pitch: 0,
    style: 'dark',
    zoom: 3.8
  })
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/bmw-prod/450b2d95-006c-4bad-8269-15729269e142.json')
    .then(res => res.json())
    .then(data => {
      const layer = new PointLayer({ blend: 'additive' })
        .source(data, {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat'
          }
        })
        .shape('circle')
        .color('#f00')
        .size('value', v => 15 + 15 * v)
        .style({
          blur: 2.5,
          opacity: 'opacity'
        })
        .active(true);
      scene.addLayer(layer);
    });

});
