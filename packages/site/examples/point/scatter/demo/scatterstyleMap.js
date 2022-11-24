import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [ 112, 30.267069 ],
    style: 'dark',
    zoom: 6
  })
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/bmw-prod/450b2d95-006c-4bad-8269-15729269e142.json')
    .then(res => res.json())
    .then(data => {
      const layer = new PointLayer()
        .source(data, {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat'
          }
        })
        .shape('circle')
        .color('color')
        .size('value', v => 5 + 15 * v)
        .style({
          stroke: 'strokeColor',
          strokeWidth: 'strokeWidth',
          strokeOpacity: [
            'strokeOpacity',
            d => {
              return d * 2;
            }
          ],

          opacity: 'opacity'
        })
        .active(true);
      scene.addLayer(layer);
    });

});
